
/* eslint-disable */
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module "element-plus/dist/locale/zh-cn.mjs";

declare module "@/utils/flow-utils.js" {
  import WebGLTileLayer from "ol/layer/WebGLTile.js";
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

      frequency?: number;
      lineNumber?: number;
    });

    generateCustomLayer(id: string): Promise<{
      id: string;
      type: "custom";
      onAdd(map: any, gl: any): void;
      render(gl: any, matrix: any): void;
    }>;

    changeState(index: number): void;
  }

  export class FlowCesium {
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

      frequency?: number;
      lineNumber?: number;
    });

    prepareAsyncImage(): Promise<void>;

    render(gl: WebGL2RenderingContext, matrix: number[]): void;

    changeState(index: number): void;
  }

  export class FlowOpenLayers extends WebGLTileLayer {
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

      frequency?: number;
      lineNumber?: number;
    });

    prepareAsyncImage(): Promise<void>;

    changeState(index: number): void;
  }
}
