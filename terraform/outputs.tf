output "project_id" {
  description = "Vercel project ID"
  value       = vercel_project.offer_scan.id
}

output "production_url" {
  description = "Production deployment URL"
  value       = "https://${vercel_project.offer_scan.name}.vercel.app"
}
