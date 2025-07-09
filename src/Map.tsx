import maplibregl, { StyleSpecification } from "maplibre-gl";
import React, { createElement, Component } from "react";
import { createRoot } from "react-dom/client";
import { Protocol } from "pmtiles";

import "maplibre-gl/dist/maplibre-gl.css";
import Tooltip from "./Tooltip";
import Help from "./Help";
import FeatureSidebar from "./FeatureSidebar";
import PositionControl from "./PositionControl";
import MapControl from "./MapControl";
import {
  drawFeature,
  get_calculated_paint_property,
  processFeature,
} from "./features";
import { DataLayerSpec, MapStyleName, MapSourceName } from "./types";

// This only needs to run once in the app lifecycle
// PMTiles docs suggest using React.useEffect, which
// only works in function components
let protocol = new Protocol();
maplibregl.addProtocol("pmtiles", protocol.tile);

type MapProps = {
  mapStyle: MapStyleName;
  mapLocation;
  setMapLocation;
  dataSources: Array<MapSourceName>;
  dataLayers: Array<DataLayerSpec>;
  tooltipLayerSources: Array<MapSourceName>;
  onRegionSelect?: Function;
  styleSpec: StyleSpecification | string;
};

class Map extends Component<MapProps, any, any> {
  tooltipContainer;
  tooltipRoot;
  mapContainer;
  map_style;
  map;

  state = {
    selectedFeature: undefined,
    scenario: "baseline",
    floodtype: "fluvial",
    floodlevel: {
      _1m2m: true,
      _2m3m: true,
      _3m4m: true,
      _4m999m: true,
    },
    showHelp: false,
    helpTopic: "",
    duration: 30,
    growth_rate_percentage: 2.8,
    riskMetric: "total",
  };
  constructor(props) {
    super(props);

    this.map = undefined;
    this.mapContainer = React.createRef();
    this.tooltipContainer = undefined;
    this.map_style = props.map_style;

    this.onLayerVisChange = this.onLayerVisChange.bind(this);
    this.setRiskMetric = this.setRiskMetric.bind(this);
    this.updateBCR = this.updateBCR.bind(this);
    this.toggleHelp = this.toggleHelp.bind(this);
  }

  setRiskMetric(riskMetric) {
    const map_style = this.props.mapStyle;
    this.setState({
      riskMetric: riskMetric,
    });
    const paint_color = get_calculated_paint_property(map_style, riskMetric);
    if (map_style === "roads") {
      this.map.setPaintProperty("trunk", "line-color", paint_color);
      this.map.setPaintProperty("primary", "line-color", paint_color);
      this.map.setPaintProperty("secondary", "line-color", paint_color);
      this.map.setPaintProperty("roads_other", "line-color", paint_color);
      this.map.setPaintProperty("motorway", "line-color", paint_color);
    }
    if (map_style === "rail" || map_style === "electricity") {
      this.map.setPaintProperty(map_style, "line-color", paint_color);
    }
  }

  setTooltip(features) {
    this.tooltipRoot.render(
      createElement(Tooltip, {
        features: features,
        map_style: this.map_style,
      })
    );
  }

  updateBCR(data) {
    const { duration, growth_rate_percentage } = data;

    this.setState({
      duration: duration,
      growth_rate_percentage: growth_rate_percentage,
    });
  }

  toggleHelp(e: Event) {
    const helpTopic = (e.target as HTMLElement).dataset.helpTopic;
    const showHelp = !this.state.showHelp || this.state.helpTopic !== helpTopic;
    this.setState({
      showHelp: showHelp,
      helpTopic: helpTopic,
    });
  }

  componentDidUpdate(
    prevProps: Readonly<MapProps>,
    prevState: Readonly<any>,
    snapshot?: any
  ): void {
    this.map.setStyle(this.props.styleSpec);
  }

  componentDidMount() {
    // Create Map
    const { lng, lat, zoom } = this.props.mapLocation;
    this.map = new maplibregl.Map({
      container: this.mapContainer.current,
      style: this.props.styleSpec,
      center: [lng, lat],
      zoom: zoom,
      minZoom: 3,
      maxZoom: 16,
      // disable rotate and pitch:
      dragRotate: false,
      touchZoomRotate: false,
      maxPitch: 0,
    });

    // Add controls
    this.map.addControl(
      new maplibregl.NavigationControl({
        showCompass: false,
      }),
      "top-right"
    );
    this.map.addControl(
      new maplibregl.ScaleControl({
        maxWidth: 80,
        unit: "metric",
      }),
      "bottom-left"
    );

    // Update location state on map move events
    this.map.on("move", () => {
      const { lng, lat } = this.map.getCenter();
      const zoom = this.map.getZoom();
      this.props.setMapLocation({ lng, lat, zoom });
    });

    // Update tooltip on mouse move events
    this.tooltipContainer = document.createElement("div");
    this.tooltipRoot = createRoot(this.tooltipContainer);

    const tooltip = new maplibregl.Marker({
      element: this.tooltipContainer,
      // offset to match width set in tooltip-body css
      offset: [-150, 0],
    })
      .setLngLat([0, 0])
      .addTo(this.map);

    this.map.on("mousemove", (e) => {
      const features = this.map.queryRenderedFeatures(e.point);

      const clickableFeatures = features.filter((f) =>
        this.props.dataSources.includes(f.source)
      );

      const tooltipFeatures = features.filter((f) =>
        this.props.tooltipLayerSources.includes(f.source)
      );

      this.map.getCanvas().style.cursor =
        clickableFeatures.length || tooltipFeatures.length ? "pointer" : "";

      tooltip.setLngLat(e.lngLat);
      this.setTooltip(tooltipFeatures.map(processFeature));
    });

    // Update selected feature on map click events
    this.map.on("click", (e) => {
      const features = this.map.queryRenderedFeatures(e.point);
      const clickableFeatures = features.filter((f) =>
        this.props.dataSources.includes(f.source)
      );

      const feature = clickableFeatures.length
        ? clickableFeatures[0]
        : undefined;

      if (this.props.onRegionSelect) {
        if (feature) {
          // pass region code up to App for RegionSummary to use
          this.props.onRegionSelect(feature.properties);
        } else {
          this.props.onRegionSelect(undefined);
        }
      } else {
        if (feature) {
          drawFeature(feature, this.map);
        } else {
          // remove current highlight
          if (this.map.getLayer("featureHighlight")) {
            this.map.removeLayer("featureHighlight");
            this.map.removeSource("featureHighlight");
          }
        }
        this.setState({
          selectedFeature: processFeature(feature),
        });
      }
    });
  }

  componentWillUnmount() {
    this.map.remove();
  }

  onLayerVisChange(e: Event) {
    const layer = (e.target as HTMLElement).dataset.layer;
    if ((e.target as HTMLInputElement).checked) {
      this.map.setLayoutProperty(layer, "visibility", "visible");
    } else {
      this.map.setLayoutProperty(layer, "visibility", "none");
    }
  }

  render() {
    const { selectedFeature } = this.state;
    const { mapStyle: map_style, dataLayers } = this.props;
    const { lng, lat, zoom } = this.props.mapLocation;

    return (
      <>
        <MapControl
          dataLayers={dataLayers}
          onLayerVisChange={this.onLayerVisChange}
          map_style={map_style}
          showHelp={this.state.showHelp}
          helpTopic={this.state.helpTopic}
          toggleHelp={this.toggleHelp}
          setRiskMetric={this.setRiskMetric}
          riskMetric={this.state.riskMetric}
        />
        {this.state.showHelp ? (
          <Help topic={this.state.helpTopic} />
        ) : (
          <FeatureSidebar
            feature={selectedFeature}
            updateBCR={this.updateBCR}
            duration={this.state.duration}
            growth_rate_percentage={this.state.growth_rate_percentage}
          />
        )}
        <PositionControl lat={lat} lng={lng} zoom={zoom} />
        <div
          ref={this.mapContainer}
          className={`map map-${this.props.mapStyle}`}
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
          }}
        />
      </>
    );
  }
}
export default Map;
