import * as Cesium from "cesium";
import axios from "axios";
import { encodeFloatToDouble } from "@/utils/common";
import { mat4 } from "gl-matrix";
import { Viewer } from "cesium";

export class SymbolCustomPrimitive {
  view: Viewer;
  attributeLocations;
  vertexScript;
  fragmentScript;
  positionHeight;
  positionLow;
  simpleArray;
  rotationArray;
  symbolTextureImage;
  paletteTextureImage;
  u_symbolMatrix;
  u_bufferSize;

  commandToExecute: any;
  constructor(option: {
    view: Viewer;
    attributeLocations: { [key: string]: number };
    vertexScript: string;
    fragmentScript: string;
    positionHeight: number[];
    positionLow: number[];
    simpleArray: number[];
    rotationArray: number[];
    symbolTextureImage: HTMLImageElement;
    paletteTextureImage: HTMLImageElement;

    u_bufferSize: number[];
  }) {
    this.view = option.view;
    this.attributeLocations = option.attributeLocations;
    this.vertexScript = option.vertexScript;
    this.fragmentScript = option.fragmentScript;
    this.positionHeight = option.positionHeight;
    this.positionLow = option.positionLow;
    this.simpleArray = option.simpleArray;
    this.rotationArray = option.rotationArray;
    this.symbolTextureImage = option.symbolTextureImage;
    this.paletteTextureImage = option.paletteTextureImage;

    const modelMatrix = mat4.create();
    mat4.identity(modelMatrix);
    mat4.scale(modelMatrix, modelMatrix, [50 * window.devicePixelRatio, 50 * window.devicePixelRatio, 1.0]);
    this.u_symbolMatrix = modelMatrix;
    this.u_bufferSize = option.u_bufferSize;
  }

  getVertexArray(context: any) {
    // const buffer = (Cesium as any).Buffer.createVertexBuffer({
    //   context: context,
    //   usage: (Cesium as any).BufferUsage.STATIC_DRAW,
    //   typedArray: new Float32Array([...this.simpleArray, ...this.positionHeight, ...this.positionLow, ...this.rotationArray]),
    // });
    const simpleBuffer = (Cesium as any).Buffer.createVertexBuffer({
      context: context,
      usage: (Cesium as any).BufferUsage.STATIC_DRAW,
      typedArray: new Float32Array(this.simpleArray),
    });
    const positionHeightBuffer = (Cesium as any).Buffer.createVertexBuffer({
      context: context,
      usage: (Cesium as any).BufferUsage.STATIC_DRAW,
      typedArray: new Float32Array(this.positionHeight),
    });
    const positionLowBuffer = (Cesium as any).Buffer.createVertexBuffer({
      context: context,
      usage: (Cesium as any).BufferUsage.STATIC_DRAW,
      typedArray: new Float32Array(this.positionLow),
    });
    const rotationBuffer = (Cesium as any).Buffer.createVertexBuffer({
      context: context,
      usage: (Cesium as any).BufferUsage.STATIC_DRAW,
      typedArray: new Float32Array(this.rotationArray),
    });

    const VAO = new (Cesium as any).VertexArray({
      context: context,
      attributes: [
        {
          index: 1,
          enabled: true,
          vertexBuffer: simpleBuffer,
          componentsPerAttribute: 4,
          componentDatatype: Cesium.ComponentDatatype.FLOAT,
          normalize: false,
          offseInBytes: 0,
          strideInBytes: (Cesium.ComponentDatatype as any).getSizeInBytes(Cesium.ComponentDatatype.FLOAT) * 4,
          instanceDivisor: 1,
        },
        {
          index: 2,
          enabled: true,
          vertexBuffer: positionHeightBuffer,
          componentsPerAttribute: 3,
          componentDatatype: Cesium.ComponentDatatype.FLOAT,
          normalize: false,
          offseInBytes: 0,
          strideInBytes: (Cesium.ComponentDatatype as any).getSizeInBytes(Cesium.ComponentDatatype.FLOAT) * 3,
          instanceDivisor: 1,
        },
        {
          index: 3,
          enabled: true,
          vertexBuffer: positionLowBuffer,
          componentsPerAttribute: 3,
          componentDatatype: Cesium.ComponentDatatype.FLOAT,
          normalize: false,
          offseInBytes: (Cesium.ComponentDatatype as any).getSizeInBytes(Cesium.ComponentDatatype.FLOAT) * 8 * this.rotationArray.length,
          strideInBytes: (Cesium.ComponentDatatype as any).getSizeInBytes(Cesium.ComponentDatatype.FLOAT) * 4,
          instanceDivisor: 1,
        },
        {
          index: 4,
          enabled: true,
          vertexBuffer: rotationBuffer,
          componentsPerAttribute: 1,
          componentDatatype: Cesium.ComponentDatatype.FLOAT,
          normalize: false,
          offseInBytes: (Cesium.ComponentDatatype as any).getSizeInBytes(Cesium.ComponentDatatype.FLOAT) * 12 * this.rotationArray.length,
          strideInBytes: (Cesium.ComponentDatatype as any).getSizeInBytes(Cesium.ComponentDatatype.FLOAT),
          instanceDivisor: 1,
        },
      ],
    });
    return VAO;
  }

  getShaderProgram(context: any) {
    return (Cesium as any).ShaderProgram.fromCache({
      context: context,
      vertexShaderSource: this.vertexScript,
      fragmentShaderSource: this.fragmentScript,
      attributeLocations: this.attributeLocations,
    });
  }

  getTexture(context: any, data: HTMLImageElement) {
    return new (Cesium as any).Texture({
      context: context,
      source: data,
      flipY: false,
      sampler: new (Cesium as any).Sampler({
        minificationFilter: Cesium.TextureMinificationFilter.NEAREST,
        magnificationFilter: Cesium.TextureMagnificationFilter.NEAREST,
      }),
    });
  }

  getUniformMap(context: any) {
    return {
      symbolTexture: () => {
        return this.getTexture(context, this.symbolTextureImage);
      },
      paletteTexture: () => {
        return this.getTexture(context, this.paletteTextureImage);
      },
      u_symbolMatrix: () => {
        return new Cesium.Matrix4(...this.u_symbolMatrix);
      },
      u_bufferSize: () => {
        return new Cesium.Cartesian2(...this.u_bufferSize);
      },
      u_cartesianCenterHigh: () => {
        const center = this.view.camera.position;

        const cartesianX = encodeFloatToDouble(center.x);
        const cartesianY = encodeFloatToDouble(center.y);
        const cartesianZ = encodeFloatToDouble(center.z);
        return new Cesium.Cartesian3(cartesianX[0], cartesianY[0], cartesianZ[0]);
      },
      u_cartesianCenterLow: () => {
        const center = this.view.camera.position;

        const cartesianX = encodeFloatToDouble(center.x);
        const cartesianY = encodeFloatToDouble(center.y);
        const cartesianZ = encodeFloatToDouble(center.z);
        return new Cesium.Cartesian3(cartesianX[1], cartesianY[1], cartesianZ[1]);
      },
      color: () => {
        return new Cesium.Cartesian3(Math.random(), Math.random(), Math.random());
      },
    };
  }

  createCommand(context: any) {
    // const renderState = (Cesium as any).RenderState.fromCache({
    //   cull: {
    //     enabled: true,
    //     face: Cesium.CullFace.BACK,
    //   },
    //   depthTest: {
    //     enabled: false,
    //   },

    //   blending: {
    //     enabled: true,
    //     equationRgb: Cesium.BlendEquation.ADD,
    //     equationAlpha: Cesium.BlendEquation.ADD,
    //     functionSourceRgb: Cesium.BlendFunction.ONE,
    //     functionSourceAlpha: Cesium.BlendFunction.ONE,
    //     functionDestinationRgb: Cesium.BlendFunction.ONE_MINUS_SOURCE_ALPHA,
    //     functionDestinationAlpha: Cesium.BlendFunction.ONE_MINUS_SOURCE_ALPHA,
    //   },
    // });
    const renderState = createRawRenderState({
      // undefined value means let Cesium deal with it
      viewport: undefined,
      depthTest: {
        enabled: false,
      },
      depthMask: false,
      blending: {
        enabled: false,
      },
      cull: {
        enabled: false,
        face: Cesium.CullFace.BACK,
      },
    });

    return new (Cesium as any).DrawCommand({
      owner: this,
      vertexArray: this.getVertexArray(context),
      count: 64,
      instanceCount: this.rotationArray.length,
      // instanceCount: 1,
      // primitiveType: Cesium.PrimitiveType.POINTS,
      primitiveType: Cesium.PrimitiveType.TRIANGLE_STRIP,
      uniformMap: this.getUniformMap(context),
      shaderProgram: this.getShaderProgram(context),
      renderState: (Cesium as any).RenderState.fromCache(renderState),
      pass: (Cesium as any).Pass.OPAQUE,
    });
  }

  update(frameState: any) {
    // if (!this.show) return;
    // if you do not want to show the CustomPrimitive, use return statement to bypass the update
    console.log(123)
    // if (!Cesium.defined(this.commandToExecute)) {
    //   this.commandToExecute = this.createCommand(frameState.context);
    // }
    // frameState.commandList.push(this.commandToExecute);
  }

  isDestroyed() {
    // return true or false to indicate whether the CustomPrimitive is destroyed
  }

  destroy() {
    // this method will be called when the CustomPrimitive is no longer used
  }
}

export const initResource = async (
  type: string,
  number: number,
  positionJsonAddress: string,
  infoJsonAddress: string,
  vertexScriptAddress: string,
  fragmentScriptAddress: string,
  stripAddress: string,
  paletteAddress: string
) => {
  const positionPromise = new Promise((resolve, reject) => {
    axios.get(positionJsonAddress).then((res) => resolve(res.data));
  });
  const infoPromise = new Promise((resolve, reject) => {
    axios.get(infoJsonAddress).then((res) => resolve(res.data));
  });
  const vertexScriptPromise = getShader(vertexScriptAddress);
  const fragmentScriptPromise = getShader(fragmentScriptAddress);
  const stripImage = getImage(stripAddress);
  const paletteImage = getImage(paletteAddress);
  const simpleArray: number[] = [];
  const positionHeight: number[] = [];
  const positionLow: number[] = [];
  const rotationArray: number[] = [];
  return Promise.all([infoPromise, positionPromise, vertexScriptPromise, fragmentScriptPromise, stripImage, paletteImage]).then((res) => {
    const arr = (res[0] as any).markers.description;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].name === type) {
        const instanceNum = Math.ceil(arr[i].length / number);
        for (let j = 0; j < (res[1] as any).features.length; j++) {
          const item = (res[1] as any).features[j];
          const coord = Cesium.Cartesian3.fromDegrees(item.geometry.coordinates[0], item.geometry.coordinates[1]);
          // positionHeight.push(coord.x, coord.y, coord.z);
          for (let k = 0; k < instanceNum; k++) {
            simpleArray.push(arr[i].base, arr[i].length, k, arr[i].ID);

            const positionX = encodeFloatToDouble(coord.x);
            const positionY = encodeFloatToDouble(coord.y);
            const positionZ = encodeFloatToDouble(coord.z);
            // positionHeight.push(positionX[0], positionY[0], positionZ[0]);
            positionHeight.push(coord.x, coord.y, coord.z);
            positionLow.push(positionX[1], positionY[1], positionZ[1]);
            rotationArray.push(0);
          }
        }
      }
    }
    return [simpleArray, positionHeight, positionLow, rotationArray, res[2], res[3], res[4], res[5]];
  });
};

async function getShader(address: string) {
  const shaderScript = await axios.get(address).then((res) => res.data);
  return shaderScript;
}

async function getImage(address: string) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = address;
    image.onload = () => {
      resolve(image);
    };
  }).then((res) => res);
}

const createRawRenderState = function (options: any) {
  var translucent = true;
  var closed = false;
  var existing = {
    viewport: options.viewport,
    depthTest: options.depthTest,
    depthMask: options.depthMask,
    blending: options.blending,
  };

  var rawRenderState = (Cesium as any).Appearance.getDefaultRenderState(translucent, closed, existing);
  return rawRenderState;
};

// export class TestPrimitive {
//   attributeLocations;
//   vertexScript;
//   fragmentScript;

//   commandToExecute: any;
//   image: HTMLImageElement;
//   constructor(option: { attributeLocations: { [key: string]: number }; vertexScript: string; fragmentScript: string; textureImage: HTMLImageElement }) {
//     this.attributeLocations = option.attributeLocations;
//     this.vertexScript = option.vertexScript;
//     this.fragmentScript = option.fragmentScript;
//     this.image = option.textureImage;
//   }

//   getVertexArray(context: any) {
//     const getCoordinate = (lon: number, lat: number) => {
//       const res = Cesium.Cartesian3.fromDegrees(lon, lat);
//       return [res.x, res.y, res.z];
//     };

//     const buffer = (Cesium as any).Buffer.createVertexBuffer({
//       context: context,
//       usage: (Cesium as any).BufferUsage.STATIC_DRAW,
//       typedArray: new Float32Array([...getCoordinate(119, 32), ...getCoordinate(120, 32), ...getCoordinate(119, 31), ...getCoordinate(119, 31), ...getCoordinate(120, 31), ...getCoordinate(120, 32)]),
//     });

//     const textureCoor = (Cesium as any).Buffer.createVertexBuffer({
//       context: context,
//       usage: (Cesium as any).BufferUsage.STATIC_DRAW,
//       typedArray: new Float32Array([0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1]),
//     });

//     const VAO = new (Cesium as any).VertexArray({
//       context: context,
//       attributes: [
//         {
//           index: 1,
//           vertexBuffer: buffer,
//           componentsPerAttribute: 3,
//           componentDatatype: Cesium.ComponentDatatype.FLOAT,
//           normalize: false,
//           // offseInBytes: 0,
//           // strideInByes: 0,
//           // instanceDivisor: 1,
//         },
//         {
//           index: 2,
//           vertexBuffer: textureCoor,
//           componentsPerAttribute: 2,
//           componentDatatype: Cesium.ComponentDatatype.FLOAT,
//           normalize: false,
//           // offseInBytes: 0,
//           // strideInByes: 0,
//           // instanceDivisor: 1,
//         },
//       ],
//     });
//     return VAO;
//   }

//   getShaderProgram(context: any) {
//     return (Cesium as any).ShaderProgram.fromCache({
//       context: context,
//       vertexShaderSource: this.vertexScript,
//       fragmentShaderSource: this.fragmentScript,
//       attributeLocations: this.attributeLocations,
//     });
//   }

//   getTexture(context: any, data: HTMLImageElement) {
//     return new (Cesium as any).Texture({
//       context: context,
//       source: data,
//       sampler: new (Cesium as any).Sampler({
//         minificationFilter: Cesium.TextureMinificationFilter.LINEAR,
//         magnificationFilter: Cesium.TextureMagnificationFilter.LINEAR,
//       }),
//     });
//   }

//   getUniformMap(context: any) {
//     return {
//       matrix: () => {
//         const matrix = mat4.create();
//         mat4.identity(matrix);
//         const translateMatrix = mat4.translate(mat4.create(), matrix, [0.5, 0.0, 0.0]);
//         return new Cesium.Matrix4(...translateMatrix);
//       },
//       u_texture: () => {
//         return this.getTexture(context, this.image);
//       },
//     };
//   }

//   createCommand(context: any) {
//     const renderState = createRawRenderState({
//       // undefined value means let Cesium deal with it
//       viewport: undefined,
//       depthTest: {
//         enabled: false,
//       },
//       depthMask: false,
//       blending: {
//         enabled: true,
//       },
//     });
//     return new (Cesium as any).DrawCommand({
//       owner: this,
//       vertexArray: this.getVertexArray(context),
//       primitiveType: Cesium.PrimitiveType.POINTS,
//       // count: 64,
//       count: 6,
//       // instanceCount: 2,
//       // primitiveType: Cesium.PrimitiveType.TRIANGLE_STRIP,
//       uniformMap: this.getUniformMap(context),
//       shaderProgram: this.getShaderProgram(context),
//       renderState: (Cesium as any).RenderState.fromCache(renderState),
//       pass: (Cesium as any).Pass.OPAQUE,
//     });
//   }

//   update(frameState: any) {
//     // if (!this.show) return;
//     // if you do not want to show the CustomPrimitive, use return statement to bypass the update
//     if (!Cesium.defined(this.commandToExecute)) {
//       this.commandToExecute = this.createCommand(frameState.context);
//     }
//     frameState.commandList.push(this.commandToExecute);
//   }

//   isDestroyed() {
//     // return true or false to indicate whether the CustomPrimitive is destroyed
//   }

//   destroy() {
//     // this method will be called when the CustomPrimitive is no longer used
//   }
// }
