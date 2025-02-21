import { Message } from "../common/types.ts";
import { createId } from "../common/utils.ts";

class MessageStore {
  /**
   * Add a message
   * @param senderId
   * @param content
   * @returns Message
   */
  static addMessage(senderId: string, content: string): Message {
    const message: Message = {
      id: createId("msg"),
      senderId,
      content,
      timestamp: new Date(),
    };
    MessageStore.messages.push(message);

    // Limit the size of the message store to the last 100 messages
    if (MessageStore.messages.length > MessageStore.messageLimit) {
      MessageStore.messages.shift();
    }
    return message;
  }

  /**
   * Get recent Messages
   * @param limit
   * @returns Message[] - the three most recent messages
   */
  static getRecentMessages(limit: number = 3): Message[] {
    return MessageStore.messages.slice(-limit).reverse();
  }

  /**
   * List all messages
   * @returns Message[]
   */
  static listMessages(): Message[] {
    return MessageStore.messages.reverse();
  }

  /**
   * Clear all messages
   */
  static clearMessages(): void {
    MessageStore.messages = [];
  }

  /**
   * Get a count of all messages
   * @returns number - the message count
   */
  static countMessages(): number {
    return MessageStore.messages.length;
  }

  // Singleton message store
  private static messages: Message[] = [];

  // Maximum number of messages to store
  private static messageLimit: number = 100;
}

export default MessageStore;
