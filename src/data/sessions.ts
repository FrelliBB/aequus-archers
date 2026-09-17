// =============================================================
//  EDIT YOUR SESSIONS HERE — this is the only file you change.
//  Dates use the format YEAR-MONTH-DAY, e.g. "2026-07-19".
//  Weekdays, "next session", and past-date hiding are all
//  worked out automatically — just add new lines as you
//  schedule them. Old dates drop off on their own.
// =============================================================

export type Taster = {
	/** ISO date, e.g. "2026-07-19" */
	date: string;
	/** Display time, e.g. "10:00am" */
	time: string;
	/** Optional short note shown on the card, e.g. "Evening session" */
	note?: string;
};

export type Course = {
	name: string;
	/** Display time range, e.g. "10am–1pm" */
	times: string;
	/** The weekly session dates, ISO format */
	dates: string[];
};

export const TASTERS: Taster[] = [
	{ date: "2026-06-21", time: "10:00am" },
	{ date: "2026-07-19", time: "10:00am" },
	{ date: "2026-07-29", time: "6:00pm", note: "Evening session" },
	{ date: "2026-08-03", time: "10:00am" },
	{ date: "2026-08-23", time: "10:00am" },
];

export const COURSES: Course[] = [
	{
		name: "July course",
		times: "10am–1pm",
		dates: ["2026-07-19", "2026-07-26", "2026-08-09", "2026-08-16"],
	},
	{
		name: "September course",
		times: "10am–1pm",
		dates: ["2026-09-05", "2026-09-12", "2026-09-19", "2026-09-26"],
	},
];

// ---- helpers (no need to edit) ----
const L = "en-GB";
export const parseDate = (s: string) => new Date(s + "T00:00:00");
export const fmt = (d: Date, opts: Intl.DateTimeFormatOptions) =>
	new Intl.DateTimeFormat(L, opts).format(d);
