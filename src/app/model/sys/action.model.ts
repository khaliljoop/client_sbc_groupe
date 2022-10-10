import { Profil } from "./profil.model";
import { Smenu } from "./smenu.model";

export class Action {
    public id_action!:number;
    constructor(
        public id_profil:number,
        public id_smenu:number,
        public d_read:number,
        public d_add:number,
        public d_update:number,
        public d_del:number
    ){}
}
