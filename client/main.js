const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const socket = io();

// User settings
let userColor = document.getElementById("colorPicker").value;
let strokeWidth = parseInt(document.getElementById("strokeWidth").value);
document.getElementById("userColorBox").style.backgroundColor = userColor;

// Update color
document.getElementById("colorPicker").addEventListener("input", (e) => {
  userColor = e.target.value;
  document.getElementById("userColorBox").style.backgroundColor = userColor;
});

// Update stroke width
document.getElementById("strokeWidth").addEventListener("input", (e) => {
  strokeWidth = parseInt(e.target.value);
});

let drawing = false;
let currentStroke = { points: [], color: userColor, width: strokeWidth };
let strokes = [];

// Undo
document.getElementById("undoBtn").addEventListener("click", () => {
  if (strokes.length === 0) return;
  strokes.pop();
  socket.emit("undo");
  redraw();
});

// Clear
document.getElementById("clearBtn").addEventListener("click", () => {
  strokes = [];
  socket.emit("clear");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Drawing
canvas.addEventListener("mousedown", (e) => {
  drawing = true;
  currentStroke = { points: [{ x: e.clientX, y: e.clientY }], color: userColor, width: strokeWidth };
});

canvas.addEventListener("mousemove", (e) => {
  if (!drawing) return;
  const point = { x: e.clientX, y: e.clientY };
  currentStroke.points.push(point);
  drawStroke(currentStroke);
  socket.emit("stroke", currentStroke);
  sendCursor(e.clientX, e.clientY);
});

canvas.addEventListener("mouseup", () => {
  drawing = false;
  strokes.push(currentStroke);
});

// Draw function
function drawStroke(stroke) {
  ctx.beginPath();
  const points = stroke.points;
  ctx.strokeStyle = stroke.color || "#000";
  ctx.lineWidth = stroke.width || 2;
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.stroke();
}

// Redraw all strokes
function redraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  strokes.forEach(drawStroke);
}

// --- Live cursors ---
const cursors = {};

function sendCursor(x, y) {
  socket.emit("cursor", { x, y, color: userColor, id: socket.id });
}

socket.on("cursor", (data) => {
  let cursor = cursors[data.id];
  if (!cursor) {
    cursor = document.createElement("div");
    cursor.className = "cursor";
    cursor.style.backgroundColor = data.color;
    document.body.appendChild(cursor);
    cursors[data.id] = cursor;
  }
  cursor.style.left = data.x + "px";
  cursor.style.top = data.y + "px";
});

// Remove cursor when user disconnects
socket.on("userDisconnect", (id) => {
  if (cursors[id]) {
    cursors[id].remove();
    delete cursors[id];
  }
});

// --- Socket events ---
socket.on("stroke", (stroke) => {
  drawStroke(stroke);
  strokes.push(stroke);
});

socket.on("init", (serverStrokes) => {
  strokes = serverStrokes;
  redraw();
});

socket.on("reset", (serverStrokes) => {
  strokes = serverStrokes;
  redraw();
});

socket.on("clear", () => {
  strokes = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});
