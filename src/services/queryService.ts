import { Query } from "./apiService";

const sanitize = (query: Query): Query | undefined => {
    if(!query) {
        return undefined;
    }

    const filters: Query = {...query};

    Object.keys(filters).forEach((key) => {
        if(filters[key] === '') {
            delete filters[key];
        }
    });

    return filters;
}

const queryService = {
    sanitize,
};

export default queryService;