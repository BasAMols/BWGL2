import { v3, Vector3 } from '../util/math/vector3';
import { m4, Matrix4 } from '../util/math/matrix4';
import { TickerReturnData } from '../ticker';

export class Camera {
    private position: Vector3;
    private target: Vector3;

    private viewMatrix: Matrix4;
    private projectionMatrix: Matrix4;

    private fov: number;
    private near: number;
    private far: number;

    constructor(
        { position = v3(0, 0, 5), target = v3(0, 0, 0), fov = 30, near = 100, far = 170000 }: { position?: Vector3; target?: Vector3; fov?: number; near?: number; far?: number; } = {}) {
        this.position = position;
        this.target = target;

        this.fov = fov;
        this.near = near;
        this.far = far;

        this.updateViewMatrix();
        this.updateProjectionMatrix();
    }

    public updateViewMatrix(): void {
        this.viewMatrix = Matrix4.lookAt(this.position, this.target);
    }

    public updateProjectionMatrix(): void {
        this.projectionMatrix = m4().perspective(
            this.fov * Math.PI / 180,
            this.near,
            this.far
        );
    }

    public setPosition(position: Vector3): void {
        this.position = position;
        this.updateViewMatrix();
    }

    public setTarget(target: Vector3): void {
        this.target = target;
        this.updateViewMatrix();
    }

    public setFov(fov: number): void {
        this.fov = fov;
        this.updateProjectionMatrix();
    }

    public getViewMatrix(): Matrix4 {
        return this.viewMatrix;
    }

    public getProjectionMatrix(): Matrix4 {
        return this.projectionMatrix;
    }

    public getPosition(): Vector3 {
        return this.position;
    }

    public getTarget(): Vector3 {
        return this.target;
    }

    public getAngle(): Vector3 {
        return this.target.subtract(this.position).normalize();
    }

    tick(obj: TickerReturnData) {
        
    }
} 