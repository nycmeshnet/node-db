const fetch = require("node-fetch");
const fs = require("fs");

const PANO_PATH = "./data/panoramas/";

function getSpreadsheet(cb) {
  fetch(process.env.SPREADSHEET_JSON_URL)
    .then(res => res.json())
    .then(res => {
      const nodes = getNodes(res.nodes);
      const links = getLinks(res.links);
      const sectors = getSectors(res.sectors);
      if (cb) {
        cb({ nodes, links, sectors });
      }
    })
    .catch(err => {
      console.log(err);
    });
}

function getNodes(nodes) {
  return nodes
    .map(node => ({
      id: parseInt(node.id),
      status: node.status,
      coordinates: sanitizeCoordinates(node.coordinates),
      roofAccess: node.roofAccess,
      notes: node.notes,
      panoramas: getPanoramas(node.id)
    }))
    .filter(node => !isDead(node) && node.id && node.coordinates);
}

function getLinks(links) {
  return links
    .map(link => ({
      from: parseInt(link.from),
      to: parseInt(link.to),
      status: link.status
    }))
    .filter(link => link.from && link.to && link.status !== "dead");
}

function getSectors(sectors) {
  return sectors
    .map(sector => ({
      nodeId: sector.nodeId,
      radius: sector.radius,
      azimuth: sector.azimuth,
      width: sector.width,
      active: sector.active
    }))
    .filter(
      sector =>
        sector.nodeId &&
        sector.radius &&
        sector.azimuth &&
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
