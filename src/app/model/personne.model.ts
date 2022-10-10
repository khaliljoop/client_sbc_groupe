export class Personne{
    constructor(
    public  id_personne:string,
    public  unique_id:string ,
    public  prenom:string,
    public  nom:string,
    public  sexe:string,
    public  adresse:string,
    public  telephone:string,
    public  email:string,
    public  username:string,
    public  password:string,
    public  etat_compte:number,
    ){}
}