CREATE TABLE `audit_reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`file_name` varchar(255) NOT NULL,
	`file_key` varchar(255) NOT NULL,
	`file_url` text,
	`user_id` int NOT NULL,
	`findings_count` int NOT NULL DEFAULT 0,
	`status` enum('pending','processing','completed','failed') NOT NULL DEFAULT 'pending',
	`error_message` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `audit_reports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `finding_templates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`criterion_id` int NOT NULL,
	`thematic_id` int NOT NULL,
	`impact` enum('Bloquant','Majeur','Mineur') NOT NULL,
	`content_type` varchar(255),
	`finding` text NOT NULL,
	`solution` text,
	`occurrence_count` int NOT NULL DEFAULT 1,
	`status` enum('draft','approved','deprecated') NOT NULL DEFAULT 'draft',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `finding_templates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `findings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`report_id` int NOT NULL,
	`criterion_id` int NOT NULL,
	`thematic_id` int NOT NULL,
	`sub_thematic` varchar(255),
	`impact` enum('Bloquant','Majeur','Mineur') NOT NULL,
	`location` varchar(255),
	`content_type` varchar(255),
	`user_problem` text,
	`finding` text NOT NULL,
	`solution` text,
	`thematic_number` int,
	`criterion_reference` varchar(10),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `findings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `rgaa_criteria` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reference` varchar(10) NOT NULL,
	`label` text NOT NULL,
	`thematic_id` int NOT NULL,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `rgaa_criteria_id` PRIMARY KEY(`id`),
	CONSTRAINT `rgaa_criteria_reference_unique` UNIQUE(`reference`)
);
--> statement-breakpoint
CREATE TABLE `rgaa_thematics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`number` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `rgaa_thematics_id` PRIMARY KEY(`id`),
	CONSTRAINT `rgaa_thematics_number_unique` UNIQUE(`number`)
);
