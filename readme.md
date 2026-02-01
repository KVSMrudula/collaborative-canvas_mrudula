# Real-Time Collaborative Canvas

## Project Overview

Collaborative Canvas is a **real-time, multi-user drawing application**. Multiple users can draw simultaneously on a shared canvas, and all drawing actions are synchronized live. Users can select their own color, adjust stroke width, undo strokes globally, and clear the canvas for all users.

**Core Features:**
- Brush drawing with adjustable stroke width
- Multiple user colors
- Real-time synchronization for all connected clients
- Undo last stroke globally
- Clear canvas globally
- Live cursor indicators for all users

---

## Installation

**1. Clone the repository:** 
   git clone <your-repo-link>
   cd collaborative-canvas

**2. Install dependencies:**
    npm install

**3. Start the server:**
    node server/server.js

**4. Open in browser:**
    Navigate to http://localhost:3000. Open multiple tabs to test multiple users.

## How to Use

**Draw:** Click and drag on the canvas

**Color:** Select from the color picker; user’s color updates in top-right box

**Stroke Width:** Adjust using the slider (1–20px)

**Undo:** Click the Undo button to remove the last stroke globally

**Clear:** Click the Clear button to erase the canvas for all users

**Live Cursor:** See where other users are currently drawing


## File Structure

collaborative-canvas/
├── client/
│   ├── index.html
│   ├── main.js
│   └── style.css
├── server/
│   └── server.js
├── package.json
├── README.md
└── ARCHITECTURE.md

