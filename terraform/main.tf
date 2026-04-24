terraform {
  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~> 2.0"
    }
  }
}

provider "vercel" {
  api_token = var.vercel_api_token
  team      = var.vercel_team_id
}

# ── Project ──────────────────────────────────────────────────────────────────

resource "vercel_project" "offer_scan" {
  name      = "offer-scan"
  framework = "nextjs"
}

# ── Environment variables ─────────────────────────────────────────────────────

resource "vercel_project_environment_variable" "groq_api_key" {
  project_id = vercel_project.offer_scan.id
  team_id    = var.vercel_team_id
  key        = "GROQ_API_KEY"
  value      = var.groq_api_key
  target     = ["production", "preview"]
  sensitive  = true
}

resource "vercel_project_environment_variable" "otel_endpoint" {
  project_id = vercel_project.offer_scan.id
  team_id    = var.vercel_team_id
  key        = "OTEL_EXPORTER_OTLP_ENDPOINT"
  value      = var.otel_endpoint
  target     = ["production", "preview"]
}

resource "vercel_project_environment_variable" "otel_headers" {
  project_id = vercel_project.offer_scan.id
  team_id    = var.vercel_team_id
  key        = "OTEL_EXPORTER_OTLP_HEADERS"
  value      = var.otel_headers
  target     = ["production", "preview"]
  sensitive  = true
}

resource "vercel_project_environment_variable" "upstash_url" {
  project_id = vercel_project.offer_scan.id
  team_id    = var.vercel_team_id
  key        = "UPSTASH_REDIS_REST_URL"
  value      = var.upstash_redis_rest_url
  target     = ["production", "preview"]
}

resource "vercel_project_environment_variable" "upstash_token" {
  project_id = vercel_project.offer_scan.id
  team_id    = var.vercel_team_id
  key        = "UPSTASH_REDIS_REST_TOKEN"
  value      = var.upstash_redis_rest_token
  target     = ["production", "preview"]
  sensitive  = true
}
