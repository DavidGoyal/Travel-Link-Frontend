import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "../../constants/constants";
import {
	ChatDetailsResponse,
	getFriendRequestsResponse,
	getMessagesResponse,
	getRecentActivityRespone,
	hasUpvotedProfileResponse,
	loginUserInput,
	loginUserResponse,
	myChatsResponse,
	popularTravellersResponse,
	registerUserInput,
	searchTravellersInput,
	sendFriendRequestInput,
	updateTravellerStatusInput,
	verifyUserInput,
} from "../../types/apiTypes";

export const api = createApi({
	reducerPath: "api",
	baseQuery: fetchBaseQuery({ baseUrl: `${server}/api/v1/` }),
	tagTypes: ["Travel", "Notification", "Rating", "Upvote", "Chat"],
	endpoints: (builder) => ({
		loginUser: builder.mutation<loginUserResponse, loginUserInput>({
			query: ({ email, password }) => ({
				url: "user/login",
				method: "POST",
				credentials: "include",
				body: { email, password },
			}),
		}),
		registerUser: builder.mutation<loginUserResponse, registerUserInput>({
			query: ({ formData }) => ({
				url: "user/register",
				method: "POST",
				credentials: "include",
				body: formData,
			}),
		}),
		logoutUser: builder.query<Omit<loginUserResponse, "user">, void>({
			query: () => ({
				url: "user/logout",
				method: "GET",
				credentials: "include",
			}),
		}),
		verifyUser: builder.mutation<
			Omit<loginUserResponse, "user">,
			verifyUserInput
		>({
			query: ({ id, token }) => ({
				url: "user/verify",
				method: "PUT",
				credentials: "include",
				body: { id, token },
			}),
		}),
		popularTravellers: builder.query<popularTravellersResponse, void>({
			query: () => ({
				url: "user/popular",
				method: "GET",
				credentials: "include",
			}),
			keepUnusedDataFor: 0,
			providesTags: ["Upvote"],
		}),
		myProfile: builder.query<Omit<loginUserResponse, "message">, void>({
			query: () => ({
				url: "user/my",
				method: "GET",
				credentials: "include",
			}),
			providesTags: ["Travel"],
		}),
		updateTravellerStatus: builder.mutation<
			Omit<loginUserResponse, "user">,
			updateTravellerStatusInput
		>({
			query: ({ destination, date, explore = false }) => ({
				url: `user/travel`,
				method: "PUT",
				credentials: "include",
				body: {
					destination,
					date,
					explore,
				},
			}),
			invalidatesTags: ["Travel"],
		}),
		getFriendRequests: builder.query<getFriendRequestsResponse, void>({
			query: () => ({
				url: "request/friends",
				method: "GET",
				credentials: "include",
			}),
			providesTags: ["Notification"],
			keepUnusedDataFor: 0,
		}),
		getNotifications: builder.query<getFriendRequestsResponse, void>({
			query: () => ({
				url: "request/notifications",
				method: "GET",
				credentials: "include",
			}),
			providesTags: ["Notification"],
			keepUnusedDataFor: 0,
		}),
		getRecentActivites: builder.query<getRecentActivityRespone, void>({
			query: () => ({
				url: "request/recent",
				method: "GET",
				credentials: "include",
			}),
			providesTags: ["Notification"],
			keepUnusedDataFor: 0,
		}),
		searchTravellers: builder.query<
			popularTravellersResponse,
			searchTravellersInput
		>({
			query: ({ age, sex, destination }) => {
				let url = "user/search";
				const params = [];

				if (age) {
					params.push(`age=${age}`);
				}
				if (sex) {
					params.push(`sex=${sex}`);
				}
				if (destination) {
					params.push(`destination=${destination}`);
				}

				if (params.length) {
					url += `?${params.join("&")}`;
				}
				return {
					url,
					method: "GET",
					credentials: "include",
				};
			},
			providesTags: ["Travel"],
		}),
		getProfile: builder.query<
			Omit<loginUserResponse, "message">,
			{ id: string }
		>({
			query: ({ id }) => ({
				url: `user/profile/${id}`,
				method: "GET",
				credentials: "include",
			}),
		}),
		sendFriendRequest: builder.mutation<
			Omit<loginUserResponse, "user">,
			sendFriendRequestInput
		>({
			query: ({ receiver }) => ({
				url: "request/new",
				method: "POST",
				credentials: "include",
				body: { receiver },
			}),
			invalidatesTags: ["Notification"],
		}),
		hasUpvotedProfile: builder.query<hasUpvotedProfileResponse, { id: string }>(
			{
				query: ({ id }) => ({
					url: `user/upvoted/${id}`,
					method: "GET",
					credentials: "include",
				}),
				providesTags: ["Rating"],
			}
		),
		upvoteProfile: builder.mutation<
			Omit<loginUserResponse, "user">,
			{ id: string }
		>({
			query: ({ id }) => ({
				url: "user/rating",
				method: "PUT",
				credentials: "include",
				body: { id },
			}),
			invalidatesTags: ["Rating", "Upvote", "Notification"],
		}),
		myChats: builder.query<myChatsResponse, void>({
			query: () => ({
				url: `chat/my`,
				method: "GET",
				credentials: "include",
			}),
			keepUnusedDataFor: 0,
			providesTags: ["Chat"],
		}),
		acceptRequest: builder.mutation<
			Omit<loginUserResponse, "user">,
			{ requestId: string; accept: boolean }
		>({
			query: ({ requestId, accept }) => ({
				url: "request/accept",
				method: "PUT",
				credentials: "include",
				body: { requestId, accept },
			}),
			invalidatesTags: ["Chat", "Notification"],
		}),
		deleteNotification: builder.mutation<
			Omit<loginUserResponse, "user">,
			{ id: string }
		>({
			query: ({ id }) => ({
				url: `request/${id}`,
				method: "DELETE",
				credentials: "include",
			}),
			invalidatesTags: ["Notification"],
		}),
		getChatDetails: builder.query<
			ChatDetailsResponse,
			{ chatId: string; skip: boolean }
		>({
			query: ({ chatId }) => ({
				url: `chat/${chatId}`,
				method: "GET",
				credentials: "include",
			}),
			providesTags: ["Chat"],
		}),
		getMessages: builder.query<
			getMessagesResponse,
			{ chatId: string; page?: number }
		>({
			query: ({ chatId, page }) => ({
				url: `message/${chatId}?page=${page}`,
				method: "GET",
				credentials: "include",
			}),
			keepUnusedDataFor: 0,
		}),
		sendAttachment: builder.mutation<Omit<loginUserResponse, "user">, FormData>(
			{
				query: (formData) => ({
					url: "message/attachments",
					method: "POST",
					credentials: "include",
					body: formData,
				}),
				invalidatesTags: ["Chat"],
			}
		),
		markAsRead: builder.mutation<Omit<loginUserResponse, "user">, void>({
			query: () => ({
				url: `request/read`,
				method: "PUT",
				credentials: "include",
			}),
			invalidatesTags: ["Notification"],
		}),
		getUnreadCount: builder.query<
			{ success: boolean; unreadNotifications: number },
			void
		>({
			query: () => ({
				url: `request/unread`,
				method: "GET",
				credentials: "include",
			}),
			providesTags: ["Notification"],
		}),
	}),
});

export const {
	useLoginUserMutation,
	useRegisterUserMutation,
	useLazyLogoutUserQuery,
	useVerifyUserMutation,
	useMyProfileQuery,
	useUpdateTravellerStatusMutation,
	useGetFriendRequestsQuery,
	useGetNotificationsQuery,
	useGetRecentActivitesQuery,
	usePopularTravellersQuery,
	useSearchTravellersQuery,
	useGetProfileQuery,
	useSendFriendRequestMutation,
	useHasUpvotedProfileQuery,
	useUpvoteProfileMutation,
	useMyChatsQuery,
	useAcceptRequestMutation,
	useDeleteNotificationMutation,
	useGetChatDetailsQuery,
	useGetMessagesQuery,
	useSendAttachmentMutation,
	useMarkAsReadMutation,
	useGetUnreadCountQuery,
} = api;
