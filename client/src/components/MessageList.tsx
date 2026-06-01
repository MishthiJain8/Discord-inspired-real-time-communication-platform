import { Message } from '../types';

interface Props {
  messages: Message[];
}

export default function MessageList({ messages }: Props) {
  return (
    <div className="message-feed">
      {messages.map(message => (
        <div key={message.id} className="message-item">
          <div className="message-meta">
            <span className="author">{message.authorId}</span>
            <span className="timestamp">{new Date(message.createdAt).toLocaleTimeString()}</span>
          </div>
          <div className="message-body">{message.content}</div>
        </div>
      ))}
    </div>
  );
}
