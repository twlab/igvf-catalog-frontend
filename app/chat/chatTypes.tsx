import { JSONValue } from "ai";

export interface ChatStreamData {
    type: "function_result";
    about: string;
    data: any;
    [x: string]: JSONValue;
}
