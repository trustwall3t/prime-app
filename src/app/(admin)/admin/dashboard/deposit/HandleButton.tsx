import { AdminIconButton } from '@/app/(admin)/components/admin-ui';
import { CheckCircleIcon, TrashIcon, XCircleIcon } from 'lucide-react';
import {
	approveDepositRequest,
	deleteDepositRequest,
	rejectDepositRequest,
} from '@/actions/admin/getDepositRequest';

export default function HandleButton({
	depositId,
	userId,
}: {
	depositId: string;
	userId: string;
}) {
	return (
		<div className='flex gap-2'>
			<form
				action={async () => {
					'use server';
					await approveDepositRequest(depositId, userId);
				}}
			>
				<AdminIconButton variant='success' type='submit' title='Approve'>
					<CheckCircleIcon className='h-4 w-4' />
				</AdminIconButton>
			</form>
			<form
				action={async () => {
					'use server';
					await rejectDepositRequest(depositId);
				}}
			>
				<AdminIconButton variant='warning' type='submit' title='Reject'>
					<XCircleIcon className='h-4 w-4' />
				</AdminIconButton>
			</form>
			<form
				action={async () => {
					'use server';
					await deleteDepositRequest(depositId);
				}}
			>
				<AdminIconButton variant='danger' type='submit' title='Delete'>
					<TrashIcon className='h-4 w-4' />
				</AdminIconButton>
			</form>
		</div>
	);
}
