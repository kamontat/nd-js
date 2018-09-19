const path = require("path");
const fs = require("fs");
const glob = require("glob");
const UglifyJS = require("uglify-es");

const root = path.dirname(__dirname);
const caches = ".caches";
const cachesDir = path.join(root, caches);

let options = {
  cwd: cachesDir,
  dot: true
};

glob("**/*.js", options, async function(err, files) {
  if (err) {
    console.error(err);
    process.exit(1);
  } else {
    let data = {};

    await files.forEach(async function(file) {
      let name = path.basename(file);
      let abs = path.join(cachesDir, file);
      let content = await fs.readFileSync(abs, { encoding: "utf8" });
      console.debug(`add: ${name}`);
      data[name] = content;
    });

    const minifyOptions = {};
    const minify = await UglifyJS.minify(data, minifyOptions);

    console.log(minify.error);

    await fs.writeFileSync(path.join(cachesDir, "nd.min.js"), minify.code);
  }
});

// // List all files in a directory in Node.js recursively in a synchronous fashion
// var walkSync = function(dir, filelist) {
//   var fs = fs || require("fs"),
//     files = fs.readdirSync(dir);
//   filelist = filelist || [];
//   files.forEach(function(file) {
//     if (fs.statSync(path.join(dir, file)).isDirectory()) {
//       filelist = walkSync(path.join(dir, file), filelist);
//     } else if (file.includes(".js$")) {
//       filelist.push(path.join(dir, file));
//     }
//   });
//   return filelist;
// };

// let list = [];
// walkSync(cachesDir, list);
// console.log(list);
