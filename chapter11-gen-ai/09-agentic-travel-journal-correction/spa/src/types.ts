import type { RefObject, Dispatch, SetStateAction } from 'react';
declare global {
	type Post = {
		_id: string;
		title: string;
		author: string;
		image: string;
		content: string;
	};

	type User = {
		_id: string;
		createdAt: string;
		__v: number;
		email: string;
		firstName: string;
		lastName: string;
		roles: string[];
	};
	type LoginInput = { email: string; password: string };

	type AuthContextType = {
		signedIn: boolean;
		user: User | null;
		handleSignIn: ({ email, password }: LoginInput) => Promise<void>;
		handleSignOut: () => Promise<void>;
		handleRegister: (formData: RegisterFormState) => Promise<void>;
	};

	type RegisterFormState = {
		firstName: string;
		lastName: string;
		email: string;
		password: string;
		confirmPassword: string;
	};
	type SetPosts = Dispatch<SetStateAction<Post[]>>;

	export type MsgRoles = 'assistant' | 'user';

	export type Message = {
		role: MsgRoles;
		content: string;
		_id: string;
	};

	export type ChatRef = RefObject<HTMLDivElement | null>;

	export type SetMessages = Dispatch<SetStateAction<Message[]>>;
	export type SetChatId = Dispatch<SetStateAction<string | null>>;
	export type SetLoading = Dispatch<SetStateAction<boolean>>;
}
