const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Make canvas full window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let drawing = false;
let currentStroke = { points: [] };

// Start drawing
canvas.addEventListener("mousedown", (e) => {
  drawing = true;
  currentStroke = { points: [{ x: e.clientX, y: e.clientY }] };
});

// Draw stroke while moving
canvas.addEventListener("mousemove", (e) => {
  if (!drawing) return;
  const point = { x: e.clientX, y: e.clientY };
  currentStroke.points.push(point);
  currentStroke.color = userColor; // include color
  drawStroke(currentStroke);
  socket.emit("stroke", currentStroke);
});

// Stop drawing
canvas.addEventListener("mouseup", () => {
  drawing = false;
});

// Draw stroke function
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
