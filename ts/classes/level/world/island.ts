import { Actor } from "../../actor/actor";
import { TickerReturnData } from '../../ticker';
import { Quaternion } from '../../util/math/quaternion';
import { v3 } from "../../util/math/vector3";
import { Material } from '../../webgl2/material';
import { ContainerObject } from '../../webgl2/meshes/containerObject';
import { Cube } from '../../webgl2/meshes/cube';
import { TestLevel } from '../testLevel';
import { FBXscene } from '../../webgl2/meshes/fbx';
export class Island extends Actor {
    tiles: ContainerObject[] = [];
    scene: TestLevel;
    constructor() {
        super();
 
       for (let i = 0; i < 10; i++) {
        this.tile(i);
       }

    }

    tick(obj: TickerReturnData) {
        super.tick(obj);

        const blockTime = 30

        const p = this.scene.progress / blockTime % 50;

        this.tiles.forEach((tile, i) => {
            tile.transform.setPosition(v3(0, 0, p - 50*(i-2)));
        });
    }

    tile(x: number) {
        const container = new ContainerObject({
            position: v3(0, 0, x*50),
        });
        this.add(container);
        container.add(Cube.create({
            position: v3(0, -0.5, 0),
            material: new Material({
                baseColor: v3(0.3, 0.2, 0.1),  // Brown dirt color
            }),
            scale: v3(5, 1, 50),
            rotation: Quaternion.fromEuler(0, 0, 0),
        }));
        container.add(Cube.create({
            position: v3(-22.5, -0.5, 0),
            material: new Material(),
            scale: v3(40, 1, 50),
            rotation: Quaternion.fromEuler(0, 0, 0),
        }));
        container.add(Cube.create({
            position: v3(22.5, -0.5, 0),
            material: new Material(),
            scale: v3(40, 1, 50),
            rotation: Quaternion.fromEuler(0, 0, 0),
        }));
        container.add(FBXscene.create('fbx/City_houses.fbx', {
            position: v3(0, 0, 0),
            rotation: Quaternion.fromEuler(0, 0.55, 0),
        }));

        this.tiles.push(container);
    }
}