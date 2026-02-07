// Demo data for showcasing the platform when database is empty or not connected
// This provides realistic sample data for judges to see the full platform functionality

// When true: Always fetch from database first, fall back to demo if empty
// When false: Only use database data, no demo fallback
export const DEMO_MODE = false; // Disabled - all data now comes from database

// Demo Startups
export const DEMO_STARTUPS = [
  {
    id: 'demo-startup-1',
    name: 'CloudScale AI',
    slug: 'cloudscale-ai',
    tagline: 'AI-powered cloud infrastructure optimization',
    description: 'CloudScale AI uses machine learning to automatically optimize cloud infrastructure costs and performance. Our platform reduces AWS/Azure/GCP bills by up to 40% while improving application performance.',
    logo_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=cloudscale',
    website_url: 'https://cloudscale.ai',
    industry: 'Enterprise Software',
    stage: 'series_a',
    arr_range: '$1M-$5M',
    team_size: '11-50',
    founding_year: 2022,
    headquarters: 'San Francisco, CA',
    credibility_score: 87,
    total_upvotes: 342,
    total_reviews: 28,
    is_verified: true,
    is_featured: true,
    tech_stack: ['Python', 'TensorFlow', 'AWS', 'Kubernetes', 'React'],
    use_cases: ['Cost Optimization', 'Auto-scaling', 'Performance Monitoring'],
    target_customers: ['Enterprise', 'Mid-Market'],
    user_id: 'demo-user-1',
  },
  {
    id: 'demo-startup-2',
    name: 'SecureFlow',
    slug: 'secureflow',
    tagline: 'Zero-trust security for modern enterprises',
    description: 'SecureFlow provides comprehensive zero-trust security solutions for enterprises. Our platform protects your data, applications, and users with AI-driven threat detection.',
    logo_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=secureflow',
    website_url: 'https://secureflow.io',
    industry: 'Cybersecurity',
    stage: 'series_b',
    arr_range: '$5M-$10M',
    team_size: '51-200',
    founding_year: 2020,
    headquarters: 'Austin, TX',
    credibility_score: 92,
    total_upvotes: 567,
    total_reviews: 45,
    is_verified: true,
    is_featured: true,
    tech_stack: ['Rust', 'Go', 'Kubernetes', 'React', 'PostgreSQL'],
    use_cases: ['Zero Trust', 'Threat Detection', 'Compliance'],
    target_customers: ['Enterprise', 'Government'],
    user_id: 'demo-user-2',
  },
  {
    id: 'demo-startup-3',
    name: 'DataBridge',
    slug: 'databridge',
    tagline: 'Unified data platform for analytics',
    description: 'DataBridge connects all your data sources and provides real-time analytics with AI-powered insights. Built for data teams who want to move fast.',
    logo_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=databridge',
    website_url: 'https://databridge.io',
    industry: 'Data Analytics',
    stage: 'seed',
    arr_range: '$500K-$1M',
    team_size: '1-10',
    founding_year: 2023,
    headquarters: 'New York, NY',
    credibility_score: 78,
    total_upvotes: 189,
    total_reviews: 15,
    is_verified: true,
    is_featured: false,
    tech_stack: ['Python', 'Apache Spark', 'Snowflake', 'dbt', 'React'],
    use_cases: ['ETL', 'Real-time Analytics', 'Data Governance'],
    target_customers: ['SMB', 'Mid-Market'],
    user_id: 'demo-user-3',
  },
  {
    id: 'demo-startup-4',
    name: 'WorkflowHQ',
    slug: 'workflowhq',
    tagline: 'AI-powered business process automation',
    description: 'WorkflowHQ automates complex business processes using AI. From invoice processing to customer onboarding, we help enterprises save thousands of hours.',
    logo_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=workflowhq',
    website_url: 'https://workflowhq.com',
    industry: 'Business Intelligence',
    stage: 'series_a',
    arr_range: '$1M-$5M',
    team_size: '11-50',
    founding_year: 2021,
    headquarters: 'Seattle, WA',
    credibility_score: 84,
    total_upvotes: 278,
    total_reviews: 32,
    is_verified: true,
    is_featured: true,
    tech_stack: ['Node.js', 'Python', 'OpenAI', 'PostgreSQL', 'React'],
    use_cases: ['Document Processing', 'Workflow Automation', 'Integration'],
    target_customers: ['Enterprise', 'Mid-Market'],
    user_id: 'demo-user-4',
  },
  {
    id: 'demo-startup-5',
    name: 'HealthSync',
    slug: 'healthsync',
    tagline: 'Connected healthcare data platform',
    description: 'HealthSync unifies patient data across healthcare systems, enabling better care coordination and outcomes. HIPAA compliant and SOC2 certified.',
    logo_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=healthsync',
    website_url: 'https://healthsync.health',
    industry: 'Healthcare',
    stage: 'series_b',
    arr_range: '$10M+',
    team_size: '51-200',
    founding_year: 2019,
    headquarters: 'Boston, MA',
    credibility_score: 95,
    total_upvotes: 723,
    total_reviews: 58,
    is_verified: true,
    is_featured: true,
    tech_stack: ['Java', 'FHIR', 'AWS', 'React', 'PostgreSQL'],
    use_cases: ['EHR Integration', 'Care Coordination', 'Analytics'],
    target_customers: ['Healthcare', 'Enterprise'],
    user_id: 'demo-user-5',
  },
];

// Demo Launches
export const DEMO_LAUNCHES = [
  {
    id: 'demo-launch-1',
    startup_id: 'demo-startup-1',
    title: 'CloudScale AI 2.0 - Now with Multi-Cloud Support',
    tagline: 'Optimize costs across AWS, Azure, and GCP from one dashboard',
    description: 'We\'re excited to announce CloudScale AI 2.0! Now you can optimize your entire multi-cloud infrastructure from a single dashboard. Features include: AI-powered recommendations, automated rightsizing, and real-time cost alerts.',
    thumbnail_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
    upvote_count: 234,
    comment_count: 45,
    view_count: 1250,
    launch_date: new Date().toISOString(),
    status: 'live',
    is_featured: true,
    featured_badge: 'Product of the Day',
    startup: DEMO_STARTUPS[0],
  },
  {
    id: 'demo-launch-2',
    startup_id: 'demo-startup-2',
    title: 'SecureFlow Zero-Trust 3.0',
    tagline: 'Next-gen security with AI threat prediction',
    description: 'Introducing SecureFlow 3.0 with predictive threat intelligence. Our new AI engine can predict and prevent attacks before they happen, with 99.9% accuracy.',
    thumbnail_url: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800',
    upvote_count: 189,
    comment_count: 32,
    view_count: 890,
    launch_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    status: 'live',
    is_featured: true,
    featured_badge: 'Top Security Product',
    startup: DEMO_STARTUPS[1],
  },
  {
    id: 'demo-launch-3',
    startup_id: 'demo-startup-3',
    title: 'DataBridge - Real-time ETL Pipeline Builder',
    tagline: 'Build production-ready data pipelines in minutes',
    description: 'DataBridge now offers a visual pipeline builder. Drag and drop your data sources, apply transformations, and deploy to production in minutes.',
    thumbnail_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    upvote_count: 145,
    comment_count: 28,
    view_count: 720,
    launch_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'live',
    is_featured: false,
    featured_badge: null,
    startup: DEMO_STARTUPS[2],
  },
  {
    id: 'demo-launch-4',
    startup_id: 'demo-startup-4',
    title: 'WorkflowHQ AI Assistant',
    tagline: 'Natural language workflow automation',
    description: 'Describe your workflow in plain English, and our AI builds it for you. "Send an email to the sales team when a new lead is added" - that\'s all you need!',
    thumbnail_url: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800',
    upvote_count: 312,
    comment_count: 67,
    view_count: 1580,
    launch_date: new Date().toISOString(),
    status: 'live',
    is_featured: true,
    featured_badge: 'Most Innovative',
    startup: DEMO_STARTUPS[3],
  },
];

// Demo Reviews
export const DEMO_REVIEWS = [
  {
    id: 'demo-review-1',
    startup_id: 'demo-startup-1',
    user_id: 'demo-reviewer-1',
    overall_rating: 5,
    title: 'Saved us $50K/month on AWS costs',
    content: 'CloudScale AI has been a game-changer for our infrastructure. Within 2 weeks of implementation, we identified and eliminated $50K in monthly waste. The AI recommendations are spot-on and the dashboard is intuitive.',
    pros: ['Easy setup', 'Accurate recommendations', 'Great ROI', 'Responsive support'],
    cons: ['Learning curve for advanced features'],
    ease_of_use_rating: 4,
    value_for_money_rating: 5,
    customer_support_rating: 5,
    features_rating: 5,
    recommend_likelihood: 10,
    is_verified: true,
    helpful_count: 23,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    reviewer: {
      full_name: 'Sarah Chen',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
      company: 'TechCorp Inc.',
      role: 'VP of Engineering',
    },
  },
  {
    id: 'demo-review-2',
    startup_id: 'demo-startup-1',
    user_id: 'demo-reviewer-2',
    overall_rating: 4,
    title: 'Solid product, great for mid-size companies',
    content: 'We\'ve been using CloudScale AI for 6 months now. The cost optimization features are excellent, though I wish they had more detailed documentation for the API.',
    pros: ['Cost savings', 'Good UI', 'Reliable'],
    cons: ['Documentation could be better', 'Pricing for enterprise tier'],
    ease_of_use_rating: 4,
    value_for_money_rating: 4,
    customer_support_rating: 4,
    features_rating: 4,
    recommend_likelihood: 8,
    is_verified: true,
    helpful_count: 15,
    created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    reviewer: {
      full_name: 'Michael Rodriguez',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=michael',
      company: 'DataFlow Systems',
      role: 'CTO',
    },
  },
  {
    id: 'demo-review-3',
    startup_id: 'demo-startup-2',
    user_id: 'demo-reviewer-3',
    overall_rating: 5,
    title: 'Best zero-trust solution we\'ve evaluated',
    content: 'After evaluating 5 different zero-trust solutions, SecureFlow stood out for its ease of deployment and comprehensive feature set. The threat detection is incredibly accurate.',
    pros: ['Easy deployment', 'Comprehensive features', 'Excellent detection', 'Great compliance tools'],
    cons: ['Premium pricing'],
    ease_of_use_rating: 5,
    value_for_money_rating: 4,
    customer_support_rating: 5,
    features_rating: 5,
    recommend_likelihood: 10,
    is_verified: true,
    helpful_count: 31,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    reviewer: {
      full_name: 'Emily Watson',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emily',
      company: 'FinServe Global',
      role: 'CISO',
    },
  },
];

// Demo Enterprises
export const DEMO_ENTERPRISES = [
  {
    id: 'demo-enterprise-1',
    company_name: 'Fortune 500 Tech Corp',
    logo_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=techcorp',
    industry: 'Technology',
    company_size: '10000+',
    headquarters: 'San Jose, CA',
    is_verified: true,
    looking_for: ['Cloud Infrastructure', 'AI/ML', 'Security'],
    budget_range: '$100K+',
  },
  {
    id: 'demo-enterprise-2',
    company_name: 'Global Financial Services',
    logo_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=finance',
    industry: 'Financial Services',
    company_size: '5000-10000',
    headquarters: 'New York, NY',
    is_verified: true,
    looking_for: ['Cybersecurity', 'Compliance', 'Data Analytics'],
    budget_range: '$500K+',
  },
];

// Demo Matches
export const DEMO_MATCHES = [
  {
    id: 'demo-match-1',
    startup_id: 'demo-startup-1',
    enterprise_id: 'demo-enterprise-1',
    match_score: 94,
    match_reasons: [
      'Strong alignment with cloud optimization needs',
      'Proven ROI in similar enterprise deployments',
      'Tech stack compatibility with your infrastructure',
      'Excellent customer reviews from Fortune 500 companies',
    ],
    status: 'interested',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    startup: DEMO_STARTUPS[0],
    enterprise: DEMO_ENTERPRISES[0],
    ai_insights: {
      deal_probability: 0.87,
      estimated_value: '$250,000',
      implementation_time: '4-6 weeks',
      risk_factors: ['Integration complexity with legacy systems'],
      strengths: ['Strong technical fit', 'Proven enterprise track record'],
    },
  },
  {
    id: 'demo-match-2',
    startup_id: 'demo-startup-2',
    enterprise_id: 'demo-enterprise-2',
    match_score: 91,
    match_reasons: [
      'Zero-trust architecture matches security requirements',
      'SOC2 and HIPAA compliance certifications',
      'Strong financial services customer base',
      'AI threat detection aligns with risk management goals',
    ],
    status: 'pending',
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    startup: DEMO_STARTUPS[1],
    enterprise: DEMO_ENTERPRISES[1],
    ai_insights: {
      deal_probability: 0.82,
      estimated_value: '$500,000',
      implementation_time: '8-12 weeks',
      risk_factors: ['Complex integration with existing security stack'],
      strengths: ['Compliance ready', 'Excellent industry reviews'],
    },
  },
  {
    id: 'demo-match-3',
    startup_id: 'demo-startup-4',
    enterprise_id: 'demo-enterprise-1',
    match_score: 88,
    match_reasons: [
      'Workflow automation aligns with digital transformation goals',
      'AI capabilities match innovation requirements',
      'Scalable for enterprise deployment',
      'Strong integration ecosystem',
    ],
    status: 'connected',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    startup: DEMO_STARTUPS[3],
    enterprise: DEMO_ENTERPRISES[0],
    ai_insights: {
      deal_probability: 0.92,
      estimated_value: '$180,000',
      implementation_time: '2-4 weeks',
      risk_factors: ['Change management for end users'],
      strengths: ['Quick time to value', 'High user adoption rates'],
    },
  },
];

// Demo AI Insights
export const DEMO_AI_INSIGHTS = {
  pitchAnalysis: {
    overall_score: 82,
    strengths: [
      'Clear problem statement that resonates with enterprise buyers',
      'Strong differentiation from competitors',
      'Compelling customer testimonials and case studies',
      'Clear pricing model and value proposition',
    ],
    weaknesses: [
      'Could include more specific ROI metrics',
      'Competitive landscape analysis needs more depth',
      'Team slide could highlight more relevant experience',
    ],
    recommendations: [
      'Add specific ROI numbers from existing customers',
      'Include a product demo video',
      'Highlight unique AI capabilities more prominently',
    ],
    market_fit: 0.78,
    investor_appeal: 0.85,
  },
  dealPrediction: {
    probability: 0.84,
    confidence: 0.92,
    factors: [
      { name: 'Budget Alignment', score: 0.9, impact: 'positive' },
      { name: 'Technical Fit', score: 0.85, impact: 'positive' },
      { name: 'Timeline Match', score: 0.75, impact: 'neutral' },
      { name: 'Stakeholder Buy-in', score: 0.8, impact: 'positive' },
    ],
    next_steps: [
      'Schedule technical deep-dive with IT team',
      'Prepare ROI analysis for CFO presentation',
      'Set up pilot program proposal',
    ],
  },
  sentimentAnalysis: {
    overall: 0.87,
    breakdown: {
      positive: 0.72,
      neutral: 0.23,
      negative: 0.05,
    },
    themes: [
      { theme: 'Customer Support', sentiment: 0.92, mentions: 45 },
      { theme: 'Ease of Use', sentiment: 0.88, mentions: 38 },
      { theme: 'Value for Money', sentiment: 0.85, mentions: 32 },
      { theme: 'Features', sentiment: 0.78, mentions: 28 },
    ],
  },
  market_position: {
    quadrant: 'Leader',
    analysis: 'Based on our AI analysis of 500+ enterprise SaaS companies, NeuralFlow AI positions in the Leader quadrant with strong market presence and high growth trajectory.',
    market_readiness: 92,
    growth_potential: 88,
  },
  deal_predictor: {
    probability: 84,
    time_to_close: '45-60 days',
    confidence: 92,
    estimated_value: 125000,
    key_factors: [
      { factor: 'Enterprise Interest', score: 95, trend: 'up' },
      { factor: 'Review Sentiment', score: 87, trend: 'stable' },
      { factor: 'Market Timing', score: 82, trend: 'up' },
    ],
  },
  recommendations: [
    { action: 'Add more case studies', impact: 'Enterprise buyers value proven results - high impact on credibility', priority: 'high' },
    { action: 'Improve response time', impact: 'Current avg: 4hrs, target: 2hrs - moderate impact on reviews', priority: 'medium' },
    { action: 'Launch a new feature update', impact: 'Keep momentum with regular releases - builds engagement', priority: 'low' },
    { action: 'Request more verified reviews', impact: 'Target 5 more from F500 customers - high impact on score', priority: 'high' },
  ],
};

// Demo Credibility Score
export const DEMO_CREDIBILITY_SCORE = {
  overall_score: 87,
  review_score: 85,
  verification_score: 95,
  engagement_score: 82,
  longevity_score: 88,
  breakdown: {
    reviews: { score: 85, weight: 0.35, description: 'Based on 28 verified reviews' },
    verification: { score: 95, weight: 0.25, description: 'Company and team verified' },
    engagement: { score: 82, weight: 0.25, description: 'Active community engagement' },
    longevity: { score: 88, weight: 0.15, description: 'Consistent growth over 2 years' },
  },
  ai_recommendation: 'Your credibility score is excellent! Focus on collecting 10 more verified enterprise reviews to break into the 90+ range and unlock premium matchmaking.',
  improvements: [
    'Get 10 more verified reviews to boost review score',
    'Increase launch frequency to improve engagement',
    'Add case studies for enterprise credibility',
  ],
};

// Demo Activities
export const DEMO_ACTIVITIES = [
  {
    id: 'act-1',
    type: 'upvote',
    title: 'New Upvote',
    description: 'CloudScale AI 2.0 received an upvote',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    user: { name: 'John D.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john' },
  },
  {
    id: 'act-2',
    type: 'review',
    title: 'New Review',
    description: 'Emily Watson left a 5-star review',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    user: { name: 'Emily W.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emily' },
  },
  {
    id: 'act-3',
    type: 'match',
    title: 'New Match',
    description: 'Matched with Fortune 500 Tech Corp (94% score)',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'act-4',
    type: 'comment',
    title: 'New Comment',
    description: 'Sarah Chen commented on your launch',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    user: { name: 'Sarah C.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah' },
  },
  {
    id: 'act-5',
    type: 'launch',
    title: 'Launch Trending',
    description: 'Your launch is trending on EthAum!',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
  },
];

// Demo Comments
export const DEMO_COMMENTS = [
  {
    id: 'comment-1',
    launch_id: 'demo-launch-1',
    content: 'This is exactly what we needed! Been looking for a multi-cloud solution that actually works. How does it handle reserved instances?',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    user: {
      id: 'user-1',
      full_name: 'Alex Thompson',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
    },
    replies: [
      {
        id: 'reply-1',
        content: 'Great question! We analyze reserved instance utilization and recommend the optimal mix of on-demand, reserved, and spot instances.',
        created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        user: {
          id: 'demo-user-1',
          full_name: 'CloudScale Team',
          avatar_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=cloudscale',
        },
      },
    ],
  },
  {
    id: 'comment-2',
    launch_id: 'demo-launch-1',
    content: 'Congrats on the launch! We\'ve been using v1 and the multi-cloud support is a game-changer. 🚀',
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    user: {
      id: 'user-2',
      full_name: 'Maria Garcia',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria',
    },
    replies: [],
  },
];

// Demo Trend Data
export const DEMO_TRENDS = {
  upvotes: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    value: Math.floor(20 + Math.random() * 30 + i * 1.5),
  })),
  views: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    value: Math.floor(100 + Math.random() * 100 + i * 8),
  })),
  reviews: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    value: Math.floor(Math.random() * 3 + (i > 20 ? 2 : 0)),
  })),
};

// Helper function to get demo data or fall back
export function getDemoStartups() {
  return DEMO_STARTUPS;
}

export function getDemoLaunches() {
  return DEMO_LAUNCHES;
}

export function getDemoReviews(startupId?: string) {
  if (startupId) {
    return DEMO_REVIEWS.filter(r => r.startup_id === startupId);
  }
  return DEMO_REVIEWS;
}

export function getDemoMatches(userType: 'startup' | 'enterprise') {
  return DEMO_MATCHES;
}

export function getDemoStartupById(id: string) {
  return DEMO_STARTUPS.find(s => s.id === id || s.slug === id) || DEMO_STARTUPS[0];
}
