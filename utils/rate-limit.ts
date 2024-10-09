// Token Bucket Algorithm Implementation

interface RLOptions {
    maxRequests: number;
    intervalMs: number;
}

export class RateLimiter {
    private clients: Map<string, {tokens: number; lastRefill: number}>;
    private maxRequests: number;
    private intervalMs: number;

    constructor({maxRequests, intervalMs}: RLOptions) {
        this.clients = new Map();
        this.maxRequests = maxRequests;
        this.intervalMs = intervalMs;
    }

    private refillToken(clientIp: string): void {
        const now = Date.now()
        const client = this.clients.get(clientIp);
        if (client) {
            const timePassed = now - client.lastRefill;
            // To-Do Partial Rate Limiting is messed up for some reason research why
            const tokensToAdd = (timePassed / this.intervalMs) * this.maxRequests;
            client.tokens = Math.min(client.tokens + tokensToAdd, this.maxRequests);
            client.lastRefill = now;
        }
    }

    public checkRateLimit(clientIp: string): boolean {
        if (!this.clients.has(clientIp)) {
            this.clients.set(clientIp, { tokens: this.maxRequests, lastRefill: Date.now() });
        }

        this.refillToken(clientIp);
        const client = this.clients.get(clientIp)!;
        if (client.tokens >= 1) {
            client.tokens--;
            return true;
        }

        return false;
    }

}

export const rateLimiter = new RateLimiter({maxRequests: 10, intervalMs: 6000});