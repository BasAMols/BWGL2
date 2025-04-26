import { SceneObject } from '../webgl2/meshes/sceneObject';
import { v3, Vector3 } from '../util/math/vector3';

export enum ColliderType {
    STATIC,
    DYNAMIC
}

export interface Collider {
    object: SceneObject;
    type: ColliderType;
    size: Vector3;
    lastPosition: Vector3;
}

export class CollisionManager {
    private colliders: Collider[] = [];
    // Small buffer to prevent objects from continuously colliding
    private collisionBuffer: number = 0.001;
    
    constructor() {}
    
    /**
     * Add an object to the collision system
     * @param object The scene object to add
     * @param type Whether the object is static or dynamic
     * @param size Optional custom bounding box size (uses object's scale if not provided)
     */
    public addObject(object: SceneObject, type: ColliderType, size?: Vector3): void {
        const collider: Collider = {
            object,
            type,
            size: size || object.transform.getLocalScale(),
            lastPosition: object.transform.getWorldPosition().clone()
        };
        
        this.colliders.push(collider);
    }
    
    /**
     * Remove an object from the collision system
     */
    public removeObject(object: SceneObject): void {
        const index = this.colliders.findIndex(c => c.object === object);
        if (index !== -1) {
            this.colliders.splice(index, 1);
        }
    }
    
    /**
     * Get vertices of a cuboid in world space
     */
    private getWorldVertices(collider: Collider): Vector3[] {
        const object = collider.object;
        const size = collider.size;
        
        // Calculate half extents
        const halfExtents = size.scale(0.5);
        
        // Create local vertices
        const localVertices = [
            v3(-halfExtents.x, -halfExtents.y, -halfExtents.z),
            v3(halfExtents.x, -halfExtents.y, -halfExtents.z),
            v3(halfExtents.x, -halfExtents.y, halfExtents.z),
            v3(-halfExtents.x, -halfExtents.y, halfExtents.z),
            v3(-halfExtents.x, halfExtents.y, -halfExtents.z),
            v3(halfExtents.x, halfExtents.y, -halfExtents.z),
            v3(halfExtents.x, halfExtents.y, halfExtents.z),
            v3(-halfExtents.x, halfExtents.y, halfExtents.z)
        ];
        
        // Transform to world space
        const worldMatrix = object.transform.getWorldMatrix();
        return localVertices.map(vertex => {
            // Apply transformation manually since transformPoint doesn't exist
            const x = worldMatrix.mat4[0] * vertex.x + worldMatrix.mat4[4] * vertex.y + worldMatrix.mat4[8] * vertex.z + worldMatrix.mat4[12];
            const y = worldMatrix.mat4[1] * vertex.x + worldMatrix.mat4[5] * vertex.y + worldMatrix.mat4[9] * vertex.z + worldMatrix.mat4[13];
            const z = worldMatrix.mat4[2] * vertex.x + worldMatrix.mat4[6] * vertex.y + worldMatrix.mat4[10] * vertex.z + worldMatrix.mat4[14];
            return v3(x, y, z);
        });
    }
    
    /**
     * Get axes for Separating Axis Theorem
     */
    private getAxes(vertices1: Vector3[], vertices2: Vector3[]): Vector3[] {
        const axes: Vector3[] = [];
        
        // Face normals from the first object
        axes.push(vertices1[1].subtract(vertices1[0]).normalize());
        axes.push(vertices1[4].subtract(vertices1[0]).normalize());
        axes.push(vertices1[3].subtract(vertices1[0]).normalize());
        
        // Face normals from the second object
        axes.push(vertices2[1].subtract(vertices2[0]).normalize());
        axes.push(vertices2[4].subtract(vertices2[0]).normalize());
        axes.push(vertices2[3].subtract(vertices2[0]).normalize());
        
        // Edge cross products
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const crossProduct = axes[i].cross(axes[3 + j]);
                
                // Skip if cross product is too small (parallel edges)
                if (crossProduct.magnitude() > 0.001) {
                    axes.push(crossProduct.normalize());
                }
            }
        }
        
        return axes;
    }
    
    /**
     * Project vertices onto an axis
     */
    private projectVertices(vertices: Vector3[], axis: Vector3): { min: number, max: number } {
        let min = vertices[0].dot(axis);
        let max = min;
        
        for (let i = 1; i < vertices.length; i++) {
            const projection = vertices[i].dot(axis);
            min = Math.min(min, projection);
            max = Math.max(max, projection);
        }
        
        return { min, max };
    }
    
    /**
     * Check if two colliders intersect using Separating Axis Theorem
     */
    private testCollision(collider1: Collider, collider2: Collider): { collision: boolean, mtv?: Vector3 } {
        // Get vertices in world space
        const vertices1 = this.getWorldVertices(collider1);
        const vertices2 = this.getWorldVertices(collider2);
        
        // Get axes for SAT
        const axes = this.getAxes(vertices1, vertices2);
        
        let minOverlap = Infinity;
        let minAxis: Vector3 = v3(0);
        
        // Test all axes
        for (const axis of axes) {
            const proj1 = this.projectVertices(vertices1, axis);
            const proj2 = this.projectVertices(vertices2, axis);
            
            // Check for overlap
            const overlap = Math.min(proj1.max, proj2.max) - Math.max(proj1.min, proj2.min);
            
            // If there's no overlap on any axis, objects don't intersect
            if (overlap < 0) {
                return { collision: false };
            }
            
            // Keep track of minimum overlap
            if (overlap < minOverlap) {
                minOverlap = overlap;
                minAxis = axis;
                
                // Ensure MTV points from collider1 to collider2
                const center1 = vertices1.reduce((sum, v) => sum.add(v), v3(0)).scale(1/vertices1.length);
                const center2 = vertices2.reduce((sum, v) => sum.add(v), v3(0)).scale(1/vertices2.length);
                
                if (center1.subtract(center2).dot(minAxis) > 0) {
                    minAxis = minAxis.scale(-1);
                }
            }
        }
        
        // If we get here, there is a collision
        return { 
            collision: true, 
            mtv: minAxis.scale(minOverlap) 
        };
    }
    
    /**
     * Perform axis-aligned box check (faster than SAT)
     */
    private testAABB(collider1: Collider, collider2: Collider): boolean {
        // Get world transforms
        const vertices1 = this.getWorldVertices(collider1);
        const vertices2 = this.getWorldVertices(collider2);
        
        // Compute AABB bounds
        let min1 = vertices1[0].clone();
        let max1 = vertices1[0].clone();
        let min2 = vertices2[0].clone();
        let max2 = vertices2[0].clone();
        
        for (let i = 1; i < 8; i++) {
            min1.x = Math.min(min1.x, vertices1[i].x);
            min1.y = Math.min(min1.y, vertices1[i].y);
            min1.z = Math.min(min1.z, vertices1[i].z);
            
            max1.x = Math.max(max1.x, vertices1[i].x);
            max1.y = Math.max(max1.y, vertices1[i].y);
            max1.z = Math.max(max1.z, vertices1[i].z);
            
            min2.x = Math.min(min2.x, vertices2[i].x);
            min2.y = Math.min(min2.y, vertices2[i].y);
            min2.z = Math.min(min2.z, vertices2[i].z);
            
            max2.x = Math.max(max2.x, vertices2[i].x);
            max2.y = Math.max(max2.y, vertices2[i].y);
            max2.z = Math.max(max2.z, vertices2[i].z);
        }
        
        // Check for overlap on all axes
        return (
            min1.x <= max2.x && max1.x >= min2.x &&
            min1.y <= max2.y && max1.y >= min2.y &&
            min1.z <= max2.z && max1.z >= min2.z
        );
    }
    
    /**
     * Update the collision system
     */
    public update(): void {
        // Update last positions
        for (const collider of this.colliders) {
            collider.lastPosition = collider.object.transform.getWorldPosition().clone();
        }
        
        // Check all collider pairs
        for (let i = 0; i < this.colliders.length; i++) {
            const collider1 = this.colliders[i];
            
            for (let j = i + 1; j < this.colliders.length; j++) {
                const collider2 = this.colliders[j];
                
                // Skip if both objects are static
                if (collider1.type === ColliderType.STATIC && collider2.type === ColliderType.STATIC) {
                    continue;
                }
                
                // Quick AABB check first
                if (!this.testAABB(collider1, collider2)) {
                    continue;
                }
                
                // Perform detailed collision check with SAT
                const result = this.testCollision(collider1, collider2);
                
                if (result.collision && result.mtv) {
                    this.resolveCollision(collider1, collider2, result.mtv);
                }
            }
        }
    }
    
    /**
     * Resolve collision between two objects
     */
    private resolveCollision(collider1: Collider, collider2: Collider, mtv: Vector3): void {
        // Add a small buffer to prevent continuous collisions
        const bufferedMtv = mtv.scale(1 + this.collisionBuffer);
        
        // Both dynamic - share the displacement
        if (collider1.type === ColliderType.DYNAMIC && collider2.type === ColliderType.DYNAMIC) {
            const worldPos1 = collider1.object.transform.getWorldPosition();
            const worldPos2 = collider2.object.transform.getWorldPosition();
            
            // Move each object half the mtv
            collider1.object.transform.setPosition(worldPos1.add(bufferedMtv.scale(0.5)));
            collider2.object.transform.setPosition(worldPos2.subtract(bufferedMtv.scale(0.5)));
        } 
        // First is dynamic, second is static
        else if (collider1.type === ColliderType.DYNAMIC && collider2.type === ColliderType.STATIC) {
            const worldPos = collider1.object.transform.getWorldPosition();
            collider1.object.transform.setPosition(worldPos.subtract(bufferedMtv));
        } 
        // First is static, second is dynamic
        else if (collider1.type === ColliderType.STATIC && collider2.type === ColliderType.DYNAMIC) {
            const worldPos = collider2.object.transform.getWorldPosition();
            collider2.object.transform.setPosition(worldPos.add(bufferedMtv));
        }
    }
} 