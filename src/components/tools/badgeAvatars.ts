/**
 * Built-in avatar icons for Employee Badge Tool
 * Encoded as SVG Data URLs for instantaneous rendering in canvas and preview
 */

export const AVATAR_HIJAB_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <circle cx="250" cy="250" r="245" fill="#f8fafc" stroke="#e2e8f0" stroke-width="8"/>
  <g transform="translate(0, 10)">
    <path d="M 250,55 C 175,55 125,120 120,220 C 115,310 80,380 40,430 C 90,448 160,455 250,455 C 340,455 410,448 460,430 C 420,380 385,310 380,220 C 375,120 325,55 250,55 Z" fill="#1e293b"/>
    <path d="M 120,270 C 170,350 250,380 375,340 C 310,400 210,420 55,410 C 80,360 105,315 120,270 Z" fill="#0f172a"/>
    <path d="M 70,370 C 130,410 220,428 350,370 C 375,400 395,420 440,430 C 380,448 300,455 250,455 C 160,455 90,445 40,430 C 50,410 60,390 70,370 Z" fill="#090d16"/>
    <path d="M 120,270 Q 200,365 375,340" fill="none" stroke="#ffffff" stroke-width="7" stroke-linecap="round"/>
    <path d="M 50,395 Q 180,445 440,415" fill="none" stroke="#ffffff" stroke-width="7" stroke-linecap="round"/>
    <path d="M 250,75 C 205,75 180,120 180,165 Q 220,135 250,135 Q 280,135 320,165 C 320,120 295,75 250,75 Z" fill="#0f172a" stroke="#ffffff" stroke-width="3"/>
    <path d="M 250,115 C 195,115 180,175 180,240 C 180,310 215,355 250,355 C 285,355 320,310 320,240 C 320,175 305,115 250,115 Z" fill="#ffffff" stroke="#ffffff" stroke-width="3"/>
  </g>
</svg>`;

export const AVATAR_SUIT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <circle cx="250" cy="250" r="245" fill="#f8fafc" stroke="#e2e8f0" stroke-width="8"/>
  <g>
    <path d="M 70,440 C 85,350 140,300 200,295 L 215,360 L 250,440 L 285,360 L 300,295 C 360,300 415,350 430,440 C 380,455 320,460 250,460 C 180,460 120,455 70,440 Z" fill="#64748b"/>
    <path d="M 160,310 L 205,375 L 245,440 L 220,440 L 175,370 L 140,335 Z" fill="#334155"/>
    <path d="M 340,310 L 295,375 L 255,440 L 280,440 L 325,370 L 360,335 Z" fill="#334155"/>
    <path d="M 200,285 L 250,335 L 300,285 L 275,255 L 225,255 Z" fill="#ffffff"/>
    <path d="M 215,265 L 250,335 L 210,360 Z" fill="#f1f5f9"/>
    <path d="M 285,265 L 250,335 L 290,360 Z" fill="#f1f5f9"/>
    <polygon points="238,325 262,325 258,345 242,345" fill="#0097a7"/>
    <polygon points="242,345 258,345 266,430 250,445 234,430" fill="#00bcd4"/>
    <path d="M 220,220 L 220,270 C 220,285 280,285 280,270 L 280,220 Z" fill="#fbc7a6"/>
    <path d="M 220,235 C 235,255 265,255 280,235 L 280,260 C 270,275 230,275 220,260 Z" fill="#e5aa85"/>
    <ellipse cx="172" cy="185" rx="14" ry="24" fill="#fbd5b5"/>
    <ellipse cx="328" cy="185" rx="14" ry="24" fill="#fbd5b5"/>
    <path d="M 250,75 C 190,75 180,125 180,180 C 180,235 205,270 250,270 C 295,270 320,235 320,180 C 320,125 310,75 250,75 Z" fill="#fbd5b5"/>
    <path d="M 250,70 C 190,70 172,105 172,160 C 172,175 178,185 182,185 C 185,150 195,120 220,115 C 240,110 270,125 295,115 C 315,120 322,150 325,185 C 328,185 332,175 332,160 C 332,105 310,70 250,70 Z" fill="#1e293b"/>
  </g>
</svg>`;

export const AVATAR_NEUTRAL_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <circle cx="250" cy="250" r="245" fill="#f1f5f9" stroke="#e2e8f0" stroke-width="8"/>
  <g fill="#94a3b8">
    <circle cx="250" cy="180" r="85"/>
    <path d="M 80,440 C 95,330 170,290 250,290 C 330,290 405,330 420,440 C 370,455 310,460 250,460 C 190,460 130,455 80,440 Z"/>
  </g>
</svg>`;

export const AVATAR_HIJAB_DATA_URL = 'data:image/svg+xml;utf8,' + encodeURIComponent(AVATAR_HIJAB_SVG);
export const AVATAR_SUIT_DATA_URL = 'data:image/svg+xml;utf8,' + encodeURIComponent(AVATAR_SUIT_SVG);
export const AVATAR_NEUTRAL_DATA_URL = 'data:image/svg+xml;utf8,' + encodeURIComponent(AVATAR_NEUTRAL_SVG);
