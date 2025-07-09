import { BrowserRouter, Outlet, Route, Routes } from "react-router";

import Nav from "./Nav";
import PageIntro from "./PageIntro";
import RegionSummaryMap from "./maps/RegionSummaryMap";
import { useState } from "react";

import Map from "./Map";
import { MapLayerName, MapSourceName, MapStyleName } from "./types";

function Root() {
  return (
    <>
      <Nav />
      <main className="map-height">
        <Outlet />
      </main>
    </>
  );
}

function App() {
  const [region, setRegion] = useState(undefined);
  const [mapLocation, setMapLocation] = useState({
    lng: 116.12,
    lat: 7.89,
    zoom: 4,
  });

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Root />}>
          <Route index element={<PageIntro />} />
          <Route
            path="summary"
            element={
              <RegionSummaryMap
                region={region}
                setRegion={setRegion}
                mapLocation={mapLocation}
                setMapLocation={setMapLocation}
              />
            }
          />
          <Route
            path="overview"
            element={
              <Map
                mapStyle={MapStyleName.OVERVIEW}
                mapLocation={mapLocation}
                setMapLocation={setMapLocation}
                styleSpec={"styles/overview.json"}
                dataSources={[
                  MapSourceName.ELECTRICITY,
                  MapSourceName.RAIL,
                  MapSourceName.ROADS_MAIN,
                  MapSourceName.ROADS_OTHER,
                ]}
                dataLayers={[
                  {
                    key: MapLayerName.ELECTRICITY,
                    label: "Power Grid",
                    linear: true,
                    color: "#ffebc4",
                  },
                  {
                    key: MapLayerName.RAIL,
                    label: "Railways",
                    linear: true,
                    color: "#444",
                  },
                  {
                    key: MapLayerName.TRUNK,
                    label: "Trunk Roads",
                    linear: true,
                    color: "#941339",
                  },
                  {
                    key: MapLayerName.MOTORWAY,
                    label: "Motorways",
                    linear: true,
                    color: "#941339",
                  },
                  {
                    key: MapLayerName.PRIMARY,
                    label: "Primary Roads",
                    linear: true,
                    color: "#cb3e4e",
                  },
                  {
                    key: MapLayerName.SECONDARY,
                    label: "Secondary Roads",
                    linear: true,
                    color: "#8471a8",
                  },
                  {
                    key: MapLayerName.ROADS_OTHER,
                    label: "Tertiary and Other Roads",
                    linear: true,
                    color: "#b2afaa",
                  },
                  {
                    key: MapLayerName.COASTAL,
                    label: "Coastal flood depth (m), 100yr",
                    linear: false,
                    color: "#9df4b0",
                  },
                  {
                    key: MapLayerName.FLUVIAL,
                    label: "Fluvial flood depth (m), 100yr",
                    linear: false,
                    color: "#58cced",
                  },
                  {
                    key: MapLayerName.CYCLONE,
                    label: "Cyclone gust speed (m/s), 100yr",
                    linear: false,
                    color: "#f9d5cb",
                  },
                ]}
                tooltipLayerSources={[
                  MapSourceName.ELECTRICITY,
                  MapSourceName.RAIL,
                  MapSourceName.ROADS_MAIN,
                  MapSourceName.ROADS_OTHER,
                  MapSourceName.COASTAL,
                  MapSourceName.FLUVIAL,
                  MapSourceName.CYCLONE,
                ]}
              />
            }
          />
          <Route
            path="hazards"
            element={
              <Map
                styleSpec={"styles/hazards.json"}
                mapLocation={mapLocation}
                setMapLocation={setMapLocation}
                mapStyle={MapStyleName.HAZARDS}
                dataSources={[]}
                dataLayers={[
                  {
                    key: MapLayerName.COASTAL,
                    label: "Coastal flood depth (m), 100yr",
                    linear: false,
                    color: "#9df4b0",
                  },
                  {
                    key: MapLayerName.FLUVIAL,
                    label: "Fluvial flood depth (m), 100yr",
                    linear: false,
                    color: "#58cced",
                  },
                  {
                    key: MapLayerName.CYCLONE,
                    label: "Cyclone gust speed (m/s), 100yr",
                    linear: false,
                    color: "#f9d5cb",
                  },
                ]}
                tooltipLayerSources={[
                  MapSourceName.COASTAL,
                  MapSourceName.FLUVIAL,
                  MapSourceName.CYCLONE,
                ]}
              />
            }
          />
          <Route
            path="roads"
            element={
              <Map
                styleSpec={"styles/roads.json"}
                mapStyle={MapStyleName.ROADS}
                mapLocation={mapLocation}
                setMapLocation={setMapLocation}
                dataSources={[
                  MapSourceName.ROADS_MAIN,
                  MapSourceName.ROADS_OTHER,
                ]}
                dataLayers={[
                  {
                    key: MapLayerName.TRUNK,
                    label: "Trunk Roads",
                    linear: true,
                    color: "#b2afaa",
                  },
                  {
                    key: MapLayerName.MOTORWAY,
                    label: "Motorways",
                    linear: true,
                    color: "#b2afaa",
                  },
                  {
                    key: MapLayerName.PRIMARY,
                    label: "Primary Roads",
                    linear: true,
                    color: "#b2afaa",
                  },
                  {
                    key: MapLayerName.SECONDARY,
                    label: "Secondary Roads",
                    linear: true,
                    color: "#b2afaa",
                  },
                  {
                    key: MapLayerName.ROADS_OTHER,
                    label: "Tertiary and Other Roads",
                    linear: true,
                    color: "#b2afaa",
                  },
                ]}
                tooltipLayerSources={[
                  MapSourceName.ROADS_MAIN,
                  MapSourceName.ROADS_OTHER,
                ]}
              />
            }
          />
          <Route
            path="rail"
            element={
              <Map
                mapStyle={MapStyleName.RAIL}
                styleSpec={"styles/rail.json"}
                mapLocation={mapLocation}
                setMapLocation={setMapLocation}
                dataSources={[MapSourceName.RAIL]}
                dataLayers={[
                  {
                    key: MapLayerName.RAIL,
                    label: "Railways",
                    linear: true,
                    color: "#444",
                  },
                ]}
                tooltipLayerSources={[MapSourceName.RAIL]}
              />
            }
          />
          <Route
            path="energy_network"
            element={
              <Map
                mapStyle={MapStyleName.ELECTRICITY}
                styleSpec={"styles/electricity.json"}
                mapLocation={mapLocation}
                setMapLocation={setMapLocation}
                dataSources={[MapSourceName.ELECTRICITY]}
                dataLayers={[
                  {
                    key: MapLayerName.ELECTRICITY,
                    label: "Power Grid",
                    linear: true,
                    color: "#ffebc4",
                  },
                ]}
                tooltipLayerSources={[MapSourceName.ELECTRICITY]}
              />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
