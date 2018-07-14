define([], f => {
    
    const 
        baseUrl = "/api/memgraph";

    const 
        getStdResponse = async response => {
            const result = {
                ok: response.ok,
                status: response.status,
            }
            return Object.assign(result, await response.json());
        }

    return {
        execute: async query => await getStdResponse(
            await fetch(baseUrl, {method: "POST", body: query})
        )
    }

});