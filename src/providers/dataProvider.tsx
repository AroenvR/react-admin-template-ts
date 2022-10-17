import { DataProvider } from "react-admin";
import { fetchUtils } from 'react-admin';
import { stringify } from 'query-string';

import { QueryInterface } from "../interfaces/QueryInterface";
import { getAllFoos } from '../services/fooService';

const httpClient = fetchUtils.fetchJson;
const domainUrl = process.env.REACT_APP_DOMAIN_URL || "";

const dataProvider: DataProvider = {
    getCustom: async (resource: string, params: any) => {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;

        const query: QueryInterface = {
            sort: [field, order],
            range: [(page - 1) * perPage, page * perPage - 1],
            filter: params.filter,
        };
        
        switch (resource) {
            case "foos":
                return await getAllFoos(query);

            default:
                return Promise.reject("Unknown resource");
        }
    },

    // The following code is currently untested.
    getList: (resource, params) => {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;
        const query = {
            sort: JSON.stringify([field, order]),
            range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
            filter: JSON.stringify(params.filter),
        };
        const url = `${domainUrl}/${resource}?${stringify(query)}`;

        return httpClient(url).then(({ headers, json }) => ({
            data: json,
            //@ts-ignore
            total: parseInt(headers.get('content-range').split('/').pop(), 10),
        }));
    },

    getOne: (resource, params) =>
        httpClient(`${domainUrl}/${resource}/${params.id}`).then(({ json }) => ({
            data: json,
        })),

    getMany: (resource, params) => {
        const query = {
            filter: JSON.stringify({ ids: params.ids }),
        };
        const url = `${domainUrl}/${resource}?${stringify(query)}`;
        return httpClient(url).then(({ json }) => ({ data: json }));
    },

    getManyReference: (resource, params) => {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;
        const query = {
            sort: JSON.stringify([field, order]),
            range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
            filter: JSON.stringify({
                ...params.filter,
                [params.target]: params.id,
            }),
        };
        const url = `${domainUrl}/${resource}?${stringify(query)}`;

        return httpClient(url).then(({ headers, json }) => ({
            data: json,
            //@ts-ignore
            total: parseInt(headers.get('content-range').split('/').pop(), 10),
        }));
    },

    create: (resource, params) =>
        httpClient(`${domainUrl}/${resource}`, {
            method: 'POST',
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({
            data: { ...params.data, id: json.id },
        })),

    update: (resource, params) =>
        httpClient(`${domainUrl}/${resource}/${params.id}`, {
            method: 'PUT',
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({ data: json })),

    updateMany: (resource, params) => {
        const query = {
            filter: JSON.stringify({ id: params.ids}),
        };
        return httpClient(`${domainUrl}/${resource}?${stringify(query)}`, {
            method: 'PUT',
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({ data: json }));
    },

    delete: (resource, params) =>
        httpClient(`${domainUrl}/${resource}/${params.id}`, {
            method: 'DELETE',
        }).then(({ json }) => ({ data: json })),

    deleteMany: (resource, params) => {
        const query = {
            filter: JSON.stringify({ id: params.ids}),
        };
        return httpClient(`${domainUrl}/${resource}?${stringify(query)}`, {
            method: 'DELETE',
            //@ts-ignore
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({ data: json }));
    },
}

export default dataProvider;