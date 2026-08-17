const BRAND = 'Prime Mirror Market';
const BRAND_SHORT = 'PMM';

export function getAppUrl() {
	return (
		process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') ??
		'https://app.promirromarket.com'
	);
}

export function getLogoUrl() {
	return `${getAppUrl()}/logo.png`;
}

export function getSupportEmail() {
	return (
		process.env.EMAIL_SUPPORT ??
		process.env.EMAIL_FROM ??
		'support@promirromarket.com'
	);
}

export function getFromAddress() {
	return (
		process.env.EMAIL_FROM ??
		'noreply@promirromarket.com'
	);
}

type Cta = {
	label: string;
	href: string;
};

type RenderEmailOptions = {
	preheader: string;
	title: string;
	greeting?: string;
 paragraphs: string[];
	codeBlock?: { label: string; value: string };
	detailRows?: Array<{ label: string; value: string }>;
	cta?: Cta;
	fallbackLink?: string;
	notice?: string;
};

/** Table-based layout for broad client support (Gmail, Outlook, Apple Mail). */
export function renderEmail(options: RenderEmailOptions): string {
	const {
		preheader,
		title,
		greeting,
		paragraphs,
		codeBlock,
		detailRows,
		cta,
		fallbackLink,
		notice,
	} = options;

	const year = new Date().getFullYear();
	const supportEmail = getSupportEmail();
	const logoUrl = getLogoUrl();

	const paragraphHtml = paragraphs
		.map(
			(p) =>
				`<p style="margin:0 0 16px;font-size:15px;line-height:24px;color:#3f3f46;">${p}</p>`,
		)
		.join('');

	const codeHtml = codeBlock
		? `
			<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:24px 0;">
				<tr>
					<td style="padding:20px 24px;background:#fafafa;border:1px solid #e4e4e7;border-radius:6px;text-align:center;">
						<p style="margin:0 0 8px;font-size:12px;line-height:18px;color:#71717a;letter-spacing:0.04em;text-transform:uppercase;">${codeBlock.label}</p>
						<p style="margin:0;font-family:'Courier New',Courier,monospace;font-size:28px;line-height:32px;font-weight:700;letter-spacing:0.28em;color:#18181b;">${codeBlock.value}</p>
					</td>
				</tr>
			</table>`
		: '';

	const detailHtml =
		detailRows && detailRows.length > 0
			? `
			<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:20px 0;border:1px solid #e4e4e7;border-radius:6px;overflow:hidden;">
				${detailRows
					.map(
						(row, index) => `
				<tr>
					<td style="padding:12px 16px;background:${index % 2 === 0 ? '#ffffff' : '#fafafa'};font-size:13px;color:#71717a;width:38%;border-bottom:1px solid #f4f4f5;">${row.label}</td>
					<td style="padding:12px 16px;background:${index % 2 === 0 ? '#ffffff' : '#fafafa'};font-size:14px;color:#18181b;font-weight:600;border-bottom:1px solid #f4f4f5;">${row.value}</td>
				</tr>`,
					)
					.join('')}
			</table>`
			: '';

	const ctaHtml = cta
		? `
			<table role="presentation" cellspacing="0" cellpadding="0" style="margin:28px 0 8px;">
				<tr>
					<td style="border-radius:6px;background:#2563eb;">
						<a href="${cta.href}" target="_blank" style="display:inline-block;padding:14px 28px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;letter-spacing:0.01em;">${cta.label}</a>
					</td>
				</tr>
			</table>`
		: '';

	const fallbackHtml = fallbackLink
		? `
			<p style="margin:24px 0 0;font-size:12px;line-height:20px;color:#71717a;">
				If the button above does not work, copy and paste this link into your browser:<br />
				<a href="${fallbackLink}" style="color:#2563eb;word-break:break-all;">${fallbackLink}</a>
			</p>`
		: '';

	const noticeHtml = notice
		? `
			<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:24px;">
				<tr>
					<td style="padding:14px 16px;background:#fffbeb;border-left:3px solid #f59e0b;border-radius:0 6px 6px 0;">
						<p style="margin:0;font-size:13px;line-height:20px;color:#92400e;">${notice}</p>
					</td>
				</tr>
			</table>`
		: '';

	return `<!DOCTYPE html>
<html lang="en">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<meta name="x-apple-disable-message-reformatting" />
	<title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Georgia,'Times New Roman',Times,serif;-webkit-font-smoothing:antialiased;">
	<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheader}</div>
	<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f4f5;">
		<tr>
			<td align="center" style="padding:32px 16px;">
				<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border:1px solid #e4e4e7;border-radius:8px;overflow:hidden;">
					<tr>
						<td style="padding:28px 32px 24px;background:#18181b;border-bottom:3px solid #2563eb;">
							<table role="presentation" width="100%" cellspacing="0" cellpadding="0">
								<tr>
									<td>
										<img src="${logoUrl}" alt="${BRAND}" width="148" style="display:block;height:auto;border:0;outline:none;" />
									</td>
								</tr>
								<tr>
									<td style="padding-top:12px;">
										<p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:16px;color:#a1a1aa;letter-spacing:0.12em;text-transform:uppercase;">Client communications</p>
									</td>
								</tr>
							</table>
						</td>
					</tr>
					<tr>
						<td style="padding:36px 32px 28px;font-family:Arial,Helvetica,sans-serif;">
							<h1 style="margin:0 0 20px;font-family:Arial,Helvetica,sans-serif;font-size:22px;line-height:28px;font-weight:700;color:#18181b;">${title}</h1>
							${
								greeting
									? `<p style="margin:0 0 16px;font-size:15px;line-height:24px;color:#18181b;font-weight:600;">${greeting}</p>`
									: ''
							}
							${paragraphHtml}
							${codeHtml}
							${detailHtml}
							${ctaHtml}
							${fallbackHtml}
							${noticeHtml}
							<p style="margin:32px 0 0;font-size:14px;line-height:22px;color:#3f3f46;">
								Sincerely,<br />
								<strong style="color:#18181b;">Client Services</strong><br />
								${BRAND}
							</p>
						</td>
					</tr>
					<tr>
						<td style="padding:24px 32px;background:#fafafa;border-top:1px solid #e4e4e7;font-family:Arial,Helvetica,sans-serif;">
							
							<p style="margin:0;font-size:11px;line-height:16px;color:#a1a1aa;">
								© ${year} ${BRAND}. All rights reserved.<br />
								Reference: ${BRAND_SHORT}-${Date.now().toString(36).toUpperCase()}
							</p>
						</td>
					</tr>
				</table>
			</td>
		</tr>
	</table>
</body>
</html>`;
}

export function renderPlainText(options: RenderEmailOptions): string {
	const lines = [
		options.title,
		'',
		options.greeting ?? '',
		...options.paragraphs,
		'',
	];

	if (options.codeBlock) {
		lines.push(`${options.codeBlock.label}: ${options.codeBlock.value}`, '');
	}

	if (options.detailRows) {
		for (const row of options.detailRows) {
			lines.push(`${row.label}: ${row.value}`);
		}
		lines.push('');
	}

	if (options.cta) {
		lines.push(`${options.cta.label}: ${options.cta.href}`, '');
	}

	if (options.fallbackLink) {
		lines.push(`Link: ${options.fallbackLink}`, '');
	}

	if (options.notice) {
		lines.push(options.notice, '');
	}

	lines.push(
		'Sincerely,',
		'Client Services',
		BRAND,
		'',
		`Support: ${getSupportEmail()}`,
	);

	return lines.filter(Boolean).join('\n');
}
