declare module "flow" {
  export class FlowMapbox {
    constructor(option: {
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
        projectionMapbox: string;
        projectionCesium: string;
        projectionOl: string;
      };
      textureSize: {
        seeding: number[];
        flowField: number[];
        projection: number[];
      };
    });

    generateCustomLayer(id: string): Promise<{
      id: any;
      type: string;
      onAdd(map: any, gl: any): void;
      render(gl: any, matrix: any): void;
    }>;
  }
}
