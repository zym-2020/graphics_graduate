export type FlowDescriptionType = {
  seeding: string[];
  constraints: {
    minSpeedFactor: number;
    minTrajectoryNum: number;
    minSegmentNum: number;
    minFillWidth: number;
    minAAWidth: number;
    minFixedDropRate: number;
    minExtraDropRate: number;
    maxSpeedFactor: number;
    maxTrajectoryNum: number;
    maxSegmentNum: number;
    maxFillWidth: number;
    maxAAWidth: number;
    maxFixedDropRate: number;
    maxExtraDropRate: number;

    maxTextureSize: number;
  };
  parameter: {
    speedFactor: number;
    tracksNumber: number;
    segmentNumber: number;
    fillWidth: number;
    aaWidth: number;
    color: number;
    primitive: number;
    fixedDropRate: number;
    extraDropRate: number;
  };
  extent: number[];
  flowBoundary: {
    uMax: number;
    uMin: number;
    vMax: number;
    vMin: number;
  };
  flowFields: string[];
  projection: {
    projectionMapbox: string;
    projectionCesium: string;
    projectionOl: string;
  };
  textureSize: {
    seeding: number[];
    flowField: number[];
    projection: number[];
  };

  frequency?: number;
  lineNumber?: number;
};

export const FlowEnum = {
  UPDATE_VERTEX: "update_vertex",
  UPDATE_FRAGMENT: "update_fragment",
  TRAJECTORY_VERTEX: "trajectory_vertex",
  TRAJECTORY_FRAGMENT: "trajectory_fragment",
  POINT_VERTEX: "point_vertex",
  POINT_FRAGMENT: "point_fragment",
  POOL_VERTEX: "pool_vertex",
  POOL_FRAGMENT: "pool_fragment",
  FLOW_FIELD_IMAGE: "flow_field_image",
  SEEDING_IMAGE: "seeding_image",
  PROJECTION_MAPBOX_IMAGE: "projection_mapbox_image",
  PROJECTION_CESIUM_IMAGE: "projection_cesium_image",
  PROJECTION_OL_IMAGE: "projection_ol_image",
  FLOW_FIELD_TEXTURE: "flow_field_texture",
  SEEDING_TEXTURE: "seeding_texture",
  PROJECTION_MAPBOX_TEXTURE: "projection_mapbox_texture",
  PROJECTION_CESIUM_TEXTURE: "projection_cesium_texture",
  PROJECTION_OL_TEXTURE: "projection_ol_texture",
  POOL_TEXTURE: "pool_texture",
};

export type EventObj = {
  speedFactor: () => {};
  tracksNumber: () => {};
  segmentNumber: () => {};
  fillWidth: () => {};
  aaWidth: () => {};
  color: () => {};
  primitive: () => {};
  fixedDropRate: () => {};
  extraDropRate: () => {};
};
