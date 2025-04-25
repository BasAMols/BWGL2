import { SceneObjectProps } from "./sceneObject";
import { FBXLoader } from "./fbxLoader";
import { ContainerObject } from './containerObject';

export class FBX extends ContainerObject {
    constructor(url: string, props: SceneObjectProps = {}) {
        super(props);
        this.loadFbx(url);
    }

    private async loadFbx(url: string) {
        const data = await FBXLoader.loadFromUrl(url);
        this.addChild(data);
    }
}