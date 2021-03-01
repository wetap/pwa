mapboxgl.accessToken = 'pk.eyJ1IjoiYWFyb25oYW5zIiwiYSI6ImNrajF3ODhxNjR5MjAydnBkZXdoeGc1YmgifQ.neFgdFOOSuB6CKTF_otA7Q';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v10',
  // center: [33.5797336, 67.775784],
  center: [-118.2418777608483, 34.05369936026079],
  zoom: 13
});

let markersPlaced = [];

map.on('load', function() {
  retrieveNearby()
})

function retrieveNearby() {
  let mapCenter = map.getCenter();
  fetch(`https://esmvmo04df.execute-api.us-west-2.amazonaws.com/?lat=${mapCenter.lat}&lon=${mapCenter.lng}`)
  .then(response => response.json())
  .then(data => {
    setupMarkers(data)
  });
}

function resetMarkers() {
  markersPlaced.forEach(marker => {
    marker.remove();
  })
  markersPlaced = [];
}

map.on('moveend', function() {
  resetMarkers()
  retrieveNearby();
});

function setupMarkers(locations) {
  locations.forEach((feature, i) => {
    let markerEl = document.createElement('div');
    markerEl.className = 'marker';
    let html = `<div class="fountain-details">
      <p>${(feature.image_url) ? `<img src=${feature.image_url.S}" />` : 'no image'}</p>
      <div class="fountain-attributes">
        <p><span class="label">Working:</span></span> ${(feature.working) ? '<span class="affirmative">&#x2713;</span>' : '-'}</p>
        <p><span class="label">Flow:</span> ${(feature.flow) ? feature.flow.S : '-'}</p>
      </div>
    </div>
    <div class="fountain-icons">
      <img src="img/faucet.svg" />
      <img src="img/wetap-dogbowl.svg" class="${(feature.dog_bowl) ? '' : 'grey-out'}" />
      <img src="img/wetap-bottle.svg" width="50" class="${(feature.filling_station) ? '' : 'grey-out'}" />
    </div>`
    let popup = new mapboxgl.Popup().setHTML(html);

    let marker = new mapboxgl.Marker(markerEl)
      .setLngLat(JSON.parse(feature.geoJson.S).coordinates)
      .setPopup(popup)
      .addTo(map);

    markersPlaced.push(marker);
  });
}

// center on me
