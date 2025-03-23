import { Matrix4, m4 } from './matrix4';
import { Quaternion } from './quaternion';
import { Vector3, v3 } from './vector3';

export class Transform {
    private _localPosition: Vector3;
    private _localRotation: Quaternion; // Note: You'll need to implement a Quaternion class
    private _localScale: Vector3;
    private _anchor: Vector3;
    
    private _worldMatrix: Matrix4;
    private _localMatrix: Matrix4;
    private _isDirty: boolean;
    
    private _parent: Transform | null;
    private _children: Transform[];

    constructor() {
        this._localPosition = v3(0);
        this._localRotation = new Quaternion(); // Identity quaternion
        this._localScale = v3(1);
        this._anchor = v3(0);
        
        this._worldMatrix = m4();
        this._localMatrix = m4();
        this._isDirty = true;
        
        this._parent = null;
        this._children = [];
    }

    // Position methods
    public setPosition(position: Vector3): void {
        this._localPosition = position;
        this._isDirty = true;
    }

    public getLocalPosition(): Vector3 {
        return this._localPosition.clone();
    }

    public getWorldPosition(): Vector3 {
        return this.getWorldMatrix().position;
    }

    // Rotation methods
    public setRotation(rotation: Quaternion): void {
        this._localRotation = rotation;
        this._isDirty = true;
    }

    public getLocalRotation(): Quaternion {
        return this._localRotation.clone();
    }

    public getWorldRotation(): Quaternion {
        // Extract rotation from world matrix
        return Quaternion.fromMatrix(this.getWorldMatrix());
    }

    // Scale methods
    public setScale(scale: Vector3): void {
        this._localScale = scale;
        this._isDirty = true;
    }

    // Anchor point methods
    public setAnchor(anchor: Vector3): void {
        this._anchor = anchor;
        this._isDirty = true;
    }

    // Hierarchy methods
    public setParent(parent: Transform | null): void {
        if (this._parent) {
            const index = this._parent._children.indexOf(this);
            if (index !== -1) this._parent._children.splice(index, 1);
        }

        this._parent = parent;
        if (parent) {
            parent._children.push(this);
        }
        this._isDirty = true;
    }

    // Matrix calculations
    private updateLocalMatrix(): void {
        if (!this._isDirty) return;

        this._localMatrix = m4();
        
        // Apply anchor point translation
        if (!this._anchor.equals(v3(0))) {
            this._localMatrix.translate(this._anchor.scale(-1));
        }

        // Apply transformations
        this._localMatrix.translate(this._localPosition);
        this._localMatrix.multiply(this._localRotation.toMatrix4());
        this._localMatrix.scale(this._localScale);

        // Reverse anchor point translation
        if (!this._anchor.equals(v3(0))) {
            this._localMatrix.translate(this._anchor);
        }

        this._isDirty = false;
    }

    public getLocalMatrix(): Matrix4 {
        this.updateLocalMatrix();
        return this._localMatrix.clone();
    }

    public getWorldMatrix(): Matrix4 {
        this.updateLocalMatrix();
        
        if (this._parent) {
            return this._parent.getWorldMatrix().multiply(this._localMatrix);
        }
        
        return this._localMatrix.clone();
    }
} 