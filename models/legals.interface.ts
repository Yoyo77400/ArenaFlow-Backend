import { ITimestamp } from "./index";

export interface ILegal extends ITimestamp {
    _id: string;
    title: string;
    content: string;
    version: string;
}