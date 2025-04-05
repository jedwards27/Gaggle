import React, { useState } from 'react';
import type { Message, MessageListProps } from '../types';
import { getSenderColor } from '../utils/colors';

const formatTimestamp = (timestamp: Date) => {
  return new Date(timestamp).toLocaleString();
};

const formatContent = (content: any, type: string | undefined) => {
  if (type === 'json') {
    try {
      const jsonObj = typeof content === 'string' ? JSON.parse(content) : content;

      if (jsonObj.message) {
        const metadata = { ...jsonObj };
        delete metadata.message;
        delete metadata.type;
        delete metadata.context;

        const hasMetadata = Object.keys(metadata).length > 0;

        return (
          <>
            <div className="message-main">{jsonObj.message}</div>
            {hasMetadata && (
              <>
                <div className="message-metadata" style={{ display: 'none' }}>
                  <pre>{JSON.stringify(metadata, null, 2)}</pre>
                </div>
                <button className="toggle-metadata">Show Details</button>
              </>
            )}
          </>
        );
      }

      return <pre className="json">{JSON.stringify(jsonObj, null, 2)}</pre>;
    } catch (e) {
      console.error('Error formatting JSON:', e);
      return <pre className="json-error">{content}</pre>;
    }
  }
  return content;
};

const MessageItem: React.FC<{ message: Message }> = ({ message }) => {
  const [showMetadata, setShowMetadata] = useState(false);
  const senderColor = getSenderColor(message.sender || 'Unknown');

  const toggleMetadata = () => {
    setShowMetadata(!showMetadata);
  };

  return (
    <div className="message" data-sender={message.sender || 'Unknown'} style={{ borderLeftColor: senderColor }}>
      <div className="message-header">
        <div className="timestamp">
          {formatTimestamp(message.timestamp)}
          <span 
            className="sender" 
            style={{ backgroundColor: senderColor }}
            title={message.sender}
          >
            {message.display_name || message.sender}
          </span>
        </div>
        {message.content && (message.content.type || message.content.context) && (
          <div className="message-metadata-line">
            {message.content.type && (
              <span className="badge badge-type">type: {message.content.type}</span>
            )}
            {message.content.context && (
              <span className="badge badge-context">context: {message.content.context}</span>
            )}
          </div>
        )}
      </div>
      <div className="content" onClick={toggleMetadata}>
        {formatContent(message.content, message.type)}
      </div>
    </div>
  );
};

export const MessageList: React.FC<MessageListProps> = ({ messages, handleSubmit }) => {
  const [newMessage, setNewMessage] = useState('');

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newMessage.trim()) {
      handleSubmit(newMessage.trim());
      setNewMessage('');
    }
  };

  return (
    <>
      <form className="message-input" onSubmit={onSubmit}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit">Send</button>
      </form>
      <div id="messages">
        {messages.map((message, index) => (
          <MessageItem key={index} message={message} />
        ))}
      </div>
    </>
  );
}; 