import React from 'react';
import KycSection from '../_components/forms/KycSection';
import { getSession } from '@/lib/session';
import { dashboardPageTitleClass, dashboardPageWrapClass } from '@/lib/userFormStyles';

const page = async () => {
	const session = await getSession();

	return (
		<div className={dashboardPageWrapClass}>
			<div className='space-y-2'>
				<h1 className={dashboardPageTitleClass}>
					KYC Verification
				</h1>
				<p className='text-gray-400'>
					To comply with regulation each participant will have to go
					through identity verification (KYC/AML) to prevent fraud
					causes.
				</p>
			</div>

			<KycSection
				isVerified={session?.user.isVerified}
				firstName={session?.user.name}
				hasPendingSubmission={
					(session?.user?.kyc?.length ?? 0) > 0 &&
					session?.user?.kyc?.[0]?.status === 'pending'
				}
			/>
		</div>
	);
};

export default page;
