import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ReadingJourneyCardProps {
  booksRead: number;
  yearsReading: number;
  favoriteGenres: string[];
}

export function ReadingJourneyCard({ booksRead, yearsReading, favoriteGenres }: ReadingJourneyCardProps) {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-yellow-200 shadow-xl">
      <CardHeader>
        <h3 className="font-serif text-2xl font-bold text-yellow-800">Your Reading Journey</h3>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-yellow-100 to-orange-100 p-4 rounded-lg border border-yellow-200">
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-800">{booksRead}</p>
              <p className="text-sm font-medium text-yellow-700">Books Read</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-pink-100 to-rose-100 p-4 rounded-lg border border-pink-200">
            <div className="text-center">
              <p className="text-3xl font-bold text-pink-800">{yearsReading}</p>
              <p className="text-sm font-medium text-pink-700">Years Reading</p>
            </div>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-gray-800 mb-3">Your Favorite Genres</h4>
          <div className="flex flex-wrap gap-2">
            {favoriteGenres.map((genre, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition-colors duration-200"
              >
                {genre}
              </Badge>
            ))}
          </div>
        </div>
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-lg border border-amber-200">
          <p className="text-sm text-gray-700 italic">
            "Update your favorite genres and current reading selection to personalize your experience!"
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
