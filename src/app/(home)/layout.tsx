'use client';
import { usePathname } from 'next/navigation';
import Script from 'next/script';
import Head from 'next/head';

// Import CSS files
import '@/styles/bootstrap.min.css';
import '@/styles/animate.css';
import '@/styles/morris.css';
import '@/styles/font-awesome.min.css';
import '@/styles/icon-font.css';
import '@/styles/owl.carousel.min.css';
import '@/styles/owl.theme.default.min.css';
import '@/styles/colorbox.css';
import '@/styles/style.css';
import '@/styles/custom.css';
import '@/styles/responsive.css';

export default function HomeLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();
	const isPublicRoute =
		!pathname?.includes('admin') &&
		!pathname?.includes('dashboard') &&
		!pathname?.includes('auth');

	return (
		<>
			{isPublicRoute && (
				<Head>
					<meta charSet='utf-8' />
					<title>TINKAN TRUST</title>
					<meta
						httpEquiv='X-UA-Compatible'
						content='IE=edge'
					/>
					<meta
						name='viewport'
						content='width=1024'
					/>
					<link
						rel='canonical'
						href='https://tinkantrust.com'
					/>
					<meta
						property='og:locale'
						content='en_US'
					/>
					<meta
						property='og:type'
						content='website'
					/>
					<meta
						property='og:title'
						content='TINKAN TRUST - Regulated Broker in Copy Trading, Trade with Zero Spreads'
					/>
					<meta
						property='og:description'
						content='We continually extend our incomparable services to every country in the best and most suitable fashion. Let&#039;s be your go-to for investments'
					/>
					<meta
						property='og:url'
						content='keystoneinvestmentslimited.org'
					/>
					<meta
						property='og:site_name'
						content='keystoneinvestmentslimited.org Investment Services'
					/>
					<meta
						property='article:modified_time'
						content='2021-12-20T11:08:55+00:00'
					/>
					<meta
						property='og:image'
						content='images/features/feature1.jpg'
					/>
					<link
						href='../favicon.ico'
						rel='shortcut icon'
						type='image/x-icon'
					/>
					<link
						href='../favicon.ico'
						rel='apple-touch-icon'
					/>
				</Head>
			)}
	
				{children}
	
			{isPublicRoute && (
				<>
					<Script
						src='/main/js/jquery.js'
						strategy='afterInteractive'
					/>
					<Script
						src='/main/js/popper.min.js'
						strategy='afterInteractive'
					/>
					<Script
						src='/main/js/bootstrap.min.js'
						strategy='afterInteractive'
					/>
					<Script
						src='/main/js/owl.carousel.min.js'
						strategy='lazyOnload'
					/>
					<Script
						src='/main/js/jquery.counterup.min.js'
						strategy='lazyOnload'
					/>
					<Script
						src='/main/js/waypoints.min.js'
						strategy='lazyOnload'
					/>
					<Script
						src='/main/js/jquery.colorbox.js'
						strategy='lazyOnload'
					/>
					<Script
						src='/main/js/smoothscroll.js'
						strategy='lazyOnload'
					/>
					<Script
						src='http://maps.googleapis.com/maps/api/js?key=AIzaSyCsa2Mi2HqyEcEnM1urFSIGEpvualYjwwM'
						strategy='lazyOnload'
					/>
					<Script
						src='/main/js/gmap3.js'
						strategy='lazyOnload'
					/>
					<Script
						src='/main/js/custom.js'
						strategy='lazyOnload'
					/>
					<Script
						src='/main/js/recent.js'
						strategy='lazyOnload'
					/>
				</>
			)}
		</>
	);
}
