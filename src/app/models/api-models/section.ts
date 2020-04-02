import { Section as Interface } from '@pickvoice/pickvoice-api/model/section';
export class Section implements Interface {
    /**
     * Codigo de la secion
     */
    code: string;
    /**
     * Nombre de la secion
     */
    name?: string;
    /**
     * Descripcion de la secion
     */
    description?: string;
    constructor() {
        this.code = '';
        this.name = '';
        this.description = '';
    }
}
