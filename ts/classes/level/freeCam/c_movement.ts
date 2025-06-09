import { glob } from '../../../game';
import { Controller } from "../../actor/controller";
import { TickerReturnData } from '../../ticker';
import { v3, Vector3 } from "../../util/math/vector3";
import { Actor } from '../../actor/actor';
import { Quaternion } from '../../util/math/quaternion';

export interface MovementControllerProps {
    // Input Axis Mapping (affects all movement including jumps)
    inputMapping?: {
        forward?: '+x' | '-x' | '+y' | '-y' | '+z' | '-z';  // Default: '-z'
        right?: '+x' | '-x' | '+y' | '-y' | '+z' | '-z';    // Default: '+x'
        up?: '+x' | '-x' | '+y' | '-y' | '+z' | '-z';       // Default: '+y'
    };
    
    // Movement Configuration
    movement?: {
        maxSpeed?: number;          // Maximum speed (units per second equivalent)
        acceleration?: number;      // Speed buildup rate (units per second)
        deceleration?: number;      // Natural slowdown rate (units per second)
        brakeDeceleration?: number; // Active braking rate when input opposes movement (units per second)
        reference?: 'camera' | 'world' | 'actor' | number;  // Movement reference system
        rotateToMovement?: boolean; // Whether to rotate actor to face movement direction
        turnSpeed?: number;         // Maximum turn speed in degrees per second (0 = instant)
    };
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
    
    protected inputMapping = {
        forward: '-z' as '+x' | '-x' | '+y' | '-y' | '+z' | '-z',
        right: '+x' as '+x' | '-x' | '+y' | '-y' | '+z' | '-z',
        up: '+y' as '+x' | '-x' | '+y' | '-y' | '+z' | '-z'
    };
    
    protected movementReference: 'camera' | 'world' | 'actor' | number = 'camera';
    
    private _speedFactor: number = 0.2;        // Current speed factor (0.0 to 1.0)
    private rotateToMovement: boolean = true;
    private turnSpeed: number = 0;              // Turn speed in degrees per second (0 = instant)
    private currentYaw: number = 0;             // Current actor yaw in radians

    constructor(props: MovementControllerProps = {}) {
        super();
        
        // Apply input mapping
        if (props.inputMapping) {
            this.inputMapping.forward = props.inputMapping.forward ?? this.inputMapping.forward;
            this.inputMapping.right = props.inputMapping.right ?? this.inputMapping.right;
            this.inputMapping.up = props.inputMapping.up ?? this.inputMapping.up;
        }
        
        // Apply movement properties (new nested structure)
        if (props.movement) {
            this.movement.maxSpeed = props.movement.maxSpeed ?? this.movement.maxSpeed;
            this.movement.acceleration = props.movement.acceleration ?? this.movement.acceleration;
            this.movement.deceleration = props.movement.deceleration ?? this.movement.deceleration;
            this.movement.brakeDeceleration = props.movement.brakeDeceleration ?? this.movement.brakeDeceleration;
            this.movementReference = props.movement.reference ?? this.movementReference;
            this.rotateToMovement = props.movement.rotateToMovement ?? this.rotateToMovement;
            this.turnSpeed = props.movement.turnSpeed ?? this.turnSpeed;
        }
    }
    
    protected mapAxisToVector(axis: '+x' | '-x' | '+y' | '-y' | '+z' | '-z', value: number): Vector3 {
        switch (axis) {
            case '+x': return v3(value, 0, 0);
            case '-x': return v3(-value, 0, 0);
            case '+y': return v3(0, value, 0);
            case '-y': return v3(0, -value, 0);
            case '+z': return v3(0, 0, value);
            case '-z': return v3(0, 0, -value);
        }
    }
    
    private applyInputMapping(inputX: number, inputZ: number): Vector3 {
        // Map input directions to world space based on inputMapping
        const forwardVector = this.mapAxisToVector(this.inputMapping.forward, -inputZ); // -inputZ because input is inverted
        const rightVector = this.mapAxisToVector(this.inputMapping.right, inputX);
        
        return forwardVector.add(rightVector);
    }
    
    private applyMovementReference(worldVector: Vector3): Vector3 {
        switch (this.movementReference) {
            case 'world':
                return worldVector; // No rotation needed
                
            case 'actor':
                return worldVector.rotateXZ(-this.currentYaw);
                
            case 'camera':
                if ((this.actor as any).camera) {
                    return worldVector.rotateXZ(-(this.actor as any).camera.yaw - Math.PI);
                }
                return worldVector; // Fallback to world if no camera
                
            default:
                // Custom angle (number)
                if (typeof this.movementReference === 'number') {
                    return worldVector.rotateXZ(-this.movementReference);
                }
                return worldVector;
        }
    }

    tick(obj: TickerReturnData) {
        // Get raw input
        const inputX = glob.input.axis('movement')?.x || 0;
        const inputY = -glob.input.axis('movement')?.y || 0; // Note: Y input (forward/backward)
        
        // Apply input mapping to get world space direction
        const worldDirection = this.applyInputMapping(inputX, inputY);
        
        // Calculate target velocity
        const inputMagnitude = worldDirection.magnitude();
        let targetVelocity = v3(0);
        
        if (inputMagnitude > 0.001) { // Avoid divide by zero
            const normalizedInput = worldDirection.scale(1 / inputMagnitude);
            const effectiveSpeedKmh = this.movement.maxSpeed * this._speedFactor;
            const effectiveSpeedInternal = effectiveSpeedKmh / 30; // Convert km/h to internal units
            targetVelocity = normalizedInput.scale(effectiveSpeedInternal);
        }

        // Apply movement reference system (camera/world/actor/custom)
        targetVelocity = this.applyMovementReference(targetVelocity);

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
            const targetYaw = movementDirection.angle();
            
            if (this.turnSpeed <= 0) {
                // Instant rotation (current behavior)
                this.currentYaw = targetYaw;
            } else {
                // Smooth rotation with turn speed limit
                const frameTime = obj.intervalS10 / 1000; // Convert ms to seconds
                const maxTurnRadians = (this.turnSpeed * Math.PI / 180) * frameTime; // Convert degrees/sec to radians/frame
                
                // Calculate shortest angle difference
                let angleDiff = targetYaw - this.currentYaw;
                while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
                while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
                
                // Limit the turn amount
                const turnAmount = Math.sign(angleDiff) * Math.min(Math.abs(angleDiff), maxTurnRadians);
                this.currentYaw += turnAmount;
                
                // Normalize angle
                while (this.currentYaw > Math.PI) this.currentYaw -= 2 * Math.PI;
                while (this.currentYaw < -Math.PI) this.currentYaw += 2 * Math.PI;
            }
            
            this.actor.transform.setRotation(Quaternion.fromEuler(0, this.currentYaw, 0));
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
    public getTurnSpeed(): number { return this.turnSpeed; } // Returns degrees per second
    
    // Setters for runtime adjustment
    public setMaxSpeed(speed: number): void { this.movement.maxSpeed = speed; }
    public setTurnSpeed(degreesPerSecond: number): void { this.turnSpeed = Math.max(0, degreesPerSecond); } // Clamp to 0+
    public setAcceleration(accel: number): void { this.movement.acceleration = accel; }
    public setDeceleration(decel: number): void { this.movement.deceleration = decel; }
    public setBrakeDeceleration(brake: number): void { this.movement.brakeDeceleration = brake; }

    
} 