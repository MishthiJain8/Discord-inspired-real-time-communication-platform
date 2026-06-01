import { useState } from 'react';
import { User, ServerRoom } from '../types';

interface Props {
  user: User;
  servers: ServerRoom[];
  selectedServer: ServerRoom | null;
  onSelectServer: (server: ServerRoom) => void;
  onCreateServer: (name: string, description: string) => Promise<void>;
  onLogout: () => void;
}

export default function Sidebar({ user, servers, selectedServer, onSelectServer, onCreateServer, onLogout }: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  return (
    <aside className="sidebar">
      <div className="brand">Discord Clone</div>
      <div className="user-panel">
        <div>{user.username}</div>
        <button onClick={onLogout}>Logout</button>
      </div>
      <div className="server-list">
        <h3>Your servers</h3>
        {servers.map(server => (
          <button
            key={server.id}
            className={selectedServer?.id === server.id ? 'active' : ''}
            onClick={() => onSelectServer(server)}
          >
            {server.name}
          </button>
        ))}
      </div>
      <div className="server-creator">
        <h4>Create new server</h4>
        <input placeholder="Server name" value={name} onChange={e => setName(e.target.value)} />
        <input placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
        <button onClick={() => { onCreateServer(name, description); setName(''); setDescription(''); }}>Create</button>
      </div>
    </aside>
  );
}
