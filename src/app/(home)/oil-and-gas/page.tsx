import Image from 'next/image';
export default function SecurityOfFunds() {
	return (
		<main>
			<div
				className='banner-area'
				id='banner-area'
				style={{ backgroundImage: 'url(/main/images/banner/oil.jpg)' }}
			>
				<div className='container'>
					<div className='row justify-content-center'>
						<div className='col'>
							<div className='banner-heading'>
								<h1 className='banner-title'>Oil & Gas</h1>
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
										Tinkan Trust strives to be the community
										partner of choice as we develop oil and
										natural gas in a sustainable, innovative
										way. Tinkan Trust is focused on low-risk
										development opportunities in
										oil/liquids-rich zones in the
										well-established. Combined with the most
										rigorous regulatory standards, we
										believe that through our core values of
										Stewardship, Teamwork, Excellence,
										People, Growth and Resiliency, we
										represent the gold standard of oil and
										gas production in our nation and in the
										world. Our success is founded in our
										network of influential relationships,
										our presence paired with a deep local
										knowlegde, and our strength in technical
										and financial capabilities.
									</p>
								</div>
								<div className='fw-single-image mrb-40'>
									<Image
										className='img-fluid'
										src='images/services/oil1.jpg'
										alt=''
									/>
								</div>
								<div className='text-block mrb-40'>
									<p>
										As we expand our growth plans by
										extending our core areas, we are
										following proven strategic fundamentals.
										We seek a lower risk, multi-faceted
										value creation proposition through
										operational efficiency improvements and
										enhanced recovery potential. Our
										management team and board both share
										these commitments and direct our
										company&apos;s business plan and
										policies in a way that reflects our
										values in every angle of our operations.
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
}
