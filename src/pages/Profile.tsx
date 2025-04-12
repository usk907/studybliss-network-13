
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { User, UserCircle2, Camera, Loader2 } from "lucide-react";

const Profile = () => {
  const { user, avatarUrl, session } = useAuth();
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [localAvatarUrl, setLocalAvatarUrl] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      const metadata = session.user.user_metadata;
      setFullName(metadata?.full_name || "");
      setBio(metadata?.bio || "");
    }
  }, [session]);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    
    try {
      // Create a unique file path using user ID and timestamp
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}_${Date.now()}.${fileExt}`;
      const filePath = `${user?.id}/${fileName}`;

      // Upload the file to storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);

      // Update user metadata with the new avatar URL
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: data.publicUrl }
      });

      if (updateError) throw updateError;

      // Update local state
      setLocalAvatarUrl(data.publicUrl);
      toast.success("Profile picture updated successfully!");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Failed to upload profile picture");
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!fullName.trim()) {
      toast.error("Full name cannot be empty");
      return;
    }

    setIsUpdating(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        data: { 
          full_name: fullName.trim(), 
          bio: bio.trim() 
        }
      });

      if (error) throw error;

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCircle2 className="h-6 w-6" /> My Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="flex flex-col items-center gap-4">
              <div className="relative group">
                <Avatar className="h-32 w-32 border-4 border-background shadow-md">
                  <AvatarImage 
                    src={localAvatarUrl || avatarUrl || undefined} 
                    alt="Profile Picture" 
                  />
                  <AvatarFallback className="bg-primary/10">
                    <User className="h-16 w-16 text-primary" />
                  </AvatarFallback>
                </Avatar>
                
                <label className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer shadow-md hover:bg-primary/90 transition-colors">
                  {isUploading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Camera className="h-5 w-5" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>
              </div>
              <p className="text-sm text-muted-foreground">
                Click the camera icon to upload a profile picture
              </p>
            </div>
            
            <div className="flex-1 w-full space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself"
                  rows={4}
                />
              </div>
              
              <Button 
                onClick={handleUpdateProfile}
                className="w-full"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Profile"
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
