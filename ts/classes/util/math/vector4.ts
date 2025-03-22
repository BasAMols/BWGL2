import { vec4 } from 'gl-matrix';
import { Vector2, v2 } from './vector2';
import { Vector3, v3 } from './vector3';

export function v4(): Vector4;
export function v4(a?: [number?, number?, number?, number?]): Vector4;
export function v4(a?: number, b?: number, c?: number, d?: number): Vector4;
export function v4(a?: [number?, number?, number?, number?] | number, b?: number, c?: number, d?: number): Vector4 {
	if (typeof a === 'number') {
		return Vector4.f(a, b, c, d);
	} else if (typeof a === 'undefined') {
		return Vector4.f(0);
	} else {
		return Vector4.f(...a);
	}
}

export class Vector4 {
	//x
	public get x(): number { return this.vec[0]; }
	public set x(value: number) { this.vec[0] = value; }

	//y
	public get y(): number { return this.vec[1]; }
	public set y(value: number) { this.vec[1] = value; }

	//zw
	public get z(): number { return this.vec[2]; }
	public set z(value: number) { this.vec[2] = value; }

	//w
	public get w(): number { return this.vec[3]; }
	public set w(value: number) { this.vec[3] = value; }

	//x.
	public get xy() { return v2(this.x, this.y); }
	public set xy(v: Vector2) { this.x = v.x; this.y = v.y; }

	public get xz() { return v2(this.x, this.z); }
	public set xz(v: Vector2) { this.x = v.x; this.z = v.y; }

	public get xw() { return v2(this.x, this.w); }
	public set xw(v: Vector2) { this.x = v.x; this.w = v.y; }

	//y.
	public get yx() { return v2(this.y, this.x); }
	public set yx(v: Vector2) { this.y = v.x; this.x = v.y; }

	public get yz() { return v2(this.y, this.z); }
	public set yz(v: Vector2) { this.y = v.x; this.z = v.y; }

	public get yw() { return v2(this.y, this.w); }
	public set yw(v: Vector2) { this.y = v.x; this.w = v.y; }

	//z.
	public get zx() { return v2(this.z, this.x); }
	public set zx(v: Vector2) { this.z = v.x; this.x = v.y; }

	public get zy() { return v2(this.z, this.y); }
	public set zy(v: Vector2) { this.z = v.x; this.y = v.y; }

	public get zw() { return v2(this.z, this.w); }
	public set zw(v: Vector2) { this.z = v.x; this.w = v.y; }

	//w.
	public get wx() { return v2(this.w, this.x); }
	public set wx(v: Vector2) { this.w = v.x; this.x = v.y; }

	public get wy() { return v2(this.w, this.y); }
	public set wy(v: Vector2) { this.w = v.x; this.y = v.y; }

	public get wz() { return v2(this.w, this.z); }
	public set wz(v: Vector2) { this.w = v.x; this.z = v.y; }

	//xy.
	public get xyz() { return v3(this.x, this.y, this.z); }
	public set xyz(v: Vector3) { this.x = v.x; this.y = v.y, this.z = v.z; }

	public get xyw() { return v3(this.x, this.y, this.w); }
	public set xyw(v: Vector3) { this.x = v.x; this.y = v.y, this.w = v.z; }

	//xz.
	public get xzy() { return v3(this.x, this.z, this.y); }
	public set xzy(v: Vector3) { this.x = v.x; this.z = v.y, this.y = v.z; }

	public get xzw() { return v3(this.x, this.z, this.w); }
	public set xzw(v: Vector3) { this.x = v.x; this.z = v.y, this.w = v.z; }

	//xw.
	public get xwy() { return v3(this.x, this.w, this.y); }
	public set xwy(v: Vector3) { this.x = v.x; this.w = v.y, this.y = v.z; }

	public get xwz() { return v3(this.x, this.w, this.z); }
	public set xwz(v: Vector3) { this.x = v.x; this.w = v.y, this.z = v.z; }

	//yx.
	public get yxz() { return v3(this.y, this.x, this.z); }
	public set yxz(v: Vector3) { this.y = v.x; this.x = v.y, this.z = v.z; }

	public get yxw() { return v3(this.y, this.x, this.w); }
	public set yxw(v: Vector3) { this.y = v.x; this.x = v.y, this.w = v.z; }

	//yz.
	public get yzx() { return v3(this.y, this.z, this.x); }
	public set yzx(v: Vector3) { this.y = v.x; this.z = v.y, this.x = v.z; }

	public get yzw() { return v3(this.y, this.z, this.w); }
	public set yzw(v: Vector3) { this.y = v.x; this.z = v.y, this.w = v.z; }

	//yw.
	public get ywx() { return v3(this.y, this.w, this.x); }
	public set ywx(v: Vector3) { this.y = v.x; this.w = v.y, this.x = v.z; }

	public get ywz() { return v3(this.y, this.w, this.z); }
	public set ywz(v: Vector3) { this.y = v.x; this.w = v.y, this.z = v.z; }

	//zx.
	public get zxy() { return v3(this.z, this.x, this.y); }
	public set zxy(v: Vector3) { this.z = v.x; this.x = v.y, this.y = v.z; }

	public get zxw() { return v3(this.z, this.x, this.w); }
	public set zxw(v: Vector3) { this.z = v.x; this.x = v.y, this.w = v.z; }

	//zy.
	public get zyx() { return v3(this.z, this.y, this.x); }
	public set zyx(v: Vector3) { this.z = v.x; this.y = v.y, this.x = v.z; }

	public get zyw() { return v3(this.z, this.y, this.w); }
	public set zyw(v: Vector3) { this.z = v.x; this.y = v.y, this.w = v.z; }

	//zw.
	public get zwx() { return v3(this.z, this.w, this.x); }
	public set zwx(v: Vector3) { this.z = v.x; this.w = v.y, this.x = v.z; }

	public get zwy() { return v3(this.z, this.w, this.y); }
	public set zwy(v: Vector3) { this.z = v.x; this.w = v.y, this.y = v.z; }

	//wx.
	public get wxy() { return v3(this.w, this.x, this.y); }
	public set wxy(v: Vector3) { this.w = v.x; this.x = v.y, this.y = v.z; }

	public get wxz() { return v3(this.w, this.x, this.z); }
	public set wxz(v: Vector3) { this.w = v.x; this.x = v.y, this.z = v.z; }

	//wy.
	public get wyx() { return v3(this.w, this.y, this.x); }
	public set wyx(v: Vector3) { this.w = v.x; this.y = v.y, this.x = v.z; }

	public get wyz() { return v3(this.w, this.y, this.z); }
	public set wyz(v: Vector3) { this.w = v.x; this.y = v.y, this.z = v.z; }

	//wz.
	public get wzx() { return v3(this.w, this.z, this.x); }
	public set wzx(v: Vector3) { this.w = v.x; this.z = v.y, this.x = v.z; }

	public get wzy() { return v3(this.w, this.z, this.y); }
	public set wzy(v: Vector3) { this.w = v.x; this.z = v.y, this.y = v.z; }


	public vec: vec4;

	constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 0) {
		this.vec = [x, y, z, w];
	}

	static f(x: number = 0, y: number = x, z: number = x, w: number = x) {
		return new Vector4(x, y, z, w);
	}

	get array() {
		return [this.x, this.y, this.z, this.w];
	}

	set array(a: [number, number, number, number]) {
		[this.x, this.y, this.z, this.w] = a;
	}

	forEach(callbackfn: (value: number, index: number, array: number[]) => void): void {
		this.array.forEach(callbackfn);
	};

	get c(): Vector4 {
		return this.clone();
	}

	equals(vector: Vector4): boolean {
		return (
			this.x === vector.x &&
			this.y === vector.y &&
			this.z === vector.z &&
			this.w === vector.w
		);
	}

	clone(): Vector4 {
		return new Vector4(
			this.x,
			this.y,
			this.z,
			this.w,
		);
	}

	add(vector: Vector4) {
		return new Vector4(
			this.x + vector.x,
			this.y + vector.y,
			this.z + vector.z,
			this.w + vector.w,
		);
	}

	// multiply(a: Vector4): Vector4;
	// multiply(a: number, b: number, c: number): Vector4;
	// multiply(a: Vector4 | number, b?: number, c?: number): Vector4 {
	// 	const [x, y, z] = (typeof a === 'number') ? [a, b, c] : a.array;
	// 	return new Vector4(
	// 		this.x * x,
	// 		this.y * y,
	// 		this.z * z,
	// 	);
	// }

	// subtract(vector: Vector4) {
	// 	return new Vector4(
	// 		this.x - vector.x,
	// 		this.y - vector.y,
	// 		this.z - vector.z,
	// 	);
	// }

	// scale(scalar: number) {
	// 	return new Vector4(
	// 		this.x * scalar,
	// 		this.y * scalar,
	// 		this.z * scalar,
	// 	);
	// }

	// divide(vector: Vector4) {
	// 	return new Vector4(
	// 		this.x / vector.x,
	// 		this.y / vector.y,
	// 		this.z / vector.z,
	// 	);
	// }

	// rotateXY(rad: number) {
	// 	const [a, b] = this.xy.rotate(rad).array;

	// 	return new Vector4(
	// 		a,
	// 		this.y,
	// 		b,
	// 	);
	// }
	// rotateXZ(rad: number) {
	// 	const [a, b] = this.xz.rotate(rad).array;

	// 	return new Vector4(
	// 		a,
	// 		b,
	// 		this.z,
	// 	);
	// }
	// rotateYZ(rad: number) {
	// 	const [a, b] = this.yz.rotate(rad).array;

	// 	return new Vector4(
	// 		this.x,
	// 		a,
	// 		b,
	// 	);
	// }

	// magnitude() {
	// 	return Math.sqrt(this.magnitudeSqr());
	// }

	// magnitudeSqr() {
	// 	return (this.x * this.x + this.y * this.y + this.z * this.z);
	// }

	// mod(max: Vector4) {
	// 	return new Vector4(
	// 		this.x % max.x,
	// 		this.y % max.y,
	// 		this.z % max.z,
	// 	);
	// }
	// clamp(min: Vector4, max: Vector4) {
	// 	return new Vector4(
	// 		Util.clamp(this.x, min.x, max.x),
	// 		Util.clamp(this.y, min.y, max.y),
	// 		Util.clamp(this.z, min.z, max.z),
	// 	);
	// }
	// normalize() {
	// 	let len = this.x * this.x + this.y * this.y + this.z * this.z;
	// 	if (len > 0) {
	// 		len = 1 / Math.sqrt(len);
	// 	}
	// 	return v4(
	// 		this.x * len,
	// 		this.y * len,
	// 		this.z * len
	// 	);
	// }
}
