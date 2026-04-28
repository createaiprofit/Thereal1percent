CREATE TABLE `pin_reset_tokens` (
	`id` int AUTO_INCREMENT NOT NULL,
	`token` varchar(128) NOT NULL,
	`used` int NOT NULL DEFAULT 0,
	`expiresAt` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `pin_reset_tokens_id` PRIMARY KEY(`id`),
	CONSTRAINT `pin_reset_tokens_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `war_room_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`pinHash` varchar(256) NOT NULL,
	`adminEmail` varchar(320) NOT NULL DEFAULT 'ernest@createaiprofit.com',
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `war_room_settings_id` PRIMARY KEY(`id`)
);
