const API_CONFIG = {
    baseUrl: 'http://localhost:3000',
    endpoints: {
        generateNames: '/generate-names'
    }
};

class NameGenerator {
    constructor() {
        this.isGenerating = false;
        this.generateButton = document.querySelector('button');
        this.englishNameInput = document.getElementById('englishName');
        this.loadingContainer = document.getElementById('loading');
        this.resultElement = document.getElementById('result');
        this.loadingSteps = ['step1', 'step2', 'step3', 'step4'];
        
        // 保存事件处理器的引用
        // 修改点击事件处理器，添加更多调试信息
        this._handleClick = async (e) => {
            const timestamp = new Date().toISOString();
            const eventType = e.type;
            const target = e.target.tagName;
            
            console.group(`[点击事件 ${timestamp}]`);
            console.log('事件类型:', eventType);
            console.log('目标元素:', target);
            console.log('生成状态:', this.isGenerating);
            console.log('按钮状态:', this.generateButton.disabled);
            
            e.preventDefault();
            
            if (this.isGenerating) {
                console.warn('⚠️ 已在生成中，阻止重复请求');
                console.groupEnd();
                return;
            }

            // 立即锁定状态
            this.isGenerating = true;
            this.generateButton.disabled = true;
            console.log('✅ 状态已锁定');
            console.groupEnd();

            await this.generateNames();
        };

        this._handleKeyPress = async (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (this.isGenerating) {
                    console.warn('[状态检查] 已在生成中，阻止重复请求');
                    return;
                }
                await this.generateNames();
            }
        };

        // 绑定事件
        this.generateButton.addEventListener('click', this._handleClick);
        this.englishNameInput.addEventListener('keypress', this._handleKeyPress);

        console.log('[初始化] 完成');
    }

    async generateNames() {
        const startTime = Date.now();
        console.group(`[生成流程 ${new Date().toISOString()}]`);
        
        try {
            console.log('当前状态:', {
                isGenerating: this.isGenerating,
                buttonDisabled: this.generateButton.disabled,
                hasInput: !!this.englishNameInput.value
            });

            const englishName = this.englishNameInput.value.trim();
            if (!this.validateInput(englishName)) {
                console.warn('❌ 输入验证失败');
                return;
            }

            this.updateUIForLoading(true);
            this.startLoadingAnimation();
            console.log('⏳ 开始调用API');

            const names = await this.callGenerateAPI(englishName);
            console.log('✅ API调用成功，耗时:', Date.now() - startTime, 'ms');

            this.displayResults(names);
        } catch (error) {
            console.error('❌ 错误:', error);
            this.displayError(error.message);
        } finally {
            const totalTime = Date.now() - startTime;
            console.log('🏁 完成处理，总耗时:', totalTime, 'ms');
            console.groupEnd();
            
            // 重置状态
            this.isGenerating = false;
            this.generateButton.disabled = false;
            this.stopLoadingAnimation();
            this.updateUIForLoading(false);
        }
    }

    // 第一个 cleanup 方法（在第88行）
    cleanup() {
        if (this.generateButton) {
            this.generateButton.removeEventListener('click', this._handleClick);
        }
        if (this.englishNameInput) {
            this.englishNameInput.removeEventListener('keypress', this._handleKeyPress);
        }
        this.stopLoadingAnimation();
        this.isGenerating = false;
    }
    updateUIForLoading(isLoading) {
        if (!this.generateButton) return;

        this.generateButton.disabled = isLoading;
        this.generateButton.textContent = isLoading ? 
            'Generating... | 生成中...' : 
            'Generate Names | 生成中文名';
            
        if (this.loadingContainer) {
            this.loadingContainer.style.display = isLoading ? 'block' : 'none';
        }
        
        if (this.resultElement) {
            this.resultElement.style.display = isLoading ? 'none' : 
                (this.resultElement.innerHTML ? 'block' : 'none');
        }
    }

    startLoadingAnimation() {
        this.currentStep = 0;
        this.updateLoadingStep();
        this.stepInterval = setInterval(() => {
            this.currentStep = (this.currentStep + 1) % this.loadingSteps.length;
            this.updateLoadingStep();
        }, 1500);
    }

    stopLoadingAnimation() {
        if (this.stepInterval) {
            clearInterval(this.stepInterval);
            this.stepInterval = null;
        }
    }

    updateLoadingStep() {
        this.loadingSteps.forEach((stepId, index) => {
            const stepElement = document.getElementById(stepId);
            if (stepElement) {
                stepElement.classList.toggle('active', index === this.currentStep);
            }
        });
    }

    validateInput(englishName) {
        if (!englishName) {
            alert('Please enter your English name | 请输入英文名！');
            return false;
        }
        if (!/^[a-zA-Z\s]+$/.test(englishName)) {
            alert('Please enter valid English characters | 请输入有效的英文字符！');
            return false;
        }
        return true;
    }

    async callGenerateAPI(englishName) {
        const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.generateNames}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ englishName })
        });

        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.error || 'Generation failed');
        }

        const cleanedJson = data.names
            .replace(/```json\n/g, '')
            .replace(/```/g, '')
            .trim();
        
        return JSON.parse(cleanedJson);
    }

    displayResults(names) {
        if (!this.resultElement) return;
        this.resultElement.innerHTML = names.map(name => this.createNameCard(name)).join('');
        this.resultElement.style.display = 'block';
    }

    displayError(message = '生成失败，请稍后重试 | Generation failed, please try again later') {
        if (!this.resultElement) return;
        this.resultElement.innerHTML = `
            <div class="name-card error">
                <p class="error-message">${this.sanitizeHTML(message)}</p>
                <p class="error-tip">请稍后再试 | Please try again later</p>
            </div>
        `;
        this.resultElement.style.display = 'block';
    }

    createNameCard(name) {
        return `
            <div class="name-card">
                <h3>${this.sanitizeHTML(name.chinese)}</h3>
                <p><span class="label">Chinese Meaning | 中文寓意：</span>${this.sanitizeHTML(name.chineseMeaning)}</p>
                <p><span class="label">English Meaning | 英文解释：</span>${this.sanitizeHTML(name.englishMeaning)}</p>
            </div>
        `;
    }

    sanitizeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
    // 第二个重复的 cleanup 方法（在第210行）
    cleanup() {  // 这里重复定义了
        if (this.generateButton) {
            this.generateButton.removeEventListener('click', this._handleClick);
        }
        if (this.englishNameInput) {
            this.englishNameInput.removeEventListener('keypress', this._handleKeyPress);
        }
        this.stopLoadingAnimation();
        this.isGenerating = false;
    }
}

// 初始化
let instance = null;
document.addEventListener('DOMContentLoaded', () => {
    console.log('[页面] DOM加载完成');
    if (instance) {
        console.log('[页面] 清理旧实例');
        instance.cleanup();
    }
    console.log('[页面] 创建新实例');
    instance = new NameGenerator();
});