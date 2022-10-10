import { Menu } from "./menu.model";

export class Smenu {
    public id_smenu!:number;
    //public routes?:string="";
    constructor(
        public code:string,
        public libelle:string,
        public etat:number,
        public id_menu:number,
        public route:string="/addsmenu"
    ){}
}
