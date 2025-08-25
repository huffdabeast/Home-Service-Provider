// AI Prompt Comparison Tool - Main Application
class AIPromptComparison {
    constructor() {
        this.apiKeys = this.loadApiKeys();
        this.providers = ['claude', 'chatgpt', 'perplexity', 'gemini'];
        this.isGenerating = false;
        this.useOpenRouter = this.loadOpenRouterSetting();
        
        this.initializeElements();
        this.bindEvents();
        this.loadSettings();
    }

    initializeElements() {
        // Main elements
        this.promptInput = document.getElementById('prompt-input');
        this.submitBtn = document.getElementById('submit-btn');
        this.clearBtn = document.getElementById('clear-btn');
        this.settingsBtn = document.getElementById('settings-btn');
        
        // Modal elements
        this.settingsModal = document.getElementById('settings-modal');
        this.modalOverlay = document.getElementById('modal-overlay');
        this.closeModalBtn = document.getElementById('close-modal');
        this.saveSettingsBtn = document.getElementById('save-settings');
        this.resetSettingsBtn = document.getElementById('reset-settings');
        
        // API key inputs
        this.apiKeyInputs = {
            claude: document.getElementById('claude-api-key'),
            chatgpt: document.getElementById('openai-api-key'),
            perplexity: document.getElementById('perplexity-api-key'),
            gemini: document.getElementById('gemini-api-key'),
            openrouter: document.getElementById('openrouter-api-key')
        };
        
        // OpenRouter elements
        this.useOpenRouterToggle = document.getElementById('use-openrouter');
        
        // Response elements
        this.responseElements = {};
        this.statusElements = {};
        this.timeElements = {};
        
        this.providers.forEach(provider => {
            this.responseElements[provider] = document.getElementById(`${provider}-response`);
            this.statusElements[provider] = document.getElementById(`${provider}-status`);
            this.timeElements[provider] = document.getElementById(`${provider}-time`);
        });
    }

    bindEvents() {
        // Main functionality
        this.submitBtn.addEventListener('click', () => this.generateResponses());
        this.clearBtn.addEventListener('click', () => this.clearAll());
        this.settingsBtn.addEventListener('click', () => this.openSettings());
        
        // Modal events
        this.closeModalBtn.addEventListener('click', () => this.closeSettings());
        this.modalOverlay.addEventListener('click', () => this.closeSettings());
        this.saveSettingsBtn.addEventListener('click', () => this.saveSettings());
        this.resetSettingsBtn.addEventListener('click', () => this.resetSettings());
        
        // Copy buttons
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.copyResponse(e.target));
        });
        
        // Enter key support
        this.promptInput.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                this.generateResponses();
            }
        });
        
        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.settingsModal.classList.contains('active')) {
                this.closeSettings();
            }
        });
    }

    loadApiKeys() {
        try {
            const stored = localStorage.getItem('ai-comparison-api-keys');
            return stored ? JSON.parse(stored) : {};
        } catch (error) {
            console.warn('Failed to load API keys from localStorage:', error);
            return {};
        }
    }

    saveApiKeys() {
        try {
            localStorage.setItem('ai-comparison-api-keys', JSON.stringify(this.apiKeys));
        } catch (error) {
            console.warn('Failed to save API keys to localStorage:', error);
        }
    }

    loadOpenRouterSetting() {
        try {
            const stored = localStorage.getItem('ai-comparison-use-openrouter');
            return stored === 'true';
        } catch (error) {
            console.warn('Failed to load OpenRouter setting:', error);
            return false;
        }
    }

    saveOpenRouterSetting() {
        try {
            localStorage.setItem('ai-comparison-use-openrouter', this.useOpenRouter.toString());
        } catch (error) {
            console.warn('Failed to save OpenRouter setting:', error);
        }
    }

    loadSettings() {
        // Load API keys into inputs
        Object.keys(this.apiKeyInputs).forEach(provider => {
            if (this.apiKeys[provider]) {
                this.apiKeyInputs[provider].value = this.apiKeys[provider];
            }
        });
        
        // Load OpenRouter toggle state
        if (this.useOpenRouterToggle) {
            this.useOpenRouterToggle.checked = this.useOpenRouter;
        }
    }

    async generateResponses() {
        const prompt = this.promptInput.value.trim();
        
        if (!prompt) {
            this.showNotification('Please enter a prompt first.', 'warning');
            this.promptInput.focus();
            return;
        }

        if (this.isGenerating) {
            return;
        }

        this.isGenerating = true;
        this.submitBtn.disabled = true;
        this.submitBtn.innerHTML = '<div class="loading-spinner"></div> Generating...';

        // Clear previous responses
        this.clearResponses();

        // Generate responses for all providers simultaneously
        const promises = this.providers.map(provider => 
            this.generateProviderResponse(provider, prompt)
        );

        try {
            await Promise.allSettled(promises);
        } catch (error) {
            console.error('Error generating responses:', error);
        } finally {
            this.isGenerating = false;
            this.submitBtn.disabled = false;
            this.submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Generate Responses';
        }
    }

    async generateProviderResponse(provider, prompt) {
        const startTime = Date.now();
        
        try {
            this.updateStatus(provider, 'loading', 'Generating...');
            
            let response;
            if (this.apiKeys[provider] || (this.useOpenRouter && this.apiKeys.openrouter)) {
                // Use real API - check for either individual keys OR OpenRouter
                response = await this.callRealAPI(provider, prompt);
            } else {
                // Use mock response - only when no API access available
                response = await this.generateMockResponse(provider, prompt);
            }
            
            const endTime = Date.now();
            const duration = ((endTime - startTime) / 1000).toFixed(1);
            
            this.displayResponse(provider, response, duration);
            this.updateStatus(provider, 'complete', 'Complete');
            
        } catch (error) {
            console.error(`Error with ${provider}:`, error);
            this.displayError(provider, error.message);
            this.updateStatus(provider, 'error', 'Error');
        }
    }

    async callRealAPI(provider, prompt) {
        // Check if OpenRouter is enabled and has API key
        if (this.useOpenRouter && this.apiKeys.openrouter) {
            return await this.callOpenRouterAPI(provider, prompt, this.apiKeys.openrouter);
        }
        
        // Use individual provider APIs
        const apiKey = this.apiKeys[provider];
        if (!apiKey) {
            throw new Error(`No API key found for ${provider}`);
        }
        
        switch (provider) {
            case 'claude':
                return await this.callClaudeAPI(prompt, apiKey);
            case 'chatgpt':
                return await this.callOpenAIAPI(prompt, apiKey);
            case 'perplexity':
                return await this.callPerplexityAPI(prompt, apiKey);
            case 'gemini':
                return await this.callGeminiAPI(prompt, apiKey);
            default:
                throw new Error(`Unknown provider: ${provider}`);
        }
    }

    async callOpenRouterAPI(provider, prompt, apiKey) {
        // OpenRouter model mapping
        const modelMap = {
            claude: 'anthropic/claude-3-sonnet-20240229',
            chatgpt: 'openai/gpt-3.5-turbo',
            perplexity: 'perplexity/llama-3.1-sonar-small-128k-online',
            gemini: 'google/gemini-pro'
        };

        const model = modelMap[provider];
        if (!model) {
            throw new Error(`No OpenRouter model mapping for ${provider}`);
        }

        try {
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                    'HTTP-Referer': window.location.origin,
                    'X-Title': 'AI Prompt Comparison Tool'
                },
                body: JSON.stringify({
                    model: model,
                    messages: [{ role: 'user', content: prompt }],
                    max_tokens: 1000,
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                const errorData = await response.text();
                console.error(`OpenRouter API Error for ${provider}:`, response.status, errorData);
                
                if (response.status === 401) {
                    throw new Error(`OpenRouter API authentication failed. Please check your API key.`);
                } else if (response.status === 402) {
                    throw new Error(`OpenRouter API payment required. Please check your account balance.`);
                } else if (response.status === 429) {
                    throw new Error(`OpenRouter API rate limit exceeded. Please try again later.`);
                } else {
                    throw new Error(`OpenRouter API error: ${response.status}. ${errorData}`);
                }
            }

            const data = await response.json();
            
            if (data.choices && data.choices[0] && data.choices[0].message) {
                return data.choices[0].message.content;
            } else {
                throw new Error(`Unexpected OpenRouter response structure for ${provider}`);
            }
        } catch (error) {
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error(`Network error: Cannot connect to OpenRouter API. Please check your internet connection.`);
            }
            throw error;
        }
    }

    async callClaudeAPI(prompt, apiKey) {
        // Anthropic Claude API call
        // Note: This would typically be done through a backend proxy
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-sonnet-20240229',
                max_tokens: 1000,
                messages: [{ role: 'user', content: prompt }]
            })
        });

        if (!response.ok) {
            throw new Error(`Claude API error: ${response.status}`);
        }

        const data = await response.json();
        return data.content[0].text;
    }

    async callOpenAIAPI(prompt, apiKey) {
        // OpenAI API call
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 1000
            })
        });

        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    async callPerplexityAPI(prompt, apiKey) {
        // Perplexity API call
        const response = await fetch('https://api.perplexity.ai/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'llama-3.1-sonar-small-128k-online',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 1000
            })
        });

        if (!response.ok) {
            throw new Error(`Perplexity API error: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    async callGeminiAPI(prompt, apiKey) {
        // Google Gemini API call with multiple endpoint fallbacks
        const endpoints = [
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
            `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`
        ];

        for (let i = 0; i < endpoints.length; i++) {
            try {
                console.log(`Trying Gemini endpoint ${i + 1}:`, endpoints[i]);
                
                const response = await fetch(endpoints[i], {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        contents: [{ 
                            parts: [{ text: prompt }] 
                        }],
                        generationConfig: {
                            maxOutputTokens: 1000,
                            temperature: 0.7
                        }
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    
                    // Check if response has the expected structure
                    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                        return data.candidates[0].content.parts[0].text;
                    } else {
                        console.error('Unexpected Gemini response structure:', data);
                        continue; // Try next endpoint
                    }
                } else {
                    const errorData = await response.text();
                    console.error(`Gemini API Error (endpoint ${i + 1}):`, response.status, errorData);
                    
                    // If this is the last endpoint, throw detailed error
                    if (i === endpoints.length - 1) {
                        if (response.status === 404) {
                            throw new Error(`Gemini API not found (404). Please ensure the Generative Language API is enabled in your Google Cloud project. Visit: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com`);
                        } else if (response.status === 403) {
                            throw new Error(`Gemini API access denied (403). Your API key may not have permission to access the Generative Language API. Check your API key settings.`);
                        } else if (response.status === 400) {
                            throw new Error(`Gemini API bad request (400). Please verify your API key format (should start with 'AIza').`);
                        } else {
                            throw new Error(`Gemini API error: ${response.status}. Try enabling the API at: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com`);
                        }
                    }
                }
            } catch (error) {
                console.error(`Gemini API call failed (endpoint ${i + 1}):`, error);
                
                // If this is the last endpoint, throw the error
                if (i === endpoints.length - 1) {
                    // Check if it's a network/CORS error
                    if (error.name === 'TypeError' && error.message.includes('fetch')) {
                        throw new Error(`Network error: Cannot connect to Gemini API. This may be due to CORS restrictions in browser-based apps. Consider using a backend proxy for production use.`);
                    }
                    throw error;
                }
            }
        }
    }

    async generateMockResponse(provider, prompt) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
        
        const mockResponses = {
            claude: `Claude's response to "${prompt.substring(0, 50)}..."\n\nThis is a simulated response from Claude (Anthropic). In the free tier mode, this tool provides mock responses to demonstrate the interface. To get real responses, please add your Anthropic API key in the settings.\n\nClaude is known for being helpful, harmless, and honest in its responses, with strong reasoning capabilities and nuanced understanding of context.`,
            
            chatgpt: `ChatGPT's response to "${prompt.substring(0, 50)}..."\n\nThis is a simulated response from ChatGPT (OpenAI). In the free tier mode, this tool provides mock responses to demonstrate the interface. To get real responses, please add your OpenAI API key in the settings.\n\nChatGPT is known for its conversational abilities, creative writing, and broad knowledge across many domains.`,
            
            perplexity: `Perplexity's response to "${prompt.substring(0, 50)}..."\n\nThis is a simulated response from Perplexity. In the free tier mode, this tool provides mock responses to demonstrate the interface. To get real responses, please add your Perplexity API key in the settings.\n\nPerplexity specializes in providing up-to-date information with citations and sources, making it excellent for research and current events.`,
            
            gemini: `Gemini's response to "${prompt.substring(0, 50)}..."\n\nThis is a simulated response from Gemini (Google). In the free tier mode, this tool provides mock responses to demonstrate the interface. To get real responses, please add your Google AI API key in the settings.\n\nGemini offers strong multimodal capabilities and integration with Google's ecosystem of services and knowledge.`
        };

        return mockResponses[provider] || 'Mock response not available.';
    }

    displayResponse(provider, response, duration) {
        const responseElement = this.responseElements[provider];
        const timeElement = this.timeElements[provider];
        
        responseElement.innerHTML = `<div class="response-text">${response}</div>`;
        timeElement.textContent = `${duration}s`;
    }

    displayError(provider, errorMessage) {
        const responseElement = this.responseElements[provider];
        responseElement.innerHTML = `
            <div class="error-message" style="color: #ef4444; text-align: center; padding: 20px;">
                <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 10px; opacity: 0.7;"></i>
                <p><strong>Error:</strong> ${errorMessage}</p>
                <p style="font-size: 0.9rem; margin-top: 10px; opacity: 0.8;">
                    ${this.apiKeys[provider] ? 'Check your API key and try again.' : 'Using free tier - this is a simulated error.'}
                </p>
            </div>
        `;
    }

    updateStatus(provider, status, text) {
        const statusElement = this.statusElements[provider];
        statusElement.className = `status-indicator ${status}`;
        statusElement.querySelector('span').textContent = text;
    }

    clearAll() {
        this.promptInput.value = '';
        this.clearResponses();
        this.promptInput.focus();
    }

    clearResponses() {
        this.providers.forEach(provider => {
            this.responseElements[provider].innerHTML = `
                <div class="placeholder">
                    <i class="fas fa-comment-dots"></i>
                    <p>Response will appear here...</p>
                </div>
            `;
            this.timeElements[provider].textContent = '';
            this.updateStatus(provider, 'ready', 'Ready');
        });
    }

    openSettings() {
        this.settingsModal.classList.add('active');
        this.modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeSettings() {
        this.settingsModal.classList.remove('active');
        this.modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    saveSettings() {
        // Save API keys
        Object.keys(this.apiKeyInputs).forEach(provider => {
            const value = this.apiKeyInputs[provider].value.trim();
            if (value) {
                this.apiKeys[provider] = value;
            } else {
                delete this.apiKeys[provider];
            }
        });

        // Save OpenRouter toggle state
        if (this.useOpenRouterToggle) {
            this.useOpenRouter = this.useOpenRouterToggle.checked;
            this.saveOpenRouterSetting();
        }

        this.saveApiKeys();
        this.closeSettings();
        
        const mode = this.useOpenRouter && this.apiKeys.openrouter ? 'OpenRouter' : 'individual APIs';
        this.showNotification(`Settings saved successfully! Using ${mode}.`, 'success');
    }

    resetSettings() {
        if (confirm('Are you sure you want to reset all API keys? This will switch back to free tier mode.')) {
            this.apiKeys = {};
            this.saveApiKeys();
            
            Object.values(this.apiKeyInputs).forEach(input => {
                input.value = '';
            });
            
            this.showNotification('Settings reset to free tier mode.', 'info');
        }
    }

    copyResponse(button) {
        const targetId = button.getAttribute('data-target');
        const responseElement = document.getElementById(targetId);
        const responseText = responseElement.querySelector('.response-text');
        
        if (!responseText) {
            this.showNotification('No response to copy.', 'warning');
            return;
        }

        navigator.clipboard.writeText(responseText.textContent).then(() => {
            button.classList.add('copied');
            button.innerHTML = '<i class="fas fa-check"></i>';
            
            setTimeout(() => {
                button.classList.remove('copied');
                button.innerHTML = '<i class="fas fa-copy"></i>';
            }, 2000);
            
            this.showNotification('Response copied to clipboard!', 'success');
        }).catch(err => {
            console.error('Failed to copy text:', err);
            this.showNotification('Failed to copy response.', 'error');
        });
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    getNotificationColor(type) {
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        return colors[type] || '#3b82f6';
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AIPromptComparison();
});

// Add some utility functions for enhanced functionality
window.AIUtils = {
    // Export responses as JSON
    exportResponses() {
        const responses = {};
        const prompt = document.getElementById('prompt-input').value;
        
        ['claude', 'chatgpt', 'perplexity', 'gemini'].forEach(provider => {
            const responseElement = document.getElementById(`${provider}-response`);
            const responseText = responseElement.querySelector('.response-text');
            const timeElement = document.getElementById(`${provider}-time`);
            
            responses[provider] = {
                response: responseText ? responseText.textContent : null,
                time: timeElement.textContent,
                timestamp: new Date().toISOString()
            };
        });
        
        const exportData = {
            prompt,
            responses,
            exportedAt: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ai-comparison-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    },
    
    // Import responses from JSON
    importResponses(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                document.getElementById('prompt-input').value = data.prompt || '';
                
                Object.keys(data.responses || {}).forEach(provider => {
                    const response = data.responses[provider];
                    if (response.response) {
                        const responseElement = document.getElementById(`${provider}-response`);
                        const timeElement = document.getElementById(`${provider}-time`);
                        
                        responseElement.innerHTML = `<div class="response-text">${response.response}</div>`;
                        timeElement.textContent = response.time || '';
                    }
                });
                
                console.log('Responses imported successfully');
            } catch (error) {
                console.error('Failed to import responses:', error);
            }
        };
        reader.readAsText(file);
    }
};
