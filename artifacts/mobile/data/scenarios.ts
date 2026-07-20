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
  firstStepId: string;
};

export type Scenario = {
  id: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  steps: Record<string, ScenarioStep>;
  firstStepId: string;
  modes?: ScenarioMode[];
};

const _ALL_SCENARIOS: Scenario[] = [
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
    description: "A loved one baked something gluten-free just for you, but you're not sure their kitchen was safe.",
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
    id: "partner-conversation",
    title: "Talking to a Partner",
    description: "Tell someone you're close to about kissing safely with celiac, before the moment gets awkward.",
    estimatedMinutes: 4,
    firstStepId: "curious_start",
    modes: [
      { id: "curious", label: "Curious & Caring", description: "A little surprised, but genuinely wants to understand.", icon: "smile", tint: "mint", firstStepId: "curious_start" },
      { id: "defensive", label: "Caught Off Guard", description: "Their first reaction is defensiveness, you'll need patience.", icon: "help-circle", tint: "lemon", firstStepId: "defensive_start" },
    ],
    steps: {
      // ── Curious & Caring mode ────────────────────────────────────────────
      curious_start: {
        id: "curious_start",
        speaker: "other",
        text: "Alex: 'Hey! Sorry I'm a bit late. I grabbed a slice of pizza on the way over. You hungry? I can order something.'",
        options: [
          { id: "now", text: "I'm good! But actually, this is a good moment. I've been meaning to mention something about my celiac.", nextStepId: "curious_tip_timing" },
          { id: "later", text: "I'm okay for food! Come sit, how was your day?", nextStepId: "curious_later" },
        ],
      },
      curious_tip_timing: {
        id: "curious_tip_timing",
        speaker: "app",
        text: "Good instinct using the natural moment, they just mentioned food, so bringing it up doesn't feel out of nowhere. A casual opening like this is much easier than trying to schedule a serious talk.",
        options: [{ id: "cont", text: "Continue", nextStepId: "curious_alex_invites" }],
      },
      curious_later: {
        id: "curious_later",
        speaker: "other",
        text: "Alex: 'Sure! [settling in] So what do you want to do tonight?'",
        options: [
          { id: "bring_up", text: "[A little later] Hey, actually, there's something I've been meaning to mention about my celiac.", nextStepId: "curious_tip_later" },
        ],
      },
      curious_tip_later: {
        id: "curious_tip_later",
        speaker: "app",
        text: "Creating your own moment works just as well. 'I've been meaning to mention' signals it matters without making it feel like a crisis.",
        options: [{ id: "cont", text: "Continue", nextStepId: "curious_alex_invites" }],
      },
      curious_alex_invites: {
        id: "curious_alex_invites",
        speaker: "other",
        text: "Alex: 'Oh yeah, of course, what's up?'",
        options: [
          { id: "direct", text: "So with celiac, saliva can carry gluten for a few hours after you eat it. Which means kissing after pizza could actually cause a reaction for me.", nextStepId: "curious_tip_clear" },
          { id: "soft", text: "It's a little awkward to bring up, but, kissing can be a way I accidentally get gluten. So if you've eaten something with gluten, I just need a heads up.", nextStepId: "curious_tip_clear" },
        ],
      },
      curious_tip_clear: {
        id: "curious_tip_clear",
        speaker: "app",
        text: "Clear and specific without being clinical. Saying 'a little awkward to bring up' is honest, it lowers the pressure on both of you and gives them permission to be a bit surprised.",
        options: [{ id: "cont", text: "Continue", nextStepId: "curious_alex_surprised" }],
      },
      curious_alex_surprised: {
        id: "curious_alex_surprised",
        speaker: "other",
        text: "Alex: 'Oh wow. I genuinely had no idea that was a thing. So I should... brush my teeth first?'",
        options: [
          { id: "confirm", text: "Yes! Or even just swishing with water, that's enough. It sounds like a big deal but it's really just a quick habit.", nextStepId: "curious_alex_warm" },
          { id: "reassure", text: "Exactly. Brushing teeth or a water swish does it. Most people are surprised when they first hear it, it's not something anyone thinks to tell you.", nextStepId: "curious_alex_warm" },
        ],
      },
      curious_alex_warm: {
        id: "curious_alex_warm",
        speaker: "other",
        text: "Alex: 'Okay, yeah. I'll just do that. I'm really glad you told me. I had no idea and I would've just... not known.'",
        options: [
          { id: "thank", text: "I appreciate you being so easy about it. It can be a weird thing to bring up.", nextStepId: "curious_end" },
        ],
      },
      curious_end: {
        id: "curious_end",
        speaker: "app",
        text: "Using the natural moment (they just mentioned food) makes this feel like a normal part of conversation rather than a scheduled talk. The tradeoff: in-the-moment disclosures can catch people off guard if they're still reading the room. Alex took it well here. With someone more guarded, a private setting with no time pressure might land better than seizing the first relevant moment.",
        isEnd: true,
      },
      // ── Caught Off Guard mode ────────────────────────────────────────────
      defensive_start: {
        id: "defensive_start",
        speaker: "other",
        text: "Alex: 'Hey! Sorry I'm a bit late. I grabbed a slice of pizza on the way over. You hungry? I can order something.'",
        options: [
          { id: "bring_up", text: "I'm good! But actually, this is a good moment. I've been meaning to mention something about my celiac.", nextStepId: "defensive_tip_courage" },
        ],
      },
      defensive_tip_courage: {
        id: "defensive_tip_courage",
        speaker: "app",
        text: "Bringing this up takes real courage, especially earlier in a relationship. You're doing the right thing, and how someone responds to this tells you something important about them.",
        options: [{ id: "cont", text: "Continue", nextStepId: "defensive_alex_invites" }],
      },
      defensive_alex_invites: {
        id: "defensive_alex_invites",
        speaker: "other",
        text: "Alex: 'Oh yeah, sure, what's up?'",
        options: [
          { id: "explain", text: "So with celiac, saliva can carry gluten for a few hours after you eat it. Which means kissing after pizza could actually cause a reaction for me.", nextStepId: "defensive_tip_before_reaction" },
        ],
      },
      defensive_tip_before_reaction: {
        id: "defensive_tip_before_reaction",
        speaker: "app",
        text: "You explained it clearly. Their first reaction might be surprise or pushback, give them a moment before jumping in to reassure.",
        options: [{ id: "cont", text: "Continue", nextStepId: "defensive_alex_startled" }],
      },
      defensive_alex_startled: {
        id: "defensive_alex_startled",
        speaker: "other",
        text: "Alex: 'Wait, so you're saying I can't kiss you if I've eaten... regular food? Like, at all?'",
        options: [
          { id: "clarify", text: "Not regular food, just gluten specifically. Bread, pasta, things like that. Everything else is completely fine.", nextStepId: "defensive_tip_clarify" },
          { id: "solution_first", text: "I know it sounds like a lot! It's really just a quick thing, brush teeth or swish water first, and it's totally fine.", nextStepId: "defensive_tip_clarify" },
        ],
      },
      defensive_tip_clarify: {
        id: "defensive_tip_clarify",
        speaker: "app",
        text: "Good response. Correcting 'regular food' to 'gluten specifically' matters. That's a very different thing. You stayed calm and specific instead of getting defensive back.",
        options: [{ id: "cont", text: "Continue", nextStepId: "defensive_alex_processes" }],
      },
      defensive_alex_processes: {
        id: "defensive_alex_processes",
        speaker: "other",
        text: "Alex: 'I mean... okay. I'm not trying to be difficult. I just didn't realize it was that... involved.'",
        options: [
          { id: "bridge", text: "It's really not as involved as it sounds, it's a 30-second thing. It just matters because even a small amount of gluten causes real damage for me.", nextStepId: "defensive_alex_comes_around" },
          { id: "validate", text: "I know, it's a lot to hear for the first time. Brushing teeth or swishing water is genuinely all it takes. I just needed you to know.", nextStepId: "defensive_alex_comes_around" },
        ],
      },
      defensive_alex_comes_around: {
        id: "defensive_alex_comes_around",
        speaker: "other",
        text: "Alex: 'No, I get it. I'm sorry for being weird about it. I just needed a second. I'll remember.'",
        options: [
          { id: "grace", text: "You don't need to apologize, this is a lot to take in out of nowhere. I really appreciate you hearing me out.", nextStepId: "defensive_end" },
        ],
      },
      defensive_end: {
        id: "defensive_end",
        speaker: "app",
        text: "Staying patient when someone's first reaction is resistance takes real restraint. You corrected 'regular food' to 'gluten specifically' without matching their frustration, that factual precision matters, and keeping it calm meant they could actually hear it. Staying warm and patient when someone's being difficult can feel like you're not being taken seriously. You are. It just takes some people a moment longer.",
        isEnd: true,
      },
    },
  },
  {
    id: "REMOVED_partners-family",
    title: "REMOVED",
    description: "",
    estimatedMinutes: 0,
    firstStepId: "first_start",
    modes: [
      { id: "first-meeting", label: "First Meeting", description: "Meeting the family for the first time and navigating celiac together.", icon: "smile", tint: "mint", firstStepId: "first_start" },
      { id: "ongoing", label: "Ongoing Relationship", description: "You've met them before, but something keeps going wrong.", icon: "help-circle", tint: "lemon", firstStepId: "ongoing_start" },
      { id: "highstakes", label: "High-Stakes Event", description: "A holiday, engagement dinner, or wedding where the stakes are higher.", icon: "alert-circle", tint: "rose", firstStepId: "highstakes_start" },
    ],
    steps: {
      // ── First Meeting mode ────────────────────────────────────────────────

      first_start: {
        id: "first_start",
        speaker: "app",
        text: "First meetings are already a lot to navigate. Adding celiac means managing food safety and a new relationship at the same time. A key decision upfront: do you want your partner to give the family a heads-up beforehand, or handle it yourself when you arrive?",
        options: [
          { id: "partner_prepares", text: "I'd like my partner to mention it first", nextStepId: "pf_partner_prep" },
          { id: "handle_live", text: "I'll handle it myself when I get there", nextStepId: "pf_first_arrival" },
        ],
      },
      pf_partner_prep: {
        id: "pf_partner_prep",
        speaker: "other",
        text: "Your partner: 'Yeah, I'll text my mom before we leave, just let her know about the celiac so she's not caught off guard.'",
        options: [
          { id: "ask_detail", text: "Can you also mention that cross-contact matters, not just the ingredients? Shared pans or utensils can cause a reaction too.", nextStepId: "pf_partner_prep_tip" },
          { id: "just_heads_up", text: "Thank you, even a quick heads-up makes a real difference.", nextStepId: "pf_partner_prep_light" },
        ],
      },
      pf_partner_prep_tip: {
        id: "pf_partner_prep_tip",
        speaker: "app",
        text: "Smart ask. Most people understand 'no gluten ingredients' but don't think about cross-contact. If your partner can set that expectation now, you won't have to explain it cold at the table when everyone's already sitting down.",
        options: [{ id: "cont", text: "Continue", nextStepId: "pf_first_meal_prepped" }],
      },
      pf_partner_prep_light: {
        id: "pf_partner_prep_light",
        speaker: "app",
        text: "A heads-up is a great start. You're not arriving cold. You can fill in the details about cross-contact in person if the meal calls for it. Either way, you've already made it easier on yourself.",
        options: [{ id: "cont", text: "Continue", nextStepId: "pf_first_meal_prepped" }],
      },
      pf_first_arrival: {
        id: "pf_first_arrival",
        speaker: "other",
        text: "Mom: 'Oh, it's so lovely to finally meet you! Come in, come in. I've been cooking all day. I hope you're hungry!'",
        options: [
          { id: "mention_now", text: "I'm so happy to meet you! I do want to mention. I have celiac disease, so I'll need to be careful with gluten. Happy to explain what that looks like if it helps.", nextStepId: "pf_mom_open" },
          { id: "wait_til_meal", text: "[Wait until you're sitting at the table]", nextStepId: "pf_first_meal" },
        ],
      },
      pf_mom_open: {
        id: "pf_mom_open",
        speaker: "other",
        text: "Mom: 'Of course, tell me what you need! I want to make sure there's something safe for you.'",
        options: [
          { id: "explain_both", text: "Basically no wheat, barley, or rye, and how it's cooked matters as much as the ingredients. Shared pans or utensils can cause a reaction even if the food itself is fine.", nextStepId: "pf_arrival_warm_end" },
        ],
      },
      pf_arrival_warm_end: {
        id: "pf_arrival_warm_end",
        speaker: "app",
        text: "Well done. Covering ingredients AND preparation in one clear sentence gives her exactly what she needs without overwhelming her. You arrived as a guest, not a problem, and that framing will shape the whole visit.",
        isEnd: true,
      },
      pf_first_meal: {
        id: "pf_first_meal",
        speaker: "other",
        text: "Mom: '[Setting food on the table] I made a roast, roasted vegetables, and a nice gravy. Help yourselves!'",
        options: [
          { id: "bring_up_now", text: "Mention your celiac now before you serve yourself", nextStepId: "pf_first_meal_mention_tip" },
          { id: "probe_quietly", text: "Ask about specific dishes without bringing up celiac, keep it casual for now", nextStepId: "pf_meal_ask_quiet" },
        ],
      },
      pf_first_meal_mention_tip: {
        id: "pf_first_meal_mention_tip",
        speaker: "app",
        text: "Bringing it up at the table rather than at the door is completely fine. You still get the same information. The tradeoff: it's a slightly more public moment with everyone watching, which can feel like more pressure. But 'I should mention I have celiac' before you serve yourself is natural and low-stakes.",
        options: [{ id: "cont", text: "Continue", nextStepId: "pf_meal_ask" }],
      },
      pf_first_meal_prepped: {
        id: "pf_first_meal_prepped",
        speaker: "other",
        text: "Mom: '[Setting food on the table] I made a roast, roasted vegetables, and a nice gravy. Help yourselves!'",
        options: [
          { id: "she_seems_confident", text: "She seems confident she made something safe, but you're not sure if she understood cross-contact.", nextStepId: "pf_meal_check" },
          { id: "totally_unsure", text: "You're still not sure what's actually safe and want to ask before filling your plate.", nextStepId: "pf_meal_ask" },
        ],
      },
      pf_meal_check: {
        id: "pf_meal_check",
        speaker: "other",
        text: "Mom: 'I made sure to use the gluten-free flour for the gravy. I looked it up especially for you!'",
        options: [
          { id: "confirm_gently", text: "That is so thoughtful, really. Can I ask one more thing? Were the pans used just for these dishes, or did anything else get cooked in them earlier?", nextStepId: "pf_pan_question" },
          { id: "trust_it", text: "That means so much to me. I'll give it a try, thank you for going out of your way.", nextStepId: "pf_trust_end" },
        ],
      },
      pf_pan_question: {
        id: "pf_pan_question",
        speaker: "other",
        text: "Mom: 'The veg pan was used for breaded chicken last night. I did rinse it though. Is that okay?'",
        options: [
          { id: "decline_kindly", text: "You're so thoughtful for checking. Rinsing doesn't fully clear gluten from a pan, so I'll skip the veg to be safe, but the roast sounds perfect. Please don't feel bad at all!", nextStepId: "pf_decline_end" },
        ],
      },
      pf_decline_end: {
        id: "pf_decline_end",
        speaker: "app",
        text: "Asking the follow-up question: 'were the pans used for anything else?', caught something she didn't realize was a problem. Declining that specific dish while staying warm is the right call. The tradeoff: asking that level of detail takes confidence, and on a first meeting it can feel intrusive. In this case she wasn't offended, but not every host will react that way. Reading the room about how much to probe is part of the skill.",
        isEnd: true,
      },
      pf_trust_end: {
        id: "pf_trust_end",
        speaker: "app",
        text: "Trusting her effort rather than probing further is a judgment call, not a mistake. She researched, she offered, and the relationship is new. The tradeoff: you're accepting some uncertainty about cross-contact. If you do react, it'll be harder to know why. Reserving the detailed questions for your second or third visit, once trust is built, is a reasonable strategy. You balanced safety against relationship-building.",
        isEnd: true,
      },
      pf_meal_ask: {
        id: "pf_meal_ask",
        speaker: "app",
        text: "Asking before plates are full and expectations are set is always easier. A light, curious tone works well, you're gathering information, not auditing her kitchen.",
        options: [{ id: "cont", text: "Continue", nextStepId: "pf_meal_ask_live" }],
      },
      pf_meal_ask_live: {
        id: "pf_meal_ask_live",
        speaker: "other",
        text: "You: [to Mom] 'Everything looks beautiful. Can I ask, what's in the gravy? I just need to check a couple of things with my celiac.'",
        options: [
          { id: "she_helps", text: "She checks and confirms the roast and plain vegetables are safe.", nextStepId: "pf_meal_safe_end" },
          { id: "she_flustered", text: "She isn't sure and seems flustered.", nextStepId: "pf_meal_unsure" },
        ],
      },
      pf_meal_ask_quiet: {
        id: "pf_meal_ask_quiet",
        speaker: "app",
        text: "Asking about ingredients without naming celiac keeps things low-key and avoids making it A Whole Thing at the table. The tradeoff: if she doesn't know the full picture, that cross-contact matters, not just ingredients, you might not get the right answer even with the right question.",
        options: [{ id: "cont", text: "Continue", nextStepId: "pf_meal_ask_live_quiet" }],
      },
      pf_meal_ask_live_quiet: {
        id: "pf_meal_ask_live_quiet",
        speaker: "other",
        text: "You: [to Mom] 'Everything looks wonderful. Could I ask, what's in the gravy? I just want to make sure there's nothing I need to avoid.'",
        options: [
          { id: "cont", text: "Continue", nextStepId: "pf_meal_quiet_gravy_answer" },
        ],
      },
      pf_meal_quiet_gravy_answer: {
        id: "pf_meal_quiet_gravy_answer",
        speaker: "other",
        text: "Mom: 'Oh sure! It's the roast drippings, a little flour to thicken it, chicken stock, and some herbs. Is there something you're avoiding?'",
        options: [
          { id: "skip_quietly", text: "You heard 'flour', skip the gravy and stick to the roast without saying more", nextStepId: "pf_meal_quiet_end_skip" },
          { id: "reveal_now", text: "Actually, yes. I have celiac, so wheat flour is something I need to avoid. But the roast itself should be fine?", nextStepId: "pf_meal_quiet_reveal_mom" },
          { id: "probe_flour", text: "Is that regular wheat flour, or a different kind?", nextStepId: "pf_meal_quiet_probe_end" },
        ],
      },
      pf_meal_quiet_end_skip: {
        id: "pf_meal_quiet_end_skip",
        speaker: "app",
        text: "You got what you needed without disclosing anything, you heard 'flour,' you know to skip the gravy, and the meal moves on quietly. The tradeoff: you don't know whether the roast came into contact with the gravy (it often does as it rests), and you can't ask without explaining why. Skipping one dish based on one ingredient is a valid call, just be aware of what you're still uncertain about.",
        isEnd: true,
      },
      pf_meal_quiet_reveal_mom: {
        id: "pf_meal_quiet_reveal_mom",
        speaker: "other",
        text: "Mom: 'Oh! I had no idea. I'm so sorry. Let me think... the roast is just seasoned with salt and pepper, and the vegetables are just oil and herbs. Those should be safe?'",
        options: [
          { id: "confirm", text: "Yes, that sounds perfect. I really appreciate you checking, please don't feel bad at all.", nextStepId: "pf_meal_quiet_reveal_end" },
        ],
      },
      pf_meal_quiet_reveal_end: {
        id: "pf_meal_quiet_reveal_end",
        speaker: "app",
        text: "Coming clean when you heard the problem ingredient gave you the full picture, now you know the roast and vegetables are actually safe, not just probably safe. The tradeoff: you revealed your celiac at the table in a group setting, which is a more public moment than you may have wanted. That's fine. Most people respond exactly the way she did. And you're leaving with confirmed safe food rather than guesswork.",
        isEnd: true,
      },
      pf_meal_quiet_probe_end: {
        id: "pf_meal_quiet_probe_end",
        speaker: "other",
        text: "Mom: 'Just regular all-purpose flour, why, is that a problem?'",
        options: [
          { id: "reveal_after_probe", text: "Actually, yes. I have celiac, so I need to avoid wheat. The roast and vegetables look wonderful though. I'll have those.", nextStepId: "pf_meal_quiet_reveal_end" },
          { id: "skip_after_probe", text: "Oh, no worries. I'll just skip the gravy. Everything else looks amazing.", nextStepId: "pf_meal_quiet_end_skip" },
        ],
      },
      pf_meal_unsure: {
        id: "pf_meal_unsure",
        speaker: "other",
        text: "Mom: 'Oh gosh. I'm not sure now. I didn't know I needed to check all of that. I feel terrible.'",
        options: [
          { id: "reassure_redirect", text: "Please don't feel bad at all, you had no way to know. The roast is almost certainly fine. I'll start there and I'm completely happy with that. This doesn't have to be a big thing.", nextStepId: "pf_reassure_end" },
        ],
      },
      pf_reassure_end: {
        id: "pf_reassure_end",
        speaker: "app",
        text: "Reassuring her before redirecting to what is safe keeps the moment light and warm. You stay fed, she doesn't feel like she failed, and the meal moves on. That's the ideal outcome at a first meeting.",
        isEnd: true,
      },
      pf_meal_safe_end: {
        id: "pf_meal_safe_end",
        speaker: "app",
        text: "Asking before serving yourself is always the right move. You found what was safe, kept it simple, and the meal moved on. That's exactly how it should go.",
        isEnd: true,
      },

      // ── Ongoing Relationship mode ─────────────────────────────────────────

      ongoing_start: {
        id: "ongoing_start",
        speaker: "app",
        text: "Ongoing family relationships have their own texture. Pick what you're dealing with right now.",
        options: [
          { id: "skeptic", text: "A family member is skeptical or dismissive", nextStepId: "pf_skeptic_what" },
          { id: "no_backup", text: "My partner didn't back me up at the last visit", nextStepId: "pf_no_backup_start" },
          { id: "forgetting", text: "The family keeps 'forgetting' every visit", nextStepId: "pf_forgetting_how_long" },
        ],
      },

      // Skeptical family member ─────────────────────────────────────────────

      pf_skeptic_what: {
        id: "pf_skeptic_what",
        speaker: "app",
        text: "What are they saying?",
        options: [
          { id: "dramatic", text: "'You're being dramatic, it's such a tiny amount.'", nextStepId: "pf_skeptic_dramatic" },
          { id: "picky", text: "'Are you sure you're not just picky? My sister did this trend too.'", nextStepId: "pf_skeptic_picky" },
          { id: "old_times", text: "'We never had these problems growing up. People just ate what was served.'", nextStepId: "pf_skeptic_old_times" },
        ],
      },
      pf_skeptic_dramatic: {
        id: "pf_skeptic_dramatic",
        speaker: "other",
        text: "Aunt: 'Oh come on, it's a teeny bit of soy sauce. You can't honestly tell me that makes a real difference.'",
        options: [
          { id: "medical_fact", text: "It does, actually. Celiac is an autoimmune disease, my immune system attacks my own intestines when I eat even trace amounts. It's not about how it feels in the moment; it causes real damage.", nextStepId: "pf_skeptic_dramatic_firm_end" },
          { id: "soft_redirect", text: "I know it seems like a lot. My doctor has been very clear with me about it. I'm not trying to be difficult, I just need to keep myself healthy.", nextStepId: "pf_skeptic_dramatic_soft_end" },
          { id: "loop_partner", text: "[Look to your partner] Can you help explain? You've seen how sick I get.", nextStepId: "pf_skeptic_partner_step_in" },
        ],
      },
      pf_skeptic_partner_step_in: {
        id: "pf_skeptic_partner_step_in",
        speaker: "other",
        text: "Your partner: 'Yeah, it's a real thing. I've seen what happens. It's not something they're choosing to be sensitive about.'",
        options: [
          { id: "thank_partner", text: "Thank you. [to Aunt] I just need to make the call that keeps me safe, that's all.", nextStepId: "pf_skeptic_dramatic_firm_end" },
        ],
      },
      pf_skeptic_dramatic_firm_end: {
        id: "pf_skeptic_dramatic_firm_end",
        speaker: "app",
        text: "Stating the medical reality directly (immune system, intestinal damage, trace amounts) leaves no room for 'but just a little bit.' The tradeoff: this approach is confident and clear, which works well here. In some family dynamics, though, factual correction can come across as lecturing, and if the person already feels challenged, it can make them dig in rather than reconsider.",
        isEnd: true,
      },
      pf_skeptic_dramatic_soft_end: {
        id: "pf_skeptic_dramatic_soft_end",
        speaker: "app",
        text: "Citing your doctor shifts the authority off you and onto someone harder to dismiss. The tradeoff: 'my doctor said so' ends the argument but doesn't actually change their understanding, they may comply while still privately thinking you're being precious. That's fine for today, but if this person is a regular presence in your life, you may have this exact conversation again.",
        isEnd: true,
      },
      pf_skeptic_picky: {
        id: "pf_skeptic_picky",
        speaker: "other",
        text: "Uncle: 'I've heard about people going gluten-free as a lifestyle thing. Is yours actually medical, or more of a preference?'",
        options: [
          { id: "clear_medical", text: "It's a medical diagnosis. Celiac is an autoimmune condition, if I eat gluten, my immune system damages my small intestine. No preference involved and no cheat days.", nextStepId: "pf_skeptic_picky_clear_end" },
          { id: "gentle_distinction", text: "There's a real difference between choosing gluten-free and having celiac. Mine is a diagnosis, my body genuinely can't process it without causing damage. I wish it were just a preference!", nextStepId: "pf_skeptic_picky_gentle_end" },
        ],
      },
      pf_skeptic_picky_clear_end: {
        id: "pf_skeptic_picky_clear_end",
        speaker: "app",
        text: "Direct and factual, autoimmune condition, intestinal damage, no cheat days. This closes the 'but is it really medical?' question clearly. The tradeoff: it's authoritative, which works with someone who genuinely didn't know. If they were being passive-aggressive, this can come across as preachy rather than informative.",
        isEnd: true,
      },
      pf_skeptic_picky_gentle_end: {
        id: "pf_skeptic_picky_gentle_end",
        speaker: "app",
        text: "Drawing the distinction warmly, and adding 'I wish it were just a preference', lowers the other person's defenses and invites them to update their view without feeling corrected. The tradeoff: it's a softer landing, which keeps things pleasant. But softness sometimes gets read as ambiguity; if they're still uncertain after this, a clearer statement might be needed at the next visit.",
        isEnd: true,
      },
      pf_skeptic_old_times: {
        id: "pf_skeptic_old_times",
        speaker: "other",
        text: "Grandma: 'We just ate what was put in front of us. Nobody had all these problems growing up. I think people are just too sensitive now.'",
        options: [
          { id: "historical_context", text: "Celiac was around back then too, it just wasn't diagnosed. A lot of people were sick and didn't know why. I'm actually lucky to have a name for it.", nextStepId: "pf_skeptic_old_times_context_end" },
          { id: "let_it_go", text: "I understand. I just have to take care of myself the way I know how. I'm really glad to be here with everyone.", nextStepId: "pf_skeptic_old_times_peace_end" },
        ],
      },
      pf_skeptic_old_times_context_end: {
        id: "pf_skeptic_old_times_context_end",
        speaker: "app",
        text: "That reframe is genuinely useful, and true. Celiac wasn't invented recently; it was just unnamed. Giving her that context offers a way to update her view without having to admit she was wrong. That's a generous move.",
        isEnd: true,
      },
      pf_skeptic_old_times_peace_end: {
        id: "pf_skeptic_old_times_peace_end",
        speaker: "app",
        text: "Some conversations aren't worth finishing at the table. You made a gracious exit, stayed safe, and kept the day pleasant. Not every skeptic needs to be converted, you just need to eat safely and get through the visit.",
        isEnd: true,
      },

      // Partner didn't back you up ──────────────────────────────────────────

      pf_no_backup_start: {
        id: "pf_no_backup_start",
        speaker: "app",
        text: "This conversation is with your partner afterward, not the family. The goal isn't to win an argument; it's to feel supported at the next visit. How you open it sets the tone.",
        options: [{ id: "cont", text: "Continue", nextStepId: "pf_no_backup_convo" }],
      },
      pf_no_backup_convo: {
        id: "pf_no_backup_convo",
        speaker: "other",
        text: "Your partner: '[Later] That seemed fine, right? My family means well.'",
        options: [
          { id: "name_it_directly", text: "I know they mean well. But when your mom insisted the food was fine and you didn't say anything, I was left holding it alone. I need you to be able to back me up in those moments.", nextStepId: "pf_partner_response" },
          { id: "softer_ask", text: "I know. I just, it would mean a lot to me if you could back me up next time when I say I can't eat something. Even once changes the whole dynamic.", nextStepId: "pf_partner_response" },
        ],
      },
      pf_partner_response: {
        id: "pf_partner_response",
        speaker: "other",
        text: "Your partner: 'You're right. I didn't realize it put you in that position. I'll do better.'",
        options: [
          { id: "warm_close", text: "Thank you. I'm not asking you to fight anyone, just a 'they know their body' goes a long way.", nextStepId: "pf_no_backup_end_warm" },
          { id: "clear_close", text: "I appreciate that. Even backing me up once makes a huge difference. I don't feel so alone in it.", nextStepId: "pf_no_backup_end_clear" },
        ],
      },
      pf_no_backup_end_warm: {
        id: "pf_no_backup_end_warm",
        speaker: "app",
        text: "You named the behavior, not the person. 'I need you to back me up in those moments' is specific and actionable, and giving them the script ('they know their body') makes it easy to follow through. That's a mature, effective way to handle it.",
        isEnd: true,
      },
      pf_no_backup_end_clear: {
        id: "pf_no_backup_end_clear",
        speaker: "app",
        text: "Framing it around how it feels to you ('I don't feel so alone') keeps the conversation from becoming a blame loop. You were honest, clear, and warm, and you preserved the relationship while asking for what you need.",
        isEnd: true,
      },

      // Family keeps forgetting ─────────────────────────────────────────────

      pf_forgetting_how_long: {
        id: "pf_forgetting_how_long",
        speaker: "app",
        text: "How long has this been going on?",
        options: [
          { id: "once_or_twice", text: "Just once or twice, could be a genuine slip", nextStepId: "pf_forgetting_oneoff" },
          { id: "repeated", text: "Every visit. It's become a pattern.", nextStepId: "pf_forgetting_pattern" },
        ],
      },
      pf_forgetting_oneoff: {
        id: "pf_forgetting_oneoff",
        speaker: "other",
        text: "Mom: '[setting bread rolls next to your plate] Oh, have a roll. I made them fresh!'",
        options: [
          { id: "gentle_reminder", text: "They look wonderful! I just can't have the rolls. I have celiac, so anything with wheat causes a reaction. But I'm so happy with everything else.", nextStepId: "pf_forgetting_oneoff_end" },
          { id: "quick_pass", text: "I'll pass on the rolls, celiac. But thank you!", nextStepId: "pf_forgetting_brief_end" },
        ],
      },
      pf_forgetting_oneoff_end: {
        id: "pf_forgetting_oneoff_end",
        speaker: "app",
        text: "A gentle reminder with warmth keeps it from feeling like a correction. Once or twice is usually a genuine slip, not everyone retains medical details between visits, especially early on. You handled it exactly right.",
        isEnd: true,
      },
      pf_forgetting_brief_end: {
        id: "pf_forgetting_brief_end",
        speaker: "app",
        text: "Quick and easy. Not every reminder needs to be a teaching moment. You declined, moved on, and kept the meal moving.",
        isEnd: true,
      },
      pf_forgetting_pattern: {
        id: "pf_forgetting_pattern",
        speaker: "app",
        text: "A repeated pattern is different from a slip. At some point, addressing it directly, or asking your partner to, is more effective than re-explaining at every visit. What feels right?",
        options: [
          { id: "address_directly", text: "I want to say something directly to the family", nextStepId: "pf_forgetting_direct" },
          { id: "partner_messenger", text: "I'd rather ask my partner to handle it", nextStepId: "pf_forgetting_partner_messenger" },
        ],
      },
      pf_forgetting_direct: {
        id: "pf_forgetting_direct",
        speaker: "other",
        text: "You: [to Mom, before the meal] 'Can I mention something? I know celiac is a lot to remember, but I've been getting sick after visits. I think it's cross-contact more than the main ingredients. I'd love to figure out together what works.'",
        options: [
          { id: "she_listens", text: "She listens and says she wants to get it right.", nextStepId: "pf_forgetting_direct_end" },
          { id: "she_defensive", text: "She seems a little defensive.", nextStepId: "pf_forgetting_defensive" },
        ],
      },
      pf_forgetting_defensive: {
        id: "pf_forgetting_defensive",
        speaker: "other",
        text: "Mom: 'I do try! I just can't remember every little thing. It's a lot to keep track of.'",
        options: [
          { id: "validate_redirect", text: "I know it's a lot, and I don't need you to be an expert. Even just asking me 'is this okay for you?' before the meal would help so much. That's really all I need.", nextStepId: "pf_forgetting_direct_end" },
        ],
      },
      pf_forgetting_direct_end: {
        id: "pf_forgetting_direct_end",
        speaker: "app",
        text: "Raising it before the meal, not during, was the right call. Less pressure, more room to actually solve it. Framing it as 'let's figure this out together' rather than 'you keep getting it wrong' keeps her on your side. That took courage.",
        isEnd: true,
      },
      pf_forgetting_partner_messenger: {
        id: "pf_forgetting_partner_messenger",
        speaker: "other",
        text: "Your partner: 'You want me to talk to them? What should I say?'",
        options: [
          { id: "give_script", text: "Just let them know it's been causing real problems after visits. I don't need a big conversation, just for them to ask me 'is this okay?' before I eat something. That would change everything.", nextStepId: "pf_forgetting_partner_end" },
          { id: "trust_them", text: "Just that it's become a pattern and it matters. You know them better than I do. I trust you to find the right words.", nextStepId: "pf_forgetting_partner_end" },
        ],
      },
      pf_forgetting_partner_end: {
        id: "pf_forgetting_partner_end",
        speaker: "app",
        text: "Asking your partner to be the messenger is a completely valid strategy, especially when the relationship with the family is still forming. They have history and context you don't yet have. Using that isn't avoidance; it's using the best tool for the situation.",
        isEnd: true,
      },

      // ── High-Stakes Event mode ────────────────────────────────────────────

      highstakes_start: {
        id: "highstakes_start",
        speaker: "app",
        text: "High-stakes events, holidays, engagement dinners, weddings, add real pressure. There's often no control over the menu and a lot of eyes on the table. Two strategies both work here: advocating for yourself in the moment, or eating beforehand and getting through the event quietly. Neither is the wrong choice.",
        options: [
          { id: "advocate", text: "I want to advocate for myself in the moment", nextStepId: "pf_hs_advocate" },
          { id: "eat_before", text: "I'd rather eat beforehand and get through it quietly", nextStepId: "pf_hs_before" },
        ],
      },
      pf_hs_advocate: {
        id: "pf_hs_advocate",
        speaker: "other",
        text: "The host: '[at the table] We have a full spread, please help yourselves!'",
        options: [
          { id: "ask_quietly", text: "[Quietly, to the person next to you] Could you point me toward anything that might be safe for celiac? I don't want to make a fuss, just want to figure out what works.", nextStepId: "pf_hs_advocate_tip" },
          { id: "ask_host", text: "[To the host] Everything looks incredible. I have celiac, could I ask about a couple of the dishes before I serve myself?", nextStepId: "pf_hs_advocate_tip" },
        ],
      },
      pf_hs_advocate_tip: {
        id: "pf_hs_advocate_tip",
        speaker: "app",
        text: "Asking quietly sidesteps the 'making a scene' worry. Most hosts would rather know than watch you not eat. At high-stakes events, a quick private question is almost always welcomed, hosts want everyone to feel taken care of.",
        options: [{ id: "cont", text: "Continue", nextStepId: "pf_hs_advocate_response" }],
      },
      pf_hs_advocate_response: {
        id: "pf_hs_advocate_response",
        speaker: "other",
        text: "Host: 'Of course! The roasted salmon and the salad, without the croutons, should be fine. I'm not totally sure about the sauces though.'",
        options: [
          { id: "accept_graciously", text: "That's perfect, salmon and salad is a wonderful meal. Thank you so much for checking. I really appreciate it.", nextStepId: "pf_hs_advocate_end" },
        ],
      },
      pf_hs_advocate_end: {
        id: "pf_hs_advocate_end",
        speaker: "app",
        text: "You advocated, got a clear answer, and landed on a genuinely good plate. Gracious acceptance after someone helps is just as important as asking well, it makes the host feel appreciated rather than put upon. Nicely done.",
        isEnd: true,
      },
      pf_hs_before: {
        id: "pf_hs_before",
        speaker: "app",
        text: "Eating beforehand is a completely legitimate strategy, especially at events where you have no control over the menu and the social stakes are high. You still get to be fully present, enjoy the conversation, and not spend the event anxious about cross-contact.",
        options: [{ id: "cont", text: "Continue", nextStepId: "pf_hs_before_moment" }],
      },
      pf_hs_before_moment: {
        id: "pf_hs_before_moment",
        speaker: "other",
        text: "Family member: '[noticing your plate is empty] Are you not eating? Is everything okay?'",
        options: [
          { id: "light_answer", text: "I'm great! I have a medical thing with gluten so I ate beforehand. I'm completely happy to be here, please don't worry about me.", nextStepId: "pf_hs_before_light_end" },
          { id: "brief_answer", text: "I have celiac, so I planned ahead. All good!", nextStepId: "pf_hs_before_brief_end" },
        ],
      },
      pf_hs_before_light_end: {
        id: "pf_hs_before_light_end",
        speaker: "app",
        text: "Being proactive with reassurance ('please don't worry about me') means they don't have to sit with the guilt of feeling like they failed to feed you. You took care of yourself and made it easy on everyone else. That's the move.",
        isEnd: true,
      },
      pf_hs_before_brief_end: {
        id: "pf_hs_before_brief_end",
        speaker: "app",
        text: "Brief and settled. You answered the question, closed the loop, and moved on. Not everything needs a full explanation. You prepared, you showed up, you're present. That's what matters at an event like this.",
        isEnd: true,
      },
    },
  },
  {
    id: "splitting-the-bill",
    title: "Splitting the Bill",
    description: "Navigate group dining costs when celiac changes what you can order.",
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
    id: "canceling-plans",
    title: "When You're Too Sick to Show Up",
    description: "Cancel plans after getting glutened, without over-apologizing or over-explaining.",
    estimatedMinutes: 4,
    firstStepId: "cp_warm_start",
    modes: [
      { id: "supportive", label: "Supportive Friend", description: "They get it and want to help, practice saying it clearly without guilt.", icon: "smile", tint: "mint", firstStepId: "cp_warm_start" },
      { id: "skeptical", label: "Skeptical Friend", description: "They're questioning how sick you really are and whether you can push through.", icon: "help-circle", tint: "lemon", firstStepId: "cp_skeptic_start" },
      { id: "frustrated", label: "It Keeps Happening", description: "You've had to cancel before and they're starting to take it personally.", icon: "alert-circle", tint: "rose", firstStepId: "cp_repeat_start" },
    ],
    steps: {
      // ── Supportive Friend ────────────────────────────────────────────────

      cp_warm_start: {
        id: "cp_warm_start",
        speaker: "app",
        text: "You got glutened last night and woke up in a full flare, fatigue, cramping, brain fog. You have plans with a friend in two hours. What do you want to say?",
        options: [
          { id: "explain_full", text: "Hey, I got glutened last night and I'm in a full celiac flare. Fatigue, cramping, the works. I have to cancel today. Really sorry for the short notice.", nextStepId: "cp_warm_tip_full" },
          { id: "brief", text: "I have to cancel today, celiac flare. I'll give you the full story when I'm not completely wiped.", nextStepId: "cp_warm_tip_brief" },
          { id: "reschedule_forward", text: "I'm so sorry, I'm sick from a gluten exposure and I can't make it today. Can we look at next weekend instead?", nextStepId: "cp_warm_tip_reschedule" },
        ],
      },
      cp_warm_tip_full: {
        id: "cp_warm_tip_full",
        speaker: "app",
        text: "Giving them the full picture makes the seriousness clear and leaves nothing to wonder about. The tradeoff: composing a detailed message takes real energy when you're already depleted from a flare, and it can invite follow-up questions when you just need rest.",
        options: [{ id: "cont", text: "Continue", nextStepId: "cp_warm_friend_responds" }],
      },
      cp_warm_tip_brief: {
        id: "cp_warm_tip_brief",
        speaker: "app",
        text: "Brief and clear, this preserves your energy when you need it most. The tradeoff: some people feel shut out when they care about you and get little context. A good friend will usually follow up, but not everyone reads 'celiac flare' as the emergency it actually is.",
        options: [{ id: "cont", text: "Continue", nextStepId: "cp_warm_friend_responds" }],
      },
      cp_warm_tip_reschedule: {
        id: "cp_warm_tip_reschedule",
        speaker: "app",
        text: "Leading with a reschedule signals the friendship matters and you're already looking forward. The tradeoff: you're committing to a future date before you know how long recovery takes, which could set up another cancellation if the flare lingers.",
        options: [{ id: "cont", text: "Continue", nextStepId: "cp_warm_friend_responds" }],
      },
      cp_warm_friend_responds: {
        id: "cp_warm_friend_responds",
        speaker: "other",
        text: "Friend: 'Oh no, don't even worry about it. Please rest. Is there anything I can do? We can figure out a new time whenever you're better.'",
        options: [
          { id: "gracious", text: "Thank you for being so understanding. I really appreciate it. I'll reach out when I'm back on my feet.", nextStepId: "cp_warm_end" },
          { id: "reassure", text: "You're the best. I'm okay, just need a couple of days. Already looking forward to rescheduling.", nextStepId: "cp_warm_end" },
        ],
      },
      cp_warm_end: {
        id: "cp_warm_end",
        speaker: "app",
        text: "You said what you needed to say without spiraling into apologies. Notice you didn't promise to 'make it up to them' or apologize three times. That pattern puts the other person in the awkward position of reassuring you while you're the sick one. One honest cancellation message is enough.",
        isEnd: true,
      },

      // ── Skeptical Friend ─────────────────────────────────────────────────

      cp_skeptic_start: {
        id: "cp_skeptic_start",
        speaker: "app",
        text: "You cancel with a short message, and your friend's response isn't exactly warm.",
        options: [{ id: "cont", text: "Continue", nextStepId: "cp_skeptic_cancel" }],
      },
      cp_skeptic_cancel: {
        id: "cp_skeptic_cancel",
        speaker: "other",
        text: "You: 'Hey. I have to cancel today. I got glutened last night and I'm in a full flare. Really sorry.'",
        options: [
          { id: "see_response", text: "[Send]", nextStepId: "cp_skeptic_friend_questions" },
        ],
      },
      cp_skeptic_friend_questions: {
        id: "cp_skeptic_friend_questions",
        speaker: "other",
        text: "Friend: 'Wait, you were totally fine at dinner Friday. How are you suddenly this sick?'",
        options: [
          { id: "explain_lag", text: "Celiac reactions take time to fully build, sometimes the worst hits the next morning. I felt it coming last night and today is rough.", nextStepId: "cp_skeptic_tip_explain" },
          { id: "assert_brief", text: "That's just how it works. I'm not well today.", nextStepId: "cp_skeptic_tip_brief" },
        ],
      },
      cp_skeptic_tip_explain: {
        id: "cp_skeptic_tip_explain",
        speaker: "app",
        text: "Explaining the delayed reaction gives them real information and often closes the 'but you seemed fine' question for good. The tradeoff: it invites more questions and puts you in teaching mode when you're already sick. Worth it once, less worth it every time.",
        options: [{ id: "cont", text: "Continue", nextStepId: "cp_skeptic_pushes" }],
      },
      cp_skeptic_tip_brief: {
        id: "cp_skeptic_tip_brief",
        speaker: "app",
        text: "Short and final. You're not offering a science lesson, just the facts. This works well when you don't have the energy for a back-and-forth. The tradeoff: 'that's just how it works' can read as dismissive to someone who's genuinely trying to understand.",
        options: [{ id: "cont", text: "Continue", nextStepId: "cp_skeptic_pushes" }],
      },
      cp_skeptic_pushes: {
        id: "cp_skeptic_pushes",
        speaker: "other",
        text: "Friend: 'Can't you just take something and come for a bit? I feel like you're always canceling.'",
        options: [
          { id: "no_med_explain", text: "There's no medication for a celiac reaction, it's not like food poisoning you can treat. I'm dealing with real fatigue and pain right now. I genuinely can't.", nextStepId: "cp_skeptic_end_firm" },
          { id: "soft_hold", text: "I hear you, and I know it's frustrating. I wish I could push through it. I just can't today, please don't take it personally.", nextStepId: "cp_skeptic_end_soft" },
          { id: "set_boundary", text: "I'm not coming today. I know that's disappointing. Let's talk when I'm better.", nextStepId: "cp_skeptic_end_brief" },
        ],
      },
      cp_skeptic_end_firm: {
        id: "cp_skeptic_end_firm",
        speaker: "app",
        text: "Correcting the 'just take something' assumption closes the door on that logic and educates them at the same time.",
        isEnd: true,
      },
      cp_skeptic_end_soft: {
        id: "cp_skeptic_end_soft",
        speaker: "app",
        text: "Acknowledging their frustration before your own reality keeps the emotional temperature lower. But don't think you have to prioritize their emotions over your health every time.",
        isEnd: true,
      },
      cp_skeptic_end_brief: {
        id: "cp_skeptic_end_brief",
        speaker: "app",
        text: "After you've explained once, you don't owe a second explanation. Short and final protects your energy and keeps the boundary clear. The tradeoff: it can feel cold to someone who's hurt, offering to talk later helps, but only if you mean it.",
        isEnd: true,
      },

      // ── It Keeps Happening ───────────────────────────────────────────────

      cp_repeat_start: {
        id: "cp_repeat_start",
        speaker: "app",
        text: "This is the third time in two months you've had to cancel on this friend. You're in a flare again. They respond to your cancellation message.",
        options: [{ id: "cont", text: "Continue", nextStepId: "cp_repeat_friend_hurt" }],
      },
      cp_repeat_friend_hurt: {
        id: "cp_repeat_friend_hurt",
        speaker: "other",
        text: "Friend: 'I get that you're sick. But this keeps happening. I'm starting to wonder if you actually want to hang out.'",
        options: [
          { id: "acknowledge_impact", text: "I completely understand why it feels that way. Flares are unpredictable. I can't plan around them any more than you can. It has nothing to do with wanting to see you. I really do.", nextStepId: "cp_repeat_tip_validate" },
          { id: "vulnerable_push_back", text: "Honestly, that hurts to hear, because I've never once canceled because I didn't want to see you. Every time, I've been genuinely sick. I need you to know that even when it's hard to believe.", nextStepId: "cp_repeat_tip_pushback" },
          { id: "defer_convo", text: "I hear you, and I don't want to brush past this. But I'm in a bad flare right now and I can't have this conversation properly. Can we talk in a day or two when I'm able to actually be present for it?", nextStepId: "cp_repeat_tip_defer" },
        ],
      },
      cp_repeat_tip_validate: {
        id: "cp_repeat_tip_validate",
        speaker: "app",
        text: "Leading with 'I understand why it feels that way' lowers their defenses before you explain yourself. The tradeoff: it can come across as managing their feelings rather than actually engaging with the accusation, some people hear this as deflection.",
        options: [{ id: "cont", text: "Continue", nextStepId: "cp_repeat_friend_softer" }],
      },
      cp_repeat_tip_pushback: {
        id: "cp_repeat_tip_pushback",
        speaker: "app",
        text: "Naming how it lands for you ('that hurts') and then correcting the record directly is more emotionally honest. The tradeoff: it's a firmer response. It can feel like you're making the conversation about your feelings rather than theirs, which might not land well when they're already hurt.",
        options: [{ id: "cont", text: "Continue", nextStepId: "cp_repeat_friend_softer" }],
      },
      cp_repeat_tip_defer: {
        id: "cp_repeat_tip_defer",
        speaker: "app",
        text: "Deferring a hard conversation when you're genuinely sick is totally normal. You can't give this discussion what it needs right now. Keep in mind: it can feel like avoidance to someone who's already frustrated. 'In a day or two' only works if you actually follow through.",
        options: [{ id: "cont", text: "Continue", nextStepId: "cp_repeat_friend_softer" }],
      },
      cp_repeat_friend_softer: {
        id: "cp_repeat_friend_softer",
        speaker: "other",
        text: "Friend: 'I just don't know how to plan around it. It feels like every time we make plans, something happens.'",
        options: [
          { id: "offer_structure", text: "What if we switch to same-day or same-week plans, where I can actually tell you how I'm feeling before we commit? Less planning, less falling through.", nextStepId: "cp_repeat_end_practical" },
          { id: "honest_limit", text: "I can't promise this won't happen again, it's chronic and I can't predict it. What I can promise is that when I cancel, it's real, and I'll always try to reschedule. That's the honest answer.", nextStepId: "cp_repeat_end_honest" },
          { id: "flip_it", text: "I want to ask you something: what would actually help you feel less let down when this happens? Because I want to find something that works for both of us, not just apologize every time.", nextStepId: "cp_repeat_end_collaborative" },
        ],
      },
      cp_repeat_end_practical: {
        id: "cp_repeat_end_practical",
        speaker: "app",
        text: "Offering a concrete structural change turns apology into problem-solving, and most people respond well to that shift. The tradeoff: same-day plans require your friend to stay flexible too. It only works if they're actually willing to live that way, and not everyone is.",
        isEnd: true,
      },
      cp_repeat_end_honest: {
        id: "cp_repeat_end_honest",
        speaker: "app",
        text: "This is the most truthful answer you can give about a chronic condition. The tradeoff: 'I can't promise it won't happen again' is hard to hear, it asks them to accept uncertainty indefinitely. Some friendships can hold that. Some can't. Being honest about the limit is better than building on a promise you can't keep.",
        isEnd: true,
      },
      cp_repeat_end_collaborative: {
        id: "cp_repeat_end_collaborative",
        speaker: "app",
        text: "Flipping the question invites them into the solution rather than putting all the work on you. The tradeoff: it requires them to be self-aware enough to answer honestly, and if they're still in a hurt/reactive place, they might read it as deflecting responsibility. Read the room before using this one.",
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
];

export const SCENARIOS: Scenario[] = _ALL_SCENARIOS.filter(
  (s) => !s.id.startsWith("REMOVED_")
);
