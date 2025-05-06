import { v3, Vector3 } from '../util/math/vector3';
import { m4, Matrix4 } from '../util/math/matrix4';
import { TickerReturnData } from '../ticker';

export class Camera {
    private position: Vector3;
    private target: Vector3;
    
    // Store Euler angles for camera rotation
    public pitch: number = 0; // rotation around X-axis (looking up/down)
    public yaw: number = 0;   // rotation around Y-axis (looking left/right)

    private viewMatrix: Matrix4;
    private projectionMatrix: Matrix4;

    private _fov: number;
    public get fov(): number {
        return this._fov;
    }
    public set fov(value: number) {
        this._fov = value;
        this.updateProjectionMatrix();
    }
    private _near: number;
    public get near(): number {
        return this._near;
    }
    public set near(value: number) {
        this._near = value;
        this.updateProjectionMatrix();
    }
    private _far: number;
    public get far(): number {
        return this._far;
    }
    public set far(value: number) {
        this._far = value;
        this.updateProjectionMatrix();
    }

    constructor(
        { position = v3(0, 0, 5), target = v3(0, 0, 0), fov = 60, near = 0.01, far = 1000 }: { position?: Vector3; target?: Vector3; fov?: number; near?: number; far?: number; } = {}) {
        this.position = position;
        this.target = target;

        this.fov = fov;
        this.near = near;
        this.far = far;

        // Calculate initial yaw and pitch based on position and target
        const direction = target.subtract(position).normalize();
        this.yaw = Math.atan2(direction.x, direction.z);
        this.pitch = -Math.asin(direction.y);

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
        this.updateTargetFromAngles();
        this.updateViewMatrix();
    }

    public setTarget(target: Vector3): void {
        this.target = target;
        
        // Update the rotation angles based on the new target
        const direction = target.subtract(this.position).normalize();
        this.yaw = Math.atan2(direction.x, direction.z);
        this.pitch = -Math.asin(direction.y);
        
        this.updateViewMatrix();
    }

    /**
     * Updates the target position based on current pitch and yaw angles
     */
    private updateTargetFromAngles(): void {
        // Create direction vector from pitch and yaw
        const direction = v3(
            Math.sin(this.yaw) * Math.cos(this.pitch),
            Math.sin(this.pitch),
            Math.cos(this.yaw) * Math.cos(this.pitch)
        );
        
        // Set target based on position and direction
        this.target = this.position.add(direction);
    }

    /**
     * Sets the camera's rotation directly using pitch and yaw angles
     * @param rotation Vector where x=pitch (up/down) and y=yaw (left/right) in radians
     */
    public setRotation(rotation: Vector3): void {
        // Clamp pitch to avoid flipping the camera
        this.pitch = Math.max(-Math.PI/2 + 0.01, Math.min(Math.PI/2 - 0.01, rotation.x));
        this.yaw = rotation.y;
        
        this.updateTargetFromAngles();
        this.updateViewMatrix();
    }

    /**
     * Rotates the camera relative to its current orientation
     * @param rotation Vector where x=pitch delta and y=yaw delta in radians
     */
    public rotate(rotation: Vector3): void {
        // Update pitch and yaw
        this.pitch += rotation.x;
        this.yaw += rotation.y;
        
        // Clamp pitch to avoid flipping the camera
        this.pitch = Math.max(-Math.PI/2 + 0.01, Math.min(Math.PI/2 - 0.01, this.pitch));
        
        this.updateTargetFromAngles();
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

    /**
     * Returns the normalized direction vector from position to target
     */
    public getAngle(): Vector3 {
        return this.target.subtract(this.position).normalize();
    }

    /**
     * Get the current rotation angles (pitch, yaw)
     */
    public getRotation(): Vector3 {
        return v3(this.pitch, this.yaw, 0);
    }

    tick(obj: TickerReturnData) {
        
    }
} 