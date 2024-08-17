export type UserType = {
	_id: string;
	name: string;
	email: string;
	avatar: {
		_id: string;
		url: string;
	};
	dob: Date;
	sex: string;
	city: string;
	bio: string;
	smoking: boolean;
	alcohol: boolean;
	isLookingForTraveller: boolean;
	rating: number;
	isVerified: boolean;
	destination?: string;
	date?: string;
	createdAt: string;
	updatedAt: string;
};

export type FriendRequestType = {
	_id: string;
	requestType: string;
	sender: {
		_id: string;
		name: string;
		dob: Date;
		avatar: {
			_id: string;
			url: string;
		};
	};
	receiver: string;
	createdAt: string;
	read: boolean;
};

export type RecentActivityType = {
	_id: string;
	requestType: string;
	receiver: {
		_id: string;
		name: string;
		dob: Date;
		avatar: {
			_id: string;
			url: string;
		};
	};
	sender: string;
	createdAt: string;
};

export type ChatType = {
	_id: string;
	name: string;
	avatar: string[];
	members: string[];
};

export type MessageType = {
	_id: string;
	sender: {
		_id: string;
		name: string;
	};
	content?: string;
	chat: string;
	attachments?: [
		{
			public_id: string;
			url: string;
		}
	];
	createdAt: string;
	updatedAt: string;
};
