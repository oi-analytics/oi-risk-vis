import NetworkControl from "./NetworkControl";
import RiskControl from "./RiskControl";

function MapControl({
  map_style,
  dataLayers,
  onLayerVisChange,
  riskMetric,
  setRiskMetric,
  showHelp,
  toggleHelp,
  helpTopic,
}) {
  return (
    <div className="custom-map-control top-left">
      {dataLayers.length ? (
        <>
          <h2 className="h4">Select layers</h2>
          <NetworkControl
            onLayerVisChange={onLayerVisChange}
            dataLayers={dataLayers}
          />
        </>
      ) : null}
      {map_style === "regions" ? (
        <>
          <small>
            Max Total Expected Risk (EAD + EAEL for 30 day disruption, million
            US$)
          </small>
          <svg
            width="270"
            height="25"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
          >
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
            <g fill="none" fontSize="10" fontFamily="sans-serif"></g>
            <rect
              x="2"
              y="0"
              width="258"
              height="10"
              fill="url(#summary_gradient)"
            />
            <g
              fill="none"
              fontSize="10"
              transform="translate(2,10)"
              fontFamily="sans-serif"
              textAnchor="middle"
            >
              <g transform="translate(0.5,0)">
                <line stroke="currentColor" y2="3"></line>
                <text fill="currentColor" y="6" dy="0.71em">
                  0
                </text>
              </g>
              <g transform="translate(32.5,0)">
                <line stroke="currentColor" y2="3"></line>
                <text fill="currentColor" y="6" dy="0.71em">
                  0.1
                </text>
              </g>
              <g transform="translate(65,0)">
                <line stroke="currentColor" y2="3"></line>
                <text fill="currentColor" y="6" dy="0.71em">
                  0.5
                </text>
              </g>
              <g transform="translate(97.5,0)">
                <line stroke="currentColor" y2="3"></line>
                <text fill="currentColor" y="6" dy="0.71em">
                  2.5
                </text>
              </g>
              <g transform="translate(130,0)">
                <line stroke="currentColor" y2="3"></line>
                <text fill="currentColor" y="6" dy="0.71em">
                  10
                </text>
              </g>
              <g transform="translate(162.5,0)">
                <line stroke="currentColor" y2="3"></line>
                <text fill="currentColor" y="6" dy="0.71em">
                  50
                </text>
              </g>
              <g transform="translate(195,0)">
                <line stroke="currentColor" y2="3"></line>
                <text fill="currentColor" y="6" dy="0.71em">
                  250
                </text>
              </g>
              <g transform="translate(227.5,0)">
                <line stroke="currentColor" y2="3"></line>
                <text fill="currentColor" y="6" dy="0.71em">
                  1k
                </text>
              </g>
              <g transform="translate(257.5,0)">
                <line stroke="currentColor" y2="3"></line>
                <text fill="currentColor" y="6" dy="0.71em">
                  5k
                </text>
              </g>
            </g>
          </svg>
        </>
      ) : null}
      {map_style === "roads" ||
      map_style === "rail" ||
      map_style === "electricity" ? (
        <RiskControl setRiskMetric={setRiskMetric} riskMetric={riskMetric} />
      ) : null}
      {map_style === "roads" ? (
        <small>Road network data extracted from OpenStreetMap</small>
      ) : null}
      {map_style === "rail" ? (
        <div>
          <small>Rail network data extracted from OpenStreetMap</small>
        </div>
      ) : null}
      {map_style === "electricity" ? (
        <small>Energy network data extracted from Gridfinder</small>
      ) : null}
      {map_style === "hazards" || map_style === "overview" ? (
        <>
          <small>Coastal flood depth (m)</small>
          <svg
            width="270"
            height="25"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="coastal_gradient" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#9df4b0" />
                <stop offset="100%" stopColor="#0b601d" />
              </linearGradient>
            </defs>
            <g fill="none" fontSize="10" fontFamily="sans-serif"></g>
            <rect
              x="2"
              y="0"
              width="258"
              height="10"
              fill="url(#coastal_gradient)"
            />
            <g
              fill="none"
              fontSize="10"
              transform="translate(2,10)"
              fontFamily="sans-serif"
              textAnchor="middle"
            >
              <g transform="translate(0.5,0)">
                <line stroke="currentColor" y2="3"></line>
                <text fill="currentColor" y="6" dy="0.71em">
                  0
                </text>
              </g>
              <g transform="translate(130,0)">
                <line stroke="currentColor" y2="3"></line>
                <text fill="currentColor" y="6" dy="0.71em">
                  2.5
                </text>
              </g>
              <g transform="translate(257.5,0)">
                <line stroke="currentColor" y2="3"></line>
                <text fill="currentColor" y="6" dy="0.71em">
                  5
                </text>
              </g>
            </g>
          </svg>
          <small>Fluvial flood depth (m)</small>
          <svg
            width="270"
            height="25"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="fluvial_gradient" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#58cced" />
                <stop offset="100%" stopColor="#072f5f" />
              </linearGradient>
            </defs>
            <g fill="none" fontSize="10" fontFamily="sans-serif"></g>
            <rect
              x="2"
              y="0"
              width="258"
              height="10"
              fill="url(#fluvial_gradient)"
            />
            <g
              fill="none"
              fontSize="10"
              transform="translate(2,10)"
              fontFamily="sans-serif"
              textAnchor="middle"
            >
              <g transform="translate(0.5,0)">
                <line stroke="currentColor" y2="3"></line>
                <text fill="currentColor" y="6" dy="0.71em">
                  0
                </text>
              </g>
              <g transform="translate(130,0)">
                <line stroke="currentColor" y2="3"></line>
                <text fill="currentColor" y="6" dy="0.71em">
                  2.5
                </text>
              </g>
              <g transform="translate(257.5,0)">
                <line stroke="currentColor" y2="3"></line>
                <text fill="currentColor" y="6" dy="0.71em">
                  5
                </text>
              </g>
            </g>
          </svg>
          <small>Cyclone gust speed (m/s)</small>
          <svg
            width="270"
            height="25"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="cyclone_gradient" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="50%" stopColor="#f9d5cb" />
                <stop offset="100%" stopColor="#d44118" />
              </linearGradient>
            </defs>
            <g fill="none" fontSize="10" fontFamily="sans-serif"></g>
            <rect
              x="2"
              y="0"
              width="258"
              height="10"
              fill="url(#cyclone_gradient)"
            />
            <g
              fill="none"
              fontSize="10"
              transform="translate(2,10)"
              fontFamily="sans-serif"
              textAnchor="middle"
            >
              <g transform="translate(0.5,0)">
                <line stroke="currentColor" y2="3"></line>
                <text fill="currentColor" y="6" dy="0.71em">
                  0
                </text>
              </g>
              <g transform="translate(130,0)">
                <line stroke="currentColor" y2="3"></line>
                <text fill="currentColor" y="6" dy="0.71em">
                  25
                </text>
              </g>
              <g transform="translate(257.5,0)">
                <line stroke="currentColor" y2="3"></line>
                <text fill="currentColor" y="6" dy="0.71em">
                  50
                </text>
              </g>
            </g>
          </svg>
          <a href="#help" data-help-topic="hazards" onClick={toggleHelp}>
            {showHelp && helpTopic === "hazards" ? "Hide info" : "More info"}
          </a>
        </>
      ) : null}
    </div>
  );
}

export default MapControl;
