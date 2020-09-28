import { RoleName } from './enum/role-name.enum'

export class Role {
    id: number;
    name: RoleName;
    authorities: [];

    constructor() {
        this.id = null;
        this.name = null;
        this.authorities = [];
    }
}