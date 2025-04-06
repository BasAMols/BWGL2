var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// ts/classes/util/math/vector2.ts
function v2(n, y) {
  if (typeof n === "number") {
    return Vector2.f(n, y);
  } else if (typeof n === "undefined") {
    return Vector2.f(0);
  } else {
    return Vector2.f(...n);
  }
}
var Vector2 = class _Vector2 {
  constructor(x, y) {
    this.x = x === void 0 ? 0 : x;
    this.y = y === void 0 ? 0 : y;
  }
  static f(x = 0, y = x) {
    return new _Vector2(x, y);
  }
  isZero() {
    return this.x === 0 && this.y === 0;
  }
  clone() {
    return new _Vector2(this.x, this.y);
  }
  add(vector) {
    return new _Vector2(this.x + vector.x, this.y + vector.y);
  }
  multiply(vector) {
    return new _Vector2(this.x * vector.x, this.y * vector.y);
  }
  subtract(vector) {
    return new _Vector2(this.x - vector.x, this.y - vector.y);
  }
  scale(scalar) {
    return new _Vector2(this.x * scalar, this.y * scalar);
  }
  dot(vector) {
    return this.x * vector.x + this.y + vector.y;
  }
  moveTowards(vector, t) {
    t = Math.min(t, 1);
    var diff = vector.subtract(this);
    return this.add(diff.scale(t));
  }
  magnitude() {
    return Math.sqrt(this.magnitudeSqr());
  }
  magnitudeSqr() {
    return this.x * this.x + this.y * this.y;
  }
  clampMagnitude(max2 = 1) {
    if (this.magnitude() === 0)
      return v2(0);
    return this.scale(1 / this.magnitude() || 1).scale(Math.min(max2, this.magnitude()));
  }
  distance(vector) {
    return Math.sqrt(this.distanceSqr(vector));
  }
  distanceSqr(vector) {
    var deltaX = this.x - vector.x;
    var deltaY = this.y - vector.y;
    return deltaX * deltaX + deltaY * deltaY;
  }
  normalize() {
    var mag = this.magnitude();
    var vector = this.clone();
    if (Math.abs(mag) < 1e-9) {
      vector.x = 0;
      vector.y = 0;
    } else {
      vector.x /= mag;
      vector.y /= mag;
    }
    return vector;
  }
  angleDegrees() {
    return this.angle() * (180 / Math.PI);
  }
  angle() {
    return Math.atan2(this.y, this.x);
  }
  rotate(rad) {
    var cos = Math.cos(rad);
    var sin = Math.sin(rad);
    return new _Vector2(
      this.x * cos - this.y * sin,
      this.x * sin + this.y * cos
    );
  }
  toPrecision(precision) {
    var vector = this.clone();
    vector.x = +vector.x.toFixed(precision);
    vector.y = +vector.y.toFixed(precision);
    return vector;
  }
  toString() {
    var vector = this.toPrecision(1);
    return "[" + vector.x + "; " + vector.y + "]";
  }
  clamp(min2, max2) {
    return _Vector2.clamp(this, min2, max2);
  }
  static min(a, b) {
    return new _Vector2(
      Math.min(a.x, b.x),
      Math.min(a.y, b.y)
    );
  }
  static max(a, b) {
    return new _Vector2(
      Math.max(a.x, b.x),
      Math.max(a.y, b.y)
    );
  }
  static clamp(value, min2, max2) {
    return _Vector2.max(_Vector2.min(value, min2), max2);
  }
  clampMagnitute(mag) {
    return _Vector2.clampMagnitute(this, mag);
  }
  get array() {
    return [this.x, this.y];
  }
  set array(a) {
    [this.x, this.y] = a;
  }
  get surfaceArea() {
    return this.x * this.y;
  }
  static clampMagnitute(value, mag) {
    var ratio = value.magnitude() / mag;
    return new _Vector2(value.x / ratio, value.y / ratio);
  }
  static get zero() {
    return new _Vector2(0, 0);
  }
  static get down() {
    return new _Vector2(0, -1);
  }
  static get up() {
    return new _Vector2(0, 1);
  }
  static get right() {
    return new _Vector2(1, 0);
  }
  static get left() {
    return new _Vector2(-1, 0);
  }
  static get fromDegree() {
    return new _Vector2(0, 0);
  }
};

// ts/classes/elements/element.ts
var Element = class {
  constructor() {
    this.events = [];
  }
  get t() {
    return glob.game.t;
  }
  build() {
  }
  addEvent(e) {
    this.events.push(e);
  }
  getEvent(id) {
    return this.events.find((e) => id === e.id);
  }
};

// ts/classes/elements/domElement.ts
var DomElement = class extends Element {
  constructor(type, attr = {}) {
    super();
    this.children = [];
    this.rendererType = "dom";
    this._position = v2(0);
    this.size = v2(0);
    this.dom = document.createElement(type);
    this.dom.style.position = "absolute";
    this.dom.style.transformOrigin = "bottom left";
    this.dom.style.pointerEvents = "none";
    this.dom.style.bottom = "0px";
    this.id = attr.id || "";
    this.background = attr.background || "";
    this.size = attr.size || Vector2.zero;
    this.position = attr.position || Vector2.zero;
  }
  get position() {
    return this._position;
  }
  set position(value) {
    this._position = value;
    this.x = value.x;
    this.y = value.y;
  }
  get id() {
    return this.dom.id;
  }
  set id(value) {
    if (value) {
      this.dom.id = value;
    }
  }
  get x() {
    return Math.round(Number(this.dom.style.left.replace(/\D/g, "")));
  }
  set x(n) {
    if (this.dom) {
      this.dom.style.left = "".concat(n, "px");
    }
  }
  get y() {
    return Math.round(Number(this.dom.style.bottom.replace(/\D/g, "")));
  }
  set y(n) {
    if (this.dom) {
      this.dom.style.bottom = "".concat(n, "px");
    }
  }
  set visible(value) {
    this.dom ? this.dom.style.display = value ? "block" : "none" : null;
  }
  set background(v) {
    this.dom.style.background = v;
  }
  get width() {
    return Math.round(Number(this.dom.style.width.replace(/\D/g, "")));
  }
  set width(value) {
    if (this.dom) {
      this.dom.style.width = "".concat(value, "px");
      this.dom.setAttribute("width", String(value));
    }
  }
  get height() {
    return Math.round(Number(this.dom.style.height.replace(/\D/g, "")));
  }
  set height(value) {
    if (this.dom) {
      this.dom.style.height = "".concat(value, "px");
      this.dom.setAttribute("height", String(value));
    }
  }
  ready() {
    this.build();
  }
  tick(obj) {
    this.children.forEach((c) => {
      c.tick(obj);
    });
  }
  appendChild(e) {
    this.dom.appendChild(e.dom);
  }
  addChild(child) {
    this.children.push(child);
    this.dom.appendChild(child.dom);
  }
  addEventListener(type, listener, options) {
    this.dom.addEventListener(type, listener, options);
  }
  removeEventListener(type, listener, options) {
    this.dom.removeEventListener(type, listener, options);
  }
};

// ts/classes/util/event.ts
var Events = class {
  constructor(id) {
    this.subscribers = {};
    this.id = id;
  }
  subscribe(key, func) {
    this.subscribers[key] = func;
  }
  alert(v) {
    Object.values(this.subscribers).forEach((s) => {
      s(v);
    });
  }
};

// ts/classes/webgl2/buffer.ts
var Buffer2 = class {
  constructor(gl, type = gl.ARRAY_BUFFER, usage = gl.STATIC_DRAW) {
    this.gl = gl;
    this.type = type;
    this.usage = usage;
    const buffer = gl.createBuffer();
    if (!buffer) {
      throw new Error("Failed to create buffer");
    }
    this.buffer = buffer;
  }
  bind() {
    this.gl.bindBuffer(this.type, this.buffer);
  }
  unbind() {
    this.gl.bindBuffer(this.type, null);
  }
  setData(data) {
    this.bind();
    this.gl.bufferData(this.type, data, this.usage);
  }
  updateData(data, offset = 0) {
    this.bind();
    this.gl.bufferSubData(this.type, offset, data);
  }
  dispose() {
    this.gl.deleteBuffer(this.buffer);
  }
};
var VertexArray = class {
  constructor(gl) {
    this.gl = gl;
    const vao = gl.createVertexArray();
    if (!vao) {
      throw new Error("Failed to create vertex array object");
    }
    this.vao = vao;
  }
  bind() {
    this.gl.bindVertexArray(this.vao);
  }
  unbind() {
    this.gl.bindVertexArray(null);
  }
  setAttributePointer(location, size, type, normalized = false, stride = 0, offset = 0) {
    this.gl.vertexAttribPointer(location, size, type, normalized, stride, offset);
    this.gl.enableVertexAttribArray(location);
  }
  dispose() {
    this.gl.deleteVertexArray(this.vao);
  }
};
var VertexBuffer = class extends Buffer2 {
  constructor(gl, usage = gl.STATIC_DRAW) {
    super(gl, gl.ARRAY_BUFFER, usage);
  }
};
var IndexBuffer = class extends Buffer2 {
  constructor(gl, usage = gl.STATIC_DRAW) {
    super(gl, gl.ELEMENT_ARRAY_BUFFER, usage);
    this.count = 0;
  }
  setData(data) {
    super.setData(data);
    this.count = data.byteLength / 2;
  }
  getCount() {
    return this.count;
  }
};

// ts/classes/webgl2/shaderManager.ts
var ShaderManager = class {
  constructor(gl) {
    this.currentProgram = null;
    this.gl = gl;
    this.shaderPrograms = /* @__PURE__ */ new Map();
    this.uniforms = /* @__PURE__ */ new Map();
    this.attributes = /* @__PURE__ */ new Map();
  }
  loadShaderProgram(name, vertexSource, fragmentSource) {
    try {
      const vertexShader = this.compileShader(vertexSource, this.gl.VERTEX_SHADER);
      const fragmentShader = this.compileShader(fragmentSource, this.gl.FRAGMENT_SHADER);
      const program = this.createProgram(vertexShader, fragmentShader);
      this.shaderPrograms.set(name, program);
      this.uniforms.set(name, /* @__PURE__ */ new Map());
      this.attributes.set(name, /* @__PURE__ */ new Map());
      this.gl.deleteShader(vertexShader);
      this.gl.deleteShader(fragmentShader);
      this.introspectShaderProgram(name);
    } catch (error) {
      console.error("Failed to load shader program '".concat(name, "':"), error);
      throw error;
    }
  }
  compileShader(source, type) {
    const shader = this.gl.createShader(type);
    if (!shader) {
      throw new Error("Failed to create shader");
    }
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      const info = this.gl.getShaderInfoLog(shader);
      this.gl.deleteShader(shader);
      throw new Error("Shader compilation error: ".concat(info));
    }
    return shader;
  }
  createProgram(vertexShader, fragmentShader) {
    const program = this.gl.createProgram();
    if (!program) {
      throw new Error("Failed to create shader program");
    }
    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);
    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      const info = this.gl.getProgramInfoLog(program);
      this.gl.deleteProgram(program);
      throw new Error("Shader program linking error: ".concat(info));
    }
    return program;
  }
  introspectShaderProgram(name) {
    const program = this.shaderPrograms.get(name);
    if (!program) {
      throw new Error("Shader program '".concat(name, "' not found"));
    }
    const numUniforms = this.gl.getProgramParameter(program, this.gl.ACTIVE_UNIFORMS);
    const uniformMap = this.uniforms.get(name);
    for (let i = 0; i < numUniforms; i++) {
      const info = this.gl.getActiveUniform(program, i);
      if (!info)
        continue;
      const location = this.gl.getUniformLocation(program, info.name);
      if (!location)
        continue;
      const baseName = info.name.replace(/\[\d+\].*$/, "");
      uniformMap.set(baseName, {
        type: this.getUniformTypeName(info.type),
        value: this.getDefaultValueForType(info.type),
        location,
        isArray: info.size > 1,
        arraySize: info.size
      });
    }
    const numAttributes = this.gl.getProgramParameter(program, this.gl.ACTIVE_ATTRIBUTES);
    const attributeMap = this.attributes.get(name);
    for (let i = 0; i < numAttributes; i++) {
      const info = this.gl.getActiveAttrib(program, i);
      if (!info)
        continue;
      const location = this.gl.getAttribLocation(program, info.name);
      if (location === -1)
        continue;
      attributeMap.set(info.name, {
        type: this.getAttributeTypeName(info.type),
        size: this.getAttributeSize(info.type),
        location
      });
    }
  }
  useProgram(name) {
    const program = this.shaderPrograms.get(name);
    if (!program) {
      throw new Error("Shader program '".concat(name, "' not found"));
    }
    this.gl.useProgram(program);
    this.currentProgram = name;
  }
  setUniform(name, value) {
    if (!this.currentProgram) {
      throw new Error("No shader program is currently in use");
    }
    const uniformMap = this.uniforms.get(this.currentProgram);
    if (!uniformMap) {
      throw new Error("Uniform map not found for program '".concat(this.currentProgram, "'"));
    }
    const uniform = uniformMap.get(name);
    if (!uniform || !uniform.location) {
      throw new Error("Uniform '".concat(name, "' not found in program '").concat(this.currentProgram, "'. Make sure to use the u_camelCase naming convention for uniforms, v_camelCase for varyings, and a_camelCase for attributes."));
    }
    this.setUniformValue(uniform.type, uniform.location, value);
    uniform.value = value;
  }
  setUniformValue(type, location, value) {
    switch (type) {
      case "float":
        if (Array.isArray(value) || value instanceof Float32Array) {
          this.gl.uniform1fv(location, value);
        } else {
          this.gl.uniform1f(location, value);
        }
        break;
      case "vec2":
        this.gl.uniform2fv(location, value);
        break;
      case "vec3":
        this.gl.uniform3fv(location, value);
        break;
      case "vec4":
        this.gl.uniform4fv(location, value);
        break;
      case "mat4":
        this.gl.uniformMatrix4fv(location, false, value);
        break;
      case "mat4[]":
        this.gl.uniformMatrix4fv(location, false, value);
        break;
      case "mat3":
        this.gl.uniformMatrix3fv(location, false, value);
        break;
      case "int":
        if (Array.isArray(value) || value instanceof Int32Array) {
          this.gl.uniform1iv(location, value);
        } else {
          this.gl.uniform1i(location, value);
        }
        break;
      case "bool":
        if (Array.isArray(value)) {
          const intArray = new Int32Array(value.map((v) => v ? 1 : 0));
          this.gl.uniform1iv(location, intArray);
        } else if (value instanceof Int32Array) {
          this.gl.uniform1iv(location, value);
        } else {
          this.gl.uniform1i(location, value ? 1 : 0);
        }
        break;
      case "sampler2D":
      case "sampler2D[]":
        if (Array.isArray(value) || value instanceof Int32Array) {
          this.gl.uniform1iv(location, value);
        } else {
          this.gl.uniform1i(location, value);
        }
        break;
      case "Light":
        const data = value;
        this.gl.uniform1fv(location, data);
        break;
      default:
        console.warn("Unsupported uniform type: ".concat(type));
        break;
    }
  }
  getAttributeLocation(name) {
    if (!this.currentProgram) {
      throw new Error("No shader program is currently in use");
    }
    const attributeMap = this.attributes.get(this.currentProgram);
    if (!attributeMap) {
      throw new Error("Attribute map not found for program '".concat(this.currentProgram, "'"));
    }
    const attribute = attributeMap.get(name);
    if (!attribute) {
      throw new Error("Attribute '".concat(name, "' not found in program '").concat(this.currentProgram, "'. Make sure to use the a_camelCase naming convention."));
    }
    return attribute.location;
  }
  getUniformTypeName(type) {
    switch (type) {
      case this.gl.FLOAT:
        return "float";
      case this.gl.FLOAT_VEC2:
        return "vec2";
      case this.gl.FLOAT_VEC3:
        return "vec3";
      case this.gl.FLOAT_VEC4:
        return "vec4";
      case this.gl.FLOAT_MAT4:
        return "mat4";
      case this.gl.FLOAT_MAT4 | 32:
        return "mat4[]";
      case this.gl.FLOAT_MAT3:
        return "mat3";
      case this.gl.INT:
        return "int";
      case this.gl.BOOL:
        return "bool";
      case this.gl.SAMPLER_2D:
        return "sampler2D";
      case this.gl.SAMPLER_2D | 32:
        return "sampler2D[]";
      case 35666:
        return "Light";
      default:
        console.warn("Unknown uniform type: ".concat(type));
        return "unknown";
    }
  }
  getAttributeTypeName(type) {
    switch (type) {
      case this.gl.FLOAT:
        return "float";
      case this.gl.FLOAT_VEC2:
        return "vec2";
      case this.gl.FLOAT_VEC3:
        return "vec3";
      case this.gl.FLOAT_VEC4:
        return "vec4";
      default:
        return "unknown";
    }
  }
  getAttributeSize(type) {
    switch (type) {
      case this.gl.FLOAT:
        return 1;
      case this.gl.FLOAT_VEC2:
        return 2;
      case this.gl.FLOAT_VEC3:
        return 3;
      case this.gl.FLOAT_VEC4:
        return 4;
      default:
        return 0;
    }
  }
  getDefaultValueForType(type) {
    switch (type) {
      case this.gl.FLOAT:
      case this.gl.INT:
      case this.gl.BOOL:
      case this.gl.SAMPLER_2D:
        return 0;
      case this.gl.FLOAT_VEC2:
        return new Float32Array(2);
      case this.gl.FLOAT_VEC3:
        return new Float32Array(3);
      case this.gl.FLOAT_VEC4:
        return new Float32Array(4);
      case this.gl.FLOAT_MAT4:
        return new Float32Array(16);
      default:
        return 0;
    }
  }
  hasUniform(name) {
    if (!this.currentProgram) {
      return false;
    }
    const uniformMap = this.uniforms.get(this.currentProgram);
    if (!uniformMap) {
      return false;
    }
    return uniformMap.has(name);
  }
  dispose() {
    for (const [name, program] of this.shaderPrograms) {
      this.gl.deleteProgram(program);
    }
    this.shaderPrograms.clear();
    this.uniforms.clear();
    this.attributes.clear();
    this.currentProgram = null;
  }
};

// ts/classes/webgl2/shaders/fragmentShaderSource.ts
var fragmentShaderSource = "#version 300 es\nprecision highp float;\n\n// Maximum number of lights\n#define MAX_LIGHTS 10\n\n// Light types\n#define LIGHT_TYPE_INACTIVE -1\n#define LIGHT_TYPE_AMBIENT 0\n#define LIGHT_TYPE_DIRECTIONAL 1\n#define LIGHT_TYPE_POINT 2\n#define LIGHT_TYPE_SPOT 3\n\n// Input from vertex shader\nin vec3 v_normal;\nin vec2 v_texCoord;\nin vec3 v_fragPos;\nin vec3 v_color;\nin vec4 v_fragPosLightSpace;\n\n// Material structure\nstruct Material {\n    vec3 ambient;\n    vec3 diffuse;\n    vec3 specular;\n    float shininess;\n    sampler2D diffuseMap;\n};\n\n// Light uniforms\nuniform int u_lightTypes[MAX_LIGHTS];\nuniform vec3 u_lightPositions[MAX_LIGHTS];\nuniform vec3 u_lightDirections[MAX_LIGHTS];\nuniform vec3 u_lightColors[MAX_LIGHTS];\nuniform float u_lightIntensities[MAX_LIGHTS];\nuniform float u_lightConstants[MAX_LIGHTS];\nuniform float u_lightLinears[MAX_LIGHTS];\nuniform float u_lightQuadratics[MAX_LIGHTS];\nuniform float u_lightCutOffs[MAX_LIGHTS];\nuniform float u_lightOuterCutOffs[MAX_LIGHTS];\nuniform int u_numLights;\n\n// Material uniforms\nuniform Material u_material;\nuniform bool u_useTexture;\n\n// Shadow mapping uniforms\nuniform sampler2D u_shadowMap0;\nuniform sampler2D u_shadowMap1;\nuniform sampler2D u_shadowMap2;\nuniform sampler2D u_shadowMap3;\nuniform sampler2D u_shadowMap4;\nuniform sampler2D u_shadowMap5;\nuniform sampler2D u_shadowMap6;\nuniform sampler2D u_shadowMap7;\nuniform sampler2D u_shadowMap8;\nuniform sampler2D u_shadowMap9;\nuniform mat4 u_lightSpaceMatrices[MAX_LIGHTS];\nuniform bool u_castsShadow[MAX_LIGHTS];\n\n// Other uniforms\nuniform vec3 u_viewPos;\n\n// Output\nout vec4 fragColor;\n\nfloat getShadowMap(int index, vec2 coords) {\n    // We have to use a switch statement because WebGL2 requires constant array indices for samplers\n    switch(index) {\n        case 0: return texture(u_shadowMap0, coords).r;\n        case 1: return texture(u_shadowMap1, coords).r;\n        case 2: return texture(u_shadowMap2, coords).r;\n        case 3: return texture(u_shadowMap3, coords).r;\n        case 4: return texture(u_shadowMap4, coords).r;\n        case 5: return texture(u_shadowMap5, coords).r;\n        case 6: return texture(u_shadowMap6, coords).r;\n        case 7: return texture(u_shadowMap7, coords).r;\n        case 8: return texture(u_shadowMap8, coords).r;\n        case 9: return texture(u_shadowMap9, coords).r;\n        default: return 1.0; // No shadow if invalid index\n    }\n}\n\nfloat ShadowCalculation(vec4 fragPosLightSpace, vec3 normal, vec3 lightDir, int shadowMapIndex) {\n    // Perform perspective divide\n    vec3 projCoords = fragPosLightSpace.xyz / fragPosLightSpace.w;\n    \n    // Transform to [0,1] range\n    projCoords = projCoords * 0.5 + 0.5;\n    \n    // Get closest depth value from light's perspective using the helper function\n    float closestDepth = getShadowMap(shadowMapIndex, projCoords.xy);\n    \n    // Get current depth\n    float currentDepth = projCoords.z;\n    \n    // Calculate bias based on surface angle\n    float cosTheta = dot(normal, lightDir);\n    float bias = 0.01; // Moderate base bias\n    \n    // Add angle-dependent component\n    bias += 0.02 * (1.0 - max(cosTheta, 0.0));\n    \n    // PCF (Percentage Closer Filtering)\n    float shadow = 0.0;\n    vec2 texelSize = 1.0 / vec2(textureSize(u_shadowMap0, 0)); // All shadow maps are same size\n    for(int x = -1; x <= 1; ++x) {\n        for(int y = -1; y <= 1; ++y) {\n            float pcfDepth = getShadowMap(shadowMapIndex, projCoords.xy + vec2(x, y) * texelSize);\n            shadow += (currentDepth - bias) > pcfDepth ? 1.0 : 0.0;\n        }\n    }\n    shadow /= 9.0;\n    \n    // Keep shadow at 0.0 when outside the far plane region of the light's frustum\n    if(projCoords.z > 1.0)\n        shadow = 0.0;\n        \n    return shadow;\n}\n\n// Function to calculate directional light\nvec3 calcDirectionalLight(int index, vec3 normal, vec3 viewDir, vec3 baseColor) {\n    vec3 lightDir = normalize(-u_lightDirections[index]);\n    \n    // Diffuse\n    float diff = max(dot(normal, lightDir), 0.0);\n    \n    // Specular\n    vec3 reflectDir = reflect(-lightDir, normal);\n    float spec = pow(max(dot(viewDir, reflectDir), 0.0), u_material.shininess);\n    \n    vec3 ambient = u_lightColors[index] * u_material.ambient;\n    vec3 diffuse = u_lightColors[index] * diff * baseColor;\n    vec3 specular = u_lightColors[index] * spec * u_material.specular;\n    \n    return (ambient + diffuse + specular) * u_lightIntensities[index];\n}\n\n// Function to calculate point light\nvec3 calcPointLight(int index, vec3 normal, vec3 fragPos, vec3 viewDir, vec3 baseColor) {\n    vec3 lightDir = normalize(u_lightPositions[index] - fragPos);\n    \n    // Diffuse\n    float diff = max(dot(normal, lightDir), 0.0);\n    \n    // Specular\n    vec3 reflectDir = reflect(-lightDir, normal);\n    float spec = pow(max(dot(viewDir, reflectDir), 0.0), u_material.shininess);\n    \n    // Attenuation\n    float distance = length(u_lightPositions[index] - fragPos);\n    float attenuation = 1.0 / (u_lightConstants[index] + u_lightLinears[index] * distance + u_lightQuadratics[index] * distance * distance);\n    \n    vec3 ambient = u_lightColors[index] * u_material.ambient;\n    vec3 diffuse = u_lightColors[index] * diff * baseColor;\n    vec3 specular = u_lightColors[index] * spec * u_material.specular;\n    \n    return (ambient + diffuse + specular) * attenuation * u_lightIntensities[index];\n}\n\n// Function to calculate spot light\nvec3 calcSpotLight(int index, vec3 normal, vec3 fragPos, vec3 viewDir, vec3 baseColor) {\n    vec3 lightDir = normalize(u_lightPositions[index] - fragPos);\n    \n    // Spot light intensity\n    float theta = dot(lightDir, normalize(-u_lightDirections[index]));\n    float epsilon = u_lightCutOffs[index] - u_lightOuterCutOffs[index];\n    float intensity = clamp((theta - u_lightOuterCutOffs[index]) / epsilon, 0.0, 1.0);\n    \n    // Use point light calculation and multiply by spot intensity\n    return calcPointLight(index, normal, fragPos, viewDir, baseColor) * intensity;\n}\n\nvoid main() {\n    vec3 normal = normalize(v_normal);\n    vec3 viewDir = normalize(u_viewPos - v_fragPos);\n    \n    // Get base color from texture or vertex color\n    vec3 baseColor;\n    if (u_useTexture) {\n        baseColor = texture(u_material.diffuseMap, v_texCoord).rgb;\n    } else {\n        baseColor = v_color;\n    }\n    \n    vec3 result = vec3(0.0);\n    \n    // Calculate contribution from each light\n    for(int i = 0; i < u_numLights; i++) {\n        if(i >= MAX_LIGHTS) break;\n        \n        // Skip inactive lights\n        if(u_lightTypes[i] == LIGHT_TYPE_INACTIVE) continue;\n        \n        float shadow = 0.0;\n        if(u_castsShadow[i]) {\n            vec4 fragPosLightSpace = u_lightSpaceMatrices[i] * vec4(v_fragPos, 1.0);\n            shadow = ShadowCalculation(fragPosLightSpace, normal, normalize(u_lightPositions[i] - v_fragPos), i);\n        }\n        \n        if(u_lightTypes[i] == LIGHT_TYPE_AMBIENT) {\n            result += u_lightColors[i] * u_lightIntensities[i] * baseColor;\n        }\n        else if(u_lightTypes[i] == LIGHT_TYPE_DIRECTIONAL) {\n            vec3 lighting = calcDirectionalLight(i, normal, viewDir, baseColor);\n            result += lighting * (1.0 - shadow);\n        }\n        else if(u_lightTypes[i] == LIGHT_TYPE_POINT) {\n            vec3 lighting = calcPointLight(i, normal, v_fragPos, viewDir, baseColor);\n            result += lighting * (1.0 - shadow);\n        }\n        else if(u_lightTypes[i] == LIGHT_TYPE_SPOT) {\n            vec3 lighting = calcSpotLight(i, normal, v_fragPos, viewDir, baseColor);\n            result += lighting * (1.0 - shadow);\n        }\n    }\n    \n    fragColor = vec4(result, 1.0);\n}";

// ts/classes/webgl2/shaders/vertexShaderSource.ts
var vertexShaderSource = "#version 300 es\nprecision highp float;\n\n// Attributes\nin vec3 a_position;\nin vec3 a_normal;\nin vec2 a_texCoord;\nin vec3 a_color;\n\n// Uniforms\nuniform mat4 u_modelMatrix;\nuniform mat4 u_viewMatrix;\nuniform mat4 u_projectionMatrix;\nuniform mat3 u_normalMatrix; // Added for correct normal transformation\n\n// Material uniforms\nstruct Material {\n    vec3 ambient;\n    vec3 diffuse;\n    vec3 specular;\n    float shininess;\n    sampler2D diffuseMap;\n};\nuniform Material u_material;\nuniform bool u_useTexture;\n\n// Varyings (output to fragment shader)\nout vec3 v_normal;\nout vec2 v_texCoord;\nout vec3 v_fragPos;\nout vec3 v_color;\n\nvoid main() {\n    v_fragPos = vec3(u_modelMatrix * vec4(a_position, 1.0));\n    v_normal = u_normalMatrix * a_normal;\n    v_texCoord = a_texCoord;\n    v_color = a_color;\n    \n    gl_Position = u_projectionMatrix * u_viewMatrix * vec4(v_fragPos, 1.0);\n}";

// ts/classes/webgl2/shaders/shadowVertexShader.ts
var shadowVertexShaderSource = "#version 300 es\nprecision highp float;\n\nin vec3 a_position;\nuniform mat4 u_lightSpaceMatrix;\nuniform mat4 u_modelMatrix;\n\nvoid main() {\n    gl_Position = u_lightSpaceMatrix * u_modelMatrix * vec4(a_position, 1.0);\n}\n";

// ts/classes/webgl2/shaders/pbrVertexShader.ts
var pbrVertexShader = "#version 300 es\nprecision highp float;\n\n// Attributes\nin vec3 a_position;\nin vec3 a_normal;\nin vec2 a_texCoord;\nin vec3 a_tangent;\nin vec3 a_bitangent;\nin vec3 a_color;\n\n// Uniforms\nuniform mat4 u_modelMatrix;\nuniform mat4 u_viewMatrix;\nuniform mat4 u_projectionMatrix;\nuniform mat3 u_normalMatrix;\n\n// Varyings (output to fragment shader)\nout vec3 v_position;\nout vec3 v_normal;\nout vec2 v_texCoord;\nout vec3 v_worldPos;\nout mat3 v_tbn; // Tangent-Bitangent-Normal matrix for normal mapping\nout vec3 v_color;\n\nvoid main() {\n    // Calculate world position\n    v_worldPos = vec3(u_modelMatrix * vec4(a_position, 1.0));\n    \n    // Transform normals using normal matrix\n    v_normal = normalize(u_normalMatrix * a_normal);\n    \n    // Pass texture coordinates\n    v_texCoord = a_texCoord;\n    \n    // Pass color\n    v_color = a_color;\n    \n    // Calculate TBN matrix for normal mapping when tangents are available\n    if (length(a_tangent) > 0.0) {\n        vec3 T = normalize(u_normalMatrix * a_tangent);\n        vec3 B = normalize(u_normalMatrix * a_bitangent);\n        vec3 N = v_normal;\n        v_tbn = mat3(T, B, N);\n    } else {\n        // Identity TBN when no tangents provided\n        v_tbn = mat3(1.0);\n    }\n    \n    // Calculate clip-space position\n    gl_Position = u_projectionMatrix * u_viewMatrix * vec4(v_worldPos, 1.0);\n}";

// ts/classes/webgl2/shaders/pbrFragmentShader.ts
var pbrFragmentShader = "#version 300 es\nprecision highp float;\n\n// Constants\n#define PI 3.14159265359\n#define MAX_LIGHTS 10\n\n// Light types\n#define LIGHT_TYPE_INACTIVE -1\n#define LIGHT_TYPE_AMBIENT 0\n#define LIGHT_TYPE_DIRECTIONAL 1\n#define LIGHT_TYPE_POINT 2\n#define LIGHT_TYPE_SPOT 3\n\n// PBR Material uniforms\nstruct PBRMaterial {\n    vec3 baseColor;\n    float roughness;\n    float metallic;\n    float ambientOcclusion;\n    vec3 emissive;\n    \n    sampler2D albedoMap;\n    sampler2D normalMap;\n    sampler2D metallicRoughnessMap;\n    sampler2D aoMap;\n    sampler2D emissiveMap;\n    \n    bool hasAlbedoMap;\n    bool hasNormalMap;\n    bool hasMetallicRoughnessMap;\n    bool hasAoMap;\n    bool hasEmissiveMap;\n};\n\n// Light uniforms\nuniform int u_lightTypes[MAX_LIGHTS];\nuniform vec3 u_lightPositions[MAX_LIGHTS];\nuniform vec3 u_lightDirections[MAX_LIGHTS];\nuniform vec3 u_lightColors[MAX_LIGHTS];\nuniform float u_lightIntensities[MAX_LIGHTS];\nuniform float u_lightConstants[MAX_LIGHTS];\nuniform float u_lightLinears[MAX_LIGHTS];\nuniform float u_lightQuadratics[MAX_LIGHTS];\nuniform float u_lightCutOffs[MAX_LIGHTS];\nuniform float u_lightOuterCutOffs[MAX_LIGHTS];\nuniform int u_numLights;\n\n// Shadow mapping uniforms\nuniform sampler2D u_shadowMap0;\nuniform sampler2D u_shadowMap1;\nuniform sampler2D u_shadowMap2;\nuniform sampler2D u_shadowMap3;\nuniform mat4 u_lightSpaceMatrices[MAX_LIGHTS];\nuniform bool u_castsShadow[MAX_LIGHTS];\n\n// Material uniforms\nuniform PBRMaterial u_material;\nuniform vec3 u_viewPos;\n\n// Varyings from vertex shader\nin vec3 v_normal;\nin vec2 v_texCoord;\nin vec3 v_worldPos;\nin mat3 v_tbn;\nin vec3 v_color;\n\n// Output\nout vec4 fragColor;\n\n// Utility function to get shadowmap value\nfloat getShadowMap(int index, vec2 coords) {\n    // We have to use a switch statement because WebGL2 requires constant array indices for samplers\n    // Note: Explicitly using .r component as we're using DEPTH_COMPONENT textures\n    switch(index) {\n        case 0: return texture(u_shadowMap0, coords).r;\n        case 1: return texture(u_shadowMap1, coords).r;\n        case 2: return texture(u_shadowMap2, coords).r;\n        case 3: return texture(u_shadowMap3, coords).r;\n        default: return 1.0; // No shadow if invalid index\n    }\n}\n\n// Shadow calculation function\nfloat ShadowCalculation(vec4 fragPosLightSpace, vec3 normal, vec3 lightDir, int shadowMapIndex) {\n    // Ensure we only process shadow maps that exist in the shader\n    if (shadowMapIndex > 3) {\n        return 0.0; // Return no shadow if the index is beyond the available shadow maps\n    }\n    \n    // Perform perspective divide\n    vec3 projCoords = fragPosLightSpace.xyz / fragPosLightSpace.w;\n    \n    // Transform to [0,1] range\n    projCoords = projCoords * 0.5 + 0.5;\n    \n    // Check if fragment is in light's view frustum\n    if (projCoords.x < 0.0 || projCoords.x > 1.0 || \n        projCoords.y < 0.0 || projCoords.y > 1.0 || \n        projCoords.z < 0.0 || projCoords.z > 1.0) {\n        return 0.0; // Not in shadow if outside frustum\n    }\n    \n    // Calculate bias based on surface angle to reduce shadow acne\n    // Use a smaller bias since we've improved shadow map precision\n    float bias = max(0.001 * (1.0 - dot(normal, lightDir)), 0.0005);\n    \n    // Get depth from shadow map\n    float closestDepth = getShadowMap(shadowMapIndex, projCoords.xy);\n    float currentDepth = projCoords.z;\n    \n    // Debug - uncomment to log values\n    // if (gl_FragCoord.x < 1.0 && gl_FragCoord.y < 1.0) {\n    //     float diff = currentDepth - closestDepth;\n    //     if (abs(diff) < 0.1) {\n    //         // Add code to print values if needed\n    //     }\n    // }\n    \n    // Simple shadow check with bias\n    // return (currentDepth - bias) > closestDepth ? 1.0 : 0.0;\n    \n    // PCF (Percentage Closer Filtering) with larger kernel for softer shadows\n    float shadow = 0.0;\n    vec2 texelSize = 1.0 / vec2(textureSize(u_shadowMap0, 0));\n    \n    for(int x = -2; x <= 2; ++x) {\n        for(int y = -2; y <= 2; ++y) {\n            float pcfDepth = getShadowMap(shadowMapIndex, projCoords.xy + vec2(x, y) * texelSize);\n            shadow += (currentDepth - bias) > pcfDepth ? 1.0 : 0.0;\n        }\n    }\n    \n    shadow /= 25.0; // 5x5 kernel\n    \n    // Fade out shadows at the edge of the light's frustum for smoother transitions\n    float fadeStart = 0.9;\n    float distanceFromCenter = length(vec2(0.5, 0.5) - projCoords.xy) * 2.0;\n    if (distanceFromCenter > fadeStart) {\n        float fadeRatio = (distanceFromCenter - fadeStart) / (1.0 - fadeStart);\n        shadow = mix(shadow, 0.0, fadeRatio);\n    }\n    \n    return shadow;\n}\n\n// PBR functions\n\n// Normal Distribution Function (GGX/Trowbridge-Reitz)\nfloat DistributionGGX(vec3 N, vec3 H, float roughness) {\n    float a = roughness * roughness;\n    float a2 = a * a;\n    float NdotH = max(dot(N, H), 0.0);\n    float NdotH2 = NdotH * NdotH;\n    \n    float denom = (NdotH2 * (a2 - 1.0) + 1.0);\n    denom = PI * denom * denom;\n    \n    return a2 / max(denom, 0.0000001);\n}\n\n// Geometry function (Smith model)\nfloat GeometrySchlickGGX(float NdotV, float roughness) {\n    float r = (roughness + 1.0);\n    float k = (r * r) / 8.0;\n    \n    float denom = NdotV * (1.0 - k) + k;\n    return NdotV / max(denom, 0.0000001);\n}\n\n// Combined Geometry function\nfloat GeometrySmith(vec3 N, vec3 V, vec3 L, float roughness) {\n    float NdotV = max(dot(N, V), 0.0);\n    float NdotL = max(dot(N, L), 0.0);\n    float ggx2 = GeometrySchlickGGX(NdotV, roughness);\n    float ggx1 = GeometrySchlickGGX(NdotL, roughness);\n    \n    return ggx1 * ggx2;\n}\n\n// Fresnel function (Schlick's approximation)\nvec3 FresnelSchlick(float cosTheta, vec3 F0) {\n    return F0 + (1.0 - F0) * pow(max(1.0 - cosTheta, 0.0), 5.0);\n}\n\n// Calculates radiance for a light source\nvec3 calculateRadiance(vec3 N, vec3 V, vec3 L, vec3 H, vec3 F0, \n                       vec3 albedo, float metallic, float roughness,\n                       vec3 lightColor, float lightIntensity,\n                       float attenuation) {\n    // Calculate light attenuation\n    float attenuatedIntensity = lightIntensity * attenuation;\n    \n    // Ensure roughness is never zero (to prevent divide-by-zero in GGX)\n    roughness = max(roughness, 0.01);\n    \n    // Cook-Torrance BRDF calculation\n    float NDF = DistributionGGX(N, H, roughness);\n    float G = GeometrySmith(N, V, L, roughness);\n    vec3 F = FresnelSchlick(max(dot(H, V), 0.0), F0);\n    \n    // Calculate specular component\n    vec3 numerator = NDF * G * F;\n    float denominator = 4.0 * max(dot(N, V), 0.0) * max(dot(N, L), 0.0);\n    vec3 specular = numerator / max(denominator, 0.0000001);\n    \n    // Prevent uncontrolled specular highlights by clamping\n    specular = min(specular, vec3(10.0));\n    \n    // For energy conservation\n    vec3 kS = F;\n    vec3 kD = vec3(1.0) - kS;\n    kD *= 1.0 - metallic; // Metallic materials don't have diffuse\n    \n    // Combine diffuse and specular terms\n    float NdotL = max(dot(N, L), 0.0);\n    return (kD * albedo / PI + specular) * lightColor * attenuatedIntensity * NdotL;\n}\n\nvoid main() {\n    // Get material properties, using textures if available\n    \n    // Base color (albedo)\n    vec3 albedo = u_material.baseColor;\n    if (u_material.hasAlbedoMap) {\n        albedo = texture(u_material.albedoMap, v_texCoord).rgb;\n    } else {\n        // Use vertex color if no albedo map is provided\n        albedo = v_color;\n    }\n    \n    // Metallic and roughness\n    float metallic = u_material.metallic;\n    float roughness = u_material.roughness;\n    if (u_material.hasMetallicRoughnessMap) {\n        // Standard PBR convention: G channel = roughness, B channel = metallic\n        vec3 metallicRoughness = texture(u_material.metallicRoughnessMap, v_texCoord).rgb;\n        roughness = metallicRoughness.g;\n        metallic = metallicRoughness.b;\n    }\n    \n    // Ambient occlusion\n    float ao = u_material.ambientOcclusion;\n    if (u_material.hasAoMap) {\n        ao = texture(u_material.aoMap, v_texCoord).r;\n    }\n    \n    // Normals (with normal mapping if available)\n    vec3 N = normalize(v_normal);\n    if (u_material.hasNormalMap) {\n        vec3 normalMapValue = texture(u_material.normalMap, v_texCoord).rgb * 2.0 - 1.0;\n        N = normalize(v_tbn * normalMapValue);\n    }\n    \n    // Emissive\n    vec3 emissive = u_material.emissive;\n    if (u_material.hasEmissiveMap) {\n        emissive = texture(u_material.emissiveMap, v_texCoord).rgb;\n    }\n    \n    // Calculate view direction\n    vec3 V = normalize(u_viewPos - v_worldPos);\n    \n    // Calculate fresnel reflection at normal incidence (F0)\n    // For most materials, F0 is monochromatic (0.04)\n    // For metals, we use the albedo color \n    vec3 F0 = vec3(0.04);\n    F0 = mix(F0, albedo, metallic);\n    \n    // Initialize result\n    vec3 Lo = vec3(0.0);\n    \n    // Calculate lighting contribution from each light\n    for(int i = 0; i < u_numLights; i++) {\n        if(i >= MAX_LIGHTS || u_lightTypes[i] == LIGHT_TYPE_INACTIVE) \n            continue;\n        \n        // Calculate light direction and intensity\n        vec3 L;\n        float attenuation = 1.0;\n        \n        if (u_lightTypes[i] == LIGHT_TYPE_DIRECTIONAL) {\n            // Directional light\n            L = normalize(-u_lightDirections[i]);\n        } \n        else if (u_lightTypes[i] == LIGHT_TYPE_POINT || u_lightTypes[i] == LIGHT_TYPE_SPOT) {\n            // Point or spot light\n            L = normalize(u_lightPositions[i] - v_worldPos);\n            \n            // Calculate attenuation\n            float distance = length(u_lightPositions[i] - v_worldPos);\n            attenuation = 1.0 / (u_lightConstants[i] + \n                                 u_lightLinears[i] * distance + \n                                 u_lightQuadratics[i] * distance * distance);\n            \n            // For spot lights, calculate spotlight intensity\n            if (u_lightTypes[i] == LIGHT_TYPE_SPOT) {\n                float theta = dot(L, normalize(-u_lightDirections[i]));\n                float epsilon = u_lightCutOffs[i] - u_lightOuterCutOffs[i];\n                float intensity = clamp((theta - u_lightOuterCutOffs[i]) / epsilon, 0.0, 1.0);\n                attenuation *= intensity;\n            }\n        }\n        else if (u_lightTypes[i] == LIGHT_TYPE_AMBIENT) {\n            // Ambient light (applied separately)\n            continue;\n        }\n        \n        // Calculate half vector\n        vec3 H = normalize(V + L);\n        \n        // Calculate shadow\n        float shadow = 0.0;\n        if(u_castsShadow[i]) {\n            vec4 fragPosLightSpace = u_lightSpaceMatrices[i] * vec4(v_worldPos, 1.0);\n            shadow = ShadowCalculation(fragPosLightSpace, N, L, i);\n        }\n        \n        // Add light contribution\n        vec3 radiance = calculateRadiance(N, V, L, H, F0, albedo, metallic, roughness,\n                                         u_lightColors[i], u_lightIntensities[i],\n                                         attenuation);\n        \n        Lo += radiance * (1.0 - shadow);\n    }\n    \n    // Add ambient light contribution (factoring in ambient occlusion)\n    vec3 ambient = vec3(0.0); // Initialize with no ambient\n\n    // Add ambient from any ambient light sources\n    for(int i = 0; i < u_numLights; i++) {\n        if(i < MAX_LIGHTS && u_lightTypes[i] == LIGHT_TYPE_AMBIENT) {\n            ambient += u_lightColors[i] * u_lightIntensities[i] * albedo * ao;\n        }\n    }\n\n    // Add emissive contribution\n    vec3 color = ambient + Lo + emissive;\n\n    // Calculate rim lighting based on lights in the scene\n    vec3 rimColor = vec3(0.0);\n    float rimPower = 3.0; // Controls how sharp the rim effect is\n    float viewFacing = 1.0 - max(dot(N, V), 0.0);\n    \n    // Add rim contribution from each light\n    for(int i = 0; i < u_numLights; i++) {\n        if(i >= MAX_LIGHTS || u_lightTypes[i] == LIGHT_TYPE_INACTIVE || u_lightTypes[i] == LIGHT_TYPE_AMBIENT) \n            continue;\n            \n        vec3 L;\n        float rimStrength = 0.0;\n        \n        if (u_lightTypes[i] == LIGHT_TYPE_DIRECTIONAL) {\n            L = normalize(-u_lightDirections[i]);\n            rimStrength = u_lightIntensities[i] * 0.3; // Scale rim by light intensity\n        } \n        else if (u_lightTypes[i] == LIGHT_TYPE_POINT || u_lightTypes[i] == LIGHT_TYPE_SPOT) {\n            vec3 lightToPos = v_worldPos - u_lightPositions[i];\n            L = normalize(lightToPos);\n            \n            // Rim strength falls off with distance\n            float distance = length(lightToPos);\n            float attenuation = 1.0 / (u_lightConstants[i] + \n                                     u_lightLinears[i] * distance + \n                                     u_lightQuadratics[i] * distance * distance);\n                                     \n            rimStrength = u_lightIntensities[i] * attenuation * 0.3;\n            \n            // For spotlights, consider the cone angle\n            if (u_lightTypes[i] == LIGHT_TYPE_SPOT) {\n                float theta = dot(-L, normalize(u_lightDirections[i]));\n                float epsilon = u_lightCutOffs[i] - u_lightOuterCutOffs[i];\n                rimStrength *= clamp((theta - u_lightOuterCutOffs[i]) / epsilon, 0.0, 1.0);\n            }\n        }\n        \n        // Calculate rim contribution from this light\n        float lightRim = pow(viewFacing * max(dot(L, N), 0.0), rimPower) * rimStrength;\n        rimColor += u_lightColors[i] * lightRim;\n    }\n    \n    // Add rim lighting to final color\n    color += rimColor * albedo;\n\n    // Enhance colored light visibility\n    color = mix(color, color * 1.2, metallic);\n\n    // Prevent oversaturation by clamping extremely bright values\n    float maxLuminance = max(max(color.r, color.g), color.b);\n    if (maxLuminance > 10.0) {\n        color *= 10.0 / maxLuminance;\n    }\n\n    // Apply ACES filmic tone mapping for better dynamic range\n    // Source: https://knarkowicz.wordpress.com/2016/01/06/aces-filmic-tone-mapping-curve/\n    vec3 mapped = (color * (2.51 * color + 0.03)) / (color * (2.43 * color + 0.59) + 0.14);\n    mapped = clamp(mapped, 0.0, 1.0);\n\n    // Gamma correction\n    color = pow(mapped, vec3(1.0/2.2));\n\n    fragColor = vec4(color, 1.0);\n}";

// ts/classes/webgl2/shaders/debugDepthShader.ts
var debugDepthVertexShader = "#version 300 es\nprecision highp float;\n\nin vec2 a_position;\nin vec2 a_texCoord;\n\nout vec2 v_texCoord;\n\nvoid main() {\n    v_texCoord = a_texCoord;\n    gl_Position = vec4(a_position, 0.0, 1.0);\n}\n";
var debugDepthFragmentShader = "#version 300 es\nprecision highp float;\n\nuniform sampler2D u_texture;\nin vec2 v_texCoord;\nout vec4 fragColor;\n\nvoid main() {\n    float depth = texture(u_texture, v_texCoord).r;\n    \n    // Output raw depth values for better debugging\n    // Don't apply any transformations to better see the actual values\n    if (depth == 0.0) {\n        // Show black for zero depth - may indicate problems\n        fragColor = vec4(0.0, 0.0, 0.0, 1.0);\n    } else if (depth >= 1.0) {\n        // Show white for maximum depth\n        fragColor = vec4(1.0, 1.0, 1.0, 1.0);\n    } else {\n        // Apply gray scale for full depth range\n        fragColor = vec4(vec3(depth), 1.0);\n        \n        // Add grid lines for depth value reference\n        vec2 grid = fract(v_texCoord * 10.0);\n        float line = 0.05;\n        if (grid.x < line || grid.y < line) {\n            // Add slight color to grid lines\n            fragColor.rgb = mix(fragColor.rgb, vec3(0.5, 0.5, 1.0), 0.2);\n        }\n    }\n}\n";

// ts/classes/webgl2/initialise.ts
var WebGL2Initializer = class {
  constructor(canvas) {
    this.ctx = null;
    if (!canvas) {
      throw new Error("Canvas not found");
    }
    this.canvas = canvas;
    this.ctx = this.initializeWebGL2();
    this.shaderManager = new ShaderManager(this.ctx);
    this.vao = new VertexArray(this.ctx);
    this.vertexBuffer = new VertexBuffer(this.ctx);
    this.indexBuffer = new IndexBuffer(this.ctx);
    this.shaderManager.loadShaderProgram("basic", vertexShaderSource, fragmentShaderSource);
    this.shaderManager.loadShaderProgram("pbr", pbrVertexShader, pbrFragmentShader);
    this.shaderManager.loadShaderProgram("shadow", shadowVertexShaderSource, "#version 300 es\n            precision highp float;\n            out vec4 fragColor;\n            void main() {\n                // Explicitly output a color (not used) but required for valid fragment shader\n                // The actual depth is written automatically by WebGL\n                fragColor = vec4(1.0, 1.0, 1.0, 1.0);\n            }\n        ");
    this.shaderManager.loadShaderProgram("debug", debugDepthVertexShader, debugDepthFragmentShader);
    this.shaderManager.useProgram("pbr");
    const numLights = 10;
    const types = new Int32Array(numLights);
    const positions = new Float32Array(numLights * 3);
    const directions = new Float32Array(numLights * 3);
    const colors = new Float32Array(numLights * 3);
    const intensities = new Float32Array(numLights);
    const constants = new Float32Array(numLights);
    const linears = new Float32Array(numLights);
    const quadratics = new Float32Array(numLights);
    const cutOffs = new Float32Array(numLights);
    const outerCutOffs = new Float32Array(numLights);
    types.fill(-1);
    constants.fill(1);
    this.shaderManager.setUniform("u_numLights", 0);
    this.shaderManager.setUniform("u_lightTypes", types);
    this.shaderManager.setUniform("u_lightPositions", positions);
    this.shaderManager.setUniform("u_lightDirections", directions);
    this.shaderManager.setUniform("u_lightColors", colors);
    this.shaderManager.setUniform("u_lightIntensities", intensities);
    this.shaderManager.setUniform("u_lightConstants", constants);
    this.shaderManager.setUniform("u_lightLinears", linears);
    this.shaderManager.setUniform("u_lightQuadratics", quadratics);
    this.shaderManager.setUniform("u_lightCutOffs", cutOffs);
    this.shaderManager.setUniform("u_lightOuterCutOffs", outerCutOffs);
    const castsShadow = new Int32Array(numLights);
    const lightSpaceMatrices = new Float32Array(numLights * 16);
    castsShadow.fill(1);
    this.shaderManager.setUniform("u_castsShadow", castsShadow);
    this.shaderManager.setUniform("u_lightSpaceMatrices", lightSpaceMatrices);
    this.shaderManager.setUniform("u_material.baseColor", new Float32Array([0.8, 0.8, 0.8]));
    this.shaderManager.setUniform("u_material.roughness", 0.5);
    this.shaderManager.setUniform("u_material.metallic", 0);
    this.shaderManager.setUniform("u_material.ambientOcclusion", 1);
    this.shaderManager.setUniform("u_material.emissive", new Float32Array([0, 0, 0]));
    this.shaderManager.setUniform("u_material.hasAlbedoMap", 0);
    this.shaderManager.setUniform("u_material.hasNormalMap", 0);
    this.shaderManager.setUniform("u_material.hasMetallicRoughnessMap", 0);
    this.shaderManager.setUniform("u_material.hasAoMap", 0);
    this.shaderManager.setUniform("u_material.hasEmissiveMap", 0);
    this.shaderManager.setUniform("u_viewPos", new Float32Array([0, 1, 6]));
    this.ctx.enable(this.ctx.DEPTH_TEST);
    this.ctx.enable(this.ctx.CULL_FACE);
    this.ctx.blendFunc(this.ctx.SRC_ALPHA, this.ctx.ONE_MINUS_SRC_ALPHA);
    this.ctx.enable(this.ctx.BLEND);
  }
  initializeWebGL2() {
    const ctx = this.canvas.getContext("webgl2");
    if (!ctx) {
      throw new Error("WebGL 2 not supported");
    }
    return ctx;
  }
};

// ts/classes/elements/renderer.ts
var Renderer = class extends DomElement {
  constructor() {
    super("canvas");
    this.held = false;
    this.dom.style.position = "absolute";
    this.dom.style.pointerEvents = "all";
    this.dom.style.bottom = "0px";
    this.dom.style.touchAction = "none";
    this.dom.tabIndex = 1;
    this.webgl = new WebGL2Initializer(this.dom);
    window.addEventListener("resize", () => {
      this.resize();
    });
    glob.events.resize = new Events("resize");
    this.dom.addEventListener("mousedown", (e) => {
      this.lastClick = v2(e.offsetX / this.width, e.offsetY / this.height);
    });
    this.dom.addEventListener("mousemove", (e) => {
      if (this.lastClick) {
        this.lastClick = v2(e.offsetX / this.width, e.offsetY / this.height);
      }
    });
    this.dom.addEventListener("mouseup", (e) => {
      this.lastClick = null;
    });
    this.resize();
  }
  get ctx() {
    return this.webgl.ctx;
  }
  get shaderManager() {
    return this.webgl.shaderManager;
  }
  resize() {
    this.size = v2(document.body.clientWidth, document.body.clientHeight);
    this.dom.style.width = "".concat(this.size.x, "px");
    this.dom.setAttribute("width", String(this.size.x));
    this.dom.style.height = "".concat(this.size.y, "px");
    this.dom.setAttribute("height", String(this.size.y));
    glob.events.resize.alert(this.size);
    this.ctx.viewport(0, 0, this.size.x, this.size.y);
  }
  get width() {
    return this.size.x;
  }
  set width(value) {
    this.dom.style.width = "".concat(value, "px");
    this.dom.setAttribute("width", String(value));
    this.size.x = value;
  }
  get height() {
    return this.size.y;
  }
  set height(value) {
    this.dom.style.height = "".concat(value, "px");
    this.dom.setAttribute("height", String(value));
    this.size.y = value;
  }
  tick(obj) {
    var _a, _b, _c;
    super.tick(obj);
    this.tickerData = obj;
    if (this.lastClick) {
      (_a = glob.game.active) == null ? void 0 : _a.click(this.lastClick);
    }
    (_b = glob.game.active) == null ? void 0 : _b.tick(obj);
    (_c = glob.game.active) == null ? void 0 : _c.afterTick(obj);
  }
};

// ts/classes/input/gamepad.ts
var Pad = class {
  constructor(gamepad) {
    this.gamepad = gamepad;
  }
  tick() {
    this.recentPad = navigator.getGamepads().find((g) => g.id === this.gamepad.id);
  }
};

// ts/classes/input/gamepadManager.ts
var PadManager = class {
  constructor() {
    this.pads = {};
    window.addEventListener("gamepadconnected", this.connect.bind(this));
    window.addEventListener("gamepaddisconnected", this.disconnect.bind(this));
  }
  connect(e) {
    this.pads[e.gamepad.id] = new Pad(e.gamepad);
  }
  disconnect(e) {
    delete this.pads[e.gamepad.id];
  }
  tick() {
    Object.values(this.pads).forEach((pad) => {
      pad.tick();
    });
  }
};

// ts/classes/elements/domText.ts
var DomText = class extends DomElement {
  set color(v) {
    this.dom.style.color = v;
  }
  set fontSize(v) {
    this.dom.style.fontSize = String(v) + "px";
  }
  set fontWeight(v) {
    this.dom.style.fontWeight = String(v);
  }
  set fontFamily(v) {
    this.dom.style.fontFamily = v;
  }
  get text() {
    return this.dom.innerHTML;
  }
  set text(v) {
    this.dom.innerHTML = v ? v : "";
  }
  set padding(v) {
    this.dom.style.padding = v.join("px ") + "px";
  }
  constructor(attr = {}) {
    super("div", attr);
    this.color = attr.color;
    this.text = attr.text;
    this.fontSize = attr.fontSize;
    this.fontWeight = attr.fontWeight;
    this.fontFamily = attr.fontFamily;
    this.padding = attr.padding || [0, 0, 0, 0];
    this.dom.style.pointerEvents = "none";
    this.dom.style.userSelect = "none";
    this.dom.style.zIndex = "1";
    this.dom.style.whiteSpace = "pre-line";
  }
};

// ts/classes/input/inputDevices.ts
var Keyboard = class {
  constructor() {
    this.keyDown = {};
    this.keyUp = {};
  }
  ready() {
    glob.renderer.dom.addEventListener("keydown", (e) => {
      var _a;
      const k = e.key.toLowerCase();
      (_a = this.keyDown[k]) == null ? void 0 : _a.forEach((c) => {
        c(glob.frame);
      });
    });
    glob.renderer.dom.addEventListener("keyup", (e) => {
      var _a;
      const k = e.key.toLowerCase();
      (_a = this.keyUp[k]) == null ? void 0 : _a.forEach((c) => {
        c();
      });
    });
  }
  register(key, down, up) {
    const k = key.toLowerCase();
    if (this.keyDown[k])
      this.keyDown[k].push(down);
    else
      this.keyDown[k] = [down];
    if (this.keyUp[k])
      this.keyUp[k].push(up);
    else
      this.keyUp[k] = [up];
  }
};
var InputDevices = class {
  constructor() {
    this.keyboard = new Keyboard();
    this.overlay = new DomText({
      text: "Pauzed"
    });
    this.overlay.dom.setAttribute(
      "style",
      "\n            transform-origin: left bottom;\n            pointer-events: none;\n            bottom: 0px;\n            left: 0px;\n            user-select: none;\n            z-index: 999;\n            position: absolute;\n            height: 100vh;\n            width: 100vw;\n            color: white !important;\n            font-family: monospace;\n            font-weight: bold;\n            font-size: 40px;\n            padding-left: 50px;\n            padding-top: 20px;\n            box-sizing: border-box;\n            display: none;\n            text-transform: uppercase;"
    );
  }
  get locked() {
    return this._locked;
  }
  set locked(value) {
    this._locked = value;
  }
  ready() {
    window.addEventListener("contextmenu", (e) => e.preventDefault());
    this.mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (this.mobile) {
      this.locked = true;
    } else {
      document.body.appendChild(this.overlay.dom);
    }
    this.keyboard.ready();
  }
};

// ts/classes/util/utils.ts
var Util = class {
  static clamp(value, min2, max2) {
    return Math.max(Math.min(value, max2), min2);
  }
  static to0(value, tolerance = 0.1) {
    return Math.abs(value) < tolerance ? 0 : value;
  }
  static chunk(array, size) {
    const output = [];
    for (let i = 0; i < array.length; i += size) {
      output.push(array.slice(i, i + size));
    }
    return output;
  }
  static padArray(ar, b, len2) {
    return ar.concat(Array.from(Array(len2).fill(b))).slice(0, len2);
  }
  static addArrays(ar, br) {
    return ar.map((a, i) => a + br[i]);
  }
  static subtractArrays(ar, br) {
    return ar.map((a, i) => a - br[i]);
  }
  static multiplyArrays(ar, br) {
    return ar.map((a, i) => a * br[i]);
  }
  static scaleArrays(ar, b) {
    return ar.map((a, i) => a * b);
  }
  static radToDeg(r) {
    return r * 180 / Math.PI;
  }
  static degToRad(d) {
    return d * Math.PI / 180;
  }
  static closestVectorMagniture(vectors, target) {
    let current;
    vectors.forEach((v) => {
      if (current === void 0 || Math.abs(v.magnitude()) < Math.abs(current.magnitude()))
        current = v;
      else {
      }
    });
    return current;
  }
};

// ts/classes/util/math/vector3.ts
function v3(a, b, c) {
  if (typeof a === "number") {
    return Vector3.f(a, b, c);
  } else if (typeof a === "undefined") {
    return Vector3.f(0);
  } else {
    return Vector3.f(...a);
  }
}
var Vector3 = class _Vector3 {
  get pitch() {
    return this.x;
  }
  set pitch(value) {
    this.x = value;
  }
  get yaw() {
    return this.y;
  }
  set yaw(value) {
    this.y = value;
  }
  get roll() {
    return this.z;
  }
  set roll(value) {
    this.z = value;
  }
  get x() {
    return this.vec[0];
  }
  set x(value) {
    this.vec[0] = value;
  }
  get y() {
    return this.vec[1];
  }
  set y(value) {
    this.vec[1] = value;
  }
  get z() {
    return this.vec[2];
  }
  set z(value) {
    this.vec[2] = value;
  }
  get xy() {
    return v2(this.x, this.y);
  }
  set xy(v) {
    this.x = v.x;
    this.y = v.y;
  }
  get xz() {
    return v2(this.x, this.z);
  }
  set xz(v) {
    this.x = v.x;
    this.z = v.y;
  }
  get yx() {
    return v2(this.y, this.x);
  }
  set yx(v) {
    this.y = v.x;
    this.x = v.y;
  }
  get yz() {
    return v2(this.y, this.z);
  }
  set yz(v) {
    this.y = v.x;
    this.z = v.y;
  }
  get zx() {
    return v2(this.z, this.x);
  }
  set zx(v) {
    this.z = v.x;
    this.x = v.y;
  }
  get zy() {
    return v2(this.z, this.y);
  }
  set zy(v) {
    this.z = v.x;
    this.y = v.y;
  }
  get xzy() {
    return v3(this.x, this.z, this.y);
  }
  set xzy(v) {
    this.x = v.x;
    this.z = v.y;
    this.y = v.z;
  }
  get xyz() {
    return v3(this.x, this.y, this.z);
  }
  set xyz(v) {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
  }
  get yxz() {
    return v3(this.y, this.x, this.z);
  }
  set yxz(v) {
    this.y = v.x;
    this.x = v.y;
    this.z = v.z;
  }
  get yzx() {
    return v3(this.y, this.z, this.x);
  }
  set yzx(v) {
    this.y = v.x;
    this.z = v.y;
    this.x = v.z;
  }
  get zxy() {
    return v3(this.z, this.x, this.y);
  }
  set zxy(v) {
    this.z = v.x;
    this.x = v.y;
    this.y = v.z;
  }
  get zyx() {
    return v3(this.z, this.y, this.x);
  }
  set zyx(v) {
    this.z = v.x;
    this.y = v.y;
    this.x = v.z;
  }
  get str() {
    return this.vec.toString();
  }
  get log() {
    console.log(this.str);
    return this.str;
  }
  constructor(x = 0, y = 0, z = 0) {
    this.vec = [x, y, z];
  }
  static from2(vector, z = 0) {
    return new _Vector3(vector.x, vector.y, z);
  }
  static f(x = 0, y = x, z = x) {
    return new _Vector3(x, y, z);
  }
  static get forwards() {
    return new _Vector3(0, 0, 1);
  }
  static get backwards() {
    return new _Vector3(0, 0, -1);
  }
  static get up() {
    return new _Vector3(0, 1, 0);
  }
  static get down() {
    return new _Vector3(0, -1, 0);
  }
  static get left() {
    return new _Vector3(-1, 0, 0);
  }
  static get right() {
    return new _Vector3(1, 0, 0);
  }
  static get PI() {
    return new _Vector3(Math.PI, Math.PI, Math.PI);
  }
  static get TAU() {
    return _Vector3.PI.scale(0.5);
  }
  get array() {
    return [this.x, this.y, this.z];
  }
  set array(a) {
    [this.x, this.y, this.z] = a;
  }
  forEach(callbackfn) {
    this.array.forEach(callbackfn);
  }
  get c() {
    return this.clone();
  }
  equals(vector) {
    return this.x === vector.x && this.y === vector.y && this.z === vector.z;
  }
  clone() {
    return new _Vector3(
      this.x,
      this.y,
      this.z
    );
  }
  add(...vectors) {
    return new _Vector3(
      this.x + vectors.reduce((a, b) => a + b.x, 0),
      this.y + vectors.reduce((a, b) => a + b.y, 0),
      this.z + vectors.reduce((a, b) => a + b.z, 0)
    );
  }
  multiply(a, b, c) {
    const [x, y, z] = typeof a === "number" ? [a, b, c] : a.array;
    return new _Vector3(
      this.x * x,
      this.y * y,
      this.z * z
    );
  }
  subtract(...vectors) {
    return new _Vector3(
      this.x - vectors.reduce((a, b) => a + b.x, 0),
      this.y - vectors.reduce((a, b) => a + b.y, 0),
      this.z - vectors.reduce((a, b) => a + b.z, 0)
    );
  }
  scale(...scalars) {
    return new _Vector3(
      this.x * scalars.reduce((a, b) => a * b, 1),
      this.y * scalars.reduce((a, b) => a * b, 1),
      this.z * scalars.reduce((a, b) => a * b, 1)
    );
  }
  divide(...vectors) {
    return new _Vector3(
      this.x / vectors.reduce((a, b) => a * b.x, 1),
      this.y / vectors.reduce((a, b) => a * b.y, 1),
      this.z / vectors.reduce((a, b) => a * b.z, 1)
    );
  }
  rotateXY(rad) {
    const [a, b] = this.xy.rotate(rad).array;
    return new _Vector3(
      a,
      this.y,
      b
    );
  }
  rotateXZ(rad) {
    const [a, b] = this.xz.rotate(rad).array;
    return new _Vector3(
      a,
      b,
      this.z
    );
  }
  rotateYZ(rad) {
    const [a, b] = this.yz.rotate(rad).array;
    return new _Vector3(
      this.x,
      a,
      b
    );
  }
  magnitude() {
    return Math.sqrt(this.magnitudeSqr());
  }
  magnitudeSqr() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }
  mod(max2) {
    return new _Vector3(
      this.x % max2.x,
      this.y % max2.y,
      this.z % max2.z
    );
  }
  clamp(min2, max2) {
    return new _Vector3(
      Util.clamp(this.x, min2.x, max2.x),
      Util.clamp(this.y, min2.y, max2.y),
      Util.clamp(this.z, min2.z, max2.z)
    );
  }
  normalize() {
    let len2 = this.x * this.x + this.y * this.y + this.z * this.z;
    if (len2 > 0) {
      len2 = 1 / Math.sqrt(len2);
    }
    return v3(
      this.x * len2,
      this.y * len2,
      this.z * len2
    );
  }
  applyQuaternion(q) {
    const x = this.x;
    const y = this.y;
    const z = this.z;
    const qx = q.x;
    const qy = q.y;
    const qz = q.z;
    const qw = q.w;
    const ix = qw * x + qy * z - qz * y;
    const iy = qw * y + qz * x - qx * z;
    const iz = qw * z + qx * y - qy * x;
    const iw = -qx * x - qy * y - qz * z;
    return new _Vector3(
      ix * qw + iw * -qx + iy * -qz - iz * -qy,
      iy * qw + iw * -qy + iz * -qx - ix * -qz,
      iz * qw + iw * -qz + ix * -qy - iy * -qx
    );
  }
  cross(other) {
    return new _Vector3(
      this.y * other.z - this.z * other.y,
      this.z * other.x - this.x * other.z,
      this.x * other.y - this.y * other.x
    );
  }
  dot(other) {
    return this.x * other.x + this.y * other.y + this.z * other.z;
  }
  /**
   * Converts a screen space coordinate to a world position on a plane
   * @param screenPos Screen position in normalized coordinates (0-1)
   * @param camera Camera used for the projection
   * @param planeNormal Normal vector of the plane (must be normalized)
   * @param planeCoordinate The world coordinate value where the plane intersects the axis defined by the normal
   * @returns World position where the ray intersects the plane, or null if ray is parallel to plane
   */
  static screenToWorldPlane(screenPos, camera, planeNormal, planeCoordinate) {
    const ndcX = screenPos.x * 2 - 1;
    const ndcY = (1 - screenPos.y) * 2 - 1;
    const projMatrix = camera.getProjectionMatrix();
    const viewMatrix = camera.getViewMatrix();
    const invProj = projMatrix.clone().invert();
    const invView = viewMatrix.clone().invert();
    const nearPoint = v3(ndcX, ndcY, -1);
    const rayDir = v3(
      invProj.mat4[0] * nearPoint.x + invProj.mat4[4] * nearPoint.y + invProj.mat4[8] * nearPoint.z + invProj.mat4[12],
      invProj.mat4[1] * nearPoint.x + invProj.mat4[5] * nearPoint.y + invProj.mat4[9] * nearPoint.z + invProj.mat4[13],
      invProj.mat4[2] * nearPoint.x + invProj.mat4[6] * nearPoint.y + invProj.mat4[10] * nearPoint.z + invProj.mat4[14]
    ).normalize();
    const worldRayDir = v3(
      invView.mat4[0] * rayDir.x + invView.mat4[4] * rayDir.y + invView.mat4[8] * rayDir.z,
      invView.mat4[1] * rayDir.x + invView.mat4[5] * rayDir.y + invView.mat4[9] * rayDir.z,
      invView.mat4[2] * rayDir.x + invView.mat4[6] * rayDir.y + invView.mat4[10] * rayDir.z
    ).normalize();
    const rayOrigin = camera.getPosition();
    const denom = worldRayDir.dot(planeNormal);
    if (Math.abs(denom) < 1e-6) {
      return null;
    }
    const planePoint = planeNormal.scale(planeCoordinate);
    const t = planePoint.subtract(rayOrigin).dot(planeNormal) / denom;
    return rayOrigin.add(worldRayDir.scale(t));
  }
};

// node_modules/gl-matrix/esm/common.js
var EPSILON = 1e-6;
var ARRAY_TYPE = typeof Float32Array !== "undefined" ? Float32Array : Array;
var RANDOM = Math.random;
var degree = Math.PI / 180;
if (!Math.hypot)
  Math.hypot = function() {
    var y = 0, i = arguments.length;
    while (i--) {
      y += arguments[i] * arguments[i];
    }
    return Math.sqrt(y);
  };

// node_modules/gl-matrix/esm/mat4.js
var mat4_exports = {};
__export(mat4_exports, {
  add: () => add,
  adjoint: () => adjoint,
  clone: () => clone,
  copy: () => copy,
  create: () => create,
  determinant: () => determinant,
  equals: () => equals,
  exactEquals: () => exactEquals,
  frob: () => frob,
  fromQuat: () => fromQuat,
  fromQuat2: () => fromQuat2,
  fromRotation: () => fromRotation,
  fromRotationTranslation: () => fromRotationTranslation,
  fromRotationTranslationScale: () => fromRotationTranslationScale,
  fromRotationTranslationScaleOrigin: () => fromRotationTranslationScaleOrigin,
  fromScaling: () => fromScaling,
  fromTranslation: () => fromTranslation,
  fromValues: () => fromValues,
  fromXRotation: () => fromXRotation,
  fromYRotation: () => fromYRotation,
  fromZRotation: () => fromZRotation,
  frustum: () => frustum,
  getRotation: () => getRotation,
  getScaling: () => getScaling,
  getTranslation: () => getTranslation,
  identity: () => identity,
  invert: () => invert,
  lookAt: () => lookAt,
  mul: () => mul,
  multiply: () => multiply,
  multiplyScalar: () => multiplyScalar,
  multiplyScalarAndAdd: () => multiplyScalarAndAdd,
  ortho: () => ortho,
  orthoNO: () => orthoNO,
  orthoZO: () => orthoZO,
  perspective: () => perspective,
  perspectiveFromFieldOfView: () => perspectiveFromFieldOfView,
  perspectiveNO: () => perspectiveNO,
  perspectiveZO: () => perspectiveZO,
  rotate: () => rotate,
  rotateX: () => rotateX,
  rotateY: () => rotateY,
  rotateZ: () => rotateZ,
  scale: () => scale,
  set: () => set,
  str: () => str,
  sub: () => sub,
  subtract: () => subtract,
  targetTo: () => targetTo,
  translate: () => translate,
  transpose: () => transpose
});
function create() {
  var out = new ARRAY_TYPE(16);
  if (ARRAY_TYPE != Float32Array) {
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
  }
  out[0] = 1;
  out[5] = 1;
  out[10] = 1;
  out[15] = 1;
  return out;
}
function clone(a) {
  var out = new ARRAY_TYPE(16);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  out[9] = a[9];
  out[10] = a[10];
  out[11] = a[11];
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}
function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  out[9] = a[9];
  out[10] = a[10];
  out[11] = a[11];
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}
function fromValues(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
  var out = new ARRAY_TYPE(16);
  out[0] = m00;
  out[1] = m01;
  out[2] = m02;
  out[3] = m03;
  out[4] = m10;
  out[5] = m11;
  out[6] = m12;
  out[7] = m13;
  out[8] = m20;
  out[9] = m21;
  out[10] = m22;
  out[11] = m23;
  out[12] = m30;
  out[13] = m31;
  out[14] = m32;
  out[15] = m33;
  return out;
}
function set(out, m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
  out[0] = m00;
  out[1] = m01;
  out[2] = m02;
  out[3] = m03;
  out[4] = m10;
  out[5] = m11;
  out[6] = m12;
  out[7] = m13;
  out[8] = m20;
  out[9] = m21;
  out[10] = m22;
  out[11] = m23;
  out[12] = m30;
  out[13] = m31;
  out[14] = m32;
  out[15] = m33;
  return out;
}
function identity(out) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
function transpose(out, a) {
  if (out === a) {
    var a01 = a[1], a02 = a[2], a03 = a[3];
    var a12 = a[6], a13 = a[7];
    var a23 = a[11];
    out[1] = a[4];
    out[2] = a[8];
    out[3] = a[12];
    out[4] = a01;
    out[6] = a[9];
    out[7] = a[13];
    out[8] = a02;
    out[9] = a12;
    out[11] = a[14];
    out[12] = a03;
    out[13] = a13;
    out[14] = a23;
  } else {
    out[0] = a[0];
    out[1] = a[4];
    out[2] = a[8];
    out[3] = a[12];
    out[4] = a[1];
    out[5] = a[5];
    out[6] = a[9];
    out[7] = a[13];
    out[8] = a[2];
    out[9] = a[6];
    out[10] = a[10];
    out[11] = a[14];
    out[12] = a[3];
    out[13] = a[7];
    out[14] = a[11];
    out[15] = a[15];
  }
  return out;
}
function invert(out, a) {
  var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
  var a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
  var a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
  var a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
  var b00 = a00 * a11 - a01 * a10;
  var b01 = a00 * a12 - a02 * a10;
  var b02 = a00 * a13 - a03 * a10;
  var b03 = a01 * a12 - a02 * a11;
  var b04 = a01 * a13 - a03 * a11;
  var b05 = a02 * a13 - a03 * a12;
  var b06 = a20 * a31 - a21 * a30;
  var b07 = a20 * a32 - a22 * a30;
  var b08 = a20 * a33 - a23 * a30;
  var b09 = a21 * a32 - a22 * a31;
  var b10 = a21 * a33 - a23 * a31;
  var b11 = a22 * a33 - a23 * a32;
  var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
  if (!det) {
    return null;
  }
  det = 1 / det;
  out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
  out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
  out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
  out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
  out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
  out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
  out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
  out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
  out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
  out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
  out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
  out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
  out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
  out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
  return out;
}
function adjoint(out, a) {
  var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
  var a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
  var a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
  var a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
  out[0] = a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22);
  out[1] = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
  out[2] = a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12);
  out[3] = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
  out[4] = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
  out[5] = a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22);
  out[6] = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
  out[7] = a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12);
  out[8] = a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21);
  out[9] = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
  out[10] = a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11);
  out[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
  out[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
  out[13] = a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21);
  out[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
  out[15] = a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11);
  return out;
}
function determinant(a) {
  var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
  var a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
  var a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
  var a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
  var b00 = a00 * a11 - a01 * a10;
  var b01 = a00 * a12 - a02 * a10;
  var b02 = a00 * a13 - a03 * a10;
  var b03 = a01 * a12 - a02 * a11;
  var b04 = a01 * a13 - a03 * a11;
  var b05 = a02 * a13 - a03 * a12;
  var b06 = a20 * a31 - a21 * a30;
  var b07 = a20 * a32 - a22 * a30;
  var b08 = a20 * a33 - a23 * a30;
  var b09 = a21 * a32 - a22 * a31;
  var b10 = a21 * a33 - a23 * a31;
  var b11 = a22 * a33 - a23 * a32;
  return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
}
function multiply(out, a, b) {
  var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
  var a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
  var a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
  var a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
  var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
  out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[4];
  b1 = b[5];
  b2 = b[6];
  b3 = b[7];
  out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[8];
  b1 = b[9];
  b2 = b[10];
  b3 = b[11];
  out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[12];
  b1 = b[13];
  b2 = b[14];
  b3 = b[15];
  out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  return out;
}
function translate(out, a, v) {
  var x = v[0], y = v[1], z = v[2];
  var a00, a01, a02, a03;
  var a10, a11, a12, a13;
  var a20, a21, a22, a23;
  if (a === out) {
    out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
    out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
    out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
    out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
  } else {
    a00 = a[0];
    a01 = a[1];
    a02 = a[2];
    a03 = a[3];
    a10 = a[4];
    a11 = a[5];
    a12 = a[6];
    a13 = a[7];
    a20 = a[8];
    a21 = a[9];
    a22 = a[10];
    a23 = a[11];
    out[0] = a00;
    out[1] = a01;
    out[2] = a02;
    out[3] = a03;
    out[4] = a10;
    out[5] = a11;
    out[6] = a12;
    out[7] = a13;
    out[8] = a20;
    out[9] = a21;
    out[10] = a22;
    out[11] = a23;
    out[12] = a00 * x + a10 * y + a20 * z + a[12];
    out[13] = a01 * x + a11 * y + a21 * z + a[13];
    out[14] = a02 * x + a12 * y + a22 * z + a[14];
    out[15] = a03 * x + a13 * y + a23 * z + a[15];
  }
  return out;
}
function scale(out, a, v) {
  var x = v[0], y = v[1], z = v[2];
  out[0] = a[0] * x;
  out[1] = a[1] * x;
  out[2] = a[2] * x;
  out[3] = a[3] * x;
  out[4] = a[4] * y;
  out[5] = a[5] * y;
  out[6] = a[6] * y;
  out[7] = a[7] * y;
  out[8] = a[8] * z;
  out[9] = a[9] * z;
  out[10] = a[10] * z;
  out[11] = a[11] * z;
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}
function rotate(out, a, rad, axis) {
  var x = axis[0], y = axis[1], z = axis[2];
  var len2 = Math.hypot(x, y, z);
  var s, c, t;
  var a00, a01, a02, a03;
  var a10, a11, a12, a13;
  var a20, a21, a22, a23;
  var b00, b01, b02;
  var b10, b11, b12;
  var b20, b21, b22;
  if (len2 < EPSILON) {
    return null;
  }
  len2 = 1 / len2;
  x *= len2;
  y *= len2;
  z *= len2;
  s = Math.sin(rad);
  c = Math.cos(rad);
  t = 1 - c;
  a00 = a[0];
  a01 = a[1];
  a02 = a[2];
  a03 = a[3];
  a10 = a[4];
  a11 = a[5];
  a12 = a[6];
  a13 = a[7];
  a20 = a[8];
  a21 = a[9];
  a22 = a[10];
  a23 = a[11];
  b00 = x * x * t + c;
  b01 = y * x * t + z * s;
  b02 = z * x * t - y * s;
  b10 = x * y * t - z * s;
  b11 = y * y * t + c;
  b12 = z * y * t + x * s;
  b20 = x * z * t + y * s;
  b21 = y * z * t - x * s;
  b22 = z * z * t + c;
  out[0] = a00 * b00 + a10 * b01 + a20 * b02;
  out[1] = a01 * b00 + a11 * b01 + a21 * b02;
  out[2] = a02 * b00 + a12 * b01 + a22 * b02;
  out[3] = a03 * b00 + a13 * b01 + a23 * b02;
  out[4] = a00 * b10 + a10 * b11 + a20 * b12;
  out[5] = a01 * b10 + a11 * b11 + a21 * b12;
  out[6] = a02 * b10 + a12 * b11 + a22 * b12;
  out[7] = a03 * b10 + a13 * b11 + a23 * b12;
  out[8] = a00 * b20 + a10 * b21 + a20 * b22;
  out[9] = a01 * b20 + a11 * b21 + a21 * b22;
  out[10] = a02 * b20 + a12 * b21 + a22 * b22;
  out[11] = a03 * b20 + a13 * b21 + a23 * b22;
  if (a !== out) {
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  }
  return out;
}
function rotateX(out, a, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  var a10 = a[4];
  var a11 = a[5];
  var a12 = a[6];
  var a13 = a[7];
  var a20 = a[8];
  var a21 = a[9];
  var a22 = a[10];
  var a23 = a[11];
  if (a !== out) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  }
  out[4] = a10 * c + a20 * s;
  out[5] = a11 * c + a21 * s;
  out[6] = a12 * c + a22 * s;
  out[7] = a13 * c + a23 * s;
  out[8] = a20 * c - a10 * s;
  out[9] = a21 * c - a11 * s;
  out[10] = a22 * c - a12 * s;
  out[11] = a23 * c - a13 * s;
  return out;
}
function rotateY(out, a, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  var a00 = a[0];
  var a01 = a[1];
  var a02 = a[2];
  var a03 = a[3];
  var a20 = a[8];
  var a21 = a[9];
  var a22 = a[10];
  var a23 = a[11];
  if (a !== out) {
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  }
  out[0] = a00 * c - a20 * s;
  out[1] = a01 * c - a21 * s;
  out[2] = a02 * c - a22 * s;
  out[3] = a03 * c - a23 * s;
  out[8] = a00 * s + a20 * c;
  out[9] = a01 * s + a21 * c;
  out[10] = a02 * s + a22 * c;
  out[11] = a03 * s + a23 * c;
  return out;
}
function rotateZ(out, a, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  var a00 = a[0];
  var a01 = a[1];
  var a02 = a[2];
  var a03 = a[3];
  var a10 = a[4];
  var a11 = a[5];
  var a12 = a[6];
  var a13 = a[7];
  if (a !== out) {
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  }
  out[0] = a00 * c + a10 * s;
  out[1] = a01 * c + a11 * s;
  out[2] = a02 * c + a12 * s;
  out[3] = a03 * c + a13 * s;
  out[4] = a10 * c - a00 * s;
  out[5] = a11 * c - a01 * s;
  out[6] = a12 * c - a02 * s;
  out[7] = a13 * c - a03 * s;
  return out;
}
function fromTranslation(out, v) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;
  return out;
}
function fromScaling(out, v) {
  out[0] = v[0];
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = v[1];
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = v[2];
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
function fromRotation(out, rad, axis) {
  var x = axis[0], y = axis[1], z = axis[2];
  var len2 = Math.hypot(x, y, z);
  var s, c, t;
  if (len2 < EPSILON) {
    return null;
  }
  len2 = 1 / len2;
  x *= len2;
  y *= len2;
  z *= len2;
  s = Math.sin(rad);
  c = Math.cos(rad);
  t = 1 - c;
  out[0] = x * x * t + c;
  out[1] = y * x * t + z * s;
  out[2] = z * x * t - y * s;
  out[3] = 0;
  out[4] = x * y * t - z * s;
  out[5] = y * y * t + c;
  out[6] = z * y * t + x * s;
  out[7] = 0;
  out[8] = x * z * t + y * s;
  out[9] = y * z * t - x * s;
  out[10] = z * z * t + c;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
function fromXRotation(out, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = c;
  out[6] = s;
  out[7] = 0;
  out[8] = 0;
  out[9] = -s;
  out[10] = c;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
function fromYRotation(out, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  out[0] = c;
  out[1] = 0;
  out[2] = -s;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = s;
  out[9] = 0;
  out[10] = c;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
function fromZRotation(out, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  out[0] = c;
  out[1] = s;
  out[2] = 0;
  out[3] = 0;
  out[4] = -s;
  out[5] = c;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
function fromRotationTranslation(out, q, v) {
  var x = q[0], y = q[1], z = q[2], w = q[3];
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;
  var xx = x * x2;
  var xy = x * y2;
  var xz = x * z2;
  var yy = y * y2;
  var yz = y * z2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;
  out[0] = 1 - (yy + zz);
  out[1] = xy + wz;
  out[2] = xz - wy;
  out[3] = 0;
  out[4] = xy - wz;
  out[5] = 1 - (xx + zz);
  out[6] = yz + wx;
  out[7] = 0;
  out[8] = xz + wy;
  out[9] = yz - wx;
  out[10] = 1 - (xx + yy);
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;
  return out;
}
function fromQuat2(out, a) {
  var translation = new ARRAY_TYPE(3);
  var bx = -a[0], by = -a[1], bz = -a[2], bw = a[3], ax = a[4], ay = a[5], az = a[6], aw = a[7];
  var magnitude = bx * bx + by * by + bz * bz + bw * bw;
  if (magnitude > 0) {
    translation[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2 / magnitude;
    translation[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2 / magnitude;
    translation[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2 / magnitude;
  } else {
    translation[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2;
    translation[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2;
    translation[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2;
  }
  fromRotationTranslation(out, a, translation);
  return out;
}
function getTranslation(out, mat) {
  out[0] = mat[12];
  out[1] = mat[13];
  out[2] = mat[14];
  return out;
}
function getScaling(out, mat) {
  var m11 = mat[0];
  var m12 = mat[1];
  var m13 = mat[2];
  var m21 = mat[4];
  var m22 = mat[5];
  var m23 = mat[6];
  var m31 = mat[8];
  var m32 = mat[9];
  var m33 = mat[10];
  out[0] = Math.hypot(m11, m12, m13);
  out[1] = Math.hypot(m21, m22, m23);
  out[2] = Math.hypot(m31, m32, m33);
  return out;
}
function getRotation(out, mat) {
  var scaling = new ARRAY_TYPE(3);
  getScaling(scaling, mat);
  var is1 = 1 / scaling[0];
  var is2 = 1 / scaling[1];
  var is3 = 1 / scaling[2];
  var sm11 = mat[0] * is1;
  var sm12 = mat[1] * is2;
  var sm13 = mat[2] * is3;
  var sm21 = mat[4] * is1;
  var sm22 = mat[5] * is2;
  var sm23 = mat[6] * is3;
  var sm31 = mat[8] * is1;
  var sm32 = mat[9] * is2;
  var sm33 = mat[10] * is3;
  var trace = sm11 + sm22 + sm33;
  var S = 0;
  if (trace > 0) {
    S = Math.sqrt(trace + 1) * 2;
    out[3] = 0.25 * S;
    out[0] = (sm23 - sm32) / S;
    out[1] = (sm31 - sm13) / S;
    out[2] = (sm12 - sm21) / S;
  } else if (sm11 > sm22 && sm11 > sm33) {
    S = Math.sqrt(1 + sm11 - sm22 - sm33) * 2;
    out[3] = (sm23 - sm32) / S;
    out[0] = 0.25 * S;
    out[1] = (sm12 + sm21) / S;
    out[2] = (sm31 + sm13) / S;
  } else if (sm22 > sm33) {
    S = Math.sqrt(1 + sm22 - sm11 - sm33) * 2;
    out[3] = (sm31 - sm13) / S;
    out[0] = (sm12 + sm21) / S;
    out[1] = 0.25 * S;
    out[2] = (sm23 + sm32) / S;
  } else {
    S = Math.sqrt(1 + sm33 - sm11 - sm22) * 2;
    out[3] = (sm12 - sm21) / S;
    out[0] = (sm31 + sm13) / S;
    out[1] = (sm23 + sm32) / S;
    out[2] = 0.25 * S;
  }
  return out;
}
function fromRotationTranslationScale(out, q, v, s) {
  var x = q[0], y = q[1], z = q[2], w = q[3];
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;
  var xx = x * x2;
  var xy = x * y2;
  var xz = x * z2;
  var yy = y * y2;
  var yz = y * z2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;
  var sx = s[0];
  var sy = s[1];
  var sz = s[2];
  out[0] = (1 - (yy + zz)) * sx;
  out[1] = (xy + wz) * sx;
  out[2] = (xz - wy) * sx;
  out[3] = 0;
  out[4] = (xy - wz) * sy;
  out[5] = (1 - (xx + zz)) * sy;
  out[6] = (yz + wx) * sy;
  out[7] = 0;
  out[8] = (xz + wy) * sz;
  out[9] = (yz - wx) * sz;
  out[10] = (1 - (xx + yy)) * sz;
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;
  return out;
}
function fromRotationTranslationScaleOrigin(out, q, v, s, o) {
  var x = q[0], y = q[1], z = q[2], w = q[3];
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;
  var xx = x * x2;
  var xy = x * y2;
  var xz = x * z2;
  var yy = y * y2;
  var yz = y * z2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;
  var sx = s[0];
  var sy = s[1];
  var sz = s[2];
  var ox = o[0];
  var oy = o[1];
  var oz = o[2];
  var out0 = (1 - (yy + zz)) * sx;
  var out1 = (xy + wz) * sx;
  var out2 = (xz - wy) * sx;
  var out4 = (xy - wz) * sy;
  var out5 = (1 - (xx + zz)) * sy;
  var out6 = (yz + wx) * sy;
  var out8 = (xz + wy) * sz;
  var out9 = (yz - wx) * sz;
  var out10 = (1 - (xx + yy)) * sz;
  out[0] = out0;
  out[1] = out1;
  out[2] = out2;
  out[3] = 0;
  out[4] = out4;
  out[5] = out5;
  out[6] = out6;
  out[7] = 0;
  out[8] = out8;
  out[9] = out9;
  out[10] = out10;
  out[11] = 0;
  out[12] = v[0] + ox - (out0 * ox + out4 * oy + out8 * oz);
  out[13] = v[1] + oy - (out1 * ox + out5 * oy + out9 * oz);
  out[14] = v[2] + oz - (out2 * ox + out6 * oy + out10 * oz);
  out[15] = 1;
  return out;
}
function fromQuat(out, q) {
  var x = q[0], y = q[1], z = q[2], w = q[3];
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;
  var xx = x * x2;
  var yx = y * x2;
  var yy = y * y2;
  var zx = z * x2;
  var zy = z * y2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;
  out[0] = 1 - yy - zz;
  out[1] = yx + wz;
  out[2] = zx - wy;
  out[3] = 0;
  out[4] = yx - wz;
  out[5] = 1 - xx - zz;
  out[6] = zy + wx;
  out[7] = 0;
  out[8] = zx + wy;
  out[9] = zy - wx;
  out[10] = 1 - xx - yy;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
function frustum(out, left, right, bottom, top, near, far) {
  var rl = 1 / (right - left);
  var tb = 1 / (top - bottom);
  var nf = 1 / (near - far);
  out[0] = near * 2 * rl;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = near * 2 * tb;
  out[6] = 0;
  out[7] = 0;
  out[8] = (right + left) * rl;
  out[9] = (top + bottom) * tb;
  out[10] = (far + near) * nf;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[14] = far * near * 2 * nf;
  out[15] = 0;
  return out;
}
function perspectiveNO(out, fovy, aspect, near, far) {
  var f = 1 / Math.tan(fovy / 2), nf;
  out[0] = f / aspect;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = f;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[15] = 0;
  if (far != null && far !== Infinity) {
    nf = 1 / (near - far);
    out[10] = (far + near) * nf;
    out[14] = 2 * far * near * nf;
  } else {
    out[10] = -1;
    out[14] = -2 * near;
  }
  return out;
}
var perspective = perspectiveNO;
function perspectiveZO(out, fovy, aspect, near, far) {
  var f = 1 / Math.tan(fovy / 2), nf;
  out[0] = f / aspect;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = f;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[15] = 0;
  if (far != null && far !== Infinity) {
    nf = 1 / (near - far);
    out[10] = far * nf;
    out[14] = far * near * nf;
  } else {
    out[10] = -1;
    out[14] = -near;
  }
  return out;
}
function perspectiveFromFieldOfView(out, fov, near, far) {
  var upTan = Math.tan(fov.upDegrees * Math.PI / 180);
  var downTan = Math.tan(fov.downDegrees * Math.PI / 180);
  var leftTan = Math.tan(fov.leftDegrees * Math.PI / 180);
  var rightTan = Math.tan(fov.rightDegrees * Math.PI / 180);
  var xScale = 2 / (leftTan + rightTan);
  var yScale = 2 / (upTan + downTan);
  out[0] = xScale;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = yScale;
  out[6] = 0;
  out[7] = 0;
  out[8] = -((leftTan - rightTan) * xScale * 0.5);
  out[9] = (upTan - downTan) * yScale * 0.5;
  out[10] = far / (near - far);
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[14] = far * near / (near - far);
  out[15] = 0;
  return out;
}
function orthoNO(out, left, right, bottom, top, near, far) {
  var lr = 1 / (left - right);
  var bt = 1 / (bottom - top);
  var nf = 1 / (near - far);
  out[0] = -2 * lr;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = -2 * bt;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 2 * nf;
  out[11] = 0;
  out[12] = (left + right) * lr;
  out[13] = (top + bottom) * bt;
  out[14] = (far + near) * nf;
  out[15] = 1;
  return out;
}
var ortho = orthoNO;
function orthoZO(out, left, right, bottom, top, near, far) {
  var lr = 1 / (left - right);
  var bt = 1 / (bottom - top);
  var nf = 1 / (near - far);
  out[0] = -2 * lr;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = -2 * bt;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = nf;
  out[11] = 0;
  out[12] = (left + right) * lr;
  out[13] = (top + bottom) * bt;
  out[14] = near * nf;
  out[15] = 1;
  return out;
}
function lookAt(out, eye, center, up) {
  var x0, x1, x2, y0, y1, y2, z0, z1, z2, len2;
  var eyex = eye[0];
  var eyey = eye[1];
  var eyez = eye[2];
  var upx = up[0];
  var upy = up[1];
  var upz = up[2];
  var centerx = center[0];
  var centery = center[1];
  var centerz = center[2];
  if (Math.abs(eyex - centerx) < EPSILON && Math.abs(eyey - centery) < EPSILON && Math.abs(eyez - centerz) < EPSILON) {
    return identity(out);
  }
  z0 = eyex - centerx;
  z1 = eyey - centery;
  z2 = eyez - centerz;
  len2 = 1 / Math.hypot(z0, z1, z2);
  z0 *= len2;
  z1 *= len2;
  z2 *= len2;
  x0 = upy * z2 - upz * z1;
  x1 = upz * z0 - upx * z2;
  x2 = upx * z1 - upy * z0;
  len2 = Math.hypot(x0, x1, x2);
  if (!len2) {
    x0 = 0;
    x1 = 0;
    x2 = 0;
  } else {
    len2 = 1 / len2;
    x0 *= len2;
    x1 *= len2;
    x2 *= len2;
  }
  y0 = z1 * x2 - z2 * x1;
  y1 = z2 * x0 - z0 * x2;
  y2 = z0 * x1 - z1 * x0;
  len2 = Math.hypot(y0, y1, y2);
  if (!len2) {
    y0 = 0;
    y1 = 0;
    y2 = 0;
  } else {
    len2 = 1 / len2;
    y0 *= len2;
    y1 *= len2;
    y2 *= len2;
  }
  out[0] = x0;
  out[1] = y0;
  out[2] = z0;
  out[3] = 0;
  out[4] = x1;
  out[5] = y1;
  out[6] = z1;
  out[7] = 0;
  out[8] = x2;
  out[9] = y2;
  out[10] = z2;
  out[11] = 0;
  out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
  out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
  out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
  out[15] = 1;
  return out;
}
function targetTo(out, eye, target, up) {
  var eyex = eye[0], eyey = eye[1], eyez = eye[2], upx = up[0], upy = up[1], upz = up[2];
  var z0 = eyex - target[0], z1 = eyey - target[1], z2 = eyez - target[2];
  var len2 = z0 * z0 + z1 * z1 + z2 * z2;
  if (len2 > 0) {
    len2 = 1 / Math.sqrt(len2);
    z0 *= len2;
    z1 *= len2;
    z2 *= len2;
  }
  var x0 = upy * z2 - upz * z1, x1 = upz * z0 - upx * z2, x2 = upx * z1 - upy * z0;
  len2 = x0 * x0 + x1 * x1 + x2 * x2;
  if (len2 > 0) {
    len2 = 1 / Math.sqrt(len2);
    x0 *= len2;
    x1 *= len2;
    x2 *= len2;
  }
  out[0] = x0;
  out[1] = x1;
  out[2] = x2;
  out[3] = 0;
  out[4] = z1 * x2 - z2 * x1;
  out[5] = z2 * x0 - z0 * x2;
  out[6] = z0 * x1 - z1 * x0;
  out[7] = 0;
  out[8] = z0;
  out[9] = z1;
  out[10] = z2;
  out[11] = 0;
  out[12] = eyex;
  out[13] = eyey;
  out[14] = eyez;
  out[15] = 1;
  return out;
}
function str(a) {
  return "mat4(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ", " + a[4] + ", " + a[5] + ", " + a[6] + ", " + a[7] + ", " + a[8] + ", " + a[9] + ", " + a[10] + ", " + a[11] + ", " + a[12] + ", " + a[13] + ", " + a[14] + ", " + a[15] + ")";
}
function frob(a) {
  return Math.hypot(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8], a[9], a[10], a[11], a[12], a[13], a[14], a[15]);
}
function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  out[3] = a[3] + b[3];
  out[4] = a[4] + b[4];
  out[5] = a[5] + b[5];
  out[6] = a[6] + b[6];
  out[7] = a[7] + b[7];
  out[8] = a[8] + b[8];
  out[9] = a[9] + b[9];
  out[10] = a[10] + b[10];
  out[11] = a[11] + b[11];
  out[12] = a[12] + b[12];
  out[13] = a[13] + b[13];
  out[14] = a[14] + b[14];
  out[15] = a[15] + b[15];
  return out;
}
function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  out[3] = a[3] - b[3];
  out[4] = a[4] - b[4];
  out[5] = a[5] - b[5];
  out[6] = a[6] - b[6];
  out[7] = a[7] - b[7];
  out[8] = a[8] - b[8];
  out[9] = a[9] - b[9];
  out[10] = a[10] - b[10];
  out[11] = a[11] - b[11];
  out[12] = a[12] - b[12];
  out[13] = a[13] - b[13];
  out[14] = a[14] - b[14];
  out[15] = a[15] - b[15];
  return out;
}
function multiplyScalar(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  out[3] = a[3] * b;
  out[4] = a[4] * b;
  out[5] = a[5] * b;
  out[6] = a[6] * b;
  out[7] = a[7] * b;
  out[8] = a[8] * b;
  out[9] = a[9] * b;
  out[10] = a[10] * b;
  out[11] = a[11] * b;
  out[12] = a[12] * b;
  out[13] = a[13] * b;
  out[14] = a[14] * b;
  out[15] = a[15] * b;
  return out;
}
function multiplyScalarAndAdd(out, a, b, scale3) {
  out[0] = a[0] + b[0] * scale3;
  out[1] = a[1] + b[1] * scale3;
  out[2] = a[2] + b[2] * scale3;
  out[3] = a[3] + b[3] * scale3;
  out[4] = a[4] + b[4] * scale3;
  out[5] = a[5] + b[5] * scale3;
  out[6] = a[6] + b[6] * scale3;
  out[7] = a[7] + b[7] * scale3;
  out[8] = a[8] + b[8] * scale3;
  out[9] = a[9] + b[9] * scale3;
  out[10] = a[10] + b[10] * scale3;
  out[11] = a[11] + b[11] * scale3;
  out[12] = a[12] + b[12] * scale3;
  out[13] = a[13] + b[13] * scale3;
  out[14] = a[14] + b[14] * scale3;
  out[15] = a[15] + b[15] * scale3;
  return out;
}
function exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7] && a[8] === b[8] && a[9] === b[9] && a[10] === b[10] && a[11] === b[11] && a[12] === b[12] && a[13] === b[13] && a[14] === b[14] && a[15] === b[15];
}
function equals(a, b) {
  var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
  var a4 = a[4], a5 = a[5], a6 = a[6], a7 = a[7];
  var a8 = a[8], a9 = a[9], a10 = a[10], a11 = a[11];
  var a12 = a[12], a13 = a[13], a14 = a[14], a15 = a[15];
  var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
  var b4 = b[4], b5 = b[5], b6 = b[6], b7 = b[7];
  var b8 = b[8], b9 = b[9], b10 = b[10], b11 = b[11];
  var b12 = b[12], b13 = b[13], b14 = b[14], b15 = b[15];
  return Math.abs(a0 - b0) <= EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= EPSILON * Math.max(1, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= EPSILON * Math.max(1, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= EPSILON * Math.max(1, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= EPSILON * Math.max(1, Math.abs(a5), Math.abs(b5)) && Math.abs(a6 - b6) <= EPSILON * Math.max(1, Math.abs(a6), Math.abs(b6)) && Math.abs(a7 - b7) <= EPSILON * Math.max(1, Math.abs(a7), Math.abs(b7)) && Math.abs(a8 - b8) <= EPSILON * Math.max(1, Math.abs(a8), Math.abs(b8)) && Math.abs(a9 - b9) <= EPSILON * Math.max(1, Math.abs(a9), Math.abs(b9)) && Math.abs(a10 - b10) <= EPSILON * Math.max(1, Math.abs(a10), Math.abs(b10)) && Math.abs(a11 - b11) <= EPSILON * Math.max(1, Math.abs(a11), Math.abs(b11)) && Math.abs(a12 - b12) <= EPSILON * Math.max(1, Math.abs(a12), Math.abs(b12)) && Math.abs(a13 - b13) <= EPSILON * Math.max(1, Math.abs(a13), Math.abs(b13)) && Math.abs(a14 - b14) <= EPSILON * Math.max(1, Math.abs(a14), Math.abs(b14)) && Math.abs(a15 - b15) <= EPSILON * Math.max(1, Math.abs(a15), Math.abs(b15));
}
var mul = multiply;
var sub = subtract;

// node_modules/gl-matrix/esm/vec3.js
var vec3_exports = {};
__export(vec3_exports, {
  add: () => add2,
  angle: () => angle,
  bezier: () => bezier,
  ceil: () => ceil,
  clone: () => clone2,
  copy: () => copy2,
  create: () => create2,
  cross: () => cross,
  dist: () => dist,
  distance: () => distance,
  div: () => div,
  divide: () => divide,
  dot: () => dot,
  equals: () => equals2,
  exactEquals: () => exactEquals2,
  floor: () => floor,
  forEach: () => forEach,
  fromValues: () => fromValues2,
  hermite: () => hermite,
  inverse: () => inverse,
  len: () => len,
  length: () => length,
  lerp: () => lerp,
  max: () => max,
  min: () => min,
  mul: () => mul2,
  multiply: () => multiply2,
  negate: () => negate,
  normalize: () => normalize,
  random: () => random,
  rotateX: () => rotateX2,
  rotateY: () => rotateY2,
  rotateZ: () => rotateZ2,
  round: () => round,
  scale: () => scale2,
  scaleAndAdd: () => scaleAndAdd,
  set: () => set2,
  sqrDist: () => sqrDist,
  sqrLen: () => sqrLen,
  squaredDistance: () => squaredDistance,
  squaredLength: () => squaredLength,
  str: () => str2,
  sub: () => sub2,
  subtract: () => subtract2,
  transformMat3: () => transformMat3,
  transformMat4: () => transformMat4,
  transformQuat: () => transformQuat,
  zero: () => zero
});
function create2() {
  var out = new ARRAY_TYPE(3);
  if (ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
  }
  return out;
}
function clone2(a) {
  var out = new ARRAY_TYPE(3);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  return out;
}
function length(a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  return Math.hypot(x, y, z);
}
function fromValues2(x, y, z) {
  var out = new ARRAY_TYPE(3);
  out[0] = x;
  out[1] = y;
  out[2] = z;
  return out;
}
function copy2(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  return out;
}
function set2(out, x, y, z) {
  out[0] = x;
  out[1] = y;
  out[2] = z;
  return out;
}
function add2(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  return out;
}
function subtract2(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  return out;
}
function multiply2(out, a, b) {
  out[0] = a[0] * b[0];
  out[1] = a[1] * b[1];
  out[2] = a[2] * b[2];
  return out;
}
function divide(out, a, b) {
  out[0] = a[0] / b[0];
  out[1] = a[1] / b[1];
  out[2] = a[2] / b[2];
  return out;
}
function ceil(out, a) {
  out[0] = Math.ceil(a[0]);
  out[1] = Math.ceil(a[1]);
  out[2] = Math.ceil(a[2]);
  return out;
}
function floor(out, a) {
  out[0] = Math.floor(a[0]);
  out[1] = Math.floor(a[1]);
  out[2] = Math.floor(a[2]);
  return out;
}
function min(out, a, b) {
  out[0] = Math.min(a[0], b[0]);
  out[1] = Math.min(a[1], b[1]);
  out[2] = Math.min(a[2], b[2]);
  return out;
}
function max(out, a, b) {
  out[0] = Math.max(a[0], b[0]);
  out[1] = Math.max(a[1], b[1]);
  out[2] = Math.max(a[2], b[2]);
  return out;
}
function round(out, a) {
  out[0] = Math.round(a[0]);
  out[1] = Math.round(a[1]);
  out[2] = Math.round(a[2]);
  return out;
}
function scale2(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  return out;
}
function scaleAndAdd(out, a, b, scale3) {
  out[0] = a[0] + b[0] * scale3;
  out[1] = a[1] + b[1] * scale3;
  out[2] = a[2] + b[2] * scale3;
  return out;
}
function distance(a, b) {
  var x = b[0] - a[0];
  var y = b[1] - a[1];
  var z = b[2] - a[2];
  return Math.hypot(x, y, z);
}
function squaredDistance(a, b) {
  var x = b[0] - a[0];
  var y = b[1] - a[1];
  var z = b[2] - a[2];
  return x * x + y * y + z * z;
}
function squaredLength(a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  return x * x + y * y + z * z;
}
function negate(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  return out;
}
function inverse(out, a) {
  out[0] = 1 / a[0];
  out[1] = 1 / a[1];
  out[2] = 1 / a[2];
  return out;
}
function normalize(out, a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var len2 = x * x + y * y + z * z;
  if (len2 > 0) {
    len2 = 1 / Math.sqrt(len2);
  }
  out[0] = a[0] * len2;
  out[1] = a[1] * len2;
  out[2] = a[2] * len2;
  return out;
}
function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}
function cross(out, a, b) {
  var ax = a[0], ay = a[1], az = a[2];
  var bx = b[0], by = b[1], bz = b[2];
  out[0] = ay * bz - az * by;
  out[1] = az * bx - ax * bz;
  out[2] = ax * by - ay * bx;
  return out;
}
function lerp(out, a, b, t) {
  var ax = a[0];
  var ay = a[1];
  var az = a[2];
  out[0] = ax + t * (b[0] - ax);
  out[1] = ay + t * (b[1] - ay);
  out[2] = az + t * (b[2] - az);
  return out;
}
function hermite(out, a, b, c, d, t) {
  var factorTimes2 = t * t;
  var factor1 = factorTimes2 * (2 * t - 3) + 1;
  var factor2 = factorTimes2 * (t - 2) + t;
  var factor3 = factorTimes2 * (t - 1);
  var factor4 = factorTimes2 * (3 - 2 * t);
  out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
  out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
  out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
  return out;
}
function bezier(out, a, b, c, d, t) {
  var inverseFactor = 1 - t;
  var inverseFactorTimesTwo = inverseFactor * inverseFactor;
  var factorTimes2 = t * t;
  var factor1 = inverseFactorTimesTwo * inverseFactor;
  var factor2 = 3 * t * inverseFactorTimesTwo;
  var factor3 = 3 * factorTimes2 * inverseFactor;
  var factor4 = factorTimes2 * t;
  out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
  out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
  out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
  return out;
}
function random(out, scale3) {
  scale3 = scale3 || 1;
  var r = RANDOM() * 2 * Math.PI;
  var z = RANDOM() * 2 - 1;
  var zScale = Math.sqrt(1 - z * z) * scale3;
  out[0] = Math.cos(r) * zScale;
  out[1] = Math.sin(r) * zScale;
  out[2] = z * scale3;
  return out;
}
function transformMat4(out, a, m) {
  var x = a[0], y = a[1], z = a[2];
  var w = m[3] * x + m[7] * y + m[11] * z + m[15];
  w = w || 1;
  out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
  out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
  out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
  return out;
}
function transformMat3(out, a, m) {
  var x = a[0], y = a[1], z = a[2];
  out[0] = x * m[0] + y * m[3] + z * m[6];
  out[1] = x * m[1] + y * m[4] + z * m[7];
  out[2] = x * m[2] + y * m[5] + z * m[8];
  return out;
}
function transformQuat(out, a, q) {
  var qx = q[0], qy = q[1], qz = q[2], qw = q[3];
  var x = a[0], y = a[1], z = a[2];
  var uvx = qy * z - qz * y, uvy = qz * x - qx * z, uvz = qx * y - qy * x;
  var uuvx = qy * uvz - qz * uvy, uuvy = qz * uvx - qx * uvz, uuvz = qx * uvy - qy * uvx;
  var w2 = qw * 2;
  uvx *= w2;
  uvy *= w2;
  uvz *= w2;
  uuvx *= 2;
  uuvy *= 2;
  uuvz *= 2;
  out[0] = x + uvx + uuvx;
  out[1] = y + uvy + uuvy;
  out[2] = z + uvz + uuvz;
  return out;
}
function rotateX2(out, a, b, rad) {
  var p = [], r = [];
  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2];
  r[0] = p[0];
  r[1] = p[1] * Math.cos(rad) - p[2] * Math.sin(rad);
  r[2] = p[1] * Math.sin(rad) + p[2] * Math.cos(rad);
  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];
  return out;
}
function rotateY2(out, a, b, rad) {
  var p = [], r = [];
  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2];
  r[0] = p[2] * Math.sin(rad) + p[0] * Math.cos(rad);
  r[1] = p[1];
  r[2] = p[2] * Math.cos(rad) - p[0] * Math.sin(rad);
  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];
  return out;
}
function rotateZ2(out, a, b, rad) {
  var p = [], r = [];
  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2];
  r[0] = p[0] * Math.cos(rad) - p[1] * Math.sin(rad);
  r[1] = p[0] * Math.sin(rad) + p[1] * Math.cos(rad);
  r[2] = p[2];
  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];
  return out;
}
function angle(a, b) {
  var ax = a[0], ay = a[1], az = a[2], bx = b[0], by = b[1], bz = b[2], mag1 = Math.sqrt(ax * ax + ay * ay + az * az), mag2 = Math.sqrt(bx * bx + by * by + bz * bz), mag = mag1 * mag2, cosine = mag && dot(a, b) / mag;
  return Math.acos(Math.min(Math.max(cosine, -1), 1));
}
function zero(out) {
  out[0] = 0;
  out[1] = 0;
  out[2] = 0;
  return out;
}
function str2(a) {
  return "vec3(" + a[0] + ", " + a[1] + ", " + a[2] + ")";
}
function exactEquals2(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
}
function equals2(a, b) {
  var a0 = a[0], a1 = a[1], a2 = a[2];
  var b0 = b[0], b1 = b[1], b2 = b[2];
  return Math.abs(a0 - b0) <= EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= EPSILON * Math.max(1, Math.abs(a2), Math.abs(b2));
}
var sub2 = subtract2;
var mul2 = multiply2;
var div = divide;
var dist = distance;
var sqrDist = squaredDistance;
var len = length;
var sqrLen = squaredLength;
var forEach = function() {
  var vec = create2();
  return function(a, stride, offset, count, fn, arg) {
    var i, l;
    if (!stride) {
      stride = 3;
    }
    if (!offset) {
      offset = 0;
    }
    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }
    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      vec[2] = a[i + 2];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
      a[i + 2] = vec[2];
    }
    return a;
  };
}();

// ts/classes/util/math/matrix4.ts
function m4() {
  return Matrix4.f();
}
var Matrix4 = class _Matrix4 {
  constructor(source) {
    this.mat4 = source ? mat4_exports.clone(source) : mat4_exports.create();
    return this;
  }
  static f() {
    return new _Matrix4();
  }
  add(mat) {
    mat4_exports.add(
      this.mat4,
      this.mat4,
      mat.mat4
    );
    return this;
  }
  subtract(mat) {
    mat4_exports.subtract(
      this.mat4,
      this.mat4,
      mat.mat4
    );
    return this;
  }
  multiply(mat) {
    mat4_exports.multiply(
      this.mat4,
      this.mat4,
      mat.mat4
    );
    return this;
  }
  scale(vector) {
    mat4_exports.scale(
      this.mat4,
      this.mat4,
      vector.vec
    );
    return this;
  }
  translate(vector) {
    mat4_exports.translate(
      this.mat4,
      this.mat4,
      vector.vec
    );
    return this;
  }
  invert() {
    mat4_exports.invert(
      this.mat4,
      this.mat4
    );
    return this;
  }
  transpose(mat) {
    mat4_exports.transpose(
      this.mat4,
      mat ? mat.mat4 : this.mat4
    );
    return this;
  }
  rotateAxis(angle2, axis) {
    mat4_exports.rotate(
      this.mat4,
      this.mat4,
      angle2,
      [[1, 0, 0], [0, 1, 0], [0, 0, 1]][axis]
    );
    return this;
  }
  rotate(rotation) {
    rotation.forEach((r, i) => {
      this.rotateAxis(r, i);
    });
    return this;
  }
  perspective(fov, near = 1, far = Infinity) {
    mat4_exports.perspective(
      this.mat4,
      fov,
      glob.renderer ? glob.renderer.width / glob.renderer.height : document.body.clientWidth / document.body.clientHeight,
      near,
      far
    );
    return this;
  }
  ortho(left, right, bottom, top, near = 1, far = Infinity) {
    mat4_exports.ortho(
      this.mat4,
      left,
      right,
      bottom,
      top,
      near,
      far
    );
    return this;
  }
  clone() {
    return new _Matrix4(this.mat4);
  }
  static lookAt(camera, target) {
    let matrix = m4();
    mat4_exports.lookAt(
      matrix.mat4,
      camera.vec,
      target.vec,
      v3(0, 1, 0).vec
    );
    return matrix;
  }
  get position() {
    return v3(this.mat4[12], this.mat4[13], this.mat4[14]);
  }
};

// ts/classes/util/math/quaternion.ts
var Quaternion = class _Quaternion {
  constructor(x = 0, y = 0, z = 0, w = 1) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }
  clone() {
    return new _Quaternion(this.x, this.y, this.z, this.w);
  }
  multiply(q) {
    const x = this.w * q.x + this.x * q.w + this.y * q.z - this.z * q.y;
    const y = this.w * q.y - this.x * q.z + this.y * q.w + this.z * q.x;
    const z = this.w * q.z + this.x * q.y - this.y * q.x + this.z * q.w;
    const w = this.w * q.w - this.x * q.x - this.y * q.y - this.z * q.z;
    return new _Quaternion(x, y, z, w);
  }
  toMatrix4() {
    const xx = this.x * this.x;
    const xy = this.x * this.y;
    const xz = this.x * this.z;
    const xw = this.x * this.w;
    const yy = this.y * this.y;
    const yz = this.y * this.z;
    const yw = this.y * this.w;
    const zz = this.z * this.z;
    const zw = this.z * this.w;
    return new Matrix4([
      1 - 2 * (yy + zz),
      2 * (xy - zw),
      2 * (xz + yw),
      0,
      2 * (xy + zw),
      1 - 2 * (xx + zz),
      2 * (yz - xw),
      0,
      2 * (xz - yw),
      2 * (yz + xw),
      1 - 2 * (xx + yy),
      0,
      0,
      0,
      0,
      1
    ]);
  }
  static fromEuler(x, y, z) {
    const cx = Math.cos(x * 0.5);
    const cy = Math.cos(y * 0.5);
    const cz = Math.cos(z * 0.5);
    const sx = Math.sin(x * 0.5);
    const sy = Math.sin(y * 0.5);
    const sz = Math.sin(z * 0.5);
    return new _Quaternion(
      sx * cy * cz + cx * sy * sz,
      cx * sy * cz - sx * cy * sz,
      cx * cy * sz + sx * sy * cz,
      cx * cy * cz - sx * sy * sz
    );
  }
  static fromMatrix(matrix) {
    return new _Quaternion();
  }
  static f(x, y = x, z = x, w = 1) {
    return new _Quaternion(x, y, z, w);
  }
  setAxisAngle(axis, angle2) {
    const halfAngle = angle2 * 0.5;
    const s = Math.sin(halfAngle);
    this.x = axis.x * s;
    this.y = axis.y * s;
    this.z = axis.z * s;
    this.w = Math.cos(halfAngle);
    return this;
  }
  toEuler() {
    const x = Math.atan2(2 * (this.w * this.x + this.y * this.z), 1 - 2 * (this.x * this.x + this.y * this.y));
    const y = Math.asin(2 * (this.w * this.y - this.z * this.x));
    const z = Math.atan2(2 * (this.w * this.z + this.x * this.y), 1 - 2 * (this.y * this.y + this.z * this.z));
    return new Vector3(x, y, z);
  }
};

// ts/classes/util/math/transform.ts
var Transform = class {
  constructor() {
    this._localPosition = v3(0);
    this._localRotation = new Quaternion();
    this._localScale = v3(1);
    this._anchor = v3(0);
    this._worldMatrix = m4();
    this._localMatrix = m4();
    this._isDirty = true;
    this._parent = null;
    this._children = [];
  }
  // Position methods
  setPosition(position) {
    this._localPosition = position;
    this._isDirty = true;
  }
  getLocalPosition() {
    return this._localPosition.clone();
  }
  getWorldPosition() {
    return this.getWorldMatrix().position;
  }
  // Rotation methods
  setRotation(rotation) {
    this._localRotation = rotation;
    this._isDirty = true;
  }
  getLocalRotation() {
    return this._localRotation.clone();
  }
  getWorldRotation() {
    return Quaternion.fromMatrix(this.getWorldMatrix());
  }
  // Scale methods
  setScale(scale3) {
    this._localScale = scale3;
    this._isDirty = true;
  }
  // Anchor point methods
  setAnchor(anchor) {
    this._anchor = anchor;
    this._isDirty = true;
  }
  // Hierarchy methods
  setParent(parent) {
    if (this._parent) {
      const index = this._parent._children.indexOf(this);
      if (index !== -1)
        this._parent._children.splice(index, 1);
    }
    this._parent = parent;
    if (parent) {
      parent._children.push(this);
    }
    this._isDirty = true;
  }
  // Matrix calculations
  updateLocalMatrix() {
    if (!this._isDirty)
      return;
    this._localMatrix = m4();
    if (!this._anchor.equals(v3(0))) {
      this._localMatrix.translate(this._anchor.scale(-1));
    }
    this._localMatrix.translate(this._localPosition);
    this._localMatrix.multiply(this._localRotation.toMatrix4());
    this._localMatrix.scale(this._localScale);
    if (!this._anchor.equals(v3(0))) {
      this._localMatrix.translate(this._anchor);
    }
    this._isDirty = false;
  }
  getLocalMatrix() {
    this.updateLocalMatrix();
    return this._localMatrix.clone();
  }
  getWorldMatrix() {
    this.updateLocalMatrix();
    if (this._parent) {
      return this._parent.getWorldMatrix().multiply(this._localMatrix);
    }
    return this._localMatrix.clone();
  }
  getScreenPosition(camera, scaleToScreen = false) {
    const worldPos = this.getWorldPosition().clone();
    const viewMatrix = camera.getViewMatrix().clone();
    const projectionMatrix = camera.getProjectionMatrix().clone();
    const viewProjectionMatrix = projectionMatrix.multiply(viewMatrix);
    const m = viewProjectionMatrix.mat4;
    const x = m[0] * worldPos.x + m[4] * worldPos.y + m[8] * worldPos.z + m[12];
    const y = m[1] * worldPos.x + m[5] * worldPos.y + m[9] * worldPos.z + m[13];
    const z = m[2] * worldPos.x + m[6] * worldPos.y + m[10] * worldPos.z + m[14];
    const w = m[3] * worldPos.x + m[7] * worldPos.y + m[11] * worldPos.z + m[15];
    if (Math.abs(w) < 1e-7)
      return v2(0);
    const ndcX = x / w;
    const ndcY = y / w;
    return v2(
      (ndcX + 1) * 0.5,
      (1 - ndcY) * 0.5
      // Flip Y because screen space is top-down
    ).multiply(scaleToScreen ? v2(glob.renderer.width, glob.renderer.height) : v2(1));
  }
};

// ts/classes/util/math/color.ts
function hslToRgb(h, s, l) {
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p2, q2, t) => {
      if (t < 0)
        t += 1;
      if (t > 1)
        t -= 1;
      if (t < 1 / 6)
        return p2 + (q2 - p2) * 6 * t;
      if (t < 1 / 2)
        return q2;
      if (t < 2 / 3)
        return p2 + (q2 - p2) * (2 / 3 - t) * 6;
      return p2;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return v3(r, g, b);
}

// ts/classes/webgl2/meshes/sceneObject.ts
var SceneObject = class {
  constructor(data, props = {}) {
    this.drawMode = glob.ctx.TRIANGLES;
    this.drawType = glob.ctx.UNSIGNED_SHORT;
    this.ignoreLighting = false;
    var _a, _b;
    this.vao = data.vao;
    this.indexBuffer = data.indexBuffer;
    this.shaderManager = glob.shaderManager;
    this.drawCount = data.drawCount;
    this.ignoreLighting = (_a = data.ignoreLighting) != null ? _a : false;
    this.pickColor = (_b = props.pickColor) != null ? _b : 0;
    this.material = props.material;
    this.transform = new Transform();
    if (props.position)
      this.transform.setPosition(props.position);
    if (props.scale)
      this.transform.setScale(props.scale);
    if (props.rotation)
      this.transform.setRotation(props.rotation);
    if (props.parent) {
      this.transform.setParent(props.parent.transform);
    }
  }
  set pickColor(value) {
    if (value === 0) {
      this.pickColorArray = v3(1, 1, 1);
    } else if (value === -1) {
      this.pickColorArray = void 0;
    } else {
      this.pickColorArray = hslToRgb(value / 255, 1, 0.5);
    }
  }
  colorMatch(color) {
    if (!this.pickColorArray)
      return false;
    return this.pickColorArray.equals(color);
  }
  static getAttributeLocation(name) {
    return glob.shaderManager.getAttributeLocation("a_".concat(name));
  }
  render(viewMatrix, projectionMatrix) {
    const modelMatrix = this.transform.getWorldMatrix();
    if (this.shaderManager.hasUniform("u_modelMatrix")) {
      this.shaderManager.setUniform("u_modelMatrix", modelMatrix.mat4);
    }
    if (this.shaderManager.hasUniform("u_viewMatrix")) {
      this.shaderManager.setUniform("u_viewMatrix", viewMatrix.mat4);
    }
    if (this.shaderManager.hasUniform("u_projectionMatrix")) {
      this.shaderManager.setUniform("u_projectionMatrix", projectionMatrix.mat4);
    }
    if (this.shaderManager.hasUniform("u_normalMatrix")) {
      const normalMatrix = modelMatrix.clone();
      normalMatrix.invert();
      normalMatrix.transpose();
      const normalMat3 = new Float32Array([
        normalMatrix.mat4[0],
        normalMatrix.mat4[1],
        normalMatrix.mat4[2],
        normalMatrix.mat4[4],
        normalMatrix.mat4[5],
        normalMatrix.mat4[6],
        normalMatrix.mat4[8],
        normalMatrix.mat4[9],
        normalMatrix.mat4[10]
      ]);
      this.shaderManager.setUniform("u_normalMatrix", normalMat3);
    }
    if (this.material && this.shaderManager.hasUniform("u_material.baseColor")) {
      this.shaderManager.setUniform("u_material.baseColor", new Float32Array(this.material.baseColor.vec));
      this.shaderManager.setUniform("u_material.roughness", this.material.roughness);
      this.shaderManager.setUniform("u_material.metallic", this.material.metallic);
      this.shaderManager.setUniform("u_material.ambientOcclusion", this.material.ambientOcclusion);
      this.shaderManager.setUniform("u_material.emissive", new Float32Array(this.material.emissive.vec));
      this.shaderManager.setUniform("u_material.hasAlbedoMap", this.material.albedoMap ? 1 : 0);
      this.shaderManager.setUniform("u_material.hasNormalMap", this.material.normalMap ? 1 : 0);
      this.shaderManager.setUniform("u_material.hasMetallicRoughnessMap", this.material.metallicRoughnessMap ? 1 : 0);
      this.shaderManager.setUniform("u_material.hasAoMap", this.material.aoMap ? 1 : 0);
      this.shaderManager.setUniform("u_material.hasEmissiveMap", this.material.emissiveMap ? 1 : 0);
      if (this.material.albedoMap) {
        glob.ctx.activeTexture(glob.ctx.TEXTURE0);
        glob.ctx.bindTexture(glob.ctx.TEXTURE_2D, this.material.albedoMap);
        this.shaderManager.setUniform("u_material.albedoMap", 0);
      }
      if (this.material.normalMap) {
        glob.ctx.activeTexture(glob.ctx.TEXTURE1);
        glob.ctx.bindTexture(glob.ctx.TEXTURE_2D, this.material.normalMap);
        this.shaderManager.setUniform("u_material.normalMap", 1);
      }
      if (this.material.metallicRoughnessMap) {
        glob.ctx.activeTexture(glob.ctx.TEXTURE2);
        glob.ctx.bindTexture(glob.ctx.TEXTURE_2D, this.material.metallicRoughnessMap);
        this.shaderManager.setUniform("u_material.metallicRoughnessMap", 2);
      }
      if (this.material.aoMap) {
        glob.ctx.activeTexture(glob.ctx.TEXTURE3);
        glob.ctx.bindTexture(glob.ctx.TEXTURE_2D, this.material.aoMap);
        this.shaderManager.setUniform("u_material.aoMap", 3);
      }
      if (this.material.emissiveMap) {
        glob.ctx.activeTexture(glob.ctx.TEXTURE4);
        glob.ctx.bindTexture(glob.ctx.TEXTURE_2D, this.material.emissiveMap);
        this.shaderManager.setUniform("u_material.emissiveMap", 4);
      }
    }
    this.vao.bind();
    if (this.indexBuffer) {
      glob.ctx.drawElements(
        this.drawMode,
        this.drawCount,
        this.drawType || glob.ctx.UNSIGNED_SHORT,
        0
      );
    } else {
      glob.ctx.drawArrays(
        this.drawMode,
        0,
        this.drawCount
      );
    }
    this.vao.unbind();
  }
};

// ts/classes/webgl2/meshes/containerObject.ts
var ContainerObject = class extends SceneObject {
  constructor(props = {}) {
    const dummyData = {
      vao: null,
      indexBuffer: null,
      drawCount: 0,
      ignoreLighting: false
    };
    super(dummyData, props);
  }
  /**
   * Override render to do nothing since this is just a container
   */
  render(viewMatrix, projectionMatrix) {
  }
};

// ts/classes/webgl2/meshes/baseMesh.ts
var BaseMesh = class _BaseMesh extends SceneObject {
  static setupBuffers(meshData, props) {
    var _a;
    const vao = new VertexArray(glob.ctx);
    vao.bind();
    const vertexBuffer = new VertexBuffer(glob.ctx);
    vertexBuffer.setData(meshData.vertices);
    vao.setAttributePointer(
      SceneObject.getAttributeLocation("position"),
      3,
      glob.ctx.FLOAT,
      false,
      0,
      0
    );
    const colorBuffer = new VertexBuffer(glob.ctx);
    colorBuffer.setData(meshData.colors);
    vao.setAttributePointer(
      SceneObject.getAttributeLocation("color"),
      3,
      glob.ctx.FLOAT,
      false,
      0,
      0
    );
    const normalBuffer = new VertexBuffer(glob.ctx);
    normalBuffer.setData(meshData.normals);
    vao.setAttributePointer(
      SceneObject.getAttributeLocation("normal"),
      3,
      glob.ctx.FLOAT,
      false,
      0,
      0
    );
    const texCoordBuffer = new VertexBuffer(glob.ctx);
    texCoordBuffer.setData(meshData.texCoords);
    vao.setAttributePointer(
      SceneObject.getAttributeLocation("texCoord"),
      2,
      glob.ctx.FLOAT,
      false,
      0,
      0
    );
    if (meshData.tangents) {
      const tangentBuffer = new VertexBuffer(glob.ctx);
      tangentBuffer.setData(meshData.tangents);
      vao.setAttributePointer(
        SceneObject.getAttributeLocation("tangent"),
        3,
        glob.ctx.FLOAT,
        false,
        0,
        0
      );
    }
    if (meshData.bitangents) {
      const bitangentBuffer = new VertexBuffer(glob.ctx);
      bitangentBuffer.setData(meshData.bitangents);
      vao.setAttributePointer(
        SceneObject.getAttributeLocation("bitangent"),
        3,
        glob.ctx.FLOAT,
        false,
        0,
        0
      );
    }
    const indexBuffer = new IndexBuffer(glob.ctx);
    indexBuffer.setData(meshData.indices);
    return {
      vao,
      indexBuffer,
      drawCount: meshData.indices.length,
      ignoreLighting: (_a = props.ignoreLighting) != null ? _a : false
    };
  }
  static createSceneObject(meshData, props) {
    const bufferData = this.setupBuffers(meshData, props);
    return new SceneObject(bufferData, props);
  }
  constructor(meshData, props = {}) {
    super(_BaseMesh.setupBuffers(meshData, props), props);
  }
};

// ts/classes/webgl2/material.ts
var _Material = class _Material {
  constructor({
    baseColor = v3(0.8, 0.8, 0.8),
    roughness = 0.5,
    metallic = 0,
    ambientOcclusion = 1,
    emissive = v3(0, 0, 0),
    albedoMap,
    normalMap,
    metallicRoughnessMap,
    aoMap,
    emissiveMap
  } = {}) {
    this.baseColor = baseColor;
    this.roughness = roughness;
    this.metallic = metallic;
    this.ambientOcclusion = ambientOcclusion;
    this.emissive = emissive;
    this.albedoMap = albedoMap;
    this.normalMap = normalMap;
    this.metallicRoughnessMap = metallicRoughnessMap;
    this.aoMap = aoMap;
    this.emissiveMap = emissiveMap;
  }
  static library(name, color) {
    const material = new _Material(this._materials[name]);
    material.baseColor = color;
    return material;
  }
};
_Material._materials = {
  "plastic": {
    baseColor: v3(0.8, 0.8, 0.8),
    roughness: 0.7,
    metallic: 0.4,
    ambientOcclusion: 1,
    emissive: v3(0, 0, 0)
  },
  "metal": {
    baseColor: v3(0.8, 0.8, 0.8),
    roughness: 0.5,
    metallic: 1,
    ambientOcclusion: 1,
    emissive: v3(0, 0, 0)
  },
  "rough": {
    baseColor: v3(0.8, 0.8, 0.8),
    roughness: 0.8,
    metallic: 0.5,
    ambientOcclusion: 1,
    emissive: v3(0, 0, 0)
  }
};
var Material = _Material;

// ts/classes/webgl2/meshes/cone.ts
var Cone = class extends BaseMesh {
  static generateMeshData(sides = 32, smoothShading = true, colors) {
    const vertices = [];
    const indices = [];
    const normals = [];
    const generatedColors = [];
    const texCoords = [];
    const defaultColors = [
      [0.8, 0.2, 0.2],
      // sides
      [0.2, 0.2, 0.8]
      // bottom
    ];
    let [sideColor, bottomColor] = defaultColors;
    if (colors) {
      if (Array.isArray(colors[0])) {
        [sideColor, bottomColor] = colors;
      } else {
        sideColor = bottomColor = colors;
      }
    }
    if (smoothShading) {
      vertices.push(0, 0.5, 0);
      normals.push(0, 1, 0);
      generatedColors.push(...sideColor);
      texCoords.push(0.5, 1);
      for (let i = 0; i <= sides; i++) {
        const angle2 = i * Math.PI * 2 / sides;
        const x = Math.cos(angle2);
        const z = Math.sin(angle2);
        vertices.push(x * 0.5, -0.5, z * 0.5);
        const dx = x * 0.5;
        const dy = -0.5;
        const dz = z * 0.5;
        const length2 = Math.sqrt(dx * dx + dy * dy + dz * dz);
        normals.push(dx / length2, dy / length2, dz / length2);
        generatedColors.push(...sideColor);
        texCoords.push(i / sides, 0);
      }
      for (let i = 0; i < sides; i++) {
        indices.push(
          0,
          // apex
          i + 2,
          // next base vertex
          i + 1
          // current base vertex
        );
      }
    } else {
      for (let i = 0; i < sides; i++) {
        const angle1 = i * Math.PI * 2 / sides;
        const angle2 = (i + 1) * Math.PI * 2 / sides;
        const x1 = Math.cos(angle1) * 0.5;
        const z1 = Math.sin(angle1) * 0.5;
        const x2 = Math.cos(angle2) * 0.5;
        const z2 = Math.sin(angle2) * 0.5;
        vertices.push(
          0,
          0.5,
          0,
          // apex
          x1,
          -0.5,
          z1,
          // base point 1
          x2,
          -0.5,
          z2
          // base point 2
        );
        const v1x = x1;
        const v1y = -1;
        const v1z = z1;
        const v2x = x2;
        const v2y = -1;
        const v2z = z2;
        const nx = v2y * v1z - v2z * v1y;
        const ny = v2z * v1x - v2x * v1z;
        const nz = v2x * v1y - v2y * v1x;
        const length2 = Math.sqrt(nx * nx + ny * ny + nz * nz);
        const normalX = nx / length2;
        const normalY = ny / length2;
        const normalZ = nz / length2;
        for (let j = 0; j < 3; j++) {
          normals.push(normalX, normalY, normalZ);
          generatedColors.push(...sideColor);
        }
        texCoords.push(
          0.5,
          1,
          i / sides,
          0,
          (i + 1) / sides,
          0
        );
        const baseIndex = i * 3;
        indices.push(baseIndex, baseIndex + 2, baseIndex + 1);
      }
    }
    const baseVertexCount = vertices.length / 3;
    vertices.push(0, -0.5, 0);
    normals.push(0, -1, 0);
    generatedColors.push(...bottomColor);
    texCoords.push(0.5, 0.5);
    for (let i = 0; i < sides; i++) {
      const angle1 = i * Math.PI * 2 / sides;
      const angle2 = (i + 1) * Math.PI * 2 / sides;
      const x1 = Math.cos(angle1) * 0.5;
      const z1 = Math.sin(angle1) * 0.5;
      const x2 = Math.cos(angle2) * 0.5;
      const z2 = Math.sin(angle2) * 0.5;
      vertices.push(
        x1,
        -0.5,
        z1,
        x2,
        -0.5,
        z2
      );
      normals.push(0, -1, 0, 0, -1, 0);
      generatedColors.push(...bottomColor, ...bottomColor);
      texCoords.push(
        x1 + 0.5,
        z1 + 0.5,
        x2 + 0.5,
        z2 + 0.5
      );
      const offset = baseVertexCount + 1 + i * 2;
      indices.push(
        baseVertexCount,
        // center
        offset,
        // current point
        offset + 1
        // next point
      );
    }
    return {
      vertices: new Float32Array(vertices),
      indices: new Uint16Array(indices),
      normals: new Float32Array(normals),
      colors: new Float32Array(generatedColors),
      texCoords: new Float32Array(texCoords)
    };
  }
  static create(props = {}) {
    var _a;
    if (!props.material && props.colors) {
      let baseColor;
      if (Array.isArray(props.colors) && Array.isArray(props.colors[0])) {
        const firstColor = props.colors[0];
        baseColor = v3(firstColor[0], firstColor[1], firstColor[2]);
      } else {
        const singleColor = props.colors;
        baseColor = v3(singleColor[0], singleColor[1], singleColor[2]);
      }
      props = __spreadProps(__spreadValues({}, props), {
        material: new Material({
          baseColor,
          roughness: 0.5,
          metallic: 0,
          ambientOcclusion: 1,
          emissive: v3(0, 0, 0)
        })
      });
    }
    const meshData = this.generateMeshData(
      props.sides || 32,
      (_a = props.smoothShading) != null ? _a : true,
      props.colors
    );
    return this.createSceneObject(meshData, props);
  }
};

// ts/classes/webgl2/meshes/cylinder.ts
var Cylinder = class extends BaseMesh {
  static generateMeshData(sides = 32, smoothShading = true, colors) {
    const vertices = [];
    const indices = [];
    const normals = [];
    const generatedColors = [];
    const texCoords = [];
    const defaultColors = [
      [0.8, 0.2, 0.2],
      // sides
      [0.2, 0.2, 0.8],
      // top
      [0.8, 0.8, 0.2]
      // bottom
    ];
    let [sideColor, topColor, bottomColor] = defaultColors;
    if (colors) {
      if (Array.isArray(colors[0])) {
        [sideColor, topColor, bottomColor] = colors;
      } else {
        sideColor = topColor = bottomColor = colors;
      }
    }
    if (smoothShading) {
      for (let i = 0; i <= sides; i++) {
        const angle2 = i * Math.PI * 2 / sides;
        const x = Math.cos(angle2);
        const z = Math.sin(angle2);
        vertices.push(x * 0.5, 0.5, z * 0.5);
        vertices.push(x * 0.5, -0.5, z * 0.5);
        normals.push(x, 0, z);
        normals.push(x, 0, z);
        generatedColors.push(...sideColor);
        generatedColors.push(...sideColor);
        texCoords.push(i / sides, 1);
        texCoords.push(i / sides, 0);
      }
      for (let i = 0; i < sides; i++) {
        const topFirst = i * 2;
        const bottomFirst = topFirst + 1;
        const topSecond = (i + 1) * 2;
        const bottomSecond = topSecond + 1;
        indices.push(topFirst, topSecond, bottomFirst);
        indices.push(bottomFirst, topSecond, bottomSecond);
      }
      const sideVertexCount = vertices.length / 3;
      vertices.push(0, 0.5, 0);
      vertices.push(0, -0.5, 0);
      normals.push(0, 1, 0);
      normals.push(0, -1, 0);
      generatedColors.push(...topColor, ...bottomColor);
      texCoords.push(0.5, 0.5, 0.5, 0.5);
      const topCenterIndex = sideVertexCount;
      const bottomCenterIndex = sideVertexCount + 1;
      for (let i = 0; i < sides; i++) {
        const angle1 = i * Math.PI * 2 / sides;
        const angle2 = (i + 1) * Math.PI * 2 / sides;
        const x1 = Math.cos(angle1) * 0.5;
        const z1 = Math.sin(angle1) * 0.5;
        const x2 = Math.cos(angle2) * 0.5;
        const z2 = Math.sin(angle2) * 0.5;
        vertices.push(
          x1,
          0.5,
          z1,
          // Top cap point 1
          x2,
          0.5,
          z2,
          // Top cap point 2
          x1,
          -0.5,
          z1,
          // Bottom cap point 1
          x2,
          -0.5,
          z2
          // Bottom cap point 2
        );
        normals.push(
          0,
          1,
          0,
          // Top cap normal
          0,
          1,
          0,
          // Top cap normal
          0,
          -1,
          0,
          // Bottom cap normal
          0,
          -1,
          0
          // Bottom cap normal
        );
        generatedColors.push(
          ...topColor,
          ...topColor,
          ...bottomColor,
          ...bottomColor
          // Bottom cap colors
        );
        texCoords.push(
          x1 + 0.5,
          z1 + 0.5,
          // Top cap first point
          x2 + 0.5,
          z2 + 0.5,
          // Top cap second point
          x1 + 0.5,
          z1 + 0.5,
          // Bottom cap first point
          x2 + 0.5,
          z2 + 0.5
          // Bottom cap second point
        );
        const topSegmentStart = sideVertexCount + 2 + i * 4;
        const bottomSegmentStart = topSegmentStart + 2;
        indices.push(
          topCenterIndex,
          // Top center
          topSegmentStart,
          // Top current point
          topSegmentStart + 1,
          // Top next point
          bottomCenterIndex,
          // Bottom center
          bottomSegmentStart,
          // Bottom current point
          bottomSegmentStart + 1
          // Bottom next point
        );
      }
    } else {
      for (let i = 0; i < sides; i++) {
        const angle1 = i * Math.PI * 2 / sides;
        const angle2 = (i + 1) * Math.PI * 2 / sides;
        const x1 = Math.cos(angle1);
        const z1 = Math.sin(angle1);
        const x2 = Math.cos(angle2);
        const z2 = Math.sin(angle2);
        vertices.push(
          x1 * 0.5,
          0.5,
          z1 * 0.5,
          // top-left
          x2 * 0.5,
          0.5,
          z2 * 0.5,
          // top-right
          x1 * 0.5,
          -0.5,
          z1 * 0.5,
          // bottom-left
          x1 * 0.5,
          -0.5,
          z1 * 0.5,
          // bottom-left
          x2 * 0.5,
          0.5,
          z2 * 0.5,
          // top-right
          x2 * 0.5,
          -0.5,
          z2 * 0.5
          // bottom-right
        );
        const nx = (x1 + x2) / 2;
        const nz = (z1 + z2) / 2;
        const length2 = Math.sqrt(nx * nx + nz * nz);
        const normalX = nx / length2;
        const normalZ = nz / length2;
        for (let j = 0; j < 6; j++) {
          normals.push(normalX, 0, normalZ);
          generatedColors.push(...sideColor);
        }
        texCoords.push(
          i / sides,
          1,
          (i + 1) / sides,
          1,
          i / sides,
          0,
          i / sides,
          0,
          (i + 1) / sides,
          1,
          (i + 1) / sides,
          0
        );
        const baseIndex = i * 6;
        indices.push(
          baseIndex,
          baseIndex + 1,
          baseIndex + 2,
          baseIndex + 3,
          baseIndex + 4,
          baseIndex + 5
        );
      }
      const sideVertexCount = vertices.length / 3;
      vertices.push(0, 0.5, 0);
      vertices.push(0, -0.5, 0);
      normals.push(0, 1, 0);
      normals.push(0, -1, 0);
      generatedColors.push(...topColor, ...bottomColor);
      texCoords.push(0.5, 0.5, 0.5, 0.5);
      const topCenterIndex = sideVertexCount;
      const bottomCenterIndex = sideVertexCount + 1;
      for (let i = 0; i < sides; i++) {
        const angle1 = i * Math.PI * 2 / sides;
        const angle2 = (i + 1) * Math.PI * 2 / sides;
        const x1 = Math.cos(angle1) * 0.5;
        const z1 = Math.sin(angle1) * 0.5;
        const x2 = Math.cos(angle2) * 0.5;
        const z2 = Math.sin(angle2) * 0.5;
        vertices.push(
          x1,
          0.5,
          z1,
          x2,
          0.5,
          z2
        );
        normals.push(0, 1, 0, 0, 1, 0);
        generatedColors.push(...topColor, ...topColor);
        texCoords.push(
          x1 + 0.5,
          z1 + 0.5,
          x2 + 0.5,
          z2 + 0.5
        );
        const topOffset = sideVertexCount + 2 + i * 4;
        indices.push(
          topCenterIndex,
          // center
          topOffset + 1,
          // next point
          topOffset
          // current point
        );
        vertices.push(
          x1,
          -0.5,
          z1,
          x2,
          -0.5,
          z2
        );
        normals.push(0, -1, 0, 0, -1, 0);
        generatedColors.push(...bottomColor, ...bottomColor);
        texCoords.push(
          x1 + 0.5,
          z1 + 0.5,
          x2 + 0.5,
          z2 + 0.5
        );
        const bottomOffset = topOffset + 2;
        indices.push(
          bottomCenterIndex,
          // center
          bottomOffset,
          // current point
          bottomOffset + 1
          // next point
        );
      }
    }
    return {
      vertices: new Float32Array(vertices),
      indices: new Uint16Array(indices),
      normals: new Float32Array(normals),
      colors: new Float32Array(generatedColors),
      texCoords: new Float32Array(texCoords)
    };
  }
  static create(props = {}) {
    var _a;
    if (!props.material && props.colors) {
      let baseColor;
      if (Array.isArray(props.colors) && Array.isArray(props.colors[0])) {
        const firstColor = props.colors[0];
        baseColor = v3(firstColor[0], firstColor[1], firstColor[2]);
      } else {
        const singleColor = props.colors;
        baseColor = v3(singleColor[0], singleColor[1], singleColor[2]);
      }
      props = __spreadProps(__spreadValues({}, props), {
        material: new Material({
          baseColor,
          roughness: 0.5,
          metallic: 0,
          ambientOcclusion: 1,
          emissive: v3(0, 0, 0)
        })
      });
    }
    const meshData = this.generateMeshData(props.sides || 32, (_a = props.smoothShading) != null ? _a : true, props.colors);
    return this.createSceneObject(meshData, props);
  }
};

// ts/classes/webgl2/meshes/arrow.ts
var Arrow = class extends ContainerObject {
  constructor(scene, props = {}) {
    super(props);
    this.props = __spreadValues({
      position: v3(0, 0, 0),
      shaftRadius: 0.5,
      headLength: 0.5,
      headRadius: 2,
      sides: 4,
      smoothShading: false,
      shaftColor: [1, 1, 1],
      headColor: [1, 1, 1]
    }, props);
    if (props.parent) {
      this.transform.setParent(props.parent.transform);
    }
    const shaftLength = this.props.length - this.props.headLength;
    scene.add(this.shaft = Cylinder.create({
      position: v3(0, shaftLength / 2, 0),
      scale: v3(this.props.shaftRadius, shaftLength, this.props.shaftRadius),
      colors: this.props.shaftColor,
      sides: this.props.sides,
      smoothShading: this.props.smoothShading,
      parent: this,
      ignoreLighting: this.props.ignoreLighting,
      pickColor: this.props.pickColor
    }));
    scene.add(this.head = Cone.create({
      position: v3(0, shaftLength + this.props.headLength / 2, 0),
      scale: v3(this.props.headRadius, this.props.headLength, this.props.headRadius),
      colors: this.props.headColor,
      smoothShading: this.props.smoothShading,
      sides: this.props.sides,
      parent: this,
      ignoreLighting: this.props.ignoreLighting,
      pickColor: this.props.pickColor
    }));
    this.setLength(this.props.length);
    if (this.props.lookAt) {
      this.lookAt(this.props.lookAt);
    }
  }
  setLength(length2) {
    let shaftLength = length2 - this.props.headLength;
    let headLength = this.props.headLength;
    if (shaftLength < 0) {
      headLength = length2;
      shaftLength = 0;
    }
    this.shaft.transform.setPosition(v3(0, shaftLength / 2, 0));
    this.shaft.transform.setScale(v3(this.props.shaftRadius, shaftLength, this.props.shaftRadius));
    this.head.transform.setPosition(v3(0, shaftLength + headLength / 2, 0));
    this.head.transform.setScale(v3(this.props.headRadius, headLength, this.props.headRadius));
  }
  lookAt(target) {
    const position = this.transform.getWorldPosition();
    const direction = target.subtract(position).normalize();
    const defaultDir = v3(0, 1, 0);
    const rotationAxis = defaultDir.cross(direction).scale(-1).normalize();
    const angle2 = Math.acos(defaultDir.y * direction.y + defaultDir.x * direction.x + defaultDir.z * direction.z);
    this.transform.setRotation(new Quaternion().setAxisAngle(rotationAxis, angle2));
  }
};

// ts/classes/webgl2/meshes/icoSphere.ts
var _IcoSphere = class _IcoSphere extends BaseMesh {
  static normalize(v) {
    const length2 = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    return [v[0] / length2, v[1] / length2, v[2] / length2];
  }
  static midpoint(v1, v22) {
    return this.normalize([
      (v1[0] + v22[0]) / 2,
      (v1[1] + v22[1]) / 2,
      (v1[2] + v22[2]) / 2
    ]);
  }
  static generateMeshData(subdivisions = 0, smoothShading = true, color = [0.8, 0.2, 0.2]) {
    let vertices = [...this.baseVertices];
    let indices = [...this.baseIndices];
    const vertexMap = /* @__PURE__ */ new Map();
    const getMiddlePoint = (v1Index, v2Index) => {
      const key = "".concat(Math.min(v1Index, v2Index), "_").concat(Math.max(v1Index, v2Index));
      if (vertexMap.has(key)) {
        return vertexMap.get(key);
      }
      const p1 = vertices[v1Index];
      const p2 = vertices[v2Index];
      const middle = this.midpoint(p1, p2);
      const i = vertices.length;
      vertices.push(middle);
      vertexMap.set(key, i);
      return i;
    };
    for (let i = 0; i < subdivisions; i++) {
      const newIndices = [];
      for (let j = 0; j < indices.length; j += 3) {
        const a = indices[j];
        const b = indices[j + 1];
        const c = indices[j + 2];
        const ab = getMiddlePoint(a, b);
        const bc = getMiddlePoint(b, c);
        const ca = getMiddlePoint(c, a);
        newIndices.push(
          a,
          ab,
          ca,
          b,
          bc,
          ab,
          c,
          ca,
          bc,
          ab,
          bc,
          ca
        );
      }
      indices = newIndices;
    }
    vertices = vertices.map((v) => [v[0] * 0.5, v[1] * 0.5, v[2] * 0.5]);
    const flatVertices = [];
    const normals = [];
    const generatedColors = [];
    const texCoords = [];
    const tangents = [];
    const bitangents = [];
    if (smoothShading) {
      vertices.forEach((v) => {
        flatVertices.push(...v);
        const normal = this.normalize(v);
        normals.push(...normal);
        generatedColors.push(...color);
        const u = 0.5 + Math.atan2(v[2], v[0]) / (2 * Math.PI);
        const vCoord = 0.5 - Math.asin(v[1]) / Math.PI;
        texCoords.push(u, vCoord);
        const tangent = [-v[2], 0, v[0]];
        const tangentLength = Math.sqrt(tangent[0] * tangent[0] + tangent[2] * tangent[2]);
        if (tangentLength > 0.01) {
          tangent[0] /= tangentLength;
          tangent[2] /= tangentLength;
        } else {
          tangent[0] = 1;
          tangent[1] = 0;
          tangent[2] = 0;
        }
        tangents.push(...tangent);
        const bitangent = [
          normal[1] * tangent[2] - normal[2] * tangent[1],
          normal[2] * tangent[0] - normal[0] * tangent[2],
          normal[0] * tangent[1] - normal[1] * tangent[0]
        ];
        bitangents.push(...bitangent);
      });
    } else {
      const newIndices = [];
      for (let i = 0; i < indices.length; i += 3) {
        const v1 = vertices[indices[i]];
        const v22 = vertices[indices[i + 1]];
        const v32 = vertices[indices[i + 2]];
        const dx1 = v22[0] - v1[0], dy1 = v22[1] - v1[1], dz1 = v22[2] - v1[2];
        const dx2 = v32[0] - v1[0], dy2 = v32[1] - v1[1], dz2 = v32[2] - v1[2];
        const normal = this.normalize([
          dy1 * dz2 - dz1 * dy2,
          dz1 * dx2 - dx1 * dz2,
          dx1 * dy2 - dy1 * dx2
        ]);
        const baseIndex = flatVertices.length / 3;
        const tangent = [1, 0, 0];
        const bitangent = [0, 1, 0];
        [v1, v22, v32].forEach((vertex) => {
          flatVertices.push(...vertex);
          normals.push(...normal);
          generatedColors.push(...color);
          const u = 0.5 + Math.atan2(vertex[2], vertex[0]) / (2 * Math.PI);
          const vCoord = 0.5 - Math.asin(vertex[1]) / Math.PI;
          texCoords.push(u, vCoord);
          tangents.push(...tangent);
          bitangents.push(...bitangent);
        });
        newIndices.push(baseIndex, baseIndex + 1, baseIndex + 2);
      }
      indices = newIndices;
    }
    return {
      vertices: new Float32Array(flatVertices),
      indices: new Uint16Array(indices),
      normals: new Float32Array(normals),
      colors: new Float32Array(generatedColors),
      texCoords: new Float32Array(texCoords),
      tangents: new Float32Array(tangents),
      bitangents: new Float32Array(bitangents)
    };
  }
  static create(props = {}) {
    var _a, _b;
    if (!props.material && props.color) {
      const baseColor = v3(props.color[0], props.color[1], props.color[2]);
      props = __spreadProps(__spreadValues({}, props), {
        material: new Material({
          baseColor,
          roughness: 0.5,
          metallic: 0,
          ambientOcclusion: 1,
          emissive: v3(0, 0, 0)
        })
      });
    }
    let meshColor;
    if (props.material) {
      const { baseColor } = props.material;
      meshColor = [baseColor.x, baseColor.y, baseColor.z];
    } else if (props.color) {
      meshColor = props.color;
    } else {
      meshColor = [0.8, 0.2, 0.2];
    }
    const meshData = this.generateMeshData(
      (_a = props.subdivisions) != null ? _a : 0,
      (_b = props.smoothShading) != null ? _b : true,
      meshColor
    );
    const sceneObject = this.createSceneObject(meshData, props);
    return sceneObject;
  }
};
_IcoSphere.X = 0.5257311121191336;
_IcoSphere.Z = 0.8506508083520399;
// Initial icosahedron vertices
_IcoSphere.baseVertices = [
  [-_IcoSphere.X, 0, _IcoSphere.Z],
  [_IcoSphere.X, 0, _IcoSphere.Z],
  [-_IcoSphere.X, 0, -_IcoSphere.Z],
  [_IcoSphere.X, 0, -_IcoSphere.Z],
  [0, _IcoSphere.Z, _IcoSphere.X],
  [0, _IcoSphere.Z, -_IcoSphere.X],
  [0, -_IcoSphere.Z, _IcoSphere.X],
  [0, -_IcoSphere.Z, -_IcoSphere.X],
  [_IcoSphere.Z, _IcoSphere.X, 0],
  [-_IcoSphere.Z, _IcoSphere.X, 0],
  [_IcoSphere.Z, -_IcoSphere.X, 0],
  [-_IcoSphere.Z, -_IcoSphere.X, 0]
];
// Initial icosahedron indices
_IcoSphere.baseIndices = [
  1,
  4,
  0,
  4,
  9,
  0,
  4,
  5,
  9,
  8,
  5,
  4,
  1,
  8,
  4,
  1,
  10,
  8,
  10,
  3,
  8,
  8,
  3,
  5,
  3,
  2,
  5,
  3,
  7,
  2,
  3,
  10,
  7,
  10,
  6,
  7,
  6,
  11,
  7,
  6,
  0,
  11,
  6,
  1,
  0,
  10,
  1,
  6,
  11,
  0,
  9,
  2,
  11,
  9,
  5,
  2,
  9,
  11,
  2,
  7
];
var IcoSphere = _IcoSphere;

// ts/classes/webgl2/lights/shadowMap.ts
var ShadowMap = class {
  constructor(gl, size = 2048) {
    this.size = size;
    this.depthTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.depthTexture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.DEPTH_COMPONENT24,
      // Use 24-bit depth for better precision
      size,
      size,
      0,
      gl.DEPTH_COMPONENT,
      gl.UNSIGNED_INT,
      // Use unsigned int format for wider range
      null
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    this.framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.DEPTH_ATTACHMENT,
      gl.TEXTURE_2D,
      this.depthTexture,
      0
    );
    gl.drawBuffers([gl.NONE]);
    gl.readBuffer(gl.NONE);
    const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if (status !== gl.FRAMEBUFFER_COMPLETE) {
      console.error("Framebuffer not complete:", status);
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindTexture(gl.TEXTURE_2D, null);
  }
  bind(gl) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
    gl.viewport(0, 0, this.size, this.size);
    gl.clearDepth(1);
    gl.clear(gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LESS);
    gl.depthMask(true);
    gl.colorMask(false, false, false, false);
  }
  unbind(gl) {
    gl.colorMask(true, true, true, true);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }
  bindDepthTexture(gl, textureUnit) {
    gl.activeTexture(gl.TEXTURE0 + textureUnit);
    gl.bindTexture(gl.TEXTURE_2D, this.depthTexture);
  }
  getDepthTexture() {
    return this.depthTexture;
  }
  getSize() {
    return this.size;
  }
};

// ts/classes/webgl2/lights/light.ts
var Light = class {
  constructor({
    color = v3(1, 1, 1),
    intensity = 1,
    enabled = true
  } = {}) {
    this.enabled = true;
    this.color = color;
    this.intensity = intensity;
    this.enabled = enabled;
    this.type = 4 /* INACTIVE */;
  }
  getIntensity() {
    return this.enabled ? this.intensity : 0;
  }
  isEnabled() {
    return this.enabled;
  }
  setEnabled(enabled) {
    this.enabled = enabled;
  }
  getType() {
    return this.enabled ? this.type : 4 /* INACTIVE */;
  }
  getData() {
    return {
      color: this.color,
      intensity: this.getIntensity(),
      enabled: this.enabled
    };
  }
  getShadowMap() {
    return this.enabled ? null : null;
  }
};
var AmbientLight = class extends Light {
  constructor({ color = v3(1, 1, 1), intensity = 0.1 } = {}) {
    super({ color, intensity });
    this.type = 0 /* AMBIENT */;
  }
};
var DirectionalLight = class extends Light {
  constructor({
    direction = v3(0, -1, 0),
    color = v3(1, 1, 1),
    intensity = 1,
    enabled = true
  } = {}) {
    super({ color, intensity, enabled });
    this.direction = direction.normalize();
    this.type = 1 /* DIRECTIONAL */;
    this.shadowMap = new ShadowMap(glob.ctx, 4096);
    this.lightProjection = new Matrix4().ortho(
      -20,
      20,
      // left, right
      -20,
      20,
      // bottom, top
      0.1,
      200
      // near, far
    );
  }
  getData() {
    return __spreadProps(__spreadValues({}, super.getData()), {
      direction: this.direction
    });
  }
  getDirection() {
    return this.direction;
  }
  setDirection(direction) {
    this.direction = direction.normalize();
  }
  getLightSpaceMatrix() {
    const lightView = Matrix4.lookAt(
      this.direction.scale(-10),
      // Position light far enough away in opposite direction
      v3(0, 0, 0)
      // Look at scene center
    );
    return this.lightProjection.multiply(lightView);
  }
  getShadowMap() {
    return this.shadowMap;
  }
  lookAt(from, target) {
    const direction = target.subtract(from).normalize();
    const defaultDir = v3(0, -1, 0);
    const rotationAxis = defaultDir.cross(direction).normalize();
    const angle2 = Math.acos(defaultDir.y * direction.y + defaultDir.x * direction.x + defaultDir.z * direction.z);
    this.direction = new Quaternion().setAxisAngle(rotationAxis, angle2).toEuler();
  }
};
var PointLight = class extends Light {
  constructor({
    position = v3(0, 0, 0),
    color = v3(1, 1, 1),
    intensity = 5,
    // Increased intensity for PBR
    attenuation = { constant: 1, linear: 0.22, quadratic: 0.2 },
    // Better PBR attenuation values
    meshContainer,
    enabled = true
  } = {}) {
    super({ color, intensity, enabled });
    this.position = position;
    this.constant = attenuation.constant;
    this.linear = attenuation.linear;
    this.quadratic = attenuation.quadratic;
    this.type = 2 /* POINT */;
    this.shadowMap = new ShadowMap(glob.ctx, 4096);
    this.lightProjection = new Matrix4().ortho(
      -20,
      20,
      // left, right - doubled for wider coverage
      -20,
      20,
      // bottom, top - doubled for wider coverage
      0.1,
      200
      // near, far - increased far plane for deeper shadows
    );
    if (meshContainer) {
      meshContainer.add(this.mesh = IcoSphere.create({
        position,
        scale: v3(0.2, 0.2, 0.2),
        smoothShading: true,
        subdivisions: 0,
        ignoreLighting: false,
        pickColor: -1,
        color: [color.x, color.y, color.z]
      }));
    }
  }
  setPosition(position) {
    this.position = position;
    if (this.mesh) {
      this.mesh.transform.setPosition(position);
    }
  }
  getPosition() {
    return this.position;
  }
  getData() {
    return __spreadProps(__spreadValues({}, super.getData()), {
      position: this.position,
      constant: this.constant,
      linear: this.linear,
      quadratic: this.quadratic
    });
  }
  getLightSpaceMatrix() {
    const lightView = Matrix4.lookAt(
      this.position,
      // Light position
      v3(0, 0, 0)
      // Looking at scene center
    );
    const distanceToCenter = Math.sqrt(
      this.position.x * this.position.x + this.position.y * this.position.y + this.position.z * this.position.z
    );
    this.lightProjection = new Matrix4().ortho(
      -20,
      20,
      // Much wider left/right bounds
      -20,
      20,
      // Much wider top/bottom bounds
      0.01,
      // Much closer near plane (was 0.1 or higher)
      50
      // Much farther far plane 
    );
    return this.lightProjection.multiply(lightView);
  }
  getShadowMap() {
    return this.shadowMap;
  }
};
var SpotLight = class extends PointLight {
  constructor({
    position = v3(0, 0, 0),
    direction = v3(0, -1, 0),
    color = v3(1, 1, 1),
    intensity = 8,
    // Increased intensity for PBR
    cutOff = Math.cos(Math.PI / 6),
    // 30 degrees
    outerCutOff = Math.cos(Math.PI / 4),
    // 45 degrees
    meshContainer,
    enabled = true
  } = {}) {
    super({
      position,
      color,
      intensity,
      attenuation: {
        constant: 1,
        linear: 0.22,
        quadratic: 0.2
      },
      meshContainer,
      enabled
    });
    this.rotation = new Quaternion();
    this.cutOff = cutOff;
    this.outerCutOff = outerCutOff;
    this.type = 3 /* SPOT */;
    if (this.mesh) {
      this.arrow = new Arrow(meshContainer, {
        shaftColor: [color.x * 0.8, color.y * 0.8, color.z * 0.8],
        headColor: [color.x, color.y, color.z],
        length: 0.5,
        shaftRadius: 0.05,
        headLength: 0.15,
        headRadius: 0.12,
        sides: 8,
        position: this.position,
        rotation: this.rotation,
        lookAt: v3(0, 0, 0),
        ignoreLighting: true,
        pickColor: -1
      });
    }
    if (direction) {
      this.lookAt(position.add(direction));
    }
  }
  getData() {
    const defaultDir = v3(0, -1, 0);
    const direction = defaultDir.applyQuaternion(this.rotation);
    return __spreadProps(__spreadValues({}, super.getData()), {
      direction,
      cutOff: this.cutOff,
      outerCutOff: this.outerCutOff
    });
  }
  lookAt(target) {
    const direction = target.subtract(this.position).normalize();
    const defaultDir = v3(0, -1, 0);
    const rotationAxis = defaultDir.cross(direction).normalize();
    const angle2 = Math.acos(defaultDir.y * direction.y + defaultDir.x * direction.x + defaultDir.z * direction.z);
    this.rotation = new Quaternion().setAxisAngle(rotationAxis, angle2);
    if (this.arrow) {
      this.arrow.lookAt(target);
    }
  }
  setPosition(x, y, z) {
    if (typeof x === "number") {
      super.setPosition(v3(x, y, z));
    } else {
      super.setPosition(x);
    }
    if (this.arrow) {
      this.arrow.transform.setPosition(super.getPosition());
    }
  }
  getPosition() {
    return this.position;
  }
  getRotation() {
    return this.rotation.clone();
  }
  setRotation(rotation) {
    this.rotation = rotation;
  }
};

// ts/classes/webgl2/lights/lightManager.ts
var LightManager = class {
  constructor(shaderManager) {
    this.lights = [];
    this.ambientLight = null;
    this.MAX_LIGHTS = 10;
    this.shaderManager = shaderManager;
    this.setAmbientLight(new AmbientLight({
      color: v3(1, 1, 1),
      intensity: 0.03
      // Lower default ambient for PBR to emphasize directional lighting
    }));
  }
  /**
   * Sets the ambient light for the scene
   * For PBR, keep ambient light intensity low (0.01-0.05) to maintain physical accuracy
   */
  setAmbientLight(light) {
    this.ambientLight = light;
    this.updateShaderUniforms();
  }
  /**
   * Adds a light to the scene
   * Note: For PBR, use higher intensities (5-10) for point and spot lights
   */
  addLight(light) {
    if (light instanceof AmbientLight) {
      console.warn("Use setAmbientLight() to set the ambient light instead of addLight()");
      return;
    }
    if (this.lights.length >= this.MAX_LIGHTS) {
      console.warn("Maximum number of lights (".concat(this.MAX_LIGHTS, ") reached. Light not added."));
      return;
    }
    this.lights.push(light);
    this.updateShaderUniforms();
  }
  removeLight(light) {
    if (light instanceof AmbientLight) {
      console.warn("Cannot remove ambient light. Use setAmbientLight() to modify it instead");
      return;
    }
    const index = this.lights.indexOf(light);
    if (index !== -1) {
      this.lights.splice(index, 1);
      this.updateShaderUniforms();
    }
  }
  getLights() {
    return this.lights;
  }
  /**
   * Updates all light-related shader uniforms
   * This sets the PBR-optimized values for lights in the shader
   */
  updateShaderUniforms() {
    const types = new Int32Array(this.MAX_LIGHTS);
    const positions = new Float32Array(this.MAX_LIGHTS * 3);
    const directions = new Float32Array(this.MAX_LIGHTS * 3);
    const colors = new Float32Array(this.MAX_LIGHTS * 3);
    const intensities = new Float32Array(this.MAX_LIGHTS);
    const constants = new Float32Array(this.MAX_LIGHTS);
    const linears = new Float32Array(this.MAX_LIGHTS);
    const quadratics = new Float32Array(this.MAX_LIGHTS);
    const cutOffs = new Float32Array(this.MAX_LIGHTS);
    const outerCutOffs = new Float32Array(this.MAX_LIGHTS);
    types.fill(4 /* INACTIVE */);
    constants.fill(1);
    let currentIndex = 0;
    if (this.ambientLight && this.ambientLight.isEnabled()) {
      const data = this.ambientLight.getData();
      types[currentIndex] = 0 /* AMBIENT */;
      colors[currentIndex * 3] = data.color.x;
      colors[currentIndex * 3 + 1] = data.color.y;
      colors[currentIndex * 3 + 2] = data.color.z;
      intensities[currentIndex] = data.intensity;
      currentIndex++;
    }
    for (const light of this.lights) {
      if (!light.isEnabled())
        continue;
      if (currentIndex >= this.MAX_LIGHTS) {
        console.warn("Maximum number of lights (".concat(this.MAX_LIGHTS, ") reached. Some lights will not be rendered."));
        break;
      }
      const data = light.getData();
      types[currentIndex] = light.getType();
      const colorOffset = currentIndex * 3;
      colors[colorOffset] = data.color.x;
      colors[colorOffset + 1] = data.color.y;
      colors[colorOffset + 2] = data.color.z;
      intensities[currentIndex] = data.intensity;
      switch (light.getType()) {
        case 1 /* DIRECTIONAL */: {
          const dirLight = light;
          const dirData = dirLight.getData();
          const dirOffset = currentIndex * 3;
          directions[dirOffset] = dirData.direction.x;
          directions[dirOffset + 1] = dirData.direction.y;
          directions[dirOffset + 2] = dirData.direction.z;
          break;
        }
        case 2 /* POINT */: {
          const pointLight = light;
          const pointData = pointLight.getData();
          const posOffset = currentIndex * 3;
          positions[posOffset] = pointData.position.x;
          positions[posOffset + 1] = pointData.position.y;
          positions[posOffset + 2] = pointData.position.z;
          constants[currentIndex] = pointData.constant;
          linears[currentIndex] = pointData.linear;
          quadratics[currentIndex] = pointData.quadratic;
          break;
        }
        case 3 /* SPOT */: {
          const spotLight = light;
          const spotData = spotLight.getData();
          const posOffset = currentIndex * 3;
          const dirOffset = currentIndex * 3;
          positions[posOffset] = spotData.position.x;
          positions[posOffset + 1] = spotData.position.y;
          positions[posOffset + 2] = spotData.position.z;
          directions[dirOffset] = spotData.direction.x;
          directions[dirOffset + 1] = spotData.direction.y;
          directions[dirOffset + 2] = spotData.direction.z;
          constants[currentIndex] = spotData.constant;
          linears[currentIndex] = spotData.linear;
          quadratics[currentIndex] = spotData.quadratic;
          cutOffs[currentIndex] = spotData.cutOff;
          outerCutOffs[currentIndex] = spotData.outerCutOff;
          break;
        }
      }
      currentIndex++;
    }
    this.shaderManager.setUniform("u_numLights", currentIndex);
    this.shaderManager.setUniform("u_lightTypes", types);
    this.shaderManager.setUniform("u_lightPositions", positions);
    this.shaderManager.setUniform("u_lightDirections", directions);
    this.shaderManager.setUniform("u_lightColors", colors);
    this.shaderManager.setUniform("u_lightIntensities", intensities);
    this.shaderManager.setUniform("u_lightConstants", constants);
    this.shaderManager.setUniform("u_lightLinears", linears);
    this.shaderManager.setUniform("u_lightQuadratics", quadratics);
    this.shaderManager.setUniform("u_lightCutOffs", cutOffs);
    this.shaderManager.setUniform("u_lightOuterCutOffs", outerCutOffs);
  }
};

// ts/classes/webgl2/shaders/colorPickingShader.ts
var colorPickingVertexShader = "#version 300 es\nin vec3 a_position;\n\nuniform mat4 u_modelMatrix;\nuniform mat4 u_viewMatrix;\nuniform mat4 u_projectionMatrix;\n\nvoid main() {\n    gl_Position = u_projectionMatrix * u_viewMatrix * u_modelMatrix * vec4(a_position, 1.0);\n}";
var colorPickingFragmentShader = "#version 300 es\nprecision highp float;\n\nuniform vec3 u_pickingColor;\nout vec4 fragColor;\n\nvoid main() {\n    fragColor = vec4(u_pickingColor, 1.0);\n}";

// ts/classes/webgl2/scene.ts
var Scene = class {
  constructor(camera, options = {}) {
    this.objects = [];
    this.clearColor = [0, 0, 0, 1];
    this.showColorPicking = true;
    // Debug flag to show color picking
    // Picking framebuffer setup
    this.pickingFramebuffer = null;
    this.pickingTexture = null;
    this.pickingDepthBuffer = null;
    this.showShadowMap = false;
    this.frameCount = 0;
    this.debugShadowMap = false;
    this.debugLightIndex = 0;
    this.fullScreenQuadVAO = null;
    var _a;
    this.camera = camera;
    this.lightManager = new LightManager(glob.shaderManager);
    this.ambientLight = new AmbientLight({ color: options.ambientLightColor || v3(1, 1, 1), intensity: (_a = options.ambientLightIntensity) != null ? _a : 0.1 });
    glob.shaderManager.loadShaderProgram("picking", colorPickingVertexShader, colorPickingFragmentShader);
    glob.events.resize.subscribe("level", this.resize.bind(this));
  }
  get ambientLight() {
    return this._ambientLight;
  }
  set ambientLight(value) {
    this._ambientLight = value;
    this.lightManager.setAmbientLight(this.ambientLight);
  }
  click(vector2) {
    this.lastClick = vector2;
  }
  add(object) {
    this.objects.push(object);
  }
  remove(object) {
    const index = this.objects.indexOf(object);
    if (index !== -1) {
      this.objects.splice(index, 1);
    }
  }
  getLights() {
    return this.lightManager.getLights();
  }
  render() {
    const gl = glob.ctx;
    const viewMatrix = this.camera.getViewMatrix();
    const projectionMatrix = this.camera.getProjectionMatrix();
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.pickingFramebuffer);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clearColor(0, 0, 0, 1);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    glob.shaderManager.useProgram("picking");
    for (const object of this.objects) {
      if (!object.vao || object.pickColorArray === void 0)
        continue;
      glob.shaderManager.setUniform("u_pickingColor", new Float32Array(object.pickColorArray.vec));
      object.render(viewMatrix, projectionMatrix);
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    const shadowCastingLights = this.getLights().filter(
      (light) => light instanceof PointLight && light.isEnabled() && light.getIntensity() > 1e-4
      // Only cast shadows for lights that are actually contributing
    );
    const castsShadow = new Array(10).fill(false);
    const lightSpaceMatrices = new Float32Array(10 * 16);
    const hasAmbientLight = this.ambientLight !== null && this.ambientLight.isEnabled();
    const indexOffset = hasAmbientLight ? 1 : 0;
    for (let i = 0; i < shadowCastingLights.length; i++) {
      const light = shadowCastingLights[i];
      const lightIndex = i + indexOffset;
      const shadowMap = light.getShadowMap();
      shadowMap.bind(glob.ctx);
      shadowMap.bindDepthTexture(glob.ctx, 0);
      glob.shaderManager.useProgram("shadow");
      const lightSpaceMatrix = light.getLightSpaceMatrix();
      glob.shaderManager.setUniform("u_lightSpaceMatrix", lightSpaceMatrix.mat4);
      glob.ctx.enable(glob.ctx.DEPTH_TEST);
      glob.ctx.depthFunc(glob.ctx.LESS);
      glob.ctx.depthMask(true);
      glob.ctx.clearDepth(1);
      glob.ctx.clear(glob.ctx.DEPTH_BUFFER_BIT);
      lightSpaceMatrix.mat4.forEach((value, index) => {
        lightSpaceMatrices[lightIndex * 16 + index] = value;
      });
      castsShadow[lightIndex] = true;
      for (const object of this.objects) {
        if (!object.vao)
          continue;
        glob.shaderManager.setUniform("u_modelMatrix", object.transform.getWorldMatrix().mat4);
        object.vao.bind();
        if (object.indexBuffer) {
          glob.ctx.drawElements(glob.ctx.TRIANGLES, object.indexBuffer.getCount(), glob.ctx.UNSIGNED_SHORT, 0);
        } else {
          glob.ctx.drawArrays(glob.ctx.TRIANGLES, 0, object.drawCount);
        }
      }
      shadowMap.unbind(glob.ctx);
    }
    glob.ctx.bindFramebuffer(glob.ctx.FRAMEBUFFER, null);
    glob.ctx.viewport(0, 0, glob.ctx.canvas.width, glob.ctx.canvas.height);
    glob.ctx.clearColor(...this.clearColor);
    glob.ctx.clear(glob.ctx.COLOR_BUFFER_BIT | glob.ctx.DEPTH_BUFFER_BIT);
    glob.ctx.enable(glob.ctx.DEPTH_TEST);
    glob.ctx.depthFunc(glob.ctx.LESS);
    glob.ctx.enable(glob.ctx.BLEND);
    glob.ctx.blendFunc(glob.ctx.SRC_ALPHA, glob.ctx.ONE_MINUS_SRC_ALPHA);
    glob.shaderManager.useProgram("pbr");
    this.lightManager.updateShaderUniforms();
    glob.shaderManager.setUniform("u_lightSpaceMatrices", lightSpaceMatrices);
    glob.shaderManager.setUniform("u_castsShadow", castsShadow);
    shadowCastingLights.forEach((light, i) => {
      if (light instanceof PointLight) {
        const lightIndex = i + indexOffset;
        const shadowMap = light.getShadowMap();
        shadowMap.bindDepthTexture(glob.ctx, lightIndex + 5);
        if (lightIndex < 4) {
          glob.shaderManager.setUniform("u_shadowMap".concat(lightIndex), lightIndex + 5);
          const lightSpaceMatrix = light.getLightSpaceMatrix();
          for (let j = 0; j < 16; j++) {
            lightSpaceMatrices[lightIndex * 16 + j] = lightSpaceMatrix.mat4[j];
          }
          castsShadow[lightIndex] = true;
        }
      }
    });
    glob.shaderManager.setUniform("u_lightSpaceMatrices", lightSpaceMatrices);
    glob.shaderManager.setUniform("u_castsShadow", castsShadow);
    for (const object of this.objects) {
      object.render(viewMatrix, projectionMatrix);
    }
    this.frameCount++;
  }
  dispose() {
    var _a;
    for (const object of this.objects) {
      object.vao.dispose();
      (_a = object.indexBuffer) == null ? void 0 : _a.dispose();
    }
    this.objects = [];
  }
  tick(obj) {
  }
  afterTick(obj) {
    this.render();
  }
  resize() {
    this.camera.updateProjectionMatrix();
    const gl = glob.ctx;
    gl.bindTexture(gl.TEXTURE_2D, this.pickingTexture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.canvas.width,
      gl.canvas.height,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      null
    );
    gl.bindRenderbuffer(gl.RENDERBUFFER, this.pickingDepthBuffer);
    gl.renderbufferStorage(
      gl.RENDERBUFFER,
      gl.DEPTH_COMPONENT16,
      gl.canvas.width,
      gl.canvas.height
    );
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
  }
  getActualColor(vector2, range = 1) {
    const gl = glob.ctx;
    const pixelData = new Uint8Array(4);
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.pickingFramebuffer);
    const rect = gl.canvas.getBoundingClientRect();
    const x = Math.round(vector2.x - rect.left);
    const y = Math.round(gl.canvas.height - (vector2.y - rect.top));
    gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixelData);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    let color = v3(
      pixelData[0],
      pixelData[1],
      pixelData[2]
    );
    if (range === 1) {
      color = color.scale(1 / 255);
    }
    return color;
  }
  getColor(vector2) {
    const color = this.getActualColor(vector2);
    if (color.equals(v3(0, 0, 0)) || color.equals(v3(1, 1, 1)))
      return void 0;
    for (const object of this.objects) {
      if (object.colorMatch(color)) {
        return object;
      }
    }
    return void 0;
  }
  addLight(light) {
    if (light instanceof AmbientLight) {
      console.warn("Use setAmbientLight() to set the ambient light instead of addLight()");
      return;
    }
    this.lightManager.addLight(light);
  }
  removeLight(light) {
    if (light instanceof AmbientLight) {
      console.warn("Cannot remove ambient light. Use setAmbientLight() to modify it instead");
      return;
    }
    this.lightManager.removeLight(light);
  }
  // Add method to toggle color picking visualization
  toggleColorPicking() {
    this.showColorPicking = !this.showColorPicking;
  }
};

// ts/classes/webgl2/camera.ts
var Camera = class {
  constructor({ position = v3(0, 0, 5), target = v3(0, 0, 0), fov = 45, near = 0.1, far = 1e3 } = {}) {
    this.position = position;
    this.target = target;
    this.fov = fov;
    this.near = near;
    this.far = far;
    this.updateViewMatrix();
    this.updateProjectionMatrix();
  }
  updateViewMatrix() {
    this.viewMatrix = Matrix4.lookAt(this.position, this.target);
  }
  updateProjectionMatrix() {
    this.projectionMatrix = m4().perspective(
      this.fov * Math.PI / 180,
      this.near,
      this.far
    );
  }
  setPosition(position) {
    this.position = position;
    this.updateViewMatrix();
  }
  setTarget(target) {
    this.target = target;
    this.updateViewMatrix();
  }
  setFov(fov) {
    this.fov = fov;
    this.updateProjectionMatrix();
  }
  getViewMatrix() {
    return this.viewMatrix;
  }
  getProjectionMatrix() {
    return this.projectionMatrix;
  }
  getPosition() {
    return this.position;
  }
  getTarget() {
    return this.target;
  }
};

// ts/classes/webgl2/meshes/plane.ts
var Plane = class extends BaseMesh {
  static generateIndices(flipNormal) {
    return new Uint16Array(
      flipNormal ? [0, 1, 2, 2, 3, 0] : [0, 2, 1, 0, 3, 2]
      // counter-clockwise winding for top visibility
    );
  }
  static generateNormals(flipNormal) {
    const normalY = flipNormal ? -1 : 1;
    return new Float32Array([
      0,
      normalY,
      0,
      0,
      normalY,
      0,
      0,
      normalY,
      0,
      0,
      normalY,
      0
    ]);
  }
  // Generate tangents for normal mapping
  static generateTangents() {
    return new Float32Array([
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0
    ]);
  }
  // Generate bitangents for normal mapping
  static generateBitangents(flipNormal) {
    const bitangentZ = flipNormal ? -1 : 1;
    return new Float32Array([
      0,
      0,
      bitangentZ,
      0,
      0,
      bitangentZ,
      0,
      0,
      bitangentZ,
      0,
      0,
      bitangentZ
    ]);
  }
  static generateColors(material) {
    const defaultColor = vec3_exports.fromValues(0.8, 0.8, 0.8);
    const color = material ? material.baseColor.vec : defaultColor;
    return new Float32Array([
      color[0],
      color[1],
      color[2],
      color[0],
      color[1],
      color[2],
      color[0],
      color[1],
      color[2],
      color[0],
      color[1],
      color[2]
    ]);
  }
  static createMeshData(props = {}) {
    const flipNormal = props.flipNormal || false;
    return {
      vertices: this.vertices,
      indices: this.generateIndices(flipNormal),
      normals: this.generateNormals(flipNormal),
      texCoords: this.texCoords,
      colors: this.generateColors(props.material),
      tangents: this.generateTangents(),
      bitangents: this.generateBitangents(flipNormal)
    };
  }
  static create(props = {}) {
    var _a, _b, _c, _d;
    if (!props.material && !props.texture) {
      props.material = new Material();
    }
    const meshData = this.createMeshData(props);
    const sceneObject = this.createSceneObject(meshData, __spreadProps(__spreadValues({}, props), { scale: v3((_b = (_a = props.scale) == null ? void 0 : _a.x) != null ? _b : 1, 1, (_d = (_c = props.scale) == null ? void 0 : _c.y) != null ? _d : 1) }));
    return sceneObject;
  }
};
Plane.vertices = new Float32Array([
  // Single face (square)
  -0.5,
  0,
  -0.5,
  // bottom-left
  0.5,
  0,
  -0.5,
  // bottom-right
  0.5,
  0,
  0.5,
  // top-right
  -0.5,
  0,
  0.5
  // top-left
]);
Plane.texCoords = new Float32Array([
  0,
  0,
  1,
  0,
  1,
  1,
  0,
  1
]);

// ts/classes/webgl2/meshes/cube.ts
var Cube = class extends BaseMesh {
  static generateColors(colors) {
    const defaultColors = [
      [0.8, 0.2, 0.2],
      // Front face (red)
      [1, 1, 0],
      // Back face (yellow)
      [0.2, 0.8, 0.2],
      // Right face (green)
      [0.8, 0.2, 0.8],
      // Left face (purple)
      [0.2, 0.2, 0.8],
      // Top face (blue)
      [1, 0.5, 0]
      // Bottom face (orange)
    ];
    let faceColors;
    if (!colors) {
      faceColors = defaultColors;
    } else if (Array.isArray(colors[0])) {
      faceColors = colors;
      if (faceColors.length !== 6) {
        throw new Error("Must provide exactly 6 colors for faces or a single color");
      }
    } else {
      const singleColor = colors;
      faceColors = Array(6).fill(singleColor);
    }
    const colorArray = [];
    faceColors.forEach((color) => {
      for (let i = 0; i < 4; i++) {
        colorArray.push(...color);
      }
    });
    return new Float32Array(colorArray);
  }
  static generateTangents() {
    const tangents = [
      // Front face: tangent along x-axis
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      // Back face: tangent along negative x-axis
      -1,
      0,
      0,
      -1,
      0,
      0,
      -1,
      0,
      0,
      -1,
      0,
      0,
      // Right face: tangent along negative z-axis
      0,
      0,
      -1,
      0,
      0,
      -1,
      0,
      0,
      -1,
      0,
      0,
      -1,
      // Left face: tangent along z-axis
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      // Top face: tangent along x-axis
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      // Bottom face: tangent along x-axis
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0
    ];
    return new Float32Array(tangents);
  }
  static generateBitangents() {
    const bitangents = [
      // Front face: bitangent along y-axis
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      // Back face: bitangent along y-axis
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      // Right face: bitangent along y-axis
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      // Left face: bitangent along y-axis
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      // Top face: bitangent along z-axis (negative)
      0,
      0,
      -1,
      0,
      0,
      -1,
      0,
      0,
      -1,
      0,
      0,
      -1,
      // Bottom face: bitangent along z-axis
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1
    ];
    return new Float32Array(bitangents);
  }
  static createMeshData(props = {}) {
    let meshColors = props.colors;
    if (props.material && !meshColors) {
      const { baseColor } = props.material;
      meshColors = [baseColor.x, baseColor.y, baseColor.z];
    }
    return {
      vertices: this.vertices,
      indices: this.indices,
      normals: this.normals,
      texCoords: this.texCoords,
      colors: this.generateColors(meshColors),
      tangents: this.generateTangents(),
      bitangents: this.generateBitangents()
    };
  }
  static create(props = {}) {
    if (!props.material && props.colors) {
      let baseColor;
      if (Array.isArray(props.colors[0])) {
        const firstColor = props.colors[0];
        baseColor = v3(firstColor[0], firstColor[1], firstColor[2]);
      } else {
        const singleColor = props.colors;
        baseColor = v3(singleColor[0], singleColor[1], singleColor[2]);
      }
      props = __spreadProps(__spreadValues({}, props), {
        material: new Material({
          baseColor,
          roughness: 0.5,
          metallic: 0,
          ambientOcclusion: 1,
          emissive: v3(0, 0, 0)
        })
      });
    }
    const meshData = this.createMeshData(props);
    const sceneObject = this.createSceneObject(meshData, props);
    return sceneObject;
  }
};
Cube.vertices = new Float32Array([
  // Front face
  -0.5,
  -0.5,
  0.5,
  // 0
  0.5,
  -0.5,
  0.5,
  // 1
  0.5,
  0.5,
  0.5,
  // 2
  -0.5,
  0.5,
  0.5,
  // 3
  // Back face
  -0.5,
  -0.5,
  -0.5,
  // 4
  0.5,
  -0.5,
  -0.5,
  // 5
  0.5,
  0.5,
  -0.5,
  // 6
  -0.5,
  0.5,
  -0.5,
  // 7
  // Right face
  0.5,
  -0.5,
  0.5,
  // 8 (1)
  0.5,
  -0.5,
  -0.5,
  // 9 (5)
  0.5,
  0.5,
  -0.5,
  // 10 (6)
  0.5,
  0.5,
  0.5,
  // 11 (2)
  // Left face
  -0.5,
  -0.5,
  -0.5,
  // 12 (4)
  -0.5,
  -0.5,
  0.5,
  // 13 (0)
  -0.5,
  0.5,
  0.5,
  // 14 (3)
  -0.5,
  0.5,
  -0.5,
  // 15 (7)
  // Top face
  -0.5,
  0.5,
  0.5,
  // 16 (3)
  0.5,
  0.5,
  0.5,
  // 17 (2)
  0.5,
  0.5,
  -0.5,
  // 18 (6)
  -0.5,
  0.5,
  -0.5,
  // 19 (7)
  // Bottom face
  -0.5,
  -0.5,
  -0.5,
  // 20 (4)
  0.5,
  -0.5,
  -0.5,
  // 21 (5)
  0.5,
  -0.5,
  0.5,
  // 22 (1)
  -0.5,
  -0.5,
  0.5
  // 23 (0)
]);
Cube.indices = new Uint16Array([
  // Front
  0,
  1,
  2,
  2,
  3,
  0,
  // Back (reversed order)
  4,
  6,
  5,
  6,
  4,
  7,
  // Right
  8,
  9,
  10,
  10,
  11,
  8,
  // Left
  12,
  13,
  14,
  14,
  15,
  12,
  // Top
  16,
  17,
  18,
  18,
  19,
  16,
  // Bottom
  20,
  21,
  22,
  22,
  23,
  20
]);
Cube.normals = new Float32Array([
  // Front face
  0,
  0,
  1,
  0,
  0,
  1,
  0,
  0,
  1,
  0,
  0,
  1,
  // Back face
  0,
  0,
  -1,
  0,
  0,
  -1,
  0,
  0,
  -1,
  0,
  0,
  -1,
  // Right face
  1,
  0,
  0,
  1,
  0,
  0,
  1,
  0,
  0,
  1,
  0,
  0,
  // Left face
  -1,
  0,
  0,
  -1,
  0,
  0,
  -1,
  0,
  0,
  -1,
  0,
  0,
  // Top face
  0,
  1,
  0,
  0,
  1,
  0,
  0,
  1,
  0,
  0,
  1,
  0,
  // Bottom face
  0,
  -1,
  0,
  0,
  -1,
  0,
  0,
  -1,
  0,
  0,
  -1,
  0
]);
Cube.texCoords = new Float32Array([
  // Front
  0,
  0,
  1,
  0,
  1,
  1,
  0,
  1,
  // Back
  1,
  0,
  0,
  0,
  0,
  1,
  1,
  1,
  // Right
  0,
  0,
  1,
  0,
  1,
  1,
  0,
  1,
  // Left
  1,
  0,
  0,
  0,
  0,
  1,
  1,
  1,
  // Top
  0,
  0,
  1,
  0,
  1,
  1,
  0,
  1,
  // Bottom
  1,
  0,
  0,
  0,
  0,
  1,
  1,
  1
]);

// ts/classes/webgl2/meshes/wedge.ts
var Wedge = class extends BaseMesh {
  static generateMeshData(colors) {
    const vertices = [];
    const indices = [];
    const normals = [];
    const generatedColors = [];
    const texCoords = [];
    const tangents = [];
    const bitangents = [];
    const defaultColors = [
      [1, 0, 0],
      // Front triangle - Red
      [0, 1, 0],
      // Back triangle - Green
      [0, 0, 1],
      // Bottom rectangle - Blue
      [1, 0, 1],
      // Left rectangle - Magenta
      [1, 1, 0]
      // Hypotenuse rectangle - Yellow
    ];
    let faceColors = defaultColors;
    if (colors) {
      if (Array.isArray(colors[0])) {
        faceColors = colors;
        if (faceColors.length !== 5) {
          throw new Error("Must provide exactly 5 colors for faces or a single color");
        }
      } else {
        const singleColor = colors;
        faceColors = Array(5).fill(singleColor);
      }
    }
    vertices.push(
      // Front triangle
      -0.5,
      -0.5,
      0.5,
      // 0
      0.5,
      -0.5,
      0.5,
      // 1
      -0.5,
      0.5,
      0.5,
      // 2
      // Back triangle
      -0.5,
      -0.5,
      -0.5,
      // 3
      0.5,
      -0.5,
      -0.5,
      // 4
      -0.5,
      0.5,
      -0.5,
      // 5
      // Bottom rectangle
      -0.5,
      -0.5,
      0.5,
      // 6
      0.5,
      -0.5,
      0.5,
      // 7
      -0.5,
      -0.5,
      -0.5,
      // 8
      0.5,
      -0.5,
      -0.5,
      // 9
      // Left rectangle (vertical face)
      -0.5,
      -0.5,
      -0.5,
      // 10
      -0.5,
      0.5,
      -0.5,
      // 11
      -0.5,
      -0.5,
      0.5,
      // 12
      -0.5,
      0.5,
      0.5,
      // 13
      // Hypotenuse rectangle (sloped face)
      0.5,
      -0.5,
      -0.5,
      // 14
      0.5,
      -0.5,
      0.5,
      // 15
      -0.5,
      0.5,
      -0.5,
      // 16
      -0.5,
      0.5,
      0.5
      // 17
    );
    const frontNormal = [0, 0, 1];
    const backNormal = [0, 0, -1];
    const bottomNormal = [0, -1, 0];
    const leftNormal = [-1, 0, 0];
    const hypotenuseNormal = [0.7071, 0.7071, 0];
    const frontTangent = [1, 0, 0];
    const backTangent = [-1, 0, 0];
    const bottomTangent = [1, 0, 0];
    const leftTangent = [0, 0, 1];
    const hypotenuseTangent = [0.7071, -0.7071, 0];
    const frontBitangent = [0, 1, 0];
    const backBitangent = [0, 1, 0];
    const bottomBitangent = [0, 0, -1];
    const leftBitangent = [0, 1, 0];
    const hypotenuseBitangent = [0, 0, -1];
    for (let i = 0; i < 3; i++)
      normals.push(...frontNormal);
    for (let i = 0; i < 3; i++)
      normals.push(...backNormal);
    for (let i = 0; i < 4; i++)
      normals.push(...bottomNormal);
    for (let i = 0; i < 4; i++)
      normals.push(...leftNormal);
    for (let i = 0; i < 4; i++)
      normals.push(...hypotenuseNormal);
    for (let i = 0; i < 3; i++)
      tangents.push(...frontTangent);
    for (let i = 0; i < 3; i++)
      tangents.push(...backTangent);
    for (let i = 0; i < 4; i++)
      tangents.push(...bottomTangent);
    for (let i = 0; i < 4; i++)
      tangents.push(...leftTangent);
    for (let i = 0; i < 4; i++)
      tangents.push(...hypotenuseTangent);
    for (let i = 0; i < 3; i++)
      bitangents.push(...frontBitangent);
    for (let i = 0; i < 3; i++)
      bitangents.push(...backBitangent);
    for (let i = 0; i < 4; i++)
      bitangents.push(...bottomBitangent);
    for (let i = 0; i < 4; i++)
      bitangents.push(...leftBitangent);
    for (let i = 0; i < 4; i++)
      bitangents.push(...hypotenuseBitangent);
    for (let i = 0; i < 3; i++)
      generatedColors.push(...faceColors[0]);
    for (let i = 0; i < 3; i++)
      generatedColors.push(...faceColors[1]);
    for (let i = 0; i < 4; i++)
      generatedColors.push(...faceColors[2]);
    for (let i = 0; i < 4; i++)
      generatedColors.push(...faceColors[3]);
    for (let i = 0; i < 4; i++)
      generatedColors.push(...faceColors[4]);
    texCoords.push(
      // Front triangle
      0,
      0,
      1,
      0,
      0,
      1,
      // Back triangle
      0,
      0,
      1,
      0,
      0,
      1,
      // Bottom rectangle
      0,
      0,
      1,
      0,
      0,
      1,
      1,
      1,
      // Left rectangle
      0,
      0,
      1,
      0,
      0,
      1,
      1,
      1,
      // Hypotenuse rectangle
      0,
      0,
      1,
      0,
      0,
      1,
      1,
      1
    );
    indices.push(
      // Front triangle
      0,
      1,
      2,
      // Back triangle (reverse winding for back face)
      3,
      5,
      4,
      // Bottom rectangle
      6,
      8,
      7,
      7,
      8,
      9,
      // Left rectangle (CCW when looking from left side)
      10,
      12,
      11,
      12,
      13,
      11,
      // Hypotenuse rectangle
      14,
      16,
      15,
      15,
      16,
      17
    );
    return {
      vertices: new Float32Array(vertices),
      indices: new Uint16Array(indices),
      normals: new Float32Array(normals),
      colors: new Float32Array(generatedColors),
      texCoords: new Float32Array(texCoords),
      tangents: new Float32Array(tangents),
      bitangents: new Float32Array(bitangents)
    };
  }
  static create(props = {}) {
    if (!props.material && props.colors) {
      let baseColor;
      if (Array.isArray(props.colors[0])) {
        const firstColor = props.colors[0];
        baseColor = v3(firstColor[0], firstColor[1], firstColor[2]);
      } else {
        const singleColor = props.colors;
        baseColor = v3(singleColor[0], singleColor[1], singleColor[2]);
      }
      props = __spreadProps(__spreadValues({}, props), {
        material: new Material({
          baseColor,
          roughness: 0.5,
          metallic: 0,
          ambientOcclusion: 1,
          emissive: v3(0, 0, 0)
        })
      });
    }
    let meshColors = props.colors;
    if (props.material && !meshColors) {
      const { baseColor } = props.material;
      meshColors = [baseColor.x, baseColor.y, baseColor.z];
    }
    const meshData = this.generateMeshData(meshColors);
    const sceneObject = this.createSceneObject(meshData, props);
    return sceneObject;
  }
};

// ts/classes/testLevel.ts
var TestLevel = class extends Scene {
  constructor() {
    super(new Camera({ position: v3(0, 1, 6), target: v3(0, 0, 0), fov: 50 }), {
      ambientLightColor: v3(1, 1, 1),
      ambientLightIntensity: 1e-3
      // Increased to illuminate shadowed areas better
    });
    this.clearColor = [0.01, 0.01, 0.01, 1];
    const rotation = new Quaternion();
    rotation.setAxisAngle(v3(1, 0, 0), 0);
    this.keyLight = new DirectionalLight({
      direction: v3(-0.5, -1, -0.3).normalize(),
      color: v3(1, 0.98, 0.9),
      // Slightly warm white
      intensity: 0.51,
      // Reduced from 1.2,
      enabled: true
    });
    this.addLight(this.keyLight);
    this.spotLight4 = new SpotLight({
      position: v3(0, 5, 0),
      color: v3(1, 1, 1),
      // Pure white
      intensity: 4,
      // Moderate intensity
      cutOff: 0.9,
      outerCutOff: 0.85,
      meshContainer: this
    });
    this.spotLight4.lookAt(v3(0, 0, 0));
    this.addLight(this.spotLight4);
    this.add(this.floorPlane = Plane.create({
      position: v3(0, -2, 0),
      scale: v2(10, 10),
      pickColor: 90,
      material: Material.library("rough", v3(0.7, 0.7, 0.73))
    }));
    this.add(Plane.create({
      position: v3(0, 0.5, -4),
      scale: v2(5, 10),
      rotation: Quaternion.fromEuler(-Math.PI / 2, 0, Math.PI / 2),
      pickColor: 80,
      material: Material.library("rough", v3(0.7, 0.7, 0.73))
    }));
    this.add(this.frontWall = Plane.create({
      position: v3(0, 0.5, 4),
      flipNormal: true,
      scale: v2(5, 10),
      rotation: Quaternion.fromEuler(-Math.PI / 2, 0, Math.PI / 2)
    }));
    this.add(this.mesh = IcoSphere.create({
      position: v3(0, 0, -2.5),
      scale: v3(2.5, 2.5, 2.5),
      smoothShading: false,
      subdivisions: 2,
      material: Material.library("metal", v3(0.95, 0.6, 0.95))
    }));
    this.add(this.static = new ContainerObject({
      position: v3(1, 2, -1)
    }));
    for (let i = 0; i < 2; i++) {
      const container = new ContainerObject({
        position: v3(4.5 * i, 0, -4 * i),
        rotation: Quaternion.fromEuler(0, Math.PI * i, 0)
      });
      const positions = [
        v3(-2 + 5.5 * i, -1.25, -2 - 1),
        v3(-3.5 + 5.5 * i, -1.25, -2 - 1),
        v3(-2.75 + 5.5 * i, -1.25, -1),
        v3(-2.75 + 5.5 * i, 0.25, -1.64 - 0.6)
      ].sort(() => Math.random() - 0.5);
      this.add(IcoSphere.create({
        position: positions[0],
        scale: v3(1.5, 1.5, 1.5),
        smoothShading: true,
        subdivisions: 2,
        parent: container,
        material: Material.library("plastic", v3(0.2, 0.7, 0.9))
      }));
      this.add(Cube.create({
        position: positions[1],
        scale: v3(1.5, 1.5, 1.5),
        parent: container,
        material: Material.library("metal", v3(0.85, 0.45, 0.35))
      }));
      this.add(Wedge.create({
        rotation: Quaternion.fromEuler(0, Math.PI / 2, 0),
        position: positions[2],
        scale: v3(1.5, 1.5, 1.5),
        parent: container,
        material: Material.library("plastic", v3(0.15, 0.8, 0.15))
      }));
      this.add(Cone.create({
        position: positions[3],
        scale: v3(2, 1.5, 2),
        rotation: Quaternion.fromEuler(0, Math.PI / 2, 0),
        smoothShading: false,
        sides: 12,
        parent: container,
        material: Material.library("plastic", v3(0.15, 0.8, 0.15))
      }));
      this.add(container);
    }
    this.camera.setPosition(v3(-1, 3, 6));
    this.click(v2(0.5, 0.3));
  }
  click(vector2) {
    super.click(vector2);
    const pos2 = Vector3.screenToWorldPlane(vector2, this.camera, v3(0, 0, 1), 4);
    if (pos2) {
      this.spotLight4.setPosition(pos2);
      this.spotLight4.lookAt(v3(0, 0, 0));
    }
  }
  tick(obj) {
    super.tick(obj);
  }
};

// ts/classes/ticker.ts
var Ticker = class {
  constructor() {
    this._running = false;
    this.started = false;
    this.pauzedTime = 0;
    this.intervalKeeper = [];
    this.callbacks = [];
    this.frameN = 0;
    document.addEventListener("visibilitychange", () => {
      if (this.started) {
        this.running = !document.hidden;
      }
    });
  }
  get running() {
    return this._running;
  }
  set running(value) {
    this._running = value;
    if (value) {
      this.pTime = performance.now() - this.pauzedTime;
      this.id = window.requestAnimationFrame(this.frame.bind(this));
    } else {
      window.cancelAnimationFrame(this.id);
      this.pauzedTime = performance.now() - this.pTime;
    }
  }
  get startTime() {
    return this.sTime;
  }
  get eTime() {
    return performance.now() - this.sTime;
  }
  averagedInterval(count, interval) {
    const average = this.intervalKeeper.slice(0, count).reduce((partialSum, a) => partialSum + a, 0) / count;
    return Math.abs(interval - average) > 10 ? interval : average;
  }
  frame(timeStamp) {
    if (this.running) {
      const interval = timeStamp - this.pTime;
      this.intervalKeeper.push(interval);
      this.intervalKeeper = this.intervalKeeper.slice(0, 20);
      while (this.intervalKeeper.length < 20) {
        this.intervalKeeper.push(this.intervalKeeper[0]);
      }
      this.pTime = timeStamp;
      this.frameN++;
      glob.frame = this.frameN;
      const o = {
        interval,
        total: this.eTime,
        frameRate: 1e3 / interval,
        frame: this.frameN,
        intervalS3: this.averagedInterval(3, interval),
        intervalS10: this.averagedInterval(5, interval),
        intervalS20: this.averagedInterval(20, interval)
      };
      this.callbacks.forEach((c) => {
        c(o);
      });
      this.id = window.requestAnimationFrame(this.frame.bind(this));
    }
  }
  start() {
    this.started = true;
    this._running = true;
    this.sTime = performance.now();
    this.pTime = performance.now();
    this.id = window.requestAnimationFrame(this.frame.bind(this));
  }
  add(callback) {
    this.callbacks.push(callback);
  }
};

// ts/classes/util/loader.ts
var Loader = class extends DomElement {
  constructor() {
    super("div", {
      position: new Vector2(5, 5),
      size: new Vector2(600, 70),
      background: "#272727"
    });
    this.bar = new DomElement("div", {
      size: new Vector2(600, 70),
      background: "#80808070"
    });
    this.dom.appendChild(this.bar.dom);
    this.text = new DomText({
      text: "",
      fontSize: 35,
      fontWeight: 900,
      color: "white",
      size: new Vector2(600, 70),
      position: new Vector2(30, -10),
      fontFamily: "monospace"
    });
    this.dom.appendChild(this.text.dom);
  }
  update(value, total) {
    this.text.text = "loaded ".concat(total - value, " out of ").concat(total, " assets");
    this.bar.width = 600 * (total - value) / total;
  }
};

// ts/game.ts
var glob = new class {
  constructor() {
    this.device = new InputDevices();
    this.frame = 0;
    this.events = {};
  }
  get renderer() {
    return this.game.renderer;
  }
  get shaderManager() {
    return this.renderer.shaderManager;
  }
  get mobile() {
    return this.device.mobile;
  }
  get ctx() {
    return this.renderer.ctx;
  }
}();
var Game = class {
  constructor() {
    this.readyToStart = false;
    this._waitCount = 0;
    this.started = false;
    this.total = 0;
    this.levels = {};
    this.padManager = new PadManager();
    glob.game = this;
    this.init();
    glob.device.ready();
  }
  get t() {
    return this.renderer.tickerData;
  }
  get waitCount() {
    return this._waitCount;
  }
  set waitCount(value) {
    if (value > this._waitCount) {
      this.total++;
    }
    if (!this.started) {
      if (value === 0 && this.readyToStart) {
        this.start();
      } else {
        this.loader.update(value, this.total);
      }
    }
    this._waitCount = value;
  }
  init() {
    this.renderer = new Renderer();
    this.loader = new Loader();
    this.renderer.addChild(this.loader);
    this.ticker = new Ticker();
    this.ticker.add(this.tick.bind(this));
    this.test2d = document.createElement("div");
    this.test2d.style.cssText = "\n            position: absolute;\n            top: 0;\n            left: 0;\n            width: 100px;\n            background-color: #ff0000cc;\n            margin-left: -50px;\n            text-align: center;\n            font-size: 20px;\n            color: white;\n            z-index: 9;\n            pointer-events: none;\n        ";
    document.body.appendChild(this.test2d);
    this.addLevel("test", new TestLevel());
    if (this.waitCount === 0) {
      this.start();
    } else {
      this.readyToStart = true;
    }
  }
  tick(obj) {
    this.renderer.tick(obj);
  }
  addLevel(s, level) {
    this.levels[s] = level;
    this.active = level;
  }
  get level() {
    return this.active;
  }
  start() {
    this.started = true;
    this.loader.visible = false;
    this.ticker.start();
  }
};

// ts/index.ts
document.addEventListener("DOMContentLoaded", async () => {
  const g = new Game();
  document.body.appendChild(g.renderer.dom);
});
//# sourceMappingURL=index.js.map
