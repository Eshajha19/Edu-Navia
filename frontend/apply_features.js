const fs = require('fs');
const path = require('path');

const dir = __dirname;
const htmlFiles = fs.readdirSync(dir, { recursive: true }).filter(file => typeof file === 'string' && file.endsWith('.html'));

let updatedCount = 0;

htmlFiles.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  const relativeToRoot = path.relative(path.dirname(filePath), dir) || '.';
  
  // Use forward slashes for HTML href/src attributes regardless of OS
  const relativePrefix = relativeToRoot === '.' ? '.' : relativeToRoot.split(path.sep).join('/');
  
  const cssInjectionStr = `\n    <link rel="stylesheet" href="${relativePrefix}/global-features.css">\n`;
  const jsInjectionStr = `\n    <script src="${relativePrefix}/global-features.js" defer></script>\n`;

  // Ensure CSS is injected
  if (!content.includes('global-features.css')) {
    if (content.includes('</head>')) {
      content = content.replace('</head>', cssInjectionStr + '</head>');
      modified = true;
    } else if (content.includes('<head>')) {
      content = content.replace('<head>', '<head>' + cssInjectionStr);
      modified = true;
    }
  }

  // Ensure JS is injected
  if (!content.includes('global-features.js')) {
    if (content.includes('</body>')) {
      content = content.replace('</body>', jsInjectionStr + '</body>');
      modified = true;
    } else {
      content += jsInjectionStr;
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated ${file}`);
    updatedCount++;
  }
});

console.log(`\n🎉 Success! Global features applied to ${updatedCount} HTML pages.`);
