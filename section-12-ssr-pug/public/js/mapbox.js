/* eslint-disable */
export const displayMap = locations => {
  // mapbox token
  mapboxgl.accessToken =
    'pk.eyJ1IjoiYXJpZ2F0b3BpeCIsImEiOiJjandjNGY3aGkwbmR3NDBtZDMwMjhzb2FqIn0.G1gjYuSgO3XUy-vzX4qjnQ';

  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/arigatopix/ckgdgfciv1pf419peiaxn7y7t',
    scrollZoom: false,
    // center: [-118.47549, 33.987367], // [long, lat]
    // zoom: 10, // more to zoom in
    // interactive: false, // ไม่ให้ซูมไปไหน
  });

  // bounding box (bbox)
  const bounds = new mapboxgl.LngLatBounds();

  locations.map(loc => {
    // Create maker
    // แสดงผลใน div ที่เราสร้าง (ไม่ต้องมีก้ได้)
    const el = document.createElement('div');
    el.className = 'marker';

    // Add Marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates) // show marker on location
      .addTo(map);

    // Create Popup
    new mapboxgl.Popup({
      offset: 30, // ขยับออกจากจุด location
    })
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Extend map bounds to include current location
    // แสดงผลแผนที่ location ปัจจุบัน
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: { top: 200, bottom: 100, left: 100, right: 100 }, //  ปรับการซูมของ Map#fitBounds
  });
};
