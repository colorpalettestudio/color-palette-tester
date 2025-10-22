# Color Palette Tester

> Test every color pairing in one click. Check WCAG contrast, filter results, and export favorites.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/color-palette-tester)

## 🎨 Features

- **Instant Testing** - Test all color combinations from your palette at once
- **WCAG Compliance** - Check AA/AAA contrast ratios for small and large text
- **Smart Filtering** - Filter results by WCAG level to see only passing pairs
- **Drag & Reorder** - Drag color swatches to reorganize results
- **Export Options** - Export favorite pairs as PNG, PDF, or Studio Code format
- **Real-time Preview** - Adjustable text size preview (10-32px)
- **SEO Optimized** - Full SEO tags, schema markup, and social sharing

## 🚀 Quick Start

### Development

```bash
npm install
npm run dev
```

Visit `http://localhost:5000`

### Build for Production

```bash
npm run build
npm start
```

## 📦 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy to Vercel

1. Push to GitHub (see Version Control tab in Replit)
2. Import repository in [Vercel](https://vercel.com)
3. Deploy (auto-configured via `vercel.json`)

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, TailwindCSS, shadcn/ui
- **Backend**: Express, Node.js
- **Color Processing**: Custom RGB/HEX/HSL parsers
- **Export**: html2canvas, jsPDF
- **Routing**: Wouter (lightweight React router)
- **Forms**: React Hook Form with Zod validation

## 📁 Project Structure

```
├── client/
│   ├── index.html          # HTML entry point
│   ├── public/             # Static assets (favicon, robots.txt, sitemap.xml)
│   └── src/
│       ├── components/     # React components
│       ├── pages/          # Page components
│       └── lib/            # Utilities and helpers
├── server/
│   └── index.ts            # Express server
├── shared/
│   └── schema.ts           # Shared types
└── vercel.json             # Vercel deployment config
```

## 🌐 Pages

- **Home** (`/`) - Main color testing interface
- **Privacy Policy** (`/privacy-policy`) - Privacy and cookie disclosure
- **Terms** (`/terms`) - Terms of service
- **Contact** (`/contact`) - Contact information
- **Cookie Preferences** (`/cookie-preferences`) - Cookie settings

## 🎯 Key Features

### Color Input Formats

Supports multiple color formats:
- HEX: `#FF6F61`, `#fff`
- RGB: `rgb(255, 111, 97)`
- HSL: `hsl(5, 100%, 69%)`
- Studio Code URLs (auto-parsed)

### WCAG Levels

- **AA Large** (3:1 ratio) - Large text (18pt+ or 14pt+ bold)
- **AA Small** (4.5:1 ratio) - Normal text
- **AAA Large** (4.5:1 ratio) - Enhanced large text
- **AAA Small** (7:1 ratio) - Enhanced normal text

### Export Formats

- **PNG** - High-res image export (2x scale)
- **PDF** - Printable document export
- **Studio Code** - Copy colors to clipboard as URL

## 📊 SEO & Performance

- Comprehensive meta tags (title, description, OG, Twitter)
- Structured data (SoftwareApplication, FAQPage schemas)
- Sitemap and robots.txt
- Cookie consent banner (GDPR-ready)
- Fast initial load with code splitting

## 🔒 Privacy & Legal

- Client-side processing (colors never sent to server)
- Cookie consent with granular controls
- GDPR-compliant privacy policy
- AdSense disclosure for third-party cookies

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome!

## 📄 License

MIT License - See LICENSE file for details

## 🌟 Credits

Built with ❤️ by [The Color Palette Studio](https://thecolorpalettestudio.com)

### Related Tools

- [Color Code Converter](https://thecolorcodeconverter.com)
- [Color Palette Generator](https://thecolorpalettegenerator.com)
- [Color Palette Fixer](https://thecolorpalettestudio.com/products/color-palette-fixer)

## 📞 Support

Email: sam@thecolorpalettestudio.com  
Location: Nolensville, Tennessee
