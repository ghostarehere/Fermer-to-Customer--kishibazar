import { C } from "../styles/theme";

// ══════════════════════════════════════════════════════════════
// Constant lookup tables shared across portals
// ══════════════════════════════════════════════════════════════

export const CATS = {
  all: "সব পণ্য",
  vegetables: "সবজি",
  fruits: "ফল",
  greens: "শাক",
  poultry: "পোল্ট্রি",
  spices: "মসলা",
  others: "অন্যান্য",
};

export const STATUS_COLOR = {
  pending: C.harvest,
  confirmed: C.blue,
  transit: C.orange,
  delivered: C.leaf,
  cancelled: C.red,
};

export const STATUS_LABEL = {
  pending: "অপেক্ষমাণ",
  confirmed: "নিশ্চিত",
  transit: "পথে",
  delivered: "সম্পন্ন",
  cancelled: "বাতিল",
};
