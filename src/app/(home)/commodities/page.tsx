import React from 'react';
import Image from 'next/image';
const NewsEvent = () => {
	return (
		   <main>
            <div className="banner-area" id="banner-area" style={{ backgroundImage: 'url(/main/images/banner/banner5.jpg)' }}>
    <div className="container">
        <div className="row justify-content-center">
            <div className="col">
                <div className="banner-heading">
                    <h1 className="banner-title">commodities</h1>
                </div>
            </div>
        </div>
    </div>
</div>

<section className="main-container" id="main-container">

    <div className="container">
        <div className="row">
            <div className="col-lg-8">
                <div className="service-content">
                    <div className="text-block mrb-40">
                        <p>
                            With a long-term track records in Tinkan Trust since 2015, the portfolio management team has been providing efficient and
                            cost-effective exposure to a variety of different commodity benchmarks. The Team seeks to add value in commodity markets
                            through identifying market inefficiencies and price dislocations. The philosophy includes a conservative approach to
                            managing the underlying cash-collateral portfolio in order to preserve the diversification and inflation-protection
                            qualities of the asset className. 
                        </p>
                    </div>
                    <div className="fw-single-image mrb-40">
                        <Image className="img-fluid" src="images/services/commodity1.jpg" alt="" />
                    </div>
                    <div className="text-block mrb-40">
                        <p>
                            Few examples of commodities are; Gold, Copper, Silver, and Platinum. The United state Metal Exchange announced it would
                            launch futures contracts for metals used in batteries. The exchange expect there, will be a large market for such metals
                            as the demand grows for electric vehicles. Through various fund structures and separate accounts, the team offers a broad
                            range of managed commodities solutions enhanced index, active management, and absolute return strategies in order to meet
                            each investor’s unique appetite and investment goals.
                        </p>

                    </div>

                </div>
            </div>
            <div className="col-lg-4">
                <div className="sidebar sidebar-right">
                    <div className="widget no-padding no-border">
    <ul className="service-menu">
        <li><a href="mutual-funds">Mutual Funds</a></li>
        <li><a href="real-estate">Real Estate</a></li>
        <li><a href="retirement">Retirement</a></li>
        <li><a href="infrastructure">Infrastructure</a></li>
        
        <li><a href="agriculture">Agriculture</a></li>
        
        <li><a href="commodities">commodities</a></li>
        <li><a href="oil-and-gas">Oil & Gas</a></li>
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

export default NewsEvent;
