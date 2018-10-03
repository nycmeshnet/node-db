const fetch = require("node-fetch");
const fs = require("fs");

const PANO_PATH = "./data/panoramas/";

const coordinates = {};

function getSpreadsheet(cb) {
  fetch(process.env.SPREADSHEET_JSON_URL)
    .then(res => res.json())
    .then(res => {
      const nodes = res.features
        .filter(({ geometry }) => geometry.type === "Point")
        .map(({ geometry, properties }) => ({
          id: properties.id,
          status: properties.status,
          coordinates: sanitizeCoordinates(geometry.coordinates),
          roofAccess: properties.roofAccess,
          notes: properties.notes,
          panoramas: getPanoramas(properties.id)
        }))
        .filter(node => node.coordinates);

      const links = res.features
        .filter(({ geometry }) => geometry.type === "LineString")
        .map(({ geometry, properties }) => ({
          from: parseInt(properties.from),
          to: parseInt(properties.to),
          status: properties.status,
          coordinates: geometry.coordinates
        }));

      if (cb) {
        cb({ nodes, links });
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

function removeAbandoned(node) {
  return node && node.status !== "Abandoned" && node.status !== "Unsubscribe";
}

module.exports = getSpreadsheet;
