import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Calendar, Edit3, Save, X, User, Mail } from "lucide-react"

export function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [userData, setUserData] = useState({
    username: "bookworm_sarah",
    email: "sarah@example.com",
    memberSince: "March 2022",
    booksRead: 47,
    currentReading: "The Seven Husbands of Evelyn Hugo",
    favoriteGenres: ["Fiction", "Mystery", "Historical Fiction"],
  })

  const [editData, setEditData] = useState({
    username: userData.username,
    email: userData.email,
    password: "",
  })

  const handleSave = () => {
    setUserData((prev) => ({
      ...prev,
      username: editData.username,
      email: editData.email,
    }))
    setIsEditing(false)
    setEditData((prev) => ({ ...prev, password: "" }))
  }

  const handleCancel = () => {
    setEditData({
      username: userData.username,
      email: userData.email,
      password: "",
    })
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50 p-4 md:p-8">
      {/* Background texture overlay */}
      <div className="absolute inset-0 opacity-5 bg-[url('/placeholder-oum1p.png')] bg-repeat"></div>

      <div className="relative max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-yellow-800">
            Welcome Back, {userData.username}!
          </h1>
          <p className="text-lg text-yellow-700 font-medium">Continue your literary journey</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Profile Card */}
          <Card className="md:col-span-1 bg-white/80 backdrop-blur-sm border-yellow-200 shadow-xl">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <Avatar className="w-24 h-24 border-4 border-yellow-300">
                  <AvatarImage src="/friendly-person-reading.png" />
                  <AvatarFallback className="bg-yellow-100 text-yellow-800 text-2xl font-serif">
                    {userData.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>

              {!isEditing ? (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-center gap-2 text-gray-600">
                      <User className="w-4 h-4" />
                      <span className="text-sm font-medium">Username</span>
                    </div>
                    <p className="font-semibold text-gray-800">{userData.username}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-center gap-2 text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm font-medium">Email</span>
                    </div>
                    <p className="font-semibold text-gray-800">{userData.email}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm font-medium">Member Since</span>
                    </div>
                    <p className="font-semibold text-gray-800">{userData.memberSince}</p>
                  </div>

                  <Button
                    onClick={() => setIsEditing(true)}
                    className="w-full mt-6 bg-yellow-700 hover:bg-yellow-800 text-white transition-all duration-200 hover:shadow-lg"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                      Username
                    </Label>
                    <Input
                      id="username"
                      value={editData.username}
                      onChange={(e) => setEditData((prev) => ({ ...prev, username: e.target.value }))}
                      className="border-yellow-200 focus:border-yellow-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={editData.email}
                      onChange={(e) => setEditData((prev) => ({ ...prev, email: e.target.value }))}
                      className="border-yellow-200 focus:border-yellow-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                      New Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Leave blank to keep current"
                      value={editData.password}
                      onChange={(e) => setEditData((prev) => ({ ...prev, password: e.target.value }))}
                      className="border-yellow-200 focus:border-yellow-400"
                    />
                  </div>

                  <div className="flex gap-2 mt-6">
                    <Button
                      onClick={handleSave}
                      className="flex-1 bg-pink-500 hover:bg-pink-600 text-white transition-all duration-200"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      className="flex-1 border-gray-300 hover:bg-gray-50 bg-transparent"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardHeader>
          </Card>

          {/* Reading Stats */}
          <div className="md:col-span-2 space-y-6">
            {/* Current Reading */}
            <Card className="bg-white/80 backdrop-blur-sm border-yellow-200 shadow-xl transform hover:scale-[1.02] transition-transform duration-200">
              <CardHeader>
                <h3 className="font-serif text-2xl font-bold text-yellow-800 flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-pink-500" />
                  Currently Reading
                </h3>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-r from-pink-50 to-yellow-50 p-4 rounded-lg border border-pink-200">
                  <p className="text-lg font-semibold text-gray-800">{userData.currentReading}</p>
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
                      <p className="text-3xl font-bold text-yellow-800">{userData.booksRead}</p>
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
                    {userData.favoriteGenres.map((genre, index) => (
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
  )
}
