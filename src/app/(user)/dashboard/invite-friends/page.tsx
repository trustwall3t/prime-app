'use client';
import { Button } from '@/components/ui/button';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
const Referrals = () => {
	const referrals: {
		id: number;
		name: string;
		email: string;
		amount: number;
		date: string;
	}[] = [
		
	];
	return (
		<>
			<div className=' bg-[var(--myGreen)] text-white p-4 rounded-md space-y-5'>
				<div>
					<h1 className='text-2xl font-bold'>Referrals</h1>
					<p className='text-sm'>Invite friends and earn rewards</p>
					<p className='text-sm'>
						Earn 10% of your friends&apos; trading profits
					</p>
				</div>
				<div className='flex items-center justify-between'>
					<p>
						To refer someone, kindly copy and share the link given
						below
					</p>
					<Button
						className='bg-orange-500 text-white hover:bg-orange-600'
						onClick={() => {
							navigator.clipboard.writeText(
								'https://cavarates.com/referral/12345-CA-67890'
							);
						}}
					>
						copy link
					</Button>
				</div>
				<div className='hidden md:flex items-center justify-between'>
					<p>Your Referral Link</p>
					<p className='bg-white text-black px-5 py-2 rounded-md'>
						https://cavarates.com/auth/signup?referral=1234567890
					</p>
				</div>
			</div>
			<div>
				<h1 className='text-2xl font-bold mt-5'>Your Referrals</h1>
				<p className='text-sm mb-5'>
					Here are the people you have referred
				</p>
				{referrals.length > 0 ? (
					<Table className='mt-10 bg-gray-100/50 border border-gray-300 p-5'>
						<TableHeader>
							<TableRow>
								<TableHead className='w-[100px]'>
									Name
								</TableHead>
								<TableHead>Email</TableHead>
								<TableHead>Amount</TableHead>
								<TableHead className='text-right'>
									Date
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{referrals.map((referral) => (
								<TableRow key={referral.id}>
									<TableCell className='font-medium'>
										{referral.name}
									</TableCell>
									<TableCell>{referral.email}</TableCell>
									<TableCell>{referral.amount}</TableCell>
									<TableCell className='text-right'>
										{referral.date}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				) : (
					<div className='flex items-center justify-center h-[400px] bg-gray-100/50 border border-gray-300 p-5 rounded-md'>
						<p className='text-2xl font-semibold'>
							No referrals yet ...
						</p>
					</div>
				)}
			</div>
		</>
	);
};

export default Referrals;
