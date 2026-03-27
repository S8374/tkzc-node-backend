import { Types } from "mongoose";

export interface ISlider {
    title?: string;
    subtitle?: string;
    description?: string;
    image?: string;
    sliderTypeId: Types.ObjectId; // Reference to SliderType
    buttonText?: string;
    buttonLink?: string;
    imageRedirectLink?: string;

    // new fields
    money? : number;
    username?: string;
    provider_code?: string;
    provider_id?: string;
    game_id?: string;
    game_code?: string;
    game_type?: string;

    order: number;
    createdAt?: Date;
    updatedAt?: Date;
}
