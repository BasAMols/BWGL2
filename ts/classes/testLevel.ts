import { v3, Vector3 } from './util/math/vector3';
import { SceneObject } from './webgl2/meshes/sceneObject';
import { TickerReturnData } from './ticker';
import { Scene } from './webgl2/scene';
import { Camera } from './webgl2/camera';
import { SpotLight, DirectionalLight, PointLight } from './webgl2/lights/light';
import { Quaternion } from './util/math/quaternion';
import { Arrow } from './webgl2/meshes/arrow';
import { IcoSphere } from './webgl2/meshes/icoSphere';
import { Plane } from './webgl2/meshes/plane';
import { Material } from './webgl2/material';
import { v2, Vector2 } from './util/math/vector2';
import { Cube } from './webgl2/meshes/cube';
import { Wedge } from './webgl2/meshes/wedge';
import { Cone } from './webgl2/meshes/cone';
import { ContainerObject } from './webgl2/meshes/containerObject';

export class TestLevel extends Scene {
    private mesh: SceneObject;
    protected clearColor: [number, number, number, number] = [0.01, 0.01, 0.01, 1.0];  // Near-black background for better contrast
    arrow: Arrow;
    spotLight: SpotLight;
    spotLight2: SpotLight;
    spotLight3: SpotLight;
    static: SceneObject;
    mesh2: SceneObject;
    dynamic: SceneObject;
    backPlane: SceneObject;
    spotLight4: SpotLight;
    floorPlane: SceneObject;
    keyLight: DirectionalLight;

    constructor() {
        super(new Camera({ position: v3(0, 1, 6), target: v3(0, 0, 0), fov: 50 }), {
            ambientLightColor: v3(1, 1, 1),
            ambientLightIntensity: 0.001  // Increased to illuminate shadowed areas better
        });

        const rotation = new Quaternion();
        rotation.setAxisAngle(v3(1, 0, 0), 0);

        // Add a main directional light (key light) for better overall illumination
        this.keyLight = new DirectionalLight({
            direction: v3(-0.5, -1, -0.3).normalize(),
            color: v3(1, 0.98, 0.9),   // Slightly warm white
            intensity: 0.3             // Reduced from 1.2
        });
        this.addLight(this.keyLight);

        // Create floor plane with a smooth, polished concrete-like surface
        this.add(this.floorPlane = Plane.create({
            position: v3(0, -2, 0),
            scale: v2(10, 10),
            pickColor: 90,
            material: new Material({
                baseColor: v3(0.7, 0.7, 0.73),  // Light gray
                roughness: 0.3,                 // Somewhat polished
                metallic: 0.0,                  // Non-metallic
                ambientOcclusion: 1.0,
                emissive: v3(0, 0, 0)
            })
        }));

        // Create back wall with a plaster-like texture
        this.add(Plane.create({
            position: v3(0, 0.5, -4),
            scale: v2(5, 10),
            rotation: Quaternion.fromEuler(-Math.PI / 2, 0, Math.PI / 2),
            pickColor: 80,
            material: new Material({
                baseColor: v3(0.95, 0.95, 0.95),  // Off-white
                roughness: 0.85,                 // Rough plaster
                metallic: 0.0,                   // Non-metallic
                ambientOcclusion: 1.0,
                emissive: v3(0, 0, 0)
            })
        }));

        // Create front wall with a plaster-like texture
        this.add(this.backPlane = Plane.create({
            position: v3(0, 0.5, 4),
            flipNormal: true,
            scale: v2(5, 10),
            rotation: Quaternion.fromEuler(-Math.PI / 2, 0, Math.PI / 2),
        }));

        // Create main sphere with a more reflective material to better show colored lights
        this.add(this.mesh = IcoSphere.create({
            position: v3(0, 0, -2.5),
            scale: v3(2.5, 2.5, 2.5),
            smoothShading: true,
            subdivisions: 2,
            pickColor: 250,
            material: new Material({
                baseColor: v3(0.95, 0.95, 0.95),  // White to reflect colors better
                roughness: 0.4,                  // Very smooth for high reflectivity
                metallic: 1,                    // Highly metallic
                ambientOcclusion: 1.0,
                emissive: v3(0, 0, 0)
            })
        }));

        this.add(this.static = new ContainerObject({
            position: v3(1, 2, -1),
        }));

        // Create a variety of objects with different PBR materials
        for (let i = 0; i < 2; i++) {
            const container = new ContainerObject({
                position: v3(4.5 * i, 0, -4 * i),
                rotation: Quaternion.fromEuler(0, (Math.PI) * i, 0),
            });
            const positions = [
                v3(-2 + 5.5 * i, -1.25, -2 - 1),
                v3(-3.5 + 5.5 * i, -1.25, -2 - 1),
                v3(-2.75 + 5.5 * i, -1.25, -1),
                v3(-2.75 + 5.5 * i, 0.25, -1.64 - 0.6)
            ].sort(() => Math.random() - 0.5);

            // Create a sphere with smooth, ceramic-like material
            this.add(IcoSphere.create({
                position: positions[0],
                scale: v3(1.5, 1.5, 1.5),
                smoothShading: true,
                subdivisions: 2,
                parent: container,
                pickColor: 10,
                material: new Material({
                    baseColor: v3(0.2, 0.7, 0.9),  // Light blue
                    roughness: 0.2,               // Smooth ceramic
                    metallic: 0.0,                // Non-metallic
                    ambientOcclusion: 1.0,
                    emissive: v3(0, 0, 0)
                })
            }));

            // Create a cube with copper-like metal material
            this.add(Cube.create({
                position: positions[1],
                scale: v3(1.5, 1.5, 1.5),
                parent: container,
                pickColor: 20,
                material: new Material({
                    baseColor: v3(0.85, 0.45, 0.35),  // Copper color
                    roughness: 0.4,                  // Slightly rough copper
                    metallic: 0.9,                   // Highly metallic
                    ambientOcclusion: 1.0,
                    emissive: v3(0, 0, 0)
                })
            }));

            // Create a wedge with a rubber-like material
            this.add(Wedge.create({
                rotation: Quaternion.fromEuler(0, Math.PI / 2, 0),
                position: positions[2],
                scale: v3(1.5, 1.5, 1.5),
                parent: container,
                pickColor: 30,
                material: new Material({
                    baseColor: v3(0.15, 0.8, 0.15),  // Green
                    roughness: 0.9,                  // Very rough like rubber
                    metallic: 0.0,                   // Non-metallic
                    ambientOcclusion: 1.0,
                    emissive: v3(0, 0, 0)
                })
            }));

            // Create a cone with glowing, emissive properties
            this.add(Cone.create({
                position: positions[3],
                scale: v3(2, 1.5, 2),
                rotation: Quaternion.fromEuler(0, Math.PI / 2, 0),
                smoothShading: true,
                sides: 12,
                parent: container,
                pickColor: 40,
                material: new Material({
                    baseColor: v3(0.8, 0.3, 0.1),     // Orange-red
                    roughness: 0.5,                   // Medium roughness
                    metallic: 0.0,                    // Non-metallic
                    ambientOcclusion: 1.0,
                    emissive: v3(0.7, 0.2, 0.0)       // Strong orange glow
                })
            }));

            this.add(container);
        }

        // Add a soft fill light from above and back with reduced intensity
        this.addLight(new PointLight({
            position: v3(2, 5, -2),     // Above and behind
            color: v3(0.9, 0.95, 1.0),  // Slightly cool white
            intensity: 2.5,             // Reduced from 5.0
            meshContainer: this,
        }));

        // Add colored spotlights for dramatic effect - with much more saturated colors
        for (let i = 0; i < 3; i++) {
            let vari = ["spotLight", "spotLight2", "spotLight3"][i] as "spotLight" | "spotLight2" | "spotLight3";
            // Extremely saturated primary colors
            let color = [
                v3(1.0, 0.0, 0.0),  // Pure red
                v3(0.0, 0.0, 1.0),  // Pure blue
                v3(0.0, 1.0, 0.0)   // Pure green
            ][i];

            // More spread out positions for better color definition
            let position = [
                v3(4, 4, 2),    // Red light - right side
                v3(-4, 3, -2),  // Blue light - left back side
                v3(0, 5, -4)    // Green light - back center
            ][i];

            this[vari] = new SpotLight({
                position: position,
                color: color,
                intensity: 0.0,        // Much higher intensity
                cutOff: 0.92,
                outerCutOff: 0.85,
                meshContainer: this
            });

            // Direct each spotlight to illuminate a different part of the scene
            let target = [
                v3(-1, 0, 0),   // Red light targets left of center
                v3(1, -1, 0),   // Blue light targets right side, lower
                v3(0, 0, 1)     // Green light targets front of scene
            ][i];

            this[vari].lookAt(target);
            this.addLight(this[vari]);
        }

        // Add an interactive spotlight that follows mouse clicks
        this.spotLight4 = new SpotLight({
            position: v3(0, 5, 0),
            color: v3(1.0, 1.0, 1.0),     // Pure white
            intensity: 3.0,                // Moderate intensity
            cutOff: 0.92,
            outerCutOff: 0.85,
            meshContainer: this,
        });
        this.spotLight4.lookAt(v3(0, 0, 0));
        this.addLight(this.spotLight4);

        this.camera.setPosition(this.mesh.transform.getWorldPosition());

        // Initial click to position interactive spotlight
        this.click(v2(0.5, 0.3));
    }

    click(vector2: Vector2) {
        super.click(vector2);
        const pos2 = Vector3.screenToWorldPlane(vector2, this.camera, v3(0, 0, 1), 4);

        if (pos2) {
            // Keep the light at a constant height but track the position
            this.spotLight4.setPosition(pos2);
            this.spotLight4.lookAt(v3(0, 0, 0));
        }

    }

    tick(obj: TickerReturnData) {
        super.tick(obj);

        // Rotate the sphere slowly
        if (this.mesh) {
            const rotation = new Quaternion();
            rotation.setAxisAngle(v3(0, 1, 0), 0.01);
            this.mesh.transform.setRotation(
                rotation.multiply(this.mesh.transform.getLocalRotation())
            );
        }

        // Animate the colored spotlights with completely different patterns
        const t = obj.total * 0.0003; // Slower animation

        // Red spotlight - horizontal figure-8 pattern
        this.spotLight.setPosition(
            4 * Math.sin(t),
            4 + Math.sin(t * 0.5) * 0.5,  // Small vertical movement
            2 * Math.cos(t * 2)           // Figure-8 by using 2x frequency
        );
        // Keep focusing on left side of scene
        this.spotLight.lookAt(v3(-1 + Math.sin(t * 0.2), 0, 0));

        // Blue spotlight - vertical circle pattern
        this.spotLight2.setPosition(
            -4 + Math.cos(t) * 0.7,       // Small horizontal movement
            3 + Math.sin(t * 0.7) * 1.5,  // Larger vertical movement
            -2 + Math.sin(t) * 0.7        // Small depth movement
        );
        // Keep focusing on right side of scene
        this.spotLight2.lookAt(v3(1, -1 + Math.sin(t * 0.3), 0));

        // Green spotlight - swooping pattern
        this.spotLight3.setPosition(
            Math.sin(t + Math.PI / 4) * 2,  // Horizontal arc
            5 + Math.cos(t) * 0.5,        // Small height change
            -4 + Math.sin(t * 0.5) * 1.2  // Depth movement
        );
        // Keep focusing on center front
        this.spotLight3.lookAt(v3(0, 0, 1 + Math.sin(t * 0.4)));

        this.camera.setPosition(
            v3(
                (Math.sin(obj.total * 0.0008) % 1) * 5,
                (Math.sin(obj.total * 0.0012) % 1) * 1,
                (Math.sin(obj.total * 0.0005) % 1) * 2 + 9,
            )
        );
    }
}