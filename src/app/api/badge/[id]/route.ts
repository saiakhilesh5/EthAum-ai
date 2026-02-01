import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: startupId } = await params;

  // In production, fetch real data from database
  // For now, return a placeholder badge SVG
  const trustScore = 85.5;
  const scoreColor = trustScore >= 80 ? '#22c55e' : trustScore >= 60 ? '#eab308' : '#ef4444';

  // Generate SVG badge
  const svg = `
    <svg width="320" height="80" xmlns="http://www.w3.org/2000/svg">
      <rect width="320" height="80" rx="12" fill="white" stroke="#e5e7eb" stroke-width="1"/>
      
      <!-- Logo background -->
      <defs>
        <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#7c3aed"/>
          <stop offset="100%" style="stop-color:#4f46e5"/>
        </linearGradient>
      </defs>
      <rect x="16" y="20" width="40" height="40" rx="8" fill="url(#logoGrad)"/>
      <text x="36" y="47" text-anchor="middle" fill="white" font-family="system-ui, sans-serif" font-size="18" font-weight="bold">E</text>
      
      <!-- Text -->
      <text x="70" y="35" fill="#111" font-family="system-ui, sans-serif" font-size="14" font-weight="600">EthAum.ai Verified</text>
      <text x="70" y="52" fill="#666" font-family="system-ui, sans-serif" font-size="12">Trust Score</text>
      
      <!-- Score box -->
      <rect x="220" y="16" width="84" height="48" rx="8" fill="#f9fafb"/>
      <text x="262" y="50" text-anchor="middle" fill="${scoreColor}" font-family="system-ui, sans-serif" font-size="24" font-weight="bold">${trustScore.toFixed(1)}</text>
    </svg>
  `;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
