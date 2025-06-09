import { SceneObject, SceneObjectProps } from "./sceneObject";
import { FBXLoader } from "./fbxLoader";
import { ContainerObject } from './containerObject';

export class FBXscene extends ContainerObject {
    private constructor(url: string, props: SceneObjectProps = {}) {
        super(props);
        this.loadFbx(url);
    }

    private async loadFbx(url: string) {
        const data = await FBXLoader.loadFromUrl(url);
        this.add(data);
    }

    static create(url: string, props: SceneObjectProps = {}): SceneObject {
        const fbx = new FBXscene(url, props);
        return fbx;
    }
}