import { UnityOfMeasure as Interface } from '@pickvoice/pickvoice-api/model/unityOfMeasure';
export class UnityOfMeasure implements Interface {
    code?: string;
    name?: string;
    constructor() {
        this.code = '';
        this.name = '';
    }
}
