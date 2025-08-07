import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';

@Injectable()
export class SeedService {

  private readonly axios: AxiosInstance = axios;

  constructor(
    //Para llamar la BD
    @InjectModel( Pokemon.name )//Se le da el nombre al modelo
    private readonly pokemonModel: Model<Pokemon>,//se define la Dependecia en este caso el Model que es de moogose con la estructura de nuestro entitiy Pokemon
  ) {}

  async executeSeed() {

    //Limpiamos la tabla antes de insertar
    await this.pokemonModel.deleteMany({});

    const { data } = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=600');

    const pokemonToInsert: {name: string, no: number}[] = [];

    data.results.forEach( async({name, url}) => {
      const segments = url.split('/');
      const no: number = +segments[segments.length - 2];

      //const pokemon = await this.pokemonModel.create( {name, no} );
      pokemonToInsert.push({name, no});

    } );

    await this.pokemonModel.insertMany( pokemonToInsert );

    return 'Seed Executed';
  }

}
