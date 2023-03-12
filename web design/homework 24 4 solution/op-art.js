// Get the canvas element and its context
const canvas = document.getElementById('op-art-canvas');
const ctx = canvas.getContext('2d');

// Set the canvas width and height to fill the screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Create variables for the pattern colors
const color1 = '#ff00ff';
const color2 = '#00ffff';

// Set the pattern variables
const numRects = 20;
const rectWidth = canvas.width / numRects;
const rectHeight = canvas.height / numRects;

// Initialize motion data
let motionX = 0;
let motionY = 0;

// Request permission for devicemotion event (for iPhone)
if (typeof DeviceMotionEvent.requestPermission === 'function') {
  DeviceMotionEvent.requestPermission()
    .then(permissionState => {
      if (permissionState === 'granted') {
        window.addEventListener('devicemotion', handleMotionEvent);
      }
    })
    .catch(console.error);
} else {
  window.addEventListener('devicemotion', handleMotionEvent);
}

// Handle device motion events
function handleMotionEvent(event) {
  // Extract motion data from event
  const { accelerationIncludingGravity } = event;

  // Dampen the motion data to make the animation smoother
  motionX = motionX * 0.9 + accelerationIncludingGravity.x * 0.1;
  motionY = motionY * 0.9 + accelerationIncludingGravity.y * 0.1;
}

function draw() {
  // Clear the canvas with a background color
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Loop through each row and column to draw the rectangles
  for (let row = 0; row < numRects; row++) {
    for (let col = 0; col < numRects; col++) {
      // Calculate the x and y positions of the rectangle
      const x = col * rectWidth + motionX * (row - numRects / 2) * 0.05;
      const y = row * rectHeight + motionY * (col - numRects / 2) * 0.05;

      // Set the rectangle color based on its position
      const color = (row + col) % 2 === 0 ? color1 : color2;
      ctx.fillStyle = color;

      // Draw the rectangle
      ctx.fillRect(x, y, rectWidth, rectHeight);
    }
  }
}

function animate() {
  requestAnimationFrame(animate);

  // Redraw the image
  draw();
}

// Call animate to start the animation loop
animate();
