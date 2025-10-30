import { getAssessments } from "@/actions/interview";
import StatsCards from "./_components/stats-cards";
import PerformanceChart from "./_components/performace-chart";
import QuizList from "./_components/quiz-list";

export default async function InterviewPrepPage() {
  const assessments = await getAssessments();

  return (
    <div className="w-full py-10 md:py-20 bg-muted/40 backdrop-blur-sm min-h-screen">
      {/* Background gradients */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 -top-24 w-[600px] h-[600px] bg-gradient-to-br from-[#7c3aed]/20 to-[#06b6d4]/20 opacity-30 rounded-full filter blur-3xl transform rotate-12" />
        <div className="absolute right-0 bottom-0 w-[600px] h-[600px] bg-gradient-to-tr from-[#ff7ab6]/20 to-[#7c3aed]/20 opacity-30 rounded-full filter blur-3xl" />
      </div>

      <div className="container mx-auto px-4 md:px-6">
        {/* Header Section */}
        <div className="space-y-6 text-center container mx-auto mb-12">
          <div className="space-y-6 hero-content">
            <div className="hero-title">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight metallic-text">
                Interview Preparation
                <br />
                <span className="metallic-blue">
                  Your Path to Success
                </span>
              </h1>
              <p className="mt-6 text-lg md:text-xl lg:text-2xl font-medium max-w-3xl mx-auto text-gray-100">
                Track your progress, analyze performance, and practice with AI-powered mock interviews.
              </p>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Stats Section */}
          <section>
            <h2 className="text-2xl font-semibold mb-6 text-foreground/80">Performance Overview</h2>
            <StatsCards assessments={assessments} />
          </section>

          {/* Chart Section */}
          <section className="bg-card/30 border border-white/10 backdrop-blur-sm rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-6 text-foreground/80">Progress Analysis</h2>
            <PerformanceChart assessments={assessments} />
          </section>

          {/* Quiz List Section */}
          <section>
            <h2 className="text-2xl font-semibold mb-6 text-foreground/80">Past Assessments</h2>
            <QuizList assessments={assessments} />
          </section>
        </div>
      </div>
    </div>
  );
}
