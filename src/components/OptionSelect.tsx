'use client';

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

type OptionSelectProps = {
	value?: string;
	onChange: (value: string) => void;
	options: readonly string[];
	disabled?: boolean;
	placeholder?: string;
	triggerClassName?: string;
	contentClassName?: string;
	'aria-label'?: string;
};

export default function OptionSelect({
	value,
	onChange,
	options,
	disabled = false,
	placeholder = 'Select an option',
	triggerClassName,
	contentClassName,
	'aria-label': ariaLabel,
}: OptionSelectProps) {
	return (
		<Select
			value={value || undefined}
			onValueChange={onChange}
			disabled={disabled}
		>
			<SelectTrigger
				className={cn('w-full', triggerClassName)}
				aria-label={ariaLabel}
			>
				<SelectValue placeholder={placeholder} />
			</SelectTrigger>
			<SelectContent
				className={cn('max-h-72', contentClassName)}
				position='popper'
			>
				{options.map((option) => (
					<SelectItem key={option} value={option}>
						{option}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
