import React from 'react';
import Image from 'next/image';
const AboutUsPage = () => {
	return (
		   <main>            
<div className="banner-area" id="banner-area" style={{backgroundImage: 'url(main/images/banner/banner1.jpg)'}}>
    <div className="container">
        <div className="row justify-content-center">
            <div className="col">
                <div className="banner-heading">
                    <h1 className="banner-title">About Us</h1>
                    <ol className="breadcrumb">
                        <li><a href="#">Home</a></li>
                        <li>About Us</li>
                    </ol>
                </div>
            </div>
        </div>
    </div>

</div>
<section className="main-container no-padding" id="main-container">
    <div className="about-pattern">
        <div className="container">
            <div className="row">
                <div className="col-lg-6 about-desc">
                    <h2 className="column-title title-small"><span></span>
                        About Us.</h2>
                    <p>
                        Tinkan Trust, We are one of the world’s leading Asset Management firms with approximately $2.2
                        trillion in Assets under
                        management that creates lasting impact for our investors, teams, businesses and the communities
                        in which we live. Tinkan Trust                        was Found in the year 2015, we pioneered a consulting-based approach to private Asset investing,
                        partnering closely with
                        management teams to offer the insights that challenge conventional thinking, build great
                        businesses and improve operations. Over
                        time, we have organically expanded this approach across asset classNamees to build one of the
                        strongest alternative asset platforms in
                        the world. This has empowered us to deliver an enduring impact to a diverse group of investors
                        including other individuals.
                    </p>
                    <div className="gap-15"></div>
                    <p>
                        We power success across the financial world for individuals and institutions through unique
                        insights, thinking and actions. Our
                        investment professionals are well positioned to search for differentiated investment ideas, to
                        uncover the story within the story,
                        the hidden risks and the potential rewards.
                    </p>
                    <div className="gap-15"></div>

                    <p>
                        Most importantly, the glue that holds all of this together is our culture. We believe it is the
                        sustainable competitive advantage
                        of our firm, helping us to attract, retain, develop, and motivate great people. The shared
                        values of our culture include
                        integrity, collegiality, learning, humility, a sense of humor, respect for diversity of thought,
                        and an unyielding focus on our
                        clients.
                    </p>

                </div>
                <div className="col-lg-6">
                    <Image className="img-fluid" src="main/images/pages/about_2.png" alt="about us"/>
                </div>
            </div>
        </div>
    </div>

</section>
 




</main>
	);
};

export default AboutUsPage;
