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

export type ScenarioMode = {
  id: string;
  label: string;
  description: string;
  icon: string;
  tint: "mint" | "lemon" | "rose";
  firstStepId?: string;
};

export type Scenario = {
  id: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  steps?: Record<string, ScenarioStep>;
  firstStepId?: string;
  modes?: ScenarioMode[];
};

export const SCENARIOS: Scenario[] = [
  {
    id: "restaurant-ordering",
    title: "Ordering at a Restaurant",
    description: "Practice talking to a server about cross-contact.",
    estimatedMinutes: 3,
    firstStepId: "start",
    modes: [
      { id: "informed", label: "Informed Server", description: "They know allergen protocol and take celiac seriously.", icon: "smile", tint: "mint", firstStepId: "informed_start" },
      { id: "uninformed", label: "Uninformed Server", description: "They mean well but have some common misconceptions.", icon: "help-circle", tint: "lemon", firstStepId: "uninformed_start" },
    ],
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
            text: "Thank you. Since I have celiac, I also need to ask about cross-contact. Are the burgers cooked on the same grill as the regular buns?",
            nextStepId: "server_reply_1a",
          },
          {
            id: "ask_separate_surface",
            text: "For celiac I need everything cooked on a completely separate surface with clean utensils, is that something the kitchen can do?",
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
        text: "Server: 'Oh, definitely! We wipe the grill down really well between orders, and it gets super hot anyway, that basically sterilizes it. You'll be totally fine!'",
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
        text: "Server: 'Oh wow. I really didn't know that. I'm going to be honest, I'm not sure what we can guarantee. Let me go ask the chef.'",
        options: [
          {
            id: "wait_for_answer",
            text: "Thank you for going to check.",
            nextStepId: "chef_finds_solution",
          },
        ],
      },
      chef_finds_solution: {
        id: "chef_finds_solution",
        speaker: "other",
        text: "Server: '[returns] Good news, the chef says they have a dedicated pan that's only used for allergen-sensitive orders. They'll personally handle yours.'",
        options: [
          {
            id: "gratefully_accept",
            text: "That's perfect, please tell the chef I'm really grateful. I'll have the burger!",
            nextStepId: "end_educated_server",
          },
        ],
      },
      end_educated_server: {
        id: "end_educated_server",
        speaker: "app",
        text: "You corrected a common misconception: heat and wiping really aren't enough, but many servers don't know that. Explaining it directly like this often lands well with people who are trying to help. The tradeoff: it puts you in teacher mode, which works great with receptive staff but can create friction if a server feels like they're being corrected.",
        isEnd: true,
      },
      manager_to_rescue: {
        id: "manager_to_rescue",
        speaker: "other",
        text: "Manager: 'I'm so sorry, our server was doing their best, but you're absolutely right that heat and wiping aren't enough for celiac. We have a dedicated allergen pan in the back. I'll personally oversee your order.'",
        options: [
          {
            id: "thank_manager",
            text: "Thank you so much. I really appreciate you knowing the details. The dedicated pan is exactly what I need.",
            nextStepId: "end_manager_success",
          },
        ],
      },
      end_manager_success: {
        id: "end_manager_success",
        speaker: "app",
        text: "Escalating to a manager isn't rude, it's efficient. It gets your question to someone who actually knows the answer, and your health is most important. Some servers feel embarrassed when a customer goes over their head, but keep in mind: that's not your problem to solve.",
        isEnd: true,
      },
      server_reply_1a: {
        id: "server_reply_1a",
        speaker: "app",
        text: "Excellent! Asking about cross-contact is the most important step. Many restaurants don't realize shared grills are a problem.",
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
            text: "Could you also ask the kitchen to change their gloves and use a clean bowl to mix it?",
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
        text: "You asked about cross-contact directly and got a strong answer! Yes, it can slow a busy server down and occasionally gets an eye-roll from kitchen staff. But a reaction is much worse than an awkward moment, so the specifics are always worth it.",
        isEnd: true,
      },
      end_success_salad: {
        id: "end_success_salad",
        speaker: "app",
        text: "Asking for glove changes and a clean bowl is exactly right for salads. They're one of the highest cross-contact risks on most menus because they're assembled by hand.",
        isEnd: true,
      },
      // ── Informed Server mode ────────────────────────────────────────────────
      informed_start: {
        id: "informed_start",
        speaker: "other",
        text: "Hi there! Welcome. Are you ready to order, or do you have any dietary needs I can help with first?",
        options: [
          { id: "opt1", text: "I have celiac disease, can you tell me about your allergen protocol?", nextStepId: "informed_tip" },
          { id: "opt2", text: "I'm ready to order. I have celiac, so I have a few questions first.", nextStepId: "informed_tip" },
        ],
      },
      informed_tip: {
        id: "informed_tip",
        speaker: "app",
        text: "Mentioning celiac clearly from the start is always the right move. Let's see how this server responds.",
        options: [{ id: "cont", text: "Continue", nextStepId: "informed_server_proactive" }],
      },
      informed_server_proactive: {
        id: "informed_server_proactive",
        speaker: "other",
        text: "Server: 'Thank you for telling me! We have a full allergen protocol for celiac orders. I'll flag yours so the kitchen uses a dedicated pan, fresh gloves, and separate utensils. The GF bun is also stored separately. What would you like?'",
        options: [
          { id: "order", text: "That's such a relief. I'll have the burger with the GF bun, please!", nextStepId: "informed_success" },
          { id: "ask_more", text: "That's wonderful. One more question, if I wanted pasta, is that cooked in a separate pot?", nextStepId: "informed_asks_more" },
        ],
      },
      informed_asks_more: {
        id: "informed_asks_more",
        speaker: "other",
        text: "Server: 'Yes, separate pot, separate tongs, never shared. For celiac orders the chef handles it personally. We've had a few regulars and we take it very seriously.'",
        options: [
          { id: "order_pasta", text: "You really know your stuff. I'll have the GF pasta, thank you so much!", nextStepId: "informed_success" },
        ],
      },
      informed_success: {
        id: "informed_success",
        speaker: "app",
        text: "Notice what good looks like: proactive detail and an actual protocol. You asked a follow-up question confidently and accepted the safe option polietly.",
        isEnd: true,
      },
      // ── Uninformed Server mode ───────────────────────────────────────────────
      uninformed_start: {
        id: "uninformed_start",
        speaker: "other",
        text: "Hi there! Welcome. Are you ready to order, or do you need a few more minutes?",
        options: [
          { id: "opt1", text: "I'm ready, but I have celiac disease. Do you have a gluten-free menu?", nextStepId: "uninformed_server_tip" },
          { id: "opt2", text: "Yes, I'll have the salad, is it gluten-free?", nextStepId: "uninformed_salad_ask" },
        ],
      },
      uninformed_server_tip: {
        id: "uninformed_server_tip",
        speaker: "app",
        text: "Good start mentioning celiac. This server means well, watch how they respond and see if you can spot the gaps.",
        options: [{ id: "cont", text: "Continue", nextStepId: "uninformed_server_responds" }],
      },
      uninformed_server_responds: {
        id: "uninformed_server_responds",
        speaker: "other",
        text: "Server: 'Of course! We have a gluten-free bun for burgers, and our salads are safe without croutons. The kitchen is really careful.'",
        options: [
          { id: "ask_cc", text: "Thank you. I also need to ask specifically about cross-contact. Are GF items cooked on a completely separate surface?", nextStepId: "server_cc_wrong" },
          { id: "salad_route", text: "For the salad, is it prepared in a clean bowl that hasn't touched bread items?", nextStepId: "uninformed_salad_rinse" },
        ],
      },
      uninformed_salad_ask: {
        id: "uninformed_salad_ask",
        speaker: "other",
        text: "Server: 'Yes! Totally gluten-free, we just take off the croutons.'",
        options: [
          { id: "clarify", text: "I have celiac, so even crumbs are a problem. Is the salad made in a bowl that's never touched bread?", nextStepId: "uninformed_salad_rinse" },
        ],
      },
      uninformed_salad_rinse: {
        id: "uninformed_salad_rinse",
        speaker: "other",
        text: "Server: 'We rinse the bowl before we use it and we're really careful, that should definitely be fine!'",
        options: [
          { id: "explain_rinse", text: "I appreciate that! But for celiac, rinsing doesn't fully remove gluten. I need a bowl that hasn't touched any bread at all. Is that possible?", nextStepId: "uninformed_reconsiders" },
          { id: "ask_manager_r", text: "I understand, but for celiac that level of contact still causes a reaction. Could I speak with the chef or manager?", nextStepId: "manager_to_rescue" },
        ],
      },
      uninformed_reconsiders: {
        id: "uninformed_reconsiders",
        speaker: "other",
        text: "Server: 'Oh. I genuinely didn't know rinsing wasn't enough. Let me go ask the kitchen to set up a totally fresh bowl for you right now.'",
        options: [
          { id: "thanks", text: "Thank you so much for being willing to check, that's exactly what I need.", nextStepId: "end_educated_server" },
        ],
      },
    },
  },
  {
    id: "family-cookout",
    title: "Navigating a Family Cookout",
    description: "Talk to a relative who doesn't quite understand the rules.",
    estimatedMinutes: 4,
    firstStepId: "start",
    modes: [
      { id: "receptive", label: "Receptive Relative", description: "Doesn't fully understand yet, but listens and genuinely tries.", icon: "smile", tint: "mint", firstStepId: "receptive_start" },
      { id: "pushy", label: "Pushy Relative", description: "Dismisses your needs and pressures you to eat.", icon: "alert-circle", tint: "rose", firstStepId: "pushy_start" },
    ],
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
            text: "It really does, celiac is an autoimmune disease. Even a tiny amount triggers my immune system to attack my own intestines. It's not about how it tastes or feels right now; it causes real damage.",
            nextStepId: "bob_still_dismisses",
          },
          {
            id: "deflect_kindly",
            text: "I know it seems strange, but my doctor has been very clear. I don't want this to put a damper on the day. I'm just so happy to be here with everyone!",
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
            text: "Celiac can actually develop or worsen at any age. I know my body now, and I've learned the hard way what happens when I ignore it. I'm not trying to make things difficult. I just need to keep myself healthy.",
            nextStepId: "end_sauce_firm",
          },
          {
            id: "drop_it",
            text: "I understand. Let's just enjoy the day. I'll grab something else from the table.",
            nextStepId: "end_sauce_kind",
          },
        ],
      },
      end_sauce_firm: {
        id: "end_sauce_firm",
        speaker: "app",
        text: "Standing your ground with evidence closes the 'you used to eat fine' argument. Celiac can develop at any age, and your doctor confirmed it. The tradeoff: holding firm with a dismissive family member can create tension that outlasts the cookout. It's worth it, but know that not everyone comes around in the moment. You can be right and still have an awkward afternoon.",
        isEnd: true,
      },
      end_sauce_kind: {
        id: "end_sauce_kind",
        speaker: "app",
        text: "Choosing to drop it and move on is a completely valid strategy. Someone who stays dismissive after one clear explanation isn't going to be convinced by a second one. The tradeoff: it can feel like letting them win, and if this person is a regular presence in your life, unaddressed dismissal tends to resurface. Sometimes peace now means the same conversation again later.",
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
        text: "It's so hard when people push, but remember: your health is more important than their temporary disappointment. Cross-contact from the sauce or grill will make you sick.",
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
            text: "I know we see this differently, and that's okay. I'm not going to let it ruin our time together. Now, tell me about that potato salad, is that your mom's recipe?",
            nextStepId: "end_brought_food",
          },
          {
            id: "one_more_time",
            text: "It's not in my head, it's a diagnosis, and it's real. But I don't want to argue. Let's just enjoy the day.",
            nextStepId: "end_brought_food",
          },
        ],
      },
      end_boundary_set: {
        id: "end_boundary_set",
        speaker: "app",
        text: "'This is my health and I need to make this call for myself' is a clear, warm boundary that doesn't invite debate. The tradeoff: it can land as shutting down conversation, which works well here because the conversation isn't productive. With someone who actually wants to understand, you might want to stay open a little longer.",
        isEnd: true,
      },
      end_brought_food: {
        id: "end_brought_food",
        speaker: "app",
        text: "Redirecting to something warm ('tell me about that potato salad') after not getting through is a real skill. It signals you're not holding a grudge and lets the social moment continue. Now, some people read the subject-change as you conceding the argument. But that's okay. You aren't trying to win; you're trying to eat safely and enjoy the day.",
        isEnd: true,
      },
      // ── Receptive Relative mode ──────────────────────────────────────────────
      receptive_start: {
        id: "receptive_start",
        speaker: "other",
        text: "Uncle Bob: 'Hey! So glad you made it. I made BBQ chicken. I think it should be fine for you, but honestly just tell me what you need and I'll do whatever I can.'",
        options: [
          { id: "ask_sauce", text: "You're so thoughtful! Let me just check, what's in the BBQ sauce? Soy sauce sometimes sneaks in and it has wheat.", nextStepId: "receptive_tip" },
          { id: "brought_food", text: "That means a lot. I actually brought my own food just to be totally safe!", nextStepId: "receptive_brought_food" },
        ],
      },
      receptive_tip: {
        id: "receptive_tip",
        speaker: "app",
        text: "Great instinct asking about the sauce specifically. Let's see how Bob handles the news.",
        options: [{ id: "cont", text: "Continue", nextStepId: "receptive_bob_reveals_soy" }],
      },
      receptive_bob_reveals_soy: {
        id: "receptive_bob_reveals_soy",
        speaker: "other",
        text: "Uncle Bob: 'Oh, just the usual, ketchup, brown sugar, a little soy sauce for umami, some spices.'",
        options: [
          { id: "explain", text: "Ah, unfortunately regular soy sauce has wheat in it, so I can't have it. But I really appreciate you making it!", nextStepId: "receptive_bob_accepts" },
        ],
      },
      receptive_bob_accepts: {
        id: "receptive_bob_accepts",
        speaker: "other",
        text: "Uncle Bob: 'Oh no. I had absolutely no idea! I feel terrible. I want to make sure you have something safe. I have plain chicken I haven't sauced yet, let me put some aside for you right now.'",
        options: [
          { id: "yes_please", text: "Oh you don't have to go out of your way! But yes, plain chicken without the sauce would be perfect. You're so sweet.", nextStepId: "receptive_end_great" },
          { id: "already_good", text: "That's so kind of you, truly. I actually brought my own food just in case, so I'm all set, please don't feel bad!", nextStepId: "receptive_end_fine" },
        ],
      },
      receptive_end_great: {
        id: "receptive_end_great",
        speaker: "app",
        text: "When someone genuinely tries to accommodate you, accepting warmly and specifically ('plain chicken without sauce would be perfect') gives them a clear win, and that makes them more likely to try next time. Keep in mind: accepting help from family means trusting their execution, which requires judgment.",
        isEnd: true,
      },
      receptive_end_fine: {
        id: "receptive_end_fine",
        speaker: "app",
        text: "Saying 'please don't feel bad' removes the guilt and keeps the dynamic easy. With Bob specifically, he was trying. You weren't dismissing his effort.",
        isEnd: true,
      },
      receptive_brought_food: {
        id: "receptive_brought_food",
        speaker: "other",
        text: "Uncle Bob: 'Oh smart! I'm so glad you did. Is there anything here you can safely have? I want you to be able to eat with everyone.'",
        options: [
          { id: "check_together", text: "I might be able to have the plain corn on the cob if it hasn't been near the sauce. Want to check together?", nextStepId: "receptive_checking" },
          { id: "im_good", text: "I'm all set with what I brought! Truly. Being here with everyone is the whole point.", nextStepId: "receptive_end_fine" },
        ],
      },
      receptive_checking: {
        id: "receptive_checking",
        speaker: "other",
        text: "Uncle Bob: '[looks carefully] Okay, the corn was cooked separate and I only touched it with the tongs from the bag. I think that's genuinely safe for you.'",
        options: [
          { id: "great_team", text: "You're the best! Yes, corn it is. Thank you for going through it with me, that really means a lot.", nextStepId: "receptive_end_great" },
        ],
      },
      // ── Pushy Relative mode ──────────────────────────────────────────────────
      pushy_start: {
        id: "pushy_start",
        speaker: "other",
        text: "Uncle Bob: 'Hey! Get over here. I made my famous BBQ chicken and you HAVE to try it. Come on, grab a plate!'",
        options: [
          { id: "mention_celiac", text: "It smells incredible! I have to be careful with my celiac though, can I ask what's in the sauce first?", nextStepId: "pushy_bob_tip" },
          { id: "own_food", text: "It looks amazing! I actually brought my own food to be safe, but thank you so much.", nextStepId: "bob_reply_2_actual" },
        ],
      },
      pushy_bob_tip: {
        id: "pushy_bob_tip",
        speaker: "app",
        text: "Good instinct asking first. In this scenario, Bob isn't going to make this easy, get ready.",
        options: [{ id: "cont", text: "Continue", nextStepId: "pushy_bob_sauce_reveal" }],
      },
      pushy_bob_sauce_reveal: {
        id: "pushy_bob_sauce_reveal",
        speaker: "other",
        text: "Uncle Bob: 'Oh, you know, ketchup, brown sugar, a little soy sauce, some spices. My dad's recipe. Why?'",
        options: [
          { id: "explain_soy", text: "Ah, regular soy sauce has wheat in it, so unfortunately I can't have it. I'm really sorry, it smells incredible!", nextStepId: "pushy_bob_dismisses" },
        ],
      },
      pushy_bob_dismisses: {
        id: "pushy_bob_dismisses",
        speaker: "other",
        text: "Uncle Bob: 'Soy sauce? Oh come on, it's a tiny little bit! You'll be totally fine. You're being way too careful about this.'",
        options: [
          { id: "explain_medical", text: "I hear you, but celiac is an autoimmune disease, even a tiny amount genuinely damages my intestines. It's not about being overly careful.", nextStepId: "bob_still_dismisses" },
          { id: "redirect", text: "I know it seems like a lot! I'll just grab something I brought. Please don't let this be a thing. I'm so happy to be here.", nextStepId: "bob_reply_2_actual" },
        ],
      },
    },
  },
  {
    id: "catered-event",
    title: "At a Catered Event",
    description: "Navigate a buffet where you don't control the menu.",
    estimatedMinutes: 5,
    firstStepId: "start",
    modes: [
      { id: "helpful", label: "Helpful Coordinator", description: "Willing to check with the chef and find a solution.", icon: "smile", tint: "mint", firstStepId: "start" },
      { id: "dismissive", label: "Dismissive Coordinator", description: "Assumes the GF label is enough and resists checking.", icon: "alert-circle", tint: "rose", firstStepId: "dismissive_start" },
    ],
    steps: {
      start: {
        id: "start",
        speaker: "other",
        text: "Event coordinator: 'Welcome! We have a full buffet set up. A few dishes are marked with a green flag for gluten-free guests.'",
        options: [
          {
            id: "opt_ask_prep",
            text: "Thank you! I have celiac disease, can you tell me more about how those dishes were prepared?",
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
        text: "Excellent instinct. A 'gluten-free' label only tells you the ingredients, not whether it was prepared safely. Asking about preparation is the right next step.",
        options: [{ id: "cont", text: "Continue", nextStepId: "coord_reply_prep" }],
      },
      coord_reply_prep: {
        id: "coord_reply_prep",
        speaker: "other",
        text: "Coordinator: 'They were made in the same kitchen as everything else, but the chef put them on separate plates before service.'",
        options: [
          {
            id: "ask_utensils",
            text: "I appreciate that. With celiac, I also need to ask, are the serving utensils shared between the regular and gluten-free dishes?",
            nextStepId: "coord_utensil_reply",
          },
          {
            id: "ask_cc_specifically",
            text: "I need to check on cross-contact specifically, were the GF dishes cooked in separate pots and pans from the gluten items?",
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
        text: "Coordinator: 'Oh, they're made with completely gluten-free ingredients, so cross-contact isn't really an issue. The ingredients are safe, so the food is safe. I promise!'",
        options: [
          {
            id: "explain_cc_catered",
            text: "Thank you for making GF options! I want to explain, with celiac, cross-contact means gluten particles can transfer through shared pots, pans, or water, even when the recipe itself has no gluten. That's what I need to find out about.",
            nextStepId: "coord_lightbulb",
          },
        ],
      },
      coord_lightbulb: {
        id: "coord_lightbulb",
        speaker: "other",
        text: "Coordinator: 'Oh. I genuinely had no idea. So the same pot used for regular pasta and then rinsed for GF pasta would still be a problem?'",
        options: [
          {
            id: "confirm_and_ask_chef",
            text: "Exactly, even tiny traces left behind can cause a reaction for someone with celiac. Would it be possible to ask the chef how these were actually cooked?",
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
        text: "Coordinator: 'Of course, let me check. [returns] The chef says absolutely, and they'll bring it out to you directly on a clean plate.'",
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
        text: "Wonderful! You were polite, specific, and persistent, and it paid off. Asking event staff to involve the chef directly is often the safest path at catered events.",
        isEnd: true,
      },
      end_own_food: {
        id: "end_own_food",
        speaker: "app",
        text: "A completely valid choice. A person who won't check isn't interested in your safety. That's not a reflection on you. Eating food you brought yourself is always the safest option at any event, and this is exactly why. No apology needed, and no regrets.",
        isEnd: true,
      },
      tip_flag_warning: {
        id: "tip_flag_warning",
        speaker: "app",
        text: "Green flags are helpful, but they usually only mean the recipe is gluten-free, not that it was prepared safely. Shared utensils and cross-contact at buffets are very common.",
        options: [{ id: "cont", text: "Continue", nextStepId: "at_buffet" }],
      },
      at_buffet: {
        id: "at_buffet",
        speaker: "other",
        text: "You walk over to the buffet. The flagged dishes look good, but you notice a server using the same tongs for multiple dishes.",
        options: [
          {
            id: "ask_server",
            text: "Excuse me. I have celiac disease. Are those tongs being used for the gluten-free dishes too?",
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
        text: "Server: 'Oh, yeah, we've been using these for everything. Sorry, I didn't realize.'",
        options: [
          {
            id: "ask_coord_again",
            text: "No worries at all, thank you for being honest. Could you point me to whoever's in charge so I can ask about a safely prepared plate?",
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
        text: "Shared tongs are one of the most common causes of accidental gluten exposure at buffets, even a small amount of bread crumbs can cause a reaction. Better to ask before eating.",
        options: [{ id: "retry", text: "Go back and ask", nextStepId: "at_buffet" }],
      },
      // ── Dismissive Coordinator mode ──────────────────────────────────────────
      dismissive_start: {
        id: "dismissive_start",
        speaker: "other",
        text: "Coordinator: 'Welcome! We have a lovely spread, including a full gluten-free section, everything there is totally safe, all the ingredients are GF!'",
        options: [
          { id: "ask_prep", text: "Thank you! I have celiac, so I also need to ask, were those dishes cooked in separate pots and pans from the gluten items?", nextStepId: "dismissive_coord_confident" },
        ],
      },
      dismissive_coord_confident: {
        id: "dismissive_coord_confident",
        speaker: "other",
        text: "Coordinator: 'Oh, they're made with gluten-free ingredients, so they're completely safe. Everything in that section is fine. I promise!'",
        options: [
          { id: "explain_cc", text: "Thank you for making GF options! With celiac, it's not just the ingredients, shared pots or utensils can transfer gluten even when the recipe is GF. Could we check with the chef?", nextStepId: "dismissive_coord_resistant" },
        ],
      },
      dismissive_coord_resistant: {
        id: "dismissive_coord_resistant",
        speaker: "other",
        text: "Coordinator: 'I really don't want to bother the chef mid-service. I'm sure it'll be fine, lots of people with gluten sensitivity eat from that section.'",
        options: [
          { id: "clarify_severity", text: "I understand it's a busy time. Celiac is different from gluten sensitivity, it's an autoimmune disease where even traces cause real intestinal damage. I just need to know if separate pots were used.", nextStepId: "dismissive_coord_gives_in" },
          { id: "safe_choice", text: "I understand. I'll just stick with sealed items or food I brought. I don't want to cause a disruption.", nextStepId: "end_own_food" },
        ],
      },
      dismissive_coord_gives_in: {
        id: "dismissive_coord_gives_in",
        speaker: "other",
        text: "Coordinator: '[sighs] Alright. [returns] Okay, the chef confirmed the same large pots were used for everything. I'm sorry, I should have checked before reassuring you.'",
        options: [
          { id: "thank_graciously", text: "Thank you for checking. I know that wasn't easy during service. I'll eat what I brought. No hard feelings at all.", nextStepId: "dismissive_end" },
        ],
      },
      dismissive_end: {
        id: "dismissive_end",
        speaker: "app",
        text: "You stayed calm and precise through real resistance, and you got the truth. When someone finally checks and the news is bad, the gracious response keeps the door open, and you modeled that perfectly.",
        isEnd: true,
      },
    },
  },
  {
    id: "homemade-gift",
    title: "The Homemade Gift",
    description: "A loved one made something homemade just for you, but you're not sure their kitchen was safe.",
    estimatedMinutes: 4,
    firstStepId: "start",
    steps: {
      start: {
        id: "start",
        speaker: "other",
        text: "Aunt Carol: 'I baked these cookies just for you! I used the gluten-free flour mix from the health food store. I know how hard it must be. I wanted to make something special.'",
        options: [
          {
            id: "ask_setup",
            text: "Aunt Carol, this is the sweetest thing. Can I ask a little about your kitchen setup? It really helps me know what's safe for me.",
            nextStepId: "tip_ask_well",
          },
          {
            id: "take_home",
            text: "Oh my goodness, thank you so much! I'll take these home with me.",
            nextStepId: "tip_white_lie",
          },
        ],
      },
      tip_ask_well: {
        id: "tip_ask_well",
        speaker: "app",
        text: "Asking before you eat is always the right move, even when someone's intentions are wonderful. Framing it as 'it helps me know what's safe' rather than 'I don't trust you' keeps the conversation warm.",
        options: [{ id: "cont", text: "Continue", nextStepId: "carol_reveals" }],
      },
      carol_reveals: {
        id: "carol_reveals",
        speaker: "other",
        text: "Aunt Carol: 'Of course! I used my regular baking pans and glass bowls, ran them through the dishwasher before I started. I mixed everything with my wooden mixing spoon and used the wooden rolling pin for the dough, same as always.'",
        options: [
          {
            id: "explain_cc",
            text: "The pans and bowls are actually perfect, dishwasher cleans non-porous surfaces completely. The wooden spoon and rolling pin are the tricky part: wood is porous, so gluten can hide in tiny grooves even after washing.",
            nextStepId: "tip_explain_cc",
          },
          {
            id: "accept_graciously",
            text: "You're so sweet. I might just take them home for later. I sometimes feel more confident when I know exactly how something was made. But truly, thank you.",
            nextStepId: "tip_white_lie_late",
          },
        ],
      },
      tip_explain_cc: {
        id: "tip_explain_cc",
        speaker: "app",
        text: "Good framing, you started with the good news ('the pans are fine') before explaining the problem. That's much easier to hear than leading with what's wrong. The science here: metal, glass, and ceramic are non-porous and fully safe after washing. Wood, plastic colanders, and scratched non-stick are porous and hold gluten.",
        options: [{ id: "cont", text: "Continue", nextStepId: "carol_reaction" }],
      },
      carol_reaction: {
        id: "carol_reaction",
        speaker: "other",
        text: "Aunt Carol: '...Oh. I had absolutely no idea. I thought using the GF flour was the main thing. I'm so sorry. I spent all morning on these.'",
        options: [
          {
            id: "reassure_and_guide",
            text: "Please don't feel bad, what you did was an act of love and I felt every bit of it. Now I can tell you exactly what works, and we could even bake together sometime with the right setup. That would mean so much to me.",
            nextStepId: "carol_wants_to_try",
          },
          {
            id: "just_reassure",
            text: "Please don't apologize. The fact that you thought of me and tried, that's the real gift. Honestly.",
            nextStepId: "end_just_love",
          },
        ],
      },
      carol_wants_to_try: {
        id: "carol_wants_to_try",
        speaker: "other",
        text: "Aunt Carol: 'I really want to get it right for you. What would I need to do differently?'",
        options: [
          {
            id: "give_guide",
            text: "Your pans and bowls are totally fine, dishwasher gets them perfectly clean. You'd just need to swap the wooden spoon and rolling pin for ones that have only ever touched GF food, or use silicone instead. Everything else you already have works great!",
            nextStepId: "end_gratitude_and_guide",
          },
        ],
      },
      tip_white_lie: {
        id: "tip_white_lie",
        speaker: "app",
        text: "Taking it home is a completely valid strategy. You preserve the gesture, stay safe, and make a private decision later. You don't always owe someone a full explanation in the moment, especially when their heart is clearly in the right place.",
        options: [{ id: "cont", text: "Continue", nextStepId: "carol_happy" }],
      },
      tip_white_lie_late: {
        id: "tip_white_lie_late",
        speaker: "app",
        text: "Taking it home is a completely valid move. You stay safe, you honor her effort, and you handle the decision privately rather than in the middle of an emotional moment.",
        options: [{ id: "cont", text: "Continue", nextStepId: "carol_happy" }],
      },
      carol_happy: {
        id: "carol_happy",
        speaker: "other",
        text: "Aunt Carol: 'Oh good! I really hoped you'd like them. I just wanted to do something nice for you.'",
        options: [
          {
            id: "warm_thanks",
            text: "I love you so much for thinking of me. The fact that you tried means everything, really.",
            nextStepId: "end_white_lie",
          },
        ],
      },
      end_gratitude_and_guide: {
        id: "end_gratitude_and_guide",
        speaker: "app",
        text: "Beautifully done. You explained the science without blame, made sure she felt loved, and turned a hard moment into a plan for next time. That's one of the most generous things you can do, give someone a real roadmap instead of just leaving them confused.",
        isEnd: true,
      },
      end_just_love: {
        id: "end_just_love",
        speaker: "app",
        text: "Sometimes the truest thing you can say is 'the gesture is the gift.' You kept yourself safe, kept the relationship warm, and left her feeling appreciated rather than scolded. That's a real skill.",
        isEnd: true,
      },
      end_white_lie: {
        id: "end_white_lie",
        speaker: "app",
        text: "Taking it home was exactly right. You preserved a loving moment without having to give a medical explanation on the spot, and you don't always have to. That's a valid choice, especially with family. The food decision is yours to make privately, on your own terms.",
        isEnd: true,
      },
    },
  },
  {
    id: "splitting-the-bill",
    title: "Splitting the Bill",
    description: "Navigate group dining costs when dietary restrictions change what you can order.",
    estimatedMinutes: 4,
    firstStepId: "sb_root",
    modes: [
      { id: "even-split", label: "Splitting Evenly", description: "The group wants to split the bill evenly but you ordered less.", icon: "help-circle", tint: "lemon", firstStepId: "sb_even_q" },
      { id: "family-style", label: "Family-Style / Shared Plates", description: "The group wants to share dishes, which isn't safe for you.", icon: "alert-circle", tint: "rose", firstStepId: "sb_fs_timing" },
      { id: "questioned", label: "Being Questioned", description: "Someone is calling out your cost split or why you're not eating the shared food.", icon: "smile", tint: "mint", firstStepId: "sb_q_type" },
    ],
    steps: {
      sb_root: {
        id: "sb_root",
        speaker: "app",
        text: "Group dining with celiac adds two layers most people don't think about: what you can safely eat, and how that affects the cost split. Pick your situation.",
        options: [
          { id: "even", text: "The group wants to split evenly, but I ordered less", nextStepId: "sb_even_q" },
          { id: "fs", text: "The group wants family-style / shared plates", nextStepId: "sb_fs_timing" },
          { id: "backout", text: "I already agreed to family-style and need to back out", nextStepId: "sb_backout_timing" },
          { id: "questioned", text: "Someone is questioning why I'm not participating", nextStepId: "sb_q_type" },
        ],
      },

      // ── Even split, ordered less ──────────────────────────────────────────

      sb_even_q: {
        id: "sb_even_q",
        speaker: "app",
        text: "Is this a group that splits evenly by default, or did someone just suggest it now?",
        options: [
          { id: "default_split", text: "This group always splits evenly. I should bring it up proactively", nextStepId: "sb_even_proactive_tip" },
          { id: "suggested_now", text: "'Let's just split it' just came up at the table", nextStepId: "sb_even_reactive_moment" },
        ],
      },
      sb_even_proactive_tip: {
        id: "sb_even_proactive_tip",
        speaker: "app",
        text: "Before the bill comes is the easiest time to bring this up, no one feels called out and there's nothing to undo. A casual mention while ordering lands much better than a negotiation at the end.",
        options: [{ id: "cont", text: "Continue", nextStepId: "sb_even_proactive_say" }],
      },
      sb_even_proactive_say: {
        id: "sb_even_proactive_say",
        speaker: "other",
        text: "You: '[while ordering] Hey, would you all mind if we did individual checks tonight? I tend to order light and it just works out more fairly all around.'",
        options: [
          { id: "group_agrees", text: "Friends: 'Oh yeah, totally fine, actually easier honestly.'", nextStepId: "sb_even_proactive_end" },
          { id: "group_hesitates", text: "Friend: 'Ugh, individual checks are always such a hassle...'", nextStepId: "sb_even_proactive_pushback" },
        ],
      },
      sb_even_proactive_pushback: {
        id: "sb_even_proactive_pushback",
        speaker: "other",
        text: "You: 'I get it. I'll just ask the server to split mine off separately. You all can still do one check between you. Takes two seconds.'",
        options: [
          { id: "they_agree", text: "Friend: 'Oh yeah, that works.'", nextStepId: "sb_even_proactive_end" },
        ],
      },
      sb_even_proactive_end: {
        id: "sb_even_proactive_end",
        speaker: "app",
        text: "Bringing it up before anyone's ordered means there's no awkwardness and nothing to walk back. Framing it as 'fair for everyone' rather than a personal exception keeps the mood light. You're not asking for special treatment, just an honest split. Well done.",
        isEnd: true,
      },
      sb_even_reactive_moment: {
        id: "sb_even_reactive_moment",
        speaker: "other",
        text: "Friend: '[when the bill arrives] Okay, let's just split this equally, easiest, right?'",
        options: [
          { id: "fairness_framing", text: "Would you mind if I just covered mine separately? I ordered light, it wouldn't be fair to you all otherwise.", nextStepId: "sb_even_reactive_fair_end" },
          { id: "explain_celiac", text: "Could I just cover mine? With my celiac I could only order a couple of things, so I don't want to shortchange everyone on a split.", nextStepId: "sb_even_reactive_explain_end" },
          { id: "quiet_amount", text: "[To the server] Actually, could I get a separate check? [to the group] I'll sort mine out, go ahead and split the rest.", nextStepId: "sb_even_reactive_quiet_end" },
        ],
      },
      sb_even_reactive_fair_end: {
        id: "sb_even_reactive_fair_end",
        speaker: "app",
        text: "Framing it as fairness to them: 'it wouldn't be fair to you all', is more persuasive than framing it as a personal need. You're not asking for an exception; you're pointing out the honest math. The tradeoff: it doesn't explain why you ordered light. That's usually fine, but if someone is curious they may still ask.",
        isEnd: true,
      },
      sb_even_reactive_explain_end: {
        id: "sb_even_reactive_explain_end",
        speaker: "app",
        text: "Naming celiac gives people a real reason and closes any follow-up questions before they happen. The tradeoff: you've now disclosed a medical condition to everyone at the table, which may have been fine already, or may be more than you wanted to share in this setting. Know your audience before using this one.",
        isEnd: true,
      },
      sb_even_reactive_quiet_end: {
        id: "sb_even_reactive_quiet_end",
        speaker: "app",
        text: "Going directly to the server is the most efficient move, it bypasses any negotiation entirely. The tradeoff: it skips the group conversation, which can feel slightly abrupt to people who like to settle the bill together. Works best when you're confident the group won't read it as antisocial.",
        isEnd: true,
      },

      // ── Family-style / shared plates ──────────────────────────────────────

      sb_fs_timing: {
        id: "sb_fs_timing",
        speaker: "app",
        text: "Is family-style being suggested before anyone's ordered, or has the group already started planning it out?",
        options: [
          { id: "before_order", text: "Before we've ordered. I can redirect early", nextStepId: "sb_fs_early_tip" },
          { id: "already_planning", text: "They're already planning the order", nextStepId: "sb_fs_late_tip" },
        ],
      },
      sb_fs_early_tip: {
        id: "sb_fs_early_tip",
        speaker: "app",
        text: "Before anyone's committed to anything is the easiest moment to redirect. You don't need to explain everything, a simple 'could we do it differently this time?' is usually enough.",
        options: [{ id: "cont", text: "Continue", nextStepId: "sb_fs_early_say" }],
      },
      sb_fs_early_say: {
        id: "sb_fs_early_say",
        speaker: "other",
        text: "Friend: 'Should we just do family-style and share a bunch of stuff?'",
        options: [
          { id: "redirect_simple", text: "Could we do individual entrees this time? With my celiac I have to be careful about shared dishes, cross-contact is a real thing for me.", nextStepId: "sb_fs_early_friend" },
          { id: "redirect_offer", text: "I'd love to, but shared plates are tricky for me with celiac. Would it work if everyone ordered their own and we still got a few extras for the table that I just skip?", nextStepId: "sb_fs_early_friend" },
        ],
      },
      sb_fs_early_friend: {
        id: "sb_fs_early_friend",
        speaker: "other",
        text: "Friend: 'Oh, yeah, of course. I didn't think about that. Let's just do our own things.'",
        options: [
          { id: "thanks", text: "Thank you. I really appreciate it. I'm excited to see the menu!", nextStepId: "sb_fs_early_end" },
        ],
      },
      sb_fs_early_end: {
        id: "sb_fs_early_end",
        speaker: "app",
        text: "You redirected before anything was committed, which meant no one had to undo a plan. The brief mention of why (cross-contact) gave enough context without turning it into a medical briefing. Clean and effective.",
        isEnd: true,
      },
      sb_fs_late_tip: {
        id: "sb_fs_late_tip",
        speaker: "app",
        text: "When the group is already planning a shared order, opting out doesn't have to derail anything. The goal is to stay included in the meal socially while handling your food separately, and you can often do both.",
        options: [{ id: "cont", text: "Continue", nextStepId: "sb_fs_late_say" }],
      },
      sb_fs_late_say: {
        id: "sb_fs_late_say",
        speaker: "other",
        text: "Friend: 'Okay so I'm thinking we get the dumplings, the noodle dish, the shared rice, and a couple of the small plates. Everyone in?'",
        options: [
          { id: "opt_out_own_dish", text: "I'm in for the energy of it! I'll just order my own dish separately. I have to be careful with shared plates because of celiac. Happy to chip in on the drinks or something.", nextStepId: "sb_fs_late_friend" },
          { id: "opt_out_simple", text: "Go for it. I'll just grab my own entrée since shared dishes are tricky for me with celiac. I won't be in on the food cost but I'm absolutely here for it.", nextStepId: "sb_fs_late_friend" },
        ],
      },
      sb_fs_late_friend: {
        id: "sb_fs_late_friend",
        speaker: "other",
        text: "Friend: 'Oh totally, no worries at all. Get whatever works for you!'",
        options: [
          { id: "great", text: "Perfect, this is going to be a great dinner.", nextStepId: "sb_fs_late_end" },
        ],
      },
      sb_fs_late_end: {
        id: "sb_fs_late_end",
        speaker: "app",
        text: "Offering to contribute elsewhere (drinks, a side) signals you're still invested in the group experience, it's not about opting out of the meal, just the shared dishes. That keeps the social dynamic intact even when your food situation is separate.",
        isEnd: true,
      },

      // ── Already agreed to family-style, need to back out ─────────────────

      sb_backout_timing: {
        id: "sb_backout_timing",
        speaker: "app",
        text: "Has anything been ordered yet, or is the food already on the table?",
        options: [
          { id: "not_ordered", text: "Nothing's been ordered yet", nextStepId: "sb_backout_pre_tip" },
          { id: "food_arrived", text: "Food is already on the table", nextStepId: "sb_backout_post_tip" },
        ],
      },
      sb_backout_pre_tip: {
        id: "sb_backout_pre_tip",
        speaker: "app",
        text: "Before anything's ordered, backing out is easy, no one has to undo anything. A quick honest mention is all it takes.",
        options: [{ id: "cont", text: "Continue", nextStepId: "sb_backout_pre_say" }],
      },
      sb_backout_pre_say: {
        id: "sb_backout_pre_say",
        speaker: "other",
        text: "You: '[to the group, before the server comes] Hey. I need to take back what I said earlier about family-style. With my celiac, shared dishes are actually a cross-contact risk for me. I'll just order my own, sorry for the flip!'",
        options: [
          { id: "they_understand", text: "Friends: 'Oh no, don't apologize, of course. Get whatever you need.'", nextStepId: "sb_backout_pre_end" },
        ],
      },
      sb_backout_pre_end: {
        id: "sb_backout_pre_end",
        speaker: "app",
        text: "A short, direct correction before the order is placed costs nothing, no food was wasted, no one's plan was disrupted. Owning the change ('sorry for the flip') keeps it light and removes any awkwardness. You handled it exactly right.",
        isEnd: true,
      },
      sb_backout_post_tip: {
        id: "sb_backout_post_tip",
        speaker: "app",
        text: "When the food is already out, the options shift slightly: you can quietly not eat from the shared dishes and explain if asked, or flag it now and ask the server for a separate dish. Both are valid, the right call depends on how much attention you want to draw.",
        options: [{ id: "cont", text: "Continue", nextStepId: "sb_backout_post_moment" }],
      },
      sb_backout_post_moment: {
        id: "sb_backout_post_moment",
        speaker: "other",
        text: "Friend: '[dishes arriving] Okay, dig in everyone!'",
        options: [
          { id: "flag_now", text: "[to friend, quietly] Hey. I should have said this earlier, but I actually can't eat from the shared dishes with my celiac. Cross-contact. Can I ask the server to bring me something separate?", nextStepId: "sb_backout_post_flag_end" },
          { id: "quietly_skip", text: "[Take a drink, smile, don't reach for the shared dishes, wait to see if anyone notices]", nextStepId: "sb_backout_post_quiet_end" },
        ],
      },
      sb_backout_post_flag_end: {
        id: "sb_backout_post_flag_end",
        speaker: "app",
        text: "Flagging it quietly and immediately is usually the cleanest move. You're not disrupting the meal, you're just getting yourself a safe plate. The earlier you mention it, the less of a thing it becomes. It's okay that you didn't say it sooner; you said it now.",
        isEnd: true,
      },
      sb_backout_post_quiet_end: {
        id: "sb_backout_post_quiet_end",
        speaker: "app",
        text: "Quietly not participating is a legitimate choice, especially if you'd rather handle it privately than make an announcement mid-meal. If someone asks, you can explain simply then. This approach works best when you have something else to eat, or when drawing attention feels like too much right now.",
        isEnd: true,
      },

      // ── Being questioned ─────────────────────────────────────────────────

      sb_q_type: {
        id: "sb_q_type",
        speaker: "app",
        text: "What are they questioning?",
        options: [
          { id: "cost", text: "The cost split, why I'm not paying an equal share", nextStepId: "sb_q_cost_moment" },
          { id: "food", text: "Why I'm not eating the shared food even though I'm at the table", nextStepId: "sb_q_food_moment" },
        ],
      },

      // Questioned about cost ───────────────────────────────────────────────

      sb_q_cost_moment: {
        id: "sb_q_cost_moment",
        speaker: "other",
        text: "Friend: 'Wait, how come you're only paying for your own? I feel like we're all in this together.'",
        options: [
          { id: "cost_direct", text: "I only had the soup and a water, splitting evenly would mean paying for your cocktails and the three shared dishes I couldn't eat. It just doesn't add up fairly.", nextStepId: "sb_q_cost_direct_end" },
          { id: "cost_soft", text: "I completely get the 'in it together' vibe! I'm just trying to be fair to you all. I ordered really lightly because of my celiac restrictions, so paying equally would mean I'm covering food I couldn't even touch.", nextStepId: "sb_q_cost_soft_end" },
          { id: "cost_brief", text: "I couldn't eat most of what was ordered, so paying an equal share wouldn't really make sense. Happy to cover exactly what I had.", nextStepId: "sb_q_cost_direct_end" },
        ],
      },
      sb_q_cost_direct_end: {
        id: "sb_q_cost_direct_end",
        speaker: "app",
        text: "This is a financial objection, not a medical one, and the response should match. You don't need to explain celiac here; you just need to explain the math. 'I'd be paying for food I couldn't eat' is the whole argument, and it's a fair one. The medical context is only worth adding if they push further.",
        isEnd: true,
      },
      sb_q_cost_soft_end: {
        id: "sb_q_cost_soft_end",
        speaker: "app",
        text: "Validating the 'in it together' spirit before redirecting to the math keeps the moment warm rather than defensive. You're not refusing to participate, you're pointing out that participating fairly means paying for what you actually had. That's a reasonable position and you made it feel like one.",
        isEnd: true,
      },

      // Questioned about not eating shared food ────────────────────────────

      sb_q_food_moment: {
        id: "sb_q_food_moment",
        speaker: "other",
        text: "Friend: 'You've barely touched anything, are you not hungry? Why aren't you having any of the shared stuff?'",
        options: [
          { id: "food_explain", text: "I have celiac, so I can't eat from shared dishes, cross-contact is a real risk even if the ingredients are fine. I should have mentioned it before we ordered. I'm good though!", nextStepId: "sb_q_food_explain_end" },
          { id: "food_brief", text: "I have a celiac thing with shared dishes. I'm fine, just working with what I can have. Don't worry about me!", nextStepId: "sb_q_food_brief_end" },
          { id: "food_redirect", text: "I'm actually good. I have a medical thing that makes shared plates tricky. I'm honestly just happy to be here. Tell me about that dish though, what is it?", nextStepId: "sb_q_food_redirect_end" },
        ],
      },
      sb_q_food_explain_end: {
        id: "sb_q_food_explain_end",
        speaker: "app",
        text: "Owning the 'I should have mentioned it' takes any awkwardness off them and puts it back in your hands. Ending with 'I'm good though' closes the concern loop and keeps the meal moving. This is the fuller explanation, right for someone who seems genuinely puzzled and wants to understand.",
        isEnd: true,
      },
      sb_q_food_brief_end: {
        id: "sb_q_food_brief_end",
        speaker: "app",
        text: "Brief and reassuring. You answered the question, made clear there's no drama, and moved on. This works best when the question feels casual rather than pointed. You gave them just enough to stop worrying without making it a moment.",
        isEnd: true,
      },
      sb_q_food_redirect_end: {
        id: "sb_q_food_redirect_end",
        speaker: "app",
        text: "Redirecting to curiosity about their food ('tell me about that dish') is a smooth way to close the topic and keep the energy up. You answered the question, signaled you're fine, and handed the conversation back to them. That takes a bit of social grace and you pulled it off.",
        isEnd: true,
      },
    },
  },
  {
    id: "too-much-detail",
    title: "Too Much Detail",
    description: "Someone keeps pushing for the graphic details of what celiac actually does to your body. Practice redirecting without explaining more than you want to.",
    estimatedMinutes: 4,
    firstStepId: "gd_curious_start",
    modes: [
      { id: "curious", label: "Genuinely Curious", description: "They mean well and are fascinated. They don't realize you'd rather not go there.", icon: "smile", tint: "mint", firstStepId: "gd_curious_start" },
      { id: "persistent", label: "Won't Drop It", description: "You've deflected once and they're still pushing. Practice holding the line warmly.", icon: "help-circle", tint: "lemon", firstStepId: "gd_persistent_start" },
      { id: "audience", label: "In Front of Others", description: "They're asking at a group dinner and now everyone at the table is listening.", icon: "alert-circle", tint: "rose", firstStepId: "gd_audience_start" },
    ],
    steps: {
      // ── Genuinely Curious ────────────────────────────────────────────────

      gd_curious_start: {
        id: "gd_curious_start",
        speaker: "app",
        text: "You've just mentioned you have celiac disease at dinner. Your friend leans in.",
        options: [{ id: "cont", text: "Continue", nextStepId: "gd_curious_asks" }],
      },
      gd_curious_asks: {
        id: "gd_curious_asks",
        speaker: "other",
        text: "Friend: 'Wait, so what actually happens? Like, if you eat gluten, what does it do to you?'",
        options: [
          { id: "brief_medical", text: "My immune system basically attacks my own intestines. The symptoms are pretty rough. I'd rather not do the full rundown over food!", nextStepId: "gd_curious_tip_brief" },
          { id: "redirect_light", text: "The short version: I feel terrible for days. It's not very dinner-table-appropriate though!", nextStepId: "gd_curious_tip_redirect" },
          { id: "honest_boundary", text: "Honestly, I'd rather not get into the specifics right now. The main thing is I have to be careful about what I eat.", nextStepId: "gd_curious_tip_boundary" },
        ],
      },
      gd_curious_tip_brief: {
        id: "gd_curious_tip_brief",
        speaker: "app",
        text: "Giving a real but non-graphic answer satisfies most people's curiosity without going into your body in detail. The tradeoff: 'immune system attacks my intestines' sometimes makes people more curious, not less. If they keep asking, you have every right to say that's as much as you want to share.",
        options: [{ id: "cont", text: "Continue", nextStepId: "gd_curious_satisfied" }],
      },
      gd_curious_tip_redirect: {
        id: "gd_curious_tip_redirect",
        speaker: "app",
        text: "A light redirect with a touch of humor lands well with people who are curious but not pushy. It answers the spirit of the question (it's bad) without the details, and the 'dinner-table' framing signals the topic is closed without sounding defensive. The tradeoff: some people will laugh and keep asking anyway.",
        options: [{ id: "cont", text: "Continue", nextStepId: "gd_curious_satisfied" }],
      },
      gd_curious_tip_boundary: {
        id: "gd_curious_tip_boundary",
        speaker: "app",
        text: "You don't owe anyone a description of your body. Naming your preference directly, 'I'd rather not get into the specifics,' is clear and calm. The tradeoff: some people hear this as mysterious or evasive, and it can actually spark more curiosity than a brief non-graphic answer would.",
        options: [{ id: "cont", text: "Continue", nextStepId: "gd_curious_satisfied" }],
      },
      gd_curious_satisfied: {
        id: "gd_curious_satisfied",
        speaker: "other",
        text: "Friend: 'Oh, totally fair, that sounds rough. I won't pry. Thanks for explaining the gist of it.'",
        options: [
          { id: "warm_close", text: "Thanks for understanding! It's just one of those things. Anyway, how's your food?", nextStepId: "gd_curious_end" },
          { id: "add_bit", text: "I appreciate that. It really does affect daily life in a big way, even if I don't always show it.", nextStepId: "gd_curious_end" },
        ],
      },
      gd_curious_end: {
        id: "gd_curious_end",
        speaker: "app",
        text: "You shared what you were comfortable with and moved the conversation on. That's the whole skill: answering enough to satisfy curiosity without going further than you want to. You don't have to earn people's understanding by describing symptoms in detail.",
        isEnd: true,
      },

      // ── Won't Drop It ────────────────────────────────────────────────────

      gd_persistent_start: {
        id: "gd_persistent_start",
        speaker: "app",
        text: "You've already given a brief answer. Your friend isn't satisfied.",
        options: [{ id: "cont", text: "Continue", nextStepId: "gd_persistent_asks_again" }],
      },
      gd_persistent_asks_again: {
        id: "gd_persistent_asks_again",
        speaker: "other",
        text: "Friend: 'Okay but like, what actually happens? Does it hurt? Is it a stomach thing? I'm just curious!'",
        options: [
          { id: "firm_warm", text: "I hear you, and I know it sounds interesting. I'd really rather not talk about my body symptoms right now. Can we change the subject?", nextStepId: "gd_persistent_tip_firm" },
          { id: "just_enough", text: "GI damage, fatigue, brain fog. That's honestly the extent of what I'm comfortable sharing.", nextStepId: "gd_persistent_tip_enough" },
          { id: "humor_firm", text: "I promise you do not want the details, especially not right now. Let's just say it's really not pleasant and leave it there!", nextStepId: "gd_persistent_tip_humor" },
        ],
      },
      gd_persistent_tip_firm: {
        id: "gd_persistent_tip_firm",
        speaker: "app",
        text: "Naming the request directly, 'can we change the subject,' is a clear and kind way to close this. Most people will respect it. The tradeoff: it's more direct than some people are used to hearing, and a friend who pushed twice might feel a little called out. That's okay. You set a real boundary, clearly.",
        options: [{ id: "cont", text: "Continue", nextStepId: "gd_persistent_friend_backs_off" }],
      },
      gd_persistent_tip_enough: {
        id: "gd_persistent_tip_enough",
        speaker: "app",
        text: "Giving a clinical list without elaborating signals this is where the conversation stops. It answers the question factually while making clear you're not going further. The tradeoff: 'that's the extent of what I'm comfortable sharing' is a firm phrase, which is exactly right here, but it can feel slightly formal with a close friend.",
        options: [{ id: "cont", text: "Continue", nextStepId: "gd_persistent_friend_backs_off" }],
      },
      gd_persistent_tip_humor: {
        id: "gd_persistent_tip_humor",
        speaker: "app",
        text: "Humor is a real tool for deflecting persistent curiosity without creating friction. The tradeoff: if this person pushes a third time after you've used humor, you'll need to be more direct. Humor works best as a first or second line of defense, not an indefinite strategy.",
        options: [{ id: "cont", text: "Continue", nextStepId: "gd_persistent_friend_backs_off" }],
      },
      gd_persistent_friend_backs_off: {
        id: "gd_persistent_friend_backs_off",
        speaker: "other",
        text: "Friend: 'Oh, okay! Sorry, I was just curious. I didn't mean to make it weird.'",
        options: [
          { id: "no_worries", text: "No worries at all, I know it comes from a good place. I just don't love talking about the body stuff.", nextStepId: "gd_persistent_end" },
          { id: "brief_close", text: "All good. It's just not my favorite topic. You didn't know!", nextStepId: "gd_persistent_end" },
        ],
      },
      gd_persistent_end: {
        id: "gd_persistent_end",
        speaker: "app",
        text: "You held the line and the friendship survived. Letting someone off the hook with 'you didn't know' is generous and accurate. The tradeoff: people who ask twice tend to ask again next time. A brief 'I don't love talking about symptoms' note in a future conversation can head it off before it starts.",
        isEnd: true,
      },

      // ── In Front of Others ───────────────────────────────────────────────

      gd_audience_start: {
        id: "gd_audience_start",
        speaker: "app",
        text: "You're at a group dinner. You've just mentioned you can't eat the bread. Someone at the table gets curious.",
        options: [{ id: "cont", text: "Continue", nextStepId: "gd_audience_asks" }],
      },
      gd_audience_asks: {
        id: "gd_audience_asks",
        speaker: "other",
        text: "Person: 'Oh, do you have celiac? What happens when you eat gluten? Like, does it mess up your whole digestive system?'",
        options: [
          { id: "brief_public", text: "Yeah, it causes real damage to my intestines if I'm not careful. Not the most appetizing explanation though, so I'll spare the table the details!", nextStepId: "gd_audience_tip_brief" },
          { id: "deflect_group", text: "Short answer: yes, it's pretty awful. Long answer: let's save that for somewhere that isn't dinner.", nextStepId: "gd_audience_tip_deflect" },
          { id: "redirect_group", text: "It's a whole thing! The main takeaway is I just need to be careful. Anyway, what did everyone else order?", nextStepId: "gd_audience_tip_redirect" },
        ],
      },
      gd_audience_tip_brief: {
        id: "gd_audience_tip_brief",
        speaker: "app",
        text: "Answering briefly and framing the redirect as consideration for the group, 'spare the table,' is smart. You're not shutting the question down, you're saving everyone from an unpleasant conversation. Most people at the table will silently thank you. The tradeoff: the person who asked might feel a little deflected. That's okay.",
        options: [{ id: "cont", text: "Continue", nextStepId: "gd_audience_table_moves_on" }],
      },
      gd_audience_tip_deflect: {
        id: "gd_audience_tip_deflect",
        speaker: "app",
        text: "'Short answer / long answer' is a clean structure for a public deflection. It confirms the question is worth asking while signaling this isn't the moment. The tradeoff: 'somewhere that isn't dinner' implicitly offers to continue later, so be ready for a follow-up after the meal.",
        options: [{ id: "cont", text: "Continue", nextStepId: "gd_audience_table_moves_on" }],
      },
      gd_audience_tip_redirect: {
        id: "gd_audience_tip_redirect",
        speaker: "app",
        text: "A quick answer followed by an immediate redirect to the group is one of the fastest ways to move a public conversation. 'What did everyone else order?' is low-key but effective. The tradeoff: the person who asked might feel a little brushed off. That's a reasonable price for not describing your symptoms at dinner.",
        options: [{ id: "cont", text: "Continue", nextStepId: "gd_audience_table_moves_on" }],
      },
      gd_audience_table_moves_on: {
        id: "gd_audience_table_moves_on",
        speaker: "other",
        text: "Person: 'Oh, totally, yeah. Sorry for asking at dinner. That makes sense.'",
        options: [
          { id: "warm_end", text: "No need to apologize, it's a reasonable thing to wonder about! Just not the best dinner topic.", nextStepId: "gd_audience_end" },
          { id: "move_on", text: "All good! Now, are those appetizers coming or what?", nextStepId: "gd_audience_end" },
        ],
      },
      gd_audience_end: {
        id: "gd_audience_end",
        speaker: "app",
        text: "You handled a public question about your body without making the table uncomfortable or oversharing. That balance, brief, honest, and light, is genuinely hard to strike. The fact that you're practicing it means you'll find it easier next time.",
        isEnd: true,
      },
    },
  },
  {
    id: "epipen-training",
    title: "Teaching Someone to Use Your EpiPen",
    description: "Walk a trusted person through what to do if you have a severe allergic reaction. Practice giving clear, calm instructions they'll actually remember.",
    estimatedMinutes: 6,
    modes: [
      {
        id: "willing",
        label: "Willing to Help",
        description: "They're calm, attentive, and take it seriously — but they're not medical professionals.",
        icon: "smile",
        tint: "mint",
      },
      {
        id: "anxious",
        label: "Anxious About Helping",
        description: "They care deeply but are scared of doing it wrong. They need extra reassurance.",
        icon: "help-circle",
        tint: "rose",
      },
    ],
  },
];
