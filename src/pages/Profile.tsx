
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
import { User, UserCircle2, Save } from "lucide-react";

const Profile = () => {
  const { user, avatarUrl, session } = useAuth();
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [localAvatarUrl, setLocalAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user) {
      const metadata = session.user.user_metadata;
      setFullName(metadata?.full_name || "");
      setBio(metadata?.bio || "");
    }
  }, [session]);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}_${Math.random()}.${fileExt}`;
      const filePath = `${user?.id}/${fileName}`;

      try {
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);

        const { error: updateError } = await supabase.auth.updateUser({
          data: { avatar_url: data.publicUrl }
        });

        if (updateError) throw updateError;

        setLocalAvatarUrl(data.publicUrl);
        toast.success("Avatar updated successfully!");
      } catch (error) {
        toast.error("Error uploading avatar");
        console.error(error);
      }
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: { 
          full_name: fullName, 
          bio: bio 
        }
      });

      if (error) throw error;

      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Error updating profile");
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCircle2 /> My Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage 
                  src={localAvatarUrl || avatarUrl || undefined} 
                  alt="Profile Picture" 
                />
                <AvatarFallback>
                  <User className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1 cursor-pointer">
                <Save className="h-4 w-4" />
              </div>
            </div>
            <div className="flex-1 w-full space-y-4">
              <div>
                <Label>Full Name</Label>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <Label>Bio</Label>
                <Textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself"
                />
              </div>
              <Button 
                onClick={handleUpdateProfile}
                className="w-full"
              >
                Update Profile
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
