import React from 'react';

const P: Record<string, React.ReactNode> = {
  check: <path d="M5 12.5l4.500 4.500L19 7.500" />,
  x: <path d="M6 6l12 12M18 6L6 18" />,
  plus: <path d="M12 5v14M5 12h14" />,
  pin: <><path d="M12 21s-6.500-5.600-6.500-10.500a6.500 6.500 0 0 1 13 0C18.500 15.400 12 21 12 21z" /><circle cx="12" cy="10.500" r="2.400" /></>,
  car: <><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.700-1.500-1.900C18.700 10.600 16 10 16 10s-1.300-1.400-2.200-2.300c-.5-.4-1.100-.7-1.800-.7H5c-.6 0-1.100.4-1.400.9l-1.400 2.900A3.700 3.700 0 0 0 2 12v4c0 .6.4 1 1 1h2" /><circle cx="7" cy="17" r="2" /><path d="M9 17h6" /><circle cx="17" cy="17" r="2" /></>,
  truck: <><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" /><path d="M15 18H9" /><path d="M19 18h2a1 1 0 0 0 1-1v-3.650a1 1 0 0 0-.220-.624l-3.480-4.350A1 1 0 0 0 17.520 8H14" /><circle cx="17" cy="18" r="2" /><circle cx="7" cy="18" r="2" /></>,
  database: <><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v14a9 3 0 0 0 18 0V5" /><path d="M3 12a9 3 0 0 0 18 0" /></>,
  building: <><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" /><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" /><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" /><path d="M10 6h4M10 10h4M10 14h4M10 18h4" /></>,
  fuel: <><path d="M5 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16M4 21h12" /><path d="M7.500 7h5v4h-5z" /><path d="M15 10h1.500a2 2 0 0 1 2 2v5a1.500 1.500 0 0 0 3 0V8.500L19 6" /></>,
  bed: <><path d="M3 18V7M3 16h18M21 18v-2a4 4 0 0 0-4-4H3" /><path d="M7 12V9.500h4V12" /></>,
  user: <><circle cx="12" cy="8" r="3.600" /><path d="M4.500 20c1-4 4-5.500 7.500-5.500s6.500 1.500 7.500 5.500" /></>,
  support: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3.500" /><path d="M5.600 5.600l3.900 3.900M14.500 14.500l3.900 3.900M18.400 5.600l-3.900 3.900M9.500 14.500l-3.900 3.900" /></>,
  tower: <><path d="M12 9.600V21M8.500 21L12 12l3.500 9M9.600 18h4.800" /><circle cx="12" cy="8" r="1.600" /><path d="M8.300 4.300a5.200 5.200 0 0 0 0 7.400M15.700 4.300a5.200 5.200 0 0 1 0 7.400M5.500 2a8.500 8.500 0 0 0 0 12M18.500 2a8.500 8.500 0 0 1 0 12" /></>,
  sim: <><path d="M7 3h7l4 4v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" /><path d="M9 12h6v6H9zM12 12v6M9 15h6" /></>,
  ticket: <><path d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4z" /><path d="M10 6.500v1.500M10 11v2M10 16v1.500" /></>,
  wrench: <path d="M14.700 6.300a1 1 0 0 0 0 1.400l1.600 1.600a1 1 0 0 0 1.400 0l3.770-3.770a6 6 0 0 1-7.940 7.940l-6.910 6.910a2.120 2.120 0 0 1-3-3l6.910-6.910a6 6 0 0 1 7.940-7.940l-3.760 3.760z" />,
  alert: <><path d="M12 4l9 16H3z" /><path d="M12 10v4.500M12 17.300v.2" /></>,
  file: <><path d="M7 3h7l4 4v14H7z" /><path d="M14 3v4h4M9.500 12h5M9.500 15.500h5" /></>,
  pen: <><path d="M4 20l1-4L16.500 4.500a2.100 2.100 0 0 1 3 3L8 19z" /><path d="M14.500 6.500l3 3" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  signal: <path d="M5 19v-3M10 19v-7M15 19V8M20 19V4" />,
  power: <><path d="M12 3v9" /><path d="M6.300 6.800a8 8 0 1 0 11.400 0" /></>,
  shield: <><path d="M12 3l7 3v5c0 5-3.200 8.400-7 10-3.800-1.600-7-5-7-10V6z" /><path d="M8.800 12l2.300 2.300 4.200-4.400" /></>,
  layers: <><path d="M12 3l9 5-9 5-9-5z" /><path d="M3 13l9 5 9-5" /></>,
  camera: <><rect x="3" y="7" width="13" height="10" rx="2" /><path d="M16 10.500l5-2.500v8l-5-2.500" /><circle cx="8" cy="12" r="2" /></>,
  box: <><rect x="6" y="4" width="12" height="16" rx="3" /><path d="M10 8h4M12 20v2" /><circle cx="12" cy="15" r="1.400" /></>,
  repeat: <><path d="M17 2l4 4-4 4" /><path d="M3 11v-1a4 4 0 0 1 4-4h14" /><path d="M7 22l-4-4 4-4" /><path d="M21 13v1a4 4 0 0 1-4 4H3" /></>,
  userx: <><circle cx="10" cy="8" r="3.600" /><path d="M2.500 20c1-4 4-5.500 7.500-5.500 1.500 0 2.900.300 4 .800" /><path d="M16.500 15l5 5M21.500 15l-5 5" /></>,
  headset: <><path d="M4 14v-2a8 8 0 0 1 16 0v2" /><path d="M4 14h2.500a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" /><path d="M20 14h-2.500a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1H19a1 1 0 0 0 1-1z" /><path d="M20 19v.500a2.500 2.500 0 0 1-2.500 2.500H14" /></>,
};

export const Icon: React.FC<{name: string; color: string; size?: number; sw?: number; style?: React.CSSProperties}> = ({name, color, size = 44, sw = 1.9, style}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={style}>{P[name]}</svg>
);
