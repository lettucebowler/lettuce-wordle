PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_game_results` (
	`gamenum` integer NOT NULL,
	`answers` text NOT NULL,
	`user_id` integer NOT NULL,
	`attempts` integer NOT NULL,
	PRIMARY KEY(`user_id`, `gamenum`)
);
--> statement-breakpoint
INSERT INTO `__new_game_results`("gamenum", "answers", "user_id", "attempts") SELECT "gamenum", "answers", "user_id", "attempts" FROM `game_results`;--> statement-breakpoint
DROP TABLE `game_results`;--> statement-breakpoint
ALTER TABLE `__new_game_results` RENAME TO `game_results`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `game_num_idx` ON `game_results` (`gamenum`);