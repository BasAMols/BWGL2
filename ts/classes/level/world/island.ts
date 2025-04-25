import { Actor } from "../../actor/actor";
import { Quaternion } from '../../util/math/quaternion';
import { v3 } from "../../util/math/vector3";
import { FBX as FBXscene } from '../../webgl2/meshes/fbx';
import { SceneObject } from '../../webgl2/meshes/sceneObject';
export class Island extends Actor {
    waterPlane: SceneObject;
    constructor() {
        super();
 
        this.add(FBXscene.create('fbx/island1.fbx', {
            position: v3(0, 0, 0),
            rotation: Quaternion.fromEuler(0, 0, 0),
        }));
        this.add(FBXscene.create('fbx/island2.fbx', {
            position: v3(0, 0, 0),
            rotation: Quaternion.fromEuler(0, 0, 0),
        }));
        this.add(FBXscene.create('fbx/island3.fbx', {
            position: v3(0, 0, 0),
            rotation: Quaternion.fromEuler(0, 0, 0),
        }));

    }
}