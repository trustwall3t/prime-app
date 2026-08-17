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
								<h1 className='banner-title'>
									Option Copy Trading
								</h1>
							</div>
						</div>
						{/* Col end */}
					</div>
					{/* Row end */}
				</div>
				{/* Container end */}
			</div>
			{/* Banner area end */}
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
										What Are Options?
									</h3>
									<p>
										Options are tradable contracts that
										investors use to speculate about whether
										an asset&apos;s price will be higher or
										lower at a certain date in the future,
										without any requirement to actually buy
										the asset in question.
										<br />
										<br />
										Nifty 50 options, for example, allow
										traders to speculate as to the future
										direction of this benchmark stock index,
										which is commonly understood as a
										stand-in for the entire Indian stock
										market.
										<br />
										<br />
										At first glance, options seem a little
										counterintuitive, but they&apos;re not
										as complicated as they appear. To
										understand options, you just need to
										know a few key terms:
									</p>
									<p>
										<strong>Derivative</strong> Options are
										what&apos;s known as a derivative,
										meaning that they derive their value
										from another asset. Take stock options,
										where the price of a given stock
										dictates the value of the option
										contract.
									</p>

									<p>
										<strong>
											Call option and put option
										</strong>{' '}
										A call option gives you the opportunity
										to buy a security at a predetermined
										price by a specified date while a put
										option allows you to sell a security at
										a future date and price. Strike price
										and expiration date. That predetermined
										price mentioned above is what&apos;s
										known as a strike price. Traders have
										until an option contract&apos;s
										expiration date to exercise the option
										at its strike price.
									</p>

									<p>
										<strong>Premium</strong> The price to
										purchase an option is called a premium,
										and it&apos;s calculated based on the
										underlying security&apos;s price and
										values.
									</p>

									<p>
										<strong>
											Intrinsic value and extrinsic value
										</strong>{' '}
										Intrinsic value is the difference
										between an option contract&apos;s strike
										price and current price of the
										underlying asset. Extrinsic value
										represents other factors outside of
										those considered in intrinsic value that
										affect the premium, like how long the
										option is good for.
									</p>

									<p>
										<strong>
											In-the-money and out-of-the-money
										</strong>{' '}
										Depending on the underlying
										security&apos;s price and the time
										remaining until expiration, an option is
										said to be in-the-money (profitable) or
										out-of-the-money (unprofitable).
									</p>
								</div>
								<div className='fw-single-image mrb-40'>
									<Image
										className='img-fluid'
										src='/main/images/services/knowledge.html'
										alt=''
									/>
								</div>
								<div className='text-block mrb-40'>
									<h3>How Options Pricing Works</h3>
									<p>
										Let&apos;s make sense of all of this
										terminology with an example. Consider a
										stock that&apos;s currently trading for
										INR 100 a share. Here&apos;s how the
										premiums—or the prices—function for
										different options based on the strike
										price.
									</p>
									<p>
										When trading options, you pay a premium
										up front, which then gives you the
										option to buy this hypothetical
										stock—call options —or sell the
										stock—put options—at the designated
										strike price by the expiration date.
										<br />
										<br />
										A lower strike price has more intrinsic
										value for call options since the options
										contract lets you buy the stock at a
										lower price than what it&apos;s trading
										for right now. If the stock&apos;s price
										remains INR 100, your call options are
										in-the-money, and you can buy the stock
										at a discount.
										<br />
										<br />
										Conversely, a higher strike price has
										more intrinsic value for put options
										because the contract allows you to sell
										the stock at a higher price than where
										it&apos;s trading currently. Your
										options are in-the-money if the stock
										stays at INR 100, but you have the right
										to sell it at a higher strike price, say
										INR 110.
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
