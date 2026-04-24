output "project_id" {
  description = "Vercel project ID"
  value       = vercel_project.contract_scanner.id
}

output "production_url" {
  description = "Production deployment URL"
  value       = "https://${vercel_project.contract_scanner.name}.vercel.app"
}
