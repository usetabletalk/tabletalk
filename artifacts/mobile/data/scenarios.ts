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
  {
    id: "catered-event",
    title: "Catered Event (Meeting or Wedding)",
    description: "Navigate a buffet where you don't control the menu.",
    estimatedMinutes: 5,
    firstStepId: "start",
    steps: {
      start: {
        id: "start",
        speaker: "other",
        text: "Event coordinator: 'Welcome! We have a full buffet set up. A few dishes are marked with a green flag for gluten-free guests.'",
        options: [
          {
            id: "opt_ask_prep",
            text: "Thank you! I have celiac disease — can you tell me more about how those dishes were prepared?",
            nextStepId: "tip_good_start",
          },
          {
            id: "opt_just_find",
            text: "Oh great, I'll just find those ones!",
            nextStepId: "tip_flag_warning",
          },
        ],
      },
      tip_good_start: {
        id: "tip_good_start",
        speaker: "app",
        text: "Excellent instinct. A 'gluten-free' label only tells you the ingredients — not whether it was prepared safely. Asking about preparation is the right next step.",
        options: [{ id: "cont", text: "Continue", nextStepId: "coord_reply_prep" }],
      },
      coord_reply_prep: {
        id: "coord_reply_prep",
        speaker: "other",
        text: "Coordinator: 'They were made in the same kitchen as everything else, but the chef put them on separate plates before service.'",
        options: [
          {
            id: "ask_utensils",
            text: "I appreciate that. With celiac, I also need to ask — are the serving utensils shared between the regular and gluten-free dishes?",
            nextStepId: "coord_utensil_reply",
          },
          {
            id: "accept_risk",
            text: "Okay, separate plates sounds fine. I'll give those a try.",
            nextStepId: "tip_utensil_risk",
          },
        ],
      },
      tip_utensil_risk: {
        id: "tip_utensil_risk",
        speaker: "app",
        text: "Separate plates are a good sign, but shared serving spoons are a very common source of cross-contact at buffets. Worth asking before eating.",
        options: [{ id: "retry", text: "Try asking about utensils", nextStepId: "coord_reply_prep" }],
      },
      coord_utensil_reply: {
        id: "coord_utensil_reply",
        speaker: "other",
        text: "Coordinator: 'Hmm, I think the servers were using the same spoons for everything. I'm not sure.'",
        options: [
          {
            id: "ask_chef",
            text: "Would it be possible to ask the chef to plate a fresh portion from the kitchen using clean utensils? I don't want to be difficult, but it really does affect my health.",
            nextStepId: "coord_chef_check",
          },
          {
            id: "eat_own_food",
            text: "In that case, I'll play it safe and eat the food I brought. Thank you so much for checking!",
            nextStepId: "end_own_food",
          },
        ],
      },
      coord_chef_check: {
        id: "coord_chef_check",
        speaker: "other",
        text: "Coordinator: 'Of course — let me check. [returns] The chef says absolutely, and they'll bring it out to you directly on a clean plate.'",
        options: [
          {
            id: "thank_you",
            text: "That means so much, thank you for going out of your way. Please pass along my thanks to the chef!",
            nextStepId: "end_chef_success",
          },
        ],
      },
      end_chef_success: {
        id: "end_chef_success",
        speaker: "app",
        text: "Wonderful! You were polite, specific, and persistent — and it paid off. Asking event staff to involve the chef directly is often the safest path at catered events.",
        isEnd: true,
      },
      end_own_food: {
        id: "end_own_food",
        speaker: "app",
        text: "A completely valid choice. Eating food you prepared yourself is always the safest option at any event. You handled the situation with grace — no apology needed.",
        isEnd: true,
      },
      tip_flag_warning: {
        id: "tip_flag_warning",
        speaker: "app",
        text: "Green flags are helpful, but they usually only mean the recipe is gluten-free — not that it was prepared safely. Shared utensils and cross-contact at buffets are very common.",
        options: [{ id: "cont", text: "Continue", nextStepId: "at_buffet" }],
      },
      at_buffet: {
        id: "at_buffet",
        speaker: "other",
        text: "You walk over to the buffet. The flagged dishes look good, but you notice a server using the same tongs for multiple dishes.",
        options: [
          {
            id: "ask_server",
            text: "Excuse me — I have celiac disease. Are those tongs being used for the gluten-free dishes too?",
            nextStepId: "server_confirms_shared",
          },
          {
            id: "ignore_tongs",
            text: "It's probably fine. I'll just grab some of the flagged items.",
            nextStepId: "tip_tongs_risk",
          },
        ],
      },
      server_confirms_shared: {
        id: "server_confirms_shared",
        speaker: "other",
        text: "Server: 'Oh — yeah, we've been using these for everything. Sorry, I didn't realize.'",
        options: [
          {
            id: "ask_coord_again",
            text: "No worries at all — thank you for being honest. Could you point me to whoever's in charge so I can ask about a safely prepared plate?",
            nextStepId: "coord_chef_check",
          },
          {
            id: "safe_choice",
            text: "I appreciate you telling me. I'll stick with the sealed items or food I brought.",
            nextStepId: "end_own_food",
          },
        ],
      },
      tip_tongs_risk: {
        id: "tip_tongs_risk",
        speaker: "app",
        text: "Shared tongs are one of the most common causes of accidental gluten exposure at buffets — even a small amount of bread crumbs can cause a reaction. Better to ask before eating.",
        options: [{ id: "retry", text: "Go back and ask", nextStepId: "at_buffet" }],
      },
    },
  },
];
