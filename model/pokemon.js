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
     * @type {Array} {}
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
    constructor(id){
        this.#id = id;
    }

    async fetchInfo() {
        const json = await pokeFetch(`https://pokeapi.co/api/v2/pokemon/${this.#id}/`);
        const jsonSpecies = await pokeFetch(`https://pokeapi.co/api/v2/pokemon-species/${this.#id}/`);

        // TODO: langage
        this.#name = jsonSpecies.names[7].name;
        this.#height = json.height * 10; // Hauteur en décimètre de base
        this.#cry = json.cries.latest;
        this.#sprites = {
            "back": json.sprites.back_default,
            "front": json.sprites.front_default
        };

        this.#types = []
        json.types.forEach(type => {
            this.#types.push(new Type(type.type.name));
        });
        
        this.#stats = [];
        json.stats.forEach(stat => {
            this.#stats.push(new Stat(stat.base_stat, stat.stat.name)); 
        });
        
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


    get stats(){
        return this.#stats;  
    }
    
    get sprites() {
        return this.#sprites;
    }

    get types() {
        return this.#types;
    }
}

export default Pokemon;