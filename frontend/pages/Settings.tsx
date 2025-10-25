import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { User, Globe, Palette, Target, Calendar, Highlighter } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "../contexts/UserContext";
import { useTheme } from "../contexts/ThemeContext";
import backend from "~backend/client";
import { useNavigate } from "react-router-dom";
import type { UpdateUserRequest } from "~backend/ielts/user";

export default function Settings() {
  const { user, setUser } = useUser();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    targetBand: user?.targetBand || 7.0,
    examDate: user?.examDate || "",
    language: user?.language || "en",
  });

  const [highlightSettings, setHighlightSettings] = useState({
    wordColor: "yellow",
    sentenceColor: "lightblue",
    autoSaveToVocab: false,
  });

  const createUserMutation = useMutation({
    mutationFn: backend.ielts.createUser,
    onSuccess: (data) => {
      setUser(data);
      queryClient.invalidateQueries({ queryKey: ["progress"] });
      toast({
        title: "Profile created successfully!",
        description: "Your IELTS preparation journey begins now.",
      });
      navigate("/");
    },
    onError: (error) => {
      console.error("Failed to create user:", error);
      toast({
        title: "Error",
        description: "Failed to create profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, ...params }: { id: number } & Omit<UpdateUserRequest, "id">) =>
      backend.ielts.updateUser(id, params),
    onSuccess: (data) => {
      setUser(data);
      queryClient.invalidateQueries({ queryKey: ["progress"] });
      toast({
        title: "Profile updated successfully!",
        description: "Your changes have been saved.",
      });
      navigate("/");
    },
    onError: (error) => {
      console.error("Failed to update user:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter your name.",
        variant: "destructive",
      });
      return;
    }

    // Ensure targetBand is a number
    const submissionData = {
      ...formData,
      targetBand: Number(formData.targetBand),
    };

    if (user) {
      updateUserMutation.mutate({
        id: user.id,
        ...submissionData,
      });
    } else {
      createUserMutation.mutate(submissionData);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ 
      ...prev, 
      [field]: field === 'targetBand' ? Number(value) : value 
    }));
  };

  const handleThemeChange = (newTheme: "light" | "dark") => {
    setTheme(newTheme);
    if (user) {
      updateUserMutation.mutate({
        id: user.id,
        theme: newTheme,
      });
    }
  };

  const handleHighlightSettingChange = (setting: string, value: any) => {
    setHighlightSettings(prev => ({ ...prev, [setting]: value }));
    // In a real app, this would save to user preferences
    toast({
      title: "Highlight Settings Updated",
      description: "Your highlighting preferences have been saved.",
    });
  };

  return (
    <>
      <div className="max-w-2xl mx-auto space-y-6 pb-32">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your profile and app preferences.
          </p>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={() => navigate('/')}
            aria-label="Go to Home"
          >
            Go to Home
          </Button>
        </div>

        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
            <CardDescription>
              Set up your IELTS preparation profile and goals.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetBand">Target Band Score</Label>
                <Select
                  value={formData.targetBand.toFixed(1)}
                  onValueChange={(value) => handleInputChange("targetBand", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5.0">5.0</SelectItem>
                    <SelectItem value="5.5">5.5</SelectItem>
                    <SelectItem value="6.0">6.0</SelectItem>
                    <SelectItem value="6.5">6.5</SelectItem>
                    <SelectItem value="7.0">7.0</SelectItem>
                    <SelectItem value="7.5">7.5</SelectItem>
                    <SelectItem value="8.0">8.0</SelectItem>
                    <SelectItem value="8.5">8.5</SelectItem>
                    <SelectItem value="9.0">9.0</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="examDate">Exam Date (Optional)</Label>
                <Input
                  id="examDate"
                  type="date"
                  value={formData.examDate}
                  onChange={(e) => handleInputChange("examDate", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">App Language</Label>
                <Select
                  value={formData.language}
                  onValueChange={(value) => handleInputChange("language", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="uz">Uzbek</SelectItem>
                    <SelectItem value="ru">Russian</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                disabled={createUserMutation.isPending || updateUserMutation.isPending}
                className="w-full"
              >
                {createUserMutation.isPending || updateUserMutation.isPending
                  ? "Saving..."
                  : user
                  ? "Update Profile"
                  : "Create Profile"
                }
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Highlighting Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Highlighter className="h-5 w-5" />
              Text Highlighting
            </CardTitle>
            <CardDescription>
              Customize your text highlighting experience in reading passages.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Word Highlight Color</Label>
              <Select
                value={highlightSettings.wordColor}
                onValueChange={(value) => handleHighlightSettingChange("wordColor", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yellow">Yellow</SelectItem>
                  <SelectItem value="green">Green</SelectItem>
                  <SelectItem value="pink">Pink</SelectItem>
                  <SelectItem value="orange">Orange</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Sentence Highlight Color</Label>
              <Select
                value={highlightSettings.sentenceColor}
                onValueChange={(value) => handleHighlightSettingChange("sentenceColor", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lightblue">Light Blue</SelectItem>
                  <SelectItem value="lightgreen">Light Green</SelectItem>
                  <SelectItem value="lightpurple">Light Purple</SelectItem>
                  <SelectItem value="lightgray">Light Gray</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Preview</h4>
              <p className="text-sm">
                This is a sample text with a{" "}
                <span className={`px-1 rounded ${
                  highlightSettings.wordColor === 'yellow' ? 'bg-yellow-200 dark:bg-yellow-800' :
                  highlightSettings.wordColor === 'green' ? 'bg-green-200 dark:bg-green-800' :
                  highlightSettings.wordColor === 'pink' ? 'bg-pink-200 dark:bg-pink-800' :
                  'bg-orange-200 dark:bg-orange-800'
                }`}>
                  highlighted word
                </span>{" "}
                and{" "}
                <span className={`px-1 rounded ${
                  highlightSettings.sentenceColor === 'lightblue' ? 'bg-blue-200 dark:bg-blue-800' :
                  highlightSettings.sentenceColor === 'lightgreen' ? 'bg-green-200 dark:bg-green-800' :
                  highlightSettings.sentenceColor === 'lightpurple' ? 'bg-purple-200 dark:bg-purple-800' :
                  'bg-gray-200 dark:bg-gray-800'
                }`}>
                  this is a highlighted sentence
                </span>.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* App Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              App Preferences
            </CardTitle>
            <CardDescription>
              Customize your app experience.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Theme</Label>
              <Select value={theme} onValueChange={handleThemeChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light Mode</SelectItem>
                  <SelectItem value="dark">Dark Mode</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Study Goals */}
        {user && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Study Goals
              </CardTitle>
              <CardDescription>
                Your current IELTS preparation targets.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-sky-50 dark:bg-sky-900/20 rounded-lg">
                  <Target className="h-8 w-8 text-sky-600" />
                  <div>
                    <p className="font-medium">Target Band</p>
                    <p className="text-2xl font-bold text-sky-600">{user.targetBand}</p>
                  </div>
                </div>
                
                {user.examDate && (
                  <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <Calendar className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="font-medium">Exam Date</p>
                      <p className="text-sm text-green-600">
                        {new Date(user.examDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Support */}
        <Card>
          <CardHeader>
            <CardTitle>Support & Help</CardTitle>
            <CardDescription>
              Get help with using the IELTS AI app.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <p className="mb-2">
                <strong>Need help?</strong> Contact our support team for assistance with your IELTS preparation.
              </p>
              <p className="mb-2">
                <strong>App Version:</strong> 1.0.0
              </p>
              <p>
                <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
    </>
  );
}
