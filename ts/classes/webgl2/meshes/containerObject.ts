import { SceneObject, SceneObjectProps } from './sceneObject';
import { Matrix4 } from '../../util/math/matrix4';

/**
 * A specialized SceneObject that acts as a container for other scene objects.
 * It only handles transforms and parenting without any rendering functionality.
 */
export class ContainerObject extends SceneObject {
    constructor(props: SceneObjectProps = {}) {
        // Create a dummy SceneObjectData with minimal requirements
        const dummyData = {
            vao: null as any,
            indexBuffer: null as any,
            drawCount: 0
        };
        
        super(dummyData, props);
    }

    /**
     * Override render to do nothing since this is just a container
     */
    public render(viewMatrix: Matrix4, projectionMatrix: Matrix4): void {
        // No rendering needed for containers
    }
} 