import Type from "./type.js";
import Ability from "./ability.js";
import Stat from "./stat.js";

class Pokemon{

    /***
     * Nom du pokémon
     * @type {string}
     */
    #name; 

    /**
     * Nom traduit du pokémon
     * @type {string}
     */
    #translatedName;
    
    /**
     * Id du pokemon
     * @type {Number}
     */
    #id;

    /**
     * Hauteur en cm
     * @type {Number}
     */
    #height;

    /**
     * Stats du pokemon
     * @type {Array}
     * @see fetchInfo
     */
    #stats;

    /**
     * URL de l'audio .ogg
     * @type {String}
     */
    #cry;

    /**
     * Types du pokémon
     * @type {Array}
     * @see fetchInfo
     */
    #types;

    /**
     * Abilitées du pokémon
     * @type {Array}
     * @see fetchInfo
     */
    #abilities;

    /**
     * Sprites du pokémon
     * @type {Object}
     * @see fetchInfo
     */
    #sprites;


    /**
     * @param {number} id 
     * @param {string} nomPokemon
     */
    constructor(id, name){
        this.#id = id;
        this.#name = name;
    }

    async fetchInfo() {
        const json = await pokeFetch(`https://pokeapi.co/api/v2/pokemon/${this.#id}/`);
        const jsonSpecies = await pokeFetch(`https://pokeapi.co/api/v2/pokemon-species/${this.#id}/`);

        // TODO: langage
        this.#translatedName = jsonSpecies.names[7].name;
        //Récupération de la taille du pokémon
        this.#height = json.height * 10; // Hauteur en décimètre de base
        //Récupération des cries
        this.#cry = json.cries.latest;
        //Récupération des sprites
        this.#sprites = {
            "back": json.sprites.back_default,
            "front": json.sprites.front_default
        };

        // Récupération du/des types du pokemon dans le JSON puis sa création en Object de type Type 
        this.#types = [];
        json.types.forEach(type => {
            this.#types.push(new Type(type.type.name));
        });
        // Récupération du/des stats du pokemon dans le JSON puis sa création en Object de type Stat
        this.#stats = [];
        json.stats.forEach(stat => {
            this.#stats.push(new Stat(stat.base_stat, stat.stat.name)); 
        });
        // Récupération du/des abilitées du pokemon dans le JSON puis sa création en Object de type Ability
        this.#abilities = [];
        json.abilities.forEach(ability => {
            this.#abilities.push(new Ability(ability.ability.name));
        });
    }

    /**
     * @returns {string} Lien de l'image du pokémon
     */
    get imageLink() {
        return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${this.#id}.png`;
    }

    /**
     * @returns {string} Nom du pokémon
     */
    get name() {
        return this.#name;
    }

    /**
     * @returns {number} Id du pokémon
     */
    get id() {
        return this.#id;
    }

    /**
     * @returns {Array} Liste des stats du pokémon
     */
    get stats(){
        return this.#stats;  
    }
    /**
     * @returns {Object} Sprites du pokémon
     */
    get sprites() {
        return this.#sprites;
    }

    /**
     * @returns {String} Nom traduit du pokémon
     */
    get translatedName() {
        return this.#translatedName;
    }

    /**
     * @returns {Array} Liste des types du pokémon
     */
    get types() {
        return this.#types;
    }
}

export default Pokemon;