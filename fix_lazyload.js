import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

const importsToReplace = [
  'DailyCalculator',
  'TimesheetCalculator',
  'MonthlyCalculator',
  'BancoDeHorasCalculator',
  'TimeSumCalculator',
  'HourlyRateCalculator',
  'OvertimeCalculator',
  'NightHoursCalculator',
  'HoleriteCalculator',
  'RescisaoCalculator',
  'ExcelDownloadSection',
  'BlogSection',
  'AboutUsPage',
  'ContactPage',
  'TermsPage',
  'PrivacyPage',
  'NotFound'
];

importsToReplace.forEach(comp => {
  content = content.replace(
    new RegExp(`import ${comp} from '\\./components/${comp}';`),
    `const ${comp} = React.lazy(() => import('./components/${comp}'));`
  );
});

// Add React import and Suspense wrapper
if (!content.includes('import React, { useState, useEffect, Suspense }')) {
  content = content.replace(
    /import \{ useState, useEffect \} from 'react';/,
    'import React, { useState, useEffect, Suspense } from \'react\';'
  );
}

// Ensure Suspense is wrapping the content block
// Find <div id="main-calculator" and its closing
if (!content.includes('<Suspense fallback={<div className="p-12 text-center text-neutral-500 flex flex-col items-center justify-center gap-3">')) {
  content = content.replace(
    /\{activeTab === 'daily' && <DailyCalculator \/>\}/g,
    `<Suspense fallback={<div className="p-12 text-center text-neutral-500 flex flex-col items-center justify-center gap-3"><div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div><span>Carregando ferramenta...</span></div>}>
                  {activeTab === 'daily' && <DailyCalculator />}`
  );

  content = content.replace(
    /\{activeTab === 'not-found' && <NotFound \/>\}/g,
    `{activeTab === 'not-found' && <NotFound />}
                </Suspense>`
  );
}

fs.writeFileSync('src/App.tsx', content);
