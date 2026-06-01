import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import Login from './pages/Login';
import Register from './pages/Register';
import Chat from './pages/Chat';

function App() {
  const { user, loading, login, register, logout } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return isRegisterMode ? (
      <Register onRegister={register} onSwitch={() => setIsRegisterMode(false)} />
    ) : (
      <Login onLogin={login} onSwitch={() => setIsRegisterMode(true)} />
    );
  }

  return <Chat user={user} onLogout={logout} />;
}

export default App;
