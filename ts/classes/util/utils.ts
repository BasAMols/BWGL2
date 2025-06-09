import { Vector3 } from "./math/vector3";
import { Vector2 } from "./math/vector2";
import { Quaternion } from "./math/quaternion";

export abstract class Util {
    public static clamp(value: number, min: number, max: number) {
        return Math.max(Math.min(value, max), min);
    }
    public static to0(value: number, tolerance: number = 0.1) {
        return Math.abs(value) < tolerance ? 0 : value;
    }
    public static chunk(array: unknown[], size: number): typeof array[]{
        const output: unknown[][] = [];
        for (let i=0; i < array.length; i += size) {
            output.push(array.slice(i, i + size));
        }
        return output;
    }
    public static duplicate(array: unknown[], size: number): unknown[]{
        const output: unknown[] = [];
        array.forEach((v) => {
            for (let i=0; i < size; i++) {
                output.push(v);
            }
        })
        return output;
    }

    public static padArray(ar: any[], b: any, len: number) {
        return ar.concat(Array.from(Array(len).fill(b))).slice(0, len);
    }

    public static addArrays(ar: number[], br: number[]) {
        return ar.map((a, i) => a + br[i]);
    }

    public static subtractArrays(ar: number[], br: number[]) {
        return ar.map((a, i) => a - br[i]);
    }

    public static multiplyArrays(ar: number[], br: number[]) {
        return ar.map((a, i) => a * br[i]);
    }

    public static scaleArrays(ar: number[], b: number) {
        return ar.map((a, i) => a * b);
    }

    public static radToDeg(r: number) {
        return r * 180 / Math.PI;
    }

    public static degToRad(d: number) {
        return d * Math.PI / 180;
    }

    public static closestVectorMagnitude(vectors: Vector3[], target: number): Vector3 {
        let current: Vector3;
        vectors.forEach((v) => {
            if (current === undefined || Math.abs(v.magnitude()) < Math.abs(current.magnitude())) current = v;
        });
        return current;
    }

    // Linear interpolation (lerp) method with TypeScript overloads
    public static lerp(from: number, to: number, t: number, options?: { scale?: number; ease?: (n: number) => number; clamp?: boolean }): number;
    public static lerp(from: Vector2, to: Vector2, t: number, options?: { scale?: number; ease?: (n: number) => number; clamp?: boolean }): Vector2;
    public static lerp(from: Vector3, to: Vector3, t: number, options?: { scale?: number; ease?: (n: number) => number; clamp?: boolean }): Vector3;
    public static lerp(from: Quaternion, to: Quaternion, t: number, options?: { scale?: number; ease?: (n: number) => number; clamp?: boolean }): Quaternion;
    public static lerp(from: number | Vector2 | Vector3 | Quaternion, to: number | Vector2 | Vector3 | Quaternion, t: number, options?: { scale?: number; ease?: (n: number) => number; clamp?: boolean }): number | Vector2 | Vector3 | Quaternion {
        const { scale, ease, clamp } = options || {};
        
        // Apply ease function to t if provided
        if (ease) {
            t = ease(t);
        }
        
        // Clamp t based on options or default behavior
        if (clamp === true || (clamp !== false && !ease)) {
            t = this.clamp(t, 0, 1);
        }
        
        // Handle number lerp
        if (typeof from === 'number' && typeof to === 'number') {
            const result = from + (to - from) * t;
            return scale !== undefined ? result * scale : result;
        }
        
        // Handle Vector2 lerp
        if (from instanceof Vector2 && to instanceof Vector2) {
            const result = new Vector2(
                from.x + (to.x - from.x) * t,
                from.y + (to.y - from.y) * t
            );
            return scale !== undefined ? result.scale(scale) : result;
        }
        
        // Handle Vector3 lerp
        if (from instanceof Vector3 && to instanceof Vector3) {
            const result = new Vector3(
                from.x + (to.x - from.x) * t,
                from.y + (to.y - from.y) * t,
                from.z + (to.z - from.z) * t
            );
            return scale !== undefined ? result.scale(scale) : result;
        }
        
        // Handle Quaternion lerp (NLERP - Normalized Linear Interpolation)
        // Note: scale parameter is ignored for quaternions as it doesn't make sense
        if (from instanceof Quaternion && to instanceof Quaternion) {
            // Calculate dot product to determine if we need to negate one quaternion
            const dot = from.x * to.x + from.y * to.y + from.z * to.z + from.w * to.w;
            
            // If dot product is negative, negate one quaternion to take shorter path
            const toQuat = dot < 0 ? new Quaternion(-to.x, -to.y, -to.z, -to.w) : to;
            
            // Linear interpolation
            const result = new Quaternion(
                from.x + (toQuat.x - from.x) * t,
                from.y + (toQuat.y - from.y) * t,
                from.z + (toQuat.z - from.z) * t,
                from.w + (toQuat.w - from.w) * t
            );
            
            // Normalize the result
            const magnitude = Math.sqrt(result.x * result.x + result.y * result.y + result.z * result.z + result.w * result.w);
            if (magnitude > 0) {
                result.x /= magnitude;
                result.y /= magnitude;
                result.z /= magnitude;
                result.w /= magnitude;
            }
            
            return result;
        }
        
        throw new Error('Unsupported types for lerp operation');
    }
}