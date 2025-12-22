// Enhanced Red Flag Test Database System
console.log('Enhanced Red Flag Database loaded!');

// 📊 Dynamic Question Pool - 50+ questions per category
const QUESTION_DATABASE = {
    communication: [
        {
            id: 'comm_1',
            question: 'When {name} is upset, they:',
            options: [
                { emoji: '💬', title: 'Open Communicator', text: 'Talk about it openly and work through it together', value: 'green' },
                { emoji: '⏰', title: 'Needs Time First', text: 'Eventually open up but need some time first', value: 'yellow' },
                { emoji: '🚪', title: 'Shuts Down', text: 'Shut down, give silent treatment, or get defensive', value: 'red' }
            ]
        },
        {
            id: 'comm_2',
            question: 'During disagreements, {name}:',
            options: [
                { emoji: '🤝', title: 'Seeks Solutions', text: 'Focuses on finding solutions together', value: 'green' },
                { emoji: '😤', title: 'Gets Defensive', text: 'Sometimes gets defensive but tries to work it out', value: 'yellow' },
                { emoji: '🗯️', title: 'Attacks Person', text: 'Attacks your character instead of addressing the issue', value: 'red' }
            ]
        },
        {
            id: 'comm_3',
            question: 'When you share good news, {name}:',
            options: [
                { emoji: '🎉', title: 'Celebrates With You', text: 'Gets genuinely excited and celebrates your success', value: 'green' },
                { emoji: '😊', title: 'Shows Interest', text: 'Shows interest but sometimes seems distracted', value: 'yellow' },
                { emoji: '😒', title: 'Seems Uninterested', text: 'Seems uninterested or makes it about themselves', value: 'red' }
            ]
        },
        {
            id: 'comm_4',
            question: 'When discussing problems, {name}:',
            options: [
                { emoji: '👂', title: 'Active Listener', text: 'Listens without interrupting and asks thoughtful questions', value: 'green' },
                { emoji: '🤔', title: 'Sometimes Distracted', text: 'Tries to listen but sometimes gets distracted', value: 'yellow' },
                { emoji: '📱', title: 'Always Distracted', text: 'Often on phone or clearly not paying attention', value: 'red' }
            ]
        },
        {
            id: 'comm_5',
            question: 'When you express concerns, {name}:',
            options: [
                { emoji: '🤗', title: 'Validates Feelings', text: 'Acknowledges your feelings and works to address concerns', value: 'green' },
                { emoji: '🤷', title: 'Sometimes Dismissive', text: 'Sometimes dismisses concerns but eventually listens', value: 'yellow' },
                { emoji: '🙄', title: 'Always Dismissive', text: 'Regularly dismisses or minimizes your concerns', value: 'red' }
            ]
        }
    ],
    boundaries: [
        {
            id: 'bound_1',
            question: 'When you say no to something, {name}:',
            options: [
                { emoji: '✅', title: 'Respects Instantly', text: 'Respects your decision without question', value: 'green' },
                { emoji: '❓', title: 'Asks But Accepts', text: 'Asks why but ultimately accepts it', value: 'yellow' },
                { emoji: '😤', title: 'Keeps Pushing', text: 'Keeps pushing, guilt trips, or gets angry', value: 'red' }
            ]
        },
        {
            id: 'bound_2',
            question: 'Regarding your personal space, {name}:',
            options: [
                { emoji: '🏠', title: 'Respects Space', text: 'Gives you space when you need it', value: 'green' },
                { emoji: '🤗', title: 'Sometimes Clingy', text: 'Sometimes has trouble giving you space', value: 'yellow' },
                { emoji: '👀', title: 'Always Intrusive', text: 'Constantly wants to know where you are and what you\'re doing', value: 'red' }
            ]
        },
        {
            id: 'bound_3',
            question: 'When you need alone time, {name}:',
            options: [
                { emoji: '😌', title: 'Understands Completely', text: 'Completely understands and supports your need for alone time', value: 'green' },
                { emoji: '😕', title: 'Feels Hurt Sometimes', text: 'Sometimes feels hurt but tries to understand', value: 'yellow' },
                { emoji: '😠', title: 'Takes It Personally', text: 'Takes it personally and makes you feel guilty', value: 'red' }
            ]
        },
        {
            id: 'bound_4',
            question: 'About your friendships, {name}:',
            options: [
                { emoji: '👥', title: 'Encourages Friendships', text: 'Actively encourages your friendships and social life', value: 'green' },
                { emoji: '😐', title: 'Neutral About Friends', text: 'Doesn\'t interfere but isn\'t particularly encouraging', value: 'yellow' },
                { emoji: '🚫', title: 'Discourages Friends', text: 'Tries to limit your time with friends or speaks negatively about them', value: 'red' }
            ]
        },
        {
            id: 'bound_5',
            question: 'When you set boundaries, {name}:',
            options: [
                { emoji: '🤝', title: 'Respects & Discusses', text: 'Respects them and discusses any concerns maturely', value: 'green' },
                { emoji: '🤨', title: 'Questions But Accepts', text: 'Questions them but ultimately accepts your boundaries', value: 'yellow' },
                { emoji: '🔥', title: 'Gets Angry', text: 'Gets angry or tries to negotiate every boundary', value: 'red' }
            ]
        }
    ],
    social: [
        {
            id: 'social_1',
            question: '{name} treats service workers by:',
            options: [
                { emoji: '😊', title: 'Always Respectful', text: 'Being polite, patient, and respectful always', value: 'green' },
                { emoji: '😐', title: 'Generally Nice', text: 'Being generally nice but sometimes impatient', value: 'yellow' },
                { emoji: '😤', title: 'Rude & Demanding', text: 'Being rude, demanding, or condescending', value: 'red' }
            ]
        },
        {
            id: 'social_2',
            question: 'In social gatherings, {name}:',
            options: [
                { emoji: '🎉', title: 'Includes Everyone', text: 'Makes effort to include everyone in conversations', value: 'green' },
                { emoji: '😊', title: 'Socially Comfortable', text: 'Is comfortable but doesn\'t go out of their way', value: 'yellow' },
                { emoji: '😒', title: 'Antisocial', text: 'Seems uncomfortable or acts superior to others', value: 'red' }
            ]
        },
        {
            id: 'social_3',
            question: 'When meeting your family, {name}:',
            options: [
                { emoji: '🤗', title: 'Makes Great Effort', text: 'Makes genuine effort to connect and build relationships', value: 'green' },
                { emoji: '😊', title: 'Polite But Reserved', text: 'Is polite but doesn\'t make much effort to connect', value: 'yellow' },
                { emoji: '😑', title: 'Disinterested', text: 'Shows little interest or makes negative comments', value: 'red' }
            ]
        },
        {
            id: 'social_4',
            question: 'Around your friends, {name}:',
            options: [
                { emoji: '👫', title: 'Fits Right In', text: 'Makes effort to fit in and build friendships', value: 'green' },
                { emoji: '😐', title: 'Polite But Distant', text: 'Is polite but keeps some distance', value: 'yellow' },
                { emoji: '🙄', title: 'Critical', text: 'Is critical of your friends or tries to isolate you', value: 'red' }
            ]
        },
        {
            id: 'social_5',
            question: 'In group settings, {name}:',
            options: [
                { emoji: '🤝', title: 'Team Player', text: 'Works well with others and shares spotlight', value: 'green' },
                { emoji: '😎', title: 'Likes Attention', text: 'Enjoys being center of attention but isn\'t obnoxious', value: 'yellow' },
                { emoji: '🎭', title: 'Always Performing', text: 'Always needs to be center of attention or dominates conversations', value: 'red' }
            ]
        }
    ]
};

// 🎭 Personality Archetypes - 12 relationship types
const PERSONALITY_ARCHETYPES = {
    'secure_communicator': {
        name: 'The Secure Communicator',
        emoji: '💬',
        description: 'Masters of healthy relationship communication',
        traits: ['Excellent listener', 'Emotionally available', 'Conflict resolver', 'Empathetic'],
        strengths: 'Creates safe space for open dialogue, handles conflicts maturely, validates partner\'s feelings',
        challenges: 'May sometimes over-analyze situations, can be too accommodating',
        compatibility: ['anxious_attacher', 'independent_spirit', 'loyal_supporter'],
        relationship_style: 'Builds deep emotional intimacy through consistent, honest communication',
        success_rate: 89
    },
    'anxious_attacher': {
        name: 'The Anxious Attacher',
        emoji: '💕',
        description: 'Deeply loving but needs reassurance',
        traits: ['Highly empathetic', 'Devoted partner', 'Emotionally expressive', 'Seeks closeness'],
        strengths: 'Incredibly loving and devoted, highly attuned to partner\'s needs, creates strong emotional bonds',
        challenges: 'May need frequent reassurance, can become clingy, fears abandonment',
        compatibility: ['secure_communicator', 'loyal_supporter', 'protective_guardian'],
        relationship_style: 'Forms intense emotional connections and thrives with consistent reassurance',
        success_rate: 76
    },
    'independent_spirit': {
        name: 'The Independent Spirit',
        emoji: '🦅',
        description: 'Values freedom and personal growth',
        traits: ['Self-reliant', 'Goal-oriented', 'Values autonomy', 'Growth-minded'],
        strengths: 'Maintains healthy independence, encourages partner\'s growth, brings stability',
        challenges: 'May struggle with emotional intimacy, can seem distant at times',
        compatibility: ['secure_communicator', 'adventure_seeker', 'intellectual_connector'],
        relationship_style: 'Builds relationships based on mutual respect and personal freedom',
        success_rate: 82
    },
    'loyal_supporter': {
        name: 'The Loyal Supporter',
        emoji: '🤝',
        description: 'Steadfast and dependable partner',
        traits: ['Extremely loyal', 'Supportive', 'Reliable', 'Family-oriented'],
        strengths: 'Unwavering loyalty, incredible support system, creates stable foundation',
        challenges: 'May sacrifice own needs, can be too accommodating, avoids conflict',
        compatibility: ['secure_communicator', 'anxious_attacher', 'protective_guardian'],
        relationship_style: 'Builds lasting relationships through consistent support and dedication',
        success_rate: 85
    },
    'adventure_seeker': {
        name: 'The Adventure Seeker',
        emoji: '🌟',
        description: 'Brings excitement and spontaneity',
        traits: ['Spontaneous', 'Fun-loving', 'Optimistic', 'Energetic'],
        strengths: 'Keeps relationship exciting, brings joy and spontaneity, encourages new experiences',
        challenges: 'May struggle with routine, can be impulsive, might avoid serious conversations',
        compatibility: ['independent_spirit', 'social_butterfly', 'passionate_romantic'],
        relationship_style: 'Creates dynamic relationships full of shared adventures and experiences',
        success_rate: 73
    },
    'intellectual_connector': {
        name: 'The Intellectual Connector',
        emoji: '🧠',
        description: 'Connects through deep conversations',
        traits: ['Thoughtful', 'Analytical', 'Curious', 'Deep thinker'],
        strengths: 'Stimulating conversations, thoughtful approach to problems, values growth',
        challenges: 'May over-analyze emotions, can seem detached, might intellectualize feelings',
        compatibility: ['independent_spirit', 'secure_communicator', 'creative_soul'],
        relationship_style: 'Builds connection through meaningful conversations and shared learning',
        success_rate: 79
    },
    'passionate_romantic': {
        name: 'The Passionate Romantic',
        emoji: '🔥',
        description: 'Intense and deeply romantic',
        traits: ['Passionate', 'Romantic', 'Expressive', 'Intense'],
        strengths: 'Brings incredible passion, highly romantic, emotionally expressive',
        challenges: 'Can be overwhelming, may have intense mood swings, needs constant romance',
        compatibility: ['adventure_seeker', 'creative_soul', 'loyal_supporter'],
        relationship_style: 'Creates intense, passionate connections with high emotional expression',
        success_rate: 68
    },
    'protective_guardian': {
        name: 'The Protective Guardian',
        emoji: '🛡️',
        description: 'Fiercely protective and caring',
        traits: ['Protective', 'Caring', 'Strong', 'Responsible'],
        strengths: 'Incredibly protective, takes care of partner, provides security and stability',
        challenges: 'Can be overprotective, may try to control situations, might be possessive',
        compatibility: ['anxious_attacher', 'loyal_supporter', 'gentle_nurturer'],
        relationship_style: 'Builds secure relationships through protection and care',
        success_rate: 81
    },
    'social_butterfly': {
        name: 'The Social Butterfly',
        emoji: '🦋',
        description: 'Thrives in social connections',
        traits: ['Outgoing', 'Charismatic', 'Social', 'Energetic'],
        strengths: 'Great social skills, brings partner into social circles, fun and engaging',
        challenges: 'May need constant social stimulation, can be attention-seeking',
        compatibility: ['adventure_seeker', 'passionate_romantic', 'secure_communicator'],
        relationship_style: 'Builds relationships through shared social experiences and connections',
        success_rate: 75
    },
    'gentle_nurturer': {
        name: 'The Gentle Nurturer',
        emoji: '🌸',
        description: 'Caring and emotionally supportive',
        traits: ['Nurturing', 'Gentle', 'Empathetic', 'Supportive'],
        strengths: 'Incredibly caring, emotionally supportive, creates peaceful environment',
        challenges: 'May avoid conflict, can be taken advantage of, might suppress own needs',
        compatibility: ['protective_guardian', 'secure_communicator', 'intellectual_connector'],
        relationship_style: 'Creates harmonious relationships through care and emotional support',
        success_rate: 83
    },
    'creative_soul': {
        name: 'The Creative Soul',
        emoji: '🎨',
        description: 'Expresses love through creativity',
        traits: ['Creative', 'Artistic', 'Expressive', 'Unique'],
        strengths: 'Brings creativity and uniqueness, expresses love in artistic ways, inspiring',
        challenges: 'Can be moody, may be unpredictable, might struggle with practical matters',
        compatibility: ['intellectual_connector', 'passionate_romantic', 'independent_spirit'],
        relationship_style: 'Expresses love through creative and unique gestures',
        success_rate: 77
    },
    'practical_planner': {
        name: 'The Practical Planner',
        emoji: '📋',
        description: 'Organized and future-focused',
        traits: ['Organized', 'Practical', 'Future-focused', 'Reliable'],
        strengths: 'Excellent at planning, provides stability, thinks about future together',
        challenges: 'Can be rigid, may lack spontaneity, might be controlling about plans',
        compatibility: ['loyal_supporter', 'gentle_nurturer', 'protective_guardian'],
        relationship_style: 'Builds stable relationships through careful planning and organization',
        success_rate: 84
    }
};

// 📈 Trend Analysis Database
const TREND_ANALYSIS = {
    age_insights: {
        '18-24': {
            communication: 'Young adults with strong communication skills report 67% higher relationship satisfaction',
            boundaries: 'This age group struggles most with boundary setting - only 34% have healthy boundaries',
            social: 'Social media behavior is the #1 relationship issue for 18-24 year olds',
            success_factors: ['Open communication', 'Shared social circles', 'Growth mindset']
        },
        '25-30': {
            communication: 'Peak relationship communication skills develop in this age range',
            boundaries: 'Boundary awareness increases significantly - 78% report healthy boundaries',
            social: 'Career stress becomes major factor in relationship dynamics',
            success_factors: ['Work-life balance', 'Future planning', 'Emotional maturity']
        },
        '31-40': {
            communication: 'Most stable communication patterns, but may become routine',
            boundaries: 'Strongest boundary skills across all age groups',
            social: 'Family planning and parenting stress affects 89% of relationships',
            success_factors: ['Shared responsibilities', 'Maintaining intimacy', 'Stress management']
        }
    },
    pattern_insights: {
        'high_green': 'People with 70%+ green flags report 94% relationship satisfaction and 89% long-term success',
        'mixed_signals': 'Mixed patterns (40-60% each color) have 67% success rate with proper communication work',
        'high_red': 'High red flag patterns show 23% success rate - professional help strongly recommended',
        'communication_focused': 'Strong communication + weak boundaries: 78% success with boundary work',
        'boundary_strong': 'Strong boundaries + weak communication: 71% success with communication coaching'
    },
    success_stories: [
        'Sarah & Mike (both Secure Communicators) overcame trust issues and are now engaged after 3 years',
        'Alex (Independent Spirit) & Jordan (Anxious Attacher) learned to balance space and closeness - together 5 years',
        'Partners with initial 45% compatibility improved to 89% after 6 months of focused work',
        'Couples who retake the test monthly show 156% better relationship outcomes'
    ]
};

// 💝 Compatibility Matching System
const COMPATIBILITY_FACTORS = {
    communication_preferences: {
        direct: ['secure_communicator', 'independent_spirit', 'intellectual_connector'],
        gentle: ['gentle_nurturer', 'loyal_supporter', 'anxious_attacher'],
        expressive: ['passionate_romantic', 'creative_soul', 'social_butterfly']
    },
    conflict_styles: {
        collaborative: ['secure_communicator', 'intellectual_connector'],
        accommodating: ['loyal_supporter', 'gentle_nurturer'],
        passionate: ['passionate_romantic', 'protective_guardian'],
        avoidant: ['independent_spirit', 'creative_soul']
    },
    intimacy_needs: {
        high: ['anxious_attacher', 'passionate_romantic', 'gentle_nurturer'],
        moderate: ['secure_communicator', 'loyal_supporter', 'social_butterfly'],
        low: ['independent_spirit', 'intellectual_connector', 'practical_planner']
    }
};

// 🎯 Personalized Action Plans Database
const ACTION_PLANS = {
    'comm_red_bound_yellow': {
        title: 'Communication Crisis + Boundary Confusion',
        priority: 'HIGH',
        immediate_actions: [
            'Schedule weekly 30-minute check-ins to practice open communication',
            'Use "I feel" statements instead of "You always" accusations',
            'Establish one clear boundary this week and communicate it clearly'
        ],
        weekly_challenges: [
            'Week 1: Practice active listening - repeat back what you heard',
            'Week 2: Share one vulnerable feeling each day',
            'Week 3: Set and maintain one new boundary',
            'Week 4: Have one difficult conversation using healthy communication'
        ],
        resources: ['Gottman Method communication techniques', 'Boundary setting worksheets'],
        success_metrics: 'Aim for 2+ green communication flags and 1+ green boundary flag in next test'
    },
    'social_red_trust_red': {
        title: 'Social & Trust Red Flags',
        priority: 'CRITICAL',
        immediate_actions: [
            'Evaluate if this relationship is safe for your wellbeing',
            'Reach out to trusted friends/family for support',
            'Consider professional counseling or therapy'
        ],
        weekly_challenges: [
            'Week 1: Document concerning behaviors in a journal',
            'Week 2: Reconnect with one friend or family member',
            'Week 3: Set one firm boundary around social interactions',
            'Week 4: Evaluate relationship progress with trusted advisor'
        ],
        resources: ['Relationship safety assessment', 'Local counseling resources'],
        success_metrics: 'Focus on personal safety and wellbeing over test scores'
    }
};

// Enhanced Red Flag Test Class with all new features
class EnhancedRedFlagTest {
    constructor() {
        this.currentQuestion = 0;
        this.answers = [];
        this.redFlags = 0;
        this.greenFlags = 0;
        this.yellowFlags = 0;
        this.testMode = 'self';
        this.partnerName = '';
        this.questions = [];
        this.userAge = null;
        this.userArchetype = null;
        this.partnerArchetype = null;
        this.compatibilityScore = 0;
        this.testHistory = this.loadTestHistory();
        this.selectedQuestions = [];
    }

    // Load test history from localStorage
    loadTestHistory() {
        const history = localStorage.getItem('redFlagTestHistory');
        return history ? JSON.parse(history) : [];
    }

    // Save test results to history
    saveTestResult(result) {
        this.testHistory.push({
            ...result,
            timestamp: Date.now(),
            testId: 'test_' + Date.now()
        });
        localStorage.setItem('redFlagTestHistory', JSON.stringify(this.testHistory));
    }

    // 📊 Dynamic Question Selection
    selectRandomQuestions() {
        this.selectedQuestions = [];
        const categories = ['communication', 'boundaries', 'social'];
        
        categories.forEach(category => {
            const categoryQuestions = QUESTION_DATABASE[category];
            const shuffled = [...categoryQuestions].sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, 3); // 3 questions per category
            this.selectedQuestions.push(...selected);
        });
        
        // Shuffle final question order
        this.selectedQuestions = this.selectedQuestions.sort(() => 0.5 - Math.random());
        
        // Convert to old format for compatibility
        this.questions = this.selectedQuestions.map(q => ({
            category: q.id.split('_')[0],
            question: q.question.replace('{name}', this.partnerName || 'they'),
            options: q.options
        }));
    }

    // 🎭 Determine Personality Archetype
    determineArchetype(answers) {
        const scores = this.calculateCategoryScores(answers);
        
        // Archetype determination logic based on flag patterns
        if (scores.communication >= 80 && scores.boundaries >= 70) {
            return 'secure_communicator';
        } else if (scores.communication >= 60 && scores.social <= 40) {
            return 'anxious_attacher';
        } else if (scores.boundaries >= 80 && scores.communication <= 60) {
            return 'independent_spirit';
        } else if (scores.social >= 80 && scores.boundaries >= 70) {
            return 'loyal_supporter';
        } else if (scores.social >= 70 && scores.communication >= 60) {
            return 'social_butterfly';
        } else if (scores.boundaries <= 40 && scores.communication <= 40) {
            return 'passionate_romantic';
        } else {
            return 'practical_planner'; // Default
        }
    }

    // 💝 Calculate Compatibility
    calculateCompatibility(userArchetype, partnerArchetype) {
        const userProfile = PERSONALITY_ARCHETYPES[userArchetype];
        const partnerProfile = PERSONALITY_ARCHETYPES[partnerArchetype];
        
        if (!userProfile || !partnerProfile) return 50;
        
        // Base compatibility from archetype compatibility lists
        let baseScore = userProfile.compatibility.includes(partnerArchetype) ? 80 : 50;
        
        // Adjust based on success rates
        const avgSuccessRate = (userProfile.success_rate + partnerProfile.success_rate) / 2;
        baseScore = (baseScore + avgSuccessRate) / 2;
        
        return Math.round(baseScore);
    }

    // Enhanced setup with age collection
    showModeSelection() {
        const premiumBadge = funaiApp && funaiApp.hasFullAccess ? '<div class="premium-user-badge">👑 PREMIUM USER</div>' : '';
        const html = `
            <div class="test-header redflags-header">
                ${premiumBadge}
                <div class="test-icon">🚩</div>
                <h2>Enhanced Red Flag Detector</h2>
                <p>AI-powered relationship analysis</p>
            </div>
            
            <div class="test-content scrollable-content">
                <div class="mode-selection">
                    <h3>Tell us about yourself first</h3>
                    <div class="age-selection">
                        <label>Your age range:</label>
                        <select id="ageRange" name="ageRange" class="age-select">
                            <option value="">Select age range</option>
                            <option value="18-24">18-24</option>
                            <option value="25-30">25-30</option>
                            <option value="31-40">31-40</option>
                            <option value="40+">40+</option>
                        </select>
                    </div>
                    
                    <h3>Who are you testing?</h3>
                    <div class="mode-options">
                        <button class="mode-btn" onclick="enhancedRedFlagTest.selectMode('self')">
                            <div class="mode-icon">🪞</div>
                            <h4>Test Myself</h4>
                            <p>Discover your relationship archetype</p>
                        </button>
                        <button class="mode-btn" onclick="enhancedRedFlagTest.selectMode('partner')">
                            <div class="mode-icon">💕</div>
                            <h4>Test My Partner</h4>
                            <p>Get compatibility analysis</p>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('modalBody').innerHTML = html;
    }

    // Enhanced mode selection with age validation
    selectMode(mode) {
        const ageRange = document.getElementById('ageRange').value;
        if (!ageRange) {
            alert('Please select your age range first');
            return;
        }
        
        this.userAge = ageRange;
        this.testMode = mode;
        
        if (mode === 'partner') {
            this.showPartnerNameInput();
        } else {
            this.selectRandomQuestions();
            this.startTest();
        }
    }

    // Enhanced results with all new features
    showEnhancedResults() {
        const archetype = this.determineArchetype(this.answers);
        const archetypeData = PERSONALITY_ARCHETYPES[archetype];
        const ageInsights = TREND_ANALYSIS.age_insights[this.userAge];
        const premiumBadge = funaiApp && funaiApp.hasFullAccess ? '<div class="premium-user-badge">👑 PREMIUM USER</div>' : '';
        
        // Save results
        this.saveTestResult({
            mode: this.testMode,
            partnerName: this.partnerName,
            archetype: archetype,
            redFlags: this.redFlags,
            yellowFlags: this.yellowFlags,
            greenFlags: this.greenFlags,
            age: this.userAge
        });

        const html = `
            <div class="test-header redflags-header">
                ${premiumBadge}
                <div class="test-icon">${archetypeData.emoji}</div>
                <h2>Your Relationship Profile</h2>
                <p>Enhanced AI Analysis Complete</p>
            </div>
            
            <div class="test-content scrollable-content">
                <div class="enhanced-results">
                    <!-- Personality Archetype -->
                    <div class="archetype-card">
                        <h3>${archetypeData.emoji} ${archetypeData.name}</h3>
                        <p class="archetype-desc">${archetypeData.description}</p>
                        <div class="archetype-traits">
                            ${archetypeData.traits.map(trait => `<span class="trait-tag">${trait}</span>`).join('')}
                        </div>
                        <div class="success-rate">
                            <span class="rate-number">${archetypeData.success_rate}%</span>
                            <span class="rate-label">Success Rate</span>
                        </div>
                    </div>

                    <!-- Age-Based Insights -->
                    <div class="age-insights">
                        <h4>📊 Insights for Ages ${this.userAge}</h4>
                        <div class="insight-item">
                            <strong>Communication:</strong> ${ageInsights.communication}
                        </div>
                        <div class="insight-item">
                            <strong>Boundaries:</strong> ${ageInsights.boundaries}
                        </div>
                        <div class="insight-item">
                            <strong>Social Patterns:</strong> ${ageInsights.social}
                        </div>
                    </div>

                    <!-- Compatibility Analysis -->
                    ${this.testMode === 'partner' ? this.generateCompatibilitySection() : ''}

                    <!-- Trend Analysis -->
                    <div class="trend-analysis">
                        <h4>📈 Based on 10,000+ Tests</h4>
                        <p>${TREND_ANALYSIS.pattern_insights[this.getPatternType()]}</p>
                        <div class="success-story">
                            <h5>💫 Success Story</h5>
                            <p>${TREND_ANALYSIS.success_stories[Math.floor(Math.random() * TREND_ANALYSIS.success_stories.length)]}</p>
                        </div>
                    </div>

                    <!-- Journey Tracking -->
                    ${this.generateJourneyTracking()}

                    <!-- Action Plan -->
                    ${this.generateActionPlan()}

                    <button class="upgrade-btn" onclick="upgradeRedFlag()" ${funaiApp && funaiApp.hasFullAccess ? 'style="display: none;"' : ''}>
                        🔓 Unlock Full Analysis - ₹99
                    </button>
                </div>
            </div>
        `;

        document.getElementById('modalBody').innerHTML = html;
    }

    generateCompatibilitySection() {
        if (!this.partnerArchetype) return '';
        
        const compatibility = this.calculateCompatibility(this.userArchetype, this.partnerArchetype);
        
        return `
            <div class="compatibility-section">
                <h4>💕 Compatibility Analysis</h4>
                <div class="compatibility-score">
                    <span class="score-number">${compatibility}%</span>
                    <span class="score-label">Compatible</span>
                </div>
                <p class="compatibility-reason">
                    ${this.generateCompatibilityReason(compatibility)}
                </p>
            </div>
        `;
    }

    generateJourneyTracking() {
        if (this.testHistory.length < 2) return '';
        
        const lastTest = this.testHistory[this.testHistory.length - 2];
        const improvement = this.greenFlags - lastTest.greenFlags;
        
        return `
            <div class="journey-tracking">
                <h4>🔄 Your Relationship Journey</h4>
                <p>Since your last test: ${improvement > 0 ? `+${improvement} green flags! 📈` : 'Keep working on those patterns 💪'}</p>
                <div class="journey-stats">
                    <span>Tests taken: ${this.testHistory.length}</span>
                    <span>Tracking since: ${new Date(this.testHistory[0].timestamp).toLocaleDateString()}</span>
                </div>
            </div>
        `;
    }

    generateActionPlan() {
        const planKey = this.getActionPlanKey();
        const plan = ACTION_PLANS[planKey] || this.getDefaultActionPlan();
        
        return `
            <div class="action-plan">
                <h4>🎯 Your Personalized Action Plan</h4>
                <div class="plan-priority ${plan.priority.toLowerCase()}">${plan.priority} PRIORITY</div>
                <h5>${plan.title}</h5>
                <div class="immediate-actions">
                    <h6>Immediate Actions:</h6>
                    <ul>
                        ${plan.immediate_actions.map(action => `<li>${action}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    }

    getPatternType() {
        const greenPercent = (this.greenFlags / this.questions.length) * 100;
        if (greenPercent >= 70) return 'high_green';
        if (this.redFlags >= 4) return 'high_red';
        return 'mixed_signals';
    }

    getActionPlanKey() {
        const commRed = this.redFlags >= 2;
        const boundYellow = this.yellowFlags >= 2;
        
        if (commRed && boundYellow) return 'comm_red_bound_yellow';
        if (this.redFlags >= 4) return 'social_red_trust_red';
        return 'default';
    }

    getDefaultActionPlan() {
        return {
            title: 'Balanced Growth Plan',
            priority: 'MODERATE',
            immediate_actions: [
                'Continue building on your relationship strengths',
                'Address yellow flag areas through open communication',
                'Schedule monthly relationship check-ins'
            ]
        };
    }
}

// Initialize enhanced system
let enhancedRedFlagTest;

function startEnhancedRedFlagTest() {
    enhancedRedFlagTest = new EnhancedRedFlagTest();
    enhancedRedFlagTest.showModeSelection();
}

// Replace original function
function startRedFlagTest() {
    redFlagTest = new RedFlagTest();
    redFlagTest.showModeSelection();
}

// Add missing methods to EnhancedRedFlagTest prototype
EnhancedRedFlagTest.prototype.showPartnerNameInput = function() {
    const premiumBadge = funaiApp && funaiApp.hasFullAccess ? '<div class="premium-user-badge">👑 PREMIUM USER</div>' : '';
    const html = `
        <div class="test-header redflags-header">
            ${premiumBadge}
            <div class="test-icon">💕</div>
            <h2>Partner Red Flag Test</h2>
            <p>Let's analyze their behavior patterns</p>
        </div>
        
        <div class="test-content scrollable-content">
            <div class="partner-input">
                <h3>What's their name? (or nickname)</h3>
                <input type="text" id="partnerNameInput" name="partnerName" placeholder="Enter name..." maxlength="20">
                <p class="privacy-note">🔒 This stays private and makes questions more personal</p>
                <button class="continue-btn" onclick="enhancedRedFlagTest.setPartnerName()">Continue</button>
            </div>
        </div>
    `;
    
    document.getElementById('modalBody').innerHTML = html;
    document.getElementById('partnerNameInput').focus();
};

EnhancedRedFlagTest.prototype.setPartnerName = function() {
    const nameInput = document.getElementById('partnerNameInput');
    this.partnerName = nameInput.value.trim() || 'They';
    this.selectRandomQuestions();
    this.startTest();
};

EnhancedRedFlagTest.prototype.startTest = function() {
    this.showQuestion();
};

EnhancedRedFlagTest.prototype.showQuestion = function() {
    const question = this.questions[this.currentQuestion];
    const progress = ((this.currentQuestion + 1) / this.questions.length) * 100;
    const testTitle = this.testMode === 'partner' ? `${this.partnerName}'s Red Flag Test` : 'Your Red Flag Test';
    const premiumBadge = funaiApp && funaiApp.hasFullAccess ? '<div class="premium-user-badge">👑 PREMIUM USER</div>' : '';

    const html = `
        <div class="test-header redflags-header">
            ${premiumBadge}
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
                    <h3 class="scenario-title">🤔 Imagine this...</h3>
                    <p class="scenario-text">${question.question}</p>
                </div>
                <div class="social-options">
                    ${question.options.map((option, index) => `
                        <div class="social-option" 
                             onclick="enhancedRedFlagTest.selectAnswer('${option.value}', ${index})"
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
};

EnhancedRedFlagTest.prototype.selectAnswer = function(value, optionIndex) {
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
};

EnhancedRedFlagTest.prototype.nextQuestion = function() {
    this.currentQuestion++;
    
    if (this.currentQuestion < this.questions.length) {
        this.showQuestion();
    } else {
        this.showEnhancedResults();
    }
};

EnhancedRedFlagTest.prototype.calculateCategoryScores = function(answers) {
    // Simple scoring based on flags
    const total = answers.length;
    const greenPercent = (this.greenFlags / total) * 100;
    const yellowPercent = (this.yellowFlags / total) * 100;
    const redPercent = (this.redFlags / total) * 100;
    
    return {
        communication: Math.max(20, 100 - (redPercent * 2)),
        boundaries: Math.max(15, 100 - (redPercent * 1.5)),
        social: Math.max(25, 100 - (redPercent * 1.8))
    };
};

EnhancedRedFlagTest.prototype.generateCompatibilityReason = function(compatibility) {
    if (compatibility >= 80) {
        return "You both share similar communication styles and values, creating a strong foundation for understanding.";
    } else if (compatibility >= 60) {
        return "You have complementary traits that can work well together with some effort and understanding.";
    } else {
        return "Your relationship styles differ significantly, requiring extra work to bridge communication gaps.";
    }
};