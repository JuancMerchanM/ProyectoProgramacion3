import { MarkbookSimple } from "./MarkbookSimple.interface";

export interface Markbook extends MarkbookSimple{
    description: string;
    lastPoint: number;
}