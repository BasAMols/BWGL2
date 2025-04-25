import { vec3 } from 'gl-matrix';
import { Vector2, v2 } from './vector2';
import { Util } from '../utils';
import { Quaternion } from './quaternion';
import { Camera } from '../../webgl2/camera';

export function v3(): Vector3;
export function v3(a?: [number?, number?, number?]): Vector3;
export function v3(a?: number, b?: number, c?: number): Vector3;
export function v3(a?: [number?, number?, number?] | number, b?: number, c?: number): Vector3 {
	if (typeof a === 'number') {
		return Vector3.f(a, b, c);
	} else if (typeof a === 'undefined') {
		return Vector3.f(0);
	} else {
		return Vector3.f(...a);
	}
}

export class Vector3 {
	public get pitch(): number { return this.x; }
	public set pitch(value: number) { this.x = value; }

	public get yaw(): number { return this.y; }
	public set yaw(value: number) { this.y = value; }

	public get roll(): number { return this.z; }
	public set roll(value: number) { this.z = value; }

	public get x(): number { return this.vec[0]; }
	public set x(value: number) { this.vec[0] = value; }

	public get y(): number { return this.vec[1]; }
	public set y(value: number) { this.vec[1] = value; }

	public get z(): number { return this.vec[2]; }
	public set z(value: number) { this.vec[2] = value; }

	public get xy() { return v2(this.x, this.y); }
	public set xy(v: Vector2) { this.x = v.x; this.y = v.y}

	public get xz() { return v2(this.x, this.z); }
	public set xz(v: Vector2) { this.x = v.x; this.z = v.y}

	public get yx() { return v2(this.y, this.x); }
	public set yx(v: Vector2) { this.y = v.x; this.x = v.y}

	public get yz() { return v2(this.y, this.z); }
	public set yz(v: Vector2) { this.y = v.x; this.z = v.y}

	public get zx() { return v2(this.z, this.x); }
	public set zx(v: Vector2) { this.z = v.x; this.x = v.y}

	public get zy() { return v2(this.z, this.y); }
	public set zy(v: Vector2) { this.z = v.x; this.y = v.y}



	public get xzy() { return v3(this.x, this.z, this.y); }
	public set xzy(v: Vector3) { this.x = v.x; this.z = v.y; this.y = v.z}

	public get xyz() { return v3(this.x, this.y, this.z); }
	public set xyz(v: Vector3) { this.x = v.x; this.y = v.y; this.z = v.z}

	public get yxz() { return v3(this.y, this.x, this.z); }
	public set yxz(v: Vector3) { this.y = v.x; this.x = v.y; this.z = v.z}

	public get yzx() { return v3(this.y, this.z, this.x); }
	public set yzx(v: Vector3) { this.y = v.x; this.z = v.y; this.x = v.z}

	public get zxy() { return v3(this.z, this.x, this.y); }
	public set zxy(v: Vector3) { this.z = v.x; this.x = v.y; this.y = v.z}

	public get zyx() { return v3(this.z, this.y, this.x); }
	public set zyx(v: Vector3) { this.z = v.x; this.y = v.y; this.x = v.z}

	public get str() {
		return this.vec.toString();
	}


	public vec: vec3;

	constructor(x: number = 0, y: number = 0, z: number = 0) {
		this.vec = [x, y, z];
	}

	static from2(vector: Vector2, z: number = 0) {
		return new Vector3(vector.x, vector.y, z);
	}

	static f(x: number = 0, y: number = x, z: number = x) {
		return new Vector3(x, y, z);
	}

	static get forwards() {
		return new Vector3(0, 0, 1);
	}
	static get backwards() {
		return new Vector3(0, 0, -1);
	}
	static get up() {
		return new Vector3(0, 1, 0);
	}
	static get down() {
		return new Vector3(0, -1, 0);
	}
	static get left() {
		return new Vector3(-1, 0, 0);
	}
	static get right() {
		return new Vector3(1, 0, 0);
	}
	static get PI() {
		return new Vector3(Math.PI, Math.PI, Math.PI);
	}
	static get TAU() {
		return Vector3.PI.scale(0.5);
	}

	get array() {
		return [this.x, this.y, this.z];
	}

	set array(a: [number, number, number]) {
		[this.x, this.y, this.z] = a;
	}

	forEach(callbackfn: (value: number, index: number, array: number[]) => void): void {
		this.array.forEach(callbackfn);
	};

	get c(): Vector3 {
		return this.clone();
	}

	equals(vector: Vector3): boolean {
		return (
			this.x === vector.x &&
			this.y === vector.y &&
			this.z === vector.z
		);
	}

	clone(): Vector3 {
		return new Vector3(
			this.x,
			this.y,
			this.z
		);
	}

	add(...vectors: Vector3[]) {
		return new Vector3(
			this.x + vectors.reduce((a, b) => a + b.x, 0),
			this.y + vectors.reduce((a, b) => a + b.y, 0),
			this.z + vectors.reduce((a, b) => a + b.z, 0),
		);
	}

	multiply(a: Vector3): Vector3;
	multiply(a: number, b: number, c: number): Vector3;
	multiply(a: Vector3 | number, b?: number, c?: number): Vector3 {
		const [x, y, z] = (typeof a === 'number') ? [a, b, c] : a.array;
		return new Vector3(
			this.x * x,
			this.y * y,
			this.z * z,
		);
	}

	subtract(...vectors: Vector3[]) {
		return new Vector3(
			this.x - vectors.reduce((a, b) => a + b.x, 0),
			this.y - vectors.reduce((a, b) => a + b.y, 0),
			this.z - vectors.reduce((a, b) => a + b.z, 0),
		);
	}

	scale(...scalars: number[]) {
		return new Vector3(
			this.x * scalars.reduce((a, b) => a * b, 1),
			this.y * scalars.reduce((a, b) => a * b, 1),
			this.z * scalars.reduce((a, b) => a * b, 1),
		);
	}

	divide(...vectors: Vector3[]) {
		return new Vector3(
			this.x / vectors.reduce((a, b) => a * b.x, 1),
			this.y / vectors.reduce((a, b) => a * b.y, 1),
			this.z / vectors.reduce((a, b) => a * b.z, 1),
		);
	}

	rotateXY(rad: number) {
		const [a, b] = this.xy.rotate(rad).array;

		return new Vector3(
			a,
			b,
			this.z,
		);
	}
	rotateXZ(rad: number) {
		const [a, b] = this.xz.rotate(rad).array;

		return new Vector3(
			a,
			this.y,
			b,
		);
	}
	rotateYZ(rad: number) {
		const [a, b] = this.yz.rotate(rad).array;

		return new Vector3(
			this.x,
			a,
			b,
		);
	}

	magnitude() {
		return Math.sqrt(this.magnitudeSqr());
	}

	magnitudeSqr() {
		return (this.x * this.x + this.y * this.y + this.z * this.z);
	}

	mod(max: Vector3) {
		return new Vector3(
			this.x % max.x,
			this.y % max.y,
			this.z % max.z,
		);
	}
	clamp(min: Vector3, max: Vector3) {
		return new Vector3(
			Util.clamp(this.x, min.x, max.x),
			Util.clamp(this.y, min.y, max.y),
			Util.clamp(this.z, min.z, max.z),
		);
	}
	normalize() {
		let len = this.x * this.x + this.y * this.y + this.z * this.z;
		if (len > 0) {
			len = 1 / Math.sqrt(len);
		}
		return v3(
			this.x * len,
			this.y * len,
			this.z * len
		);
	}

	applyQuaternion(q: Quaternion): Vector3 {
		const x = this.x;
		const y = this.y;
		const z = this.z;
		const qx = q.x;
		const qy = q.y;
		const qz = q.z;
		const qw = q.w;

		// Calculate quat * vector
		const ix = qw * x + qy * z - qz * y;
		const iy = qw * y + qz * x - qx * z;
		const iz = qw * z + qx * y - qy * x;
		const iw = -qx * x - qy * y - qz * z;

		// Calculate result * inverse quat
		return new Vector3(
			ix * qw + iw * -qx + iy * -qz - iz * -qy,
			iy * qw + iw * -qy + iz * -qx - ix * -qz,
			iz * qw + iw * -qz + ix * -qy - iy * -qx
		);
	}

	cross(other: Vector3): Vector3 {
		return new Vector3(
			this.y * other.z - this.z * other.y,
			this.z * other.x - this.x * other.z,
			this.x * other.y - this.y * other.x
		);
	}

	dot(other: Vector3): number {
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
	public static screenToWorldPlane(
		screenPos: Vector2, 
		camera: Camera, 
		planeNormal: Vector3,
		planeCoordinate: number
	): Vector3 | null {
		// Convert screen position to NDC (-1 to 1)
		const ndcX = screenPos.x * 2 - 1;
		const ndcY = (1 - screenPos.y) * 2 - 1; // Flip Y back to OpenGL coordinates

		// Get camera matrices
		const projMatrix = camera.getProjectionMatrix();
		const viewMatrix = camera.getViewMatrix();

		// Create inverse matrices
		const invProj = projMatrix.clone().invert();
		const invView = viewMatrix.clone().invert();

		// Reconstruct position on near plane
		const nearPoint = v3(ndcX, ndcY, -1);
		
		// Unproject point to get ray direction in view space
		const rayDir = v3(
			invProj.mat4[0] * nearPoint.x + invProj.mat4[4] * nearPoint.y + invProj.mat4[8] * nearPoint.z + invProj.mat4[12],
			invProj.mat4[1] * nearPoint.x + invProj.mat4[5] * nearPoint.y + invProj.mat4[9] * nearPoint.z + invProj.mat4[13],
			invProj.mat4[2] * nearPoint.x + invProj.mat4[6] * nearPoint.y + invProj.mat4[10] * nearPoint.z + invProj.mat4[14]
		).normalize();

		// Transform ray to world space
		const worldRayDir = v3(
			invView.mat4[0] * rayDir.x + invView.mat4[4] * rayDir.y + invView.mat4[8] * rayDir.z,
			invView.mat4[1] * rayDir.x + invView.mat4[5] * rayDir.y + invView.mat4[9] * rayDir.z,
			invView.mat4[2] * rayDir.x + invView.mat4[6] * rayDir.y + invView.mat4[10] * rayDir.z
		).normalize();

		const rayOrigin = camera.getPosition();

		// Calculate intersection with the plane
		const denom = worldRayDir.dot(planeNormal);

		// If denominator is close to 0, ray is parallel to the plane
		if (Math.abs(denom) < 1e-6) {
			return null;
		}

		// For a given normal (nx,ny,nz) and coordinate c, any point P(x,y,z) on the plane satisfies:
		// If normal is (0,1,0) and coordinate is -1, then y = -1
		// So: dot(P - (normal * coordinate), normal) = 0
		const planePoint = planeNormal.scale(planeCoordinate);
		const t = planePoint.subtract(rayOrigin).dot(planeNormal) / denom;

		// Calculate the intersection point
		return rayOrigin.add(worldRayDir.scale(t));
	} 
}
