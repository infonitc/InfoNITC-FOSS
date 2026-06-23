# InfoNITC — Campus Information Portal

A progressive web application built for students of NIT Calicut, providing centralized access to campus information including mess menus, bus schedules, exam timetables, club events, and more. Built with React and Firebase, it supports real-time admin updates, offline access, and is installable as a home screen app.
No login, no sharing location , no sus activity. iykyk. Just made for the sake of using it.

**Live:** [infonitc.vercel.app](https://infonitc.vercel.app)

(NOTE: Significant help of AI was used in making this project. Consider this as a tool made to use for quick use and deployment)
---
 
## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Getting Started](#getting-started)
6. [Firebase Setup](#firebase-setup)
7. [Admin System](#admin-system)
8. [Deployment](#deployment)
9. [Offline Support](#offline-support)
10. [Data Seeding](#data-seeding)
11. [Contributing](#contributing)

---

## Overview

InfoNITC was built to solve a common problem at NIT Calicut — campus information is scattered across notice boards, WhatsApp groups, and multiple websites. This portal consolidates everything into a single, mobile-friendly application that works even without an internet connection.

The application is designed around two user roles: **students** (read-only access) and **administrators** (full edit access via Firebase Authentication). A secondary role system allows individual **club admins** to manage their club's event listings independently using PIN-based authentication.

---

## Features

### Mess Menu
- Displays the official 7-day rotational mess schedule for all 16 messes at NITC (A, B, C, D, F, G, PG2, MBH1-1, MBH1-2, MBH2-1, MBH2-2, MBA, LH1, MLH1, MLH2) and the fixed weekly Pure Veg menu (Mess E).
- Each mess is grouped by hostel category (Boys, MBH, Ladies, Pure Veg).
- Shows all four daily meals: Breakfast, Lunch, Evening Tea/Snacks, and Dinner, including mandatory daily items.
- Nutritional values popup for each meal, sourced from IFCT 2017 and NIN Hyderabad databases, showing full macronutrients and micronutrients with Daily Reference Intake percentages (ICMR 2020).
- Users can set a preferred mess for the month — the site remembers and auto-selects it on every subsequent visit that month (stored in localStorage, per device).

### Bus Schedule
- All official NITC campus bus routes with departure timings, including routes from Mega Boys Hostel, Ladies Hostel, South Campus, East Campus, and the Architecture block.
- Live time-aware colour coding: past timings are greyed out, the next available bus is highlighted in orange, and upcoming timings are shown in the standard theme colour.
- Routes with multiple buses on the same path (e.g. Bus 1 and Bus 2 on MBH → East Campus) are merged into a single card with all timings combined and sorted chronologically.
- Weekend notice: a banner indicates that bus services do not operate on Saturdays and Sundays.
- Routes are collapsed by default; tapping a route expands it to show timings.
- (S) timings denote routes that pass via SOMS.

### Food and Dining
- Directory of restaurants, bakeries, and cafes near NITC campus.
- Each listing includes name, type, description, phone number (tap-to-call), Google Maps link, delivery availability, and menu photo gallery (images uploaded to Firebase Storage).
- Admin can drag and drop to reorder listings.
- Spin-the-Wheel feature: a slot-machine style randomiser that spins through all dining places and stops at a random selection, solving the daily indecision problem. After spinning, the winner card shows full place details including menu photos, phone, and map link.

### Notices and Announcements
- Categorised notice board (Academic, Event, Hostel, General) with date stamps.
- Admin can add, edit, and delete notices in real time.

### Contacts
- Organised into four subsections: Official Contacts, Auto/Taxi, Helplines, and Other Services.
- Auto/Taxi contacts display illustrated vehicle icons (auto-rickshaw or taxi) which the admin can toggle per contact.
- Helplines section is pre-filled with standard Indian emergency numbers and mental health helplines.
- All phone numbers are tap-to-call on mobile.
- Admin can drag and drop to reorder contacts within each subsection.

### Clubs and Events
- Cards for all 17 recognised student clubs at NITC with descriptions, category tags, and contact emails.
- Tapping a club opens its dedicated events page with Upcoming and Past Events tabs.
- Each event entry includes title, date, time, venue, description, registration fee (free/paid), eligibility, rewards, and an optional registration link.
- All Upcoming Events tab aggregates events from all clubs, sorted by date, so students can see everything happening on campus in one view.
- Club Admin system: the main admin can set a PIN for each club. Club representatives log in with their PIN and gain edit access exclusively to their own club's events — no other part of the site is editable by them.

### Academic Calendar
- Monthly grid view covering the full Monsoon 2026-27 semester (July to December 2026).
- Colour-coded date cells: Instructional Days (blue), Holidays (red), Mid Semester Exams (purple), End Semester Exams (amber), Events (green), Important Dates (magenta).
- Weekends are marked in red. Today's date is highlighted with a border.
- Tapping any date opens a detail card showing all events for that day. Today's card opens automatically.
- Separate Key Dates section (collapsible) showing a chronological list of all non-instructional dates. Key dates can be hidden from this list independently — hiding a key date does not remove it from the calendar grid. Deleting from the calendar detail card removes it from both.
- Admin can add, edit, and delete calendar entries inline.

### Exam Schedule
- Department and semester selector covering all B.Tech, M.Tech, MBA, and MCA programmes.
- Admin toggles between Odd Semester (S1, S3, S5, S7) and Even Semester (S2, S4, S6, S8) sitewide.
- Each exam entry includes subject name, subject code, date, time, and venue/hall.
- Past exams are automatically faded out. Admin can add, edit, and delete entries per department per semester.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 with Vite |
| Database | Firebase Firestore |
| File Storage | Firebase Storage (menu images) |
| Authentication | Firebase Authentication (email/password) |
| Hosting | Vercel |
| Styling | Inline React styles with a theme system (no CSS framework) |
| PWA | Web App Manifest + Service Worker |

---

## Project Structure

```
nitc-info/
├── public/
│   ├── manifest.json         # PWA manifest
│   ├── sw.js                 # Service worker for offline support
│   ├── icon-192.png          # PWA icon
│   └── icon-512.png          # PWA icon
├── src/
│   ├── App.jsx               # Main application, all core sections
│   ├── firebase.js           # Firebase config, Firestore and Auth helpers
│   ├── defaultData.js        # Default data seeded on first load
│   ├── AcademicCalendar.jsx  # Academic calendar section
│   ├── Clubs.jsx             # Clubs list, club admin login, all events view
│   ├── ClubDetail.jsx        # Individual club event management
│   ├── Contacts.jsx          # Contacts section with subsections
│   ├── FoodDining.jsx        # Food and dining directory
│   ├── SpinWheel.jsx         # Slot-machine dining randomiser
│   ├── NutritionPopup.jsx    # Nutritional values modal
│   ├── nutritionData.js      # IFCT/NIN nutritional data for all mess items
│   ├── ExamSchedule.jsx      # Exam timetable section
│   ├── useDrag.js            # Touch and mouse drag-to-reorder hook
│   ├── main.jsx              # React entry point
│   └── index.css             # Global styles and responsive breakpoints
├── seed-calendar.mjs         # One-time script to seed academic calendar data
├── index.html                # HTML entry point with PWA meta tags
├── vite.config.js            # Vite configuration
├── vercel.json               # Vercel deployment configuration
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js 18 or higher
- A Firebase project (see Firebase Setup below)

### Local Development

```bash
# Clone the repository
git clone https://github.com/infonitc/InfoNITC-FOSS.git
cd InfoNITC-FOSS

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
```

The production build is output to the `dist/` directory.

---

## Firebase Setup

This project requires a Firebase project with three services enabled: Firestore Database, Firebase Authentication, and Firebase Storage.

**Step 1 — Create a Firebase project**

Go to [console.firebase.google.com](https://console.firebase.google.com), create a new project, and register a Web app. Copy the `firebaseConfig` object into `src/firebase.js`.

**Step 2 — Enable Firestore**

In the Firebase Console, go to Build > Firestore Database > Create database. Select a region close to your users (recommended: `asia-south1` for India). Start in test mode initially.

**Step 3 — Enable Authentication**

Go to Build > Authentication > Get started. Enable the Email/Password sign-in provider. Create an admin user with your email and a strong password.

**Step 4 — Enable Storage**

Go to Build > Storage > Get started. This requires the Blaze (pay-as-you-go) plan. The free tier within Blaze (5 GB storage, 1 GB/day download) is sufficient for typical usage. Storage is used exclusively for mess menu images uploaded through the Food and Dining section.

**Step 5 — Firestore Security Rules**

For production, update your Firestore rules to restrict writes:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /sitedata/{doc} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

---

## Admin System

### Main Admin

The main admin authenticates via Firebase Authentication using an email and password. Once logged in, the admin banner appears and full edit access is granted across all sections.

The admin can:
- Edit all mess menu entries
- Add, edit, and delete bus routes
- Manage the food and dining directory
- Post and remove notices
- Manage contacts across all subsections
- Add, edit, and delete club listings and set PINs for club admins
- Manage calendar entries and key dates
- Manage exam schedule entries per department
- Toggle the Thavalam campus map button visibility sitewide
- Reorder navigation sections (order is saved to Firebase and applies to all users)

The admin password can be changed directly within the application — no code deployment required. The change button appears in the header when logged in as admin.

### Club Admins

Each club can have a PIN assigned by the main admin. Club representatives use the Club Admin Login button on the Clubs page to authenticate with their club name and PIN. Once logged in, they can add, edit, and delete events for their club only. They have no access to any other section of the site.

Club admin sessions are stored in memory only and are cleared when the browser tab is closed.

---

## Deployment

This project is deployed on Vercel with automatic deployments triggered by pushes to the `main` branch on GitHub.

**Initial Setup**

1. Push the repository to GitHub.
2. Go to [vercel.com](https://vercel.com), import the repository.
3. Vercel auto-detects the Vite framework. No additional configuration is needed.
4. Click Deploy.

**Custom Domain**

The project uses the Vercel subdomain `infonitc.vercel.app`. A custom domain can be configured under Project Settings > Domains in the Vercel dashboard.

---

## Offline Support

The application is fully functional offline after the first visit, using a two-layer caching strategy:

**Layer 1 — Service Worker** caches the application shell (HTML, JavaScript bundles, CSS, icons) using a network-first strategy. On subsequent visits, the app loads instantly from cache and updates silently in the background.

**Layer 2 — localStorage** caches the latest Firebase data snapshot. When the app is offline and cannot reach Firestore, it reads from this local snapshot. The snapshot is updated every time data is successfully loaded or saved.

An offline banner is shown to users when the device has no internet connection, indicating that they are viewing cached data.

---

## Data Seeding

The `seed-calendar.mjs` script populates the academic calendar in Firestore without overwriting any other data.

```bash
# Install firebase package if not already installed
npm install firebase

# Run the seed script
node seed-calendar.mjs
```

This script is safe to run multiple times — it performs a merge operation, updating only the `academicCalendar` field in the Firestore document.

---

## Notes on Data

**Mess Menu:** The nutritional values in `nutritionData.js` are approximate and sourced from the Indian Food Composition Tables (IFCT 2017) published by the National Institute of Nutrition, Hyderabad, and supplemented with USDA FoodData Central data for items not covered by IFCT. Where the official NITC mess PDF specifies serving sizes (e.g. 50g paneer, 80g chicken at lunch, 100g chicken at dinner), those quantities are used. All other items use standard serving sizes, which are noted in the nutritional popup.

**Bus Schedule:** Timings are based on the official NITC bus schedule document. Timings marked (S) indicate routes that pass via SOMS (School of Management Studies). Bus services do not operate on Saturdays, Sundays, or public holidays.

**Academic Calendar:** Based on the official NITC Academic Calendar for Monsoon Semester 2026-27 issued by the institute.

---

## Contributing

This website is maintained by a single developer and is specific to NIT Calicut. If you are a student or faculty member who identifies incorrect data (wrong bus timings, mess menu changes, updated contact numbers), the preferred way to report it is through the Feedback button on the live site, which links to a Google Form.

For code contributions or bug reports, open an issue on the GitHub repository.

---

