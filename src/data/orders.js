// ══════════════════════════════════════════════════════════════
// Demo Orders — Seeded order history across all statuses/stages
// ══════════════════════════════════════════════════════════════

export const INIT_ORDERS = [
  { id: "KB1001", customerId: 5, customerName: "আরিফ হোসেন", phone: "01911111111", address: "মিরপুর-১০, ঢাকা", items: [{ productId: 1, qty: 3, price: 40, farmerId: 2 }, { productId: 6, qty: 2, price: 25, farmerId: 2 }], total: 170, payment: "bkash", status: "delivered", stage: "delivered", courierId: 1, created: "২০২৫-০১-১০", zone: "ঢাকা উত্তর" },
  { id: "KB1002", customerId: 5, customerName: "সুমাইয়া খান", phone: "01922222222", address: "ধানমন্ডি, ঢাকা", items: [{ productId: 5, qty: 1, price: 450, farmerId: 4 }], total: 450, payment: "nagad", status: "transit", stage: "transit", courierId: 2, created: "২০২৫-০১-১১", zone: "ঢাকা দক্ষিণ" },
  { id: "KB1003", customerId: 5, customerName: "রফিকুল ইসলাম", phone: "01933333333", address: "গাজীপুর সদর", items: [{ productId: 3, qty: 5, price: 35, farmerId: 3 }, { productId: 7, qty: 1, price: 180, farmerId: 3 }], total: 355, payment: "cash", status: "pending", stage: "placed", courierId: null, created: "২০২৫-০১-১২", zone: "গাজীপুর" },
  { id: "KB1004", customerId: 5, customerName: "নাজমা বেগম", phone: "01944444444", address: "নারায়ণগঞ্জ বন্দর", items: [{ productId: 8, qty: 2, price: 200, farmerId: 2 }], total: 400, payment: "bkash", status: "confirmed", stage: "assigned", courierId: 1, created: "২০২৫-০১-১২", zone: "নারায়ণগঞ্জ" },
  { id: "KB1005", customerId: 5, customerName: "হাসান মাহমুদ", phone: "01955555555", address: "সাভার বাজার", items: [{ productId: 1, qty: 2, price: 40, farmerId: 2 }, { productId: 2, qty: 3, price: 55, farmerId: 2 }], total: 245, payment: "cash", status: "delivered", stage: "delivered", courierId: 2, created: "২০২৫-০১-09", zone: "সাভার" },
  { id: "KB1006", customerId: 5, customerName: "রিনা আক্তার", phone: "01966666666", address: "উত্তরা সেক্টর ৬, ঢাকা", items: [{ productId: 6, qty: 4, price: 25, farmerId: 2 }], total: 100, payment: "bkash", status: "confirmed", stage: "picked", courierId: 1, created: "২০২৫-০১-১৩", zone: "ঢাকা উত্তর" },
  { id: "KB1007", customerId: 5, customerName: "কামাল হোসেন", phone: "01977777777", address: "মোহাম্মদপুর, ঢাকা", items: [{ productId: 9, qty: 2, price: 35, farmerId: 3 }], total: 70, payment: "cash", status: "pending", stage: "placed", courierId: null, created: "২০২৫-০১-১৩", zone: "ঢাকা দক্ষিণ" },
];
