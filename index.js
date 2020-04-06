'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var getGzip = _interopDefault(require('gzip-size'));
var getBrotli = _interopDefault(require('brotli-size'));
var table = _interopDefault(require('simple-string-table'));

let color = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
};

function toKB(size) {
  return (size / 1000).toFixed(2) + "KB";
}

function sizes(limit, customLog) {
  if (limit) {
    let danger = Number(("" + limit).replace(/kb/gi, "")) * 1000;
    limit = {
      danger,
      warning: danger * 0.9,
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
    async generateBundle(opts, bundles) {
      let length = Object.keys(bundles).length;
      let rows = [[length > 1 ? "FILES" : "FILE", "GZIP", "BROTLI"]];
      let totalGzip = 0;
      let totalBroli = 0;
      let sizes = {};
      let index = 1;

      for (let key in bundles) {
        let code = bundles[key].code;
        if (typeof code !== "string") continue;
        let gzip = await getGzip(code);
        let brotli = await getBrotli(code);
        totalGzip += gzip;
        totalBroli += brotli;
        sizes[index++] = gzip;
        rows.push([key, toKB(gzip), toKB(brotli)]);
      }

      if (length > 1) {
        rows.push(["", toKB(totalGzip), toKB(totalBroli)]);
      }

      sizes[index] = totalGzip;

      if (customLog) {
        customLog(rows);
      } else {
        console.log(
          [color.reset]
            .concat(
              table(rows)
                .split("\n")
                .map(
                  (stringRow, index) =>
                    (sizes[index] ? getColor(sizes[index]) : "") + stringRow
                ),
              color.reset
            )
            .join("\n")
        );
      }
    },
  };
}

module.exports = sizes;
