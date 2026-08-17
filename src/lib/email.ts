import nodemailer from 'nodemailer';
import {
	getAppUrl,
	getFromAddress,
	getSupportEmail,
	renderEmail,
	renderPlainText,
} from './email/layout';

const emailConfig = {
	host: process.env.EMAIL_HOST || 'smtp.hostinger.com',
	port: parseInt(process.env.EMAIL_PORT || '465', 10),
	secure: process.env.EMAIL_SECURE !== 'false',
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS,
	},
	debug: process.env.NODE_ENV === 'development',
	connectionTimeout: 10000,
	greetingTimeout: 10000,
};

const transporter = nodemailer.createTransport(emailConfig);

transporter.verify(function (error) {
	if (error) {
		console.error('SMTP connection error:', error);
	} else if (process.env.NODE_ENV === 'development') {
		console.log('SMTP server is ready to take our messages');
	}
});

type EmailTemplate = {
	subject: string;
	html: string;
	text: string;
};

type EmailTemplates = {
	welcome: (name: string, email: string, token: string) => EmailTemplate;
	resetPassword: (data: { link: string }) => EmailTemplate;
	deposit: (data: { amount: number }) => EmailTemplate;
	confirmDeposit: (data: { amount: number }) => EmailTemplate;
	withdraw: (data: { amount: number }) => EmailTemplate;
	confirmWithdraw: (data: { amount: number }) => EmailTemplate;
	trade: (data: {
		amount: number;
		symbol: string;
		type: string;
	}) => EmailTemplate;
	copyTradeSettlement: (data: {
		traderName: string;
		assetSymbol: string;
		assetName: string;
		direction: string;
		stake: number;
		profit: number;
		status: 'won' | 'lost' | 'even';
		finalReturn: number;
	}) => EmailTemplate;
	copyTradeOpened: (data: {
		traderName: string;
		assetSymbol: string;
		assetName: string;
		direction: string;
		stake: number;
		duration: string;
		expiresAt: string;
	}) => EmailTemplate;
	adminNotification: (data: {
		amount: number;
		type: 'deposit' | 'withdraw';
	}) => EmailTemplate;
};

function formatUsd(amount: number) {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 2,
	}).format(amount);
}

export const emailTemplates: EmailTemplates = {
	welcome: (name: string, email: string, token: string) => {
		const verifyUrl = `${getAppUrl()}/verify?email=${encodeURIComponent(email)}`;
		const content = {
			preheader: 'Confirm your email address to activate your Prime Mirror Market account.',
			title: 'Confirm your email address',
			greeting: `Dear ${name},`,
			paragraphs: [
				'Thank you for opening an account with Prime Mirror Market.',
				'For security purposes, we need to verify that this email address belongs to you before your account can be activated. Please use the verification code below on our secure verification page.',
			],
			codeBlock: {
				label: 'Verification code',
				value: token,
			},
			cta: {
				label: 'Continue to verification',
				href: verifyUrl,
			},
			fallbackLink: verifyUrl,
			notice:
				'If you did not request this account, no action is required. Your address will not be added to our platform. Should you receive further correspondence, please contact Client Services immediately.',
		};

		return {
			subject: 'Confirm your email address — Prime Mirror Market',
			html: renderEmail(content),
			text: renderPlainText(content),
		};
	},

	resetPassword: (data: { link: string }) => {
		const content = {
			preheader: 'Password reset request for your Prime Mirror Market account.',
			title: 'Password reset request',
			greeting: 'Dear Client,',
			paragraphs: [
				'We received a request to reset the password associated with your Prime Mirror Market account.',
				'To proceed, select the button below. This link will take you to a secure page where you may choose a new password.',
			],
			cta: {
				label: 'Reset password',
				href: data.link,
			},
			fallbackLink: data.link,
			notice:
				'This link will expire for your protection. If you did not request a password reset, please ignore this message and ensure your account credentials remain secure.',
		};

		return {
			subject: 'Password reset request — Prime Mirror Market',
			html: renderEmail(content),
			text: renderPlainText(content),
		};
	},

	deposit: (data: { amount: number }) => {
		const content = {
			preheader: `Your deposit request of ${formatUsd(data.amount)} has been received.`,
			title: 'Deposit request received',
			greeting: 'Dear Client,',
			paragraphs: [
				'We acknowledge receipt of your deposit request. The details are summarised below for your records.',
				'Your request is now pending review by our operations team. You will receive a separate confirmation once the deposit has been processed and credited to your account.',
			],
			detailRows: [
				{ label: 'Request type', value: 'Deposit' },
				{ label: 'Amount', value: formatUsd(data.amount) },
				{ label: 'Status', value: 'Pending review' },
			],
		};

		return {
			subject: 'Deposit request received — Prime Mirror Market',
			html: renderEmail(content),
			text: renderPlainText(content),
		};
	},

	confirmDeposit: (data: { amount: number }) => {
		const content = {
			preheader: `Your deposit of ${formatUsd(data.amount)} has been confirmed.`,
			title: 'Deposit confirmed',
			greeting: 'Dear Client,',
			paragraphs: [
				'We are writing to confirm that your recent deposit has been approved and credited to your account.',
				'The updated balance is now available in your Prime Mirror Market dashboard.',
			],
			detailRows: [
				{ label: 'Transaction type', value: 'Deposit' },
				{ label: 'Amount credited', value: formatUsd(data.amount) },
				{ label: 'Status', value: 'Completed' },
			],
		};

		return {
			subject: 'Deposit confirmed — Prime Mirror Market',
			html: renderEmail(content),
			text: renderPlainText(content),
		};
	},

	withdraw: (data: { amount: number }) => {
		const content = {
			preheader: `Your withdrawal request of ${formatUsd(data.amount)} has been received.`,
			title: 'Withdrawal request received',
			greeting: 'Dear Client,',
			paragraphs: [
				'We acknowledge receipt of your withdrawal request. The summary below reflects the current status of your instruction.',
				'Our team will review the request in line with our standard settlement procedures. A further notification will follow once processing is complete.',
			],
			detailRows: [
				{ label: 'Request type', value: 'Withdrawal' },
				{ label: 'Amount', value: formatUsd(data.amount) },
				{ label: 'Status', value: 'Pending review' },
			],
		};

		return {
			subject: 'Withdrawal request received — Prime Mirror Market',
			html: renderEmail(content),
			text: renderPlainText(content),
		};
	},

	confirmWithdraw: (data: { amount: number }) => {
		const content = {
			preheader: `Your withdrawal of ${formatUsd(data.amount)} has been processed.`,
			title: 'Withdrawal processed',
			greeting: 'Dear Client,',
			paragraphs: [
				'This message confirms that your withdrawal request has been approved and processed.',
				'Please allow standard banking timelines for funds to appear in your designated account, where applicable.',
			],
			detailRows: [
				{ label: 'Transaction type', value: 'Withdrawal' },
				{ label: 'Amount processed', value: formatUsd(data.amount) },
				{ label: 'Status', value: 'Completed' },
			],
		};

		return {
			subject: 'Withdrawal processed — Prime Mirror Market',
			html: renderEmail(content),
			text: renderPlainText(content),
		};
	},

	trade: (data: { amount: number; symbol: string; type: string }) => {
		const content = {
			preheader: `Trade confirmation: ${data.type.toUpperCase()} ${data.symbol}.`,
			title: 'Trade confirmation',
			greeting: 'Dear Client,',
			paragraphs: [
				'Please find below the details of a trade instruction recorded against your account.',
				'This confirmation is provided for your records. You may review the full activity history at any time through your secure dashboard.',
			],
			detailRows: [
				{ label: 'Instrument', value: data.symbol },
				{ label: 'Direction', value: data.type.toUpperCase() },
				{ label: 'Notional amount', value: formatUsd(data.amount) },
				{ label: 'Status', value: 'Executed' },
			],
		};

		return {
			subject: `Trade confirmation — ${data.symbol}`,
			html: renderEmail(content),
			text: renderPlainText(content),
		};
	},

	copyTradeSettlement: (data: {
		traderName: string;
		assetSymbol: string;
		assetName: string;
		direction: string;
		stake: number;
		profit: number;
		status: 'won' | 'lost' | 'even';
		finalReturn: number;
	}) => {
		const dashboardUrl = `${getAppUrl()}/dashboard/trading-history`;
		const directionLabel = data.direction === 'up' ? 'Buy / Up' : 'Sell / Down';
		const resultLabel =
			data.status === 'won'
				? 'Profit'
				: data.status === 'lost'
					? 'Loss'
					: 'Break even';
		const resultValue =
			data.status === 'even'
				? formatUsd(0)
				: `${data.profit >= 0 ? '+' : ''}${formatUsd(data.profit)}`;
		const outcomeLine =
			data.status === 'won'
				? `Your copied trade closed with a profit of ${formatUsd(data.profit)}.`
				: data.status === 'lost'
					? `Your copied trade closed with a loss of ${formatUsd(Math.abs(data.profit))}.`
					: 'Your copied trade closed at break even — your stake was returned in full.';

		const content = {
			preheader: `Copy trade settled: ${resultLabel.toLowerCase()} on ${data.assetSymbol}.`,
			title: 'Copy trade settled',
			greeting: 'Dear Client,',
			paragraphs: [
				`A trade you copied from ${data.traderName} has been settled.`,
				outcomeLine,
				'The summary below reflects the final outcome credited to your wallet.',
			],
			detailRows: [
				{ label: 'Trader copied', value: data.traderName },
				{ label: 'Instrument', value: `${data.assetName} (${data.assetSymbol})` },
				{ label: 'Direction', value: directionLabel },
				{ label: 'Stake', value: formatUsd(data.stake) },
				{ label: 'Result', value: resultLabel },
				{ label: 'Profit / loss', value: resultValue },
				{ label: 'Returned to wallet', value: formatUsd(data.finalReturn) },
			],
			cta: {
				label: 'View copy trade history',
				href: dashboardUrl,
			},
			fallbackLink: dashboardUrl,
		};

		return {
			subject: `Copy trade settled — ${data.assetSymbol} (${resultLabel.toLowerCase()})`,
			html: renderEmail(content),
			text: renderPlainText(content),
		};
	},

	copyTradeOpened: (data: {
		traderName: string;
		assetSymbol: string;
		assetName: string;
		direction: string;
		stake: number;
		duration: string;
		expiresAt: string;
	}) => {
		const dashboardUrl = `${getAppUrl()}/dashboard/trading-history`;
		const directionLabel = data.direction === 'up' ? 'Buy / Up' : 'Sell / Down';

		const content = {
			preheader: `New copy trade opened on ${data.assetSymbol} from ${data.traderName}.`,
			title: 'Copy trade opened',
			greeting: 'Dear Client,',
			paragraphs: [
				`${data.traderName} has opened a new trade that was mirrored to your account.`,
				'Your stake has been reserved for this position. You will receive a separate notification when the trade settles with the final profit or loss outcome.',
			],
			detailRows: [
				{ label: 'Trader copied', value: data.traderName },
				{ label: 'Instrument', value: `${data.assetName} (${data.assetSymbol})` },
				{ label: 'Direction', value: directionLabel },
				{ label: 'Stake', value: formatUsd(data.stake) },
				{ label: 'Duration', value: data.duration },
				{ label: 'Expected settlement', value: data.expiresAt },
			],
			cta: {
				label: 'View copy trades',
				href: dashboardUrl,
			},
			fallbackLink: dashboardUrl,
		};

		return {
			subject: `Copy trade opened — ${data.assetSymbol}`,
			html: renderEmail(content),
			text: renderPlainText(content),
		};
	},

	adminNotification: (data: {
		amount: number;
		type: 'deposit' | 'withdraw';
	}) => {
		const label = data.type === 'deposit' ? 'Deposit' : 'Withdrawal';
		const dashboardUrl = `${getAppUrl()}/admin/dashboard/transactions`;
		const content = {
			preheader: `New ${label.toLowerCase()} request requires review.`,
			title: `${label} request — administrative review`,
			greeting: 'Dear Administrator,',
			paragraphs: [
				'A client transaction has been submitted and requires your attention in the manager dashboard.',
			],
			detailRows: [
				{ label: 'Request type', value: label },
				{ label: 'Amount', value: formatUsd(data.amount) },
				{ label: 'Status', value: 'Awaiting review' },
			],
			cta: {
				label: 'Open manager dashboard',
				href: dashboardUrl,
			},
			fallbackLink: dashboardUrl,
		};

		return {
			subject: `${label} request pending review — Prime Mirror Market`,
			html: renderEmail(content),
			text: renderPlainText(content),
		};
	},
};

type EmailData = {
	welcome: { name: string; email: string; token: string };
	resetPassword: { link: string };
	deposit: { amount: number };
	confirmDeposit: { amount: number };
	withdraw: { amount: number };
	confirmWithdraw: { amount: number };
	trade: { amount: number; symbol: string; type: string };
	copyTradeSettlement: {
		traderName: string;
		assetSymbol: string;
		assetName: string;
		direction: string;
		stake: number;
		profit: number;
		status: 'won' | 'lost' | 'even';
		finalReturn: number;
	};
	copyTradeOpened: {
		traderName: string;
		assetSymbol: string;
		assetName: string;
		direction: string;
		stake: number;
		duration: string;
		expiresAt: string;
	};
	adminNotification: { amount: number; type: 'deposit' | 'withdraw' };
};

export const sendEmail = async <T extends keyof EmailData>(
	to: string,
	template: T,
	data: EmailData[T],
) => {
	try {
		let result: EmailTemplate;
		switch (template) {
			case 'welcome': {
				const welcomeData = data as EmailData['welcome'];
				result = emailTemplates.welcome(
					welcomeData.name,
					welcomeData.email,
					welcomeData.token,
				);
				break;
			}
			case 'resetPassword': {
				const resetData = data as EmailData['resetPassword'];
				result = emailTemplates.resetPassword(resetData);
				break;
			}
			case 'deposit': {
				const depositData = data as EmailData['deposit'];
				result = emailTemplates.deposit(depositData);
				break;
			}
			case 'confirmDeposit': {
				const confirmDepositData = data as EmailData['confirmDeposit'];
				result = emailTemplates.confirmDeposit(confirmDepositData);
				break;
			}
			case 'withdraw': {
				const withdrawData = data as EmailData['withdraw'];
				result = emailTemplates.withdraw(withdrawData);
				break;
			}
			case 'confirmWithdraw': {
				const confirmWithdrawData =
					data as EmailData['confirmWithdraw'];
				result = emailTemplates.confirmWithdraw(confirmWithdrawData);
				break;
			}
			case 'trade': {
				const tradeData = data as EmailData['trade'];
				result = emailTemplates.trade(tradeData);
				break;
			}
			case 'copyTradeSettlement': {
				const copyTradeData = data as EmailData['copyTradeSettlement'];
				result = emailTemplates.copyTradeSettlement(copyTradeData);
				break;
			}
			case 'copyTradeOpened': {
				const copyOpenedData = data as EmailData['copyTradeOpened'];
				result = emailTemplates.copyTradeOpened(copyOpenedData);
				break;
			}
			case 'adminNotification': {
				const adminNotificationData =
					data as EmailData['adminNotification'];
				result = emailTemplates.adminNotification(
					adminNotificationData,
				);
				break;
			}
			default:
				throw new Error(`Unsupported email template: ${template}`);
		}

		const { subject, html, text } = result;
		const fromAddress = getFromAddress();
		const supportEmail = getSupportEmail();

		const mailOptions = {
			from: `"Prime Mirror Market" <${fromAddress}>`,
			replyTo: `"Prime Mirror Market Client Services" <${supportEmail}>`,
			to,
			subject,
			html,
			text,
		};

		const info = await transporter.sendMail(mailOptions);
		return { success: true, info };
	} catch (error) {
		console.error('Detailed error sending email:', {
			error:
				error instanceof Error
					? {
							message: error.message,
							stack: error.stack,
							name: error.name,
						}
					: error,
		});
		return {
			error: 'Failed to send email',
			details: error instanceof Error ? error.message : 'Unknown error',
		};
	}
};
