# Design Customization & Site Settings Guide

## Overview

Pass-Crochet Samia now includes a comprehensive **Design & Settings Dashboard** at `/admin/design` where you can customize every aspect of your website appearance, branding, colors, contact information, social media links, and SEO metadata—all without touching a single line of code.

---

## Access the Design Dashboard

**URL**: `http://localhost:3000/admin/design` (local development)

**Navigation**: 
- Go to Admin Dashboard → Click "Paramètres" in the sidebar

---

## Features & Sections

### 1. BRANDING TAB (🎨)

Customize your site's basic identity and messaging.

**What you can change:**
- **Site Name**: Your business/brand name (displayed in header and footer)
- **Site Description**: Short description of your business
- **Preview**: Live preview of how your name and description appear

**Example:**
```
Site Name: Pass-Crochet Samia
Description: Univers doux et authentique de créations faites main
```

---

### 2. COLORS TAB (🎯)

Control the complete color scheme of your website.

**Color Options:**
- **Primary Color** - Main brand color (buttons, links, accents)
- **Secondary Color** - Supporting color (backgrounds, subtle elements)
- **Accent Color** - Highlight color (special elements, alerts)
- **Background Color** - Page background
- **Foreground Color** - Text color

**How to Use:**
1. Click the color picker square to select colors visually
2. Or type hex color codes directly (e.g., `#c9a96e`)
3. See live preview of each color right in the dashboard
4. All colors update together for harmony

**Pro Tips:**
- Use analogous colors (similar hues) for cohesion
- Ensure sufficient contrast between foreground and background
- Test colors on different devices/screens
- Popular hex colors:
  - Brown/Tan: `#c9a96e`, `#a67c52`
  - Soft Pink: `#d4a5a5`, `#e8c5c5`
  - Cream: `#f5ede4`, `#faf8f3`
  - Dark Brown: `#5a4a42`

**Example Current Settings:**
```
Primary: #c9a96e (warm brown)
Secondary: #f5ede4 (soft cream)
Accent: #d4a5a5 (dusty rose)
Background: #faf8f3 (off-white)
Foreground: #5a4a42 (dark brown)
```

---

### 3. CONTACT TAB (📞)

Store and display your business contact information.

**Information Fields:**
- **Email**: Your contact email address
- **Phone**: Your phone number
- **Address**: Full address or location
- **Company Name**: Official business name

**Where it's used:**
- Contact page footer
- Header links
- Customer inquiries
- Email headers/footers
- Invoice information

**Example:**
```
Email: samia@pass-crochet.fr
Phone: +33 (0)6 12 34 56 78
Address: 75000 Paris, France
Company: Pass-Crochet Samia SARL
```

---

### 4. SOCIAL MEDIA TAB (📱)

Link your social media profiles and footer description.

**Social Platforms:**
- **Instagram** - Link to your Instagram profile
- **Facebook** - Link to your Facebook page
- **TikTok** - Link to your TikTok account
- **Footer Description** - Short company description for footer

**Where it's used:**
- Social media icons in footer
- Direct links to your profiles
- Brand story in footer
- Customer engagement

**Example:**
```
Instagram: https://instagram.com/pass-crochet-samia
Facebook: https://facebook.com/pass-crochet-samia
TikTok: https://tiktok.com/@pass-crochet-samia
Footer: Créations faites main avec passion, patience et amour.
```

**Pro Tips:**
- Use full profile URLs (not usernames)
- Keep footer description under 100 characters
- Update links when you change usernames
- Use consistent usernames across platforms

---

### 5. SEO TAB (🔍)

Optimize your site for search engines.

**SEO Fields:**
- **Meta Description** - Appears in Google search results (max 160 chars)
- **Keywords** - Search terms for your business

**Where it's used:**
- Google search results snippets
- Social media previews
- Search engine indexing
- Browser tab preview

**Example:**
```
Meta Description: 
Découvrez l'univers doux et authentique de Pass-Crochet Samia. 
Amigurumis, accessoires, sacs en granny - créations faites main 
avec passion, patience et amour.

Keywords: 
crochet, amigurumi, handmade, artisanal, sacs, accessoires, 
créations faites main, granny squares, peluches crochet
```

**Best Practices:**
- Meta description: 150-160 characters
- Keywords: 5-10 relevant terms
- Include location if local business
- Use natural language, not keyword stuffing
- Update quarterly or when offerings change

---

## How Settings Are Stored

**Storage Method**: Browser localStorage
- Settings saved locally in your browser
- Persists across sessions
- Works offline (no database required)
- 5MB storage limit per domain

**Backup Your Settings**:
```
Open browser DevTools → Application → Local Storage → siteSettings
Copy the entire JSON value and save to a text file
```

---

## Making Changes & Saving

### Step-by-Step:

1. **Navigate to Design Dashboard**
   - Go to `/admin/design` or click "Paramètres" in admin sidebar

2. **Choose a Tab**
   - Click on the tab icon for the section you want to edit

3. **Make Your Changes**
   - Type in form fields
   - Select colors with color picker
   - Change multiple fields before saving

4. **Preview Changes** (colors tab)
   - See live preview of colors on right side
   - Check contrast and harmony

5. **Save**
   - Click "Enregistrer les modifications" button
   - Green success message appears
   - Changes saved to localStorage

6. **See Changes on Site**
   - Refresh pages to see new colors/text
   - May need to clear browser cache (Ctrl+Shift+Delete)
   - Changes appear immediately for logged-in users

---

## Reset to Defaults

**Warning**: This cannot be undone!

1. Click "Réinitialiser" button
2. Confirm in dialog
3. All settings reset to factory defaults
4. localStorage cleared
5. Refresh page to see original design

---

## Troubleshooting

### Changes Don't Appear

**Solution:**
1. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
2. Clear browser cache: DevTools → Application → Clear Site Data
3. Check that localStorage is enabled
4. Try different browser
5. Check if changes were actually saved (green message appears)

### Colors Look Wrong

**Solution:**
1. Verify hex codes are correct (`#` followed by 6 characters)
2. Check contrast ratio (use online contrast checker)
3. Adjust RGB values using color picker if unsure
4. Compare to screenshot of original colors
5. Consider color blindness - avoid red/green only distinction

### Can't Find Admin Design Page

**Solution:**
1. Make sure you're logged in to admin
2. Navigate directly to: `http://yourdomain.com/admin/design`
3. Check admin sidebar for "Paramètres" link
4. Verify admin access rights
5. Check browser console for errors (F12)

### Settings Lost After Refresh

**Causes:**
- Private/Incognito browsing (localStorage disabled)
- Browser localStorage cleared
- Different browser
- Cache clearing

**Prevention:**
- Use regular browsing mode
- Backup settings before clearing cache
- Use same browser
- Consider exporting settings JSON

---

## Advanced: Exporting Settings

### Export as JSON:

```javascript
// Run in browser console (F12 → Console tab)
JSON.stringify(
  JSON.parse(
    localStorage.getItem('siteSettings')
  ), 
  null, 
  2
)
```

### Import from JSON:

```javascript
// Run in browser console
localStorage.setItem('siteSettings', JSON.stringify({
  // paste exported JSON here
}))
```

---

## Future Enhancements

**Coming Soon:**
- [ ] Upload custom logo image
- [ ] Upload favicon
- [ ] Font selection (Google Fonts)
- [ ] Preview on mobile/tablet
- [ ] A/B testing different color schemes
- [ ] Export settings as JSON file
- [ ] Import settings from JSON file
- [ ] Settings backup/restore
- [ ] Undo/Redo functionality
- [ ] Settings version history

---

## File Organization

**Design System Files:**
```
lib/
├── site-settings-context.tsx  # Settings Context API
└── products-data.ts           # Product data with variants

components/
├── providers.tsx              # Client providers wrapper
├── header.tsx                 # Header (uses cart context)
└── header-wrapper.tsx         # Header with settings (optional)

app/
└── admin/
    └── design/
        └── page.tsx           # Design customization page
```

---

## Tips & Best Practices

### Color Selection
- Use a color palette tool (coolors.co, palettton.com)
- Test colors in different lighting
- Ensure accessibility (WCAG AA contrast)
- Use 3-5 colors maximum for cohesion

### Content Updates
- Update contact info when business details change
- Refresh keywords quarterly for SEO
- Keep social links current
- Update description when offerings change

### SEO Optimization
- Include location if local business
- Use keywords naturally in description
- Keep meta description under 160 chars
- Update based on search analytics

### Testing
- Test on multiple browsers (Chrome, Firefox, Safari)
- Test on mobile devices
- Test with screen readers
- Test color contrast with tools
- Preview in incognito window

---

## Support

**Issues or Questions?**

1. Check browser console for errors (F12)
2. Verify localStorage is enabled
3. Try clearing cache and reloading
4. Check file: `app/admin/design/page.tsx`
5. Look for any error messages in console

**Code Reference:**
- Settings context: `/lib/site-settings-context.tsx`
- Design page: `/app/admin/design/page.tsx`
- Providers: `/components/providers.tsx`

---

## Quick Reference

| Section | Use For | Visible On |
|---------|---------|------------|
| Branding | Site name, description | Header, Footer, Meta |
| Colors | Color scheme | Entire site |
| Contact | Business info | Contact page, Footer |
| Social | Social links | Footer, Share buttons |
| SEO | Search optimization | Google results |

---

**Last Updated**: May 2025
**Version**: 1.0
**Status**: Production Ready ✅
