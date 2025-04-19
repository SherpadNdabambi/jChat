import axios from "axios";
import { callAI } from "../assets/ts/index";

// Mock axios to simulate API calls in tests
jest.mock("axios");

// Mock @whiskeysockets/baileys to prevent real WebSocket connections during tests
jest.mock("@whiskeysockets/baileys", () => ({
  default: jest.fn(),
  useMultiFileAuthState: jest.fn(() =>
    Promise.resolve({ state: {}, saveCreds: jest.fn() })
  ),
  DisconnectReason: { loggedOut: 401 },
}));

describe("callAI", () => {
  it("calls Grok API with correct payload and key", async () => {
    // Mock response mimicking the API's structure
    const mockResponse = {
      data: { choices: [{ message: { content: "Hello from Grok!" } }] },
    };
    (axios.post as jest.Mock).mockResolvedValue(mockResponse);

    const result = await callAI("grok", "sk-12345", "hi");

    // Verify the API call uses the correct endpoint, payload, and headers
    expect(axios.post).toHaveBeenCalledWith(
      "https://api.x.ai/v1/chat/completions",
      expect.objectContaining({
        model: "grok-3-mini-beta",
        messages: [{ role: "user", content: "hi" }],
        temperature: 0,
      }),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer sk-12345",
          "Content-Type": "application/json",
        }),
      })
    );
    expect(result).toBe("Hello from Grok!");
  });

  it("throws error for invalid AI provider", async () => {
    // Test that callAI rejects invalid AI providers
    await expect(callAI("invalid", "sk-12345", "hi")).rejects.toThrow(
      "Invalid AI provider"
    );
  });
});
