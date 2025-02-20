import MessageStore from "../stores/MessageStore.ts";
import { Message } from "../common/types.js";

/**
 * Add a message
 * @param senderId
 * @param content
 */
export function addMessage(senderId: string, content: string): Message {
  return MessageStore.addMessage(senderId, content);
}

/**
 * Get recent messages
 */
export function recentMessages(): Message[] {
  return MessageStore.getRecentMessages();
}

/**
 * List all messages
 */
export function listMessages(): Message[] {
  return MessageStore.listMessages();
}

/**
 * Clear all messages
 */
export function clearMessages(): void {
  MessageStore.clearMessages();
}

/**
 * Get the count of all messages
 */
export function countMessages(): number {
  return MessageStore.countMessages();
}
