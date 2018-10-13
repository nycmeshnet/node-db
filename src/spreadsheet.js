const fetch = require("node-fetch");
const fs = require("fs");

const PANO_PATH = "./data/panoramas/";

const coordinates = {};

function getSpreadsheet(cb) {
  fetch(process.env.SPREADSHEET_JSON_URL)
    .then(res => res.json())
    .then(res => {
      const nodesById = {};
      const nodes = res.nodes
        .map(node => {
          const nodeObj = {
            id: node.id,
            status: node.status,
            coordinates: sanitizeCoordinates(node.coordinates),
            roofAccess: node.roofAccess,
            notes: node.notes,
            panoramas: getPanoramas(node.id)
          };
          nodesById[node.id] = nodeObj;
          return nodeObj;
        })
        .filter(node => !isDead(node) && node.coordinates);

      const links = res.links
        .map(link => {
          const fromNode = nodesById[parseInt(link.from)];
          const toNode = nodesById[parseInt(link.to)];
          return {
            from: fromNode.id,
            to: toNode.id,
            status: link.status,
            coordinates: [fromNode.coordinates, toNode.coordinates]
          };
        })
        .filter(link => link.status !== "dead");

      const sectors = res.sectors
        .map(sector => ({
          nodeId: sector.nodeId,
          radius: sector.radius,
          azimuth: sector.azimuth,
          width: sector.width,
          active: sector.active
        }))
        .filter(sector => sector.status !== "dead");

      if (cb) {
        cb({ nodes, links, sectors });
      }
    })
    .catch(err => {
      console.log(err);
    });
}

// get panoramas <id>.jpg <id>a.jpg up to <id>z.jpg
function getPanoramas(nodeId) {
  const panoramas = [];

  let panLetter = "";
  for (let i = 0; i < 27; i++) {
    const fname = nodeId + panLetter + ".jpg";
    const fname_png = nodeId + panLetter + ".png";
    if (fs.existsSync(PANO_PATH + fname)) {
      panoramas.push(fname);
    } else if (fs.existsSync(PANO_PATH + fname_png)) {
      panoramas.push(fname_png);
    } else {
      break;
    }
    panLetter = String.fromCharCode(97 + i); // a through z
  }

  return panoramas;
}

function sanitizeCoordinates(rawCoordinates) {
  if (!rawCoordinates) {
    return null;
  }

  const coordinates = rawCoordinates.map(c => parseFloat(c));

  if (!coordinates[0] || !coordinates[1]) {
    return null;
  }

  return coordinates;
}

function sortNodes(a, b, reverse = true) {
  const keyA = parse(a.id),
    keyB = parse(b.id);
  if (keyA < keyB) return reverse ? 1 : -1;
  if (keyA > keyB) return reverse ? -1 : 1;
  return 0;
}

function isDead(node) {
  return (
    !node ||
    node.status === "Abandoned" ||
    node.status === "Unsubscribe" ||
    node.status === "Not interested"
  );
}

module.exports = getSpreadsheet;
