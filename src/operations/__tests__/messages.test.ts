import { describe, it, expect, beforeEach } from "@jest/globals";
import {
  recentMessages,
  addMessage,
  listMessages,
  countMessages,
  clearMessages,
} from "../messages";
import MessageStore from "../../stores/MessageStore";

/**
 * Test addMessage
 */
describe("addMessage", () => {
  beforeEach(() => {
    MessageStore.clearMessages();
  });

  it("should add a message", () => {
    const senderId = "agent1";
    addMessage(senderId, "Hello World!");
    const count = countMessages();
    expect(count).toBe(1);
  });
});

/**
 * Test recentMessages
 */
describe("recentMessages", () => {
  beforeEach(() => {
    MessageStore.clearMessages();
  });

  it("should return an empty list when there are no messages", () => {
    const result = recentMessages();
    expect(result.length).toBe(0);
  });

  it("should retrieve the three most recently added messages", () => {
    const senderId = "agent1";
    addMessage(senderId, "Hello world");
    addMessage(senderId, "Another message");
    addMessage(senderId, "Yet another message");
    addMessage(senderId, "Moar messages!!!");
    addMessage(senderId, "A simple message");
    const result = recentMessages();
    expect(result.length).toBe(3);
    expect(result[0]).toEqual(
      expect.objectContaining({ senderId, content: "A simple message" }),
    );
    expect(result[2]).toEqual(
      expect.objectContaining({ senderId, content: "Yet another message" }),
    );
  });

  it("should maintain message order", () => {
    const senderId = "agent1";
    addMessage(senderId, "First message");
    addMessage(senderId, "Second message");
    const result = recentMessages();
    expect(result[0].content).toBe("Second message");
    expect(result[1].content).toBe("First message");
  });
});

/**
 * Test listMessages
 */
describe("listMessages", () => {
  beforeEach(() => {
    MessageStore.clearMessages();
  });

  it("should return an empty list when there are no messages", () => {
    const result = listMessages();
    expect(result.length).toBe(0);
  });

  it("should retrieve all added messages", () => {
    const senderId = "agent1";
    addMessage(senderId, "Hello world");
    addMessage(senderId, "Another message");
    addMessage(senderId, "Yet another message");
    addMessage(senderId, "Moar messages!!!");
    addMessage(senderId, "A simple message");
    const result = listMessages();
    expect(result.length).toBe(5);
    expect(result[0]).toEqual(
      expect.objectContaining({ senderId, content: "A simple message" }),
    );
    expect(result[4]).toEqual(
      expect.objectContaining({ senderId, content: "Hello world" }),
    );
  });
});

/**
 * Test clearMessages
 */
describe("clearMessages", () => {
  beforeEach(() => {
    MessageStore.clearMessages();
  });

  it("should clear all messages", () => {
    const senderId = "agent1";
    addMessage(senderId, "Hello world");
    addMessage(senderId, "Another message");
    addMessage(senderId, "Yet another message");
    addMessage(senderId, "Moar messages!!!");
    addMessage(senderId, "A simple message");
    clearMessages();
    const count = countMessages();
    expect(count).toBe(0);
  });
});
