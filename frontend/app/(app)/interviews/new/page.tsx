'use client'

import { FormEvent, ReactNode, useMemo, useState } from 'react'

type Question = {
    _id?: string
    round?: string
    section?: string
    topic?: string
    question: string
    options?: string[]
    score?: number
    questionType?: string
}

type Interview = {
    _id?: string
    jobRole: string
    company?: string
    experienceLevel: string
    difficulty: string
    numberOfQuestions: number
    interviewMode: string

    interviewPlan?: {
        resumeTopics?: {
            topic: string
            status: string
        }[]
        csFundamentals?: {
            topic: string
            status: string
        }[]
    }

    questions: Question[]
}

type FormValues = {
    jobRole: string
    experienceLevel: string
    company: string
    difficulty: string
    interviewMode: string
    numberOfQuestions: string
}

const initialForm: FormValues = {
    jobRole: '',
    experienceLevel: 'Fresher',
    company: '',
    difficulty: 'Easy',
    interviewMode: 'Technical',
    numberOfQuestions: '10',
}

export default function Page() {
    const [form, setForm] = useState(initialForm)
    const [interview, setInterview] = useState<Interview | null>(null)
    const [questionIndex, setQuestionIndex] = useState(0)
    const [answers, setAnswers] = useState<Record<number, string>>({})
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [isComplete, setIsComplete] = useState(false)
    const [result, setResult] = useState<any>(null)
    const [showReport, setShowReport] = useState(false)

    const currentQuestion = interview?.questions[questionIndex]

    const totalTopics =
        interview?.interviewMode === 'Technical'
            ? (interview.interviewPlan?.resumeTopics?.length || 0) +
            (interview.interviewPlan?.csFundamentals?.length || 0)
            : interview?.numberOfQuestions || 0

    const completedTopics =
        interview?.interviewMode === 'Technical'
            ? new Set(
                interview.questions
                    .slice(0, questionIndex)
                    .map((question) => question.topic)
                    .filter(
                        (topic) => topic && topic !== currentQuestion?.topic
                    )
            ).size
            : questionIndex

    const progress =
        totalTopics > 0
            ? (completedTopics / totalTopics) * 100
            : 0
    const questionLabel = useMemo(() => {
        if (!interview || !currentQuestion) return ''
        return currentQuestion.round ? `${currentQuestion.round} round` : 'Practice question'
    }, [interview, currentQuestion])

    function updateField(field: keyof FormValues, value: string) {
        setForm((current) => ({ ...current, [field]: value }))
    }

    async function createInterview(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            const payload = new URLSearchParams({
                jobRole: form.jobRole,
                experienceLevel: form.experienceLevel,
                company: form.company,
                difficulty: form.difficulty,
                interviewMode: form.interviewMode,
                numberOfQuestions: form.numberOfQuestions,
            })

            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

            if (!backendUrl) {
                throw new Error('The backend URL is not configured.')
            }

            const createResponse = await fetch(`${backendUrl}/interviews`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: payload.toString(),
            })

            const createData = await createResponse.json().catch(() => null)

            if (!createResponse.ok) {
                throw new Error(
                    createData?.message || 'Could not create interview.'
                )
            }

            const createdInterview = createData?.interview

            if (!createdInterview?._id) {
                throw new Error('Interview was created but no interview ID was returned.')
            }

            const startResponse = await fetch(
                `${backendUrl}/interviews/${createdInterview._id}/start`,
                {
                    method: 'POST',
                    credentials: 'include',
                }
            )

            const startData = await startResponse.json().catch(() => null)

            if (!startResponse.ok) {
                throw new Error(
                    startData?.message || 'Could not start interview.'
                )
            }

            if (!startData?.question) {
                throw new Error('Interview started but no question was returned.')
            }

            const interviewWithQuestion: Interview = {
                ...createdInterview,
                questions: [startData.question],
            }

            setInterview(interviewWithQuestion)
            setQuestionIndex(0)
            setAnswers({})
            setIsComplete(false)

        } catch (cause) {
            setError(
                cause instanceof Error
                    ? cause.message
                    : 'Something went wrong while creating your interview.'
            )
        } finally {
            setIsLoading(false)
        }
    }

    function saveAnswer(value: string) {
        setAnswers((current) => ({ ...current, [questionIndex]: value }))
    }

    async function moveNext() {
        if (!interview || !currentQuestion) return

        const answer = answers[questionIndex]

        if (!answer?.trim()) {
            setError('Please enter your answer before continuing.')
            return
        }

        setError('')
        setIsLoading(true)

        try {
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

            if (!backendUrl) {
                throw new Error('The backend URL is not configured.')
            }

            let endpoint = '/answer'

            if (interview.interviewMode === 'HR') {
                endpoint = '/hr-answer'
            } else if (interview.interviewMode === 'Aptitude') {
                endpoint = '/aptitude-answer'
            }

            const response = await fetch(`${backendUrl}/interviews${endpoint}`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    interviewId: interview._id,
                    questionId: currentQuestion._id,
                    userAnswer: answer,
                }),
            })

            const data = await response.json().catch(() => null)

            if (!response.ok) {
                throw new Error(
                    data?.message || 'Could not submit your answer.'
                )
            }

            if (data?.interviewCompleted) {
                setResult(data)
                setIsComplete(true)
                return
            }

            if (!data?.question) {
                throw new Error('No next question was returned.')
            }

            setInterview((current) => {
                if (!current) return current

                return {
                    ...current,
                    questions: [...current.questions, data.question],
                }
            })

            setQuestionIndex((current) => current + 1)

        } catch (cause) {
            setError(
                cause instanceof Error
                    ? cause.message
                    : 'Something went wrong while submitting your answer.'
            )
        } finally {
            setIsLoading(false)
        }
    }
    function restart() {
        setInterview(null)
        setQuestionIndex(0)
        setAnswers({})
        setIsComplete(false)
        setResult(null)
        setShowReport(false)
        setError('')
    }

    return (
        <main className="min-h-screen bg-background text-foreground">
            <header className="border-b border-border/70 bg-background/85 backdrop-blur-xl">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
                    <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-sm font-bold text-white shadow-lg shadow-indigo-500/20">P</div>
                        <span className="text-lg font-semibold tracking-tight">PrepMate</span>
                    </div>
                    <span className="hidden text-sm text-muted-foreground sm:block">Interview preparation, made personal</span>
                </div>
            </header>

            <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
                {!interview && <CreationForm form={form} error={error} isLoading={isLoading} onChange={updateField} onSubmit={createInterview} />}
                {interview && !isComplete && currentQuestion && (
                    <QuestionView
                        interview={interview}
                        currentQuestion={currentQuestion}
                        questionIndex={questionIndex}
                        progress={progress}
                        questionLabel={questionLabel}
                        completedTopics={completedTopics}
                        totalTopics={totalTopics}
                        answer={answers[questionIndex] || ''}
                        onAnswer={saveAnswer}
                        onBack={() => setQuestionIndex((current) => Math.max(0, current - 1))}
                        onNext={moveNext}
                    />
                )}
                {interview && isComplete && !showReport && (
                    <CompletionView
                        interview={interview}
                        result={result}
                        onRestart={restart}
                        onViewReport={() => setShowReport(true)}
                    />
                )}

                {interview && isComplete && showReport && (
                    <ReportView
                        interview={interview}
                        result={result}
                        onBack={() => setShowReport(false)}
                        onRestart={restart}
                    />
                )}
            </div>
        </main>
    )
}

function CreationForm({ form, error, isLoading, onChange, onSubmit }: { form: FormValues; error: string; isLoading: boolean; onChange: (field: keyof FormValues, value: string) => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
    return (
        <section className="mx-auto max-w-3xl">
            <div className="mb-10 max-w-2xl">
                <p className="mb-3 text-sm font-medium text-indigo-500">New practice session</p>
                <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-5xl">Build an interview that fits your next role.</h1>
                <p className="mt-4 text-pretty leading-7 text-muted-foreground">Tell us what you&apos;re preparing for. PrepMate will use your uploaded resume to generate a focused set of questions.</p>
            </div>
            <form onSubmit={onSubmit} className="rounded-3xl border border-border/70 bg-card p-5 shadow-2xl shadow-indigo-950/5 sm:p-8">
                <div className="grid gap-6 sm:grid-cols-2">
                    <Field label="Job role" required><input required value={form.jobRole} onChange={(event) => onChange('jobRole', event.target.value)} placeholder="e.g. Backend Engineer" className="control" /></Field>
                    <Field label="Experience level" required><select required value={form.experienceLevel} onChange={(event) => onChange('experienceLevel', event.target.value)} className="control"><option>Fresher</option><option>0-1 Years</option><option>1-3 Years</option><option>3+ Years</option></select></Field>
                    <Field label="Company" hint="Optional"><input value={form.company} onChange={(event) => onChange('company', event.target.value)} placeholder="e.g. Acme Inc." className="control" /></Field>
                    <Field label="Difficulty" required><select required value={form.difficulty} onChange={(event) => onChange('difficulty', event.target.value)} className="control"><option>Easy</option><option>Medium</option><option>Hard</option></select></Field>
                    <Field label="Interview mode" required><select required value={form.interviewMode} onChange={(event) => onChange('interviewMode', event.target.value)} className="control"><option>Technical</option><option>Aptitude</option><option>HR</option></select></Field>
                    {form.interviewMode !== 'Technical' && (
                        <Field label="Number of questions" required>
                            <select
                                required
                                value={form.numberOfQuestions}
                                onChange={(event) => onChange('numberOfQuestions', event.target.value)}
                                className="control"
                            >
                                <option value="5">5 questions</option>
                                <option value="10">10 questions</option>
                                <option value="15">15 questions</option>
                                <option value="20">20 questions</option>
                            </select>
                        </Field>
                    )}
                </div>
                {error && <div role="alert" className="mt-6 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm leading-6 text-destructive">{error}</div>}
                <button disabled={isLoading} className="mt-8 flex h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 font-medium text-white shadow-lg shadow-indigo-500/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60">{isLoading ? 'Generating your interview…' : 'Generate interview'}</button>
            </form>
        </section>
    )
}

function Field({ label, hint, required, children }: { label: string; hint?: string; required?: boolean; children: ReactNode }) {
    return <label className="block"><span className="mb-2 flex items-center gap-2 text-sm font-medium">{label}{required && <span className="text-indigo-500">*</span>}{hint && <span className="font-normal text-muted-foreground">({hint})</span>}</span>{children}</label>
}

function QuestionView({
    interview,
    currentQuestion,
    questionIndex,
    progress,
    questionLabel,
    completedTopics,
    totalTopics,
    answer,
    onAnswer,
    onBack,
    onNext,

}: {
    interview: Interview
    currentQuestion: Question
    questionIndex: number
    progress: number
    questionLabel: string
    completedTopics: number
    totalTopics: number
    answer: string
    onAnswer: (value: string) => void
    onBack: () => void
    onNext: () => void
}) {
    return (
        <section className="mx-auto max-w-4xl">
            <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                <div>
                    <p className="mb-2 text-sm font-medium text-indigo-500">
                        {interview.jobRole}
                        {interview.company ? ` · ${interview.company}` : ''}
                    </p>

                    <h1 className="text-3xl font-semibold tracking-tight">
                        Your interview
                    </h1>
                </div>

                <div className="text-left sm:text-right">
                    <p className="text-sm text-muted-foreground">
                        {interview.interviewMode} · {interview.difficulty}
                    </p>

                    <p className="mt-1 font-medium">
                        {interview.interviewMode === 'Technical' ? (
                            <>
                                {completedTopics} / {totalTopics}
                                <span className="text-muted-foreground">
                                    {' '}topics completed
                                </span>
                            </>
                        ) : (
                            <>
                                Question {questionIndex + 1}
                                <span className="text-muted-foreground">
                                    {' '}of {interview.numberOfQuestions}
                                </span>
                            </>
                        )}
                    </p>
                </div>
            </div>

            <div className="mb-8 h-2 overflow-hidden rounded-full bg-secondary">
                <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 transition-all"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-2xl shadow-indigo-950/5 sm:p-10">
                <p className="text-sm font-medium text-muted-foreground">
                    {questionLabel}
                </p>

                <h2 className="mt-5 text-balance text-2xl font-medium leading-9 sm:text-3xl">
                    {currentQuestion.question}
                </h2>

                {interview.interviewMode === 'Aptitude' &&
                    currentQuestion.options?.length ? (
                    <div className="mt-10 space-y-3">
                        {currentQuestion.options.map((option) => (
                            <button
                                key={option}
                                type="button"
                                onClick={() => onAnswer(option)}
                                className={`w-full rounded-2xl border px-4 py-4 text-left transition ${answer === option
                                    ? 'border-indigo-500 bg-indigo-500/10'
                                    : 'border-border hover:bg-accent'
                                    }`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                ) : (
                    <label className="mt-10 block">
                        <div className="mb-3 flex items-center justify-between gap-3">
                            <span className="text-sm font-medium">
                                Your answer
                            </span>


                        </div>

                        <textarea
                            value={answer}
                            onChange={(event) => onAnswer(event.target.value)}
                            placeholder="Take a moment to structure your response…"
                            className="min-h-48 w-full resize-y rounded-2xl border border-input bg-background px-4 py-4 leading-7 outline-none transition placeholder:text-muted-foreground focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                        />

                    </label>
                )}

                <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                    <button
                        onClick={onBack}
                        disabled={questionIndex === 0}
                        className="h-11 rounded-xl border border-border px-5 text-sm font-medium transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Previous
                    </button>

                    <button
                        onClick={onNext}
                        className="h-11 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 text-sm font-medium text-white shadow-lg shadow-indigo-500/20 transition hover:brightness-110"
                    >
                        {questionIndex === interview.numberOfQuestions - 1
                            ? 'Complete interview'
                            : 'Next question'}{' '}
                        <span aria-hidden="true">→</span>
                    </button>
                </div>
            </div>
        </section>
    )
}
function CompletionView({
    interview,
    result,
    onRestart,
    onViewReport,
}: {
    interview: Interview
    result: any
    onRestart: () => void
    onViewReport: () => void
}) {
    return (
        <section className="mx-auto flex max-w-2xl flex-col items-center rounded-3xl border border-border/70 bg-card px-6 py-16 text-center shadow-2xl shadow-indigo-950/5 sm:px-12">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-2xl font-bold text-white">
                ✓
            </div>

            <p className="mt-6 text-sm font-medium text-indigo-500">
                Interview complete
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                Nice work showing up.
            </h1>

            <p className="mt-4 max-w-md leading-7 text-muted-foreground">
                You completed your {interview.interviewMode.toLowerCase()} interview.
                Your performance has been evaluated successfully.
            </p>

            {result?.score !== undefined && (
                <p className="mt-5 text-3xl font-semibold">
                    Score: {Math.round(result.score * 10)}%
                </p>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                    onClick={onViewReport}
                    className="h-11 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 text-sm font-medium text-white shadow-lg shadow-indigo-500/20 transition hover:brightness-110"
                >
                    View Evaluation Report
                </button>

                <button
                    onClick={onRestart}
                    className="h-11 rounded-xl border border-border px-6 text-sm font-medium transition hover:bg-accent"
                >
                    Start Another Interview
                </button>
            </div>
        </section>
    )
}
function ReportView({
    interview,
    result,
    onBack,
    onRestart,
}: {
    interview: Interview
    result: any
    onBack: () => void
    onRestart: () => void
}) {
    const report = result?.report

    return (
        <section className="mx-auto max-w-4xl">
            <div className="mb-8">
                <button
                    onClick={onBack}
                    className="mb-6 text-sm font-medium text-indigo-500 hover:underline"
                >
                    ← Back to completion
                </button>

                <p className="text-sm font-medium text-indigo-500">
                    {interview.interviewMode} · {interview.jobRole}
                </p>

                <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                    Evaluation Report
                </h1>

                {result?.score !== undefined && (
                    <div className="mt-6 inline-flex rounded-2xl border border-border bg-card px-6 py-4">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Overall Score
                            </p>
                            <p className="text-3xl font-bold">
                                {Math.round(result.score * 10)}%
                            </p>
                        </div>
                    </div>
                )}
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

                    <ul className="mt-4 space-y-3">
                        {report.strengths.map(
                            (strength: string, index: number) => (
                                <li
                                    key={index}
                                    className="rounded-xl bg-secondary px-4 py-3"
                                >
                                    {strength}
                                </li>
                            )
                        )}
                    </ul>
                </div>
            )}

            {report?.topicsToFocus?.length > 0 && (
                <div className="mb-6 rounded-3xl border border-border/70 bg-card p-6">
                    <h2 className="text-xl font-semibold">
                        📚 Topics to Focus On
                    </h2>

                    <ul className="mt-4 space-y-3">
                        {report.topicsToFocus.map(
                            (topic: string, index: number) => (
                                <li
                                    key={index}
                                    className="rounded-xl bg-secondary px-4 py-3"
                                >
                                    {topic}
                                </li>
                            )
                        )}
                    </ul>
                </div>
            )}

            {report?.questionWiseFeedback?.length > 0 && (
                <div className="rounded-3xl border border-border/70 bg-card p-6">
                    <h2 className="text-xl font-semibold">
                        Question-wise Evaluation
                    </h2>

                    <div className="mt-6 space-y-6">
                        {report.questionWiseFeedback.map(
                            (item: any, index: number) => (
                                <div
                                    key={index}
                                    className="rounded-2xl border border-border p-5"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <h3 className="font-semibold">
                                            Question {item.questionNumber}
                                        </h3>

                                        {item.score !== undefined && (
                                            <span className="rounded-full bg-secondary px-3 py-1 text-sm font-medium">
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
                                                {item.userAnswer || 'Not answered'}
                                            </p>
                                        </div>

                                        {interview.interviewMode !== 'Aptitude' && (
                                            <>
                                                {item.whatWasGood && (
                                                    <div>
                                                        <p className="font-medium">
                                                            What Was Good
                                                        </p>
                                                        <p className="mt-2 leading-6 text-muted-foreground">
                                                            {item.whatWasGood}
                                                        </p>
                                                    </div>
                                                )}

                                                {item.whatWasMissing && (
                                                    <div>
                                                        <p className="font-medium">
                                                            What Was Missing
                                                        </p>
                                                        <p className="mt-2 leading-6 text-muted-foreground">
                                                            {item.whatWasMissing}
                                                        </p>
                                                    </div>
                                                )}

                                                {item.expectedAnswer && (
                                                    <div>
                                                        <p className="font-medium">
                                                            Expected Answer
                                                        </p>
                                                        <p className="mt-2 rounded-xl bg-secondary p-4 leading-6">
                                                            {item.expectedAnswer}
                                                        </p>
                                                    </div>
                                                )}

                                                {item.feedback && (
                                                    <div>
                                                        <p className="font-medium">
                                                            Feedback
                                                        </p>
                                                        <p className="mt-2 leading-6 text-muted-foreground">
                                                            {item.feedback}
                                                        </p>
                                                    </div>
                                                )}
                                            </>
                                        )}

                                        {interview.interviewMode === 'Aptitude' && (
                                            <>
                                                <div>
                                                    <p className="font-medium">
                                                        Correct Answer
                                                    </p>
                                                    <p className="mt-2 leading-6 text-muted-foreground">
                                                        {item.correctAnswer}
                                                    </p>
                                                </div>

                                                {item.feedback && (
                                                    <div>
                                                        <p className="font-medium">
                                                            Feedback
                                                        </p>
                                                        <p className="mt-2 leading-6 text-muted-foreground">
                                                            {item.feedback}
                                                        </p>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </div>
            )}

            <div className="mt-8 flex justify-center">
                <button
                    onClick={onRestart}
                    className="h-11 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 text-sm font-medium text-white shadow-lg shadow-indigo-500/20 transition hover:brightness-110"
                >
                    Start Another Interview
                </button>
            </div>
        </section>
    )
}