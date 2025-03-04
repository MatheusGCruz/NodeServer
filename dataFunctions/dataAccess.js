const mssql = require('mssql')
const poolManager = require('./poolManager')

const dataAccess = (options) => {
    const run = async function (name, command, inputs = [], outputs = []) {
        try {
            const pool = poolManager.get(options)
            await pool.connect()
            const request = pool.request();
            assignParams(request, inputs, outputs);
            return request[name](command);
        } catch (error) {
            throw error
        }
    }

    return {
        query: async (command, inputs = [], outputs = []) => {
            return run('query', command, inputs, outputs);
        },
        queryEntity: async (command, entity, outputs = []) => {
            const inputs = fetchParams(entity);
            return run('query', command, inputs, outputs);
        },
        execute: async (command, inputs = [], outputs = []) => {
            return run('execute', command, inputs, outputs);
        },
        executeEntity: async (command, entity, outputs = []) => {
            const inputs = fetchParams(entity);
            return run('execute', command, inputs, outputs);
        },
        close: async () => {
            try {
                await poolManager.close(options.name)
            } catch (error) {
                throw error
            }
        }
    }
}

const fetchParams = entity => {
    const params = [];
    for (const key in entity) {
        if (entity.hasOwnProperty(key)) {
            const value = entity[key];
            params.push({
                name: key,
                value
            });
        }
    }
    return params;
};

const assignParams = (request, inputs, outputs) => {
    [inputs, outputs].forEach((params, index) => {
        const operation = index === 0 ? 'input' : 'output';
        params.forEach(param => {
            if (param.type) {
                request[operation](param.name, param.type, param.value);
            } else {
                request[operation](param.name, param.value);
            }
        });
    });
};


module.exports = {
    dataAccess
};