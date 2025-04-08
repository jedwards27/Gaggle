import React, { useEffect, useState } from 'react';
import { client } from '../../client';
import type { Agent } from '../types';

/**
 * AgentList component.
 *
 * Instead of calling the 'shell' tool, we will call a local API endpoint
 * that runs 'npm run agent:text' on the local machine.
 */
export const AgentList: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [shellOutput, setShellOutput] = useState<string>('');

  // We'll still use the GooseTeam client to list agents, but for the command
  // we'll call our custom /run-agent-text route.

  const fetchAgents = async () => {
    try {
      const response = await client.callTool({
        name: 'list_agents'
      });

      if (response?.content?.[0]?.text) {
        const data = JSON.parse(response.content[0].text);
        setAgents(data);
      }
    } catch (err) {
      console.error('Error fetching agents', err);
    }
  };

  /**
   * Call a local endpoint to run 'npm run agent:text' via Node.js.
   */
  const runAgentTextLocally = async () => {
    try {
      const response = await fetch('/run-agent-text', {
        method: 'POST'
      });
      if (!response.ok) {
        const errorData = await response.json();
        setShellOutput(`Error: ${errorData.error}`);
      } else {
        const data = await response.json();
        setShellOutput(data.output);
      }
    } catch (err) {
      console.error('Error calling /run-agent-text:', err);
      setShellOutput(`Request failed: ${err}`);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  return (
    <div className="agent-list">
      <h2>Active Agents</h2>

      <div style={{ background: '#e8f4fa', padding: '1rem', borderRadius: '4px', marginBottom: '1rem', border: '1px solid #ccc' }}>
        <h3>Launch a New Agent</h3>
        <p>Click the button below to run <code>npm run agent:text</code> on the local filesystem via our server route.</p>
        <button
          style={{
            backgroundColor: '#0366ee',
            color: '#fff',
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
          onClick={runAgentTextLocally}
        >
          Launch Agent
        </button>
        {shellOutput && (
          <pre style={{ marginTop: '1rem', background: '#f6f8fa', padding: '1rem', borderRadius: '4px', border: '1px solid #ccc' }}>
            {shellOutput}
          </pre>
        )}
      </div>

      {agents.length === 0 ? (
        <p>No agents connected.</p>
      ) : (
        agents.map(agent => {
          // if agent-se3450c8py has claimed to be Coordinator, show that explicitly.
          const displayedRole = agent.id === 'agent-se3450c8py' && (!agent.role || agent.role.trim() === '')
            ? 'Project Coordinator'
            : (agent.role || 'None');

          return (
            <div
              key={agent.id}
              className="agent-card"
              style={{ border: '1px solid #ccc', marginBottom: '1em', padding: '1em', borderRadius: '4px' }}
            >
              <p><strong>ID:</strong> {agent.id}</p>
              <p><strong>Role:</strong> {displayedRole}</p>
              <p><strong>Color:</strong> {agent.color || 'N/A'}</p>
              {agent.tasks && agent.tasks.length > 0 && (
                <div>
                  <strong>Tasks:</strong>
                  <ul>
                    {agent.tasks.map(task => (
                      <li key={task}>{task}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};
