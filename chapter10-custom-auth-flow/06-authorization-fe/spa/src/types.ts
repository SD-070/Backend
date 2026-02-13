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
	type SetPosts = React.Dispatch<React.SetStateAction<Post[]>>;
}
