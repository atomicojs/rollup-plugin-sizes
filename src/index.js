import getGzip from "gzip-size";
import getBrotli from "brotli-size";

let color = {
	green: "\x1b[32m",
	yellow: "\x1b[33m",
	red: "\x1b[31m"
};

function toKB(size) {
	return (size / 1000).toFixed(2) + "KB";
}

function toSizes(gzip, brotli, color = "") {
	return `gzip: ${toKB(gzip)} brotli: ${toKB(brotli)}`;
}

export default function sizes(limit) {
	if (limit) {
		let danger = Number(("" + limit).replace(/kb/gi, "")) * 1000;
		limit = {
			danger,
			warning: danger * 0.9
		};
	}
	function getColor(size) {
		if (!limit) return color.green;
		return size > limit.danger
			? color.red
			: size > limit.warning
			? color.yellow
			: color.green;
	}
	return {
		name: "@atomico/rollup-plugin-sizes",
		async writeBundle(bundles) {
			let totalGzip = 0;
			let totalBroli = 0;
			let files = 0;
			console.log("");
			for (let key in bundles) {
				let code = bundles[key].code;
				let gzip = await getGzip(code);
				let brotli = await getBrotli(code);
				totalGzip += gzip;
				totalBroli += brotli;
				console.log(`${getColor(gzip)}${toSizes(gzip, brotli)} ← ${key}`);
				files++;
			}
			console.log(
				files > 1
					? `${getColor(totalGzip)}${toSizes(totalGzip, totalBroli)} ← sizes\n`
					: ""
			);
		}
	};
}
