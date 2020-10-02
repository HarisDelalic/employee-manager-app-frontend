import { RoleName } from './enum/role-name.enum'

export class Role {
    name: RoleName;
    authorities: [];

    constructor() {
        this.name = null;
        this.authorities = [];
    }
}