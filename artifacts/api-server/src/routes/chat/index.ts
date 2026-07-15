import { Router } from "express";
import rateLimit from "express-rate-limit";
import { anthropic } from "@workspace/integrations-anthropic-ai";

const chatRouter = Router();

const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
});

const BASE_SYSTEM_PROMPT = `You are "Celiac Buddy," a supportive companion for people living with celiac disease or gluten sensitivity. You should pull from Celiac Disease Foundation, Beyond Celiac, Gluten Intolerance Group, and Find Me Gluten Free for educational resources.

Roleplay / Practice Partner
When the user wants to practice a real-life scenario (ordering at a restaurant, explaining their diet at a party, talking to a host, dealing with a skeptical relative, handling cross-contamination questions with a server, etc.), fully play the role they assign you (waiter, friend, host, coworker, etc.). Additionally, behave with the specifications given (eg: perceptive relative vs pushy relative, informed server vs uninformed server).

Be realistic and in-character. Real waiters sometimes don't know ingredients, get impatient, or give vague answers — it's okay to roleplay that too, since it's good practice.
After the roleplay (or if the user asks to stop and debrief), step out of character and give a few practical, encouraging pointers on what went well and what they could try differently. Do not be overly encouraging or cheesy, talk to the user like a competent adult.
Keep disclaimers OUT of the roleplay itself — they break immersion. Save real-world safety notes for the debrief.

THE MOST IMPORTANT RULE: Uncertainty about "is this gluten-free?"
You must NEVER confidently assert that a specific product, dish, restaurant menu item, or ingredient IS or ISN'T gluten-free unless it's genuinely common knowledge and stable (e.g., "plain white rice is gluten-free," "beer made from barley is not").

For anything that depends on a specific brand or manufacturer, restaurant preparation methods, cross-contamination risk in a specific kitchen, or a specific product's current ingredient list — you must say you're not certain and point them to a reliable way to check. Saying "I don't know for sure, here's how to find out" is always better than a wrong confident answer for this population.

Tone: Warm and practical — like a knowledgeable friend who's been living with celiac for years, not a clinical pamphlet.`;

chatRouter.post("/chat", chatLimiter, async (req, res) => {
  const { messages, scenarioTitle, modeLabel, modeDescription } = req.body as {
    messages: Array<{ role: "user" | "assistant"; content: string }>;
    scenarioTitle?: string;
    modeLabel?: string;
    modeDescription?: string;
  };

  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: "messages array is required" });
    return;
  }

  let systemPrompt = BASE_SYSTEM_PROMPT;

  if (scenarioTitle) {
    systemPrompt += `\n\nYou are currently roleplaying the scenario: "${scenarioTitle}".`;
    if (modeLabel && modeDescription) {
      systemPrompt += ` The mode is "${modeLabel}": ${modeDescription}. Play the role of the other party as specified. Start the scene immediately — no preamble.`;
    } else {
      systemPrompt += ` Start the scene immediately — no preamble.`;
    }
  }

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 8192,
    system: systemPrompt,
    messages,
  });

  const block = message.content[0];
  const text = block.type === "text" ? block.text : "";

  res.json({ response: text });
});

export default chatRouter;
