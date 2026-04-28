import { useState } from "react";
import { useLocation } from "wouter";
import { ChevronLeft, BookOpen, Lock, Star, MessageCircle, Users } from "lucide-react";

const CAP_LOGO = "https://d2xsxph8kpxj0f.cloudfront.net/310519663435070666/UKZTwoEXuGkRzDU2B5gMpQ/cap_monogram-n2pUia97Hqn3kpJpZqwsMY.webp";

const BOOKS = [
  {
    id: 1,
    title: "The Prince",
    author: "Niccolò Machiavelli",
    cover: "📖",
    category: "Power",
    rating: 4.9,
    members: "2.1K",
    status: "active",
    quote: "It is better to be feared than loved, if you cannot be both.",
    description: "The original playbook. Power, strategy, and the art of control. This is where the system started.",
    discussions: 142,
    locked: false,
  },
  {
    id: 2,
    title: "48 Laws of Power",
    author: "Robert Greene",
    cover: "⚔️",
    category: "Power",
    rating: 4.8,
    members: "1.8K",
    status: "active",
    quote: "Never outshine the master.",
    description: "48 laws. Zero exceptions. The modern Machiavelli — required reading for anyone building an empire.",
    discussions: 98,
    locked: false,
  },
  {
    id: 3,
    title: "Rich Dad Poor Dad",
    author: "Robert Kiyosaki",
    cover: "💰",
    category: "Wealth",
    rating: 4.7,
    members: "3.2K",
    status: "active",
    quote: "The rich don't work for money. Money works for them.",
    description: "The book that woke up a generation. Assets vs liabilities. The system that creates passive income.",
    discussions: 211,
    locked: false,
  },
  {
    id: 4,
    title: "Think and Grow Rich",
    author: "Napoleon Hill",
    cover: "🧠",
    category: "Mindset",
    rating: 4.8,
    members: "2.7K",
    status: "active",
    quote: "Whatever the mind can conceive and believe, it can achieve.",
    description: "13 principles. One outcome. The blueprint for turning thought into fortune.",
    discussions: 187,
    locked: false,
  },
  {
    id: 5,
    title: "The Art of War",
    author: "Sun Tzu",
    cover: "🏯",
    category: "Strategy",
    rating: 4.9,
    members: "1.5K",
    status: "active",
    quote: "Supreme excellence consists in breaking the enemy's resistance without fighting.",
    description: "Ancient strategy. Modern application. Every business move is a battle — learn to win before you enter.",
    discussions: 76,
    locked: false,
  },
  {
    id: 6,
    title: "The Millionaire Fastlane",
    author: "MJ DeMarco",
    cover: "🚀",
    category: "Wealth",
    rating: 4.6,
    members: "1.1K",
    status: "active",
    quote: "Stop following the script. Write your own.",
    description: "Forget the 40-year plan. The fastlane is systems, leverage, and speed. This is the CAP philosophy in book form.",
    discussions: 63,
    locked: false,
  },
  {
    id: 7,
    title: "Mastery",
    author: "Robert Greene",
    cover: "🎯",
    category: "Power",
    rating: 4.7,
    members: "890",
    status: "coming_soon",
    quote: "The future belongs to those who learn more skills and combine them in creative ways.",
    description: "The path from apprentice to master. Deep work, pattern recognition, and the long game.",
    discussions: 0,
    locked: true,
  },
  {
    id: 8,
    title: "Zero to One",
    author: "Peter Thiel",
    cover: "🔮",
    category: "Business",
    rating: 4.8,
    members: "1.3K",
    status: "coming_soon",
    quote: "Every moment in business happens only once.",
    description: "Build something no one has built before. Monopoly thinking for the AI era.",
    discussions: 0,
    locked: true,
  },
  {
    id: 9,
    title: "The Intelligent Investor",
    author: "Benjamin Graham",
    cover: "📊",
    category: "Investing",
    rating: 4.7,
    members: "980",
    status: "coming_soon",
    quote: "The investor's chief problem — and even his worst enemy — is likely to be himself.",
    description: "The bible of value investing. Discipline, patience, and the long game.",
    discussions: 0,
    locked: true,
  },
  {
    id: 10,
    title: "Influence",
    author: "Robert Cialdini",
    cover: "🎭",
    category: "Psychology",
    rating: 4.6,
    members: "760",
    status: "coming_soon",
    quote: "The best persuaders become the best because they know how to make it easy for others to agree.",
    description: "The science of persuasion. Six principles that move people — and markets.",
    discussions: 0,
    locked: true,
  },
];

const CATEGORIES = ["All", "Power", "Wealth", "Mindset", "Strategy", "Business", "Investing", "Psychology"];

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Power:      { bg: "rgba(239,68,68,0.15)",   text: "#f87171",  border: "rgba(239,68,68,0.3)" },
  Wealth:     { bg: "rgba(250,204,21,0.15)",  text: "#facc15",  border: "rgba(250,204,21,0.3)" },
  Mindset:    { bg: "rgba(167,139,250,0.15)", text: "#a78bfa",  border: "rgba(167,139,250,0.3)" },
  Strategy:   { bg: "rgba(34,211,238,0.15)",  text: "#22d3ee",  border: "rgba(34,211,238,0.3)" },
  Business:   { bg: "rgba(74,222,128,0.15)",  text: "#4ade80",  border: "rgba(74,222,128,0.3)" },
  Investing:  { bg: "rgba(251,146,60,0.15)",  text: "#fb923c",  border: "rgba(251,146,60,0.3)" },
  Psychology: { bg: "rgba(244,114,182,0.15)", text: "#f472b6",  border: "rgba(244,114,182,0.3)" },
};

export default function BookClub() {
  const [, navigate] = useLocation();
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedBook, setSelectedBook] = useState<typeof BOOKS[0] | null>(null);

  const filtered = activeCategory === "All"
    ? BOOKS
    : BOOKS.filter(b => b.category === activeCategory);

  const activeBooks = filtered.filter(b => !b.locked);
  const lockedBooks = filtered.filter(b => b.locked);

  return (
    <div style={{ minHeight: "100dvh", background: "#000000", color: "#ffffff", fontFamily: "'Rajdhani', sans-serif" }}>

      {/* ── HEADER ── */}
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(0,0,0,0.92)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "0.75rem 1rem",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <button
          onClick={() => navigate("/social")}
          style={{ background: "none", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem" }}
        >
          <ChevronLeft size={18} /> Back
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <BookOpen size={18} style={{ color: "#facc15" }} />
          <span style={{ fontSize: "0.7rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#ffffff" }}>Book Club</span>
        </div>
        <img src={CAP_LOGO} alt="CAP" style={{ height: "28px", width: "28px", objectFit: "contain" }} />
      </div>

      {/* ── HERO ── */}
      <div style={{ padding: "2.5rem 1.25rem 1.5rem", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ fontSize: "0.6rem", letterSpacing: "0.5em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "0.75rem" }}>
          1% Playground · Members Only
        </div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 6vw, 3rem)", fontWeight: 300, color: "#ffffff", marginBottom: "0.75rem" }}>
          The Reading List.
        </h1>
        <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.4)", maxWidth: "400px", margin: "0 auto 1.5rem", lineHeight: 1.7 }}>
          Every empire starts with a book. Read what the 1% reads. Discuss it with people who actually apply it.
        </p>
        <div style={{ display: "flex", gap: "2rem", justifyContent: "center" }}>
          {[
            { label: "Books", value: BOOKS.length.toString() },
            { label: "Members Reading", value: "4.2K" },
            { label: "Discussions", value: "777" },
          ].map(stat => (
            <div key={stat.label} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", color: "#facc15", fontWeight: 600 }}>{stat.value}</div>
              <div style={{ fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CATEGORY FILTER ── */}
      <div style={{ padding: "1rem 1.25rem", overflowX: "auto", display: "flex", gap: "0.5rem", scrollbarWidth: "none" }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              flexShrink: 0,
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase",
              padding: "0.4rem 1rem", borderRadius: "20px", cursor: "pointer",
              border: `1px solid ${activeCategory === cat ? "rgba(250,204,21,0.5)" : "rgba(255,255,255,0.1)"}`,
              background: activeCategory === cat ? "rgba(250,204,21,0.1)" : "transparent",
              color: activeCategory === cat ? "#facc15" : "rgba(255,255,255,0.4)",
              transition: "all 0.2s",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── ACTIVE BOOKS ── */}
      <div style={{ padding: "0 1.25rem 2rem" }}>
        {activeBooks.length > 0 && (
          <>
            <div style={{ fontSize: "0.6rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "1rem" }}>
              Now Reading
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "rgba(255,255,255,0.04)", borderRadius: "8px", overflow: "hidden", marginBottom: "2rem" }}>
              {activeBooks.map(book => {
                const catColor = CATEGORY_COLORS[book.category] ?? { bg: "rgba(255,255,255,0.1)", text: "#fff", border: "rgba(255,255,255,0.2)" };
                return (
                  <div
                    key={book.id}
                    onClick={() => setSelectedBook(book)}
                    style={{
                      background: "#0a0a0a", padding: "1.25rem",
                      cursor: "pointer", transition: "background 0.2s",
                      display: "flex", gap: "1rem", alignItems: "flex-start",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "#0a0a0a")}
                  >
                    {/* Cover emoji */}
                    <div style={{
                      width: "52px", height: "68px", flexShrink: 0,
                      background: catColor.bg, border: `1px solid ${catColor.border}`,
                      borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "1.75rem",
                    }}>
                      {book.cover}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.5rem", marginBottom: "0.25rem" }}>
                        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", color: "#ffffff", lineHeight: 1.2 }}>
                          {book.title}
                        </div>
                        <span style={{
                          flexShrink: 0, fontSize: "0.55rem", letterSpacing: "0.15em", textTransform: "uppercase",
                          padding: "0.2rem 0.5rem", borderRadius: "3px",
                          background: catColor.bg, color: catColor.text, border: `1px solid ${catColor.border}`,
                        }}>
                          {book.category}
                        </span>
                      </div>
                      <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.35)", marginBottom: "0.5rem" }}>
                        {book.author}
                      </div>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.8rem", fontStyle: "italic", color: "rgba(255,255,255,0.45)", marginBottom: "0.75rem", lineHeight: 1.4 }}>
                        "{book.quote}"
                      </div>
                      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.65rem", color: "#facc15" }}>
                          <Star size={11} fill="#facc15" /> {book.rating}
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.65rem", color: "rgba(255,255,255,0.35)" }}>
                          <Users size={11} /> {book.members}
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.65rem", color: "rgba(255,255,255,0.35)" }}>
                          <MessageCircle size={11} /> {book.discussions} discussions
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ── COMING SOON (LOCKED) ── */}
        {lockedBooks.length > 0 && (
          <>
            <div style={{ fontSize: "0.6rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "1rem" }}>
              Coming Soon
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "rgba(255,255,255,0.03)", borderRadius: "8px", overflow: "hidden" }}>
              {lockedBooks.map(book => (
                <div
                  key={book.id}
                  style={{
                    background: "#050505", padding: "1rem 1.25rem",
                    display: "flex", gap: "1rem", alignItems: "center",
                    opacity: 0.5,
                  }}
                >
                  <div style={{
                    width: "44px", height: "56px", flexShrink: 0,
                    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1.5rem",
                  }}>
                    {book.cover}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", color: "rgba(255,255,255,0.5)", marginBottom: "0.2rem" }}>
                      {book.title}
                    </div>
                    <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.25)" }}>{book.author}</div>
                  </div>
                  <Lock size={14} style={{ color: "rgba(255,255,255,0.2)", flexShrink: 0 }} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── BOOK DETAIL MODAL ── */}
      {selectedBook && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 100,
            background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)",
            display: "flex", alignItems: "flex-end",
          }}
          onClick={() => setSelectedBook(null)}
        >
          <div
            style={{
              width: "100%", maxHeight: "85dvh", overflowY: "auto",
              background: "#0d0d0d", borderTop: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "16px 16px 0 0", padding: "1.5rem 1.25rem 3rem",
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Handle */}
            <div style={{ width: "36px", height: "3px", background: "rgba(255,255,255,0.2)", borderRadius: "2px", margin: "0 auto 1.5rem" }} />

            <div style={{ display: "flex", gap: "1rem", marginBottom: "1.25rem" }}>
              <div style={{
                width: "64px", height: "84px", flexShrink: 0,
                background: CATEGORY_COLORS[selectedBook.category]?.bg ?? "rgba(255,255,255,0.1)",
                border: `1px solid ${CATEGORY_COLORS[selectedBook.category]?.border ?? "rgba(255,255,255,0.2)"}`,
                borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "2rem",
              }}>
                {selectedBook.cover}
              </div>
              <div>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", fontWeight: 300, color: "#fff", marginBottom: "0.25rem" }}>
                  {selectedBook.title}
                </h2>
                <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", marginBottom: "0.5rem" }}>{selectedBook.author}</div>
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.7rem", color: "#facc15" }}>
                    <Star size={12} fill="#facc15" /> {selectedBook.rating}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.7rem", color: "rgba(255,255,255,0.35)" }}>
                    <Users size={12} /> {selectedBook.members} reading
                  </span>
                </div>
              </div>
            </div>

            <blockquote style={{
              fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem",
              fontStyle: "italic", color: "rgba(255,255,255,0.7)",
              borderLeft: "2px solid rgba(250,204,21,0.4)", paddingLeft: "1rem",
              marginBottom: "1.25rem", lineHeight: 1.6,
            }}>
              "{selectedBook.quote}"
            </blockquote>

            <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.8, marginBottom: "1.5rem" }}>
              {selectedBook.description}
            </p>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                onClick={() => { setSelectedBook(null); }}
                style={{
                  flex: 1, padding: "0.85rem",
                  background: "#ffffff", color: "#000000",
                  border: "none", cursor: "pointer",
                  fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem",
                  letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700,
                  borderRadius: "4px", transition: "opacity 0.2s",
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
              >
                <MessageCircle size={14} style={{ display: "inline", marginRight: "0.4rem" }} />
                Join Discussion ({selectedBook.discussions})
              </button>
              <button
                onClick={() => setSelectedBook(null)}
                style={{
                  padding: "0.85rem 1.25rem",
                  background: "transparent", color: "rgba(255,255,255,0.4)",
                  border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer",
                  fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem",
                  borderRadius: "4px",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
