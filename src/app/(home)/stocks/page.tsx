import React from 'react';
import Image from 'next/image';

const page = () => {
	return (
		<main>
			<div
				className='banner-area'
				id='banner-area'
				style={{
					backgroundImage: 'url(/main/images/banner/forex.jpg)',
				}}
			>
				<div className='container'>
					<div className='row justify-content-center'>
						<div className='col'>
							<div className='banner-heading'>
								<h1 className='banner-title'>Stocks</h1>
							</div>
						</div>
					</div>
				</div>
			</div>

			<section
				className='main-container'
				id='main-container'
			>
				<div className='container'>
					<div className='row'>
						<div className='col-lg-12'>
							<div className='service-content'>
								<div className='text-block mrb-40'>
									<h3 className='content-title-medium'>
										How Stock Trading Works
									</h3>
									<p>
										Stock trading is a form of investing
										that prioritizes short-term profits over
										long-term gains. It can be risky to dive
										in without the proper knowledge.
									</p>
									<h3>What is stock trading?</h3>
									<p>
										Stock trading involves buying and
										selling shares in companies in an effort
										to make money on daily changes in price.
										Traders watch the short-term price
										fluctuations of these stocks closely and
										then try to buy low and sell high.
										<br />
										<br />
										This short-term approach is what sets
										stock traders apart from traditional
										stock market investors who tend to be in
										it for the long haul. While trading
										individual stocks can bring quick gains
										for those who time the market correctly,
										it also carries the danger of
										substantial losses. A single company
										fortunes can rise more quickly than the
										market at large, but they can just as
										easily fall.
									</p>
									<h3>Types of stock trading</h3>
									<p>
										There are two main types of stock
										trading:
									</p>
									<p>
										<strong>Active trading</strong> is what
										an investor who places 10 or more trades
										per month does. Typically, they use a
										strategy that relies heavily on timing
										the market, trying to take advantage of
										short-term events (at the company level
										or based on market fluctuations) to turn
										a profit in the coming weeks or months.
									</p>

									<p>
										<strong>Day trading</strong> is the
										strategy employed by investors who play
										hot potato with stocks — buying, selling
										and closing their positions of the same
										stock in a single trading day, caring
										little about the inner workings of the
										underlying businesses. (Position refers
										to the amount of a particular stock or
										fund you own.) The aim of the day trader
										is to make a few bucks in the next few
										minutes, hours or days based on daily
										price fluctuations.
									</p>
								</div>
								<div className='fw-single-image mrb-40'>
									<Image
										className='img-fluid'
										src='/main/images/services/stock1.jpg'
										alt=''
									/>
								</div>
								<div className='text-block mrb-40'>
									<h3>Where to trade stocks</h3>
									<p>
										To trade stocks you need a broker, but
										don&apos;t just fall for any broker.
										Pick one with the terms and tools that
										best align with your investing style and
										experience. A higher priority for active
										traders will be low commissions and fast
										order execution for time-sensitive
										trades. See our picks for the best day
										trading apps to learn more.
										<br />
										<br />
										Investors who are new to trading should
										look for a broker who can teach them the
										tools of the trade via educational
										articles, online tutorials and in-person
										seminars (see NerdWallet&apos;s roundups
										for the best brokers for beginners).
										Other features to consider with stock
										trading apps are the quality and
										availability of screening and stock
										analysis tools, on-the-go alerts, easy
										order entry and customer service.
										<br />
										<br />
										No matter what, the time spent in
										learning the fundamentals of how to
										research stocks and experiencing the ups
										and downs of stock trading — even if
										there are more of the latter — is time
										well spent, as long as you&apos;re
										enjoying the ride and not putting any
										money you can&apos;t afford to lose on
										the line.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
};

export default page;
