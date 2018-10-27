const fetch = require("node-fetch");
const fs = require("fs");

const STATUS_TYPES = {
  Live: "active",
  "Ready for Activation": "pending",
  Installed: "installed"
};

function getKiosks(cb) {
  fetch(
    "https://data.cityofnewyork.us/api/views/s4kf-3yrf/rows.json?accessType=DOWNLOAD"
  )
    .then(res => res.json())
    .then(res => {
      const { data } = res;
      const kiosks = data.map(rowToKiosk).sort((a, b) => {
        const idA = parseInt(a.id.replace("LINK-", ""));
        const idB = parseInt(b.id.replace("LINK-", ""));
        return idA - idB;
      });

      if (cb) {
        cb(kiosks);
      }
    })
    .catch(err => {
      console.log(err);
    });
}

function rowToKiosk(row) {
  const [
    sid,
    id,
    position,
    created_at,
    created_meta,
    updated_at,
    updated_meta,
    meta,
    cb_link_id,
    borough,
    community_board,
    council_district,
    latitude,
    longitude,
    link_installation_status,
    smallest_ppt,
    street_address,
    cross_street_1,
    cross_street_2,
    ixn_corner,
    postcode,
    link_site_id,
    link_smoke_tested_and_activated,
    link_installation,
    neighborhood_tabulation_area,
    building_identification_number,
    borough_block_lot,
    census_tract,
    location
  ] = row;
  const coordinates = [parseFloat(longitude), parseFloat(latitude)];
  const status = STATUS_TYPES[link_installation_status];
  return {
    id: cb_link_id,
    coordinates,
    status
  };
}

module.exports = getKiosks;
