const fs = require("fs");
const path = require("path");

const resultsPath = path.join(
    __dirname,
    "benchmark-v2.json"
);

const outputPath = path.join(
    __dirname,
    "benchmark-v2-metrics.json"
);

const data = JSON.parse(
    fs.readFileSync(resultsPath, "utf-8")
);

const results = data.results;

// Only successfully evaluated cases
const validResults = results.filter(
    item => item.actual !== null && item.error === null
);

function mean(values) {
    if (values.length === 0) return 0;

    return values.reduce((sum, value) => sum + value, 0)
        / values.length;
}

function mae(referenceValues, actualValues) {
    const errors = referenceValues.map(
        (value, index) =>
            Math.abs(value - actualValues[index])
    );

    return mean(errors);
}

function percentage(correct, total) {
    if (total === 0) return 0;

    return Number(((correct / total) * 100).toFixed(2));
}

// --------------------------------------------------
// 1. Response Type Accuracy
// --------------------------------------------------

let responseTypeCorrect = 0;

for (const item of validResults) {
    if (
        item.reference.responseType ===
        item.actual.responseType
    ) {
        responseTypeCorrect++;
    }
}

const responseTypeAccuracy = percentage(
    responseTypeCorrect,
    validResults.length
);

// --------------------------------------------------
// 2. Overall Score MAE
// --------------------------------------------------

const referenceScores = validResults.map(
    item => item.reference.score
);

const actualScores = validResults.map(
    item => item.actual.score
);

const scoreMAE = Number(
    mae(referenceScores, actualScores).toFixed(3)
);

// --------------------------------------------------
// 3. Dimension MAE
// --------------------------------------------------

const dimensions = [
    "correctness",
    "relevance",
    "clarity",
    "understanding",
    "completeness"
];

const dimensionMAE = {};

for (const dimension of dimensions) {
    const reference = validResults.map(
        item => item.reference[dimension]
    );

    const actual = validResults.map(
        item => item.actual[dimension]
    );

    dimensionMAE[dimension] = Number(
        mae(reference, actual).toFixed(3)
    );
}

// --------------------------------------------------
// 4. Exact Score Agreement
// --------------------------------------------------

let exactScoreMatches = 0;
let scoreWithinOne = 0;

for (const item of validResults) {
    const difference = Math.abs(
        item.reference.score - item.actual.score
    );

    if (difference === 0) {
        exactScoreMatches++;
    }

    if (difference <= 1) {
        scoreWithinOne++;
    }
}

const exactScoreAccuracy = percentage(
    exactScoreMatches,
    validResults.length
);

const scoreWithinOneAccuracy = percentage(
    scoreWithinOne,
    validResults.length
);

// --------------------------------------------------
// 5. Follow-up Accuracy
// --------------------------------------------------

let followUpCorrect = 0;

for (const item of validResults) {
    if (
        item.reference.followUpNeeded ===
        item.actual.followUpNeeded
    ) {
        followUpCorrect++;
    }
}

const followUpAccuracy = percentage(
    followUpCorrect,
    validResults.length
);

// --------------------------------------------------
// 6. Injection Detection
// --------------------------------------------------

let truePositive = 0;
let trueNegative = 0;
let falsePositive = 0;
let falseNegative = 0;

for (const item of validResults) {
    const reference =
        item.reference.containsInjectionAttempt === true;

    const actual =
        item.actual.containsInjectionAttempt === true;

    if (reference && actual) {
        truePositive++;
    } else if (!reference && !actual) {
        trueNegative++;
    } else if (!reference && actual) {
        falsePositive++;
    } else if (reference && !actual) {
        falseNegative++;
    }
}

const injectionPrecision =
    truePositive + falsePositive > 0
        ? truePositive / (truePositive + falsePositive)
        : 0;

const injectionRecall =
    truePositive + falseNegative > 0
        ? truePositive / (truePositive + falseNegative)
        : 0;

const injectionF1 =
    injectionPrecision + injectionRecall > 0
        ? 2 *
        (injectionPrecision * injectionRecall) /
        (injectionPrecision + injectionRecall)
        : 0;

// --------------------------------------------------
// 7. JSON Validity
// --------------------------------------------------

const jsonValidCases = validResults.filter(
    item =>
        item.actual &&
        typeof item.actual.responseType === "string" &&
        typeof item.actual.score === "number" &&
        typeof item.actual.followUpNeeded === "boolean"
).length;

const jsonValidity = percentage(
    jsonValidCases,
    results.length
);

// --------------------------------------------------
// 8. Latency
// --------------------------------------------------

const latencies = validResults
    .map(item => item.latencyMs)
    .sort((a, b) => a - b);

function percentile(values, percentile) {
    if (values.length === 0) return 0;

    const index =
        Math.ceil((percentile / 100) * values.length) - 1;

    return values[Math.max(0, index)];
}

const averageLatency = Math.round(
    mean(latencies)
);

const p50Latency = percentile(latencies, 50);

const p95Latency = percentile(latencies, 95);

// --------------------------------------------------
// 9. Per-case comparison
// --------------------------------------------------

const caseComparison = validResults.map(item => ({
    id: item.id,
    type: item.type,
    topic: item.topic,

    reference: {
        responseType: item.reference.responseType,
        score: item.reference.score,
        correctness: item.reference.correctness,
        relevance: item.reference.relevance,
        clarity: item.reference.clarity,
        understanding: item.reference.understanding,
        completeness: item.reference.completeness,
        followUpNeeded: item.reference.followUpNeeded,
        containsInjectionAttempt:
            item.reference.containsInjectionAttempt
    },

    actual: {
        responseType: item.actual.responseType,
        score: item.actual.score,
        correctness: item.actual.correctness,
        relevance: item.actual.relevance,
        clarity: item.actual.clarity,
        understanding: item.actual.understanding,
        completeness: item.actual.completeness,
        followUpNeeded: item.actual.followUpNeeded,
        containsInjectionAttempt:
            item.actual.containsInjectionAttempt
    },

    scoreDifference:
        item.actual.score - item.reference.score,

    latencyMs: item.latencyMs
}));

// --------------------------------------------------
// Final metrics
// --------------------------------------------------

const metrics = {
    benchmark: "technical",

    totalCases: results.length,
    validCases: validResults.length,
    failedCases: results.length - validResults.length,

    responseType: {
        correct: responseTypeCorrect,
        accuracy: responseTypeAccuracy
    },

    score: {
        mae: scoreMAE,
        exactAgreement: exactScoreAccuracy,
        withinOnePoint: scoreWithinOneAccuracy
    },

    dimensionMAE,

    followUp: {
        correct: followUpCorrect,
        accuracy: followUpAccuracy
    },

    injectionDetection: {
        truePositive,
        trueNegative,
        falsePositive,
        falseNegative,

        precision: Number(
            (injectionPrecision * 100).toFixed(2)
        ),

        recall: Number(
            (injectionRecall * 100).toFixed(2)
        ),

        f1: Number(
            (injectionF1 * 100).toFixed(2)
        )
    },

    jsonValidity: {
        valid: jsonValidCases,
        accuracy: jsonValidity
    },

    latency: {
        averageMs: averageLatency,
        p50Ms: p50Latency,
        p95Ms: p95Latency
    },

    cases: caseComparison
};

fs.writeFileSync(
    outputPath,
    JSON.stringify(metrics, null, 2)
);

console.log("\n================================");
console.log("TECHNICAL BENCHMARK METRICS");
console.log("================================");

console.log(
    `Cases: ${validResults.length}/${results.length}`
);

console.log(
    `Response Type Accuracy: ${responseTypeAccuracy}%`
);

console.log(
    `Score MAE: ${scoreMAE}`
);

console.log(
    `Exact Score Agreement: ${exactScoreAccuracy}%`
);

console.log(
    `Score Within ±1: ${scoreWithinOneAccuracy}%`
);

console.log(
    `Follow-up Accuracy: ${followUpAccuracy}%`
);

console.log(
    `Injection Precision: ${(injectionPrecision * 100).toFixed(2)}%`
);

console.log(
    `Injection Recall: ${(injectionRecall * 100).toFixed(2)}%`
);

console.log(
    `Injection F1: ${(injectionF1 * 100).toFixed(2)}%`
);

console.log(
    `JSON Validity: ${jsonValidity}%`
);

console.log(
    `Average Latency: ${averageLatency} ms`
);

console.log(
    `P50 Latency: ${p50Latency} ms`
);

console.log(
    `P95 Latency: ${p95Latency} ms`
);

console.log("\nMetrics saved to:");
console.log(outputPath);