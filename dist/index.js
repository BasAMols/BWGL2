var __defProp = Object.defineProperty;
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

// ts/classes/webgl2/initialise.ts
var WebGL2Initializer = class {
  constructor(canvas) {
    this.gl = null;
    if (!canvas) {
      throw new Error("Canvas not found");
    }
    this.canvas = canvas;
    this.initializeWebGL2();
  }
  initializeWebGL2() {
    try {
      this.gl = this.canvas.getContext("webgl2");
      if (!this.gl) {
        throw new Error("WebGL2 not supported");
      }
      this.gl.enable(this.gl.DEPTH_TEST);
      this.gl.enable(this.gl.CULL_FACE);
      this.gl.cullFace(this.gl.BACK);
      this.gl.frontFace(this.gl.CCW);
      this.gl.clearColor(0, 0, 0, 1);
    } catch (error) {
      console.error("Failed to initialize WebGL2:", error);
      throw error;
    }
  }
  getContext() {
    if (!this.gl) {
      throw new Error("WebGL2 context not initialized");
    }
    return this.gl;
  }
  getCanvas() {
    return this.canvas;
  }
  resizeCanvas(width, height) {
    var _a;
    (_a = this.gl) == null ? void 0 : _a.viewport(0, 0, width, height);
  }
  clear() {
    var _a;
    (_a = this.gl) == null ? void 0 : _a.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
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

// ts/classes/webgl2/camera.ts
var Camera = class {
  constructor(position = vec3_exports.fromValues(0, 0, 5), target = vec3_exports.fromValues(0, 0, 0), up = vec3_exports.fromValues(0, 1, 0), fov = 45, aspect = 1, near = 0.1, far = 1e3) {
    this.position = position;
    this.target = target;
    this.up = up;
    this.fov = fov;
    this.aspect = aspect;
    this.near = near;
    this.far = far;
    this.viewMatrix = mat4_exports.create();
    this.projectionMatrix = mat4_exports.create();
    this.updateViewMatrix();
    this.updateProjectionMatrix();
  }
  updateViewMatrix() {
    mat4_exports.lookAt(this.viewMatrix, this.position, this.target, this.up);
  }
  updateProjectionMatrix() {
    mat4_exports.perspective(
      this.projectionMatrix,
      this.fov * Math.PI / 180,
      this.aspect,
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
  setUp(up) {
    this.up = up;
    this.updateViewMatrix();
  }
  setAspect(aspect) {
    this.aspect = aspect;
    this.updateProjectionMatrix();
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
  getUp() {
    return this.up;
  }
};

// ts/classes/webgl2/scene.ts
var Scene = class {
  constructor(gl, camera) {
    this.objects = [];
    this.clearColor = [0, 0, 0, 1];
    this.gl = gl;
    this.camera = camera || new Camera();
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
  setCamera(camera) {
    this.camera = camera;
  }
  getCamera() {
    return this.camera;
  }
  setClearColor(r, g, b, a = 1) {
    this.clearColor = [r, g, b, a];
    this.gl.clearColor(r, g, b, a);
  }
  render() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    const viewMatrix = this.camera.getViewMatrix();
    const projectionMatrix = this.camera.getProjectionMatrix();
    for (const object of this.objects) {
      object.shaderManager.setUniform("uModelMatrix", object.modelMatrix);
      object.shaderManager.setUniform("uViewMatrix", viewMatrix);
      object.shaderManager.setUniform("uProjectionMatrix", projectionMatrix);
      object.vao.bind();
      if (object.indexBuffer) {
        this.gl.drawElements(
          object.drawMode,
          object.drawCount,
          object.drawType || this.gl.UNSIGNED_SHORT,
          0
        );
      } else {
        this.gl.drawArrays(
          object.drawMode,
          0,
          object.drawCount
        );
      }
      object.vao.unbind();
    }
  }
  dispose() {
    var _a;
    for (const object of this.objects) {
      object.vao.dispose();
      (_a = object.indexBuffer) == null ? void 0 : _a.dispose();
    }
    this.objects = [];
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
      uniformMap.set(info.name, {
        type: this.getUniformTypeName(info.type),
        value: this.getDefaultValueForType(info.type),
        location
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
      throw new Error("Uniform '".concat(name, "' not found in program '").concat(this.currentProgram, "'"));
    }
    this.setUniformValue(uniform.type, uniform.location, value);
    uniform.value = value;
  }
  setUniformValue(type, location, value) {
    switch (type) {
      case "float":
        this.gl.uniform1f(location, value);
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
      case "int":
      case "bool":
        this.gl.uniform1i(location, value);
        break;
      case "sampler2D":
        this.gl.uniform1i(location, value);
        break;
      default:
        throw new Error("Unsupported uniform type: ".concat(type));
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
      throw new Error("Attribute '".concat(name, "' not found in program '").concat(this.currentProgram, "'"));
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
      case this.gl.INT:
        return "int";
      case this.gl.BOOL:
        return "bool";
      case this.gl.SAMPLER_2D:
        return "sampler2D";
      default:
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

// ts/classes/meshes/cube.ts
var Cube = class {
  static createMeshData() {
    return {
      vertices: this.vertices,
      indices: this.indices,
      normals: this.normals,
      texCoords: this.texCoords,
      colors: this.colors
    };
  }
  static createSceneObject(gl, shaderManager, position = vec3_exports.fromValues(0, 0, 0), scale3 = vec3_exports.fromValues(1, 1, 1), rotation = vec3_exports.fromValues(0, 0, 0)) {
    const meshData = this.createMeshData();
    const vao = new VertexArray(gl);
    vao.bind();
    const vertexBuffer = new VertexBuffer(gl);
    vertexBuffer.setData(meshData.vertices);
    vao.setAttributePointer(
      shaderManager.getAttributeLocation("aPosition"),
      3,
      gl.FLOAT,
      false,
      0,
      0
    );
    const colorBuffer = new VertexBuffer(gl);
    colorBuffer.setData(meshData.colors);
    vao.setAttributePointer(
      shaderManager.getAttributeLocation("aColor"),
      3,
      gl.FLOAT,
      false,
      0,
      0
    );
    const normalBuffer = new VertexBuffer(gl);
    normalBuffer.setData(meshData.normals);
    vao.setAttributePointer(
      shaderManager.getAttributeLocation("aNormal"),
      3,
      gl.FLOAT,
      false,
      0,
      0
    );
    const texCoordBuffer = new VertexBuffer(gl);
    texCoordBuffer.setData(meshData.texCoords);
    vao.setAttributePointer(
      shaderManager.getAttributeLocation("aTexCoord"),
      2,
      gl.FLOAT,
      false,
      0,
      0
    );
    const indexBuffer = new IndexBuffer(gl);
    indexBuffer.setData(meshData.indices);
    const modelMatrix = mat4_exports.create();
    mat4_exports.translate(modelMatrix, modelMatrix, position);
    mat4_exports.rotateX(modelMatrix, modelMatrix, rotation[0]);
    mat4_exports.rotateY(modelMatrix, modelMatrix, rotation[1]);
    mat4_exports.rotateZ(modelMatrix, modelMatrix, rotation[2]);
    mat4_exports.scale(modelMatrix, modelMatrix, scale3);
    return {
      vao,
      indexBuffer,
      shaderManager,
      modelMatrix,
      drawMode: gl.TRIANGLES,
      drawCount: meshData.indices.length,
      drawType: gl.UNSIGNED_SHORT
    };
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
Cube.colors = new Float32Array([
  // Front face (red)
  0.8,
  0.2,
  0.2,
  0.8,
  0.2,
  0.2,
  0.8,
  0.2,
  0.2,
  0.8,
  0.2,
  0.2,
  // Back face (yellow)
  1,
  1,
  0,
  1,
  1,
  0,
  1,
  1,
  0,
  1,
  1,
  0,
  // Right face (green)
  0.2,
  0.8,
  0.2,
  0.2,
  0.8,
  0.2,
  0.2,
  0.8,
  0.2,
  0.2,
  0.8,
  0.2,
  // Left face (purple)
  0.8,
  0.2,
  0.8,
  0.8,
  0.2,
  0.8,
  0.8,
  0.2,
  0.8,
  0.8,
  0.2,
  0.8,
  // Top face (blue)
  0.2,
  0.2,
  0.8,
  0.2,
  0.2,
  0.8,
  0.2,
  0.2,
  0.8,
  0.2,
  0.2,
  0.8,
  // Bottom face (orange)
  1,
  0.5,
  0,
  1,
  0.5,
  0,
  1,
  0.5,
  0,
  1,
  0.5,
  0
]);
Cube.indices = new Uint16Array([
  // Front
  0,
  1,
  2,
  2,
  3,
  0,
  // Back
  4,
  5,
  6,
  6,
  7,
  4,
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
  1
]);

// ts/classes/webgl2/shaders/fragmentShaderSource.ts
var fragmentShaderSource = "#version 300 es\nprecision highp float;\n\n// Input from vertex shader\nin vec3 vNormal;\nin vec2 vTexCoord;\nin vec3 vFragPos;\nin vec3 vColor;\n\n// Uniforms\nuniform vec3 uLightPos;\nuniform vec3 uViewPos;\nuniform vec3 uLightColor;\nuniform sampler2D uTexture;\nuniform bool uUseTexture;\n\n// Output\nout vec4 fragColor;\n\nvoid main() {\n    // Normalize the normal vector\n    vec3 normal = normalize(vNormal);\n    \n    // Light properties\n    vec3 lightColor = uLightColor;\n    float ambientStrength = 0.1;\n    float specularStrength = 0.5;\n    float shininess = 32.0;\n\n    // Ambient\n    vec3 ambient = ambientStrength * lightColor;\n\n    // Diffuse\n    vec3 lightDir = normalize(uLightPos - vFragPos);\n    float diff = max(dot(normal, lightDir), 0.0);\n    vec3 diffuse = diff * lightColor;\n\n    // Specular\n    vec3 viewDir = normalize(uViewPos - vFragPos);\n    vec3 reflectDir = reflect(-lightDir, normal);\n    float spec = pow(max(dot(viewDir, reflectDir), 0.0), shininess);\n    vec3 specular = specularStrength * spec * lightColor;\n\n    // Combine results\n    vec3 baseColor = uUseTexture ? texture(uTexture, vTexCoord).rgb : vColor;\n    vec3 result = (ambient + diffuse + specular) * baseColor;\n\n    // Output final color\n    fragColor = vec4(result, 1.0);\n}";

// ts/classes/webgl2/shaders/vertexShaderSource.ts
var vertexShaderSource = "#version 300 es\n\n// Attributes\nin vec3 aPosition;\nin vec3 aNormal;\nin vec2 aTexCoord;\nin vec3 aColor;\n\n// Uniforms\nuniform mat4 uModelMatrix;\nuniform mat4 uViewMatrix;\nuniform mat4 uProjectionMatrix;\n\n// Varyings (output to fragment shader)\nout vec3 vNormal;\nout vec2 vTexCoord;\nout vec3 vFragPos;\nout vec3 vColor;\n\nvoid main() {\n    // Calculate world space position\n    vec4 worldPos = uModelMatrix * vec4(aPosition, 1.0);\n    vFragPos = worldPos.xyz;\n    \n    // Transform normal to world space\n    // Note: This assumes uniform scaling. For non-uniform scaling, use the normal matrix\n    vNormal = mat3(uModelMatrix) * aNormal;\n    \n    // Pass texture coordinates and color to fragment shader\n    vTexCoord = aTexCoord;\n    vColor = aColor;\n    \n    // Calculate final position\n    gl_Position = uProjectionMatrix * uViewMatrix * worldPos;\n}";

// ts/classes/elements/renderer.ts
var Renderer = class extends DomElement {
  constructor() {
    super("canvas");
    this.dom.style.position = "absolute";
    this.dom.style.pointerEvents = "all";
    this.dom.style.bottom = "0px";
    this.dom.style.touchAction = "none";
    this.dom.tabIndex = 1;
    this.webgl = new WebGL2Initializer(this.dom);
    this.ctx = this.webgl.getContext();
    this.shaderManager = new ShaderManager(this.ctx);
    this.vao = new VertexArray(this.ctx);
    this.vertexBuffer = new VertexBuffer(this.ctx);
    this.indexBuffer = new IndexBuffer(this.ctx);
    const position = vec3_exports.fromValues(3, 2, 3);
    const target = vec3_exports.fromValues(0, 0, 0);
    const up = vec3_exports.fromValues(0, 1, 0);
    this.camera = new Camera(position, target, up, 45);
    this.scene = new Scene(this.ctx);
    this.scene.setCamera(this.camera);
    window.addEventListener("resize", () => {
      this.resize();
    });
    this.addEvent(new Events("resize"));
    this.resize();
    this.init();
  }
  init() {
    this.shaderManager.loadShaderProgram("basic", vertexShaderSource, fragmentShaderSource);
    this.shaderManager.useProgram("basic");
    this.shaderManager.setUniform("uLightPos", new Float32Array([5, 5, 5]));
    this.shaderManager.setUniform("uLightColor", new Float32Array([1, 1, 1]));
    this.shaderManager.setUniform("uUseTexture", 0);
    this.shaderManager.setUniform("uViewPos", new Float32Array([3, 2, 3]));
    const cube = Cube.createSceneObject(
      this.ctx,
      this.shaderManager,
      vec3_exports.fromValues(0, 0, 0),
      // Position at origin
      vec3_exports.fromValues(1, 1, 1),
      // Unit scale
      vec3_exports.fromValues(0.2, 0.5, 0)
      // Rotation in radians
    );
    this.scene.add(cube);
  }
  resize() {
    this.size = v2(document.body.clientWidth, document.body.clientHeight);
    this.dom.style.width = "".concat(this.size.x, "px");
    this.dom.setAttribute("width", String(this.size.x));
    this.dom.style.height = "".concat(this.size.y, "px");
    this.dom.setAttribute("height", String(this.size.y));
    this.getEvent("resize").alert(this.size);
    this.webgl.resizeCanvas(this.width, this.height);
    if (this.camera) {
      this.camera.setAspect(this.width / this.height);
    }
  }
  get width() {
    return Math.round(Number(this.dom.style.width.replace(/\D/g, "")));
  }
  set width(value) {
    this.dom.style.width = "".concat(value, "px");
    this.dom.setAttribute("width", String(value));
  }
  get height() {
    return Math.round(Number(this.dom.style.height.replace(/\D/g, "")));
  }
  set height(value) {
    this.dom.style.height = "".concat(value, "px");
    this.dom.setAttribute("height", String(value));
  }
  addLevel(child) {
    child.build();
  }
  get context() {
    return this._context;
  }
  set context(value) {
    this._context = value;
  }
  tick(obj) {
    var _a;
    super.tick(obj);
    this.tickerData = obj;
    (_a = glob.game.active) == null ? void 0 : _a.tick(obj);
    this.scene.render();
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
      if (glob.game.active) {
        glob.game.active.interface.touchControls.style.display = "none";
      }
      document.body.appendChild(this.overlay.dom);
    }
    this.keyboard.ready();
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
  }
  get renderer() {
    return this.game.renderer;
  }
  get mobile() {
    return this.device.mobile;
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
    this.build();
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
  async build() {
    this.renderer = new Renderer();
    await this.renderer.init();
    this.loader = new Loader();
    this.renderer.addChild(this.loader);
    this.ticker = new Ticker();
    this.ticker.add(this.tick.bind(this));
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
    this.renderer.addLevel(level);
    document.body.appendChild(level.interface.dom);
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
