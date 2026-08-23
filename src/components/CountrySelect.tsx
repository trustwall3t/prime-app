'use client';

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { COUNTRIES } from '@/lib/countries';
import { cn } from '@/lib/utils';

type CountrySelectProps = {
	value?: string;
	onChange: (value: string) => void;
	disabled?: boolean;
	placeholder?: string;
	triggerClassName?: string;
	contentClassName?: string;
};

export default function CountrySelect({
	value,
	onChange,
	disabled = false,
	placeholder = 'Select your country',
	triggerClassName,
	contentClassName,
}: CountrySelectProps) {
	return (
		<Select
			value={value || undefined}
			onValueChange={onChange}
			disabled={disabled}
		>
			<SelectTrigger
				className={cn('w-full', triggerClassName)}
				aria-label='Country'
			>
				<SelectValue placeholder={placeholder} />
			</SelectTrigger>
			<SelectContent
				className={cn('max-h-72', contentClassName)}
				position='popper'
			>
				{COUNTRIES.map((country) => (
					<SelectItem key={country} value={country}>
						{country}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
