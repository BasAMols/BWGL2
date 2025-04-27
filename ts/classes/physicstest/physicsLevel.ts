import { v3 } from '../util/math/vector3';
import { TickerReturnData } from '../ticker';
import { Scene } from '../webgl2/scene';
import { Camera } from '../webgl2/camera';
import { UI, UIElement } from '../elements/UI';
import { v2 } from '../util/math/vector2';
import { Cube } from '../webgl2/meshes/cube';
import { PlaneMesh } from '../webgl2/meshes/plane';
import { Material } from '../webgl2/material';
import { CollisionManager, ColliderType, ColliderShape } from '../collision/collisionManager';
import { SceneObject } from '../webgl2/meshes/sceneObject';
import { SpotLight } from '../webgl2/lights/light';
import { IcoSphere } from '../webgl2/meshes/icoSphere';
import { Quaternion } from '../util/math/quaternion';

export class PhysicsTestLevel extends Scene {
    protected clearColor: [number, number, number, number] = [0.2, 0.3, 0.5, 1.0];  // Match sky color
    public ui: UI = new UI();
    positionData: UIElement<string>;
    fpsData: UIElement<string>;
    rotationData: UIElement<string>;
    cube: SceneObject;
    floor: SceneObject;
    wall: SceneObject;
    ball: SceneObject;
    collisionManager: CollisionManager;

    constructor() {
        // Position camera to see reflections better
        super(new Camera({ position: v3(2, 6, 1), target: v3(2, 1, 0), fov: 60 }), {
            ambientLightColor: v3(1, 1, 1),
            ambientLightIntensity: 0.5,
        });

        // Initialize collision manager
        this.collisionManager = new CollisionManager();

        // Create floor
        this.add(this.floor = PlaneMesh.create({
            position: v3(0, 0, 0),
            scale: v2(100, 100),
            material: new Material({
                baseColor: v3(1, 0, 0),
            }),
        }));

        // Create dynamic cube
        this.add(this.cube = Cube.create({
            position: v3(0, 6, 0),
            scale: v3(1, 1, 1),
            material: new Material({
                baseColor: v3(0, 1, 0),
            }),
        }));

        // Create dynamic sphere 
        this.add(this.ball = IcoSphere.create({
            position: v3(0, 2, 0),
            subdivisions: 4,
            scale: v3(0.8, 0.8, 0.8),
            material: new Material({
                baseColor: v3(0, 1, 1),
                roughness: 0.1,
                metallic: 0.9
            }),
        }));

        // Create wall
        this.add(this.wall = Cube.create({
            position: v3(3, 2, 0),
            scale: v3(1, 1, 1),
            material: new Material({
                baseColor: v3(0, 0, 1),
            }),
        }));

        this.addLight(new SpotLight({
            position: v3(0, 3, 4),
            lookAt: v3(2, 1, 0),
            color: v3(1, 1, 1),
            intensity: 10,
            cutOff: 0.9,
            outerCutOff: 0.89,
        }));
        
        // Add objects to collision system
        this.collisionManager.addObject(this.floor, ColliderType.STATIC);
        this.collisionManager.addObject(this.wall, ColliderType.STATIC, undefined, ColliderShape.CUBOID);
        this.collisionManager.addObject(this.cube, ColliderType.DYNAMIC);
        this.collisionManager.addObject(this.ball, ColliderType.DYNAMIC, undefined, ColliderShape.SPHERE);

        this.wall.transform.rotate(Quaternion.fromEuler(0, -0.06,0));
        
        // Setup UI
        this.ui.add((this.fpsData = UI.data({ label: 'FPS', size: v2(400, 100) })), 'bottom');
        this.ui.add((this.positionData = UI.data({ label: 'Positions', size: v2(600, 100) })), 'bottom');
    }

    tick(obj: TickerReturnData) {
        super.tick(obj);
        
        // Update UI
        this.fpsData.change(obj.frameRate.toFixed(2));
        this.positionData.change(`Cube: ${this.cube.transform.getWorldPosition().x.toFixed(2)}, Ball: ${this.ball.transform.getWorldPosition().x.toFixed(2)}`);
        
        // Move objects
        // this.cube.transform.move(v3(0.005, -0.005, 0));
        this.ball.transform.move(v3(0.008, 0, 0));
        // this.wall.transform.move(v3(-0.008, 0, 0));
        // this.wall.transform.rotate(Quaternion.fromEuler(0, -0.01, 0.01));
        
        // Update collision system
        this.collisionManager.update();
    }
}