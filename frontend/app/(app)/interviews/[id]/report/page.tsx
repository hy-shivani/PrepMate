"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ReportPage() {
    const params = useParams();
    const id = params.id as string;

    const [interview, setInterview] = useState<any>(null);
    const [report, setReport] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchReport() {
            try {
                const backendUrl =
                    process.env.NEXT_PUBLIC_BACKEND_URL;

                if (!backendUrl) {
                    throw new Error(
                        "Backend URL is not configured."
                    );
                }

                const response = await fetch(
                    `${backendUrl}/interviews/${id}`,
                    {
                        credentials: "include",
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data?.message ||
                        "Could not load the report."
                    );
                }

                setInterview(data);

                if (data.finalFeedback) {
                    const parsed =
                        typeof data.finalFeedback === "string"
                            ? JSON.parse(data.finalFeedback)
                            : data.finalFeedback;

                    setReport(parsed);
                }
            } catch (cause) {
                setError(
                    cause instanceof Error
                        ? cause.message
                        : "Could not load the report."
                );
            } finally {
                setLoading(false);
            }
        }

        fetchReport();
    }, [id]);

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                Loading evaluation report...
            </div>
        );
    }

    if (error) {
        return (
            <div className="mx-auto max-w-2xl p-8 text-center">
                <h1 className="text-xl font-semibold">
                    Could not load report
                </h1>

                <p className="mt-3 text-muted-foreground">
                    {error}
                </p>
            </div>
        );
    }

    let score = interview?.scores?.overall || 0;

    if (!score) {
        score =
            interview?.scores?.aptitude ||
            interview?.scores?.technical ||
            interview?.scores?.hr ||
            0;
    }

    // Interview scores are stored on a 0–10 scale.
    // Convert to percentage only for display.
    if (score > 0 && score <= 10) {
        score = score * 10;
    }

    if (!score && report?.questionWiseFeedback?.length) {
        const correct = report.questionWiseFeedback.filter(
            (item: any) => item.isCorrect === true
        ).length;

        score =
            (correct / report.questionWiseFeedback.length) * 100;
    }

    return (
        <section className="mx-auto max-w-4xl">
            <button
                onClick={() => window.history.back()}
                className="mb-6 text-sm font-medium text-indigo-400 hover:underline"
            >
                ← Back to Dashboard
            </button>

            <div className="mb-8">
                <p className="text-sm font-medium text-indigo-500">
                    {interview?.interviewMode} ·{" "}
                    {interview?.jobRole}
                </p>

                <h1 className="mt-2 text-3xl font-semibold">
                    Evaluation Report
                </h1>
            </div>

            <div className="mb-6 rounded-3xl border border-border/70 bg-card p-6">
                <p className="text-sm text-muted-foreground">
                    Overall Score
                </p>

                <p className="mt-2 text-4xl font-bold">
                    {Math.round(score)}%
                </p>
            </div>

            {report?.overallSummary && (
                <div className="mb-6 rounded-3xl border border-border/70 bg-card p-6">
                    <h2 className="text-xl font-semibold">
                        Overall Performance
                    </h2>

                    <p className="mt-4 leading-7 text-muted-foreground">
                        {report.overallSummary}
                    </p>
                </div>
            )}

            {report?.strengths?.length > 0 && (
                <div className="mb-6 rounded-3xl border border-border/70 bg-card p-6">
                    <h2 className="text-xl font-semibold">
                        💪 Your Strengths
                    </h2>

                    <div className="mt-4 space-y-3">
                        {report.strengths.map(
                            (strength: string, index: number) => (
                                <div
                                    key={index}
                                    className="rounded-xl bg-secondary p-4"
                                >
                                    {strength}
                                </div>
                            )
                        )}
                    </div>
                </div>
            )}

            {report?.topicsToFocus?.length > 0 && (
                <div className="mb-6 rounded-3xl border border-border/70 bg-card p-6">
                    <h2 className="text-xl font-semibold">
                        📚 Topics to Focus On
                    </h2>

                    <div className="mt-4 space-y-3">
                        {report.topicsToFocus.map(
                            (topic: string, index: number) => (
                                <div
                                    key={index}
                                    className="rounded-xl bg-secondary p-4"
                                >
                                    {topic}
                                </div>
                            )
                        )}
                    </div>
                </div>
            )}

            {report?.questionWiseFeedback?.length > 0 && (
                <div className="rounded-3xl border border-border/70 bg-card p-6">
                    <h2 className="text-xl font-semibold">
                        Question-wise Feedback
                    </h2>

                    <div className="mt-6 space-y-5">
                        {report.questionWiseFeedback.map(
                            (item: any, index: number) => (
                                <div
                                    key={index}
                                    className="rounded-2xl border border-border p-5"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <h3 className="font-semibold">
                                            Question{" "}
                                            {item.questionNumber ??
                                                index + 1}
                                        </h3>

                                        {item.score !== undefined && (
                                            <span className="shrink-0 rounded-full bg-secondary px-3 py-1 text-sm font-medium">
                                                Score: {item.score}/10
                                            </span>
                                        )}
                                    </div>

                                    <p className="mt-4 font-medium leading-7">
                                        {item.question}
                                    </p>

                                    <div className="mt-6 space-y-5 text-sm">
                                        <div>
                                            <p className="font-medium">
                                                Your Answer
                                            </p>

                                            <p className="mt-2 rounded-xl bg-secondary p-4 leading-6">
                                                {item.userAnswer ||
                                                    "Not answered"}
                                            </p>
                                        </div>

                                        {interview?.interviewMode !==
                                            "Aptitude" ? (
                                            <>
                                                <div>
                                                    <p className="font-medium">
                                                        What Was Good
                                                    </p>

                                                    <p className="mt-2 leading-6 text-muted-foreground">
                                                        {item.whatWasGood ||
                                                            "No specific strengths identified."}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="font-medium">
                                                        What Was Missing
                                                    </p>

                                                    <p className="mt-2 leading-6 text-muted-foreground">
                                                        {item.whatWasMissing ||
                                                            "Nothing significant was missing."}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="font-medium">
                                                        Expected Answer
                                                    </p>

                                                    <p className="mt-2 rounded-xl bg-secondary p-4 leading-6">
                                                        {item.expectedAnswer ||
                                                            "Expected answer not available."}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="font-medium">
                                                        Feedback
                                                    </p>

                                                    <p className="mt-2 leading-6 text-muted-foreground">
                                                        {item.feedback ||
                                                            "No additional feedback available."}
                                                    </p>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div>
                                                    <p className="font-medium">
                                                        Correct Answer
                                                    </p>

                                                    <p className="mt-2 rounded-xl bg-secondary p-4 leading-6">
                                                        {item.correctAnswer ||
                                                            "Correct answer not available."}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="font-medium">
                                                        Feedback
                                                    </p>

                                                    <p className="mt-2 leading-6 text-muted-foreground">
                                                        {item.feedback ||
                                                            "No additional feedback available."}
                                                    </p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}