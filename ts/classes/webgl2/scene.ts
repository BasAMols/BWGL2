import { glob } from '../../game';
import { TickerReturnData } from '../ticker';
import { Camera } from './camera';
import { SceneObject } from './meshes/sceneObject';


export class Scene {
    public camera: Camera;
    private objects: SceneObject[] = [];

    constructor(camera?: Camera) {
        this.camera = camera || new Camera();
        glob.events.resize.subscribe('resize', this.resize.bind(this));
    }

    public add(object: SceneObject): void {
        this.objects.push(object);
    }

    public remove(object: SceneObject): void {
        const index = this.objects.indexOf(object);
        if (index !== -1) {
            this.objects.splice(index, 1);
        }
    }

    public render(): void {
        glob.ctx.clear(glob.ctx.COLOR_BUFFER_BIT | glob.ctx.DEPTH_BUFFER_BIT);

        const viewMatrix = this.camera.getViewMatrix();
        const projectionMatrix = this.camera.getProjectionMatrix();

        for (const object of this.objects) {
            object.render(viewMatrix, projectionMatrix);
        }
    }

    public dispose(): void {
        for (const object of this.objects) {
            object.vao.dispose();
            object.indexBuffer?.dispose();
        }
        this.objects = [];
    }

    public tick(obj: TickerReturnData) {
    }
    public afterTick(obj: TickerReturnData) {
        this.render();
    }
    public resize() {
        this.camera.updateProjectionMatrix();
    }
} 