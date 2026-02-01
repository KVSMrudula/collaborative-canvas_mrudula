# Collaborative Canvas — Architecture

## Overview

Collaborative Canvas is a **real-time multi-user drawing app** built with:

- Frontend: HTML5 Canvas, JavaScript  
- Backend: Node.js, Express, Socket.io  

The application ensures **global synchronization**, allowing multiple users to draw simultaneously with undo, clear, and live cursors.

---

## Data Flow Diagram

+------------+       stroke/cursor        +------------+
|   Client   |--------------------------->|   Server   |
|  (Browser) |                             |  (Node.js)|
|            |<---------------------------|            |
|   Draws    |     broadcast stroke       | Receives & |
|   Stroke   |     & cursor updates      | sends to  |
|            |                             | other users|
+------------+                             +------------+


**Flow Steps:**
1. User draws → emits `stroke` to server  
2. Server stores stroke in global `strokes[]`  
3. Server broadcasts stroke to all other clients  
4. Clients redraw strokes locally  
5. Undo / Clear events update server & all clients  

---

## WebSocket Protocol

| Event             | Sent By  | Payload                                  | Description                       |
|------------------|----------|------------------------------------------|-----------------------------------|
| `stroke`          | Client   | `{points: [{x,y}], color, width}`       | New stroke                         |
| `init`            | Server   | `strokes[]`                              | Full history for new user          |
| `reset`           | Server   | `strokes[]`                              | Update canvas after undo           |
| `clear`           | Client/Server | None                                   | Clear canvas globally              |
| `undo`            | Client   | None                                     | Undo last stroke globally          |
| `cursor`          | Client   | `{x, y, color, id}`                      | Send user pointer location         |
| `userDisconnect`  | Server   | `socket.id`                              | Remove disconnected user cursor    |

---

## Undo / Redo Strategy

- Strokes stored globally on server in `strokes[]`  
- Undo removes **last stroke** from server & broadcasts updated list  
- Clients redraw all strokes in order to stay synchronized  
- Redo is not implemented, but can be added using a separate redo stack  

---

## Performance Decisions

- Client draws locally first to reduce latency  
- Mousemove events sent in real-time; throttling optional for many users  
- Minimal DOM elements (canvas + cursors) for efficiency  
- Only redraws when strokes array changes  

---

## Conflict Handling

- Multiple users drawing at the same location → strokes overlay naturally  
- Undo always removes **last stroke globally**, regardless of who drew it  

---

## Optional Enhancements

- Adjustable stroke width  
- Color picker per user  
- Live cursors for all users  
- Clear canvas globally  

---

## Limitations / Future Improvements

- No persistent storage (refresh loses strokes)  
- Redo not implemented  
- Mobile touch support limited  
- Throttling recommended for large-scale users
