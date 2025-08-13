import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, BookOpen, Calendar, User, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { HttpError } from "@/lib/api";
import { useProfile } from "./hooks/useProfile";
import { Badge } from "@/components/ui/badge";

export default function ProfilePage() {
  const { data: profile, isLoading, error } = useProfile();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error instanceof HttpError && error.status === 401) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="text-center">
          <p className="text-red-500 mb-4">Please log in to view your profile</p>
          <Button asChild>
            <Link to="/login">Login</Link>
          </Button>
        </div>
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
          {/* Profile Card */}
          <Card className="md:col-span-1 bg-white/80 backdrop-blur-sm border-yellow-200 shadow-xl">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                {/* Avatar placeholder */}
                <div className="w-24 h-24 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-800 text-2xl font-serif border-4 border-yellow-300">
                  {profile?.username ? profile.username.charAt(0).toUpperCase() : "R"}
                </div>
              </div>
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-2 text-gray-600">
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">Username</span>
                  </div>
                  <p className="font-semibold text-gray-800">{profile?.username}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm font-medium">Email</span>
                  </div>
                  <p className="font-semibold text-gray-800">{profile?.email}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-medium">Member Since</span>
                  </div>
                  <p className="font-semibold text-gray-800">{profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "N/A"}</p>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Reading Stats */}
          <div className="md:col-span-2 space-y-6">
            {/* Current Reading */}
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

            {/* Reading Statistics */}
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
                      <p className="text-3xl font-bold text-pink-800">2.8</p>
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
          </div>
        </div>
      </div>
    </div>
  );
}
