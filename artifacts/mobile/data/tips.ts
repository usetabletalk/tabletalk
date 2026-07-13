export type TipCategory = "hidden-gluten" | "kitchen-safety" | "eating-out" | "travel";

export type Tip = {
  id: string;
  categoryId: TipCategory;
  title: string;
  content: string;
};

export const TIPS: Tip[] = [
  {
    id: "t1",
    categoryId: "hidden-gluten",
    title: "Soy Sauce and Teriyaki",
    content: "Traditional soy sauce is brewed with wheat. Always look for 'Tamari' or specifically labeled Gluten-Free soy sauce. If a restaurant marinates their meat, always ask if they use soy sauce.",
  },
  {
    id: "t2",
    categoryId: "hidden-gluten",
    title: "Oats & Cross-Contact",
    content: "Oats are naturally gluten-free, but they are almost always grown and processed alongside wheat. You must buy oats that are specifically labeled or certified Gluten-Free.",
  },
  {
    id: "t3",
    categoryId: "hidden-gluten",
    title: "Medications & Supplements",
    content: "Prescription and over-the-counter medications can use gluten as a binding agent. Always check with your pharmacist, and look for labels on vitamins.",
  },
  {
    id: "t4",
    categoryId: "hidden-gluten",
    title: "Licorice",
    content: "Many licorice candies (like Twizzlers or Red Vines) list wheat flour as their second ingredient. Always check candy labels!",
  },
  {
    id: "t15",
    categoryId: "hidden-gluten",
    title: "Kissing & Saliva",
    content: "Saliva can carry gluten for several hours after someone eats it. If a partner, family member, or friend has eaten gluten and then kisses you on the lips, that contact can be enough to cause a reaction. The solution is simple and worth mentioning to the people close to you: brushing teeth or swishing thoroughly with water beforehand makes it safe. It's an awkward conversation the first time, but most people are genuinely happy to know — and relieved there's an easy fix.",
  },
  {
    id: "t18",
    categoryId: "hidden-gluten",
    title: "Alcohol",
    content: "The key distinction is distillation vs. fermentation.\n\nFermented drinks (beer, ale, stout, lager, malt beverages) are NOT safe — the gluten proteins stay in the liquid. Always avoid standard beer. Gluten-removed beers like Omission are also not recommended for celiacs — they use enzymes to break gluten below 20ppm, but the proteins are still present in fragments and the Celiac Disease Foundation advises against them.\n\nDistilled spirits ARE generally considered safe, even when made from gluten grains like wheat or barley. The distillation process vaporizes and recondenses the alcohol, leaving gluten proteins behind. This includes most whiskey, bourbon, Scotch, vodka, and gin. That said, a small number of celiacs report reactions to grain-based spirits — if you're sensitive, stick to spirits distilled from non-gluten sources: tequila and mezcal (agave), rum (sugarcane), brandy and cognac (grapes), and potato vodka.\n\nAlways safe: wine, dry cider, and spirits labeled gluten-free.\n\nWatch out for: flavored spirits and pre-mixed cocktails — flavorings added after distillation can reintroduce gluten. Smirnoff Ice, Mike's Hard Lemonade, and similar malt-based beverages are NOT safe despite looking like cocktails.\n\nCertified gluten-free beers: Glutenberg, Ground Breaker, and New Planet are made from non-gluten grains and certified safe. Athletic Brewing makes non-alcoholic gluten-free options.",
  },
  {
    id: "t13",
    categoryId: "hidden-gluten",
    title: "Barley & Malt",
    content: "Barley contains gluten and hides in many surprising places. Malt flavoring, malt vinegar, and malt extract are all derived from barley — check cereals, flavored chips, malted milkshakes, and some chocolates. Beer is also made from barley (look for dedicated gluten-free beers instead). On labels, watch for: 'barley malt,' 'malt extract,' 'malt syrup,' or just 'malt flavoring.'",
  },
  {
    id: "t17",
    categoryId: "hidden-gluten",
    title: "Taco Seasoning",
    content: "Many store-bought taco seasoning packets use wheat flour or modified food starch (which can be wheat-based) as a filler or anti-caking agent. This includes some of the most common brands. Always read the label — look for 'contains wheat' or 'wheat' in the ingredients list. Safe alternatives are easy to find: several brands make certified gluten-free packets, or you can make your own blend with chili powder, cumin, garlic powder, onion powder, smoked paprika, and salt.",
  },
  {
    id: "t12",
    categoryId: "hidden-gluten",
    title: "Sauces, Gravies & Soups",
    content: "Wheat flour is one of the most common thickening agents used in commercial and restaurant cooking. Gravies, pan sauces, cream soups, stews, and roux-based dishes (like gumbo or macaroni cheese) are very likely to contain it. Even a clear-looking broth can be thickened with flour. Safe alternatives exist — cornstarch, arrowroot, and rice flour all thicken without gluten — but always ask specifically: 'Is this thickened with flour?'",
  },
  {
    id: "t5",
    categoryId: "kitchen-safety",
    title: "The Toaster Rule",
    content: "You need your own dedicated gluten-free toaster. Crumbs accumulate and burn, and putting GF bread in a shared toaster is a major cross-contamination risk. A cheap separate toaster is a lifesaver.",
  },
  {
    id: "t6",
    categoryId: "kitchen-safety",
    title: "Condiment Jars",
    content: "No double-dipping! If a knife touches regular bread and goes back into the mayo or peanut butter jar, the whole jar is contaminated. Buy squeeze bottles when possible, or have separate labeled jars.",
  },
  {
    id: "t7",
    categoryId: "kitchen-safety",
    title: "Colanders & Strainers",
    content: "Pasta strainers have hundreds of tiny holes where gluten pasta sticks. It is very hard to wash them perfectly. You should have a dedicated GF colander.",
  },
  {
    id: "t10",
    categoryId: "kitchen-safety",
    title: "Wooden Spoons & Rolling Pins",
    content: "Wood is porous — gluten gets into the tiny grooves and scratches and won't fully wash out, even with soap and hot water. If a wooden spoon or rolling pin has ever been used with regular flour or pasta, it is not safe for GF cooking. Replace them with silicone or metal alternatives, or keep a dedicated set that has only ever touched gluten-free food.",
  },
  {
    id: "t11",
    categoryId: "kitchen-safety",
    title: "Air Fryers",
    content: "Air fryers are almost impossible to fully decontaminate in a shared kitchen. The mesh basket, heating element, and interior walls trap crumbs and grease that are very hard to reach. If your household uses the air fryer for breaded foods, gluten-containing crumbs are likely embedded in it. Ideally, have a dedicated GF air fryer — or skip it and use the oven with a lined baking tray you control.",
  },
  {
    id: "t8",
    categoryId: "eating-out",
    title: "Fryers",
    content: "Even if french fries are just potatoes, if they are cooked in the same oil as breaded chicken or onion rings, they are heavily contaminated. Always ask: 'Is there a dedicated gluten-free fryer?'",
  },
  {
    id: "t14",
    categoryId: "eating-out",
    title: "Gloves, Surfaces & Prep Areas",
    content: "A kitchen that handles gluten all day has flour and crumbs on every surface — including the hands of the staff. The three things that make the biggest difference are: fresh gloves (not just wiped hands), a clean prep surface that hasn't been used for gluten items, and ideally a dedicated area or section of the kitchen for allergen orders. When ordering, it's completely reasonable to ask: 'Can you change gloves and use a clean surface for my order?' A kitchen that takes celiac seriously will say yes without hesitation.",
  },
  {
    id: "t20",
    categoryId: "travel",
    title: "Religious Services",
    content: "Many religious traditions involve shared food or drink as part of ceremony — and several of those foods contain gluten. The good news: most communities are genuinely happy to accommodate when asked ahead of time.\n\nChristian communion: Standard wafers are made from wheat and are not safe. Wine from a shared cup can pick up crumbs. Catholic parishes can request low-gluten hosts approved for celiacs (contact the parish office in advance); receiving wine only from a separate cup is also an option. Many Protestant and non-denominational churches offer gluten-free wafers or individual sealed cups — just ask.\n\nJewish observance: Passover matzah is made from wheat and is not safe. Some communities offer certified gluten-free oat matzah as an alternative — ask your rabbi well in advance so they can source it.\n\nIslamic observance: Most of the ritual practices in Islam (prayer, fasting, recitation) don't involve shared food. Communal meals (like iftar during Ramadan) can be navigated the same way as any group meal — let the host know ahead of time.\n\nHindu and other traditions with prasad: Prasad (blessed food offered to guests) can contain wheat — laddoo, halwa, and puri are common examples. It's completely respectful to accept it, hold it, and decline to eat it, or to quietly let the host know beforehand that you have a medical condition.\n\nThe pattern across all traditions: reach out before you attend. Whether it's a priest, rabbi, imam, pandit, or event organizer — people almost always want to include everyone and will work with you when they understand the need.",
  },
  {
    id: "t19",
    categoryId: "travel",
    title: "ADA & No-Food Policies",
    content: "Celiac disease qualifies as a disability under the Americans with Disabilities Act (ADA). This means venues and events that have a 'no outside food or drink' policy are generally required to provide reasonable accommodations — including allowing you to bring your own safe food in.\n\nHow to handle it: contact the venue ahead of time, explain that you have a medical condition requiring a special diet, and ask for accommodation in writing if possible. Most venues will say yes without much pushback once they know it's a medical need.\n\nAt the door: if staff question your snacks, calmly say: 'I have celiac disease, which is a disability covered by the ADA. I'm not able to safely eat the food sold here and I need to bring my own.' You don't owe anyone a long explanation, and you don't need a doctor's note on hand — though having one on your phone as a PDF can make conversations easier.\n\nThis applies to concerts, sporting events, theme parks, theaters, and other public venues. Private clubs and some religious organizations have different rules, but most commercial venues are covered.",
  },
  {
    id: "t16",
    categoryId: "travel",
    title: "Snacks",
    content: "The best travel snacks are ones that won't melt in a hot car or a warm pocket and don't need refrigeration. Reach for high-protein options over high-sugar ones — protein keeps energy steady for hours, while sugar gives a quick spike and then a crash. Good options: individual packets of nut butter (almond, peanut, sunflower), beef or turkey jerky (check labels — some use soy sauce or malt vinegar), roasted chickpeas, nuts and seeds, hard cheeses in sealed packaging, and rice cakes. Avoid chocolate bars or yogurt-covered anything in warm weather — they make a mess and the sugar hit fades fast.",
  },
  {
    id: "t9",
    categoryId: "travel",
    title: "TSA",
    content: "You can bring your own food through airport security! Solid foods are totally fine. If bringing something spreadable, keep it under 3.4oz. Always pack more safe snacks than you think you'll need.",
  },
];

export const CATEGORIES: { id: TipCategory; label: string; icon: any }[] = [
  { id: "hidden-gluten", label: "Hidden Gluten", icon: "search" },
  { id: "kitchen-safety", label: "Shared Kitchens", icon: "home" },
  { id: "eating-out", label: "Eating Out", icon: "coffee" },
  { id: "travel", label: "Travel & On-the-Go", icon: "briefcase" },
];
