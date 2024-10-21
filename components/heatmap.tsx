import { LatLngTuple } from "leaflet";
import { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";

export default function Heatmap({ coords }: { coords: LatLngTuple[] }) {
  const centerPosition: LatLngTuple = [
    coords.reduce((acc, cur) => acc + cur[0], 0) / coords.length,
    coords.reduce((acc, cur) => acc + cur[1], 0) / coords.length,
  ];

  const HeatmapLayer = () => {
    const map = useMap();

    // @ts-ignore
    useEffect(() => {
      const L = require("leaflet");

      require("leaflet.heat");
      const heatLayer = L.heatLayer(coords, {
        radius: 25,
        blur: 0,
        minOpacity: 0.7,
      }).addTo(map);

      return () => {
        map.removeLayer(heatLayer);
      };
    }, []);

    return null;
  };

  return (
    <MapContainer
      attributionControl={false}
      center={centerPosition}
      style={{
        width: "90%",
        height: "300px",
        marginTop: "2rem",
        borderRadius: ".5rem",
      }}
      zoom={3}
    >
      <TileLayer url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png" />
      <HeatmapLayer />
    </MapContainer>
  );
}
