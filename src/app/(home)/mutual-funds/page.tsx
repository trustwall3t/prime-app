import React from 'react';
import Image from 'next/image';
const page = () => {
	return (
		<main>
			<div
				className='banner-area'
				id='banner-area'
				style={{
					backgroundImage: 'url(/main/images/banner/banner5.jpg)',
				}}
			>
				<div className='container'>
					<div className='row justify-content-center'>
						<div className='col'>
							<div className='banner-heading'>
								<h1 className='banner-title'>Mutual Funds</h1>
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
						<div className='col-lg-8'>
							<div className='service-content'>
								<div className='text-block mrb-40'>
									<p>
										Mutual funds are steadily making an
										entry into the household savings with an
										increased awareness about financial
										planning and higher efforts towards
										promoting mutual funds as an investment
										product. Further, the availability of a
										wide range of mutual fund schemes makes
										it easier for you to choose the mutual
										fund scheme to suit your financial
										goals. Moreover, with everything
										becoming more expensive, investment in
										traditional instruments might not live
										up to your expectations. This is where
										investments in mutual funds can be
										beneficial. Whatever your goals might
										be, there are mutual funds to help meet
										them.
									</p>
								</div>
								<div className='fw-single-image mrb-40'>
									<Image
										className='img-fluid'
										src='/main/images/services/mutualfunds1.jpg'
										alt='mutual funds'
										width={500}
										height={500}
									/>
								</div>
								<div className='text-block mrb-40'>
									<p>
										keystoneinvestmentslimited.org offers a
										broad range of investment strategies to
										fit within your asset allocation;
										including our proprietary quantitative
										factor strategies designed to
										efficiently capture excess returns and
										managing risk controls.
									</p>
									<p>
										A second className of property flipper
										also exists. These investors make their
										money by buying reasonably priced
										properties and adding value by
										renovating them. This can be a
										longer-term investment depending on the
										extent of the improvements. The limiting
										feature of this investment is that it is
										time intensive and often only allows
										investors to take on one or two
										properties at a time hence we try to
										avoid properties with high maintenance
										cost and focus more on properties with
										high undervalue&apos;
									</p>
								</div>
								<div className='heading'>
									<h3 className='content-title-medium'>
										WHY INVEST WITH TINKAN TRUST ASSET
										MANAGEMENT FUNDS&apos;{' '}
									</h3>
								</div>
								<div className='text-block'>
									<p>
										We believe investors should be
										compensated for the risks they take – in
										all market environments and any
										investment strategy. We purposely
										combine robust capital markets research,
										expert portfolio construction and
										comprehensive risk management to craft
										efficient solutions that deliver
										targeted outcomes.
									</p>
								</div>
							</div>
						</div>
						<div className='col-lg-4'>
							<div className='sidebar sidebar-right'>
								<div className='widget no-padding no-border'>
									<ul className='service-menu'>
										<li>
											<a href='mutual-funds'>
												Mutual Funds
											</a>
										</li>
										<li>
											<a href='real-estate'>
												Real Estate
											</a>
										</li>
										<li>
											<a href='retirement'>Retirement</a>
										</li>
										<li>
											<a href='infrastructure'>
												Infrastructure
											</a>
										</li>

										<li>
											<a href='agriculture'>
												Agriculture
											</a>
										</li>

										<li>
											<a href='commodities'>
												commodities
											</a>
										</li>
										<li>
											<a href='oil-and-gas'>Oil & Gas</a>
										</li>
									</ul>
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
