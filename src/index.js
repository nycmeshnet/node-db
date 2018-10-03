require("dotenv").config();

const getSpreadsheet = require("./spreadsheet");
const getKiosks = require("./kiosks");
const { writeFile } = require("./utils");

getSpreadsheet(spreadsheet => {
	const { nodes, links } = spreadsheet;
	writeFile("./data/nodes.json", nodes);
	writeFile("./data/links.json", links);
	getKiosks(kiosks => {
		writeFile("./data/kiosks.json", kiosks);
		console.log(
			`${nodes.length} nodes, ${links.length} links, ${
				kiosks.length
			} kiosks.`
		);
	});
});
