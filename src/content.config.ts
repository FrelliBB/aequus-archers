import { defineCollection } from "astro:content";
import { file } from "astro/loaders";
import { z } from "astro/zod";
import yaml from "js-yaml";

const list = (path: string) =>
	file(path, {
		parser: (text) =>
			((yaml.load(text, { schema: yaml.CORE_SCHEMA }) as Record<string, unknown>[] | null) ?? []).map((item, i) => ({
				...item,
				id: String(i),
				order: i,
			})),
	});

const isoDate = z
	.string()
	.trim()
	.refine(
		(v) => {
			const d = new Date(v);
			return /^\d{4}-\d{2}-\d{2}$/.test(v) && !isNaN(d.getTime()) && d.toISOString().startsWith(v);
		},
		{ message: "Use a real date like 2027-05-16" },
	);

const text = z.coerce.string().trim().min(1);
const optionalText = z.string().trim().optional().transform((v) => v || undefined);

const tasters = defineCollection({
	loader: list("src/data/tasters.yml"),
	schema: z.object({
		order: z.number(),
		date: isoDate,
		time: text,
		note: optionalText,
	}),
});

const courses = defineCollection({
	loader: list("src/data/courses.yml"),
	schema: z.object({
		order: z.number(),
		name: text,
		times: text,
		dates: z.array(isoDate).min(1),
		note: optionalText,
	}),
});

const events = defineCollection({
	loader: list("src/data/events.yml"),
	schema: z.object({
		order: z.number(),
		title: text,
		date: isoDate,
		time: optionalText,
		location: optionalText,
		description: optionalText,
		link: z.url().optional(),
	}),
});

const team = defineCollection({
	loader: list("src/data/team.yml"),
	schema: z.object({
		order: z.number(),
		name: optionalText,
		role: text,
		group: z.enum(["committee", "coach"]),
		photo: optionalText,
		summary: optionalText,
		bio: optionalText,
	}),
});

const policies = defineCollection({
	loader: list("src/data/policies.yml"),
	schema: z.object({
		order: z.number(),
		anchor: optionalText,
		title: text,
		summary: text,
		document: optionalText,
	}),
});

export const collections = { tasters, courses, events, team, policies };
