import React, { useEffect, useState } from 'react';
import { MessageList } from './components/MessageList';
import { TaskList } from './components/TaskList';
import { Controls } from './components/Controls';
import type { Message } from './types';
import { client, connectToServer } from '../client';
import { NotificationSchema } from '@modelcontextprotocol/sdk/types.js';
import type { Notification } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

interface ToolResponse {
  content: Array<{
    type: string;
    text: string;
  }>;
}

// Define the schema for message notifications
const MessageAddNotificationSchema = NotificationSchema.extend({
  method: z.literal('notifications/message/add'),  // Updated to match the correct notification method
  params: z.object({
    message: z.object({  // The actual message is nested in the params
      senderId: z.string(),
      content: z.string(),
      timestamp: z.string().optional(),
      type: z.string().optional(),
      color: z.string().optional(),
      display_name: z.string().optional()
    })
  })
});

export const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [activeView, setActiveView] = useState<'messages' | 'tasks'>('messages');

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
        const response = await client.callTool({
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

  const clearMessages = async () => {
    if (isConnected) {
      try {
        await client.callTool({
          name: 'clear_messages'
        });
        setMessages([]);
      } catch (error) {
        console.error('Error clearing messages:', error);
      }
    }
  };

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
          setMessages(formattedMessages.sort((a, b) => 
            b.timestamp.getTime() - a.timestamp.getTime()
          ));
        }
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

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
          MessageAddNotificationSchema,
          (notification) => {
            console.log('Received message notification:', notification);
            // Extract the message from the notification params
            const msg = notification.params.message;
            const newMessage: Message = {
              timestamp: new Date(msg.timestamp || new Date()),
              sender: msg.senderId,
              content: msg.content,
              type: msg.type || 'text',
              color: msg.color,
              display_name: msg.display_name
            };
            console.log('Adding message from notification:', newMessage);
            addMessage(newMessage);
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
        <h1>MCP Viewer</h1>
        <nav>
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
        </nav>
      </div>
      <div className="main-content">
        {activeView === 'messages' ? (
          <>
            <Controls 
              isConnected={isConnected}
              onClear={clearMessages}
              onSendMessage={sendMessage}
            />
            <MessageList messages={messages} />
          </>
        ) : (
          <TaskList />
        )}
      </div>
    </div>
  );
}; 