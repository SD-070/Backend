import type { Dispatch, SetStateAction } from 'react';
export type Duck = {
	_id: string;
	name: string;
	imgUrl: string;
	quote: string;
	createdAt?: string;
	updatedAt?: string;
	__v?: number;
};

export type SetDucks = Dispatch<SetStateAction<Duck[]>>;
