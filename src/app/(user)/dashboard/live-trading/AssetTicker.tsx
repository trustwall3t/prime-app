'use client';
import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { Asset, AssetCategory } from '../../../../types';
import { FALLBACK_ICON } from '@/lib/assetLogos';

interface AssetTickerProps {
	assets: Asset[];
	selectedSymbol: string;
	onSelect: (asset: Asset) => void;
}

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

const AssetIcon = ({
	src,
	symbol,
}: {
	src: string;
	symbol: string;
}) => {
	const [iconSrc, setIconSrc] = useState(src);

	return (
		// eslint-disable-next-line @next/next/no-img-element
		<img
			src={iconSrc}
			alt={symbol}
			className='h-10 w-10 rounded-md object-contain bg-zinc-900'
			onError={() => {
				if (iconSrc !== FALLBACK_ICON) setIconSrc(FALLBACK_ICON);
			}}
		/>
	);
};

const AssetTicker = ({
	assets,
	selectedSymbol,
	onSelect,
}: AssetTickerProps) => {
	const [query, setQuery] = useState('');

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (!q) return assets;
		return assets.filter(
			(a) =>
				a.symbol.toLowerCase().includes(q) ||
				a.name.toLowerCase().includes(q),
		);
	}, [assets, query]);

	return (
		<div className='space-y-4'>
			<div className='relative'>
				<Search
					size={18}
					className='pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500'
				/>
				<input
					type='text'
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder='Search...'
					className='w-full rounded-md border border-zinc-700 bg-zinc-800 py-3 pl-11 pr-4 text-white placeholder-gray-500 outline-none focus:border-indigo-500'
				/>
			</div>

			<div className='flex gap-3 overflow-x-auto pb-1'>
				{filtered.map((asset) => {
					const isSelected = asset.symbol === selectedSymbol;
					const isUp = asset.changePercent >= 0;
					return (
						<button
							key={asset.symbol}
							type='button'
							onClick={() => onSelect(asset)}
							className={`flex w-28 shrink-0 flex-col items-center gap-2 rounded-md border p-4 transition ${
								isSelected
									? 'border-indigo-500 bg-zinc-800'
									: 'border-zinc-700 bg-zinc-800/60 hover:border-zinc-600'
							}`}
						>
							<AssetIcon
								src={asset.iconUrl}
								symbol={asset.symbol}
							/>
							<p className='text-sm font-bold text-white'>
								{asset.symbol}
							</p>
							<p className='text-xs text-gray-300'>
								{formatPrice(asset.price, asset.category)}
							</p>
							<p
								className={`text-xs font-medium ${
									isUp ? 'text-emerald-400' : 'text-red-400'
								}`}
							>
								{asset.price > 0 ? (
									<>
										{isUp ? '+' : ''}
										{asset.changePercent.toFixed(2)}%
									</>
								) : (
									'—'
								)}
							</p>
						</button>
					);
				})}
			</div>
		</div>
	);
};

export default AssetTicker;
