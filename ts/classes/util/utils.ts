import { Vector3 } from "./math/vector3";
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


}