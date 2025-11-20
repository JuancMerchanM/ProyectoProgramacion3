import { Location } from "./Location.interface";

export interface Point{
    id: any;
    image: string;
    name: string;
    municipality: string;
    category: string;
    rating: number;
    location: Location
}