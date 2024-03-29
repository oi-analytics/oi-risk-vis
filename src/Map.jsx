import React, { Fragment } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import mapboxgl from 'mapbox-gl'

import PositionControl from './PositionControl'
import Tooltip from './Tooltip'
import FeatureSidebar from './FeatureSidebar'
import Help from './Help'
import NetworkControl from './NetworkControl';
import RiskControl from './RiskControl';
import { commas } from './helpers'

/**
 * Process feature for tooltip/detail display
 *
 * Calculate damages     and losses
 *      in   USD         or  USD/day
 *      from USD million or  USD million / year
 * and save to features as formatted strings
 *
 * @param {object} f
 * @returns modified f
 */
function processFeature(f) {
  if (!f || !f.properties) {
    return f
  }
  let ead_min_usd, ead_max_usd, eael_annual_usd;

  if (f.source === 'electricity') {
    if (f.properties.EAEL) {
      // fix units - electricity EAEL is already in USD, everything else needs
      // multiplying by 1e6 to convert from USDmillions
      eael_annual_usd = f.properties.EAEL;
    } else {
      eael_annual_usd = 0
    }
    ead_min_usd = f.properties.EAD_min * 1e6 - eael_annual_usd;
    ead_max_usd = f.properties.EAD_max * 1e6 - eael_annual_usd;
  } else {
    if (f.properties.EAEL) {
      eael_annual_usd = f.properties.EAEL * 1e6;
    } else {
      eael_annual_usd = 0
    }
    ead_min_usd= f.properties.EAD_min * 1e6 - eael_annual_usd;
    ead_max_usd= f.properties.EAD_max * 1e6 - eael_annual_usd;
  }
  // report daily indirect numbers
  const eael_daily_usd = eael_annual_usd / 365;

  if (f.properties.EAD_min) {
    f.properties.EAD_min_usd = commas(ead_min_usd.toFixed(0))
    f.properties.total_EAL_min_usd = commas((ead_min_usd + eael_daily_usd * 30).toFixed(0))
  }
  if (f.properties.EAD_max) {
    f.properties.EAD_max_usd = commas(ead_max_usd.toFixed(0))
    f.properties.total_EAL_max_usd = commas((ead_max_usd + eael_daily_usd * 30).toFixed(0))
  }
  if (f.properties.EAEL) {
    f.properties.EAEL_daily_usd = commas(eael_daily_usd.toFixed(0))
  }
  return f
}

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lng: props.lng || 116.12,
      lat: props.lat || 7.89,
      zoom: props.zoom || 4,
      selectedFeature: undefined,
      scenario: 'baseline',
      floodtype: 'fluvial',
      floodlevel: {
        _1m2m: true,
        _2m3m: true,
        _3m4m: true,
        _4m999m: true
      },
      showHelp: false,
      duration: 30,
      growth_rate_percentage: 2.8,
      riskMetric: 'total'
    }
    this.map = undefined;
    this.mapContainer = React.createRef();
    this.tooltipContainer = undefined

    this.onLayerVisChange = this.onLayerVisChange.bind(this)
    this.setRiskMetric = this.setRiskMetric.bind(this)
    this.toggleHelp = this.toggleHelp.bind(this)
    this.updateBCR = this.updateBCR.bind(this)
    this.networkBaseLayerID = this.networkBaseLayerID.bind(this)
  }


  setRiskMetric(riskMetric) {
    const map_style = this.props.map_style;
    this.setState({
      riskMetric: riskMetric
    })

    let calc;

    if (map_style === 'electricity'){
      // EAD is in US$m, includes EAEL baked in
      // subtract EAEL (in US$) * 1e-6 to get true EAD in US$m
      if (riskMetric === 'EAD') {
        calc = [
          "-",
          ["get", "EAD_max"],
          [
            "*",
            1e-6,
            ["coalesce", ["get", "EAEL"], 0]
          ]
        ];
      }
      // EAEL here is in annual dollars, so multiply by
      // 1e-6 * (30/365)
      // to get 30-day disruption in US$m
      if (riskMetric === 'EAEL') {
        calc = [
          "*",
          1e-6 * (30/365),
          ["coalesce", ["get", "EAEL"], 0]
        ];
      }
      // For total, calculate
      // EAD subtract 1e-6 * (335/365) of EAEL
      // to get total assuming 30-day disruption
      if (riskMetric === 'total') {
        calc = [
          "-",
          ["get", "EAD_max"],
          [
            "*",
            1e-6 * (335/365),
            ["coalesce", ["get", "EAEL"], 0]
          ]
        ];
      }
    } else {
      // EAD has EAEL baked in to the numbers, all in $USm
      // EAD subtract EAEL to get direct only
      if (riskMetric === 'EAD') {
        calc = [
          "-",
          ["get", "EAD_max"],
          ["coalesce", ["get", "EAEL"], 0]
        ];
      }
      // EAEL calculate as 30/365 of annual
      if (riskMetric === 'EAEL') {
        calc = [
          "*",
          (30/365),
          ["coalesce", ["get", "EAEL"], 0]
        ];
      }
      // For total, calculate
      // EAD subtract 335/365 of EAEL (annual) to get total
      // assuming 30-day disruption
      if (riskMetric === 'total') {
        calc = [
          "-",
          ["get", "EAD_max"],
          [
            "*",
            (335/365),
            ["coalesce", ["get", "EAEL"], 0]
          ]
        ];
      }
    }

    const paint_color = [
      "interpolate-lab",
      ["linear"],
      calc,
      0,
      ["to-color", "#b2afaa"],
      0.000000001,
      ["to-color", "#fff"],
      0.001,
      ["to-color", "#fcfcb8"],
      0.01,
      ["to-color", "#ff9c66"],
      0.1,
      ["to-color", "#d03f6f"],
      1,
      ["to-color", "#792283"],
      10,
      ["to-color", "#3f0a72"],
      100,
      ["to-color", "#151030"]
    ];

    if (map_style === 'roads') {
      this.map.setPaintProperty('trunk', 'line-color', paint_color);
      this.map.setPaintProperty('primary', 'line-color', paint_color);
      this.map.setPaintProperty('secondary', 'line-color', paint_color);
      this.map.setPaintProperty('roads_other', 'line-color', paint_color);
      this.map.setPaintProperty('motorway', 'line-color', paint_color);

    }
    if (map_style === 'rail' || map_style === 'electricity' ) {
      this.map.setPaintProperty(map_style, 'line-color', paint_color);
    }
  }

  networkBaseLayerID() {
    // insert before (under) road/rail/bridges/air/water/labels
    return 'country_labels';
  }

  setTooltip(features) {
    ReactDOM.render(
      React.createElement(Tooltip, {features: features, map_style: this.props.map_style}),
      this.tooltipContainer
    );
  }

  updateBCR(data) {
    const { duration, growth_rate_percentage } = data;

    this.setState({
      duration: duration,
      growth_rate_percentage: growth_rate_percentage
    })
  }

  toggleHelp(e) {
    const helpTopic = e.target.dataset.helpTopic;
    const showHelp = !this.state.showHelp || this.state.helpTopic !== helpTopic;
    this.setState({
      showHelp: showHelp,
      helpTopic: helpTopic
    })
  }

  componentDidMount() {
    const { lng, lat, zoom } = this.state

    this.map = new mapboxgl.Map({
      container: this.mapContainer.current,
      style: `/styles/${this.props.map_style}/style.json`,
      center: [lng, lat],
      zoom: zoom,
      minZoom: 3,
      maxZoom: 16
    })

    var nav = new mapboxgl.NavigationControl();
    this.map.addControl(nav, 'top-right');

    var scale = new mapboxgl.ScaleControl({
        maxWidth: 80,
        unit: 'metric'
    });
    this.map.addControl(scale, 'bottom-left');

    this.map.on('move', () => {
      const { lng, lat } = this.map.getCenter()
      this.setState({
        lng: lng,
        lat: lat,
        zoom: this.map.getZoom()
      })
    })

    // Container to put React generated content in.
    this.tooltipContainer = document.createElement('div')

    const tooltip = new mapboxgl.Marker(
      this.tooltipContainer, {offset: [-150, 0]}  // offset to match width set in tooltip-body css
    ).setLngLat(
      [0,0]
    ).addTo(
      this.map
    )

    this.map.on('mousemove', (e) => {
      const features = this.map.queryRenderedFeatures(e.point);

      const clickableFeatures = features.filter(
        f => this.props.dataSources.includes(f.source)
      )

      const tooltipFeatures = features.filter(
        f => this.props.tooltipLayerSources.includes(f.source)
      )

      this.map.getCanvas().style.cursor = (
        clickableFeatures.length || tooltipFeatures.length
      )? 'pointer' : '';

      tooltip.setLngLat(e.lngLat);
      this.setTooltip(tooltipFeatures.map(processFeature));
    });

    this.map.on('click', (e) => {
      const features = this.map.queryRenderedFeatures(e.point);
      const clickableFeatures = features.filter(
        f => this.props.dataSources.includes(f.source)
      )

      const feature = (clickableFeatures.length)?
        clickableFeatures[0]
        : undefined;

      if (this.props.map_style === 'regions') {
        if (feature) {
          // pass region code up to App for RegionSummary to use
          this.props.onRegionSelect(feature.properties)
        } else {
          this.props.onRegionSelect(undefined)
        }
      } else {
        if (feature) {
          this.drawFeature(feature)
        } else {
          // remove current highlight
          if (this.map.getLayer('featureHighlight')) {
            this.map.removeLayer('featureHighlight');
            this.map.removeSource('featureHighlight');
          }
        }
        this.setState({
          selectedFeature: processFeature(feature)
        })
      }
    })
  }

  drawFeature(feature) {
    // remove current highlight
    if (this.map.getLayer('featureHighlight')) {
      this.map.removeLayer('featureHighlight');
      this.map.removeSource('featureHighlight');
    }

    // add highlight layer
    this.map.addSource('featureHighlight', {
      "type":"geojson",
      "data": feature.toJSON()
    });

    if (feature.layer.type === 'line') {
      this.map.addLayer({
        "id": "featureHighlight",
        "type": "line",
        "source": "featureHighlight",
        "layout": {
          "line-join": "round",
          "line-cap": "round"
        },
        "paint": {
          "line-color": "yellow",
          "line-width": {
            "base": 1,
            "stops": [[3, 1], [10, 8], [17, 16]]
          }
        }
      });
    }
    if (feature.layer.type === 'circle') {
      this.map.addLayer({
        "id": "featureHighlight",
        "type": "circle",
        "source": "featureHighlight",
        "paint": {
          "circle-color": "yellow",
          "circle-radius": {
            "base": 1,
            "stops": [[3, 4], [10, 12], [17, 20]]
          }
        }
      });
    }
  }

  componentDidUpdate(prev) {
    if (prev.map_style !== this.props.map_style) {
      fetch(`/styles/${this.props.map_style}/style.json`)
        .then(response => response.json())
        .then(data => {
          this.map.setStyle(data);
          const feature = this.state.selectedFeature;
          if (feature && this.props.dataSources.includes(feature.source)) {
            this.drawFeature(feature)
          }
          if (this.props.map_style === 'roads' || this.props.map_style === 'rail' || this.props.map_style === 'electricity') {
            this.setRiskMetric(this.state.riskMetric);
          }
        });
    }
  }

  componentWillUnmount() {
    this.map.remove();
  }

  onLayerVisChange(e) {
    const layer = e.target.dataset.layer
    if (e.target.checked) {
      this.map.setLayoutProperty(layer, 'visibility', 'visible')
    } else {
      this.map.setLayoutProperty(layer, 'visibility', 'none')
    }
  }

  render() {
    const { lng, lat, zoom, selectedFeature } = this.state
    const { map_style, dataLayers } = this.props

    return (
      <div className={this.props.className}>
        <div className="custom-map-control top-left">
          {
            (dataLayers.length)?
              <Fragment>
                <h2 className="h4">Select layers</h2>
                <NetworkControl
                  onLayerVisChange={this.onLayerVisChange}
                  dataLayers={dataLayers}
                  />
              </Fragment>
            : null
          }
          {
            (map_style === 'regions')?
              <Fragment>
              <small>Max Total Expected Risk (EAD + EAEL for 30 day disruption, million US$)</small>
              <svg width="270" height="25" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="summary_gradient" x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="12.5%" stopColor="#fee0d2" />
                    <stop offset="25%" stopColor="#fdc1a9" />
                    <stop offset="37.5%" stopColor="#fc9d7f" />
                    <stop offset="50%" stopColor="#fb7859" />
                    <stop offset="62.5%" stopColor="#f4513b" />
                    <stop offset="75%" stopColor="#de2c26" />
                    <stop offset="87.5%" stopColor="#bf161b" />
                    <stop offset="100%" stopColor="#950b13" />
                  </linearGradient>
                </defs>
                <g fill="none" fontSize="10" fontFamily="sans-serif">
                </g>
                <rect x="2" y="0" width="258" height="10" fill="url(#summary_gradient)"/>
                <g fill="none" fontSize="10" transform="translate(2,10)" fontFamily="sans-serif" textAnchor="middle">
                  <g transform="translate(0.5,0)">
                    <line stroke="currentColor" y2="3"></line>
                    <text fill="currentColor" y="6" dy="0.71em">0</text>
                  </g>
                  <g transform="translate(32.5,0)">
                    <line stroke="currentColor" y2="3"></line>
                    <text fill="currentColor" y="6" dy="0.71em">0.1</text>
                  </g>
                  <g transform="translate(65,0)">
                    <line stroke="currentColor" y2="3"></line>
                    <text fill="currentColor" y="6" dy="0.71em">0.5</text>
                  </g>
                  <g transform="translate(97.5,0)">
                    <line stroke="currentColor" y2="3"></line>
                    <text fill="currentColor" y="6" dy="0.71em">2.5</text>
                  </g>
                  <g transform="translate(130,0)">
                    <line stroke="currentColor" y2="3"></line>
                    <text fill="currentColor" y="6" dy="0.71em">10</text>
                  </g>
                  <g transform="translate(162.5,0)">
                    <line stroke="currentColor" y2="3"></line>
                    <text fill="currentColor" y="6" dy="0.71em">50</text>
                  </g>
                  <g transform="translate(195,0)">
                    <line stroke="currentColor" y2="3"></line>
                    <text fill="currentColor" y="6" dy="0.71em">250</text>
                  </g>
                  <g transform="translate(227.5,0)">
                    <line stroke="currentColor" y2="3"></line>
                    <text fill="currentColor" y="6" dy="0.71em">1k</text>
                  </g>
                  <g transform="translate(257.5,0)">
                    <line stroke="currentColor" y2="3"></line>
                    <text fill="currentColor" y="6" dy="0.71em">5k</text>
                  </g>
                </g>
              </svg>
              </Fragment>
              : null
          }
          {
            (map_style === 'roads' || map_style === 'rail' || map_style === 'electricity')?
              <RiskControl setRiskMetric={this.setRiskMetric} riskMetric={this.state.riskMetric} />
              : null
          }
          {
            (map_style === 'roads')?
              <small>
                Road network data extracted from OpenStreetMap
              </small>
              : null
          }
          {
            (map_style === 'rail')?
              <div>
                <small>
                  Rail network data extracted from OpenStreetMap
                </small>
              </div>
               : null
          }
          {
            (map_style === 'electricity')?
              <small>
                Energy network data extracted from Gridfinder
              </small> : null
          }
          {
            (map_style === 'hazards' || map_style === 'overview')?
            <Fragment>
            <small>Coastal flood depth (m)</small>
            <svg width="270" height="25" version="1.1" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="coastal_gradient" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor="#9df4b0" />
                  <stop offset="100%" stopColor="#0b601d" />
                </linearGradient>
              </defs>
              <g fill="none" fontSize="10" fontFamily="sans-serif">
              </g>
              <rect x="2" y="0" width="258" height="10" fill="url(#coastal_gradient)"/>
              <g fill="none" fontSize="10" transform="translate(2,10)" fontFamily="sans-serif" textAnchor="middle">
                <g transform="translate(0.5,0)">
                  <line stroke="currentColor" y2="3"></line>
                  <text fill="currentColor" y="6" dy="0.71em">0</text>
                </g>
                <g transform="translate(130,0)">
                  <line stroke="currentColor" y2="3"></line>
                  <text fill="currentColor" y="6" dy="0.71em">2.5</text>
                </g>
                <g transform="translate(257.5,0)">
                  <line stroke="currentColor" y2="3"></line>
                  <text fill="currentColor" y="6" dy="0.71em">5</text>
                </g>
              </g>
            </svg>
            <small>Fluvial flood depth (m)</small>
            <svg width="270" height="25" version="1.1" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="fluvial_gradient" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor="#58cced" />
                  <stop offset="100%" stopColor="#072f5f" />
                </linearGradient>
              </defs>
              <g fill="none" fontSize="10" fontFamily="sans-serif">
              </g>
              <rect x="2" y="0" width="258" height="10" fill="url(#fluvial_gradient)"/>
              <g fill="none" fontSize="10" transform="translate(2,10)" fontFamily="sans-serif" textAnchor="middle">
                <g transform="translate(0.5,0)">
                  <line stroke="currentColor" y2="3"></line>
                  <text fill="currentColor" y="6" dy="0.71em">0</text>
                </g>
                <g transform="translate(130,0)">
                  <line stroke="currentColor" y2="3"></line>
                  <text fill="currentColor" y="6" dy="0.71em">2.5</text>
                </g>
                <g transform="translate(257.5,0)">
                  <line stroke="currentColor" y2="3"></line>
                  <text fill="currentColor" y="6" dy="0.71em">5</text>
                </g>
              </g>
            </svg>
            <small>Cyclone gust speed (m/s)</small>
            <svg width="270" height="25" version="1.1" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="cyclone_gradient" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="50%" stopColor="#f9d5cb" />
                  <stop offset="100%" stopColor="#d44118" />
                </linearGradient>
              </defs>
              <g fill="none" fontSize="10" fontFamily="sans-serif">
              </g>
              <rect x="2" y="0" width="258" height="10" fill="url(#cyclone_gradient)"/>
              <g fill="none" fontSize="10" transform="translate(2,10)" fontFamily="sans-serif" textAnchor="middle">
                <g transform="translate(0.5,0)">
                  <line stroke="currentColor" y2="3"></line>
                  <text fill="currentColor" y="6" dy="0.71em">0</text>
                </g>
                <g transform="translate(130,0)">
                  <line stroke="currentColor" y2="3"></line>
                  <text fill="currentColor" y="6" dy="0.71em">25</text>
                </g>
                <g transform="translate(257.5,0)">
                  <line stroke="currentColor" y2="3"></line>
                  <text fill="currentColor" y="6" dy="0.71em">50</text>
                </g>
              </g>
            </svg>
            <a href="#help" data-help-topic="hazards" onClick={this.toggleHelp}>
              { (this.state.showHelp && this.state.helpTopic === "hazards")? 'Hide info' : 'More info' }
            </a>
            </Fragment>
            : null
          }
        </div>

        {
          (this.state.showHelp)?
            <Help topic={this.state.helpTopic} />
            : <FeatureSidebar
                feature={selectedFeature}
                updateBCR={this.updateBCR}
                duration={this.state.duration}
                growth_rate_percentage={this.state.growth_rate_percentage}
                />
        }
        <PositionControl lat={lat} lng={lng} zoom={zoom} />
        <div ref={this.mapContainer} className="map" />
      </div>
    );
  }
}

Map.propTypes = {
  map_style: PropTypes.string.isRequired,
  toggleableLayerIds: PropTypes.array,
  clickableLayerAttributes: PropTypes.object
}

export default Map
