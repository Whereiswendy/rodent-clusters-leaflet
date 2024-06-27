// Creating the map object
let myMap = L.map("map", {
  center: [40.7, -73.95],
  zoom: 11
});

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Store the API query variables
let baseURL = "https://data.cityofnewyork.us/resource/erm2-nwe9.json?";
// Add the dates in the ISO formats
let date = "$where=created_date between '2016-01-01T00:00:00' and '2016-12-31T23:59:59'";
// Add the complaint type
let complaint = "&complaint_type=Rodent";
// Add a limit
let limit = "&$limit=10000";

// Assemble the API query URL
let url = baseURL + date + complaint + limit;

// Log the assembled URL
console.log("Query URL:", url);

// Get the data with d3
d3.json(url).then(function(response) {
  // Log the fetched data
  console.log("Fetched Data:", response);

  // Create a new marker cluster group
  let markers = L.markerClusterGroup();

  // Loop through the data
  for (let i = 0; i < response.length; i++) {
    // Log each data point
    console.log(`Data Point ${i}:`, response[i]);

    // Set the data location property to a variable
    let location = response[i].location;
    console.log(`Location object:`, location);  // Log the full location object

    if (location && location.latitude && location.longitude) {
      let lat = parseFloat(location.latitude);
      let lon = parseFloat(location.longitude);
      console.log(`Adding marker at Latitude: ${lat}, Longitude: ${lon}`);  // Log marker coordinates

      // Add a new marker to the cluster group, and bind a popup
      markers.addLayer(L.marker([lat, lon])
        .bindPopup(`<h3>${response[i].descriptor}</h3><hr><p>${response[i].created_date}</p>`));
    } else {
      console.log(`No coordinates for Data Point ${i}`);  // Log missing coordinates
    }
  }

  // Add our marker cluster layer to the map
  myMap.addLayer(markers);
}).catch(function(error) {
  console.log("Error fetching data:", error);
});
