# AI Prompt Comparison Tool

A web application that allows you to compare responses from multiple AI providers (Claude, ChatGPT, Perplexity, and Gemini) using a single prompt. Perfect for evaluating different AI models and finding the best response for your needs.

![AI Prompt Comparison Tool](https://via.placeholder.com/800x400/667eea/ffffff?text=AI+Prompt+Comparison+Tool)

## Features

- 🤖 **Multi-Provider Support**: Compare responses from Claude, ChatGPT, Perplexity, and Gemini
- 🆓 **Free Tier Mode**: Test the interface with mock responses (no API keys required)
- 🔑 **API Integration**: Use your own API keys for real responses
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- ⚡ **Real-time Comparison**: Generate responses from all providers simultaneously
- 📋 **Copy & Export**: Easy copying and exporting of responses
- 🎨 **Modern UI**: Clean, intuitive interface with loading states and animations
- ⌨️ **Keyboard Shortcuts**: Ctrl+Enter to generate responses, Escape to close modals

## Quick Start

### Option 1: Direct Download
1. Download or clone this repository
2. Open `index.html` in your web browser
3. Start comparing AI responses!

### Option 2: Local Development Server
```bash
# Clone the repository
git clone https://github.com/yourusername/ai-prompt-comparison-app.git
cd ai-prompt-comparison-app

# Serve locally (using Python)
python -m http.server 8000

# Or using Node.js
npx serve .

# Open http://localhost:8000 in your browser
```

## Usage

### Free Tier Mode
1. Open the application in your browser
2. Enter your prompt in the text area
3. Click "Generate Responses" to see mock responses from all providers
4. Perfect for testing the interface and understanding the layout

### With API Keys
1. Click the "API Settings" button (gear icon)
2. Enter your API keys for the providers you want to use:
   - **Claude**: Get from [Anthropic Console](https://console.anthropic.com/)
   - **ChatGPT**: Get from [OpenAI Platform](https://platform.openai.com/api-keys)
   - **Perplexity**: Get from [Perplexity Settings](https://www.perplexity.ai/settings/api)
   - **Gemini**: Get from [Google AI Studio](https://makersuite.google.com/app/apikey)
3. Save your settings
4. Enter your prompt and generate real AI responses

### Keyboard Shortcuts
- `Ctrl + Enter`: Generate responses
- `Escape`: Close settings modal
- `Tab`: Navigate through interface elements

## API Configuration

### Supported Models
- **Claude**: claude-3-sonnet-20240229
- **ChatGPT**: gpt-3.5-turbo
- **Perplexity**: llama-3.1-sonar-small-128k-online
- **Gemini**: gemini-pro

### Rate Limits
Each provider has different rate limits. The application handles errors gracefully and will display appropriate messages if limits are exceeded.

### Security Notes
- API keys are stored locally in your browser's localStorage
- Keys are never sent to any third-party servers (except the respective AI providers)
- For production use, consider implementing a backend proxy for additional security

## File Structure

```
ai-prompt-comparison-app/
├── index.html              # Main HTML file
├── css/
│   └── styles.css          # All styling and responsive design
├── js/
│   └── app.js              # Main application logic
├── assets/                 # Images and icons (if any)
├── docs/                   # Additional documentation
├── .cline/
│   └── rules               # Development guidelines
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

## Development

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Text editor or IDE
- Optional: Local development server

### Code Style
- Modern JavaScript (ES6+) with classes and async/await
- Semantic HTML5 structure
- CSS Grid and Flexbox for layouts
- Mobile-first responsive design

### Adding New Providers
1. Add provider configuration in `js/app.js`
2. Implement API call method
3. Add UI elements in `index.html`
4. Style the new provider in `css/styles.css`

### Testing
- Test in both free tier and API key modes
- Verify responsive design on different screen sizes
- Test error handling with invalid API keys
- Ensure accessibility compliance

## Browser Compatibility

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Icons by [Font Awesome](https://fontawesome.com/)
- Fonts by [Google Fonts](https://fonts.google.com/)
- Gradient backgrounds inspired by [uiGradients](https://uigradients.com/)

## Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/ai-prompt-comparison-app/issues) page
2. Create a new issue with detailed information
3. Include browser version and steps to reproduce

## Roadmap

- [ ] Add more AI providers (Cohere, Mistral, etc.)
- [ ] Implement response comparison features
- [ ] Add prompt templates and history
- [ ] Support for file uploads and multimodal inputs
- [ ] Advanced model parameter settings
- [ ] Response analytics and metrics
- [ ] Dark mode theme
- [ ] Offline mode with cached responses

## GitHub Pages Deployment

This app can be deployed to GitHub Pages for free hosting. Follow these steps:

### Manual Setup (Recommended)
1. Sign in to GitHub and go to your repository: `https://github.com/huffdabeast/AI_Comparison`
2. Click on the "Settings" tab (you need to be signed in to see this)
3. Scroll down to "Pages" in the left sidebar
4. Under "Source", select "Deploy from a branch"
5. Choose "master" branch and "/ (root)" folder
6. Click "Save"
7. Your app will be available at: `https://huffdabeast.github.io/AI_Comparison/`

### Alternative: Using GitHub CLI
```bash
# If you have GitHub CLI installed
gh repo view --web
# Then navigate to Settings > Pages in the browser
```

**Note**: It may take a few minutes for the deployment to complete. GitHub will show you the deployment status and provide the live URL once ready.

---

**Made with ❤️ for the AI community**
