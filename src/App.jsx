import React, { Fragment, useState } from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';

import Nav from './Nav';
import Map from './Map';
import PageIntro from './PageIntro';
import RegionSummary from './RegionSummary';

import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'mapbox-gl/dist/mapbox-gl.css';

const App = () => {
  const [region, setRegion] = useState(undefined);
  return (
  <Router>
    <Fragment>
      <Route path="/" component={Nav}/>
      <main className="map-height">
      <Switch>
        <Route path="/overview">
          <Map
            map_style="overview"
            dataSources={[
              'electricity',
              'rail',
              'roads_main',
              'roads_other'
            ]}
            dataLayers={[
              {key: 'electricity', label: 'Power Grid', linear: true, color: "#ffebc4"},
              {key: 'rail', label: 'Railways', linear: true, color: "#444"},
              {key: 'trunk', label: 'Trunk Roads', linear: true, color: "#941339"},
              {key: 'motorway', label: 'Motorways', linear: true, color: "#941339"},
              {key: 'primary', label: 'Primary Roads', linear: true, color: "#cb3e4e"},
              {key: 'secondary', label: 'Secondary Roads', linear: true, color: "#8471a8"},
              {key: 'roads_other', label: 'Tertiary and Other Roads', linear: true, color: "#b2afaa"},
              {key:'coastal', label: 'Coastal flood depth (m), 100yr', color: "#9df4b0"},
              {key:'fluvial', label: 'Fluvial flood depth (m), 100yr', color: "#58cced"},
              {key:'cyclone', label: 'Cyclone gust speed (m/s), 100yr', color: "#f9d5cb"}
            ]}
            tooltipLayerSources={[
              'electricity',
              'rail',
              'roads_main',
              'roads_other',
              'coastal',
              'fluvial',
              'cyclone'
            ]}
            />
        </Route>
        <Route path="/roads">
          <Map
            map_style="roads"
            dataSources={[
              'roads_main',
              'roads_other'
            ]}
            dataLayers={[
              {key: 'trunk', label: 'Trunk Roads', linear: true, color: "#b2afaa"},
              {key: 'motorway', label: 'Motorways', linear: true, color: "#b2afaa"},
              {key: 'primary', label: 'Primary Roads', linear: true, color: "#b2afaa"},
              {key: 'secondary', label: 'Secondary Roads', linear: true, color: "#b2afaa"},
              {key: 'roads_other', label: 'Tertiary and Other Roads', linear: true, color: "#b2afaa"},
            ]}
            tooltipLayerSources={[
              'roads_main',
              'roads_other'
            ]}
            />
        </Route>
        <Route path="/rail">
          <Map
            map_style="rail"
            dataSources={[
              'rail'
            ]}
            dataLayers={[
              {key: 'rail', label: 'Railways', linear: true, color: "#444"},
            ]}
            tooltipLayerSources={[
              'rail'
            ]}
            />
        </Route>
        <Route path="/energy_network">
          <Map
            map_style="electricity"
            dataSources={[
              'electricity'
            ]}
            dataLayers={[
              {key: 'electricity', label: 'Power Grid', linear: true, color: "#ffebc4"},
            ]}
            tooltipLayerSources={[
              'electricity'
            ]}
            />
        </Route>
        <Route path="/hazards">
          <Map
            map_style="hazards"
            dataSources={[]}
            dataLayers={[
              {key:'coastal', label: 'Coastal flood depth (m), 100yr', color: "#9df4b0"},
              {key:'fluvial', label: 'Fluvial flood depth (m), 100yr', color: "#58cced"},
              {key:'cyclone', label: 'Cyclone gust speed (m/s), 100yr', color: "#f9d5cb"}
            ]}
            tooltipLayerSources={['coastal', 'fluvial', 'cyclone']}
            />
        </Route>
        <Route path="/summary">
          <div className="page-col-right">
            <RegionSummary region={region} />
          </div>
          <Map
            className="page-col-left"
            map_style="regions"
            dataSources={[
              'admin1'
            ]}
            dataLayers={[]}
            tooltipLayerSources={[
              'admin1'
            ]}
            onRegionSelect={setRegion}
            />
        </Route>
        <Route path="/" exact>
          <PageIntro />
        </Route>
      </Switch>
      </main>
    </Fragment>
  </Router>
)
}

export default App;
