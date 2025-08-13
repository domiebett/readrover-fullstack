import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

interface ReadingStatsCardProps {
  currentReading: string;
}

export function ReadingStatsCard({ currentReading }: ReadingStatsCardProps) {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-yellow-200 transform hover:scale-[1.02] transition-transform duration-200 shadow-md">
      <CardHeader>
        <h3 className="font-serif text-2xl font-bold text-yellow-800 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-pink-500" />
          Currently Reading
        </h3>
      </CardHeader>
      <CardContent>
        <div className="bg-gradient-to-r from-pink-50 to-yellow-50 p-4 rounded-lg border border-pink-200">
          <p className="text-lg font-semibold text-gray-800">{currentReading}</p>
          <p className="text-sm text-gray-600 mt-1">Keep up the great reading!</p>
        </div>
      </CardContent>
    </Card>
  );
}
