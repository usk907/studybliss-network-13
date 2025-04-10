
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Award, Download, Lock } from "lucide-react";

interface CertificateProps {
  courseId: string;
  courseTitle: string;
  progress: number;
}

const Certificate = ({ courseId, courseTitle, progress }: CertificateProps) => {
  const { user } = useAuth();
  const [certificate, setCertificate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchCertificate = async () => {
      if (!courseId || !user) return;
      
      try {
        // Use generic query to avoid type errors with tables not in the generated types
        const { data, error } = await supabase
          .from('certificates')
          .select('*')
          .eq('course_id', courseId)
          .eq('user_id', user.id)
          .single();
          
        if (error && error.code !== "PGRST116") {
          // PGRST116 is the error code for "no rows returned"
          throw error;
        }
        
        setCertificate(data);
      } catch (error: any) {
        console.error("Error fetching certificate:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCertificate();
  }, [courseId, user]);
  
  const handleDownload = () => {
    if (!certificate) return;
    
    // In a real app, this would download a generated certificate
    // For now, we'll just show a toast
    toast({
      title: "Certificate Downloaded",
      description: `You have downloaded your certificate for ${courseTitle}`,
    });
  };
  
  const isCompleted = progress >= 100;
  
  if (loading) {
    return <div className="h-40 flex items-center justify-center">Loading...</div>;
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          Course Certificate
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isCompleted ? (
          <div className="text-center">
            <div className="border-4 border-dashed border-green-500 p-6 rounded-lg mb-4">
              <h3 className="text-xl font-bold mb-2">Certificate of Completion</h3>
              <p className="text-muted-foreground">
                {user?.user_metadata?.full_name || user?.email}
              </p>
              <p className="mt-2">has successfully completed</p>
              <p className="font-semibold text-lg mt-1">{courseTitle}</p>
              <p className="text-sm text-muted-foreground mt-4">
                Issued on: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="border-4 border-dashed border-gray-300 p-6 rounded-lg mb-4 flex flex-col items-center justify-center">
              <Lock className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Certificate Locked</h3>
              <p className="text-muted-foreground">
                Complete 100% of the course to unlock your certificate
              </p>
              <div className="w-full mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Course Progress</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleDownload} 
          disabled={!isCompleted}
          className="w-full"
        >
          <Download className="mr-2 h-4 w-4" />
          {isCompleted ? "Download Certificate" : "Certificate Unavailable"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Certificate;
