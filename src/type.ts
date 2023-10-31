export type FlowDescriptionType = {
  seeding: string[];
  constraints: {
    maxDropRate: number;
    maxDropRateBump: number;
    maxSegmentNum: number;
    maxTrajectoryNum: number;
    maxTextureSize: number;
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
    projection2D: string;
    projection3D: string;
  };
  textureSize: {
    seeding: number[];
    flowField: number[];
    projection: number[];
  };
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
  PROJECTION_2D_IMAGE: "projection_2d_image",
  PROJECTION_3D_IMAGE: "projection_3d_image",
  FLOW_FIELD_TEXTURE: "flow_field_texture",
  SEEDING_TEXTURE: "seeding_texture",
  PROJECTION_2D_TEXTURE: "projection_2d_texture",
  PROJECTION_3D_TEXTURE: "projection_3d_texture",
  POOL_TEXTURE: "pool_texture",
};
