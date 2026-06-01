import { useState } from 'react';
import { Channel } from '../types';

interface Props {
  channels: Channel[];
  selectedChannel: Channel | null;
  onSelectChannel: (channel: Channel) => void;
  onCreateChannel: (name: string) => Promise<void>;
}

export default function ChannelList({ channels, selectedChannel, onSelectChannel, onCreateChannel }: Props) {
  const [name, setName] = useState('');

  return (
    <section className="channel-panel">
      <div className="channel-header">
        <h3>Channels</h3>
      </div>
      <div className="channel-list">
        {channels.map(channel => (
          <button
            key={channel.id}
            className={selectedChannel?.id === channel.id ? 'active' : ''}
            onClick={() => onSelectChannel(channel)}
          >
            #{channel.name}
          </button>
        ))}
      </div>
      <div className="channel-create">
        <input placeholder="New channel" value={name} onChange={e => setName(e.target.value)} />
        <button onClick={() => { onCreateChannel(name); setName(''); }}>Add</button>
      </div>
    </section>
  );
}
