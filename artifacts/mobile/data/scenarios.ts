export type ScenarioStep = {
  id: string;
  speaker: "other" | "user" | "app";
  text: string;
  options?: {
    id: string;
    text: string;
    nextStepId: string;
  }[];
  isEnd?: boolean;
};

export type Scenario = {
  id: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  steps: Record<string, ScenarioStep>;
  firstStepId: string;
};

export const SCENARIOS: Scenario[] = [
  {
    id: "restaurant-ordering",
    title: "Ordering at a Restaurant",
    description: "Practice talking to a server about cross-contamination.",
    estimatedMinutes: 3,
    firstStepId: "start",
    steps: {
      start: {
        id: "start",
        speaker: "other",
        text: "Hi there! Welcome. Are you ready to order, or do you need a few more minutes?",
        options: [
          {
            id: "opt1",
            text: "I'm ready, but I have celiac disease. Do you have a gluten-free menu?",
            nextStepId: "server_reply_1",
          },
          {
            id: "opt2",
            text: "Yes, I'll have the salad. Is it gluten-free?",
            nextStepId: "server_reply_2",
          },
        ],
      },
      server_reply_1: {
        id: "server_reply_1",
        speaker: "app",
        text: "Great start! Stating clearly that you have celiac disease sets the tone. Let's see how the server responds.",
        options: [
          {
            id: "continue",
            text: "Continue",
            nextStepId: "server_reply_1_actual",
          },
        ],
      },
      server_reply_1_actual: {
        id: "server_reply_1_actual",
        speaker: "other",
        text: "We don't have a separate menu, but I can tell you which items are gluten-free. We have a gluten-free bun for burgers, and our salads are safe if you leave off the croutons.",
        options: [
          {
            id: "ask_cross_contact",
            text: "Thank you. Since I have celiac, I also need to ask about cross-contamination. Are the burgers cooked on the same grill as the regular buns?",
            nextStepId: "server_reply_1a",
          },
          {
            id: "accept_salad",
            text: "Okay, I'll just have the salad without croutons.",
            nextStepId: "server_reply_1b",
          },
        ],
      },
      server_reply_1a: {
        id: "server_reply_1a",
        speaker: "app",
        text: "Excellent! Asking about cross-contamination is the most important step. Many restaurants don't realize shared grills are a problem.",
        options: [
          {
            id: "continue",
            text: "Continue",
            nextStepId: "server_reply_1a_actual",
          },
        ],
      },
      server_reply_1a_actual: {
        id: "server_reply_1a_actual",
        speaker: "other",
        text: "Oh, let me check with the kitchen... Yes, the buns are toasted on the same grill, but we can pan-fry your burger separately if you'd like.",
        options: [
          {
            id: "accept",
            text: "Yes, pan-frying separately would be perfect. Thank you so much for checking!",
            nextStepId: "end_success",
          },
        ],
      },
      server_reply_1b: {
        id: "server_reply_1b",
        speaker: "app",
        text: "That's a safe choice, but remember you can always ask more questions if you really wanted the burger! For the salad, it's still good to confirm how it's prepared.",
        options: [
          {
            id: "continue",
            text: "Continue",
            nextStepId: "server_reply_1b_actual",
          },
        ],
      },
      server_reply_1b_actual: {
        id: "server_reply_1b_actual",
        speaker: "other",
        text: "Great, one salad, no croutons. I'll put that right in.",
        options: [
          {
            id: "confirm_salad",
            text: "Could you also ask the kitchen to change their gloves and use a clean bowl to mix it? I'm highly sensitive.",
            nextStepId: "end_success_salad",
          },
        ],
      },
      server_reply_2: {
        id: "server_reply_2",
        speaker: "app",
        text: "Asking if a specific item is gluten-free is good, but it's often safer to mention celiac disease explicitly so they know it's a medical need, not a preference.",
        options: [
          {
            id: "continue",
            text: "Continue",
            nextStepId: "server_reply_2_actual",
          },
        ],
      },
      server_reply_2_actual: {
        id: "server_reply_2_actual",
        speaker: "other",
        text: "Yes, the salad is gluten-free as long as we take the croutons off.",
        options: [
          {
            id: "clarify_celiac",
            text: "Okay, I actually have celiac disease, so even crumbs can make me sick. Can the kitchen use a clean bowl and fresh gloves to prepare it?",
            nextStepId: "end_success_salad",
          },
        ],
      },
      end_success: {
        id: "end_success",
        speaker: "app",
        text: "You did it! You clearly stated your needs, asked the right questions about cross-contact, and found a safe meal. It takes practice, but you handled it beautifully.",
        isEnd: true,
      },
      end_success_salad: {
        id: "end_success_salad",
        speaker: "app",
        text: "Great job speaking up! Asking for glove changes and clean prep areas is completely reasonable and the best way to stay safe with salads.",
        isEnd: true,
      },
    },
  },
  {
    id: "family-cookout",
    title: "Navigating a Family Cookout",
    description: "Talk to a relative who doesn't quite understand the rules.",
    estimatedMinutes: 4,
    firstStepId: "start",
    steps: {
      start: {
        id: "start",
        speaker: "other",
        text: "Uncle Bob: 'Hey there! Grab a plate. I made my famous BBQ chicken. It's totally gluten-free, no bread anywhere near it!'",
        options: [
          {
            id: "opt1",
            text: "That looks great Uncle Bob, what's in the BBQ sauce?",
            nextStepId: "bob_reply_1",
          },
          {
            id: "opt2",
            text: "I actually brought my own food just to be safe, but thank you!",
            nextStepId: "bob_reply_2",
          },
        ],
      },
      bob_reply_1: {
        id: "bob_reply_1",
        speaker: "app",
        text: "Checking the sauce is a smart move! BBQ sauces often hide ingredients like soy sauce or malt flavoring.",
        options: [
          { id: "cont", text: "Continue", nextStepId: "bob_reply_1_actual" },
        ],
      },
      bob_reply_1_actual: {
        id: "bob_reply_1_actual",
        speaker: "other",
        text: "Uncle Bob: 'Oh, just the usual. Ketchup, brown sugar, a little soy sauce for umami, some spices.'",
        options: [
          {
            id: "explain_soy",
            text: "Ah, unfortunately regular soy sauce has wheat in it, so I can't have it. But I really appreciate you making it!",
            nextStepId: "end_sauce",
          },
        ],
      },
      end_sauce: {
        id: "end_sauce",
        speaker: "app",
        text: "Perfect. You were polite but firm. It's totally okay to decline food when you know an ingredient isn't safe.",
        isEnd: true,
      },
      bob_reply_2: {
        id: "bob_reply_2",
        speaker: "app",
        text: "Bringing your own food to gatherings is one of the best ways to reduce anxiety. It guarantees you have something safe to eat.",
        options: [
          { id: "cont", text: "Continue", nextStepId: "bob_reply_2_actual" },
        ],
      },
      bob_reply_2_actual: {
        id: "bob_reply_2_actual",
        speaker: "other",
        text: "Uncle Bob: 'Oh come on, one little bite won't hurt you! I worked hard on this.'",
        options: [
          {
            id: "firm_decline",
            text: "I know you did, and it smells amazing! But even a crumb makes me really sick for days. I'm just going to eat what I brought, but I'm so happy to be here with everyone.",
            nextStepId: "end_brought_food",
          },
          {
            id: "soft_decline",
            text: "Maybe just a tiny piece of the inside meat...",
            nextStepId: "bob_reply_3",
          },
        ],
      },
      bob_reply_3: {
        id: "bob_reply_3",
        speaker: "app",
        text: "It's so hard when people push, but remember: your health is more important than their temporary disappointment. Cross-contamination from the sauce or grill will make you sick.",
        options: [
          { id: "try_again", text: "Let's try that again", nextStepId: "bob_reply_2_actual" },
        ],
      },
      end_brought_food: {
        id: "end_brought_food",
        speaker: "app",
        text: "Beautifully handled. You validated his effort while holding your boundary firmly. This gets easier every time you do it!",
        isEnd: true,
      },
    },
  },
];
