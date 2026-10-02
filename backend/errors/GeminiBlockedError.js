// errors/GeminiBlockedError.js
class GeminiBlockedError extends Error {
    constructor(reason, stage) {
        super(`Gemini evaluation blocked: ${reason}`);
        this.name = "GeminiBlockedError";
        this.blockReason = reason; // "SAFETY" | "PROHIBITED_CONTENT" | "RECITATION" | "OTHER" | "NO_CANDIDATE" | "EMPTY_RESPONSE"
        this.stage = stage;        // "prompt" | "candidate"
    }
}

module.exports = { GeminiBlockedError };