import { User as Interface } from '@pickvoice/pickvoice-api/model/user';
import { Role } from './role';
export class User implements Interface {
    /**
     * Nombre de usuario
     */
    userName?: string;
    /**
     * Primer nombre
     */
    firstName?: string;
    /**
     * Segundo nombre
     */
    lastName?: string;
    /**
     * Correo electronico del usuario
     */
    email?: string;
    /**
     * Clave del usuario
     */
    password?: string;
    passwordConfirm?: string;
    phone?: string;
    rol?: Role;
    /**
     * Status del usuario
     */
    userState?: Interface.UserStateEnum;
    constructor() {
        this.email = '';
        this.firstName = '';
        this.lastName = '';
        this.password = '';
        this.passwordConfirm = '';
        this.phone = '';
        this.rol = new Role();
        this.userName = '';
        this.userState = Interface.UserStateEnum.Active;
    }
}
