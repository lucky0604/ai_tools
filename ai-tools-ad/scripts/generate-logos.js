const fs = require('fs');
const path = require('path');

// List of tool names from our data
const tools = [
  { id: 'codesage', name: 'CodeSage', color: '#4C00FF' },
  { id: 'imagemaster', name: 'ImageMaster AI', color: '#9C00FF' },
  { id: 'smartchat', name: 'SmartChat', color: '#00FFB2' },
  { id: 'datalens', name: 'DataLens', color: '#FF5A00' },
  { id: 'audioforge', name: 'AudioForge', color: '#4C00FF' },
  { id: 'videogen', name: 'VideoGen', color: '#9C00FF' },
  { id: 'textsculptor', name: 'TextSculptor', color: '#00FFB2' },
  { id: 'quantumai', name: 'QuantumAI', color: '#FF5A00' },
];

const logoDir = path.join(__dirname, '../public/tool-logos');

// Create directory if it doesn't exist
if (!fs.existsSync(logoDir)) {
  fs.mkdirSync(logoDir, { recursive: true });
}

// Generate a simple SVG logo for each tool
tools.forEach(tool => {
  const initials = tool.name
    .split(' ')
    .map(word => word[0])
    .join('');

  const svgContent = `<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="12" fill="${tool.color}" />
    <text x="50" y="50" font-family="Arial, sans-serif" font-size="40" font-weight="bold" text-anchor="middle" dominant-baseline="central" fill="white">${initials}</text>
  </svg>`;

  fs.writeFileSync(path.join(logoDir, `${tool.id}.svg`), svgContent);
  console.log(`Generated logo for ${tool.name}`);
});

console.log('All logos generated successfully!'); 