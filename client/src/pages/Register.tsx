import { useState, FormEvent } from 'react';
import { User } from '../types';

interface Props {
  onRegister: (username: string, email: string, password: string) => Promise<User>;
  onSwitch: () => void;
}

export default function Register({ onRegister, onSwitch }: Props) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await onRegister(username, email, password);
      setMessage('Account created. Please sign in.');
    } catch (err) {
      setMessage('Registration failed. Please try again.');
    }
  };

  return (
    <div className="auth-shell">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Create account</h1>
        {message && <div className="info">{message}</div>}
        <label>
          Username
          <input value={username} onChange={e => setUsername(e.target.value)} required />
        </label>
        <label>
          Email
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </label>
        <button type="submit">Register</button>
        <div className="switch-action">
          Already have an account? <button type="button" onClick={onSwitch}>Sign in</button>
        </div>
      </form>
    </div>
  );
}
