interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
}

class MessageStore {
  private static messages: Message[] = [];
  private static messageLimit: number = 100; // Maximum number of messages to store

  static addMessage(senderId: string, content: string): void {
    const message: Message = {
      id: `msg${this.messages.length + 1}`,
      senderId,
      content,
      timestamp: new Date(),
    };
    this.messages.push(message);

    // Limit the size of the message store to the last 100 messages
    if (this.messages.length > this.messageLimit) {
      this.messages.shift();
    }
  }

  static getRecentMessages(limit: number = 3): Message[] {
    return this.messages.slice(-limit).reverse();
  }

  static clearMessages(): void {
    this.messages = [];
  }

  static getMessages(): Message[] {
    return this.messages;
  }
}

export default MessageStore;
