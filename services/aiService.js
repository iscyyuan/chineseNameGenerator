const http = require('http');
const apiConfig = require('../config/api');
const prompts = require('../config/prompts');

class AIService {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    async generateNames(englishName) {
        const requestData = {
            model: apiConfig.model,
            messages: [
                {
                    role: "system",
                    content: prompts.system
                },
                {
                    role: "user",
                    content: prompts.template(englishName)
                }
            ]
        };

        return new Promise((resolve, reject) => {
            const apiReq = http.request({
                ...apiConfig.endpoint,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                }
            }, (apiRes) => {
                let data = '';
                
                apiRes.on('data', (chunk) => {
                    data += chunk;
                });

                apiRes.on('end', () => {
                    try {
                        const response = JSON.parse(data);
                        resolve(response.choices[0].message.content);
                    } catch (error) {
                        reject(new Error('处理响应时出错'));
                    }
                });
            });

            apiReq.on('error', reject);
            apiReq.write(JSON.stringify(requestData));
            apiReq.end();
        });
    }
}

module.exports = AIService;