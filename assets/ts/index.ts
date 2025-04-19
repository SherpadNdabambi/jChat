import { AIConfig, Config, User, Users } from "./types";
import axios from "axios";
import { Boom } from "@hapi/boom";
import { createHash } from "crypto";
import {
  default as makeWASocket,
  DisconnectReason,
  useMultiFileAuthState,
} from "@whiskeysockets/baileys";
import { promises as fs } from "fs";
import { join } from "path";

// Resolve absolute paths for config.json and users.json
const projectRoot = process.cwd();
const configPath = join(projectRoot, "config.json");
const usersPath = join(projectRoot, "users.json");

// Load config.json at startup
let config: Config;
(async () => {
  try {
    const data = await fs.readFile(configPath, "utf8");
    config = JSON.parse(data) as Config;
  } catch (err) {
    console.error("Failed to load config.json:", err);
    process.exit(1);
  }
})();

// Store user sessions (AI provider and hashed API key) in memory
const users: Users = {};

// Track API key submission attempts for rate limiting
const keySubmissions: { [key: string]: number } = {};

// Call an AI provider (Grok or ChatGPT) with the user's API key and prompt
export async function callAI(
  ai: string,
  key: string,
  prompt: string
): Promise<string> {
  const aiConfig: AIConfig = config.ais[ai as "grok" | "chatgpt"];

  if (!aiConfig) throw new Error("Invalid AI provider");

  try {
    // Construct payload with prompt in messages array
    const payload = {
      ...aiConfig.payload,
      messages: [{ role: "user", content: prompt }],
    };
    // Make API request to the AI provider
    const response = await axios.post(aiConfig.endpoint, payload, {
      headers: { ...aiConfig.headers, Authorization: `Bearer ${key}` },
    });
    // Extract and return the AI's response
    return response.data.choices[0].message.content;
  } catch (error) {
    // Handle axios errors with specificity
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.error?.message ||
        error.response?.data?.message ||
        error.message;
      const errorCode =
        error.response?.data?.error?.code ||
        error.response?.data?.code ||
        "unknown_error";
      const statusCode = error.response?.status || "unknown";
      throw new Error(
        `API request failed: ${errorMessage} (code: ${errorCode}, status: ${statusCode})`
      );
    }
    throw error; // Rethrow non-axios errors
  }
}

// Establish and manage the WhatsApp connection using Baileys
async function connectToWhatsApp() {
  await loadUsers();

  const { state, saveCreds } = await useMultiFileAuthState("./auth_info");
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
    browser: ["jChat", "Chrome", "4.0.0"],
  });

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "close") {
      const error = lastDisconnect?.error as Boom | undefined;
      const shouldReconnect =
        error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log(
        "jChat connection closed:",
        lastDisconnect?.error,
        ", reconnecting:",
        shouldReconnect
      );
      if (shouldReconnect) {
        setTimeout(() => connectToWhatsApp(), 5000);
      }
    } else if (connection === "open") {
      console.log("jChat connected to WhatsApp");
    }
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0];

    if (!msg.message || msg.key.fromMe) return;
    const sender: string = msg.key.remoteJid!;
    const text: string =
      msg.message.conversation || msg.message.extendedTextMessage?.text || "";
    let user: User = users[sender] || { ai: null, key: null };
    try {
      console.log(`Received from ${sender}: ${text}`);
      if (text.toLowerCase() === "hi") {
        await sock.sendMessage(sender, {
          text: 'Greetings, stargazer! I’m jChat, your AI portal. Send "!grok <xAI-key>" or "!chatgpt <OpenAI-key>" to start. Get keys from x.ai/api or openai.com. Use a dedicated key and revoke if shared!',
        });
        return;
      }

      if (text.startsWith("!grok ") || text.startsWith("!chatgpt ")) {
        const now = Date.now();
        keySubmissions[sender] = keySubmissions[sender] || 0;
        if (
          keySubmissions[sender] > 3 &&
          now - keySubmissions[sender] < 3600000
        ) {
          await sock.sendMessage(sender, {
            text: "Too many key attempts! Try again in an hour.",
          });
          return;
        }
        const [command, key] = text.split(" ", 2);
        const ai = command.slice(1) as "grok" | "chatgpt";
        if (!config.ais[ai]) {
          await sock.sendMessage(sender, {
            text: `Unknown AI: ${ai}. Try !grok or !chatgpt.`,
          });
          return;
        }
        try {
          await callAI(ai, key, "hi");
          user.ai = ai;
          user.key = hashKey(key);
          users[sender] = user;
          await saveUsers();
          keySubmissions[sender] = 0;
          await sock.sendMessage(sender, {
            text: `Logged in with ${ai}! Ask away.`,
          });
        } catch (error) {
          keySubmissions[sender]++;
          const errMessage =
            error instanceof Error ? error.message : String(error);
          console.error(`Error validating API key for ${ai}:`, errMessage);

          if (errMessage.includes("invalid_api_key")) {
            await sock.sendMessage(sender, {
              text: "Invalid API key. Please check your key and try again.",
            });
          } else if (
            errMessage.includes("status: 403") ||
            errMessage.includes("doesn't have any credits") ||
            errMessage.includes("insufficient_credits")
          ) {
            await sock.sendMessage(sender, {
              text: `Insufficient credits on your ${
                ai === "grok" ? "xAI" : "OpenAI"
              } account. Please add credits at ${
                ai === "grok" ? "console.x.ai" : "platform.openai.com"
              } and try again.`,
            });
          } else if (
            errMessage.includes("status: 429") ||
            errMessage.includes("insufficient_quota") ||
            errMessage.includes("exceeded your current quota")
          ) {
            await sock.sendMessage(sender, {
              text: `Quota exceeded on your ${
                ai === "grok" ? "xAI" : "OpenAI"
              } account. Please check your plan and billing details at ${
                ai === "grok" ? "console.x.ai" : "platform.openai.com"
              } and try again.`,
            });
          } else if (errMessage.includes("network")) {
            await sock.sendMessage(sender, {
              text: "Network error while validating API key. Please check your connection and try again.",
            });
          } else {
            await sock.sendMessage(sender, {
              text: `Failed to validate API key: ${errMessage}. Please try again.`,
            });
          }
        }
        return;
      }

      if (!user.ai || !user.key) {
        await sock.sendMessage(sender, {
          text: 'Please set your API key (e.g., "!grok <key>").',
        });
        return;
      }

      const aiReply = await callAI(user.ai, text, text);
      await sock.sendMessage(sender, { text: aiReply });
    } catch (error) {
      const errMessage = error instanceof Error ? error.message : String(error);
      console.error("Error processing message:", errMessage);

      if (
        errMessage.includes("status: 403") ||
        errMessage.includes("doesn't have any credits") ||
        errMessage.includes("insufficient_credits")
      ) {
        await sock.sendMessage(sender, {
          text: `Insufficient credits on your ${
            user.ai === "grok" ? "xAI" : "OpenAI"
          } account. Please add credits at ${
            user.ai === "grok" ? "console.x.ai" : "platform.openai.com"
          } and try again.`,
        });
      } else if (
        errMessage.includes("status: 429") ||
        errMessage.includes("insufficient_quota") ||
        errMessage.includes("exceeded your current quota")
      ) {
        await sock.sendMessage(sender, {
          text: `Quota exceeded on your ${
            user.ai === "grok" ? "xAI" : "OpenAI"
          } account. Please check your plan and billing details at ${
            user.ai === "grok" ? "console.x.ai" : "platform.openai.com"
          } and try again.`,
        });
      } else if (errMessage.includes("network")) {
        await sock.sendMessage(sender, {
          text: "Network error while contacting the AI. Please check your connection and try again.",
        });
      } else {
        await sock.sendMessage(sender, {
          text: `Oops, something went wrong: ${errMessage}. Try again.`,
        });
      }
    }
  });
}

function hashKey(key: string): string {
  return createHash("sha256").update(key).digest("hex");
}

async function loadUsers() {
  try {
    const data = await fs.readFile(usersPath, "utf8");
    Object.assign(users, JSON.parse(data));
  } catch {
    console.log("No users.json, starting fresh");
  }
}

async function saveUsers() {
  await fs.writeFile(usersPath, JSON.stringify(users, null, 2));
}

export { connectToWhatsApp };
