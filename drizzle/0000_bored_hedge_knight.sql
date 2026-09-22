CREATE TABLE `unifin_leads` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`first_name` text NOT NULL,
	`email` text NOT NULL,
	`modality` text NOT NULL,
	`main_challenge` text NOT NULL,
	`consent` integer NOT NULL,
	`utm_source` text,
	`utm_medium` text,
	`utm_campaign` text,
	`referrer` text,
	`is_test` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `unifin_leads_email_unique` ON `unifin_leads` (`email`);--> statement-breakpoint
CREATE TABLE `unifin_page_views` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`session_id` text NOT NULL,
	`utm_source` text,
	`utm_medium` text,
	`utm_campaign` text,
	`referrer` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `unifin_page_views_session_unique` ON `unifin_page_views` (`session_id`);