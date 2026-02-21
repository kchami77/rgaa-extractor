CREATE TABLE `hub_settings` (
	`key` varchar(100) NOT NULL,
	`value` text NOT NULL,
	`type` enum('string','number','boolean','password','select') NOT NULL DEFAULT 'string',
	`category` varchar(50) NOT NULL,
	`description` text,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `hub_settings_key` PRIMARY KEY(`key`)
);
