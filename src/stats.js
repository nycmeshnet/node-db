const { format } = require("date-fns");

function statsForRange(nodes, rangeDays) {
  const { activeStats, startDate, endDate } = getActiveStats(nodes, rangeDays);
  const requestStats = getRequestStats(nodes, rangeDays);
  return markdownStats(activeStats, requestStats, startDate, endDate);
}

const markdownStats = (activeStats, requestStats, startDate, endDate) =>
  `---
title: "Stats"
startDate: "${startDate}"
endDate: "${endDate}"
dailyActive: ${JSON.stringify(activeStats, null, 0)}
dailyRequests: ${JSON.stringify(requestStats, null, 0)}
---
`;

function getActiveStats(nodes, rangeDays) {
  const intervals = 100;
  const buckets = [];

  // TODO: Account for abandoned nodes

  const sortedNodes = nodes
    .filter(node => node.id && node.status === "Installed" && node.installDate)
    .sort((a, b) => {
      const aDate = new Date(a.installDate);
      const bDate = new Date(b.installDate);
      return aDate - bDate;
    });

  let range;
  let startDate;
  const now = Date.now();
  if (rangeDays) {
    range = rangeDays * 24 * 60 * 60 * 1000;
    startDate = new Date(now - range);
  } else {
    startDate = new Date(sortedNodes[0].requestDate);
    range = now - startDate;
  }

  // Fill in buckets
  const interval = range / intervals;
  var currentTotal = 0;
  const totalByBucketNum = {};
  sortedNodes.forEach(node => {
    const installDate = new Date(node.installDate);
    const relativeDate = installDate - startDate;
    const bucketNum = Math.max(parseInt(relativeDate / interval), 0);
    currentTotal += 1;
    totalByBucketNum[bucketNum] = currentTotal;
  });

  // Fill in missing values
  currentTotal = 0;
  for (var i = 0; i < intervals; i++) {
    if (!totalByBucketNum[i]) {
      totalByBucketNum[i] = currentTotal;
    }
    currentTotal = totalByBucketNum[i];
  }

  const formatStr = "MMM D";
  let startDateStr = format(startDate, formatStr);
  let endDateStr = format(now, formatStr);
  if (range >= 365 * 24 * 60 * 60 * 1000) {
    startDateStr = format(startDate, "MMM D, YYYY");
    endDateStr = format(now, "MMM D, YYYY");
  }

  return {
    startDate: startDateStr,
    endDate: endDateStr,
    activeStats: Object.values(totalByBucketNum)
  };
}

// TODO: Refactor duplicate code
function getRequestStats(nodes, rangeDays) {
  const intervals = 100;
  const buckets = [];

  const sortedNodes = nodes
    // .map(node => {
    //   if (node.status === "Abandoned" && !node.installDate) {
    //     console.log("Missing abandon date: ", node.id);
    //   }
    //   if (node.status === "Installed" && !node.installDate) {
    //     console.log("Missing install date: ", node.id);
    //   }
    //   return node;
    // })
    .filter(node => node.id && node.requestDate)
    .sort((a, b) => {
      const aDate = new Date(a.requestDate);
      const bDate = new Date(b.requestDate);
      return aDate - bDate;
    });

  let range;
  let startDate;
  const now = Date.now();
  if (rangeDays) {
    range = rangeDays * 24 * 60 * 60 * 1000;
    startDate = new Date(now - range);
  } else {
    startDate = new Date(sortedNodes[0].requestDate);
    range = now - startDate;
  }

  // Fill in buckets
  const interval = range / intervals;
  var currentTotal = 0;
  const totalByBucketNum = {};
  sortedNodes.forEach(node => {
    const requestDate = new Date(node.requestDate);
    const relativeDate = requestDate - startDate;
    const bucketNum = Math.max(parseInt(relativeDate / interval), 0);
    currentTotal += 1;
    totalByBucketNum[bucketNum] = currentTotal;
  });

  // Fill in missing values
  currentTotal = 0;
  for (var i = 0; i < intervals; i++) {
    if (!totalByBucketNum[i]) {
      totalByBucketNum[i] = currentTotal;
    }
    currentTotal = totalByBucketNum[i];
  }

  return Object.values(totalByBucketNum);
}

module.exports = {
  statsForRange
};
