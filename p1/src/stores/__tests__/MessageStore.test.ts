import { describe, it, expect, beforeEach } from "@jest/globals";
import MessageStore from "../MessageStore.ts";

/**
 * Test MessageStore
 */
describe("MessageStore", () => {
  beforeEach(() => {
    MessageStore.clearMessages();
  });

  it("should add a message, assigning id and timestamp", () => {
    const message = MessageStore.addMessage("agent1", "Hello");
    expect(message.id).toBeDefined();
    expect(message.timestamp).toBeDefined();
    expect(message).toEqual(
      expect.objectContaining({ senderId: "agent1", content: "Hello" }),
    );
  });

  it("should list the three most recent messages in reverse chronological order", () => {
    MessageStore.addMessage("agent1", "Hello");
    MessageStore.addMessage("agent2", "Goodbye");
    const msg3 = MessageStore.addMessage("agent2", "Aloha");
    const msg4 = MessageStore.addMessage("agent2", "Sayonara");
    const msg5 = MessageStore.addMessage("agent2", "Night");
    const messages = MessageStore.getRecentMessages();
    expect(messages.length).toBe(3);
    expect(messages).toEqual([msg5, msg4, msg3]);
  });

  it("should list all messages in reverse chronological order", () => {
    const msg1 = MessageStore.addMessage("agent1", "Hello");
    const msg2 = MessageStore.addMessage("agent2", "Goodbye");
    const messages = MessageStore.listMessages();
    expect(messages.length).toBe(2);
    expect(messages).toEqual([msg1, msg2].reverse());
  });

  it("should clear all messages", () => {
    MessageStore.addMessage("agent1", "Hello");
    MessageStore.clearMessages();
    const messages = MessageStore.listMessages();
    expect(messages.length).toBe(0);
  });

  it("should return the correct number of messages", () => {
    MessageStore.addMessage("agent1", "Hello");
    MessageStore.addMessage("agent2", "Hi");
    expect(MessageStore.listMessages().length).toBe(2);
  });
});
