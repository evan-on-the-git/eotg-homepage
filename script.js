function updateClock() {
    const now = new Date();
    document.getElementById('clock').innerText = now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        second: '2-digit', 
        hour12: true 
    });
}
setInterval(updateClock, 1000);
updateClock();
