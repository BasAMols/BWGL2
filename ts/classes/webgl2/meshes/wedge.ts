import { MeshData } from './types';
import { BaseMesh, BaseMeshProps } from './baseMesh';
import { SceneObject } from './sceneObject';
import { Material } from '../material';
import { v3 } from '../../util/math/vector3';

export interface WedgeProps extends BaseMeshProps {
    // Colors for [front, back, bottom, right, hypotenuse]
    colors?: [number, number, number] | Array<[number, number, number]>;
}

export class Wedge extends BaseMesh {
    private static generateMeshData(
        colors?: [number, number, number] | Array<[number, number, number]>
    ): MeshData {
        const vertices: number[] = [];
        const indices: number[] = [];
        const normals: number[] = [];
        const generatedColors: number[] = [];
        const texCoords: number[] = [];
        const tangents: number[] = [];
        const bitangents: number[] = [];

        // Default colors
        const defaultColors: Array<[number, number, number]> = [
            [1.0, 0.0, 0.0], // Front triangle - Red
            [0.0, 1.0, 0.0], // Back triangle - Green
            [0.0, 0.0, 1.0], // Bottom rectangle - Blue
            [1.0, 0.0, 1.0], // Left rectangle - Magenta
            [1.0, 1.0, 0.0]  // Hypotenuse rectangle - Yellow
        ];

        let faceColors = defaultColors;
        if (colors) {
            if (Array.isArray(colors[0])) {
                faceColors = colors as Array<[number, number, number]>;
                if (faceColors.length !== 5) {
                    throw new Error('Must provide exactly 5 colors for faces or a single color');
                }
            } else {
                const singleColor = colors as [number, number, number];
                faceColors = Array(5).fill(singleColor);
            }
        }

        // Define vertices for each face separately
        vertices.push(
            // Front triangle
            -0.5, -0.5,  0.5,  // 0
             0.5, -0.5,  0.5,  // 1
            -0.5,  0.5,  0.5,  // 2
            // Back triangle
            -0.5, -0.5, -0.5,  // 3
             0.5, -0.5, -0.5,  // 4
            -0.5,  0.5, -0.5,  // 5
            // Bottom rectangle
            -0.5, -0.5,  0.5,  // 6
             0.5, -0.5,  0.5,  // 7
            -0.5, -0.5, -0.5,  // 8
             0.5, -0.5, -0.5,  // 9
            // Left rectangle (vertical face)
            -0.5, -0.5, -0.5,  // 10
            -0.5,  0.5, -0.5,  // 11
            -0.5, -0.5,  0.5,  // 12
            -0.5,  0.5,  0.5,  // 13
            // Hypotenuse rectangle (sloped face)
             0.5, -0.5, -0.5,  // 14
             0.5, -0.5,  0.5,  // 15
            -0.5,  0.5, -0.5,  // 16
            -0.5,  0.5,  0.5   // 17
        );

        // Define face normals
        const frontNormal = [0, 0, 1];         // Points forward
        const backNormal = [0, 0, -1];         // Points backward
        const bottomNormal = [0, -1, 0];       // Points down
        const leftNormal = [-1, 0, 0];         // Points left
        const hypotenuseNormal = [0.7071, 0.7071, 0];  // Points diagonal up-right (45 degrees)

        // Define tangent vectors for each face
        const frontTangent = [1, 0, 0];       // Points right on front face
        const backTangent = [-1, 0, 0];       // Points left on back face
        const bottomTangent = [1, 0, 0];      // Points right on bottom face
        const leftTangent = [0, 0, 1];        // Points forward on left face
        const hypotenuseTangent = [0.7071, -0.7071, 0]; // Perpendicular to normal along the slope
        
        // Define bitangent vectors (cross product of normal and tangent)
        const frontBitangent = [0, 1, 0];     // Points up on front face
        const backBitangent = [0, 1, 0];      // Points up on back face
        const bottomBitangent = [0, 0, -1];   // Points back on bottom face
        const leftBitangent = [0, 1, 0];      // Points up on left face
        const hypotenuseBitangent = [0, 0, -1]; // Points back on hypotenuse face

        // Add normals for each face
        for (let i = 0; i < 3; i++) normals.push(...frontNormal);     // Front triangle
        for (let i = 0; i < 3; i++) normals.push(...backNormal);      // Back triangle
        for (let i = 0; i < 4; i++) normals.push(...bottomNormal);    // Bottom rectangle
        for (let i = 0; i < 4; i++) normals.push(...leftNormal);      // Left rectangle
        for (let i = 0; i < 4; i++) normals.push(...hypotenuseNormal); // Hypotenuse rectangle

        // Add tangents for each face
        for (let i = 0; i < 3; i++) tangents.push(...frontTangent);     // Front triangle
        for (let i = 0; i < 3; i++) tangents.push(...backTangent);      // Back triangle
        for (let i = 0; i < 4; i++) tangents.push(...bottomTangent);    // Bottom rectangle
        for (let i = 0; i < 4; i++) tangents.push(...leftTangent);      // Left rectangle
        for (let i = 0; i < 4; i++) tangents.push(...hypotenuseTangent); // Hypotenuse rectangle
        
        // Add bitangents for each face
        for (let i = 0; i < 3; i++) bitangents.push(...frontBitangent);     // Front triangle
        for (let i = 0; i < 3; i++) bitangents.push(...backBitangent);      // Back triangle
        for (let i = 0; i < 4; i++) bitangents.push(...bottomBitangent);    // Bottom rectangle
        for (let i = 0; i < 4; i++) bitangents.push(...leftBitangent);      // Left rectangle
        for (let i = 0; i < 4; i++) bitangents.push(...hypotenuseBitangent); // Hypotenuse rectangle

        // Add colors for each face
        for (let i = 0; i < 3; i++) generatedColors.push(...faceColors[0]); // Front triangle - Red
        for (let i = 0; i < 3; i++) generatedColors.push(...faceColors[1]); // Back triangle - Green
        for (let i = 0; i < 4; i++) generatedColors.push(...faceColors[2]); // Bottom rectangle - Blue
        for (let i = 0; i < 4; i++) generatedColors.push(...faceColors[3]); // Left rectangle - Magenta
        for (let i = 0; i < 4; i++) generatedColors.push(...faceColors[4]); // Hypotenuse rectangle - Yellow

        // Add texture coordinates
        texCoords.push(
            // Front triangle
            0, 0,
            1, 0,
            0, 1,
            // Back triangle
            0, 0,
            1, 0,
            0, 1,
            // Bottom rectangle
            0, 0,
            1, 0,
            0, 1,
            1, 1,
            // Left rectangle
            0, 0,
            1, 0,
            0, 1,
            1, 1,
            // Hypotenuse rectangle
            0, 0,
            1, 0,
            0, 1,
            1, 1
        );

        // Add indices with correct winding order (CCW when looking at face from outside)
        indices.push(
            // Front triangle
            0, 1, 2,
            // Back triangle (reverse winding for back face)
            3, 5, 4,
            // Bottom rectangle
            6, 8, 7,
            7, 8, 9,
            // Left rectangle (CCW when looking from left side)
            10, 12, 11,
            12, 13, 11,
            // Hypotenuse rectangle
            14, 16, 15,
            15, 16, 17
        );

        return {
            vertices: new Float32Array(vertices),
            indices: new Uint16Array(indices),
            normals: new Float32Array(normals),
            colors: new Float32Array(generatedColors),
            texCoords: new Float32Array(texCoords),
            tangents: new Float32Array(tangents),
            bitangents: new Float32Array(bitangents)
        };
    }

    public static create(props: WedgeProps = {}): SceneObject {
        // Create default material based on colors if no material provided
        if (!props.material && props.colors) {
            let baseColor;
            if (Array.isArray(props.colors[0])) {
                // If multiple colors, use the first one
                const firstColor = (props.colors as Array<[number, number, number]>)[0];
                baseColor = v3(firstColor[0], firstColor[1], firstColor[2]);
            } else {
                // Single color - cast to the correct type
                const singleColor = props.colors as [number, number, number];
                baseColor = v3(singleColor[0], singleColor[1], singleColor[2]);
            }
            
            props = {
                ...props,
                material: new Material({
                    baseColor,
                    roughness: 0.5,
                    metallic: 0.0,
                    ambientOcclusion: 1.0,
                    emissive: v3(0, 0, 0)
                })
            };
        }
        
        // If material exists but no colors provided, create colors from material
        let meshColors = props.colors;
        if (props.material && !meshColors) {
            const { baseColor } = props.material;
            meshColors = [baseColor.x, baseColor.y, baseColor.z];
        }
        
        const meshData = this.generateMeshData(meshColors);
        const sceneObject = this.createSceneObject(meshData, props);
        
        // The material is now set in the SceneObject constructor
        // and applied during each render call
        
        return sceneObject;
    }
} 