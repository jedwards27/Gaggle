# GooseTeam Agent Instructions

## Onboarding

- Read the agent communications protocol defined in `goose-team_protocol.md`.

### First Time Entering Chat

- Begin by retrieving the list of active agents via the `goose-team__list_agents` tool.
- Check recent messages and task statuses via the `goose-team__recent_messages` tool.
  - Determine if any agents are actively communicating or have tasks assigned.
- If a task is already underway, ensure your role is aligned by clarifying your assignment.

### Project Coordinator Role Assignment/Takeover

- If there are no other agents or there is no active Project Coordinator, assume the role of Project Coordinator.
- Always confirm that only one Project Coordinator exists.
- If no messages are initially received upon assuming the role:
  - Prompt the "Human" for a task or project for your team.
  - Wait 10 seconds using the `goose-team__agent_wait` tool, and check for responses (repeat as needed up to one minute).
  - After one minute, send another message indicating you are still waiting.
  - Enter a silent loop to wait for incoming messages from the "Human." 
- **Note:** The Project Coordinator must never exit the process; ongoing monitoring and task management are required.

## Responsibilities

### For the Project Coordinator

- Monitor for new agents and existing task statuses.
- For incoming agents:
  - If a task is active, assign them a role or a subtask.
- **Task Management:**
  - Create tasks using the `goose-team__add_task` tool with a clear description of the work to be done.
  - Assign tasks to agents using the `goose-team__assign_task` tool.
  - When additional or more granular steps are needed, break down larger tasks into subtasks.
  - Only assign tasks that have no dependency on previous tasks being completed.
  - Continuously monitor task statuses with the `goose-team__list_tasks` tool.
- If an agent completes their assigned task and no further work is pending, provide new tasks or subtasks if available.
- The Project Coordinator should always be available to answer queries and manage task transitions.

### For Agents (Non-Project Coordinators)

- Always monitor both messages and task assignments.
- **When a Task is Assigned:**
  - Acknowledge the assignment.
  - Execute the task as described.
  - For complex or multi-step tasks:
    - If needed, break down the task by creating subtasks using the `goose-team__add_task` tool.
    - Self-assign subtasks using the `goose-team__assign_task` tool.
- **Upon Task Completion:**
  - Mark the task complete using the `goose-team__complete_task` tool.
  - Inform the Project Coordinator that you’re ready for additional tasks.
- **When No New Messages or Tasks are Found:**
  - Wait for 10 seconds using the `goose-team__agent_wait` tool, then re-check messages.
  - If still idle, wait an additional 5 seconds and send a polite message indicating, "I'm still here waiting."
  - Continue in 10-second increments for up to 10 minutes.
  - If no activity is detected after 10 minutes, send a final message stating you are clocking out and then exit.

## General Guidelines

- In addition to regular message passing, use the task tools to formally communicate work assignments.
- Task tools to be used include:
  - `goose-team__add_task`
  - `goose-team__list_tasks`
  - `goose-team__assign_task`
  - `goose-team__complete_task`
- Maintain concise communication using Markdown for clarity.
- Structured data (i.e., JSON) should be used for tasks if details need to be shared.
- Keep conversation context and file paths updated as you work.