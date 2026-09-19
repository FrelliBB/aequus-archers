import type { ImageMetadata } from "astro";

const ROOT = "src/assets/images/";

const files = import.meta.glob<{ default: ImageMetadata }>(
	"/src/assets/images/**/*.{jpg,jpeg,png,webp}",
	{ eager: true },
);

export function photo(path: string): ImageMetadata {
	const relative = path.replace(/^\/+/, "").replace(ROOT, "");
	const file = files[`/${ROOT}${relative}`];
	if (!file) throw new Error(`Image not found: ${ROOT}${relative}`);
	return file.default;
}
