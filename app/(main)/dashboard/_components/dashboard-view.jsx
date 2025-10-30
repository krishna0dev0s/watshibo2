"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  BriefcaseIcon,
  LineChart,
  TrendingUp,
  TrendingDown,
  Brain,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// Small CSS injected for the metallic title and decorative curves.
const titleStyles = `
.title-wrap { 
  position: relative; 
  display: inline-flex; 
  align-items: center; 
  gap: 1rem; 
}
.metallic-title { 
  position: relative; 
  display: inline-block; 
  font-weight: 800; 
  background: linear-gradient(90deg, #bfc7d4 0%, #ffffff 45%, #cfd6de 55%, #aeb6c2 100%); 
  background-size: 200% 100%; 
  -webkit-background-clip: text; 
  -webkit-text-fill-color: transparent; 
  background-clip: text; 
  color: transparent; 
  animation: shine 3s linear infinite;
}
@keyframes shine { 
  0% { background-position: 200% 0 } 
  50% { background-position: 0% 0 } 
  100% { background-position: 200% 0 } 
}
@keyframes slideUp {
  0% { 
    opacity: 0;
    transform: translateY(20px);
  }
  100% { 
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-slide-up {
  animation: slideUp 0.5s ease-out forwards;
}
.stagger-1 { animation-delay: 0.1s; }
.stagger-2 { animation-delay: 0.2s; }
.stagger-3 { animation-delay: 0.3s; }
.stagger-4 { animation-delay: 0.4s; }
.curve { 
  width: 36px; 
  height: 24px; 
  opacity: .9; 
}
.curve-left { 
  transform-origin: center; 
  animation: floatLeft 3.5s ease-in-out infinite; 
}
.curve-right { 
  transform-origin: center; 
  animation: floatRight 3.5s ease-in-out infinite; 
}
@keyframes floatLeft { 
  0% { transform: translateY(0) rotate(-6deg) } 
  50% { transform: translateY(-6px) rotate(-2deg) } 
  100% { transform: translateY(0) rotate(-6deg) } 
}
@keyframes floatRight { 
  0% { transform: translateY(0) rotate(6deg) } 
  50% { transform: translateY(-6px) rotate(2deg) } 
  100% { transform: translateY(0) rotate(6deg) } 
}
.corner-curve { 
  position: absolute; 
  width: 120px; 
  height: 120px; 
  opacity: 0.15; 
}
.top-left { 
  top: 0; 
  left: 0; 
  transform: rotate(-90deg); 
}
.top-right { 
  top: 0; 
  right: 0; 
  transform: rotate(0deg); 
}
.bottom-left { 
  bottom: 0; 
  left: 0; 
  transform: rotate(180deg); 
}
.bottom-right { 
  bottom: 0; 
  right: 0; 
  transform: rotate(90deg); 
}`;

export default function DashboardView({ insights }) {
  if (!insights) {
    return <div>Loading industry insights...</div>;
  }

  const salaryData = insights.salaryRanges.map((range) => ({
    name: range.role,
    min: range.min / 1000,
    max: range.max / 1000,
    median: range.median / 1000,
  }));

  const getDemandLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case "high":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getMarketOutlookInfo = (outlook) => {
    switch (outlook.toLowerCase()) {
      case "positive":
        return { icon: TrendingUp, color: "text-green-500" };
      case "neutral":
        return { icon: LineChart, color: "text-yellow-500" };
      case "negative":
        return { icon: TrendingDown, color: "text-red-500" };
      default:
        return { icon: LineChart, color: "text-gray-500" };
    }
  };

  const OutlookIcon = getMarketOutlookInfo(insights.marketOutlook).icon;
  const outlookColor = getMarketOutlookInfo(insights.marketOutlook).color;

  const lastUpdatedDate = format(new Date(insights.lastUpdated), "dd/MM/yyyy");
  const nextUpdateDistance = formatDistanceToNow(new Date(insights.nextUpdate), {
    addSuffix: true,
  });

  return (
    <div className="w-full min-h-screen">
      {/* Background gradients */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 -top-24 w-[600px] h-[600px] bg-gradient-to-br from-[#7c3aed]/20 to-[#06b6d4]/20 opacity-30 rounded-full filter blur-3xl transform rotate-12" />
        <div className="absolute right-0 bottom-0 w-[600px] h-[600px] bg-gradient-to-tr from-[#ff7ab6]/20 to-[#7c3aed]/20 opacity-30 rounded-full filter blur-3xl" />
      </div>

      {/* Header Section */}
      <section className="relative w-full py-12 md:py-20 bg-muted/40 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <div className="title-wrap mx-auto inline-flex items-center justify-center">
              {/* Left curve */}
              <svg className="curve curve-left" viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M2 18C6 6 18 2 34 2" stroke="url(#g1)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" opacity="0.95" />
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#c6d0df" stopOpacity="0.9" />
                  </linearGradient>
                </defs>
              </svg>

              <h1 className="text-4xl md:text-5xl lg:text-6xl">
                <span className="metallic-title">Industry Insights</span>
              </h1>

              {/* Right curve */}
              <svg className="curve curve-right" viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M34 18C30 6 18 2 2 2" stroke="url(#g2)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" opacity="0.95" />
                <defs>
                  <linearGradient id="g2" x1="1" y1="0" x2="0" y2="0">
                    <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#aeb6c2" stopOpacity="0.9" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <Badge variant="outline" className="mt-4">Last updated: {lastUpdatedDate}</Badge>
          </div>

          {/* Inject styles for the title animations */}
          <style dangerouslySetInnerHTML={{ __html: titleStyles }} />

          {/* Market Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card className="bg-card/30 border border-white/10 backdrop-blur-sm hover:bg-card/40 hover:border-white/20 hover:scale-105 transition-all duration-300 animate-slide-up opacity-0 stagger-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-base font-medium">Market Outlook</CardTitle>
                <OutlookIcon className={`h-4 w-4 ${outlookColor}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{insights.marketOutlook}</div>
                <p className="text-xs text-muted-foreground">Next update {nextUpdateDistance}</p>
              </CardContent>
            </Card>

            <Card className="bg-card/30 border border-white/10 backdrop-blur-sm hover:bg-card/40 hover:border-white/20 hover:scale-105 transition-all duration-300 animate-slide-up opacity-0 stagger-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Industry Growth</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{insights.growthRate.toFixed(1)}%</div>
                <Progress value={insights.growthRate} className="mt-2" />
              </CardContent>
            </Card>

            <Card className="bg-card/30 border border-white/10 backdrop-blur-sm hover:bg-card/40 hover:border-white/20 hover:scale-105 transition-all duration-300 animate-slide-up opacity-0 stagger-3">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Demand Level</CardTitle>
                <BriefcaseIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{insights.demandLevel}</div>
                <div className={`h-2 w-full rounded-full mt-2 ${getDemandLevelColor(insights.demandLevel)}`} />
              </CardContent>
            </Card>

            <Card className="bg-card/30 border border-white/10 backdrop-blur-sm hover:bg-card/40 hover:border-white/20 hover:scale-105 transition-all duration-300 animate-slide-up opacity-0 stagger-4">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Top Skills</CardTitle>
                <Brain className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1">
                  {insights.topSkills.map((skill) => (
                    <Badge 
                      key={skill}
                      className="bg-white/5 hover:bg-white/10 text-foreground border-white/10 hover:border-white/20 transition-colors"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Chart Section */}
      <section className="w-full py-12 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <Card className="bg-card/30 border border-white/10 backdrop-blur-sm hover:bg-card/40 hover:border-white/20 hover:scale-[1.02] transition-all duration-300 animate-slide-up opacity-0 stagger-1">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Salary Ranges by Role</CardTitle>
                <CardDescription>Displaying minimum, median, and maximum salaries (in thousands)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[450px] mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salaryData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
                      <XAxis 
                        dataKey="name" 
                        stroke="currentColor" 
                        fontSize={12}
                        tickLine={false}
                        axisLine={{ stroke: 'currentColor', opacity: 0.2 }}
                      />
                      <YAxis 
                        stroke="currentColor" 
                        fontSize={12}
                        tickLine={false}
                        axisLine={{ stroke: 'currentColor', opacity: 0.2 }}
                        tickFormatter={(value) => `$${value}K`}
                      />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-background/95 backdrop-blur-sm border border-white/10 rounded-lg p-3 shadow-xl">
                                <p className="font-medium mb-2">{label}</p>
                                {payload.map((item) => (
                                  <p key={item.name} className="text-sm text-muted-foreground">
                                    {item.name}: ${item.value}K
                                  </p>
                                ))}
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar 
                        dataKey="min" 
                        name="Min Salary"
                        fill="url(#minGradient)" 
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar 
                        dataKey="median" 
                        name="Median Salary"
                        fill="url(#medianGradient)" 
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar 
                        dataKey="max" 
                        name="Max Salary"
                        fill="url(#maxGradient)" 
                        radius={[4, 4, 0, 0]}
                      />
                      <defs>
                        <linearGradient id="minGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#94a3b8" stopOpacity={0.8} />
                          <stop offset="100%" stopColor="#94a3b8" stopOpacity={0.2} />
                        </linearGradient>
                        <linearGradient id="medianGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#64748b" stopOpacity={0.8} />
                          <stop offset="100%" stopColor="#64748b" stopOpacity={0.2} />
                        </linearGradient>
                        <linearGradient id="maxGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#475569" stopOpacity={0.8} />
                          <stop offset="100%" stopColor="#475569" stopOpacity={0.2} />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trends & Skills Section */}
      <section className="w-full py-12 md:py-24 bg-muted/40 backdrop-blur-sm">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            <Card className="bg-card/30 border border-white/10 backdrop-blur-sm hover:bg-card/40 hover:border-white/20 hover:scale-[1.02] transition-all duration-300 animate-slide-up opacity-0 stagger-2">
              <CardHeader>
                <CardTitle className="text-xl font-bold mb-1">Key Industry Trends</CardTitle>
                <CardDescription>Current trends shaping the industry</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-5">
                  {insights.keyTrends.map((trend, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="h-2 w-2 mt-2 rounded-full bg-primary" />
                      <span className="text-base">{trend}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card/30 border border-white/10 backdrop-blur-sm hover:bg-card/40 hover:border-white/20 hover:scale-[1.02] transition-all duration-300 animate-slide-up opacity-0 stagger-3">
              <CardHeader>
                <CardTitle className="text-xl font-bold mb-1">Recommended Skills</CardTitle>
                <CardDescription>Skills to consider developing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {insights.recommendedSkills.map((skill) => (
                    <Badge 
                      key={skill}
                      className="px-3 py-1 text-sm bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20 transition-all"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}