 // Set bounds to New York, New York
var bounds = [
[-74.1502, 40.55], // Southwest coordinates (Staten Island center point)
[-73.7824, 40.85]  // Northeast coordinates (New Rochelle center point)
];

mapboxgl.accessToken = 'pk.eyJ1IjoibWpoMjI0MSIsImEiOiJjbDZhNWdtdWcwemYwM2Nyejg4azR6MjdtIn0.jcFs6eofGMkSv7Gokq_b6A';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mjh2241/clabvz18o002o16tdj4u9l7vy', // mjh mapbox custom
  center: [-73.9571, 40.685],//(Williamsburg Bk map center of gravity)
  zoom: 11,
  maxBounds: bounds, // Sets bounds as max
  pitch:40,
  bearing:29
});

// map.addControl(new mapboxgl.NavigationControl());

map.on("load",function(){
    d3.selectAll(".mapboxgl-ctrl-logo").remove()
    d3.selectAll(".mapboxgl-ctrl-attrib").remove()
})