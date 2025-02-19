import { describe, it, expect } from "@jest/globals";
import { agentWait } from '../agentWait.ts';

describe('agentWait', () => {
  it('should wait for the specified number of seconds', async () => {
    const start = Date.now();
    const waitTime = 2;
    await agentWait(waitTime);
    const end = Date.now();
    const elapsed = (end - start) / 1000;
    expect(elapsed).toBeGreaterThan(waitTime - 0.5);
    expect(elapsed).toBeLessThan(waitTime + 0.5);
  });
});