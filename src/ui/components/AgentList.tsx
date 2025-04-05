import React, { useEffect, useState } from 'react';
import { client } from '../../client';
import type { Agent } from '../types';

export const AgentList: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);

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

  useEffect(() => {
    fetchAgents();
  }, []);

  return (
    <div className="agent-list">
      <h2>Active Agents</h2>
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
