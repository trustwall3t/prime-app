import Image from 'next/image';
import Link from 'next/link';

const Home = () => {
	return (
		<main>
			<div
				style={{ position: 'relative' }}
				className='video-container'
			>
				<Image
					className='img-fluid'
					src='/main/images/slider/bgt.jpg'
					alt='Background'
					fill
					style={{ objectFit: 'cover' }}
				/>
				<div
					className='slider-content text-left'
					style={{
						position: 'absolute',
						zIndex: 2,
						top: '35%',
						left: '10%',
					}}
				>
					<div className='col-md-12'>
						<h2 className='slide-title title-light'>
							Your future is created by
						</h2>
						<h3 className='slide-sub-title'>What you do today</h3>
						<p className='slider-description lead'>
							Mirror an expert and grow value and knowledge
							through copy trading, wide range of trading offers,
							Options trading, stocks, derivatives, currency
							pairs...
						</p>
						<p>
							<Link
								href='/auth/login'
								className='slider btn btn-primary'
							>
								Sign In
							</Link>
							<Link
								href='/auth/signup'
								className='slider btn btn-border'
							>
								Sign Up
							</Link>
						</p>
					</div>
				</div>
			</div>

			<div className='about-pattern'>
				<div className='container'>
					<div className='row'>
						<div className='col-lg-6 about-desc'>
							<br />
							<br />
							<br />
							<h2 className='column-title title-small'>
								<span>About us</span>Different kinds of
								Financial firm
							</h2>
							
							<p>
								Fortunetrustmarket profitable and Trusted
								investment program, established by a strong team
								of highly skilled traders and investment
								consultants in the offline and online investment
								market.{' '}
							</p>
							<p>
								We put your investments in new highly
								remunerative innovative projects, which offers
								great returns along. Today our company has a
								professional team to develop a business.
							</p>
							<p>
								{' '}
								We know how much, where and when to put your
								investments. And we know how to achieve maximum
								income. We are constantly diversifying our
								investment portfolio and building stronger
								connections worldwide.
							</p>
							<div className='gap-15'></div>
						</div>

						<div className='col-lg-6 text-md-center mrt-40'>
							<Image
								className='img-fluid'
								src='/main/images/intro-video.jpg'
								width={500}
								height={500}
								alt='intro video'
							/>
						</div>
					</div>
				</div>
			</div>

			<section className='ts-features no-padding'>
				<div className='container-fluid'>
					<div className='row'>
						<div
							className='col-lg-4 feature-box1'
							style={{
								backgroundImage:
									'url(/main/images/features/feature1.jpg)',
							}}
						>
							<div className='ts-feature text-center'>
								<div className='ts-feature-info'>
									<i className='icon icon-consut2'></i>
									<h3 className='ts-feature-title'>
										Best Consulting
									</h3>
									<p>
										Mutual funds pool money from many
										investors to purchase broad range of
										investments, such as stocks. You have
										ideas, goals, and dreams.
									</p>
								</div>
							</div>
						</div>

						<div
							className='col-lg-4 feature-box2'
							style={{
								backgroundImage:
									'url(/main/images/features/feature2.jpg)',
							}}
						>
							<div className='ts-feature text-center'>
								<div className='ts-feature-info'>
									<i className='icon icon-chart2'></i>
									<h3 className='ts-feature-title'>
										Marketing growth
									</h3>
									<p>
										Mutual funds pool money from many
										investors to purchase broad range of
										investments, such as stocks. You have
										ideas, goals, and dreams.
									</p>
								</div>
							</div>
						</div>

						<div
							className='col-lg-4 feature-box3'
							style={{
								backgroundImage:
									'url(/main/images/features/feature3.jpg)',
							}}
						>
							<div className='ts-feature text-center'>
								<div className='ts-feature-info'>
									<i className='icon icon-clock3'></i>
									<h3 className='ts-feature-title'>
										On time services
									</h3>
									<p>
										Mutual funds pool money from many
										investors to purchase broad range of
										investments, such as stocks. You have
										ideas, goals, and dreams.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
			<div
				className='row'
				style={{ backgroundColor: '#090e1c', margin: '50px 0' }}
			>
				<div
					className='col-md-6'
					style={{ color: 'white' }}
				>
					<Image
						src='/main/images/forex_trade.jpg'
						width={1000}
						height={500}
						style={{ width: '100%' }}
						alt='forex trade'
					/>
					<div style={{ margin: '10px auto 20px' }}>
						<br />
						<h4 style={{ color: 'white' }}>
							How to trade options in four steps
						</h4>
						<br />
						<br />
						<br />* <strong>Investment objectives</strong>. - This
						usually includes income, growth, capital preservation or
						speculation.
						<br />
						<br />* <strong>Trading experience</strong>. - The
						broker will want to know your knowlegde of investing,
						how long you&apos;ve been trading stocks or options, how
						many trades you make per year and the size of your
						trades.
						<br />
						<br />* <strong>Personal financial information</strong>.
						- Have on hand your liquid net worth (or investments
						easily sold for cash), annual income, total net worth
						and employment information.
						<br />
						<br />*{' '}
						<strong>The types of options you want to trade</strong>.
						- For instance, calls, puts or spreads. And whether they
						are covered or naked. The seller or writer of options
						has an obligation to deliver the underlying stock if the
						option is exercised. If the writer also owns the
						underlying stock, the option position is covered. If the
						option position is left unprotected, it&apos;s naked.
					</div>
				</div>

				<div
					className='col-md-6'
					style={{ padding: '50px', color: 'white' }}
				>
					<div style={{ margin: '0 auto' }}>
						<br />
						<h4 style={{ color: 'white' }}>Options trading</h4>
						<br />
						Options trading is when you buy or sell an underlying
						asset at a pre-negotiated price by a certain future
						date.
						<br />
						<br />
						Trading stock options can be complex — even more so than
						stock trading. When you buy a stock, you just decide how
						many shares you want, and your broker fills the order at
						the prevailing market price or a limit price you set.
						Options trading requires an understanding of advanced
						strategies, and the process for opening an options
						trading account includes a few more steps than opening a
						typical investment account.
						<br />
						<br />
						In 2022, the stock market has seen its share of highs
						and lows amid concerns about inflation, Russia&apos;s
						invasion of Ukraine and rising oil prices. When the
						market is volatile, options trading often increases,
						says Randy Frederick, managing director of trading and
						derivatives with the Schwab Center for Financial
						Research.
						<br />
						<br />
						&quot;You can use options to speculate and to gamble,
						but the reality is ... the best use of options is to
						protect your downside,&quot; he says. &quot;Options are
						one way to generate income when the markets aren&apos;t
						going up.&quot;
						<br />
						<br />
						According to the Options Clearing Corporation, there
						were 939 million options contracts traded in March 2022,
						up 4.5% compared with March 2021. It was second-highest
						trading month on record.
					</div>
				</div>
			</div>
			<section>
				<div className='container'>
					<h2 className='column-title title-small'>
						Investor <br />
						Relations
					</h2>
					<div className='row'>
						<div className='col-lg-6'>
							<p>
								Tinkan Trust provides advanced investment
								strategies and wealth management solutions to
								forward-thinking investors around the world.
								Through its distinct investment brands Tinkan
								Trust Management, we offers a diversity of
								investment approaches, encompassing bottom-up
								fundamental active management, Responsible
								Investing, systematic investing and customized
								implementation of client-specified portfolio
								exposures. Exemplary service, timely innovation
								and attractive returns across market cycles have
								been hallmarks of Tinkan Trust since the origin.
							</p>
						</div>

						<div className='col-lg-6'>
							<Image
								className='img-fluid'
								src='/main/images/services/service-single1.jpg'
								alt='service single'
								width={500}
								height={500}
								style={{ width: '100%' }}
							/>
						</div>
					</div>

					<h2 className='column-title title-small'>
						Mirror Your <br /> Desired Expert{' '}
					</h2>
					<div className='row'>
						<div className='col-lg-6'>
							<p>
								Tinkan Trust offers automated Mirror trading
								services across all sectors, Find your desired
								expert, get your account linked to their
								services and mirror the trades, learn as well
								through the trades, across various Market and
								sectors, Options, derivatives, currency pairs,
								Swings/ Scalp trading, Crypto currencies, Forex
								and Index. With over 90% protection on trading
								capital with stop loss softwares and indicators.
								At Tinkan Trust, Clients capital security is
								always our major Concern.
							</p>
						</div>

						<div className='col-lg-6'></div>
					</div>
				</div>
			</section>
			<section
				className='ts-services'
				id='ts-services'
			>
				<div className='container'>
					<div className='row text-center'>
						<div className='col-md-12'>
							<h2 className='section-title'>
								<span>Our Services</span>What We Do
							</h2>
						</div>
					</div>

					<div className='row'>
						<div className='col-lg-4 col-md-12'>
							<div className='ts-service-box'>
								<div className='ts-service-image-wrapper'>
									<Image
										className='img-fluid'
										src='/main/images/services/mutualfunds1.jpg'
										alt=''
										style={{ width: '100%' }}
										width={500}
										height={500}
									/>
								</div>
								<div className='ts-service-content'>
									<span className='ts-service-icon'>
										<i className='icon icon-pie-chart2'></i>
									</span>
									<h3 className='service-title'>
										Mutual Funds
									</h3>
									<p>
										Mutual funds are steadily making an
										entry into the household savings with an
										increased awareness about financial
										planning and higher efforts towards
										promoting mutual funds as an investment
										product.{' '}
									</p>
									<p>
										<a
											className='link-more'
											href='mutual-funds.html'
										>
											Read More{' '}
											<i className='icon icon-right-arrow2'></i>
										</a>
									</p>
								</div>
							</div>
						</div>

						<div className='col-lg-4 col-md-12'>
							<div className='ts-service-box'>
								<div className='ts-service-image-wrapper'>
									<Image
										className='img-fluid'
										src='/main/images/services/commodity1.jpg'
										alt=''
										width={500}
										height={500}
									/>
								</div>
								<div className='ts-service-content'>
									<span className='ts-service-icon'>
										<i className='icon icon-tax'></i>
									</span>
									<h3 className='service-title'>
										commodities{' '}
									</h3>
									<p>
										With a long-term track records in Tinkan
										Trust since 2015, the portfolio
										management team has been providing
										efficient and cost-effective exposure to
										a variety of different commodity
										benchmarks.{' '}
									</p>
									<p>
										<a
											className='link-more'
											href='/commodities'
										>
											Read More{' '}
											<i className='icon icon-right-arrow2'></i>
										</a>
									</p>
								</div>
							</div>
						</div>

						<div className='col-lg-4 col-md-12'>
							<div className='ts-service-box'>
								<div className='ts-service-image-wrapper'>
									<Image
										className='img-fluid'
										src='/main/images/services/realestate1.jpg'
										alt=''
										width={500}
										height={500}
									/>
								</div>
								<div className='ts-service-content'>
									<span className='ts-service-icon'>
										<i className='icon icon-savings'></i>
									</span>
									<h3 className='service-title'>
										Real estate{' '}
									</h3>
									<p>
										Tinkan Trust and its affiliates have
										owned, developed and managed
										multifamily, offices, industrial, retail
										and hotel properties throughout the
										southeastern and southwestern United
										States.
									</p>
									<p>
										<a
											className='link-more'
											href='/real-estate'
										>
											Read More{' '}
											<i className='icon icon-right-arrow2'></i>
										</a>
									</p>
								</div>
							</div>
						</div>
					</div>
					<div className='gap-60'></div>
					<div className='row'>
						<div className='col-lg-4 col-md-12'>
							<div className='ts-service-box'>
								<div className='ts-service-image-wrapper'>
									<Image
										className='img-fluid'
										src='/main/images/services/oil1.jpg'
										alt=''
										width={500}
										height={500}
									/>
								</div>
								<div className='ts-service-content'>
									<span className='ts-service-icon'>
										<i className='icon icon-mutual-fund'></i>
									</span>
									<h3 className='service-title'>Oil & Gas</h3>
									<p>
										{' '}
										Combined with the most rigorous
										regulatory standards, we believe that
										through our core values of Stewardship,
										Teamwork, Excellence, People, Growth and
										Resiliency, we represent the gold
										standard of oil and gas production in
										our nation and in the world.{' '}
									</p>
									<p>
										<a
											className='link-more'
											href='/oil-and-gas'
										>
											Read More{' '}
											<i className='icon icon-right-arrow2'></i>
										</a>
									</p>
								</div>
							</div>
						</div>

						<div className='col-lg-4 col-md-12'>
							<div className='ts-service-box'>
								<div className='ts-service-image-wrapper'>
									<Image
										className='img-fluid'
										src='/main/images/services/infrastructure1.jpg'
										alt=''
										width={500}
										height={500}
									/>
								</div>
								<div className='ts-service-content'>
									<span className='ts-service-icon'>
										<i className='icon icon-consult'></i>
									</span>
									<h3 className='service-title'>
										Infrastructure
									</h3>
									<p>
										Our mission is to be an infrastructure
										partner of choice by making and managing
										investments which have historically
										shown to deliver consistently attractive
										results to clients through the passion
										of our people, depth or our experience
										and strength of our global
										relationships.
									</p>
									<p>
										<a
											className='link-more'
											href='/infrastructure'
										>
											Read More{' '}
											<i className='icon icon-right-arrow2'></i>
										</a>
									</p>
								</div>
							</div>
						</div>

						<div className='col-lg-4 col-md-12'>
							<div className='ts-service-box'>
								<div className='ts-service-image-wrapper'>
									<Image
										className='img-fluid'
										src='/main/images/tabs/img3.png'
										width={500}
										height={500}
										alt=''
										style={{ width: '100%' }}
									/>
								</div>
								<div className='ts-service-content'>
									<span className='ts-service-icon'>
										<i className='icon icon-consult'></i>
									</span>
									<h3 className='service-title'>
										Stocks/Options
									</h3>
									<p>
										With over 500+ registered and regulated
										traders on Tinkan Trust, you get the
										liberty to beat the PDT and day trading
										requirements by getting started with our
										copy trading tool below the $25k minimum
										requirement, get a more advanced view of
										the Market data Center, more enhanced
										pricing and Mirror your desired/ dream
										expert on the best linked platform like
										Thinkorswim, Webull, Robinhood. At
										Tinkan Trust we thrive to bring you the
										modern trading experience.
									</p>
									<p>
										<a
											className='link-more'
											href='/stocks'
										>
											Read More{' '}
											<i className='icon icon-right-arrow2'></i>
										</a>
									</p>
								</div>
							</div>
						</div>
					</div>
					<div className='gap-60'></div>
					<div className='text-center'>
						<a
							className='btn btn-primary'
							href='/services'
						>
							{' '}
							Check More Services
						</a>
					</div>
				</div>
			</section>
			<section>
				<div className='container'>
					<h2 className='section-title'>
						OUR ASSET MANAGEMENT SOLUTIONS
					</h2>
					<div className='service-content'>
						<div className='text-block mrb-40'>
							<p>
								Time is a precious commodity. Researching
								investments in ever-changing markets and
								handling investment transactions are more than
								most people have time for. Tinkan Trust&apos;s
								Asset Management Solutions program allows you to
								delegate the daily management of your assets and
								invest with confidence, knowing that your
								portfolio is in the hands of experienced
								professionals.
							</p>
						</div>
						<div className='fw-single-image mrb-40'>
							<Image
								className='img-fluid'
								src='/main/images/services/infrastructure1.jpg'
								alt=''
								width={500}
								height={500}
							/>
						</div>
						<div className='heading'>
							<h3 className='content-title-medium'>
								Different goals require different approaches.
							</h3>
						</div>
						<div className='text-block'>
							<p>
								At Tinkan Trust we recognize that each investor
								is unique. That&apos;s why we take a
								personalized approach to developing an asset
								management strategy by selecting investment
								portfolios that closely match your goals,
								tolerance for risk, and expectation for returns.
							</p>
							<p>
								It also has characteristics that can benefit
								investors, such as steady returns through market
								cycles with lower volatility, stable long-term
								yields and diversification.
							</p>
							<div className='row'>
								<div className='col-md-6'>
									<div className='heading mrb-20'>
										<h4 className='list-column-title'>
											To provide you additional value, we
											strive to:
										</h4>
									</div>

									<ul className='ts-list'>
										<li>
											Create opportunities for rewards
											while managing risk.
										</li>
										<li>
											Minimize management and
											administrative costs.
										</li>
										<li>
											Provide ongoing services that adapt
											to changes in your goals.
										</li>
									</ul>
									<p>
										over 55 experienced infrastructure
										professionals located in USA , Canada
										and UK. Our stable team is led by
										founding partners.
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
								<div className='col-md-6'>
									<div className='heading mrb-20'>
										<h4 className='list-column-title'>
											&apos;Active-Core&apos; strategy
										</h4>
									</div>
									<p>
										A solid Wealth Plan ensures you have a
										financial strategy that supports your
										aspirations. Once we understand your
										lifestyle goals, we look at the current
										path of your finances to ensure that you
										are on track to meet them through
										retirement and beyond.
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
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
			<section style={{ backgroundColor: '#edeff3' }}>
				<div className='container'>
					<div className='row'>
						<div className='col-md-12'>
							<h2 className='text-center'>OUR VALUES</h2>
							<p className='text-center'>
								At the heart of our business are our partners:
								the entrepreneurs and management teams we back;
								the investors in our funds; the advisers and
								intermediaries we work with; and the banks and
								other lending institutions to our deals.
							</p>
						</div>

						<hr />
						<div className='col-md-3'>
							<h3
								style={{ borderBottom: '2px solid #2154cf' }}
								className='pb-3'
							>
								Highly Ambitious
							</h3>
							<p>
								We strive to build world-className businesses to
								generate superior returns for our partners.
							</p>
						</div>
						<div className='col-md-3'>
							<h3
								style={{ borderBottom: '2px solid #2154cf' }}
								className='pb-3'
							>
								Winning
							</h3>
							<p>
								We are here to win. We are constantly improving,
								and are committed to out-thinking and
								out-executing our competitors. We take on what
								others dismiss as impossible, and solve the hard
								problems that others walk away from. This is why
								we hire the best.
							</p>
						</div>
						<div className='col-md-3'>
							<h3
								style={{ borderBottom: '2px solid #2154cf' }}
								className='pb-3'
							>
								Integrity
							</h3>
							<p>
								We do things the right way, without compromise,
								the first time – every time. We are direct,
								decisive and, above all, accountable. We
								practice sound judgment and common sense in our
								actions that conforms to the letter and spirit
								of the law at all times. We win on the merits,
								with integrity.
							</p>
						</div>
						<div className='col-md-3'>
							<h3
								style={{ borderBottom: '2px solid #2154cf' }}
								className='pb-3'
							>
								Learning
							</h3>
							<p>
								We are driven by a thirst for knowlegde. We are
								constantly learning – from each other and from
								inspired thinkers around the world. We
								passionately pursue new ideas, new innovations
								and new strategies that will strengthen our
								competitive advantage
							</p>
						</div>
					</div>
				</div>
			</section>
			<section
				className='main-container pricing-section'
				id='main-container'
			>
				<div className='wrapper'>
					<fieldset>
						<div>
							<h2 className='text-center'>Plans</h2>
						</div>
					</fieldset>
					<br />

					<div
						className='price-tab weekly active animate__animated animate__fadeIn'
						style={{ display: 'block' }}
					>
						<div className='pricing-table'>
							<div className='pricing-box-2'>
								<h2>Regular Plan</h2>
								<span className='price'> 3.2% Daily</span>

								<span className='pricing-table-divider'></span>
								<a
									className='btn'
									href='/auth/signup'
								>
									<b>Get Started</b>
								</a>
								<span className='pricing-table-divider'></span>
								<ul>
									<li>minimum: $2,500</li>
									<li>maximum: $9,999 </li>
									<li>5% Referral Commission</li>
									<li>24/7 active support</li>
								</ul>
							</div>

							<div className='pricing-box-2'>
								<h2>Standard Plan</h2>
								<span className='price'> 7.1% Daily</span>

								<span className='pricing-table-divider'></span>
								<a
									className='btn'
									href='/auth/signup'
								>
									<b>Get Started</b>
								</a>
								<span className='pricing-table-divider'></span>
								<ul>
									<li>minimum: $10,000</li>
									<li>maximum: $49,999 </li>
									<li>7% Referral Commission</li>
									<li>24/7 active support</li>
								</ul>
							</div>

							<div className='pricing-box-2'>
								<h2>Premium Plan</h2>
								<span className='price'> 8.2% Daily</span>

								<span className='pricing-table-divider'></span>
								<a
									className='btn'
									href='/auth/signup'
								>
									<b>Get Started</b>
								</a>
								<span className='pricing-table-divider'></span>
								<ul>
									<li>minimum: $50,000</li>
									<li>maximum: Unlimited </li>
									<li>12% Referral Commission</li>
									<li>24/7 active support</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</section>
			<section
				className='quote-area bg-overlay overlay-color mb-0'
				id='quote-area'
			>
				<div className='container'>
					<div className='row'>
						<div className='col-lg-6 align-self-center'>
							<div
								className='owl-carousel owl-theme testimonial-slide owl-dark'
								id='testimonial-slide'
							>
								<div className='item'>
									<div className='quote-item quote-square'>
										<span className='quote-text'>
											From complex wealth management to
											your retirement needs, we can help
											you with financial planning.
										</span>
										<div className='quote-item-footer'></div>
									</div>
								</div>

								<div className='item'>
									<div className='quote-item quote-square'>
										<span className='quote-text'>
											&quot; We are a leading investment
											solutions partner, dedicated to
											improving people&apos;s financial
											security&quot;.
										</span>
										<div className='quote-item-footer'></div>
									</div>
								</div>

								<div className='item'>
									<div className='quote-item quote-square'>
										<span className='quote-text'>
											We help investors contribute to a
											better world and offer them
											attractive returns
										</span>
										<div className='quote-item-footer'></div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
};

export default Home;
