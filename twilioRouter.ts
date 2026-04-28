import { router, protectedProcedure, publicProcedure } from "./_core/trpc";
import { z } from "zod";
import twilio from "twilio";

// ─── NEW CALL SCRIPT ──────────────────────────────────────────────────────────
export const CALL_SCRIPT = `Hello, this is Sofia with CreateAIProfit — I'm a local investment specialist and I just closed two deals in your area. I noticed your property and wanted to reach out personally.

Have you ever considered cashing out at today's market prices? With current cap rates, you may be sitting on serious equity you haven't tapped yet.

I can walk you through the numbers — no pressure, no obligation. Would you have five minutes to chat about what your property is worth right now?

If now isn't a good time, I can send over a quick market report for your area. What's the best email to reach you?

Thank you so much for your time. Have a wonderful day.`;

// ─── STAFF BOT ROSTER (replaces Sarah 1-5) ───────────────────────────────────
export const DIALER_BOTS = [
  { id: "sofia-a",    name: "Sofia Alves",    role: "Latin Coastal Specialist",      voiceId: "L10lEremDiJfPicq5CPh", calls: 0, connects: 0, interested: 0, status: "Ready" },
  { id: "natalia-k",  name: "Natalia Kozlov", role: "Moscow Expat & East-West Bridge", voiceId: "GN4wbsbejSnGSa1AzjH5", calls: 0, connects: 0, interested: 0, status: "Ready" },
  { id: "elena-h",    name: "Elena Hart",     role: "LA Luxury Broker",              voiceId: "NkMe1eztMQReztnhYfeX", calls: 0, connects: 0, interested: 0, status: "Ready" },
  { id: "claire-d",   name: "Claire Dubois",  role: "Paris Premium Specialist",      voiceId: "onwK4e9ZLuTAKqWW03F9", calls: 0, connects: 0, interested: 0, status: "Ready" },
  { id: "isabella-r", name: "Isabella Reyes", role: "Latin Coastal Queen",           voiceId: "nVPCtAFzgyMX3FZKNzH0", calls: 0, connects: 0, interested: 0, status: "Ready" },
];

function getTwilioClient() {
  const sid   = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!sid || !token) throw new Error("Twilio credentials not configured. Add TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN.");
  return twilio(sid, token);
}

export const twilioRouter = router({
  // Return the current dialer bot roster
  getBots: protectedProcedure.query(() => DIALER_BOTS),

  // Return the current call script
  getScript: protectedProcedure.query(() => ({ script: CALL_SCRIPT })),

  // Place an outbound call via Twilio
  placeCall: protectedProcedure
    .input(z.object({
      toNumber: z.string().min(10, "Phone number required"),
      botId: z.string().optional(),
      script: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const client = getTwilioClient();
      const fromNumber = process.env.TWILIO_FROM_NUMBER;
      if (!fromNumber) throw new Error("TWILIO_FROM_NUMBER not configured.");

      const bot = DIALER_BOTS.find(b => b.id === input.botId) ?? DIALER_BOTS[0];
      const scriptText = input.script ?? CALL_SCRIPT;

      // Twilio TwiML — reads the script using Amazon Polly voice (Joanna = warm female)
      // When ElevenLabs is wired, swap this for a <Play> of the ElevenLabs audio URL
      const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna" language="en-US">${scriptText.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</Say>
</Response>`;

      const call = await client.calls.create({
        to: input.toNumber.startsWith("+") ? input.toNumber : `+1${input.toNumber.replace(/\D/g, "")}`,
        from: fromNumber,
        twiml,
      });

      return {
        success: true,
        callSid: call.sid,
        status: call.status,
        botName: bot.name,
        to: input.toNumber,
      };
    }),

  // Check call status
  callStatus: protectedProcedure
    .input(z.object({ callSid: z.string() }))
    .query(async ({ input }) => {
      const client = getTwilioClient();
      const call = await client.calls(input.callSid).fetch();
      return {
        sid: call.sid,
        status: call.status,
        duration: call.duration,
        direction: call.direction,
        to: call.to,
        from: call.from,
      };
    }),

  // Public TwiML webhook (Twilio calls this URL to get instructions)
  twimlWebhook: publicProcedure
    .input(z.object({ script: z.string().optional() }))
    .query(({ input }) => {
      const text = input.script ?? CALL_SCRIPT;
      return {
        twiml: `<?xml version="1.0" encoding="UTF-8"?><Response><Say voice="Polly.Joanna" language="en-US">${text}</Say></Response>`,
      };
    }),
});
