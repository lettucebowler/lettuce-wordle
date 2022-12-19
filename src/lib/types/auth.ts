export type Profile = {
	login: string;
	avatar: string;
	bio: string;
};

export type UserProfile = {
	login: string;
	id: number;
	email: string;
	image: string;
};

export type WordLettuceSession =
	| {
			user: UserProfile;
			provider: string;
			expires: string;
	  }
	| null
	| undefined;

export type UserRecord = {
	username: string;
	github_id: number;
};
