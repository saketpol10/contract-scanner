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
