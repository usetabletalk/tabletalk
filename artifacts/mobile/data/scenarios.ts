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
            id: "ask_separate_surface",
            text: "For celiac I need everything cooked on a completely separate surface with clean utensils — is that something the kitchen can do?",
            nextStepId: "server_cc_wrong",
          },
          {
            id: "accept_salad",
            text: "Okay, I'll just have the salad without croutons.",
            nextStepId: "server_reply_1b",
          },
        ],
      },
      server_cc_wrong: {
        id: "server_cc_wrong",
        speaker: "other",
        text: "Server: 'Oh, definitely! We wipe the grill down really well between orders, and it gets super hot anyway — that basically sterilizes it. You'll be totally fine!'",
        options: [
          {
            id: "educate_gently",
            text: "I appreciate that you're trying to help! But actually, heat doesn't destroy gluten, and wiping doesn't fully remove it for someone with celiac. Could we use a completely separate pan that's never touched bread or flour?",
            nextStepId: "server_reconsiders",
          },
          {
            id: "ask_manager_cc",
            text: "I understand you're doing your best, but for celiac disease that level of contact can cause a real reaction. Could I speak with the manager or chef directly?",
            nextStepId: "manager_to_rescue",
          },
        ],
      },
      server_reconsiders: {
        id: "server_reconsiders",
        speaker: "other",
        text: "Server: 'Oh wow — I really didn't know that. I'm going to be honest, I'm not sure what we can guarantee. Let me go ask the chef.'",
        options: [
          {
            id: "wait_for_answer",
            text: "Thank you so much for being honest and going to check — that means a lot.",
            nextStepId: "chef_finds_solution",
          },
        ],
      },
      chef_finds_solution: {
        id: "chef_finds_solution",
        speaker: "other",
        text: "Server: '[returns] Good news — the chef says they have a dedicated pan that's only used for allergen-sensitive orders. They'll personally handle yours.'",
        options: [
          {
            id: "gratefully_accept",
            text: "That's perfect — please tell the chef I'm really grateful. I'll have the burger!",
            nextStepId: "end_educated_server",
          },
        ],
      },
      end_educated_server: {
        id: "end_educated_server",
        speaker: "app",
        text: "Really well done. You corrected a common misunderstanding without frustration, and still got a safe meal. Staff often repeat what they've been told — sometimes you're the first person to explain why it isn't enough.",
        isEnd: true,
      },
      manager_to_rescue: {
        id: "manager_to_rescue",
        speaker: "other",
        text: "Manager: 'I'm so sorry — our server was doing their best, but you're absolutely right that heat and wiping aren't enough for celiac. We have a dedicated allergen pan in the back. I'll personally oversee your order.'",
        options: [
          {
            id: "thank_manager",
            text: "Thank you so much — I really appreciate you knowing the details. The dedicated pan is exactly what I need.",
            nextStepId: "end_manager_success",
          },
        ],
      },
      end_manager_success: {
        id: "end_manager_success",
        speaker: "app",
        text: "Asking for a manager when a server doesn't know the answer is completely valid — not rude at all. You advocated for yourself calmly and clearly, and it worked.",
        isEnd: true,
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
            nextStepId: "bob_dismisses_soy",
          },
        ],
      },
      bob_dismisses_soy: {
        id: "bob_dismisses_soy",
        speaker: "other",
        text: "Uncle Bob: 'Oh come on, it's a teeny tiny amount of soy sauce. You can't tell me that's actually going to make a difference.'",
        options: [
          {
            id: "explain_medical",
            text: "It really does — celiac is an autoimmune disease. Even a tiny amount triggers my immune system to attack my own intestines. It's not about how it tastes or feels right now; it causes real damage.",
            nextStepId: "bob_still_dismisses",
          },
          {
            id: "deflect_kindly",
            text: "I know it seems strange, but my doctor has been very clear. I don't want this to put a damper on the day — I'm just so happy to be here with everyone!",
            nextStepId: "end_sauce_kind",
          },
        ],
      },
      bob_still_dismisses: {
        id: "bob_still_dismisses",
        speaker: "other",
        text: "Uncle Bob: 'I just think people are too sensitive these days. You used to eat everything as a kid.'",
        options: [
          {
            id: "hold_ground",
            text: "Celiac can actually develop or worsen at any age. I know my body now, and I've learned the hard way what happens when I ignore it. I'm not trying to make things difficult — I just need to keep myself healthy.",
            nextStepId: "end_sauce_firm",
          },
          {
            id: "drop_it",
            text: "I understand. Let's just enjoy the day — I'll grab something else from the table.",
            nextStepId: "end_sauce_kind",
          },
        ],
      },
      end_sauce_firm: {
        id: "end_sauce_firm",
        speaker: "app",
        text: "Really well done. Standing your ground when someone dismisses a medical condition is hard, especially with family. You explained it clearly and without anger. That takes real strength.",
        isEnd: true,
      },
      end_sauce_kind: {
        id: "end_sauce_kind",
        speaker: "app",
        text: "You kept the peace and stayed safe — both valid goals. You don't owe anyone a medical lecture. Sometimes redirecting with warmth is exactly the right call.",
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
            nextStepId: "bob_dismisses_choice",
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
      bob_dismisses_choice: {
        id: "bob_dismisses_choice",
        speaker: "other",
        text: "Uncle Bob: 'You're being dramatic. My neighbor's kid has celiac and eats whatever he wants at parties. I really think you're making this harder than it needs to be.'",
        options: [
          {
            id: "educate_bob",
            text: "Everyone with celiac is different. Some people don't feel symptoms right away but are still damaging their gut silently. My doctor has been very clear that I need to be strict, and I trust that.",
            nextStepId: "bob_keeps_pushing",
          },
          {
            id: "set_boundary",
            text: "I hear you, and I know it's hard to understand from the outside. But this is my health and my body, and I need to make this call for myself. I really do love you and I'm so glad to be here.",
            nextStepId: "end_boundary_set",
          },
        ],
      },
      bob_keeps_pushing: {
        id: "bob_keeps_pushing",
        speaker: "other",
        text: "Uncle Bob: 'Well, I still think it's all in your head, but fine. Do what you want.'",
        options: [
          {
            id: "let_it_go",
            text: "I know we see this differently, and that's okay. I'm not going to let it ruin our time together. Now — tell me about that potato salad, is that your mom's recipe?",
            nextStepId: "end_brought_food",
          },
          {
            id: "one_more_time",
            text: "It's not in my head — it's a diagnosis, and it's real. But I don't want to argue. Let's just enjoy the day.",
            nextStepId: "end_brought_food",
          },
        ],
      },
      end_boundary_set: {
        id: "end_boundary_set",
        speaker: "app",
        text: "Perfectly handled. You named the dynamic, honored your own needs, and kept love in the room. You don't have to convince everyone — you just have to protect yourself.",
        isEnd: true,
      },
      end_brought_food: {
        id: "end_brought_food",
        speaker: "app",
        text: "That's the right move — redirect, stay warm, and don't get pulled into a debate you can't win right now. You held your ground through real pushback. That's hard, and you did it.",
        isEnd: true,
      },
    },
  },
  {
    id: "catered-event",
    title: "At a Catered Event",
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
            id: "ask_cc_specifically",
            text: "I need to check on cross-contamination specifically — were the GF dishes cooked in separate pots and pans from the gluten items?",
            nextStepId: "coord_cc_confused",
          },
          {
            id: "accept_risk",
            text: "Okay, separate plates sounds fine. I'll give those a try.",
            nextStepId: "tip_utensil_risk",
          },
        ],
      },
      coord_cc_confused: {
        id: "coord_cc_confused",
        speaker: "other",
        text: "Coordinator: 'Oh, they're made with completely gluten-free ingredients, so cross-contamination isn't really an issue. The ingredients are safe, so the food is safe — I promise!'",
        options: [
          {
            id: "explain_cc_catered",
            text: "Thank you for making GF options! I want to explain — with celiac, cross-contamination means gluten particles can transfer through shared pots, pans, or water, even when the recipe itself has no gluten. That's what I need to find out about.",
            nextStepId: "coord_lightbulb",
          },
        ],
      },
      coord_lightbulb: {
        id: "coord_lightbulb",
        speaker: "other",
        text: "Coordinator: 'Oh — I genuinely had no idea. So the same pot used for regular pasta and then rinsed for GF pasta would still be a problem?'",
        options: [
          {
            id: "confirm_and_ask_chef",
            text: "Exactly — even tiny traces left behind can cause a reaction for someone with celiac. Would it be possible to ask the chef how these were actually cooked?",
            nextStepId: "coord_chef_check",
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
