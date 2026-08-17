'use client';

import Script from 'next/script';

/** Loads support chat after the page is interactive — avoids blocking first paint. */
export default function ChatwootWidget() {
	return (
		<>
			<Script
				id='smartsupp-chat'
				strategy='lazyOnload'
				dangerouslySetInnerHTML={{
					__html: `
            window._smartsupp = window._smartsupp || {};
            window._smartsupp.key = '';
            window.smartsupp||(function(d) {
              var s,c,o=smartsupp=function(){ o._.push(arguments)};o._=[];
              s=d.getElementsByTagName('script')[0];c=d.createElement('script');
              c.type='text/javascript';c.charset='utf-8';c.async=true;
              c.src='https://www.smartsuppchat.com/loader.js?';s.parentNode.insertBefore(c,s);
            })(document);
          `,
				}}
			/>
			<noscript>
				Powered by{' '}
				<a href='https://www.smartsupp.com' target='_blank' rel='noreferrer'>
					Smartsupp
				</a>
			</noscript>
		</>
	);
}
