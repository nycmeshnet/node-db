# node-db

This repo stores the data used for our [node map](https://nycmesh.net/map).

[Nodes](https://node-db.netlify.com/nodes.json)  
[Links](https://node-db.netlify.com/links.json)  
[Kiosks](https://node-db.netlify.com/kiosks.json)  

Commits made here will trigger a rebuild of the website with the latest data.

### Nodes

```bash
yarn update-data
```
Pulls down the latest data from the spreadsheet. You do not need to run this locally to update the website. This script is automatically run server side when changes are made to the spreadsheet.

### Panoramas

Panoramas go in `data/panoramas` and are named according to their node number (227.jpg).  
To add multiple panoramas, add a letter to the end of the name (227.jpg, 227a.jpg, 227b.jpg, etc.).

You can access the panoramas at https://node-db.netlify.com/panoramas/227.jpg
