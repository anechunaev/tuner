export type Package = {
	name: string;
	version: string;
}

export function getColorBanner(pkg: Package): string {
	const c = {
		r: "\u001b[7m",
		rs: "\u001b[0m",
		grey: "\u001b[30;1m",
	};
	const g = {
		c1: "\u001b[38;5;226m",
		c2: "\u001b[38;5;220m",
		c3: "\u001b[38;5;214m",
		c4: "\u001b[38;5;208m",
		c5: "\u001b[38;5;202m",
		c6: "\u001b[38;5;196m",
	};
	const b = `${c.grey}Based on ${pkg.name} v.${pkg.version}${c.rs}`;

	return `${g.c1}    ▂▄▆▆██▆▆▄▂${c.rs}
${g.c2}  ▗███████▚████▖ ${c.rs}    ▂▄▆                       ▂▂         ▂▂
${g.c3} ▗██████████████▖${c.rs}   ▀███▀ ███  ███ ███▆▀██▄ ▄██▀▀██▄ ███▆▀${c.r}▂▂${c.rs}▀
${g.c4} ▝██████████████▘${c.rs}    ███  ███▂▄███ ███  ███ ███▀▀▀▀▀ ███
${g.c5}  ▝████████████▘ ${c.rs}     ▀▀▀  ▀▀▀▔▀▀▀ ▀▀▀  ▀▀▀  ▀▀${c.r}▂▂${c.rs}▀▀  ▀▀▀
${g.c6}    ${c.r}▆${c.rs}${g.c6}▀${c.r}▂▂${c.rs}${g.c6}██${c.r}▂▂${c.rs}${g.c6}▀${c.r}▆${c.rs}       ${b}`;
}

export function printColorBanner(pkg: Package) {
	console.log(getColorBanner(pkg));
}
