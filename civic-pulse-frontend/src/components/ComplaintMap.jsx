import Map, { Marker } from "react-map-gl/mapbox"
import "mapbox-gl/dist/mapbox-gl.css"

export default function ComplaintMap() {

  const complaints = [
    { id: 1, lat: 19.0760, lng: 72.8777, type: "Pothole" },
    { id: 2, lat: 19.0790, lng: 72.8800, type: "Garbage" },
    { id: 3, lat: 19.0720, lng: 72.8750, type: "Streetlight" }
  ]

  return (

    <div className="rounded-3xl overflow-hidden shadow-xl">

      <Map
        initialViewState={{
          longitude: 72.8777,
          latitude: 19.0760,
          zoom: 12,
          pitch: 60
        }}
        style={{ width: "100%", height: 400 }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken="YOUR_MAPBOX_TOKEN"
      >

        {complaints.map(c => (

          <Marker
            key={c.id}
            longitude={c.lng}
            latitude={c.lat}
          >

            <div className="w-4 h-4 bg-emerald-500 rounded-full animate-ping" />

          </Marker>

        ))}

      </Map>

    </div>

  )
}