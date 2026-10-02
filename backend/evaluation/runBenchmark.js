
require("dotenv").config();

const fs = require("fs");
const path = require("path");

const { evaluateInterviewAnswer } = require("../service/ai");

const benchmarkPath = path.join(
    __dirname,
    "benchmark",
    "technical.json"
);

const resultsDir = path.join(__dirname, "results");

const outputPath = path.join(
    resultsDir,
    "benchmark-v2.json"
);

async function runBenchmark() {
    const benchmark = JSON.parse(
        fs.readFileSync(benchmarkPath, "utf-8")
    );

    fs.mkdirSync(resultsDir, { recursive: true });

    console.log(`Running ${benchmark.length} benchmark cases...\n`);

    const results = [];

    for (const testCase of benchmark) {
        console.log(`Running ${testCase.id}...`);

        const start = performance.now();

        try {
            let actual = null;
            let lastError = null;

            for (let attempt = 1; attempt <= 3; attempt++) {
                try {
                    actual = await evaluateInterviewAnswer({
                        question: testCase.question,
                        userAnswer: testCase.userAnswer,
                        round: "Technical"
                    });

                    break;
                } catch (error) {
                    lastError = error;

                    console.log(
                        `  Attempt ${attempt}/3 failed: ${error.message}`
                    );

                    if (attempt < 3) {
                        const match = error.message.match(/retry in ([\d.]+)s/i);

                        const delay = match
                            ? Math.ceil(Number(match[1]) + 2) * 1000
                            : 60000;

                        console.log(
                            `  Waiting ${Math.ceil(delay / 1000)} seconds before retry...`
                        );

                        await new Promise(resolve =>
                            setTimeout(resolve, delay)
                        );
                    }
                }
            }

            if (!actual) {
                throw lastError;
            }

            const latencyMs = Math.round(
                performance.now() - start
            );

            results.push({
                id: testCase.id,
                type: testCase.type,
                topic: testCase.topic,

                question: testCase.question,
                userAnswer: testCase.userAnswer,

                reference: testCase.reference,

                actual,

                latencyMs,

                error: null
            });

            console.log(`✓ ${testCase.id} - ${latencyMs} ms`);
        } catch (error) {
            const latencyMs = Math.round(
                performance.now() - start
            );

            results.push({
                id: testCase.id,
                type: testCase.type,
                topic: testCase.topic,

                question: testCase.question,
                userAnswer: testCase.userAnswer,

                reference: testCase.reference,

                actual: null,

                latencyMs,

                error: {
                    name: error.name,
                    message: error.message
                }
            });

            console.log(
                `✗ ${testCase.id} - ${error.message}`
            );
        }
    }

    const output = {
        benchmark: "technical",
        totalCases: benchmark.length,
        completedCases: results.filter(
            item => item.actual !== null
        ).length,
        failedCases: results.filter(
            item => item.actual === null
        ).length,
        generatedAt: new Date().toISOString(),

        results
    };

    fs.writeFileSync(
        outputPath,
        JSON.stringify(output, null, 2)
    );

    console.log("\n--------------------------------");
    console.log("Benchmark completed.");
    console.log(`Results saved to: ${outputPath}`);
    console.log("--------------------------------");
}

runBenchmark();


