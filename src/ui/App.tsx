import React, { useEffect, useState, useRef } from 'react';
import { MessageList } from './components/MessageList';
import { TaskList } from './components/TaskList';
import { AgentList } from './components/AgentList';
import { TrainingCenter } from './components/TrainingCenter';
import ProjectSelector from './components/ProjectSelector';
import type { Message } from './types';
import { client, connectToServer } from '../client';
import { LoggingMessageNotificationSchema, type Notification } from '@modelcontextprotocol/sdk/types.js';
import type { Project } from 'src/common/types';

interface ToolResponse {
  content: Array<{
    type: string;
    text: string;
  }>;
}

export const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [activeView, setActiveView] = useState<'messages' | 'tasks' | 'agents' | 'training'>('messages');
  const pollTimeoutRef = useRef<NodeJS.Timeout>();
  const pollIntervalRef = useRef<number>(200); // Start with 200ms
  const lastMessageTimeRef = useRef<Date>(new Date());

  const addMessage = (newMessage: Message) => {
    setMessages(prev => {
      // Add new message and sort by timestamp (newest first)
      const updated = [...prev, newMessage].sort((a, b) =>
        b.timestamp.getTime() - a.timestamp.getTime()
      );
      return updated;
    });
  };

  const sendMessage = async (message: string) => {
    if (message && isConnected) {
      try {
        await client.callTool({
          name: 'add_message',
          arguments: {
            senderId: 'Human',
            content: message,
            timestamp: new Date().toISOString()
          }
        });

        // Add the message locally as well
        const newMessage: Message = {
          timestamp: new Date(),
          sender: 'Human',
          content: message,
          type: 'text'
        };
        addMessage(newMessage);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  // const clearMessages = async () => {
  //   if (isConnected) {
  //     try {
  //       await client.callTool({
  //         name: 'clear_messages'
  //       });
  //       setMessages([]);
  //     } catch (error) {
  //       console.error('Error clearing messages:', error);
  //     }
  //   }
  // };

  // Function to fetch and update messages
  const fetchMessages = async () => {
    try {
      const response = await client.callTool({
        name: 'list_messages'
      }) as ToolResponse;
      
      if (response?.content?.[0]?.text) {
        const messages = JSON.parse(response.content[0].text);
        
        if (Array.isArray(messages)) {
          const formattedMessages = messages.map(msg => ({
            timestamp: new Date(msg.timestamp || new Date()),
            sender: msg.senderId,
            content: msg.content,
            type: msg.type || 'text',
            color: msg.color,
            display_name: msg.display_name
          }));
          
          // Update last message time if we have messages
          if (formattedMessages.length > 0) {
            const newestMessage = formattedMessages.reduce((latest, current) =>
              current.timestamp > latest.timestamp ? current : latest
            );
            lastMessageTimeRef.current = newestMessage.timestamp;
          }

          setMessages(formattedMessages.sort((a, b) =>
            b.timestamp.getTime() - a.timestamp.getTime()
          ));
        }
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Function to fetch and update messages
  const fetchProjects = async () => {
    try {
      const response = await client.callTool({
        name: 'list_projects'
      }) as ToolResponse;
      
      if (response?.content?.[0]?.text) {
        const projects = JSON.parse(response.content[0].text);
        setProjects(projects);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  // Setup polling with dynamic interval based on activity
  const startPolling = () => {
    const poll = async () => {
      await fetchMessages();
      
      // Clear any existing timeout
      if (pollTimeoutRef.current) {
        clearTimeout(pollTimeoutRef.current);
      }

      // Calculate time since last message
      const timeSinceLastMessage = Date.now() - lastMessageTimeRef.current.getTime();
      const twoMinutes = 2 * 60 * 1000;
      const oneMinute = 60 * 1000;

      // If we've had activity in the last 2 minutes, use faster polling
      if (timeSinceLastMessage < twoMinutes) {
        // Start with 200ms and gradually increase up to 5 seconds
        pollIntervalRef.current = Math.min(pollIntervalRef.current * 1.5, 5000);
      } else {
        // No recent activity, poll every minute
        pollIntervalRef.current = oneMinute;
      }

      // Set up next poll
      pollTimeoutRef.current = setTimeout(poll, pollIntervalRef.current);
    };

    // Start polling
    poll();
  };

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollTimeoutRef.current) {
        clearTimeout(pollTimeoutRef.current);
      }
    };
  }, []);

  // Start polling when connected
  useEffect(() => {
    if (isConnected) {
      startPolling();
    }
  }, [isConnected]);

  useEffect(() => {
    const initializeConnection = async () => {
      try {
        // TODO(jude): Get notifications between server and client working     
        // Set up a fallback handler to log all notifications
        client.fallbackNotificationHandler = async (notification: Notification) => {
          console.log('Received notification:', {
            method: notification.method,
            params: notification.params,
            fullNotification: notification
          });
        };

        // Set up specific message handler
        client.setNotificationHandler(
          LoggingMessageNotificationSchema,
          (notification) => {
            console.log('Received message notification:', notification);
          }
        );

        client.onerror = (error: Error) => {
          console.error('MCP error:', error);
          setIsConnected(false);
        };

        client.onclose = () => {
          console.log('MCP connection closed');
          setIsConnected(false);
        };

        await connectToServer();
        setIsConnected(true);

        // List available tools
        const tools = await client.listTools();

        // Initial fetch of messages
        await fetchMessages();
        await fetchProjects();
      } catch (error) {
        console.error('Failed to initialize MCP connection:', error);
        setIsConnected(false);
      }
    };

    initializeConnection();

    return () => {
      client.close();
    };
  }, []);

  return (
    <div className="app">
      <div className="sidebar">
        <h1>Gaggle</h1>
        <ProjectSelector projects={projects} />
      </div>
      <div className="main-content">
        <div className="main-tabs">
          <button 
            className={activeView === 'messages' ? 'active' : ''}
            onClick={() => setActiveView('messages')}
          >
            Messages
          </button>
          <button 
            className={activeView === 'tasks' ? 'active' : ''}
            onClick={() => setActiveView('tasks')}
          >
            Tasks
          </button>
          <button
            className={activeView === 'agents' ? 'active' : ''}
            onClick={() => setActiveView('agents')}
          >
            Agents
          </button>
          <button
            className={activeView === 'training' ? 'active' : ''}
            onClick={() => setActiveView('training')}
          >
            Training
          </button>
          <div className={`status ${isConnected ? 'connected' : 'disconnected'}`}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </div>
          </div>
        <div className="main-content-body">
          {activeView === 'messages' && (
            <MessageList messages={messages} handleSubmit={sendMessage} />
          )}
          {activeView === 'tasks' && (
            <TaskList />
          )}
          {activeView === 'agents' && (
            <AgentList />
          )}
          {activeView === 'training' && (
            <TrainingCenter />
          )}
          </div>
      </div>
    </div>
  );
};
