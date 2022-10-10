export class Profil {
    public id_profil!:number;
    constructor(
        public code:string,
        public libelle:string,
        public etat:number
    ){}
}
