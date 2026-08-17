import Image from 'next/image';

const Agriculture = () => {
	return (
		<main>
			<div
				className='banner-area'
				id='banner-area'
				style={{
					backgroundImage: 'url(/main/images/banner/agriculture.jpg)',
				}}
			>
				<div className='container'>
					<div className='row justify-content-center'>
						<div className='col'>
							<div className='banner-heading'>
								<h1 className='banner-title'>Agriculture</h1>
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
										Our team of agricultural specialists
										understand that different types of
										farming often have different needs. Our
										in-depth knowlegde of the sector can
										help you to overcome the daily challenge
										of improving efficiency to maximise
										potential growth.
									</p>
									<p>
										As well as the vast range of new
										machinery and technology available,
										investment in biomass to create reusable
										energy can reduce financial costs and,
										in some instances, even provide a source
										of additional income.
									</p>
								</div>
								<div className='fw-single-image mrb-40'>
									<Image
										className='img-fluid'
										src='/main/images/services/agriculture1.jpg'
										alt='hello'
									/>
								</div>
								<div className='text-block mrb-40'>
									<p>
										Whether you need new equipment to
										improve productivity or are looking to
										restructure your finances to improve
										cashflow, our range of financial
										products, including hire purchase, lease
										and equity release, can be tailored to
										meet your needs within appropriate,
										manageable timescales.
									</p>
								</div>
								<div className='heading'>
									<h3 className='content-title-medium'>
										TYPES OF ASSETS WE CAN FINANCE{' '}
									</h3>
								</div>
								<div className='text-block'>
									<ul className='ts-list'>
										<li>Balers</li>
										<li>Biomass boilers</li>
										<li>Combine harvesters</li>
										<li>Farm vehicles</li>
										<li>Forestry machinery</li>
										<li>Ground maintenance equipment</li>
										<li>Ploughs</li>
										<li>Tractors</li>
										<li>And many more!</li>
									</ul>
								</div>
							</div>
						</div>
						<div className='col-lg-4'>
							<div className='sidebar sidebar-right'>
								<div className='widget no-padding no-border'>
									<ul className='service-menu'>
										<li>
											<a href='mutual-funds.html'>
												Mutual Funds
											</a>
										</li>
										<li>
											<a href='real-estate.html'>
												Real Estate
											</a>
										</li>
										<li>
											<a href='retirement.html'>
												Retirement
											</a>
										</li>
										<li>
											<a href='infrastructure.html'>
												Infrastructure
											</a>
										</li>

										<li>
											<a href='agriculture.html'>
												Agriculture
											</a>
										</li>

										<li>
											<a href='commodities.html'>
												commodities
											</a>
										</li>
										<li>
											<a href='oil-and-gas.html'>
												Oil & Gas
											</a>
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

export default Agriculture;
