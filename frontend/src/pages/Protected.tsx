import { useEffect, useState } from 'react';
import { useApiFetch } from '../hooks/useApiFetch';

const Protected = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const apiFetch = useApiFetch();

  useEffect(() => {
    apiFetch('/protected')
      .then(async res => {
        if (res.ok) {
          const data = await res.json();
          setMessage(data.msg);
        } else {
          const data = await res.json();
          setError(data.detail || 'Unauthorized');
        }
      })
      .catch(() => setError('Network error'));
  }, [apiFetch]);

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto' }}>
      <h2>Protected Page</h2>
      {message && <div>{message}</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
}

export default Protected;
