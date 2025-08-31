// DhakaMap.tsx
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  LayersControl,
  LayerGroup,
} from "react-leaflet";
import type { LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";

const { BaseLayer, Overlay } = LayersControl;

const dhakaCenter: LatLngTuple = [23.8103, 90.4125];

// Dummy report values
const reportData = {
  airIndex: 85,
  temperature: 32,
  humidity: 65,
};

// Dummy heat data (20 nearby points)
const heatData: { position: LatLngTuple; temp: number }[] = Array.from(
  { length: 20 },
  () => {
    const latOffset = (Math.random() - 0.5) * 0.1;
    const lngOffset = (Math.random() - 0.5) * 0.1;
    return {
      position: [
        dhakaCenter[0] + latOffset,
        dhakaCenter[1] + lngOffset,
      ] as LatLngTuple,
      temp: 28 + Math.floor(Math.random() * 10), // 28–37 °C
    };
  }
);

// Dummy pollution zones
const pollutionData = [
  { position: [23.815, 90.42] as LatLngTuple, type: "water" },
  { position: [23.805, 90.4] as LatLngTuple, type: "air" },
  { position: [23.82, 90.41] as LatLngTuple, type: "sound" },
];

// Dummy trees
const treeData: LatLngTuple[] = [
  [23.812, 90.414],
  [23.818, 90.409],
  [23.806, 90.418],
];

// NASA GIBS Layer Configuration
const nasaGibsLayers = [
  {
    name: "MODIS True Color",
    url: "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/{time}/{tileMatrixSet}/{z}/{y}/{x}.jpg",
    attribution: "NASA GIBS",
    time: "2023-06-01", // Example date, can be dynamic
    tileMatrixSet: "GoogleMapsCompatible_Level9",
  },
  {
    name: "MODIS Aerosol",
    url: "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_Aerosol/default/{time}/{tileMatrixSet}/{z}/{y}/{x}.jpg",
    attribution: "NASA GIBS",
    time: "2023-06-01",
    tileMatrixSet: "GoogleMapsCompatible_Level9",
  },
  {
    name: "VIIRS Night (Nighttime Lights)",
    url: "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_SNPP_CorrectedReflectance_TrueColor/default/{time}/{tileMatrixSet}/{z}/{y}/{x}.jpg",
    attribution: "NASA GIBS",
    time: "2023-06-01",
    tileMatrixSet: "GoogleMapsCompatible_Level9",
  },
  {
    name: "Blue Marble",
    url: "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/BlueMarble_NextGeneration/default/{time}/{tileMatrixSet}/{z}/{y}/{x}.jpg",
    attribution: "NASA GIBS",
    time: "2023-06-01",
    tileMatrixSet: "GoogleMapsCompatible_Level9",
  },
  {
    name: "Landsat WELD",
    url: "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/Landsat_WELD_CorrectedReflectance_TrueColor_Global_Annual/default/{time}/{tileMatrixSet}/{z}/{y}/{x}.jpg",
    attribution: "NASA GIBS",
    time: "2020", // Annual data
    tileMatrixSet: "GoogleMapsCompatible_Level9",
  },
];

export default function DhakaMap() {
  return (
    <div style={{ height: "600px", width: "100%" }}>
      <MapContainer
        center={dhakaCenter}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <LayersControl position="topright">
          {/* Base Map */}
          <BaseLayer checked name="OpenStreetMap">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </BaseLayer>

          {/* NASA GIBS Base Layers */}
          {nasaGibsLayers.map((layer, index) => (
            <BaseLayer key={`nasa-${index}`} name={layer.name}>
              <TileLayer
                attribution={layer.attribution}
                url={layer.url
                  .replace("{time}", layer.time)
                  .replace("{tileMatrixSet}", layer.tileMatrixSet)}
              />
            </BaseLayer>
          ))}

          {/* Report Layer */}
          <Overlay checked name="Report">
            <LayerGroup>
              <Marker position={dhakaCenter}>
                <Popup>
                  <strong>Report (Dhaka)</strong>
                  <br />
                  Air Index: {reportData.airIndex}
                  <br />
                  Temp: {reportData.temperature}°C
                  <br />
                  Humidity: {reportData.humidity}%
                </Popup>
              </Marker>
            </LayerGroup>
          </Overlay>

          {/* Heat Layer */}
          <Overlay checked name="Heat">
            <LayerGroup>
              {heatData.map((h, idx) => (
                <Circle
                  key={idx}
                  center={h.position}
                  radius={200}
                  pathOptions={{
                    color: h.temp > 34 ? "orange" : "yellow",
                    fillColor: h.temp > 34 ? "orangered" : "yellow",
                    fillOpacity: 0.5,
                  }}
                >
                  <Popup>
                    Heat Spot <br />
                    Temp: {h.temp}°C
                  </Popup>
                </Circle>
              ))}
            </LayerGroup>
          </Overlay>

          {/* Pollution Layer */}
          <Overlay checked name="Pollution">
            <LayerGroup>
              {pollutionData.map((p, idx) => {
                let color = "gray";
                let fillColor = "gray";

                if (p.type === "water") {
                  color = "blue";
                  fillColor = "red";
                } else if (p.type === "air") {
                  color = "green";
                  fillColor = "green";
                } else if (p.type === "sound") {
                  color = "yellow";
                  fillColor = "yellow";
                }

                return (
                  <Circle
                    key={idx}
                    center={p.position}
                    radius={300}
                    pathOptions={{
                      color,
                      fillColor,
                      fillOpacity: 0.4,
                    }}
                  >
                    <Popup>Pollution Zone: {p.type.toUpperCase()}</Popup>
                  </Circle>
                );
              })}
            </LayerGroup>
          </Overlay>

          {/* Tree Layer */}
          <Overlay checked name="Trees">
            <LayerGroup>
              {treeData.map((t, idx) => (
                <Circle
                  key={idx}
                  center={t}
                  radius={50}
                  pathOptions={{
                    color: "darkgreen",
                    fillColor: "green",
                    fillOpacity: 0.6,
                  }}
                >
                  <Popup>🌳 Tree Tracking</Popup>
                </Circle>
              ))}
            </LayerGroup>
          </Overlay>
        </LayersControl>
      </MapContainer>
    </div>
  );
}
