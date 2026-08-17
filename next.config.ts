import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	compress: true,
	poweredByHeader: false,
	reactStrictMode: true,
	images: {
		formats: ['image/avif', 'image/webp'],
		minimumCacheTTL: 60 * 60 * 24,
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'trustochain.com',
			},
			{
				protocol: 'https',
				hostname: 'res.cloudinary.com',
			},
			{
				protocol: 'https',
				hostname: 'financialmodelingprep.com',
			},
			{
				protocol: 'https',
				hostname: 'cdn.jsdelivr.net',
			},
			{
				protocol: 'https',
				hostname: 'assets.coingecko.com',
			},
			{
				protocol: 'https',
				hostname: 'coin-images.coingecko.com',
			},
		],
	},
	experimental: {
		optimizePackageImports: [
			'lucide-react',
			'recharts',
			'@radix-ui/react-dialog',
			'@radix-ui/react-select',
			'@radix-ui/react-tabs',
			'@radix-ui/react-tooltip',
			'@radix-ui/react-menubar',
			'@radix-ui/react-checkbox',
		],
	},
};

export default nextConfig;
