
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "@/assests/logo.png";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Mail,
  ArrowRight,
  GraduationCap,
  Users,
  ChevronRight,
  Lock,
} from "lucide-react";

const googleProvider = new GoogleAuthProvider();

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!year) {
      setYearError("Please select your year first");
      return;
    }
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f3f6fb] via-[#f8f9fa] to-[#f0f4f9] flex">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 0% 0%, #e8f0fe 0%, #f3f6fb 40%, #f8fafc 100%)" }} />
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-[#1a73e8]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-200px] right-1/4 w-[500px] h-[500px] bg-[#34a853]/8 rounded-full blur-[100px]" />
      </div>          {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative z-10">
        <div className="flex flex-col justify-center px-16 w-full">
          <Link to="/" className="flex items-center gap-3 absolute top-6 left-16">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#e8f0fe] to-[#e0e7ff] flex items-center justify-center shadow-sm border border-[#dadce0]">
              <img
                src={Logo}
                alt="Code4Career"
                className="w-7 h-7 object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-semibold tracking-tight text-[#202124]">Code4Career</span>
              <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#5f6368]">Contest Platform</span>
            </div>
          </Link>

          <h1 className="text-5xl font-semibold text-[#202124] mb-4 leading-tight">
            Welcome to <br />
            <span style={{
              background: "linear-gradient(to right, #1a73e8, #34a853, #ea4335)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              Your Placement Journey
            </span>
          </h1>

          <p className="text-[#5f6368] text-lg mb-10 max-w-md leading-relaxed">
            Monthly contests, AI-powered analytics, and fair campus-wide competition to make you interview-ready.
          </p>

          <div className="space-y-5">
            <div className="flex gap-4 items-start">
              <div className="mt-1 p-2 rounded-lg bg-[#e8f0fe]">
                <GraduationCap className="w-5 h-5 text-[#1a73e8]" />
              </div>
              <div>
                <p className="font-medium text-[#202124]">Smart Divisions</p>
                <p className="text-sm text-[#5f6368]">Year-wise grouping for fair competition</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="mt-1 p-2 rounded-lg bg-[#e6f4ea]">
                <Users className="w-5 h-5 text-[#34a853]" />
              </div>
              <div>
                <p className="font-medium text-[#202124]">Live Contests</p>
                <p className="text-sm text-[#5f6368]">Intra-college multi-skill competitions</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 lg:px-0 relative z-10">
        <div className="w-full max-w-md bg-gradient-to-br from-white/98 to-[#f9fafb] border border-[#dadce0] rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-semibold text-[#202124] mb-2">Student Login</h2>
          <p className="text-[#5f6368] text-sm mb-8">
            Select your year to get started
          </p>

          {/* Google Login Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={!year || loading}
            className="w-full h-12 mb-4 rounded-full border border-[#dadce0] text-[#202124] bg-white hover:bg-[#f9fafb] transition-colors font-medium flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#1a73e8" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#fbbc04" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            {loading ? "Signing in..." : "Continue with Google"}
          </button>

          {yearError && (
            <p className="text-sm text-[#ea4335] mb-4 bg-[#fce8e6] px-4 py-2 rounded-lg">
              {yearError}
            </p>
          )}

          <div className="relative text-center mb-6">
            <div className="absolute inset-x-0 top-1/2 h-px bg-[#dadce0]" />
            <span className="relative inline-block px-3 bg-gradient-to-br from-white/98 to-[#f9fafb] text-[#5f6368] text-sm font-medium">
              OR
            </span>
          </div>

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-[#202124]">
                College Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5f6368]" />
                <Input
                  type="email"
                  placeholder="yourname@college.edu"
                  className="pl-12 h-12 border-[#dadce0] rounded-xl focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/10 bg-white text-[#202124]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!year}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-[#202124]">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5f6368]" />
                <Input
                  type="password"
                  placeholder="Enter your password"
                  className="pl-12 h-12 border-[#dadce0] rounded-xl focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/10 bg-white text-[#202124]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={!year}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-[#202124]">
                Year of Study
              </Label>
              <Select value={year} onValueChange={handleYearChange}>
                <SelectTrigger className="h-12 border-[#dadce0] rounded-xl">
                  <SelectValue placeholder="Select your year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1st Year (Div 4)</SelectItem>
                  <SelectItem value="2">2nd Year (Div 3)</SelectItem>
                  <SelectItem value="3">3rd Year (Div 2)</SelectItem>
                  <SelectItem value="4">Final Year (Div 1)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {division && (
              <div className="p-4 rounded-xl bg-gradient-to-br from-[#e8f0fe] to-[#e0e7ff] border border-[#d2e3fc]">
                <p className="text-xs font-medium text-[#5f6368] uppercase tracking-wider">
                  Assigned Division
                </p>
                <p className="text-xl font-semibold text-[#1a73e8] mt-1">{division}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={!email || !password || !year}
              className="w-full h-12 text-base font-medium rounded-full bg-gradient-to-br from-[#1a73e8] to-[#1765cc] text-white hover:shadow-lg hover:shadow-[#1a73e8]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Enter Dashboard
              <ArrowRight className="w-5 h-5" />
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#dadce0]">
            <Link
              to="/college-dashboard"
              className="flex items-center justify-between px-4 py-3 rounded-lg text-[#1a73e8] hover:bg-[#e8f0fe] transition-colors group"
            >
              <span className="text-sm font-medium">Placement Cell Login</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;