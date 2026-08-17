'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader } from './Loader';

export default function DynamicStyles() {
	const pathname = usePathname();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// Check if we're not in admin or dashboard routes
		if (
			!pathname.startsWith('/admin') &&
			!pathname.startsWith('/dashboard') &&
			!pathname.startsWith('/auth')
		) {
			// Create a container for scoped styles
			const styleContainer = document.createElement('div');
			styleContainer.className = 'dynamic-styles-container';
			document.body.appendChild(styleContainer);

			// Load the home styles
			const styleLinks = [
				'/main/css/bootstrap.min.css',
				'/main/css/animate.css',
				'/main/css/morris.css',
				'/main/css/font-awesome.min.css',
				'/main/css/icon-font.css',
				'/main/css/owl.carousel.min.css',
				'/main/css/owl.theme.default.min.css',
			];

			let loadedStyles = 0;
			const totalStyles = styleLinks.length;

			styleLinks.forEach((href) => {
				const link = document.createElement('link');
				link.rel = 'stylesheet';
				link.href = href;
				link.className = 'dynamic-style-link';
				link.onload = () => {
					loadedStyles++;
					if (loadedStyles === totalStyles) {
						setIsLoading(false);
					}
				};
				document.head.appendChild(link);
			});

			// Cleanup function to remove styles when component unmounts
			return () => {
				// Remove all dynamic style links
				document
					.querySelectorAll('.dynamic-style-link')
					.forEach((link) => link.remove());
				// Remove the style container
				styleContainer.remove();
			};
		} else {
			setIsLoading(false);
		}
	}, [pathname]);

	if (isLoading) {
		return (
			<div
				style={{
					position: 'fixed',
					top: 0,
					left: 0,
					width: '100%',
					height: '100%',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					backgroundColor: '#000000',
					zIndex: 9999,
				}}
			>
				<Loader />
			</div>
		);
	}

	return null;
}
