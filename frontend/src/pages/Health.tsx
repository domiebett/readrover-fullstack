import { useEffect, useState } from "react";

export default function Health() {
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/health")
      .then((res) => {
        if (!res.ok) throw new Error("Backend not healthy");
        return res.json();
      })
      .then((data) => setStatus(data.status))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <div>Health check failed: {error}</div>;
  if (!status) return <div>Checking health...</div>;
  return <div>App is healthy</div>;
}
