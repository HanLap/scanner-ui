import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function download(data: Uint8Array) {
	const blob = new Blob([new Uint8Array(data)], { type: 'application/pdf' });

	const downloadLink = document.createElement('a');
	downloadLink.href = URL.createObjectURL(blob);
	downloadLink.setAttribute('download', 'merge.pdf');
	downloadLink.setAttribute('hidden', 'true');

	document.body.appendChild(downloadLink);
	downloadLink.click();
	document.body.removeChild(downloadLink);
}