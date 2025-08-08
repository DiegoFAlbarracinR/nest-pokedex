import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { Pokemon, PokemonSchema } from './entities/pokemon.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [PokemonController],
  providers: [PokemonService],
  imports:[
    ConfigModule,//Para importar el archivo (./src/config/env.config.ts) con la configuracion de las variables de entorno
    MongooseModule.forFeature([
      {
        name: Pokemon.name,//El Pokemon.name (el .name es por el extends Document de la clase)
        schema: PokemonSchema,
      }
    ])
  ],
  exports:[MongooseModule],
})
export class PokemonModule {}
