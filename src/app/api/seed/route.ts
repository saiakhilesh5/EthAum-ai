import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@src/lib/db/supabase-server';

// Industry categories
const INDUSTRIES = [
  'Enterprise Software', 'Cybersecurity', 'Data Analytics', 'Business Intelligence',
  'Healthcare', 'Fintech', 'DevOps', 'AI/ML', 'Cloud Infrastructure', 'HR Tech',
  'Marketing Tech', 'Sales Tech', 'Legal Tech', 'Supply Chain', 'IoT'
];

const STAGES = ['series_a', 'series_b', 'series_c', 'series_d'];

const STARTUP_DATA = [
  { name: 'CloudScale AI', tagline: 'AI-powered cloud infrastructure optimization', industry: 'Cloud Infrastructure' },
  { name: 'SecureFlow', tagline: 'Zero-trust security for modern enterprises', industry: 'Cybersecurity' },
  { name: 'DataBridge', tagline: 'Unified data platform for analytics', industry: 'Data Analytics' },
  { name: 'WorkflowHQ', tagline: 'AI-powered business process automation', industry: 'Business Intelligence' },
  { name: 'HealthSync', tagline: 'Connected healthcare data platform', industry: 'Healthcare' },
  { name: 'FinanceGuard', tagline: 'AI fraud detection for fintech', industry: 'Fintech' },
  { name: 'DevOpsNinja', tagline: 'Automated CI/CD pipeline management', industry: 'DevOps' },
  { name: 'AIAssist Pro', tagline: 'Enterprise AI assistant platform', industry: 'AI/ML' },
  { name: 'CloudVault', tagline: 'Secure cloud storage for enterprises', industry: 'Cloud Infrastructure' },
  { name: 'TalentFlow', tagline: 'AI-driven talent acquisition platform', industry: 'HR Tech' },
  { name: 'MarketPulse', tagline: 'Real-time market intelligence', industry: 'Marketing Tech' },
  { name: 'SalesForce AI', tagline: 'Predictive sales analytics', industry: 'Sales Tech' },
  { name: 'LegalEase', tagline: 'AI contract analysis and management', industry: 'Legal Tech' },
  { name: 'SupplyLogic', tagline: 'Intelligent supply chain optimization', industry: 'Supply Chain' },
  { name: 'IoTConnect', tagline: 'Enterprise IoT device management', industry: 'IoT' },
  { name: 'CyberShield', tagline: 'Next-gen endpoint protection', industry: 'Cybersecurity' },
  { name: 'DataLens', tagline: 'Visual analytics for big data', industry: 'Data Analytics' },
  { name: 'AutomateX', tagline: 'No-code workflow automation', industry: 'Business Intelligence' },
  { name: 'ComplianceHub', tagline: 'Regulatory compliance automation', industry: 'Legal Tech' },
  { name: 'RiskRadar', tagline: 'Enterprise risk management platform', industry: 'Fintech' },
  { name: 'PaymentFlow', tagline: 'Unified payment processing', industry: 'Fintech' },
  { name: 'InsureTech', tagline: 'AI-powered insurance underwriting', industry: 'Fintech' },
  { name: 'PropTech AI', tagline: 'Real estate analytics platform', industry: 'Enterprise Software' },
  { name: 'EdTech Pro', tagline: 'Corporate learning management', industry: 'Enterprise Software' },
  { name: 'GreenTech', tagline: 'Carbon footprint tracking for enterprises', industry: 'Enterprise Software' },
  { name: 'RetailAI', tagline: 'AI-powered retail analytics', industry: 'AI/ML' },
  { name: 'LogisticsHub', tagline: 'Smart logistics optimization', industry: 'Supply Chain' },
  { name: 'MediaSync', tagline: 'Enterprise media asset management', industry: 'Marketing Tech' },
  { name: 'TravelTech', tagline: 'Corporate travel management', industry: 'Enterprise Software' },
  { name: 'FoodTech AI', tagline: 'Supply chain for food industry', industry: 'Supply Chain' },
];

const ENTERPRISE_DATA = [
  { company_name: 'Fortune Tech Corp', industry: 'Technology', company_size: '10000+', headquarters: 'San Jose, CA' },
  { company_name: 'Global Financial Services', industry: 'Financial Services', company_size: '5000-10000', headquarters: 'New York, NY' },
  { company_name: 'HealthCare United', industry: 'Healthcare', company_size: '10000+', headquarters: 'Boston, MA' },
  { company_name: 'SecureTech Industries', industry: 'Technology', company_size: '1000-5000', headquarters: 'Austin, TX' },
  { company_name: 'DataFirst Global', industry: 'Technology', company_size: '5000-10000', headquarters: 'Seattle, WA' },
  { company_name: 'CloudNative Enterprise', industry: 'Technology', company_size: '1000-5000', headquarters: 'San Francisco, CA' },
  { company_name: 'FinanceFirst Corp', industry: 'Financial Services', company_size: '10000+', headquarters: 'Chicago, IL' },
  { company_name: 'TechLeaders Inc', industry: 'Technology', company_size: '5000-10000', headquarters: 'Denver, CO' },
  { company_name: 'InnoVentures', industry: 'Venture Capital', company_size: '100-500', headquarters: 'Palo Alto, CA' },
  { company_name: 'ScaleUp Holdings', industry: 'Private Equity', company_size: '100-500', headquarters: 'New York, NY' },
  { company_name: 'Enterprise Solutions Group', industry: 'Consulting', company_size: '1000-5000', headquarters: 'Washington, DC' },
  { company_name: 'Digital Transformation Inc', industry: 'Technology', company_size: '500-1000', headquarters: 'Atlanta, GA' },
  { company_name: 'NextGen Corp', industry: 'Technology', company_size: '1000-5000', headquarters: 'Miami, FL' },
  { company_name: 'FutureTech Enterprises', industry: 'Technology', company_size: '5000-10000', headquarters: 'Dallas, TX' },
  { company_name: 'SmartBusiness Inc', industry: 'Consulting', company_size: '500-1000', headquarters: 'Phoenix, AZ' },
  { company_name: 'TechForward Corp', industry: 'Technology', company_size: '1000-5000', headquarters: 'Portland, OR' },
  { company_name: 'Innovation Hub', industry: 'Venture Capital', company_size: '50-100', headquarters: 'San Francisco, CA' },
  { company_name: 'Growth Partners', industry: 'Private Equity', company_size: '100-500', headquarters: 'Boston, MA' },
  { company_name: 'Strategic Tech', industry: 'Consulting', company_size: '500-1000', headquarters: 'Minneapolis, MN' },
  { company_name: 'Global Operations Ltd', industry: 'Manufacturing', company_size: '10000+', headquarters: 'Detroit, MI' },
];

const REVIEWER_NAMES = [
  'Sarah Chen', 'Michael Rodriguez', 'Emily Watson', 'David Kim', 'Jessica Taylor',
  'Robert Johnson', 'Amanda Lee', 'Christopher Brown', 'Michelle Garcia', 'Daniel Wilson',
  'Jennifer Martinez', 'James Anderson', 'Lisa Thompson', 'William Harris', 'Elizabeth Clark',
  'John Davis', 'Patricia Moore', 'Richard White', 'Barbara Jackson', 'Thomas Miller',
];

const ROLES = [
  'VP of Engineering', 'CTO', 'CISO', 'Head of Product', 'Director of IT',
  'Chief Data Officer', 'VP of Operations', 'Head of Security', 'IT Manager', 'Tech Lead'
];

const REVIEW_TITLES = [
  'Game-changer for our team!',
  'Best investment we made this year',
  'Exceeded all expectations',
  'Highly recommended for enterprises',
  'Transformed our workflow',
  'Outstanding product and support',
  'Perfect for scaling teams',
  'Saved us thousands in costs',
  'Incredible ROI in just weeks',
  'Best-in-class solution',
];

export async function POST(request: NextRequest) {
  // Check for secret key to prevent unauthorized seeding
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  
  if (secret !== process.env.SEED_SECRET && secret !== 'hackathon2024') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = await createServerSupabaseClient();
  const results: any = { startups: 0, enterprises: 0, launches: 0, reviews: 0, matches: 0 };

  try {
    // Check if data already exists
    const { count: existingStartups } = await supabase
      .from('startups')
      .select('*', { count: 'exact', head: true });
    
    if (existingStartups && existingStartups > 0) {
      return NextResponse.json({
        success: true,
        message: 'Database already has data',
        existing: { startups: existingStartups }
      });
    }

    // 1. Seed Startups - using only core fields that should exist
    const startups = STARTUP_DATA.map((s, i) => ({
      name: s.name,
      slug: s.name.toLowerCase().replace(/\s+/g, '-'),
      tagline: s.tagline,
      description: `${s.name} provides cutting-edge ${s.industry.toLowerCase()} solutions for modern enterprises.`,
      logo_url: `https://api.dicebear.com/7.x/shapes/svg?seed=${s.name.toLowerCase().replace(/\s+/g, '')}`,
      website_url: `https://${s.name.toLowerCase().replace(/\s+/g, '')}.com`,
      industry: s.industry,
      stage: STAGES[i % STAGES.length],
      credibility_score: 70 + (i * 2 % 28),
      total_upvotes: 100 + i * 45,
      total_reviews: 5 + i * 3,
      is_verified: i < 25,
      is_featured: i < 10,
    }));

    const { data: insertedStartups, error: startupError } = await supabase
      .from('startups')
      .insert(startups)
      .select();

    if (startupError) throw new Error(`Startup error: ${startupError.message}`);
    results.startups = insertedStartups?.length || 0;

    // 2. Seed Enterprises - using only core fields
    const enterprises = ENTERPRISE_DATA.map((e, i) => ({
      company_name: e.company_name,
      industry: e.industry,
      company_size: e.company_size,
      is_verified: true,
    }));

    const { data: insertedEnterprises, error: enterpriseError } = await supabase
      .from('enterprises')
      .insert(enterprises)
      .select();

    if (enterpriseError) throw new Error(`Enterprise error: ${enterpriseError.message}`);
    results.enterprises = insertedEnterprises?.length || 0;

    // 3. Seed Launches
    if (insertedStartups && insertedStartups.length > 0) {
      const launches = insertedStartups.slice(0, 15).map((startup, i) => ({
        startup_id: startup.id,
        title: `${startup.name} ${['2.0', '3.0', 'Pro', 'Enterprise', 'AI'][i % 5]} - Major Release`,
        tagline: `Introducing breakthrough features for ${startup.industry}`,
        description: `We're excited to announce our biggest release yet! This version includes AI-powered analytics, improved performance, and new enterprise features.`,
        thumbnail_url: `https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800`,
        upvote_count: 80 + i * 25,
        comment_count: 15 + i * 5,
        view_count: 500 + i * 150,
        launch_date: new Date(Date.now() - i * 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'live',
        is_featured: i < 5,
        featured_badge: i < 3 ? ['Product of the Day', 'Top Product', 'Most Innovative'][i] : null,
      }));

      const { data: insertedLaunches, error: launchError } = await supabase
        .from('launches')
        .insert(launches)
        .select();

      if (!launchError) results.launches = insertedLaunches?.length || 0;

      // 4. Seed Reviews
      const reviews: any[] = [];
      insertedStartups.forEach((startup, si) => {
        const numReviews = 3 + (si % 3);
        for (let i = 0; i < numReviews; i++) {
          const rating = [5, 5, 5, 4, 4, 3][i % 6];
          reviews.push({
            startup_id: startup.id,
            overall_rating: rating,
            title: REVIEW_TITLES[(si + i) % REVIEW_TITLES.length],
            content: `We've been using ${startup.name} for ${3 + i} months now and it has completely transformed our operations. The platform is intuitive, reliable, and the support team is incredibly responsive.`,
            pros: ['Easy setup', 'Great support', 'Reliable performance', 'Good value'],
            cons: rating < 5 ? ['Learning curve for advanced features'] : [],
            is_verified: true,
            helpful_count: 5 + (si * 2 % 30),
          });
        }
      });

      const { data: insertedReviews, error: reviewError } = await supabase
        .from('reviews')
        .insert(reviews)
        .select();

      if (!reviewError) results.reviews = insertedReviews?.length || 0;

      // 5. Seed Matches
      if (insertedEnterprises && insertedEnterprises.length > 0) {
        const matches: any[] = [];
        insertedStartups.forEach((startup, si) => {
          const numMatches = 2 + (si % 2);
          for (let i = 0; i < numMatches; i++) {
            const enterprise = insertedEnterprises[(si + i) % insertedEnterprises.length];
            matches.push({
              startup_id: startup.id,
              enterprise_id: enterprise.id,
              match_score: 70 + (si * 3 % 28),
              match_reasons: ['Industry alignment', 'Technology fit', 'Budget compatibility'].slice(0, 2 + (si % 2)),
              status: ['pending', 'interested', 'connected'][si % 3],
            });
          }
        });

        const { data: insertedMatches, error: matchError } = await supabase
          .from('matches')
          .insert(matches)
          .select();

        if (!matchError) results.matches = insertedMatches?.length || 0;
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully!',
      results,
    });

  } catch (error: any) {
    console.error('Seeding error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      results 
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  // Also allow GET with secret for easier testing via browser
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  
  if (secret === process.env.SEED_SECRET || secret === 'hackathon2024') {
    // Redirect the request to POST handler
    return POST(request);
  }

  return NextResponse.json({
    message: 'POST to this endpoint with ?secret=hackathon2024 to seed the database',
    warning: 'This will add demo data to your database',
  });
}
