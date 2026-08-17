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
								<h1 className='banner-title'>Forex Trading</h1>
							</div>
						</div>
						{/* Col end */}
					</div>
					{/* Row end */}
				</div>
				{/* Container end */}
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
										Forex Trading
									</h3>
									<p>
										The forex market (FX) is the
										world&apos;s largest decentralised
										financial market, with trading volumes
										exceeding $6.6 trillion a day*.
										That&apos;s more than most of the
										biggest stock markets combined. Trading
										24-hours a day, there&apos;s always an
										opportunity to buy or sell. Whether
										you&apos;re new to CFD trading or a
										seasoned trader, the FX market
										represents a way to take advantage of
										price movements in one of the most
										liquid assets. Start trading with some
										of the industry&apos;s lowest spreads
										today.
									</p>
									<h3>Forex spreads and currency pairs</h3>
									<p>
										Our spreads are some of the best in the
										market. We feed pricing directly to our
										platforms from our liquidity providers -
										no intervention or dealing desk
										required. Find spreads as low as 0.0
										pips on 14 major FX pairs when trading
										on our Razor account. We offer 60+
										currency pairs so you can take advantage
										of all of the world&apos;s major
										markets. See our full list of currency
										pairs and spreads.
									</p>
									<h3>Trading forex with us?</h3>
									<p>
										Once you start trading forex,
										you&apos;ll see why we&apos;re a market
										leader. We access multiple liquidity
										providers and external pricing sources
										to give you the best prices and
										competitive, low spreads when you
									</p>
								</div>
								<div className='fw-single-image mrb-40'>
									<Image
										className='img-fluid'
										src='/main/images/services/forex1.jpg'
										alt=''
										width={500}
										height={500}
									/>
								</div>
								<section className='mp-advantages-wrap text-left'>
									<div className='container'>
										<div className='row'>
											<div className='col-md-12'>
												<h2
													className='text-center  text-uppercase'
													data-aos='fade-up'
													data-aos-duration='1000'
												>
													Tabulated Currency Pairs
												</h2>
												<div
													className='nav-tabs-wrap'
													data-aos='fade-up'
													data-aos-duration='1000'
													data-aos-delay='1000'
												>
													<ul
														className='nav nav-tabs nav-tabs-new nav-tabs-3'
														style={{
															backgroundColor:
																'rgb(18, 51, 223)',
														}}
													>
														<li className='nav-item'>
															<a
																className='nav-link'
																data-toggle='tab'
																href='#tab-1'
															>
																FX\MAJORS
															</a>
														</li>
														<li className='nav-item'>
															<a
																className='nav-link'
																data-toggle='tab'
																href='#tab-2'
															>
																FX\MINORS
															</a>
														</li>
														<li className='nav-item'>
															<a
																className='nav-link active'
																data-toggle='tab'
																href='#tab-3'
															>
																FX\EXOTICS
															</a>
														</li>
													</ul>
													{/* Tab panes */}
													<div className='tab-content'>
														<div
															className='tab-pane fade in'
															id='tab-1'
														>
															<ul>
																<li>
																	<div className='text-bold'>
																		Instrument
																	</div>
																	<div className='text-bold'>
																		Spreads
																		in Pips
																	</div>
																	<div className='text-bold'>
																		Commission
																	</div>
																	<div className='text-bold'>
																		Leverage
																		(up to)
																	</div>
																</li>
																<li>
																	<div className='asset-name'>
																		<a
																			className='blue-text'
																			href='eur-usd.html'
																		>
																			EUR/USD
																		</a>
																	</div>
																	<div className='bid'>
																		Floating
																		from 0.3
																		Pips
																	</div>
																	<div className='ask'>
																		8$/lot
																	</div>
																	<div className='change'>
																		30
																	</div>
																</li>
																<li>
																	<div className='asset-name'>
																		<a
																			className='blue-text'
																			href='gbp-usd.html'
																		>
																			GBP/USD
																		</a>
																	</div>
																	<div className='bid'>
																		Floating
																		from 0.3
																		Pips
																	</div>
																	<div className='ask'>
																		8$/lot
																	</div>
																	<div className='change'>
																		30
																	</div>
																</li>
																<li>
																	<div className='asset-name'>
																		<a
																			className='blue-text'
																			href='usd-chf.html'
																		>
																			USD/CHF
																		</a>
																	</div>
																	<div className='bid'>
																		Floating
																		from 0.3
																		Pips
																	</div>
																	<div className='ask'>
																		8$/lot
																	</div>
																	<div className='change'>
																		30
																	</div>
																</li>
																<li>
																	<div className='asset-name'>
																		<a
																			className='blue-text'
																			href='usd-jpy.html'
																		>
																			USD/JPY
																		</a>
																	</div>
																	<div className='bid'>
																		Floating
																		from 0.3
																		Pips
																	</div>
																	<div className='ask'>
																		8$/lot
																	</div>
																	<div className='change'>
																		30
																	</div>
																</li>
																<li>
																	<div className='asset-name'>
																		<a
																			className='blue-text'
																			href='cad-chf.html'
																		>
																			CAD/CHF
																		</a>
																	</div>
																	<div className='bid'>
																		Floating
																		from 0.3
																		Pips
																	</div>
																	<div className='ask'>
																		8$/lot
																	</div>
																	<div className='change'>
																		30
																	</div>
																</li>
																<li>
																	<div className='asset-name'>
																		<a
																			className='blue-text'
																			href='cad-jpy.html'
																		>
																			CAD/JPY
																		</a>
																	</div>
																	<div className='bid'>
																		Floating
																		from 0.3
																		Pips
																	</div>
																	<div className='ask'>
																		8$/lot
																	</div>
																	<div className='change'>
																		30
																	</div>
																</li>
																<li>
																	<div className='asset-name'>
																		<a
																			className='blue-text'
																			href='usd-cad.html'
																		>
																			USD/CAD
																		</a>
																	</div>
																	<div className='bid'>
																		Floating
																		from 0.3
																		Pips
																	</div>
																	<div className='ask'>
																		8$/lot
																	</div>
																	<div className='change'>
																		30
																	</div>
																</li>
																<li>
																	<div className='asset-name'>
																		<a
																			className='blue-text'
																			href='chf-jpy.html'
																		>
																			CHF/JPY
																		</a>
																	</div>
																	<div className='bid'>
																		Floating
																		from 0.3
																		Pips
																	</div>
																	<div className='ask'>
																		8$/lot
																	</div>
																	<div className='change'>
																		30
																	</div>
																</li>
																<li>
																	<div className='asset-name'>
																		<a
																			className='blue-text'
																			href='eur-cad.html'
																		>
																			EUR/CAD
																		</a>
																	</div>
																	<div className='bid'>
																		Floating
																		from 0.3
																		Pips
																	</div>
																	<div className='ask'>
																		8$/lot
																	</div>
																	<div className='change'>
																		30
																	</div>
																</li>
																<li>
																	<div className='asset-name'>
																		<a
																			className='blue-text'
																			href='eur-chf.html'
																		>
																			EUR/CHF
																		</a>
																	</div>
																	<div className='bid'>
																		Floating
																		from 0.3
																		Pips
																	</div>
																	<div className='ask'>
																		8$/lot
																	</div>
																	<div className='change'>
																		30
																	</div>
																</li>
																<li>
																	<div className='asset-name'>
																		<a
																			className='blue-text'
																			href='eur-gbp.html'
																		>
																			EUR/GBP
																		</a>
																	</div>
																	<div className='bid'>
																		Floating
																		from 0.3
																		Pips
																	</div>
																	<div className='ask'>
																		8$/lot
																	</div>
																	<div className='change'>
																		30
																	</div>
																</li>
																<li>
																	<div className='asset-name'>
																		<a
																			className='blue-text'
																			href='eur-jpy.html'
																		>
																			EUR/JPY
																		</a>
																	</div>
																	<div className='bid'>
																		Floating
																		from 0.3
																		Pips
																	</div>
																	<div className='ask'>
																		8$/lot
																	</div>
																	<div className='change'>
																		30
																	</div>
																</li>
																<li>
																	<div className='asset-name'>
																		<a
																			className='blue-text'
																			href='gbp-cad.html'
																		>
																			GBP/CAD
																		</a>
																	</div>
																	<div className='bid'>
																		Floating
																		from 0.3
																		Pips
																	</div>
																	<div className='ask'>
																		8$/lot
																	</div>
																	<div className='change'>
																		30
																	</div>
																</li>
																<li>
																	<div className='asset-name'>
																		<a
																			className='blue-text'
																			href='gbp-chf.html'
																		>
																			GBP/CHF
																		</a>
																	</div>
																	<div className='bid'>
																		Floating
																		from 0.3
																		Pips
																	</div>
																	<div className='ask'>
																		8$/lot
																	</div>
																	<div className='change'>
																		30
																	</div>
																</li>
																<li>
																	<div className='asset-name'>
																		<a
																			className='blue-text'
																			href='gbp-jpy.html'
																		>
																			GBP/JPY
																		</a>
																	</div>
																	<div className='bid'>
																		Floating
																		from 0.3
																		Pips
																	</div>
																	<div className='ask'>
																		8$/lot
																	</div>
																	<div className='change'>
																		30
																	</div>
																</li>
															</ul>
														</div>
														<div
															className='tab-pane fade'
															id='tab-2'
														>
															<ul>
																<li>
																	<div className='text-bold'>
																		Instrument
																	</div>
																	<div className='text-bold'>
																		Spreads
																		in Pips
																	</div>
																	<div className='text-bold'>
																		Commission
																	</div>
																	<div className='text-bold'>
																		Leverage
																		(up to)
																	</div>
																</li>
																<li>
																	<div className='asset-name'>
																		<a
																			className='blue-text'
																			href='aud-cad.html'
																		>
																			AUD/CAD
																		</a>
																	</div>
																	<div className='bid'>
																		Floating
																		from 0.5
																		Pips
																	</div>
																	<div className='ask'>
																		8$/lot
																	</div>
																	<div className='change'>
																		20
																	</div>
																</li>
																<li>
																	<div className='asset-name'>
																		<a
																			className='blue-text'
																			href='aud-chf.html'
																		>
																			AUD/CHF
																		</a>
																	</div>
																	<div className='bid'>
																		Floating
																		from 0.5
																		Pips
																	</div>
																	<div className='ask'>
																		8$/lot
																	</div>
																	<div className='change'>
																		20
																	</div>
																</li>
																<li>
																	<div className='asset-name'>
																		<a
																			className='blue-text'
																			href='aud-jpy.html'
																		>
																			AUD/JPY
																		</a>
																	</div>
																	<div className='bid'>
																		Floating
																		from 0.5
																		Pips
																	</div>
																	<div className='ask'>
																		8$/lot
																	</div>
																	<div className='change'>
																		20
																	</div>
																</li>
																<li>
																	<div className='asset-name'>
																		<a
																			className='blue-text'
																			href='aud-nzd.html'
																		>
																			AUD/NZD
																		</a>
																	</div>
																	<div className='bid'>
																		Floating
																		from 0.5
																		Pips
																	</div>
																	<div className='ask'>
																		8$/lot
																	</div>
																	<div className='change'>
																		20
																	</div>
																</li>
																<li>
																	<div className='asset-name'>
																		<a
																			className='blue-text'
																			href='aud-usd.html'
																		>
																			AUD/USD
																		</a>
																	</div>
																	<div className='bid'>
																		Floating
																		from 0.5
																		Pips
																	</div>
																	<div className='ask'>
																		8$/lot
																	</div>
																	<div className='change'>
																		20
																	</div>
																</li>
																<li>
																	<div className='asset-name'>
																		<a
																			className='blue-text'
																			href='eur-aud.html'
																		>
																			EUR/AUD
																		</a>
																	</div>
																	<div className='bid'>
																		Floating
																		from 0.5
																		pips
																	</div>
																	<div className='ask'>
																		8$/lot
																	</div>
																	<div className='change'>
																		20
																	</div>
																</li>
																<li>
																	<div className='asset-name'>
																		<a
																			className='blue-text'
																			href='eur-nzd.html'
																		>
																			EUR/NZD
																		</a>
																	</div>
																	<div className='bid'>
																		Floating
																		from 0.5
																		Pips
																	</div>
																	<div className='ask'>
																		8$/lot
																	</div>
																	<div className='change'>
																		20
																	</div>
																</li>
																<li>
																	<div className='asset-name'>
																		<a
																			className='blue-text'
																			href='gbp-aud.html'
																		>
																			GBP/AUD
																		</a>
																	</div>
																	<div className='bid'>
																		Floating
																		from 0.5
																		Pips
																	</div>
																	<div className='ask'>
																		8$/lot
																	</div>
																	<div className='change'>
																		20
																	</div>
																</li>
																<li>
																	<div className='asset-name'>
																		<a
																			className='blue-text'
																			href='gbp-nzd.html'
																		>
																			GBP/NZD
																		</a>
																	</div>
																	<div className='bid'>
																		Floating
																		from 0.5
																		Pips
																	</div>
																	<div className='ask'>
																		8$/lot
																	</div>
																	<div className='change'>
																		20
																	</div>
																</li>
																<li>
																	<div className='asset-name'>
																		<a
																			className='blue-text'
																			href='nzd-cad.html'
																		>
																			NZD/CAD
																		</a>
																	</div>
																	<div className='bid'>
																		Floating
																		from 0.5
																		Pips
																	</div>
																	<div className='ask'>
																		8$/lot
																	</div>
																	<div className='change'>
																		20
																	</div>
																</li>
																<li>
																	<div className='asset-name'>
																		<a
																			className='blue-text'
																			href='nzd-chf.html'
																		>
																			NZD/CHF
																		</a>
																	</div>
																	<div className='bid'>
																		Floating
																		from 0.5
																		Pips
																	</div>
																	<div className='ask'>
																		8$/lot
																	</div>
																	<div className='change'>
																		20
																	</div>
																</li>
																<li>
																	<div className='asset-name'>
																		<a
																			className='blue-text'
																			href='nzd-jpy.html'
																		>
																			NZD/JPY
																		</a>
																	</div>
																	<div className='bid'>
																		Floating
																		from 0.5
																		Pips
																	</div>
																	<div className='ask'>
																		8$/lot
																	</div>
																	<div className='change'>
																		20
																	</div>
																</li>
																<li>
																	<div className='asset-name'>
																		<a
																			className='blue-text'
																			href='nzd-usd.html'
																		>
																			NZD/USD
																		</a>
																	</div>
																	<div className='bid'>
																		Floating
																		from 0.5
																		Pips
																	</div>
																	<div className='ask'>
																		8$/lot
																	</div>
																	<div className='change'>
																		20
																	</div>
																</li>
															</ul>
														</div>
														<div
															className='tab-pane fade active show'
															id='tab-3'
														>
															<ul>
																<li>
																	<div className='text-bold'>
																		Instrument
																	</div>
																	<div className='text-bold'>
																		Spreads
																		in Pips
																	</div>
																	<div className='text-bold'>
																		Commission
																	</div>
																	<div className='text-bold'>
																		Leverage
																		(up to)
																	</div>
																</li>
																<li>
																	<div className='asset-name'>
																		<a
																			className='blue-text'
																			href='eur-nok.html'
																		>
																			EUR/NOK
																		</a>
																	</div>
																	<div className='bid'>
																		Floating
																		from 1.9
																		Pips
																	</div>
																	<div className='ask'>
																		8$/lot
																	</div>
																	<div className='change'>
																		20
																	</div>
																</li>
																<li>
																	<div className='asset-name'>
																		<a
																			className='blue-text'
																			href='eur-pln.html'
																		>
																			EUR/PLN
																		</a>
																	</div>
																	<div className='bid'>
																		Floating
																		from 1.9
																		Pips
																	</div>
																	<div className='ask'>
																		8$/lot
																	</div>
																	<div className='change'>
																		20
																	</div>
																</li>
																<li>
																	<div className='asset-name'>
																		<a
																			className='blue-text'
																			href='eur-sek.html'
																		>
																			EUR/SEK
																		</a>
																	</div>
																	<div className='bid'>
																		Floating
																		from 1.9
																		Pips
																	</div>
																	<div className='ask'>
																		8$/lot
																	</div>
																	<div className='change'>
																		20
																	</div>
																</li>
																<li>
																	<div className='asset-name'>
																		<a
																			className='blue-text'
																			href='eur-try.html'
																		>
																			EUR/TRY
																		</a>
																	</div>
																	<div className='bid'>
																		Floating
																		from 1.9
																		Pips
																	</div>
																	<div className='ask'>
																		8$/lot
																	</div>
																	<div className='change'>
																		20
																	</div>
																</li>
																<li>
																	<div className='asset-name'>
																		<a
																			className='blue-text'
																			href='usd-dkk.html'
																		>
																			USD/DKK
																		</a>
																	</div>
																	<div className='bid'>
																		Floating
																		from 1.9
																		Pips
																	</div>
																	<div className='ask'>
																		8$/lot
																	</div>
																	<div className='change'>
																		20
																	</div>
																</li>
																<li>
																	<div className='asset-name'>
																		<a
																			className='blue-text'
																			href='usd-huf.html'
																		>
																			USD/HUF
																		</a>
																	</div>
																	<div className='bid'>
																		Floating
																		from 1.9
																		Pips
																	</div>
																	<div className='ask'>
																		8$/lot
																	</div>
																	<div className='change'>
																		20
																	</div>
																</li>
																<li>
																	<div className='asset-name'>
																		<a
																			className='blue-text'
																			href='usd-nok.html'
																		>
																			USD/NOK
																		</a>
																	</div>
																	<div className='bid'>
																		Floating
																		from 1.9
																		Pips
																	</div>
																	<div className='ask'>
																		8$/lot
																	</div>
																	<div className='change'>
																		20
																	</div>
																</li>
																<li>
																	<div className='asset-name'>
																		<a
																			className='blue-text'
																			href='usd-pln.html'
																		>
																			USD/PLN
																		</a>
																	</div>
																	<div className='bid'>
																		Floating
																		from 1.9
																		Pips
																	</div>
																	<div className='ask'>
																		8$/lot
																	</div>
																	<div className='change'>
																		20
																	</div>
																</li>
																<li>
																	<div className='asset-name'>
																		<a
																			className='blue-text'
																			href='usd-sek.html'
																		>
																			USD/SEK
																		</a>
																	</div>
																	<div className='bid'>
																		Floating
																		from 1.9
																		Pips
																	</div>
																	<div className='ask'>
																		8$/lot
																	</div>
																	<div className='change'>
																		20
																	</div>
																</li>
																<li>
																	<div className='asset-name'>
																		<a
																			className='blue-text'
																			href='usd-sgd.html'
																		>
																			USD/SGD
																		</a>
																	</div>
																	<div className='bid'>
																		Floating
																		from 1.9
																		Pips
																	</div>
																	<div className='ask'>
																		8$/lot
																	</div>
																	<div className='change'>
																		20
																	</div>
																</li>
																<li>
																	<div className='asset-name'>
																		<a
																			className='blue-text'
																			href='usd-try.html'
																		>
																			USD/TRY
																		</a>
																	</div>
																	<div className='bid'>
																		Floating
																		from 1.9
																		Pips
																	</div>
																	<div className='ask'>
																		8$/lot
																	</div>
																	<div className='change'>
																		20
																	</div>
																</li>
																<li>
																	<div className='asset-name'>
																		<a
																			className='blue-text'
																			href='usd-zar.html'
																		>
																			USD/ZAR
																		</a>
																	</div>
																	<div className='bid'>
																		Floating
																		from 1.9
																		Pips
																	</div>
																	<div className='ask'>
																		8$/lot
																	</div>
																	<div className='change'>
																		20
																	</div>
																</li>
															</ul>
														</div>
													</div>
												</div>
												<div className='mp-advantages mt-5'>
													<ul className='list-unstyled mp-trades-list mb-0'>
														<li
															data-aos='fade-up'
															data-aos-delay='100'
															data-aos-duration='1000'
														>
															<i className='fa fa-check'></i>
															Regulated and
															Licensed by MFSA
															under MIFID
															directive
														</li>
														<li
															data-aos='fade-up'
															data-aos-delay='700'
															data-aos-duration='1000'
														>
															<i className='fa fa-check'></i>
															Leverage up to 1:100
															for professional
															traders
														</li>
														<li
															data-aos='fade-up'
															data-aos-delay='1400'
															data-aos-duration='1000'
														>
															<i className='fa fa-check'></i>
															Cryptocurrencies
															available for
															trading
														</li>
														<li
															data-aos='fade-up'
															data-aos-delay='2100'
															data-aos-duration='1000'
														>
															<i className='fa fa-check'></i>
															Stock and indices
															also available for
															trading
														</li>
													</ul>
												</div>
											</div>
										</div>
									</div>
								</section>
							</div>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
};

export default page;
