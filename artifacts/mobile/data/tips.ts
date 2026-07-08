export type TipCategory = "hidden-gluten" | "kitchen-safety" | "eating-out" | "travel";

export type Tip = {
  id: string;
  categoryId: TipCategory;
  title: string;
  content: string;
  isImportant?: boolean;
};

export const TIPS: Tip[] = [
  {
    id: "t1",
    categoryId: "hidden-gluten",
    title: "Soy Sauce",
    content: "Traditional soy sauce is brewed with wheat. Always look for 'Tamari' or specifically labeled Gluten-Free soy sauce. If a restaurant marinates their meat, always ask if they use soy sauce.",
    isImportant: true,
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
    title: "Licorice & Candy",
    content: "Many licorice candies (like Twizzlers or Red Vines) list wheat flour as their second ingredient. Always check candy labels!",
  },
  {
    id: "t5",
    categoryId: "kitchen-safety",
    title: "The Toaster Rule",
    content: "You need your own dedicated gluten-free toaster. Crumbs accumulate and burn, and putting GF bread in a shared toaster is a major cross-contamination risk. A cheap separate toaster is a lifesaver.",
    isImportant: true,
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
    isImportant: true,
  },
  {
    id: "t11",
    categoryId: "kitchen-safety",
    title: "Air Fryers",
    content: "Air fryers are almost impossible to fully decontaminate in a shared kitchen. The mesh basket, heating element, and interior walls trap crumbs and grease that are very hard to reach. If your household uses the air fryer for breaded foods, gluten-containing crumbs are likely embedded in it. Ideally, have a dedicated GF air fryer — or skip it and use the oven with a lined baking tray you control.",
    isImportant: true,
  },
  {
    id: "t8",
    categoryId: "eating-out",
    title: "The Fryer Problem",
    content: "Even if french fries are just potatoes, if they are cooked in the same oil as breaded chicken or onion rings, they are heavily contaminated. Always ask: 'Is there a dedicated gluten-free fryer?'",
    isImportant: true,
  },
  {
    id: "t9",
    categoryId: "travel",
    title: "TSA & Snacks",
    content: "You can bring your own food through airport security! Solid foods are totally fine. If bringing something spreadable, keep it under 3.4oz. Always pack more safe snacks than you think you'll need.",
  },
];

export const CATEGORIES: { id: TipCategory; label: string; icon: any }[] = [
  { id: "hidden-gluten", label: "Hidden Gluten", icon: "search" },
  { id: "kitchen-safety", label: "Shared Kitchens", icon: "home" },
  { id: "eating-out", label: "Eating Out", icon: "coffee" },
  { id: "travel", label: "Travel & On-the-Go", icon: "briefcase" },
];
