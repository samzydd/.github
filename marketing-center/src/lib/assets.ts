// Asset URLs resolve against Vite's base so the build works from any path.
const base = import.meta.env.BASE_URL;

/** SVG icons exported from the Figma design system instances. */
export const icon = (name: string) => `${base}assets/icons/${name}.svg`;

/** Top-level SVG artwork (logos, illustrations). */
export const art = (name: string) => `${base}assets/${name}.svg`;

/** Raster exports fetched with `npm run fetch-assets`. */
export const image = (name: string) => `${base}assets/images/${name}.png`;
