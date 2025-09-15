// Kisan Saathi - JavaScript Application

class KisanSaathi {
  constructor() {
    this.currentSection = 'crop-advisory';
    this.messages = [];
    this.isLoading = false;
    this.weatherData = null;
    this.marketData = [];
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initializeChat();
    this.loadWeatherData();
    this.loadMarketData();
  }

  setupEventListeners() {
    // Sidebar navigation
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const section = e.currentTarget.dataset.section;
        this.switchSection(section);
      });
    });

    // Chat input
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    
    messageInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });
    
    sendButton.addEventListener('click', () => this.sendMessage());

    // Quick actions
    document.querySelectorAll('.quick-action').forEach(action => {
      action.addEventListener('click', (e) => {
        const actionType = e.currentTarget.dataset.action;
        this.handleQuickAction(actionType);
      });
    });

    // Language selector
    document.getElementById('language-select').addEventListener('change', (e) => {
      console.log('Language changed to:', e.target.value);
    });
  }

  switchSection(section) {
    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
    });
    document.querySelector(`[data-section="${section}"]`).classList.add('active');

    // Update content sections
    document.querySelectorAll('.content-section').forEach(section => {
      section.classList.remove('active');
    });

    // Update section title
    const titles = {
      'crop-advisory': 'AI Crop Advisor',
      'weather-alerts': 'Weather Advisory',
      'pest-detection': 'Pest Detection',
      'market-prices': 'Market Intelligence',
      'soil-health': 'Soil Health Advisor'
    };

    document.getElementById('section-title').textContent = titles[section];

    // Show appropriate section
    if (section === 'weather-alerts') {
      document.getElementById('weather-section').classList.add('active');
      this.renderWeatherWidget();
    } else if (section === 'market-prices') {
      document.getElementById('market-section').classList.add('active');
      this.renderMarketWidget();
    } else {
      document.getElementById('chat-section').classList.add('active');
    }

    this.currentSection = section;
  }

  initializeChat() {
    const welcomeMessage = {
      id: 'welcome',
      type: 'bot',
      content: `Namaste! 🙏 I'm your AI Crop Advisor. I'm here to help you with:

• Crop selection and planning
• Weather-based alerts
• Pest and disease identification
• Soil health recommendations
• Market prices
• Fertilizer guidance

How can I assist you today?`,
      timestamp: new Date()
    };

    this.messages = [welcomeMessage];
    this.renderMessages();
  }

  sendMessage() {
    const input = document.getElementById('message-input');
    const message = input.value.trim();
    
    if (!message || this.isLoading) return;

    // Add user message
    const userMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    this.messages.push(userMessage);
    input.value = '';
    this.hideQuickActions();
    this.renderMessages();
    
    // Show loading and generate bot response
    this.isLoading = true;
    this.showTypingIndicator();
    
    setTimeout(() => {
      const botResponse = this.generateBotResponse(message);
      const botMessage = {
        id: `bot-${Date.now()}`,
        type: 'bot',
        content: botResponse,
        timestamp: new Date()
      };

      this.messages.push(botMessage);
      this.isLoading = false;
      this.hideTypingIndicator();
      this.renderMessages();
    }, 1500);
  }

  generateBotResponse(message) {
    const lowerInput = message.toLowerCase();

    if (lowerInput.includes('weather')) {
      return "I'll get you the latest weather information for your location. Please share your location or specify the area you're interested in. Check the Weather Alerts section for detailed forecasts and farming recommendations.";
    } else if (lowerInput.includes('price') || lowerInput.includes('market')) {
      return "I can help you with current market prices for various crops. Which crop are you interested in selling or buying? You can also check the Market Prices section for live updates from APMCs across India.";
    } else if (lowerInput.includes('crop') || lowerInput.includes('plant')) {
      return "I'd be happy to help with crop recommendations! What's your location and what season are you planning for? I can suggest the best crops based on your soil type, climate, and market demand.";
    } else if (lowerInput.includes('soil')) {
      return "For soil health analysis, I can provide recommendations based on your soil type and crop requirements. Do you have any recent soil test reports? I can help interpret the results and suggest improvements.";
    } else if (lowerInput.includes('pest') || lowerInput.includes('disease')) {
      return "I can help identify pests and diseases! Please describe the symptoms you're seeing, or if you have images, I can analyze them. Early detection is key to effective treatment.";
    } else if (lowerInput.includes('fertilizer')) {
      return "For fertilizer recommendations, I need to know your crop type, growth stage, and soil conditions. NPK requirements vary by crop and season. What specific crop are you growing?";
    } else {
      return "That's a great question! I'm here to help with all aspects of farming. Could you provide more specific details so I can give you the most accurate advice?";
    }
  }

  handleQuickAction(actionType) {
    const messages = {
      weather: "Show me the weather forecast for my area",
      crops: "What crops should I plant this season?",
      prices: "Show me current market prices",
      soil: "Help me with soil health recommendations"
    };

    document.getElementById('message-input').value = messages[actionType];
  }

  showTypingIndicator() {
    const messagesContainer = document.getElementById('messages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = `
      <div class="message-avatar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
          <circle cx="9" cy="9" r="2"/>
          <path d="m21 15-3.086-3.086a2 2 0 0 0-1.414-.586H13"/>
          <path d="M11 11a2 2 0 0 1 2-2h.5"/>
        </svg>
      </div>
      <div class="message-bubble">
        <div class="typing-indicator">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>
      </div>
    `;
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }

  renderMessages() {
    const messagesContainer = document.getElementById('messages');
    messagesContainer.innerHTML = '';

    this.messages.forEach(message => {
      const messageDiv = document.createElement('div');
      messageDiv.className = `message ${message.type}`;
      messageDiv.innerHTML = `
        <div class="message-avatar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            ${message.type === 'bot' 
              ? '<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-1.414-.586H13"/><path d="M11 11a2 2 0 0 1 2-2h.5"/>'
              : '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>'
            }
          </svg>
        </div>
        <div class="message-bubble">
          <div class="message-content">${message.content}</div>
          <div class="message-time">${message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
      `;
      messagesContainer.appendChild(messageDiv);
    });

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    this.updateSendButton();
  }

  hideQuickActions() {
    document.getElementById('quick-actions').style.display = 'none';
  }

  updateSendButton() {
    const input = document.getElementById('message-input');
    const button = document.getElementById('send-button');
    
    button.disabled = !input.value.trim() || this.isLoading;
  }

  // Weather Service
  async loadWeatherData() {
    try {
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this.weatherData = {
        location: 'Mumbai, IN',
        temperature: 28,
        description: 'partly cloudy',
        humidity: 65,
        windSpeed: 12,
        pressure: 1013,
        visibility: 10,
        icon: '02d'
      };
    } catch (error) {
      console.error('Error loading weather data:', error);
    }
  }

  renderWeatherWidget() {
    const container = document.getElementById('weather-widget');
    
    if (!this.weatherData) {
      container.innerHTML = '<div class="loading">Loading weather data...</div>';
      return;
    }

    const advice = this.getWeatherAdvice(this.weatherData);
    
    container.innerHTML = `
      <div class="widget-card">
        <div class="widget-header">
          <div class="widget-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 0 1 2.5 8.2"/>
            </svg>
            Weather Forecast
          </div>
          <button class="refresh-button" onclick="kisanSaathi.loadWeatherData().then(() => kisanSaathi.renderWeatherWidget())">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
              <path d="M21 3v5h-5"/>
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
              <path d="M8 16H3v5"/>
            </svg>
          </button>
        </div>
        
        <div class="weather-main">
          <div class="weather-info">
            <div class="weather-icon">${this.getWeatherEmoji(this.weatherData.description)}</div>
            <div>
              <div class="temperature" style="color: ${this.getTemperatureColor(this.weatherData.temperature)}">${this.weatherData.temperature}°C</div>
              <div class="weather-description">${this.weatherData.description}</div>
            </div>
          </div>
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem; color: var(--muted-foreground); font-size: 0.875rem;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="width: 1rem; height: 1rem;">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              ${this.weatherData.location}
            </div>
          </div>
        </div>

        <div class="weather-details">
          <div class="detail-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="color: #3b82f6;">
              <path d="M12 2v10l3-3m-6 0 3 3V2"/>
            </svg>
            <div>
              <div class="detail-label">Humidity</div>
              <div class="detail-value">${this.weatherData.humidity}%</div>
            </div>
          </div>
          
          <div class="detail-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="color: #6b7280;">
              <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3A2 2 0 0 1 18 16H2a2 2 0 0 1 0-4h16a2 2 0 0 0 0-4z"/>
            </svg>
            <div>
              <div class="detail-label">Wind</div>
              <div class="detail-value">${this.weatherData.windSpeed} km/h</div>
            </div>
          </div>
          
          <div class="detail-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="color: #ef4444;">
              <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 1 1 4 0Z"/>
            </svg>
            <div>
              <div class="detail-label">Pressure</div>
              <div class="detail-value">${this.weatherData.pressure} hPa</div>
            </div>
          </div>
          
          <div class="detail-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="color: #8b5cf6;">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            <div>
              <div class="detail-label">Visibility</div>
              <div class="detail-value">${this.weatherData.visibility} km</div>
            </div>
          </div>
        </div>

        <div style="margin-top: 1rem; font-size: 0.75rem; color: var(--muted-foreground); text-align: right;">
          Last updated: ${new Date().toLocaleTimeString()}
        </div>
      </div>

      <div class="widget-card">
        <div class="widget-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
          </svg>
          Farming Recommendations
        </div>
        <div class="advice-list">
          ${advice.map(tip => `
            <div class="advice-item">
              <span class="advice-emoji">${tip.split(' ')[0]}</span>
              <p class="advice-text">${tip.substring(tip.indexOf(' ') + 1)}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  getWeatherEmoji(description) {
    if (description.includes('rain')) return '🌧️';
    if (description.includes('cloud')) return '⛅';
    if (description.includes('clear') || description.includes('sunny')) return '☀️';
    return '🌤️';
  }

  getTemperatureColor(temp) {
    if (temp > 35) return '#ef4444';
    if (temp > 25) return '#f97316';
    if (temp > 15) return '#22c55e';
    return '#3b82f6';
  }

  getWeatherAdvice(weather) {
    const advice = [];
    
    if (weather.temperature > 35) {
      advice.push("🌡️ Very hot weather! Ensure adequate irrigation and shade for crops.");
      advice.push("💧 Increase watering frequency, especially for young plants.");
    } else if (weather.temperature < 10) {
      advice.push("❄️ Cold weather alert! Protect sensitive crops from frost.");
      advice.push("🛡️ Consider using row covers or plastic tunnels.");
    }
    
    if (weather.humidity > 80) {
      advice.push("💨 High humidity detected! Monitor for fungal diseases.");
      advice.push("🍃 Ensure good air circulation around plants.");
    } else if (weather.humidity < 30) {
      advice.push("🏜️ Low humidity! Increase watering and consider mulching.");
    }
    
    if (weather.windSpeed > 20) {
      advice.push("💨 Strong winds expected! Secure tall plants and provide windbreaks.");
    }
    
    if (weather.description.includes('rain')) {
      advice.push("🌧️ Rain expected! Avoid field work and ensure proper drainage.");
      advice.push("🚿 Good natural irrigation - reduce manual watering.");
    }
    
    return advice.length > 0 ? advice : ["🌱 Current weather conditions are favorable for most farming activities."];
  }

  // Market Service
  async loadMarketData() {
    try {
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      this.marketData = [
        {
          commodity: "Rice",
          variety: "Common",
          market: "APMC Pune",
          state: "Maharashtra",
          price: { min: 2800, max: 3200, modal: 3000 },
          unit: "Quintal",
          date: new Date().toISOString().split('T')[0],
          trend: "up",
          change: 2.5
        },
        {
          commodity: "Wheat",
          variety: "Lokvan",
          market: "APMC Delhi",
          state: "Delhi",
          price: { min: 2200, max: 2600, modal: 2400 },
          unit: "Quintal",
          date: new Date().toISOString().split('T')[0],
          trend: "stable",
          change: 0.1
        },
        {
          commodity: "Onion",
          variety: "Red",
          market: "APMC Nashik",
          state: "Maharashtra",
          price: { min: 1500, max: 2000, modal: 1750 },
          unit: "Quintal",
          date: new Date().toISOString().split('T')[0],
          trend: "down",
          change: -5.2
        },
        {
          commodity: "Turmeric",
          variety: "Finger",
          market: "APMC Sangli",
          state: "Maharashtra",
          price: { min: 8500, max: 9500, modal: 9000 },
          unit: "Quintal",
          date: new Date().toISOString().split('T')[0],
          trend: "up",
          change: 8.7
        },
        {
          commodity: "Cotton",
          variety: "Medium Staple",
          market: "APMC Akola",
          state: "Maharashtra",
          price: { min: 5800, max: 6200, modal: 6000 },
          unit: "Quintal",
          date: new Date().toISOString().split('T')[0],
          trend: "stable",
          change: -0.8
        }
      ];
    } catch (error) {
      console.error('Error loading market data:', error);
    }
  }

  renderMarketWidget() {
    const container = document.getElementById('market-widget');
    
    if (!this.marketData.length) {
      container.innerHTML = '<div class="loading">Loading market data...</div>';
      return;
    }

    const advice = this.getMarketAdvice(this.marketData);
    
    container.innerHTML = `
      <div class="widget-card">
        <div class="market-controls">
          <div class="search-container">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input type="text" class="search-input" placeholder="Search commodities or markets..." id="market-search">
          </div>
          <button class="control-button" onclick="kisanSaathi.searchMarket()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="width: 1rem; height: 1rem; margin-right: 0.25rem;">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            Search
          </button>
          <button class="control-button" onclick="kisanSaathi.loadMarketData().then(() => kisanSaathi.renderMarketWidget())">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="width: 1rem; height: 1rem; margin-right: 0.25rem;">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
              <path d="M21 3v5h-5"/>
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
              <path d="M8 16H3v5"/>
            </svg>
            Refresh
          </button>
          <select class="state-select" id="state-select">
            <option value="">All States</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Delhi">Delhi</option>
            <option value="Madhya Pradesh">Madhya Pradesh</option>
          </select>
        </div>
      </div>

      <div class="widget-card">
        <div class="widget-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
          Live Market Prices
        </div>
        <div class="price-list">
          ${this.marketData.map((price, index) => `
            <div class="price-item">
              <div class="price-header">
                <div class="commodity-name">
                  <strong>${price.commodity}</strong>
                  ${price.variety ? `<span class="variety-badge">${price.variety}</span>` : ''}
                </div>
                <div class="price-trend">
                  ${this.getTrendIcon(price.trend)}
                  <span class="trend-badge ${price.trend}">
                    ${price.change > 0 ? '+' : ''}${price.change}%
                  </span>
                </div>
              </div>
              <div class="price-details">
                <div class="price-detail">
                  <div>
                    <div class="detail-label">Modal Price</div>
                    <div class="detail-value price-value">₹${price.price.modal}/${price.unit}</div>
                  </div>
                </div>
                <div class="price-detail">
                  <div>
                    <div class="detail-label">Range</div>
                    <div class="detail-value">₹${price.price.min} - ₹${price.price.max}</div>
                  </div>
                </div>
                <div class="price-detail">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  <div>
                    <div class="detail-label">Market</div>
                    <div class="detail-value">${price.market}</div>
                  </div>
                </div>
                <div class="price-detail">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                    <line x1="16" x2="16" y1="2" y2="6"/>
                    <line x1="8" x2="8" y1="2" y2="6"/>
                    <line x1="3" x2="21" y1="10" y2="10"/>
                  </svg>
                  <div>
                    <div class="detail-label">Date</div>
                    <div class="detail-value">${price.date}</div>
                  </div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      ${advice.length > 0 ? `
        <div class="widget-card">
          <div class="widget-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
            </svg>
            Market Insights
          </div>
          <div class="advice-list">
            ${advice.map(tip => `
              <div class="advice-item">
                <span class="advice-emoji">${tip.split(' ')[0]}</span>
                <p class="advice-text">${tip.substring(tip.indexOf(' ') + 1)}</p>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
    `;

    // Add event listener to search input
    document.getElementById('market-search').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.searchMarket();
      }
    });

    // Add event listener to state selector
    document.getElementById('state-select').addEventListener('change', (e) => {
      this.filterByState(e.target.value);
    });
  }

  getTrendIcon(trend) {
    if (trend === 'up') return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="width: 1rem; height: 1rem; color: #22c55e; stroke-width: 2;"><polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/></svg>';
    if (trend === 'down') return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="width: 1rem; height: 1rem; color: #ef4444; stroke-width: 2;"><polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/></svg>';
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="width: 1rem; height: 1rem; color: #6b7280; stroke-width: 2;"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 9h6v6h-6z"/></svg>';
  }

  getMarketAdvice(prices) {
    const advice = [];
    
    prices.forEach(price => {
      if (price.trend === 'up' && price.change > 5) {
        advice.push(`📈 ${price.commodity} prices are rising (+${price.change}%) - Good time to sell!`);
      } else if (price.trend === 'down' && price.change < -5) {
        advice.push(`📉 ${price.commodity} prices are falling (${price.change}%) - Consider holding or buying for future.`);
      }
    });
    
    if (advice.length === 0) {
      advice.push("📊 Market prices are relatively stable. Good time for planned transactions.");
    }
    
    return advice;
  }

  searchMarket() {
    const searchTerm = document.getElementById('market-search').value.toLowerCase();
    console.log('Searching for:', searchTerm);
    // In a real implementation, this would filter the data and re-render
  }

  filterByState(state) {
    console.log('Filtering by state:', state);
    // In a real implementation, this would filter the data and re-render
  }
}

// Initialize the application
const kisanSaathi = new KisanSaathi();

// Make it globally available for onclick handlers
window.kisanSaathi = kisanSaathi;