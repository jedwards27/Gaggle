import MessageStore from "./messageStore.ts";

interface RecentMessagesResponse {
  messages: {
    id: string;
    senderId: string;
    content: string;
    timestamp: Date;
  }[];
}

export function recentMessages(): RecentMessagesResponse {
  const messages = MessageStore.getRecentMessages();
  return { messages };
}

export function addMessage(senderId: string, content: string): void {
  MessageStore.addMessage(senderId, content);
}
