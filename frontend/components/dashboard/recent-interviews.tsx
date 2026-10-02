import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScoreText, StatusBadge, TypeBadge } from "./interview-meta";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

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

export function RecentInterviews({
  interviews,
}: {
  interviews: Interview[];
}) {
  return (
    <Card id="interviews">
      <CardHeader>
        <CardTitle className="text-base">
          Recent Interviews
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-0">
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
            {interviews.map((interview) => (
              <TableRow key={interview._id}>
                <TableCell>{interview.jobRole}</TableCell>

                <TableCell>
                  <TypeBadge
                    type={interview.interviewMode}
                  />
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
                  <StatusBadge
                    status={interview.status}
                  />
                </TableCell>

                <TableCell>
                  {interview.status === "Completed" ? (
                    <button
                      onClick={() => {
                        window.location.href = `/interviews/${interview._id}/report`;
                      }}
                      className="text-sm font-medium text-indigo-400 hover:text-indigo-300 hover:underline"
                    >
                      View Report
                    </button>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      —
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}