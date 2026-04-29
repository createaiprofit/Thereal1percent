        postId: postComments.postId,
        userId: postComments.userId,
      })
      .from(postComments)
      .where(
        and(
          isNull(postComments.botId),
          not(isNull(postComments.userId)),
          gte(postComments.createdAt, oneHourAgo)
        )
      )
      .limit(50);

    for (const comment of recentUserComments) {
      const [bot] = await getRandomBots(db, 1);
      if (!bot) continue;
      const body = pick(REPLY_SCRIPTS);
      await db.insert(postComments).values({
        postId: comment.postId,
        botId: bot.id,
        body,
      });
      await db.update(posts).set({ commentCount: sql`commentCount + 1` }).where(eq(posts.id, comment.postId));
      await db.insert(botEngagementLog).values({
        botId: bot.id,
        actionType: "reply_to_comment",
        targetUserId: comment.userId ?? undefined,
        targetPostId: comment.postId,
        targetCommentId: comment.id,
        body,
      });
      actions++;
    }

    // 2. Like-back: find recent user likes on bot posts, drop a comment back
    const recentLikes = await db
      .select({
        userId: postLikes.userId,
        postId: postLikes.postId,
        botId: posts.botId,
      })
      .from(postLikes)
      .innerJoin(posts, eq(postLikes.postId, posts.id))
      .where(
        and(
          not(isNull(posts.botId)),
          gte(postLikes.createdAt, oneHourAgo)
        )
      )
      .limit(30);

    for (const like of recentLikes) {
      if (!like.botId) continue;
      const body = pick(LIKE_BACK_COMMENTS);
      await db.insert(postComments).values({
        postId: like.postId,
        botId: like.botId,
        body,
      });
      await db.update(posts).set({ commentCount: sql`commentCount + 1` }).where(eq(posts.id, like.postId));
      await db.insert(botEngagementLog).values({
        botId: like.botId,
        actionType: "like_back",
        targetUserId: like.userId,
        targetPostId: like.postId,
        body,
      });
      actions++;
    }

    // 3. Comment on recent real-user posts (proactive engagement)
    const recentUserPosts = await db
      .select({ id: posts.id, userId: posts.userId })
      .from(posts)
      .where(
        and(
          not(isNull(posts.userId)),
          isNull(posts.botId),
          eq(posts.hidden, false),
          gte(posts.createdAt, oneHourAgo)
        )
      )
      .limit(20);

    for (const post of recentUserPosts) {
      // 2-4 bots comment on each user post
      const botCount = 2 + Math.floor(Math.random() * 3);
      const bots = await getRandomBots(db, botCount);
      for (const bot of bots) {
        const body = pick(PROACTIVE_COMMENTS);
        await db.insert(postComments).values({
          postId: post.id,
          botId: bot.id,
          body,
        });
        await db.update(posts).set({ commentCount: sql`commentCount + 1` }).where(eq(posts.id, post.id));
        await db.insert(botEngagementLog).values({
          botId: bot.id,
          actionType: "comment_on_user",
          targetUserId: post.userId ?? undefined,
          targetPostId: post.id,
          body,
        });
        actions++;
      }
      // Also boost with likes from bots
      const likerBots = await getRandomBots(db, 5 + Math.floor(Math.random() * 10));
      for (const bot of likerBots) {
        // Insert a fake like from bot perspective (we track in engagement log, increment count)
        await db.update(posts).set({ likeCount: sql`likeCount + 1` }).where(eq(posts.id, post.id));
        await db.insert(botEngagementLog).values({
          botId: bot.id,
          actionType: "boost_post",
          targetUserId: post.userId ?? undefined,
          targetPostId: post.id,
        });
        actions++;
      }
    }

    // 4. Boost cold bot posts (posts with < 10 likes, older than 30 min)
    const thirtyMinAgo = new Date(now.getTime() - 30 * 60 * 1000);
    const coldPosts = await db
      .select({ id: posts.id, botId: posts.botId })
      .from(posts)
      .where(
        and(
          not(isNull(posts.botId)),
          eq(posts.hidden, false),
          lte(posts.createdAt, thirtyMinAgo),
          sql`likeCount < 10`
        )
      )
      .orderBy(sql`RAND()`)
      .limit(20);

    for (const post of coldPosts) {
      const boostCount = 5 + Math.floor(Math.random() * 15);
      await db.update(posts).set({ likeCount: sql`likeCount + ${boostCount}` }).where(eq(posts.id, post.id));
      if (post.botId) {
        await db.insert(botEngagementLog).values({
          botId: post.botId,
          actionType: "boost_post",
          targetPostId: post.id,
        });
      }
      actions++;
    }

    return { success: true, actions };
  }),

  // ─── RUN BOT POST JOB (publish queued posts) ─────────────────────────────
  runPostJob: adminProcedure.mutation(async () => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });

    const now = new Date();
    const due = await db.select().from(botPostQueue)
      .where(and(eq(botPostQueue.posted, false), lte(botPostQueue.scheduledAt, now)))
      .limit(50);

    let published = 0;
    for (const item of due) {
      await db.insert(posts).values({
        botId: item.botId,
        caption: item.caption,
        mediaUrl: item.mediaUrl ?? undefined,
        mediaType: item.mediaType,
      });
      await db.update(botPostQueue).set({ posted: true }).where(eq(botPostQueue.id, item.id));
      await db.update(botAccounts).set({ lastPostedAt: now }).where(eq(botAccounts.id, item.botId));
      published++;
    }

    // Seed new posts into queue for the next 24 hours if queue is running low
    const pendingCount = await db.select({ c: sql<number>`COUNT(*)` })
      .from(botPostQueue)
      .where(eq(botPostQueue.posted, false));
    const pending = pendingCount[0]?.c ?? 0;