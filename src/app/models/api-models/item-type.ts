import { ItemType as Interface } from '@pickvoice/pickvoice-api/model/itemType';
export class ItemType implements Interface {
    code?: string;
    name?: string;
    description?: string;
    constructor() {
        this.code = '';
        this.name = '';
        this.description = '';
    }
}
