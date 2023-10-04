import { CustomLayerInterface, MercatorCoordinate } from "mapbox-gl";
import axios from "axios";
import { mat4 } from "gl-matrix";
import { encodeFloatToDouble } from "@/utils/common";
import mapBoxGl from "mapbox-gl";

export class SymbolHandle {
  vertexScript: string | null = null;
  fragmentScript: string | null = null;
  position: number[] = [];
  simpleArray: number[] = [];
  rotationArray: number[] = [];
  strip: HTMLImageElement | null = null;
  palette: HTMLImageElement | null = null;
  simpleTexture: WebGLTexture | null = null;
  paletteTexture: WebGLTexture | null = null;
  number: number;
  symbolPixel: number;
  modelMatrix: mat4 = mat4.create();

  constructor(number: number, symbolPixel: number) {
    this.number = number;
    this.symbolPixel = symbolPixel;
    mat4.identity(this.modelMatrix);
    mat4.scale(this.modelMatrix, this.modelMatrix, [
      symbolPixel * window.devicePixelRatio,
      symbolPixel * window.devicePixelRatio,
      1.0,
    ]);
  }

  async getShader(address: string, type: "vertex" | "fragment") {
    const shaderScript = await axios.get(address).then((res) => res.data);
    if (type === "vertex") this.vertexScript = shaderScript;
    else this.fragmentScript = shaderScript;
  }

  getTexture(address: string, type: "strip" | "palette") {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = address;
      image.onload = () => {
        if (type === "palette") this.palette = image;
        else this.strip = image;
        resolve(null);
      };
    });
  }

  async getData(
    positionJsonAddress: string,
    infoJsonAddress: string,
    type: string
  ) {
    const positionPromise = new Promise((resolve, reject) => {
      axios.get(positionJsonAddress).then((res) => resolve(res.data));
    });
    const infoPromise = new Promise((resolve, reject) => {
      axios.get(infoJsonAddress).then((res) => resolve(res.data));
    });
    return Promise.all([infoPromise, positionPromise]).then((res) => {
      const arr = (res[0] as any).markers.description;
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].name === type) {
          const instanceNum = Math.ceil(arr[i].length / this.number);
          for (let j = 0; j < (res[1] as any).features.length; j++) {
            const item = (res[1] as any).features[j];
            const coord = MercatorCoordinate.fromLngLat({
              lng: item.geometry.coordinates[0],
              lat: item.geometry.coordinates[1],
            });
            for (let k = 0; k < instanceNum; k++) {
              this.simpleArray.push(arr[i].base, arr[i].length, k, arr[i].ID);
              const positionX = encodeFloatToDouble(coord.x);
              const positionY = encodeFloatToDouble(coord.y);
              this.position.push(
                positionX[0],
                positionY[0],
                positionX[1],
                positionY[1]
              );
              this.rotationArray.push(0);
            }
          }
        }
      }
    });
  }

  myBindTexture(gl: WebGL2RenderingContext) {
    if (this.strip && this.palette) {
      console.log(123);
      this.simpleTexture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, this.simpleTexture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        this.strip
      );
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      this.paletteTexture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, this.paletteTexture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        this.palette
      );
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    }
  }

  generateCustomLayer(id: string, map: mapboxgl.Map) {
    let program: WebGLProgram;
    let VAO: WebGLVertexArrayObject;
    const vertexScript = this.vertexScript;
    const fragmentScript = this.fragmentScript;
    const position = this.position;
    const simpleArray = this.simpleArray;
    const rotationArray = this.rotationArray;
    const that = this;

    const result: CustomLayerInterface = {
      id: id,
      type: "custom",
      onAdd(map: mapboxgl.Map, gl: WebGL2RenderingContext) {
        if (
          vertexScript &&
          fragmentScript &&
          position &&
          simpleArray &&
          rotationArray
        ) {
          const vertexShader = gl.createShader(gl.VERTEX_SHADER)!;
          gl.shaderSource(vertexShader, vertexScript);
          gl.compileShader(vertexShader);
          const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!;
          gl.shaderSource(fragmentShader, fragmentScript);
          gl.compileShader(fragmentShader);
          program = gl.createProgram()!;
          gl.attachShader(program, vertexShader);
          gl.attachShader(program, fragmentShader);
          gl.linkProgram(program);

          VAO = gl.createVertexArray()!;
          gl.bindVertexArray(VAO);
          const VBO = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
          gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([...simpleArray, ...position, ...rotationArray]),
            gl.STATIC_DRAW
          );
          gl.enableVertexAttribArray(0);
          gl.vertexAttribPointer(0, 4, gl.FLOAT, false, 4 * 4, 0);
          gl.vertexAttribDivisor(0, 1);
          gl.enableVertexAttribArray(1);
          gl.vertexAttribPointer(
            1,
            4,
            gl.FLOAT,
            false,
            4 * 4,
            4 * 4 * rotationArray.length
          );
          gl.vertexAttribDivisor(1, 1);
          gl.enableVertexAttribArray(2);
          gl.vertexAttribPointer(
            2,
            1,
            gl.FLOAT,
            false,
            4,
            8 * 4 * rotationArray.length
          );
          gl.vertexAttribDivisor(2, 1);
          gl.bindBuffer(gl.ARRAY_BUFFER, null);
          gl.bindVertexArray(null);

          that.myBindTexture.call(that, gl);
        }
      },
      render(gl: WebGL2RenderingContext, matrix: number[]) {
        gl.useProgram(program);
        const uSymbolMatrix = gl.getUniformLocation(program, "u_symbolMatrix");
        gl.uniformMatrix4fv(uSymbolMatrix, false, that.modelMatrix);
        const uBufferSize = gl.getUniformLocation(program, "u_bufferSize");
        gl.uniform2f(uBufferSize, gl.canvas.width, gl.canvas.height);
        const center = map.getCenter();
        const mercatorCenter = mapBoxGl.MercatorCoordinate.fromLngLat({
          lng: center.lng,
          lat: center.lat,
        });
        const mercatorCenterX = encodeFloatToDouble(mercatorCenter.x);
        const mercatorCenterY = encodeFloatToDouble(mercatorCenter.y);
        const uMercatorCenterHigh = gl.getUniformLocation(
          program,
          "u_mercatorCenterHigh"
        );
        gl.uniform2f(
          uMercatorCenterHigh,
          mercatorCenterX[0],
          mercatorCenterY[0]
        );
        const uMercatorCenterLow = gl.getUniformLocation(
          program,
          "u_mercatorCenterLow"
        );
        gl.uniform2f(
          uMercatorCenterLow,
          mercatorCenterX[1],
          mercatorCenterY[1]
        );
        const uMatrix = gl.getUniformLocation(program, "u_matrix");
        const relativeToEyeMatrix = matrix.slice();
        relativeToEyeMatrix[12] += relativeToEyeMatrix[0] * mercatorCenter.x + relativeToEyeMatrix[4] * mercatorCenter.y;
        relativeToEyeMatrix[13] += relativeToEyeMatrix[1] * mercatorCenter.x + relativeToEyeMatrix[5] * mercatorCenter.y;
        relativeToEyeMatrix[14] += relativeToEyeMatrix[2] * mercatorCenter.x + relativeToEyeMatrix[6] * mercatorCenter.y;
        relativeToEyeMatrix[15] += relativeToEyeMatrix[3] * mercatorCenter.x + relativeToEyeMatrix[7] * mercatorCenter.y;
        gl.uniformMatrix4fv(uMatrix, false, relativeToEyeMatrix);

        gl.bindVertexArray(VAO);
        const symbolTextureLoc = gl.getUniformLocation(
          program,
          "symbolTexture"
        );
        const paletteTextureLoc = gl.getUniformLocation(
          program,
          "paletteTexture"
        );
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, that.simpleTexture);
        gl.uniform1i(symbolTextureLoc, 0);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, that.paletteTexture);
        gl.uniform1i(paletteTextureLoc, 1);

        gl.drawArraysInstanced(
          gl.TRIANGLE_STRIP,
          0,
          that.number,
          rotationArray.length
        );

        gl.bindVertexArray(null);
        gl.bindTexture(gl.TEXTURE_2D, null);
      },
    };
    return result;
  }
}
