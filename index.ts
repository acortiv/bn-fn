import { serve } from "bun";
import { log, error, info, warn } from "./utils/logger.ts";
import { rateLimiter } from "./utils/rate-limit.ts";

function runServer() {
    const server = serve({
        port: 8080,
        fetch(req: Request) {
            const url = new URL(req.url);
            const clientIp = req.headers.get("x-forwarded-for") || "unknown";
            
            info(`Received Request: ${req.method} ${url.pathname} from ${clientIp}`);
            
            if (!rateLimiter.checkRateLimit(clientIp)) {
                warn(`Rate limit exceeded for ${clientIp}`);
                return new Response("Rate limit exceeded", {status: 429})
            }
            
            switch (url.pathname) {
                case "/":
                    info("Serving Homepage");
                    return new Response("Landing Page", { status: 200 });
                default:
                    warn(`404 Not Found: ${url.pathname}`);
                    return new Response("Not Found", { status: 404 });
            }
        },
    });
    info(`Listening on http://localhost:${server.port} ...`)
};

runServer();