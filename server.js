const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

// 读取环境变量
let API_KEY;
let PORT = 3000;

try {
    const envPath = path.join(__dirname, '.env');
    console.log('正在读取环境变量文件:', envPath);
    
    if (!fs.existsSync(envPath)) {
        throw new Error('.env 文件不存在');
    }

    const envContent = fs.readFileSync(envPath, 'utf-8');
    console.log('环境变量文件内容:', envContent);

    const envConfig = envContent
        .split('\n')
        .filter(line => line.trim() !== '')
        .reduce((config, line) => {
            const [key, value] = line.split('=').map(str => str.trim());
            if (key && value) {
                config[key] = value;
            }
            return config;
        }, {});

    console.log('解析后的环境变量:', envConfig);

    if (!envConfig.API_KEY) {
        throw new Error('API_KEY 未在 .env 文件中找到');
    }

    API_KEY = envConfig.API_KEY;
} catch (error) {
    console.error('环境变量读取错误:', error.message);
    process.exit(1);
}

// 初始化服务
const AIService = require('./services/aiService');
const aiService = new AIService(API_KEY);

function handleGenerateNames(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        try {
            const { englishName } = JSON.parse(body);
            const names = await aiService.generateNames(englishName);
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, names }));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
                success: false, 
                error: error.message || '处理请求时出错'
            }));
        }
    });
}

// 添加 MIME 类型映射
const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif'
};

function handleStaticFiles(req, res) {
    // 获取请求的文件路径
    let filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);
    
    // 获取文件扩展名
    const extname = path.extname(filePath);
    
    // 设置默认的内容类型
    const contentType = MIME_TYPES[extname] || 'application/octet-stream';

    // 读取文件
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404);
                res.end('File not found');
            } else {
                res.writeHead(500);
                res.end('Server Error');
            }
            return;
        }

        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
    });
}

const server = http.createServer((req, res) => {
    // 处理CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // 处理OPTIONS请求
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // 处理API请求
    if (req.method === 'POST' && req.url === '/generate-names') {
        handleGenerateNames(req, res);
        return;
    }

    // 处理静态文件请求
    handleStaticFiles(req, res);
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});