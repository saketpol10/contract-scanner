import { registerOTel } from "@vercel/otel";

export function register() {
  registerOTel({
    serviceName: "contract-scanner",
    instrumentationConfig: {
      fetch: { enabled: true },
    },
  });
}
