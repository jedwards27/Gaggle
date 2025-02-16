import { describe, it, expect, beforeEach } from "@jest/globals";
import MessageStore from "../messageStore.ts"; // Assuming MessageStore is a class with needed methods

describe("messageStore", () => {
  beforeEach(() => {
    // Clear existing messages before each test
    MessageStore.clearMessages();
  });

  it("should store and retrieve a message", () => {
    MessageStore.addMessage("agent1", "Hello");
    const messages = MessageStore.getMessages();
    expect(messages.length).toBe(1);
    expect(messages[0]).toEqual(
      expect.objectContaining({ senderId: "agent1", content: "Hello" }),
    );
  });

  it("should clear all messages", () => {
    MessageStore.addMessage("agent1", "Hello");
    MessageStore.clearMessages();
    const messages = MessageStore.getMessages();
    expect(messages.length).toBe(0);
  });

  it("should return the correct number of messages", () => {
    MessageStore.addMessage("agent1", "Hello");
    MessageStore.addMessage("agent2", "Hi");
    expect(MessageStore.getMessages().length).toBe(2);
  });
});
