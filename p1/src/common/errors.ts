// errors.ts - Define custom error types and utility functions

// Example error
export class AgentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AgentError";
  }
}

// Add more custom errors or utility functions as needed
