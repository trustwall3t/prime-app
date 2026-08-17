'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, LogOut, Shield } from 'lucide-react';
import { getLoginHistory, logoutAllOtherSessions, logoutSession } from '@/actions/loginHistory';
import { toast } from 'sonner';
import { TableSkeleton } from '@/components/skeletons';
import { dashboardPageTitleClass, dashboardPageWrapClass } from '@/lib/userFormStyles';

interface LoginSession {
	id: string;
	ipAddress: string;
	deviceType: string;
	deviceName: string;
	browser: string;
	browserVersion: string;
	operatingSystem: string;
	location: string;
	country: string;
	city: string;
	lastActive: string;
	isCurrent: boolean;
	isExpired?: boolean;
	createdAt: string;
}

const ITEMS_PER_PAGE = 8;

const LoginHistory = () => {
	const [sessions, setSessions] = useState<LoginSession[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalCount, setTotalCount] = useState(0);

	useEffect(() => {
		const fetchLoginHistory = async () => {
			try {
				setIsLoading(true);
				setError(null);
				const response = await getLoginHistory({
					page: currentPage,
					limit: ITEMS_PER_PAGE,
				});

				if (response.error) {
					setError(response.error);
					toast.error(response.error);
				} else {
					setSessions(response.sessions || []);
					setTotalCount(response.total || 0);
				}
			} catch (err) {
				const errorMessage =
					err instanceof Error
						? err.message
						: 'Failed to fetch login history';
				setError(errorMessage);
				toast.error(errorMessage);
			} finally {
				setIsLoading(false);
			}
		};

		fetchLoginHistory();
	}, [currentPage]);

	const handleLogoutSession = async (sessionId: string) => {
		try {
			const response = await logoutSession(sessionId);
			if (response.error) {
				toast.error(response.error);
			} else {
				toast.success('Session terminated successfully');
				setSessions((prev) => prev.filter((s) => s.id !== sessionId));
				setTotalCount((prev) => Math.max(0, prev - 1));
			}
		} catch {
			toast.error('Failed to logout session');
		}
	};

	const handleLogoutOthers = async () => {
		try {
			const response = await logoutAllOtherSessions();
			if (response.error) {
				toast.error(response.error);
			} else {
				toast.success('All other sessions terminated');
				const refreshed = await getLoginHistory({
					page: currentPage,
					limit: ITEMS_PER_PAGE,
				});
				if (!refreshed.error) {
					setSessions(refreshed.sessions || []);
					setTotalCount(refreshed.total || 0);
				}
			}
		} catch {
			toast.error('Failed to logout other sessions');
		}
	};

	const hasOtherSessions = sessions.some(
		(s) => !s.isCurrent && !s.isExpired,
	);

	const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
	const startIndex = (currentPage - 1) * ITEMS_PER_PAGE + 1;
	const endIndex = Math.min(currentPage * ITEMS_PER_PAGE, totalCount);

	return (
		<div className={dashboardPageWrapClass}>
			{/* Header */}
			<div className='mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
				<div>
					<h1 className={`${dashboardPageTitleClass} mb-2`}>
						Login History
					</h1>
					<p className='text-gray-400'>
						Recent sign-ins to your account from this browser session
						and other devices.
					</p>
				</div>
				{hasOtherSessions && !isLoading && (
					<button
						type='button'
						onClick={handleLogoutOthers}
						className='inline-flex items-center gap-2 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-300 hover:bg-red-500/20 transition'
					>
						<Shield className='h-4 w-4' />
						Log out all other sessions
					</button>
				)}
			</div>

			{/* Loading State */}
			{isLoading && (
				<TableSkeleton
					rows={8}
					cols={5}
				/>
			)}

			{/* Error State */}
			{error && !isLoading && (
				<div className='bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-start gap-3'>
					<AlertCircle className='w-5 h-5 text-red-500 mt-0.5 flex-shrink-0' />
					<div>
						<p className='text-red-200 font-semibold'>
							Error Loading History
						</p>
						<p className='text-red-100 text-sm'>{error}</p>
					</div>
				</div>
			)}

			{/* Table */}
			{!isLoading && !error && sessions.length > 0 && (
				<div className='overflow-x-auto'>
					<div className='inline-block w-full'>
						<div className='grid grid-cols-5 gap-4 mb-4 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700'>
							<div className='text-gray-400 text-sm font-semibold'>
								IP Address
							</div>
							<div className='text-gray-400 text-sm font-semibold'>
								Device
							</div>
							<div className='text-gray-400 text-sm font-semibold'>
								Browser
							</div>
							<div className='text-gray-400 text-sm font-semibold'>
								Location
							</div>
							<div className='text-gray-400 text-sm font-semibold'>
								Action
							</div>
						</div>

						{sessions.map((session) => (
							<div
								key={session.id}
								className='grid grid-cols-5 gap-4 p-4 border-b border-zinc-700 hover:bg-zinc-900/30 transition'
							>
								{/* IP Address */}
								<div className='flex flex-col'>
									<p className='text-white font-mono text-xs'>
										{session.ipAddress}
									</p>
									<p className='text-gray-500 text-xs'>
										{session.lastActive}
									</p>
								</div>

								{/* Device */}
								<div className='flex flex-col'>
									<p className='text-white text-xs'>
										{session.deviceName}
									</p>
									<p className='text-gray-500 text-xs capitalize'>
										{session.operatingSystem}
									</p>
								</div>

								{/* Browser */}
								<div className='flex flex-col'>
									<p className='text-white text-sm'>
										{session.browser}
									</p>
									<p className='text-gray-500 text-xs'>
										{session.browserVersion}
									</p>
								</div>

								{/* Location */}
								<div className='flex flex-col'>
									<p className='text-white text-sm'>
										{session.city}
									</p>
									<p className='text-gray-500 text-xs'>
										{session.country}
									</p>
								</div>

								{/* Action */}
								<div className='flex items-center gap-2'>
									{session.isCurrent ? (
										<span className='px-3 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full'>
											Current
										</span>
									) : session.isExpired ? (
										<span className='px-3 py-1 bg-zinc-700 text-gray-400 text-xs font-semibold rounded-full'>
											Expired
										</span>
									) : (
										<button
											onClick={() =>
												handleLogoutSession(session.id)
											}
											className='p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition'
											title='Logout this session'
										>
											<LogOut className='w-4 h-4' />
										</button>
									)}
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Empty State */}
			{!isLoading && !error && sessions.length === 0 && (
				<div className='text-center py-12'>
					<p className='text-gray-400 mb-2'>No login history found</p>
					<p className='text-gray-500 text-sm'>
						Your login sessions will appear here
					</p>
				</div>
			)}

			{/* Pagination */}
			{!isLoading && !error && sessions.length > 0 && (
				<div className='mt-8 flex items-center justify-between'>
					<p className='text-gray-400 text-sm'>
						Showing {startIndex} to {endIndex} of {totalCount}{' '}
						results
					</p>

					<div className='flex gap-2'>
						<button
							onClick={() =>
								setCurrentPage((prev) => Math.max(1, prev - 1))
							}
							disabled={currentPage === 1}
							className='px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed'
						>
							Previous
						</button>

						<div className='flex items-center gap-2'>
							{Array.from(
								{ length: totalPages },
								(_, i) => i + 1,
							).map((page) => (
								<button
									key={page}
									onClick={() => setCurrentPage(page)}
									className={`w-10 h-10 rounded-lg text-sm font-semibold transition ${
										currentPage === page
											? 'bg-blue-500 text-white'
											: 'bg-zinc-800 hover:bg-zinc-700 text-white'
									}`}
								>
									{page}
								</button>
							))}
						</div>

						<button
							onClick={() =>
								setCurrentPage((prev) =>
									Math.min(totalPages, prev + 1),
								)
							}
							disabled={currentPage === totalPages}
							className='px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed'
						>
							Next
						</button>
					</div>
				</div>
			)}

			{/* Security Info */}
			<div className='mt-8 bg-blue-500/10 border border-blue-500/50 rounded-lg p-4'>
				<p className='text-blue-200 text-sm'>
					<strong>Security Tip:</strong> Review your login history
					regularly. If you see any unfamiliar sessions, logout
					immediately and change your password.
				</p>
			</div>
		</div>
	);
};

export default LoginHistory;
