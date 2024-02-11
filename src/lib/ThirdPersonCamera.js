import * as THREE from "three";

export default class ThirdPersonCamera {
    constructor(params) {

        this._params = params;
        this._camera = params.camera;

        this._currentPosition = new THREE.Vector3();
        this._currentLookat = new THREE.Vector3();

    }
}