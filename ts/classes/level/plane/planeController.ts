import { Controller } from "../../actor/controller";
import { v3 } from "../../util/math/vector3";
export class PlaneController extends Controller {
    constructor() {
        super();
    }
    tick() {
        this.actor.transform.move(v3(0, 0, 1));
    }
}