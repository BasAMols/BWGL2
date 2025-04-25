import { SceneObject, SceneObjectProps } from './sceneObject';
import { Matrix4 } from '../../util/math/matrix4';
import { TickerReturnData } from '../../ticker';

/**
 * A specialized SceneObject that acts as a container for other scene objects.
 * It only handles transforms and parenting without any rendering functionality.
 */
export class ContainerObject extends SceneObject {
    protected children: SceneObject[] = [];

    constructor(props: SceneObjectProps = {}) {
        // Create a dummy SceneObjectData with minimal requirements
        const dummyData = {
            vao: null as any,
            indexBuffer: null as any,
            drawCount: 0,
            ignoreLighting: false
        };

        super(dummyData, props);
    }

    /**
     * Add a child object to this container
     */
    public add(child: SceneObject | SceneObject[]): void {
        if (Array.isArray(child)) {
            this.children.push(...child);
            child.forEach((c) => {
                c.transform.setParent(this.transform);
                c.parent = this;
                c.scene = this.scene;
                c.build();
            });
        } else {
            this.children.push(child);
            child.transform.setParent(this.transform);
            child.parent = this;
            child.scene = this.scene;
            child.build();
        }
    }

    /**
     * Remove a child object from this container
     */
    public removeChild(child: SceneObject|SceneObject[]): void {
        if (Array.isArray(child)) {
            child.forEach((c) => {
                const index = this.children.indexOf(c);
                if (index !== -1) {
                    this.children.splice(index, 1);
                    c.transform.setParent(null);
                }
            });
        } else {
            const index = this.children.indexOf(child);
            if (index !== -1) {
                this.children.splice(index, 1);
                child.transform.setParent(null);
            }
        }
    }

    /**
     * Override render to render all children
     */
    public override render(obj: TickerReturnData, viewMatrix: Matrix4, projectionMatrix: Matrix4): void {
        // Render all children
        for (const child of this.children) {
            child.render(obj, viewMatrix, projectionMatrix);
        }
    }
} 