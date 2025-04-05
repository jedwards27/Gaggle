import React, { useEffect, useState } from 'react';
import { client } from '../../client';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'completed';
  createdAt: string;
  assignedTo?: string;
}

export const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchTasks = async () => {
    try {
      const response = await client.callTool({
        name: 'list_tasks'
      });
      
      if (response?.content?.[0]?.text) {
        const tasks = JSON.parse(response.content[0].text);
        if (Array.isArray(tasks)) {
          setTasks(tasks);
        }
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const getTasksByStatus = (status: Task['status']) => {
    return tasks.filter(task => task.status === status);
  };

  const getStatusLabel = (status: Task['status']) => {
    switch (status) {
      case 'open':
        return 'Open';
      case 'in_progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  };

  return (
    <div className="task-board">
      <div className="task-column">
        <h3>Open</h3>
        <div className="task-list">
          {getTasksByStatus('open').map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </div>
      <div className="task-column">
        <h3>In Progress</h3>
        <div className="task-list">
          {getTasksByStatus('in_progress').map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </div>
      <div className="task-column">
        <h3>Completed</h3>
        <div className="task-list">
          {getTasksByStatus('completed').map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </div>
    </div>
  );
};

const TaskCard: React.FC<{ task: Task }> = ({ task }) => {
  return (
    <div className="task-card">
      <h4>{task.title}</h4>
      <p>{task.description}</p>
      <div className="task-assignee">
        {task.assignedTo || 'Unassigned'}
      </div>
    </div>
  );
}; 