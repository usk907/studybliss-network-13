
import { LoginForm } from "@/components/auth/LoginForm";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Login form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-elearn-primary">StudyBliss</h1>
            <p className="text-gray-600 mt-2">Your personalized learning platform</p>
          </div>
          
          <LoginForm />
        </div>
      </div>
      
      {/* Right side - Image and benefits */}
      <div className="hidden md:flex md:flex-1 bg-elearn-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-elearn-primary to-elearn-secondary opacity-90"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1974&q=80')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="relative flex flex-col justify-center p-12 text-white z-10">
          <h2 className="text-3xl font-bold mb-6">Supercharge Your Learning</h2>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p>Access to 1000+ courses across multiple disciplines</p>
            </li>
            <li className="flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p>AI-powered learning assistant to help with your questions</p>
            </li>
            <li className="flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p>Track your progress and improve your performance</p>
            </li>
            <li className="flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p>Join a community of learners and collaborate on projects</p>
            </li>
          </ul>
          
          <p className="mt-6 italic">"Education is the most powerful weapon which you can use to change the world."</p>
          <p className="font-semibold">— Nelson Mandela</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
