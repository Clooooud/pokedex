class Stat{
    /**
     * Nom du Stat
     * @type {string}
     */
    #name;
    /**
     * Valeur du Stat
     * @type {Number}
     */
    #value;


    /**
     * @param {Number} value
     * @param {string} 
     */
    constructor(value, idString){
        this.#value = value;
        this.fetchStat(idString);
    }

    async fetchStat(idString){
        const json = await fetch(`https://pokeapi.co/api/v2/stat/${idString}/`);

        this.#name = json.names[7].name;
    }

    get name(){return this.#name;}
    get value(){return this.#value;}



}
export default Stat;