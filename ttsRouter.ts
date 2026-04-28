import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const TTS_URL = "https://api.elevenlabs.io/v1/text-to-speech";

export const ttsRouter = router({
  preview: publicProcedure
    .input(z.object({
      voiceId: z.string().min(1),
      text: z.string().min(1).max(500),
    }))
    .mutation(async ({ input }) => {
      if (!ELEVENLABS_API_KEY) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "ElevenLabs API key not configured" });
      }

      const res = await fetch(`${TTS_URL}/${input.voiceId}`, {
        method: "POST",
        headers: {
          "xi-api-key": ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
          "Accept": "audio/mpeg",
        },
        body: JSON.stringify({
          text: input.text,
          model_id: "eleven_multilingual_v2",
          voice_settings: { stability: 0.5, similarity_boost: 0.75 },
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: `ElevenLabs error: ${err}` });
      }

      const arrayBuffer = await res.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString("base64");
      return { audio: base64, mimeType: "audio/mpeg" };
    }),
});
