import React from 'react';

const Help = (props) => {
  if (props.topic=== "hazards") {
    return <HazardHelp />
  }
  return null
}

const HazardHelp = () => (
  <div className="custom-map-control top-right selected-feature">
    <h4 className="h5">Hazard Data</h4>

    <p>The flood (fluvial and coastal) maps show 1/100-year return period flood
    outlines at 30 arc second grid squares.</p>

    <p>The cyclone map shows 1/100-year return period wind speeds at in m/s at
    0.1-degree grid squares.</p>

    <p>These are one of several maps used in this study the details of which are
    described below.</p>

    <table className="table table-sm">
      <thead>
        <tr>
          <th>Hazard</th>
          <th>Probabilities</th>
          <th>Intensities and spatial extents </th>
          <th>Climate scenario information </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Fluvial (river) flooding, from <a target="_blank" rel="noopener noreferrer" href="https://www.wri.org/data/aqueduct-floods-hazard-maps">WRI Aqueduct</a></td>
          <td rowSpan="2">1/2, 1/5, 1/10, 1/25, 1/50, 1/100, 1/250, 1/500, and 1/1000 </td>
          <td rowSpan="2">Flood depths in meters over 30 arc second grid squares. </td>
          <td rowSpan="2">
            <ul>
              <li>1 current and 5 future climate models</li>
              <li>RCP 4.5 and 8.5 emission scenarios</li>
              <li>Current and future maps in 2030, 2050, 2080</li>
            </ul>
          </td>
        </tr>
        <tr>
          <td>Coastal flooding with subsidence (median value), from <a target="_blank" rel="noopener noreferrer" href="https://www.wri.org/data/aqueduct-floods-hazard-maps">WRI Aqueduct</a></td>
        </tr>
        <tr>
          <td>Cyclones, from <a target="_blank" rel="noopener noreferrer" href="https://data.4tu.nl/articles/dataset/STORM_tropical_cyclone_wind_speed_return_periods/12705164/2">STORM IBTrACS model</a></td>
          <td>28 different probabilities from 1/10 to 1/10000</td>
          <td>3-hour time step wind gust speeds in m/s at 0.1-degree grid squares.</td>
          <td>None</td>
        </tr>
      </tbody>
    </table>
  </div>
)

export default Help;
