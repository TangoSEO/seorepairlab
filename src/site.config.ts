import type { SiteConfig } from "@/types";
import type { AstroExpressiveCodeOptions } from "astro-expressive-code";

export const siteConfig: SiteConfig = {
	// Used as both a meta property (src/components/BaseHead.astro L:31 + L:49) & the generated satori png (src/pages/og-image/[slug].png.ts)
	author: "Jessica Schmukler",
	// Date.prototype.toLocaleDateString() parameters, found in src/utils/date.ts.
	date: {
		locale: "en-US", // Cambiado a US para clientes de USA/Canada
		options: {
			day: "numeric",
			month: "short",
			year: "numeric",
		},
	},
	// Used as the default description meta property and webmanifest description
	description: "Expert Technical SEO Consultant specializing in Google indexation issues, Index Bloat solutions, and server optimization. Serving US & Canada markets remotely from Argentina.",
	// HTML lang property, found in src/layouts/Base.astro L:18 & astro.config.ts L:48
	lang: "en-US", // Cambiado para mejor targeting geográfico
	// Meta property, found in src/components/BaseHead.astro L:42
	ogLocale: "en_US", // Consistencia con lang
	/* 
		- Used to construct the meta title property found in src/components/BaseHead.astro L:11 
		- The webmanifest name found in astro.config.ts L:42
		- The link value found in src/components/layout/Header.astro L:35
		- In the footer found in src/components/layout/Footer.astro L:12
	*/
	title: "SEO Repair Lab - Technical SEO Consultant",
	// ! CRITICAL: Replace with your actual domain once deployed
	url: "https://seorepairlab.com/", // Asumiendo tu dominio final
};

// Used to generate links in both the Header & Footer.
export const menuLinks: { path: string; title: string }[] = [
	{
		path: "/",
		title: "Home",
	},
	{
		path: "/about/",
		title: "About",
	},
	{
		path: "/services/",
		title: "Services", // Más comercial que "Blog"
	},
	{
		path: "/case-studies/",
		title: "Case Studies", // Mejor para mostrar expertise
	},
	{
		path: "/blog/",
		title: "Blog", // Renombrado de "posts"
	},
	{
		path: "/contact/",
		title: "Contact", // Esencial para consultoría
	},
];

// https://expressive-code.com/reference/configuration/
export const expressiveCodeOptions: AstroExpressiveCodeOptions = {
	styleOverrides: {
		borderRadius: "4px",
		codeFontFamily:
			'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
		codeFontSize: "1rem", // Aumentado de 0.875rem para mejor legibilidad
		codeLineHeight: "1.6", // Mejorado para lectura
		codePaddingInline: "1.25rem", // Más padding para mejor UX
		frames: {
			frameBoxShadowCssValue: "0 4px 6px -1px rgba(0, 0, 0, 0.1)", // Sutil sombra para definición
		},
		uiLineHeight: "inherit",
	},
	themeCssSelector(theme, { styleVariants }) {
		// If one dark and one light theme are available
		// generate theme CSS selectors compatible with cactus-theme dark mode switch
		if (styleVariants.length >= 2) {
			const baseTheme = styleVariants[0]?.theme;
			const altTheme = styleVariants.find((v) => v.theme.type !== baseTheme?.type)?.theme;
			if (theme === baseTheme || theme === altTheme) return `[data-theme='${theme.type}']`;
		}
		// return default selector
		return `[data-theme="${theme.name}"]`;
	},
	// One dark, one light theme => https://expressive-code.com/guides/themes/#available-themes
	themes: ["dracula", "github-light"],
	useThemedScrollbars: false,
};
