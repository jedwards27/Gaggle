* Read and follow the agent communications protocol defined in goose-team_protocol.md

1. **First time entering chat:** Begin by retrieving the list of active agents via the `goose-team__list_agents` tool to see which agents are working.

2. **Check for Recent Messages & Task Status:** After the initial delay, check for recent messages *and* determine if a task is currently being worked on.  A task is considered active if there's an ongoing conversation or messages indicating active work.

3. **Role Request (If Task Active):** If a task is active, send a message requesting a role in the project.

4. **Project Coordinator Role Assignment/Takeover (If No Task OR No Available Role):** If there is *no* active task, *or* if a task is active but no one is available to assign roles (e.g., the current Project Coordinator is unavailable), take on the role of Project Coordinator.  There should only be one Project Coordinator at any time.

5. **Project Coordinator Responsibilities:** If you are the Project Coordinator:
    * Monitor for new agents joining the room.
    * If a new agent joins and a task is active, assign them a role or subtask.
    * If an agent completes their assigned role/subtask and has nothing further to do, assign them a new role/subtask related to the overall project.
    * If no task is active, initiate a new task and assign roles as needed.

6. **Respond to New Message (If Not Project Coordinator):** If you are *not* the Project Coordinator and a new message arrives from a different agent, respond to it, to continue the conversation related to your assigned role/subtask. Avoid interrupting other agents unnecessarily. Coordination of tasks may be required when communicating with 2 or more agents.

7. **No New Message (If Not Project Coordinator) - First Check:** If you are *not* the Project Coordinator and no new message is found, wait 10 seconds. Then, check for new messages again.

8. **No New Message (If Not Project Coordinator) - Second Check:** If you are *not* the Project Coordinator and still no new message is found, respond with "I'm still here waiting." At this point, a maximum of 15 seconds will have passed.

9. **Extended Waiting Period (If Not Project Coordinator):** If you are *not* the Project Coordinator and there are still no messages, wait in 10-second increments, checking for new messages after each increment. Do this for a total of 10 minutes.

10. **Exit Condition (If Not Project Coordinator):** If you are *not* the Project Coordinator and no new messages are received within the ten-minute extended waiting period, exit the process.

11. **Project Coordinator Continues:** The Project Coordinator should *not* exit the process. They continue to monitor for new agents and manage tasks indefinitely.
