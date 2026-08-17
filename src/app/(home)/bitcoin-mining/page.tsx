import Image from 'next/image';
const Commodities = () => {
	return (
		<main>
			<div
				className='banner-area'
				id='banner-area'
				style={{
					backgroundImage:
						'url(https://image.cnbcfm.com/api/v1/image/106962761-1634667390508-Screen_Shot_2021-10-19_at_90550_AM.png)',
				}}
			>
				<div className='container'>
					<div className='row justify-content-center'>
						<div className='col'>
							<div className='banner-heading'>
								<h1 className='banner-title'>Bitcoin Mining</h1>
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
										Tinkan Trust operates
										Bitcoin blockchain computing centers
										around the world with in-house
										management, on-site repair and
										maintenance, while running on low-cost
										energy with long-term contracts.
										<br />
										In Tinkan Trust, As a
										part of our latest growth strategy, our
										miner upgrade will boost our hashrate
										from 6.5 EH/s to an impressive optional
										21 EH/s. Bitfarms&apos; strong balance sheet,
										state of the art mining facilities and
										low-cost power contracts have paved the
										way to improving our mining economics
										and lowering our costs prior to the
										Halving.
									</p>
								</div>
								<div className='fw-single-image mrb-40'>
									<Image
										src='https://image.cnbcfm.com/api/v1/image/106962761-1634667390508-Screen_Shot_2021-10-19_at_90550_AM.png?v=1695736192&amp;w=1920&amp;h=1080'
										alt=''
										className='img-fluid'
									/>
								</div>
								<div className='text-block mrb-40'>
									<p>
										We are a technology company that
										believes you need the right energy in
										your culture to power up your mining
										operations and scale to industry demand.
										Our culture is at the heart of what we
										do.
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

export default Commodities;
