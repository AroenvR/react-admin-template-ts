import { GetListResult } from "react-admin";
import { QueryInterface } from "../interfaces/QueryInterface";

export const getAllFoos = async (query: QueryInterface): Promise<GetListResult> => {
    const data = [
        { id: 1, name: "foo1" },
        { id: 2, name: "foo2" },
        { id: 3, name: "foo3" },
        { id: 4, name: "foo4" },
        { id: 5, name: "foo5" },
    ];

    return Promise.resolve({ data: data, total: data.length });
}