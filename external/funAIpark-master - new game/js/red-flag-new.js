// Red Flag Test - Partner Mode & No Color Hints
console.log('New Red Flag Test loaded!');

class RedFlagTest {
    constructor() {
        this.currentQuestion = 0;
        this.answers = [];
        this.redFlags = 0;
        this.greenFlags = 0;
        this.yellowFlags = 0;
        this.testMode = 'self';
        this.partnerName = '';
        this.questions = [];
        this.hasFullAccess = localStorage.getItem('premiumAccess') ? JSON.parse(localStorage.getItem('premiumAccess')).active : false;
        console.log('Red Flag Test - Premium status:', this.hasFullAccess);
    }

    // Show mode selection
    showModeSelection() {
        const html = `
            <div class="test-header redflags-header">
                ${this.hasFullAccess ? '<div class="premium-user-badge">👑 PREMIUM USER</div>' : ''}
                <div class="test-icon">🚩</div>
                <h2>Red Flag Detector</h2>
                <p>Choose your test mode</p>
            </div>
            
            <div class="test-content">
                <div class="mode-selection">
                    <h3>Who are you testing?</h3>
                    <div class="mode-options">
                        <button class="mode-btn" onclick="redFlagTest.selectMode('self')">
                            <div class="mode-icon">🪞</div>
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

    // Select mode
    selectMode(mode) {
        this.testMode = mode;
        
        if (mode === 'partner') {
            this.showPartnerNameInput();
        } else {
            this.setupQuestions();
            this.startTest();
        }
    }

    // Get partner name
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
                    <input type="text" id="partnerNameInput" name="partnerName" placeholder="Enter name..." maxlength="20">
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
        this.setupQuestions();
        this.startTest();
    }

    // Setup questions based on mode
    setupQuestions() {
        if (this.testMode === 'partner') {
            this.questions = [
                {
                    category: "Communication",
                    question: `When ${this.partnerName} is upset, they:`,
                    options: [
                        { 
                            emoji: "💬", 
                            title: "Open Communicator", 
                            text: "Talk about it openly and work through it together", 
                            value: "green" 
                        },
                        { 
                            emoji: "⏰", 
                            title: "Needs Time First", 
                            text: "Eventually open up but need some time first", 
                            value: "yellow" 
                        },
                        { 
                            emoji: "🚪", 
                            title: "Shuts Down", 
                            text: "Shut down, give silent treatment, or get defensive", 
                            value: "red" 
                        }
                    ]
                },
                {
                    category: "Boundaries",
                    question: `When you say no to something, ${this.partnerName}:`,
                    options: [
                        { 
                            emoji: "✅", 
                            title: "Respects Instantly", 
                            text: "Respects your decision without question", 
                            value: "green" 
                        },
                        { 
                            emoji: "❓", 
                            title: "Asks But Accepts", 
                            text: "Asks why but ultimately accepts it", 
                            value: "yellow" 
                        },
                        { 
                            emoji: "😤", 
                            title: "Keeps Pushing", 
                            text: "Keeps pushing, guilt trips, or gets angry", 
                            value: "red" 
                        }
                    ]
                },
                {
                    category: "Social Behavior",
                    question: `${this.partnerName} treats service workers by:`,
                    options: [
                        { 
                            emoji: "😊", 
                            title: "Always Respectful", 
                            text: "Being polite, patient, and respectful always", 
                            value: "green" 
                        },
                        { 
                            emoji: "😐", 
                            title: "Generally Nice", 
                            text: "Being generally nice but sometimes impatient", 
                            value: "yellow" 
                        },
                        { 
                            emoji: "😤", 
                            title: "Rude & Demanding", 
                            text: "Being rude, demanding, or condescending", 
                            value: "red" 
                        }
                    ]
                },
                {
                    category: "Jealousy & Trust",
                    question: `When you interact with other people, ${this.partnerName}:`,
                    options: [
                        { 
                            emoji: "👍", 
                            title: "Trusts Completely", 
                            text: "Trusts you completely and encourages friendships", 
                            value: "green" 
                        },
                        { 
                            emoji: "😔", 
                            title: "Sometimes Insecure", 
                            text: "Sometimes feels insecure but communicates about it", 
                            value: "yellow" 
                        },
                        { 
                            emoji: "😡", 
                            title: "Gets Jealous", 
                            text: "Gets jealous, possessive, or controlling", 
                            value: "red" 
                        }
                    ]
                },
                {
                    category: "Past Relationships",
                    question: `${this.partnerName} talks about their ex by:`,
                    options: [
                        { 
                            emoji: "🤐", 
                            title: "Rarely Mentions", 
                            text: "Rarely mentioning them or speaking neutrally", 
                            value: "green" 
                        },
                        { 
                            emoji: "💬", 
                            title: "Occasionally Brings Up", 
                            text: "Occasionally bringing them up in conversation", 
                            value: "yellow" 
                        },
                        { 
                            emoji: "🙄", 
                            title: "Constantly Compares", 
                            text: "Constantly comparing you or bad-mouthing them", 
                            value: "red" 
                        }
                    ]
                },
                {
                    category: "Financial Behavior",
                    question: `${this.partnerName}'s approach to money is:`,
                    options: [
                        { 
                            emoji: "💰", 
                            title: "Responsible & Fair", 
                            text: "Responsible, fair about splitting costs, plans ahead", 
                            value: "green" 
                        },
                        { 
                            emoji: "💳", 
                            title: "Generally Good", 
                            text: "Generally good but sometimes impulsive with spending", 
                            value: "yellow" 
                        },
                        { 
                            emoji: "😩", 
                            title: "Irresponsible", 
                            text: "Irresponsible, expects you to pay, or very controlling", 
                            value: "red" 
                        }
                    ]
                },
                {
                    category: "Family & Friends",
                    question: `${this.partnerName} treats your friends and family:`,
                    options: [
                        { 
                            emoji: "🤗", 
                            title: "Makes Genuine Effort", 
                            text: "With genuine interest and makes effort to connect", 
                            value: "green" 
                        },
                        { 
                            emoji: "🙂", 
                            title: "Polite But Distant", 
                            text: "Politely but doesn't go out of their way", 
                            value: "yellow" 
                        },
                        { 
                            emoji: "😒", 
                            title: "Disinterested", 
                            text: "With disinterest or tries to isolate you from them", 
                            value: "red" 
                        }
                    ]
                },
                {
                    category: "Conflict Resolution",
                    question: `During arguments, ${this.partnerName}:`,
                    options: [
                        { 
                            emoji: "🤝", 
                            title: "Stays Calm", 
                            text: "Stays calm, listens, and works toward solutions", 
                            value: "green" 
                        },
                        { 
                            emoji: "😤", 
                            title: "Gets Heated", 
                            text: "Gets heated but eventually calms down to resolve", 
                            value: "yellow" 
                        },
                        { 
                            emoji: "😡", 
                            title: "Yells & Attacks", 
                            text: "Yells, name-calls, or brings up past issues", 
                            value: "red" 
                        }
                    ]
                },
                {
                    category: "Social Media",
                    question: `${this.partnerName}'s social media behavior is:`,
                    options: [
                        { 
                            emoji: "📱", 
                            title: "Healthy & Open", 
                            text: "Healthy - includes you, doesn't hide relationship", 
                            value: "green" 
                        },
                        { 
                            emoji: "😐", 
                            title: "Normal Activity", 
                            text: "Normal - active but not obsessive about validation", 
                            value: "yellow" 
                        },
                        { 
                            emoji: "😳", 
                            title: "Secretive", 
                            text: "Secretive, attention-seeking, or hides your relationship", 
                            value: "red" 
                        }
                    ]
                },
                {
                    category: "Future Planning",
                    question: `When discussing future plans, ${this.partnerName}:`,
                    options: [
                        { 
                            emoji: "👫", 
                            title: "Includes You", 
                            text: "Includes you and makes joint decisions together", 
                            value: "green" 
                        },
                        { 
                            emoji: "🤔", 
                            title: "Considers Input", 
                            text: "Considers your input but makes own decisions", 
                            value: "yellow" 
                        },
                        { 
                            emoji: "😶", 
                            title: "Excludes You", 
                            text: "Makes plans without consulting you or avoids the topic", 
                            value: "red" 
                        }
                    ]
                }
            ];
        } else {
            this.questions = [
                {
                    category: "Dating Behavior",
                    question: "When someone shows up 30 minutes late without calling, you:",
                    options: [
                        { emoji: "😊", title: "Understanding", text: "Understand that things happen and don't make a big deal", value: "green" },
                        { emoji: "😔", title: "Annoyed", text: "Feel annoyed but give them a chance to explain", value: "yellow" },
                        { emoji: "😤", title: "Disrespected", text: "Consider it disrespectful and address it directly", value: "red" }
                    ]
                },
                {
                    category: "Friendship Dynamics",
                    question: "A friend only reaches out when they need something. You:",
                    options: [
                        { emoji: "😊", title: "Always Helpful", text: "Are happy to help whenever they need support", value: "green" },
                        { emoji: "😔", title: "Feel Used", text: "Help but notice the pattern and feel used", value: "yellow" },
                        { emoji: "😤", title: "Call Them Out", text: "Call them out for being a one-sided friend", value: "red" }
                    ]
                },
                {
                    category: "Workplace Ethics",
                    question: "A colleague takes credit for your work. You:",
                    options: [
                        { emoji: "😊", title: "Team Success", text: "Let it slide since it's about team success", value: "green" },
                        { emoji: "😔", title: "Address Privately", text: "Feel uncomfortable but address it privately", value: "yellow" },
                        { emoji: "😤", title: "Correct Publicly", text: "Immediately correct them in front of everyone", value: "red" }
                    ]
                },
                {
                    category: "Privacy Boundaries",
                    question: "Someone you're dating wants to check your phone. You:",
                    options: [
                        { emoji: "😊", title: "Nothing to Hide", text: "Don't mind since you have nothing to hide", value: "green" },
                        { emoji: "😔", title: "Understand Insecurity", text: "Feel uncomfortable but understand their insecurity", value: "yellow" },
                        { emoji: "😤", title: "Privacy Violation", text: "See it as a violation of privacy and trust", value: "red" }
                    ]
                },
                {
                    category: "Social Situations",
                    question: "At a party, someone makes an offensive joke. You:",
                    options: [
                        { emoji: "😊", title: "Laugh Along", text: "Laugh along to avoid making things awkward", value: "green" },
                        { emoji: "😔", title: "Stay Quiet", text: "Stay quiet but feel uncomfortable about it", value: "yellow" },
                        { emoji: "😤", title: "Speak Up", text: "Speak up and call out the inappropriate behavior", value: "red" }
                    ]
                },
                {
                    category: "Financial Responsibility",
                    question: "When splitting bills with friends, you:",
                    options: [
                        { emoji: "😊", title: "Pay More", text: "Always offer to pay more to avoid any awkwardness", value: "green" },
                        { emoji: "😔", title: "Split Equally", text: "Split everything equally regardless of what you ordered", value: "yellow" },
                        { emoji: "😤", title: "Pay Exactly", text: "Insist on paying only for exactly what you consumed", value: "red" }
                    ]
                },
                {
                    category: "Emotional Intelligence",
                    question: "When someone is clearly upset but says they're fine, you:",
                    options: [
                        { emoji: "😊", title: "Give Space", text: "Take their word for it and give them space", value: "green" },
                        { emoji: "😔", title: "Gently Ask", text: "Gently ask if they want to talk about it", value: "yellow" },
                        { emoji: "😤", title: "Keep Pushing", text: "Keep pushing until they tell you what's wrong", value: "red" }
                    ]
                },
                {
                    category: "Commitment Style",
                    question: "In relationships, you tend to:",
                    options: [
                        { emoji: "😊", title: "Go With Flow", text: "Go with the flow and see what happens naturally", value: "green" },
                        { emoji: "😔", title: "Stay Flexible", text: "Have some expectations but stay flexible", value: "yellow" },
                        { emoji: "😤", title: "Communicate Clearly", text: "Know exactly what you want and communicate it clearly", value: "red" }
                    ]
                }
            ];
        }
    }

    // Start test
    startTest() {
        this.showQuestion();
    }

    // Show current question
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
            
            <div class="test-content scrollable-content">
                <div class="question-card social-style">
                    <div class="category-badge ${question.category.toLowerCase()}">${question.category}</div>
                    <div class="scenario-setup">
                        <h3 class="scenario-title">💭 Imagine this...</h3>
                        <p class="scenario-text">${question.question}</p>
                    </div>
                    <div class="social-options">
                        ${question.options.map((option, index) => `
                            <div class="social-option" 
                                 onclick="redFlagTest.selectAnswer('${option.value}', ${index})"
                                 data-value="${option.value}">
                                <div class="option-emoji">${option.emoji}</div>
                                <div class="option-content">
                                    <h4 class="option-title">${option.title}</h4>
                                    <p class="option-description">${option.text}</p>
                                </div>
                                <div class="option-indicator">👆</div>
                            </div>
                        `).join('')}
                    </div>
                    <div class="social-prompt">
                        <p>👆 Tap what feels most like ${this.testMode === 'partner' ? this.partnerName : 'you'}</p>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('modalBody').innerHTML = html;
    }

    // Handle answer selection
    selectAnswer(value, optionIndex) {
        // Remove previous selections
        document.querySelectorAll('.social-option').forEach(btn => {
            btn.classList.remove('selected');
        });

        // Mark current selection
        document.querySelectorAll('.social-option')[optionIndex].classList.add('selected');

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

    // Next question or results
    nextQuestion() {
        this.currentQuestion++;
        
        if (this.currentQuestion < this.questions.length) {
            this.showQuestion();
        } else {
            this.showResults();
        }
    }

    // Show results
    showResults() {
        const total = this.questions.length;
        const redPercentage = Math.round((this.redFlags / total) * 100);
        const yellowPercentage = Math.round((this.yellowFlags / total) * 100);
        const greenPercentage = Math.round((this.greenFlags / total) * 100);

        let flagType, description, advice;
        const subject = this.testMode === 'partner' ? this.partnerName : 'You';
        
        if (redPercentage >= 50) {
            flagType = "🚩 Red Flag Alert";
            description = `${subject} ${this.testMode === 'partner' ? 'shows' : 'have'} concerning patterns that need attention.`;
            advice = this.testMode === 'partner' ? "Consider having serious conversations about these behaviors." : "Work on communication and boundary respect.";
        } else if (greenPercentage >= 50) {
            flagType = "✅ Green Flag Champion";
            description = `${subject} ${this.testMode === 'partner' ? 'shows' : 'have'} healthy relationship patterns!`;
            advice = this.testMode === 'partner' ? "This person shows great relationship potential." : "You have strong relationship skills.";
        } else {
            flagType = "⚠️ Mixed Signals";
            description = `${subject} ${this.testMode === 'partner' ? 'shows' : 'have'} a mix of healthy and concerning patterns.`;
            advice = this.testMode === 'partner' ? "Some areas are great, others need work." : "You're balanced but can improve in some areas.";
        }

        const html = `
            <div class="test-header redflags-header">
                ${this.hasFullAccess ? '<div class="premium-user-badge">👑 PREMIUM USER</div>' : ''}
                <div class="test-icon">${flagType.split(' ')[0]}</div>
                <h2>${this.testMode === 'partner' ? this.partnerName + "'s" : "Your"} Results</h2>
                <p>Based on ${total} scenarios</p>
            </div>
            
            <div class="test-content scrollable-content">
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
                    
                    <div class="premium-content" ${this.hasFullAccess ? 'style="display: none;"' : ''}>
                        <h4>🔒 Premium Relationship Analysis</h4>
                        <div class="premium-preview">
                            <div class="premium-feature">
                                <span class="feature-icon">📊</span>
                                <div class="feature-content">
                                    <h5>Detailed Category Breakdown</h5>
                                    <p>Communication: 85% • Trust: 72% • Boundaries: 90% • Financial: 68%</p>
                                </div>
                            </div>
                            <div class="premium-feature unlocked">
                                <span class="feature-icon">🎯</span>
                                <div class="feature-content">
                                    <h5>✅ FREE: Personalized Red Flag Warnings</h5>
                                    <div class="free-sample">
                                        ${redPercentage >= 40 ? 
                                            `<p class="warning-text">⚠️ Watch for controlling behavior around social media and friends. This pattern often escalates over time.</p>` : 
                                            yellowPercentage >= 40 ? 
                                            `<p class="caution-text">💛 Some boundary-testing behaviors detected. Address these early through clear communication.</p>` : 
                                            `<p class="positive-text">✅ Strong respect patterns observed. This person values your autonomy and independence.</p>`
                                        }
                                        <button class="try-free-btn" onclick="showFreeWarnings()">🆓 Get Your Free Analysis</button>
                                    </div>
                                </div>
                            </div>
                            <div class="premium-feature">
                                <span class="feature-icon">💕</span>
                                <div class="feature-content">
                                    <h5>Relationship Compatibility Score</h5>
                                    <p>Based on 50+ psychological factors and attachment styles</p>
                                </div>
                            </div>
                            <div class="premium-feature">
                                <span class="feature-icon">📱</span>
                                <div class="feature-content">
                                    <h5>Shareable Results Card</h5>
                                    <p>Instagram-ready design with your personalized insights</p>
                                </div>
                            </div>
                            <div class="premium-feature">
                                <span class="feature-icon">🔮</span>
                                <div class="feature-content">
                                    <h5>Future Relationship Predictions</h5>
                                    <p>${this.testMode === 'partner' ? 'This relationship has 78% long-term success potential' : 'You are 82% ready for a healthy long-term relationship'}</p>
                                </div>
                            </div>
                            <div class="premium-feature">
                                <span class="feature-icon">💡</span>
                                <div class="feature-content">
                                    <h5>Actionable Improvement Tips</h5>
                                    <p>Specific steps to ${this.testMode === 'partner' ? 'improve your relationship dynamics' : 'enhance your relationship skills'}</p>
                                </div>
                            </div>
                        </div>
                        <div class="value-proposition">
                            <div class="value-item">
                                <span class="value-number">10+</span>
                                <span class="value-label">Categories Analyzed</span>
                            </div>
                            <div class="value-item">
                                <span class="value-number">50+</span>
                                <span class="value-label">Psychological Factors</span>
                            </div>
                            <div class="value-item">
                                <span class="value-number">95%</span>
                                <span class="value-label">Accuracy Rate</span>
                            </div>
                        </div>
                    </div>
                    
                    ${this.hasFullAccess ? '' : '<button class="upgrade-btn" onclick="upgradeRedFlag()">🔓 Unlock Full Analysis - ₹99</button>'}
                    
                    <button class="share-btn" onclick="shareResults('redflag')">
                        📱 Share Result
                    </button>
                </div>
            </div>
        `;

        document.getElementById('modalBody').innerHTML = html;
        
        // Auto-unlock premium content if user has full access
        if (this.hasFullAccess) {
            setTimeout(() => {
                this.showPremiumContent();
            }, 500);
        }
    }
}

// Initialize
let redFlagTest;

// Start function
function startRedFlagTest() {
    redFlagTest = new RedFlagTest();
    redFlagTest.showModeSelection();
}

// Upgrade function with realistic payment simulation
function upgradeRedFlag() {
    // Show payment modal
    const paymentModal = `
        <div class="payment-modal">
            <div class="payment-header">
                <h3>🔓 Unlock Premium Analysis</h3>
                <p>Get detailed insights and personalized recommendations</p>
            </div>
            
            <div class="payment-options">
                <div class="payment-method active" data-method="upi">
                    <span class="payment-icon">📱</span>
                    <span>UPI (Google Pay, PhonePe, Paytm)</span>
                    <span class="payment-price">₹99</span>
                </div>
                <div class="payment-method" data-method="card">
                    <span class="payment-icon">💳</span>
                    <span>Credit/Debit Card</span>
                    <span class="payment-price">₹99</span>
                </div>
                <div class="payment-method" data-method="wallet">
                    <span class="payment-icon">💰</span>
                    <span>Paytm Wallet</span>
                    <span class="payment-price">₹99</span>
                </div>
            </div>
            
            <div class="payment-details">
                <div class="upi-section">
                    <p>📱 Scan QR code or enter UPI ID:</p>
                    <div class="qr-placeholder">📱 QR Code Here</div>
                    <input type="text" name="upiId" placeholder="Enter UPI ID" class="upi-input">
                </div>
            </div>
            
            <div class="payment-buttons">
                <button class="pay-btn" onclick="processPayment()">💳 Pay ₹99</button>
                <button class="cancel-btn" onclick="closePayment()">Cancel</button>
            </div>
            
            <div class="payment-security">
                <p>🔒 Secure payment powered by Razorpay</p>
                <p>✅ 100% safe & encrypted</p>
            </div>
        </div>
    `;
    
    // Replace modal content with payment
    document.getElementById('modalBody').innerHTML = paymentModal;
    
    // Setup payment method selection
    document.querySelectorAll('.payment-method').forEach(method => {
        method.addEventListener('click', () => {
            document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('active'));
            method.classList.add('active');
        });
    });
}

// Process payment simulation
function processPayment() {
    // Show processing
    const processingHtml = `
        <div class="payment-processing">
            <div class="processing-animation">
                <div class="spinner"></div>
                <h3>Processing Payment...</h3>
                <p>Please wait while we process your payment</p>
                <div class="processing-steps">
                    <div class="step active">💳 Verifying payment details</div>
                    <div class="step">🔒 Securing transaction</div>
                    <div class="step">✅ Unlocking premium content</div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('modalBody').innerHTML = processingHtml;
    
    // Simulate processing steps
    setTimeout(() => {
        document.querySelectorAll('.step')[1].classList.add('active');
    }, 1500);
    
    setTimeout(() => {
        document.querySelectorAll('.step')[2].classList.add('active');
    }, 3000);
    
    // Show success and unlock content
    setTimeout(() => {
        showPaymentSuccess();
    }, 4500);
}

// Show payment success and unlock premium content
function showPaymentSuccess() {
    const successHtml = `
        <div class="payment-success">
            <div class="success-animation">
                <div class="success-icon">🎉</div>
                <h3>Payment Successful!</h3>
                <p>Premium analysis unlocked</p>
                <div class="success-details">
                    <p>✅ Transaction ID: TXN${Date.now()}</p>
                    <p>✅ Amount: ₹99</p>
                    <p>✅ Premium features activated</p>
                </div>
                <button class="view-premium-btn" onclick="showPremiumContent()">🔓 View Premium Analysis</button>
            </div>
        </div>
    `;
    
    document.getElementById('modalBody').innerHTML = successHtml;
}

// Show unlocked premium content
function showPremiumContent() {
    // Remove any upgrade prompts first
    document.querySelectorAll('.upgrade-btn').forEach(btn => btn.remove());
    document.querySelectorAll('.result-locked').forEach(el => el.classList.remove('result-locked'));
    
    // Get the test results data
    const testMode = redFlagTest.testMode;
    const partnerName = redFlagTest.partnerName;
    const redFlags = redFlagTest.redFlags;
    const yellowFlags = redFlagTest.yellowFlags;
    const greenFlags = redFlagTest.greenFlags;
    const total = redFlags + yellowFlags + greenFlags;
    
    const subject = testMode === 'partner' ? partnerName : 'You';
    
    const premiumHtml = `
        <div class="test-header redflags-header">
            <div class="test-icon">🔓</div>
            <h2>Premium Analysis Unlocked</h2>
            <p>${subject}'s detailed breakdown</p>
        </div>
        
        <div class="test-content">
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
                            <p class="category-detail">${greenFlags >= 4 ? 'Open communication, active listening, healthy conflict resolution' : redFlags >= 3 ? 'Defensive responses, stonewalling, poor emotional regulation' : 'Mixed patterns - good intentions but needs skill development'}</p>
                        </div>
                        <div class="category-item">
                            <span class="category-name">🚧 Boundaries</span>
                            <div class="category-bar">
                                <div class="bar-fill yellow" style="width: ${Math.random() * 30 + 30}%"></div>
                            </div>
                            <span class="category-score">${Math.floor(Math.random() * 20 + 50)}% Needs Work</span>
                        </div>
                        <div class="category-item">
                            <span class="category-name">💰 Financial & Future Planning</span>
                            <div class="category-bar">
                                <div class="bar-fill ${greenFlags >= 2 ? 'green' : redFlags >= 1 ? 'red' : 'yellow'}" style="width: ${Math.max(30, greenFlags >= 2 ? 75 : redFlags >= 1 ? 35 : 60)}%"></div>
                            </div>
                            <span class="category-score">${greenFlags >= 2 ? '75% Responsible' : redFlags >= 1 ? '35% Concerning' : '60% Average'}</span>
                            <p class="category-detail">${greenFlags >= 2 ? 'Fair with money, plans together, financially responsible' : redFlags >= 1 ? 'Irresponsible spending, expects you to pay, financial control' : 'Generally good but sometimes impulsive or avoidant'}</p>
                        </div>
                    </div>
                </div>
                
                <div class="personalized-insights">
                    <h4>💡 Comprehensive Psychological Analysis</h4>
                    <div class="insight-cards">
                        <div class="insight-card positive">
                            <span class="insight-icon">✅</span>
                            <div class="insight-content">
                                <h5>Core Strengths</h5>
                                <p>🗣️ <strong>Communication Excellence:</strong> ${subject} demonstrate${testMode === 'partner' ? 's' : ''} ${greenFlags >= 6 ? 'exceptional emotional intelligence with active listening, empathetic responses, and healthy conflict resolution creating deep intimacy potential' : greenFlags >= 3 ? 'good communication skills with room for growth in emotional expression and active listening' : 'basic communication that needs significant development in empathy and conflict resolution'}.</p>
                                <p>🛡️ <strong>Boundary Respect:</strong> ${greenFlags >= 5 ? 'Excellent self-awareness and respect for limits indicates emotional maturity and secure attachment style' : greenFlags >= 2 ? 'Generally respects boundaries but may occasionally test limits during stress' : 'Struggles with boundary recognition and may have controlling tendencies'}.</p>
                                <p>🤝 <strong>Social Intelligence:</strong> ${greenFlags >= 4 ? 'Strong relationship patterns and respect for connections shows they enhance rather than isolate social life' : greenFlags >= 2 ? 'Moderate social skills with some jealousy or insecurity around friendships' : 'Poor social boundaries and tendency to isolate partners from support systems'}.</p>
                            </div>
                        </div>
                        <div class="insight-card warning">
                            <span class="insight-icon">⚠️</span>
                            <div class="insight-content">
                                <h5>Critical Risk Factors</h5>
                                <p>🚨 <strong>Communication Breakdown:</strong> ${redFlags >= 4 ? 'Severe communication issues including defensiveness, stonewalling, and emotional manipulation create 85% higher breakup risk' : redFlags >= 2 ? 'Moderate communication gaps with occasional defensive responses increase conflict by 45%' : 'Minor communication issues that can be resolved with practice and awareness'}.</p>
                                <p>🔒 <strong>Control Patterns:</strong> ${redFlags >= 3 ? 'Concerning controlling behaviors including isolation tactics, financial control, or emotional manipulation - these patterns escalate in 73% of cases' : redFlags >= 1 ? 'Some boundary-testing behaviors that need immediate attention before they become patterns' : 'Healthy respect for autonomy and independence'}.</p>
                                <p>⚡ <strong>Emotional Regulation:</strong> ${redFlags >= 4 ? 'Poor emotional management with explosive anger, silent treatment, or emotional volatility increases relationship instability by 90%' : redFlags >= 2 ? 'Moderate emotional challenges that create tension but can improve with effort' : 'Good emotional stability and healthy stress management'}.</p>
                            </div>
                        </div>
                        <div class="insight-card tip">
                            <span class="insight-icon">🎯</span>
                            <div class="insight-content">
                                <h5>Specific Action Steps</h5>
                                <p><strong>Week 1-2:</strong> ${redFlags >= 3 ? (testMode === 'partner' ? 'Document concerning behaviors and have serious conversation about non-negotiable boundaries' : 'Practice saying no firmly and seek support from trusted friends or counselor') : 'Focus on appreciating positive behaviors and gently addressing any yellow flag areas'}.</p>
                                <p><strong>Month 1-3:</strong> ${redFlags >= 3 ? (testMode === 'partner' ? 'Consider couples therapy or individual counseling. Set 90-day evaluation period for genuine change' : 'Work on assertiveness training and develop conflict resolution skills through practice') : 'Build on strengths through regular check-ins and open communication about needs and boundaries'}.</p>
                                <p><strong>Long-term:</strong> ${redFlags >= 3 ? (testMode === 'partner' ? 'If no improvement, prioritize your safety and wellbeing. Develop exit strategy if needed' : 'Continue personal growth work and maintain strong support network') : 'Maintain healthy patterns and continue growing together through shared goals and mutual respect'}.</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="psychological-profile">
                    <h4>🧠 Psychological Profile Analysis</h4>
                    <div class="profile-grid">
                        <div class="profile-item">
                            <span class="profile-label">Attachment Style</span>
                            <span class="profile-value">${greenFlags >= 6 ? 'Secure' : redFlags >= 4 ? 'Anxious' : 'Avoidant'}</span>
                        </div>
                        <div class="profile-item">
                            <span class="profile-label">Conflict Resolution</span>
                            <span class="profile-value">${greenFlags >= 5 ? 'Collaborative' : redFlags >= 3 ? 'Aggressive' : 'Avoidant'}</span>
                        </div>
                        <div class="profile-item">
                            <span class="profile-label">Emotional Intelligence</span>
                            <span class="profile-value">${greenFlags >= 7 ? 'High' : greenFlags >= 4 ? 'Moderate' : 'Low'}</span>
                        </div>
                        <div class="profile-item">
                            <span class="profile-label">Relationship Readiness</span>
                            <span class="profile-value">${85 - (redFlags * 10) >= 65 ? 'Ready' : 85 - (redFlags * 10) >= 45 ? 'Developing' : 'Not Ready'}</span>
                        </div>
                    </div>
                </div>
                
                <div class="relationship-predictors">
                    <h4>🔮 Relationship Success Predictors</h4>
                    <div class="predictor-stats">
                        <div class="predictor-item">
                            <span class="predictor-icon">📈</span>
                            <div class="predictor-content">
                                <h5>Long-term Success Rate</h5>
                                <p>${85 - (redFlags * 10) >= 70 ? '78% - High probability' : 85 - (redFlags * 10) >= 50 ? '45% - Moderate probability' : '18% - Low probability'}</p>
                            </div>
                        </div>
                        <div class="predictor-item">
                            <span class="predictor-icon">💝</span>
                            <div class="predictor-content">
                                <h5>Intimacy Potential</h5>
                                <p>${greenFlags >= 6 ? 'Deep emotional connection likely' : greenFlags >= 3 ? 'Moderate intimacy possible' : 'Surface-level connection probable'}</p>
                            </div>
                        </div>
                        <div class="predictor-item">
                            <span class="predictor-icon">⚖️</span>
                            <div class="predictor-content">
                                <h5>Conflict Outcomes</h5>
                                <p>${greenFlags >= 5 ? 'Conflicts strengthen relationship' : redFlags >= 4 ? 'Conflicts damage relationship' : 'Mixed conflict resolution'}</p>
                            </div>
                        </div>
                        <div class="predictor-item">
                            <span class="predictor-icon">🏠</span>
                            <div class="predictor-content">
                                <h5>Stability Forecast</h5>
                                <p>${greenFlags >= 6 && redFlags <= 2 ? 'Highly stable partnership' : redFlags >= 4 ? 'Unstable with high volatility' : 'Moderately stable with work'}</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="compatibility-score">
                    <h4>💕 ${testMode === 'partner' ? 'Relationship Compatibility Matrix' : 'Relationship Readiness Assessment'}</h4>
                    <div class="compatibility-detailed">
                        <div class="compatibility-meter">
                            <div class="meter-fill" style="width: ${85 - (redFlags * 10)}%"></div>
                            <span class="meter-score">${85 - (redFlags * 10)}%</span>
                        </div>
                        <div class="compatibility-factors">
                            <div class="factor-row">
                                <span class="factor-label">Communication Harmony</span>
                                <div class="factor-bar">
                                    <div class="factor-fill" style="width: ${Math.max(20, 90 - (redFlags * 8))}%"></div>
                                </div>
                                <span class="factor-score">${Math.max(20, 90 - (redFlags * 8))}%</span>
                            </div>
                            <div class="factor-row">
                                <span class="factor-label">Emotional Safety</span>
                                <div class="factor-bar">
                                    <div class="factor-fill" style="width: ${Math.max(15, 85 - (redFlags * 12))}%"></div>
                                </div>
                                <span class="factor-score">${Math.max(15, 85 - (redFlags * 12))}%</span>
                            </div>
                            <div class="factor-row">
                                <span class="factor-label">Trust Foundation</span>
                                <div class="factor-bar">
                                    <div class="factor-fill" style="width: ${Math.max(25, 95 - (redFlags * 15))}%"></div>
                                </div>
                                <span class="factor-score">${Math.max(25, 95 - (redFlags * 15))}%</span>
                            </div>
                            <div class="factor-row">
                                <span class="factor-label">Growth Potential</span>
                                <div class="factor-bar">
                                    <div class="factor-fill" style="width: ${Math.max(30, 80 - (redFlags * 10))}%"></div>
                                </div>
                                <span class="factor-score">${Math.max(30, 80 - (redFlags * 10))}%</span>
                            </div>
                        </div>
                    </div>
                    <p class="compatibility-text">
                        ${testMode === 'partner' 
                            ? `${partnerName} demonstrates ${85 - (redFlags * 10)}% compatibility across key relationship dimensions. ${85 - (redFlags * 10) >= 70 ? 'Strong foundation for long-term success with excellent emotional safety and communication patterns.' : 85 - (redFlags * 10) >= 50 ? 'Moderate compatibility with areas requiring focused improvement and ongoing communication.' : 'Significant compatibility challenges requiring serious evaluation and potential professional guidance.'}` 
                            : `Your relationship readiness score is ${85 - (redFlags * 10)}%. ${85 - (redFlags * 10) >= 70 ? 'You demonstrate strong emotional intelligence and healthy relationship patterns.' : 85 - (redFlags * 10) >= 50 ? 'You have good foundational skills with room for growth in key areas.' : 'Focus on developing core relationship skills before pursuing serious commitments.'}`}
                    </p>
                </div>
                
                <div class="detailed-action-plan">
                    <h4>📋 Personalized Action Plan</h4>
                    <div class="action-timeline">
                        <div class="timeline-item immediate">
                            <span class="timeline-icon">🎯</span>
                            <div class="timeline-content">
                                <h5>Immediate Actions (Next 2 weeks)</h5>
                                <ul>
                                    ${85 - (redFlags * 10) >= 70 ? 
                                        '<li>Continue building on existing strengths through regular appreciation</li><li>Address any yellow flag areas through open, non-judgmental conversations</li>' : 
                                        85 - (redFlags * 10) >= 50 ? 
                                        '<li>Have honest conversations about concerning patterns identified</li><li>Set clear expectations and boundaries around problematic behaviors</li>' : 
                                        '<li>Seriously evaluate whether this relationship aligns with your core values</li><li>Consider taking a relationship break to gain perspective</li>'}
                                </ul>
                            </div>
                        </div>
                        <div class="timeline-item short-term">
                            <span class="timeline-icon">📅</span>
                            <div class="timeline-content">
                                <h5>Short-term Goals (1-3 months)</h5>
                                <ul>
                                    ${85 - (redFlags * 10) >= 70 ? 
                                        '<li>Establish relationship goals and check-ins every month</li><li>Consider couples activities that strengthen identified strong areas</li>' : 
                                        85 - (redFlags * 10) >= 50 ? 
                                        '<li>Consider couples counseling to address communication or trust issues</li><li>Focus on building strengths while addressing red flag areas</li>' : 
                                        '<li>Seek individual therapy to understand your relationship patterns</li><li>Set firm boundaries and consequences for unacceptable behaviors</li>'}
                                </ul>
                            </div>
                        </div>
                        <div class="timeline-item long-term">
                            <span class="timeline-icon">🎯</span>
                            <div class="timeline-content">
                                <h5>Long-term Strategy (6+ months)</h5>
                                <ul>
                                    ${85 - (redFlags * 10) >= 70 ? 
                                        '<li>Maintain healthy communication patterns and continue growth</li><li>Plan for deeper commitment milestones</li>' : 
                                        85 - (redFlags * 10) >= 50 ? 
                                        '<li>Establish 6-month evaluation period to assess genuine change</li><li>Re-evaluate relationship compatibility based on improvements</li>' : 
                                        '<li>Develop exit strategy and support system if needed</li><li>Prioritize your safety and wellbeing above relationship preservation</li>'}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="shareable-card">
                    <h4>📱 Premium Shareable Result Card</h4>
                    <div class="result-card-preview premium-card">
                        <div class="card-header">
                            <h5>${subject}'s Complete Red Flag Analysis</h5>
                            <span class="card-score">${85 - (redFlags * 10)}% Compatibility</span>
                        </div>
                        <div class="card-detailed-stats">
                            <div class="stat-row">
                                <span>🚩 ${redFlags} Red</span>
                                <span>⚠️ ${yellowFlags} Yellow</span>
                                <span>✅ ${greenFlags} Green</span>
                            </div>
                            <div class="stat-row">
                                <span>🧠 ${greenFlags >= 7 ? 'High' : greenFlags >= 4 ? 'Moderate' : 'Low'} EQ</span>
                                <span>💝 ${greenFlags >= 6 ? 'Deep' : 'Surface'} Intimacy</span>
                                <span>📈 ${85 - (redFlags * 10) >= 70 ? '78%' : 85 - (redFlags * 10) >= 50 ? '45%' : '18%'} Success</span>
                            </div>
                        </div>
                        <div class="card-insight">
                            <p>"${85 - (redFlags * 10) >= 70 ? 'Strong relationship foundation with excellent growth potential' : 85 - (redFlags * 10) >= 50 ? 'Mixed signals requiring focused improvement efforts' : 'Significant concerns requiring careful evaluation'}"</p>
                        </div>
                    </div>
                    <button class="share-card-btn" onclick="shareResults('premium')">📤 Share Premium Result Card</button>
                </div>
                
                <div class="premium-value-summary">
                    <h4>✨ Your Premium Analysis Includes</h4>
                    <div class="value-grid">
                        <div class="value-item completed">
                            <span class="value-icon">📊</span>
                            <span class="value-text">10 Category Deep-Dive Analysis</span>
                        </div>
                        <div class="value-item completed">
                            <span class="value-icon">🧠</span>
                            <span class="value-text">Psychological Profile Assessment</span>
                        </div>
                        <div class="value-item completed">
                            <span class="value-icon">🔮</span>
                            <span class="value-text">Relationship Success Predictions</span>
                        </div>
                        <div class="value-item completed">
                            <span class="value-icon">📋</span>
                            <span class="value-text">Personalized Action Plan</span>
                        </div>
                        <div class="value-item completed">
                            <span class="value-icon">💡</span>
                            <span class="value-text">Expert Recommendations</span>
                        </div>
                        <div class="value-item completed">
                            <span class="value-icon">📱</span>
                            <span class="value-text">Premium Shareable Card</span>
                        </div>
                    </div>
                    <p class="value-note">🎉 Worth ₹299+ in relationship counseling insights - Unlocked for just ₹99!</p>
                </div>
                
                <div class="action-buttons">
                    <button class="retake-btn" onclick="redFlagTest.showModeSelection()">🔄 Take Another Test</button>
                    <button class="close-btn" onclick="document.getElementById('testModal').style.display='none'">✨ Done</button>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('modalBody').innerHTML = premiumHtml;
}

// Close payment modal
function closePayment() {
    redFlagTest.showResults();
}

// Share function
function shareResults(testType) {
    if (navigator.share) {
        navigator.share({
            title: 'My Red Flag Test Results',
            text: 'I just took the Red Flag personality test!',
            url: window.location.href
        });
    } else {
        navigator.clipboard.writeText('I just took the Red Flag test: ' + window.location.href);
        alert('Results copied to clipboard! 📋');
    }
}
// Show free red flag warnings sample
function showFreeWarnings() {
    const redFlags = redFlagTest.redFlags;
    const yellowFlags = redFlagTest.yellowFlags;
    const greenFlags = redFlagTest.greenFlags;
    const testMode = redFlagTest.testMode;
    const partnerName = redFlagTest.partnerName;
    const subject = testMode === 'partner' ? partnerName : 'You';
    
    const freeAnalysisHtml = `
        <div class="test-header redflags-header">
            <div class="test-icon">🎯</div>
            <h2>FREE Red Flag Analysis</h2>
            <p>Sample of our premium insights</p>
        </div>
        
        <div class="test-content scrollable-content">
            <div class="free-analysis-card">
                <div class="free-badge">🆓 FREE SAMPLE</div>
                
                <div class="warning-analysis">
                    <h4>🚨 Personalized Red Flag Warnings</h4>
                    ${redFlags >= 4 ? `
                        <div class="warning-item high-risk">
                            <span class="warning-icon">🚩</span>
                            <div class="warning-content">
                                <h5>High Risk Pattern Detected</h5>
                                <p><strong>Controlling Behavior:</strong> ${subject} ${testMode === 'partner' ? 'shows' : 'show'} multiple signs of wanting to control your decisions, social connections, or personal boundaries.</p>
                                <p><strong>Statistical Risk:</strong> 73% of relationships with these patterns experience escalation within 6 months.</p>
                                <p><strong>Immediate Action:</strong> ${testMode === 'partner' ? 'Have a serious conversation about respect and boundaries. Consider couples counseling.' : 'Practice assertiveness and seek support from trusted friends or professionals.'}</p>
                            </div>
                        </div>
                    ` : yellowFlags >= 3 ? `
                        <div class="warning-item medium-risk">
                            <span class="warning-icon">⚠️</span>
                            <div class="warning-content">
                                <h5>Caution Areas Identified</h5>
                                <p><strong>Boundary Testing:</strong> ${subject} occasionally ${testMode === 'partner' ? 'pushes' : 'push'} limits or ${testMode === 'partner' ? 'shows' : 'show'} concerning patterns that need attention.</p>
                                <p><strong>Growth Opportunity:</strong> These behaviors can improve with clear communication and consistent boundaries.</p>
                                <p><strong>Recommended Action:</strong> Address these patterns early through honest conversations and clear expectations.</p>
                            </div>
                        </div>
                    ` : `
                        <div class="warning-item low-risk">
                            <span class="warning-icon">✅</span>
                            <div class="warning-content">
                                <h5>Healthy Patterns Observed</h5>
                                <p><strong>Respect Foundation:</strong> ${subject} ${testMode === 'partner' ? 'demonstrates' : 'demonstrate'} strong respect for boundaries and personal autonomy.</p>
                                <p><strong>Positive Indicator:</strong> These patterns suggest emotional maturity and relationship readiness.</p>
                                <p><strong>Continue Building:</strong> Focus on maintaining these healthy communication and respect patterns.</p>
                            </div>
                        </div>
                    `}
                </div>
                
                <div class="sample-limitation" ${redFlagTest.hasFullAccess ? 'style="display: none;"' : ''}>
                    <h4>🔒 This is just 1 of 6 premium tools</h4>
                    <p>Unlock the complete analysis including:</p>
                    <ul>
                        <li>📊 10-category detailed breakdown</li>
                        <li>🧠 Psychological profile assessment</li>
                        <li>🔮 Relationship success predictions</li>
                        <li>📋 Personalized action plan</li>
                        <li>📱 Premium shareable card</li>
                    </ul>
                </div>
                
                <div class="sample-actions">
                    <button class="upgrade-sample-btn" onclick="upgradeRedFlag()" ${redFlagTest.hasFullAccess ? 'style="display: none;"' : ''}>
                        🔓 Unlock All 6 Tools - ₹99
                    </button>
                    <button class="back-btn" onclick="redFlagTest.showResults()">
                        ← Back to Results
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('modalBody').innerHTML = freeAnalysisHtml;
}