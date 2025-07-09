import { commas } from "./helpers";
import { Feature, RiskMetric } from "./types";

/**
 * Process feature for tooltip/detail display
 *
 * Calculate damages     and losses
 *      in   USD         or  USD/day
 *      from USD million or  USD million / year
 * and save to features as formatted strings
 */
function processFeature(f: Feature): Feature {
  if (!f || !f.properties) {
    return f;
  }
  let ead_min_usd: number, ead_max_usd: number, eael_annual_usd: number;

  if (f.source === "electricity") {
    if (f.properties.EAEL) {
      // fix units - electricity EAEL is already in USD, everything else needs
      // multiplying by 1e6 to convert from USDmillions
      eael_annual_usd = f.properties.EAEL;
    } else {
      eael_annual_usd = 0;
    }
    ead_min_usd = f.properties.EAD_min * 1e6 - eael_annual_usd;
    ead_max_usd = f.properties.EAD_max * 1e6 - eael_annual_usd;
  } else {
    if (f.properties.EAEL) {
      eael_annual_usd = f.properties.EAEL * 1e6;
    } else {
      eael_annual_usd = 0;
    }
    ead_min_usd = f.properties.EAD_min * 1e6 - eael_annual_usd;
    ead_max_usd = f.properties.EAD_max * 1e6 - eael_annual_usd;
  }
  // report daily indirect numbers
  const eael_daily_usd = eael_annual_usd / 365;

  if (f.properties.EAD_min) {
    f.properties.EAD_min_usd = commas(+ead_min_usd.toFixed(0));
    f.properties.total_EAL_min_usd = commas(
      +(ead_min_usd + eael_daily_usd * 30).toFixed(0)
    );
  }
  if (f.properties.EAD_max) {
    f.properties.EAD_max_usd = commas(+ead_max_usd.toFixed(0));
    f.properties.total_EAL_max_usd = commas(
      +(ead_max_usd + eael_daily_usd * 30).toFixed(0)
    );
  }
  if (f.properties.EAEL) {
    f.properties.EAEL_daily_usd = commas(+eael_daily_usd.toFixed(0));
  }
  return f;
}

function drawFeature(feature, map) {
  // remove current highlight
  if (map.getLayer("featureHighlight")) {
    map.removeLayer("featureHighlight");
    map.removeSource("featureHighlight");
  }

  // add highlight layer
  map.addSource("featureHighlight", {
    type: "geojson",
    data: feature.toJSON(),
  });

  if (feature.layer.type === "line") {
    map.addLayer({
      id: "featureHighlight",
      type: "line",
      source: "featureHighlight",
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "yellow",
        "line-width": {
          base: 1,
          stops: [
            [3, 1],
            [10, 8],
            [17, 16],
          ],
        },
      },
    });
  }
  if (feature.layer.type === "circle") {
    map.addLayer({
      id: "featureHighlight",
      type: "circle",
      source: "featureHighlight",
      paint: {
        "circle-color": "yellow",
        "circle-radius": {
          base: 1,
          stops: [
            [3, 4],
            [10, 12],
            [17, 20],
          ],
        },
      },
    });
  }
}

function get_calculated_paint_property(
  map_style: string,
  riskMetric: RiskMetric
): Array<any> {
  let calc: Array<any> = [];

  if (map_style === "electricity") {
    // EAD is in US$m, includes EAEL baked in
    // subtract EAEL (in US$) * 1e-6 to get true EAD in US$m
    if (riskMetric === RiskMetric.EAD) {
      calc = [
        "-",
        ["get", "EAD_max"],
        ["*", 1e-6, ["coalesce", ["get", "EAEL"], 0]],
      ];
    }
    // EAEL here is in annual dollars, so multiply by
    // 1e-6 * (30/365)
    // to get 30-day disruption in US$m
    if (riskMetric === RiskMetric.EAEL) {
      calc = ["*", 1e-6 * (30 / 365), ["coalesce", ["get", "EAEL"], 0]];
    }
    // For total, calculate
    // EAD subtract 1e-6 * (335/365) of EAEL
    // to get total assuming 30-day disruption
    if (riskMetric === RiskMetric.total) {
      calc = [
        "-",
        ["get", "EAD_max"],
        ["*", 1e-6 * (335 / 365), ["coalesce", ["get", "EAEL"], 0]],
      ];
    }
  } else {
    // EAD has EAEL baked in to the numbers, all in $USm
    // EAD subtract EAEL to get direct only
    if (riskMetric === RiskMetric.EAD) {
      calc = ["-", ["get", "EAD_max"], ["coalesce", ["get", "EAEL"], 0]];
    }
    // EAEL calculate as 30/365 of annual
    if (riskMetric === RiskMetric.EAEL) {
      calc = ["*", 30 / 365, ["coalesce", ["get", "EAEL"], 0]];
    }
    // For total, calculate
    // EAD subtract 335/365 of EAEL (annual) to get total
    // assuming 30-day disruption
    if (riskMetric === RiskMetric.total) {
      calc = [
        "-",
        ["get", "EAD_max"],
        ["*", 335 / 365, ["coalesce", ["get", "EAEL"], 0]],
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
    ["to-color", "#151030"],
  ];

  return paint_color;
}

export { drawFeature, processFeature, get_calculated_paint_property };
