const apiConfig = {
    model: "deepseek-r1-250120",
    endpoint: {
        hostname: 'ark.cn-beijing.volces.com',
        path: '/api/v3/chat/completions',
        method: 'POST',
        timeout: 60000
    }
};

module.exports = apiConfig;