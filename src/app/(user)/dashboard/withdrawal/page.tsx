import { redirect } from 'next/navigation';

export default function WithdrawalRedirectPage() {
	redirect('/dashboard/withdraw');
}
