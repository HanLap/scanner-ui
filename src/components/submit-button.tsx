'use client';

import { ReactNode } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';

interface SubmitButtonProps extends React.ComponentProps<typeof Button> {}

function SubmitButton({
	children,
	className,
	disabled,
	...props
}: SubmitButtonProps) {
	const { pending } = useFormStatus();

	return (
		<Button
			variant='outline'
			type='submit'
			{...props}
			aria-disabled={disabled || pending}
			disabled={disabled || pending}
			className={className}
		>
			{pending ? <Loader2 className='h-4 w-4 animate-spin' /> : children}
		</Button>
	);
}

export { SubmitButton };
