export interface Message {
  timestamp: Date;
  sender: string;
  content: any;
  type?: string;
  color?: string;
  display_name?: string;
}
export interface MessageListProps {
  messages: Message[];
  handleSubmit: (message: string) => void;
} 