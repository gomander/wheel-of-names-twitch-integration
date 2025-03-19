// @ts-check

// IMPORTANT: Your token must be kept secret. DO NOT SHOW IT TO ANYONE or commit it to a public repository, or your Twitch account can get BANNED.
const ACCESS_TOKEN = '';
const CLIENT_ID = '';
const BROADCASTER_CHANNEL = '';

const iframe = document.querySelector('iframe');

/** @type {string[]} */
const entries = [];

const socket = new WebSocket('wss://eventsub.wss.twitch.tv/ws?keepalive_timeout_seconds=600');

/** @type {typeof WebSocket.prototype.onopen} */
socket.onopen = () => {
  console.log('Connected to Twitch');
};

/** @type {typeof WebSocket.prototype.onerror} */
socket.onerror = (event) => {
  console.error('WebSocket error:', event);
};

/** @type {typeof WebSocket.prototype.onclose} */
socket.onclose = (event) => {
  console.log('Disconnected:', event.code, event.reason);
};

/** @type {typeof WebSocket.prototype.onmessage} */
socket.onmessage = async (event) => {
  try {
    /** @type {{ metadata: object; payload: object; }} */
    const data = JSON.parse(event.data);

    switch (data.metadata.message_type) {
      case 'session_welcome':
        const broadcasterId = await getBroadcasterId();
        await subscribeToChannelMessages(data.payload.session.id, broadcasterId);
        break;
      case 'session_keepalive':
        console.log('Received keepalive message');
        break;
      case 'session_reconnect':
        console.log('Received reconnect message');
        // TODO: Connect to the new URL
        break;
      case 'revocation':
        console.error('Revocation message received:', data.payload);
        break;
      case 'notification':
        if (data.payload.subscription.type === 'channel.chat.message') {
          evaluateMessage(
            data.payload.event.chatter_user_name,
            data.payload.event.message.text
          );
        }
        break;
      default:
        console.warn('Unknown message type:', data.metadata.message_type);
    }
  } catch (error) {
    console.error(error);
  }
};

/** @type {(username: string, message: string) => void} */
function evaluateMessage(username, message) {
  const standMessage = message.trim().toLowerCase();

  if (standMessage === '!enter' && !entries.includes(username)) {
    entries.push(username);
    setEntries();
    console.log(username + ' entered the wheel!');
    return;
  }

  if (username.toLowerCase() === BROADCASTER_CHANNEL.toLowerCase()) {
    switch (standMessage) {
      case '!clear':
        console.log('Clearing the wheel!');
        entries.length = 0;
        setEntries();
        break;
      case '!spin':
        console.log('Spinning the wheel!');
        spin();
        break;
      case '!removewinner':
        console.log('Removing the winner!');
        removeWinner();
        break;
    }
  }
}

function setEntries() {
  iframe?.contentWindow?.postMessage({
    name: 'setEntries',
    entries: entries.map((entry) => ({ text: entry }))
  }, '*');
}

function removeWinner() {
  iframe?.contentWindow?.postMessage({ name: 'removeWinner' }, '*');
}

function spin() {
  iframe?.contentWindow?.postMessage({ name: 'spin' }, '*');
}

/** @type {() => Promise<string>} */
async function getBroadcasterId() {
  const response = await fetch(
    `https://api.twitch.tv/helix/users?login=${BROADCASTER_CHANNEL}`,
    {
      headers: {
        'Client-Id': CLIENT_ID,
        Authorization: `Bearer ${ACCESS_TOKEN}`
      }
    }
  );
  if (!response.ok) {
    throw new Error(`Failed to get broadcaster ID: ${response.statusText}`);
  }
  const data = await response.json();
  if (!data.data.length) {
    throw new Error('Broadcaster not found');
  }
  return data.data[0].id;
}

/** @type {(sessionId: string, broadcasterId: string) => Promise<void>} */
async function subscribeToChannelMessages(sessionId, broadcasterId) {
  const response = await fetch(
    'https://api.twitch.tv/helix/eventsub/subscriptions',
    {
      method: 'POST',
      headers: {
        'Client-Id': CLIENT_ID,
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: 'channel.chat.message',
        version: '1',
        condition: {
          broadcaster_user_id: broadcasterId,
          user_id: broadcasterId
        },
        transport: {
          method: 'websocket',
          session_id: sessionId
        }
      })
    }
  );
  if (!response.ok) {
    throw new Error(`Failed to create subscription: ${response.statusText}`);
  }
}
