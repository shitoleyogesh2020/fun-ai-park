// Test if Red Flag script is loading
console.log('Red Flag Test script loaded successfully!');

// Red/Green Flag Test - Partner Mode & Neutral Options
class RedFlagTest {
    constructor() {
        this.currentQuestion = 0;
        this.answers = [];
        this.questions = this.shuffleQuestions();
        this.redFlags = 0;
        this.greenFlags = 0;
        this.yellowFlags = 0;
        this.testMode = 'self'; // 'self' or 'partner'
        this.partnerName = '';
    }

    // Show mode selection first
    showModeSelection() {
        const html = `
            <div class="test-header redflags-header">
                <div class="test-icon">🚩</div>
                <h2>Red Flag Detector</h2>
                <p>Choose your test mode</p>
            </div>
            
            <div class="test-content">
                <div class="mode-selection">
                    <h3>Who are you testing?</h3>
                    <div class="mode-options">
                        <button class="mode-btn" onclick="redFlagTest.selectMode('self')">
                            <div class="mode-icon">�mirror</div>
                            <h4>Test Myself</h4>
                            <p>Discover your own red/green flag patterns</p>
                        </button>
                        <button class="mode-btn" onclick="redFlagTest.selectMode('partner')">
                            <div class="mode-icon">💕</div>
                            <h4>Test My Partner</h4>
                            <p>Evaluate someone you're dating or interested in</p>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('modalBody').innerHTML = html;
    }

    // Select test mode
    selectMode(mode) {
        this.testMode = mode;
        
        if (mode === 'partner') {
            this.showPartnerNameInput();
        } else {
            this.startTest();
        }
    }

    // Get partner name for personalized questions
    showPartnerNameInput() {
        const html = `
            <div class="test-header redflags-header">
                <div class="test-icon">💕</div>
                <h2>Partner Red Flag Test</h2>
                <p>Let's analyze their behavior patterns</p>
            </div>
            
            <div class="test-content">
                <div class="partner-input">
                    <h3>What's their name? (or nickname)</h3>
                    <input type="text" id="partnerNameInput" placeholder="Enter name..." maxlength="20">
                    <p class="privacy-note">🔒 This stays private and makes questions more personal</p>
                    <button class="continue-btn" onclick="redFlagTest.setPartnerName()">Continue</button>
                </div>
            </div>
        `;
        
        document.getElementById('modalBody').innerHTML = html;
        document.getElementById('partnerNameInput').focus();
    }

    setPartnerName() {
        const nameInput = document.getElementById('partnerNameInput');
        this.partnerName = nameInput.value.trim() || 'They';
        this.startTest();
    }

    // Dynamic question pool - personalized based on mode
    getQuestionPool() {
        const partnerQuestions = [
            {
                category: "Communication",
                question: `When ${this.partnerName} is upset, they:`,
                options: [
                    { text: "Talk about it openly and work through it together", value: "green" },
                    { text: "Eventually open up but need some time first", value: "yellow" },
                    { text: "Shut down, give silent treatment, or get defensive", value: "red" }
                ]
            },
            {
                category: "Boundaries",
                question: `When you say no to something, ${this.partnerName}:`,
                options: [
                    { text: "Respects your decision without question", value: "green" },
                    { text: "Asks why but ultimately accepts it", value: "yellow" },
                    { text: "Keeps pushing, guilt trips, or gets angry", value: "red" }
                ]
            },
            {
                category: "Social", 
                question: `${this.partnerName} treats service workers (waiters, cashiers) by:`,
                options: [
                    { text: "Being polite, patient, and respectful always", value: "green" },
                    { text: "Being generally nice but sometimes impatient", value: "yellow" },
                    { text: "Being rude, demanding, or condescending", value: "red" }
                ]
            },
            {
                category: "Past Relationships",
                question: `${this.partnerName} talks about their ex by:`,
                options: [
                    { text: "Rarely mentioning them or speaking neutrally", value: "green" },
                    { text: "Occasionally bringing them up in conversation", value: "yellow" },
                    { text: "Constantly comparing you or bad-mouthing them", value: "red" }
                ]
            },
            {
                category: "Friends & Family",
                question: `${this.partnerName} treats your friends and family:`,
                options: [
                    { text: "With genuine interest and makes effort to connect", value: "green" },
                    { text: "Politely but doesn't go out of their way", value: "yellow" },
                    { text: "With disinterest or tries to isolate you from them", value: "red" }
                ]
            },
            {
                category: "Jealousy",
                question: `When you interact with other people, ${this.partnerName}:`,
                options: [
                    { text: "Trusts you completely and encourages friendships", value: "green" },
                    { text: "Sometimes feels insecure but communicates about it", value: "yellow" },
                    { text: "Gets jealous, possessive, or controlling", value: "red" }
                ]
            }
        ];

        const selfQuestions = [
            {
                category: "Dating",
                question: "When someone shows up 30 minutes late without calling, you:",
                options: [
                    { text: "Understand that things happen and don't make a big deal", value: "green" },
                    { text: "Feel annoyed but give them a chance to explain", value: "yellow" },
                    { text: "Consider it disrespectful and address it directly", value: "red" }
                ]
            },
            {
                category: "Friendship", 
                question: "A friend only reaches out when they need something. You:",
                options: [
                    { text: "Are happy to help whenever they need support", value: "green" },
                    { text: "Help but notice the pattern and feel used", value: "yellow" },
                    { text: "Call them out for being a one-sided friend", value: "red" }
                ]
            },
            {
                category: "Workplace",
                question: "A colleague takes credit for your work. You:",
                options: [
                    { text: "Let it slide since it's about team success", value: "green" },
                    { text: "Feel uncomfortable but address it privately", value: "yellow" },
                    { text: "Immediately correct them in front of everyone", value: "red" }
                ]
            }
        ];

        return this.testMode === 'partner' ? partnerQuestions : selfQuestions;
    }

    // Shuffle and select random questions for each user
    shuffleQuestions() {
        const pool = this.getQuestionPool();
        const shuffled = pool.sort(() => Math.random() - 0.5);
        return shuffled.slice(0, 8); // Select 8 random questions
    }

    // Start the test
    startTest() {
        this.showQuestion();
    }

    // Display current question with neutral options (no color hints)
    showQuestion() {
        const question = this.questions[this.currentQuestion];
        const progress = ((this.currentQuestion + 1) / this.questions.length) * 100;
        const testTitle = this.testMode === 'partner' ? `${this.partnerName}'s Red Flag Test` : 'Your Red Flag Test';

        const html = `
            <div class="test-header redflags-header">
                <div class="test-icon">🚩</div>
                <h2>${testTitle}</h2>
                <p>Question ${this.currentQuestion + 1} of ${this.questions.length}</p>
                <div class="test-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                </div>
            </div>
            
            <div class="test-content">
                <div class="question-card">
                    <div class="category-badge ${question.category.toLowerCase()}">${question.category}</div>
                    <h3>${question.question}</h3>
                    <div class="neutral-options">
                        ${question.options.map((option, index) => `
                            <button class="neutral-option" 
                                    onclick="redFlagTest.selectAnswer('${option.value}', ${index})"
                                    data-value="${option.value}">
                                <span class="option-text">${option.text}</span>
                            </button>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        document.getElementById('modalBody').innerHTML = html;
    }

    // Get appropriate flag icon for color
    getFlagIcon(color) {
        const icons = {
            'red': '🚩',
            'yellow': '⚠️', 
            'green': '✅'
        };
        return icons[color] || '🏳️';
    }

    // Handle answer selection
    selectAnswer(value, optionIndex) {
        // Remove previous selections
        document.querySelectorAll('.neutral-option').forEach(btn => {
            btn.classList.remove('selected');
        });

        // Mark current selection
        document.querySelectorAll('.neutral-option')[optionIndex].classList.add('selected');

        // Store answer
        this.answers.push({
            question: this.currentQuestion,
            answer: value,
            category: this.questions[this.currentQuestion].category
        });

        // Count flags
        if (value === 'red') this.redFlags++;
        else if (value === 'yellow') this.yellowFlags++;
        else if (value === 'green') this.greenFlags++;

        // Auto-advance after selection
        setTimeout(() => {
            this.nextQuestion();
        }, 800);
    }

    // Move to next question or show results
    nextQuestion() {
        this.currentQuestion++;
        
        if (this.currentQuestion < this.questions.length) {
            this.showQuestion();
        } else {
            this.showResults();
        }
    }

    // Calculate and display results
    showResults() {
        const total = this.questions.length;
        const redPercentage = Math.round((this.redFlags / total) * 100);
        const yellowPercentage = Math.round((this.yellowFlags / total) * 100);
        const greenPercentage = Math.round((this.greenFlags / total) * 100);

        // Determine personality type
        let flagType, description, advice;
        
        if (redPercentage >= 50) {
            flagType = "🚩 Red Flag Radar";
            description = "You have strong boundaries and don't tolerate disrespect. You spot red flags quickly!";
            advice = "Your standards protect you, but consider if some situations deserve second chances.";
        } else if (greenPercentage >= 50) {
            flagType = "✅ Green Flag Giver";
            description = "You're understanding and give people benefit of doubt. Very forgiving nature!";
            advice = "Your kindness is beautiful, but don't ignore genuine red flags that could hurt you.";
        } else {
            flagType = "⚠️ Yellow Flag Balancer";
            description = "You're balanced and consider context before judging. Thoughtful approach!";
            advice = "You weigh situations well. Trust your instincts when something feels consistently off.";
        }

        const html = `
            <div class="test-header redflags-header">
                <div class="test-icon">${flagType.split(' ')[0]}</div>
                <h2>Your Flag Personality</h2>
                <p>Based on ${total} scenarios</p>
            </div>
            
            <div class="test-content">
                <div class="result-card">
                    <h3>${flagType}</h3>
                    <p class="result-description">${description}</p>
                    
                    <div class="flag-breakdown">
                        <div class="flag-stat red-stat">
                            <span class="flag-icon">🚩</span>
                            <span class="flag-count">${this.redFlags}</span>
                            <span class="flag-percent">${redPercentage}%</span>
                            <span class="flag-label">Red Flags</span>
                        </div>
                        <div class="flag-stat yellow-stat">
                            <span class="flag-icon">⚠️</span>
                            <span class="flag-count">${this.yellowFlags}</span>
                            <span class="flag-percent">${yellowPercentage}%</span>
                            <span class="flag-label">Yellow Flags</span>
                        </div>
                        <div class="flag-stat green-stat">
                            <span class="flag-icon">✅</span>
                            <span class="flag-count">${this.greenFlags}</span>
                            <span class="flag-percent">${greenPercentage}%</span>
                            <span class="flag-label">Green Flags</span>
                        </div>
                    </div>
                    
                    <div class="advice-box">
                        <h4>💡 Insight</h4>
                        <p>${advice}</p>
                    </div>
                    
                    <div class="result-locked premium-content">
                        <h4>🔒 Premium Analysis</h4>
                        <p>• Detailed breakdown by category (Dating, Work, Friends)</p>
                        <p>• Personalized red flag warning signs</p>
                        <p>• Shareable results card for social media</p>
                        <p>• Compatibility insights with different personalities</p>
                    </div>
                    
                    <button class="upgrade-btn" onclick="upgradeRedFlag()">
                        🔓 Unlock Full Analysis - ₹99
                    </button>
                    
                    <button class="share-btn" onclick="shareResults('redflag')">
                        📱 Share Basic Result
                    </button>
                </div>
            </div>
        `;

        document.getElementById('modalBody').innerHTML = html;
    }
}

// Initialize test instance
let redFlagTest;

// Start Red Flag Test with mode selection
function startRedFlagTest() {
    redFlagTest = new RedFlagTest();
    redFlagTest.showModeSelection();
}

// Upgrade function
function upgradeRedFlag() {
    alert('Redirecting to payment... 💳');
    // Add payment integration here
}

// Share function
function shareResults(testType) {
    if (navigator.share) {
        navigator.share({
            title: 'My Red Flag Test Results',
            text: 'I just took the Red Flag personality test! Check out my results.',
            url: window.location.href
        });
    } else {
        // Fallback for browsers without Web Share API
        const text = 'I just took the Red Flag personality test! Check out my results: ' + window.location.href;
        navigator.clipboard.writeText(text);
        alert('Results copied to clipboard! 📋');
    }
}