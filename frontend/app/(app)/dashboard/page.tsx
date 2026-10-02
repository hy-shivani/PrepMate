"use client";

import { useState, useEffect } from "react";
import { WelcomeCard } from "@/components/dashboard/welcome-card";
import { StatCard } from "@/components/dashboard/stat-card";
import { RecentInterviews } from "@/components/dashboard/recent-interviews";
import { Reveal } from "@/components/motion/reveal";
import { Trophy, TrendingUp, FileText } from "lucide-react";

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<any>(null);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard`,
          {
            credentials: "include",
          }
        );

        const data = await res.json();

        if (res.ok) {
          setDashboard(data);
        } else {
          console.log(data.message);
        }
      } catch (err) {
        console.log(err);
      }
    }

    fetchDashboard();
  }, []);

  if (!dashboard) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <Reveal>
        <WelcomeCard
          name={dashboard.fullName}

        />
      </Reveal>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Reveal delay={0.05}>
          <StatCard
            label="Total Completed Interviews"
            value={dashboard.totalInterviews}
            icon={FileText}
            accent="blue"
          />
        </Reveal>

        <Reveal delay={0.1}>
          <StatCard
            label="Average Score"
            value={`${Math.round(dashboard.averageScore * 10)}%`}
            icon={TrendingUp}
            accent="cyan"
          />
        </Reveal>

        <Reveal delay={0.15}>
          <StatCard
            label="Best Score"
            value={`${Math.round(dashboard.bestScore * 10)}%`}
            icon={Trophy}
            accent="indigo"
          />
        </Reveal>
      </div>

      <div className="grid grid-cols-1">
        <Reveal delay={0.1}>
          <RecentInterviews
            interviews={dashboard.recentInterviews}
          />
        </Reveal>
      </div>
    </div>
  );
}