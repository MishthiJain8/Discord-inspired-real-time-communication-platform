import { useEffect, useMemo, useRef, useState } from 'react';
import { api } from '../api';
import { User, ServerRoom, Channel, Message } from '../types';
import { createSocket, disconnectSocket } from '../socket';
import Sidebar from '../components/Sidebar';
import ChannelList from '../components/ChannelList';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';

interface Props {
  user: User;
  onLogout: () => void;
}

export default function Chat({ user, onLogout }: Props) {
  const [servers, setServers] = useState<ServerRoom[]>([]);
  const [selectedServer, setSelectedServer] = useState<ServerRoom | null>(null);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeCount, setActiveCount] = useState(0);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const selectedChannelId = useRef<string | null>(null);

  const socket = useMemo(() => createSocket(), []);

  useEffect(() => {
    api.get('/servers').then(response => setServers(response.data.servers));
    socket.connect();

    const handleMessage = (message: Message) => {
      setMessages(current => [message, ...current]);
    };

    const handlePresence = ({ channelId, activeCount }: { channelId: string; activeCount: number }) => {
      if (selectedChannelId.current === channelId) {
        setActiveCount(activeCount);
      }
    };

    const handleTyping = ({ channelId, username, isTyping }: { channelId: string; username: string; isTyping: boolean }) => {
      if (selectedChannelId.current !== channelId) return;
      setTypingUsers(current => {
        if (isTyping) {
          return Array.from(new Set([...current, username]));
        }
        return current.filter(name => name !== username);
      });
    };

    socket.on('message_created', handleMessage);
    socket.on('presence_update', handlePresence);
    socket.on('channel_typing', handleTyping);

    return () => {
      socket.off('message_created', handleMessage);
      socket.off('presence_update', handlePresence);
      socket.off('channel_typing', handleTyping);
      socket.disconnect();
      disconnectSocket();
    };
  }, [socket]);

  useEffect(() => {
    if (!selectedServer) return;
    api.get(`/servers/${selectedServer.id}`).catch(() => null);
    api.get(`/servers/${selectedServer.id}/channels`).then(response => setChannels(response.data.channels));
  }, [selectedServer]);

  useEffect(() => {
    selectedChannelId.current = selectedChannel?.id ?? null;
    setTypingUsers([]);
    if (!selectedChannel) return;
    api.get(`/channels/${selectedChannel.id}/messages`).then(response => {
      setMessages(response.data.messages.reverse());
    });
    socket.emit('join_channel', { channelId: selectedChannel.id });
    return () => {
      socket.emit('leave_channel', { channelId: selectedChannel.id });
    };
  }, [selectedChannel, socket]);

  const handleSend = async (content: string) => {
    if (!selectedChannel) return;
    socket.emit('send_message', { channelId: selectedChannel.id, content });
  };

  const handleCreateServer = async (name: string, description: string) => {
    const response = await api.post('/servers', { name, description, isPrivate: false });
    setServers(current => [...current, response.data.server]);
    setSelectedServer(response.data.server);
  };

  const handleCreateChannel = async (name: string) => {
    if (!selectedServer) return;
    const response = await api.post(`/servers/${selectedServer.id}/channels`, { name, type: 'public' });
    setChannels(current => [...current, response.data.channel]);
    setSelectedChannel(response.data.channel);
  };

  return (
    <div className="app-shell">
      <Sidebar
        user={user}
        servers={servers}
        selectedServer={selectedServer}
        onSelectServer={setSelectedServer}
        onCreateServer={handleCreateServer}
        onLogout={onLogout}
      />
      <div className="workspace-panel">
        <ChannelList
          channels={channels}
          selectedChannel={selectedChannel}
          onSelectChannel={setSelectedChannel}
          onCreateChannel={handleCreateChannel}
        />
        <div className="chat-panel">
          <div className="chat-header">
            <div>{selectedChannel ? `# ${selectedChannel.name}` : 'Select a channel'}</div>
            <div>{activeCount} active</div>
          </div>
          <MessageList messages={messages} />
          <MessageInput onSend={handleSend} onTyping={isTyping => {
            if (!selectedChannel) return;
            socket.emit('typing', { channelId: selectedChannel.id, isTyping });
          }} />
          {typingUsers.length > 0 && <div className="typing-indicator">{typingUsers.join(', ')} typing...</div>}
        </div>
      </div>
    </div>
  );
}
