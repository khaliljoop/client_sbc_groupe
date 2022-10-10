import { Image } from "./image.model";

export class Vehicule {
public id_vehicule!:number;
    constructor(
        public matricule:string ,
        public  description:string,
        public created:Date,
        public modified:Date,
        public code_vehicule:string,
        public type_carburant:number,
        public statut:string,
        public imageList:Image[],
        public id_marque:number
    ){}
}
