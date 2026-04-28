import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock fetch globally
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

function createCtx(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

describe("tts.preview", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.ELEVENLABS_API_KEY = "test-key";
  });

  it("returns base64 audio on success", async () => {
    const fakeAudio = Buffer.from("fake-audio-bytes");
    mockFetch.mockResolvedValueOnce({
      ok: true,
      arrayBuffer: async () => fakeAudio.buffer,
    });

    const caller = appRouter.createCaller(createCtx());
    const result = await caller.tts.preview({
      voiceId: "test-voice-id",
      text: "Hello, I am a test bot.",
    });

    expect(result.mimeType).toBe("audio/mpeg");
    expect(typeof result.audio).toBe("string");
    expect(result.audio.length).toBeGreaterThan(0);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("test-voice-id"),
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({ "xi-api-key": expect.any(String) }),
      })
    );
  });

  it("throws INTERNAL_SERVER_ERROR when ElevenLabs returns error", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      text: async () => "Unauthorized",
    });

    const caller = appRouter.createCaller(createCtx());
    await expect(
      caller.tts.preview({ voiceId: "bad-id", text: "test" })
    ).rejects.toThrow();
  });

  it("throws when API key is missing", async () => {
    delete process.env.ELEVENLABS_API_KEY;
    const caller = appRouter.createCaller(createCtx());
    await expect(
      caller.tts.preview({ voiceId: "some-id", text: "test" })
    ).rejects.toThrow();
  });
});
