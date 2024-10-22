export const displayMap = (locations) => {
    // const mapElement = document.getElementById('map');
    // if (mapElement) {
        // const locations = JSON.parse(mapElement.dataset.locations);
        // console.log(locations);

        mapboxgl.accessToken = 'pk.eyJ1IjoiYXZhbml0NzgiLCJhIjoiY2x5d3F1b2pxMGE0MjJsb2gxeXpheHZwbiJ9.SV0Mi-AUQ3qvCOaS8vitGA';

        var map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/avanit78/clywttv1k009601phfiml0j6i',
            scrollZoom: false,
            // center:[-113.601134, 39.043372],
            // zoom: 10,
            // interactive: false
        });

        const bounds = new mapboxgl.LngLatBounds();
        // console.log(locations);
        locations.forEach(loc => {
            // Create marker
            const el = document.createElement('div');   
            el.className = 'marker';

            // Add marker
            new mapboxgl.Marker({
                element: el,
                anchor: 'bottom'
            }).setLngLat(loc.coordinates).addTo(map);

            // Add popup
            new mapboxgl.Popup({
                offset: 30
            })
            .setLngLat(loc.coordinates)
            .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
            .addTo(map);

            // Extend the map bounds to include current location
            bounds.extend(loc.coordinates);
        });

        // Additional code to add markers or other map features can go here
    // } else {
    //     console.error('Map element not found');
    // }

    map.fitBounds(bounds, {
        padding: {
            top: 200,
            bottom: 150,
            right: 100,
            left: 100
        }
    });
}
