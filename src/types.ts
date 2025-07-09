import { MouseEventHandler } from "react";

export enum RiskMetric {
  EAD = "EAD",
  EAEL = "EAEL",
  total = "total",
}

export type Feature = {
  source: string;
  properties: any;
};

export type DataLayerSpec = {
  key: MapLayerName;
  label: string;
  linear: boolean;
  color: string;
};

export enum MapStyleName {
  OVERVIEW = "overview",
  ROADS = "roads",
  RAIL = "rail",
  ELECTRICITY = "electricity",
  HAZARDS = "hazards",
  REGIONS = "regions",
}

export enum MapSourceName {
  ELECTRICITY = "electricity",
  RAIL = "rail",
  ROADS_MAIN = "roads_main",
  ROADS_OTHER = "roads_other",
  COASTAL = "coastal",
  FLUVIAL = "fluvial",
  CYCLONE = "cyclone",
  ADMIN1 = "admin1",
}

export enum MapLayerName {
  ELECTRICITY = "electricity",
  RAIL = "rail",
  TRUNK = "trunk",
  MOTORWAY = "motorway",
  PRIMARY = "primary",
  SECONDARY = "secondary",
  ROADS_OTHER = "roads_other",
  COASTAL = "coastal",
  FLUVIAL = "fluvial",
  CYCLONE = "cyclone",
}
