import { Config } from "./assets/ts/types";

// Mock config object
const mockConfig: Config = {
  ais: {
    grok: {
      endpoint: "https://api.x.ai/v1/chat/completions",
      payload: {
        model: "grok-3-mini-beta",
        messages: [],
        temperature: 0,
      },
      headers: {
        "Content-Type": "application/json",
      },
    },
    chatgpt: {
      endpoint: "https://api.openai.com/v1/chat/completions",
      payload: {
        model: "omni-moderation-latest",
        messages: [],
        temperature: 0,
      },
      headers: {
        "Content-Type": "application/json",
      },
    },
  },
};

// Mock fs.readFile to return mockConfig
jest.mock("fs", () => ({
  promises: {
    readFile: jest.fn().mockImplementation((path, encoding) => {
      if (path.endsWith("config.json")) {
        return Promise.resolve(JSON.stringify(mockConfig));
      }
      return Promise.reject(new Error("File not found"));
    }),
    writeFile: jest.fn().mockResolvedValue(undefined),
  },
}));
