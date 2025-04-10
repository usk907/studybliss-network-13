
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Bell, Lock, Mail, Moon, Shield, Sun, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  
  // Account settings state
  const [accountForm, setAccountForm] = useState({
    fullName: user?.user_metadata?.full_name || "",
    email: user?.email || "",
  });
  
  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    browser: true,
    mobile: false,
    marketing: false,
  });
  
  // Privacy settings state
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public",
    dataSharing: true,
  });

  // Password change state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccountForm({
      ...accountForm,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleNotificationToggle = (setting: keyof typeof notificationSettings) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const handlePrivacyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPrivacySettings({
      ...privacySettings,
      [e.target.name]: e.target.value,
    });
  };

  const handlePrivacyToggle = (setting: keyof typeof privacySettings) => {
    if (typeof privacySettings[setting] === 'boolean') {
      setPrivacySettings((prev) => ({
        ...prev,
        [setting]: !prev[setting],
      }));
    }
  };

  const saveAccountSettings = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: accountForm.fullName }
      });
      
      if (error) throw error;
      
      toast({
        title: "Account updated",
        description: "Your account settings have been updated.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update account settings.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const savePasswordSettings = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Your new password and confirmation do not match.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword
      });
      
      if (error) throw error;
      
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update password.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveNotificationSettings = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Notification settings updated",
        description: "Your notification preferences have been saved.",
      });
    }, 500);
  };

  const savePrivacySettings = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Privacy settings updated",
        description: "Your privacy preferences have been saved.",
      });
    }, 500);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>
        
        {/* Theme Toggle */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {theme === "light" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
              Appearance
            </CardTitle>
            <CardDescription>
              Choose between light and dark themes for the application.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sun className="h-4 w-4" />
                <Label htmlFor="theme-toggle">Light</Label>
              </div>
              <Switch
                id="theme-toggle"
                checked={theme === "dark"}
                onCheckedChange={toggleTheme}
              />
              <div className="flex items-center gap-2">
                <Moon className="h-4 w-4" />
                <Label htmlFor="theme-toggle">Dark</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid grid-cols-4 max-w-xl mb-4">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
          </TabsList>

          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Account Information
                </CardTitle>
                <CardDescription>
                  Update your account information and email address.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={accountForm.fullName}
                    onChange={handleAccountChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={accountForm.email}
                    onChange={handleAccountChange}
                    disabled
                  />
                  <p className="text-sm text-muted-foreground">
                    To change your email address, please contact support.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={saveAccountSettings} disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Change Password
                </CardTitle>
                <CardDescription>
                  Update your password to secure your account.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={savePasswordSettings} disabled={loading}>
                  {loading ? "Updating..." : "Update Password"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Manage how you receive notifications and updates.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notification Channels</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive updates via email
                      </p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={notificationSettings.email}
                      onCheckedChange={() => handleNotificationToggle("email")}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="browser-notifications">Browser Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified in your browser
                      </p>
                    </div>
                    <Switch
                      id="browser-notifications"
                      checked={notificationSettings.browser}
                      onCheckedChange={() => handleNotificationToggle("browser")}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="mobile-notifications">Mobile Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications on your mobile device
                      </p>
                    </div>
                    <Switch
                      id="mobile-notifications"
                      checked={notificationSettings.mobile}
                      onCheckedChange={() => handleNotificationToggle("mobile")}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Marketing Communications</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="marketing-notifications">Marketing Emails</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive updates about new features and courses
                      </p>
                    </div>
                    <Switch
                      id="marketing-notifications"
                      checked={notificationSettings.marketing}
                      onCheckedChange={() => handleNotificationToggle("marketing")}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={saveNotificationSettings} disabled={loading}>
                  {loading ? "Saving..." : "Save Preferences"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Privacy Settings
                </CardTitle>
                <CardDescription>
                  Control your privacy and data sharing preferences.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Profile Visibility</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="profile-visibility">Who can see your profile</Label>
                      <p className="text-sm text-muted-foreground">
                        Control who can view your profile information
                      </p>
                    </div>
                    <select
                      id="profile-visibility"
                      name="profileVisibility"
                      className="p-2 border rounded-md"
                      value={privacySettings.profileVisibility}
                      onChange={handlePrivacyChange}
                    >
                      <option value="public">Everyone</option>
                      <option value="students">Students Only</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Data Sharing</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="data-sharing">Share Learning Data</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow your learning data to be used for improving course recommendations
                      </p>
                    </div>
                    <Switch
                      id="data-sharing"
                      checked={privacySettings.dataSharing as boolean}
                      onCheckedChange={() => handlePrivacyToggle("dataSharing")}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={savePrivacySettings} disabled={loading}>
                  {loading ? "Saving..." : "Save Settings"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Settings;
