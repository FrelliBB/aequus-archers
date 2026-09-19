const LOCALE = "en-GB";

export const parseDate = (iso: string) => new Date(iso + "T00:00:00");

export const fmt = (d: Date, opts: Intl.DateTimeFormatOptions) =>
	new Intl.DateTimeFormat(LOCALE, opts).format(d);

export function startOfToday() {
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	return today;
}
