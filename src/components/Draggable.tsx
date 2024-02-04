import React, { CSSProperties, ReactNode } from 'react';
import { Data, useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';

type Props<T> = {
	id: string;
	data: T;
	disabled?: boolean;
	children:
		| ReactNode
		| ((
				props: ReturnType<typeof useSortable> & { style?: CSSProperties },
		  ) => ReactNode);
	element?: JSX.IntrinsicElements[keyof JSX.IntrinsicElements];
};

export default function Draggable<T extends any>({
	children,
	id,
	data,
	disabled,
	element,
}: Props<T>) {
	const context = useSortable({
		id,
		disabled,
		data: data as Data<T>,
	});
	const style = context.transform
		? ({
				transform: CSS.Transform.toString(context.transform),
				transition: context.transition,
				opacity: context.isDragging ? 0 : undefined,
			} satisfies CSSProperties)
		: undefined;

	if (typeof children === 'function') {
		return children({ ...context, style });
	}

	const Element = element ?? 'div';

	return (
		// @ts-ignore
		<Element
			ref={context.setNodeRef}
			{...context.listeners}
			{...context.attributes}
			style={style}
		>
			{children}
		</Element>
	);
}
