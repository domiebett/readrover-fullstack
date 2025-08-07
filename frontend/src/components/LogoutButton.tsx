import { useNavigate } from 'react-router-dom';
import { useApiFetch } from '../hooks/useApiFetch';

export default function LogoutButton() {
  const navigate = useNavigate();
  const apiFetch = useApiFetch();
  const handleLogout = async () => {
    await apiFetch('/logout', { method: 'POST' });
    navigate('/login', { replace: true });
    window.location.reload(); // Force reload to update auth state immediately
  };
  return <button onClick={handleLogout} style={{ marginLeft: 8 }}>Logout</button>;
}
