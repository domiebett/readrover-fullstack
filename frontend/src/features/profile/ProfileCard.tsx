import { Card, CardHeader } from "@/components/ui/card";
import { User, Mail, Calendar } from "lucide-react";

interface ProfileCardProps {
  username?: string;
  email?: string;
  createdAt?: string;
}

export function ProfileCard({ username, email, createdAt }: ProfileCardProps) {
  return (
    <Card className="md:col-span-1 bg-white/80 backdrop-blur-sm border-yellow-200 shadow-xl">
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-4">
          {/* Avatar placeholder */}
          <div className="w-24 h-24 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-800 text-2xl font-serif border-4 border-yellow-300">
            {username ? username.charAt(0).toUpperCase() : "R"}
          </div>
        </div>
        <div className="space-y-3">
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <User className="w-4 h-4" />
              <span className="text-sm font-medium">Username</span>
            </div>
            <p className="font-semibold text-gray-800">{username}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <Mail className="w-4 h-4" />
              <span className="text-sm font-medium">Email</span>
            </div>
            <p className="font-semibold text-gray-800">{email}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium">Member Since</span>
            </div>
            <p className="font-semibold text-gray-800">{createdAt ? new Date(createdAt).toLocaleDateString() : "N/A"}</p>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
