// Interactive Playground Main App - Game-like UI for all tests
class PlaygroundApp {
    constructor() {
        this.currentTest = null;
        this.gameState = {};
        this.achievements = [];
        this.streaks = {};
        this.userId = this.getUserId();
        this.hasFullAccess = this.checkFullAccess();
        this.soundEnabled = localStorage.getItem('soundEnabled') !== 'false';
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
            const allTests = ['age', 'character', 'toxic', 'future', 'internet', 'redflags'];
            return data.tests && allTests.every(test => data.tests.includes(test));
        } catch {
            return false;
        }
    }
    
    init() {
        this.setupPlaygroundUI();
        this.setupGameSounds();
        this.setupAchievements();
        this.loadUserProgress();
        this.createParticleSystem();
        this.initializeGames();
    }
    
    initializeGames() {
        // Initialize game instances
        this.redFlagGame = new RedFlagDetectiveGame(this);
        this.characterGame = new CharacterQuestGame(this);
        // Add other games as they're implemented
    }
    
    setupPlaygroundUI() {
        // Transform existing feature cards into game cards
        const featureCards = document.querySelectorAll('.feature-card');
        featureCards.forEach((card, index) => {
            this.transformToGameCard(card, index);
        });
        
        // Add playground controls
        this.addPlaygroundControls();
        
        // Setup modal with game styling
        this.setupGameModal();
    }
    
    transformToGameCard(card, index) {
        const testTypes = ['age', 'redflags', 'character', 'toxic', 'future', 'internet'];
        const testType = testTypes[index];
        
        // Add game elements
        card.classList.add('game-card');
        card.setAttribute('data-test', testType);
        
        // Add progress indicator
        const progress = this.getUserProgress(testType);
        const progressBar = document.createElement('div');
        progressBar.className = 'game-progress';
        progressBar.innerHTML = `
            <div class="progress-ring">
                <svg width="60" height="60">
                    <circle cx="30" cy="30" r="25" stroke="#e5e7eb" stroke-width="4" fill="none"/>
                    <circle cx="30" cy="30" r="25" stroke="#6366f1" stroke-width="4" fill="none" 
                            stroke-dasharray="157" stroke-dashoffset="${157 - (157 * progress / 100)}"
                            class="progress-circle"/>
                </svg>
                <span class="progress-text">${progress}%</span>
            </div>
        `;
        
        // Add achievement badges
        const badges = this.getTestBadges(testType);
        const badgeContainer = document.createElement('div');
        badgeContainer.className = 'achievement-badges';
        badgeContainer.innerHTML = badges.map(badge => 
            `<span class="badge ${badge.type}">${badge.emoji}</span>`
        ).join('');
        
        // Add game stats
        const stats = document.createElement('div');
        stats.className = 'game-stats';
        stats.innerHTML = `
            <div class="stat">
                <span class="stat-icon">🎯</span>
                <span class="stat-value">${this.getTestCompletions(testType)}</span>
                <span class="stat-label">Plays</span>
            </div>
            <div class="stat">
                <span class="stat-icon">⭐</span>
                <span class="stat-value">${this.getTestRating(testType)}</span>
                <span class="stat-label">Rating</span>
            </div>
        `;
        
        // Insert game elements
        const featureIcon = card.querySelector('.feature-icon');
        if (featureIcon) {
            featureIcon.after(progressBar);
            progressBar.after(badgeContainer);
        }
        
        const featureBtn = card.querySelector('.feature-btn');
        if (featureBtn) {
            featureBtn.before(stats);
            featureBtn.textContent = progress > 0 ? '🎮 Play Again' : '🚀 Start Game';
            featureBtn.classList.add('game-btn');
        }
        
        // Add hover effects
        card.addEventListener('mouseenter', () => this.playSound('hover'));
        card.addEventListener('click', () => this.playSound('click'));
    }
    
    addPlaygroundControls() {
        const controlPanel = document.createElement('div');
        controlPanel.className = 'playground-controls';
        controlPanel.innerHTML = `
            <div class="control-group">
                <button class="control-btn" onclick="playgroundApp.toggleSound()">
                    <span class="control-icon">${this.soundEnabled ? '🔊' : '🔇'}</span>
                    <span class="control-label">Sound</span>
                </button>
                <button class="control-btn" onclick="playgroundApp.showAchievements()">
                    <span class="control-icon">🏆</span>
                    <span class="control-label">Achievements</span>
                </button>
                <button class="control-btn" onclick="playgroundApp.showLeaderboard()">
                    <span class="control-icon">📊</span>
                    <span class="control-label">Stats</span>
                </button>
                <button class="control-btn" onclick="playgroundApp.resetProgress()">
                    <span class="control-icon">🔄</span>
                    <span class="control-label">Reset</span>
                </button>
            </div>
        `;
        
        // Add to navbar
        const navbar = document.querySelector('.navbar .nav-container');
        if (navbar) {
            navbar.appendChild(controlPanel);
        }
    }
    
    setupGameModal() {
        const modal = document.getElementById('testModal');
        if (modal) {
            modal.classList.add('game-modal');
            
            // Add game UI elements to modal
            const gameUI = document.createElement('div');
            gameUI.className = 'game-ui';
            gameUI.innerHTML = `
                <div class="game-header">
                    <div class="game-info">
                        <span class="game-level">Level 1</span>
                        <span class="game-score">Score: 0</span>
                    </div>
                    <div class="game-controls">
                        <button class="game-control-btn" onclick="playgroundApp.pauseGame()">⏸️</button>
                        <button class="game-control-btn" onclick="playgroundApp.showHint()">💡</button>
                    </div>
                </div>
                <div class="game-progress-bar">
                    <div class="progress-fill" id="gameProgressFill"></div>
                </div>
            `;
            
            const modalContent = modal.querySelector('.modal-content');
            if (modalContent) {
                modalContent.prepend(gameUI);
            }
        }
    }
    
    setupGameSounds() {
        this.audioContext = null;
        this.soundsInitialized = false;
        
        this.sounds = {
            hover: () => this.playTone(200, 0.1, 'sine'),
            click: () => this.playTone(300, 0.2, 'square'),
            success: () => this.playTone([400, 500, 600], 0.3, 'sine'),
            achievement: () => this.playTone([500, 600, 700, 800], 0.4, 'triangle'),
            levelUp: () => this.playTone([300, 400, 500, 600, 700], 0.5, 'sawtooth')
        };
    }
    
    initAudioContext() {
        if (!this.audioContext) {
            try {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                this.soundsInitialized = true;
            } catch (error) {
                console.warn('Audio not supported');
            }
        }
        return this.audioContext;
    }
    
    playTone(frequency, volume, type) {
        if (!this.soundEnabled) return;
        
        const context = this.initAudioContext();
        if (!context || context.state === 'suspended') return;
        
        const frequencies = Array.isArray(frequency) ? frequency : [frequency];
        
        frequencies.forEach((freq, index) => {
            const oscillator = context.createOscillator();
            const gainNode = context.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(context.destination);
            
            oscillator.frequency.setValueAtTime(freq, context.currentTime);
            oscillator.type = type;
            
            gainNode.gain.setValueAtTime(0, context.currentTime);
            gainNode.gain.linearRampToValueAtTime(volume, context.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.3 + (index * 0.1));
            
            oscillator.start(context.currentTime + (index * 0.1));
            oscillator.stop(context.currentTime + 0.3 + (index * 0.1));
        });
    }
    
    playSound(soundName) {
        if (this.sounds[soundName]) {
            // Initialize audio context on first user interaction
            if (!this.soundsInitialized && this.audioContext?.state === 'suspended') {
                this.audioContext.resume();
            }
            this.sounds[soundName]();
        }
    }
    
    openTest(testType) {
        this.currentTest = testType;
        this.gameState = {
            level: 1,
            score: 0,
            streak: 0,
            startTime: Date.now(),
            answers: []
        };
        
        const modal = document.getElementById('testModal');
        const modalBody = document.getElementById('modalBody');
        
        // Update game UI
        this.updateGameUI();
        
        // Load test content with game styling
        modalBody.innerHTML = this.getGameTestContent(testType);
        modal.style.display = 'block';
        
        // Start game
        this.startGame(testType);
        this.playSound('levelUp');
    }
    
    updateGameUI() {
        const gameLevel = document.querySelector('.game-level');
        const gameScore = document.querySelector('.game-score');
        const gameProgressFill = document.getElementById('gameProgressFill');
        
        if (gameLevel) gameLevel.textContent = `Level ${this.gameState.level}`;
        if (gameScore) gameScore.textContent = `Score: ${this.gameState.score}`;
        if (gameProgressFill) {
            const progress = (this.gameState.answers.length / this.getTotalQuestions(this.currentTest)) * 100;
            gameProgressFill.style.width = `${progress}%`;
        }
    }
    
    getGameTestContent(testType) {
        const testConfigs = {
            age: {
                title: '🎯 Age Estimation Challenge',
                subtitle: 'Upload your photo and discover your visual age!',
                gameMode: 'photo-analysis',
                content: this.getAgeGameContent()
            },
            redflags: {
                title: '🚩 Red Flag Detective',
                subtitle: 'Solve relationship mysteries and uncover patterns!',
                gameMode: 'scenario-based',
                content: this.getRedFlagGameContent()
            },
            character: {
                title: '⭐ Character Quest',
                subtitle: 'Discover your Bollywood personality archetype!',
                gameMode: 'personality-quiz',
                content: this.getCharacterGameContent()
            },
            toxic: {
                title: '💀 Toxicity Meter Challenge',
                subtitle: 'How toxic are you? Face the brutal truth!',
                gameMode: 'scale-rating',
                content: this.getToxicGameContent()
            },
            future: {
                title: '🔮 Future Vision Quest',
                subtitle: 'Predict your 2026 destiny based on current choices!',
                gameMode: 'prediction-game',
                content: this.getFutureGameContent()
            },
            internet: {
                title: '📱 Digital DNA Scanner',
                subtitle: 'Analyze your internet personality across platforms!',
                gameMode: 'platform-analysis',
                content: this.getInternetGameContent()
            }
        };
        
        const config = testConfigs[testType];
        const premiumBadge = (this.hasFullAccess || this.hasTestAccess(testType)) ? 
            '<div class="premium-game-badge">👑 PREMIUM PLAYER</div>' : '';
        
        return `
            <div class="game-test-header ${testType}-game">
                ${premiumBadge}
                <div class="game-title-section">
                    <h2 class="game-title">${config.title}</h2>
                    <p class="game-subtitle">${config.subtitle}</p>
                    <div class="game-mode-badge">${config.gameMode}</div>
                </div>
                <div class="game-stats-mini">
                    <div class="mini-stat">
                        <span class="mini-icon">🎯</span>
                        <span class="mini-value">${this.gameState.level}</span>
                    </div>
                    <div class="mini-stat">
                        <span class="mini-icon">⭐</span>
                        <span class="mini-value">${this.gameState.score}</span>
                    </div>
                    <div class="mini-stat">
                        <span class="mini-icon">🔥</span>
                        <span class="mini-value">${this.gameState.streak}</span>
                    </div>
                </div>
            </div>
            <div class="game-content">
                ${config.content}
            </div>
        `;
    }
    
    getAgeGameContent() {
        return `
            <div class="age-game-arena">
                <div class="game-mission">
                    <h3>🎯 Mission: Photo Analysis Challenge</h3>
                    <p>Upload your best photo and let our AI analyze your visual age!</p>
                </div>
                
                <div class="photo-upload-game" id="photoUploadGame">
                    <div class="upload-zone game-zone">
                        <div class="upload-animation">
                            <div class="camera-icon">📸</div>
                            <div class="scan-lines"></div>
                        </div>
                        <h3>Drop Your Photo Here</h3>
                        <p>Or click to browse files</p>
                        <button class="game-upload-btn" onclick="document.getElementById('gameImageInput').click()">
                            🚀 Choose Photo
                        </button>
                        <input type="file" id="gameImageInput" accept="image/*" style="display: none;">
                    </div>
                </div>
                
                <div class="filter-selection-game" style="display: none;" id="filterGameSelection">
                    <h3>🎨 Choose Your Style Filter</h3>
                    <div class="filter-game-grid">
                        <div class="filter-game-card" data-filter="wedding">
                            <div class="filter-preview">💒</div>
                            <span class="filter-name">Wedding Glam</span>
                        </div>
                        <div class="filter-game-card" data-filter="festive">
                            <div class="filter-preview">🎉</div>
                            <span class="filter-name">Festive</span>
                        </div>
                        <div class="filter-game-card" data-filter="office">
                            <div class="filter-preview">💼</div>
                            <span class="filter-name">Professional</span>
                        </div>
                        <div class="filter-game-card" data-filter="casual">
                            <div class="filter-preview">😊</div>
                            <span class="filter-name">Casual Cool</span>
                        </div>
                        <div class="filter-game-card" data-filter="party">
                            <div class="filter-preview">🍾</div>
                            <span class="filter-name">Party Night</span>
                        </div>
                        <div class="filter-game-card" data-filter="travel">
                            <div class="filter-preview">✈️</div>
                            <span class="filter-name">Travel Vibes</span>
                        </div>
                        <div class="filter-game-card" data-filter="fitness">
                            <div class="filter-preview">💪</div>
                            <span class="filter-name">Fitness Mode</span>
                        </div>
                        <div class="filter-game-card" data-filter="artistic">
                            <div class="filter-preview">🎨</div>
                            <span class="filter-name">Artistic</span>
                        </div>
                        <div class="filter-game-card" data-filter="vintage">
                            <div class="filter-preview">📸</div>
                            <span class="filter-name">Vintage</span>
                        </div>
                        <div class="filter-game-card" data-filter="glamour">
                            <div class="filter-preview">✨</div>
                            <span class="filter-name">Glamour</span>
                        </div>
                    </div>
                </div>
                
                <div class="analysis-game-result" style="display: none;" id="ageGameResult">
                    <!-- Results will be loaded here -->
                </div>
            </div>
        `;
    }
    
    getRedFlagGameContent() {
        return `
            <div class="redflag-game-arena">
                <div class="game-mission">
                    <h3>🕵️ Mission: Relationship Detective</h3>
                    <p>Analyze behavior patterns and solve relationship mysteries!</p>
                </div>
                
                <div class="detective-mode-selection">
                    <h3>Choose Your Case</h3>
                    <div class="case-options">
                        <div class="case-card" onclick="playgroundApp.startRedFlagGame('self')">
                            <div class="case-icon">🪞</div>
                            <h4>Case #1: Self Investigation</h4>
                            <p>Investigate your own relationship patterns</p>
                            <div class="difficulty">Difficulty: ⭐⭐</div>
                        </div>
                        <div class="case-card" onclick="playgroundApp.startRedFlagGame('partner')">
                            <div class="case-icon">💕</div>
                            <h4>Case #2: Partner Analysis</h4>
                            <p>Analyze someone you're dating or interested in</p>
                            <div class="difficulty">Difficulty: ⭐⭐⭐</div>
                        </div>
                    </div>
                </div>
                
                <div class="detective-questions" style="display: none;" id="detectiveQuestions">
                    <!-- Questions will be loaded here -->
                </div>
                
                <div class="case-solved" style="display: none;" id="caseSolved">
                    <!-- Results will be loaded here -->
                </div>
            </div>
        `;
    }
    
    getCharacterGameContent() {
        return `
            <div class="character-game-arena">
                <div class="game-mission">
                    <h3>🎭 Mission: Bollywood Character Discovery</h3>
                    <p>Embark on a journey to discover your inner Bollywood character!</p>
                </div>
                
                <div class="character-selection-screen">
                    <h3>🌟 Your Character Awaits...</h3>
                    <div class="character-preview-grid">
                        <div class="character-preview">
                            <div class="character-silhouette">🦸♂️</div>
                            <span>The Hero</span>
                        </div>
                        <div class="character-preview">
                            <div class="character-silhouette">💕</div>
                            <span>The Romantic</span>
                        </div>
                        <div class="character-preview">
                            <div class="character-silhouette">📱</div>
                            <span>The Modern</span>
                        </div>
                        <div class="character-preview">
                            <div class="character-silhouette">😴</div>
                            <span>The Chill</span>
                        </div>
                        <div class="character-preview">
                            <div class="character-silhouette">🎉</div>
                            <span>The Social</span>
                        </div>
                        <div class="character-preview">
                            <div class="character-silhouette">🎨</div>
                            <span>The Creative</span>
                        </div>
                    </div>
                    <button class="start-quest-btn" onclick="playgroundApp.startCharacterQuest()">
                        🚀 Begin Character Quest
                    </button>
                </div>
                
                <div class="character-quest" style="display: none;" id="characterQuest">
                    <!-- Quest will be loaded here -->
                </div>
                
                <div class="character-reveal" style="display: none;" id="characterReveal">
                    <!-- Character reveal will be loaded here -->
                </div>
            </div>
        `;
    }
    
    getToxicGameContent() {
        return `
            <div class="toxic-game-arena">
                <div class="game-mission">
                    <h3>💀 Mission: Toxicity Meter Challenge</h3>
                    <p>Face the brutal truth about your toxic levels!</p>
                </div>
                
                <div class="scenario-challenge" id="scenarioChallenge">
                    <h3>⚡ Scenario Challenge</h3>
                    <p>React to these situations and see how toxic you really are!</p>
                    <button class="start-challenge-btn" onclick="playgroundApp.startToxicityQuestions()">
                        💀 Start Challenge
                    </button>
                </div>
                
                <div class="toxic-questions" style="display: none;" id="toxicGameQuestions">
                    <!-- Questions will be loaded here -->
                </div>
                
                <div class="toxicity-verdict" style="display: none;" id="toxicityVerdict">
                    <!-- Final verdict will be loaded here -->
                </div>
            </div>
        `;
    }
    
    getFutureGameContent() {
        return `
            <div class="future-game-arena">
                <div class="game-mission">
                    <h3>🔮 Mission: Future Vision Quest</h3>
                    <p>Predict your 2026 destiny based on your current life choices!</p>
                </div>
                
                <div class="crystal-ball-section">
                    <div class="crystal-ball">
                        <div class="crystal-glow"></div>
                        <div class="crystal-inner">
                            <div class="vision-swirl"></div>
                            <span class="crystal-text">2026</span>
                        </div>
                    </div>
                    <p class="crystal-message">The crystal ball awaits your answers...</p>
                </div>
                
                <div class="life-assessment" id="lifeAssessment">
                    <h3>📊 Life Assessment Portal</h3>
                    <p>Select a category to assess your 2026 potential in that area:</p>
                    <div class="assessment-categories">
                        <div class="category-card" onclick="playgroundApp.startCategoryAssessment('career')">
                            <div class="category-icon">💼</div>
                            <span>Career</span>
                            <div class="category-status" id="career-status">Start</div>
                        </div>
                        <div class="category-card" onclick="playgroundApp.startCategoryAssessment('finance')">
                            <div class="category-icon">💰</div>
                            <span>Finance</span>
                            <div class="category-status" id="finance-status">Start</div>
                        </div>
                        <div class="category-card" onclick="playgroundApp.startCategoryAssessment('health')">
                            <div class="category-icon">🏃</div>
                            <span>Health</span>
                            <div class="category-status" id="health-status">Start</div>
                        </div>
                        <div class="category-card" onclick="playgroundApp.startCategoryAssessment('learning')">
                            <div class="category-icon">🧠</div>
                            <span>Learning</span>
                            <div class="category-status" id="learning-status">Start</div>
                        </div>
                        <div class="category-card" onclick="playgroundApp.startCategoryAssessment('social')">
                            <div class="category-icon">👥</div>
                            <span>Social</span>
                            <div class="category-status" id="social-status">Start</div>
                        </div>
                    </div>
                    <div class="assessment-progress" id="assessmentProgress" style="display: none;">
                        <p>Complete all categories to unlock your full 2026 prediction!</p>
                        <div class="progress-summary">
                            <span id="completedCount">0</span>/5 Categories Complete
                        </div>
                        <button class="generate-prediction-btn" id="generatePrediction" onclick="playgroundApp.generateFullPrediction()" style="display: none;">
                            <span class="btn-icon">🔮</span>
                            <span class="btn-text">Generate My 2026 Prediction</span>
                            <div class="btn-sparkle"></div>
                            <div class="btn-glow"></div>
                        </button>
                    </div>
                </div>
                
                <div class="future-questions" style="display: none;" id="futureGameQuestions">
                    <!-- Questions will be loaded here -->
                </div>
                
                <div class="future-prophecy" style="display: none;" id="futureProphecy">
                    <!-- Future prediction will be loaded here -->
                </div>
            </div>
        `;
    }
    
    getInternetGameContent() {
        return `
            <div class="internet-game-arena">
                <div class="game-mission">
                    <h3>📱 Mission: Digital DNA Analysis</h3>
                    <p>Scan your internet personality across all platforms!</p>
                </div>
                
                <div class="platform-analysis" id="platformAnalysis">
                    <h3>🌐 Platform Personality Scan</h3>
                    <p>Select a platform to analyze your digital behavior:</p>
                    <div class="platform-grid">
                        <div class="platform-card" onclick="playgroundApp.startPlatformAssessment('whatsapp')">
                            <div class="platform-icon">📱</div>
                            <span class="platform-name">WhatsApp</span>
                            <div class="scan-status" id="whatsapp-status">Start</div>
                        </div>
                        <div class="platform-card" onclick="playgroundApp.startPlatformAssessment('instagram')">
                            <div class="platform-icon">📸</div>
                            <span class="platform-name">Instagram</span>
                            <div class="scan-status" id="instagram-status">Start</div>
                        </div>
                        <div class="platform-card" onclick="playgroundApp.startPlatformAssessment('linkedin')">
                            <div class="platform-icon">💼</div>
                            <span class="platform-name">LinkedIn</span>
                            <div class="scan-status" id="linkedin-status">Start</div>
                        </div>
                        <div class="platform-card" onclick="playgroundApp.startPlatformAssessment('twitter')">
                            <div class="platform-icon">🐦</div>
                            <span class="platform-name">Twitter/X</span>
                            <div class="scan-status" id="twitter-status">Start</div>
                        </div>
                        <div class="platform-card" onclick="playgroundApp.startPlatformAssessment('youtube')">
                            <div class="platform-icon">📺</div>
                            <span class="platform-name">YouTube</span>
                            <div class="scan-status" id="youtube-status">Start</div>
                        </div>
                    </div>
                    <button class="generate-dna-btn" id="generateDNA" onclick="playgroundApp.generateFullDNA()" style="display: none;">
                        <span class="btn-icon">🧬</span>
                        <span class="btn-text">Generate My Digital DNA</span>
                        <div class="btn-sparkle"></div>
                        <div class="btn-glow"></div>
                    </button>
                </div>
                
                <div class="internet-questions" style="display: none;" id="internetGameQuestions">
                    <!-- Questions will be loaded here -->
                </div>
                
                <div class="dna-results" style="display: none;" id="dnaResults">
                    <!-- DNA results will be loaded here -->
                </div>
            </div>
        `;
    }
    
    startGame(testType) {
        // Initialize game-specific logic
        switch(testType) {
            case 'age':
                this.setupAgeGame();
                break;
            case 'redflags':
                this.setupRedFlagGame();
                break;
            case 'character':
                this.setupCharacterGame();
                break;
            case 'toxic':
                this.setupToxicGame();
                break;
            case 'future':
                this.setupFutureGame();
                break;
            case 'internet':
                this.setupInternetGame();
                break;
        }
    }
    
    setupAgeGame() {
        // Load TensorFlow.js face detection model
        this.loadFaceDetection();
        
        const imageInput = document.getElementById('gameImageInput');
        const uploadZone = document.querySelector('.upload-zone');
        const filterSelection = document.getElementById('filterGameSelection');
        
        if (imageInput) {
            imageInput.addEventListener('change', (e) => {
                if (e.target.files[0]) {
                    this.playSound('success');
                    this.gameState.score += 100;
                    this.updateGameUI();
                    
                    // Store image for analysis
                    this.selectedImage = e.target.files[0];
                    
                    // Show filter selection with animation
                    document.getElementById('photoUploadGame').style.display = 'none';
                    filterSelection.style.display = 'block';
                    
                    // Setup filter selection
                    document.querySelectorAll('.filter-game-card').forEach(card => {
                        card.addEventListener('click', () => {
                            this.selectFilter(card.dataset.filter);
                        });
                    });
                }
            });
        }
        
        // Drag and drop functionality
        if (uploadZone) {
            uploadZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadZone.classList.add('drag-over');
            });
            
            uploadZone.addEventListener('dragleave', () => {
                uploadZone.classList.remove('drag-over');
            });
            
            uploadZone.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadZone.classList.remove('drag-over');
                
                const files = e.dataTransfer.files;
                if (files.length > 0 && files[0].type.startsWith('image/')) {
                    imageInput.files = files;
                    imageInput.dispatchEvent(new Event('change'));
                }
            });
        }
    }
    
    async loadFaceDetection() {
        try {
            // Load BlazeFace model for face detection
            this.faceModel = await blazeface.load();
            console.log('Face detection model loaded');
        } catch (error) {
            console.warn('Face detection not available:', error);
            this.faceModel = null;
        }
    }
    
    async analyzeImageWithTensorFlow(imageFile) {
        if (!this.faceModel) {
            return { faceDetected: false, error: 'Model not loaded' };
        }
        
        try {
            const img = new Image();
            img.src = URL.createObjectURL(imageFile);
            
            return new Promise((resolve) => {
                img.onload = async () => {
                    try {
                        const predictions = await this.faceModel.estimateFaces(img);
                        
                        if (predictions.length > 0) {
                            const face = predictions[0];
                            const faceWidth = face.bottomRight[0] - face.topLeft[0];
                            const faceHeight = face.bottomRight[1] - face.topLeft[1];
                            const faceSize = faceWidth * faceHeight;
                            
                            // Simple gender estimation based on face proportions and hair
                            const faceRatio = faceWidth / faceHeight;
                            const estimatedGender = this.estimateGender(faceRatio, faceWidth, faceHeight, face, img);
                            
                            resolve({
                                faceDetected: true,
                                faceCount: predictions.length,
                                faceSize: faceSize,
                                faceWidth: faceWidth,
                                faceHeight: faceHeight,
                                confidence: face.probability || 0.9,
                                estimatedGender: estimatedGender
                            });
                        } else {
                            resolve({ faceDetected: false, reason: 'No face found' });
                        }
                    } catch (error) {
                        resolve({ faceDetected: false, error: error.message });
                    }
                };
            });
        } catch (error) {
            return { faceDetected: false, error: error.message };
        }
    }
    
    estimateGender(faceRatio, faceWidth, faceHeight, face, img) {
        // Simple heuristic based on face proportions and hair estimation
        let maleScore = 0;
        
        // Face proportion analysis
        if (faceRatio > 0.85) maleScore += 1;
        if (faceWidth > 150) maleScore += 1;
        if (faceHeight > 180) maleScore += 1;
        
        // Hair length estimation based on space above face
        const faceTop = face.topLeft[1];
        const imageHeight = img.height;
        const spaceAboveFace = faceTop;
        const faceToImageRatio = spaceAboveFace / faceHeight;
        
        // If there's significant space above face, likely longer hair (more feminine)
        if (faceToImageRatio < 0.3) {
            // Very little space above face = short hair = more likely male
            maleScore += 2;
        } else if (faceToImageRatio > 0.8) {
            // Lots of space above face = long hair = more likely female
            maleScore -= 1;
        }
        
        // Add some randomness but make it consistent per session
        const sessionRandom = (Date.now() % 1000) > 500 ? 1 : 0;
        maleScore += sessionRandom;
        
        return maleScore >= 2 ? 'male' : 'female';
    }
    
    calculateAgeFromFaceData(faceData, filterType) {
        if (!faceData.faceDetected) {
            // Fallback to random if no face detected
            return Math.floor(Math.random() * 15) + 20;
        }
        
        // Use face data to influence age calculation
        let baseAge = 25;
        
        // Larger faces might indicate closer photos (younger selfie style)
        if (faceData.faceSize > 50000) baseAge -= 3;
        else if (faceData.faceSize < 20000) baseAge += 2;
        
        // Face proportions influence
        const faceRatio = faceData.faceWidth / faceData.faceHeight;
        if (faceRatio > 0.8) baseAge += 1; // Wider faces
        
        // Filter influence
        const filterAgeModifiers = {
            wedding: -2, festive: -1, party: -2, glamour: -3,
            office: +1, casual: 0, fitness: -1, artistic: 0,
            travel: -1, vintage: +2
        };
        
        baseAge += filterAgeModifiers[filterType] || 0;
        
        // Add some randomness but keep it realistic
        baseAge += Math.floor(Math.random() * 6) - 3;
        
        return Math.max(18, Math.min(45, baseAge));
    }
    
    selectFilter(filterType) {
        this.playSound('click');
        this.gameState.score += 50;
        this.updateGameUI();
        
        // Remove previous selections
        document.querySelectorAll('.filter-game-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Mark selected
        document.querySelector(`[data-filter="${filterType}"]`).classList.add('selected');
        
        // Process age estimation with TensorFlow analysis
        setTimeout(() => {
            this.processAgeGameEstimation(filterType);
        }, 1000);
    }
    
    async processAgeGameEstimation(filterType) {
        const filterSelection = document.getElementById('filterGameSelection');
        const ageResult = document.getElementById('ageGameResult');
        
        filterSelection.style.display = 'none';
        
        // Show loading with game styling
        ageResult.innerHTML = `
            <div class="game-loading">
                <div class="loading-spinner-game">
                    <div class="spinner-ring"></div>
                    <div class="spinner-ring"></div>
                    <div class="spinner-ring"></div>
                </div>
                <h3>🤖 AI Analysis in Progress...</h3>
                <div class="loading-steps">
                    <div class="step active">📸 Processing image...</div>
                    <div class="step">🧠 Detecting face features...</div>
                    <div class="step">🎯 Calculating age estimate...</div>
                    <div class="step">✨ Generating insights...</div>
                </div>
            </div>
        `;
        ageResult.style.display = 'block';
        
        // Animate loading steps
        let stepIndex = 1;
        const stepInterval = setInterval(() => {
            if (stepIndex < 4) {
                document.querySelectorAll('.loading-steps .step')[stepIndex].classList.add('active');
                stepIndex++;
            } else {
                clearInterval(stepInterval);
            }
        }, 800);
        
        // Analyze image with TensorFlow in background
        let faceData = { faceDetected: false };
        if (this.selectedImage) {
            faceData = await this.analyzeImageWithTensorFlow(this.selectedImage);
            this.lastFaceData = faceData; // Store for variant selection
        }
        
        // Show results after loading
        setTimeout(() => {
            this.showAgeGameResults(filterType, faceData);
        }, 4000);
    }
    
    showAgeGameResults(filterType, faceData = null) {
        const estimatedAge = faceData ? 
            this.calculateAgeFromFaceData(faceData, filterType) : 
            Math.floor(Math.random() * 15) + 20;
            
        // Store for premium unlock
        this.lastEstimatedAge = estimatedAge;
            
        const ageResult = document.getElementById('ageGameResult');
        
        // Calculate game score based on accuracy (simulated)
        const accuracyBonus = Math.floor(Math.random() * 200) + 100;
        this.gameState.score += accuracyBonus;
        
        // Achievement check
        this.checkAgeGameAchievements(estimatedAge, filterType);
        
        // Add face detection status to results
        const faceDetectionStatus = faceData?.faceDetected ? 
            `🎯 Face detected with ${Math.round((faceData.confidence || 0.9) * 100)}% confidence` :
            `🔍 No clear face detected - using advanced estimation`;
        
        const resultContent = `
            <div class="age-game-results">
                <div class="results-header">
                    <h3>🎯 Analysis Complete!</h3>
                    <div class="score-gained">+${accuracyBonus} points</div>
                    <div class="ai-status">${faceDetectionStatus}</div>
                </div>
                
                <div class="age-display-game">
                    <div class="age-circle">
                        <span class="age-number">${estimatedAge}</span>
                        <span class="age-label">years old</span>
                    </div>
                </div>
                
                <div class="filter-bonus">
                    <h4>🎨 ${filterType.charAt(0).toUpperCase() + filterType.slice(1)} Filter Analysis</h4>
                    <p>Your style choice enhanced the AI analysis accuracy!</p>
                </div>
                
                <div class="game-achievements" id="ageAchievements">
                    <!-- Achievements will be shown here -->
                </div>
                
                <div class="premium-unlock-game" ${(this.hasFullAccess || this.hasTestAccess('age')) ? 'style="display: none;"' : ''}>
                    <div class="unlock-preview">
                        <h4>🔓 Unlock Premium Analysis</h4>
                        <div class="premium-features-game">
                            <div class="feature-item">
                                <span class="feature-icon">🧬</span>
                                <span>Detailed Face Analysis</span>
                            </div>
                            <div class="feature-item">
                                <span class="feature-icon">⭐</span>
                                <span>Celebrity Matches</span>
                            </div>
                            <div class="feature-item">
                                <span class="feature-icon">📊</span>
                                <span>Beauty Metrics</span>
                            </div>
                            <div class="feature-item">
                                <span class="feature-icon">💡</span>
                                <span>Enhancement Tips</span>
                            </div>
                        </div>
                        <button class="unlock-game-btn" onclick="playgroundApp.handleGameUpgrade('age')">
                            🚀 Unlock for ₹49
                        </button>
                    </div>
                </div>
                
                <div class="game-actions">
                    <button class="play-again-btn" onclick="playgroundApp.restartGame('age')">
                        🔄 Play Again
                    </button>
                    <button class="share-result-btn" onclick="playgroundApp.shareGameResult('age')">
                        📱 Share Result
                    </button>
                </div>
            </div>
        `;
        
        ageResult.innerHTML = resultContent;
        this.updateGameUI();
        this.playSound('achievement');
        
        // Auto-unlock for premium users
        if (this.hasFullAccess || this.hasTestAccess('age')) {
            setTimeout(() => {
                this.showPremiumAgeAnalysis(estimatedAge, filterType);
            }, 1000);
        }
    }
    
    checkAgeGameAchievements(estimatedAge, filterType) {
        const achievements = [];
        
        if (estimatedAge < 25) {
            achievements.push({
                id: 'youthful',
                emoji: '👶',
                title: 'Fountain of Youth',
                description: 'Estimated age under 25!'
            });
        }
        
        if (filterType === 'wedding') {
            achievements.push({
                id: 'glamorous',
                emoji: '💒',
                title: 'Wedding Ready',
                description: 'Chose the glamorous wedding filter!'
            });
        }
        
        // Add achievements to user profile
        achievements.forEach(achievement => {
            this.addAchievement(achievement);
        });
        
        // Display achievements
        if (achievements.length > 0) {
            this.showAchievementPopup(achievements);
        }
    }
    
    startRedFlagGame(mode) {
        this.redFlagGame.start(mode);
    }
    
    startCharacterQuest() {
        this.characterGame.start();
    }
    
    startFutureAssessment() {
        this.playSound('click');
        // This method is kept for compatibility but redirects to category selection
        document.getElementById('assessmentProgress').style.display = 'block';
    }
    
    startCategoryAssessment(category) {
        this.playSound('click');
        this.currentCategory = category;
        this.categoryAnswers = this.categoryAnswers || {};
        
        const categoryQuestions = this.getCategoryQuestions(category);
        this.currentCategoryQuestions = categoryQuestions;
        this.currentCategoryQuestion = 0;
        this.categoryResponses = [];
        
        this.showCategoryQuestion();
    }
    
    getCategoryQuestions(category) {
        const questions = {
            career: [
                {
                    question: "How satisfied are you with your current career progress?",
                    options: [
                        { emoji: "🚀", text: "Very satisfied, on track", score: 5 },
                        { emoji: "🙂", text: "Mostly satisfied, minor adjustments needed", score: 4 },
                        { emoji: "😐", text: "Neutral, could be better", score: 3 },
                        { emoji: "😔", text: "Somewhat dissatisfied, need changes", score: 2 }
                    ]
                },
                {
                    question: "How often do you actively work on career development?",
                    options: [
                        { emoji: "📚", text: "Daily - always learning and networking", score: 5 },
                        { emoji: "📅", text: "Weekly - regular skill building", score: 4 },
                        { emoji: "📆", text: "Monthly - occasional development", score: 3 },
                        { emoji: "😴", text: "Rarely - only when required", score: 2 }
                    ]
                },
                {
                    question: "How clear is your career vision for the next 3 years?",
                    options: [
                        { emoji: "🎯", text: "Crystal clear with detailed plan", score: 5 },
                        { emoji: "🔍", text: "Pretty clear with general direction", score: 4 },
                        { emoji: "🤔", text: "Somewhat unclear, exploring options", score: 3 },
                        { emoji: "😕", text: "Very unclear, no specific plan", score: 2 }
                    ]
                }
            ],
            finance: [
                {
                    question: "How well do you manage your personal finances?",
                    options: [
                        { emoji: "💰", text: "Excellent - budget, save, invest regularly", score: 5 },
                        { emoji: "💳", text: "Good - mostly organized with some planning", score: 4 },
                        { emoji: "💵", text: "Average - basic budgeting, some savings", score: 3 },
                        { emoji: "😰", text: "Poor - struggle with budgeting", score: 2 }
                    ]
                },
                {
                    question: "How prepared are you for financial emergencies?",
                    options: [
                        { emoji: "🏦", text: "Very prepared - 6+ months emergency fund", score: 5 },
                        { emoji: "💾", text: "Well prepared - 3-6 months saved", score: 4 },
                        { emoji: "💴", text: "Somewhat prepared - 1-3 months saved", score: 3 },
                        { emoji: "😨", text: "Not prepared - no emergency savings", score: 2 }
                    ]
                },
                {
                    question: "How actively do you work on increasing your income?",
                    options: [
                        { emoji: "🚀", text: "Very actively - multiple income streams", score: 5 },
                        { emoji: "💼", text: "Actively - seeking promotions/opportunities", score: 4 },
                        { emoji: "🔍", text: "Occasionally - when opportunities arise", score: 3 },
                        { emoji: "😴", text: "Rarely - satisfied with current income", score: 2 }
                    ]
                }
            ],
            health: [
                {
                    question: "How would you rate your overall physical health?",
                    options: [
                        { emoji: "💪", text: "Excellent - very fit and energetic", score: 5 },
                        { emoji: "🏃", text: "Good - generally healthy and active", score: 4 },
                        { emoji: "😐", text: "Average - okay but could improve", score: 3 },
                        { emoji: "😔", text: "Below average - some health concerns", score: 2 }
                    ]
                },
                {
                    question: "How consistent are you with healthy habits?",
                    options: [
                        { emoji: "🥗", text: "Very consistent - daily exercise and good diet", score: 5 },
                        { emoji: "🍎", text: "Mostly consistent - regular healthy choices", score: 4 },
                        { emoji: "😅", text: "Sometimes consistent - on and off", score: 3 },
                        { emoji: "🍔", text: "Rarely consistent - struggle with habits", score: 2 }
                    ]
                },
                {
                    question: "How well do you manage stress and mental health?",
                    options: [
                        { emoji: "🧘", text: "Excellent - great coping strategies", score: 5 },
                        { emoji: "😌", text: "Good - manage stress fairly well", score: 4 },
                        { emoji: "😓", text: "Average - sometimes overwhelmed", score: 3 },
                        { emoji: "😩", text: "Poor - often stressed and anxious", score: 2 }
                    ]
                }
            ],
            learning: [
                {
                    question: "How actively do you pursue new knowledge and skills?",
                    options: [
                        { emoji: "📚", text: "Very actively - constantly learning", score: 5 },
                        { emoji: "📝", text: "Regularly - weekly learning activities", score: 4 },
                        { emoji: "📱", text: "Occasionally - monthly learning", score: 3 },
                        { emoji: "😴", text: "Rarely - only when necessary", score: 2 }
                    ]
                },
                {
                    question: "How well do you adapt to new technologies and trends?",
                    options: [
                        { emoji: "🚀", text: "Very well - early adopter", score: 5 },
                        { emoji: "📱", text: "Well - quick to learn new things", score: 4 },
                        { emoji: "🤔", text: "Average - adapt when needed", score: 3 },
                        { emoji: "😕", text: "Slowly - struggle with change", score: 2 }
                    ]
                },
                {
                    question: "How committed are you to personal growth?",
                    options: [
                        { emoji: "🌱", text: "Extremely committed - always improving", score: 5 },
                        { emoji: "🎯", text: "Very committed - regular self-development", score: 4 },
                        { emoji: "🙂", text: "Somewhat committed - occasional efforts", score: 3 },
                        { emoji: "😐", text: "Not very committed - comfortable as is", score: 2 }
                    ]
                }
            ],
            social: [
                {
                    question: "How strong is your professional and personal network?",
                    options: [
                        { emoji: "🌐", text: "Very strong - extensive meaningful connections", score: 5 },
                        { emoji: "👥", text: "Strong - good network in key areas", score: 4 },
                        { emoji: "👤", text: "Average - some connections", score: 3 },
                        { emoji: "😔", text: "Weak - limited network", score: 2 }
                    ]
                },
                {
                    question: "How well do you maintain relationships?",
                    options: [
                        { emoji: "💕", text: "Excellent - very good at staying connected", score: 5 },
                        { emoji: "😊", text: "Good - maintain most relationships well", score: 4 },
                        { emoji: "😐", text: "Average - some effort to stay connected", score: 3 },
                        { emoji: "😔", text: "Poor - struggle to maintain connections", score: 2 }
                    ]
                },
                {
                    question: "How comfortable are you in social and networking situations?",
                    options: [
                        { emoji: "🎉", text: "Very comfortable - love meeting new people", score: 5 },
                        { emoji: "😊", text: "Comfortable - enjoy social interactions", score: 4 },
                        { emoji: "😐", text: "Neutral - depends on the situation", score: 3 },
                        { emoji: "😰", text: "Uncomfortable - prefer to avoid", score: 2 }
                    ]
                }
            ]
        };
        
        return questions[category] || [];
    }
    
    showCategoryQuestion() {
        if (this.currentCategoryQuestion >= this.currentCategoryQuestions.length) {
            this.completeCategoryAssessment();
            return;
        }
        
        const question = this.currentCategoryQuestions[this.currentCategoryQuestion];
        const progress = ((this.currentCategoryQuestion + 1) / this.currentCategoryQuestions.length) * 100;
        
        const lifeAssessment = document.getElementById('lifeAssessment');
        const futureQuestions = document.getElementById('futureGameQuestions');
        
        lifeAssessment.style.display = 'none';
        futureQuestions.style.display = 'block';
        
        futureQuestions.innerHTML = `
            <div class="future-question-arena">
                <div class="crystal-vision-header">
                    <h3>📊 ${this.currentCategory.charAt(0).toUpperCase() + this.currentCategory.slice(1)} Assessment</h3>
                    <div class="vision-progress">
                        <div class="progress-orb">
                            <div class="orb-glow"></div>
                            <span>${this.currentCategoryQuestion + 1}/${this.currentCategoryQuestions.length}</span>
                        </div>
                    </div>
                </div>
                
                <div class="prophecy-card-3d">
                    <div class="prophecy-glow"></div>
                    <div class="prophecy-content">
                        <h4>🎯 Assessment Question</h4>
                        <p class="prophecy-text">${question.question}</p>
                    </div>
                </div>
                
                <div class="destiny-options-3d">
                    ${question.options.map((option, index) => `
                        <div class="destiny-card-3d" onclick="playgroundApp.selectCategoryAnswer(${option.score})">
                            <div class="destiny-glow"></div>
                            <div class="destiny-icon">${option.emoji}</div>
                            <div class="destiny-text">${option.text}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    selectCategoryAnswer(score) {
        this.categoryResponses.push(score);
        this.playSound('click');
        this.currentCategoryQuestion++;
        
        setTimeout(() => {
            this.showCategoryQuestion();
        }, 300);
    }
    
    completeCategoryAssessment() {
        const avgScore = this.categoryResponses.reduce((sum, score) => sum + score, 0) / this.categoryResponses.length;
        this.categoryAnswers[this.currentCategory] = avgScore;
        
        // Update status
        document.getElementById(`${this.currentCategory}-status`).textContent = 'Complete';
        document.getElementById(`${this.currentCategory}-status`).style.background = '#10b981';
        document.getElementById(`${this.currentCategory}-status`).style.color = 'white';
        
        // Update progress
        const completedCount = Object.keys(this.categoryAnswers).length;
        document.getElementById('completedCount').textContent = completedCount;
        
        if (completedCount === 5) {
            document.getElementById('generatePrediction').style.display = 'block';
        }
        
        // Return to assessment portal
        document.getElementById('futureGameQuestions').style.display = 'none';
        document.getElementById('lifeAssessment').style.display = 'block';
        document.getElementById('assessmentProgress').style.display = 'block';
        
        this.playSound('success');
    }
    
    generateFullPrediction() {
        // Calculate overall future type based on all category scores
        const avgScores = Object.values(this.categoryAnswers);
        const overallScore = avgScores.reduce((sum, score) => sum + score, 0) / avgScores.length;
        
        let dominantType;
        if (overallScore >= 4.5) dominantType = 'leader';
        else if (overallScore >= 3.5) dominantType = 'entrepreneur';
        else if (overallScore >= 2.5) dominantType = 'creative';
        else dominantType = 'specialist';
        
        this.showFutureProphecy(dominantType);
    }
    
    startDigitalScan() {
        this.playSound('click');
        // This method is kept for compatibility but redirects to platform selection
        document.getElementById('scanProgress').style.display = 'block';
    }
    
    startPlatformAssessment(platform) {
        this.playSound('click');
        this.currentPlatform = platform;
        this.platformAnswers = this.platformAnswers || {};
        
        const platformQuestions = this.getPlatformQuestions(platform);
        this.currentPlatformQuestions = platformQuestions;
        this.currentPlatformQuestion = 0;
        this.platformResponses = [];
        
        this.showPlatformQuestion();
    }
    
    getPlatformQuestions(platform) {
        const questions = {
            whatsapp: [
                {
                    question: "How often do you check WhatsApp?",
                    options: [
                        { emoji: "🔥", text: "Constantly - every few minutes", score: 5 },
                        { emoji: "📱", text: "Frequently - several times per hour", score: 4 },
                        { emoji: "😐", text: "Occasionally - few times a day", score: 3 },
                        { emoji: "😴", text: "Rarely - only when needed", score: 2 }
                    ]
                },
                {
                    question: "What's your WhatsApp group behavior?",
                    options: [
                        { emoji: "💬", text: "Active participant - always chatting", score: 5 },
                        { emoji: "😂", text: "Meme sharer - love sending funny content", score: 4 },
                        { emoji: "👀", text: "Silent reader - rarely contribute", score: 3 },
                        { emoji: "🚫", text: "Group avoider - mute most groups", score: 2 }
                    ]
                },
                {
                    question: "How do you handle WhatsApp status updates?",
                    options: [
                        { emoji: "📸", text: "Daily poster - share everything", score: 5 },
                        { emoji: "🎆", text: "Occasional sharer - special moments only", score: 4 },
                        { emoji: "👁️", text: "Status viewer - watch but don't post", score: 3 },
                        { emoji: "😶", text: "Status ignorer - don't use this feature", score: 2 }
                    ]
                }
            ],
            instagram: [
                {
                    question: "What's your Instagram posting frequency?",
                    options: [
                        { emoji: "📸", text: "Daily content creator", score: 5 },
                        { emoji: "🌅", text: "Weekly highlights poster", score: 4 },
                        { emoji: "🎆", text: "Monthly special moments", score: 3 },
                        { emoji: "👀", text: "Rarely post, mostly browse", score: 2 }
                    ]
                },
                {
                    question: "How do you engage with others' content?",
                    options: [
                        { emoji: "💬", text: "Active commenter on most posts", score: 5 },
                        { emoji: "❤️", text: "Like and occasional comment", score: 4 },
                        { emoji: "👀", text: "Silent liker, rarely comment", score: 3 },
                        { emoji: "😶", text: "Passive scroller, minimal engagement", score: 2 }
                    ]
                },
                {
                    question: "What type of Instagram stories do you prefer?",
                    options: [
                        { emoji: "🎉", text: "Fun daily life updates", score: 5 },
                        { emoji: "📚", text: "Educational or informative content", score: 4 },
                        { emoji: "🎨", text: "Aesthetic or artistic posts", score: 3 },
                        { emoji: "😐", text: "Don't really use stories", score: 2 }
                    ]
                }
            ],
            linkedin: [
                {
                    question: "How active are you on LinkedIn?",
                    options: [
                        { emoji: "🚀", text: "Daily professional content sharer", score: 5 },
                        { emoji: "💼", text: "Weekly industry updates", score: 4 },
                        { emoji: "👀", text: "Passive browser, occasional like", score: 3 },
                        { emoji: "😴", text: "Rarely use, just for job hunting", score: 2 }
                    ]
                },
                {
                    question: "What's your LinkedIn networking approach?",
                    options: [
                        { emoji: "🤝", text: "Actively connect with new people", score: 5 },
                        { emoji: "💬", text: "Engage with colleagues' content", score: 4 },
                        { emoji: "👥", text: "Connect only with known contacts", score: 3 },
                        { emoji: "😐", text: "Minimal networking activity", score: 2 }
                    ]
                },
                {
                    question: "How do you use LinkedIn for career growth?",
                    options: [
                        { emoji: "🏆", text: "Thought leadership and personal branding", score: 5 },
                        { emoji: "📊", text: "Share achievements and milestones", score: 4 },
                        { emoji: "🔍", text: "Research companies and opportunities", score: 3 },
                        { emoji: "😕", text: "Don't really use it strategically", score: 2 }
                    ]
                }
            ],
            twitter: [
                {
                    question: "What's your Twitter/X engagement style?",
                    options: [
                        { emoji: "🔥", text: "Active tweeter and retweeter", score: 5 },
                        { emoji: "💬", text: "Reply and engage in conversations", score: 4 },
                        { emoji: "👀", text: "Mostly lurk and read tweets", score: 3 },
                        { emoji: "😐", text: "Rarely use or check Twitter", score: 2 }
                    ]
                },
                {
                    question: "What type of Twitter content interests you most?",
                    options: [
                        { emoji: "📰", text: "Breaking news and current events", score: 5 },
                        { emoji: "😂", text: "Memes and funny content", score: 4 },
                        { emoji: "💼", text: "Industry insights and professional content", score: 3 },
                        { emoji: "🤷", text: "Don't have a specific preference", score: 2 }
                    ]
                },
                {
                    question: "How do you handle Twitter controversies?",
                    options: [
                        { emoji: "💬", text: "Jump into discussions and debates", score: 5 },
                        { emoji: "👀", text: "Watch from sidelines, don't engage", score: 4 },
                        { emoji: "🚫", text: "Avoid controversial topics completely", score: 3 },
                        { emoji: "😕", text: "Don't really notice or care", score: 2 }
                    ]
                }
            ],
            youtube: [
                {
                    question: "How do you consume YouTube content?",
                    options: [
                        { emoji: "📺", text: "Daily binge watcher", score: 5 },
                        { emoji: "🎬", text: "Regular viewer with subscriptions", score: 4 },
                        { emoji: "🔍", text: "Occasional searcher for specific content", score: 3 },
                        { emoji: "😐", text: "Rarely use YouTube", score: 2 }
                    ]
                },
                {
                    question: "Do you interact with YouTube content?",
                    options: [
                        { emoji: "💬", text: "Active commenter and community member", score: 5 },
                        { emoji: "👍", text: "Like videos and subscribe to channels", score: 4 },
                        { emoji: "👀", text: "Silent viewer, no interaction", score: 3 },
                        { emoji: "😶", text: "Just watch, don't engage at all", score: 2 }
                    ]
                },
                {
                    question: "What's your YouTube content preference?",
                    options: [
                        { emoji: "🎆", text: "Entertainment and trending videos", score: 5 },
                        { emoji: "📚", text: "Educational and tutorial content", score: 4 },
                        { emoji: "🎵", text: "Music and creative content", score: 3 },
                        { emoji: "🤷", text: "Whatever appears in recommendations", score: 2 }
                    ]
                }
            ]
        };
        
        return questions[platform] || [];
    }
    
    showPlatformQuestion() {
        if (this.currentPlatformQuestion >= this.currentPlatformQuestions.length) {
            this.completePlatformAssessment();
            return;
        }
        
        const question = this.currentPlatformQuestions[this.currentPlatformQuestion];
        const progress = ((this.currentPlatformQuestion + 1) / this.currentPlatformQuestions.length) * 100;
        
        const platformAnalysis = document.getElementById('platformAnalysis');
        const internetQuestions = document.getElementById('internetGameQuestions');
        
        platformAnalysis.style.display = 'none';
        internetQuestions.style.display = 'block';
        
        internetQuestions.innerHTML = `
            <div class="internet-question-arena">
                <div class="dna-scan-header">
                    <h3>📱 ${this.currentPlatform.charAt(0).toUpperCase() + this.currentPlatform.slice(1)} Analysis</h3>
                    <div class="scan-progress-3d">
                        <div class="dna-helix-mini">
                            <div class="helix-strand-1"></div>
                            <div class="helix-strand-2"></div>
                        </div>
                        <span class="scan-text">${this.currentPlatformQuestion + 1}/${this.currentPlatformQuestions.length}</span>
                    </div>
                </div>
                
                <div class="platform-question-3d">
                    <div class="question-glow"></div>
                    <div class="question-content">
                        <h4>🎯 Platform Behavior Analysis</h4>
                        <p class="question-text">${question.question}</p>
                    </div>
                </div>
                
                <div class="internet-options-3d">
                    ${question.options.map((option, index) => `
                        <div class="platform-option-3d" onclick="playgroundApp.selectPlatformAnswer(${option.score})">
                            <div class="option-glow"></div>
                            <div class="platform-emoji">${option.emoji}</div>
                            <div class="option-title">${option.text}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    selectPlatformAnswer(score) {
        this.platformResponses.push(score);
        this.playSound('click');
        this.currentPlatformQuestion++;
        
        setTimeout(() => {
            this.showPlatformQuestion();
        }, 300);
    }
    
    completePlatformAssessment() {
        const avgScore = this.platformResponses.reduce((sum, score) => sum + score, 0) / this.platformResponses.length;
        this.platformAnswers[this.currentPlatform] = avgScore;
        
        // Update status
        const statusElement = document.getElementById(`${this.currentPlatform}-status`);
        statusElement.textContent = 'Complete';
        statusElement.style.background = '#10b981';
        statusElement.style.color = 'white';
        statusElement.style.borderRadius = '10px';
        statusElement.style.padding = '4px 8px';
        
        const scannedCount = Object.keys(this.platformAnswers).length;
        
        if (scannedCount === 5) {
            const generateBtn = document.getElementById('generateDNA');
            if (generateBtn) {
                generateBtn.style.display = 'block';
            }
        }
        
        // Return to platform analysis
        document.getElementById('internetGameQuestions').style.display = 'none';
        document.getElementById('platformAnalysis').style.display = 'block';
        
        this.playSound('success');
    }
    
    generateFullDNA() {
        // Calculate overall internet type based on all platform scores
        const avgScores = Object.values(this.platformAnswers);
        const overallScore = avgScores.reduce((sum, score) => sum + score, 0) / avgScores.length;
        
        let dominantType;
        if (overallScore >= 4.5) dominantType = 'creator';
        else if (overallScore >= 3.5) dominantType = 'social';
        else if (overallScore >= 2.5) dominantType = 'professional';
        else dominantType = 'lurker';
        
        // Create type counts for display
        const typeCounts = { [dominantType]: 5 };
        
        this.showInternetDNA(dominantType, typeCounts);
    }
    
    setupToxicGame() {
        // Initialize toxic game functionality
        const challengeBtn = document.querySelector('.start-challenge-btn');
        if (challengeBtn) {
            challengeBtn.addEventListener('click', () => {
                this.playSound('click');
                this.startToxicityQuestions();
            });
        }
    }
    
    startToxicityQuestions() {
        this.toxicQuestions = [
            {
                scenario: "Your friend cancels plans last minute. Your reaction:",
                options: [
                    { emoji: "💬", text: "No problem, let's reschedule!", level: 1 },
                    { emoji: "😐", text: "Feel annoyed but stay quiet", level: 2 },
                    { emoji: "😤", text: "Get angry and give silent treatment", level: 3 }
                ]
            },
            {
                scenario: "Someone gets the promotion you wanted. You:",
                options: [
                    { emoji: "🎉", text: "Congratulate them genuinely", level: 1 },
                    { emoji: "😒", text: "Smile but feel bitter inside", level: 2 },
                    { emoji: "💀", text: "Talk badly about them to others", level: 3 }
                ]
            },
            {
                scenario: "Your partner forgets your anniversary. You:",
                options: [
                    { emoji: "💕", text: "Gently remind them with humor", level: 1 },
                    { emoji: "😔", text: "Drop hints and act hurt", level: 2 },
                    { emoji: "🔥", text: "Start a big fight about it", level: 3 }
                ]
            },
            {
                scenario: "Someone cuts in line in front of you. You:",
                options: [
                    { emoji: "😊", text: "Let it go, not worth the stress", level: 1 },
                    { emoji: "🙄", text: "Make passive-aggressive comments", level: 2 },
                    { emoji: "😡", text: "Confront them aggressively", level: 3 }
                ]
            },
            {
                scenario: "Your friend gets more likes on social media. You:",
                options: [
                    { emoji: "👍", text: "Like and comment supportively", level: 1 },
                    { emoji: "😤", text: "Feel jealous but don't show it", level: 2 },
                    { emoji: "💔", text: "Post something to compete", level: 3 }
                ]
            }
        ];
        
        this.currentToxicQuestion = 0;
        this.toxicAnswers = [];
        this.showToxicQuestion();
    }
    
    showToxicQuestion() {
        if (this.currentToxicQuestion >= this.toxicQuestions.length) {
            this.calculateToxicResult();
            return;
        }
        
        const question = this.toxicQuestions[this.currentToxicQuestion];
        const progress = ((this.currentToxicQuestion + 1) / this.toxicQuestions.length) * 100;
        
        const scenarioChallenge = document.getElementById('scenarioChallenge');
        const toxicQuestions = document.getElementById('toxicGameQuestions');
        
        scenarioChallenge.style.display = 'none';
        toxicQuestions.style.display = 'block';
        
        toxicQuestions.innerHTML = `
            <div class="toxic-question-arena">
                <div class="question-header-3d">
                    <h3>💀 Toxicity Challenge</h3>
                    <div class="progress-ring-3d">
                        <div class="ring-fill" style="--progress: ${progress}%"></div>
                        <span class="progress-text">${this.currentToxicQuestion + 1}/${this.toxicQuestions.length}</span>
                    </div>
                </div>
                
                <div class="scenario-card-3d">
                    <div class="scenario-glow"></div>
                    <div class="scenario-content">
                        <h4>🎭 Scenario Analysis</h4>
                        <p class="scenario-text">${question.scenario}</p>
                    </div>
                </div>
                
                <div class="toxic-options-3d">
                    ${question.options.map((option, index) => `
                        <div class="option-card-3d ${option.level === 1 ? 'green' : option.level === 2 ? 'yellow' : 'red'}" onclick="playgroundApp.selectToxicAnswer(${option.level})">
                            <div class="option-glow"></div>
                            <div class="option-icon">${option.emoji}</div>
                            <div class="option-text">${option.text}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    selectToxicAnswer(level) {
        this.gameState.score += level * 50;
        this.toxicAnswers.push(level);
        this.updateGameUI();
        this.playSound('click');
        
        this.currentToxicQuestion++;
        
        setTimeout(() => {
            this.showToxicQuestion();
        }, 500);
    }
    
    calculateToxicResult() {
        const totalScore = this.toxicAnswers.reduce((sum, level) => sum + level, 0);
        const maxScore = this.toxicQuestions.length * 3;
        const toxicLevel = Math.round((totalScore / maxScore) * 100);
        
        this.showToxicResult(toxicLevel);
    }
    
    showToxicResult(toxicLevel) {
        const toxicVerdict = document.getElementById('toxicityVerdict');
        const toxicQuestions = document.getElementById('toxicGameQuestions');
        
        toxicQuestions.style.display = 'none';
        toxicVerdict.style.display = 'block';
        
        const toxicType = this.getToxicType(toxicLevel);
        this.lastToxicResult = { toxicLevel, toxicType }; // Store for premium unlock
        
        const premiumContent = (this.hasFullAccess || this.hasTestAccess('toxic')) ? 
            this.getPremiumToxicContent(toxicType, toxicLevel) : 
            this.getBasicToxicContent(toxicType, toxicLevel);
        
        toxicVerdict.innerHTML = premiumContent;
        
        // Auto-unlock for premium users
        if (this.hasFullAccess || this.hasTestAccess('toxic')) {
            setTimeout(() => {
                this.showPremiumToxicAnalysis({ toxicLevel, toxicType });
            }, 1000);
        }
    }
    
    getBasicToxicContent(toxicType, toxicLevel) {
        return `
            <div class="toxic-analysis">
                <div class="toxic-display">
                    <div class="toxic-avatar">${toxicType.emoji}</div>
                    <h2 class="toxic-title">${toxicType.title}</h2>
                    <div class="toxic-percentage">${toxicLevel}%</div>
                </div>
                
                <div class="basic-roast">
                    <p class="roast-quote">"${toxicType.roast}"</p>
                </div>
                
                <div class="premium-unlock-game">
                    <div class="unlock-preview">
                        <h4>🔓 Unlock Premium Roast</h4>
                        <div class="premium-features-game">
                            <div class="feature-item">
                                <span class="feature-icon">🔥</span>
                                <span>Savage Roast Analysis</span>
                            </div>
                            <div class="feature-item">
                                <span class="feature-icon">📊</span>
                                <span>Toxicity Breakdown</span>
                            </div>
                            <div class="feature-item">
                                <span class="feature-icon">💡</span>
                                <span>Improvement Tips</span>
                            </div>
                        </div>
                        <button class="unlock-game-btn" onclick="playgroundApp.handleGameUpgrade('toxic')">
                            🚀 Unlock for ₹99
                        </button>
                    </div>
                </div>
                
                <div class="toxic-actions">
                    <button class="action-btn-3d primary" onclick="playgroundApp.restartGame('toxic')">
                        🔄 Try Again
                    </button>
                    <button class="action-btn-3d secondary" onclick="playgroundApp.shareGameResult('toxic')">
                        📱 Share Result
                    </button>
                </div>
            </div>
        `;
    }
    
    getPremiumToxicContent(toxicType, toxicLevel) {
        return `
            <div class="premium-toxic-analysis">
                <div class="premium-header">
                    <div class="premium-badge">🔥 Premium roast unlocked! You asked for it...</div>
                    <div class="premium-unlock-badge">✨ PREMIUM ROAST UNLOCKED</div>
                </div>
                
                <div class="toxic-display-premium">
                    <div class="toxic-avatar-large">${toxicType.emoji}</div>
                    <h2 class="toxic-title">${toxicType.title}</h2>
                    <div class="toxic-percentage">${toxicLevel}%</div>
                </div>
                
                <div class="savage-roast">
                    <h4>🔥 Your Savage Roast</h4>
                    <div class="roast-quote">"${toxicType.roast}"</div>
                </div>
                
                <div class="toxic-breakdown">
                    <h4>📊 Who You're Toxic To</h4>
                    <div class="toxic-categories">
                        <div class="toxic-category">
                            <div class="category-header">
                                <span class="category-emoji">👥</span>
                                <span class="category-name">Friends</span>
                            </div>
                            <div class="category-score">${Math.max(20, toxicLevel - 20)}%</div>
                            <div class="category-desc">${toxicType.friendToxic}</div>
                        </div>
                        <div class="toxic-category">
                            <div class="category-header">
                                <span class="category-emoji">💼</span>
                                <span class="category-name">Work</span>
                            </div>
                            <div class="category-score">${Math.max(15, toxicLevel - 15)}%</div>
                            <div class="category-desc">${toxicType.workToxic}</div>
                        </div>
                        <div class="toxic-category">
                            <div class="category-header">
                                <span class="category-emoji">🏠</span>
                                <span class="category-name">Family</span>
                            </div>
                            <div class="category-score">${Math.max(10, toxicLevel - 10)}%</div>
                            <div class="category-desc">${toxicType.familyToxic}</div>
                        </div>
                    </div>
                </div>
                
                <div class="savage-tips">
                    <h4>💡 Savage But Helpful Tips</h4>
                    <div class="tips-list">
                        ${toxicType.tips.map(tip => `<div class="tip-item">${tip}</div>`).join('')}
                    </div>
                </div>
                
                <div class="toxic-actions">
                    <button class="action-btn-3d primary" onclick="playgroundApp.restartGame('toxic')">
                        🔄 Try Again
                    </button>
                    <button class="action-btn-3d secondary" onclick="playgroundApp.shareGameResult('toxic')">
                        📱 Share My Roast
                    </button>
                </div>
            </div>
        `;
    }
    
    getToxicType(level) {
        const types = [
            {
                emoji: '😇',
                title: 'The Saint',
                roast: "You're so nice, people check if you're feeling okay when you don't say please.",
                drama: 'Zero Drama'
            },
            {
                emoji: '😊',
                title: 'The Peacekeeper',
                roast: "You avoid conflict so much, you apologize to automatic doors when they don't open fast enough.",
                drama: 'Low Drama'
            },
            {
                emoji: '😐',
                title: 'The Neutral Zone',
                roast: "You're like Switzerland - neutral, but everyone knows you're judging silently.",
                drama: 'Some Drama'
            },
            {
                emoji: '😏',
                title: 'The Passive Aggressor',
                roast: "You're the person who says 'I'm fine' but updates your status to cryptic song lyrics.",
                drama: 'Medium Drama'
            },
            {
                emoji: '😤',
                title: 'The Drama Starter',
                roast: "You don't just spill tea, you throw the entire kettle and blame others for the mess.",
                drama: 'High Drama'
            },
            {
                emoji: '💀',
                title: 'The Chaos Agent',
                roast: "You don't just burn bridges, you nuke them from orbit and salt the earth for good measure.",
                drama: 'Maximum Drama'
            }
        ];
        
        const index = Math.min(Math.floor(level / 17), 5);
        const type = types[index];
        
        const toxicVariants = {
            friendToxic: [
                'You apologize for other people\'s mistakes',
                'You sometimes make everything about yourself', 
                'You collect grudges like Pokemon cards',
                'You remember every slight from 2019',
                'You turn group chats into therapy sessions'
            ],
            workToxic: [
                'You thank people for giving you work',
                'You complain but never offer solutions',
                'You turn team meetings into drama sessions',
                'You CC your boss on passive-aggressive emails',
                'You micromanage everyone\'s coffee breaks'
            ],
            familyToxic: [
                'You still ask permission to eat snacks',
                'You judge their life choices silently',
                'You bring up childhood incidents during arguments',
                'You compare everyone to your ex',
                'You screenshot family group messages to complain'
            ]
        };
        
        return {
            ...type,
            friendToxic: toxicVariants.friendToxic[index],
            workToxic: toxicVariants.workToxic[index],
            familyToxic: toxicVariants.familyToxic[index],
            tips: this.getToxicTips(index)
        };
    }
    
    getToxicTips(level) {
        const tipSets = [
            ['It\'s okay to say no sometimes', 'Your opinion matters too', 'Stop apologizing for existing'],
            ['Practice saying "no" without explaining', 'Set boundaries with kindness', 'You don\'t need to fix everyone'],
            ['Ask "How are you?" and actually listen', 'Compliment without comparing', 'Let someone else have the last word'],
            ['Count to 10 before responding', 'Not everything needs your commentary', 'Try active listening for once'],
            ['Consider therapy... seriously', 'Maybe don\'t screenshot everything', 'Learn the difference between venting and attacking'],
            ['Anger management classes exist', 'Not every hill is worth dying on', 'Your therapist needs a therapist after you']
        ];
        return tipSets[level] || tipSets[0];
    }
    
    setupFutureGame() {
        const assessmentBtn = document.querySelector('.begin-assessment-btn');
        if (assessmentBtn) {
            assessmentBtn.addEventListener('click', () => {
                this.playSound('click');
                this.startFutureQuestions();
            });
        }
    }
    
    startFutureQuestions() {
        this.futureQuestions = [
            {
                scenario: "What's your biggest career goal for 2026?",
                options: [
                    { emoji: "🚀", text: "Start my own business", type: 'entrepreneur' },
                    { emoji: "🏆", text: "Get promoted to leadership", type: 'leader' },
                    { emoji: "🎨", text: "Pursue creative passion", type: 'creative' },
                    { emoji: "💼", text: "Master my current field", type: 'specialist' }
                ]
            },
            {
                scenario: "How do you prefer to work?",
                options: [
                    { emoji: "👥", text: "Leading and inspiring teams", type: 'leader' },
                    { emoji: "📊", text: "Analyzing and optimizing processes", type: 'specialist' },
                    { emoji: "🎨", text: "Creating and innovating freely", type: 'creative' },
                    { emoji: "🚀", text: "Building something from scratch", type: 'entrepreneur' }
                ]
            },
            {
                scenario: "What motivates you most?",
                options: [
                    { emoji: "💰", text: "Financial independence and freedom", type: 'entrepreneur' },
                    { emoji: "🎆", text: "Recognition and career advancement", type: 'leader' },
                    { emoji: "🎨", text: "Self-expression and creativity", type: 'creative' },
                    { emoji: "🎯", text: "Mastery and expertise", type: 'specialist' }
                ]
            },
            {
                scenario: "How do you handle challenges?",
                options: [
                    { emoji: "🔥", text: "Take calculated risks and pivot quickly", type: 'entrepreneur' },
                    { emoji: "🛡️", text: "Rally the team and find solutions together", type: 'leader' },
                    { emoji: "💡", text: "Think outside the box creatively", type: 'creative' },
                    { emoji: "📊", text: "Analyze data and follow proven methods", type: 'specialist' }
                ]
            },
            {
                scenario: "Where do you see yourself in 5 years?",
                options: [
                    { emoji: "🏢", text: "Running my own successful company", type: 'entrepreneur' },
                    { emoji: "👑", text: "Leading a major department or division", type: 'leader' },
                    { emoji: "🎨", text: "Being recognized for my creative work", type: 'creative' },
                    { emoji: "🏆", text: "Being the go-to expert in my field", type: 'specialist' }
                ]
            }
        ];
        
        this.currentFutureQuestion = 0;
        this.futureAnswers = [];
        this.showFutureQuestion();
    }
    
    showFutureQuestion() {
        if (this.currentFutureQuestion >= this.futureQuestions.length) {
            this.calculateFutureResult();
            return;
        }
        
        const question = this.futureQuestions[this.currentFutureQuestion];
        const progress = ((this.currentFutureQuestion + 1) / this.futureQuestions.length) * 100;
        
        const lifeAssessment = document.getElementById('lifeAssessment');
        const futureQuestions = document.getElementById('futureGameQuestions');
        
        lifeAssessment.style.display = 'none';
        futureQuestions.style.display = 'block';
        
        futureQuestions.innerHTML = `
            <div class="future-question-arena">
                <div class="crystal-vision-header">
                    <h3>🔮 Future Vision Portal</h3>
                    <div class="vision-progress">
                        <div class="progress-orb">
                            <div class="orb-glow"></div>
                            <span>${this.currentFutureQuestion + 1}/${this.futureQuestions.length}</span>
                        </div>
                    </div>
                </div>
                
                <div class="prophecy-card-3d">
                    <div class="prophecy-glow"></div>
                    <div class="prophecy-content">
                        <h4>🎯 Life Path Analysis</h4>
                        <p class="prophecy-text">${question.scenario}</p>
                    </div>
                </div>
                
                <div class="destiny-options-3d">
                    ${question.options.map((option, index) => `
                        <div class="destiny-card-3d" onclick="playgroundApp.selectFutureAnswer('${option.type}')">
                            <div class="destiny-glow"></div>
                            <div class="destiny-icon">${option.emoji}</div>
                            <div class="destiny-text">${option.text}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    selectFutureAnswer(type) {
        this.gameState.score += 100;
        this.futureAnswers.push(type);
        this.updateGameUI();
        this.playSound('success');
        
        this.currentFutureQuestion++;
        
        setTimeout(() => {
            this.showFutureQuestion();
        }, 500);
    }
    
    calculateFutureResult() {
        const typeCounts = {};
        this.futureAnswers.forEach(type => {
            typeCounts[type] = (typeCounts[type] || 0) + 1;
        });
        
        const dominantType = Object.keys(typeCounts).reduce((a, b) => 
            typeCounts[a] > typeCounts[b] ? a : b
        );
        
        this.showFutureProphecy(dominantType);
    }
    
    showFutureProphecy(dominantType) {
        const futureProphecy = document.getElementById('futureProphecy');
        const futureQuestions = document.getElementById('futureGameQuestions');
        
        futureQuestions.style.display = 'none';
        futureProphecy.style.display = 'block';
        
        const futureData = this.getFutureData(dominantType);
        this.lastFutureResult = { dominantType, futureData }; // Store for premium unlock
        
        const premiumContent = (this.hasFullAccess || this.hasTestAccess('future')) ? 
            this.getPremiumFutureContent(futureData) : 
            this.getBasicFutureContent(futureData);
        
        futureProphecy.innerHTML = premiumContent;
    }
    
    getBasicFutureContent(futureData) {
        return `
            <div class="future-analysis">
                <div class="future-display">
                    <div class="future-avatar">${futureData.emoji}</div>
                    <h2 class="future-title">${futureData.title}</h2>
                </div>
                
                <div class="basic-forecast">
                    <p>Your 2026 path: ${futureData.careerPath}</p>
                </div>
                
                <div class="premium-unlock-game">
                    <div class="unlock-preview">
                        <h4>🔓 Unlock Premium Prediction</h4>
                        <div class="premium-features-game">
                            <div class="feature-item">
                                <span class="feature-icon">🔮</span>
                                <span>Complete 2026 Forecast</span>
                            </div>
                            <div class="feature-item">
                                <span class="feature-icon">📅</span>
                                <span>Year-by-Year Roadmap</span>
                            </div>
                            <div class="feature-item">
                                <span class="feature-icon">💡</span>
                                <span>90-Day Action Plan</span>
                            </div>
                        </div>
                        <button class="unlock-game-btn" onclick="playgroundApp.handleGameUpgrade('future')">
                            🚀 Unlock for ₹99
                        </button>
                    </div>
                </div>
                
                <div class="future-actions">
                    <button class="action-btn-3d primary" onclick="playgroundApp.restartGame('future')">
                        🔄 New Vision
                    </button>
                    <button class="action-btn-3d secondary" onclick="playgroundApp.shareGameResult('future')">
                        📱 Share Result
                    </button>
                </div>
            </div>
        `;
    }
    
    getPremiumFutureContent(futureData) {
        return `
            <div class="premium-future-analysis">
                <div class="premium-header">
                    <div class="premium-badge">🔮 Premium prediction unlocked! Your future awaits...</div>
                    <div class="premium-unlock-badge">✨ PREMIUM PREDICTION UNLOCKED</div>
                </div>
                
                <div class="future-display-premium">
                    <div class="future-avatar-large">${futureData.emoji}</div>
                    <h2 class="future-title">${futureData.title}</h2>
                </div>
                
                <div class="future-forecast">
                    <h4>🔮 Your Complete 2026 Forecast</h4>
                    <div class="forecast-grid">
                        <div class="forecast-item">
                            <div class="forecast-header">
                                <span class="forecast-emoji">💼</span>
                                <span class="forecast-label">Career Path</span>
                            </div>
                            <div class="forecast-value">${futureData.careerPath}</div>
                        </div>
                        <div class="forecast-item">
                            <div class="forecast-header">
                                <span class="forecast-emoji">🚀</span>
                                <span class="forecast-label">Growth Focus</span>
                            </div>
                            <div class="forecast-value">${futureData.growthFocus}</div>
                        </div>
                        <div class="forecast-item">
                            <div class="forecast-header">
                                <span class="forecast-emoji">🎯</span>
                                <span class="forecast-label">Key Skills to Develop</span>
                            </div>
                            <div class="forecast-value">${futureData.keySkills}</div>
                        </div>
                        <div class="forecast-item">
                            <div class="forecast-header">
                                <span class="forecast-emoji">⚠️</span>
                                <span class="forecast-label">Main Challenge</span>
                            </div>
                            <div class="forecast-value">${futureData.challenge}</div>
                        </div>
                        <div class="forecast-item">
                            <div class="forecast-header">
                                <span class="forecast-emoji">🎆</span>
                                <span class="forecast-label">Market Opportunity</span>
                            </div>
                            <div class="forecast-value">${futureData.opportunity}</div>
                        </div>
                    </div>
                </div>
                
                <div class="year-roadmap">
                    <h4>📅 Year-by-Year Roadmap</h4>
                    <div class="roadmap-timeline">
                        <div class="roadmap-year">
                            <div class="year-number">2026</div>
                            <div class="year-content">
                                <div class="year-phase">Launch Year</div>
                                <div class="year-desc">${futureData.roadmap.year1}</div>
                            </div>
                        </div>
                        <div class="roadmap-year">
                            <div class="year-number">2027</div>
                            <div class="year-content">
                                <div class="year-phase">Growth Phase</div>
                                <div class="year-desc">${futureData.roadmap.year2}</div>
                            </div>
                        </div>
                        <div class="roadmap-year">
                            <div class="year-number">2028</div>
                            <div class="year-content">
                                <div class="year-phase">Achievement</div>
                                <div class="year-desc">${futureData.roadmap.year3}</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="action-plan">
                    <h4>💡 90-Day Action Plan</h4>
                    <div class="action-steps">
                        <div class="action-step">
                            <div class="step-number">1</div>
                            <div class="step-content">
                                <div class="step-period">Next 30 Days</div>
                                <div class="step-action">${futureData.actionPlan.step1}</div>
                            </div>
                        </div>
                        <div class="action-step">
                            <div class="step-number">2</div>
                            <div class="step-content">
                                <div class="step-period">Days 31-60</div>
                                <div class="step-action">${futureData.actionPlan.step2}</div>
                            </div>
                        </div>
                        <div class="action-step">
                            <div class="step-number">3</div>
                            <div class="step-content">
                                <div class="step-period">Days 61-90</div>
                                <div class="step-action">${futureData.actionPlan.step3}</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="future-actions">
                    <button class="action-btn-3d primary" onclick="playgroundApp.restartGame('future')">
                        🔄 New Vision
                    </button>
                    <button class="action-btn-3d secondary" onclick="playgroundApp.shareGameResult('future')">
                        📤 Share My Prophecy
                    </button>
                </div>
            </div>
        `;
    }
    
    showPremiumFutureAnalysis(result) {
        const futureProphecy = document.getElementById('futureProphecy');
        if (futureProphecy) {
            futureProphecy.innerHTML = this.getPremiumFutureContent(result.futureData);
        }
    }
    
    getFutureData(type) {
        const futureTypes = {
            entrepreneur: {
                emoji: '🚀',
                title: 'The Visionary Builder',
                careerPath: 'Serial Entrepreneur & Innovation Leader',
                growthFocus: 'Scale ventures and build sustainable business models',
                keySkills: 'Strategic Planning, Risk Management, Team Building',
                challenge: 'Managing cash flow and avoiding burnout',
                opportunity: 'AI and sustainability markets with high growth potential',
                roadmap: {
                    year1: 'Launch MVP, validate market fit, secure initial funding',
                    year2: 'Scale operations, expand team, enter new markets',
                    year3: 'Achieve profitability, consider acquisition or IPO'
                },
                actionPlan: {
                    step1: 'Validate your business idea with 50 potential customers',
                    step2: 'Build a minimum viable product or service',
                    step3: 'Secure your first paying customers or investors'
                }
            },
            leader: {
                emoji: '👑',
                title: 'The Strategic Commander',
                careerPath: 'Executive Leadership & Organizational Transformation',
                growthFocus: 'Develop strategic thinking and inspire high-performance teams',
                keySkills: 'Executive Presence, Change Management, Strategic Vision',
                challenge: 'Balancing stakeholder expectations with team needs',
                opportunity: 'Leadership roles in digital transformation initiatives',
                roadmap: {
                    year1: 'Secure senior management role, build executive network',
                    year2: 'Lead major organizational change, mentor rising leaders',
                    year3: 'Achieve C-suite position, drive company-wide strategy'
                },
                actionPlan: {
                    step1: 'Identify 3 leadership skills to develop and start training',
                    step2: 'Connect with 5 executives in your target industry',
                    step3: 'Lead a high-visibility project to showcase capabilities'
                }
            },
            creative: {
                emoji: '🎨',
                title: 'The Innovation Artist',
                careerPath: 'Creative Director & Cultural Influencer',
                growthFocus: 'Monetize creativity and build personal brand',
                keySkills: 'Creative Strategy, Brand Building, Digital Marketing',
                challenge: 'Balancing artistic integrity with commercial success',
                opportunity: 'Content creation and digital media explosion',
                roadmap: {
                    year1: 'Build portfolio, establish online presence, find niche',
                    year2: 'Collaborate with brands, expand audience, diversify income',
                    year3: 'Launch creative agency, mentor others, cultural impact'
                },
                actionPlan: {
                    step1: 'Create and publish 10 pieces of your best work',
                    step2: 'Build following on 2 social media platforms',
                    step3: 'Pitch your services to 5 potential clients or collaborators'
                }
            },
            specialist: {
                emoji: '🏆',
                title: 'The Expert Authority',
                careerPath: 'Subject Matter Expert & Industry Consultant',
                growthFocus: 'Become the go-to authority in your specialized field',
                keySkills: 'Deep Expertise, Thought Leadership, Consulting',
                challenge: 'Staying current with rapid industry changes',
                opportunity: 'High-demand expertise in emerging technologies',
                roadmap: {
                    year1: 'Gain advanced certifications, publish thought leadership',
                    year2: 'Speak at conferences, consult for major companies',
                    year3: 'Write industry book, launch training programs'
                },
                actionPlan: {
                    step1: 'Identify the top 3 skills in your field to master',
                    step2: 'Write 5 articles or posts about your expertise',
                    step3: 'Apply your knowledge to solve a real business problem'
                }
            }
        };
        
        return futureTypes[type] || futureTypes.specialist;
    }
    
    setupInternetGame() {
        const scanBtn = document.querySelector('.start-scan-btn');
        if (scanBtn) {
            scanBtn.addEventListener('click', () => {
                this.playSound('click');
                this.startInternetQuestions();
            });
        }
    }
    
    startInternetQuestions() {
        this.internetQuestions = [
            {
                scenario: "How do you typically use WhatsApp?",
                options: [
                    { emoji: "💬", text: "Active chatter - always texting, sharing memes", type: 'social' },
                    { emoji: "👁️", text: "Silent observer - read messages, rarely reply", type: 'lurker' },
                    { emoji: "📅", text: "Business mode - only for important stuff", type: 'professional' },
                    { emoji: "📷", text: "Story sharer - love posting updates and photos", type: 'creator' }
                ]
            },
            {
                scenario: "What's your Instagram behavior?",
                options: [
                    { emoji: "📸", text: "Daily poster - share everything I do", type: 'creator' },
                    { emoji: "👀", text: "Silent scroller - browse but rarely post", type: 'lurker' },
                    { emoji: "💬", text: "Active commenter - engage with everyone", type: 'social' },
                    { emoji: "💼", text: "Brand builder - curated professional content", type: 'professional' }
                ]
            },
            {
                scenario: "How do you handle online arguments?",
                options: [
                    { emoji: "💬", text: "Jump in and defend my views", type: 'social' },
                    { emoji: "🚫", text: "Avoid completely, stay out of drama", type: 'lurker' },
                    { emoji: "📝", text: "Write thoughtful, balanced responses", type: 'professional' },
                    { emoji: "🎭", text: "Make memes or jokes about the situation", type: 'creator' }
                ]
            },
            {
                scenario: "What's your approach to online privacy?",
                options: [
                    { emoji: "🔒", text: "Very private - minimal personal info shared", type: 'lurker' },
                    { emoji: "🌍", text: "Open book - share most aspects of my life", type: 'social' },
                    { emoji: "💼", text: "Strategic sharing - only what helps my goals", type: 'professional' },
                    { emoji: "🎨", text: "Creative expression - share my work and ideas", type: 'creator' }
                ]
            },
            {
                scenario: "How do you discover new content online?",
                options: [
                    { emoji: "👥", text: "Through friends and social recommendations", type: 'social' },
                    { emoji: "🔍", text: "Actively search and research topics", type: 'lurker' },
                    { emoji: "📊", text: "Follow industry leaders and trends", type: 'professional' },
                    { emoji: "🎆", text: "Explore creative platforms and communities", type: 'creator' }
                ]
            }
        ];
        
        this.currentInternetQuestion = 0;
        this.internetAnswers = [];
        this.showInternetQuestion();
    }
    
    showInternetQuestion() {
        if (this.currentInternetQuestion >= this.internetQuestions.length) {
            this.calculateInternetResult();
            return;
        }
        
        const question = this.internetQuestions[this.currentInternetQuestion];
        const progress = ((this.currentInternetQuestion + 1) / this.internetQuestions.length) * 100;
        
        const platformAnalysis = document.getElementById('platformAnalysis');
        const internetQuestions = document.getElementById('internetGameQuestions');
        
        platformAnalysis.style.display = 'none';
        internetQuestions.style.display = 'block';
        
        internetQuestions.innerHTML = `
            <div class="internet-question-arena">
                <div class="dna-scan-header">
                    <h3>📱 Digital DNA Scanning</h3>
                    <div class="scan-progress-3d">
                        <div class="dna-helix-mini">
                            <div class="helix-strand-1"></div>
                            <div class="helix-strand-2"></div>
                        </div>
                        <span class="scan-text">${this.currentInternetQuestion + 1}/${this.internetQuestions.length}</span>
                    </div>
                </div>
                
                <div class="platform-question-3d">
                    <div class="question-glow"></div>
                    <div class="question-content">
                        <h4>🎯 Platform Behavior Analysis</h4>
                        <p class="question-text">${question.scenario}</p>
                    </div>
                </div>
                
                <div class="internet-options-3d">
                    ${question.options.map((option, index) => `
                        <div class="platform-option-3d" onclick="playgroundApp.selectInternetAnswer('${option.type}')">
                            <div class="option-glow"></div>
                            <div class="platform-emoji">${option.emoji}</div>
                            <div class="option-title">${option.text}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    selectInternetAnswer(type) {
        this.gameState.score += 100;
        this.internetAnswers.push(type);
        this.updateGameUI();
        this.playSound('success');
        
        this.currentInternetQuestion++;
        
        setTimeout(() => {
            this.showInternetQuestion();
        }, 500);
    }
    
    calculateInternetResult() {
        const typeCounts = {};
        this.internetAnswers.forEach(type => {
            typeCounts[type] = (typeCounts[type] || 0) + 1;
        });
        
        const dominantType = Object.keys(typeCounts).reduce((a, b) => 
            typeCounts[a] > typeCounts[b] ? a : b
        );
        
        this.showInternetDNA(dominantType, typeCounts);
    }
    
    showInternetDNA(dominantType, typeCounts) {
        const dnaResults = document.getElementById('dnaResults');
        const internetQuestions = document.getElementById('internetGameQuestions');
        
        internetQuestions.style.display = 'none';
        dnaResults.style.display = 'block';
        
        const dnaData = this.getInternetDNAData(dominantType);
        this.lastInternetResult = { dominantType, dnaData, typeCounts }; // Store for premium unlock
        
        const premiumContent = (this.hasFullAccess || this.hasTestAccess('internet')) ? 
            this.getPremiumInternetContent(dnaData, typeCounts) : 
            this.getBasicInternetContent(dnaData);
        
        dnaResults.innerHTML = premiumContent;
    }
    
    getBasicInternetContent(dnaData) {
        return `
            <div class="internet-analysis">
                <div class="dna-display">
                    <div class="dna-avatar">${dnaData.emoji}</div>
                    <h2 class="dna-title">${dnaData.title}</h2>
                </div>
                
                <div class="basic-dna">
                    <p>"${dnaData.description}"</p>
                </div>
                
                <div class="premium-unlock-game">
                    <div class="unlock-preview">
                        <h4>🔓 Unlock Premium DNA</h4>
                        <div class="premium-features-game">
                            <div class="feature-item">
                                <span class="feature-icon">🧬</span>
                                <span>Complete Digital DNA Profile</span>
                            </div>
                            <div class="feature-item">
                                <span class="feature-icon">📱</span>
                                <span>Platform Breakdown</span>
                            </div>
                            <div class="feature-item">
                                <span class="feature-icon">💡</span>
                                <span>Digital Behavior Insights</span>
                            </div>
                        </div>
                        <button class="unlock-game-btn" onclick="playgroundApp.handleGameUpgrade('internet')">
                            🚀 Unlock for ₹99
                        </button>
                    </div>
                </div>
                
                <div class="dna-actions">
                    <button class="action-btn-3d primary" onclick="playgroundApp.restartGame('internet')">
                        🔄 New DNA Scan
                    </button>
                    <button class="action-btn-3d secondary" onclick="playgroundApp.shareGameResult('internet')">
                        📱 Share Result
                    </button>
                </div>
            </div>
        `;
    }
    
    getPremiumInternetContent(dnaData, typeCounts) {
        return `
            <div class="premium-internet-analysis">
                <div class="premium-header">
                    <div class="premium-badge">🧬 Premium digital DNA unlocked! Your internet soul revealed...</div>
                    <div class="premium-unlock-badge">✨ PREMIUM DNA UNLOCKED</div>
                </div>
                
                <div class="dna-display-premium">
                    <div class="dna-avatar-large">${dnaData.emoji}</div>
                    <h2 class="dna-title">${dnaData.title}</h2>
                </div>
                
                <div class="dna-analysis">
                    <h4>🧬 Your Complete Digital DNA Profile</h4>
                    <div class="dna-quote">
                        <p>"${dnaData.description}"</p>
                    </div>
                </div>
                
                <div class="platform-breakdown">
                    <h4>📱 Platform Personality Breakdown</h4>
                    <div class="platform-stats">
                        <div class="platform-stat">
                            <div class="stat-header">
                                <span class="stat-emoji">📱 WhatsApp</span>
                            </div>
                            <div class="stat-score">${dnaData.platforms.whatsapp}%</div>
                            <div class="stat-desc">${dnaData.behaviors.whatsapp}</div>
                        </div>
                        <div class="platform-stat">
                            <div class="stat-header">
                                <span class="stat-emoji">📸 Instagram</span>
                            </div>
                            <div class="stat-score">${dnaData.platforms.instagram}%</div>
                            <div class="stat-desc">${dnaData.behaviors.instagram}</div>
                        </div>
                        <div class="platform-stat">
                            <div class="stat-header">
                                <span class="stat-emoji">💼 LinkedIn</span>
                            </div>
                            <div class="stat-score">${dnaData.platforms.linkedin}%</div>
                            <div class="stat-desc">${dnaData.behaviors.linkedin}</div>
                        </div>
                        <div class="platform-stat">
                            <div class="stat-header">
                                <span class="stat-emoji">🐦 Twitter/X</span>
                            </div>
                            <div class="stat-score">${dnaData.platforms.twitter}%</div>
                            <div class="stat-desc">${dnaData.behaviors.twitter}</div>
                        </div>
                    </div>
                </div>
                
                <div class="digital-insights">
                    <h4>💡 Digital Behavior Insights</h4>
                    <div class="insights-grid" style="text-align: center;">
                        <div class="insight-item">
                            <div class="insight-content">
                                <h5>🎯 Primary Motivation</h5>
                                <p>${dnaData.insights.motivation}</p>
                            </div>
                        </div>
                        <div class="insight-item">
                            <div class="insight-content">
                                <h5>⚠️ Digital Weakness</h5>
                                <p>${dnaData.insights.weakness}</p>
                            </div>
                        </div>
                        <div class="insight-item">
                            <div class="insight-content">
                                <h5>🚀 Growth Opportunity</h5>
                                <p>${dnaData.insights.growth}</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="dna-composition">
                    <h4>🧬 Your Digital DNA Mix</h4>
                    <p class="dna-summary">${dnaData.summary}</p>
                    <div class="dna-bars">
                        ${Object.entries(typeCounts).map(([type, count]) => {
                            const percentage = (count / (this.internetAnswers?.length || 1)) * 100;
                            const typeData = this.getInternetTypeInfo(type);
                            return `
                                <div class="dna-bar">
                                    <div class="dna-label">
                                        <span>${typeData.emoji}</span>
                                        <span>${typeData.name}</span>
                                    </div>
                                    <div class="dna-progress">
                                        <div class="dna-fill" style="width: ${percentage}%"></div>
                                    </div>
                                    <div class="dna-percentage">${Math.round(percentage)}%</div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
                
                <div class="dna-actions">
                    <button class="action-btn-3d primary" onclick="playgroundApp.restartGame('internet')">
                        🔄 New DNA Scan
                    </button>
                    <button class="action-btn-3d secondary" onclick="playgroundApp.shareGameResult('internet')">
                        📤 Share My DNA
                    </button>
                </div>
            </div>
        `;
    }
    
    showPremiumInternetAnalysis(result) {
        const dnaResults = document.getElementById('dnaResults');
        if (dnaResults) {
            dnaResults.innerHTML = this.getPremiumInternetContent(result.dnaData, result.typeCounts);
        }
    }
    
    getInternetDNAData(type) {
        const dnaTypes = {
            social: {
                emoji: '👥',
                title: 'The Digital Socializer',
                category: 'Social Butterfly',
                activity: 'High',
                description: "You're the life of the digital party! Your online presence is all about connection, conversation, and community building.",
                tagline: "If it's not shared, did it really happen?",
                platforms: { whatsapp: 95, instagram: 90, linkedin: 60, twitter: 85 },
                behaviors: {
                    whatsapp: 'Group chat leader, meme sharer',
                    instagram: 'Story addict, comment queen/king',
                    linkedin: 'Networking enthusiast',
                    twitter: 'Conversation starter, trend follower'
                },
                insights: {
                    motivation: 'Building connections and staying in the loop',
                    weakness: 'Sometimes overshares or gets caught in drama',
                    growth: 'Learn to balance online and offline relationships'
                },
                summary: 'You thrive on digital interaction and community!'
            },
            lurker: {
                emoji: '👁️',
                title: 'The Digital Observer',
                category: 'Silent Watcher',
                activity: 'Low',
                description: "You prefer to watch from the sidelines, absorbing information without making much noise. You're the digital equivalent of a wise owl.",
                tagline: "I see everything, say little, judge silently.",
                platforms: { whatsapp: 40, instagram: 30, linkedin: 70, twitter: 50 },
                behaviors: {
                    whatsapp: 'Read receipts off, minimal responses',
                    instagram: 'Story viewer, rare poster',
                    linkedin: 'Industry news consumer',
                    twitter: 'Timeline scroller, bookmark collector'
                },
                insights: {
                    motivation: 'Staying informed without the social pressure',
                    weakness: 'Missing out on networking opportunities',
                    growth: 'Gradually increase meaningful interactions'
                },
                summary: 'You prefer quality over quantity in digital spaces!'
            },
            professional: {
                emoji: '💼',
                title: 'The Digital Strategist',
                category: 'Business Builder',
                activity: 'Medium',
                description: "Every post, every connection, every interaction serves a purpose. You've turned social media into a career advancement tool.",
                tagline: "My personal brand is my professional brand.",
                platforms: { whatsapp: 70, instagram: 65, linkedin: 95, twitter: 80 },
                behaviors: {
                    whatsapp: 'Business contacts, professional groups',
                    instagram: 'Curated content, brand building',
                    linkedin: 'Thought leadership, networking master',
                    twitter: 'Industry insights, professional opinions'
                },
                insights: {
                    motivation: 'Building authority and advancing career goals',
                    weakness: 'Sometimes too formal, missing authentic connections',
                    growth: 'Balance professional goals with genuine relationships'
                },
                summary: 'You use digital platforms strategically for success!'
            },
            creator: {
                emoji: '🎨',
                title: 'The Digital Artist',
                category: 'Content Creator',
                activity: 'High',
                description: "The internet is your canvas, and you're constantly painting it with your creativity. You don't just consume content, you create culture.",
                tagline: "I don't follow trends, I create them.",
                platforms: { whatsapp: 75, instagram: 95, linkedin: 55, twitter: 75 },
                behaviors: {
                    whatsapp: 'Creative group admin, content sharer',
                    instagram: 'Visual storyteller, trend creator',
                    linkedin: 'Creative professional showcase',
                    twitter: 'Viral content creator, meme maker'
                },
                insights: {
                    motivation: 'Self-expression and inspiring others through creativity',
                    weakness: 'Sometimes prioritizes virality over authenticity',
                    growth: 'Focus on meaningful content that reflects your true self'
                },
                summary: 'You turn digital platforms into creative playgrounds!'
            }
        };
        
        return dnaTypes[type] || dnaTypes.social;
    }
    
    getInternetTypeInfo(type) {
        const typeInfo = {
            social: { emoji: '👥', name: 'Digital Socializer' },
            lurker: { emoji: '👁️', name: 'Digital Observer' },
            professional: { emoji: '💼', name: 'Digital Strategist' },
            creator: { emoji: '🎨', name: 'Digital Artist' }
        };
        return typeInfo[type] || typeInfo.social;
    }
    
    // Utility methods
    getUserProgress(testType) {
        const progress = localStorage.getItem(`progress_${testType}`);
        return progress ? parseInt(progress) : 0;
    }
    
    getTestBadges(testType) {
        const badges = [];
        const completions = this.getTestCompletions(testType);
        
        if (completions > 0) badges.push({ emoji: '🎯', type: 'completion' });
        if (completions >= 5) badges.push({ emoji: '🔥', type: 'streak' });
        if (this.hasTestAccess(testType)) badges.push({ emoji: '👑', type: 'premium' });
        
        return badges;
    }
    
    getTestCompletions(testType) {
        return parseInt(localStorage.getItem(`completions_${testType}`) || '0');
    }
    
    getTestRating(testType) {
        const ratings = ['⭐⭐⭐⭐⭐', '⭐⭐⭐⭐', '⭐⭐⭐'];
        return ratings[Math.floor(Math.random() * ratings.length)];
    }
    
    getTotalQuestions(testType) {
        const questionCounts = {
            age: 3,
            redflags: 10,
            character: 5,
            toxic: 5,
            future: 10,
            internet: 6
        };
        return questionCounts[testType] || 5;
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
    
    addAchievement(achievement) {
        const existingAchievements = JSON.parse(localStorage.getItem('achievements') || '[]');
        if (!existingAchievements.find(a => a.id === achievement.id)) {
            existingAchievements.push({
                ...achievement,
                unlockedAt: Date.now()
            });
            localStorage.setItem('achievements', JSON.stringify(existingAchievements));
            this.achievements = existingAchievements;
        }
    }
    
    showAchievementPopup(achievements) {
        achievements.forEach((achievement, index) => {
            setTimeout(() => {
                const popup = document.createElement('div');
                popup.className = 'achievement-popup';
                popup.innerHTML = `
                    <div class="achievement-content">
                        <div class="achievement-icon">${achievement.emoji}</div>
                        <div class="achievement-text">
                            <h4>${achievement.title}</h4>
                            <p>${achievement.description}</p>
                        </div>
                    </div>
                `;
                
                document.body.appendChild(popup);
                
                setTimeout(() => popup.classList.add('show'), 100);
                setTimeout(() => {
                    popup.classList.remove('show');
                    setTimeout(() => popup.remove(), 300);
                }, 3000);
                
                this.playSound('achievement');
            }, index * 1000);
        });
    }
    
    // Control methods
    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        localStorage.setItem('soundEnabled', this.soundEnabled);
        
        const soundBtn = document.querySelector('.control-btn .control-icon');
        if (soundBtn) {
            soundBtn.textContent = this.soundEnabled ? '🔊' : '🔇';
        }
        
        this.playSound('click');
    }
    
    showAchievements() {
        // Implementation for achievements modal
        this.playSound('click');
    }
    
    showLeaderboard() {
        // Implementation for stats/leaderboard modal
        this.playSound('click');
    }
    
    resetProgress() {
        if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
            localStorage.removeItem('achievements');
            localStorage.removeItem('userProgress');
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith('progress_') || key.startsWith('completions_')) {
                    localStorage.removeItem(key);
                }
            });
            location.reload();
        }
    }
    
    pauseGame() {
        // Implementation for pause functionality
        this.playSound('click');
    }
    
    showHint() {
        // Implementation for hint system
        this.playSound('click');
    }
    
    handleGameUpgrade(testType) {
        this.playSound('click');
        
        // Show payment modal or redirect to payment
        const options = {
            key: 'rzp_test_Rt9ofen3nW1XjU', // Test key - replace with live key for production
            amount: testType === 'age' ? 4900 : 9900, // Amount in paise (₹49 = 4900 paise)
            currency: 'INR',
            name: 'FunAI Park',
            description: `Premium ${testType} Analysis`,
            image: '/logo.png',
            handler: function(response) {
                playgroundApp.handlePaymentSuccess(response, testType);
            },
            prefill: {
                name: 'User',
                email: 'user@example.com'
            },
            theme: {
                color: '#6366f1'
            },
            modal: {
                ondismiss: function() {
                    console.log('Payment cancelled');
                }
            }
        };
        
        const rzp = new Razorpay(options);
        rzp.open();
    }
    
    handlePaymentSuccess(response, testType) {
        // Store premium access
        const premiumData = {
            paymentId: response.razorpay_payment_id,
            testType: testType,
            purchaseDate: Date.now(),
            tests: [testType]
        };
        
        // Check if user already has premium access
        const existingData = localStorage.getItem('premiumAccess');
        if (existingData) {
            try {
                const existing = JSON.parse(existingData);
                if (existing.tests && !existing.tests.includes(testType)) {
                    existing.tests.push(testType);
                }
                localStorage.setItem('premiumAccess', JSON.stringify(existing));
            } catch {
                localStorage.setItem('premiumAccess', JSON.stringify(premiumData));
            }
        } else {
            localStorage.setItem('premiumAccess', JSON.stringify(premiumData));
        }
        
        // Update hasFullAccess flag
        this.hasFullAccess = this.checkFullAccess();
        
        // Show success message
        alert(`🎉 Premium ${testType} analysis unlocked! Premium features now available.`);
        
        // Show premium content based on test type
        this.showPremiumContentForTest(testType);
    }
    
    showPremiumContentForTest(testType) {
        // Hide premium unlock sections
        const premiumUnlock = document.querySelector('.premium-unlock-game');
        if (premiumUnlock) premiumUnlock.style.display = 'none';
        
        switch(testType) {
            case 'age':
                if (this.selectedImage && this.lastEstimatedAge) {
                    const filterType = document.querySelector('.filter-game-card.selected')?.dataset.filter || 'casual';
                    this.showPremiumAgeAnalysis(this.lastEstimatedAge, filterType);
                }
                break;
            case 'redflags':
                if (this.lastRedFlagResult) {
                    this.showPremiumRedFlagAnalysis(this.lastRedFlagResult);
                }
                break;
            case 'character':
                if (this.lastCharacterResult) {
                    this.showPremiumCharacterAnalysis(this.lastCharacterResult);
                }
                break;
            case 'toxic':
                if (this.lastToxicResult) {
                    this.showPremiumToxicAnalysis(this.lastToxicResult);
                }
                break;
            case 'future':
                if (this.lastFutureResult) {
                    this.showPremiumFutureAnalysis(this.lastFutureResult);
                }
                break;
            case 'internet':
                if (this.lastInternetResult) {
                    this.showPremiumInternetAnalysis(this.lastInternetResult);
                }
                break;
        }
    }
    
    restartGame(testType) {
        this.playSound('click');
        this.openTest(testType);
    }
    
    shareGameResult(testType) {
        this.playSound('click');
        if (navigator.share) {
            navigator.share({
                title: `My ${testType} Game Result`,
                text: `I just played the ${testType} game at FunAI Park!`,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(`I just played the ${testType} game at FunAI Park: ${window.location.href}`);
            alert('🎮 Result copied to clipboard!');
        }
    }
    
    createParticleSystem() {
        // Create floating particles for visual appeal
        const particleContainer = document.createElement('div');
        particleContainer.className = 'particle-system';
        document.body.appendChild(particleContainer);
        
        setInterval(() => {
            if (document.querySelectorAll('.particle').length < 10) {
                this.createParticle();
            }
        }, 2000);
    }
    
    showPremiumAgeAnalysis(estimatedAge, filterType) {
        const ageResult = document.getElementById('ageGameResult');
        
        // Generate variant based on age and filter combination
        const variant = this.getAgeAnalysisVariant(estimatedAge, filterType);
        
        ageResult.innerHTML = `
            <div class="premium-age-analysis-3d">
                <div class="premium-header">
                    <div class="premium-badge">🎉 Premium analysis unlocked! Enjoy your detailed report.</div>
                    <h3>📊 Complete Beauty & Age Analysis</h3>
                </div>
                
                <div class="age-display-premium">
                    <h2>Your Estimated Age</h2>
                    <div class="age-number-premium">${estimatedAge}</div>
                    <div class="age-unit">years old</div>
                    <div class="age-comment-premium">${variant.ageComment}</div>
                </div>
                
                <div class="premium-analysis-sections">
                    <div class="analysis-section-3d">
                        <h4>🧬 Premium AI Analysis</h4>
                        <div class="genetic-analysis-3d">
                            <div class="genetic-item">
                                <span class="genetic-icon">🧬</span>
                                <div class="genetic-content">
                                    <h5>Genetic Age Score: ${variant.geneticAge} years</h5>
                                    <p>Your biological age is ${Math.abs(variant.geneticAge - estimatedAge)} years ${variant.geneticAge < estimatedAge ? 'younger' : 'older'} than your appearance!</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="analysis-section-3d">
                        <h4>✨ Beauty Enhancement Tips</h4>
                        <div class="beauty-tips-3d">
                            <p>${variant.beautyTips}</p>
                        </div>
                    </div>
                    
                    <div class="analysis-section-3d">
                        <h4>📊 Celebrity Match: ${variant.celebrity1.name} (${variant.celebrity1.percentage}%)</h4>
                        <div class="celebrity-matches-3d">
                            <p>You share similar facial structure. Also matches: ${variant.celebrity2.name} (${variant.celebrity2.percentage}%).</p>
                        </div>
                    </div>
                    
                    <div class="analysis-section-3d">
                        <h4>🎯 Best Photo Angles</h4>
                        <div class="photo-tips-3d">
                            <p>${variant.photoTips}</p>
                        </div>
                    </div>
                </div>
                
                <div class="beauty-breakdown-3d">
                    <h4>✨ Premium Beauty Analysis</h4>
                    <div class="beauty-stats-premium">
                        <div class="beauty-stat-3d">
                            <div class="stat-label">Facial Symmetry</div>
                            <div class="stat-bar-3d">
                                <div class="stat-fill-3d" style="width: ${variant.beautyScores.symmetry}%"></div>
                            </div>
                            <div class="stat-value">${variant.beautyScores.symmetry}%</div>
                        </div>
                        <div class="beauty-stat-3d">
                            <div class="stat-label">Skin Quality</div>
                            <div class="stat-bar-3d">
                                <div class="stat-fill-3d" style="width: ${variant.beautyScores.skinQuality}%"></div>
                            </div>
                            <div class="stat-value">${variant.beautyScores.skinQuality}%</div>
                        </div>
                        <div class="beauty-stat-3d">
                            <div class="stat-label">Eye Appeal</div>
                            <div class="stat-bar-3d">
                                <div class="stat-fill-3d" style="width: ${variant.beautyScores.eyeAppeal}%"></div>
                            </div>
                            <div class="stat-value">${variant.beautyScores.eyeAppeal}%</div>
                        </div>
                        <div class="beauty-stat-3d">
                            <div class="stat-label">Smile Rating</div>
                            <div class="stat-bar-3d">
                                <div class="stat-fill-3d" style="width: ${variant.beautyScores.smileRating}%"></div>
                            </div>
                            <div class="stat-value">${variant.beautyScores.smileRating}%</div>
                        </div>
                    </div>
                </div>
                
                <div class="premium-actions">
                    <button class="action-btn-3d primary" onclick="playgroundApp.restartGame('age')">
                        <div class="btn-glow"></div>
                        📸 New Analysis
                    </button>
                    <button class="action-btn-3d secondary" onclick="playgroundApp.shareGameResult('age')">
                        <div class="btn-glow"></div>
                        📱 Share Premium Report
                    </button>
                </div>
            </div>
        `;
    }
    
    getAgeAnalysisVariant(age, filter) {
        // Use detected gender from face analysis or fallback to random
        const detectedGender = this.lastFaceData?.estimatedGender || (Math.random() > 0.5 ? 'male' : 'female');
        const isMale = detectedGender === 'male';
        
        const variants = [
            // Male variants
            {
                ageComment: "You have that confident, mature charm that's incredibly attractive!",
                geneticAge: age + 1,
                beautyTips: "Maintain good grooming, use moisturizer, stay hydrated. Your masculine features are strong.",
                celebrity1: { name: "Ranveer Singh", percentage: 85 },
                celebrity2: { name: "Vicky Kaushal", percentage: 78 },
                photoTips: "Straight-on angle, natural lighting, confident expression. Outdoor lighting works best.",
                beautyScores: { symmetry: 82, skinQuality: 85, eyeAppeal: 79, smileRating: 91 }
            },
            {
                ageComment: "You have striking features that photograph beautifully!",
                geneticAge: age + 2,
                beautyTips: "Highlight your best features, use good skincare, and maintain that intensity.",
                celebrity1: { name: "Ranbir Kapoor", percentage: 88 },
                celebrity2: { name: "Shahid Kapoor", percentage: 80 },
                photoTips: "Direct angle, dramatic lighting, intense expression. You have great bone structure.",
                beautyScores: { symmetry: 88, skinQuality: 76, eyeAppeal: 90, smileRating: 81 }
            },
            {
                ageComment: "Your smile is your best feature - it lights up your whole face!",
                geneticAge: age - 1,
                beautyTips: "Keep that smile bright, maintain good posture, and your positive energy shows.",
                celebrity1: { name: "Varun Dhawan", percentage: 82 },
                celebrity2: { name: "Tiger Shroff", percentage: 76 },
                photoTips: "Candid shots work best, natural expressions, genuine smile.",
                beautyScores: { symmetry: 81, skinQuality: 83, eyeAppeal: 78, smileRating: 95 }
            },
            {
                ageComment: "You have that fresh, energetic vibe that's perfect for your age!",
                geneticAge: age - 2,
                beautyTips: "Stay active, maintain fitness, use sunscreen daily. Your energy is your best asset.",
                celebrity1: { name: "Kartik Aaryan", percentage: 85 },
                celebrity2: { name: "Sidharth Malhotra", percentage: 78 },
                photoTips: "Action shots, bright lighting, genuine expressions. Movement suits you.",
                beautyScores: { symmetry: 83, skinQuality: 86, eyeAppeal: 81, smileRating: 89 }
            },
            {
                ageComment: "You have classic, handsome features that age gracefully!",
                geneticAge: age,
                beautyTips: "Invest in quality skincare, maintain good posture, and embrace your sophistication.",
                celebrity1: { name: "Hrithik Roshan", percentage: 87 },
                celebrity2: { name: "John Abraham", percentage: 82 },
                photoTips: "Classic poses, soft lighting, timeless styling. Handsome never fades.",
                beautyScores: { symmetry: 89, skinQuality: 84, eyeAppeal: 86, smileRating: 85 }
            },
            // Female variants
            {
                ageComment: "You have a youthful glow that's perfect for Indian beauty standards!",
                geneticAge: age - 2,
                beautyTips: "Use vitamin C serum, drink 3L water daily, sleep 7-8 hours. Focus on prevention and gentle skincare routine.",
                celebrity1: { name: "Alia Bhatt", percentage: 87 },
                celebrity2: { name: "Ananya Panday", percentage: 75 },
                photoTips: "45° left angle, natural lighting, slight smile. Avoid harsh overhead lighting.",
                beautyScores: { symmetry: 87, skinQuality: 80, eyeAppeal: 87, smileRating: 87 }
            },
            {
                ageComment: "Your features have that perfect Bollywood heroine quality!",
                geneticAge: age - 3,
                beautyTips: "Focus on hydration, use face masks twice weekly, maintain good posture. Your bone structure is excellent.",
                celebrity1: { name: "Deepika Padukone", percentage: 89 },
                celebrity2: { name: "Priyanka Chopra", percentage: 78 },
                photoTips: "Right profile, golden hour lighting, subtle makeup. Emphasize your jawline.",
                beautyScores: { symmetry: 91, skinQuality: 77, eyeAppeal: 85, smileRating: 83 }
            },
            {
                ageComment: "You have that timeless beauty that never goes out of style!",
                geneticAge: age,
                beautyTips: "Use peptide creams, facial massage, collagen supplements. Focus on firming and deep nourishment.",
                celebrity1: { name: "Katrina Kaif", percentage: 84 },
                celebrity2: { name: "Kareena Kapoor", percentage: 79 },
                photoTips: "Three-quarter angle, warm lighting, relaxed smile. Avoid direct flash.",
                beautyScores: { symmetry: 85, skinQuality: 88, eyeAppeal: 82, smileRating: 86 }
            },
            {
                ageComment: "Your skin has that natural glow that everyone envies!",
                geneticAge: age - 1,
                beautyTips: "Maintain your routine! Add vitamin E oil, stay hydrated, and get quality sleep.",
                celebrity1: { name: "Shraddha Kapoor", percentage: 86 },
                celebrity2: { name: "Kiara Advani", percentage: 81 },
                photoTips: "Slight upward angle, natural daylight, minimal makeup. Your natural beauty shines.",
                beautyScores: { symmetry: 79, skinQuality: 92, eyeAppeal: 84, smileRating: 88 }
            },
            {
                ageComment: "You have classic, elegant features that age gracefully!",
                geneticAge: age,
                beautyTips: "Invest in quality skincare, maintain good posture, and embrace your sophistication.",
                celebrity1: { name: "Madhuri Dixit", percentage: 87 },
                celebrity2: { name: "Kajol", percentage: 82 },
                photoTips: "Elegant poses, soft lighting, timeless styling. Classic beauty never fades.",
                beautyScores: { symmetry: 89, skinQuality: 84, eyeAppeal: 86, smileRating: 85 }
            }
        ];
        
        // Select variant based on gender, age range and filter
        let variantIndex = 0;
        const genderOffset = isMale ? 0 : 5; // Male variants 0-4, Female variants 5-9
        
        if (age < 25) variantIndex = filter === 'wedding' || filter === 'glamour' ? 0 : filter === 'festive' ? 1 : 3;
        else if (age < 30) variantIndex = filter === 'office' ? 1 : filter === 'party' ? 0 : 2;
        else if (age < 35) variantIndex = filter === 'fitness' ? 3 : filter === 'artistic' ? 2 : 1;
        else variantIndex = 4;
        
        return variants[genderOffset + variantIndex];
    }
    
    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
        particle.textContent = ['✨', '🎮', '🎯', '⭐', '🚀'][Math.floor(Math.random() * 5)];
        
        document.querySelector('.particle-system').appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 5000);
    }
    
    loadUserProgress() {
        // Load user progress and achievements
        const achievements = localStorage.getItem('achievements');
        if (achievements) {
            this.achievements = JSON.parse(achievements);
        }
    }
    
    setupAchievements() {
        // Setup achievement system
        this.achievementDefinitions = {
            firstPlay: { emoji: '🎮', title: 'First Steps', description: 'Played your first game!' },
            speedRunner: { emoji: '⚡', title: 'Speed Runner', description: 'Completed a test in under 2 minutes!' },
            perfectScore: { emoji: '💯', title: 'Perfect Score', description: 'Achieved maximum points!' },
            allTests: { emoji: '🏆', title: 'Test Master', description: 'Completed all 6 tests!' },
            premium: { emoji: '👑', title: 'Premium Player', description: 'Unlocked premium features!' }
        };
    }
}

// Initialize playground app
let playgroundApp;
document.addEventListener('DOMContentLoaded', () => {
    // Load game implementations first
    const gameScript = document.createElement('script');
    gameScript.src = 'js/interactive-games.js';
    gameScript.onload = () => {
        playgroundApp = new PlaygroundApp();
    };
    document.head.appendChild(gameScript);
});

// Global function for opening tests (compatibility)
function openTest(testType) {
    playgroundApp.openTest(testType);
}