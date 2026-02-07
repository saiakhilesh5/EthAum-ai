import { NextRequest, NextResponse } from 'next/server';
import { DEMO_STARTUPS } from '@src/lib/demo-data';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Try to find the startup by ID
  let startup = DEMO_STARTUPS.find(s => s.id === id);
  
  // If not found by ID, try by slug/name
  if (!startup) {
    startup = DEMO_STARTUPS.find(s => 
      s.name.toLowerCase().replace(/\s+/g, '-') === id.toLowerCase()
    );
  }

  // Default values if startup not found
  const name = startup?.name || 'Your Startup';
  const score = startup?.credibility_score || 74;
  const isVerified = startup?.is_verified || false;

  // Determine badge color based on score
  let scoreColor = '#ef4444'; // red
  let badgeColor = '#fee2e2';
  let statusText = 'Building Credibility';
  
  if (score >= 80) {
    scoreColor = '#22c55e'; // green
    badgeColor = '#dcfce7';
    statusText = 'Enterprise Ready';
  } else if (score >= 60) {
    scoreColor = '#f59e0b'; // amber
    badgeColor = '#fef3c7';
    statusText = 'Growing Trust';
  } else if (score >= 40) {
    scoreColor = '#f97316'; // orange
    badgeColor = '#ffedd5';
    statusText = 'Establishing';
  }

  // Generate SVG badge
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="80" viewBox="0 0 200 80">
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
      <stop offset="100%" style="stop-color:${badgeColor};stop-opacity:1" />
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.1"/>
    </filter>
  </defs>
  
  <!-- Badge background -->
  <rect x="4" y="4" width="192" height="72" rx="8" fill="url(#bgGradient)" stroke="#e5e7eb" stroke-width="1" filter="url(#shadow)"/>
  
  <!-- Shield icon -->
  <g transform="translate(15, 20)">
    <path d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V8.26l7-3.89v8.63z" fill="${scoreColor}"/>
    ${isVerified ? '<circle cx="18" cy="6" r="5" fill="#22c55e"/><path d="M17.5 8L16 6.5L16.5 6L17.5 7L19.5 5L20 5.5L17.5 8Z" fill="white"/>' : ''}
  </g>
  
  <!-- Score circle -->
  <g transform="translate(155, 40)">
    <circle cx="0" cy="0" r="22" fill="${scoreColor}" opacity="0.1"/>
    <circle cx="0" cy="0" r="18" fill="${scoreColor}"/>
    <text x="0" y="6" text-anchor="middle" fill="white" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="bold">${score}</text>
  </g>
  
  <!-- Text content -->
  <text x="48" y="30" font-family="system-ui, -apple-system, sans-serif" font-size="10" fill="#6b7280">EthAum.ai Verified</text>
  <text x="48" y="48" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="600" fill="#111827">${name.length > 15 ? name.substring(0, 14) + '...' : name}</text>
  <text x="48" y="64" font-family="system-ui, -apple-system, sans-serif" font-size="9" fill="${scoreColor}" font-weight="500">${statusText}</text>
</svg>
  `.trim();

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
