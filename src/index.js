require("dotenv").config();

const getSpreadsheet = require("./spreadsheet");
const getKiosks = require("./kiosks");
const { writeFile } = require("./utils");

getSpreadsheet(spreadsheet => {
	const { nodes, links, sectors } = spreadsheet;
	writeFile("./data/nodes.json", nodes);
	writeFile("./data/links.json", links);
	writeFile("./data/sectors.json", sectors);
	getKiosks(kiosks => {
		writeFile("./data/kiosks.json", kiosks);
		console.log(
			`${nodes.length} nodes, ${links.length} links, ${
				sectors.length
			} sectors, ${kiosks.length} kiosks.`
		);
	});
});
