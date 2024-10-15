import { LatLngTuple } from "leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

const SearchField = () => {
  const provider = new OpenStreetMapProvider();

  // @ts-ignore
  const searchControl = new GeoSearchControl({
    provider,
    style: "button",
    showMarker: false,
  });

  const map = useMap();

  // @ts-ignore
  useEffect(() => {
    map.addControl(searchControl);

    return () => map.removeControl(searchControl);
  }, []);

  return null;
};

export const LocationPicker = ({
  onLocationSelect,
}: {
  onLocationSelect: Function;
}) => {
  const [position, setPosition] = useState<LatLngTuple | null>(null);

  const MapEvents = () => {
    useMapEvents({
      click: (e: any) => {
        const { lat, lng } = e.latlng;

        setPosition([lat, lng]);
      },
      // @ts-ignore
      "geosearch/showlocation": (e: any) => {
        setPosition([e.location.y, e.location.x]);
      },
    });

    return position === null ? null : <Marker position={position} />;
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPosition([position.coords.latitude, position.coords.longitude]);
        },
        () => {
          setPosition([41.9028, 12.4964]);
        },
      );
    } else {
      setPosition([41.9028, 12.4964]);
    }
  }, []);

  useEffect(() => {
    if (position) {
      onLocationSelect(position[0], position[1]);
    }
  }, [position]);

  if (position) {
    return (
      <MapContainer
        center={position}
        scrollWheelZoom={false}
        style={{ width: "100%", height: "100%" }}
        zoom={13}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapEvents />
        <SearchField />
      </MapContainer>
    );
  }

  return null;
};
