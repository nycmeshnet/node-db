const fs = require("fs");

function writeFile(path, data, spaces = 2) {
	if (typeof data === "object") {
		fs.writeFile(path, JSON.stringify(data, null, spaces), function(err) {
			if (err) console.error("Error writing to " + path, err);
		});
	} else {
		fs.writeFile(path, data, function(err) {
			if (err) console.error("Error writing to " + path, err);
		});
	}
}

module.exports = {
	writeFile
};
