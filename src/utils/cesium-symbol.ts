import axios from "axios";
import * as Cesium from "cesium";
import { encodeFloatToDouble } from "@/utils/common";
import { mat4 } from "gl-matrix";

let VBO: WebGLBuffer;

export class CesiumSymbol {
  vertexAddress: string;
  fragmentAddress: string;
  symbolImageAddress: string;
  paletteImageAddress: string;
  descriptionAddress: string;
  poistionAddress: string;

  vertexScript: string | null = null;
  fragmentScript: string | null = null;
  symbolImage: HTMLImageElement | null = null;
  paletteImage: HTMLImageElement | null = null;
  vertexArray: number[] = [];
  instanceNum: number = 0;

  program: WebGLProgram | null = null;
  renderVAO: WebGLVertexArrayObject | null = null;
  debugVAO: WebGLVertexArrayObject | null = null;
  symbolTexture: WebGLTexture | null = null;
  paletteTexture: WebGLTexture | null = null;
  constructor(vertexAddress: string, fragmentAddress: string, symbolImageAddress: string, paletteImageAddress: string, descriptionAddress: string, poistionAddress: string) {
    this.vertexAddress = vertexAddress;
    this.fragmentAddress = fragmentAddress;
    this.symbolImageAddress = symbolImageAddress;
    this.paletteImageAddress = paletteImageAddress;
    this.descriptionAddress = descriptionAddress;
    this.poistionAddress = poistionAddress;
  }

  async prepareData(number: number, type?: string) {
    const vertexScriptPromise: Promise<string> = axios.get(this.vertexAddress).then((res) => res.data);
    const fragmentScriptPromise: Promise<string> = axios.get(this.fragmentAddress).then((res) => res.data);
    const symbolImagePromise: Promise<HTMLImageElement> = new Promise((resolve, reject) => {
      const symbolImage = new Image();
      symbolImage.src = this.symbolImageAddress;
      symbolImage.onload = () => {
        resolve(symbolImage);
      };
    });
    const paletteImagePromise: Promise<HTMLImageElement> = new Promise((resolve, reject) => {
      const paletteImage = new Image();
      paletteImage.src = this.paletteImageAddress;
      paletteImage.onload = () => {
        resolve(paletteImage);
      };
    });
    const descriptionPromise = axios.get(this.descriptionAddress).then((res) => res.data);
    const positionPromise = axios.get(this.poistionAddress).then((res) => res.data);

    return Promise.all([vertexScriptPromise, fragmentScriptPromise, symbolImagePromise, paletteImagePromise, descriptionPromise, positionPromise]).then((res) => {
      this.vertexScript = res[0];
      this.fragmentScript = res[1];
      this.symbolImage = res[2];
      this.paletteImage = res[3];
      const sampleArray: number[] = [];
      const positionHigh: number[] = [];
      const positionLow: number[] = [];
      const rotationArray: number[] = [];
      const arr = (res[4] as any).markers.description;
      if (type) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].name === type) {
            const instanceNum = Math.ceil(arr[i].length / number);
            for (let j = 0; j < (res[5] as any).features.length; j++) {
              const item = (res[5] as any).features[j];
              const coord = Cesium.Cartesian3.fromDegrees(item.geometry.coordinates[0], item.geometry.coordinates[1]);
              const positionX = encodeFloatToDouble(coord.x);
              const positionY = encodeFloatToDouble(coord.y);
              const positionZ = encodeFloatToDouble(coord.z);
              for (let k = 0; k < instanceNum; k++) {
                sampleArray.push(arr[i].base, arr[i].length, k, arr[i].ID);
                positionHigh.push(positionX[0], positionY[0], positionZ[0]);
                positionLow.push(positionX[1], positionY[1], positionZ[1]);
                rotationArray.push(0);
              }
            }
          }
        }
        this.instanceNum = rotationArray.length;
        this.vertexArray = [...sampleArray, ...positionHigh, ...positionLow, ...rotationArray];
      } else {
        for (let j = 0; j < (res[5] as any).features.length; j++) {
          let randomNumber;
          do {
            randomNumber = Math.floor(Math.random() * 6);
          } while (randomNumber === 3);
          const rotation = 360 * Math.random();
          const instanceNum = Math.ceil(arr[randomNumber].length / number);
          const item = (res[5] as any).features[j];
          const coord = Cesium.Cartesian3.fromDegrees(item.geometry.coordinates[0], item.geometry.coordinates[1]);
          const positionX = encodeFloatToDouble(coord.x);
          const positionY = encodeFloatToDouble(coord.y);
          const positionZ = encodeFloatToDouble(coord.z);
          for (let k = 0; k < instanceNum; k++) {
            sampleArray.push(arr[randomNumber].base, arr[randomNumber].length, k, arr[randomNumber].ID);
            positionHigh.push(positionX[0], positionY[0], positionZ[0]);
            positionLow.push(positionX[1], positionY[1], positionZ[1]);
            rotationArray.push(rotation);
          }
        }
        this.instanceNum = rotationArray.length;
        this.vertexArray = [...sampleArray, ...positionHigh, ...positionLow, ...rotationArray];
      }
    });
  }

  prepareRenderResource(gl: WebGL2RenderingContext) {
    if (this.renderVAO === null) {
      const vShader = gl.createShader(gl.VERTEX_SHADER)!;
      const fShader = gl.createShader(gl.FRAGMENT_SHADER)!;
      gl.shaderSource(vShader, this.vertexScript!);
      gl.shaderSource(fShader, this.fragmentScript!);
      gl.compileShader(vShader);
      gl.compileShader(fShader);

      this.program = gl.createProgram()!;
      gl.attachShader(this.program, vShader);
      gl.attachShader(this.program, fShader);
      gl.linkProgram(this.program);

      this.renderVAO = gl.createVertexArray();
      gl.bindVertexArray(this.renderVAO);
      VBO = gl.createBuffer()!;
      gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertexArray), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(0);
      gl.vertexAttribPointer(0, 4, gl.FLOAT, false, 4 * 4, 0);
      gl.vertexAttribDivisor(0, 1);
      gl.enableVertexAttribArray(1);
      gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 4 * 3, this.instanceNum * 4 * 4);
      gl.vertexAttribDivisor(1, 1);
      gl.enableVertexAttribArray(2);
      gl.vertexAttribPointer(2, 3, gl.FLOAT, false, 4 * 3, this.instanceNum * 7 * 4);
      gl.vertexAttribDivisor(2, 1);
      gl.enableVertexAttribArray(3);
      gl.vertexAttribPointer(3, 1, gl.FLOAT, false, 4 * 1, this.instanceNum * 10 * 4);
      gl.vertexAttribDivisor(3, 1);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      gl.bindVertexArray(null);

      this.debugVAO = gl.createVertexArray();
      gl.bindVertexArray(this.debugVAO);
      const dubugVBO = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, dubugVBO);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-0.5, 0.5, 0.5, 0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1]), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(0);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 4 * 2, 0);
      gl.enableVertexAttribArray(1);
      gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 4 * 2, 4 * 2 * 6);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      gl.bindVertexArray(null);

      if (this.symbolImage && this.paletteImage) {
        this.symbolTexture = gl.createTexture();
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
        gl.bindTexture(gl.TEXTURE_2D, this.symbolTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.symbolImage);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        this.paletteTexture = gl.createTexture();
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
        gl.bindTexture(gl.TEXTURE_2D, this.paletteTexture);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.paletteImage);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      gl.bindVertexArray(null);
      gl.bindTexture(gl.TEXTURE_2D, null);
    }
  }

  render(gl: WebGL2RenderingContext, scale: number, lon: number, lat: number, number: number, uMatrix: number[]) {
    gl.disable(gl.CULL_FACE);
    gl.disable(gl.BLEND);
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.SCISSOR_TEST);
    gl.scissor(0, 0, 2048, 958);
    gl.useProgram(this.program);
    const modelMatrix = mat4.create();
    mat4.identity(modelMatrix);
    mat4.scale(modelMatrix, modelMatrix, [scale * window.devicePixelRatio, scale * window.devicePixelRatio, 1.0]);
    const symbolMatrixLoc = gl.getUniformLocation(this.program!, "u_symbolMatrix");
    gl.uniformMatrix4fv(symbolMatrixLoc, false, modelMatrix);
    const bufferSizeLoc = gl.getUniformLocation(this.program!, "u_bufferSize");
    gl.uniform2f(bufferSizeLoc, gl.canvas.width, gl.canvas.height);
    const center = Cesium.Cartesian3.fromDegrees(lon, lat);
    const positionX = encodeFloatToDouble(center.x);
    const positionY = encodeFloatToDouble(center.y);
    const positionZ = encodeFloatToDouble(center.z);
    const centerHighLoc = gl.getUniformLocation(this.program!, "u_cartesianCenterHigh");
    gl.uniform3f(centerHighLoc, positionX[0], positionY[0], positionZ[0]);
    const centerLowLoc = gl.getUniformLocation(this.program!, "u_cartesianCenterLow");
    gl.uniform3f(centerLowLoc, positionX[1], positionY[1], positionZ[1]);
    const uMatrixLoc = gl.getUniformLocation(this.program!, "u_matrix");
    gl.uniformMatrix4fv(uMatrixLoc, false, uMatrix);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.symbolTexture);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.paletteTexture);
    const symbolTextureLoc = gl.getUniformLocation(this.program!, "symbolTexture");
    const paletteTextureLoc = gl.getUniformLocation(this.program!, "paletteTexture");
    gl.uniform1i(symbolTextureLoc, 0);
    gl.uniform1i(paletteTextureLoc, 1);
    // gl.bindVertexArray(this.debugVAO);
    gl.bindVertexArray(this.renderVAO);

    gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, number, this.instanceNum);
    // gl.drawArrays(gl.TRIANGLES, 0, 6);

    gl.bindVertexArray(null);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.useProgram(null);
  }
}
