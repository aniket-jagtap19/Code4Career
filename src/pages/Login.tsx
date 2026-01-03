import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

import { auth, db } from "@/lib/firebase";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Zap,
  Mail,
  ArrowRight,
  GraduationCap,
  Users,
  ChevronRight,
} from "lucide-react";

const googleProvider = new GoogleAuthProvider();

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [year, setYear] = useState("");
  const [division, setDivision] = useState("");
  const [loading, setLoading] = useState(false);
  const [yearError, setYearError] = useState("");

  const getDivision = (selectedYear: string) => {
    switch (selectedYear) {
      case "1":
        return "Div 4";
      case "2":
        return "Div 3";
      case "3":
        return "Div 2";
      case "4":
        return "Div 1";
      default:
        return "";
    }
  };

  const handleYearChange = (value: string) => {
    setYear(value);
    setDivision(getDivision(value));
    setYearError("");
  };

  // 🔵 Google Login (YEAR MANDATORY)
  const handleGoogleLogin = async () => {
    if (!year) {
      setYearError("Please select your year before continuing");
      return;
    }

    try {
      setLoading(true);

      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        photo: user.photoURL,
        year,
        division,
        role: "student",
        createdAt: new Date(),
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("Google login failed:", error);
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  // 📧 Email flow (UI only for now)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!year) {
      setYearError("Please select your year first");
      return;
    }

    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />
        <div className="relative z-10 flex flex-col justify-center px-16">
          <Link to="/" className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <span className="text-2xl font-bold">SkillSprint</span>
          </Link>

          <h1 className="text-4xl font-bold mb-4">
            Welcome to your <br />
            <span className="gradient-text">Placement Journey</span>
          </h1>

          <p className="text-muted-foreground text-lg mb-8 max-w-md">
            Monthly contests, AI insights, and campus-wide competition.
          </p>

          <div className="space-y-4">
            <div className="flex gap-4 items-center">
              <GraduationCap className="w-6 h-6 text-primary" />
              <p>Year-wise divisions</p>
            </div>
            <div className="flex gap-4 items-center">
              <Users className="w-6 h-6 text-accent" />
              <p>Intra-college competition</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md glass rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-2">Student Login</h2>
          <p className="text-muted-foreground mb-6">
            Select year first to continue
          </p>

          {/* Google Login */}
          <Button
            type="button"
            variant="outline"
            className="w-full h-12 mb-4"
            onClick={handleGoogleLogin}
            disabled={!year || loading}
          >
            Continue with Google
          </Button>

          {yearError && (
            <p className="text-sm text-red-500 mb-4">{yearError}</p>
          )}

          <div className="relative text-center mb-6">
            <span className="text-sm text-muted-foreground bg-background px-2">
              OR
            </span>
          </div>

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>College Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="yourname@college.edu"
                  className="pl-11 h-12"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!year}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Year of Study</Label>
              <Select value={year} onValueChange={handleYearChange}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1st Year</SelectItem>
                  <SelectItem value="2">2nd Year</SelectItem>
                  <SelectItem value="3">3rd Year</SelectItem>
                  <SelectItem value="4">Final Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {division && (
              <div className="p-4 rounded-xl bg-primary/10">
                <p className="text-sm">Assigned Division</p>
                <p className="text-lg font-bold text-primary">{division}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 text-lg"
              disabled={!email || !year}
            >
              Enter Dashboard
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t">
            <Link
              to="/college-dashboard"
              className="flex items-center justify-between text-sm text-muted-foreground"
            >
              Placement Cell Login
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
