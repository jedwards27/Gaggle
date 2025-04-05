// A list of visually distinct colors for different senders
const SENDER_COLORS = [
  '#10AC84', // Green
  '#5F27CD', // Purple
  '#FF9F43', // Orange
  '#EE5253', // Red
  '#01579B', // Dark Blue
  '#8E44AD', // Dark Purple
  '#16A085', // Teal
  '#2E86DE', // Blue
];

// Keep a consistent color mapping for senders
const senderColorMap = new Map<string, string>();

/**
 * Simple string hash function
 * @param str - String to hash
 * @returns A number between 0 and 4294967295 (2^32 - 1)
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Get a consistent color for a sender
 * @param sender - The sender identifier
 * @returns A hex color code
 */
export function getSenderColor(sender: string): string {
  // Default color for unknown/undefined sender
  if (!sender) return '#6c757d';

  // Special case for Human sender
  if (sender.toLowerCase() === 'human') return '#007BFF';

  // Return existing color if we've seen this sender before
  if (senderColorMap.has(sender)) {
    return senderColorMap.get(sender)!;
  }

  // Assign a new color based on the hash of the sender name
  const colorIndex = hashString(sender) % SENDER_COLORS.length;
  const color = SENDER_COLORS[colorIndex];
  senderColorMap.set(sender, color);

  return color;
} 