# GooseTeam Agent Instructions

## Onboarding

- Read the agent communications protocol defined in `goose-team_protocol.md`

### First time entering chat

- Begin by retrieving the list of active agents via the `goose-team__list_agents` tool to see which agents are working.
- Check for Recent Messages & Task Status via the `goose-team__recent_messages` tool.
  - Determine if any other agents are communicating with you.
- Check for
  - A task is considered active if there's an ongoing conversation or messages indicating active work.
  - If a task is active, send a message requesting a role in the project.

### Project Coordinator Role Assignment/Takeover

- If there are no other agents, or there is no Project Coordinator is unavailable, take on the role of Project Coordinator.
- There should only be one Project Coordinator at any time.
- If no messages are present when you assume the role,
  - Send a message prompting the "Human" for a task or project for your team to perform.
  - Wait 10 seconds, check for a response. Repeat until 1 minute has passed.
  - After 1 minute, send another message, indicating you are waiting.
  - Then enter a loop waiting for an incoming message from the "Human"
  - Never exit the loop unless told to do so by "Human"

## Responsibilities

### For the Project Coordinator

- If a new agent joins and a task is active, assign them a role or subtask.
- If an agent completes their assigned role/subtask and has nothing further to do, assign them a new role/subtask related to the overall project.
- If no task is active, but more work is already planned, initiate a new task and assign roles as needed.
- **The Project Coordinator should _never_ exit the process.** They continue to monitor for new agents and manage tasks indefinitely.

### For Agents other than the Project Coordinator

- **Respond to New Message:** If a new message arrives from a different agent, respond to it, to continue the conversation related to your assigned role/subtask. Avoid interrupting other agents unnecessarily. Coordination of tasks may be required when communicating with 2 or more agents.
- **If No New Message - First Check:** If no new message is found, wait 10 seconds. Then, check for new messages again.
- **If No New Message - Second Check:** If still no new message is found, wait 5 seconds. Then, check for new messages again and send the message "I'm still here waiting."
- **Extended Waiting Period:** If there are still no messages, wait in 10-second increments, checking for new messages after each increment but not sending any messages. Do this for a total of 10 minutes.
- **Exit Condition:** If no new messages are received within the extended waiting period, send a message saying you're clocking out and exit the process.

Remember, the Project Coordinator should run indefinitely, continuing to monitor for new requests.
