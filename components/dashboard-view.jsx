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
import { motion } from "framer-motion";
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

const DashboardView = ({ insights }) => {
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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="w-full py-10 md:py-20">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-8"
      >
      <div className="hero-content text-center space-y-6 mb-12">
        <div className="hero-title">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight metallic-text">
            Industry Insights
            <br />
            <span className="metallic-blue">
              Real-time Analysis & Trends
            </span>
          </h1>
        </div>
        <div className="hero-subtitle">
          <p className="mt-6 text-lg md:text-xl lg:text-2xl font-medium max-w-3xl mx-auto text-gray-100">
            Stay ahead with AI-powered insights and market analysis for your industry
          </p>
        </div>
        <div className="hero-buttons">
          <Badge variant="outline" className="bg-background/60 backdrop-blur-sm shadow-sm text-base px-4 py-2">
            Last updated: {lastUpdatedDate}
          </Badge>
        </div>
      </div>        {/* Market Overview Cards */}
      <motion.div 
        variants={item}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card className="border-2 border-muted bg-background/60 hover:border-primary hover:shadow-xl transition-all duration-300 ease-in-out backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Market Outlook</CardTitle>
              <OutlookIcon className={`h-4 w-4 ${outlookColor}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{insights.marketOutlook}</div>
              <p className="text-xs text-muted-foreground">
                Next update {nextUpdateDistance}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card className="border-2 border-muted bg-background/60 hover:border-primary hover:shadow-xl transition-all duration-300 ease-in-out backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Industry Growth</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {insights.growthRate.toFixed(1)}%
              </div>
              <Progress value={insights.growthRate} className="mt-2" />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card className="border-2 border-muted bg-background/60 hover:border-primary hover:shadow-xl transition-all duration-300 ease-in-out backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Demand Level</CardTitle>
              <BriefcaseIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{insights.demandLevel}</div>
              <div
                className={`h-2 w-full rounded-full mt-2 ${getDemandLevelColor(
                  insights.demandLevel
                )}`}
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card className="border-2 border-muted bg-background/60 hover:border-primary hover:shadow-xl transition-all duration-300 ease-in-out backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Skills</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1">
                {insights.topSkills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="bg-primary/10 text-primary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Salary Ranges Chart */}
      <motion.div variants={item}>
        <Card className="col-span-4 border-2 border-muted bg-background/60 hover:border-primary hover:shadow-xl transition-all duration-300 ease-in-out backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Salary Ranges by Role</CardTitle>
            <CardDescription>
              Displaying minimum, median, and maximum salaries (in thousands)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salaryData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-background/80 backdrop-blur-sm border rounded-lg p-3 shadow-xl">
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
                  <Bar dataKey="min" fill="rgba(148, 163, 184, 0.7)" name="Min Salary (K)" />
                  <Bar dataKey="median" fill="rgba(100, 116, 139, 0.8)" name="Median Salary (K)" />
                  <Bar dataKey="max" fill="rgba(71, 85, 105, 0.9)" name="Max Salary (K)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Industry Trends */}
      <motion.div 
        variants={item}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card className="border-2 border-muted bg-background/60 hover:border-primary hover:shadow-xl transition-all duration-300 ease-in-out backdrop-blur-sm h-full">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Key Industry Trends</CardTitle>
              <CardDescription>Current trends shaping the industry</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {insights.keyTrends.map((trend, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-3 group"
                  >
                    <div className="h-2 w-2 mt-2 rounded-full bg-primary group-hover:scale-125 transition-transform" />
                    <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                      {trend}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card className="border-2 border-muted bg-background/60 hover:border-primary hover:shadow-xl transition-all duration-300 ease-in-out backdrop-blur-sm h-full">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Recommended Skills</CardTitle>
              <CardDescription>Skills to consider developing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {insights.recommendedSkills.map((skill, index) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Badge 
                      variant="outline"
                      className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors px-3 py-1 text-sm"
                    >
                      {skill}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
      </motion.div>
    </div>
  );
};

export default DashboardView;