import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()// decorador para indicar que es de una BD: Moongose
export class Pokemon extends Document { //Document es de Moongose
    //Mongoose ya trae por defecto su propio ID único
    @Prop({
        unique: true,
        index: true
    })
    name: string;

    @Prop({
        unique: true,
        index: true
    })
    no: number;
}

export const PokemonSchema = SchemaFactory.createForClass( Pokemon );