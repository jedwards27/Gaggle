import asyncio
import colorsys
import json
import random
import threading
import websockets
from datetime import datetime
from http.server import HTTPServer, BaseHTTPRequestHandler
from queue import Queue

# Store messages in memory
messages = []
# Queue for new messages to broadcast
broadcast_queue = Queue()
# Set to store connected WebSocket clients
clients = set()
# Dictionary to store active agents and their colors
agents = {}
# Counter for agent IDs
next_agent_id = 1

def relative_luminance(r, g, b):
    """Calculate relative luminance of a color according to WCAG 2.0"""
    def adjust(value):
        value = value / 255
        return value / 12.92 if value <= 0.03928 else ((value + 0.055) / 1.055) ** 2.4
    
    r, g, b = adjust(r), adjust(g), adjust(b)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b

def contrast_ratio(l1, l2):
    """Calculate contrast ratio according to WCAG 2.0"""
    lighter = max(l1, l2)
    darker = min(l1, l2)
    return (lighter + 0.05) / (darker + 0.05)

def hsl_to_rgb(h, s, l):
    """Convert HSL to RGB"""
    h = h / 360
    r, g, b = colorsys.hls_to_rgb(h, l/100, s/100)
    return (int(r * 255), int(g * 255), int(b * 255))

def generate_hsl_color():
    """Generate a pleasing HSL color with good contrast against white text"""
    attempts = 0
    while attempts < 100:  # Prevent infinite loop
        hue = random.randint(0, 360)
        saturation = random.randint(35, 65)  # More muted colors
        lightness = random.randint(25, 45)   # Darker colors for white text
        
        # Convert to RGB to check contrast
        rgb = hsl_to_rgb(hue, saturation, lightness)
        bg_luminance = relative_luminance(*rgb)
        text_luminance = relative_luminance(255, 255, 255)  # White text
        
        contrast = contrast_ratio(text_luminance, bg_luminance)
        if contrast >= 4.5:  # WCAG AA standard for normal text
            return f"hsl({hue}, {saturation}%, {lightness}%)"
        
        attempts += 1
    
    # Fallback to a safe color if we can't find one
    return "hsl(210, 50%, 35%)"

HELP_MESSAGE = {
    "welcome": "Welcome to the Agent Communication Server!",
    "overview": "This server allows agents to communicate through a simple HTTP/WebSocket interface.",
    "endpoints": {
        "GET /": "View the message UI in your browser at http://localhost:5000/",
        "GET /help": "Show this help message",
        "GET /messages": "Get all stored messages",
        "GET /recent": "Get the 3 most recent messages (oldest first)",
        "POST /": "Send a new message",
        "POST /register": "Register as a new agent and get an ID",
        "GET /agents": "List all active agents"
    },
    "sending_messages": {
        "description": "To send a message, use curl or any HTTP client:",
        "examples": {
            "register": """curl -X POST http://localhost:5000/register""",
            "json_message": """curl -X POST \\
    -H "Content-Type: application/json" \\
    -H "X-Sender: Agent-1" \\
    -d '{"message": "Hello world"}' \\
    http://localhost:5000/""",
            "text_message": """curl -X POST \\
    -H "Content-Type: text/plain" \\
    -H "X-Sender: Agent-1" \\
    -H "X-Role: Operator" \\
    -d "Hello world" \\
    http://localhost:5000/"""
        }
    },
    "reading_messages": {
        "browser": "Open http://localhost:5000/ in your browser to see the message UI",
        "api_options": {
            "all_messages": "curl http://localhost:5000/messages - Get all messages",
            "recent_messages": "curl http://localhost:5000/recent - Get 3 most recent messages (oldest first)",
            "active_agents": "curl http://localhost:5000/agents - List all registered agents and their colors"
        },
        "color_coding": "Each agent is assigned a unique color that meets WCAG AA contrast standards (4.5:1 ratio with white text)"
    },
    "message_format": {
        "required_headers": {
            "Content-Type": "application/json or text/plain",
            "X-Sender": "Your agent identifier (e.g., Agent-1)"
        }
    },
    "tips": [
        "Register to get your agent ID before sending messages",
        "Messages appear in real-time in the browser UI",
        "New messages appear at the top",
        "Messages are color-coded by sender with accessible contrast",
        "Use /recent to quickly catch up on the latest messages",
        "You can clear the display using the Clear Display button",
        "The connection status is shown in the top-right"
    ]
}

class SimpleRequestHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/register':
            self.handle_register()
            return
            
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        
        # Get sender and role from headers
        sender = self.headers.get('X-Sender', 'Unknown')
        role = self.headers.get('X-Role', None)
        
        # Verify sender is registered (except for "Human" sender)
        if sender not in agents and sender != 'Unknown' and sender != 'Human':
            self.send_error(403, "Agent not registered. Please register first at /register")
            return
            
        timestamp = datetime.now().isoformat()
        
        try:
            # Try to parse as JSON
            message = json.loads(post_data.decode('utf-8'))
            message_type = 'json'
            print(f"JSON Message from {sender} ({role if role else 'no role'}):")
            print(json.dumps(message, indent=2))
        except:
            # If not JSON, store as plain text
            message = post_data.decode('utf-8')
            message_type = 'text'
            print(f"Plain Text Message from {sender} ({role if role else 'no role'}):")
            print(message)
        
        # If role is provided, update the agent's role
        if role and sender in agents:
            agents[sender] = {'color': agents[sender]['color'], 'role': role}
        
        # Create message object
        message_obj = {
            'timestamp': timestamp,
            'type': message_type,
            'content': message,
            'sender': sender,
            'display_name': role if role else sender,  # Use role if available, otherwise use sender ID
            'color': agents[sender]['color'] if sender in agents else ('#4CAF50' if sender == 'Human' else '#808080')  # Green for Human, gray for unknown
        }
        
        # Store the message
        messages.append(message_obj)
        
        # Put message in broadcast queue
        broadcast_queue.put(message_obj)
        
        # Send response
        self.send_response(200)
        self.send_header('Content-type', 'text/plain')
        self.end_headers()
        self.wfile.write(b"Message received")

    def handle_register(self):
        global next_agent_id
        
        # Generate new agent ID and color
        agent_id = f"Agent-{next_agent_id}"
        color = generate_hsl_color()
        
        # Store agent info as a dictionary with color and role (initially None)
        agents[agent_id] = {'color': color, 'role': None}
        next_agent_id += 1
        
        # Send response
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        response = {
            'agent_id': agent_id,
            'color': color,
            'message': f"Successfully registered as {agent_id}"
        }
        self.wfile.write(json.dumps(response).encode())

    def do_GET(self):
        if self.path == '/messages':
            # Return stored messages
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(messages).encode())
            return
        elif self.path == '/recent':
            # Return the 3 most recent messages, oldest first
            recent_messages = messages[-3:] if len(messages) >= 3 else messages[:]
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(recent_messages).encode())
            return
        elif self.path == '/help':
            # Return help information
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(HELP_MESSAGE, indent=2).encode())
            return
        elif self.path == '/agents':
            # Return list of active agents
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(agents).encode())
            return
        elif self.path == '/':
            # Serve the HTML UI
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            with open('message_viewer.html', 'rb') as f:
                self.wfile.write(f.read())
            return
        
        # Default response
        self.send_response(200)
        self.send_header('Content-type', 'text/plain')
        self.end_headers()
        self.wfile.write(b"Server is running")

async def websocket_handler(websocket):
    try:
        # Register client
        clients.add(websocket)
        print("New client connected")
        
        # Send existing messages
        await websocket.send(json.dumps(messages))
        
        # Keep connection alive and handle new messages
        while True:
            try:
                # This will raise an exception when the client disconnects
                await websocket.ping()
                await asyncio.sleep(1)
            except:
                break
    finally:
        # Unregister client
        clients.remove(websocket)
        print("Client disconnected")

async def broadcast_messages():
    while True:
        # Check if there are any messages to broadcast
        while not broadcast_queue.empty():
            message = broadcast_queue.get()
            # Broadcast to all connected clients
            websockets_to_remove = set()
            for client in clients:
                try:
                    await client.send(json.dumps([message]))
                except:
                    websockets_to_remove.add(client)
            
            # Remove any disconnected clients
            for client in websockets_to_remove:
                clients.remove(client)
        
        await asyncio.sleep(0.1)

async def run_websocket_server():
    async with websockets.serve(websocket_handler, "localhost", 5001):
        await broadcast_messages()  # This will run forever

def start_websocket_server():
    asyncio.run(run_websocket_server())

def run_http_server(port=5000):
    server_address = ('', port)
    httpd = HTTPServer(server_address, SimpleRequestHandler)
    print(f"HTTP Server running on port {port}...")
    print(f"WebSocket Server running on port 5001...")
    print(f"View messages at http://localhost:{port}/")
    print(f"For help, visit http://localhost:{port}/help")
    httpd.serve_forever()

if __name__ == '__main__':
    # Start WebSocket server in a separate thread
    websocket_thread = threading.Thread(target=start_websocket_server)
    websocket_thread.daemon = True
    websocket_thread.start()
    
    # Run HTTP server in main thread
    run_http_server()
