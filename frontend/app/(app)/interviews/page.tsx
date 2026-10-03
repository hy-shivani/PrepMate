"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { ScoreText, StatusBadge, TypeBadge } from "@/components/dashboard/interview-meta";

interface Interview {
  _id: string;
  jobRole: string;
  company: string;
  interviewMode: string;
  difficulty: string;
  experienceLevel: string;
  scores: {
    overall: number;
    technical: number;
    hr: number;
    aptitude: number;
  };
  status: string;
  createdAt: string;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function InterviewsPage() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInterviews() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/interviews`,
          {
            credentials: "include",
          }
        );

        const data = await res.json();

        if (res.ok) {
          setInterviews(data);
        } else {
          console.log(data.message);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    fetchInterviews();
  }, []);

  const completedInterviews = interviews
    .filter((interview) => interview.status === "Completed")
    .filter((interview) =>
      interview.jobRole.toLowerCase().includes(query.toLowerCase())
    );

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Interviews
        </h1>
        <p className="text-sm text-muted-foreground">
          View all your completed interview sessions and reports.
        </p>
      </div>

      <Card>
        <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base">
            All Completed Interviews
          </CardTitle>

          <div className="relative sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by role..."
              className="pl-9"
              aria-label="Search interviews"
            />
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {loading ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              Loading interviews...
            </div>
          ) : completedInterviews.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              {query
                ? "No completed interviews match your search."
                : "No completed interviews yet."}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {completedInterviews.map((interview) => (
                  <TableRow key={interview._id}>
                    <TableCell>{interview.jobRole}</TableCell>

                    <TableCell>
                      <TypeBadge type={interview.interviewMode} />
                    </TableCell>

                    <TableCell>
                      <ScoreText
                        score={Math.round(
                          (interview.interviewMode === "Technical"
                            ? interview.scores.technical
                            : interview.interviewMode === "HR"
                              ? interview.scores.hr
                              : interview.scores.aptitude) * 10
                        )}
                      />
                    </TableCell>

                    <TableCell>
                      {formatDate(interview.createdAt)}
                    </TableCell>

                    <TableCell>
                      <StatusBadge status={interview.status} />
                    </TableCell>

                    <TableCell>
                      <button
                        onClick={() => {
                          window.location.href = `/interviews/${interview._id}/report`;
                        }}
                        className="text-sm font-medium text-indigo-400 hover:text-indigo-300 hover:underline"
                      >
                        View Report
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}