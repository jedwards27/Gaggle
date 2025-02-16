import { describe, it, expect, beforeEach } from "@jest/globals";
import { recentMessages, addMessage } from "../recentMessages.ts"; // Assuming the functions are exported properly
import MessageStore from "../messageStore.ts"; // Corrected import for MessageStore

describe("recentMessages", () => {
  beforeEach(() => {
    // Clear existing messages before each test if needed
    // Assuming there's a clearMessages method or can reset internally
    // Assuming recentMessages clears internally without clear method
    // Adapt tested reset if not supported
    // recentMessages.clear();
    MessageStore.clearMessages(); // If this is the method to clear in alignment
  });

  it("should return an empty list when there are no messages", () => {
    const result = recentMessages();
    expect(result.messages.length).toBe(0);
  });

  it("should retrieve all added messages", () => {
    const senderId = "agent1";
    addMessage(senderId, "Hello world");
    addMessage(senderId, "Another message");
    const result = recentMessages();
    expect(result.messages.length).toBe(2);
    expect(result.messages[0]).toEqual(
      expect.objectContaining({ senderId, content: "Another message" }),
    );
    expect(result.messages[1]).toEqual(
      expect.objectContaining({ senderId, content: "Hello world" }),
    );
  });

  it("should maintain message order", () => {
    const senderId = "agent1";
    addMessage(senderId, "First message");
    addMessage(senderId, "Second message");
    const result = recentMessages();
    expect(result.messages[0].content).toBe("Second message");
    expect(result.messages[1].content).toBe("First message");
  });
});
