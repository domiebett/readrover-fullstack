import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Users, Star } from "lucide-react";
import { Header } from "@/layouts/Header";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50">
      {/* Background texture overlay */}
      <div className="absolute inset-0 opacity-5 bg-[url('/placeholder-fzipf.png')] bg-repeat"></div>

      <div className="relative">
        <Header mode="landing" />

        {/* Hero Section */}
        <main className="px-4 py-12 md:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-8 mb-16">
              <h2 className="font-serif text-4xl md:text-6xl font-bold text-yellow-800 leading-tight">
                Your Personal
                <span className="block text-pink-600">Reading Companion</span>
              </h2>

              <p className="text-lg md:text-xl text-yellow-700 max-w-2xl mx-auto leading-relaxed">
                Track your reading journey, discover new books, and connect with fellow book lovers in your cozy digital
                library.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link to="/register">
                  <Button size="lg" className="bg-pink-500 hover:bg-pink-600 text-white shadow-xl px-8 py-3 text-lg">
                    Start Reading Today
                  </Button>
                </Link>
                <Link to="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-yellow-300 text-yellow-800 hover:bg-yellow-100 bg-white/80 px-8 py-3 text-lg"
                  >
                    Welcome Back
                  </Button>
                </Link>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <Card className="bg-white/80 backdrop-blur-sm border-yellow-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mx-auto">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-yellow-800">Track Your Reading</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Keep a beautiful record of every book you've read and your thoughts about them.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-yellow-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-rose-400 rounded-full flex items-center justify-center mx-auto">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-yellow-800">Discover New Books</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Get personalized recommendations based on your reading history and preferences.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-yellow-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-400 rounded-full flex items-center justify-center mx-auto">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-yellow-800">Connect with Readers</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Join a community of book lovers and share your literary adventures.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* CTA Section */}
            <div className="text-center bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-8 md:p-12 border border-yellow-200">
              <h3 className="font-serif text-3xl md:text-4xl font-bold text-yellow-800 mb-4">
                Ready to Begin Your Journey?
              </h3>
              <p className="text-lg text-yellow-700 mb-8 max-w-2xl mx-auto">
                Join thousands of readers who have made BookNook their digital reading home.
              </p>
              <Link to="/register">
                <Button size="lg" className="bg-yellow-700 hover:bg-yellow-800 text-white shadow-xl px-12 py-4 text-lg">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
