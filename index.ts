import { serve } from "bun";
import { log, error, info, warn } from "./utils/logger.ts";

function runServer() {
    const server = serve({
        port: 8080,
        fetch(req: Request) {
            const url = new URL(req.url);
            info(`Received Request: ${req.method} ${url.pathname}`);
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