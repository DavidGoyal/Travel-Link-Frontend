import {
	ChatType,
	FriendRequestType,
	MessageType,
	RecentActivityType,
	UserType,
} from "./types";

export type loginUserInput = {
	email: string;
	password: string;
	cloudflareToken: string;
};

export type loginUserResponse = {
	success: boolean;
	message: string;
	user?: UserType;
};

export type registerUserInput = {
	formData: FormData;
};

export type verifyUserInput = {
	id: string;
	token: string;
};

export type popularTravellersResponse = {
	success: boolean;
	users: UserType[];
};

export type updateTravellerStatusInput = {
	destination?: string;
	date?: string;
	explore?: boolean;
};

export type getFriendRequestsResponse = {
	success: boolean;
	requests: FriendRequestType[];
};

export type getNotificationsResponse = {
	success: boolean;
	requests: FriendRequestType[];
};

export type getRecentActivityRespone = {
	success: boolean;
	requests: RecentActivityType[];
};

export type searchTravellersInput = {
	age?: string;
	sex?: string;
	destination?: string;
};

export type sendFriendRequestInput = {
	receiver: string;
};

export type hasUpvotedProfileResponse = {
	success: boolean;
	isPresent: boolean;
};

export type myChatsResponse = {
	success: boolean;
	chats: ChatType[];
};

export type ChatDetailsResponse = {
	success: boolean;
	chat: ChatType;
};

export type getMessagesResponse = {
	success: boolean;
	messages: MessageType[];
	totalPages: number;
};

export type ErrorResponse = {
	success: boolean;
	message: string;
};
