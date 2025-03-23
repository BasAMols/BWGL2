import { Matrix4 } from './matrix4';
import { Vector3 } from './vector3';

export function q(): Quaternion;
export function q(x: number, y?: number, z?: number, w?: number): Quaternion;
export function q(x: [number, number, number, number]): Quaternion;
export function q(x?: number | [number, number, number, number], y?: number, z?: number, w?: number): Quaternion {
    if (typeof x === 'number') {
        return Quaternion.f(x, y, z, w);
    } else if (typeof x === 'undefined') {
        return Quaternion.f(0);
    } else {
        return Quaternion.f(...x);
    }
}

export class Quaternion {
    public x: number;
    public y: number;
    public z: number;
    public w: number;

    constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 1) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    public clone(): Quaternion {
        return new Quaternion(this.x, this.y, this.z, this.w);
    }

    public multiply(q: Quaternion): Quaternion {
        const x = this.w * q.x + this.x * q.w + this.y * q.z - this.z * q.y;
        const y = this.w * q.y - this.x * q.z + this.y * q.w + this.z * q.x;
        const z = this.w * q.z + this.x * q.y - this.y * q.x + this.z * q.w;
        const w = this.w * q.w - this.x * q.x - this.y * q.y - this.z * q.z;
        
        return new Quaternion(x, y, z, w);
    }

    public toMatrix4(): Matrix4 {
        // Convert quaternion to rotation matrix
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
            1 - 2 * (yy + zz), 2 * (xy - zw), 2 * (xz + yw), 0,
            2 * (xy + zw), 1 - 2 * (xx + zz), 2 * (yz - xw), 0,
            2 * (xz - yw), 2 * (yz + xw), 1 - 2 * (xx + yy), 0,
            0, 0, 0, 1
        ]);
    }

    public static fromEuler(x: number, y: number, z: number): Quaternion {
        // Convert Euler angles to quaternion
        const cx = Math.cos(x * 0.5);
        const cy = Math.cos(y * 0.5);
        const cz = Math.cos(z * 0.5);
        const sx = Math.sin(x * 0.5);
        const sy = Math.sin(y * 0.5);
        const sz = Math.sin(z * 0.5);

        return new Quaternion(
            sx * cy * cz + cx * sy * sz,
            cx * sy * cz - sx * cy * sz,
            cx * cy * sz + sx * sy * cz,
            cx * cy * cz - sx * sy * sz
        );
    }

    public static fromMatrix(matrix: Matrix4): Quaternion {
        // Implementation needed: Extract quaternion from rotation matrix
        // This is a complex operation that requires careful handling of edge cases
        // For now, returning identity quaternion
        return new Quaternion();
    }

    public static f(x: number, y: number = x, z: number = x, w: number = 1): Quaternion {
        return new Quaternion(x, y, z, w);
    }

    public setAxisAngle(axis: Vector3, angle: number): Quaternion {
        const halfAngle = angle * 0.5;
        const s = Math.sin(halfAngle);
        
        this.x = axis.x * s;
        this.y = axis.y * s;
        this.z = axis.z * s;
        this.w = Math.cos(halfAngle);
        
        return this;
    }
} 