import { SceneObject } from '../webgl2/meshes/sceneObject';
import { v3, Vector3 } from '../util/math/vector3';

export enum ColliderType {
    STATIC,
    DYNAMIC
}

export enum ColliderShape {
    CUBOID,
    SPHERE
}

export interface Collider {
    object: SceneObject;
    type: ColliderType;
    shape: ColliderShape;
    size: Vector3;
    radius?: number;
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
     * @param shape The shape of the collider (CUBOID or SPHERE)
     * @param radius Optional radius for sphere colliders (uses max of object's scale components if not provided)
     */
    public addObject(object: SceneObject, type: ColliderType, size?: Vector3, shape: ColliderShape = ColliderShape.CUBOID, radius?: number): void {
        const objectSize = size || object.transform.getLocalScale();
        
        // If shape is sphere and no radius provided, use the max scale component
        let sphereRadius = radius;
        if (shape === ColliderShape.SPHERE && !sphereRadius) {
            sphereRadius = Math.max(objectSize.x, objectSize.y, objectSize.z) / 2;
        }
        
        const collider: Collider = {
            object,
            type,
            shape,
            size: objectSize,
            radius: sphereRadius,
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
     * Check if two cuboids intersect using Separating Axis Theorem
     */
    private testCuboidCollision(collider1: Collider, collider2: Collider): { collision: boolean, mtv?: Vector3 } {
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
     * Test collision between two sphere colliders
     */
    private testSphereCollision(collider1: Collider, collider2: Collider): { collision: boolean, mtv?: Vector3 } {
        const center1 = collider1.object.transform.getWorldPosition();
        const center2 = collider2.object.transform.getWorldPosition();
        
        const radius1 = collider1.radius || 0.5;
        const radius2 = collider2.radius || 0.5;
        
        // Calculate distance between centers
        const distanceVector = center2.subtract(center1);
        const distance = distanceVector.magnitude();
        
        // Combined radius
        const combinedRadius = radius1 + radius2;
        
        // Check for collision
        if (distance < combinedRadius) {
            // Create MTV that points from center1 to center2
            const direction = distance > 0.001 ? distanceVector.scale(1/distance) : v3(1, 0, 0);
            const penetration = combinedRadius - distance;
            
            return {
                collision: true,
                mtv: direction.scale(penetration) // Note the negative scale to move away from collision
            };
        }
        
        return { collision: false };
    }
    
    /**
     * Test collision between a sphere and a cuboid
     */
    private testSphereCuboidCollision(sphereCollider: Collider, cuboidCollider: Collider): { collision: boolean, mtv?: Vector3 } {
        const sphereCenter = sphereCollider.object.transform.getWorldPosition();
        const sphereRadius = sphereCollider.radius || 0.5;
        
        // Get cuboid vertices
        const cuboidVertices = this.getWorldVertices(cuboidCollider);
        
        // Calculate cuboid center
        const cuboidCenter = cuboidVertices.reduce((sum, v) => sum.add(v), v3(0)).scale(1/cuboidVertices.length);
        
        // Direction from cuboid to sphere
        const toSphere = sphereCenter.subtract(cuboidCenter);
        
        // Find closest point on cuboid to sphere
        let closestPoint = sphereCenter.clone();
        let minDistance = Infinity;
        
        // For each face of the cuboid
        for (let i = 0; i < 6; i++) {
            let faceIndices: number[];
            
            // Define indices for each face (0-7 are vertices indices)
            switch(i) {
                case 0: faceIndices = [0, 1, 2, 3]; break; // Bottom
                case 1: faceIndices = [4, 5, 6, 7]; break; // Top
                case 2: faceIndices = [0, 1, 5, 4]; break; // Front
                case 3: faceIndices = [2, 3, 7, 6]; break; // Back
                case 4: faceIndices = [0, 3, 7, 4]; break; // Left
                case 5: faceIndices = [1, 2, 6, 5]; break; // Right
                default: faceIndices = [0, 1, 2, 3]; // Default to bottom face
            }
            
            // Get face vertices
            const v1 = cuboidVertices[faceIndices[0]];
            const v2 = cuboidVertices[faceIndices[1]];
            const v3 = cuboidVertices[faceIndices[2]];
            
            // Calculate face normal
            const edge1 = v2.subtract(v1);
            const edge2 = v3.subtract(v1);
            const normal = edge1.cross(edge2).normalize();
            
            // Project sphere center onto face plane
            const distToPlane = v1.subtract(sphereCenter).dot(normal);
            
            // Check if sphere intersects this face
            if (Math.abs(distToPlane) < sphereRadius) {
                // Calculate closest point on face to sphere center
                const projected = sphereCenter.add(normal.scale(distToPlane));
                
                // Check if this point is inside the face
                if (this.pointInFace(projected, [v1, v2, v3, cuboidVertices[faceIndices[3]]])) {
                    if (Math.abs(distToPlane) < minDistance) {
                        minDistance = Math.abs(distToPlane);
                        closestPoint = projected;
                    }
                }
            }
        }
        
        // If we found a collision
        if (minDistance < sphereRadius) {
            // Direction from closest point to sphere center
            const mtv = sphereCenter.subtract(closestPoint);
            const distance = mtv.magnitude();
            
            if (distance < 0.001) {
                // Handle case where sphere center is on the cuboid
                const sphereToCuboid = cuboidCenter.subtract(sphereCenter).normalize();
                return {
                    collision: true,
                    mtv: sphereToCuboid.scale(-(sphereRadius - minDistance)) // Move sphere away from cuboid
                };
            }
            
            // Normalize direction and scale by penetration depth
            return {
                collision: true,
                mtv: mtv.scale((sphereRadius - distance) / distance) // Move sphere away from cuboid
            };
        }
        
        return { collision: false };
    }
    
    /**
     * Check if a point is inside a quadrilateral face
     */
    private pointInFace(point: Vector3, faceVertices: Vector3[]): boolean {
        // Simplified check - calculate if point is inside the bounding box of the face
        const min = v3(
            Math.min(...faceVertices.map(v => v.x)),
            Math.min(...faceVertices.map(v => v.y)),
            Math.min(...faceVertices.map(v => v.z))
        );
        
        const max = v3(
            Math.max(...faceVertices.map(v => v.x)),
            Math.max(...faceVertices.map(v => v.y)),
            Math.max(...faceVertices.map(v => v.z))
        );
        
        return (
            point.x >= min.x && point.x <= max.x &&
            point.y >= min.y && point.y <= max.y &&
            point.z >= min.z && point.z <= max.z
        );
    }
    
    /**
     * Perform axis-aligned box check (faster than SAT)
     */
    private testAABB(collider1: Collider, collider2: Collider): boolean {
        // Special case for sphere colliders
        if (collider1.shape === ColliderShape.SPHERE || collider2.shape === ColliderShape.SPHERE) {
            // For sphere-sphere, we'll do a quick distance check
            if (collider1.shape === ColliderShape.SPHERE && collider2.shape === ColliderShape.SPHERE) {
                const center1 = collider1.object.transform.getWorldPosition();
                const center2 = collider2.object.transform.getWorldPosition();
                const radius1 = collider1.radius || 0.5;
                const radius2 = collider2.radius || 0.5;
                
                const maxDistance = radius1 + radius2;
                const actualDistance = center1.subtract(center2).magnitude();
                
                return actualDistance < maxDistance;
            }
            
            // For sphere-cuboid, we'll use the AABB of the cuboid and expand it by the sphere radius
            const sphereCollider = collider1.shape === ColliderShape.SPHERE ? collider1 : collider2;
            const cuboidCollider = collider1.shape === ColliderShape.CUBOID ? collider1 : collider2;
            
            const sphereCenter = sphereCollider.object.transform.getWorldPosition();
            const sphereRadius = sphereCollider.radius || 0.5;
            
            const vertices = this.getWorldVertices(cuboidCollider);
            
            let min = vertices[0].clone();
            let max = vertices[0].clone();
            
            for (let i = 1; i < 8; i++) {
                min.x = Math.min(min.x, vertices[i].x);
                min.y = Math.min(min.y, vertices[i].y);
                min.z = Math.min(min.z, vertices[i].z);
                
                max.x = Math.max(max.x, vertices[i].x);
                max.y = Math.max(max.y, vertices[i].y);
                max.z = Math.max(max.z, vertices[i].z);
            }
            
            // Expand AABB by sphere radius
            min = min.subtract(v3(sphereRadius, sphereRadius, sphereRadius));
            max = max.add(v3(sphereRadius, sphereRadius, sphereRadius));
            
            // Check if sphere center is inside expanded AABB
            return (
                sphereCenter.x >= min.x && sphereCenter.x <= max.x &&
                sphereCenter.y >= min.y && sphereCenter.y <= max.y &&
                sphereCenter.z >= min.z && sphereCenter.z <= max.z
            );
        }
        
        // Standard AABB check for cuboid-cuboid
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
     * Test collision between any two collider shapes
     */
    private testCollision(collider1: Collider, collider2: Collider): { collision: boolean, mtv?: Vector3 } {
        // Handle different shape combinations
        if (collider1.shape === ColliderShape.SPHERE && collider2.shape === ColliderShape.SPHERE) {
            // Sphere-Sphere collision
            return this.testSphereCollision(collider1, collider2);
        } 
        else if (collider1.shape === ColliderShape.CUBOID && collider2.shape === ColliderShape.CUBOID) {
            // Cuboid-Cuboid collision using SAT
            return this.testCuboidCollision(collider1, collider2);
        }
        else {
            // Sphere-Cuboid collision
            const sphereCollider = collider1.shape === ColliderShape.SPHERE ? collider1 : collider2;
            const cuboidCollider = collider1.shape === ColliderShape.CUBOID ? collider1 : collider2;
            
            return this.testSphereCuboidCollision(sphereCollider, cuboidCollider);
        }
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
                
                // Perform detailed collision check based on shapes
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
            collider1.object.transform.setPosition(worldPos1.subtract(bufferedMtv.scale(0.5)));
            collider2.object.transform.setPosition(worldPos2.add(bufferedMtv.scale(0.5)));
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