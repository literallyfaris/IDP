// 1. Register the Service Worker (Required for PWA / Add to Home Screen)
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then(() => console.log('Service Worker Registered'));
}

// 2. Setup WebSocket Connection to ESP32
// Replace with your ESP32's actual IP address once programmed
const gateway = `ws://192.168.1.100:81/`; 
let websocket;

function initWebSocket() {
    console.log('Trying to open a WebSocket connection...');
    websocket = new WebSocket(gateway);
    websocket.onopen = onOpen;
    websocket.onclose = onClose;
    websocket.onmessage = onMessage;
}

function onOpen(event) {
    console.log('Connection opened');
    const status = document.getElementById('connection-status');
    status.innerText = "Connected to ESP32";
    status.className = "status-badge connected"; // Adds the green styling
}

function onClose(event) {
    console.log('Connection closed');
    const status = document.getElementById('connection-status');
    status.innerText = "Disconnected. Retrying...";
    status.className = "status-badge"; // Reverts to the red styling
    setTimeout(initWebSocket, 2000);
}

// 3. Handle Incoming Data
function onMessage(event) {
    // Assuming ESP32 sends a JSON string like: {"temp": 24.5, "hum": 60}
    const data = JSON.parse(event.data);
    
    // Update the HTML widgets instantly
    if (data.temp !== undefined) {
        document.getElementById('temp-value').innerText = data.temp + '°C';
    }
    if (data.hum !== undefined) {
        document.getElementById('hum-value').innerText = data.hum + '%';
    }
}

// Start connection when page loads
window.addEventListener('load', initWebSocket);