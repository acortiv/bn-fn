import { describe, test, expect, beforeEach, afterAll } from "bun:test";
import { log, error, warn, info } from "../utils/logger.ts"; // Replace with your actual logger module path

describe("Logger Test Suite", () => {
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;
    const originalInfo = console.info;

    let outputData = "";

    beforeEach(() => {
        outputData = "";
    });

    afterAll(() => {
        // Restore the original console methods after tests
        console.log = originalLog;
        console.error = originalError;
        console.warn = originalWarn;
        console.info = originalInfo;
    });

    test("Log Message Test", () => {
        console.log = (message: string) => {
            outputData = message;
        };

        log("Test log message");

        expect(outputData).toContain("[LOG]");
        expect(outputData).toContain("Test log message");
        expect(outputData).toContain(new Date().toISOString().split("T")[0]); // Just check date part
    });

    test("Error Message Test", () => {
        console.error = (message: string) => {
            outputData = message;
        };

        error("Test error message");

        expect(outputData).toContain("[ERROR]");
        expect(outputData).toContain("Test error message");
    });

    test("Warn Message Test", () => {
        console.warn = (message: string) => {
            outputData = message;
        };

        warn("Test warn message");

        expect(outputData).toContain("[WARN]");
        expect(outputData).toContain("Test warn message");
    });

    test("Info Message Test", () => {
        console.info = (message: string) => {
            outputData = message;
        };

        info("Test info message");

        expect(outputData).toContain("[INFO]");
        expect(outputData).toContain("Test info message");
    });
});
