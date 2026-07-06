import { C } from "../styles/theme";

// ══════════════════════════════════════════════════════════════
// Couriers — Delivery agents
// ══════════════════════════════════════════════════════════════
export const COURIERS = [
  { id: 1, userId: 6, name: "মোহাম্মদ রাজু", phone: "01912345678", zone: "ঢাকা উত্তর", vehicle: "মোটরসাইকেল", active: true, deliveries: 142, rating: 4.9, avatar: "🧑‍✈️" },
  { id: 2, userId: 7, name: "সালমা বেগম", phone: "01823456789", zone: "ঢাকা দক্ষিণ", vehicle: "সাইকেল", active: true, deliveries: 98, rating: 4.7, avatar: "👩‍✈️" },
  { id: 3, userId: null, name: "তারেক হোসেন", phone: "01556789012", zone: "গাজীপুর", vehicle: "ভ্যান", active: true, deliveries: 188, rating: 4.9, avatar: "🧑‍✈️" },
];

// ══════════════════════════════════════════════════════════════
// Delivery Stages — Ordered pipeline used by tracking UI
// ══════════════════════════════════════════════════════════════
export const DELIVERY_STAGES = [
  { key: "placed", icon: "📋", label: "অর্ডার হয়েছে", color: C.muted },
  { key: "assigned", icon: "👷", label: "কুরিয়ার নিযুক্ত", color: C.blue },
  { key: "picked", icon: "📦", label: "পণ্য সংগ্রহ হয়েছে", color: C.orange },
  { key: "transit", icon: "🚚", label: "পথে আছে", color: C.harvest },
  { key: "nearby", icon: "📍", label: "কাছাকাছি এসেছে", color: C.purple },
  { key: "delivered", icon: "✅", label: "ডেলিভারি সম্পন্ন", color: C.leaf },
];
