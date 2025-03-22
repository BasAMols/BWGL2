import { mat4, vec3 } from 'gl-matrix';

export class Camera {
    private position: vec3;
    private target: vec3;
    private up: vec3;
    
    private viewMatrix: mat4;
    private projectionMatrix: mat4;
    
    private fov: number;
    private aspect: number;
    private near: number;
    private far: number;

    constructor(
        position: vec3 = vec3.fromValues(0, 0, 5),
        target: vec3 = vec3.fromValues(0, 0, 0),
        up: vec3 = vec3.fromValues(0, 1, 0),
        fov: number = 45,
        aspect: number = 1,
        near: number = 0.1,
        far: number = 1000
    ) {
        this.position = position;
        this.target = target;
        this.up = up;
        
        this.fov = fov;
        this.aspect = aspect;
        this.near = near;
        this.far = far;

        this.viewMatrix = mat4.create();
        this.projectionMatrix = mat4.create();
        
        this.updateViewMatrix();
        this.updateProjectionMatrix();
    }

    public updateViewMatrix(): void {
        mat4.lookAt(this.viewMatrix, this.position, this.target, this.up);
    }

    public updateProjectionMatrix(): void {
        mat4.perspective(
            this.projectionMatrix,
            this.fov * Math.PI / 180,
            this.aspect,
            this.near,
            this.far
        );
    }

    public setPosition(position: vec3): void {
        this.position = position;
        this.updateViewMatrix();
    }

    public setTarget(target: vec3): void {
        this.target = target;
        this.updateViewMatrix();
    }

    public setUp(up: vec3): void {
        this.up = up;
        this.updateViewMatrix();
    }

    public setAspect(aspect: number): void {
        this.aspect = aspect;
        this.updateProjectionMatrix();
    }

    public setFov(fov: number): void {
        this.fov = fov;
        this.updateProjectionMatrix();
    }

    public getViewMatrix(): mat4 {
        return this.viewMatrix;
    }

    public getProjectionMatrix(): mat4 {
        return this.projectionMatrix;
    }

    public getPosition(): vec3 {
        return this.position;
    }

    public getTarget(): vec3 {
        return this.target;
    }

    public getUp(): vec3 {
        return this.up;
    }
} 