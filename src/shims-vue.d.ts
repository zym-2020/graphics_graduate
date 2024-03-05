/* eslint-disable */
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module "element-plus/dist/locale/zh-cn.mjs";

declare module "@/utils/flow-utils.js" {
  import WebGLTileLayer from "ol/layer/WebGLTile.js";
  import { EventObj, FlowDescriptionType } from "@/type";
  export class FlowMapbox {
    imagePre: number;
    count: number;
    frequency: number;
    eventObj: EventObj;
    option: FlowDescriptionType;
    constructor(option: FlowDescriptionType);

    generateCustomLayer(id: string): Promise<{
      id: string;
      type: "custom";
      onAdd(map: any, gl: any): void;
      render(gl: any, matrix: any): void;
    }>;

    changeState(index: number): void;
  }

  export class FlowCesium {
    imagePre: number;
    count: number;
    frequency: number;
    eventObj: EventObj;
    option: FlowDescriptionType;
    constructor(option: FlowDescriptionType);

    prepareAsyncImage(): Promise<void>;

    render(gl: WebGL2RenderingContext, matrix: number[]): void;

    changeState(index: number): void;
  }

  export class FlowOpenLayers extends WebGLTileLayer {
    imagePre: number;
    count: number;
    frequency: number;
    eventObj: EventObj;
    option: FlowDescriptionType;
    constructor(option: FlowDescriptionType);

    prepareAsyncImage(): Promise<void>;

    render(gl: WebGL2RenderingContext, matrix: number[]): void;

    changeState(index: number): void;
  }
}
