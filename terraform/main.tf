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

resource "vercel_project" "contract_scanner" {
  name      = "contract-scanner"
  framework = "nextjs"

  git_repository = {
    type              = "github"
    repo              = "saketpol10/contract-scanner"
    production_branch = "main"
  }
}

# ── Environment variables ─────────────────────────────────────────────────────

resource "vercel_project_environment_variable" "groq_api_key" {
  project_id = vercel_project.contract_scanner.id
  team_id    = var.vercel_team_id
  key        = "GROQ_API_KEY"
  value      = var.groq_api_key
  targets    = ["production", "preview", "development"]
  sensitive  = true
}
