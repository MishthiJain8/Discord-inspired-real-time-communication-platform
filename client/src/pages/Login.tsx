import { useState, FormEvent } from 'react';
import { User } from '../types';

interface Props {
  onLogin: (email: string, password: string) => Promise<User>;
  onSwitch: () => void;
}

export default function Login({ onLogin, onSwitch }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await onLogin(email, password);
    } catch (err) {
      setError('Login failed. Check credentials.');
    }
  };

  return (
    <div className="auth-shell">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Sign in</h1>
        {error && <div className="error">{error}</div>}
        <label>
          Email
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </label>
        <button type="submit">Login</button>
        <div className="switch-action">
          New here? <button type="button" onClick={onSwitch}>Create account</button>
        </div>
      </form>
    </div>
  );
}
