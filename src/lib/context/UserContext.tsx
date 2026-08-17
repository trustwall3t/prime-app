'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type User = {
	id: string;
	name: string | null;
	email: string;
	phone?: string | null;
	address?: string | null;
	accountType?: string | null;
	country?: string;
	btcAddress?: string | null;
	usdtAddress?: string | null;
	ethAddress?: string | null;
	walletBalance?: number | null;
	isFirstLogin?: boolean;
	[k: string]: unknown;
};

type UserContextType = {
	user: User | null;
	loading: boolean;
	setUser: (user: User | null) => void;
};

const UserContext = createContext<UserContextType>({
	user: null,
	loading: true,
	setUser: () => {},
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({
	children,
	initialUser = null,
	skipInitialFetch = false,
}: {
	children: React.ReactNode;
	initialUser?: User | null;
	skipInitialFetch?: boolean;
}) => {
	const [user, setUser] = useState<User | null>(initialUser);
	const [loading, setLoading] = useState(!skipInitialFetch && !initialUser);

	useEffect(() => {
		if (skipInitialFetch || initialUser) {
			setLoading(false);
			return;
		}

		const fetchUser = async () => {
			try {
				const response = await fetch('/api/auth/session', {
					cache: 'no-store',
				});
				if (!response.ok) {
					setLoading(false);
					return;
				}

				const data = await response.json();
				setUser(data.user);
			} catch (error) {
				console.error('Error fetching user:', error);
				setUser(null);
			} finally {
				setLoading(false);
			}
		};

		void fetchUser();
	}, [initialUser, skipInitialFetch]);

	return (
		<UserContext.Provider value={{ user, loading, setUser }}>
			{children}
		</UserContext.Provider>
	);
};
