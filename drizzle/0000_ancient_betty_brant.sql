CREATE TABLE `game_results` (
	`gamenum` integer NOT NULL,
	`answers` text NOT NULL,
	`user_id` integer NOT NULL,
	`attempts` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`github_id` integer PRIMARY KEY NOT NULL,
	`username` text NOT NULL
);
