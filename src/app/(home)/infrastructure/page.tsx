import React from 'react';
import Image from 'next/image';
const page = () => {
	return (
		<main>
			<div
				className='banner-area'
				id='banner-area'
				style={{
					backgroundImage:
						'url(/main/images/banner/infrastructure.jpg)',
				}}
			>
				<div className='container'>
					<div className='row justify-content-center'>
						<div className='col'>
							<div className='banner-heading'>
								<h1 className='banner-title'>Infrastructure</h1>
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
										Our mission is to be an infrastructure
										partner of choice by making and managing
										investments which have historically
										shown to deliver consistently attractive
										results to clients through the passion
										of our people, depth or our experience
										and strength of our global
										relationships. We specialise by sector
										and seek out the right deals. We have a
										solid track record across market cycles
										using a disciplined investment process,
										focused on delivering long-term value
										and capital preservation within
										sustainable robust capital structures.
										We have one objective, to deliver
										predictable outcomes for our clients.
									</p>
								</div>
								<div className='fw-single-image mrb-40'>
									<Image
										className='img-fluid'
										src='/main/images/services/infrastructure1.jpg'
										alt='infrastructure'
										width={500}
										height={500}
									/>
								</div>
								<div className='heading'>
									<h3 className='content-title-medium'>
										Why infrastructure?{' '}
									</h3>
								</div>
								<div className='text-block'>
									<p>
										Infrastructure assets provide essential
										services that support economic growth,
										generate productivity and underpin the
										operation of society, such as airports,
										schools, energy, transport and
										communications.
									</p>
									<p>
										It also has characteristics that can
										benefit investors, such as steady
										returns through market cycles with lower
										volatility, stable long-term yields and
										diversification.
									</p>
									<div className='heading mrb-20'>
										<h4 className='list-column-title'>
											Stable, experienced sector centric
											team
										</h4>
									</div>
									<p>
										over 55 experienced infrastructure
										professionals located in USA , Canada
										and UK. Our stable team is led by
										founding partners.
									</p>

									<div className='heading mrb-20'>
										<h4 className='list-column-title'>
											&apos;Active-Core&apos; strategy
										</h4>
									</div>
									<p>
										We identify relative value across core
										assets. Our deep sector focus drives
										value.
									</p>

									<div className='heading mrb-20'>
										<h4 className='list-column-title'>
											Active asset management
										</h4>
									</div>
									<p>
										Value driven from active management,
										stakeholder engagement and selecting
										appropriate internal management teams.
										We create value through leadership
										positions of control or strong
										influence.
									</p>

									<div className='heading mrb-20'>
										<h4 className='list-column-title'>
											Focused origination drives quality
											pipeline
										</h4>
									</div>
									<p>
										Our targeted approach aims to deliver
										more than 210 opportunities each year.
										We pursue opportunities where there is
										the ability to differentiate.
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
								</div>{' '}
							</div>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
};

export default page;
