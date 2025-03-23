import { mat4, vec3 } from 'gl-matrix';
import { Vector3, v3 } from './vector3';
import { glob } from '../../../game';

export function m4() {
    return Matrix4.f();
}

export class Matrix4 {
    public mat4: mat4;
    public constructor(source?: mat4) {
        this.mat4 = source ? mat4.clone(source) : mat4.create();
        return this;
    }

    static f() {
        return new Matrix4();
    }

    public add(mat: Matrix4) {
        mat4.add(
            this.mat4,
            this.mat4,
            mat.mat4
        );
        return this;
    }
    public subtract(mat: Matrix4) {
        mat4.subtract(
            this.mat4,
            this.mat4,
            mat.mat4
        );
        return this;
    }
    public multiply(mat: Matrix4) {
        mat4.multiply(
            this.mat4,
            this.mat4,
            mat.mat4
        );
        return this;
    }
    public scale(vector: Vector3) {
        mat4.scale(
            this.mat4,
            this.mat4,
            vector.vec
        );
        return this;
    }
    public translate(vector: Vector3) {
        mat4.translate(
            this.mat4,
            this.mat4,
            vector.vec
        );
        return this;
    }
    public invert() {
        mat4.invert(
            this.mat4,
            this.mat4,
        );
        return this;
    }
    public transpose(mat?: Matrix4) {
        mat4.transpose(
            this.mat4,
            mat ? mat.mat4 : this.mat4,
        );
        return this;
    }
    public rotateAxis(angle: number, axis: 0 | 1 | 2) {
        mat4.rotate(
            this.mat4,
            this.mat4,
            angle,
            [[1, 0, 0], [0, 1, 0], [0, 0, 1]][axis] as vec3
        );
        return this;
    }
    public rotate(rotation: Vector3) {
        rotation.forEach((r, i) => {
            this.rotateAxis(r, i as 0 | 1 | 2);
        });
        return this;
    }
    public perspective(fov: number, near: number = 1, far: number = Infinity) {
        mat4.perspective(
            this.mat4,
            fov,
            glob.renderer ? glob.renderer.width / glob.renderer.height : document.body.clientWidth / document.body.clientHeight,
            near,
            far
        );
        return this;
    }
    public ortho(left: number, right: number, bottom: number, top: number, near: number = 1, far: number = Infinity) {
        mat4.ortho(this.mat4,
            left, right, bottom, top, near, far
        );
        return this;
    }
    public clone() {
        return new Matrix4(this.mat4);
    }

    public static lookAt(camera: Vector3, target: Vector3): Matrix4 {
        let matrix = m4();
        mat4.lookAt(
            matrix.mat4,
            camera.vec,
            target.vec,
            v3(0, 1, 0).vec
        );
        return matrix;
    }

    public get position() {
        return v3(this.mat4[12], this.mat4[13], this.mat4[14]);
    }
}
