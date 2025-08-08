import React, { useEffect, useState } from 'react';
import { useApiFetch } from '../hooks/useApiFetch';


export default function Home() {

  const [protectedMsg, setProtectedMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const apiFetch = useApiFetch();

  useEffect(() => {
    async function fetchProtected() {
      try {
        const res = await apiFetch('/me');
        if (res.ok) {
          const data = await res.json();
          setProtectedMsg(data.msg || JSON.stringify(data));
        } else {
          setError('Unauthorized or error fetching protected route');
        }
      } catch (err) {
        setError('Network error');
      }
    }
    fetchProtected();
  }, [apiFetch]);

  return (
    <>
      <section>
        <h1 className="font-bold text-2xl text-center my-8 text-blue-500 flex justify-start">Welcome to Read Rover</h1>
        <p className="text-center text-blue-500">Your reading companion for the web</p>
        <div className="mt-8 text-center">
          {protectedMsg && <div className="text-green-600">{protectedMsg}</div>}
          {error && <div className="text-red-600">{error}</div>}
        </div>
      </section>
    </>
  );
}
