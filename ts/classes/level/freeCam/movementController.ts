import { glob } from '../../../game';
import { Controller } from "../../actor/controller";
import { TickerReturnData } from '../../ticker';
import { v3, Vector3 } from "../../util/math/vector3";
import { Actor } from '../../actor/actor';
import { Quaternion } from '../../util/math/quaternion';

export interface MovementControllerProps {
    maxSpeed?: number;          // Maximum speed (units per second equivalent)
    acceleration?: number;      // Speed buildup rate (units per second)
    deceleration?: number;      // Natural slowdown rate (units per second)
    brakeDeceleration?: number; // Active braking rate when input opposes movement (units per second)
    rotateToMovement?: boolean; // Whether to rotate actor to face movement direction
}

export class MovementController extends Controller {
    public actor: Actor;
    
    protected movement = {
        maxSpeed: 30,               // Maximum speed in km/h
        acceleration: 0.8,          // Default acceleration
        deceleration: 1.2,          // Default deceleration
        brakeDeceleration: 2.5,     // Default brake deceleration
        currentVelocity: v3(0)      // Current horizontal velocity
    };
    
    private _speedFactor: number = 0.2;        // Current speed factor (0.0 to 1.0)
    private rotateToMovement: boolean = true;

    constructor(props: MovementControllerProps = {}) {
        super();
        
        // Apply constructor properties
        this.movement.maxSpeed = props.maxSpeed ?? this.movement.maxSpeed;
        this.movement.acceleration = props.acceleration ?? this.movement.acceleration;
        this.movement.deceleration = props.deceleration ?? this.movement.deceleration;
        this.movement.brakeDeceleration = props.brakeDeceleration ?? this.movement.brakeDeceleration;
        this.rotateToMovement = props.rotateToMovement ?? this.rotateToMovement;
    }

    tick(obj: TickerReturnData) {
        // Get input direction (before applying speed)
        const inputX = glob.input.axis('movement')?.x || 0;
        const inputZ = -glob.input.axis('movement')?.y || 0;
        const inputDirection = v3(inputX, 0, inputZ);
        
        // Calculate target velocity
        const inputMagnitude = inputDirection.magnitude();
        let targetVelocity = v3(0);
        
        if (inputMagnitude > 0.001) { // Avoid divide by zero
            const normalizedInput = inputDirection.scale(1 / inputMagnitude);
            const effectiveSpeedKmh = this.movement.maxSpeed * this._speedFactor;
            const effectiveSpeedInternal = effectiveSpeedKmh / 30; // Convert km/h to internal units
            targetVelocity = normalizedInput.scale(effectiveSpeedInternal);
        }

        // Apply camera rotation to target velocity
        if ((this.actor as any).camera) {
            targetVelocity = targetVelocity.rotateXZ(-(this.actor as any).camera.yaw - Math.PI);
        }

        // Determine movement type and select appropriate rate
        const currentSpeed = this.movement.currentVelocity.magnitude();
        const targetSpeed = targetVelocity.magnitude();
        let changeRate: number;

        if (inputMagnitude > 0.001 && currentSpeed > 0.001) {
            // Check if input opposes current movement (braking)
            const currentDirection = this.movement.currentVelocity.scale(1 / currentSpeed);
            const targetDirection = targetVelocity.scale(1 / targetSpeed);
            const alignment = currentDirection.dot(targetDirection);
            
            if (alignment < -0.1) {
                // BRAKING: Input opposes current movement
                changeRate = this.movement.brakeDeceleration;
            } else if (targetSpeed > currentSpeed) {
                // ACCELERATING: Speeding up
                changeRate = this.movement.acceleration;
            } else {
                // DECELERATING: Slowing down
                changeRate = this.movement.deceleration;
            }
        } else if (targetSpeed > currentSpeed) {
            // ACCELERATING: From standstill or speeding up
            changeRate = this.movement.acceleration;
        } else {
            // DECELERATING: No input or slowing down
            changeRate = this.movement.deceleration;
        }

        // Interpolate current velocity towards target velocity
        const velocityDelta = targetVelocity.subtract(this.movement.currentVelocity);
        const deltaDistance = velocityDelta.magnitude();
        
        if (deltaDistance > 0.001) {
            const frameTime = obj.intervalS10 / 1000; // Convert ms to seconds
            const maxChange = changeRate * frameTime;
            const changeAmount = Math.min(deltaDistance, maxChange);
            const changeDirection = velocityDelta.scale(1 / deltaDistance);
            
            this.movement.currentVelocity = this.movement.currentVelocity.add(
                changeDirection.scale(changeAmount)
            );
        }

        // Rotate actor to face movement direction
        if (this.rotateToMovement && this.movement.currentVelocity.magnitude() > 0.001) {
            const movementDirection = this.movement.currentVelocity.xz;
            this.actor.transform.setRotation(Quaternion.fromEuler(0, movementDirection.angle(), 0));
        }

        // Apply horizontal movement to actor position
        const horizontalMovement = this.movement.currentVelocity.scale(obj.intervalS10 / 120);
        const currentPosition = this.actor.transform.getLocalPosition();
        this.actor.transform.setPosition(currentPosition.add(v3(horizontalMovement.x, 0, horizontalMovement.z)));
    }

    public get speedFactor(): number { return this._speedFactor; }
    public set speedFactor(factor: number) { this._speedFactor = Math.max(0, Math.min(1, factor)); } // Clamp 0-1

    // Getters for accessing movement properties
    public getMaxSpeed(): number { return this.movement.maxSpeed; }
    public getEffectiveSpeed(): number { return this.movement.maxSpeed * this._speedFactor; } // Returns km/h
    public getCurrentSpeed(): number { return this.movement.currentVelocity.magnitude(); }
    public getCurrentVelocity(): Vector3 { return v3(this.movement.currentVelocity.x, this.movement.currentVelocity.y, this.movement.currentVelocity.z); }
    
    // Setters for runtime adjustment
    public setMaxSpeed(speed: number): void { this.movement.maxSpeed = speed; }
    public setAcceleration(accel: number): void { this.movement.acceleration = accel; }
    public setDeceleration(decel: number): void { this.movement.deceleration = decel; }
    public setBrakeDeceleration(brake: number): void { this.movement.brakeDeceleration = brake; }

    
} 