import { Controller } from '../../../actor/controller';
import { TickerReturnData } from '../../../ticker';
import { Ease } from '../../../util/ease';
import { Quaternion } from '../../../util/math/quaternion';
import { v3, Vector3 } from '../../../util/math/vector3';
import { ContainerObject } from '../../../webgl2/meshes/containerObject';
import { CarActor } from './a_car';


export interface CarControllerProps {
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

export class CarController extends Controller {
    public actor: CarActor;

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

    constructor(props: CarControllerProps = {}, private levelWrapper: ContainerObject) {
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

    outputAngle: number = 0;
    outputPosition: Vector3 = v3(0);
    progress: number = 0;

    tick(obj: TickerReturnData) {
        // Get raw input

        const swerveSpeed = 8000;
        const preTurn = 1.5;
        const bounceSpeed = 12000;

        const swerveHalf = swerveSpeed / 2;

        const phase = Ease.easeInOutSine(obj.total % swerveSpeed / swerveHalf);
        const phase2 = Ease.easeInOutSine((obj.total + swerveHalf * preTurn) % swerveSpeed / swerveHalf);
        const phase3 = Ease.easeInOutSine(obj.total % bounceSpeed / (bounceSpeed / 2));

        this.outputAngle = (phase2 - 0.5) / 10;
        this.outputPosition = v3(
            (-phase + 0.5),
            0,
            phase3 * 3 - 1.5
        );

        this.levelWrapper.transform.setPosition(this.outputPosition);
        this.levelWrapper.transform.setRotation(Quaternion.fromEuler(0, this.outputAngle, 0));

        this.progress += obj.interval;
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