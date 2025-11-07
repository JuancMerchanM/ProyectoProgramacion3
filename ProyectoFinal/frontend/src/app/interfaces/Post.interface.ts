import { MarkbookSimple } from "./MarkbookSimple.interface";

export interface Post{
    name: string;
    date: string;
    description: string;
    distance: number;
    numSpots: number;
    spots: MarkbookSimple[];
}