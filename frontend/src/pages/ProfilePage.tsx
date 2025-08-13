import { Loader2 } from "lucide-react";
import { useProfile } from "../features/profile/hooks/useProfile";
import { ProfileCard } from "../features/profile/ProfileCard";
import { ReadingStatsCard } from "../features/profile/ReadingStatsCard";
import { ReadingJourneyCard } from "../features/profile/ReadingJourneyCard";

export default function ProfilePage() {
  const { data: profile, isLoading, error } = useProfile();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" data-testid="loading-spinner" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <p className="text-red-500">Failed to load profile. Please try again later.</p>
      </div>
    );
  }

  // Placeholder data for side cards
  const booksRead = 47;
  const yearsReading = 2.8;
  const currentReading = "The Seven Husbands of Evelyn Hugo";
  const favoriteGenres = ["Fiction", "Mystery", "Historical Fiction"];

  return (
    <div className="h-auto bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50 p-4 md:p-8 w-full">
      <div className="relative container mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-yellow-800">
            Welcome Back, {profile?.username || "Reader"}!
          </h1>
          <p className="text-lg text-yellow-700 font-medium">Continue your literary journey</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <ProfileCard
            username={profile?.username}
            email={profile?.email}
            createdAt={profile?.created_at}
          />
          <div className="md:col-span-2 space-y-6">
            <ReadingStatsCard currentReading={currentReading} />
            <ReadingJourneyCard
              booksRead={booksRead}
              yearsReading={yearsReading}
              favoriteGenres={favoriteGenres}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
