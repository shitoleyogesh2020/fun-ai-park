// Function to open specific tests
function openTest(testType) {
    if (testType === 'redflags') {
        const modal = document.getElementById('testModal');
        modal.style.display = 'block';
        // Use main app instead of separate red flag test
        funaiApp.openTest('redflags');
    } else {
        funaiApp.openTest(testType);
    }
}

// Main JavaScript functionality
class FunAIApp {
    constructor() {
        this.currentTest = null;
        this.userResults = {};
        this.userId = this.getUserId();
        this.hasFullAccess = this.checkFullAccess();
        this.init();
    }
    
    getUserId() {
        let userId = localStorage.getItem('userId');
        if (!userId) {
            userId = Math.random().toString(36).substr(2, 6).toUpperCase();
            localStorage.setItem('userId', userId);
        }
        return userId;
    }
    
    checkFullAccess() {
        const premiumData = localStorage.getItem('premiumAccess');
        if (!premiumData) return false;
        
        try {
            const data = JSON.parse(premiumData);
            // Check if user has all tests (full access)
            const allTests = ['age', 'character', 'toxic', 'future', 'internet', 'redflags'];
            return data.tests && allTests.every(test => data.tests.includes(test));
        } catch {
            return false;
        }
    }
    
    setFullAccess(testType = null) {
        const currentDevice = this.getDeviceFingerprint();
        let premiumData = {
            userId: this.userId,
            active: true,
            timestamp: Date.now(),
            devices: [currentDevice],
            tests: testType ? [testType] : ['age', 'character', 'toxic', 'future', 'internet', 'redflags']
        };
        
        // If user already has some premium tests, merge them
        const existing = localStorage.getItem('premiumAccess');
        if (existing && testType) {
            try {
                const existingData = JSON.parse(existing);
                if (existingData.tests && !existingData.tests.includes(testType)) {
                    premiumData.tests = [...existingData.tests, testType];
                }
            } catch {}
        }
        
        localStorage.setItem('premiumAccess', JSON.stringify(premiumData));
        this.hasFullAccess = !testType; // True only for all-access pass
    }
    
    hasTestAccess(testType) {
        const premiumData = localStorage.getItem('premiumAccess');
        if (!premiumData) return false;
        
        try {
            const data = JSON.parse(premiumData);
            return data.tests && data.tests.includes(testType);
        } catch {
            return false;
        }
    }
    
    getDeviceFingerprint() {
        return btoa(navigator.userAgent + screen.width + screen.height + navigator.language).substr(0, 16);
    }
    
    updateUIForPremiumUser() {
        // If a test is currently open, refresh its content to show premium badge
        if (this.currentTest) {
            const modalBody = document.getElementById('modalBody');
            if (modalBody) {
                modalBody.innerHTML = this.getTestContent(this.currentTest);
                this.setupTestInteractions(this.currentTest);
            }
        }
        // Update navigation badge
        this.updatePremiumBadge();
    }
    
    updatePremiumBadge() {
        const navBadge = document.getElementById('premiumUserBadge');
        if (navBadge) {
            navBadge.style.display = this.hasFullAccess ? 'flex' : 'none';
        }
    }
    
    init() {
        this.setupNavigation();
        this.setupFeatureCards();
        this.setupModal();
        this.setupScrollEffects();
        this.setupAnimations();
        this.updatePremiumBadge();
    }
    
    setupNavigation() {
        // Mobile menu toggle
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }
        
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
        
        // Navbar background on scroll
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            }
        });
    }
    
    setupFeatureCards() {
        const featureCards = document.querySelectorAll('.feature-card');
        
        featureCards.forEach(card => {
            const btn = card.querySelector('.feature-btn');
            const feature = card.dataset.feature;
            
            btn.addEventListener('click', () => {
                // Use global openTest function for all tests
                openTest(feature);
            });
        });
        
        // Hero CTA buttons
        const heroCTA = document.querySelector('.btn-primary');
        if (heroCTA) {
            heroCTA.addEventListener('click', () => {
                openTest('age'); // Default to age estimator
            });
        }
        
        // Pricing buttons
        const pricingBtns = document.querySelectorAll('.pricing-btn');
        pricingBtns.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                if (index === 0) {
                    // Start Free - open age test
                    openTest('age');
                } else if (index === 1) {
                    // Upgrade Now - show payment page
                    this.showPaymentPage('individual');
                } else {
                    // Get All Access - show payment page for pass
                    this.showPaymentPage('allaccess');
                }
            });
        });
        
        // Nav CTA button
        const navCTA = document.querySelector('.nav-cta');
        if (navCTA) {
            navCTA.addEventListener('click', () => {
                document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
            });
        }
    }
    
    setupModal() {
        const modal = document.getElementById('testModal');
        const closeBtn = document.querySelector('.close');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeModal();
            });
        }
        
        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });
    }
    
    openTest(testType) {
        const modal = document.getElementById('testModal');
        const modalBody = document.getElementById('modalBody');
        
        this.currentTest = testType;
        modalBody.innerHTML = this.getTestContent(testType);
        modal.style.display = 'block';
        
        // Setup test-specific functionality
        this.setupTestInteractions(testType);
        
        // Track analytics
        this.trackEvent('test_opened', { test_type: testType });
    }
    
    closeModal() {
        const modal = document.getElementById('testModal');
        modal.style.display = 'none';
        this.currentTest = null;
    }
    
    getTestContent(testType) {
        const testConfigs = {
            age: {
                title: 'Face Age Estimator',
                subtitle: 'How old do you look in Indian beauty standards?',
                icon: '👤',
                content: this.getAgeTestContent(),
                theme: 'age-test'
            },
            redflags: {
                title: 'Red Flag / Green Flag Test',
                subtitle: 'Discover your relationship and social patterns',
                icon: '🚩',
                content: this.getRedFlagTestContent(),
                theme: 'red-flag-test'
            },
            character: {
                title: 'Main Character Energy',
                subtitle: 'What\'s your Bollywood personality type?',
                icon: '⭐',
                content: this.getCharacterTestContent(),
                theme: 'character-test'
            },
            toxic: {
                title: 'How Toxic Are You?',
                subtitle: 'Time for some brutal honesty!',
                icon: '💀',
                content: this.getToxicTestContent(),
                theme: 'toxic-test'
            },
            future: {
                title: 'Who Are You Becoming in 2026?',
                subtitle: 'Based on your current habits and choices',
                icon: '🔮',
                content: this.getFutureTestContent(),
                theme: 'future-test'
            },
            internet: {
                title: 'Internet Personality Type',
                subtitle: 'Your digital persona across platforms',
                icon: '📱',
                content: this.getInternetTestContent(),
                theme: 'internet-test'
            }
        };
        
        const config = testConfigs[testType];
        const premiumBadge = (this.hasFullAccess || this.hasTestAccess(testType)) ? '<div class="premium-user-badge">👑 PREMIUM USER</div>' : '';
        
        return `
            <div class="test-header ${config.theme}">
                ${premiumBadge}
                <div class="test-header-content">
                    <div class="test-icon">${config.icon}</div>
                    <div class="test-title-group">
                        <h2>${config.title}</h2>
                        <p>${config.subtitle}</p>
                    </div>
                </div>
                <div class="test-progress-compact" id="headerProgress" style="display: none;">
                    <div class="progress-text">Question <span id="currentQ">1</span> of <span id="totalQ">5</span></div>
                    <div class="progress-bar">
                        <div class="progress-fill" id="headerProgressFill" style="width: 20%"></div>
                    </div>
                </div>
            </div>
            <div class="test-content ${config.theme}">
                ${config.content}
            </div>
        `;
    }
    
    getAgeTestContent() {
        return `
            <div class="age-test">
                <div class="upload-area" id="imageUpload">
                    <i class="fas fa-camera"></i>
                    <h3>Upload Your Photo</h3>
                    <button class="upload-btn" onclick="document.getElementById('imageInput').click()">
                        Choose Photo
                    </button>
                    <p>We'll analyze your face using Indian beauty standards</p>
                    <div class="ai-progress-notice">
                        <small>🤖 AI implementation under progress for more interesting results</small>
                    </div>
                    <input type="file" id="imageInput" name="imageFile" accept="image/*" style="display: none;">
                </div>
                
                <div class="filter-options" style="display: none;" id="filterOptions">
                    <h4>Choose Your Style</h4>
                    <div class="filter-grid">
                        <div class="filter-option" data-filter="wedding">
                            <div class="filter-preview">💒</div>
                            <span>Wedding Look</span>
                        </div>
                        <div class="filter-option" data-filter="diwali">
                            <div class="filter-preview">🪔</div>
                            <span>Diwali Festive</span>
                        </div>
                        <div class="filter-option" data-filter="office">
                            <div class="filter-preview">💼</div>
                            <span>Office Professional</span>
                        </div>
                        <div class="filter-option" data-filter="casual">
                            <div class="filter-preview">😊</div>
                            <span>Casual Daily</span>
                        </div>
                    </div>
                </div>
                
                <div class="result-preview scrollable-content" style="display: none;" id="ageResult">
                    <!-- Results will be dynamically loaded here -->
                </div>
            </div>
        `;
    }
    
    getRedFlagTestContent() {
        return `
            <div class="redflags-test">
                <div class="mode-selection">
                    <h3>Who are you testing?</h3>
                    <div class="mode-options">
                        <button class="mode-btn" onclick="funaiApp.startRedFlagTest('self')">
                            <div class="mode-icon">🪞</div>
                            <h4>Test Myself</h4>
                            <p>Discover your own red/green flag patterns</p>
                        </button>
                        <button class="mode-btn" onclick="funaiApp.startRedFlagTest('partner')">
                            <div class="mode-icon">💕</div>
                            <h4>Test My Partner</h4>
                            <p>Evaluate someone you're dating or interested in</p>
                        </button>
                    </div>
                </div>
                
                <div class="redflags-result scrollable-content" style="display: none;" id="redflagsResult">
                    <!-- Results will be loaded here -->
                </div>
            </div>
        `;
    }
    
    getCharacterTestContent() {
        return `
            <div class="character-test">
                <h3>Discover Your Main Character Energy</h3>
                <p>Answer these questions to find your Bollywood personality type!</p>
                
                <div class="character-questions" id="characterQuestions">
                    <div class="question-slide active">
                        <h4>What's your ideal weekend?</h4>
                        <div class="character-options">
                            <div class="char-option" data-type="hero">
                                <div class="char-emoji">🦸‍♂️</div>
                                <span>Adventure and helping others</span>
                            </div>
                            <div class="char-option" data-type="romantic">
                                <div class="char-emoji">💕</div>
                                <span>Romantic dinner and movies</span>
                            </div>
                            <div class="char-option" data-type="comic">
                                <div class="char-emoji">📱</div>
                                <span>Scrolling social media and memes</span>
                            </div>
                            <div class="char-option" data-type="villain">
                                <div class="char-emoji">😴</div>
                                <span>Netflix and chill at home</span>
                            </div>
                            <div class="char-option" data-type="social">
                                <div class="char-emoji">🎉</div>
                                <span>Hanging out with friends</span>
                            </div>
                            <div class="char-option" data-type="creative">
                                <div class="char-emoji">🎨</div>
                                <span>Creative projects and hobbies</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="character-result scrollable-content" style="display: none;" id="characterResult">
                    <div class="character-card">
                        <div class="character-avatar" id="characterAvatar">🦸‍♂️</div>
                        <h3 id="characterType">The Bollywood Hero</h3>
                        <p id="characterDescription">
                            You're the main character everyone roots for! Natural leader with a heart of gold.
                        </p>
                        
                        <div class="upgrade-prompt" ${(this.hasFullAccess || this.hasTestAccess('character')) ? 'style="display: none;"' : ''}>
                            <h4>🔓 Get Your Complete Character Package for ₹49</h4>
                            <ul>
                                <li>Detailed personality breakdown</li>
                                <li>Custom theme music recommendation</li>
                                <li>Bollywood-style poster</li>
                                <li>Instagram story templates</li>
                            </ul>
                            <button class="upgrade-btn" onclick="funaiApp.handleUpgrade()">Get Full Package</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    getToxicTestContent() {
        return `
            <div class="toxic-test">
                <div class="toxic-header">
                    <h3>How Toxic Are You? 💀</h3>
                    <p>Time for some brutal honesty. Answer truthfully!</p>
                </div>
                
                <div class="toxic-questions" id="toxicQuestions">
                    <!-- Questions will be loaded dynamically -->
                </div>
                
                <div class="toxic-result scrollable-content" style="display: none;" id="toxicResult">
                    <div class="toxicity-meter">
                        <h3>Your Toxicity Level</h3>
                        <div class="toxic-bar">
                            <div class="toxic-fill" id="toxicFill"></div>
                        </div>
                        <div class="toxic-labels">
                            <span>Angel 😇</span>
                            <span>Toxic 💀</span>
                        </div>
                        <div class="toxic-percentage" id="toxicPercentage">45%</div>
                    </div>
                    
                    <div class="upgrade-prompt" ${(this.hasFullAccess || this.hasTestAccess('toxic')) ? 'style="display: none;"' : ''}>
                        <h4>🔓 Get Roasted Properly for ₹79</h4>
                        <ul>
                            <li>Detailed toxic trait breakdown</li>
                            <li>Who you're toxic to (friends/work/family)</li>
                            <li>Savage but helpful improvement tips</li>
                            <li>Shareable roast card</li>
                        </ul>
                        <button class="upgrade-btn" onclick="funaiApp.handleUpgrade()">Get Full Roast</button>
                    </div>
                </div>
            </div>
        `;
    }
    
    getFutureTestContent() {
        return `
            <div class="future-test">
                <div class="future-header">
                    <h3>Who Are You Becoming in 2026? 🔮</h3>
                    <p>Answer these lifestyle questions to predict your future self!</p>
                </div>
                
                <div class="future-questions" id="futureQuestions">
                    <!-- Questions will be loaded dynamically -->
                </div>
                
                <div class="future-result scrollable-content" style="display: none;" id="futureResult">
                    <div class="future-card">
                        <h3>Your 2026 Prediction</h3>
                        <div class="future-avatar">🚀</div>
                        <h4 id="futureTitle">The Rising Star</h4>
                        <p id="futurePrediction">
                            Based on your habits, you're on track to become a successful professional with great work-life balance!
                        </p>
                        
                        <div class="upgrade-prompt" ${(this.hasFullAccess || this.hasTestAccess('future')) ? 'style="display: none;"' : ''}>
                            <h4>🔓 Get Complete 2026 Report for ₹99</h4>
                            <ul>
                                <li>Detailed year-by-year progression</li>
                                <li>Career and financial predictions</li>
                                <li>Relationship and health outlook</li>
                                <li>Actionable improvement plan</li>
                            </ul>
                            <button class="upgrade-btn" onclick="funaiApp.handleUpgrade()">Unlock Full Prediction</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    getInternetTestContent() {
        return `
            <div class="internet-test">
                <div class="internet-header">
                    <h3>What's Your Internet Personality? 📱</h3>
                    <p>Discover your digital persona across platforms!</p>
                </div>
                
                <div class="internet-questions" id="internetQuestions">
                    <!-- Questions will be loaded dynamically -->
                </div>
                
                <div class="internet-result scrollable-content" style="display: none;" id="internetResult">
                    <div class="personality-card">
                        <div class="personality-emoji" id="personalityEmoji">🤳</div>
                        <h3 id="personalityType">The Digital Native</h3>
                        <p id="personalityDesc">
                            You're authentically yourself across all platforms with a perfect balance of sharing and privacy!
                        </p>
                        
                        <div class="upgrade-prompt" ${(this.hasFullAccess || this.hasTestAccess('internet')) ? 'style="display: none;"' : ''}>
                            <h4>🔓 Get Premium Share Card for ₹49</h4>
                            <ul>
                                <li>Detailed platform analysis</li>
                                <li>Meme-style personality card</li>
                                <li>LinkedIn and Twitter breakdown</li>
                                <li>Social media optimization tips</li>
                            </ul>
                            <button class="upgrade-btn" onclick="funaiApp.handleUpgrade()">Get Share Card</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    setupTestInteractions(testType) {
        switch(testType) {
            case 'age':
                this.setupAgeTest();
                break;
            case 'redflags':
                this.setupRedFlagTest();
                break;
            case 'character':
                this.setupCharacterTest();
                break;
            case 'toxic':
                this.setupToxicTest();
                break;
            case 'future':
                this.setupFutureTest();
                break;
            case 'internet':
                this.setupInternetTest();
                break;
        }
    }
    
    setupAgeTest() {
        const imageInput = document.getElementById('imageInput');
        const uploadArea = document.getElementById('imageUpload');
        const filterOptions = document.getElementById('filterOptions');
        const ageResult = document.getElementById('ageResult');
        
        if (imageInput) {
            imageInput.addEventListener('change', (e) => {
                if (e.target.files[0]) {
                    // Simulate image processing
                    uploadArea.style.display = 'none';
                    filterOptions.style.display = 'block';
                    
                    // Setup filter selection
                    document.querySelectorAll('.filter-option').forEach(option => {
                        option.addEventListener('click', () => {
                            this.processAgeEstimation();
                        });
                    });
                }
            });
        }
    }
    
    processAgeEstimation() {
        // Simulate AI processing
        const filterOptions = document.getElementById('filterOptions');
        const ageResult = document.getElementById('ageResult');
        
        filterOptions.style.display = 'none';
        
        // Show loading
        ageResult.innerHTML = '<div class="loading-spinner"><div class="loading"></div><p>Analyzing your face...</p></div>';
        ageResult.style.display = 'block';
        
        setTimeout(() => {
            const estimatedAge = Math.floor(Math.random() * 15) + 20; // Random age between 20-35
            
            // Debug: Check premium access status
            console.log('Premium access status:', this.hasFullAccess);
            console.log('Should show upgrade button:', !this.hasFullAccess);
            
            // Get the actual age result content
            const resultContent = `
                <div class="result-card">
                    <h3>Your Estimated Age</h3>
                    <div class="age-display">
                        <span class="age-number">${estimatedAge}</span>
                        <span class="age-label">years old</span>
                    </div>
                    <p class="age-description">
                        You have a youthful glow that's perfect for Indian beauty standards!
                    </p>
                    
                    <!-- Locked Content with Overlay -->
                    <div class="locked-content" style="position: relative; min-height: 400px;">
                        <div class="result-locked">
                            <h4>Premium AI Analysis</h4>
                            <div class="premium-insights">
                                <div class="insight-item">
                                    <span class="insight-icon">🧬</span>
                                    <div class="insight-content">
                                        <h5>Genetic Age Score</h5>
                                        <p>Your biological age vs chronological age analysis</p>
                                    </div>
                                </div>
                                <div class="insight-item">
                                    <span class="insight-icon">✨</span>
                                    <div class="insight-content">
                                        <h5>Beauty Enhancement Tips</h5>
                                        <p>Personalized skincare & lifestyle recommendations</p>
                                    </div>
                                </div>
                                <div class="insight-item">
                                    <span class="insight-icon">📊</span>
                                    <div class="insight-content">
                                        <h5>Celebrity Look-Alike Match</h5>
                                        <p>Find your Bollywood/Hollywood doppelganger</p>
                                    </div>
                                </div>
                                <div class="insight-item">
                                    <span class="insight-icon">🎯</span>
                                    <div class="insight-content">
                                        <h5>Age Confidence Zones</h5>
                                        <p>Best angles, lighting & photo tips for you</p>
                                    </div>
                                </div>
                            </div>
                            <div class="beauty-score">
                                <h5>Detailed Beauty Metrics</h5>
                                <div class="score-bars">
                                    <div class="score-bar">Facial Symmetry: 85%</div>
                                    <div class="score-bar">Skin Quality: 92%</div>
                                    <div class="score-bar">Eye Appeal: 88%</div>
                                    <div class="score-bar">Smile Rating: 94%</div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="unlock-overlay" id="unlockOverlay" style="display: none;">
                            <div class="lock-icon">🔒</div>
                            <h4>Your detailed result is ready!</h4>
                            <div class="progress-locked">
                                <div class="progress-locked-fill"></div>
                            </div>
                            <p>🎯 Unlock premium analysis in 10 seconds</p>
                            <button class="upgrade-btn" onclick="funaiApp.handleUpgrade()">
                                🔓 Unlock Premium for ₹49
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            ageResult.innerHTML = resultContent;
            
            // If user has premium access, unlock content immediately
            if (this.hasFullAccess || this.hasTestAccess('age')) {
                // Remove overlay completely for premium users
                setTimeout(() => {
                    const overlay = ageResult.querySelector('#unlockOverlay');
                    if (overlay) overlay.remove();
                    this.unlockAgeTestPremiumContent();
                }, 100);
            } else {
                // Apply blur for non-premium users and show overlay
                const resultLocked = ageResult.querySelector('.result-locked');
                const unlockOverlay = ageResult.querySelector('#unlockOverlay');
                if (resultLocked) {
                    resultLocked.style.filter = 'blur(8px)';
                    resultLocked.style.pointerEvents = 'none';
                }
                if (unlockOverlay) {
                    unlockOverlay.style.display = 'block';
                }
            }
            
            // Debug: Check if button was created
            const upgradeBtn = document.querySelector('.upgrade-btn');
            console.log('Upgrade button found:', upgradeBtn);
            if (upgradeBtn) {
                console.log('Button display style:', window.getComputedStyle(upgradeBtn).display);
                console.log('Button visibility:', window.getComputedStyle(upgradeBtn).visibility);
            }
            
            this.createConfetti();
        }, 2000);
    }
    
    setupRedFlagTest() {
        // Red flag test is now handled in main file with unified premium logic
        console.log('Red flag test setup in main file');
    }
    
    startRedFlagTest(mode) {
        this.redFlagMode = mode;
        this.redFlagAnswers = [];
        this.currentRedFlagQ = 0;
        
        if (mode === 'partner') {
            this.showPartnerNameInput();
        } else {
            this.partnerName = 'You';
            this.showRedFlagQuestion();
        }
    }
    
    showPartnerNameInput() {
        const content = `
            <div class="partner-input">
                <h3>What's their name? (or nickname)</h3>
                <input type="text" id="partnerNameInput" placeholder="Enter name..." maxlength="20">
                <p>🔒 This stays private and makes questions more personal</p>
                <button class="continue-btn" onclick="funaiApp.setPartnerName()">Continue</button>
            </div>
        `;
        
        document.getElementById('redflagsResult').innerHTML = content;
        document.getElementById('redflagsResult').style.display = 'block';
        document.querySelector('.mode-selection').style.display = 'none';
        document.getElementById('partnerNameInput').focus();
    }
    
    setPartnerName() {
        const nameInput = document.getElementById('partnerNameInput');
        this.partnerName = nameInput.value.trim() || 'They';
        this.showRedFlagQuestion();
    }
    
    showRedFlagQuestion() {
        const subject = this.redFlagMode === 'partner' ? this.partnerName : 'you';
        const questions = [
            { q: `When ${subject} ${this.redFlagMode === 'partner' ? 'is' : 'are'} upset, ${subject}:`, options: [{emoji: "💬", text: "Talk openly and work through it", value: "green"}, {emoji: "⏰", text: "Need time but eventually open up", value: "yellow"}, {emoji: "🚪", text: "Shut down or give silent treatment", value: "red"}] },
            { q: `When you say no to ${subject}, ${subject}:`, options: [{emoji: "✅", text: "Respect your decision instantly", value: "green"}, {emoji: "❓", text: "Ask why but ultimately accept", value: "yellow"}, {emoji: "😤", text: "Keep pushing or guilt trip", value: "red"}] },
            { q: `${subject} treat${this.redFlagMode === 'partner' ? 's' : ''} service workers:`, options: [{emoji: "😊", text: "Always polite and respectful", value: "green"}, {emoji: "😐", text: "Generally nice but impatient", value: "yellow"}, {emoji: "😤", text: "Rude or condescending", value: "red"}] },
            { q: `${subject} treat${this.redFlagMode === 'partner' ? 's' : ''} your friends and family:`, options: [{emoji: "🤗", text: "Make genuine effort to connect", value: "green"}, {emoji: "🙂", text: "Polite but don't go out of way", value: "yellow"}, {emoji: "😒", text: "Show disinterest or try to isolate you", value: "red"}] },
            { q: `During arguments, ${subject}:`, options: [{emoji: "🤝", text: "Stay calm and work toward solutions", value: "green"}, {emoji: "😤", text: "Get heated but eventually resolve", value: "yellow"}, {emoji: "😡", text: "Yell, name-call, or bring up past", value: "red"}] },
            { q: `${subject} ${this.redFlagMode === 'partner' ? 'talks' : 'talk'} about ${this.redFlagMode === 'partner' ? 'their' : 'your'} ex:`, options: [{emoji: "🤐", text: "Rarely mentions or speaks neutrally", value: "green"}, {emoji: "💬", text: "Occasionally brings them up", value: "yellow"}, {emoji: "🙄", text: "Constantly compares or bad-mouths", value: "red"}] },
            { q: `${subject} ${this.redFlagMode === 'partner' ? 'is' : 'are'} on social media:`, options: [{emoji: "📱", text: "Include you, don't hide relationship", value: "green"}, {emoji: "😐", text: "Normal activity, not obsessive", value: "yellow"}, {emoji: "😳", text: "Secretive or attention-seeking", value: "red"}] },
            { q: `When planning the future, ${subject}:`, options: [{emoji: "👫", text: "Include you in joint decisions", value: "green"}, {emoji: "🤔", text: "Consider input but decide alone", value: "yellow"}, {emoji: "😶", text: "Make plans without consulting", value: "red"}] }
        ];
        
        if (this.currentRedFlagQ >= questions.length) {
            this.calculateRedFlagResults();
            return;
        }
        
        const q = questions[this.currentRedFlagQ];
        const progress = ((this.currentRedFlagQ + 1) / questions.length) * 100;
        
        const content = `
            <div class="question-card social-style">
                <div class="test-progress-text">
                    <span>Question ${this.currentRedFlagQ + 1} of ${questions.length}</span>
                </div>
                <h3>💭 ${q.q}</h3>
                <div class="social-options">
                    ${q.options.map((opt, i) => `
                        <div class="social-option" onclick="funaiApp.selectRedFlagAnswer('${opt.value}')">
                            <div class="option-emoji">${opt.emoji}</div>
                            <div class="option-content">
                                <p>${opt.text}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        document.getElementById('redflagsResult').innerHTML = content;
        document.getElementById('redflagsResult').style.display = 'block';
        document.querySelector('.mode-selection').style.display = 'none';
    }
    
    selectRedFlagAnswer(value) {
        this.redFlagAnswers.push(value);
        this.currentRedFlagQ++;
        setTimeout(() => this.showRedFlagQuestion(), 500);
    }
    
    calculateRedFlagResults() {
        const redFlags = this.redFlagAnswers.filter(a => a === 'red').length;
        const yellowFlags = this.redFlagAnswers.filter(a => a === 'yellow').length;
        const greenFlags = this.redFlagAnswers.filter(a => a === 'green').length;
        
        this.showRedFlagResults(redFlags, yellowFlags, greenFlags, this.redFlagMode);
    }
    
    showRedFlagResults(redFlags, yellowFlags, greenFlags, mode) {
        const total = redFlags + yellowFlags + greenFlags;
        const redPercentage = Math.round((redFlags / total) * 100);
        const yellowPercentage = Math.round((yellowFlags / total) * 100);
        const greenPercentage = Math.round((greenFlags / total) * 100);
        
        const subject = mode === 'partner' ? this.partnerName : 'You';
        const subjectVerb = mode === 'partner' ? 'shows' : 'have';
        
        let flagType, description;
        if (redPercentage >= 50) {
            flagType = "🚑 Red Flag Alert";
            description = `${subject} ${subjectVerb} concerning patterns that need attention.`;
        } else if (greenPercentage >= 50) {
            flagType = "✅ Green Flag Champion";
            description = `${subject} ${subjectVerb} healthy relationship patterns!`;
        } else {
            flagType = "⚠️ Mixed Signals";
            description = `${subject} ${subjectVerb} a mix of healthy and concerning patterns.`;
        }
        
        const resultContent = `
            <div class="result-card">
                <h3>${mode === 'partner' ? this.partnerName + "'s" : "Your"} Results</h3>
                <p>Based on ${total} scenarios</p>
                
                <h3>${flagType}</h3>
                <p>${description}</p>
                
                <div class="flag-breakdown">
                    <div class="flag-stat">
                        <span>🚑 ${redFlags} (${redPercentage}%) Red Flags</span>
                    </div>
                    <div class="flag-stat">
                        <span>⚠️ ${yellowFlags} (${yellowPercentage}%) Yellow Flags</span>
                    </div>
                    <div class="flag-stat">
                        <span>✅ ${greenFlags} (${greenPercentage}%) Green Flags</span>
                    </div>
                </div>
                
                <div class="upgrade-prompt" ${(this.hasFullAccess || this.hasTestAccess('redflags')) ? 'style="display: none;"' : ''}>
                    <h4>🔓 Get Complete Analysis for ₹99</h4>
                    <ul>
                        <li>Detailed category breakdown</li>
                        <li>Relationship compatibility score</li>
                        <li>Personalized action plan</li>
                        <li>Premium shareable card</li>
                    </ul>
                    <button class="upgrade-btn" onclick="funaiApp.handleUpgrade()">Unlock Full Analysis</button>
                </div>
            </div>
        `;
        
        document.getElementById('redflagsResult').innerHTML = resultContent;
        document.getElementById('redflagsResult').style.display = 'block';
        document.querySelector('.mode-selection').style.display = 'none';
        
        // Auto-unlock for premium users
        if (this.hasFullAccess || this.hasTestAccess('redflags')) {
            setTimeout(() => {
                this.showPremiumRedFlagContent(redFlags, yellowFlags, greenFlags);
            }, 500);
        }
    }
    
    displayRedFlagQuestion(questions, currentQ, answers) {
        if (currentQ >= questions.length) {
            this.calculateRedFlagScore(answers);
            return;
        }
        
        const questionContainer = document.getElementById('questionContainer');
        const question = questions[currentQ];
        
        questionContainer.innerHTML = `
            <div class="question-card">
                <h3>${question.text}</h3>
                <div class="options">
                    ${question.options.map(option => `
                        <button class="option-btn" data-value="${option.value}">
                            <span class="flag-icon">${option.value === 'green' ? '🟢' : option.value === 'yellow' ? '🟡' : '🔴'}</span>
                            ${option.text}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
        
        // Update progress
        document.getElementById('currentQ').textContent = currentQ + 1;
        document.getElementById('progressFill').style.width = `${((currentQ + 1) / questions.length) * 100}%`;
        
        // Handle option selection
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from siblings
                btn.parentElement.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                
                // Add confetti effect
                this.createConfetti();
                
                answers.push(btn.dataset.value);
                setTimeout(() => {
                    this.displayRedFlagQuestion(questions, currentQ + 1, answers);
                }, 800);
            });
        });
    }
    
    calculateRedFlagScore(answers) {
        const redFlags = answers.filter(a => a === 'red').length;
        const yellowFlags = answers.filter(a => a === 'yellow').length;
        const score = Math.round(((redFlags * 2 + yellowFlags) / (answers.length * 2)) * 100);
        
        document.getElementById('questionContainer').style.display = 'none';
        document.getElementById('redflagResult').style.display = 'block';
        document.getElementById('redFlagScore').textContent = score;
        
        const descriptions = {
            low: "You're mostly green flags with great relationship skills!",
            medium: "You have some areas to work on, but you're on the right track!",
            high: "Time for some serious self-reflection and growth!"
        };
        
        const level = score < 30 ? 'low' : score < 60 ? 'medium' : 'high';
        document.getElementById('scoreDescription').textContent = descriptions[level];
    }
    
    setupCharacterTest() {
        let currentQuestion = 0;
        let answers = [];
        const questions = [
            {
                question: "What's your ideal weekend?",
                options: [
                    { type: 'hero', emoji: '🦸♂️', text: 'Adventure and helping others' },
                    { type: 'romantic', emoji: '💕', text: 'Romantic dinner and movies' },
                    { type: 'comic', emoji: '📱', text: 'Scrolling social media and memes' },
                    { type: 'villain', emoji: '😴', text: 'Netflix and chill at home' },
                    { type: 'social', emoji: '🎉', text: 'Hanging out with friends' },
                    { type: 'creative', emoji: '🎨', text: 'Creative projects and hobbies' }
                ]
            },
            {
                question: "Your friends describe you as:",
                options: [
                    { type: 'hero', emoji: '💪', text: 'The reliable one who helps everyone' },
                    { type: 'romantic', emoji: '💖', text: 'The hopeless romantic' },
                    { type: 'comic', emoji: '😂', text: 'The meme lord with perfect timing' },
                    { type: 'villain', emoji: '😎', text: 'The chill one who avoids drama' },
                    { type: 'social', emoji: '🌟', text: 'The life of every party' },
                    { type: 'creative', emoji: '✨', text: 'The artistic dreamer' }
                ]
            },
            {
                question: "When stressed, you:",
                options: [
                    { type: 'hero', emoji: '🏃', text: 'Take action and solve problems' },
                    { type: 'romantic', emoji: '🎵', text: 'Listen to music and daydream' },
                    { type: 'comic', emoji: '📱', text: 'Watch funny videos online' },
                    { type: 'villain', emoji: '🛏️', text: 'Sleep it off or binge-watch shows' },
                    { type: 'social', emoji: '📞', text: 'Call friends and vent' },
                    { type: 'creative', emoji: '🎨', text: 'Express yourself through art' }
                ]
            },
            {
                question: "Your Instagram feed is mostly:",
                options: [
                    { type: 'hero', emoji: '🌍', text: 'Travel adventures and achievements' },
                    { type: 'romantic', emoji: '🌹', text: 'Aesthetic photos and quotes' },
                    { type: 'comic', emoji: '😂', text: 'Memes and funny stories' },
                    { type: 'villain', emoji: '🍕', text: 'Food and cozy home vibes' },
                    { type: 'social', emoji: '👥', text: 'Group photos and events' },
                    { type: 'creative', emoji: '🎭', text: 'Your artwork and projects' }
                ]
            },
            {
                question: "Your dream job would be:",
                options: [
                    { type: 'hero', emoji: '🚀', text: 'CEO or team leader' },
                    { type: 'romantic', emoji: '💍', text: 'Wedding planner or writer' },
                    { type: 'comic', emoji: '📺', text: 'Content creator or comedian' },
                    { type: 'villain', emoji: '💻', text: 'Remote work from home' },
                    { type: 'social', emoji: '🎤', text: 'Event organizer or PR' },
                    { type: 'creative', emoji: '🎬', text: 'Artist or filmmaker' }
                ]
            }
        ];

        const showQuestion = () => {
            const q = questions[currentQuestion];
            const container = document.getElementById('characterQuestions');
            
            container.innerHTML = `
                <div class="question-slide active">
                    <div class="question-progress">
                        <span>Question ${currentQuestion + 1} of ${questions.length}</span>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${((currentQuestion + 1) / questions.length) * 100}%"></div>
                        </div>
                    </div>
                    <h4>${q.question}</h4>
                    <div class="character-options">
                        ${q.options.map(option => `
                            <div class="char-option" data-type="${option.type}">
                                <span>${option.emoji} ${option.text}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;

            document.querySelectorAll('.char-option').forEach(option => {
                option.addEventListener('click', () => {
                    document.querySelectorAll('.char-option').forEach(opt => opt.classList.remove('selected'));
                    option.classList.add('selected');
                    
                    answers.push(option.dataset.type);
                    
                    setTimeout(() => {
                        currentQuestion++;
                        if (currentQuestion < questions.length) {
                            showQuestion();
                        } else {
                            this.calculateCharacterResult(answers);
                        }
                    }, 800);
                });
            });
        };

        showQuestion();
    }
    
    showCharacterResult(type, counts) {
        const types = {
            hero: { emoji: '🦸‍♂️', title: 'The Bollywood Hero', desc: 'Natural leader with a heart of gold!' },
            romantic: { emoji: '💕', title: 'The Romantic Lead', desc: 'You believe in love and happy endings!' },
            comic: { emoji: '📱', title: 'The Social Media Star', desc: 'You live for the latest trends and viral content!' },
            villain: { emoji: '😴', title: 'The Chill Homebody', desc: 'You know how to relax and enjoy simple pleasures!' },
            social: { emoji: '🎉', title: 'The Social Butterfly', desc: 'You thrive on connections and good vibes!' },
            creative: { emoji: '🎨', title: 'The Creative Soul', desc: 'You express yourself through art and imagination!' }
        };
        
        const result = types[type];
        const total = Object.values(counts).reduce((a, b) => a + b, 0);
        
        document.getElementById('characterQuestions').style.display = 'none';
        document.getElementById('characterResult').style.display = 'block';
        document.getElementById('characterAvatar').textContent = result.emoji;
        document.getElementById('characterType').textContent = result.title;
        document.getElementById('characterDescription').innerHTML = `
            ${result.desc}<br><br>
            <strong>Your personality breakdown:</strong><br>
            ${Object.entries(counts).map(([key, count]) => 
                `${types[key].emoji} ${types[key].title.replace('The ', '')}: ${Math.round((count/total)*100)}%`
            ).join('<br>')}
        `;
    }
    
    calculateCharacterResult(answers) {
        const counts = {};
        answers.forEach(answer => {
            counts[answer] = (counts[answer] || 0) + 1;
        });
        
        const dominantType = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
        
        this.createConfetti();
        setTimeout(() => {
            this.showCharacterResult(dominantType, counts);
            if (this.hasFullAccess || this.hasTestAccess('character')) {
                setTimeout(() => this.showPremiumCharacterContent(), 500);
            }
        }, 1000);
    }
    
    setupToxicTest() {
        const questionSets = [
            [
                { q: "When someone cuts you off in traffic, you:", emoji: "🚗" },
                { q: "Your friend cancels plans last minute, you:", emoji: "📅" },
                { q: "Someone takes credit for your work, you:", emoji: "💼" },
                { q: "You see your ex with someone new, you:", emoji: "💔" },
                { q: "A waiter gets your order wrong, you:", emoji: "🍽️" }
            ],
            [
                { q: "Your roommate leaves dishes in the sink, you:", emoji: "🍽️" },
                { q: "Someone doesn't reply to your text, you:", emoji: "📱" },
                { q: "You lose an argument online, you:", emoji: "💻" },
                { q: "Your boss gives you extra work, you:", emoji: "📊" },
                { q: "Someone spoils a movie for you, you:", emoji: "🎬" }
            ],
            [
                { q: "Your friend gets promoted before you, you:", emoji: "🏆" },
                { q: "Someone doesn't hold the elevator, you:", emoji: "🛗" },
                { q: "You're stuck in a long queue, you:", emoji: "⏰" },
                { q: "Someone borrows money and doesn't return it, you:", emoji: "💰" },
                { q: "Your favorite restaurant is closed, you:", emoji: "🏪" }
            ]
        ];
        
        const randomSet = questionSets[Math.floor(Math.random() * questionSets.length)];
        this.loadToxicQuestions(randomSet);
    }
    
    loadToxicQuestions(questions) {
        const container = document.getElementById('toxicQuestions');
        let answers = [];
        let currentQ = 0;
        
        const showQuestion = () => {
            if (currentQ >= questions.length) {
                this.calculateToxicScore(answers);
                return;
            }
            
            const q = questions[currentQ];
            container.innerHTML = `
                <div class="toxic-question-card">
                    <div class="question-progress">
                        <span>Question ${currentQ + 1} of ${questions.length} ${q.emoji}</span>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${((currentQ + 1) / questions.length) * 100}%"></div>
                        </div>
                    </div>
                    <h4>${q.q}</h4>
                    <div class="toxic-scale">
                        <button class="scale-btn angel" data-value="1">
                            <span class="scale-emoji">😇</span>
                            <span class="scale-text">Stay Zen</span>
                        </button>
                        <button class="scale-btn mild" data-value="2">
                            <span class="scale-emoji">😐</span>
                            <span class="scale-text">Slightly Annoyed</span>
                        </button>
                        <button class="scale-btn medium" data-value="3">
                            <span class="scale-emoji">😤</span>
                            <span class="scale-text">Pretty Mad</span>
                        </button>
                        <button class="scale-btn spicy" data-value="4">
                            <span class="scale-emoji">😡</span>
                            <span class="scale-text">Rage Mode</span>
                        </button>
                        <button class="scale-btn toxic" data-value="5">
                            <span class="scale-emoji">😈</span>
                            <span class="scale-text">Full Villain</span>
                        </button>
                    </div>
                </div>
            `;
            
            document.querySelectorAll('.scale-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    document.querySelectorAll('.scale-btn').forEach(b => b.classList.remove('selected'));
                    btn.classList.add('selected');
                    
                    answers.push(parseInt(btn.dataset.value));
                    
                    setTimeout(() => {
                        currentQ++;
                        showQuestion();
                    }, 800);
                });
            });
        };
        
        showQuestion();
    }
    
    calculateToxicScore(answers) {
        const average = answers.reduce((a, b) => a + b, 0) / answers.length;
        const percentage = Math.round((average / 5) * 100);
        
        document.getElementById('toxicQuestions').style.display = 'none';
        document.getElementById('toxicResult').style.display = 'block';
        document.getElementById('toxicFill').style.width = `${percentage}%`;
        document.getElementById('toxicPercentage').textContent = `${percentage}%`;
        
        if (this.hasFullAccess || this.hasTestAccess('toxic')) {
            setTimeout(() => this.showPremiumToxicContent(), 500);
        }
    }
    
    setupFutureTest() {
        const questions = [
            {
                q: "What's your current career focus? 💼",
                options: [
                    { text: "Learning new skills daily", value: 5, icon: "📚" },
                    { text: "Building professional network", value: 4, icon: "🤝" },
                    { text: "Just doing my job", value: 2, icon: "😐" },
                    { text: "Looking for better opportunities", value: 3, icon: "🔍" }
                ]
            },
            {
                q: "How do you handle money? 💰",
                options: [
                    { text: "Save 30%+ of income", value: 5, icon: "💎" },
                    { text: "Save when I remember", value: 3, icon: "🤷" },
                    { text: "Spend everything I earn", value: 1, icon: "💸" },
                    { text: "Invest in stocks/crypto", value: 4, icon: "📈" }
                ]
            },
            {
                q: "Your health routine? 🏃",
                options: [
                    { text: "Gym 5+ times a week", value: 5, icon: "💪" },
                    { text: "Occasional walks/yoga", value: 3, icon: "🚶" },
                    { text: "Health? What's that?", value: 1, icon: "🍕" },
                    { text: "Sports/dancing regularly", value: 4, icon: "⚽" }
                ]
            },
            {
                q: "Your learning mindset? 🧠",
                options: [
                    { text: "Always reading/courses", value: 5, icon: "📖" },
                    { text: "Learn when needed for work", value: 3, icon: "💻" },
                    { text: "School was enough", value: 1, icon: "🎓" },
                    { text: "YouTube University graduate", value: 4, icon: "📺" }
                ]
            },
            {
                q: "Social life balance? 👥",
                options: [
                    { text: "Quality time with close friends", value: 4, icon: "❤️" },
                    { text: "Party every weekend", value: 2, icon: "🎉" },
                    { text: "Netflix is my best friend", value: 1, icon: "📺" },
                    { text: "Mix of social and alone time", value: 5, icon: "⚖️" }
                ]
            },
            {
                q: "How do you handle stress? 😰",
                options: [
                    { text: "Meditation and deep breathing", value: 5, icon: "🧘" },
                    { text: "Talk to friends/family", value: 4, icon: "💬" },
                    { text: "Binge eat or shop", value: 1, icon: "🛒" },
                    { text: "Exercise or music", value: 3, icon: "🎵" }
                ]
            },
            {
                q: "Your relationship with technology? 📱",
                options: [
                    { text: "Use it to boost productivity", value: 5, icon: "⚡" },
                    { text: "Social media addict", value: 2, icon: "📸" },
                    { text: "Minimal usage, prefer offline", value: 3, icon: "🌿" },
                    { text: "Always learning new apps/tools", value: 4, icon: "🔧" }
                ]
            },
            {
                q: "Your approach to challenges? 🎯",
                options: [
                    { text: "Bring it on! I love challenges", value: 5, icon: "🔥" },
                    { text: "Take them step by step", value: 4, icon: "🪜" },
                    { text: "Avoid them if possible", value: 1, icon: "🙈" },
                    { text: "Ask for help immediately", value: 3, icon: "🆘" }
                ]
            },
            {
                q: "Your morning routine? 🌅",
                options: [
                    { text: "5 AM wake up, workout, plan day", value: 5, icon: "⏰" },
                    { text: "Coffee first, then figure it out", value: 3, icon: "☕" },
                    { text: "Snooze until the last minute", value: 1, icon: "😴" },
                    { text: "Consistent routine, not too early", value: 4, icon: "📅" }
                ]
            },
            {
                q: "Your biggest motivation? 🚀",
                options: [
                    { text: "Making a positive impact", value: 5, icon: "🌟" },
                    { text: "Financial freedom", value: 4, icon: "💰" },
                    { text: "Just getting by comfortably", value: 2, icon: "😌" },
                    { text: "Recognition and success", value: 3, icon: "🏆" }
                ]
            }
        ];
        
        this.loadFutureQuestions(questions);
    }
    
    loadFutureQuestions(questions) {
        const container = document.getElementById('futureQuestions');
        let answers = [];
        let currentQ = 0;
        
        const showQuestion = () => {
            if (currentQ >= questions.length) {
                this.calculateFutureScore(answers);
                return;
            }
            
            const q = questions[currentQ];
            container.innerHTML = `
                <div class="future-question-card">
                    <div class="question-progress">
                        <span>Question ${currentQ + 1} of ${questions.length}</span>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${((currentQ + 1) / questions.length) * 100}%"></div>
                        </div>
                    </div>
                    <h4>${q.q}</h4>
                    <div class="future-options">
                        ${q.options.map(option => `
                            <button class="future-option" data-value="${option.value}">
                                <span class="option-icon">${option.icon}</span>
                                <span class="option-text">${option.text}</span>
                            </button>
                        `).join('')}
                    </div>
                </div>
            `;
            
            document.querySelectorAll('.future-option').forEach(btn => {
                btn.addEventListener('click', () => {
                    document.querySelectorAll('.future-option').forEach(b => b.classList.remove('selected'));
                    btn.classList.add('selected');
                    
                    answers.push(parseInt(btn.dataset.value));
                    
                    setTimeout(() => {
                        currentQ++;
                        showQuestion();
                    }, 800);
                });
            });
        };
        
        showQuestion();
    }
    
    calculateFutureScore(answers) {
        const average = answers.reduce((a, b) => a + b, 0) / answers.length;
        const percentage = Math.round((average / 5) * 100);
        
        const predictions = {
            veryLow: { 
                title: 'The Comfort Seeker 🛌', 
                desc: 'You value comfort and stability. 2026 will be peaceful, but growth requires stepping outside your comfort zone!',
                avatar: '🛌'
            },
            low: { 
                title: 'The Dreamer 💭', 
                desc: 'You have big dreams but need to turn them into daily actions. 2026 you will thank 2024 you for starting now!',
                avatar: '💭'
            },
            mediumLow: {
                title: 'The Steady Climber 🧗',
                desc: 'You\'re making consistent progress! Keep building these habits and 2026 will show significant growth.',
                avatar: '🧗'
            },
            medium: { 
                title: 'The Rising Star 🌟', 
                desc: 'You\'re building solid foundations! Keep this momentum and 2026 will be your breakthrough year.',
                avatar: '🌟'
            },
            mediumHigh: {
                title: 'The Achiever 🏆',
                desc: 'You\'re already excelling! Fine-tune your approach and 2026 will bring major accomplishments.',
                avatar: '🏆'
            },
            high: { 
                title: 'The Future CEO 👑', 
                desc: 'Your habits are elite-level! You\'re on track to achieve extraordinary success by 2026.',
                avatar: '👑'
            },
            veryHigh: {
                title: 'The Unstoppable Force ⚡',
                desc: 'You\'re operating at peak performance! 2026 will be legendary if you maintain this intensity.',
                avatar: '⚡'
            }
        };
        
        let level;
        if (percentage < 25) level = 'veryLow';
        else if (percentage < 40) level = 'low';
        else if (percentage < 55) level = 'mediumLow';
        else if (percentage < 70) level = 'medium';
        else if (percentage < 85) level = 'mediumHigh';
        else if (percentage < 95) level = 'high';
        else level = 'veryHigh';
        
        const prediction = predictions[level];
        
        document.getElementById('futureQuestions').style.display = 'none';
        document.getElementById('futureResult').style.display = 'block';
        document.querySelector('.future-avatar').textContent = prediction.avatar;
        document.getElementById('futureTitle').textContent = prediction.title;
        document.getElementById('futurePrediction').textContent = prediction.desc;
        
        this.createConfetti();
        
        if (this.hasFullAccess || this.hasTestAccess('future')) {
            setTimeout(() => this.showPremiumFutureContent(), 500);
        }
    }
    
    setupInternetTest() {
        const questions = [
            {
                q: "Your WhatsApp status game? 📱",
                options: [
                    { text: "Always updated with quotes/pics", value: 4, icon: "✨" },
                    { text: "Rarely change it", value: 2, icon: "😐" },
                    { text: "Only for special occasions", value: 3, icon: "🎉" },
                    { text: "What's a status?", value: 1, icon: "🤷" }
                ]
            },
            {
                q: "Instagram posting style? 📸",
                options: [
                    { text: "Curated feed, perfect aesthetic", value: 5, icon: "🎨" },
                    { text: "Random moments, authentic vibes", value: 4, icon: "😊" },
                    { text: "Mostly stories, few posts", value: 3, icon: "📹" },
                    { text: "Just scroll and like", value: 1, icon: "👀" }
                ]
            },
            {
                q: "LinkedIn presence? 💼",
                options: [
                    { text: "Regular posts about industry", value: 5, icon: "📈" },
                    { text: "Share others' content sometimes", value: 3, icon: "🔄" },
                    { text: "Just for job hunting", value: 2, icon: "🔍" },
                    { text: "Profile exists, that's it", value: 1, icon: "😴" }
                ]
            },
            {
                q: "Twitter/X behavior? 🐦",
                options: [
                    { text: "Tweet thoughts and engage daily", value: 5, icon: "💬" },
                    { text: "Retweet and comment sometimes", value: 3, icon: "🔁" },
                    { text: "Lurk and read news", value: 2, icon: "📰" },
                    { text: "Don't use it", value: 1, icon: "❌" }
                ]
            },
            {
                q: "YouTube activity? 📺",
                options: [
                    { text: "Create content regularly", value: 5, icon: "🎥" },
                    { text: "Comment and engage actively", value: 4, icon: "💬" },
                    { text: "Subscribe and like videos", value: 3, icon: "👍" },
                    { text: "Just watch, no interaction", value: 1, icon: "😶" }
                ]
            },
            {
                q: "Online shopping reviews? 🛒",
                options: [
                    { text: "Always write detailed reviews", value: 5, icon: "⭐" },
                    { text: "Rate but rarely write", value: 3, icon: "📊" },
                    { text: "Only when really good/bad", value: 2, icon: "🤷" },
                    { text: "Never review anything", value: 1, icon: "🙈" }
                ]
            }
        ];
        
        this.loadInternetQuestions(questions);
    }
    
    loadInternetQuestions(questions) {
        const container = document.getElementById('internetQuestions');
        let answers = [];
        let currentQ = 0;
        
        const showQuestion = () => {
            if (currentQ >= questions.length) {
                this.calculateInternetScore(answers);
                return;
            }
            
            const q = questions[currentQ];
            container.innerHTML = `
                <div class="internet-question-card">
                    <div class="question-progress">
                        <span>Question ${currentQ + 1} of ${questions.length}</span>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${((currentQ + 1) / questions.length) * 100}%"></div>
                        </div>
                    </div>
                    <h4>${q.q}</h4>
                    <div class="internet-options">
                        ${q.options.map(option => `
                            <button class="internet-option" data-value="${option.value}">
                                <span class="option-icon">${option.icon}</span>
                                <span class="option-text">${option.text}</span>
                            </button>
                        `).join('')}
                    </div>
                </div>
            `;
            
            document.querySelectorAll('.internet-option').forEach(btn => {
                btn.addEventListener('click', () => {
                    document.querySelectorAll('.internet-option').forEach(b => b.classList.remove('selected'));
                    btn.classList.add('selected');
                    
                    answers.push(parseInt(btn.dataset.value));
                    
                    setTimeout(() => {
                        currentQ++;
                        showQuestion();
                    }, 800);
                });
            });
        };
        
        showQuestion();
    }
    
    calculateInternetScore(answers) {
        const average = answers.reduce((a, b) => a + b, 0) / answers.length;
        const percentage = Math.round((average / 5) * 100);
        
        const personalities = {
            low: { 
                emoji: '👀', 
                type: 'The Silent Observer', 
                desc: 'You prefer watching from the digital sidelines. You consume content but rarely create or engage actively.' 
            },
            mediumLow: {
                emoji: '😊',
                type: 'The Casual User',
                desc: 'You use social media for staying connected but don\'t feel the need to constantly share or engage.'
            },
            medium: { 
                emoji: '🤳', 
                type: 'The Balanced Digital Native', 
                desc: 'You have a healthy relationship with social media - active when it matters, private when needed.' 
            },
            mediumHigh: {
                emoji: '🌟',
                type: 'The Social Connector',
                desc: 'You actively engage across platforms and love connecting with others through digital spaces.'
            },
            high: { 
                emoji: '📱', 
                type: 'The Digital Influencer', 
                desc: 'You\'re a natural content creator and community builder across multiple platforms!' 
            }
        };
        
        let level;
        if (percentage < 30) level = 'low';
        else if (percentage < 50) level = 'mediumLow';
        else if (percentage < 70) level = 'medium';
        else if (percentage < 85) level = 'mediumHigh';
        else level = 'high';
        
        const personality = personalities[level];
        
        document.getElementById('internetQuestions').style.display = 'none';
        document.getElementById('internetResult').style.display = 'block';
        document.getElementById('personalityEmoji').textContent = personality.emoji;
        document.getElementById('personalityType').textContent = personality.type;
        document.getElementById('personalityDesc').textContent = personality.desc;
        
        this.createConfetti();
        
        if (this.hasFullAccess || this.hasTestAccess('internet')) {
            setTimeout(() => this.showPremiumInternetContent(), 500);
        }
    }
    
    setupScrollEffects() {
        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        // Observe elements for animation
        document.querySelectorAll('.feature-card, .pricing-card, .section-header').forEach(el => {
            observer.observe(el);
        });
    }
    
    setupAnimations() {
        // Add CSS classes for animations
        const style = document.createElement('style');
        style.textContent = `
            .feature-card, .pricing-card, .section-header {
                opacity: 0;
                transform: translateY(30px);
                transition: all 0.6s ease;
            }
            
            .animate-in {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
            
            .option-btn:hover, .behavior-btn:hover, .scale-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            }
            
            .behavior-btn.active {
                background: var(--gradient);
                color: white;
            }
            
            .gradient-btn {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border: none;
                color: white;
                padding: 12px 24px;
                border-radius: 25px;
                font-weight: 600;
                position: relative;
                overflow: hidden;
                transition: all 0.3s ease;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 8px;
                box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
            }
            
            .gradient-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
            }
            
            .gradient-btn .btn-shine {
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
                transition: left 0.5s;
            }
            
            .gradient-btn:hover .btn-shine {
                left: 100%;
            }
            
            .premium-user-badge {
                position: absolute;
                top: 10px;
                right: 10px;
                background: linear-gradient(135deg, #ffd700 0%, #ffb347 100%);
                color: #333;
                padding: 5px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: bold;
                box-shadow: 0 2px 8px rgba(255, 215, 0, 0.3);
                animation: premiumGlow 2s ease-in-out infinite alternate;
            }
            
            .premium-nav-badge {
                background: linear-gradient(135deg, #ffd700 0%, #ffb347 100%);
                color: #333;
                padding: 8px 16px;
                border-radius: 25px;
                font-size: 14px;
                font-weight: bold;
                display: flex;
                align-items: center;
                gap: 6px;
                box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
                animation: premiumPulse 3s ease-in-out infinite;
            }
            
            .premium-nav-badge i {
                font-size: 16px;
                color: #ff6b35;
            }
            
            @keyframes premiumPulse {
                0%, 100% { transform: scale(1); box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4); }
                50% { transform: scale(1.05); box-shadow: 0 6px 20px rgba(255, 215, 0, 0.6); }
            }
            
            @keyframes premiumGlow {
                from { box-shadow: 0 2px 8px rgba(255, 215, 0, 0.3); }
                to { box-shadow: 0 4px 16px rgba(255, 215, 0, 0.6); }
            }
        `;
        document.head.appendChild(style);
    }
    
    
    handleUpgrade() {
        if (this.hasFullAccess || this.hasTestAccess(this.currentTest)) {
            this.unlockCurrentTestContent();
            return;
        }
        
        // Prevent multiple payment modals
        const existingModal = document.querySelector('[style*="position: fixed"][style*="rgba(0,0,0,0.8)"]');
        if (existingModal) {
            return; // Payment modal already open
        }
        
        // Show payment options for current test
        const testPrices = {
            age: 49,
            character: 49, 
            toxic: 79,
            future: 99,
            internet: 49,
            redflags: 99
        };
        
        const price = testPrices[this.currentTest] || 49;
        
        // Create quick payment modal
        const paymentModal = document.createElement('div');
        paymentModal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
            background: rgba(0,0,0,0.8); z-index: 10000; display: flex; 
            align-items: center; justify-content: center;
        `;
        
        paymentModal.innerHTML = `
            <div style="background: white; padding: 2rem; border-radius: 15px; max-width: 400px; text-align: center;">
                <h3>Unlock Premium Content</h3>
                <p>Get detailed analysis for just ₹${price}</p>
                <div style="margin: 1rem 0;">
                    <button onclick="funaiApp.processPayment('upi', ${price}, '${this.currentTest}'); document.body.removeChild(this.parentElement.parentElement)" 
                            style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 12px 24px; border-radius: 8px; margin: 5px; cursor: pointer; font-weight: 600;">
                        📱 Pay with UPI - ₹${price}
                    </button>
                </div>
                <button onclick="document.body.removeChild(this.parentElement.parentElement)" 
                        style="background: #f3f4f6; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">
                    Cancel
                </button>
            </div>
        `;
        
        document.body.appendChild(paymentModal);
    }
    
    unlockCurrentTestContent() {
        // Check if user is currently viewing results before unlocking
        const isAtResults = {
            age: document.getElementById('ageResult') && document.getElementById('ageResult').style.display !== 'none',
            character: document.getElementById('characterResult') && document.getElementById('characterResult').style.display !== 'none',
            toxic: document.getElementById('toxicResult') && document.getElementById('toxicResult').style.display !== 'none',
            future: document.getElementById('futureResult') && document.getElementById('futureResult').style.display !== 'none',
            internet: document.getElementById('internetResult') && document.getElementById('internetResult').style.display !== 'none',
            redflags: document.getElementById('redflagsResult') && document.getElementById('redflagsResult').style.display !== 'none'
        };
        
        // Only unlock if user is at results page
        if (!isAtResults[this.currentTest]) {
            return; // User not at results yet, don't unlock
        }
        
        // Direct method to unlock current test content
        switch(this.currentTest) {
            case 'age':
                this.unlockAgeTestPremiumContent();
                break;
            case 'character':
                this.showPremiumCharacterContent();
                break;
            case 'toxic':
                this.showPremiumToxicContent();
                break;
            case 'future':
                this.showPremiumFutureContent();
                break;
            case 'internet':
                this.showPremiumInternetContent();
                break;
            case 'redflags':
                // For red flags, we need the stored results
                if (this.redFlagAnswers && this.redFlagAnswers.length > 0) {
                    const redFlags = this.redFlagAnswers.filter(a => a === 'red').length;
                    const yellowFlags = this.redFlagAnswers.filter(a => a === 'yellow').length;
                    const greenFlags = this.redFlagAnswers.filter(a => a === 'green').length;
                    this.showPremiumRedFlagContent(redFlags, yellowFlags, greenFlags);
                }
                break;
        }
    }
    
    unlockPremiumContent() {
        // Remove all unlock overlays for premium users
        document.querySelectorAll('.unlock-overlay').forEach(el => el.remove());
        document.querySelectorAll('.upgrade-prompt').forEach(el => el.remove());
        
        // Remove blur from all locked content
        document.querySelectorAll('.result-locked').forEach(el => {
            el.style.filter = 'none';
            el.style.pointerEvents = 'auto';
        });
        
        // Check specific test and unlock content
        if (this.currentTest === 'age') {
            this.unlockAgeTestPremiumContent();
            return;
        }
        
        if (this.currentTest === 'character') {
            this.showPremiumCharacterContent();
            return;
        }
        
        if (this.currentTest === 'toxic') {
            this.showPremiumToxicContent();
            return;
        }
        
        if (this.currentTest === 'future') {
            this.showPremiumFutureContent();
            return;
        }
        
        if (this.currentTest === 'internet') {
            this.showPremiumInternetContent();
            return;
        }
        
        // Replace premium insights with actual content for age test
        const premiumInsights = document.querySelector('.premium-insights');
        if (premiumInsights) {
            const estimatedAge = parseInt(document.querySelector('.age-number').textContent);
            const biologicalAge = Math.max(18, estimatedAge - Math.floor(Math.random() * 5) - 1);
            const celebrities = [
                {male: ['Shah Rukh Khan', 'Ryan Gosling'], female: ['Alia Bhatt', 'Emma Stone']}, 
                {male: ['Hrithik Roshan', 'Chris Hemsworth'], female: ['Priyanka Chopra', 'Scarlett Johansson']}, 
                {male: ['Ranveer Singh', 'Ryan Reynolds'], female: ['Deepika Padukone', 'Gal Gadot']}, 
                {male: ['Ranbir Kapoor', 'Bradley Cooper'], female: ['Anushka Sharma', 'Anne Hathaway']},
                {male: ['Vicky Kaushal', 'Michael B. Jordan'], female: ['Katrina Kaif', 'Margot Robbie']}, 
                {male: ['Kartik Aaryan', 'Tom Holland'], female: ['Shraddha Kapoor', 'Zendaya']}
            ];
            const randomIndex = Math.floor(Math.random() * celebrities.length);
            const genderRandom = Math.random() > 0.5 ? 'male' : 'female';
            const selectedCelebs = celebrities[randomIndex][genderRandom];
            const matchPercent = Math.floor(Math.random() * 20) + 70;
            const secondPercent = Math.floor(Math.random() * 15) + 60;
            
            const skinTypes = ['Combination-Normal', 'Oily-Acne Prone', 'Dry-Sensitive', 'Normal-Balanced', 'Combination-Oily'];
            const angles = ['45° left angle', '30° right angle', 'straight on', 'slight upward angle'];
            const lightings = ['natural lighting', 'soft window light', 'golden hour lighting', 'diffused indoor light'];
            
            premiumInsights.innerHTML = `
                <div class="insight-item unlocked">
                    <span class="insight-icon">🧬</span>
                    <div class="insight-content">
                        <h5>Genetic Age Score: ${biologicalAge} years</h5>
                        <p>Your biological age is ${estimatedAge - biologicalAge} years ${estimatedAge > biologicalAge ? 'younger' : 'older'} than your appearance! ${estimatedAge > biologicalAge ? 'Great genetics and lifestyle choices.' : 'Focus on skincare and healthy habits.'}</p>
                    </div>
                </div>
                <div class="insight-item unlocked">
                    <span class="insight-icon">✨</span>
                    <div class="insight-content">
                        <h5>Beauty Enhancement Tips</h5>
                        <p>Use vitamin C serum, drink 3L water daily, sleep 7-8 hours. Your skin type: ${skinTypes[Math.floor(Math.random() * skinTypes.length)]}.</p>
                    </div>
                </div>
                <div class="insight-item unlocked">
                    <span class="insight-icon">📊</span>
                    <div class="insight-content">
                        <h5>Celebrity Match: ${selectedCelebs[0]} (${matchPercent}%)</h5>
                        <p>You share similar facial structure and ${genderRandom === 'male' ? 'jawline' : 'eye shape'}. Also matches: ${selectedCelebs[1]} (${secondPercent}%).</p>
                    </div>
                </div>
                <div class="insight-item unlocked">
                    <span class="insight-icon">🎯</span>
                    <div class="insight-content">
                        <h5>Best Photo Angles</h5>
                        <p>${angles[Math.floor(Math.random() * angles.length)]}, ${lightings[Math.floor(Math.random() * lightings.length)]}, slight smile. Avoid harsh overhead lighting.</p>
                    </div>
                </div>
            `;
            
            // Update beauty score bars with actual values
            const beautyScore = document.querySelector('.beauty-score');
            if (beautyScore) {
                const scores = {
                    symmetry: Math.floor(Math.random() * 20) + 75,
                    skin: Math.floor(Math.random() * 15) + 80,
                    eyes: Math.floor(Math.random() * 25) + 70,
                    smile: Math.floor(Math.random() * 20) + 80
                };
                
                beautyScore.innerHTML = `
                    <h5>Detailed Beauty Metrics</h5>
                    <div class="score-bars">
                        <div class="score-bar">Facial Symmetry: ${scores.symmetry}%</div>
                        <div class="score-bar">Skin Quality: ${scores.skin}%</div>
                        <div class="score-bar">Eye Appeal: ${scores.eyes}%</div>
                        <div class="score-bar">Smile Rating: ${scores.smile}%</div>
                    </div>
                `;
            }
        }
        
        // Show success message
        const successMsg = document.createElement('div');
        successMsg.innerHTML = '🎉 Premium content unlocked! Enjoy your detailed analysis.';
        successMsg.style.cssText = 'background: var(--success); color: white; padding: 1rem; border-radius: 10px; margin: 1rem 0; text-align: center; font-weight: 600;';
        
        const resultCard = document.querySelector('.result-card');
        if (resultCard) {
            resultCard.prepend(successMsg);
        }
        
        // Add confetti
        this.createConfetti();
    }
    
    showPremiumCharacterContent() {
        const characterResult = document.getElementById('characterResult');
        const currentType = document.getElementById('characterType').textContent;
        const currentEmoji = document.getElementById('characterAvatar').textContent;
        const currentDesc = document.getElementById('characterDescription').innerHTML;
        
        const premiumData = {
            'The Bollywood Hero': {
                celebrity: 'Shah Rukh Khan',
                similarity: 87,
                style: 'Romantic hero with leadership qualities',
                song: 'Kal Ho Naa Ho',
                songDesc: 'optimistic and inspiring',
                traits: { leadership: 85, creativity: 72, social: 90, romance: 78 },
                career: 'Entertainment, Leadership, or Creative Industries',
                relationship: 'Loyal partner who values deep connections',
                philosophy: 'Success comes from helping others achieve their dreams'
            },
            'The Romantic Lead': {
                celebrity: 'Ranbir Kapoor',
                similarity: 92,
                style: 'Emotional depth with artistic sensitivity',
                song: 'Tum Hi Ho',
                songDesc: 'deeply romantic and soulful',
                traits: { leadership: 65, creativity: 88, social: 70, romance: 95 },
                career: 'Arts, Writing, or Relationship Counseling',
                relationship: 'Deeply romantic partner who believes in soulmates',
                philosophy: 'Love is the most powerful force in the universe'
            },
            'The Social Media Star': {
                celebrity: 'Ranveer Singh',
                similarity: 89,
                style: 'Energetic trendsetter with viral appeal',
                song: 'Apna Time Aayega',
                songDesc: 'confident and trend-setting',
                traits: { leadership: 70, creativity: 85, social: 95, romance: 68 },
                career: 'Content Creation, Marketing, or Entertainment',
                relationship: 'Fun-loving partner who keeps things exciting',
                philosophy: 'Life is about creating moments worth sharing'
            },
            'The Chill Homebody': {
                celebrity: 'Ayushmann Khurrana',
                similarity: 84,
                style: 'Relatable everyman with quiet confidence',
                song: 'Pani Da Rang',
                songDesc: 'peaceful and introspective',
                traits: { leadership: 60, creativity: 75, social: 55, romance: 80 },
                career: 'Remote Work, Writing, or Tech Industry',
                relationship: 'Comfortable partner who values quality time',
                philosophy: 'Happiness is found in simple pleasures'
            },
            'The Social Butterfly': {
                celebrity: 'Alia Bhatt',
                similarity: 91,
                style: 'Charismatic connector with infectious energy',
                song: 'Badrinath Ki Dulhania',
                songDesc: 'vibrant and celebratory',
                traits: { leadership: 78, creativity: 70, social: 98, romance: 82 },
                career: 'Event Management, PR, or Hospitality',
                relationship: 'Outgoing partner who brings people together',
                philosophy: 'Life is better when shared with others'
            },
            'The Creative Soul': {
                celebrity: 'Deepika Padukone',
                similarity: 86,
                style: 'Artistic visionary with unique perspective',
                song: 'Gerua',
                songDesc: 'artistic and expressive',
                traits: { leadership: 68, creativity: 95, social: 72, romance: 85 },
                career: 'Arts, Design, or Film Industry',
                relationship: 'Expressive partner who values creativity',
                philosophy: 'Art is the language of the soul'
            }
        };
        
        const data = premiumData[currentType] || premiumData['The Bollywood Hero'];
        
        characterResult.innerHTML = `
            <div class="character-card premium-unlocked">
                <div class="premium-badge">✨ PREMIUM UNLOCKED</div>
                <div class="character-avatar">${currentEmoji}</div>
                <h3>${currentType}</h3>
                <div class="premium-character-analysis">
                    <h4>🎭 Complete Bollywood Analysis</h4>
                    <div class="bollywood-match">
                        <h5>Your Bollywood Doppelganger</h5>
                        <p>🌟 <strong>Primary Match:</strong> ${data.celebrity} (${data.similarity}% similarity)</p>
                        <p>🎬 <strong>Character Style:</strong> ${data.style}</p>
                        <p>🎵 <strong>Theme Song:</strong> "${data.song}" - ${data.songDesc}</p>
                    </div>
                    
                    <div class="detailed-traits">
                        <h5>📊 Detailed Personality Breakdown</h5>
                        <div class="trait-bars">
                            <div class="trait-item">
                                <span>Leadership</span>
                                <div class="trait-bar"><div class="trait-fill" style="width: ${data.traits.leadership}%"></div></div>
                                <span>${data.traits.leadership}%</span>
                            </div>
                            <div class="trait-item">
                                <span>Creativity</span>
                                <div class="trait-bar"><div class="trait-fill" style="width: ${data.traits.creativity}%"></div></div>
                                <span>${data.traits.creativity}%</span>
                            </div>
                            <div class="trait-item">
                                <span>Social Energy</span>
                                <div class="trait-bar"><div class="trait-fill" style="width: ${data.traits.social}%"></div></div>
                                <span>${data.traits.social}%</span>
                            </div>
                            <div class="trait-item">
                                <span>Romance</span>
                                <div class="trait-bar"><div class="trait-fill" style="width: ${data.traits.romance}%"></div></div>
                                <span>${data.traits.romance}%</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="career-insights">
                        <h5>💼 Career & Life Predictions</h5>
                        <p><strong>Ideal Career Path:</strong> ${data.career}</p>
                        <p><strong>Relationship Style:</strong> ${data.relationship}</p>
                        <p><strong>Life Philosophy:</strong> "${data.philosophy}"</p>
                    </div>
                    
                    <div class="personality-breakdown-detail">
                        <h5>📈 Your Complete Personality Mix</h5>
                        ${currentDesc}
                    </div>
                    
                    <div class="social-media-card">
                        <h5>📱 Your Instagram-Ready Character Card</h5>
                        <div class="shareable-card">
                            <div class="card-header">
                                <span class="card-emoji">${currentEmoji}</span>
                                <h6>${currentType}</h6>
                            </div>
                            <div class="card-stats">
                                <span>🎭 ${data.style.split(' ')[0]}</span>
                                <span>⭐ ${data.similarity}% Match</span>
                                <span>🎵 ${data.song.split(' ')[0]}</span>
                            </div>
                            <div class="card-quote">"${data.philosophy}"</div>
                        </div>
                        <button class="share-card-btn gradient-btn" onclick="funaiApp.shareCharacterCard()">
                            <span class="btn-icon">📤</span>
                            <span class="btn-text">Share My Character Card</span>
                            <span class="btn-shine"></span>
                        </button>
                    </div>
                </div>
                
                <div class="premium-value">
                    <h4>✨ Premium Analysis Complete</h4>
                    <p>🎉 You've unlocked your complete Bollywood personality profile worth ₹299!</p>
                </div>
            </div>
        `;
        
        // Show success message
        const successMsg = document.createElement('div');
        successMsg.innerHTML = '🎉 Premium character analysis unlocked!';
        successMsg.style.cssText = 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 1rem; border-radius: 10px; margin: 1rem 0; text-align: center; font-weight: 600;';
        
        characterResult.prepend(successMsg);
        
        // Add confetti
        this.createConfetti();
    }
    
    createConfetti() {
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.backgroundColor = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#8b5cf6'][Math.floor(Math.random() * 5)];
            confetti.style.animationDelay = Math.random() * 3 + 's';
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                confetti.remove();
            }, 3000);
        }
    }
    
    trackEvent(eventName, properties = {}) {
        // Analytics tracking
        console.log('Event:', eventName, properties);
        
        // Here you would integrate with analytics services like:
        // - Google Analytics
        // - Mixpanel
        // - Custom analytics
    }
    
    shareCharacterCard() {
        if (navigator.share) {
            navigator.share({
                title: 'My Bollywood Character Type',
                text: 'I just discovered my Bollywood personality! Check out FunAI Park.',
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText('I just discovered my Bollywood personality at FunAI Park: ' + window.location.href);
            alert('📋 Link copied to clipboard! Share it with your friends.');
        }
    }
    
    showPremiumToxicContent() {
        const toxicResult = document.getElementById('toxicResult');
        const currentPercentage = document.getElementById('toxicPercentage').textContent;
        const percentage = parseInt(currentPercentage);
        
        const toxicTypes = {
            low: { title: 'The Innocent Angel', emoji: '😇', roast: 'You\'re so pure, you probably apologize to doors when you walk into them.' },
            medium: { title: 'The Passive Aggressor', emoji: '😏', roast: 'You\'re the person who says "I\'m fine" but updates your status to cryptic song lyrics.' },
            high: { title: 'The Drama Queen', emoji: '😈', roast: 'You turn every minor inconvenience into a Bollywood movie plot.' }
        };
        
        const level = percentage < 30 ? 'low' : percentage < 70 ? 'medium' : 'high';
        const type = toxicTypes[level];
        
        toxicResult.innerHTML = `
            <div class="toxic-premium-result">
                <div class="premium-badge">✨ PREMIUM ROAST UNLOCKED</div>
                <div class="toxic-avatar">${type.emoji}</div>
                <h3>${type.title}</h3>
                <div class="toxicity-meter">
                    <div class="toxic-bar">
                        <div class="toxic-fill" style="width: ${percentage}%"></div>
                    </div>
                    <div class="toxic-percentage">${percentage}%</div>
                </div>
                
                <div class="savage-roast">
                    <h4>🔥 Your Savage Roast</h4>
                    <p class="roast-text">"${type.roast}"</p>
                </div>
                
                <div class="toxic-breakdown">
                    <h4>📊 Who You're Toxic To</h4>
                    <div class="toxic-targets">
                        <div class="target-item">
                            <span class="target-icon">👥</span>
                            <div class="target-content">
                                <h5>Friends: ${Math.max(10, percentage - 20)}%</h5>
                                <p>${percentage > 70 ? 'You ghost people when they need you most' : percentage > 40 ? 'You sometimes make everything about yourself' : 'You\'re actually a great friend'}</p>
                            </div>
                        </div>
                        <div class="target-item">
                            <span class="target-icon">💼</span>
                            <div class="target-content">
                                <h5>Work: ${Math.max(5, percentage - 15)}%</h5>
                                <p>${percentage > 70 ? 'You throw colleagues under the bus' : percentage > 40 ? 'You complain but never offer solutions' : 'You\'re a team player'}</p>
                            </div>
                        </div>
                        <div class="target-item">
                            <span class="target-icon">🏠</span>
                            <div class="target-content">
                                <h5>Family: ${Math.max(15, percentage - 10)}%</h5>
                                <p>${percentage > 70 ? 'You bring up old fights during festivals' : percentage > 40 ? 'You judge their life choices silently' : 'You\'re the family favorite'}</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="improvement-tips">
                    <h4>💡 Savage But Helpful Tips</h4>
                    <ul>
                        ${percentage > 70 ? 
                            '<li>Try therapy before your friends do it for you</li><li>Practice saying "sorry" without adding "but"</li><li>Count to 10 before posting that passive-aggressive story</li>' :
                            percentage > 40 ?
                            '<li>Ask "How are you?" and actually listen to the answer</li><li>Compliment someone without comparing them to yourself</li><li>Let someone else have the last word occasionally</li>' :
                            '<li>You\'re doing great! Maybe be a little more assertive</li><li>It\'s okay to express your needs directly</li><li>Don\'t let people walk all over your kindness</li>'
                        }
                    </ul>
                </div>
                
                <div class="shareable-roast-card">
                    <h4>📱 Your Roast Card</h4>
                    <div class="roast-card">
                        <div class="card-header">
                            <span class="card-emoji">${type.emoji}</span>
                            <h5>${type.title}</h5>
                        </div>
                        <div class="card-stats">
                            <span>🔥 ${percentage}% Toxic</span>
                            <span>🎭 ${level.charAt(0).toUpperCase() + level.slice(1)} Drama</span>
                        </div>
                        <div class="card-roast">"${type.roast}"</div>
                    </div>
                    <button class="share-card-btn gradient-btn" onclick="funaiApp.shareToxicCard()">
                        <span class="btn-icon">📤</span>
                        <span class="btn-text">Share My Roast</span>
                        <span class="btn-shine"></span>
                    </button>
                </div>
                
                <div class="premium-value">
                    <h4>✨ Premium Roast Complete</h4>
                    <p>🔥 You've been properly roasted! Worth ₹199 in therapy sessions.</p>
                </div>
            </div>
        `;
        
        // Show success message
        const successMsg = document.createElement('div');
        successMsg.innerHTML = '🔥 Premium roast unlocked! You asked for it...';
        successMsg.style.cssText = 'background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); color: white; padding: 1rem; border-radius: 10px; margin: 1rem 0; text-align: center; font-weight: 600;';
        
        toxicResult.prepend(successMsg);
        
        // Add confetti
        this.createConfetti();
    }
    
    shareToxicCard() {
        if (navigator.share) {
            navigator.share({
                title: 'My Toxicity Test Results',
                text: 'I just got roasted by AI! Check out how toxic you are at FunAI Park.',
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText('I just got roasted by AI at FunAI Park: ' + window.location.href);
            alert('🔥 Roast copied to clipboard! Share the burn with your friends.');
        }
    }
    
    showPremiumFutureContent() {
        const futureResult = document.getElementById('futureResult');
        const currentTitle = document.getElementById('futureTitle').textContent;
        const currentAvatar = document.querySelector('.future-avatar').textContent;
        const currentDesc = document.getElementById('futurePrediction').textContent;
        
        const premiumData = {
            'The Comfort Seeker 🛌': {
                career: 'Stable Professional & Work-Life Balance Expert',
                growth: 'Build confidence and take calculated risks',
                skills: 'Time Management, Stress Reduction, Consistency',
                challenges: 'Fear of change and stepping outside comfort zone',
                opportunities: 'Remote work trends and flexible career paths'
            },
            'The Dreamer 💭': {
                career: 'Creative Entrepreneur & Content Creator',
                growth: 'Build personal brand and monetize creativity',
                skills: 'Digital Marketing, Content Creation, Brand Building',
                challenges: 'Need more discipline and structure',
                opportunities: 'Growing creator economy in India'
            },
            'The Steady Climber 🧗': {
                career: 'Reliable Team Player & Process Optimizer',
                growth: 'Develop leadership skills and strategic thinking',
                skills: 'Project Management, Process Improvement, Reliability',
                challenges: 'Need to be more visible and assertive',
                opportunities: 'Operations and management roles in growing companies'
            },
            'The Rising Star 🌟': {
                career: 'Senior Professional & Team Leader',
                growth: 'Advance to leadership and strategic roles',
                skills: 'Leadership, Strategic Thinking, Team Management',
                challenges: 'Work-life balance and delegation',
                opportunities: 'Management roles and industry recognition'
            },
            'The Achiever 🏆': {
                career: 'High Performer & Results Driver',
                growth: 'Scale impact and mentor others',
                skills: 'Goal Setting, Performance Optimization, Mentoring',
                challenges: 'Avoiding burnout and maintaining relationships',
                opportunities: 'Senior leadership and consulting opportunities'
            },
            'The Future CEO 👑': {
                career: 'Executive, Founder & Industry Leader',
                growth: 'Scale impact and build lasting legacy',
                skills: 'Vision, Execution, Network Building, Innovation',
                challenges: 'Scaling operations and maintaining culture',
                opportunities: 'India\'s startup boom and global expansion'
            },
            'The Unstoppable Force ⚡': {
                career: 'Visionary Leader & Game Changer',
                growth: 'Transform industries and inspire movements',
                skills: 'Disruptive Innovation, Influence, Global Thinking',
                challenges: 'Managing intensity and avoiding isolation',
                opportunities: 'Creating new markets and revolutionary impact'
            }
        };
        
        const data = premiumData[currentTitle] || premiumData['The Rising Star 🌟'];
        
        futureResult.innerHTML = `
            <div class="future-premium-result">
                <div class="premium-badge">✨ PREMIUM PREDICTION UNLOCKED</div>
                <div class="future-avatar">${currentAvatar}</div>
                <h3>${currentTitle}</h3>
                
                <div class="detailed-prediction">
                    <h4>🔮 Your Complete 2026 Forecast</h4>
                    <div class="prediction-grid">
                        <div class="prediction-item">
                            <span class="prediction-icon">💼</span>
                            <div class="prediction-content">
                                <h5>Career Path</h5>
                                <p>${data.career}</p>
                            </div>
                        </div>
                        <div class="prediction-item">
                            <span class="prediction-icon">🚀</span>
                            <div class="prediction-content">
                                <h5>Growth Focus</h5>
                                <p>${data.growth}</p>
                            </div>
                        </div>
                        <div class="prediction-item">
                            <span class="prediction-icon">🎯</span>
                            <div class="prediction-content">
                                <h5>Key Skills to Develop</h5>
                                <p>${data.skills}</p>
                            </div>
                        </div>
                        <div class="prediction-item">
                            <span class="prediction-icon">⚠️</span>
                            <div class="prediction-content">
                                <h5>Main Challenge</h5>
                                <p>${data.challenges}</p>
                            </div>
                        </div>
                        <div class="prediction-item">
                            <span class="prediction-icon">🎆</span>
                            <div class="prediction-content">
                                <h5>Market Opportunity</h5>
                                <p>${data.opportunities}</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="year-by-year">
                    <h4>📅 Year-by-Year Roadmap</h4>
                    <div class="timeline">
                        <div class="timeline-item">
                            <div class="timeline-year">2026</div>
                            <div class="timeline-content">
                                <h5>Launch Year</h5>
                                <p>Implement new strategies, build momentum, establish foundations</p>
                            </div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-year">2027</div>
                            <div class="timeline-content">
                                <h5>Growth Phase</h5>
                                <p>Take on bigger challenges, advance career, leadership roles</p>
                            </div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-year">2028</div>
                            <div class="timeline-content">
                                <h5>Achievement</h5>
                                <p>Reach target position, mentor others, expand influence</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="action-plan">
                    <h4>💡 90-Day Action Plan</h4>
                    <div class="action-steps">
                        <div class="action-step">
                            <span class="step-number">1</span>
                            <div class="step-content">
                                <h5>Next 30 Days</h5>
                                <p>Identify 3 key skills to develop and start learning</p>
                            </div>
                        </div>
                        <div class="action-step">
                            <span class="step-number">2</span>
                            <div class="step-content">
                                <h5>Days 31-60</h5>
                                <p>Connect with 5 people in your target industry</p>
                            </div>
                        </div>
                        <div class="action-step">
                            <span class="step-number">3</span>
                            <div class="step-content">
                                <h5>Days 61-90</h5>
                                <p>Apply new skills in a project or side hustle</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="premium-value">
                    <h4>✨ Premium Analysis Complete</h4>
                    <p>🎯 Your personalized 2026 roadmap worth ₹499!</p>
                </div>
            </div>
        `;
        
        // Show success message
        const successMsg = document.createElement('div');
        successMsg.innerHTML = '🔮 Premium prediction unlocked! Your future awaits...';
        successMsg.style.cssText = 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 1rem; border-radius: 10px; margin: 1rem 0; text-align: center; font-weight: 600;';
        
        futureResult.prepend(successMsg);
        
        // Add confetti
        this.createConfetti();
    }
    
    showPremiumInternetContent() {
        const internetResult = document.getElementById('internetResult');
        const currentType = document.getElementById('personalityType').textContent;
        const currentEmoji = document.getElementById('personalityEmoji').textContent;
        const currentDesc = document.getElementById('personalityDesc').textContent;
        
        const premiumData = {
            'The Silent Observer': {
                platforms: { whatsapp: 'The Lurker', instagram: 'The Scroller', linkedin: 'The Ghost', twitter: 'The Reader', youtube: 'The Watcher' },
                strengths: 'Great at staying informed, low drama, privacy-conscious',
                improvements: 'Share your thoughts more, engage with communities',
                tips: 'Start with comments before creating content'
            },
            'The Casual User': {
                platforms: { whatsapp: 'The Responder', instagram: 'The Occasional Poster', linkedin: 'The Job Seeker', twitter: 'The News Reader', youtube: 'The Subscriber' },
                strengths: 'Balanced approach, authentic interactions, good boundaries',
                improvements: 'Build your personal brand, network more actively',
                tips: 'Share industry insights to boost professional presence'
            },
            'The Balanced Digital Native': {
                platforms: { whatsapp: 'The Communicator', instagram: 'The Storyteller', linkedin: 'The Networker', twitter: 'The Conversationalist', youtube: 'The Engager' },
                strengths: 'Authentic voice, good engagement, multi-platform presence',
                improvements: 'Consider content creation, thought leadership',
                tips: 'Your balanced approach is perfect for building trust'
            },
            'The Social Connector': {
                platforms: { whatsapp: 'The Group Admin', instagram: 'The Community Builder', linkedin: 'The Connector', twitter: 'The Amplifier', youtube: 'The Commenter' },
                strengths: 'Strong network, community building, high engagement',
                improvements: 'Focus content strategy, avoid over-sharing',
                tips: 'Use your influence to support others and causes'
            },
            'The Digital Influencer': {
                platforms: { whatsapp: 'The Broadcaster', instagram: 'The Creator', linkedin: 'The Thought Leader', twitter: 'The Voice', youtube: 'The Producer' },
                strengths: 'Content creation, audience building, platform mastery',
                improvements: 'Maintain authenticity, avoid burnout',
                tips: 'Diversify content and collaborate with others'
            }
        };
        
        const data = premiumData[currentType] || premiumData['The Balanced Digital Native'];
        
        internetResult.innerHTML = `
            <div class="internet-premium-result">
                <div class="premium-badge">✨ PREMIUM ANALYSIS UNLOCKED</div>
                <div class="personality-emoji">${currentEmoji}</div>
                <h3>${currentType}</h3>
                
                <div class="platform-breakdown-detailed">
                    <h4>📱 Your Platform Personalities</h4>
                    <div class="platform-grid">
                        <div class="platform-item">
                            <span class="platform-icon">📱</span>
                            <div class="platform-info">
                                <h5>WhatsApp</h5>
                                <p>${data.platforms.whatsapp}</p>
                            </div>
                        </div>
                        <div class="platform-item">
                            <span class="platform-icon">📸</span>
                            <div class="platform-info">
                                <h5>Instagram</h5>
                                <p>${data.platforms.instagram}</p>
                            </div>
                        </div>
                        <div class="platform-item">
                            <span class="platform-icon">💼</span>
                            <div class="platform-info">
                                <h5>LinkedIn</h5>
                                <p>${data.platforms.linkedin}</p>
                            </div>
                        </div>
                        <div class="platform-item">
                            <span class="platform-icon">🐦</span>
                            <div class="platform-info">
                                <h5>Twitter/X</h5>
                                <p>${data.platforms.twitter}</p>
                            </div>
                        </div>
                        <div class="platform-item">
                            <span class="platform-icon">📺</span>
                            <div class="platform-info">
                                <h5>YouTube</h5>
                                <p>${data.platforms.youtube}</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="digital-insights">
                    <h4>💡 Your Digital DNA</h4>
                    <div class="insight-section">
                        <h5>✨ Your Strengths</h5>
                        <p>${data.strengths}</p>
                    </div>
                    <div class="insight-section">
                        <h5>🚀 Growth Areas</h5>
                        <p>${data.improvements}</p>
                    </div>
                    <div class="insight-section">
                        <h5>🎯 Pro Tips</h5>
                        <p>${data.tips}</p>
                    </div>
                </div>
                
                <div class="shareable-card">
                    <h4>📱 Your Meme-Style Card</h4>
                    <div class="meme-card">
                        <div class="meme-header">
                            <span class="meme-emoji">${currentEmoji}</span>
                            <h5>${currentType}</h5>
                        </div>
                        <div class="meme-content">
                            <p>"${currentDesc}"</p>
                        </div>
                        <div class="meme-footer">
                            <span>📱 Digital DNA Report</span>
                            <span>✨ FunAI Park</span>
                        </div>
                    </div>
                    <button class="share-card-btn gradient-btn" onclick="funaiApp.shareInternetCard()">
                        <span class="btn-icon">📲</span>
                        <span class="btn-text">Share My Digital DNA</span>
                        <span class="btn-shine"></span>
                    </button>
                </div>
                
                <div class="premium-value">
                    <h4>✨ Premium Analysis Complete</h4>
                    <p>📱 Your complete digital personality worth ₹199!</p>
                </div>
            </div>
        `;
        
        // Show success message
        const successMsg = document.createElement('div');
        successMsg.innerHTML = '📱 Premium digital analysis unlocked!';
        successMsg.style.cssText = 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 1rem; border-radius: 10px; margin: 1rem 0; text-align: center; font-weight: 600;';
        
        internetResult.prepend(successMsg);
        
        // Add confetti
        this.createConfetti();
    }
    
    shareInternetCard() {
        if (navigator.share) {
            navigator.share({
                title: 'My Internet Personality Type',
                text: 'I just discovered my digital DNA! Check out your internet personality at FunAI Park.',
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText('I just discovered my digital DNA at FunAI Park: ' + window.location.href);
            alert('📱 Digital DNA copied to clipboard! Share it with your friends.');
        }
    }
    
    showPremiumInfo() {
        if (!this.hasFullAccess) return;
        
        const premiumData = JSON.parse(localStorage.getItem('premiumAccess'));
        const deviceCount = premiumData.devices ? premiumData.devices.length : 1;
        
        const modal = document.getElementById('testModal');
        const modalBody = document.getElementById('modalBody');
        
        modalBody.innerHTML = `
            <div class="premium-info">
                <div class="premium-header">
                    <div class="premium-icon">👑</div>
                    <h2>Premium Account Info</h2>
                </div>
                
                <div class="premium-details">
                    <div class="info-item">
                        <span class="info-label">Premium ID:</span>
                        <span class="info-value">${this.userId}</span>
                        <button class="copy-btn" onclick="navigator.clipboard.writeText('${this.userId}'); this.textContent='Copied!'">
                            📋 Copy
                        </button>
                    </div>
                    
                    <div class="info-item">
                        <span class="info-label">Devices Used:</span>
                        <span class="info-value">${deviceCount}/2</span>
                    </div>
                    
                    <div class="info-item">
                        <span class="info-label">Activated:</span>
                        <span class="info-value">${new Date(premiumData.timestamp).toLocaleDateString()}</span>
                    </div>
                </div>
                
                <div class="premium-benefits">
                    <h3>✨ Your Premium Benefits</h3>
                    <ul>
                        <li>🎯 All 6 detailed test analyses</li>
                        <li>📊 Complete psychological profiles</li>
                        <li>🔮 Future predictions & compatibility scores</li>
                        <li>📱 Premium shareable cards</li>
                        <li>💡 Personalized action plans</li>
                    </ul>
                </div>
                
                <button class="close-info-btn" onclick="document.getElementById('testModal').style.display='none'">
                    Close
                </button>
            </div>
        `;
        
        modal.style.display = 'block';
    }
    
    unlockAgeTestPremiumContent() {
        // Remove blur and overlay
        document.querySelectorAll('.result-locked').forEach(el => {
            el.style.filter = 'none';
            el.style.pointerEvents = 'auto';
        });
        
        document.querySelectorAll('.unlock-overlay').forEach(el => {
            el.style.display = 'none';
        });
        
        // Get estimated age and generate premium content
        const estimatedAge = parseInt(document.querySelector('.age-number').textContent);
        const biologicalAge = Math.max(18, estimatedAge - Math.floor(Math.random() * 5) - 1);
        
        const celebrities = [
            {male: ['Shah Rukh Khan', 'Ryan Gosling'], female: ['Alia Bhatt', 'Emma Stone']}, 
            {male: ['Hrithik Roshan', 'Chris Hemsworth'], female: ['Priyanka Chopra', 'Scarlett Johansson']}, 
            {male: ['Ranveer Singh', 'Ryan Reynolds'], female: ['Deepika Padukone', 'Gal Gadot']}
        ];
        const randomIndex = Math.floor(Math.random() * celebrities.length);
        const genderRandom = Math.random() > 0.5 ? 'male' : 'female';
        const selectedCelebs = celebrities[randomIndex][genderRandom];
        const matchPercent = Math.floor(Math.random() * 20) + 70;
        
        // Replace premium insights with actual content
        const premiumInsights = document.querySelector('.premium-insights');
        if (premiumInsights) {
            premiumInsights.innerHTML = `
                <div class="insight-item unlocked">
                    <span class="insight-icon">🧬</span>
                    <div class="insight-content">
                        <h5>Genetic Age Score: ${biologicalAge} years</h5>
                        <p>Your biological age is ${estimatedAge - biologicalAge} years ${estimatedAge > biologicalAge ? 'younger' : 'older'} than your appearance!</p>
                    </div>
                </div>
                <div class="insight-item unlocked">
                    <span class="insight-icon">✨</span>
                    <div class="insight-content">
                        <h5>Beauty Enhancement Tips</h5>
                        <p>Use vitamin C serum, drink 3L water daily, sleep 7-8 hours. Focus on skincare routine.</p>
                    </div>
                </div>
                <div class="insight-item unlocked">
                    <span class="insight-icon">📊</span>
                    <div class="insight-content">
                        <h5>Celebrity Match: ${selectedCelebs[0]} (${matchPercent}%)</h5>
                        <p>You share similar facial structure. Also matches: ${selectedCelebs[1]} (${matchPercent-10}%).</p>
                    </div>
                </div>
                <div class="insight-item unlocked">
                    <span class="insight-icon">🎯</span>
                    <div class="insight-content">
                        <h5>Best Photo Angles</h5>
                        <p>45° left angle, natural lighting, slight smile. Avoid harsh overhead lighting.</p>
                    </div>
                </div>
            `;
        }
        
        // Update beauty score with actual values
        const beautyScore = document.querySelector('.beauty-score');
        if (beautyScore) {
            const scores = {
                symmetry: Math.floor(Math.random() * 20) + 75,
                skin: Math.floor(Math.random() * 15) + 80,
                eyes: Math.floor(Math.random() * 25) + 70,
                smile: Math.floor(Math.random() * 20) + 80
            };
            
            beautyScore.innerHTML = `
                <h5>✨ Premium Beauty Analysis</h5>
                <div class="score-bars">
                    <div class="score-bar">Facial Symmetry: ${scores.symmetry}%</div>
                    <div class="score-bar">Skin Quality: ${scores.skin}%</div>
                    <div class="score-bar">Eye Appeal: ${scores.eyes}%</div>
                    <div class="score-bar">Smile Rating: ${scores.smile}%</div>
                </div>
            `;
        }
        
        // Show success message
        const resultCard = document.querySelector('.result-card');
        if (resultCard) {
            const successMsg = document.createElement('div');
            successMsg.innerHTML = '🎉 Premium analysis unlocked! Enjoy your detailed report.';
            successMsg.style.cssText = 'background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 1rem; border-radius: 10px; margin: 1rem 0; text-align: center; font-weight: 600;';
            resultCard.prepend(successMsg);
        }
        
        this.createConfetti();
    }
    
    showPremiumRedFlagContent(redFlags, yellowFlags, greenFlags) {
        const total = redFlags + yellowFlags + greenFlags;
        const compatibilityScore = Math.max(20, 85 - (redFlags * 15));
        
        const premiumContent = `
            <div class="premium-analysis">
                <div class="premium-badge">✨ PREMIUM UNLOCKED</div>
                
                <div class="detailed-breakdown">
                    <h4>📊 Category-Specific Analysis</h4>
                    <div class="category-stats">
                        <div class="category-item">
                            <span class="category-name">💕 Communication & Emotional Intelligence</span>
                            <div class="category-bar">
                                <div class="bar-fill ${greenFlags >= 4 ? 'green' : redFlags >= 3 ? 'red' : 'yellow'}" style="width: ${Math.max(20, greenFlags >= 4 ? 85 : redFlags >= 3 ? 25 : 60)}%"></div>
                            </div>
                            <span class="category-score">${greenFlags >= 4 ? '85% Excellent' : redFlags >= 3 ? '25% Critical' : '60% Developing'}</span>
                        </div>
                        <div class="category-item">
                            <span class="category-name">🛡️ Boundaries & Respect</span>
                            <div class="category-bar">
                                <div class="bar-fill ${greenFlags >= 3 ? 'green' : redFlags >= 2 ? 'red' : 'yellow'}" style="width: ${Math.max(25, 90 - (redFlags * 12))}%"></div>
                            </div>
                            <span class="category-score">${Math.max(25, 90 - (redFlags * 12))}% ${greenFlags >= 3 ? 'Strong' : redFlags >= 2 ? 'Concerning' : 'Moderate'}</span>
                        </div>
                        <div class="category-item">
                            <span class="category-name">💰 Financial & Future Planning</span>
                            <div class="category-bar">
                                <div class="bar-fill ${greenFlags >= 2 ? 'green' : redFlags >= 1 ? 'red' : 'yellow'}" style="width: ${Math.max(30, 75 - (redFlags * 10))}%"></div>
                            </div>
                            <span class="category-score">${Math.max(30, 75 - (redFlags * 10))}% ${greenFlags >= 2 ? 'Responsible' : redFlags >= 1 ? 'Risky' : 'Average'}</span>
                        </div>
                    </div>
                </div>
                
                <div class="psychological-profile">
                    <h4>🧠 Psychological Profile</h4>
                    <div class="profile-grid">
                        <div class="profile-item">
                            <span class="profile-label">Attachment Style</span>
                            <span class="profile-value">${greenFlags >= 5 ? 'Secure' : redFlags >= 3 ? 'Anxious' : 'Avoidant'}</span>
                        </div>
                        <div class="profile-item">
                            <span class="profile-label">Conflict Resolution</span>
                            <span class="profile-value">${greenFlags >= 4 ? 'Collaborative' : redFlags >= 2 ? 'Aggressive' : 'Passive'}</span>
                        </div>
                        <div class="profile-item">
                            <span class="profile-label">Emotional Intelligence</span>
                            <span class="profile-value">${greenFlags >= 6 ? 'High' : greenFlags >= 3 ? 'Moderate' : 'Low'}</span>
                        </div>
                        <div class="profile-item">
                            <span class="profile-label">Relationship Readiness</span>
                            <span class="profile-value">${compatibilityScore >= 70 ? 'Ready' : compatibilityScore >= 50 ? 'Developing' : 'Not Ready'}</span>
                        </div>
                    </div>
                </div>
                
                <div class="compatibility-score">
                    <h4>💕 Relationship Success Predictors</h4>
                    <div class="compatibility-meter">
                        <div class="meter-fill" style="width: ${compatibilityScore}%"></div>
                        <span class="meter-score">${compatibilityScore}%</span>
                    </div>
                    <div class="predictor-stats">
                        <div class="predictor-item">
                            <span class="predictor-icon">📈</span>
                            <div class="predictor-content">
                                <h5>Long-term Success Rate</h5>
                                <p>${compatibilityScore >= 70 ? '78% - High probability' : compatibilityScore >= 50 ? '45% - Moderate' : '18% - Low probability'}</p>
                            </div>
                        </div>
                        <div class="predictor-item">
                            <span class="predictor-icon">💝</span>
                            <div class="predictor-content">
                                <h5>Intimacy Potential</h5>
                                <p>${greenFlags >= 5 ? 'Deep emotional connection likely' : greenFlags >= 3 ? 'Moderate intimacy possible' : 'Surface-level connection'}</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="action-plan">
                    <h4>📝 Personalized Action Plan</h4>
                    <div class="action-timeline">
                        <div class="timeline-item">
                            <span class="timeline-icon">🎯</span>
                            <div class="timeline-content">
                                <h5>Immediate Actions (Next 2 weeks)</h5>
                                <ul>
                                    <li>${redFlags >= 3 ? 'Have serious conversation about concerning behaviors' : 'Continue building on positive patterns'}</li>
                                    <li>${yellowFlags >= 4 ? 'Set clear boundaries and expectations' : 'Maintain open communication'}</li>
                                </ul>
                            </div>
                        </div>
                        <div class="timeline-item">
                            <span class="timeline-icon">📅</span>
                            <div class="timeline-content">
                                <h5>Long-term Strategy (3-6 months)</h5>
                                <ul>
                                    <li>${compatibilityScore >= 70 ? 'Plan for deeper commitment milestones' : compatibilityScore >= 50 ? 'Evaluate progress and improvements' : 'Consider relationship viability'}</li>
                                    <li>${greenFlags >= 5 ? 'Focus on maintaining healthy patterns' : 'Work on developing core relationship skills'}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('redflagsResult').innerHTML = premiumContent;
        
        // Show success message
        const successMsg = document.createElement('div');
        successMsg.innerHTML = '🎉 Premium relationship analysis unlocked!';
        successMsg.style.cssText = 'background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 1rem; border-radius: 10px; margin: 1rem 0; text-align: center; font-weight: 600;';
        document.getElementById('redflagsResult').prepend(successMsg);
        
        this.createConfetti();
    }
    
    showPaymentPage(type) {
        const modal = document.getElementById('testModal');
        const modalBody = document.getElementById('modalBody');
        
        let content = '';
        if (type === 'allaccess') {
            content = `
                <div class="payment-page">
                    <div class="payment-header">
                        <h2>🎆 All-Access Pass</h2>
                        <p>Unlock all 6 premium tests for just ₹349!</p>
                    </div>
                    
                    <div class="package-details">
                        <h3>What's Included:</h3>
                        <div class="included-tests">
                            <div class="test-item">
                                <span class="test-icon">👤</span>
                                <span class="test-name">Face Age Estimator Premium</span>
                                <span class="test-value">₹49</span>
                            </div>
                            <div class="test-item">
                                <span class="test-icon">🚩</span>
                                <span class="test-name">Red Flag Test Premium</span>
                                <span class="test-value">₹99</span>
                            </div>
                            <div class="test-item">
                                <span class="test-icon">⭐</span>
                                <span class="test-name">Character Test Premium</span>
                                <span class="test-value">₹49</span>
                            </div>
                            <div class="test-item">
                                <span class="test-icon">💀</span>
                                <span class="test-name">Toxic Test Premium</span>
                                <span class="test-value">₹79</span>
                            </div>
                            <div class="test-item">
                                <span class="test-icon">🔮</span>
                                <span class="test-name">Future Test Premium</span>
                                <span class="test-value">₹99</span>
                            </div>
                            <div class="test-item">
                                <span class="test-icon">📱</span>
                                <span class="test-name">Internet Test Premium</span>
                                <span class="test-value">₹49</span>
                            </div>
                        </div>
                        <div class="savings">
                            <div class="total-value">Total Value: ₹424</div>
                            <div class="discount">You Save: ₹75 (18% OFF)</div>
                            <div class="final-price">Pay Only: ₹349</div>
                        </div>
                    </div>
                    
                    <div class="payment-methods">
                        <h3>Choose Payment Method:</h3>
                        <div class="payment-options">
                            <button class="payment-option" onclick="funaiApp.processPayment('upi', 349)">
                                <span class="payment-icon">📱</span>
                                <span>UPI / PhonePe / GPay</span>
                            </button>
                            <button class="payment-option" onclick="funaiApp.processPayment('card', 349)">
                                <span class="payment-icon">💳</span>
                                <span>Credit / Debit Card</span>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        } else {
            content = `
                <div class="payment-page">
                    <div class="payment-header">
                        <h2>🚀 Premium Unlock</h2>
                        <p>Choose a test to unlock premium features</p>
                    </div>
                    
                    <div class="test-selection">
                        <h3>Select Test to Upgrade:</h3>
                        <div class="test-grid">
                            <button class="test-select-btn" onclick="funaiApp.processPayment('upi', 49, 'age')">
                                <span class="test-icon">👤</span>
                                <div class="test-info">
                                    <h4>Age Estimator</h4>
                                    <span class="test-price">₹49</span>
                                </div>
                            </button>
                            <button class="test-select-btn" onclick="funaiApp.processPayment('upi', 99, 'redflags')">
                                <span class="test-icon">🚩</span>
                                <div class="test-info">
                                    <h4>Red Flag Test</h4>
                                    <span class="test-price">₹99</span>
                                </div>
                            </button>
                            <button class="test-select-btn" onclick="funaiApp.processPayment('upi', 49, 'character')">
                                <span class="test-icon">⭐</span>
                                <div class="test-info">
                                    <h4>Character Test</h4>
                                    <span class="test-price">₹49</span>
                                </div>
                            </button>
                            <button class="test-select-btn" onclick="funaiApp.processPayment('upi', 79, 'toxic')">
                                <span class="test-icon">💀</span>
                                <div class="test-info">
                                    <h4>Toxic Test</h4>
                                    <span class="test-price">₹79</span>
                                </div>
                            </button>
                            <button class="test-select-btn" onclick="funaiApp.processPayment('upi', 99, 'future')">
                                <span class="test-icon">🔮</span>
                                <div class="test-info">
                                    <h4>Future Test</h4>
                                    <span class="test-price">₹99</span>
                                </div>
                            </button>
                            <button class="test-select-btn" onclick="funaiApp.processPayment('upi', 49, 'internet')">
                                <span class="test-icon">📱</span>
                                <div class="test-info">
                                    <h4>Internet Test</h4>
                                    <span class="test-price">₹49</span>
                                </div>
                            </button>
                        </div>
                    </div>
                    
                    <div class="upgrade-suggestion">
                        <div class="suggestion-card">
                            <h4>💡 Better Deal Available!</h4>
                            <p>Get all 6 tests for just ₹349 instead of buying individually</p>
                            <button class="all-access-btn" onclick="funaiApp.showPaymentPage('allaccess')">
                                Get All-Access Pass →
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }
        
        modalBody.innerHTML = content;
        modal.style.display = 'block';
    }
    
    processPayment(method, amount, testType = null) {
        // Check if Razorpay is available
        if (typeof Razorpay === 'undefined') {
            // Fallback payment simulation
            this.simulatePayment(method, amount, testType);
            return;
        }
        
        // Razorpay payment integration
        const options = {
            key: 'rzp_test_Rt9ofen3nW1XjU', // Replace with your actual Razorpay key
            amount: amount * 100, // Amount in paise
            currency: 'INR',
            name: 'FunAI Park',
            description: testType ? `Premium ${testType} Test` : 'All-Access Pass',
            image: 'https://via.placeholder.com/100x100?text=FunAI',
            handler: (response) => {
                // Payment successful
                console.log('🎉 Payment successful:', response);
                console.log('📍 Current test:', this.currentTest);
                console.log('🎯 Test type from payment:', testType);
                
                // Set premium access first
                this.setFullAccess(testType);
                this.updateUIForPremiumUser();
                
                // Close any payment modals
                document.querySelectorAll('[style*="position: fixed"]').forEach(el => {
                    if (el.innerHTML.includes('Pay with UPI') || el.innerHTML.includes('Choose Payment')) {
                        console.log('🗑️ Removing payment modal');
                        el.remove();
                    }
                });
                
                if (testType && this.currentTest === testType) {
                    console.log('✅ User in test flow, unlocking content for:', testType);
                    // Check current DOM state
                    const resultElements = {
                        age: document.getElementById('ageResult'),
                        character: document.getElementById('characterResult'),
                        toxic: document.getElementById('toxicResult'),
                        future: document.getElementById('futureResult'),
                        internet: document.getElementById('internetResult'),
                        redflags: document.getElementById('redflagsResult')
                    };
                    console.log('📊 Result element exists:', !!resultElements[testType]);
                    console.log('👁️ Result element visible:', resultElements[testType]?.style.display !== 'none');
                    
                    // Force unlock without checking if at results since payment was from results page
                    setTimeout(() => {
                        console.log('🔓 Executing unlock for:', testType);
                        
                        // Make sure result element is visible first
                        const resultElement = resultElements[testType];
                        if (resultElement && resultElement.style.display === 'none') {
                            console.log('👁️ Making result element visible');
                            resultElement.style.display = 'block';
                        }
                        
                        // Hide questions section
                        const questionElements = {
                            age: document.getElementById('imageUpload'),
                            character: document.getElementById('characterQuestions'),
                            toxic: document.getElementById('toxicQuestions'),
                            future: document.getElementById('futureQuestions'),
                            internet: document.getElementById('internetQuestions'),
                            redflags: document.querySelector('.mode-selection')
                        };
                        if (questionElements[testType]) {
                            console.log('🙈 Hiding questions section');
                            questionElements[testType].style.display = 'none';
                        }
                        
                        switch(testType) {
                            case 'age':
                                this.unlockAgeTestPremiumContent();
                                break;
                            case 'character':
                                this.showPremiumCharacterContent();
                                break;
                            case 'toxic':
                                this.showPremiumToxicContent();
                                break;
                            case 'future':
                                this.showPremiumFutureContent();
                                break;
                            case 'internet':
                                this.showPremiumInternetContent();
                                break;
                            case 'redflags':
                                if (this.redFlagAnswers && this.redFlagAnswers.length > 0) {
                                    const redFlags = this.redFlagAnswers.filter(a => a === 'red').length;
                                    const yellowFlags = this.redFlagAnswers.filter(a => a === 'yellow').length;
                                    const greenFlags = this.redFlagAnswers.filter(a => a === 'green').length;
                                    this.showPremiumRedFlagContent(redFlags, yellowFlags, greenFlags);
                                }
                                break;
                        }
                        console.log('✨ Unlock completed');
                    }, 100);
                } else {
                    console.log('❌ Not in test flow or test mismatch');
                    // Show success and close modal
                    this.closeModal();
                    const successDiv = document.createElement('div');
                    successDiv.innerHTML = testType ? `🎉 Premium ${testType} test unlocked!` : '🎆 All-Access Pass activated!';
                    successDiv.style.cssText = 'position: fixed; top: 20px; right: 20px; background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 1rem 2rem; border-radius: 10px; z-index: 10000; font-weight: 600; box-shadow: 0 4px 20px rgba(16, 185, 129, 0.4);';
                    document.body.appendChild(successDiv);
                    setTimeout(() => successDiv.remove(), 5000);
                }
            },
            prefill: {
                name: 'User',
                email: 'user@example.com',
                contact: '9999999999'
            },
            notes: {
                test_type: testType || 'all_access',
                amount: amount
            },
            theme: {
                color: '#6366f1'
            },
            modal: {
                ondismiss: () => {
                    console.log('Payment cancelled');
                }
            }
        };
        
        const rzp = new Razorpay(options);
        rzp.open();
    }
    
    simulatePayment(method, amount, testType = null) {
        console.log('💳 Simulating payment for:', testType);
        console.log('📍 Current test:', this.currentTest);
        
        // Set premium access first
        this.setFullAccess(testType);
        this.updateUIForPremiumUser();
        
        // Close any payment modals
        document.querySelectorAll('[style*="position: fixed"]').forEach(el => {
            if (el.innerHTML.includes('Pay with UPI') || el.innerHTML.includes('Choose Payment')) {
                console.log('🗑️ Removing payment modal (simulate)');
                el.remove();
            }
        });
        
        if (testType && this.currentTest === testType) {
            console.log('✅ User in test flow (simulate), unlocking content for:', testType);
            // Check current DOM state
            const resultElements = {
                age: document.getElementById('ageResult'),
                character: document.getElementById('characterResult'),
                toxic: document.getElementById('toxicResult'),
                future: document.getElementById('futureResult'),
                internet: document.getElementById('internetResult'),
                redflags: document.getElementById('redflagsResult')
            };
            console.log('📊 Result element exists (simulate):', !!resultElements[testType]);
            console.log('👁️ Result element visible (simulate):', resultElements[testType]?.style.display !== 'none');
            
            // Force unlock without checking if at results since payment was from results page
            setTimeout(() => {
                console.log('🔓 Executing unlock (simulate) for:', testType);
                
                // Make sure result element is visible first
                const resultElement = resultElements[testType];
                if (resultElement && resultElement.style.display === 'none') {
                    console.log('👁️ Making result element visible (simulate)');
                    resultElement.style.display = 'block';
                }
                
                // Hide questions section
                const questionElements = {
                    age: document.getElementById('imageUpload'),
                    character: document.getElementById('characterQuestions'),
                    toxic: document.getElementById('toxicQuestions'),
                    future: document.getElementById('futureQuestions'),
                    internet: document.getElementById('internetQuestions'),
                    redflags: document.querySelector('.mode-selection')
                };
                if (questionElements[testType]) {
                    console.log('🙈 Hiding questions section (simulate)');
                    questionElements[testType].style.display = 'none';
                }
                
                switch(testType) {
                    case 'age':
                        this.unlockAgeTestPremiumContent();
                        break;
                    case 'character':
                        this.showPremiumCharacterContent();
                        break;
                    case 'toxic':
                        this.showPremiumToxicContent();
                        break;
                    case 'future':
                        this.showPremiumFutureContent();
                        break;
                    case 'internet':
                        this.showPremiumInternetContent();
                        break;
                    case 'redflags':
                        if (this.redFlagAnswers && this.redFlagAnswers.length > 0) {
                            const redFlags = this.redFlagAnswers.filter(a => a === 'red').length;
                            const yellowFlags = this.redFlagAnswers.filter(a => a === 'yellow').length;
                            const greenFlags = this.redFlagAnswers.filter(a => a === 'green').length;
                            this.showPremiumRedFlagContent(redFlags, yellowFlags, greenFlags);
                        }
                        break;
                }
                console.log('✨ Unlock completed (simulate)');
            }, 100);
        } else {
            console.log('❌ Not in test flow or test mismatch (simulate)');
            // Show success and close modal
            this.closeModal();
            const successDiv = document.createElement('div');
            successDiv.innerHTML = testType ? `🎉 Premium ${testType} test unlocked!` : '🎆 All-Access Pass activated!';
            successDiv.style.cssText = 'position: fixed; top: 20px; right: 20px; background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 1rem 2rem; border-radius: 10px; z-index: 10000; font-weight: 600; box-shadow: 0 4px 20px rgba(16, 185, 129, 0.4);';
            document.body.appendChild(successDiv);
            setTimeout(() => successDiv.remove(), 5000);
        }
    }
}

// Initialize the app when DOM is loaded
let funaiApp;
document.addEventListener('DOMContentLoaded', () => {
    funaiApp = new FunAIApp();
    
    // Add some fun interactions
    document.addEventListener('mousemove', (e) => {
        const cursor = document.querySelector('.cursor');
        if (!cursor) {
            const newCursor = document.createElement('div');
            newCursor.className = 'cursor';
            newCursor.style.cssText = `
                position: fixed;
                width: 20px;
                height: 20px;
                background: radial-gradient(circle, rgba(99,102,241,0.8) 0%, transparent 70%);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                transition: transform 0.1s ease;
            `;
            document.body.appendChild(newCursor);
        }
        
        const cursor2 = document.querySelector('.cursor');
        cursor2.style.left = e.clientX - 10 + 'px';
        cursor2.style.top = e.clientY - 10 + 'px';
    });
});