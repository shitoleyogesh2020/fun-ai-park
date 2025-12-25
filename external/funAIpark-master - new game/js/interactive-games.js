// Complete Interactive Test Implementations for Playground

// Check if class already exists to prevent duplicate declarations
if (typeof window.RedFlagDetectiveGame === 'undefined') {

// Red Flag Detective Game Implementation
class RedFlagDetectiveGame {
    constructor(playgroundApp) {
        this.app = playgroundApp;
        this.currentQuestion = 0;
        this.answers = [];
        this.mode = 'self';
        this.partnerName = '';
        this.scenarios = [];
    }
    
    start(mode) {
        this.mode = mode;
        this.app.playSound('click');
        
        if (mode === 'partner') {
            this.showPartnerInput();
        } else {
            this.partnerName = 'You';
            this.loadScenarios();
            this.startDetectiveWork();
        }
    }
    
    showPartnerInput() {
        const detectiveQuestions = document.getElementById('detectiveQuestions');
        detectiveQuestions.innerHTML = `
            <div class="detective-briefing">
                <h3>🕵️ Case Briefing</h3>
                <div class="briefing-card">
                    <div class="case-file">
                        <h4>📋 CASE FILE #${Math.floor(Math.random() * 9999)}</h4>
                        <p><strong>Objective:</strong> Analyze relationship patterns</p>
                        <p><strong>Method:</strong> Behavioral observation</p>
                        <p><strong>Classification:</strong> Confidential</p>
                    </div>
                    <div class="suspect-input">
                        <label>🎯 Subject Name (Code Name):</label>
                        <input type="text" id="suspectName" placeholder="Enter subject name..." maxlength="20">
                        <div class="input-hint">💡 This helps personalize the investigation</div>
                    </div>
                    <button class="begin-case-btn" onclick="playgroundApp.redFlagGame.setSuspectName()">
                        🔍 Begin Investigation
                    </button>
                </div>
            </div>
        `;
        
        document.querySelector('.detective-mode-selection').style.display = 'none';
        detectiveQuestions.style.display = 'block';
        document.getElementById('suspectName').focus();
    }
    
    setSuspectName() {
        const nameInput = document.getElementById('suspectName');
        this.partnerName = nameInput.value.trim() || 'Subject X';
        this.app.playSound('success');
        this.app.gameState.score += 50;
        this.app.updateGameUI();
        
        this.loadScenarios();
        this.startDetectiveWork();
    }
    
    loadScenarios() {
        const subject = this.mode === 'partner' ? this.partnerName : 'you';
        const subjectVerb = this.mode === 'partner' ? 'they' : 'you';
        
        this.scenarios = [
            {
                category: "Communication Analysis",
                scenario: `🎭 SCENARIO: During a heated discussion, ${subject} ${this.mode === 'partner' ? 'typically' : 'typically'}:`,
                evidence: [
                    { type: "green", emoji: "💬", title: "Active Listener", desc: "Stay calm, listen actively, and work toward solutions", points: 100 },
                    { type: "yellow", emoji: "😤", title: "Gets Heated", desc: "Get emotional but eventually calm down to resolve issues", points: 50 },
                    { type: "red", emoji: "🚪", title: "Shuts Down", desc: "Give silent treatment, storm off, or become defensive", points: -50 }
                ]
            },
            {
                category: "Boundary Respect",
                scenario: `🛡️ SCENARIO: When you say 'no' to something, ${subject} ${this.mode === 'partner' ? 'typically' : 'typically'}:`,
                evidence: [
                    { type: "green", emoji: "✅", title: "Respects Immediately", desc: "Accept your decision without question or pressure", points: 100 },
                    { type: "yellow", emoji: "❓", title: "Asks Questions", desc: "Ask why but ultimately respect your choice", points: 50 },
                    { type: "red", emoji: "😤", title: "Keeps Pushing", desc: "Continue pushing, guilt trip, or get angry", points: -50 }
                ]
            },
            {
                category: "Social Behavior",
                scenario: `👥 SCENARIO: ${subject} treat${this.mode === 'partner' ? '' : ''} service workers and strangers:`,
                evidence: [
                    { type: "green", emoji: "😊", title: "Always Respectful", desc: "Consistently polite, patient, and kind to everyone", points: 100 },
                    { type: "yellow", emoji: "😐", title: "Generally Nice", desc: "Usually polite but sometimes impatient or dismissive", points: 50 },
                    { type: "red", emoji: "😤", title: "Rude & Demanding", desc: "Often rude, condescending, or treats people poorly", points: -50 }
                ]
            },
            {
                category: "Trust & Jealousy",
                scenario: `💚 SCENARIO: When you interact with other people, ${subject} ${this.mode === 'partner' ? 'typically' : 'typically'}:`,
                evidence: [
                    { type: "green", emoji: "👍", title: "Trusts Completely", desc: "Show complete trust and encourage your friendships", points: 100 },
                    { type: "yellow", emoji: "😔", title: "Sometimes Insecure", desc: "Feel insecure occasionally but communicate about it", points: 50 },
                    { type: "red", emoji: "😡", title: "Gets Jealous", desc: "Show jealousy, possessiveness, or controlling behavior", points: -50 }
                ]
            },
            {
                category: "Financial Behavior",
                scenario: `💰 SCENARIO: ${subject}'s approach to money and shared expenses:`,
                evidence: [
                    { type: "green", emoji: "💎", title: "Fair & Responsible", desc: "Handle money responsibly and fairly split costs", points: 100 },
                    { type: "yellow", emoji: "💳", title: "Generally Good", desc: "Usually responsible but sometimes impulsive", points: 50 },
                    { type: "red", emoji: "😩", title: "Problematic", desc: "Irresponsible with money or expect others to pay", points: -50 }
                ]
            },
            {
                category: "Family Relations",
                scenario: `👨‍👩‍👧‍👦 SCENARIO: ${subject} interact${this.mode === 'partner' ? '' : ''} with your friends and family:`,
                evidence: [
                    { type: "green", emoji: "🤗", title: "Makes Effort", desc: "Genuinely try to connect and build relationships", points: 100 },
                    { type: "yellow", emoji: "🙂", title: "Polite Distance", desc: "Be polite but don't go out of their way", points: 50 },
                    { type: "red", emoji: "😒", title: "Shows Disinterest", desc: "Act disinterested or try to isolate you", points: -50 }
                ]
            },
            {
                category: "Past Relationships",
                scenario: `💔 SCENARIO: ${subject} talk${this.mode === 'partner' ? '' : ''} about past relationships:`,
                evidence: [
                    { type: "green", emoji: "🤐", title: "Rarely Mentions", desc: "Rarely bring up exes or speak neutrally when asked", points: 100 },
                    { type: "yellow", emoji: "💬", title: "Occasional Reference", desc: "Sometimes mention past relationships in context", points: 50 },
                    { type: "red", emoji: "🙄", title: "Constantly Compares", desc: "Frequently compare you to exes or bad-mouth them", points: -50 }
                ]
            },
            {
                category: "Digital Behavior",
                scenario: `📱 SCENARIO: ${subject}'s social media and phone behavior:`,
                evidence: [
                    { type: "green", emoji: "📱", title: "Healthy & Open", desc: "Use social media healthily and include you openly", points: 100 },
                    { type: "yellow", emoji: "😐", title: "Normal Usage", desc: "Use normally but sometimes seek too much validation", points: 50 },
                    { type: "red", emoji: "😳", title: "Secretive", desc: "Be secretive, attention-seeking, or hide relationships", points: -50 }
                ]
            }
        ];
    }
    
    startDetectiveWork() {
        this.currentQuestion = 0;
        this.answers = [];
        this.showScenario();
    }
    
    showScenario() {
        if (this.currentQuestion >= this.scenarios.length) {
            this.generateReport();
            return;
        }
        
        const scenario = this.scenarios[this.currentQuestion];
        const progress = ((this.currentQuestion + 1) / this.scenarios.length) * 100;
        
        const detectiveQuestions = document.getElementById('detectiveQuestions');
        detectiveQuestions.innerHTML = `
            <div class="detective-scenario">
                <div class="case-progress">
                    <div class="progress-header">
                        <span class="case-number">Case Evidence ${this.currentQuestion + 1}/${this.scenarios.length}</span>
                        <span class="category-badge">${scenario.category}</span>
                    </div>
                    <div class="progress-bar-detective">
                        <div class="progress-fill-detective" style="width: ${progress}%"></div>
                    </div>
                </div>
                
                <div class="scenario-card">
                    <div class="scenario-header">
                        <h3>🔍 Evidence Analysis</h3>
                        <div class="magnifying-glass">🔍</div>
                    </div>
                    <div class="scenario-description">
                        <p>${scenario.scenario}</p>
                    </div>
                    
                    <div class="evidence-options">
                        <h4>📋 Select the most accurate evidence:</h4>
                        <div class="evidence-grid">
                            ${scenario.evidence.map((evidence, index) => `
                                <div class="evidence-card ${evidence.type}" onclick="playgroundApp.redFlagGame.selectEvidence(${index})">
                                    <div class="evidence-header">
                                        <span class="evidence-emoji">${evidence.emoji}</span>
                                        <span class="evidence-type ${evidence.type}">${evidence.type.toUpperCase()}</span>
                                    </div>
                                    <h5>${evidence.title}</h5>
                                    <p>${evidence.desc}</p>
                                    <div class="points-indicator">
                                        ${evidence.points > 0 ? '+' : ''}${evidence.points} pts
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.querySelector('.detective-mode-selection').style.display = 'none';
        detectiveQuestions.style.display = 'block';
    }
    
    selectEvidence(evidenceIndex) {
        const scenario = this.scenarios[this.currentQuestion];
        const selectedEvidence = scenario.evidence[evidenceIndex];
        
        // Visual feedback
        document.querySelectorAll('.evidence-card').forEach(card => card.classList.remove('selected'));
        document.querySelectorAll('.evidence-card')[evidenceIndex].classList.add('selected');
        
        // Play sound and update score
        this.app.playSound(selectedEvidence.type === 'green' ? 'success' : selectedEvidence.type === 'red' ? 'click' : 'hover');
        this.app.gameState.score += Math.max(0, selectedEvidence.points);
        this.app.updateGameUI();
        
        // Store answer
        this.answers.push({
            category: scenario.category,
            evidence: selectedEvidence,
            points: selectedEvidence.points
        });
        
        // Show feedback
        this.showEvidenceFeedback(selectedEvidence);
        
        // Auto advance
        setTimeout(() => {
            this.currentQuestion++;
            this.showScenario();
        }, 2000);
    }
    
    showEvidenceFeedback(evidence) {
        const feedback = document.createElement('div');
        feedback.className = `evidence-feedback ${evidence.type}`;
        feedback.innerHTML = `
            <div class="feedback-content">
                <span class="feedback-emoji">${evidence.emoji}</span>
                <span class="feedback-text">
                    ${evidence.type === 'green' ? '✅ Positive Pattern!' : 
                      evidence.type === 'yellow' ? '⚠️ Caution Area' : 
                      '🚩 Red Flag Detected!'}
                </span>
                <span class="feedback-points">${evidence.points > 0 ? '+' : ''}${evidence.points} points</span>
            </div>
        `;
        
        document.querySelector('.scenario-card').appendChild(feedback);
        
        setTimeout(() => {
            feedback.classList.add('show');
        }, 100);
    }
    
    generateReport() {
        const totalPoints = this.answers.reduce((sum, answer) => sum + answer.points, 0);
        const maxPoints = this.scenarios.length * 100;
        const percentage = Math.max(0, Math.round(((totalPoints + maxPoints) / (maxPoints * 2)) * 100));
        
        const redFlags = this.answers.filter(a => a.evidence.type === 'red').length;
        const yellowFlags = this.answers.filter(a => a.evidence.type === 'yellow').length;
        const greenFlags = this.answers.filter(a => a.evidence.type === 'green').length;
        
        // Determine case conclusion
        let caseStatus, conclusion, recommendation;
        if (percentage >= 75) {
            caseStatus = "✅ CASE CLOSED - LOW RISK";
            conclusion = `${this.partnerName} demonstrates healthy relationship patterns with strong emotional intelligence.`;
            recommendation = "Proceed with confidence. This person shows excellent relationship potential.";
        } else if (percentage >= 50) {
            caseStatus = "⚠️ CASE REVIEW - MODERATE RISK";
            conclusion = `${this.partnerName} shows mixed patterns requiring attention and communication.`;
            recommendation = "Proceed with caution. Address concerning areas through open dialogue.";
        } else {
            caseStatus = "🚨 CASE ALERT - HIGH RISK";
            conclusion = `${this.partnerName} displays concerning patterns that need serious evaluation.`;
            recommendation = "Exercise extreme caution. Consider professional guidance or relationship evaluation.";
        }
        
        // Check for achievements
        this.checkDetectiveAchievements(redFlags, yellowFlags, greenFlags, percentage);
        
        const caseSolved = document.getElementById('caseSolved');
        caseSolved.innerHTML = `
            <div class="case-report">
                <div class="report-header">
                    <h3>📋 DETECTIVE REPORT</h3>
                    <div class="case-status ${percentage >= 75 ? 'safe' : percentage >= 50 ? 'caution' : 'danger'}">
                        ${caseStatus}
                    </div>
                </div>
                
                <div class="investigation-summary">
                    <div class="subject-profile">
                        <h4>👤 Subject Profile: ${this.partnerName}</h4>
                        <div class="compatibility-meter">
                            <div class="meter-label">Relationship Safety Score</div>
                            <div class="meter-bar">
                                <div class="meter-fill ${percentage >= 75 ? 'safe' : percentage >= 50 ? 'caution' : 'danger'}" 
                                     style="width: ${percentage}%"></div>
                            </div>
                            <div class="meter-percentage">${percentage}%</div>
                        </div>
                    </div>
                    
                    <div class="evidence-breakdown">
                        <h4>📊 Evidence Summary</h4>
                        <div class="flag-stats">
                            <div class="flag-stat green">
                                <span class="flag-icon">✅</span>
                                <span class="flag-count">${greenFlags}</span>
                                <span class="flag-label">Green Flags</span>
                            </div>
                            <div class="flag-stat yellow">
                                <span class="flag-icon">⚠️</span>
                                <span class="flag-count">${yellowFlags}</span>
                                <span class="flag-label">Yellow Flags</span>
                            </div>
                            <div class="flag-stat red">
                                <span class="flag-icon">🚩</span>
                                <span class="flag-count">${redFlags}</span>
                                <span class="flag-label">Red Flags</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="case-conclusion">
                    <h4>🎯 Detective Conclusion</h4>
                    <p class="conclusion-text">${conclusion}</p>
                    <div class="recommendation">
                        <h5>💡 Recommendation</h5>
                        <p>${recommendation}</p>
                    </div>
                </div>
                
                <div class="detailed-analysis" ${(this.app.hasFullAccess || this.app.hasTestAccess('redflags')) ? '' : 'style="display: none;"'}>
                    <h4>🔍 Detailed Analysis</h4>
                    <div class="category-breakdown">
                        ${this.answers.map(answer => `
                            <div class="category-result">
                                <div class="category-header">
                                    <span class="category-name">${answer.category}</span>
                                    <span class="category-flag ${answer.evidence.type}">${answer.evidence.type.toUpperCase()}</span>
                                </div>
                                <div class="category-evidence">
                                    <strong>${answer.evidence.title}:</strong> ${answer.evidence.desc}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="premium-unlock" ${(this.app.hasFullAccess || this.app.hasTestAccess('redflags')) ? 'style="display: none;"' : ''}>
                    <div class="unlock-preview">
                        <h4>🔓 Unlock Complete Detective Analysis</h4>
                        <div class="premium-features">
                            <div class="feature">📊 10+ Category breakdown (Communication, Trust, Boundaries, etc.)</div>
                            <div class="feature">🧠 Psychological profile & attachment style analysis</div>
                            <div class="feature">🔮 Relationship success predictions & compatibility score</div>
                            <div class="feature">💡 Personalized action plan with timeline</div>
                            <div class="feature">📱 Premium shareable detective report card</div>
                            <div class="feature">⚠️ Detailed red flag warnings & improvement tips</div>
                        </div>
                        <button class="unlock-btn" onclick="playgroundApp.handleGameUpgrade('redflags')">
                            🔓 Unlock Full Analysis - ₹99
                        </button>
                    </div>
                </div>
                
                <div class="case-actions">
                    <button class="new-case-btn" onclick="playgroundApp.restartGame('redflags')">
                        🔄 New Case
                    </button>
                    <button class="share-report-btn" onclick="playgroundApp.shareGameResult('redflags')">
                        📱 Share Report
                    </button>
                </div>
            </div>
        `;
        
        document.getElementById('detectiveQuestions').style.display = 'none';
        caseSolved.style.display = 'block';
        
        this.app.playSound('achievement');
        
        // Auto-unlock for premium users
        if (this.app.hasFullAccess || this.app.hasTestAccess('redflags')) {
            setTimeout(() => {
                this.showPremiumReport();
            }, 1000);
        }
    }
    
    checkDetectiveAchievements(redFlags, yellowFlags, greenFlags, percentage) {
        const achievements = [];
        
        if (greenFlags >= 6) {
            achievements.push({
                id: 'green_detective',
                emoji: '✅',
                title: 'Green Flag Detective',
                description: 'Found mostly positive patterns!'
            });
        }
        
        if (redFlags >= 5) {
            achievements.push({
                id: 'red_alert',
                emoji: '🚨',
                title: 'Red Alert Detective',
                description: 'Identified high-risk patterns!'
            });
        }
        
        if (percentage === 100) {
            achievements.push({
                id: 'perfect_case',
                emoji: '🏆',
                title: 'Perfect Case',
                description: 'Solved with 100% positive evidence!'
            });
        }
        
        achievements.forEach(achievement => {
            this.app.addAchievement(achievement);
        });
        
        if (achievements.length > 0) {
            this.app.showAchievementPopup(achievements);
        }
    }
    
    showPremiumReport() {
        const redFlags = this.answers.filter(a => a.evidence.type === 'red').length;
        const yellowFlags = this.answers.filter(a => a.evidence.type === 'yellow').length;
        const greenFlags = this.answers.filter(a => a.evidence.type === 'green').length;
        const compatibilityScore = Math.max(20, 85 - (redFlags * 10));
        const subject = this.testMode === 'partner' ? this.partnerName : 'You';
        
        const caseSolved = document.getElementById('caseSolved');
        caseSolved.innerHTML = `
            <div class="premium-relationship-analysis">
                <div class="premium-header">
                    <div class="premium-badge">🎉 Premium relationship analysis unlocked!</div>
                    <div class="premium-unlock-badge">✨ PREMIUM UNLOCKED</div>
                </div>
                
                <div class="category-analysis-3d">
                    <h4>📊 Category-Specific Analysis</h4>
                    <div class="category-grid">
                        <div class="category-item-3d">
                            <div class="category-header">
                                <span class="category-emoji">💕</span>
                                <span class="category-name">Communication & Emotional Intelligence</span>
                            </div>
                            <div class="category-score-bar">
                                <div class="score-fill" style="width: 85%"></div>
                            </div>
                            <div class="category-result">85% Excellent</div>
                        </div>
                        
                        <div class="category-item-3d">
                            <div class="category-header">
                                <span class="category-emoji">🛡️</span>
                                <span class="category-name">Boundaries & Respect</span>
                            </div>
                            <div class="category-score-bar">
                                <div class="score-fill" style="width: 90%"></div>
                            </div>
                            <div class="category-result">90% Strong</div>
                        </div>
                        
                        <div class="category-item-3d">
                            <div class="category-header">
                                <span class="category-emoji">💰</span>
                                <span class="category-name">Financial & Future Planning</span>
                            </div>
                            <div class="category-score-bar">
                                <div class="score-fill" style="width: 75%"></div>
                            </div>
                            <div class="category-result">75% Responsible</div>
                        </div>
                    </div>
                </div>
                
                <div class="psychological-profile-3d">
                    <h4>🧠 Psychological Profile</h4>
                    <div class="profile-grid-3d">
                        <div class="profile-card">
                            <div class="profile-label">Attachment Style</div>
                            <div class="profile-value">Secure</div>
                        </div>
                        <div class="profile-card">
                            <div class="profile-label">Conflict Resolution</div>
                            <div class="profile-value">Collaborative</div>
                        </div>
                        <div class="profile-card">
                            <div class="profile-label">Emotional Intelligence</div>
                            <div class="profile-value">High</div>
                        </div>
                        <div class="profile-card">
                            <div class="profile-label">Relationship Readiness</div>
                            <div class="profile-value">Ready</div>
                        </div>
                    </div>
                </div>
                
                <div class="success-predictors-3d">
                    <h4>💕 Relationship Success Predictors</h4>
                    <div class="predictor-display">
                        <div class="success-meter">
                            <div class="meter-circle">
                                <div class="meter-fill" style="--percentage: ${compatibilityScore}"></div>
                                <div class="meter-text">
                                    <span class="percentage">${compatibilityScore}%</span>
                                    <span class="label">Success Rate</span>
                                </div>
                            </div>
                        </div>
                        <div class="predictor-details">
                            <div class="detail-item">
                                <span class="detail-icon">📈</span>
                                <div class="detail-content">
                                    <div class="detail-title">Long-term Success Rate</div>
                                    <div class="detail-value">78% - High probability</div>
                                </div>
                            </div>
                            <div class="detail-item">
                                <span class="detail-icon">💝</span>
                                <div class="detail-content">
                                    <div class="detail-title">Intimacy Potential</div>
                                    <div class="detail-value">Deep emotional connection likely</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="action-plan-3d">
                    <h4>📝 Personalized Action Plan</h4>
                    <div class="plan-sections">
                        <div class="plan-section">
                            <div class="plan-header">
                                <span class="plan-icon">🎯</span>
                                <span class="plan-title">Immediate Actions (Next 2 weeks)</span>
                            </div>
                            <div class="plan-content">
                                <div class="plan-item">Continue building on positive patterns</div>
                                <div class="plan-item">Maintain open communication</div>
                            </div>
                        </div>
                        <div class="plan-section">
                            <div class="plan-header">
                                <span class="plan-icon">📅</span>
                                <span class="plan-title">Long-term Strategy (3-6 months)</span>
                            </div>
                            <div class="plan-content">
                                <div class="plan-item">Plan for deeper commitment milestones</div>
                                <div class="plan-item">Focus on maintaining healthy patterns</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="premium-actions">
                    <button class="action-btn-3d primary" onclick="playgroundApp.restartGame('redflags')">
                        <div class="btn-glow"></div>
                        🔄 New Case
                    </button>
                    <button class="action-btn-3d secondary" onclick="playgroundApp.shareGameResult('redflags')">
                        <div class="btn-glow"></div>
                        📱 Share Premium Report
                    </button>
                </div>
            </div>
        `;
    }
}

// Character Quest Game Implementation
class CharacterQuestGame {
    constructor(playgroundApp) {
        this.app = playgroundApp;
        this.currentQuestion = 0;
        this.answers = [];
        this.characterTypes = {
            hero: { emoji: '🦸♂️', title: 'The Bollywood Hero', archetype: 'Leader' },
            romantic: { emoji: '💕', title: 'The Romantic Lead', archetype: 'Lover' },
            comic: { emoji: '📱', title: 'The Social Media Star', archetype: 'Jester' },
            villain: { emoji: '😴', title: 'The Chill Homebody', archetype: 'Sage' },
            social: { emoji: '🎉', title: 'The Social Butterfly', archetype: 'Explorer' },
            creative: { emoji: '🎨', title: 'The Creative Soul', archetype: 'Creator' }
        };
        this.quests = [];
    }
    
    start() {
        this.app.playSound('levelUp');
        this.loadQuests();
        this.showQuestIntro();
    }
    
    showQuestIntro() {
        const characterQuest = document.getElementById('characterQuest');
        characterQuest.innerHTML = `
            <div class="quest-intro">
                <div class="quest-scroll">
                    <h3>📜 The Character Quest Begins</h3>
                    <div class="quest-lore">
                        <p>In the mystical realm of Bollywood, six legendary archetypes await discovery. 
                        Each represents a unique path of personality and destiny.</p>
                        <p>Answer the ancient questions truthfully, and your true character shall be revealed!</p>
                    </div>
                    <div class="character-silhouettes">
                        ${Object.entries(this.characterTypes).map(([key, char]) => `
                            <div class="silhouette-card">
                                <div class="silhouette">${char.emoji}</div>
                                <div class="archetype">${char.archetype}</div>
                            </div>
                        `).join('')}
                    </div>
                    <button class="begin-quest-btn" onclick="playgroundApp.characterGame.startQuest()">
                        ⚔️ Begin the Quest
                    </button>
                </div>
            </div>
        `;
        
        document.querySelector('.character-selection-screen').style.display = 'none';
        characterQuest.style.display = 'block';
    }
    
    loadQuests() {
        this.quests = [
            {
                title: "The Weekend Choice",
                scenario: "You have a free weekend ahead. What calls to your soul?",
                choices: [
                    { type: 'hero', emoji: '🏔️', title: 'Mountain Adventure', desc: 'Climb mountains and help fellow travelers', points: 100 },
                    { type: 'romantic', emoji: '🌹', title: 'Romantic Getaway', desc: 'Candlelit dinner and stargazing', points: 100 },
                    { type: 'comic', emoji: '📱', title: 'Social Media Marathon', desc: 'Create content and engage with followers', points: 100 },
                    { type: 'villain', emoji: '🛋️', title: 'Cozy Home Retreat', desc: 'Netflix, snacks, and complete relaxation', points: 100 },
                    { type: 'social', emoji: '🎪', title: 'Party Planning', desc: 'Organize an epic gathering for friends', points: 100 },
                    { type: 'creative', emoji: '🎨', title: 'Artistic Expression', desc: 'Paint, write, or create something beautiful', points: 100 }
                ]
            },
            {
                title: "The Crisis Response",
                scenario: "A friend is in trouble and needs immediate help. Your instinct is to:",
                choices: [
                    { type: 'hero', emoji: '🚀', title: 'Take Charge', desc: 'Immediately spring into action and lead the rescue', points: 100 },
                    { type: 'romantic', emoji: '💝', title: 'Emotional Support', desc: 'Provide comfort and emotional healing', points: 100 },
                    { type: 'comic', emoji: '😂', title: 'Lighten the Mood', desc: 'Use humor to reduce stress and anxiety', points: 100 },
                    { type: 'villain', emoji: '🧠', title: 'Strategic Planning', desc: 'Analyze the situation and create a logical plan', points: 100 },
                    { type: 'social', emoji: '📞', title: 'Rally the Troops', desc: 'Gather everyone together for group support', points: 100 },
                    { type: 'creative', emoji: '💡', title: 'Creative Solution', desc: 'Think outside the box for unique solutions', points: 100 }
                ]
            },
            {
                title: "The Dream Career",
                scenario: "In your ideal Bollywood movie, you would be:",
                choices: [
                    { type: 'hero', emoji: '👑', title: 'The Protagonist', desc: 'Leading character who saves the day', points: 100 },
                    { type: 'romantic', emoji: '💕', title: 'The Love Interest', desc: 'Heart of the story, bringing love and emotion', points: 100 },
                    { type: 'comic', emoji: '🎭', title: 'The Comic Relief', desc: 'Making everyone laugh with perfect timing', points: 100 },
                    { type: 'villain', emoji: '🎬', title: 'The Director', desc: 'Behind the scenes, orchestrating everything', points: 100 },
                    { type: 'social', emoji: '🎤', title: 'The Ensemble Cast', desc: 'Part of a dynamic group bringing energy', points: 100 },
                    { type: 'creative', emoji: '🎵', title: 'The Artist', desc: 'Music director or choreographer creating magic', points: 100 }
                ]
            },
            {
                title: "The Social Gathering",
                scenario: "At a party, you're most likely to be found:",
                choices: [
                    { type: 'hero', emoji: '🎯', title: 'Organizing Activities', desc: 'Making sure everyone has a great time', points: 100 },
                    { type: 'romantic', emoji: '🌙', title: 'Deep Conversations', desc: 'Having meaningful one-on-one talks', points: 100 },
                    { type: 'comic', emoji: '📸', title: 'Center of Attention', desc: 'Entertaining everyone with stories and jokes', points: 100 },
                    { type: 'villain', emoji: '🍕', title: 'Food Corner', desc: 'Enjoying good food and observing others', points: 100 },
                    { type: 'social', emoji: '💃', title: 'Dance Floor', desc: 'Getting everyone to dance and have fun', points: 100 },
                    { type: 'creative', emoji: '🎨', title: 'Artistic Corner', desc: 'Discussing art, music, and creative projects', points: 100 }
                ]
            },
            {
                title: "The Life Philosophy",
                scenario: "Your personal motto for life is:",
                choices: [
                    { type: 'hero', emoji: '⚡', title: 'Be the Change', desc: 'Lead by example and inspire others', points: 100 },
                    { type: 'romantic', emoji: '💖', title: 'Love Conquers All', desc: 'Believe in the power of love and connection', points: 100 },
                    { type: 'comic', emoji: '😄', title: 'Laughter is Medicine', desc: 'Find joy and humor in everything', points: 100 },
                    { type: 'villain', emoji: '🧘', title: 'Peace and Balance', desc: 'Seek harmony and avoid unnecessary drama', points: 100 },
                    { type: 'social', emoji: '🌟', title: 'Life is a Party', desc: 'Celebrate every moment with others', points: 100 },
                    { type: 'creative', emoji: '🎭', title: 'Art is Life', desc: 'Express yourself and create beauty', points: 100 }
                ]
            }
        ];
    }
    
    startQuest() {
        this.currentQuestion = 0;
        this.answers = [];
        this.app.playSound('success');
        this.showQuest();
    }
    
    showQuest() {
        if (this.currentQuestion >= this.quests.length) {
            this.revealCharacter();
            return;
        }
        
        const quest = this.quests[this.currentQuestion];
        const progress = ((this.currentQuestion + 1) / this.quests.length) * 100;
        
        const characterQuest = document.getElementById('characterQuest');
        characterQuest.innerHTML = `
            <div class="quest-chamber">
                <div class="quest-progress">
                    <div class="progress-header">
                        <span class="quest-number">Quest ${this.currentQuestion + 1}/${this.quests.length}</span>
                        <span class="quest-title">${quest.title}</span>
                    </div>
                    <div class="progress-bar-quest">
                        <div class="progress-fill-quest" style="width: ${progress}%"></div>
                    </div>
                </div>
                
                <div class="quest-card">
                    <div class="quest-header">
                        <h3>🔮 The Oracle Asks</h3>
                        <div class="mystical-glow"></div>
                    </div>
                    <div class="quest-scenario">
                        <p>${quest.scenario}</p>
                    </div>
                    
                    <div class="choice-grid">
                        ${quest.choices.map((choice, index) => `
                            <div class="choice-card" onclick="playgroundApp.characterGame.makeChoice(${index})">
                                <div class="choice-header">
                                    <span class="choice-emoji">${choice.emoji}</span>
                                    <h5>${choice.title}</h5>
                                </div>
                                <p>${choice.desc}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }
    
    makeChoice(choiceIndex) {
        const quest = this.quests[this.currentQuestion];
        const selectedChoice = quest.choices[choiceIndex];
        
        // Visual feedback
        document.querySelectorAll('.choice-card').forEach(card => card.classList.remove('selected'));
        document.querySelectorAll('.choice-card')[choiceIndex].classList.add('selected');
        
        // Play sound and update score
        this.app.playSound('success');
        this.app.gameState.score += selectedChoice.points;
        this.app.updateGameUI();
        
        // Store answer
        this.answers.push(selectedChoice);
        
        // Show choice feedback
        this.showChoiceFeedback(selectedChoice);
        
        // Auto advance
        setTimeout(() => {
            this.currentQuestion++;
            this.showQuest();
        }, 2000);
    }
    
    showChoiceFeedback(choice) {
        const feedback = document.createElement('div');
        feedback.className = 'choice-feedback';
        feedback.innerHTML = `
            <div class="feedback-content">
                <span class="feedback-emoji">${choice.emoji}</span>
                <span class="feedback-text">
                    ${this.characterTypes[choice.type].archetype} Energy Gained!
                </span>
                <span class="feedback-points">+${choice.points} points</span>
            </div>
        `;
        
        document.querySelector('.quest-card').appendChild(feedback);
        
        setTimeout(() => {
            feedback.classList.add('show');
        }, 100);
    }
    
    revealCharacter() {
        // Calculate dominant character type
        const typeCounts = {};
        this.answers.forEach(answer => {
            typeCounts[answer.type] = (typeCounts[answer.type] || 0) + 1;
        });
        
        const dominantType = Object.keys(typeCounts).reduce((a, b) => 
            typeCounts[a] > typeCounts[b] ? a : b
        );
        
        const character = this.characterTypes[dominantType];
        
        // Check for achievements
        this.checkCharacterAchievements(dominantType, typeCounts);
        
        const characterReveal = document.getElementById('characterReveal');
        characterReveal.innerHTML = `
            <div class="character-revelation">
                <div class="revelation-header">
                    <h3>🎭 Your Character is Revealed!</h3>
                    <div class="revelation-glow"></div>
                </div>
                
                <div class="character-display">
                    <h2 class="character-title">${character.emoji} ${character.title}</h2>
                    <div class="character-archetype">${character.archetype} Archetype</div>
                </div>
                
                <div class="character-stats">
                    <h4>📊 Your Character Composition</h4>
                    <div class="stat-bars">
                        ${Object.entries(typeCounts).map(([type, count]) => {
                            const percentage = (count / this.answers.length) * 100;
                            return `
                                <div class="stat-bar">
                                    <div class="stat-label">
                                        <span>${this.characterTypes[type].emoji}</span>
                                        <span>${this.characterTypes[type].archetype}</span>
                                    </div>
                                    <div class="stat-progress">
                                        <div class="stat-fill" style="width: ${percentage}%"></div>
                                    </div>
                                    <div class="stat-percentage">${Math.round(percentage)}%</div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
                
                <div class="character-description">
                    <h4>🎬 Your Bollywood Story</h4>
                    <p>${this.getCharacterDescription(dominantType)}</p>
                </div>
                
                <div class="premium-character-unlock" ${(this.app.hasFullAccess || this.app.hasTestAccess('character')) ? 'style="display: none;"' : ''}>
                    <div class="unlock-preview">
                        <h4>🔓 Unlock Complete Bollywood Character Package</h4>
                        <div class="premium-features">
                            <div class="feature">🎭 Detailed personality breakdown with strengths & growth areas</div>
                            <div class="feature">🎵 Personal Bollywood theme song recommendation</div>
                            <div class="feature">⭐ Celebrity doppelganger matches with similarity scores</div>
                            <div class="feature">📱 Custom Instagram-ready character poster</div>
                            <div class="feature">💼 Career path recommendations based on archetype</div>
                            <div class="feature">💕 Relationship compatibility insights</div>
                            <div class="feature">🎬 Your ideal Bollywood movie role & storyline</div>
                        </div>
                        <button class="unlock-btn" onclick="playgroundApp.handleGameUpgrade('character')">
                            🔓 Unlock Full Package - ₹49
                        </button>
                    </div>
                </div>
                
                <div class="character-actions">
                    <button class="new-quest-btn game-action-btn" onclick="playgroundApp.restartGame('character')">
                        <span class="btn-icon">🔄</span>
                        <span class="btn-text">New Quest</span>
                        <div class="btn-sparkle"></div>
                    </button>
                    <button class="share-character-btn game-action-btn" onclick="playgroundApp.shareGameResult('character')">
                        <span class="btn-icon">📱</span>
                        <span class="btn-text">Share Character</span>
                        <div class="btn-sparkle"></div>
                    </button>
                </div>
            </div>
        `;
        
        document.getElementById('characterQuest').style.display = 'none';
        characterReveal.style.display = 'block';
        
        this.app.playSound('achievement');
        
        // Auto-unlock for premium users
        if (this.app.hasFullAccess || this.app.hasTestAccess('character')) {
            setTimeout(() => {
                this.showPremiumCharacter(dominantType, typeCounts);
            }, 1000);
        }
    }
    
    getCharacterDescription(type) {
        const descriptions = {
            hero: "You are the natural leader everyone looks up to! With courage in your heart and determination in your soul, you inspire others to be their best selves. Like the greatest Bollywood heroes, you face challenges head-on and never give up on what's right.",
            romantic: "Love flows through your veins like poetry! You see beauty in everything and believe in the power of deep connections. Your heart is your compass, and you bring warmth and emotion to every story you're part of.",
            comic: "Laughter is your superpower! You have the magical ability to turn any situation into joy and bring smiles to faces everywhere. Your timing is perfect, your energy infectious, and your presence lights up every room.",
            villain: "Wisdom and tranquility define your character. You prefer the peaceful path and find strength in stillness. Like the wise sages of ancient stories, you observe, understand, and choose your battles carefully.",
            social: "You are the heartbeat of every gathering! Your energy brings people together and creates unforgettable moments. Life is a celebration when you're around, and you have the gift of making everyone feel included and special.",
            creative: "Art flows through your soul like a river of inspiration! You see the world through a unique lens and have the power to create beauty from nothing. Your imagination knows no bounds, and you inspire others to see magic in the ordinary."
        };
        return descriptions[type];
    }
    
    checkCharacterAchievements(dominantType, typeCounts) {
        const achievements = [];
        
        // Pure character achievement
        if (typeCounts[dominantType] === this.answers.length) {
            achievements.push({
                id: 'pure_character',
                emoji: '💎',
                title: 'Pure Character',
                description: `100% ${this.characterTypes[dominantType].archetype}!`
            });
        }
        
        // Balanced character achievement
        if (Object.keys(typeCounts).length >= 4) {
            achievements.push({
                id: 'balanced_soul',
                emoji: '⚖️',
                title: 'Balanced Soul',
                description: 'You embody multiple archetypes!'
            });
        }
        
        // Specific character achievements
        if (dominantType === 'hero') {
            achievements.push({
                id: 'born_leader',
                emoji: '👑',
                title: 'Born Leader',
                description: 'Natural leadership qualities!'
            });
        }
        
        achievements.forEach(achievement => {
            this.app.addAchievement(achievement);
        });
        
        if (achievements.length > 0) {
            this.app.showAchievementPopup(achievements);
        }
    }
    
    showPremiumCharacter(dominantType, typeCounts) {
        const character = this.characterTypes[dominantType];
        
        // Premium character data
        const premiumData = {
            'hero': {
                celebrity: 'Shah Rukh Khan',
                similarity: 87,
                song: 'Kal Ho Naa Ho',
                traits: { leadership: 85, creativity: 72, social: 90, romance: 78 },
                career: 'Entertainment, Leadership, or Creative Industries',
                philosophy: 'Success comes from helping others achieve their dreams'
            },
            'romantic': {
                celebrity: 'Ranbir Kapoor',
                similarity: 92,
                song: 'Tum Hi Ho',
                traits: { leadership: 65, creativity: 88, social: 70, romance: 95 },
                career: 'Arts, Writing, or Relationship Counseling',
                philosophy: 'Love is the most powerful force in the universe'
            },
            'comic': {
                celebrity: 'Varun Dhawan',
                similarity: 89,
                song: 'Nagada Sang Dhol',
                traits: { leadership: 70, creativity: 85, social: 95, romance: 75 },
                career: 'Entertainment, Social Media, or Comedy',
                philosophy: 'Laughter is the best medicine for everything'
            },
            'villain': {
                celebrity: 'Ayushmann Khurrana',
                similarity: 84,
                song: 'Paani Da Rang',
                traits: { leadership: 75, creativity: 80, social: 60, romance: 85 },
                career: 'Research, Writing, or Consulting',
                philosophy: 'Wisdom comes from observing and understanding'
            },
            'social': {
                celebrity: 'Ranveer Singh',
                similarity: 91,
                song: 'Malhari',
                traits: { leadership: 80, creativity: 75, social: 98, romance: 82 },
                career: 'Event Management, PR, or Sales',
                philosophy: 'Life is a celebration meant to be shared'
            },
            'creative': {
                celebrity: 'Alia Bhatt',
                similarity: 88,
                song: 'Ikk Kudi',
                traits: { leadership: 72, creativity: 95, social: 78, romance: 80 },
                career: 'Arts, Design, or Creative Direction',
                philosophy: 'Art is the language of the soul'
            }
        };
        
        const data = premiumData[dominantType] || premiumData['hero'];
        
        // Replace with comprehensive premium analysis
        const characterReveal = document.getElementById('characterReveal');
        characterReveal.innerHTML = `
            <div class="premium-character-analysis">
                <div class="premium-header">
                    <div class="premium-badge">👑 PREMIUM CHARACTER ANALYSIS</div>
                    <h3>🎭 Complete Bollywood Character Package</h3>
                </div>
                
                <div class="character-display-premium">
                    <div class="character-avatar-large">${character.emoji}</div>
                    <h2 class="character-title">${character.title}</h2>
                    <div class="character-archetype">${character.archetype} Archetype</div>
                </div>
                
                <div class="bollywood-analysis">
                    <h4>🎭 Complete Bollywood Analysis</h4>
                    <div class="bollywood-grid">
                        <div class="bollywood-item">
                            <span class="bollywood-icon">🌟</span>
                            <div class="bollywood-content">
                                <h5>🌟 Your Bollywood Doppelganger</h5>
                                <p><strong>Primary Match: ${data.celebrity}</strong> (${data.similarity}% similarity)</p>
                            </div>
                        </div>
                        <div class="bollywood-item">
                            <span class="bollywood-icon">🎬</span>
                            <div class="bollywood-content">
                                <h5>🎬 Character Style</h5>
                                <p>Thoughtful wisdom with calm confidence</p>
                            </div>
                        </div>
                        <div class="bollywood-item">
                            <span class="bollywood-icon">🎵</span>
                            <div class="bollywood-content">
                                <h5>🎵 Theme Song</h5>
                                <p><strong>"${data.song}"</strong> - peaceful and contemplative</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="detailed-traits-analysis">
                    <h4>📊 Comprehensive Personality Breakdown</h4>
                    <div class="trait-analysis-grid">
                        ${Object.entries(data.traits).map(([trait, score]) => `
                            <div class="trait-analysis-item">
                                <div class="trait-header">
                                    <span class="trait-name">${trait.charAt(0).toUpperCase() + trait.slice(1)}</span>
                                    <span class="trait-score">${score}%</span>
                                </div>
                                <div class="trait-bar">
                                    <div class="trait-fill" style="width: ${score}%"></div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="character-insights">
                    <h4>💼 Career & Life Predictions</h4>
                    <div class="insights-grid">
                        <div class="insight-card">
                            <span class="insight-icon">💼</span>
                            <div class="insight-content">
                                <h5>Ideal Career Path</h5>
                                <p>${data.career}</p>
                            </div>
                        </div>
                        <div class="insight-card">
                            <span class="insight-icon">💕</span>
                            <div class="insight-content">
                                <h5>Relationship Style</h5>
                                <p>Thoughtful partner who values deep understanding</p>
                            </div>
                        </div>
                        <div class="insight-card">
                            <span class="insight-icon">🌟</span>
                            <div class="insight-content">
                                <h5>Life Philosophy</h5>
                                <p>"${data.philosophy}"</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="character-stats">
                    <h4>📈 Your Complete Personality Mix</h4>
                    <p class="personality-summary">You find wisdom in quiet moments and deep thoughts!</p>
                    <div class="stat-bars">
                        ${Object.entries(typeCounts).map(([type, count]) => {
                            const percentage = (count / this.answers.length) * 100;
                            return `
                                <div class="stat-bar">
                                    <div class="stat-label">
                                        <span>${this.characterTypes[type].emoji}</span>
                                        <span>${this.characterTypes[type].title}</span>
                                    </div>
                                    <div class="stat-progress">
                                        <div class="stat-fill" style="width: ${percentage}%"></div>
                                    </div>
                                    <div class="stat-percentage">${Math.round(percentage)}%</div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
                
                <div class="instagram-card">
                    <h4>📱 Your Instagram-Ready Character Card</h4>
                    <div class="character-card-preview">
                        <div class="card-header">
                            <span class="card-emoji">${character.emoji}</span>
                            <span class="card-title">${character.title}</span>
                        </div>
                        <div class="card-stats">
                            <span class="card-archetype">🎭 ${character.archetype}</span>
                            <span class="card-match">⭐ ${data.similarity}% Match</span>
                            <span class="card-song">🎵 ${data.song.split(' ')[0]}</span>
                        </div>
                        <div class="card-quote">"${data.philosophy}"</div>
                    </div>
                </div>
                
                <div class="character-actions">
                    <button class="new-quest-btn game-action-btn" onclick="playgroundApp.restartGame('character')">
                        <span class="btn-icon">🔄</span>
                        <span class="btn-text">New Character Quest</span>
                        <div class="btn-sparkle"></div>
                    </button>
                    <button class="share-character-btn game-action-btn" onclick="playgroundApp.shareGameResult('character')">
                        <span class="btn-icon">📤</span>
                        <span class="btn-text">Share My Character Card</span>
                        <div class="btn-sparkle"></div>
                    </button>
                </div>
                
                <div class="premium-complete">
                    <p>✨ Premium Analysis Complete</p>
                </div>
            </div>
        `;
    }
}

// Face Age Detector Game Implementation
class FaceAgeDetectorGame {
    constructor(playgroundApp) {
        this.app = playgroundApp;
        this.uploadedImage = null;
        this.analysisResult = null;
    }
    
    start() {
        this.app.playSound('click');
        this.showUploadInterface();
    }
    
    showUploadInterface() {
        const ageDetector = document.getElementById('ageDetector');
        ageDetector.innerHTML = `
            <div class="age-detector-interface">
                <div class="detector-header">
                    <h3>📸 AI Age Detection Lab</h3>
                    <div class="lab-badge">🧬 Advanced Facial Analysis</div>
                </div>
                
                <div class="upload-zone">
                    <div class="upload-area-age" onclick="document.getElementById('ageImageInput').click()">
                        <div class="upload-icon">📷</div>
                        <h4>Upload Your Photo</h4>
                        <p>Our AI will analyze your facial features to estimate your age</p>
                        <div class="upload-hints">
                            <span class="hint">💡 Best results with clear, front-facing photos</span>
                            <span class="hint">🌟 Good lighting recommended</span>
                        </div>
                        <button class="upload-btn-age">📸 Choose Photo</button>
                    </div>
                    <input type="file" id="ageImageInput" accept="image/*" style="display: none;" onchange="playgroundApp.ageGame.handleImageUpload(event)">
                </div>
                
                <div class="sample-photos">
                    <h4>🎭 Or Try Sample Photos</h4>
                    <div class="sample-grid">
                        <div class="sample-photo" onclick="playgroundApp.ageGame.useSamplePhoto('young')">
                            <div class="sample-emoji">👶</div>
                            <span>Young Face</span>
                        </div>
                        <div class="sample-photo" onclick="playgroundApp.ageGame.useSamplePhoto('adult')">
                            <div class="sample-emoji">👨</div>
                            <span>Adult Face</span>
                        </div>
                        <div class="sample-photo" onclick="playgroundApp.ageGame.useSamplePhoto('mature')">
                            <div class="sample-emoji">👴</div>
                            <span>Mature Face</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.querySelector('.age-selection-screen').style.display = 'none';
        ageDetector.style.display = 'block';
    }
    
    handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
            this.uploadedImage = file;
            this.app.playSound('success');
            this.showAnalysisProgress();
        }
    }
    
    useSamplePhoto(type) {
        this.uploadedImage = { type: 'sample', category: type };
        this.app.playSound('success');
        this.showAnalysisProgress();
    }
    
    showAnalysisProgress() {
        const ageDetector = document.getElementById('ageDetector');
        ageDetector.innerHTML = `
            <div class="analysis-progress">
                <div class="analysis-header">
                    <h3>🔬 AI Analysis in Progress</h3>
                    <div class="scanning-animation">
                        <div class="scan-line"></div>
                    </div>
                </div>
                
                <div class="progress-steps">
                    <div class="step active">
                        <div class="step-icon">📸</div>
                        <span>Image Processing</span>
                    </div>
                    <div class="step active">
                        <div class="step-icon">🧠</div>
                        <span>Facial Recognition</span>
                    </div>
                    <div class="step processing">
                        <div class="step-icon">⚡</div>
                        <span>Age Calculation</span>
                    </div>
                    <div class="step">
                        <div class="step-icon">📊</div>
                        <span>Beauty Analysis</span>
                    </div>
                </div>
                
                <div class="analysis-status">
                    <div class="status-text">Analyzing facial features...</div>
                    <div class="progress-bar-age">
                        <div class="progress-fill-age"></div>
                    </div>
                </div>
            </div>
        `;
        
        // Simulate analysis progress
        let progress = 0;
        const progressBar = document.querySelector('.progress-fill-age');
        const statusText = document.querySelector('.status-text');
        
        const progressInterval = setInterval(() => {
            progress += Math.random() * 15;
            progressBar.style.width = Math.min(progress, 100) + '%';
            
            if (progress >= 25 && progress < 50) {
                statusText.textContent = 'Detecting facial landmarks...';
                document.querySelectorAll('.step')[2].classList.add('active');
            } else if (progress >= 50 && progress < 75) {
                statusText.textContent = 'Calculating biological age...';
            } else if (progress >= 75) {
                statusText.textContent = 'Generating beauty analysis...';
                document.querySelectorAll('.step')[3].classList.add('active');
            }
            
            if (progress >= 100) {
                clearInterval(progressInterval);
                setTimeout(() => {
                    this.generateAgeResult();
                }, 500);
            }
        }, 200);
    }
    
    generateAgeResult() {
        // Generate realistic age estimation
        const baseAge = 18 + Math.floor(Math.random() * 25); // 18-42
        const variance = Math.floor(Math.random() * 6) - 3; // -3 to +3
        const estimatedAge = Math.max(16, baseAge + variance);
        
        // Generate analysis data
        this.analysisResult = {
            estimatedAge: estimatedAge,
            geneticAge: estimatedAge + (Math.floor(Math.random() * 6) - 3),
            beautyScore: {
                symmetry: 65 + Math.floor(Math.random() * 30),
                skinQuality: 70 + Math.floor(Math.random() * 25),
                eyeAppeal: 75 + Math.floor(Math.random() * 25),
                smileRating: 80 + Math.floor(Math.random() * 20)
            },
            celebrity: this.getCelebrityMatch(estimatedAge),
            tips: this.getBeautyTips(estimatedAge)
        };
        
        this.app.gameState.score += 200;
        this.app.updateGameUI();
        this.showBasicResult();
    }
    
    getCelebrityMatch(age) {
        const celebrities = {
            young: [
                { name: 'Alia Bhatt', percentage: 75 + Math.floor(Math.random() * 15) },
                { name: 'Ananya Panday', percentage: 70 + Math.floor(Math.random() * 20) },
                { name: 'Janhvi Kapoor', percentage: 65 + Math.floor(Math.random() * 25) }
            ],
            adult: [
                { name: 'Priyanka Chopra', percentage: 75 + Math.floor(Math.random() * 15) },
                { name: 'Deepika Padukone', percentage: 70 + Math.floor(Math.random() * 20) },
                { name: 'Katrina Kaif', percentage: 65 + Math.floor(Math.random() * 25) }
            ],
            mature: [
                { name: 'Madhuri Dixit', percentage: 75 + Math.floor(Math.random() * 15) },
                { name: 'Kajol', percentage: 70 + Math.floor(Math.random() * 20) },
                { name: 'Tabu', percentage: 65 + Math.floor(Math.random() * 25) }
            ]
        };
        
        const category = age < 25 ? 'young' : age < 35 ? 'adult' : 'mature';
        const matches = celebrities[category];
        const primary = matches[0];
        const secondary = matches[1];
        
        return { primary, secondary };
    }
    
    getBeautyTips(age) {
        const tipsByAge = {
            young: "Use vitamin C serum, drink 3L water daily, sleep 7-8 hours. Focus on prevention and gentle skincare routine.",
            adult: "Incorporate retinol, maintain hydration, use SPF daily. Focus on anti-aging and skin repair.",
            mature: "Use peptide creams, facial massage, collagen supplements. Focus on firming and deep nourishment."
        };
        
        const category = age < 25 ? 'young' : age < 35 ? 'adult' : 'mature';
        return tipsByAge[category];
    }
    
    showBasicResult() {
        const ageResult = document.getElementById('ageResult');
        const result = this.analysisResult;
        const ageDifference = result.geneticAge - result.estimatedAge;
        
        ageResult.innerHTML = `
            <div class="age-result-display">
                <div class="result-header">
                    <h3>🎉 Age Analysis Complete!</h3>
                    <div class="analysis-badge">✨ AI Powered Results</div>
                </div>
                
                <div class="age-display">
                    <div class="estimated-age">
                        <h2>Your Estimated Age</h2>
                        <div class="age-number">${result.estimatedAge}</div>
                        <div class="age-unit">years old</div>
                        <div class="age-comment">
                            ${result.estimatedAge < 25 ? 
                                'You have a youthful glow that\'s perfect for Indian beauty standards!' :
                                result.estimatedAge < 35 ?
                                'You have that perfect mature charm that radiates confidence!' :
                                'You have the wisdom and grace that comes with beautiful maturity!'}
                        </div>
                    </div>
                </div>
                
                <div class="premium-preview">
                    <div class="preview-item">
                        <span class="preview-icon">🧬</span>
                        <div class="preview-content">
                            <h4>Genetic Age Score: ${result.geneticAge} years</h4>
                            <p>Your biological age is ${Math.abs(ageDifference)} years ${ageDifference < 0 ? 'younger' : 'older'} than your appearance!</p>
                        </div>
                    </div>
                    
                    <div class="preview-item">
                        <span class="preview-icon">✨</span>
                        <div class="preview-content">
                            <h4>Beauty Enhancement Tips</h4>
                            <p>${result.tips}</p>
                        </div>
                    </div>
                    
                    <div class="preview-item">
                        <span class="preview-icon">📊</span>
                        <div class="preview-content">
                            <h4>Celebrity Match: ${result.celebrity.primary.name} (${result.celebrity.primary.percentage}%)</h4>
                            <p>You share similar facial structure. Also matches: ${result.celebrity.secondary.name} (${result.celebrity.secondary.percentage}%).</p>
                        </div>
                    </div>
                </div>
                
                <div class="premium-unlock" ${(this.app.hasFullAccess || this.app.hasTestAccess('age')) ? 'style="display: none;"' : ''}>
                    <div class="unlock-card">
                        <h4>🔓 Unlock Premium Beauty Analysis</h4>
                        <div class="premium-features-age">
                            <div class="feature">🧬 Detailed genetic age analysis with biological markers</div>
                            <div class="feature">📊 Complete beauty breakdown (Symmetry, Skin, Eyes, Smile)</div>
                            <div class="feature">⭐ Multiple celebrity matches with similarity percentages</div>
                            <div class="feature">📸 Best photo angles and lighting recommendations</div>
                            <div class="feature">💄 Personalized makeup and skincare routine</div>
                            <div class="feature">🎯 Age-defying tips and beauty enhancement guide</div>
                        </div>
                        <button class="unlock-btn-age" onclick="playgroundApp.handleGameUpgrade('age')">
                            🔓 Unlock Premium Analysis - ₹79
                        </button>
                    </div>
                </div>
                
                <div class="age-actions">
                    <button class="new-analysis-btn" onclick="playgroundApp.restartGame('age')">
                        📸 New Analysis
                    </button>
                    <button class="share-age-btn" onclick="playgroundApp.shareGameResult('age')">
                        📱 Share Result
                    </button>
                </div>
            </div>
        `;
        
        document.getElementById('ageDetector').style.display = 'none';
        ageResult.style.display = 'block';
        
        this.app.playSound('achievement');
        
        // Auto-unlock for premium users
        if (this.app.hasFullAccess || this.app.hasTestAccess('age')) {
            setTimeout(() => {
                this.showPremiumAnalysis();
            }, 1000);
        }
    }
    
    showPremiumAnalysis() {
        const ageResult = document.getElementById('ageResult');
        const result = this.analysisResult;
        const ageDifference = result.geneticAge - result.estimatedAge;
        
        ageResult.innerHTML = `
            <div class="premium-age-analysis">
                <div class="premium-header">
                    <div class="premium-badge">🎉 Premium analysis unlocked! Enjoy your detailed report.</div>
                    <h3>📊 Complete Beauty & Age Analysis</h3>
                </div>
                
                <div class="age-display-premium">
                    <h2>Your Estimated Age</h2>
                    <div class="age-number-premium">${result.estimatedAge}</div>
                    <div class="age-unit">years old</div>
                    <div class="age-comment-premium">
                        ${result.estimatedAge < 25 ? 
                            'You have a youthful glow that\'s perfect for Indian beauty standards!' :
                            result.estimatedAge < 35 ?
                            'You have that perfect mature charm that radiates confidence!' :
                            'You have the wisdom and grace that comes with beautiful maturity!'}
                    </div>
                </div>
                
                <div class="premium-analysis-grid">
                    <div class="analysis-section">
                        <h4>🧬 Premium AI Analysis</h4>
                        <div class="genetic-analysis">
                            <div class="genetic-item">
                                <span class="genetic-icon">🧬</span>
                                <div class="genetic-content">
                                    <h5>Genetic Age Score: ${result.geneticAge} years</h5>
                                    <p>Your biological age is ${Math.abs(ageDifference)} years ${ageDifference < 0 ? 'younger' : 'older'} than your appearance!</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="analysis-section">
                        <h4>✨ Beauty Enhancement Tips</h4>
                        <div class="beauty-tips">
                            <p>${result.tips}</p>
                        </div>
                    </div>
                    
                    <div class="analysis-section">
                        <h4>📊 Celebrity Match: ${result.celebrity.primary.name} (${result.celebrity.primary.percentage}%)</h4>
                        <div class="celebrity-matches">
                            <p>You share similar facial structure. Also matches: ${result.celebrity.secondary.name} (${result.celebrity.secondary.percentage}%).</p>
                        </div>
                    </div>
                    
                    <div class="analysis-section">
                        <h4>🎯 Best Photo Angles</h4>
                        <div class="photo-tips">
                            <p>45° left angle, natural lighting, slight smile. Avoid harsh overhead lighting.</p>
                        </div>
                    </div>
                </div>
                
                <div class="beauty-breakdown">
                    <h4>✨ Premium Beauty Analysis</h4>
                    <div class="beauty-stats">
                        <div class="beauty-stat">
                            <div class="stat-label">Facial Symmetry</div>
                            <div class="stat-bar">
                                <div class="stat-fill" style="width: ${result.beautyScore.symmetry}%"></div>
                            </div>
                            <div class="stat-value">${result.beautyScore.symmetry}%</div>
                        </div>
                        <div class="beauty-stat">
                            <div class="stat-label">Skin Quality</div>
                            <div class="stat-bar">
                                <div class="stat-fill" style="width: ${result.beautyScore.skinQuality}%"></div>
                            </div>
                            <div class="stat-value">${result.beautyScore.skinQuality}%</div>
                        </div>
                        <div class="beauty-stat">
                            <div class="stat-label">Eye Appeal</div>
                            <div class="stat-bar">
                                <div class="stat-fill" style="width: ${result.beautyScore.eyeAppeal}%"></div>
                            </div>
                            <div class="stat-value">${result.beautyScore.eyeAppeal}%</div>
                        </div>
                        <div class="beauty-stat">
                            <div class="stat-label">Smile Rating</div>
                            <div class="stat-bar">
                                <div class="stat-fill" style="width: ${result.beautyScore.smileRating}%"></div>
                            </div>
                            <div class="stat-value">${result.beautyScore.smileRating}%</div>
                        </div>
                    </div>
                </div>
                
                <div class="age-actions">
                    <button class="new-analysis-btn" onclick="playgroundApp.restartGame('age')">
                        📸 New Analysis
                    </button>
                    <button class="share-age-btn" onclick="playgroundApp.shareGameResult('age')">
                        📱 Share Premium Report
                    </button>
                </div>
            </div>
        `;
    }
}

// Export for use in playground
window.RedFlagDetectiveGame = RedFlagDetectiveGame;
window.CharacterQuestGame = CharacterQuestGame;
window.FaceAgeDetectorGame = FaceAgeDetectorGame;

} // End of class existence check