# GrowthProAI – Full Stack Intern Assignment

## Objective
Build a Mini Local Business Dashboard that simulates how small businesses might view their SEO content and Google Business data — one of GrowthProAI's core use cases.

---

## Features

### Frontend (React + Tailwind CSS)
- Responsive dashboard page
- Input form for:
  - Business Name
  - Location
- Display card (after form submission) showing:
  - Simulated Google Rating (e.g., 4.3★)
  - Number of Reviews
  - Latest AI-generated SEO headline (from backend)
  - Button: "Regenerate SEO Headline"
- Clean, mobile-friendly UI using Tailwind CSS

### Backend (Node.js + Express)
- Two REST endpoints:
  1. `POST /api/business/data`
     - Accepts JSON: `{ "name": "Cake & Co", "location": "Mumbai" }`
     - Returns simulated data:
       ```json
       {
         "rating": 4.3,
         "reviews": 127,
         "headline": "Why Cake & Co is Mumbai's Sweetest Spot in 2025"
       }
       ```
  2. `POST /api/business/local-headlines`
     - Accepts business info and returns a fresh AI-style headline (generated by a local Mistral model or simulated)
- No database required; all data is simulated

---

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher recommended)
- npm (comes with Node.js)

### 1. Clone the Repository
```
git clone [your-repo-url]
cd growth-pro-assignment
```

### 2. Install Dependencies
#### Backend
```
cd backend
npm install
```
#### Frontend
```
cd ../frontend
npm install
```

### 3. Start the Application
#### Start Backend
```
cd backend
npm start
```
#### Start Frontend
```
cd ../frontend
npm run dev
```
- The frontend will run on http://localhost:5173 (or your configured port)
- The backend will run on http://localhost:5000

### 4. Using the App
- Open the frontend in your browser.
- Enter a business name and location, then submit the form.
- View the simulated business card with rating, reviews, and an AI-generated SEO headline.
- Click "Regenerate SEO Headline" to get a new headline.

---

## Bonus Features (If Implemented)
- Loading spinner or transition during headline generation
- State management using React Context
- Basic form validation
- (Optional) Deployed frontend and backend links

---

## Submission Instructions
- Share your GitHub repository with a clean README (this file)
- (Optional) Include deployed links if available
- Email your submission to: [your email]
  - Subject: Submission – Full Stack Intern Assignment – [Your Name]

---

## Notes
- No database is required; all data is simulated.
- The backend can use a local Mistral model for headline generation, or fallback to static/random headlines.
- For any questions, please contact the assignment provider. 