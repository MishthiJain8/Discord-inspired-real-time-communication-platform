import { useState, FormEvent } from 'react';

interface Props {
  onSend: (content: string) => void;
  onTyping: (isTyping: boolean) => void;
}

export default function MessageInput({ onSend, onTyping }: Props) {
  const [content, setContent] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!content.trim()) return;
    onSend(content.trim());
    setContent('');
  };

  return (
    <form className="message-input" onSubmit={handleSubmit}>
      <input
        value={content}
        onChange={e => {
          setContent(e.target.value);
          onTyping(!!e.target.value);
        }}
        placeholder="Write a message..."
      />
      <button type="submit">Send</button>
    </form>
  );
}
