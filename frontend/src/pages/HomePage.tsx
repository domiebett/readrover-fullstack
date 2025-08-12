import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Home</h1>
        <Button asChild>
          <Link to="/profile">View Profile</Link>
        </Button>
      </div>
      <p>Protected.</p>
    </div>
  );
}
