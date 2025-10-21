# Design Guidelines: Color Palette Tester

## Design Approach
**Reference-Based**: Directly match the visual style of thecolorcodeconverter.com with clean utility-focused design, modern web tool aesthetic.

## Core Design Elements

### A. Color Palette

**Light Mode (Primary)**
- Background: Pure white (#FFFFFF)
- Primary Action: Near-black (#111827) with white text
- Secondary Action: White with 1px muted gray border
- Text: Dark gray hierarchy (#111827 for headings, #4B5563 for body)
- Success Badge: Green background for "Pass" indicators
- Fail Badge: Red background for "Fail" indicators
- Rainbow Gradient: Subtle animated gradient on "Color Palette" text in H1 (respecting prefers-reduced-motion)
- Borders: Muted gray (#E5E7EB)

**Accent Elements**
- Ad Placeholders: Light dashed border with rounded corners
- Card Shadows: Subtle, soft shadows for depth
- Focus States: Clear, accessible indicators

### B. Typography

**Font Family**: Inter (Google Fonts)
- Headings: Inter, bold weights
- Body: Inter, regular weight
- Sample Text: Inter for preview swatches

**Hierarchy**
- H1: Large, bold - "Test Your Color Palette for Accessibility"
- Badge: Small, uppercase - "Free, Instant & No Sign-Up"
- Subhead: Medium, regular weight
- Card Titles: Bold
- Button Text: Medium weight
- Body Text: 14-16px regular

### C. Layout System

**Spacing**: Tailwind units of 4, 6, 8, 12, 16, 24 (generous white space)
- Section padding: py-16 to py-24
- Card padding: p-6
- Element gaps: gap-4 to gap-6
- Ad spacing: 24px minimum vertical margin

**Container**
- Max width: 960-1200px
- Centered layout
- Mobile: Full width with 16px horizontal padding

### D. Component Library

**Hero Section**
- Badge with rounded background
- Large H1 with rainbow gradient on "Color Palette"
- Descriptive subhead
- Large textarea with placeholder (rounded, bordered)
- Primary + Secondary button pair
- WCAG radio button group (4 options with clear labels)
- Fixed 100px ad placeholder below

**Results Grid**
- Toolbar with left (count) and right (export buttons) sections
- Responsive grid: min-width 280px cards
- Cards include: preview swatch, bold pairing text, sample line, ratio badge, footer row with star toggle
- Mid-page 100px ad placeholder
- Native CTA card with distinct styling

**Color Pair Cards**
- 12-14px corner radius
- Soft shadow
- Large preview swatch showing foreground on background
- Bold pairing label
- Sample text line ("Aa Bb The quick brown fox")
- Right-aligned badge (green Pass / red Fail with ratio)
- Footer: threshold info + star favorite toggle
- Clear hover states

**Educational Sections**
- Clean heading hierarchy
- Bulleted lists for "Why Test" section
- Table/structured list for WCAG thresholds
- Readable paragraph widths

**FAQ Accordion**
- Collapsed by default
- Smooth expand/collapse animations
- Clear Q/A formatting
- 5 questions as specified

**Footer**
- Three-column structure: branding left, links center, cross-links right
- "Made with ❤️ by The Color Palette Studio" (external link)
- Privacy · Terms · Contact links
- Tool cross-links
- 100px ad placeholder above footer

**Ad Placeholders**
- Fixed heights (100px) to prevent layout shift
- Light dashed borders
- Rounded corners matching card radius
- Subtle placeholder text
- 24px minimum vertical spacing

### E. Interactions & States

**Buttons**
- Primary: Near-black background, white text, hover state
- Secondary: White background, gray border, hover state
- Export buttons: Clear, grouped toolbar actions
- Star toggle: Empty ☆ / filled ★ states

**Forms**
- Large textarea with clear focus states
- Radio buttons with visible selection
- Accessible labels and groupings

**Cards**
- Subtle hover elevation
- Click to favorite interaction
- Clear visual feedback

**Animations**
- Rainbow gradient on "Color Palette" (subtle, continuous, respects prefers-reduced-motion)
- Smooth accordion expand/collapse
- No distracting or excessive animations

## Images

**No hero image required** - This is a utility tool with text-based hero featuring the color input textarea as the primary interactive element. The focus is on functionality and clean, minimal design matching thecolorcodeconverter.com.

## Performance & Accessibility

- Lighthouse 90+ score target
- Semantic HTML headings (H1, H2 hierarchy)
- ARIA labels where appropriate
- Clear focus indicators
- Fixed ad heights to minimize CLS
- Prefers-reduced-motion respected for rainbow gradient
- Contrast-compliant text and badges

## SEO Elements

- Meta title, description, OG tags as specified
- Canonical URL structure
- Semantic heading hierarchy
- Crawlable footer links
- Sitemap and robots.txt

## Static Pages

- /privacy-policy: Clean headings, mentions Analytics/AdSense cookies
- /terms: "As is" warranty, acceptable use, third-party services
- /contact: Mailto link to support@thecolorpalettestudio.com
- All use same clean Inter typography and layout