'use client';
import React, { useEffect, useRef } from 'react';

interface TradingViewWidgetProps {
	symbol: string; // e.g. 'NASDAQ:AAPL'
	interval: string; // TradingView interval code: '5', '15', '60', 'D'
}

// Loads TradingView's free embeddable widget script for the given symbol.
// This renders the chart purely client-side — it does NOT give you a price
// feed you can read from server code. For trade entry/exit prices you need
// a separate price API (see the note in chat below).
const TradingViewWidget = ({ symbol, interval }: TradingViewWidgetProps) => {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!containerRef.current) return;

		// Clear any previous widget before mounting a new one.
		containerRef.current.innerHTML = '';

		const script = document.createElement('script');
		script.src =
			'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
		script.type = 'text/javascript';
		script.async = true;
		script.innerHTML = JSON.stringify({
			autosize: true,
			symbol,
			interval,
			timezone: 'Etc/UTC',
			theme: 'dark',
			style: '1',
			locale: 'en',
			enable_publishing: false,
			hide_top_toolbar: true,
			hide_legend: true,
			save_image: false,
			backgroundColor: 'rgba(24, 24, 27, 1)', // zinc-900
			support_host: 'https://www.tradingview.com',
		});

		containerRef.current.appendChild(script);
	}, [symbol, interval]);

	return (
		<div className='h-[420px] w-full rounded-md border border-zinc-700 bg-zinc-900 overflow-hidden'>
			<div
				ref={containerRef}
				className='h-full w-full'
			/>
		</div>
	);
};

export default TradingViewWidget;
