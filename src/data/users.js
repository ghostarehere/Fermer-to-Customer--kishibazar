// ══════════════════════════════════════════════════════════════
// Demo Users — Admin, Farmers, Customer, Couriers
// In production, replace with real authentication + database.
// ══════════════════════════════════════════════════════════════

export const USERS = [
  { id: 1, name: "Admin User", phone: "01700000000", password: "admin123", role: "admin", verified: true },
  { id: 2, name: "রহিম উদ্দিন", phone: "01811111111", password: "farmer123", role: "farmer", verified: true, location: "গাজীপুর", bio: "২০ বছরের অভিজ্ঞ সবজি চাষি।", emoji: "👨‍🌾", rating: 4.8, sales: 310, earnings: 24800 },
  { id: 3, name: "সুমাইয়া বেগম", phone: "01822222222", password: "farmer456", role: "farmer", verified: true, location: "রংপুর", bio: "আলু ও শীতকালীন সবজি বিশেষজ্ঞ।", emoji: "👩‍🌾", rating: 4.6, sales: 210, earnings: 18200 },
  { id: 4, name: "নুরুল ইসলাম", phone: "01833333333", password: "farmer789", role: "farmer", verified: false, location: "সুন্দরবন", bio: "খাঁটি মধু সংগ্রহকারী।", emoji: "👨‍🌾", rating: 5.0, sales: 41, earnings: 18500 },
  { id: 5, name: "Customer User", phone: "01900000000", password: "user123", role: "customer", verified: true },
  { id: 6, name: "মোহাম্মদ রাজু", phone: "01912345678", password: "courier123", role: "courier", verified: true, courierId: 1, zone: "ঢাকা উত্তর", vehicle: "মোটরসাইকেল", emoji: "🧑‍✈️", rating: 4.9 },
  { id: 7, name: "সালমা বেগম", phone: "01823456789", password: "courier456", role: "courier", verified: true, courierId: 2, zone: "ঢাকা দক্ষিণ", vehicle: "সাইকেল", emoji: "👩‍✈️", rating: 4.7 },
];
