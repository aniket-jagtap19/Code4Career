import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ContestDetails from "./pages/ContestDetails";
import Contest from "./pages/Contest";
import Submission from "./pages/Submission";
import AIAnalysis from "./pages/AIAnalysis";
import Upsolve from "./pages/Upsolve";
import LeaderboardPage from "./pages/LeaderboardPage";
import CollegeDashboard from "./pages/CollegeDashboard";
import Growth from "./pages/Growth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/contest-details" element={<ContestDetails />} />
          <Route path="/contest" element={<Contest />} />
          <Route path="/submission" element={<Submission />} />
          <Route path="/ai-analysis" element={<AIAnalysis />} />
          <Route path="/upsolve" element={<Upsolve />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/college-dashboard" element={<CollegeDashboard />} />
          <Route path="/growth" element={<Growth />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
