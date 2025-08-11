import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, GraduationCap, Mail, Lock, User, ArrowRight, Sparkles } from "lucide-react";

interface AuthScreenProps {
  onAuthSuccess: () => void;
}

const AuthScreen = ({ onAuthSuccess }: AuthScreenProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        onAuthSuccess();
      }
    };
    checkUser();
  }, [onAuthSuccess]);

  const handleModeSwitch = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsSignUp(!isSignUp);
      setIsAnimating(false);
    }, 150);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            display_name: displayName
          }
        }
      });
      if (error) throw error;
      toast({
        title: "Success! ✨",
        description: "Please check your email to confirm your account."
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      onAuthSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-secondary/20 to-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-accent/10 to-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 animate-float">
        <div className="w-4 h-4 bg-primary/30 rounded-full"></div>
      </div>
      <div className="absolute top-40 right-32 animate-float" style={{ animationDelay: '1s' }}>
        <div className="w-3 h-3 bg-secondary/40 rounded-full"></div>
      </div>
      <div className="absolute bottom-32 left-1/4 animate-float" style={{ animationDelay: '2s' }}>
        <div className="w-5 h-5 bg-accent/30 rounded-full"></div>
      </div>

      <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Illustration/Welcome */}
        <div className="hidden lg:flex flex-col items-center justify-center text-center space-y-6 animate-fade-up">
          <div className="relative">
            <div className="w-64 h-64 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow animate-pulse-glow">
              <GraduationCap className="w-32 h-32 text-white animate-float" />
            </div>
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-accent rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-foreground">
              Welcome to <span className="text-primary">EduNise</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-md">
              Your personal student companion for academic excellence and productivity
            </p>
            <div className="flex items-center justify-center gap-2 text-primary">
              <Sparkles className="w-5 h-5 animate-pulse" />
              <span className="text-sm font-medium">Smart • Intuitive • Powerful</span>
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="flex items-center justify-center">
          <Card className="w-full max-w-md bg-white/80 dark:bg-card/80 backdrop-blur-xl border border-white/20 shadow-2xl animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="text-center space-y-4 pb-6">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl mx-auto flex items-center justify-center shadow-soft animate-bounce-gentle">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-2xl font-bold text-foreground">
                  {isSignUp ? "Create Account" : "Welcome Back!"}
                </CardTitle>
                <p className="text-muted-foreground">
                  {isSignUp 
                    ? "Join thousands of students achieving their goals" 
                    : "Sign in to continue your learning journey"
                  }
                </p>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-4">
                {/* Name Field - Only for Sign Up */}
                <div className={`transition-all duration-300 ${isSignUp ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0 overflow-hidden'}`}>
                  <Label htmlFor="name" className="text-foreground font-medium">Full Name</Label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="pl-10 bg-white/50 dark:bg-card/50 border-white/30 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300"
                      required={isSignUp}
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className={`transition-all duration-300 ${isAnimating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
                  <Label htmlFor="email" className="text-foreground font-medium">Email</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-white/50 dark:bg-card/50 border-white/30 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className={`transition-all duration-300 ${isAnimating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
                  <Label htmlFor="password" className="text-foreground font-medium">Password</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 bg-white/50 dark:bg-card/50 border-white/30 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Forgot Password - Only for Sign In */}
                {!isSignUp && (
                  <div className="text-right">
                    <button
                      type="button"
                      className="text-sm text-primary hover:text-primary/80 transition-colors duration-200"
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-primary hover:bg-gradient-primary/90 text-white border-0 shadow-soft hover:shadow-glow transition-all duration-300 group"
                  disabled={loading}
                  size="lg"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      {isSignUp ? "Creating Account..." : "Signing In..."}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      {isSignUp ? "Create Account" : "Sign In"}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </div>
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/50"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-card px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              {/* Social Login Buttons */}
              <div className="grid grid-cols-3 gap-3">
                <Button variant="outline" className="bg-white/50 dark:bg-card/50 border-white/30 hover:bg-white/80 transition-all duration-300 hover:scale-105">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </Button>
                <Button variant="outline" className="bg-white/50 dark:bg-card/50 border-white/30 hover:bg-white/80 transition-all duration-300 hover:scale-105">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </Button>
                <Button variant="outline" className="bg-white/50 dark:bg-card/50 border-white/30 hover:bg-white/80 transition-all duration-300 hover:scale-105">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                </Button>
              </div>

              {/* Mode Switch */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {isSignUp ? "Already have an account?" : "Don't have an account?"}
                  <button
                    type="button"
                    onClick={handleModeSwitch}
                    className="ml-2 text-primary hover:text-primary/80 font-medium transition-colors duration-200 hover:underline"
                  >
                    {isSignUp ? "Sign In" : "Sign Up"}
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;