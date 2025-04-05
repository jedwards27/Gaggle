import MessageStore from "../stores/MessageStore";
import type { Message } from "../common/types";

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
