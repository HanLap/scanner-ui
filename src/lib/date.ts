export const dateFormat = Intl.DateTimeFormat(undefined, {
	year: 'numeric',
	month: 'long',
	day: '2-digit',
	hour: '2-digit',
	minute: '2-digit',
	second: '2-digit',
});

export function formatDateTime(date: Date) {
	return dateFormat.format(date);
}
