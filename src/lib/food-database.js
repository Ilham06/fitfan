// Nutritional values per 100 grams
// Sources: Indonesian food composition table (TKPI), USDA
const FOOD_DATABASE = [
  // === PROTEIN SOURCES ===
  { name: "Ayam Dada (Breast)", category: "Protein", calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0 },
  { name: "Ayam Paha (Thigh)", category: "Protein", calories: 209, protein: 26, carbs: 0, fat: 10.9, fiber: 0 },
  { name: "Ayam Sayap (Wing)", category: "Protein", calories: 203, protein: 30.5, carbs: 0, fat: 8.1, fiber: 0 },
  { name: "Daging Sapi", category: "Protein", calories: 250, protein: 26, carbs: 0, fat: 15, fiber: 0 },
  { name: "Daging Sapi Giling", category: "Protein", calories: 254, protein: 17.2, carbs: 0, fat: 20, fiber: 0 },
  { name: "Daging Kambing", category: "Protein", calories: 258, protein: 25.6, carbs: 0, fat: 16.6, fiber: 0 },
  { name: "Ikan Salmon", category: "Protein", calories: 208, protein: 20, carbs: 0, fat: 13.4, fiber: 0 },
  { name: "Ikan Tuna", category: "Protein", calories: 132, protein: 28, carbs: 0, fat: 1.3, fiber: 0 },
  { name: "Ikan Lele", category: "Protein", calories: 105, protein: 18.4, carbs: 0, fat: 2.8, fiber: 0 },
  { name: "Ikan Nila", category: "Protein", calories: 128, protein: 26, carbs: 0, fat: 2.6, fiber: 0 },
  { name: "Ikan Tongkol", category: "Protein", calories: 109, protein: 24, carbs: 0, fat: 1, fiber: 0 },
  { name: "Udang", category: "Protein", calories: 99, protein: 24, carbs: 0.2, fat: 0.3, fiber: 0 },
  { name: "Cumi-Cumi", category: "Protein", calories: 92, protein: 15.6, carbs: 3.1, fat: 1.4, fiber: 0 },
  { name: "Telur Ayam (whole)", category: "Protein", calories: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0 },
  { name: "Telur Putih", category: "Protein", calories: 52, protein: 11, carbs: 0.7, fat: 0.2, fiber: 0 },
  { name: "Telur Puyuh", category: "Protein", calories: 158, protein: 13.1, carbs: 0.4, fat: 11, fiber: 0 },
  { name: "Tahu", category: "Protein", calories: 76, protein: 8, carbs: 1.9, fat: 4.8, fiber: 0.3 },
  { name: "Tempe", category: "Protein", calories: 192, protein: 20.3, carbs: 7.6, fat: 10.8, fiber: 1.4 },

  // === CARBS / STAPLES ===
  { name: "Nasi Putih", category: "Karbohidrat", calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4 },
  { name: "Nasi Merah", category: "Karbohidrat", calories: 123, protein: 2.7, carbs: 25.6, fat: 0.8, fiber: 1.8 },
  { name: "Oatmeal (kering)", category: "Karbohidrat", calories: 389, protein: 16.9, carbs: 66.3, fat: 6.9, fiber: 10.6 },
  { name: "Roti Tawar", category: "Karbohidrat", calories: 265, protein: 9, carbs: 49, fat: 3.2, fiber: 2.7 },
  { name: "Roti Gandum", category: "Karbohidrat", calories: 247, protein: 13, carbs: 41, fat: 3.4, fiber: 7 },
  { name: "Mie Instan (mentah)", category: "Karbohidrat", calories: 458, protein: 9, carbs: 63, fat: 18, fiber: 2 },
  { name: "Mie Telur (rebus)", category: "Karbohidrat", calories: 138, protein: 4.5, carbs: 25, fat: 2.1, fiber: 1.2 },
  { name: "Kentang Rebus", category: "Karbohidrat", calories: 87, protein: 1.9, carbs: 20, fat: 0.1, fiber: 1.8 },
  { name: "Ubi Jalar", category: "Karbohidrat", calories: 86, protein: 1.6, carbs: 20, fat: 0.1, fiber: 3 },
  { name: "Singkong", category: "Karbohidrat", calories: 160, protein: 1.4, carbs: 38, fat: 0.3, fiber: 1.8 },
  { name: "Jagung Rebus", category: "Karbohidrat", calories: 96, protein: 3.4, carbs: 21, fat: 1.5, fiber: 2.4 },
  { name: "Pasta (rebus)", category: "Karbohidrat", calories: 131, protein: 5, carbs: 25, fat: 1.1, fiber: 1.8 },
  { name: "Granola", category: "Karbohidrat", calories: 471, protein: 10, carbs: 64, fat: 20, fiber: 5 },

  // === VEGETABLES ===
  { name: "Brokoli", category: "Sayuran", calories: 34, protein: 2.8, carbs: 7, fat: 0.4, fiber: 2.6 },
  { name: "Bayam", category: "Sayuran", calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2 },
  { name: "Kangkung", category: "Sayuran", calories: 19, protein: 2.6, carbs: 3.1, fat: 0.2, fiber: 2 },
  { name: "Wortel", category: "Sayuran", calories: 41, protein: 0.9, carbs: 10, fat: 0.2, fiber: 2.8 },
  { name: "Tomat", category: "Sayuran", calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2 },
  { name: "Timun", category: "Sayuran", calories: 15, protein: 0.7, carbs: 3.6, fat: 0.1, fiber: 0.5 },
  { name: "Kacang Panjang", category: "Sayuran", calories: 47, protein: 2.8, carbs: 8.4, fat: 0.4, fiber: 3.4 },
  { name: "Tauge", category: "Sayuran", calories: 31, protein: 3.1, carbs: 5.9, fat: 0.2, fiber: 1.8 },
  { name: "Sawi Hijau", category: "Sayuran", calories: 27, protein: 2.9, carbs: 4.7, fat: 0.2, fiber: 3.2 },
  { name: "Terong", category: "Sayuran", calories: 25, protein: 1, carbs: 6, fat: 0.2, fiber: 3 },

  // === FRUITS ===
  { name: "Pisang", category: "Buah", calories: 89, protein: 1.1, carbs: 23, fat: 0.3, fiber: 2.6 },
  { name: "Apel", category: "Buah", calories: 52, protein: 0.3, carbs: 14, fat: 0.2, fiber: 2.4 },
  { name: "Jeruk", category: "Buah", calories: 47, protein: 0.9, carbs: 12, fat: 0.1, fiber: 2.4 },
  { name: "Mangga", category: "Buah", calories: 60, protein: 0.8, carbs: 15, fat: 0.4, fiber: 1.6 },
  { name: "Pepaya", category: "Buah", calories: 43, protein: 0.5, carbs: 11, fat: 0.3, fiber: 1.7 },
  { name: "Semangka", category: "Buah", calories: 30, protein: 0.6, carbs: 8, fat: 0.2, fiber: 0.4 },
  { name: "Alpukat", category: "Buah", calories: 160, protein: 2, carbs: 8.5, fat: 14.7, fiber: 6.7 },
  { name: "Kurma", category: "Buah", calories: 277, protein: 1.8, carbs: 75, fat: 0.2, fiber: 6.7 },

  // === DAIRY ===
  { name: "Susu Full Cream", category: "Dairy", calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3, fiber: 0 },
  { name: "Susu Skim", category: "Dairy", calories: 34, protein: 3.4, carbs: 5, fat: 0.1, fiber: 0 },
  { name: "Yogurt Plain", category: "Dairy", calories: 59, protein: 10, carbs: 3.6, fat: 0.4, fiber: 0 },
  { name: "Greek Yogurt", category: "Dairy", calories: 97, protein: 9, carbs: 3.4, fat: 5, fiber: 0 },
  { name: "Keju Cheddar", category: "Dairy", calories: 403, protein: 25, carbs: 1.3, fat: 33, fiber: 0 },
  { name: "Keju Mozzarella", category: "Dairy", calories: 280, protein: 28, carbs: 3.1, fat: 17, fiber: 0 },
  { name: "Whey Protein (scoop)", category: "Dairy", calories: 120, protein: 24, carbs: 3, fat: 1.5, fiber: 0 },

  // === FATS & NUTS ===
  { name: "Kacang Tanah", category: "Lemak & Kacang", calories: 567, protein: 25.8, carbs: 16, fat: 49, fiber: 8.5 },
  { name: "Kacang Almond", category: "Lemak & Kacang", calories: 579, protein: 21, carbs: 22, fat: 50, fiber: 12.5 },
  { name: "Kacang Mete", category: "Lemak & Kacang", calories: 553, protein: 18, carbs: 30, fat: 44, fiber: 3.3 },
  { name: "Selai Kacang", category: "Lemak & Kacang", calories: 588, protein: 25, carbs: 20, fat: 50, fiber: 6 },
  { name: "Minyak Zaitun (1 sdm)", category: "Lemak & Kacang", calories: 884, protein: 0, carbs: 0, fat: 100, fiber: 0 },
  { name: "Minyak Kelapa (1 sdm)", category: "Lemak & Kacang", calories: 862, protein: 0, carbs: 0, fat: 100, fiber: 0 },
  { name: "Santan", category: "Lemak & Kacang", calories: 230, protein: 2.3, carbs: 5.5, fat: 24, fiber: 0 },
  { name: "Kelapa Parut", category: "Lemak & Kacang", calories: 354, protein: 3.3, carbs: 15, fat: 33, fiber: 9 },

  // === COMMON INDONESIAN DISHES (estimated per 100g serving) ===
  { name: "Nasi Goreng", category: "Masakan", calories: 168, protein: 5, carbs: 24, fat: 6, fiber: 0.8 },
  { name: "Mie Goreng", category: "Masakan", calories: 175, protein: 5, carbs: 23, fat: 7, fiber: 1 },
  { name: "Soto Ayam (kuah)", category: "Masakan", calories: 55, protein: 6, carbs: 2, fat: 2.5, fiber: 0.3 },
  { name: "Rendang Sapi", category: "Masakan", calories: 193, protein: 17, carbs: 3, fat: 13, fiber: 0.5 },
  { name: "Ayam Goreng Tepung", category: "Masakan", calories: 260, protein: 20, carbs: 12, fat: 15, fiber: 0.5 },
  { name: "Ayam Goreng Kremes", category: "Masakan", calories: 240, protein: 22, carbs: 8, fat: 14, fiber: 0.3 },
  { name: "Bakso Sapi (bola)", category: "Masakan", calories: 202, protein: 11, carbs: 14, fat: 11, fiber: 0.2 },
  { name: "Gado-Gado", category: "Masakan", calories: 145, protein: 7, carbs: 12, fat: 8, fiber: 3 },
  { name: "Pecel Lele", category: "Masakan", calories: 180, protein: 16, carbs: 8, fat: 10, fiber: 0.5 },
  { name: "Sate Ayam (tusuk)", category: "Masakan", calories: 150, protein: 18, carbs: 5, fat: 7, fiber: 0.2 },
  { name: "Nasi Uduk", category: "Masakan", calories: 180, protein: 3, carbs: 28, fat: 6.5, fiber: 0.5 },
  { name: "Lontong/Ketupat", category: "Masakan", calories: 120, protein: 2.4, carbs: 26, fat: 0.2, fiber: 0.5 },
  { name: "Indomie Goreng", category: "Masakan", calories: 458, protein: 9, carbs: 63, fat: 18, fiber: 2 },
  { name: "Bubur Ayam", category: "Masakan", calories: 65, protein: 3.5, carbs: 10, fat: 1.2, fiber: 0.3 },
  { name: "Cap Cay", category: "Masakan", calories: 70, protein: 4, carbs: 6, fat: 3.5, fiber: 2 },

  // === SNACKS & EXTRAS ===
  { name: "Roti Canai / Roti Maryam", category: "Snack", calories: 301, protein: 6, carbs: 38, fat: 14, fiber: 1.5 },
  { name: "Martabak Telur (porsi)", category: "Snack", calories: 230, protein: 10, carbs: 20, fat: 12, fiber: 1 },
  { name: "Gorengan (Bakwan)", category: "Snack", calories: 270, protein: 4, carbs: 30, fat: 15, fiber: 1.5 },
  { name: "Kerupuk", category: "Snack", calories: 465, protein: 5, carbs: 62, fat: 22, fiber: 0.5 },
  { name: "Keripik Singkong", category: "Snack", calories: 520, protein: 1.5, carbs: 56, fat: 32, fiber: 3 },

  // === DRINKS ===
  { name: "Kopi Hitam (tanpa gula)", category: "Minuman", calories: 2, protein: 0.3, carbs: 0, fat: 0, fiber: 0 },
  { name: "Teh Manis", category: "Minuman", calories: 40, protein: 0, carbs: 10, fat: 0, fiber: 0 },
  { name: "Es Jeruk", category: "Minuman", calories: 50, protein: 0.5, carbs: 12, fat: 0.1, fiber: 0.2 },
  { name: "Jus Alpukat + Susu", category: "Minuman", calories: 120, protein: 2.5, carbs: 12, fat: 7, fiber: 2 },

  // === SUPPLEMENTS ===
  { name: "Creatine Monohydrate (5g)", category: "Suplemen", calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
  { name: "BCAA (1 scoop)", category: "Suplemen", calories: 10, protein: 2.5, carbs: 0, fat: 0, fiber: 0 },
  { name: "Mass Gainer (1 scoop)", category: "Suplemen", calories: 650, protein: 32, carbs: 110, fat: 8, fiber: 3 },
];

export const FOOD_CATEGORIES = [
  "Semua",
  "Protein",
  "Karbohidrat",
  "Sayuran",
  "Buah",
  "Dairy",
  "Lemak & Kacang",
  "Masakan",
  "Snack",
  "Minuman",
  "Suplemen",
];

export default FOOD_DATABASE;
