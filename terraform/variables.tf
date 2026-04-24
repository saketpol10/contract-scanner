variable "vercel_api_token" {
  description = "Vercel API token"
  type        = string
  sensitive   = true
}

variable "vercel_team_id" {
  description = "Vercel team ID"
  type        = string
  default     = "team_Wscm3NRQvqRiKYFgeTaSz3Ep"
}

variable "groq_api_key" {
  description = "Groq API key for LLM inference"
  type        = string
  sensitive   = true
}

variable "otel_endpoint" {
  description = "OpenTelemetry OTLP endpoint (Grafana Cloud)"
  type        = string
  default     = "https://otlp-gateway-prod-eu-west-2.grafana.net/otlp"
}

variable "otel_headers" {
  description = "OpenTelemetry OTLP auth header"
  type        = string
  sensitive   = true
}
