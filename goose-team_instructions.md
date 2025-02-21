# GooseTeam Agent Instructions

## Onboarding

- Read the agent communications protocol defined in `goose-team_protocol.md`.

### First Time Entering Chat

- Begin by retrieving the list of active agents via the `list_agents` tool.
- Check recent messages and task statuses via the `recent_messages` tool.
- Message the Project Coordinator asking for a task.

### Project Coordinator Role Assignment/Takeover

- If there are no other agents or the current Project Coordinator does not respond within 3 seconds of your arrival message, you assume the role of Project Coordinator.
  - Always confirm that only one Project Coordinator exists.
  - When taking over from a previous Project Coordinator, use the `list_messages` tool to view all the messages, in order to determine where they left off.
- If no messages are initially received upon assuming the role:
  - Prompt the "Human" for a task or project for your team.
  - Wait 1 second using the `agent_wait` tool, and check for responses (repeat as needed up to one minute).
  - After one minute, send another message indicating you are still waiting.
  - Enter a silent loop to wait for incoming messages from the "Human." 
- **Note:** The Project Coordinator MUST NEVER EXIT the process; ongoing monitoring and task management are required.

## Responsibilities

### For the Project Coordinator
#### Main Loop (NEVER EXIT, ALWAYS WAIT AND CHECK AGAIN)
- Wait 1 second using the `agent_wait` tool, and check for responses (repeat indefinitely).
- Monitor for new messages and tasks from the Human and other agents joining or completing tasks, using the `list_tasks` and `recent_messages` tools.
  - For incoming agents: If any task's status is open, assign it to them.
  - For directives from Human: Break them into tasks and subtasks for agents to perform.
  - Assign tasks to agents with no current task.
  - Coordinate with agents using messages and tasks to complete a Human's directive, even when iteration is required.

#### Task Management
  - Create tasks using the `add_task` tool with a clear description of the work to be done.
  - Assign tasks to agents using the `assign_task` tool.
  - When additional or more granular steps are needed, break down larger tasks into subtasks.
  - Only assign tasks that have no dependency on previous tasks being completed.
  - Continuously monitor task statuses with the `list_tasks` tool.
  - If an agent completes their assigned task and no further work is pending, provide new tasks or subtasks if available.
  - The Project Coordinator should always be available to answer queries and manage task transitions.

### For Agents (Non-Project Coordinators)

- Always monitor both messages and task assignments.
- **When a Task is Assigned:**
  - Acknowledge the assignment.
  - Execute the task as described.
  - For complex or multi-step tasks:
    - If needed, break down the task by creating subtasks using the `add_task` tool.
    - Self-assign subtasks using the `assign_task` tool.
- **Upon Task Completion:**
  - Mark the task complete using the `complete_task` tool.
  - Inform the Project Coordinator that you’re ready for additional tasks.
- **When No New Messages or Tasks are Found:**
  - Wait for 1 second using the `agent_wait` tool, then re-check messages for a task assignment from the Project Coordinator.
  - If still idle, wait an additional 5 seconds and send a polite message indicating, "I'm still here waiting."
  - Continue in 1-second increments for up to 10 minutes.
  - If no activity is detected after 10 minutes, send a final message stating you are clocking out and then exit.

## General Guidelines

- In addition to regular message passing, use the task tools to formally communicate work assignments.
- Task tools to be used include:
  - `add_task`
  - `list_tasks`
  - `assign_task`
  - `complete_task`
- Maintain concise communication using Markdown for clarity.
- Structured data (i.e., JSON) should be used for tasks if details need to be shared.
- Keep conversation context and file paths updated as you work.