import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import UpdateProfile from '../_components/forms/updateProfile';
import Security from '../_components/forms/Security';
import WithdrawalInformationForm from '../_components/forms/WithdrawalInformationForm';
import {
	dashboardTabTriggerClass,
	dashboardTabsListClass,
} from '@/lib/userFormStyles';

const Settings = () => {
	return (
		<div className='space-y-6'>
			<div className='space-y-2'>
				<h1 className='text-3xl font-bold text-white'>Settings</h1>
				<p className='text-sm text-gray-400'>
					Manage your profile, withdrawal addresses, and security.
				</p>
			</div>

			<Tabs
				className='w-full'
				defaultValue='personal'
			>
				<TabsList className={dashboardTabsListClass}>
					<TabsTrigger
						value='personal'
						className={dashboardTabTriggerClass}
					>
						Profile
					</TabsTrigger>
					<TabsTrigger
						value='withdrawal'
						className={dashboardTabTriggerClass}
					>
						Withdrawal
					</TabsTrigger>
					<TabsTrigger
						value='security'
						className={dashboardTabTriggerClass}
					>
						Security
					</TabsTrigger>
				</TabsList>

				<TabsContent
					value='personal'
					className='mt-5 w-full'
				>
					<UpdateProfile />
				</TabsContent>
				<TabsContent
					value='withdrawal'
					className='mt-5 w-full'
				>
					<WithdrawalInformationForm />
				</TabsContent>
				<TabsContent
					value='security'
					className='mt-5 w-full'
				>
					<Security />
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default Settings;
