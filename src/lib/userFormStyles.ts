/** Shared dashboard tab styling (transaction history, settings, etc.). */
export const dashboardTabsListClass =
	'flex h-12 w-full max-w-[560px] justify-start gap-6 rounded-none border-0 border-b border-zinc-700 bg-transparent p-0';

export const dashboardTabTriggerClass =
	'rounded-none border-0 border-b-2 border-transparent bg-transparent px-0 pb-3 text-lg text-gray-400 shadow-none ring-0 outline-none data-[state=active]:border-b-indigo-500 data-[state=active]:bg-transparent data-[state=active]:text-indigo-400 data-[state=active]:shadow-none';

/** Standard text input used across the user dashboard. */
export const userInputClass =
	'h-11 w-full rounded-md border border-zinc-700 bg-zinc-800 px-4 text-sm text-white placeholder:text-gray-500 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-60';

export const userLabelClass = 'text-sm font-medium text-gray-300';

export const userFormCardClass =
	'rounded-md border border-zinc-700 bg-zinc-800 p-6';

export const userPrimaryButtonClass =
	'w-full rounded-md bg-indigo-500 py-3 text-base font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50';

export const userSecondaryButtonClass =
	'rounded-md border border-zinc-700 bg-zinc-900 px-8 py-3 text-base font-semibold text-gray-300 transition hover:border-zinc-600 hover:text-white disabled:opacity-50';
