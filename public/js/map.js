
	mapboxgl.accessToken = maptoken
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 2 // starting zoom
    });

    const marker=new mapboxgl.Marker()
    .setLngLat(listing.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({offset: popupOffsets})
    .setHTML("<h4>${listing.title}</h4><p>Exact Location provided after booking!</p>"))
    .addTo(map);