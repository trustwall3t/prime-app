import { Suspense } from 'react';
import { SignupForm } from '../_components/signupForm';

export default function Signup() {
	return (
		<Suspense fallback={null}>
			<SignupForm />
		</Suspense>
	);
}
