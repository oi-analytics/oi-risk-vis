import Map from "../Map";
import RegionSummary from "../RegionSummary";
import { MapSourceName, MapStyleName } from "../types";

export default function RegionSummaryMap({
  region,
  setRegion,
  mapLocation,
  setMapLocation,
}) {
  return (
    <>
      <div className="page-col-right">
        <RegionSummary region={region} />
      </div>
      <div className="page-col-left">
        <Map
          styleSpec={"styles/regions.json"}
          mapStyle={MapStyleName.REGIONS}
          mapLocation={mapLocation}
          setMapLocation={setMapLocation}
          dataSources={[MapSourceName.ADMIN1]}
          dataLayers={[]}
          tooltipLayerSources={[MapSourceName.ADMIN1]}
          onRegionSelect={setRegion}
        />
      </div>
    </>
  );
}
