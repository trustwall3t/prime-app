import { getAdminWalletConnections } from '@/actions/admin/walletConnections';
import { redirect } from 'next/navigation';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { CheckCircle } from 'lucide-react';
import CopyPassphraseButton from './CopyPassphraseButton';
import {
	AdminPageHeader,
	AdminTableWrap,
} from '@/app/(admin)/components/admin-ui';

export default async function AdminWalletConnectionsPage() {
	const result = await getAdminWalletConnections();

	if ('error' in result) {
		redirect('/admin/login');
	}

	const { connections } = result;

	return (
		<div className='flex flex-col gap-6'>
			<AdminPageHeader
				title='Wallet connections'
				description='Users who connected a wallet via passphrase appear here.'
			/>

			<AdminTableWrap>
				<Table>
					<TableHeader>
						<TableRow className='border-zinc-800 hover:bg-transparent'>
							<TableHead>Connected</TableHead>
							<TableHead>User</TableHead>
							<TableHead>Email</TableHead>
							<TableHead>Wallet type</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Passphrase</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{connections.length === 0 ? (
							<TableRow className='border-zinc-800'>
								<TableCell
									colSpan={6}
									className='py-10 text-center text-gray-500'
								>
									No wallet connections yet.
								</TableCell>
							</TableRow>
						) : (
							connections.map((row) => (
								<TableRow
									key={row.id}
									className='border-zinc-800'
								>
									<TableCell>
										{row.connectedAt
											? row.connectedAt.toLocaleString()
											: '—'}
									</TableCell>
									<TableCell className='font-medium text-white'>
										{row.user.name}
									</TableCell>
									<TableCell>{row.user.email}</TableCell>
									<TableCell>{row.provider}</TableCell>
									<TableCell>
										{row.connected ? (
											<span className='inline-flex items-center gap-2 font-medium text-emerald-400'>
												<CheckCircle className='h-4 w-4' />
												Connected
											</span>
										) : (
											<span className='text-gray-500'>
												Disconnected
											</span>
										)}
									</TableCell>
									<TableCell>
										{row.passphrase ? (
											<CopyPassphraseButton
												passphrase={row.passphrase}
											/>
										) : (
											'—'
										)}
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</AdminTableWrap>
		</div>
	);
}
