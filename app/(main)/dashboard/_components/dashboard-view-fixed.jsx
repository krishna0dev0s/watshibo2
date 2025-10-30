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
.title-wrap{ position: relative; display: inline-flex; align-items: center; gap: 1rem }
.metallic-title{ position: relative; display: inline-block; font-weight: 800; background: linear-gradient(90deg, #bfc7d4 0%, #ffffff 45%, #cfd6de 55%, #aeb6c2 100%); background-size: 200% 100%; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; color: transparent; animation: shine 3s linear infinite; }
@keyframes shine{ 0%{ background-position: 200% 0 } 50%{ background-position: 0% 0 } 100%{ background-position: 200% 0 } }
.curve{ width: 36px; height: 24px; opacity: .9; }
.curve-left{ transform-origin: center; animation: floatLeft 3.5s ease-in-out infinite; }
.curve-right{ transform-origin: center; animation: floatRight 3.5s ease-in-out infinite; }
@keyframes floatLeft{ 0%{ transform: translateY(0) rotate(-6deg) } 50%{ transform: translateY(-6px) rotate(-2deg) } 100%{ transform: translateY(0) rotate(-6deg) } }
@keyframes floatRight{ 0%{ transform: translateY(0) rotate(6deg) } 50%{ transform: translateY(-6px) rotate(2deg) } 100%{ transform: translateY(0) rotate(6deg) } }
.corner-curve { position: absolute; width: 120px; height: 120px; opacity: 0.15; }
.top-left { top: 0; left: 0; transform: rotate(-90deg); }
.top-right { top: 0; right: 0; transform: rotate(0deg); }
.bottom-left { bottom: 0; left: 0; transform: rotate(180deg); }
.bottom-right { bottom: 0; right: 0; transform: rotate(90deg); }
@keyframes pulse { 0% { opacity: 0.1 } 50% { opacity: 0.2 } 100% { opacity: 0.1 } }
`;

export default function DashboardView({ insights }) {
  if (!insights) {
    return <div>Loading industry insights...</div>;
  }

  // Transform salary data for the chart
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

  // Format dates using date-fns
  const lastUpdatedDate = format(new Date(insights.lastUpdated), "dd/MM/yyyy");
  const nextUpdateDistance = formatDistanceToNow(new Date(insights.nextUpdate), {
    addSuffix: true,
  });

  return (
    <div className="w-full min-h-screen bg-background">
      <section className="relative w-full py-10 md:py-20 bg-muted/40 backdrop-blur-sm">
        {/* Corner decorative curves */}
        <svg className="corner-curve top-right" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 110C20 70 50 40 110 30" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        </svg>
        <svg className="corner-curve bottom-left" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 110C20 70 50 40 110 30" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        </svg>
        <svg className="corner-curve bottom-right" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 110C20 70 50 40 110 30" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        </svg>

        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="title-wrap">
                {/* left decorative curve */}
                <svg className="curve curve-left" viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M2 18C6 6 18 2 34 2" stroke="url(#g1)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" opacity="0.95" />
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#c6d0df" stopOpacity="0.9" />
                    </linearGradient>
                  </defs>
                </svg>

                <h1 className="text-4xl md:text-5xl lg:text-6xl metalic-wrapper">
                  <span className="metallic-title">Industry Insights</span>
                </h1>

                {/* right decorative curve */}
                <svg className="curve curve-right" viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M34 18C30 6 18 2 2 2" stroke="url(#g2)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" opacity="0.95" />
                  <defs>
                    <linearGradient id="g2" x1="1" y1="0" x2="0" y2="0">
                      <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#aeb6c2" stopOpacity="0.9" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <Badge variant="outline" className="mb-8">Last updated: {lastUpdatedDate}</Badge>
            </div>

            {/* inject styles for the title animations */}
            <style dangerouslySetInnerHTML={{ __html: titleStyles }} />

            {/* Market Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border border-border bg-card/80 backdrop-blur-md shadow-md hover:shadow-lg transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-base font-medium">Market Outlook</CardTitle>
                  <OutlookIcon className={`h-4 w-4 ${outlookColor}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{insights.marketOutlook}</div>
                  <p className="text-xs text-muted-foreground">Next update {nextUpdateDistance}</p>
                </CardContent>
              </Card>

              <Card className="border border-border bg-card/80 backdrop-blur-md shadow-md hover:shadow-lg transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Industry Growth</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{insights.growthRate.toFixed(1)}%</div>
                  <Progress value={insights.growthRate} className="mt-2" />
                </CardContent>
              </Card>

              <Card className="border border-border bg-card/80 backdrop-blur-md shadow-md hover:shadow-lg transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Demand Level</CardTitle>
                  <BriefcaseIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{insights.demandLevel}</div>
                  <div className={`h-2 w-full rounded-full mt-2 ${getDemandLevelColor(insights.demandLevel)}`} />
                </CardContent>
              </Card>

              <Card className="border border-border bg-card/80 backdrop-blur-md shadow-md hover:shadow-lg transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Top Skills</CardTitle>
                  <Brain className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1">
                    {insights.topSkills.map((skill) => (
                      <Badge key={skill} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Salary Ranges Chart */}
            <Card className="border border-border bg-card/80 backdrop-blur-md shadow-md hover:shadow-lg transition-all duration-300 p-8">
              <CardHeader>
                <CardTitle className="text-2xl font-bold mb-2">Salary Ranges by Role</CardTitle>
                <CardDescription>Displaying minimum, median, and maximum salaries (in thousands)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[450px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salaryData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-background border rounded-lg p-2 shadow-md">
                                <p className="font-medium">{label}</p>
                                {payload.map((item) => (
                                  <p key={item.name} className="text-sm">{item.name}: ${item.value}K</p>
                                ))}
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="min" fill="#94a3b8" name="Min Salary (K)" />
                      <Bar dataKey="median" fill="#64748b" name="Median Salary (K)" />
                      <Bar dataKey="max" fill="#475569" name="Max Salary (K)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Industry Trends */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border border-border bg-card/80 backdrop-blur-md shadow-md hover:shadow-lg transition-all duration-300">
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

              <Card className="border border-border bg-card/80 backdrop-blur-md shadow-md hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-xl font-bold mb-1">Recommended Skills</CardTitle>
                  <CardDescription>Skills to consider developing</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {insights.recommendedSkills.map((skill) => (
                      <Badge key={skill} variant="outline">{skill}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}