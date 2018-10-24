require("dotenv").config();

const getSpreadsheet = require("./spreadsheet");
const getKiosks = require("./kiosks");
const { statsForRange } = require("./stats");
const { writeFile } = require("./utils");

getSpreadsheet(spreadsheet => {
	const { allNodes, nodes, links, sectors } = spreadsheet;
	writeFile("./data/nodes.json", nodes);
	writeFile("./data/links.json", links);
	writeFile("./data/sectors.json", sectors);

	// Stats
	const stats1w = statsForRange(allNodes, 7);
	const stats4w = statsForRange(allNodes, 7 * 4);
	const stats1y = statsForRange(allNodes, 365);
	const statsAll = statsForRange(allNodes);
	writeFile("./data/stats/1w.md", stats1w);
	writeFile("./data/stats/4w.md", stats4w);
	writeFile("./data/stats/1y.md", stats1y);
	writeFile("./data/stats/all.md", statsAll);

	getKiosks(kiosks => {
		writeFile("./data/kiosks.json", kiosks);
		console.log(
			`${nodes.length} nodes, ${links.length} links, ${
				sectors.length
			} sectors, ${kiosks.length} kiosks.`
		);
	});
});
