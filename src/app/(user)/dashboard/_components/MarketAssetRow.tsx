'use client';

import React, { useId, useState } from 'react';
import type { Asset, AssetCategory } from '@/types';
import { FALLBACK_ICON } from '@/lib/assetLogos';
import { cn } from '@/lib/utils';

function formatPrice(price: number, category: AssetCategory): string {
	if (!price || price <= 0) return '—';

	if (category === 'crypto') {
		if (price >= 1000) {
			return price.toLocaleString(undefined, {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2,
			});
		}
		if (price >= 1) return price.toFixed(2);
		if (price >= 0.01) return price.toFixed(4);
		return price.toFixed(6);
	}

	return price.toLocaleString(undefined, {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
}

function sparklinePath(positive: boolean): string {
	const points = positive
		? '50,200 150,130 250,170 350,100 450,50 550,120 650,90 750,180 850,130 950,220 1050,160 1150,190'
		: '50,100 150,170 250,150 350,200 450,250 550,220 650,280 750,240 850,260 950,230 1050,270 1150,250';
	return `M ${points.replace(/ /g, ' L ')} L 1150,300 L 50,300 Z`;
}

function sparklineLine(positive: boolean): string {
	return positive
		? '50,200 150,130 250,170 350,100 450,50 550,120 650,90 750,180 850,130 950,220 1050,160 1150,190'
		: '50,100 150,170 250,150 350,200 450,250 550,220 650,280 750,240 850,260 950,230 1050,270 1150,250';
}

function MiniSparkline({
	positive,
	className,
}: {
	positive: boolean;
	className?: string;
}) {
	const gradientId = useId();
	const stroke = positive ? '#34d399' : '#f87171';

	return (
		<svg
			viewBox='0 0 1200 300'
			className={cn('h-8 w-full', className)}
			preserveAspectRatio='none'
			aria-hidden
		>
			<defs>
				<linearGradient id={gradientId} x1='0' y1='0' x2='0' y2='1'>
					<stop offset='0%' stopColor={stroke} stopOpacity='0.35' />
					<stop offset='100%' stopColor={stroke} stopOpacity='0' />
				</linearGradient>
			</defs>
			<path d={sparklinePath(positive)} fill={`url(#${gradientId})`} />
			<polyline
				points={sparklineLine(positive)}
				fill='none'
				stroke={stroke}
				strokeWidth='2.5'
				strokeLinecap='round'
				strokeLinejoin='round'
				vectorEffect='non-scaling-stroke'
			/>
		</svg>
	);
}

function ChangeBadge({
	changePercent,
	hasPrice,
	compact = false,
}: {
	changePercent: number;
	hasPrice: boolean;
	compact?: boolean;
}) {
	if (!hasPrice) {
		return (
			<span
				className={cn(
					'inline-flex items-center justify-center rounded-md bg-zinc-800 font-medium tabular-nums text-zinc-500',
					compact ? 'min-w-[3.75rem] px-1.5 py-0.5 text-[11px]' : 'min-w-[4.5rem] px-2 py-1 text-xs',
				)}
			>
				—
			</span>
		);
	}

	const positive = changePercent >= 0;

	return (
		<span
			className={cn(
				'inline-flex items-center justify-center rounded-md font-semibold tabular-nums',
				compact ? 'min-w-[3.75rem] px-1.5 py-0.5 text-[11px]' : 'min-w-[4.5rem] px-2 py-1 text-xs',
				positive
					? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20'
					: 'bg-red-500/10 text-red-400 ring-1 ring-red-500/20',
			)}
		>
			{positive ? '+' : ''}
			{changePercent.toFixed(2)}%
		</span>
	);
}

function AssetIdentity({
	asset,
	rank,
	iconSrc,
	onIconError,
}: {
	asset: Asset;
	rank?: number;
	iconSrc: string;
	onIconError: () => void;
}) {
	return (
		<div className='flex min-w-0 items-center gap-2.5'>
			{rank != null && (
				<span className='w-4 shrink-0 text-center text-[11px] font-medium tabular-nums text-zinc-600'>
					{rank}
				</span>
			)}
			{/* eslint-disable-next-line @next/next/no-img-element */}
			<img
				src={iconSrc}
				alt={asset.symbol}
				width={36}
				height={36}
				className='h-9 w-9 shrink-0 rounded-full bg-zinc-950 object-contain ring-1 ring-zinc-700/80'
				onError={onIconError}
			/>
			<div className='min-w-0'>
				<div className='flex flex-wrap items-center gap-1.5'>
					<p className='text-sm font-semibold text-white'>{asset.symbol}</p>
					<span className='rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-zinc-500'>
						{asset.category === 'crypto' ? 'Crypto' : 'Stock'}
					</span>
				</div>
				<p className='truncate text-xs text-zinc-500'>{asset.name}</p>
			</div>
		</div>
	);
}

type MarketAssetRowProps = {
	asset: Asset;
	rank?: number;
};

export default function MarketAssetRow({ asset, rank }: MarketAssetRowProps) {
	const [iconSrc, setIconSrc] = useState(asset.iconUrl);
	const positive = asset.changePercent >= 0;
	const hasPrice = asset.price > 0;
	const formattedPrice = formatPrice(asset.price, asset.category);

	const handleIconError = () => {
		if (iconSrc !== FALLBACK_ICON) setIconSrc(FALLBACK_ICON);
	};

	return (
		<div className='group border-b border-zinc-800/70 px-4 py-3.5 transition-colors last:border-b-0 hover:bg-zinc-800/35 sm:px-5'>
			<div className='grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-3 gap-y-2.5 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_88px] sm:items-center sm:gap-x-4 sm:gap-y-0'>
				<AssetIdentity
					asset={asset}
					rank={rank}
					iconSrc={iconSrc}
					onIconError={handleIconError}
				/>

				<div className='flex flex-col items-end gap-1 sm:hidden'>
					<p className='text-sm font-semibold tabular-nums text-white'>
						{hasPrice ? `$${formattedPrice}` : '—'}
					</p>
					<ChangeBadge
						changePercent={asset.changePercent}
						hasPrice={hasPrice}
						compact
					/>
				</div>

				<p className='hidden text-right text-sm font-medium tabular-nums text-white sm:block'>
					{hasPrice ? `$${formattedPrice}` : '—'}
				</p>

				<div className='hidden justify-end sm:flex'>
					<ChangeBadge changePercent={asset.changePercent} hasPrice={hasPrice} />
				</div>

				<div className='col-span-2 opacity-90 sm:col-span-1 sm:opacity-80 sm:transition-opacity sm:group-hover:opacity-100'>
					<MiniSparkline positive={positive} />
				</div>
			</div>
		</div>
	);
}
