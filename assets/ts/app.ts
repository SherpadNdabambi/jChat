import { connectToWhatsApp } from "./index";

connectToWhatsApp().catch((err) =>
  console.error("jChat failed to connect:", err)
);
