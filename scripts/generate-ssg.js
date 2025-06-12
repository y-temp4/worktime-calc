import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, '../dist');

// English version HTML content
const enHtmlContent = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/worktime-calc/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>⏰ Time Duration Calculator</title>

    <!-- OGP Meta Tags -->
    <meta
      name="description"
      content="Simple and easy-to-use work time duration calculator. Just enter start and end times to automatically calculate total working hours across multiple time periods. Perfect for time management and attendance tracking."
    />

    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Time Duration Calculator - Simple Work Time Calculation Tool" />
    <meta
      property="og:description"
      content="Calculate your work time duration by simply entering start and end times. Supports multiple time periods for comprehensive time tracking."
    />
    <meta property="og:image" content="https://y-temp4.github.io/worktime-calc/ogp_en.png" />
    <meta
      property="og:url"
      content="https://y-temp4.github.io/worktime-calc/en"
    />
    <meta property="og:site_name" content="Work Time Calculator" />
    <meta property="og:locale" content="en_US" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Time Duration Calculator - Simple Work Time Calculation Tool" />
    <meta
      name="twitter:description"
      content="Calculate your work time duration by simply entering start and end times. Supports multiple time periods for comprehensive time tracking."
    />
    <meta
      name="twitter:image"
      content="https://y-temp4.github.io/worktime-calc/ogp_en.png"
    />

    <!-- Additional Meta -->
    <meta
      name="keywords"
      content="time calculator,work hours,duration calculator,time tracking,time management,attendance,work time"
    />
    <meta name="author" content="y-temp4" />
    <link rel="canonical" href="https://y-temp4.github.io/worktime-calc/en" />
    
    <!-- JSON-LD Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Time Duration Calculator - Simple Work Time Calculation Tool",
      "description": "Simple and easy-to-use work time duration calculator. Just enter start and end times to automatically calculate total working hours across multiple time periods. Perfect for time management and attendance tracking.",
      "url": "https://y-temp4.github.io/worktime-calc/en",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "inLanguage": "en",
      "author": {
        "@type": "Person",
        "name": "y-temp4"
      },
      "keywords": "time calculator,work hours,duration calculator,time tracking,time management,attendance,work time"
    }
    </script>`;

// Read the built index.html and get the script tags
const indexHtmlPath = path.join(distDir, 'index.html');
const indexHtmlContent = fs.readFileSync(indexHtmlPath, 'utf-8');

// Extract script and link tags from the built file
const scriptMatches = indexHtmlContent.match(/<script[^>]*src="[^"]*"[^>]*><\/script>/g) || [];
const linkMatches = indexHtmlContent.match(/<link[^>]*rel="stylesheet"[^>]*>/g) || [];

// Complete the English HTML
const completeEnHtml = enHtmlContent + `

    ${linkMatches.join('\n    ')}
  </head>
  <body>
    <div id="root"></div>
    ${scriptMatches.join('\n    ')}
  </body>
</html>`;

// Create /en directory and write the HTML file
const enDir = path.join(distDir, 'en');
if (!fs.existsSync(enDir)) {
  fs.mkdirSync(enDir, { recursive: true });
}

fs.writeFileSync(path.join(enDir, 'index.html'), completeEnHtml);

// Update the main index.html with Japanese metadata
const jaHtmlStart = `<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/worktime-calc/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>⏰ 作業時間計算機</title>

    <!-- OGP Meta Tags -->
    <meta
      name="description"
      content="シンプルで使いやすい作業時間計算機。開始時刻と終了時刻を入力するだけで、複数の時間帯の合計作業時間を自動計算します。時間管理や勤怠管理に最適なWebツールです。"
    />

    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content="作業時間計算機 - シンプルで使いやすい時間計算ツール" />
    <meta
      property="og:description"
      content="開始時刻と終了時刻を入力するだけで作業時間を自動計算。複数の時間帯にも対応した便利なWebツールです。"
    />
    <meta property="og:image" content="https://y-temp4.github.io/worktime-calc/ogp_ja.png" />
    <meta
      property="og:url"
      content="https://y-temp4.github.io/worktime-calc/"
    />
    <meta property="og:site_name" content="作業時間計算機" />
    <meta property="og:locale" content="ja_JP" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="作業時間計算機 - シンプルで使いやすい時間計算ツール" />
    <meta
      name="twitter:description"
      content="開始時刻と終了時刻を入力するだけで作業時間を自動計算。複数の時間帯にも対応した便利なWebツールです。"
    />
    <meta
      name="twitter:image"
      content="https://y-temp4.github.io/worktime-calc/ogp_ja.png"
    />

    <!-- Additional Meta -->
    <meta
      name="keywords"
      content="作業時間,計算機,時間計算,勤怠管理,時間管理,労働時間,タイムトラッカー"
    />
    <meta name="author" content="y-temp4" />
    <link rel="canonical" href="https://y-temp4.github.io/worktime-calc/" />
    
    <!-- JSON-LD Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "作業時間計算機 - シンプルで使いやすい時間計算ツール",
      "description": "シンプルで使いやすい作業時間計算機。開始時刻と終了時刻を入力するだけで、複数の時間帯の合計作業時間を自動計算します。時間管理や勤怠管理に最適なWebツールです。",
      "url": "https://y-temp4.github.io/worktime-calc/",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "inLanguage": "ja",
      "author": {
        "@type": "Person",
        "name": "y-temp4"
      },
      "keywords": "作業時間,計算機,時間計算,勤怠管理,時間管理,労働時間,タイムトラッカー"
    }
    </script>`;

const completeJaHtml = jaHtmlStart + `

    ${linkMatches.join('\n    ')}
  </head>
  <body>
    <div id="root"></div>
    ${scriptMatches.join('\n    ')}
  </body>
</html>`;

// Update the main index.html
fs.writeFileSync(indexHtmlPath, completeJaHtml);

console.log('SSG files generated successfully!');
console.log('- /worktime-calc/ (Japanese)');
console.log('- /worktime-calc/en (English)');