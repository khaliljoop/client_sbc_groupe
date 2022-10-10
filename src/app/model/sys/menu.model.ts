import { Smenu } from "./smenu.model";

export class Menu {
    public id_menu!:number;
    public smenu!:Smenu[];
    constructor(
        public code:string, 
        public libelle:string,
        public etat:number,
        public disabled:boolean=true,
        public route:string=''
    ){}
}
