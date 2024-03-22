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
     * @param {string} idString
     */
    constructor(value, idString){
        // Récupération de la valeur du Stat
        this.#value = value;
        this.fetchStat(idString);
    }

    async fetchStat(idString){
        const json = await pokeFetch(`https://pokeapi.co/api/v2/stat/${idString}/`);
        // Récupération du nom du stat dans le bon langage
        this.#name = json.names[7].name;
    }
    /**
     * @returns {string} Nom du stat
     */
    get name(){return this.#name;}
    /**
     * @returns {string} Valeur du Stat
     */
    get value(){return this.#value;}



}
export default Stat;