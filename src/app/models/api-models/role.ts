import { Role as Interface } from '@pickvoice/pickvoice-api/model/role';
export class Role implements Interface {
    /**
     * Codigo asignado al role
     */
    code?: string;
    /**
     * Nombre del rol
     */
    name?: string;
    constructor() {
        this.code = '';
        this.name = '';
    }
}
