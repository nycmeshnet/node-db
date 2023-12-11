const fetch = require("node-fetch");
const fs = require("fs");

const STATUS_TYPES = {
  Live: "active",
  "Ready for Activation": "pending",
  Installed: "installed"
};

function getKiosks(cb) {
  fetch(
    "https://data.cityofnewyork.us/resource/s4kf-3yrf.json?$limit=100000"
  )
    .then(res => res.json())
    .then(res => {
      const data = res;
      const kiosks = data.map(rowToKiosk)

      if (cb) {
        cb(kiosks);
      }
    })
    .catch(err => {
      console.log(err);
    });
}

function rowToKiosk(row) {
  const coordinates = [parseFloat(row.longitude), parseFloat(row.latitude)];
  const status = STATUS_TYPES[row.link_installation_status];
  return {
    street_address: row.street_address,
    type: row.planned_kiosk_type,
    id: row.link_site_id,
    coordinates,
    status
  };
}

module.exports = getKiosks;
