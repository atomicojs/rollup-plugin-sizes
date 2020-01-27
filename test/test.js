const test = require("ava");
const { rollup } = require("rollup");
const { readFile } = require("fs").promises;

const getGzip = require("gzip-size").sync;
const getBrotli = require("brotli-size").sync;

const sizes = require("../index");

function toKB(size) {
  return (size / 1000).toFixed(2) + "KB";
}

test("converts json", async t => {
  let table;

  const bundle = await rollup({
    input: [__dirname + "/cases/root-1.js", __dirname + "/cases/root-2.js"],
    plugins: [sizes(null, nextTable => (table = nextTable))]
  });

  await bundle.write({
    dir: __dirname + "/tmp",
    format: "es"
  });

  let [header, sizesRoot1, sizeRoot2] = table;
  // get files already processed to compare sizes from the temporary directory
  let fileSizes = await Promise.all([
    readFile(__dirname + "/tmp/root-1.js", "utf8"),
    readFile(__dirname + "/tmp/root-2.js", "utf8")
  ]).then(files =>
    files.map(file => [toKB(getGzip(file)), toKB(getBrotli(file))])
  );

  [sizesRoot1, sizeRoot2].map(([file, gzip, brotli], index) => {
    t.is(gzip, fileSizes[index][0]);
    t.is(brotli, fileSizes[index][1]);
  });
});
