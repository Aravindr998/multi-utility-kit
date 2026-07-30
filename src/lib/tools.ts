// ---------------------------------------------------------------------------
// UtilityHub — Tool Registry (single source of truth)
// Drives: homepage directory, category pages, search, sitemap, per-page SEO.
// Adding a new tool = add an entry here + a component in src/tools/components.tsx
// ---------------------------------------------------------------------------

export const SITE = {
  name: "UtilityHub",
  tagline: "Free online tools that just work",
  description:
    "A suite of free, no-login, browser-based utilities. Compress images, edit PDFs, count words, generate QR codes and more — all processed privately in your browser.",
  url: "https://utilityhub.example.com",
};

export type FAQ = { q: string; a: string };

export type Category = {
  slug: string;
  name: string;
  description: string;
  icon: string;
};

export type Tool = {
  slug: string;
  name: string;
  /** Page H1 — the primary keyword */
  h1: string;
  /** Full <title> */
  title: string;
  /** Meta description */
  description: string;
  /** Short one-liner for cards */
  cardDescription: string;
  category: string; // category slug
  keywords: string[];
  icon: string; // emoji
  /** Supporting paragraph shown under the tool */
  intro: string;
  howTo: string[];
  faqs: FAQ[];
  privacyNote: string;
  /** Whether the tool page is built and live */
  available: boolean;
  /** True for the rare tool that must run on a server (e.g. YouTube download).
   *  Changes the trust notice from "in your browser" to "on our server". */
  serverSide?: boolean;
};

export const CATEGORIES: Category[] = [
  {
    slug: "image-tools",
    name: "Image Tools",
    description:
      "Compress, convert, resize and crop images right in your browser — no upload required.",
    icon: "🖼️",
  },
  {
    slug: "pdf-tools",
    name: "PDF Tools",
    description:
      "Merge, split and compress PDF files privately. Your documents never leave your device.",
    icon: "📄",
  },
  {
    slug: "text-tools",
    name: "Text Tools",
    description: "Count words, change case and clean up text instantly.",
    icon: "✍️",
  },
  {
    slug: "calculators",
    name: "Calculators",
    description: "Everyday calculators for percentages, age, loans and more.",
    icon: "🧮",
  },
  {
    slug: "converters",
    name: "Converters",
    description: "Convert units, currencies and file formats in a click.",
    icon: "🔁",
  },
  {
    slug: "generators",
    name: "Generators",
    description: "Generate QR codes, passwords and other handy outputs.",
    icon: "⚡",
  },
  {
    slug: "developer-tools",
    name: "Developer Tools",
    description: "Format JSON, encode Base64, test regex and more.",
    icon: "💻",
  },
  {
    slug: "media-tools",
    name: "Media Tools",
    description: "Convert video and audio, and extract frames — all in your browser.",
    icon: "🎬",
  },
];

const PRIVACY_CLIENT =
  "This tool runs entirely in your browser. Your files and data are never uploaded to any server.";

export const TOOLS: Tool[] = [
  // ------------------------------- IMAGE -------------------------------
  {
    slug: "image-compressor",
    name: "Image Compressor",
    h1: "Free Image Compressor",
    title: "Image Compressor – Free Online Image Tool | UtilityHub",
    description:
      "Compress JPG, PNG and WebP images online for free. Reduce file size with adjustable quality and see the before/after size instantly. 100% private, in-browser.",
    cardDescription: "Shrink JPG, PNG & WebP files with adjustable quality.",
    category: "image-tools",
    keywords: ["image compressor", "compress jpg", "reduce image size", "compress png"],
    icon: "🗜️",
    intro:
      "This free image compressor reduces the file size of your JPG, PNG and WebP images without a noticeable drop in quality. Everything happens locally in your browser, so your photos are never uploaded to a server. Drag in an image, pick a target quality, and download the smaller version in seconds.",
    howTo: [
      "Drag & drop an image (JPG, PNG or WebP) or click to browse.",
      "Adjust the quality slider to balance size and clarity.",
      "Compare the original and compressed file sizes.",
      "Click Download to save your optimized image.",
    ],
    faqs: [
      {
        q: "Does compressing an image reduce its quality?",
        a: "Lossy compression removes some detail to save space, but at 70–80% quality the difference is usually invisible. Use the slider to find the sweet spot for your image.",
      },
      {
        q: "Are my images uploaded to a server?",
        a: "No. All compression happens inside your browser using JavaScript. Your images never leave your device.",
      },
      {
        q: "What formats are supported?",
        a: "JPG/JPEG, PNG and WebP are supported. The output keeps the original format by default.",
      },
      {
        q: "Is there a file size limit?",
        a: "There is no hard limit, but very large images (over ~50 MB) may be slow on low-powered devices since processing runs on your machine.",
      },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "image-converter",
    name: "Image Format Converter",
    h1: "Free Image Format Converter",
    title: "Image Format Converter – Free Online Image Tool | UtilityHub",
    description:
      "Convert images between JPG, PNG, WebP and HEIC online for free. Fast, private, in-browser image conversion with no watermarks and no sign-up.",
    cardDescription: "Convert between JPG, PNG, WebP and HEIC.",
    category: "image-tools",
    keywords: ["image converter", "heic to jpg", "webp to png", "png to jpg", "convert image"],
    icon: "🔄",
    intro:
      "Convert images between JPG, PNG and WebP — or turn iPhone HEIC photos into universally-supported JPGs — right in your browser. No uploads, no watermarks, no account needed. Just pick your target format and download.",
    howTo: [
      "Drop an image or click to browse (JPG, PNG, WebP or HEIC).",
      "Choose the output format you want.",
      "For JPG/WebP, optionally set the quality.",
      "Download the converted image.",
    ],
    faqs: [
      {
        q: "Can I convert HEIC photos from my iPhone?",
        a: "Yes. HEIC files are decoded in your browser and converted to JPG or PNG so they open anywhere.",
      },
      {
        q: "Will converting to PNG make my file larger?",
        a: "Possibly. PNG is lossless and best for graphics with sharp edges; photos are usually smaller as JPG or WebP.",
      },
      {
        q: "Is my image sent to a server?",
        a: "No — conversion runs entirely in your browser, so your images stay on your device.",
      },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "image-resizer",
    name: "Image Resizer & Cropper",
    h1: "Free Image Resizer & Cropper",
    title: "Image Resizer & Cropper – Free Online Image Tool | UtilityHub",
    description:
      "Resize and crop images online for free with ready-made social media presets for YouTube thumbnails, Instagram posts, LinkedIn banners and more. Private, in-browser.",
    cardDescription: "Resize & crop with social media size presets.",
    category: "image-tools",
    keywords: [
      "image resizer",
      "resize image",
      "crop image",
      "youtube thumbnail size",
      "instagram size",
    ],
    icon: "📐",
    intro:
      "Resize or crop any image to exact pixel dimensions, or use a one-click preset for popular platforms — YouTube thumbnails, Instagram posts and stories, LinkedIn banners, Twitter/X headers and more. Processing happens in your browser, so your images are never uploaded.",
    howTo: [
      "Upload an image.",
      "Enter custom width/height or pick a social media preset.",
      "Optionally lock the aspect ratio to avoid stretching.",
      "Download your resized image.",
    ],
    faqs: [
      {
        q: "What size should a YouTube thumbnail be?",
        a: "1280 × 720 pixels (16:9). Select the YouTube Thumbnail preset and the dimensions are filled in for you.",
      },
      {
        q: "Will resizing stretch my image?",
        a: "Only if you turn off 'lock aspect ratio'. Keep it on to scale proportionally.",
      },
      {
        q: "Does this reduce image quality?",
        a: "Shrinking an image is essentially lossless. Enlarging beyond the original resolution can look soft.",
      },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  // ------------------------------- PDF -------------------------------
  {
    slug: "pdf-merge",
    name: "PDF Merge",
    h1: "Free PDF Merger",
    title: "PDF Merge – Free Online PDF Tool | UtilityHub",
    description:
      "Merge multiple PDF files into one online for free. Reorder pages by drag, combine documents instantly, and keep everything private — files never leave your browser.",
    cardDescription: "Combine multiple PDFs into a single file.",
    category: "pdf-tools",
    keywords: ["merge pdf", "combine pdf", "join pdf", "pdf merger"],
    icon: "🔗",
    intro:
      "Combine several PDF files into a single document in the order you choose. Add your files, drag to reorder, and download the merged PDF. Because everything runs in your browser, your documents are never uploaded anywhere.",
    howTo: [
      "Add two or more PDF files.",
      "Drag the files to arrange them in the order you want.",
      "Click Merge PDFs.",
      "Download the combined document.",
    ],
    faqs: [
      {
        q: "Is there a limit to how many PDFs I can merge?",
        a: "No fixed limit. Merging happens locally, so the practical limit is your device's memory.",
      },
      {
        q: "Are my PDFs uploaded to your servers?",
        a: "No. The merge is performed in your browser with pdf-lib; your files stay on your device.",
      },
      {
        q: "Will merging change my formatting?",
        a: "No. Pages are copied as-is, preserving their original layout, fonts and images.",
      },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "pdf-split",
    name: "PDF Split",
    h1: "Free PDF Splitter",
    title: "PDF Split – Free Online PDF Tool | UtilityHub",
    description:
      "Split a PDF into separate files or extract specific pages online for free. Choose page ranges and download instantly. 100% private, in-browser PDF splitting.",
    cardDescription: "Extract pages or split a PDF by range.",
    category: "pdf-tools",
    keywords: ["split pdf", "extract pdf pages", "pdf splitter", "separate pdf pages"],
    icon: "✂️",
    intro:
      "Split a large PDF into smaller documents or pull out just the pages you need. Enter page ranges like 1-3, 5, 8-10 and download a new PDF containing exactly those pages — all processed privately in your browser.",
    howTo: [
      "Upload the PDF you want to split.",
      "Enter the page ranges to extract (e.g. 1-3, 5, 8-10).",
      "Click Extract Pages.",
      "Download the resulting PDF.",
    ],
    faqs: [
      {
        q: "How do I extract a range of pages?",
        a: "Type ranges separated by commas, for example '1-3, 7, 10-12'. The new PDF keeps that order.",
      },
      {
        q: "Can I split every page into its own file?",
        a: "Yes — choose the 'each page separately' option to download a ZIP of single-page PDFs.",
      },
      {
        q: "Is my document uploaded anywhere?",
        a: "No. Splitting runs entirely in your browser and nothing is sent to a server.",
      },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "pdf-compressor",
    name: "PDF Compressor",
    h1: "Free PDF Compressor",
    title: "PDF Compressor – Free Online PDF Tool | UtilityHub",
    description:
      "Compress PDF files to reduce their size online for free. Optimize and shrink large PDFs in your browser with no uploads and no watermarks.",
    cardDescription: "Reduce the size of large PDF files.",
    category: "pdf-tools",
    keywords: ["compress pdf", "reduce pdf size", "shrink pdf", "pdf compressor"],
    icon: "🗜️",
    intro:
      "Reduce the file size of PDFs so they're easier to email and upload. This tool rewrites and optimizes the document structure and recompresses embedded images in your browser. No files are uploaded and there are no watermarks.",
    howTo: [
      "Upload a PDF file.",
      "Pick a compression level.",
      "Click Compress PDF.",
      "Compare the before/after size and download.",
    ],
    faqs: [
      {
        q: "How much smaller will my PDF get?",
        a: "It depends on the content. Image-heavy PDFs shrink the most; text-only PDFs are already compact and may only reduce a little.",
      },
      {
        q: "Is the quality affected?",
        a: "Stronger compression downsamples images, which can slightly soften them. Choose a lighter level to preserve quality.",
      },
      {
        q: "Are my PDFs private?",
        a: "Yes. Compression is done in your browser and your files are never uploaded.",
      },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  // ------------------------------- TEXT -------------------------------
  {
    slug: "word-counter",
    name: "Word Counter",
    h1: "Free Word & Character Counter",
    title: "Word Counter – Free Online Text Tool | UtilityHub",
    description:
      "Count words, characters, sentences and paragraphs online for free, with a live reading-time estimate. Perfect for essays, articles and social media posts.",
    cardDescription: "Count words, characters & reading time live.",
    category: "text-tools",
    keywords: ["word counter", "character counter", "word count", "reading time"],
    icon: "🔢",
    intro:
      "Paste or type your text to instantly count words, characters (with and without spaces), sentences and paragraphs, plus an estimated reading and speaking time. Great for essays with word limits, meta descriptions, tweets and more. Nothing is sent anywhere — it all runs in your browser.",
    howTo: [
      "Type or paste your text into the box.",
      "Watch the counts update in real time.",
      "Use the reading-time estimate to gauge length.",
    ],
    faqs: [
      {
        q: "How is reading time calculated?",
        a: "We estimate 200 words per minute for silent reading and 130 for speaking aloud — typical average rates.",
      },
      {
        q: "Does it count characters with spaces?",
        a: "Yes, both totals are shown: characters including spaces and characters excluding spaces.",
      },
      {
        q: "Is my text stored?",
        a: "No. Your text stays in your browser and is never uploaded or saved.",
      },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "case-converter",
    name: "Case Converter",
    h1: "Free Text Case Converter",
    title: "Case Converter – Free Online Text Tool | UtilityHub",
    description:
      "Convert text to UPPERCASE, lowercase, Title Case, Sentence case, camelCase and more online for free. Instant, private text case conversion in your browser.",
    cardDescription: "UPPER, lower, Title & Sentence case in a click.",
    category: "text-tools",
    keywords: ["case converter", "uppercase", "lowercase", "title case", "sentence case"],
    icon: "🔠",
    intro:
      "Quickly change the capitalization of your text. Convert to UPPERCASE, lowercase, Title Case, Sentence case, or developer-friendly camelCase, snake_case and kebab-case. Copy the result with one click. Everything runs locally in your browser.",
    howTo: [
      "Type or paste your text.",
      "Click the case style you want.",
      "Copy the converted text to your clipboard.",
    ],
    faqs: [
      {
        q: "What is the difference between Title Case and Sentence case?",
        a: "Title Case capitalizes the first letter of every word; Sentence case only capitalizes the first letter of each sentence.",
      },
      {
        q: "Can it produce camelCase or snake_case?",
        a: "Yes — handy for developers turning labels into variable names.",
      },
      {
        q: "Is my text private?",
        a: "Yes. Conversion happens in your browser and nothing is uploaded.",
      },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "text-diff",
    name: "Text Diff Checker",
    h1: "Free Text & Code Diff Checker",
    title: "Text Diff Checker – Compare & Merge Text Online | UtilityHub",
    description:
      "Compare two blocks of text or code and see a Git-style line-by-line diff. Accept changes from either side, line by line, and copy the merged result. 100% private, in-browser.",
    cardDescription: "Compare text & code with a Git-style diff and merge.",
    category: "text-tools",
    keywords: ["text diff", "diff checker", "compare text", "code diff", "text compare", "merge text"],
    icon: "🔀",
    intro:
      "Paste your original text on the left and the changed version on the right to see exactly what was added, removed or kept — coloured like a Git diff. You can accept any change into either side, line by line, to build a merged result, then copy it out. Everything runs locally in your browser, so your text is never uploaded.",
    howTo: [
      "Paste the original text and the changed text into the two boxes.",
      "Review the highlighted additions (green) and deletions (red).",
      "Use the arrow buttons on each change to accept it into the original or the changed side.",
      "Copy the original or changed text once you're happy with the merge.",
    ],
    faqs: [
      {
        q: "Can I compare source code?",
        a: "Yes. The diff works line by line, so it's ideal for comparing code, config files, JSON, prose or any plain text.",
      },
      {
        q: "How do I merge changes?",
        a: "Each differing block has two arrows: one applies the changed side's version into the original, the other applies the original into the changed side. Repeat until both sides match.",
      },
      {
        q: "Is my text uploaded anywhere?",
        a: "No. The comparison happens entirely in your browser and nothing is sent to a server.",
      },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "text-formatter",
    name: "Text Formatter",
    h1: "Free Rich Text Formatter",
    title: "Text Formatter – Online Rich Text Editor | UtilityHub",
    description:
      "A free mini word processor in your browser. Apply bold, italic, underline, headings, text colours and highlights, then copy the styled text or export it. Private and in-browser.",
    cardDescription: "Style text with bold, headings, colours & highlights.",
    category: "text-tools",
    keywords: ["text formatter", "rich text editor", "online word processor", "text highlighter", "bold italic underline"],
    icon: "✨",
    intro:
      "Format text like you would in a word processor — apply bold, italic and underline, add titles and subtitles, and pick text colours and highlights. Paste rich text and copy it back out with the formatting intact, or export it as an HTML file. It all runs locally in your browser, so nothing is uploaded.",
    howTo: [
      "Type or paste your text into the editor.",
      "Select some text and use the toolbar to apply formatting.",
      "Pick a text colour or highlight colour for the selection.",
      "Copy the formatted text or download it as an HTML file.",
    ],
    faqs: [
      {
        q: "Will the formatting carry over when I paste elsewhere?",
        a: "Yes. Copying preserves rich formatting, so pasting into Word, Google Docs or email keeps your styles. You can also copy the underlying HTML.",
      },
      {
        q: "Can I add headings?",
        a: "Yes — the Title and Subtitle buttons turn the current line into a heading, and Normal turns it back into body text.",
      },
      {
        q: "Is my text private?",
        a: "Yes. The editor runs in your browser and your text is never uploaded.",
      },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "markdown-editor",
    name: "Markdown Editor",
    h1: "Free Markdown Editor with Live Preview",
    title: "Markdown Editor – Live Preview Online | UtilityHub",
    description:
      "Write Markdown and see a live HTML preview side by side. Supports headings, bold, lists, links, tables, code blocks and more. Copy the HTML or download the Markdown. Private, in-browser.",
    cardDescription: "Write Markdown with an instant side-by-side preview.",
    category: "text-tools",
    keywords: ["markdown editor", "markdown preview", "md editor", "markdown to html", "live markdown"],
    icon: "📝",
    intro:
      "Write Markdown on the left and watch a formatted preview update instantly on the right. Supports headings, bold and italic, links, images, blockquotes, ordered and unordered lists, tables, inline code and fenced code blocks. Copy the rendered HTML, copy the Markdown, or download a .md file. Everything runs in your browser.",
    howTo: [
      "Type or paste Markdown into the editor on the left.",
      "See the live preview render on the right as you type.",
      "Use the toolbar to quickly insert bold, headings, links and lists.",
      "Copy the HTML output or download your Markdown file.",
    ],
    faqs: [
      {
        q: "Which Markdown features are supported?",
        a: "Headings, bold, italic, strikethrough, inline and fenced code, blockquotes, ordered and unordered lists, links, images, horizontal rules and simple tables.",
      },
      {
        q: "Can I get the HTML out?",
        a: "Yes. Use the Copy HTML button to copy the rendered markup, or Copy Markdown / Download to keep the source.",
      },
      {
        q: "Is my document uploaded?",
        a: "No. The editor and preview run entirely in your browser; nothing is sent anywhere.",
      },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "notes",
    name: "Notes App",
    h1: "Free Online Notes App",
    title: "Notes App – Free Rich-Text Note Taking Online | UtilityHub",
    description:
      "A free note-taking app that saves your notes privately in your browser. Write rich-text notes with checklists, bold, italic, underline, adjustable font sizes and clickable links. Auto-saves as you type.",
    cardDescription: "Take rich-text notes with checklists — saved in your browser.",
    category: "text-tools",
    keywords: ["notes app", "online notepad", "note taking", "checklist notes", "rich text notes", "save notes browser"],
    icon: "🗒️",
    intro:
      "A private, no-login notes app that lives entirely in your browser. Create as many notes as you like, each with a bold title and a rich-text body. Add checklists, bold/italic/underline, change the font size for parts of your note, and paste links that become clickable. Your notes are saved automatically to your browser's local storage — nothing is ever uploaded, and everything is right where you left it next time.",
    howTo: [
      "Click New note to open a blank note.",
      "Give it a title (shown large and bold) and start writing the body.",
      "Use the toolbar for checklists, bold/italic/underline, font size and more.",
      "Your note auto-saves as you type — switch views (list, small or large icons) to browse them all.",
    ],
    faqs: [
      {
        q: "Where are my notes stored?",
        a: "Notes are saved in your browser's local storage on this device. They aren't uploaded anywhere, so they stay private — but they also won't sync to other devices or browsers, and clearing your browser data will remove them.",
      },
      {
        q: "How do checklists work?",
        a: "Click the checklist button in the toolbar and the current line becomes a to-do item. Press Enter to add more items; click a checkbox to tick it off. Press Backspace on an empty item to leave the checklist.",
      },
      {
        q: "Can I open links in my notes?",
        a: "Yes. Any URL you type is automatically underlined and coloured as a link. Ctrl+click (or Cmd+click on Mac) opens it in a new tab.",
      },
      {
        q: "Do my notes save automatically?",
        a: "Yes. Every change auto-saves, and each note in the list shows when it was last saved.",
      },
    ],
    privacyNote:
      "This notes app runs entirely in your browser. Your notes are saved only to this device's local storage and are never uploaded to any server.",
    available: true,
  },
  // ------------------------------- GENERATORS -------------------------------
  {
    slug: "qr-code-generator",
    name: "QR Code Generator",
    h1: "Free QR Code Generator",
    title: "QR Code Generator – Free Online Generator Tool | UtilityHub",
    description:
      "Generate QR codes for text, URLs, WiFi and vCards online for free. Customize colors, download as PNG or SVG, no watermark and no sign-up. Private, in-browser.",
    cardDescription: "Create QR codes for URLs, WiFi, text & vCards.",
    category: "generators",
    keywords: ["qr code generator", "wifi qr code", "url qr code", "vcard qr code"],
    icon: "🔳",
    intro:
      "Create high-resolution QR codes for a link, plain text, a WiFi network or a contact card (vCard). Customize the colors, then download as a crisp PNG or scalable SVG. Codes are generated in your browser and never leave your device.",
    howTo: [
      "Choose what the QR code should contain (URL, text, WiFi or vCard).",
      "Fill in the details.",
      "Optionally adjust the colors and size.",
      "Download the QR code as PNG or SVG.",
    ],
    faqs: [
      {
        q: "Do these QR codes expire?",
        a: "No. These are static QR codes — they encode your data directly and work forever.",
      },
      {
        q: "How does a WiFi QR code work?",
        a: "It encodes your network name, password and security type so phones can join by scanning — no typing required.",
      },
      {
        q: "Can I use these commercially?",
        a: "Yes, the generated codes are free to use anywhere, with no watermark.",
      },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  // ------------------------------- CONVERTERS -------------------------------
  {
    slug: "unit-converter",
    name: "Unit Converter",
    h1: "Free Unit Converter",
    title: "Unit Converter – Free Online Converter Tool | UtilityHub",
    description:
      "Convert length, weight, temperature, speed, area, volume and more online for free. Fast, accurate unit conversion right in your browser.",
    cardDescription: "Length, weight, temperature, speed & more.",
    category: "converters",
    keywords: ["unit converter", "convert units", "cm to inches", "kg to lbs", "celsius to fahrenheit"],
    icon: "📏",
    intro:
      "A fast, accurate converter for everyday units — length, weight, temperature, speed, area, volume, digital storage and time. Pick a category, enter a value, and see the conversion instantly across common units.",
    howTo: [
      "Choose a category (e.g. Length or Weight).",
      "Enter a value and select the 'from' unit.",
      "Select the 'to' unit to see the result instantly.",
    ],
    faqs: [
      {
        q: "How do I convert Celsius to Fahrenheit?",
        a: "Select the Temperature category, enter your value in °C and choose °F — the result updates automatically.",
      },
      {
        q: "How accurate are the conversions?",
        a: "Conversions use standard factors and are accurate to many decimal places; results are rounded for readability.",
      },
      {
        q: "Which unit types are supported?",
        a: "Length, weight/mass, temperature, speed, area, volume, digital storage and time.",
      },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  // ------------------------------- CALCULATORS -------------------------------
  {
    slug: "percentage-calculator",
    name: "Percentage Calculator",
    h1: "Free Percentage Calculator",
    title: "Percentage Calculator – Free Online Calculator | UtilityHub",
    description:
      "Calculate percentages online for free: what is X% of Y, X is what percent of Y, and percentage increase or decrease. Instant answers in your browser.",
    cardDescription: "Percent of, percent change & more.",
    category: "calculators",
    keywords: ["percentage calculator", "percent of", "percentage increase", "percentage change"],
    icon: "％",
    intro:
      "Solve the most common percentage questions in one place: what is X% of Y, X is what percent of Y, and the percentage increase or decrease between two numbers. Just fill in the fields and the answer appears instantly.",
    howTo: [
      "Pick the type of percentage calculation.",
      "Enter your numbers.",
      "Read the result — it updates as you type.",
    ],
    faqs: [
      {
        q: "How do I calculate a percentage increase?",
        a: "Use the 'percentage change' mode: subtract the old value from the new, divide by the old value, and multiply by 100. This tool does it for you.",
      },
      {
        q: "What is 15% of 200?",
        a: "30. Use the 'X% of Y' mode and enter 15 and 200 to check any values.",
      },
      {
        q: "Can it show a percentage decrease?",
        a: "Yes — a negative result in 'percentage change' mode means a decrease.",
      },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "age-calculator",
    name: "Age Calculator",
    h1: "Free Age Calculator",
    title: "Age Calculator – Free Online Calculator | UtilityHub",
    description:
      "Calculate your exact age in years, months and days from your date of birth, plus total days lived and days until your next birthday. Free and private.",
    cardDescription: "Exact age in years, months & days.",
    category: "calculators",
    keywords: ["age calculator", "date of birth calculator", "how old am i", "age in days"],
    icon: "🎂",
    intro:
      "Find your exact age from your date of birth — years, months and days — along with your total age in months, weeks and days, and a countdown to your next birthday. All calculations run in your browser.",
    howTo: [
      "Enter your date of birth.",
      "Optionally change the 'age at' date (defaults to today).",
      "See your exact age and next-birthday countdown.",
    ],
    faqs: [
      {
        q: "How is my exact age calculated?",
        a: "We count complete years, then the remaining whole months, then the leftover days, accounting for varying month lengths and leap years.",
      },
      {
        q: "Can I calculate age at a past or future date?",
        a: "Yes — change the second date to any day to find someone's age on that date.",
      },
      {
        q: "Is my birth date stored?",
        a: "No. The calculation happens in your browser and nothing is saved or uploaded.",
      },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },

  // ===================== PHASE 2 =====================
  // ------------------------------- CALCULATORS -------------------------------
  {
    slug: "loan-calculator",
    name: "EMI / Loan Calculator",
    h1: "Free EMI & Loan Calculator",
    title: "EMI / Loan Calculator – Free Online Calculator | UtilityHub",
    description:
      "Calculate your monthly loan EMI, total interest and total payment for home, car or personal loans. Free amortization breakdown, instant and private.",
    cardDescription: "Monthly EMI, total interest & payment.",
    category: "calculators",
    keywords: ["emi calculator", "loan calculator", "monthly payment", "home loan emi", "car loan"],
    icon: "🏦",
    intro:
      "Work out the monthly instalment (EMI) on any loan — home, car, personal or education — from the loan amount, interest rate and tenure. See the total interest you'll pay over the life of the loan and how principal and interest split each period. Everything is calculated instantly in your browser.",
    howTo: [
      "Enter the loan amount (principal).",
      "Enter the annual interest rate.",
      "Enter the loan tenure in years or months.",
      "Instantly see your monthly EMI, total interest and total payable.",
    ],
    faqs: [
      { q: "How is EMI calculated?", a: "EMI = P × r × (1+r)^n / ((1+r)^n − 1), where P is the principal, r is the monthly interest rate and n is the number of months. This tool does the math for you." },
      { q: "Does a longer tenure reduce my EMI?", a: "Yes — a longer tenure lowers the monthly EMI but increases the total interest you pay overall." },
      { q: "Is this calculator accurate for any currency?", a: "Yes. It's currency-agnostic — the numbers are the same regardless of the currency symbol you have in mind." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "gst-calculator",
    name: "GST / Sales Tax Calculator",
    h1: "Free GST & Sales Tax Calculator",
    title: "GST / Sales Tax Calculator – Free Online Calculator | UtilityHub",
    description:
      "Add or remove GST or sales tax from any amount. Calculate the tax portion, net and gross totals at any rate instantly. Free, private, in-browser.",
    cardDescription: "Add or remove GST / sales tax at any rate.",
    category: "calculators",
    keywords: ["gst calculator", "sales tax calculator", "vat calculator", "add gst", "reverse gst"],
    icon: "🧾",
    intro:
      "Quickly add tax to a net price or extract the tax already included in a gross price. Works for GST, VAT or any sales tax rate — just enter the amount and rate to see the tax portion and the net/gross totals.",
    howTo: [
      "Enter the amount.",
      "Enter the tax rate (%).",
      "Choose whether to add tax (exclusive) or remove tax (inclusive).",
      "Read the tax amount and the net/gross totals.",
    ],
    faqs: [
      { q: "How do I remove GST from a total?", a: "Choose 'remove tax'. The net = total ÷ (1 + rate/100), and the tax is the difference. This tool computes both instantly." },
      { q: "Can I use any tax rate?", a: "Yes — enter any percentage, so it works for GST, VAT and local sales tax rates." },
      { q: "What's the difference between adding and removing tax?", a: "Adding assumes your amount is pre-tax and calculates the tax on top; removing assumes tax is already included and extracts it." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "bmi-calculator",
    name: "BMI Calculator",
    h1: "Free BMI Calculator",
    title: "BMI Calculator – Free Online Calculator | UtilityHub",
    description:
      "Calculate your Body Mass Index (BMI) in metric or imperial units and see your weight category. Free, instant and private BMI calculator.",
    cardDescription: "Body Mass Index in metric or imperial.",
    category: "calculators",
    keywords: ["bmi calculator", "body mass index", "bmi chart", "healthy weight", "bmi metric imperial"],
    icon: "⚖️",
    intro:
      "Calculate your Body Mass Index from your height and weight in either metric (cm/kg) or imperial (ft-in/lb) units. See your BMI value and which category it falls into — underweight, normal, overweight or obese — with the healthy-weight range for your height.",
    howTo: [
      "Choose metric or imperial units.",
      "Enter your height and weight.",
      "See your BMI and weight category instantly.",
    ],
    faqs: [
      { q: "What is a healthy BMI?", a: "For most adults a BMI between 18.5 and 24.9 is considered the healthy range. Below 18.5 is underweight and 25+ is overweight." },
      { q: "How is BMI calculated?", a: "BMI = weight (kg) ÷ height (m)². For imperial units we convert first. This tool handles the conversion automatically." },
      { q: "Is BMI accurate for everyone?", a: "BMI is a useful general guide but doesn't account for muscle mass, age or body composition. Treat it as a starting point, not a diagnosis." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  // ------------------------------- CONVERTERS -------------------------------
  {
    slug: "currency-converter",
    name: "Currency Converter",
    h1: "Free Currency Converter",
    title: "Currency Converter – Free Online Converter | UtilityHub",
    description:
      "Convert between 150+ world currencies with up-to-date exchange rates. Fast, free currency conversion with no sign-up required.",
    cardDescription: "Convert 150+ currencies at live rates.",
    category: "converters",
    keywords: ["currency converter", "exchange rate", "usd to eur", "money converter", "forex"],
    icon: "💱",
    intro:
      "Convert between more than 150 world currencies using up-to-date reference exchange rates. Enter an amount, pick your currencies and get the converted value instantly. Rates are fetched from a free public exchange-rate API when the page loads.",
    howTo: [
      "Enter the amount to convert.",
      "Select the 'from' and 'to' currencies.",
      "See the converted amount and the current rate.",
    ],
    faqs: [
      { q: "How current are the exchange rates?", a: "Rates come from a free public exchange-rate service and are typically updated daily. They're reference rates — your bank or card may apply a slightly different rate plus fees." },
      { q: "Which currencies are supported?", a: "Over 150 major and minor currencies, including USD, EUR, GBP, JPY, INR, AUD, CAD and many more." },
      { q: "Is this suitable for actual trades?", a: "It's great for estimates and everyday conversions, but for real transactions always check the exact rate your provider offers." },
    ],
    privacyNote:
      "Amounts are converted in your browser. To fetch live rates we request public exchange-rate data — your amounts are never sent anywhere.",
    available: true,
  },
  // ------------------------------- PDF -------------------------------
  {
    slug: "pdf-to-jpg",
    name: "PDF ↔ JPG Converter",
    h1: "Free PDF to JPG Converter",
    title: "PDF to JPG Converter – Free Online PDF Tool | UtilityHub",
    description:
      "Convert PDF pages to JPG images, or combine JPG/PNG images into a PDF — free and private. Each page becomes a high-quality image, all in your browser.",
    cardDescription: "PDF pages → JPG images, or images → PDF.",
    category: "pdf-tools",
    keywords: ["pdf to jpg", "pdf to image", "jpg to pdf", "convert pdf to jpg", "image to pdf"],
    icon: "🖼️",
    intro:
      "Turn each page of a PDF into a high-quality JPG image, or go the other way and combine several JPG/PNG images into a single PDF. Both directions run entirely in your browser — nothing is uploaded. Multiple images are delivered as a convenient ZIP.",
    howTo: [
      "Pick a direction: PDF → JPG or images → PDF.",
      "Upload your PDF, or drop in your images.",
      "Adjust quality/resolution if needed.",
      "Download the JPGs (as a ZIP) or the combined PDF.",
    ],
    faqs: [
      { q: "Does each PDF page become a separate image?", a: "Yes. Every page is rendered to its own JPG. When there's more than one page, we bundle them into a ZIP for you." },
      { q: "Can I control the image quality?", a: "Yes — a resolution/quality control lets you balance sharpness against file size." },
      { q: "Are my files uploaded?", a: "No. Rendering and conversion happen in your browser; your files never leave your device." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "pdf-to-word",
    name: "PDF ↔ Word Converter",
    h1: "Free PDF to Word Converter",
    title: "PDF to Word Converter – Free Online PDF Tool | UtilityHub",
    description:
      "Convert PDF to an editable Word (.docx) document, or turn a Word file into a PDF — free and in your browser. Extract text from PDFs into Word with no upload.",
    cardDescription: "PDF → editable Word, or Word → PDF.",
    category: "pdf-tools",
    keywords: ["pdf to word", "pdf to docx", "word to pdf", "convert pdf to word", "docx to pdf"],
    icon: "📝",
    intro:
      "Extract the text from a PDF into an editable Word (.docx) document, or convert a Word document into a PDF — right in your browser. Ideal for reusing text from a PDF. Because layout in PDFs is complex, PDF → Word focuses on getting your text out cleanly rather than pixel-perfect formatting.",
    howTo: [
      "Choose a direction: PDF → Word or Word → PDF.",
      "Upload your file.",
      "Click Convert.",
      "Download the resulting .docx or .pdf.",
    ],
    faqs: [
      { q: "Will the Word file look exactly like the PDF?", a: "PDF → Word extracts the text into an editable document paragraph by paragraph. Complex layouts, columns and images may not be reproduced exactly — the goal is clean, editable text." },
      { q: "Does Word → PDF keep my formatting?", a: "It converts your document's headings, paragraphs and basic styling to a PDF. Very complex Word layouts may render approximately." },
      { q: "Is my document private?", a: "Yes — the conversion runs entirely in your browser and nothing is uploaded." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  // ------------------------------- MEDIA -------------------------------
  {
    slug: "video-frame-extractor",
    name: "Video Frame Extractor",
    h1: "Free Video Frame Extractor",
    title: "Video Frame Extractor – Free Online Media Tool | UtilityHub",
    description:
      "Extract still frames from a video as images, capture the current frame or grab frames at fixed intervals. Free, private, in-browser video frame grabber.",
    cardDescription: "Grab still images from any video.",
    category: "media-tools",
    keywords: ["video frame extractor", "extract frame from video", "video to image", "capture video frame", "video screenshot"],
    icon: "🎞️",
    intro:
      "Pull sharp still images out of a video — perfect for thumbnails, stills and reference frames. Scrub to any moment and capture that frame, or automatically grab frames at a fixed interval. Your video is read locally by your browser and never uploaded.",
    howTo: [
      "Upload a video file (MP4, WebM, MOV, etc.).",
      "Scrub to a moment and capture that frame, or set an interval to grab many.",
      "Preview the captured frames.",
      "Download individual frames or all of them as a ZIP.",
    ],
    faqs: [
      { q: "Which video formats work?", a: "Any format your browser can play — typically MP4 (H.264), WebM and often MOV. Frame capture uses the built-in video decoder." },
      { q: "What resolution are the frames?", a: "Frames are captured at the video's native resolution and saved as high-quality images." },
      { q: "Is my video uploaded?", a: "No. The video is played and captured locally in your browser; nothing is sent to a server." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "video-converter",
    name: "Video Format Converter",
    h1: "Free Video Format Converter",
    title: "Video Format Converter – Free Online Media Tool | UtilityHub",
    description:
      "Convert video files between MP4, WebM and GIF right in your browser with ffmpeg. Free, private video conversion — your files never leave your device.",
    cardDescription: "Convert MP4, WebM & GIF in your browser.",
    category: "media-tools",
    keywords: ["video converter", "mp4 converter", "webm to mp4", "video to gif", "convert video"],
    icon: "🎥",
    intro:
      "Convert short video clips between MP4, WebM and animated GIF — entirely in your browser using ffmpeg compiled to WebAssembly. No uploads, no watermarks. Because conversion runs on your device, it's best suited to smaller clips.",
    howTo: [
      "Upload a video file.",
      "Choose the output format (MP4, WebM or GIF).",
      "Click Convert and wait while ffmpeg processes it locally.",
      "Download the converted video.",
    ],
    faqs: [
      { q: "Is there a file-size limit?", a: "There's no hard limit, but conversion runs on your own device's memory and CPU, so keep clips reasonably short (a few minutes) for best results." },
      { q: "Why does the first conversion take a moment to start?", a: "The ffmpeg engine (about 32 MB) loads once when you first convert. After that it's ready instantly for the rest of your session." },
      { q: "Are my videos uploaded?", a: "No. Everything is processed locally with ffmpeg.wasm — your video never leaves your browser." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "audio-converter",
    name: "Audio Format Converter",
    h1: "Free Audio Format Converter",
    title: "Audio Format Converter – Free Online Media Tool | UtilityHub",
    description:
      "Convert audio files between MP3, WAV, AAC, OGG and M4A in your browser with ffmpeg. Free, private audio conversion with no upload required.",
    cardDescription: "Convert MP3, WAV, AAC, OGG & M4A.",
    category: "media-tools",
    keywords: ["audio converter", "mp3 converter", "wav to mp3", "convert audio", "m4a to mp3"],
    icon: "🎵",
    intro:
      "Convert audio between MP3, WAV, AAC, OGG and M4A right in your browser using ffmpeg compiled to WebAssembly. No sign-up and no uploads — your audio is processed entirely on your device.",
    howTo: [
      "Upload an audio file.",
      "Pick the output format.",
      "Click Convert and let ffmpeg process it locally.",
      "Download the converted audio.",
    ],
    faqs: [
      { q: "Which formats are supported?", a: "MP3, WAV, AAC, OGG and M4A for both input and output, covering the most common audio needs." },
      { q: "Will converting reduce audio quality?", a: "Converting between lossy formats (e.g. MP3 → AAC) can slightly reduce quality. Converting to WAV is lossless but produces larger files." },
      { q: "Is my audio private?", a: "Yes. Conversion runs locally with ffmpeg.wasm; your files are never uploaded." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "youtube-downloader",
    name: "YouTube Video & Clip Downloader",
    h1: "Free YouTube Video & Clip Downloader",
    title: "YouTube Video & Clip Downloader – Free Online Media Tool | UtilityHub",
    description:
      "Download a YouTube video as MP4, extract the audio as MP3, or grab just a clip by choosing a start and end time. Free and fast.",
    cardDescription: "Download a video, or trim a clip by start/end time.",
    category: "media-tools",
    keywords: ["youtube downloader", "download youtube video", "youtube to mp4", "youtube to mp3", "youtube clip downloader", "cut youtube video"],
    icon: "▶️",
    intro:
      "Paste a YouTube link to download the full video as MP4, save the audio as MP3, or extract just a section by choosing a start and end time — only the clip you pick is downloaded, not the whole video. This tool processes your request on our server (a browser can't fetch YouTube streams directly). Only download videos you own or have the right to use.",
    howTo: [
      "Paste a YouTube video URL and click Fetch.",
      "Choose a quality (MP4 up to 1080p) or MP3 audio.",
      "To grab a clip, switch to Clip mode and set the start and end time.",
      "Click Download and save your file.",
    ],
    faqs: [
      { q: "Is it legal to download YouTube videos?", a: "Downloading is generally against YouTube's Terms of Service and most videos are copyrighted. Only download content you own, that is Creative Commons or public domain, or that you otherwise have permission to use. You are responsible for how you use this tool." },
      { q: "How do I download only part of a video?", a: "Switch to Clip mode and enter a start and end time (e.g. 1:30 to 2:15). Only that section is fetched and trimmed, so it's fast even for long videos." },
      { q: "Why isn't this processed in my browser like your other tools?", a: "Browsers can't access YouTube's protected video streams directly, so this is the one tool that runs on a server. The video is fetched, processed, streamed back to you, and the temporary file is deleted immediately." },
      { q: "Can I download age-restricted or private videos?", a: "No. This tool only works with publicly accessible videos and does not bypass restrictions or protections." },
    ],
    privacyNote:
      "Unlike our other tools, this one runs on a server (browsers can't fetch YouTube streams). Your link is used only to fetch and process the requested video, and the temporary file is deleted right after it's sent to you. Only download content you have the right to use.",
    available: true,
    serverSide: true,
  },
];

// --------------------------- Helper accessors ---------------------------

export const AVAILABLE_TOOLS = TOOLS.filter((t) => t.available);

export function getTool(slug: string): Tool | undefined {
  return TOOLS.find((t) => t.slug === slug && t.available);
}

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getToolsByCategory(categorySlug: string): Tool[] {
  return AVAILABLE_TOOLS.filter((t) => t.category === categorySlug);
}

export function categoryOf(tool: Tool): Category | undefined {
  return getCategory(tool.category);
}

/** Categories that have at least one available tool. */
export function activeCategories(): Category[] {
  return CATEGORIES.filter((c) => getToolsByCategory(c.slug).length > 0);
}
