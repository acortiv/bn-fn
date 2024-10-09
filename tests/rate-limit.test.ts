import { describe, test, expect, beforeEach } from "bun:test";
import { RateLimiter } from "../utils/rate-limit";

describe("RateLimiter Test Suite", () => {
    let rateLimiter: RateLimiter;
    const testIp = "127.0.0.1";

    beforeEach(() => {
        // Create a new RateLimiter instance before each test
        rateLimiter = new RateLimiter({ maxRequests: 5, intervalMs: 1000 });
    });

    test("Initial rate limit check should pass", () => {
        expect(rateLimiter.checkRateLimit(testIp)).toBe(true);
    });

    test("Rate limit should be enforced", () => {
        // Use up all available tokens
        for (let i = 0; i < 5; i++) {
            expect(rateLimiter.checkRateLimit(testIp)).toBe(true);
        }
        // The next request should be rate limited
        expect(rateLimiter.checkRateLimit(testIp)).toBe(false);
    });

    test("Tokens should refill after interval", async () => {
        // Use up all available tokens
        for (let i = 0; i < 5; i++) {
            rateLimiter.checkRateLimit(testIp);
        }
        // Wait for the interval to pass
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Should be able to make requests again
        expect(rateLimiter.checkRateLimit(testIp)).toBe(true);
    });

    test("Different IPs should have separate limits", () => {
        const anotherIp = "192.168.1.1";
        // Use up all tokens for testIp
        for (let i = 0; i < 5; i++) {
            rateLimiter.checkRateLimit(testIp);
        }
        // anotherIp should still have available tokens
        expect(rateLimiter.checkRateLimit(anotherIp)).toBe(true);
    });

    test("Partial token refill", async () => {
        // Use up all tokens
        for (let i = 0; i < 5; i++) {
            rateLimiter.checkRateLimit(testIp);
        }
        // Wait for half the interval
        await new Promise(resolve => setTimeout(resolve, 500));
        // Should hopefully be true with partial refills idk
        expect(rateLimiter.checkRateLimit(testIp)).toBe(true);
        // Wait for the full interval
        await new Promise(resolve => setTimeout(resolve, 500));
        // Should be able to make requests again
        expect(rateLimiter.checkRateLimit(testIp)).toBe(true);
    });

    test("Token count should not exceed maxRequests", async () => {
        // Use up all tokens
        for (let i = 0; i < 5; i++) {
            rateLimiter.checkRateLimit(testIp);
        }
        // Wait for double the interval
        await new Promise(resolve => setTimeout(resolve, 2000));
        // Should be able to make exactly maxRequests requests
        for (let i = 0; i < 5; i++) {
            expect(rateLimiter.checkRateLimit(testIp)).toBe(true);
        }
        // The next request should be rate limited
        expect(rateLimiter.checkRateLimit(testIp)).toBe(false);
    });
});