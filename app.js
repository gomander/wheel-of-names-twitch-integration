const entries = [];

let token = "";
let username = "";
let channel = "";   // Promise are not really convenient

fetch('info.json')  // My plan was at first to use local-storage, but since this thing was made for OBS Embedded Browser, couldn't do much.
    .then(response => response.json())
    .then(data => {
        token = data.token;
        username = data.username;
        channel = data.channel;
    })
    .catch(error => console.error('Error loading JSON:', error));


const socket = new WebSocket('wss://irc-ws.chat.twitch.tv:443'); // Twitch Chat is still based on 36 years old IRC Protocol

socket.onopen = () => {
    console.log('Connected to Twitch IRC');
    socket.send(`PASS oauth:${token}`);
    socket.send(`NICK ${username}`);
    socket.send(`JOIN ${channel}`);
};

socket.onmessage = (event) => { // Receive the message, before parsing it, and evaluating it (aka parsing (but better))
    const parsedMessage = parseMessage(event.data);
    if (parsedMessage === null) return;
    console.log('USERNAME:'+parsedMessage.username);
    console.log('MESSAGE:'+parsedMessage.message);

    evaluateMessage(parsedMessage.username, parsedMessage.message)
};
socket.onerror = (error) => {
    console.error('WebSocket error:', error);
};
socket.onclose = () => {
    console.log('Disconnected');
};

// Have to parse the message to extract its author and message since it's raw from IRC.
function parseMessage(message) {
    if (message.includes('.tmi.twitch.tv JOIN #')) return null;
    return {
        username: message.split(':')[1].split('!')[0],
        message: message.split(' :', 2)[1].replace('\r\n', '')
    };
}

// Evaluate the message to search for a command.
function evaluateMessage(username, message) {
    const standMessage = message.replace(' ', '').toLowerCase();

    if (standMessage === '!enter' && !entries.includes(username)) {
        entries.push(username);
        updateWheel();
        console.log(username + ' entered the wheel!');
        return;
    }

    // If it's the channel owner who is speaking! (Broadcaster)
    if (username === channel.replace('#', '').toLowerCase()) {
        switch (standMessage) {
            case '!clear':
                entries.length = 0;
                document.getElementById('wOnFrame').src = 'https://wheelofnames.com/view?entries= &pageBackgroundColor=00000000';
                console.log('Entries has been cleared!');
                return;
            case '!spin':
                // SPIN DA WHEEL!!!
                return;
        }
    }
}

// Update the wheel with every name (until it can add names one by one via JavaScript)
function updateWheel() {
    let allEntries = entries.join(',');
    document.getElementById('wOnFrame').src = 'https://wheelofnames.com/view?entries='+allEntries+'&pageBackgroundColor=00000000';
}
