import { SceneObject, SceneObjectProps } from './sceneObject';
import { ContainerObject } from './containerObject';
import { v3, Vector3 } from '../../util/math/vector3';
import { Cone } from './cone';
import { Cylinder } from './cylinder';
import { Quaternion } from '../../util/math/quaternion';
import { Scene } from '../scene';

export interface ArrowProps extends SceneObjectProps {
    length?: number;
    shaftRadius?: number;
    headLength?: number;
    headRadius?: number;
    shaftColor?: [number, number, number];
    headColor?: [number, number, number];
    parent?: SceneObject;
    sides?: number;
    smoothShading?: boolean;
    lookAt?: Vector3;
}

export class Arrow extends ContainerObject {
    shaft: SceneObject;
    head: SceneObject;
    props: ArrowProps;
    constructor(scene: Scene, props: ArrowProps = {}) {
        super(props);
        this.props = {
            position: v3(0, 0, 0),
            shaftRadius: 0.5,
            headLength: 0.5,
            headRadius: 2,
            sides: 4,
            smoothShading: false,
            shaftColor: [1, 1, 1],
            headColor: [1, 1, 1],
            ...props,
        }
        if (props.parent) {
            this.transform.setParent(props.parent.transform);
        }

        const shaftLength = this.props.length - this.props.headLength;

        // // Add main cube slightly elevated
        scene.add(this.shaft = Cylinder.create({
            position: v3(0, shaftLength/2, 0),
            scale: v3(this.props.shaftRadius, shaftLength, this.props.shaftRadius),
            colors: this.props.shaftColor,
            sides: this.props.sides,
            smoothShading: this.props.smoothShading,
            parent: this,
            ignoreLighting: this.props.ignoreLighting,
        }));
        scene.add(this.head = Cone.create({
            position: v3(0, shaftLength + this.props.headLength/2, 0),
            scale: v3(this.props.headRadius, this.props.headLength, this.props.headRadius),
            colors: this.props.headColor,
            smoothShading: this.props.smoothShading,
            sides: this.props.sides,
            parent: this,
            ignoreLighting: this.props.ignoreLighting,
        }));
        this.setLength(this.props.length);
        if (this.props.lookAt) {
            this.lookAt(this.props.lookAt);
        }
    }

    public setLength(length: number) {
        let shaftLength = length - this.props.headLength;
        let headLength = this.props.headLength;

        if (shaftLength < 0){
            headLength = length;
            shaftLength = 0;
        }

        this.shaft.transform.setPosition(v3(0, shaftLength/2, 0));
        this.shaft.transform.setScale(v3(this.props.shaftRadius, shaftLength, this.props.shaftRadius));
        this.head.transform.setPosition(v3(0, shaftLength + headLength/2, 0));
        this.head.transform.setScale(v3(this.props.headRadius, headLength, this.props.headRadius));
    }

    public lookAt(target: Vector3) {
        const position = this.transform.getWorldPosition();
        const direction = target.subtract(position).normalize();
        
        // Calculate rotation axis and angle
        const defaultDir = v3(0, 1, 0); // Arrow points up by default
        const rotationAxis = defaultDir.cross(direction).scale(-1).normalize();
        const angle = Math.acos(defaultDir.y * direction.y + defaultDir.x * direction.x + defaultDir.z * direction.z);
        
        this.transform.setRotation(new Quaternion().setAxisAngle(rotationAxis, angle));
    }
} 