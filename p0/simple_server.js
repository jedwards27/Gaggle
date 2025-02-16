const http = require('http');
const url = require('url');
const WebSocket = require('ws');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

let messages = [];
let broadcastQueue = [];
let clients = new Set();
let agents = {};
let nextAgentId = 1;

function hslToRgb(h, s, l) {
    h /= 360;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h * 12) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color);
    };
    return [f(0), f(8), f(4)];
}

function relativeLuminance(r, g, b) {
    const adjust = value => {
        value /= 255;
        return (value <= 0.03928) ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
    };

    [r, g, b] = [r, g, b].map(adjust);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(l1, l2) {
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
}

function generateHslColor() {
    for (let i = 0; i < 100; i++) {
        const hue = Math.floor(Math.random() * 361);
        const saturation = Math.floor(Math.random() * (65 - 35 + 1)) + 35;
        const lightness = Math.floor(Math.random() * (45 - 25 + 1)) + 25;

        const [r, g, b] = hslToRgb(hue, saturation, lightness);
        const bgLuminance = relativeLuminance(r, g, b);
        const textLuminance = relativeLuminance(255, 255, 255);
        const contrast = contrastRatio(textLuminance, bgLuminance);

        if (contrast >= 4.5) {
            return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        }
    }
    return 'hsl(210, 50%, 35%)';
}

const HELP_MESSAGE = {
    welcome: "Welcome to the Agent Communication Server!",
    overview: "This server allows agents to communicate through a simple HTTP/WebSocket interface.",
    endpoints: {
        "GET /": "View the message UI in your browser at http://localhost:5175/",
        "GET /help": "Show this help message",
        "GET /messages": "Get all stored messages",
        "GET /recent": "Get the 3 most recent messages (oldest first)",
        "POST /": "Send a new message",
        "POST /register": "Register as a new agent and get an ID",
        "GET /agents": "List all active agents"
    },
    sending_messages: {
        description: "To send a message, use curl or any HTTP client:",
        examples: {
            register: "curl -X POST http://localhost:5175/register",
            json_message: `curl -X POST \\
-H "Content-Type: application/json" \\
-H "X-Sender: Agent-1" \\
-d '{"message": "Hello world"}' \\
http://localhost:5175/`,
            text_message: `curl -X POST \\
-H "Content-Type: text/plain" \\
-H "X-Sender: Agent-1" \\
-H "X-Role: Operator" \\
-d "Hello world" \\
http://localhost:5175/`
        }
    },
    reading_messages: {
        browser: "Open http://localhost:5175/ in your browser to see the message UI",
        api_options: {
            all_messages: "curl http://localhost:5175/messages - Get all messages",
            recent_messages: "curl http://localhost:5175/recent - Get 3 most recent messages (oldest first)",
            active_agents: "curl http://localhost:5175/agents - List all registered agents and their colors"
        },
        color_coding: "Each agent is assigned a unique color that meets WCAG AA contrast standards (4.5:1 ratio with white text)"
    },
    message_format: {
        required_headers: {
            "Content-Type": "application/json or text/plain",
            "X-Sender": "Your agent identifier (e.g., Agent-1)"
        }
    },
    tips: [
        "Register to get your agent ID before sending messages",
        "Messages appear in real-time in the browser UI",
        "New messages appear at the top",
        "Messages are color-coded by sender with accessible contrast",
        "Use /recent to quickly catch up on the latest messages",
        "You can clear the display using the Clear Display button",
        "The connection status is shown in the top-right"
    ]
};

const requestHandler = (req, res) => {
    const method = req.method;
    const { pathname } = url.parse(req.url, true);

    const sendResponse = (status, contentType, body) => {
        res.writeHead(status, { 'Content-Type': contentType });
        res.end(body);
    };

    const handleRegister = () => {
        const agentId = `Agent-${nextAgentId++}`;
        const color = generateHslColor();
        agents[agentId] = { color, role: null };
        sendResponse(200, 'application/json', JSON.stringify({
            agent_id: agentId,
            color,
            message: `Successfully registered as ${agentId}`
        }));
    };

    const handlePost = () => {
        let body = [];
        req.on('data', chunk => body.push(chunk));
        req.on('end', () => {
            body = Buffer.concat(body).toString();
            const headers = req.headers;
            const sender = headers['x-sender'] || 'Unknown';
            const role = headers['x-role'] || null;

            if (!agents[sender] && sender !== 'Unknown' && sender !== 'Human') {
                sendResponse(403, 'text/plain', "Agent not registered. Please register first at /register");
                return;
            }

            const timestamp = new Date().toISOString();
            let message;
            let messageType;
            try {
                message = JSON.parse(body);
                messageType = 'json';
                console.log(`JSON Message from ${sender} (${role || 'no role'}):\n`, message);
            } catch (e) {
                message = body;
                messageType = 'text';
                console.log(`Plain Text Message from ${sender} (${role || 'no role'}):\n`, message);
            }

            if (role && agents[sender]) {
                agents[sender].role = role;
            }

            const messageObj = {
                timestamp,
                type: messageType,
                content: message,
                sender,
                displayName: role || sender,
                color: agents[sender]?.color || (sender === 'Human' ? '#4CAF50' : '#808080')
            };

            messages.push(messageObj);
            broadcastQueue.push(messageObj);
            sendResponse(200, 'text/plain', "Message received");
        });
    };

    if (method === 'POST') {
        if (pathname === '/register') {
            handleRegister();
        } else {
            handlePost();
        }
    } else if (method === 'GET') {
        if (pathname === '/messages') {
            sendResponse(200, 'application/json', JSON.stringify(messages));
        } else if (pathname === '/recent') {
            sendResponse(200, 'application/json', JSON.stringify(messages.slice(-3)));
        } else if (pathname === '/help') {
            sendResponse(200, 'application/json', JSON.stringify(HELP_MESSAGE));
        } else if (pathname === '/agents') {
            sendResponse(200, 'application/json', JSON.stringify(agents));
        } else if (pathname === '/') {
            fs.readFile('message_viewer.html', (err, data) => {
                if (err) {
                    sendResponse(500, 'text/plain', "Error reading file");
                } else {
                    sendResponse(200, 'text/html', data);
                }
            });
        } else {
            sendResponse(200, 'text/plain', "Server is running");
        }
    }
};

const httpServer = http.createServer(requestHandler);
httpServer.listen(5175, () => {
    console.log("HTTP Server running on port 5175...");
});

const wss = new WebSocket.Server({ port: 5176 });
console.log("WebSocket Server running on port 5176...");

const broadcastMessages = async () => {
    while (true) {
        if (broadcastQueue.length > 0) {
            const message = broadcastQueue.shift();
            clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify([message]));
                }
            });
        }
        await new Promise(resolve => setTimeout(resolve, 100));
    }
};

wss.on('connection', ws => {
    clients.add(ws);
    console.log("New client connected");

    ws.on('close', () => {
        clients.delete(ws);
        console.log("Client disconnected");
    });

    ws.send(JSON.stringify(messages));
});

broadcastMessages();
