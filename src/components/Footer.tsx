import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
	return (
		<footer
			className='footer'
			id='footer'
		>
			<div className='footer-main bg-overlay'>
				<div className='container'>
					<div className='row'>
						<div className='col-lg-4 col-md-12 footer-widget footer-about'>
							<div className='footer-logo'>
								<Link href='/'>
									<Image
										src='/logo.png'
										width={200}
										height={75}
										alt='tinkantrust'
									/>
								</Link>
							</div>
							<p>
								Trade with us and earn more.
							</p>
						</div>

						<div className='col-lg-4 col-md-12 footer-widget'>
							<ul className='list-dash'>
								<li>
									<Link href='/'>Home</Link>
								</li>
								<li>
									<Link href='/about-us'>About Us</Link>
								</li>
								<li>
									<Link href='mailto:support@tinkantrust.com'>
										Contact
									</Link>
								</li>
								<li>
									<Link href='/faq'>FAQ</Link>
								</li>
								<li>
									<Link href='/login'>Login</Link>
								</li>
								<li>
										<Link href='/mutual-funds'>Mutual Funds</Link>
								</li>
								<li>
									<Link href='/auth/signup'>Register</Link>
								</li>
								<li>
									<Link href='/terms'>
										Terms and Conditions
									</Link>
								</li>
							</ul>
						</div>

						<div className='col-lg-4 col-md-12 footer-widget'>
							<div>
								<div className='contact-info-right'>
									<div className='ts-contact-info'>
										<div className='ts-contact-content m-0'>
											<h3 className='ts-contact-title'>
												Find Us
											</h3>
											<p>
												1100 15th St NW 4th Floor
												<br />
												Washington, DC 20005
											</p>
											<p>
												2108-150 King Street West
												<br />
												Toronto, ON M5H 1J9
											</p>
											<p>
												1 College Hill, London EC4R 2RA,
												<br />
												United Kingdom
											</p>
										</div>
									</div>
								
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className='copyright'>
				<div className='container'>
					<div className='row'>
						<div className='col-lg-6 col-md-12'>
							<div className='copyright-info'>
								<span>
									Copyright © {new Date().getFullYear()}{' '}
									Tinkan Trust. All Rights Reserved.
								</span>
							</div>
						</div>
						
					</div>
				</div>
			</div>
		</footer>
	);
}
