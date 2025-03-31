
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const Profile = () => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  
  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
    }, 1500);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Profile</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
              <CardDescription>Manage your personal information</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <Avatar className="h-32 w-32">
                <AvatarImage src="https://i.pravatar.cc/300" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="mt-4 text-center">
                <h3 className="text-lg font-semibold">Jane Doe</h3>
                <p className="text-sm text-gray-500">jane.doe@example.com</p>
                <Button variant="outline" size="sm" className="mt-3">
                  Change Photo
                </Button>
              </div>
              
              <div className="w-full mt-6">
                <h3 className="text-sm font-medium mb-2">Certifications</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Python Basics</Badge>
                  <Badge variant="outline">Web Development</Badge>
                  <Badge variant="outline">Data Analysis</Badge>
                </div>
              </div>
              
              <div className="w-full mt-6">
                <h3 className="text-sm font-medium mb-2">Account Info</h3>
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Member Since</span>
                    <span>Sep 2023</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Last Login</span>
                    <span>Today</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Courses</span>
                    <span>3 Active</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="md:col-span-2">
            <Tabs defaultValue="personal">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
              </TabsList>
              
              <TabsContent value="personal" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      Update your personal details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" defaultValue="Jane" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" defaultValue="Doe" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" defaultValue="jane.doe@example.com" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" defaultValue="+1 555-123-4567" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <textarea
                        id="bio"
                        className="w-full min-h-[100px] p-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-elearn-primary"
                        defaultValue="Computer science student passionate about AI and machine learning."
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="justify-end">
                    <Button variant="outline" className="mr-2">Cancel</Button>
                    <Button onClick={handleSave} disabled={saving}>
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="education" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Education</CardTitle>
                    <CardDescription>
                      Your educational background
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="institution">Institution</Label>
                      <Input id="institution" defaultValue="University of Technology" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="degree">Degree</Label>
                        <Input id="degree" defaultValue="Bachelor of Science" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="field">Field of Study</Label>
                        <Input id="field" defaultValue="Computer Science" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startYear">Start Year</Label>
                        <Input id="startYear" type="number" defaultValue="2020" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endYear">End Year</Label>
                        <Input id="endYear" type="number" defaultValue="2024" />
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      <Button variant="outline" size="sm">
                        + Add Another Education
                      </Button>
                    </div>
                  </CardContent>
                  <CardFooter className="justify-end">
                    <Button variant="outline" className="mr-2">Cancel</Button>
                    <Button onClick={handleSave} disabled={saving}>
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="preferences" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Preferences</CardTitle>
                    <CardDescription>
                      Customize your learning experience
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3">Notification Settings</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="email-notifs">Email Notifications</Label>
                          <input 
                            type="checkbox" 
                            id="email-notifs" 
                            defaultChecked 
                            className="toggle" 
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="course-updates">Course Updates</Label>
                          <input 
                            type="checkbox" 
                            id="course-updates" 
                            defaultChecked 
                            className="toggle" 
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="assignment-reminders">Assignment Reminders</Label>
                          <input 
                            type="checkbox" 
                            id="assignment-reminders" 
                            defaultChecked 
                            className="toggle" 
                          />
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3">Display Settings</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="dark-mode">Dark Mode</Label>
                          <input 
                            type="checkbox" 
                            id="dark-mode" 
                            className="toggle" 
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="compact-view">Compact View</Label>
                          <input 
                            type="checkbox" 
                            id="compact-view" 
                            className="toggle" 
                          />
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3">Privacy Settings</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="profile-visibility">Profile Visibility</Label>
                          <select 
                            id="profile-visibility"
                            className="p-2 border rounded-md"
                            defaultValue="classmates"
                          >
                            <option value="public">Public</option>
                            <option value="classmates">Classmates Only</option>
                            <option value="private">Private</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="justify-end">
                    <Button variant="outline" className="mr-2">Reset to Default</Button>
                    <Button onClick={handleSave} disabled={saving}>
                      {saving ? "Saving..." : "Save Preferences"}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;
