const fs = require("fs");

const load = (_path) => {
  return fs.readFileSync(_path, "utf8", function (err, data) {
    if (err) throw err;
    return data.toString();
  });
};

module.exports = load;
