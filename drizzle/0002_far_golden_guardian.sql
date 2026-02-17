ALTER TABLE `audit_reports` ADD `site_url` varchar(500);--> statement-breakpoint
ALTER TABLE `audit_reports` ADD `audited_pages` text;--> statement-breakpoint
ALTER TABLE `finding_templates` ADD `confidence_level` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `finding_templates` ADD `usage_context` text;--> statement-breakpoint
ALTER TABLE `finding_templates` ADD `original_finding` text;--> statement-breakpoint
ALTER TABLE `finding_templates` ADD `signature_hash` varchar(64);--> statement-breakpoint
ALTER TABLE `findings` ADD `template_id` int;--> statement-breakpoint
ALTER TABLE `finding_templates` ADD CONSTRAINT `finding_templates_signature_hash_unique` UNIQUE(`signature_hash`);