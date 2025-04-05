export interface Message {
  timestamp: Date;
  sender: string;
  content: any;
  type?: string;
  color?: string;
  display_name?: string;
}

export interface ControlsProps {
  isConnected: boolean;
  onClear: () => void;
  onSendMessage: (message: string) => void;
}

export interface MessageListProps {
  messages: Message[];
} 