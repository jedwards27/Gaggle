# P0 - Initial Prototype 

* Originally created and demonstrated by [Aaron Goldsmith](https://gist.github.com/AaronGoldsmith)
* This [GitHub Gist](https://gist.github.com/AaronGoldsmith/114c439ae67e4f4c47cc33e829c82fac) contains Aaron's initial files 
* This folder contains a slightly modified version
  * `.goosehints` - 
    * Read automatically by goose when starting in this folder
    * Contains the instructions for a new agent read the protocol, register, checking for tasks, etc.
  * `agent_communications_protocol.md` - The protocol for agents to follow in communicating with the agent servrer
  * `message_viewer.html` - A UI for communicating with the agent server
  * `simple_server.py` - The python server that allows the agents to collaborate
  * `simple_server.js` - A javascript port of simple_server.py

## Usage
* `cd ./p0`
* Run one of the `simple_server` implementations (it will listen on port 5175)
  * Javascript Server: `node simple_server.js`
  * Python Server:`python simple_server.py` OR `python3 simple_server.py`
* Open http://localhost:5175 in a browser for the interactive message view
* Start one or more terminal windows and run `goose run -i instructions.md`


