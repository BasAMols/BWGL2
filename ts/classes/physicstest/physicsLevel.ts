import { v3 } from '../util/math/vector3';
import { TickerReturnData } from '../ticker';
import { Scene } from '../webgl2/scene';
import { Camera } from '../webgl2/camera';
import { UI, UIElement } from '../elements/UI';
import { v2 } from '../util/math/vector2';
import { Cube } from '../webgl2/meshes/cube';
import { PlaneMesh } from '../webgl2/meshes/plane';
import { Material } from '../webgl2/material';
import { CollisionManager, ColliderType } from '../collision/collisionManager';
import { SceneObject } from '../webgl2/meshes/sceneObject';

export class PhysicsTestLevel extends Scene {
    protected clearColor: [number, number, number, number] = [0.2, 0.3, 0.5, 1.0];  // Match sky color
    public ui: UI = new UI();
    positionData: UIElement<string>;
    fpsData: UIElement<string>;
    rotationData: UIElement<string>;
    cube: SceneObject;
    floor: SceneObject;
    wall: SceneObject;
    collisionManager: CollisionManager;


    constructor() {
        // Position camera to see reflections better
        super(new Camera({ position: v3(2, 4, 3), target: v3(2, 1, 0), fov: 60 }), {
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
            position: v3(0, 2, 0),
            scale: v3(1, 1, 1),
            material: new Material({
                baseColor: v3(0, 1, 0),
            }),
        }));

        // Create wall
        this.add(this.wall = Cube.create({
            position: v3(3, 1.5, 0),
            scale: v3(1, 1, 1),
            material: new Material({
                baseColor: v3(0, 0, 1),
            }),
        }));
        
        // Add objects to collision system
        this.collisionManager.addObject(this.floor, ColliderType.STATIC);
        this.collisionManager.addObject(this.wall, ColliderType.STATIC);
        this.collisionManager.addObject(this.cube, ColliderType.DYNAMIC);
        
        // Setup UI
        this.ui.add((this.fpsData = UI.data({ label: 'FPS', size: v2(400, 100) })), 'bottom');
        this.ui.add((this.positionData = UI.data({ label: 'Cube Position', size: v2(400, 100) })), 'bottom');

    }

    tick(obj: TickerReturnData) {
        super.tick(obj);
        
        // Update UI
        this.fpsData.change(obj.frameRate.toFixed(2));
        this.positionData.change(this.cube.transform.getWorldPosition().vec.toString());
        
        // Move cube down (gravity)
        // this.cube.transform.move(v3(0, -0.01, 0));
        this.cube.transform.move(v3(0.005, -0.005, 0));
        // console.log(this.cube.transform.getWorldPosition().x);
        
        
        // Update collision system
        this.collisionManager.update();
    }
}