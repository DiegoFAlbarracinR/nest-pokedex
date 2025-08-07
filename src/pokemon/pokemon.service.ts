import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';


@Injectable()
export class PokemonService {

  constructor(
    //Para llamar la BD
    @InjectModel( Pokemon.name )//Se le da el nombre al modelo
    private readonly pokemonModel: Model<Pokemon>,//se define la Dependecia en este caso el Model que es de moogose con la estructura de nuestro entitiy Pokemon
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();
    try {
      //Para ingresar en la tabla BD Mongoose
      const pokemon = await this.pokemonModel.create( createPokemonDto );
      //
      return pokemon;
    } catch (error) {
      this.handleExceptions( error );
    }
  }

  async findAll() {
    return this.pokemonModel.find();
  }

  async findOne(term: string) {//En este caso el parametro term se refiero a cualquier campo "no" "name" o "id"
    let pokemon: Pokemon | null = null;
    
    //Buscar por no
    if( !isNaN( +term ) ) {
      pokemon = await this.pokemonModel.findOne({ no: term });
    }

    //MongoI
    if( !pokemon && isValidObjectId( term ) ) {
      pokemon = await this.pokemonModel.findById( term );
    }

    //name
    if( !pokemon ){
      pokemon = await this.pokemonModel.findOne({ name: term.toLocaleLowerCase().trim() });
    }

    if(!pokemon) throw new NotFoundException(`Pokemon with id, name, or no "${ term }"`);

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    
    const pokemon = await this.findOne( term );

    if( updatePokemonDto.name ) {
      
      updatePokemonDto.name == pokemon.name.toLocaleLowerCase();
      
      try {
        await pokemon.updateOne( updatePokemonDto );
        return { ...pokemon.toJSON(), ...updatePokemonDto };
      } catch (error) {
        this.handleExceptions( error );
      }
      
    }

  }

  async remove(id: string) {
    
    const { deletedCount, acknowledged } = await this.pokemonModel.deleteOne( { _id: id } );
    if( deletedCount === 0 ) throw new BadRequestException(`Pokemon with id "${ id }" not found`);
    return;

  }

  private handleExceptions( error: any ){

     if( error.code === 11000 ) { 
      throw new BadRequestException(`Pokemon exist in DB ${ JSON.stringify( error.keyValue )  }`); 
    } else {
      throw new InternalServerErrorException(`Can't create Pokemon - Check server Logs`);
    }

  }

}
