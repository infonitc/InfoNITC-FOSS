// Mess Day Menus (7-day rotation)
export const MESS_DAY_MENU = {
  "Day 1": {
    breakfast: "Masala Dosa, Idly, Vada, Poha, Chutney, Sambar",
    lunch: "Chicken Dry Fry / Fish Fry with Gravy / Omelette, Rajma Masala, Aloo Fry, Sweets/Sliced Fruits, Pachhadi\n+ Rice, Sambar, Buttermilk, Moru Curry/Rasam, Pickle, Chapathi/Tandoori Roti, Dal, Pappad, Cut Fruits, Thoran",
    eveningTea: "Snacks",
    dinner: "Chicken Curry / Aloo Gobi Dry, Gulab Jamun/Sliced Fruits, Green Peas Kuruma, Porotta, Pathiri\n+ Rice, Sambar, Dal, Chapathi/Roti, Buttermilk/Curd, Pappad, Veg Salad",
  },
  "Day 2": {
    breakfast: "Poori, Bhaji, Vellappam, Veg Stew, Oothappam, Chutney, Sambar",
    lunch: "Chicken Biriyani / Veg Biriyani, Gopi Manchurian or Podi Paneer, Raita\n+ Rice, Sambar, Buttermilk, Moru Curry/Rasam, Pickle, Chapathi/Tandoori Roti, Dal, Pappad, Cut Fruits, Thoran",
    eveningTea: "Snacks",
    dinner: "Pulao, Mix Veg Sabji or Soya Fry, Dal Tadka, Sweets/Sliced Fruits, Puttu, Kadala Curry\n+ Rice, Sambar, Dal, Chapathi/Roti, Buttermilk/Curd, Pappad, Veg Salad",
  },
  "Day 3": {
    breakfast: "Rava Dosa, Chutney, Sambar, Pathiri, Green Peas Curry",
    lunch: "Chicken Dry Fry / Fish Fry / Omelette / Ladies Finger Dry Sabji or Aloo Gobi, Sweets/Sliced Fruits, Kootu Curry\n+ Rice, Sambar, Buttermilk, Moru Curry/Rasam, Pickle, Chapathi/Tandoori Roti, Dal, Pappad, Cut Fruits, Thoran",
    eveningTea: "Snacks",
    dinner: "Egg Masala / Egg Burjee / Mutter Paneer or Mix Veg with Mushroom, Vellappam, Sabji\n+ Rice, Sambar, Dal, Chapathi/Roti, Buttermilk/Curd, Pappad, Veg Salad",
  },
  "Day 4": {
    breakfast: "Idli, Vada, Chutney, Sambar, Noolputtu, Kadala Curry, Aloo Paratha, Curd",
    lunch: "Chicken Dry Fry / Fish Fry / Omelette, Aloo Soybean, Sweets/Sliced Fruits, Kovakka Fry\n+ Rice, Sambar, Buttermilk, Moru Curry/Rasam, Pickle, Chapathi/Tandoori Roti, Dal, Pappad, Cut Fruits, Thoran",
    eveningTea: "Snacks",
    dinner: "Veg Fried Rice, Veg Manchurian, Aloo Mutter Sabji, Sweets/Sliced Fruits\n+ Rice, Sambar, Dal, Chapathi/Roti, Buttermilk/Curd, Pappad, Veg Salad",
  },
  "Day 5": {
    breakfast: "Paav Bhaji, Vellappam, Veg Stew, Millet Upma or Rava Upma",
    lunch: "Mandi – Alfahm (Peri Peri) / Veg Mandi, Kadai Veg, Gulab Jamun/Sliced Fruits, Veg Mayonnaise\n+ Rice, Sambar, Buttermilk, Moru Curry/Rasam, Pickle, Chapathi/Tandoori Roti, Dal, Pappad, Cut Fruits, Thoran",
    eveningTea: "Snacks",
    dinner: "Chilly Chicken / Paneer Burjee or Capsicum Corn Curry, Sliced Fruits, Nice Pathiri\n+ Rice, Sambar, Dal, Chapathi/Roti, Buttermilk/Curd, Pappad, Veg Salad",
  },
  "Day 6": {
    breakfast: "Poori Bhaji, Poha & Namkeen, Puttu, Kadala",
    lunch: "Mini Meals: Bisibele Bath, Boondi, Tomato Rice, Curd Rice, Chapathi, Chana Masala, Thoran, Raita, Sweet, Pappadam\n+ Rice, Sambar, Buttermilk, Pickle, Dal, Cut Fruits",
    eveningTea: "Snacks",
    dinner: "Ghee Rice, Kadai Chicken / Chhole Bhatura, Kadai Paneer, Kheer\n+ Rice, Sambar, Dal, Chapathi/Roti, Buttermilk/Curd, Pappad, Veg Salad",
  },
  "Day 7": {
    breakfast: "Aloo Paratha or Mix Veg Paratha, Curd, Pongal, Nool Puttu, Kadala Curry",
    lunch: "Chicken Biriyani / Egg Biriyani / Veg Biriyani, Paneer Butter Masala, Pickle, Raita\n+ Rice, Sambar, Buttermilk, Moru Curry/Rasam, Pickle, Chapathi/Tandoori Roti, Dal, Pappad, Cut Fruits, Thoran",
    eveningTea: "Snacks",
    dinner: "Veg Pulao or Jeera Rice, Chilly Gopi, Thattu Dosa with Chutney & Sambar, Any Veg Soup\n+ Rice, Sambar, Dal, Chapathi/Roti, Buttermilk/Curd, Pappad, Veg Salad",
  },
};

// Monday offset for each mess (from the official rotation table)
export const MESS_OFFSETS = {
  A: 1, B: 7, C: 6, D: 5, F: 4, G: 3, PG2: 2,
  "MBH1-1": 1, "MBH1-2": 7, "MBH2-1": 6, "MBH2-2": 5, MBA: 4,
  LH1: 3, MLH1: 2, MLH2: 1,
};

export const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

function getMessDayForDay(offset, dayIndex) {
  return `Day ${((offset - 1 + dayIndex) % 7) + 1}`;
}

function buildMessMenu(messName) {
  const offset = MESS_OFFSETS[messName];
  const menu = {};
  DAYS.forEach((day, i) => {
    const dayKey = getMessDayForDay(offset, i);
    menu[day] = { ...MESS_DAY_MENU[dayKey], _dayKey: dayKey };
  });
  return menu;
}

const E_MESS = {
  Monday:    { breakfast: "Masala Dosa, Sambar, Chutney, Poha", lunch: "Kariyapag Rice, Veg Chettinadu, Tomato Dal, Kadai Paneer", eveningTea: "Veg Samosa, Atukulu, Katta Meetha", dinner: "Chikudkaya Masala, Pineapple Rasam, Dum Aloo\n+ Rice, Kerala Rice, Sambar, Rasam, Buttermilk, Pickle, Chapathi/Roti, Dal, Papad, Veg Salad" },
  Tuesday:   { breakfast: "Poori Bhaji, Wheat Upma, Chutney", lunch: "Tomato Rice, Soy Palak, Turai Ki Dal, Pepper Rasam, Palak Paneer, Curd", eveningTea: "Bread Pakoda, Chana Chat, Green Chutney", dinner: "Aloo Jeera, Bhindi Masala, Dal Kichdi\n+ Rice, Kerala Rice, Sambar, Rasam, Buttermilk, Pickle, Chapathi/Roti, Dal, Papad, Veg Salad" },
  Wednesday: { breakfast: "Oothappam, Sambar, Chutney, Moong Dal or Besan Chilla", lunch: "Coconut Rice, Gutti Vankaya, Aloo Gobi Sabji", eveningTea: "Veg Manchurian, Bhel Puri, Katta Meetha", dinner: "Paneer Khurchen, Kadi Pakoda, Pappu Charu, Aloo Chat Salad\n+ Rice, Kerala Rice, Sambar, Rasam, Buttermilk, Pickle, Chapathi/Roti, Dal, Papad, Veg Salad" },
  Thursday:  { breakfast: "Idly, Sambar, Chutney, Aloo Paratha, Curd", lunch: "Pulav Rice, Shahi Paneer, Palak Dal, Kerala Sambar", eveningTea: "Peanut Chat, Punugulu, Katta Meetha", dinner: "Cabbage Thoran, Chole Bhature, Curd Rice\n+ Rice, Kerala Rice, Sambar, Rasam, Buttermilk, Pickle, Chapathi/Roti, Dal, Papad, Veg Salad" },
  Friday:    { breakfast: "Set Dosa, Sambar, Chutney, Poha, Namkeen", lunch: "Jeera Rice, Kothmeer Vankaya, Dal Bhati, Lasun Chutney", eveningTea: "Kachori, Maggie, Katta Meetha", dinner: "Rajma Salad, Veg Kofta Curry, Arvi Pulusu, Kali Dal\n+ Rice, Kerala Rice, Sambar, Rasam, Buttermilk, Pickle, Chapathi/Roti, Dal, Papad, Veg Salad" },
  Saturday:  { breakfast: "Idly, Vada, Sambar, Chutney", lunch: "Vankaya Rice, Aloo Vepudu, Chowli Masala, Dal Makhani", eveningTea: "Onion Pakoda, Channa Chat, Katta Meetha", dinner: "Veg Noodles, Chilli Paneer Curry, Tawa Veg\n+ Rice, Kerala Rice, Sambar, Rasam, Buttermilk, Pickle, Chapathi/Roti, Dal, Papad, Veg Salad" },
  Sunday:    { breakfast: "Paav Bhaji (Toasted), Vermicelli or Rava/Wheat Upma, Lime, Onion, Boiled Chana", lunch: "Veg Pulao, Mushroom Masala, Tomato Rasam, Raita", eveningTea: "Vada Pav, Masala Pav, Tomato Sauce, Chutney", dinner: "Veg Biriyani, Pindi Chole, Mirchi Ka Salan, Onion, Lemon, Veg Raita\n+ Rice, Kerala Rice, Sambar, Rasam, Buttermilk, Pickle, Chapathi/Roti, Dal, Papad, Veg Salad" },
};

export const MESS_GROUPS = {
  "Boys (A–G, PG2)": ["Mess A","Mess B","Mess C","Mess D","Mess F","Mess G","Mess PG2"],
  "MBH": ["Mess MBH1-1","Mess MBH1-2","Mess MBH2-1","Mess MBH2-2","Mess MBA"],
  "Ladies": ["Mess LH1","Mess MLH1","Mess MLH2"],
  "Pure Veg (E)": ["Mess E (Pure Veg)"],
};

function buildAllMesses() {
  const obj = {};
  Object.keys(MESS_OFFSETS).forEach(m => { obj[`Mess ${m}`] = buildMessMenu(m); });
  obj["Mess E (Pure Veg)"] = E_MESS;
  return obj;
}

export const DEFAULT_DATA = {
  messMenu: buildAllMesses(),
  buses: [
    { route: "MBH → East Campus (Bus 1)", stops: "Mega Boys Hostel → Main Gate → Centre Circle → Architecture → East Campus", timings: ["7:20 AM","7:40 AM","8:00 AM","8:30 AM","8:50 AM","9:10 AM","9:40 AM","10:00 AM","10:50 AM","11:50 AM","12:20 PM","12:40 PM","1:00 PM","1:20 PM","1:50 PM","2:05 PM","3:00 PM","4:20 PM","4:50 PM","5:10 PM","5:30 PM","5:50 PM"] },
    { route: "MBH → East Campus (Bus 2)", stops: "Mega Boys Hostel → Main Gate → Centre Circle → Architecture → East Campus", timings: ["7:30 AM","7:50 AM","8:10 AM","8:40 AM","9:00 AM","9:35 AM","9:55 AM","10:05 AM","10:55 AM","12:10 PM","12:30 PM","12:50 PM","1:10 PM","1:40 PM","2:00 PM","2:55 PM","4:10 PM","4:40 PM","5:00 PM","5:20 PM","5:40 PM","6:00 PM"] },
    { route: "MBH → Architecture (A/C Bus)", stops: "Mega Boys Hostel → Main Gate → Centre Circle → Architecture", timings: ["8:55 AM","9:30 AM","9:50 AM","12:35 PM","12:55 PM","1:35 PM","1:55 PM","3:55 PM","4:35 PM","4:55 PM"] },
    { route: "East Campus → MBH (Bus 1)", stops: "East Campus → Architecture → Centre Circle → Main Gate → MBH", timings: ["7:30 AM","7:50 AM","8:20 AM","8:40 AM","9:00 AM","9:30 AM","9:50 AM","10:40 AM","11:40 AM","12:10 PM","12:20 PM","12:50 PM","1:10 PM","1:40 PM","1:55 PM","2:50 PM","4:10 PM","4:40 PM","5:00 PM","5:20 PM","5:40 PM"] },
    { route: "East Campus → MBH (Bus 2)", stops: "East Campus → Architecture → Centre Circle → Main Gate → MBH", timings: ["7:20 AM","7:40 AM","8:00 AM","8:30 AM","8:50 AM","9:25 AM","9:40 AM","9:55 AM","10:45 AM","12:00 PM","12:20 PM","12:40 PM","1:00 PM","1:30 PM","1:50 PM","2:45 PM","4:00 PM","4:30 PM","4:50 PM","5:10 PM","5:30 PM","5:50 PM"] },
    { route: "LH → East Campus (Bus 3)", stops: "Ladies Hostel → Main Gate → Centre Circle → Architecture → East Campus", timings: ["7:30 AM","8:10 AM","8:50 AM","9:10 AM","9:35 AM","10:55 AM","11:45 AM","12:15 PM","12:50 PM","1:10 PM","1:35 PM","2:50 PM","3:35 PM","4:00 PM","4:35 PM","5:00 PM","5:40 PM"] },
    { route: "LH → East Campus (Bus 4)", stops: "Ladies Hostel → Main Gate → Centre Circle → Architecture → East Campus", timings: ["7:40 AM","7:55 AM","8:30 AM","9:05 AM","9:25 AM","9:55 AM","10:15 AM","10:55 AM","12:05 PM","12:35 PM","12:50 PM","1:20 PM","1:45 PM","2:00 PM","3:50 PM","4:20 PM","4:40 PM","5:15 PM","5:40 PM","6:15 PM"] },
    { route: "LH → Architecture (A/C Bus)", stops: "Ladies Hostel → Main Gate → Centre Circle → Architecture", timings: ["8:55 AM","9:30 AM","9:55 AM","12:30 PM","12:55 PM","1:30 PM","1:50 PM","4:30 PM","4:50 PM"] },
    { route: "East Campus → LH (Bus 3)", stops: "East Campus → Architecture → Centre Circle → Main Gate → LH", timings: ["7:20 AM","7:35 AM (S)","8:02 AM","8:30 AM (S)","9:02 AM","9:27 AM","10:40 AM (S)","11:35 AM","11:55 AM (S)","12:30 PM (S)","1:00 PM","1:25 PM","1:40 PM (S)","3:15 PM (S)","3:52 PM","4:15 PM (S)","4:50 PM","5:15 PM (S)","5:30 PM","5:55 PM (S)"] },
    { route: "East Campus → LH (Bus 4)", stops: "East Campus → Architecture → Centre Circle → Main Gate → LH", timings: ["7:20 AM","7:48 AM","8:22 AM","8:45 AM (S)","9:17 AM","9:30 AM (S)","10:05 AM","10:45 AM","11:55 AM","12:25 PM","12:40 PM","1:00 PM (S)","1:25 PM (S)","1:52 PM","3:42 PM","4:10 PM","4:30 PM","4:50 PM (S)"] },
    { route: "South Campus → East Campus (Bus 3)", stops: "South Campus → LH → Main Gate → Centre Circle → Architecture → East Campus", timings: ["7:50 AM","8:45 AM","10:50 AM","12:10 PM","12:45 PM","1:50 PM","3:30 PM","4:30 PM","5:35 PM"] },
    { route: "South Campus → East Campus (Bus 4)", stops: "South Campus → LH → Main Gate → Centre Circle → Architecture → East Campus", timings: ["7:35 AM","9:00 AM","9:50 AM","1:15 PM","1:40 PM","5:10 PM","6:10 PM"] },
    { route: "Architecture → MBH (A/C Bus)", stops: "Architecture → Centre Circle → Main Gate → MBH", timings: ["9:10 AM","9:35 AM","12:00 PM","12:40 PM","1:20 PM","1:40 PM","3:40 PM","4:20 PM","4:40 PM"] },
    { route: "Architecture → LH (A/C Bus)", stops: "Architecture → Centre Circle → Main Gate → LH", timings: ["8:50 AM","9:20 AM","9:45 AM","12:20 PM","12:45 PM","1:20 PM","1:40 PM","4:20 PM","4:40 PM"] },
  ],
  notices: [
    { id: 1, title: "Semester Registration Open", body: "Odd semester 2025-26 registration is now open. Deadline: July 15, 2025. Log in to ERP portal to register.", date: "2025-07-01", tag: "Academic" },
    { id: 2, title: "NIT Calicut Techfest – TATHVA 2025", body: "Registrations open for India's largest student-run technical festival. Visit tathva.org for details.", date: "2025-06-28", tag: "Event" },
    { id: 3, title: "Hostel Allotment – New Students", body: "First-year hostel allotment letters have been sent. Report to hostel warden by July 20 with all documents.", date: "2025-06-25", tag: "Hostel" },
    { id: 4, title: "Library Working Hours Extended", body: "Central Library will now be open 24x7 during exam season. ID card mandatory for entry.", date: "2025-06-20", tag: "General" },
  ],
  contacts: [
    { name: "Director's Office", number: "0495-2286100", ext: "Ext 100" },
    { name: "Dean of Students", number: "0495-2286200", ext: "Ext 200" },
    { name: "Health Centre", number: "0495-2286300", ext: "24x7" },
    { name: "Security Office", number: "0495-2286400", ext: "24x7" },
    { name: "Hostel Office", number: "0495-2286500", ext: "Ext 500" },
    { name: "Academic Section", number: "0495-2286150", ext: "Ext 150" },
    { name: "Accounts Section", number: "0495-2286160", ext: "Ext 160" },
    { name: "IT Helpdesk", number: "0495-2286600", ext: "Ext 600" },
    { name: "Library", number: "0495-2286800", ext: "Ext 800" },
  ],
  clubs: [
    { name: "TATHVA – Tech Fest", category: "Technical", desc: "Annual national-level technical festival with competitions, workshops, and lectures.", contact: "tathva@nitc.ac.in" },
    { name: "RAGAM – Cultural Fest", category: "Cultural", desc: "South India's largest inter-collegiate cultural festival celebrating arts and performances.", contact: "ragam@nitc.ac.in" },
    { name: "IEEE Student Branch", category: "Technical", desc: "Student chapter of IEEE organizing seminars, hackathons, and technical talks.", contact: "ieee@nitc.ac.in" },
    { name: "NSS Unit", category: "Social", desc: "National Service Scheme unit for community outreach and social welfare activities.", contact: "nss@nitc.ac.in" },
    { name: "Photography Club", category: "Arts", desc: "Campus photography club organising workshops, photo walks, and exhibitions.", contact: "photoclub@nitc.ac.in" },
    { name: "Debate & Literary Club", category: "Literary", desc: "Hosts debates, Model UN, creative writing, and quiz competitions.", contact: "lit@nitc.ac.in" },
  ],
  calendar: [
    { event: "Odd Semester Begins", date: "2025-07-21", type: "Academic" },
    { event: "Independence Day – Holiday", date: "2025-08-15", type: "Holiday" },
    { event: "Onam Holidays", date: "2025-09-05", type: "Holiday" },
    { event: "Mid-Semester Exams", date: "2025-09-15", type: "Exam" },
    { event: "TATHVA 2025", date: "2025-10-02", type: "Event" },
    { event: "RAGAM 2025", date: "2025-11-14", type: "Event" },
    { event: "End Semester Exams Begin", date: "2025-11-24", type: "Exam" },
    { event: "End Semester Exams End", date: "2025-12-10", type: "Exam" },
    { event: "Winter Break", date: "2025-12-20", type: "Holiday" },
    { event: "Even Semester Begins", date: "2026-01-05", type: "Academic" },
    { event: "Republic Day – Holiday", date: "2026-01-26", type: "Holiday" },
    { event: "Mid-Semester Exams", date: "2026-03-02", type: "Exam" },
    { event: "End Semester Exams Begin", date: "2026-04-20", type: "Exam" },
    { event: "Summer Vacation", date: "2026-05-10", type: "Holiday" },
  ],
};

// Contacts (restructured)
export const DEFAULT_CONTACTS = {
  official: [
    { id:"o1", name:"Director's Office",  number:"0495-2286100", note:"Ext 100" },
    { id:"o2", name:"Dean of Students",   number:"0495-2286200", note:"Ext 200" },
    { id:"o3", name:"Health Centre",      number:"0495-2286300", note:"24x7" },
    { id:"o4", name:"Security Office",    number:"0495-2286400", note:"24x7" },
    { id:"o5", name:"Hostel Office",      number:"0495-2286500", note:"Ext 500" },
    { id:"o6", name:"Academic Section",   number:"0495-2286150", note:"Ext 150" },
    { id:"o7", name:"IT Helpdesk",        number:"0495-2286600", note:"Ext 600" },
    { id:"o8", name:"Library",            number:"0495-2286800", note:"Ext 800" },
  ],
  autoTaxi: [
    { id:"t1", name:"Campus Auto – Rajan",  number:"94470 00001", type:"auto" },
    { id:"t2", name:"Campus Auto – Suresh", number:"94470 00002", type:"auto" },
    { id:"t3", name:"City Taxi – Arun",     number:"94470 00003", type:"taxi" },
  ],
  helpline: [
    { id:"h1", name:"Police",             number:"100",  note:"Emergency" },
    { id:"h2", name:"Ambulance",          number:"108",  note:"Emergency" },
    { id:"h3", name:"Fire",               number:"101",  note:"Emergency" },
    { id:"h4", name:"Women's Helpline",   number:"1091", note:"24x7" },
    { id:"h5", name:"Cyber Crime",        number:"1930", note:"National" },
    { id:"h6", name:"Mental Health (iCall)", number:"9152987821", note:"Mon–Sat 8am–10pm" },
    { id:"h7", name:"Vandrevala Foundation", number:"1860-2662-345", note:"24x7" },
  ],
  other: [
    { id:"x1", name:"Tuck Shop / Canteen", number:"0495-2286700", note:"Ext 700" },
    { id:"x2", name:"Accounts Section",    number:"0495-2286160", note:"Ext 160" },
  ],
};

// Food & Dining
export const DEFAULT_DINING = [
  {
    id: "d1",
    name: "Nescafe Kiosk",
    type: "Cafe",
    delivery: false,
    phone: "",
    mapLink: "",
    menuImages: [],
    description: "Hot beverages and snacks near the main academic block.",
  },
  {
    id: "d2",
    name: "Amul Parlour",
    type: "Bakery",
    delivery: false,
    phone: "",
    mapLink: "",
    menuImages: [],
    description: "Ice creams, shakes and dairy products.",
  },
];
