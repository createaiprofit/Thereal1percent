CREATE TABLE `bot_performance` (
	`id` int AUTO_INCREMENT NOT NULL,
	`botName` varchar(100) NOT NULL,
	`callsToday` int NOT NULL DEFAULT 0,
	`callsWeek` int NOT NULL DEFAULT 0,
	`pitchedCount` int NOT NULL DEFAULT 0,
	`assignedCount` int NOT NULL DEFAULT 0,
	`feesGenerated` decimal(12,2) DEFAULT '0.00',
	`conversionRate` decimal(5,2) DEFAULT '0.00',
	`topMarket` varchar(200),
	`alertFlag` boolean NOT NULL DEFAULT false,
	`snapshotDate` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `bot_performance_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `call_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`botName` varchar(100) NOT NULL,
	`botVoice` varchar(100),
	`toNumber` varchar(30) NOT NULL,
	`fromNumber` varchar(30),
	`twilioSid` varchar(64),
	`outcome` enum('connected','voicemail','no_answer','interested','assigned','rejected','error') DEFAULT 'connected',
	`durationSeconds` int,
	`scriptUsed` text,
	`dealId` int,
	`calledAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `call_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `deals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`propertyAddress` varchar(500) NOT NULL,
	`ownerName` varchar(200),
	`ownerPhone` varchar(30),
	`stage` enum('cold','pitched','negotiating','assigned','closed','lost') NOT NULL DEFAULT 'cold',
	`assignedBotName` varchar(100),
	`feeProjected` decimal(12,2),
	`feeCollected` decimal(12,2),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `deals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `war_room_alerts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`type` enum('deal_milestone','bot_low','fee_collected','finance_approved','system','call_placed','call_connected') NOT NULL,
	`title` varchar(200) NOT NULL,
	`message` text NOT NULL,
	`severity` enum('info','warning','critical') NOT NULL DEFAULT 'info',
	`read` boolean NOT NULL DEFAULT false,
	`relatedDealId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `war_room_alerts_id` PRIMARY KEY(`id`)
);
