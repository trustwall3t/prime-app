import {
	Table,
	TableRow,
	TableHeader,
	TableHead,
	TableBody,
	TableCell,
} from '@/components/ui/table';
import { CheckIcon, XIcon } from 'lucide-react';
import { approveKyc, getKyc, rejectKyc } from '@/actions/ky';
import Image from 'next/image';
import PendingBadge from '@/app/(admin)/components/PendingBadge';
import SuccessBadge from '@/app/(admin)/components/SuccessBadge';
import CancelledBadge from '@/app/(admin)/components/CancelledBadge';
import { revalidatePath } from 'next/cache';
import {
	AdminIconButton,
	AdminPageHeader,
	AdminTableWrap,
	adminBtnClass,
} from '@/app/(admin)/components/admin-ui';

async function handleApproveKyc(formData: FormData) {
	'use server';
	const kycId = formData.get('kycId') as string;
	await approveKyc(kycId);
	revalidatePath('/admin/dashboard/kyc');
}

async function handleRejectKyc(formData: FormData) {
	'use server';
	const kycId = formData.get('kycId') as string;
	await rejectKyc(kycId);
	revalidatePath('/admin/dashboard/kyc');
}

const Kyc = async () => {
	const kyc = await getKyc();

	return (
		<div className='flex flex-col gap-6'>
			<AdminPageHeader
				title='KYC verification'
				description='Review submitted identity documents.'
			/>
			<AdminTableWrap>
				<Table>
					<TableHeader>
						<TableRow className='border-zinc-800 hover:bg-transparent'>
							<TableHead>Name</TableHead>
							<TableHead>Email</TableHead>
							<TableHead>Phone</TableHead>
							<TableHead>KYC Status</TableHead>
							<TableHead>ID Number</TableHead>
							<TableHead>ID Type</TableHead>
							<TableHead>Country</TableHead>
							<TableHead>File</TableHead>
							<TableHead>Action</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{kyc.map((kyc) => (
							<TableRow key={kyc.id} className='border-zinc-800'>
								<TableCell>
									{kyc.firstName} {kyc.lastName}
								</TableCell>
								<TableCell>{kyc.user.email}</TableCell>
								<TableCell>{kyc.user.phone}</TableCell>
								<TableCell>
									{kyc.status === 'pending' ? (
										<PendingBadge />
									) : kyc.status === 'approved' ? (
										<SuccessBadge />
									) : (
										<CancelledBadge />
									)}
								</TableCell>
								<TableCell>{kyc.idNumber}</TableCell>
								<TableCell>{kyc.idType}</TableCell>
								<TableCell>{kyc.country}</TableCell>
								<TableCell>
									<div className='flex items-center gap-2'>
										<Image
											src={kyc.idImage}
											alt='KYC'
											width={40}
											height={40}
											className='h-10 w-10 rounded object-cover'
										/>
										<a
											href={kyc.idImage}
											target='_blank'
											rel='noreferrer'
											className={adminBtnClass('secondary')}
										>
											View
										</a>
									</div>
								</TableCell>
								<TableCell>
									<div className='flex items-center gap-2'>
										<form action={handleApproveKyc}>
											<input
												type='hidden'
												name='kycId'
												value={kyc.id}
											/>
											<AdminIconButton
												variant='success'
												type='submit'
												title='Approve'
											>
												<CheckIcon className='h-4 w-4' />
											</AdminIconButton>
										</form>
										<form action={handleRejectKyc}>
											<input
												type='hidden'
												name='kycId'
												value={kyc.id}
											/>
											<AdminIconButton
												variant='danger'
												type='submit'
												title='Reject'
											>
												<XIcon className='h-4 w-4' />
											</AdminIconButton>
										</form>
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</AdminTableWrap>
		</div>
	);
};

export default Kyc;
