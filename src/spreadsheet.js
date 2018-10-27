const fetch = require("node-fetch");
const fs = require("fs");

const PANO_PATH = "./data/panoramas/";

function getSpreadsheet(cb) {
  fetch(process.env.SPREADSHEET_JSON_URL)
    .then(res => res.json())
    .then(res => {
      if (cb) {
        const allNodes = getNodes(res.nodes);
        const filteredNodes = allNodes.filter(
          node => !isDead(node) && node.id && node.coordinates
        );
        cb({
          allNodes,
          nodes: filteredNodes,
          links: getLinks(res.links),
          sectors: getSectors(res.sectors)
        });
      }
    })
    .catch(err => {
      console.log(err);
    });
}

function getNodes(nodes) {
  return nodes.map(node => ({
    id: parseInt(node.id),
    name: node.name,
    status: node.status,
    coordinates: sanitizeCoordinates(node.coordinates),
    requestDate: node.requestDate,
    installDate: node.installDate,
    roofAccess: node.roofAccess,
    notes: node.notes,
    panoramas: getPanoramas(node.id)
  }));
}

function getLinks(links) {
  return links
    .map(link => ({
      from: parseInt(link.from),
      to: parseInt(link.to),
      status: link.status,
      installDate: link.installDate
    }))
    .filter(link => link.from && link.to && link.status !== "dead");
}

function getSectors(sectors) {
  return sectors
    .map(sector => ({
      nodeId: sector.nodeId,
      radius: sector.radius,
      azimuth: sector.azimuth || 0,
      width: sector.width,
      status: sector.status,
      device: sector.device,
      installDate: sector.installDate
    }))
    .filter(
      sector =>
        sector.nodeId &&
        sector.radius &&
        sector.width &&
        sector.status !== "dead"
    );
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
