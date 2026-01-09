
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Logo from "@/assests/logo.png"; // or .png

import {
  Trophy,
  Brain,
  Code,
  Calculator,
  Users,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Zap,
} from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen overflow-hidden font-sans antialiased transition-colors duration-200 bg-gradient-to-br from-[#f3f6fb] via-[#f8f9fa] to-[#f0f4f9] text-[#202124]">
      {/* Background Layer: gradient + radial lights */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        {/* Main soft gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 0% 0%, #e8f0fe 0, #f3f6fb 40%, #f8fafc 100%)",
          }}
        />

        {/* Contest lanes / tracks */}
        <div
          className="absolute inset-x-0 top-24 h-[60%] opacity-50"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(26,115,232,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(218,220,224,0.6) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        {/* Radial spotlights behind hero - more pronounced */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[720px] h-[720px] bg-[#1a73e8]/15 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-180px] left-[-120px] w-[480px] h-[480px] bg-[#34a853]/12 rounded-full blur-[130px]" />
        <div className="absolute bottom-[-200px] right-[-80px] w-[420px] h-[420px] bg-[#9334e6]/14 rounded-full blur-[140px]" />

        {/* Extra subtle accent light */}
        <div className="absolute top-1/3 right-1/4 w-[350px] h-[350px] bg-[#fbbc04]/10 rounded-full blur-[120px]" />

        {/* Floating contest pills */}
        <div className="absolute top-32 left-[10%] animate-float">
          <div className="px-3 py-1 rounded-full bg-white/85 border border-[#d2e3fc] shadow-md text-[11px] text-[#1a73e8] font-medium">
            Live contest • 120+ participants
          </div>
        </div>
        <div className="absolute top-[55%] right-[12%] animate-float" style={{ animationDelay: "1.5s" }}>
          <div className="px-3 py-1 rounded-full bg-white/85 border border-[#dadce0] shadow-md text-[11px] text-[#5f6368] font-medium">
            Avg score this week ↑
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#e8f0fe] to-[#e0e7ff] flex items-center justify-center shadow-sm border border-[#dadce0]">
           <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#e8f0fe] to-[#e0e7ff] flex items-center justify-center shadow-sm border border-[#dadce0]">
  <img
    src={Logo}
    alt="Code4Career"
    className="w-15 h-15 object-contain"
  />
</div>

            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[20px] font-semibold tracking-tight text-[#202124]">
                Code4Career
              </span>
              <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#5f6368]">
                 contest platform
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link to="/login">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full px-4 text-sm font-medium text-[#3c4043] hover:bg-[#e8f0fe] hover:text-[#202124] transition-colors"
              >
                Login
              </Button>
            </Link>
            <Link to="/college-dashboard">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full px-4 text-sm font-medium border-[#dadce0] text-[#3c4043] hover:bg-[#e8f0fe] hover:text-[#202124] transition-colors"
              >
                College Dashboard
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 md:pt-18 pb-24 md:pb-32">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#e8f0fe] to-[#e0e7ff] border border-[#d2e3fc] mb-5 md:mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-[#1a73e8]" />
            <span className="text-xs sm:text-sm font-medium text-[#1a73e8] tracking-tight">
              AI-powered, multi-skill placement prep
            </span>
          </div>

          {/* Title */}
          <h1 className="text-[30px] sm:text-[40px] md:text-[52px] lg:text-[58px] font-semibold tracking-tight text-[#202124] mb-3 leading-tight">
            One platform for
            <span className="block mt-1 bg-clip-text text-transparent bg-gradient-to-r from-[#1a73e8] via-[#34a853] to-[#ea4335]">
              all your placement skills.
            </span>
          </h1>

          {/* Sub-headline */}
          <p className="text-[13px] sm:text-sm md:text-base font-medium uppercase tracking-[0.18em] text-[#5f6368] mb-6">
            Contest-first • Analytics-driven • College-ready
          </p>

          {/* Subtitle with skill tags */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-9">
            <span className="px-3 py-1.5 rounded-full bg-gradient-to-br from-white/90 to-[#f9fafb] border border-[#dadce0] text-xs sm:text-sm text-[#202124] font-medium flex items-center gap-1.5 shadow-sm">
              <Code className="w-3.5 h-3.5 text-[#1a73e8]" /> CP
            </span>
            <span className="text-[#5f6368] text-sm">•</span>
            <span className="px-3 py-1.5 rounded-full bg-gradient-to-br from-white/90 to-[#f9fafb] border border-[#dadce0] text-xs sm:text-sm text-[#202124] font-medium flex items-center gap-1.5 shadow-sm">
              <TrendingUp className="w-3.5 h-3.5 text-[#34a853]" /> DSA
            </span>
            <span className="text-[#5f6368] text-sm">•</span>
            <span className="px-3 py-1.5 rounded-full bg-gradient-to-br from-white/90 to-[#f9fafb] border border-[#dadce0] text-xs sm:text-sm text-[#202124] font-medium flex items-center gap-1.5 shadow-sm">
              <Brain className="w-3.5 h-3.5 text-[#1a73e8]" /> Development
            </span>
            <span className="text-[#5f6368] text-sm">•</span>
            <span className="px-3 py-1.5 rounded-full bg-gradient-to-br from-white/90 to-[#f9fafb] border border-[#dadce0] text-xs sm:text-sm text-[#202124] font-medium flex items-center gap-1.5 shadow-sm">
              <Calculator className="w-3.5 h-3.5 text-[#9334e6]" /> Aptitude
            </span>
          </div>

          {/* Description */}
          <p className="text-sm sm:text-base md:text-lg text-[#5f6368] max-w-3xl mx-auto mb-10 leading-relaxed">
            Code4Career turns your college contests into a cohesive, data-driven placement journey. Track performance across skills, get AI feedback after every contest, and stay ahead of your batch.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/login">
              <Button
                variant="default"
                size="lg"
                className="rounded-full text-sm sm:text-base px-7 py-2.5 sm:py-3 shadow-lg shadow-[#1a73e8]/30 bg-gradient-to-br from-[#1a73e8] to-[#1765cc] text-white hover:shadow-xl hover:shadow-[#1a73e8]/40 transition-all flex items-center gap-2 group"
              >
                <Users className="w-4 h-4" />
                Login as student
                <ArrowRight className="w-4 h-4 translate-x-0 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
            <Link to="/college-dashboard">
              <Button
  variant="outline"
  size="lg"
  className="rounded-full text-sm sm:text-base px-7 py-2.5 sm:py-3 
             border-[#dadce0] text-[#1a73e8] bg-white/80 
             hover:bg-[#1a73e8] hover:border-[#1a73e8] 
             transition-colors flex items-center gap-2"
>
  <Trophy className="w-4 h-4" />
  View college dashboard
</Button>

            </Link>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-4 md:gap-6 mt-16 md:mt-20 max-w-4xl mx-auto">
          <div className="rounded-xl bg-gradient-to-br from-white/98 to-[#f9fafb] backdrop-blur-sm border border-[#dadce0] p-5 text-left shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#e8f0fe] to-[#e0e7ff] flex items-center justify-center mb-4">
              <Trophy className="w-6 h-6 text-[#1a73e8]" />
            </div>
            <h3 className="text-sm sm:text-base font-medium text-[#202124] mb-1.5">
              Structured monthly cycles
            </h3>
            <p className="text-xs sm:text-sm text-[#5f6368] leading-relaxed">
              Run recurring, placement-style contests with consistent formats so students can measure progress across the semester.
            </p>
          </div>

          <div className="rounded-xl bg-gradient-to-br from-white/98 to-[#f9fafb] backdrop-blur-sm border border-[#dadce0] p-5 text-left shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#e6f4ea] to-[#dcfce7] flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-[#1a73e8]" />
            </div>
            <h3 className="text-sm sm:text-base font-medium text-[#202124] mb-1.5">
              Deep AI insights
            </h3>
            <p className="text-xs sm:text-sm text-[#5f6368] leading-relaxed">
              Get per-skill breakdowns, weak topic detection, and smarter practice suggestions after every contest.
            </p>
          </div>

          <div className="rounded-xl bg-gradient-to-br from-white/98 to-[#f9fafb] backdrop-blur-sm border border-[#dadce0] p-5 text-left shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#fef3c7] to-[#fde68a] flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-[#34a853]" />
            </div>
            <h3 className="text-sm sm:text-base font-medium text-[#202124] mb-1.5">
              Smart divisions
            </h3>
            <p className="text-xs sm:text-sm text-[#5f6368] leading-relaxed">
              Group students by year and performance bands so every contest feels competitive but fair.
            </p>
          </div>
        </div>

        {/* Illustration */}
        <div className="mt-16 md:mt-20 flex justify-center">
          <div className="rounded-2xl md:rounded-3xl bg-gradient-to-br from-white/98 to-[#f9fafb] backdrop-blur-sm border border-[#dadce0] px-5 py-6 md:px-8 md:py-7 shadow-lg max-w-3xl w-full">
            <div className="flex items-center gap-4 md:gap-6 flex-wrap justify-center md:justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-gradient-to-br from-[#e8f0fe] to-[#e0e7ff] flex items-center justify-center">
                  <span className="text-sm md:text-base font-medium text-[#1a73e8]">
                    1
                  </span>
                </div>
                <div>
                  <p className="text-xs md:text-sm font-medium text-[#202124]">
                    Contest
                  </p>
                  <p className="text-[11px] md:text-xs text-[#5f6368]">
                    Multi-skill round
                  </p>
                </div>
              </div>

              <ArrowRight className="w-4 h-4 text-[#5f6368] hidden sm:block" />

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-gradient-to-br from-[#e6f4ea] to-[#dcfce7] flex items-center justify-center">
                  <span className="text-sm md:text-base font-medium text-[#1a73e8]">
                    2
                  </span>
                </div>
                <div>
                  <p className="text-xs md:text-sm font-medium text-[#202124]">
                    AI analysis
                  </p>
                  <p className="text-[11px] md:text-xs text-[#5f6368]">
                    Strengths & gaps
                  </p>
                </div>
              </div>

              <ArrowRight className="w-4 h-4 text-[#5f6368] hidden sm:block" />

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-gradient-to-br from-[#fef3c7] to-[#fde68a] flex items-center justify-center">
                  <span className="text-sm md:text-base font-medium text-[#34a853]">
                    3
                  </span>
                </div>
                <div>
                  <p className="text-xs md:text-sm font-medium text-[#202124]">
                    Guided upsolve
                  </p>
                  <p className="text-[11px] md:text-xs text-[#5f6368]">
                    Targeted practice
                  </p>
                </div>
              </div>

              <ArrowRight className="w-4 h-4 text-[#5f6368] hidden sm:block" />

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-gradient-to-br from-[#f3e8fd] to-[#ede9fe] flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-[#9334e6]" />
                </div>
                <div>
                  <p className="text-xs md:text-sm font-medium text-[#202124]">
                    Placement ready
                  </p>
                  <p className="text-[11px] md:text-xs text-[#5f6368]">
                    Confident interviews
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Tailwind float animation */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Landing;