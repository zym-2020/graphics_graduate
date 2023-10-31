export function encodeFloatToDouble(value: number): Float32Array {
  const result = new Float32Array(2);
  result[0] = value;

  const delta = value - result[0];
  result[1] = delta;
  return result;
}

export const rand = (min: number, max?: number) => {
  if (!max) {
    max = min;
    min = 0;
  }
  return Math.random() * (max - min) + min;
};

export class GlProgram {
  program: WebGLProgram | null;
  constructor(gl: WebGL2RenderingContext) {
    this.program = gl.createProgram();
  }

  setShader(gl: WebGL2RenderingContext, vertexScript: string, fragmentScript: string, outVaryings?: string[]) {
    if (this.program) {
      const vertexShader = gl.createShader(gl.VERTEX_SHADER);
      const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
      gl.shaderSource(vertexShader!, vertexScript);
      gl.shaderSource(fragmentShader!, fragmentScript);
      gl.compileShader(vertexShader!);
      gl.compileShader(fragmentShader!);
      gl.attachShader(this.program, vertexShader!);
      gl.attachShader(this.program, fragmentShader!);
      if (outVaryings) {
        gl.transformFeedbackVaryings(this.program, outVaryings, gl.SEPARATE_ATTRIBS);
      }
      gl.linkProgram(this.program);
    }
  }

  useProgram(gl: WebGL2RenderingContext) {
    gl.useProgram(this.program);
  }

  setFloat(gl: WebGL2RenderingContext, name: string, value: number) {
    const location = gl.getUniformLocation(this.program!, name);
    gl.uniform1f(location, value);
  }

  setInt(gl: WebGL2RenderingContext, name: string, value: number) {
    const location = gl.getUniformLocation(this.program!, name);
    gl.uniform1i(location, value);
  }

  setVec1i(gl: WebGL2RenderingContext, name: string, vector: Array<number>) {
    const location = gl.getUniformLocation(this.program!, name);
    gl.uniform1iv(location, vector);
  }

  setFloat2(gl: WebGL2RenderingContext, name: string, value1: number, value2: number) {
    const uniformLocation = gl.getUniformLocation(this.program!, name);
    gl!.uniform2f(uniformLocation, value1, value2);
  }

  setFloat3(gl: WebGL2RenderingContext, name: string, value1: number, value2: number, value3: number) {
    const uniformLocation = gl.getUniformLocation(this.program!, name);
    gl.uniform3f(uniformLocation, value1, value2, value3);
  }

  setFloat4(gl: WebGL2RenderingContext, name: string, value1: number, value2: number, value3: number, value4: number) {
    const uniformLocation = gl.getUniformLocation(this.program!, name);
    gl.uniform4f(uniformLocation, value1, value2, value3, value4);
  }

  setVec4(gl: WebGL2RenderingContext, name: string, vector: Array<number>) {
    const uniformLocation = gl.getUniformLocation(this.program!, name);
    gl.uniform4fv(uniformLocation, vector);
  }

  setMat4(gl: WebGL2RenderingContext, name: string, matrix: number[] | Float32Array) {
    const uniformLocation = gl.getUniformLocation(this.program!, name);
    gl.uniformMatrix4fv(uniformLocation, false, matrix);
  }

  setUniformBlock(gl: WebGL2RenderingContext, name: string, blockIndex: number) {
    const uniformLocation = gl.getUniformBlockIndex(this.program!, name);
    gl.uniformBlockBinding(this.program!, uniformLocation, blockIndex);
  }
}
