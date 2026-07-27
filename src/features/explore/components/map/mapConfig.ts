export const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

// Styling map custom (Silver / Premium Light style)
export const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
  gestureHandling: "greedy",
  styles: [
    {
      elementType: "geometry",
      stylers: [{ color: "#f4f6f4" }],
    },
    {
      elementType: "labels.text.fill",
      stylers: [{ color: "#4a5a4a" }],
    },
    {
      elementType: "labels.icon",
      stylers: [{ visibility: "off" }],
    },
    {
      elementType: "labels.text.stroke",
      stylers: [{ color: "#ffffff" }],
    },
    {
      featureType: "poi.park",
      elementType: "geometry.fill",
      stylers: [{ color: "#d2ebd2" }],
    },
    {
      featureType: "landscape.man_made.building",
      elementType: "geometry.fill",
      stylers: [
        { color: "#E7EDE7" },
        { visibility: "on" },
      ],
    },
    {
      featureType: "landscape.man_made.building",
      elementType: "geometry.stroke",
      stylers: [
        { color: "#aeb6ae" },
        { visibility: "on" },
      ],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#ffffff" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.fill",
      stylers: [{ color: "#e3edd9" }],
    },
    {
      featureType: "water",
      elementType: "geometry.fill",
      stylers: [{ color: "#a5cce0" }],
    },
  ],
};
