const fs = require('fs');
const path = require('path');

const filesToProcess = [
  'client/src/pages/practice/ProblemPage.jsx',
  'client/src/pages/practice/plans/placement-sprint-30.jsx',
  'client/src/pages/practice/plans/faang-prep-45.jsx',
  'client/src/pages/practice/plans/arrays-mastery-14.jsx',
  'client/src/pages/practice/plans/weekly-challenge-7.jsx'
];

const replacements = [
  { regex: /bg-\[#060810\]/g, replacement: 'bg-[var(--bg)]' },
  { regex: /bg-\[#0d1117\]/g, replacement: 'bg-[var(--surface)]' },
  { regex: /bg-\[#111622\]/g, replacement: 'bg-[var(--surface-2)]' },
  { regex: /bg-\[#0d0e17\]/g, replacement: 'bg-[var(--bg)]' },
  { regex: /bg-\[#13141f\]/g, replacement: 'bg-[var(--surface)]' },
  { regex: /bg-\[#0a0c14\]/g, replacement: 'bg-[var(--surface-2)]' },
  { regex: /border-\[#1e2433\]/g, replacement: 'border-[var(--border)]' },
  { regex: /text-\[#e2e8f0\]/g, replacement: 'text-[var(--text)]' },
  { regex: /text-\[#f1f5f9\]/g, replacement: 'text-[var(--text)]' }
];

filesToProcess.forEach(relPath => {
  const filePath = path.join(__dirname, relPath);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    replacements.forEach(({ regex, replacement }) => {
      content = content.replace(regex, replacement);
    });
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Processed ${filePath}`);
  } else {
    console.warn(`File not found: ${filePath}`);
  }
});
