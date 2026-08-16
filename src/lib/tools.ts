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
    slug: "time-tools",
    name: "Time",
    description:
      "World clock, stopwatch, timer, alarm, countdowns and date & time-zone converters.",
    icon: "🕐",
  },
  {
    slug: "random-tools",
    name: "Random",
    description:
      "Random numbers, passwords, names, dice, coin flips, colors, decisions and more.",
    icon: "🎲",
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
  {
    slug: "audio-tools",
    name: "Audio",
    description:
      "Convert to MP3, trim clips, boost volume, join tracks and record your voice — right in your browser.",
    icon: "🎧",
  },
  {
    slug: "investments",
    name: "Investments",
    description:
      "Plan SIPs, lumpsums and withdrawals; project returns with CAGR, XIRR and future-value calculators.",
    icon: "💰",
  },
  {
    slug: "fixed-income",
    name: "Fixed Income",
    description:
      "Maturity and interest calculators for FD, RD, PPF, EPF, NPS and popular small-savings schemes.",
    icon: "🏛️",
  },
  {
    slug: "loans",
    name: "Loans",
    description:
      "EMI, eligibility, prepayment and amortization calculators for home, car, personal and other loans.",
    icon: "💳",
  },
  {
    slug: "credit-cards",
    name: "Credit Cards",
    description:
      "Work out card EMIs, payoff time, minimum-payment traps, interest cost and balance-transfer savings.",
    icon: "🏧",
  },
  {
    slug: "savings",
    name: "Savings",
    description:
      "Plan savings goals, an emergency fund, retirement and FIRE — from vacations to financial independence.",
    icon: "🐷",
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
  {
    slug: "remove-background",
    name: "Background Remover",
    h1: "Free Background Remover",
    title: "Background Remover – Remove Image Background Free | UtilityHub",
    description:
      "Remove the background from any image for free, right in your browser. An AI model runs on your device to cut out people, products and objects — no upload, no watermark.",
    cardDescription: "AI background removal — runs on your device.",
    category: "image-tools",
    keywords: ["remove background", "background remover", "transparent background", "cut out image", "remove bg"],
    icon: "🪄",
    intro:
      "Erase the background from a photo and get a transparent PNG in seconds. Unlike most tools, this one runs an AI segmentation model entirely inside your browser — your image is never uploaded to a server. It works best on clear subjects like people, products, pets and objects. The first run downloads the model (a few MB); after that it's cached.",
    howTo: [
      "Drop in an image (JPG, PNG, WebP or HEIC).",
      "Click Remove background and wait for the on-device AI to run.",
      "Preview the cut-out on a transparent checkerboard.",
      "Download the result as a transparent PNG.",
    ],
    faqs: [
      {
        q: "Is my image uploaded anywhere?",
        a: "No. The AI model runs locally in your browser. Only the model files are downloaded from a CDN — your actual image never leaves your device.",
      },
      {
        q: "Why is the first run slow?",
        a: "The first time you use it, the browser downloads the AI model (several MB) and warms it up. After that it's cached, so subsequent images are faster.",
      },
      {
        q: "What images work best?",
        a: "Photos with a clear subject and reasonable contrast against the background — people, products, animals and objects. Very busy or low-contrast scenes are harder.",
      },
      {
        q: "Why does it use my device's CPU/GPU heavily?",
        a: "Removing a background is a compute-intensive AI task. Because it runs on your machine (not a server), it uses local resources and can take a few seconds to a minute per image.",
      },
    ],
    privacyNote:
      "This tool removes backgrounds using an AI model that runs entirely in your browser. Your image is never uploaded — only the model files are fetched from a CDN.",
    available: true,
  },
  {
    slug: "blur-image",
    name: "Image Blur",
    h1: "Free Image Blur Tool",
    title: "Blur Image – Free Online Image Tool | UtilityHub",
    description:
      "Blur an image online for free with an adjustable strength slider and a live preview. Great for backgrounds and softening photos. 100% private, in-browser.",
    cardDescription: "Blur an image with an adjustable strength slider.",
    category: "image-tools",
    keywords: ["blur image", "image blur", "gaussian blur", "blur photo", "blur picture online"],
    icon: "🌫️",
    intro:
      "Apply a smooth Gaussian blur to any image with a single slider and see the result update live before you download. Handy for creating soft backgrounds, de-emphasising detail or artistic effects. Everything is processed in your browser, so your image is never uploaded.",
    howTo: [
      "Drop in an image (JPG, PNG, WebP or HEIC).",
      "Drag the blur strength slider and watch the live preview.",
      "Click Apply blur.",
      "Download the blurred image.",
    ],
    faqs: [
      { q: "Can I blur just part of the image?", a: "This tool applies an even blur across the whole image. For hiding a face or plate, blur the image and crop, or use it together with the resizer/cropper." },
      { q: "Does blurring reduce quality?", a: "Blurring intentionally softens detail. The output resolution matches your original; only sharpness is affected." },
      { q: "Is my image uploaded?", a: "No. The blur is applied in your browser and nothing is sent to a server." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "add-watermark",
    name: "Add Watermark",
    h1: "Free Add Watermark to Image",
    title: "Add Watermark – Free Online Image Tool | UtilityHub",
    description:
      "Add a text watermark to your images online for free. Control the text, size, colour, opacity and position, or tile it diagonally across the photo. Private, in-browser.",
    cardDescription: "Stamp text watermarks with position & opacity control.",
    category: "image-tools",
    keywords: ["add watermark", "watermark image", "text watermark", "watermark photo", "copyright image"],
    icon: "💧",
    intro:
      "Protect and brand your images with a text watermark. Type your text, then adjust the size, colour, opacity and position — or tile it diagonally across the whole image so it can't be cropped out. A live preview shows exactly how it will look. Everything runs in your browser.",
    howTo: [
      "Drop in an image (JPG, PNG, WebP or HEIC).",
      "Enter your watermark text and pick a colour.",
      "Adjust size, opacity and position, or turn on tiling.",
      "Click Add watermark and download the result.",
    ],
    faqs: [
      { q: "Can I tile the watermark across the image?", a: "Yes. Turn on 'Tile across image' to repeat the watermark diagonally over the entire photo, which is much harder to crop out." },
      { q: "Can I use an image or logo as the watermark?", a: "This tool adds text watermarks. For a logo, you can add your brand name as styled text, or overlay a logo using the resizer and other tools." },
      { q: "Is my image uploaded?", a: "No. The watermark is drawn in your browser and your image never leaves your device." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "rotate-image",
    name: "Rotate Image",
    h1: "Free Rotate Image Tool",
    title: "Rotate Image – Free Online Image Tool | UtilityHub",
    description:
      "Rotate an image online for free by 90°, 180°, or any custom angle, with a live preview and optional transparent background. Fast, private, in-browser.",
    cardDescription: "Rotate by 90°, 180° or any custom angle.",
    category: "image-tools",
    keywords: ["rotate image", "rotate photo", "turn image", "rotate picture online", "straighten image"],
    icon: "🔁",
    intro:
      "Rotate any image left or right by 90°, flip it 180°, or dial in a precise custom angle to straighten a crooked photo. The canvas expands to fit the rotated image, and you can keep the exposed corners transparent (PNG/WebP) or fill them white. It all runs in your browser.",
    howTo: [
      "Drop in an image (JPG, PNG, WebP or HEIC).",
      "Use the 90° buttons or the fine-angle slider.",
      "Choose a transparent or white background for the corners.",
      "Click Apply rotation and download.",
    ],
    faqs: [
      { q: "Can I rotate by a custom angle?", a: "Yes. Use the fine-angle slider for any angle from 0–360°, which is perfect for straightening a slightly tilted horizon." },
      { q: "What happens to the corners when I rotate at an angle?", a: "Rotating a rectangle exposes triangular corners. For PNG/WebP you can keep them transparent; for JPG they're filled white." },
      { q: "Is my image uploaded?", a: "No. Rotation happens in your browser and nothing is sent to a server." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "flip-image",
    name: "Flip Image",
    h1: "Free Flip & Mirror Image Tool",
    title: "Flip Image – Free Online Image Tool | UtilityHub",
    description:
      "Flip or mirror an image online for free — horizontally, vertically or both — with a live preview. Fast, private and in-browser with no watermarks.",
    cardDescription: "Mirror an image horizontally or vertically.",
    category: "image-tools",
    keywords: ["flip image", "mirror image", "flip photo horizontally", "flip picture", "mirror photo"],
    icon: "🔃",
    intro:
      "Flip an image to create a mirror effect — horizontally, vertically, or both at once. A live preview shows the result instantly. Useful for correcting selfies, creating symmetry and design work. Everything runs locally in your browser.",
    howTo: [
      "Drop in an image (JPG, PNG, WebP or HEIC).",
      "Toggle horizontal and/or vertical flip.",
      "Check the live preview.",
      "Click Apply flip and download.",
    ],
    faqs: [
      { q: "What is the difference between flip and rotate?", a: "Flipping mirrors the image across an axis (like a reflection), while rotating turns it around its centre. Use the rotate tool if you want to turn the image." },
      { q: "Can I flip both directions at once?", a: "Yes. Enable both horizontal and vertical flip to rotate the image 180° via mirroring." },
      { q: "Is my image uploaded?", a: "No. Flipping is done in your browser and nothing is sent to a server." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "image-to-pdf",
    name: "Image to PDF",
    h1: "Free Image to PDF Converter",
    title: "Image to PDF – Free Online Converter | UtilityHub",
    description:
      "Convert JPG, PNG and other images to a PDF for free. Combine multiple images into one PDF, reorder pages, and choose page size, orientation and margins. Private, in-browser.",
    cardDescription: "Combine images into a PDF with page & margin options.",
    category: "image-tools",
    keywords: ["image to pdf", "jpg to pdf", "png to pdf", "convert image to pdf", "photos to pdf"],
    icon: "🖼️",
    intro:
      "Turn one or many images into a single PDF document. Add your photos, drag them into order, then pick A4/Letter or fit-to-image pages, choose orientation and set margins. The PDF is built entirely in your browser — your images are never uploaded.",
    howTo: [
      "Add one or more images (JPG, PNG, WebP or HEIC).",
      "Reorder them with the up/down arrows.",
      "Choose page size, orientation and margin.",
      "Click Create PDF and download.",
    ],
    faqs: [
      { q: "Can I combine several images into one PDF?", a: "Yes. Add as many images as you like — each becomes one page, in the order you arrange them." },
      { q: "What does 'Fit to image' do?", a: "It makes each PDF page exactly match its image's proportions with no margins, so nothing is cropped or letterboxed." },
      { q: "Are my images uploaded?", a: "No. The PDF is generated in your browser and your images never leave your device." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "color-picker",
    name: "Color Picker",
    h1: "Free Online Color Picker",
    title: "Color Picker – Pick Colors from Image | UtilityHub",
    description:
      "Pick a colour from any image or choose one manually, and get instant HEX, RGB and HSL values you can copy. Free, private, in-browser colour picker & eyedropper.",
    cardDescription: "Eyedrop colours from images; copy HEX, RGB & HSL.",
    category: "image-tools",
    keywords: ["color picker", "eyedropper", "pick color from image", "hex color picker", "color from photo"],
    icon: "🎨",
    intro:
      "Grab the exact colour of any pixel in an image, or pick one with the colour wheel, and instantly get its HEX, RGB and HSL values to copy. A live cursor swatch and recent-colours list make sampling several colours quick. Everything runs in your browser.",
    howTo: [
      "Drop in an image, or use the manual colour picker at the top.",
      "Move your cursor over the image to preview colours.",
      "Click a pixel to lock its colour.",
      "Copy the HEX, RGB or HSL value.",
    ],
    faqs: [
      { q: "Can I pick a colour from a photo?", a: "Yes. Upload an image and click anywhere on it to sample that pixel's exact colour, shown as HEX, RGB and HSL." },
      { q: "What colour formats do I get?", a: "Each picked colour is shown as HEX, RGB and HSL, and any of them can be copied with one click." },
      { q: "Is my image uploaded?", a: "No. Colour sampling happens in your browser and your image never leaves your device." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "palette-generator",
    name: "Color Palette Generator",
    h1: "Free Color Palette Generator from Image",
    title: "Color Palette Generator – Extract Colors from Image | UtilityHub",
    description:
      "Generate a colour palette from any image for free. Extract the dominant colours with HEX, RGB and HSL values, choose how many, and copy them as CSS variables. Private, in-browser.",
    cardDescription: "Extract a dominant-colour palette from any image.",
    category: "image-tools",
    keywords: ["color palette generator", "extract colors from image", "image color palette", "dominant colors", "palette from photo"],
    icon: "🎨",
    intro:
      "Pull a beautiful colour palette out of any image. This tool analyses the picture and extracts its dominant colours using median-cut quantisation, showing each as HEX, RGB and HSL. Choose how many colours you want and copy the whole palette as CSS variables. It all runs in your browser.",
    howTo: [
      "Drop in an image (JPG, PNG, WebP or HEIC).",
      "Choose how many colours to extract with the slider.",
      "Click any swatch to copy its HEX value.",
      "Copy the full palette as CSS variables if you like.",
    ],
    faqs: [
      { q: "How are the colours chosen?", a: "The image is analysed and its colours are grouped using median-cut quantisation, then the most prominent groups are returned as your palette." },
      { q: "Can I change how many colours I get?", a: "Yes. Use the slider to extract anywhere from 3 to 12 colours." },
      { q: "Is my image uploaded?", a: "No. The palette is computed in your browser and your image never leaves your device." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "exif-viewer",
    name: "EXIF Viewer",
    h1: "Free EXIF Data Viewer",
    title: "EXIF Viewer – View Photo Metadata Online | UtilityHub",
    description:
      "View the EXIF metadata of your photos for free — camera model, lens, exposure, ISO, date taken and GPS location. Read privately in your browser, nothing uploaded.",
    cardDescription: "Inspect camera, exposure & GPS metadata in photos.",
    category: "image-tools",
    keywords: ["exif viewer", "photo metadata", "exif data", "image metadata viewer", "check photo gps"],
    icon: "🔍",
    intro:
      "See the hidden metadata stored inside your photos. Drop in a JPEG from a camera or phone and view the camera make and model, lens, exposure time, aperture, ISO, focal length, the date it was taken and even the GPS location if present. The file is read entirely in your browser and never uploaded.",
    howTo: [
      "Drop in a photo (JPEGs carry the most EXIF data).",
      "Review the file details and full EXIF table.",
      "If GPS data is present, open the location on a map.",
    ],
    faqs: [
      { q: "Why does my image show no EXIF data?", a: "PNGs, WebP, screenshots and images exported by many apps have their metadata stripped. EXIF is most commonly found in JPEGs straight from cameras and phones." },
      { q: "Can it show where a photo was taken?", a: "Yes, if the photo contains GPS coordinates. You'll see the latitude/longitude and a link to view the spot on a map." },
      { q: "Is my photo uploaded?", a: "No. The metadata is read in your browser and your photo never leaves your device." },
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
  {
    slug: "character-counter",
    name: "Character Counter",
    h1: "Free Character Counter",
    title: "Character Counter – Free Online Text Tool | UtilityHub",
    description:
      "Count characters, words and lines in real time, with live limit indicators for Twitter/X, SMS, meta descriptions and more. Free, private, in-browser.",
    cardDescription: "Live character count with platform limits.",
    category: "text-tools",
    keywords: ["character counter", "letter count", "character limit", "twitter character count", "sms length"],
    icon: "🔤",
    intro:
      "Count the exact number of characters in your text as you type — with and without spaces — plus words, lines and bytes. Live limit meters for Twitter/X, SMS, meta descriptions and headlines show how much room you have left. Everything runs in your browser and nothing is sent anywhere.",
    howTo: [
      "Type or paste your text into the box.",
      "Watch the character, word and line counts update live.",
      "Check the limit meters to stay within platform limits.",
    ],
    faqs: [
      { q: "Does it count spaces?", a: "Both totals are shown: characters including spaces and characters excluding spaces, so you can use whichever a platform requires." },
      { q: "What limits are shown?", a: "Common ones like Twitter/X (280), SMS (160), and the ~160-character meta-description sweet spot, each with a live progress meter." },
      { q: "Is my text private?", a: "Yes — counting happens entirely in your browser and your text is never uploaded." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "remove-duplicate-lines",
    name: "Remove Duplicate Lines",
    h1: "Remove Duplicate Lines Online",
    title: "Remove Duplicate Lines – Free Online Text Tool | UtilityHub",
    description:
      "Remove duplicate lines from a list or text instantly, keeping the first occurrence. Optional case-insensitive matching and whitespace trimming. Free and private.",
    cardDescription: "Delete repeated lines, keep the first of each.",
    category: "text-tools",
    keywords: ["remove duplicate lines", "delete duplicate lines", "dedupe list", "unique lines", "remove repeated lines"],
    icon: "🧹",
    intro:
      "Clean up a list by removing duplicate lines while keeping the first occurrence of each, in order. Ideal for tidying up email lists, keyword lists, log lines and CSV columns. Optionally ignore case and surrounding whitespace when comparing. It all runs in your browser.",
    howTo: [
      "Paste your lines into the input box.",
      "Choose whether to ignore case and trim whitespace when comparing.",
      "Copy the de-duplicated result from the output.",
    ],
    faqs: [
      { q: "Does it keep the order of my lines?", a: "Yes. The first occurrence of each line is kept in its original position; later duplicates are removed." },
      { q: "Can it ignore case?", a: "Yes. Turn on 'ignore case' so that, for example, 'Apple' and 'apple' are treated as duplicates." },
      { q: "Is my list uploaded?", a: "No. The de-duplication runs in your browser and nothing is sent to a server." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "sort-lines",
    name: "Sort Lines",
    h1: "Sort Lines Alphabetically Online",
    title: "Sort Lines – Free Online Text Tool | UtilityHub",
    description:
      "Sort lines of text alphabetically (A–Z or Z–A), numerically, or reverse and shuffle them. Optional case-insensitive sorting and duplicate removal. Free and private.",
    cardDescription: "Sort lines A–Z, Z–A, numeric or shuffle.",
    category: "text-tools",
    keywords: ["sort lines", "alphabetize", "sort alphabetically", "sort list", "sort numbers"],
    icon: "🔃",
    intro:
      "Sort any list of lines alphabetically (A–Z or Z–A), numerically, by length, or shuffle them randomly. Handy for organizing lists, names, imports and data columns. Options let you ignore case and drop duplicates in the same pass. Processing happens entirely in your browser.",
    howTo: [
      "Paste your list into the input box.",
      "Pick a sort order (A–Z, Z–A, numeric, length or shuffle).",
      "Copy the sorted lines from the output.",
    ],
    faqs: [
      { q: "Can it sort numbers correctly?", a: "Yes. Choose numeric sort to order lines by their numeric value rather than as text, so 2 comes before 10." },
      { q: "Can I remove duplicates while sorting?", a: "Yes. Enable 'remove duplicates' to output only the unique lines in sorted order." },
      { q: "Is my data private?", a: "Yes — sorting runs in your browser and your text is never uploaded." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "reverse-text",
    name: "Reverse Text",
    h1: "Reverse Text Online",
    title: "Reverse Text – Free Online Text Tool | UtilityHub",
    description:
      "Reverse text by characters, words or lines. Flip a string backwards, reverse word order, or flip the order of lines instantly. Free, private, in-browser.",
    cardDescription: "Flip text by characters, words or lines.",
    category: "text-tools",
    keywords: ["reverse text", "backwards text", "flip text", "reverse string", "reverse words"],
    icon: "🪞",
    intro:
      "Reverse your text in three ways: flip the characters so it reads backwards, reverse the order of the words, or flip the order of the lines. Great for puzzles, testing and formatting. It runs instantly in your browser and nothing is uploaded.",
    howTo: [
      "Type or paste your text.",
      "Choose to reverse by characters, words or lines.",
      "Copy the reversed result.",
    ],
    faqs: [
      { q: "What is the difference between the modes?", a: "'Characters' flips the whole string backwards, 'words' keeps each word but reverses their order, and 'lines' flips the order of the lines." },
      { q: "Does it handle emoji correctly?", a: "Character reversal is Unicode-aware, so multi-byte characters and most emoji are kept intact rather than being split." },
      { q: "Is my text private?", a: "Yes — everything runs in your browser and nothing is uploaded." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "random-text-generator",
    name: "Random Text Generator",
    h1: "Random Text & String Generator",
    title: "Random Text Generator – Free Online Text Tool | UtilityHub",
    description:
      "Generate random strings, passwords, numbers and placeholder words. Choose length, character sets and quantity. Great for test data and passwords. Free and private.",
    cardDescription: "Random strings, passwords, numbers & words.",
    category: "text-tools",
    keywords: ["random text generator", "random string", "random password", "random letters", "test data generator"],
    icon: "🎲",
    intro:
      "Generate random text for testing, passwords or sample data. Pick the character sets (uppercase, lowercase, digits, symbols), set the length and how many to generate, and get fresh random strings instantly. Randomness uses your browser's secure crypto generator, and nothing is sent anywhere.",
    howTo: [
      "Choose which character sets to include and the length.",
      "Set how many strings you want.",
      "Click Generate and copy the results.",
    ],
    faqs: [
      { q: "Are the strings cryptographically random?", a: "Yes. They use the browser's crypto.getRandomValues, making them suitable for passwords and tokens." },
      { q: "Can I generate multiple at once?", a: "Yes. Set the quantity to generate a batch of random strings in one click." },
      { q: "Is anything sent to a server?", a: "No. Generation happens entirely in your browser." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "lorem-ipsum",
    name: "Lorem Ipsum Generator",
    h1: "Free Lorem Ipsum Generator",
    title: "Lorem Ipsum Generator – Free Placeholder Text | UtilityHub",
    description:
      "Generate Lorem Ipsum placeholder text by paragraphs, sentences or words. Optionally start with the classic 'Lorem ipsum dolor sit amet'. Copy instantly. Free and private.",
    cardDescription: "Placeholder text by paragraphs, sentences or words.",
    category: "text-tools",
    keywords: ["lorem ipsum", "lorem ipsum generator", "placeholder text", "dummy text", "filler text"],
    icon: "📜",
    intro:
      "Generate classic Lorem Ipsum placeholder text for mockups, designs and layouts. Choose how many paragraphs, sentences or words you need and whether to begin with the traditional 'Lorem ipsum dolor sit amet…'. Copy the result with one click. It all runs locally in your browser.",
    howTo: [
      "Choose the amount and unit (paragraphs, sentences or words).",
      "Toggle whether to start with the classic opening line.",
      "Click Generate and copy the placeholder text.",
    ],
    faqs: [
      { q: "What is Lorem Ipsum?", a: "It's scrambled Latin-like placeholder text used since the 1500s in typesetting and design to show layout without meaningful content distracting the viewer." },
      { q: "Can I generate just a few words?", a: "Yes. Switch the unit to words or sentences and set the exact amount you need." },
      { q: "Is it free to use?", a: "Yes — the generated text is free to use anywhere, and generation happens entirely in your browser." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "remove-empty-lines",
    name: "Remove Empty Lines",
    h1: "Remove Empty Lines Online",
    title: "Remove Empty Lines – Free Online Text Tool | UtilityHub",
    description:
      "Remove blank and empty lines from text instantly. Optionally collapse multiple blank lines into one, or drop whitespace-only lines. Free, private, in-browser.",
    cardDescription: "Strip blank lines from text.",
    category: "text-tools",
    keywords: ["remove empty lines", "remove blank lines", "delete empty lines", "strip blank lines", "compact text"],
    icon: "🧽",
    intro:
      "Strip out empty and blank lines to compact your text. Choose to remove all blank lines, treat whitespace-only lines as blank, or simply collapse runs of multiple blank lines down to a single one. Perfect for cleaning up pasted content, code and lists. Runs entirely in your browser.",
    howTo: [
      "Paste your text into the input box.",
      "Pick whether to remove all blank lines or just collapse extra ones.",
      "Copy the cleaned-up result.",
    ],
    faqs: [
      { q: "Does it remove lines with only spaces?", a: "If you enable 'treat whitespace as empty', lines containing only spaces or tabs are removed as well." },
      { q: "Can I keep single blank lines?", a: "Yes. Choose 'collapse blank lines' to reduce multiple consecutive blanks to a single blank line instead of removing them all." },
      { q: "Is my text uploaded?", a: "No. The cleanup runs in your browser and nothing is sent anywhere." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "find-and-replace",
    name: "Find and Replace",
    h1: "Online Find and Replace Text",
    title: "Find and Replace – Free Online Text Tool | UtilityHub",
    description:
      "Find and replace text online, with case-insensitive matching, whole-word matching and full regular-expression support (including capture groups). Free and private.",
    cardDescription: "Find & replace text, with regex support.",
    category: "text-tools",
    keywords: ["find and replace", "search and replace", "replace text", "regex replace", "bulk replace"],
    icon: "🔎",
    intro:
      "Search your text and replace every match at once. Do a plain find-and-replace, match whole words only, ignore case, or switch on full regular-expression mode with support for capture groups like $1. A live match count shows how many replacements will be made. Everything runs in your browser.",
    howTo: [
      "Paste your text and type what to find and what to replace it with.",
      "Toggle case-insensitive, whole-word or regex mode as needed.",
      "Review the match count and copy the replaced text.",
    ],
    faqs: [
      { q: "Does it support regular expressions?", a: "Yes. Enable regex mode to use patterns and capture groups (reference them as $1, $2 in the replacement)." },
      { q: "Can I replace whole words only?", a: "Yes. Whole-word mode wraps your search in word boundaries so partial matches inside larger words are skipped." },
      { q: "Is my text private?", a: "Yes — the replacement runs in your browser and nothing is uploaded." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "trim-whitespace",
    name: "Trim Whitespace",
    h1: "Trim Whitespace Online",
    title: "Trim Whitespace – Free Online Text Tool | UtilityHub",
    description:
      "Trim leading and trailing spaces, collapse multiple spaces into one, remove tabs and clean up messy whitespace in text. Free, instant and private.",
    cardDescription: "Trim & collapse messy whitespace.",
    category: "text-tools",
    keywords: ["trim whitespace", "remove extra spaces", "collapse spaces", "trim spaces", "clean whitespace"],
    icon: "✂️",
    intro:
      "Tidy up messy spacing in your text. Trim leading and trailing spaces from each line, collapse runs of multiple spaces into a single space, convert tabs to spaces and remove trailing blank lines. Great for cleaning up pasted content and data. It all runs in your browser.",
    howTo: [
      "Paste your text into the input box.",
      "Choose which whitespace fixes to apply.",
      "Copy the cleaned-up text.",
    ],
    faqs: [
      { q: "What does 'collapse spaces' do?", a: "It replaces any run of two or more spaces with a single space, which is handy for text copied with irregular spacing." },
      { q: "Does it affect line breaks?", a: "By default line breaks are preserved; the tool only cleans horizontal whitespace unless you also remove blank lines." },
      { q: "Is my text private?", a: "Yes — everything runs in your browser and nothing is uploaded." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "unicode-inspector",
    name: "Unicode Inspector",
    h1: "Unicode Character Inspector",
    title: "Unicode Inspector – Character & Code Point Tool | UtilityHub",
    description:
      "Inspect any text character by character: see each Unicode code point, name, hex value, UTF-8 bytes and category. Reveal hidden and invisible characters. Free and private.",
    cardDescription: "See code points, names & bytes for each character.",
    category: "text-tools",
    keywords: ["unicode inspector", "code point", "character inspector", "utf-8 bytes", "unicode lookup"],
    icon: "🔬",
    intro:
      "Break any text down into its individual Unicode characters and see exactly what they are — the code point (U+XXXX), the character's name, its hexadecimal value and UTF-8 byte sequence. Perfect for spotting hidden, invisible or look-alike characters that cause bugs. Everything is analysed in your browser.",
    howTo: [
      "Paste or type the text you want to inspect.",
      "Read the per-character table of code points and details.",
      "Use it to spot invisible or unexpected characters.",
    ],
    faqs: [
      { q: "Can it reveal invisible characters?", a: "Yes. Zero-width spaces, non-breaking spaces and other invisible characters appear as rows in the table with their code points, so you can find them." },
      { q: "What is a code point?", a: "A code point is the numeric value Unicode assigns to a character, written like U+0041 for 'A'. The tool shows it for every character." },
      { q: "Is my text uploaded?", a: "No. The analysis runs entirely in your browser." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "emoji-picker",
    name: "Emoji Picker",
    h1: "Online Emoji Picker",
    title: "Emoji Picker – Search & Copy Emojis | UtilityHub",
    description:
      "Search hundreds of emojis by name and copy them with one click. Browse by category and keep a list of recently used emojis. Free, fast and private.",
    cardDescription: "Search and copy emojis by name.",
    category: "text-tools",
    keywords: ["emoji picker", "copy emoji", "emoji search", "emoji keyboard", "emoji list"],
    icon: "😀",
    intro:
      "Find the right emoji fast. Search hundreds of emojis by name or keyword, browse them by category, and click any one to copy it to your clipboard. Your recently used emojis are remembered on this device for quick reuse. It all runs in your browser.",
    howTo: [
      "Search by name (e.g. 'heart', 'fire') or scroll the categories.",
      "Click an emoji to copy it to your clipboard.",
      "Reuse your recently copied emojis from the top row.",
    ],
    faqs: [
      { q: "How do I copy an emoji?", a: "Just click it — the emoji is copied to your clipboard and you'll see a brief confirmation." },
      { q: "Will the emojis look the same everywhere?", a: "Emojis render using each device's own emoji font, so the exact style varies by platform, but the character is identical." },
      { q: "Is anything tracked?", a: "No. Your recently used list is stored only in this browser and nothing is uploaded." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "fancy-text-generator",
    name: "Fancy Text Generator",
    h1: "Fancy Text Generator",
    title: "Fancy Text Generator – Stylish Unicode Text | UtilityHub",
    description:
      "Turn plain text into fancy Unicode styles — bold, italic, script, bubbles, squares, small caps, upside-down and strikethrough — for social media bios and posts. Free and private.",
    cardDescription: "Turn text into stylish Unicode fonts.",
    category: "text-tools",
    keywords: ["fancy text generator", "stylish text", "unicode fonts", "cool text", "instagram fonts"],
    icon: "🎨",
    intro:
      "Transform your text into eye-catching Unicode styles you can paste into social bios, posts, usernames and messages — 𝐛𝐨𝐥𝐝, 𝑖𝑡𝑎𝑙𝑖𝑐, 𝓼𝓬𝓻𝓲𝓹𝓽, Ⓑⓤⓑⓑⓛⓔⓢ, 🅂🅀🅄🄰🅁🄴🅂, smɐll cɐps, upside-down and more. These are real Unicode characters, not images, so they work almost anywhere. It all runs in your browser.",
    howTo: [
      "Type or paste your text.",
      "Browse the styled variations that appear.",
      "Click any style to copy it, then paste it wherever you like.",
    ],
    faqs: [
      { q: "Will these fonts work on Instagram and Twitter?", a: "Yes. They're standard Unicode characters, so they paste into most bios, posts and usernames — though a few platforms or fonts may not display every style." },
      { q: "Are these actual fonts?", a: "No — they're alternative Unicode letter shapes, which is why you can copy and paste them as plain text rather than needing a font installed." },
      { q: "Is my text private?", a: "Yes — the conversion happens in your browser and nothing is uploaded." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "slug-generator",
    name: "Slug Generator",
    h1: "URL Slug Generator",
    title: "Slug Generator – Free URL Slug Tool | UtilityHub",
    description:
      "Convert titles and text into clean, SEO-friendly URL slugs. Lowercases, removes accents and special characters, and joins words with hyphens. Free and private.",
    cardDescription: "Turn titles into clean URL slugs.",
    category: "text-tools",
    keywords: ["slug generator", "url slug", "seo slug", "slugify", "permalink generator"],
    icon: "🔖",
    intro:
      "Turn any title or phrase into a clean, SEO-friendly URL slug. It lowercases the text, strips accents and special characters, and joins words with hyphens (or a separator you choose). Great for blog permalinks, filenames and IDs. Everything runs in your browser.",
    howTo: [
      "Type or paste your title or text.",
      "Choose a separator and whether to force lowercase.",
      "Copy the generated slug.",
    ],
    faqs: [
      { q: "Does it handle accented characters?", a: "Yes. Accents are converted to their closest ASCII letters (é → e) so the slug is clean and URL-safe." },
      { q: "Can I use underscores instead of hyphens?", a: "Yes. Pick your preferred separator — hyphen is the SEO-friendly default, but underscore and others are available." },
      { q: "Is my text private?", a: "Yes — everything runs in your browser and nothing is uploaded." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "html-escape",
    name: "HTML Escape / Unescape",
    h1: "HTML Escape & Unescape",
    title: "HTML Escape / Unescape – Free Online Text Tool | UtilityHub",
    description:
      "Escape HTML special characters to entities (< &lt;, & &amp;) or unescape entities back to characters. Safely display code in HTML. Free, private, in-browser.",
    cardDescription: "Escape or unescape HTML entities.",
    category: "text-tools",
    keywords: ["html escape", "html unescape", "html entities", "escape html", "encode html"],
    icon: "🔣",
    intro:
      "Convert text to and from HTML entities. Escaping turns characters like <, >, & and quotes into their safe entity equivalents so you can display code or user content inside HTML without it being interpreted. Unescaping turns entities back into readable characters. Both directions run in your browser.",
    howTo: [
      "Paste your text or HTML.",
      "Choose Escape (characters → entities) or Unescape (entities → characters).",
      "Copy the converted result.",
    ],
    faqs: [
      { q: "Why would I escape HTML?", a: "Escaping prevents characters like < and & from being treated as markup, so you can safely show code snippets or untrusted text inside a web page." },
      { q: "Which characters are escaped?", a: "The core HTML-sensitive characters — <, >, &, double and single quotes — are converted to their named or numeric entities." },
      { q: "Is my text private?", a: "Yes — the conversion runs in your browser and nothing is uploaded." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "url-encode",
    name: "URL Encode / Decode",
    h1: "URL Encode & Decode",
    title: "URL Encode / Decode – Free Online Text Tool | UtilityHub",
    description:
      "Percent-encode text for safe use in URLs, or decode URL-encoded strings back to plain text. Supports full-component and full-URI encoding. Free and private.",
    cardDescription: "Percent-encode or decode URL text.",
    category: "text-tools",
    keywords: ["url encode", "url decode", "percent encoding", "encode uri", "decode url"],
    icon: "🔗",
    intro:
      "Encode text so it's safe to drop into a URL — spaces, symbols and non-ASCII characters become percent-encoded — or decode an encoded string back into readable text. Choose component encoding (for a single query value) or full-URI encoding. Both directions run in your browser.",
    howTo: [
      "Paste the text or URL you want to convert.",
      "Choose Encode or Decode, and component vs full-URI mode.",
      "Copy the result.",
    ],
    faqs: [
      { q: "What's the difference between component and URI encoding?", a: "Component encoding (encodeURIComponent) escapes characters like &, = and ? so it's right for a single query value; URI encoding keeps those structural characters for a whole URL." },
      { q: "Why is my space shown as %20?", a: "Spaces aren't allowed in URLs, so they're percent-encoded as %20 (or + in some contexts). Decoding turns them back into spaces." },
      { q: "Is my text private?", a: "Yes — everything runs in your browser and nothing is uploaded." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "base64",
    name: "Base64 Encode / Decode",
    h1: "Base64 Encode & Decode",
    title: "Base64 Encode / Decode – Free Online Text Tool | UtilityHub",
    description:
      "Encode text to Base64 or decode Base64 back to text, with full Unicode (UTF-8) support and an optional URL-safe alphabet. Fast, free and private.",
    cardDescription: "Encode or decode Base64 (UTF-8 safe).",
    category: "text-tools",
    keywords: ["base64 encode", "base64 decode", "base64 converter", "encode base64", "decode base64"],
    icon: "🔐",
    intro:
      "Convert text to and from Base64. Encoding turns your text (including emoji and other Unicode, handled as UTF-8) into a Base64 string; decoding turns a Base64 string back into text. An optional URL-safe alphabet swaps +/ for -_ so the output is safe in URLs. Both directions run in your browser.",
    howTo: [
      "Paste your text or Base64 string.",
      "Choose Encode or Decode, and toggle URL-safe if needed.",
      "Copy the converted result.",
    ],
    faqs: [
      { q: "Does it support emoji and non-English text?", a: "Yes. Text is handled as UTF-8, so emoji and accented or non-Latin characters encode and decode correctly." },
      { q: "What is URL-safe Base64?", a: "It replaces the + and / characters with - and _ (and trims padding) so the encoded value can be used safely in URLs and filenames." },
      { q: "Is my data private?", a: "Yes — encoding and decoding run in your browser and nothing is uploaded." },
    ],
    privacyNote: PRIVACY_CLIENT,
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
    category: "time-tools",
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
  {
    slug: "pdf-rotate",
    name: "Rotate PDF",
    h1: "Free Rotate PDF Tool",
    title: "Rotate PDF – Free Online PDF Tool | UtilityHub",
    description:
      "Rotate PDF pages online for free — turn all pages or just a selection 90°, 180° or 270°, and save the result permanently. Private, in-browser, no watermark.",
    cardDescription: "Rotate all pages or a selection, and save it.",
    category: "pdf-tools",
    keywords: ["rotate pdf", "turn pdf pages", "rotate pdf online", "pdf rotate and save", "sideways pdf"],
    icon: "🔄",
    intro:
      "Fix sideways or upside-down PDF pages. Rotate every page or only the ones you choose by 90° left, 90° right or 180°, and the rotation is saved into the file so it stays that way in every viewer. Everything runs in your browser — your document is never uploaded.",
    howTo: [
      "Upload your PDF.",
      "Pick a rotation (90° right, 90° left or 180°).",
      "Choose whether to rotate all pages or specific ones.",
      "Click Rotate PDF and download.",
    ],
    faqs: [
      { q: "Does the rotation stay after I save?", a: "Yes. The rotation is written into the PDF's page metadata, so the pages open the right way up in every viewer." },
      { q: "Can I rotate only some pages?", a: "Yes. Choose 'Specific pages' and enter ranges like 1-3, 5 to rotate just those pages." },
      { q: "Is my PDF uploaded?", a: "No. Rotation happens in your browser and your file never leaves your device." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "pdf-protect",
    name: "Protect PDF",
    h1: "Free Protect PDF with Password",
    title: "Protect PDF – Add a Password Online Free | UtilityHub",
    description:
      "Password-protect a PDF for free, right in your browser. Encrypt your document so a password is required to open it — your file and password never leave your device.",
    cardDescription: "Encrypt a PDF so a password is needed to open it.",
    category: "pdf-tools",
    keywords: ["protect pdf", "password protect pdf", "encrypt pdf", "add password to pdf", "lock pdf"],
    icon: "🔒",
    intro:
      "Add a password to a PDF so only people with the password can open it. The file is encrypted entirely inside your browser using strong encryption — your document and your password are never uploaded to any server. Choose a password, confirm it, and download the protected file.",
    howTo: [
      "Upload the PDF you want to protect.",
      "Enter a password and confirm it.",
      "Click Protect PDF.",
      "Download the encrypted, password-protected file.",
    ],
    faqs: [
      { q: "Is the encryption secure?", a: "Yes. The PDF is encrypted with a standard PDF encryption scheme that requires your password to open. Choose a strong password and keep it safe." },
      { q: "Can you recover my password if I forget it?", a: "No. The protection happens locally and we never see your file or password, so a forgotten password cannot be recovered. Store it somewhere safe." },
      { q: "Is my file uploaded?", a: "No. Encryption runs in your browser and your document never leaves your device." },
    ],
    privacyNote:
      "This tool encrypts your PDF entirely in your browser. Your file and password are never uploaded to any server.",
    available: true,
  },
  {
    slug: "pdf-unlock",
    name: "Unlock PDF",
    h1: "Free Unlock PDF (Remove Password)",
    title: "Unlock PDF – Remove PDF Password Online Free | UtilityHub",
    description:
      "Remove the password from a PDF you own for free, in your browser. Enter the current password to decrypt the file and save a version that opens without one. Private and secure.",
    cardDescription: "Remove a password from a PDF you can open.",
    category: "pdf-tools",
    keywords: ["unlock pdf", "remove pdf password", "decrypt pdf", "pdf password remover", "unprotect pdf"],
    icon: "🔓",
    intro:
      "Remove password protection from a PDF so it opens freely. Enter the current password and the file is decrypted in your browser, then saved without a password. It also handles PDFs that merely restrict permissions. Only unlock documents you own or are authorised to modify — your file and password never leave your device.",
    howTo: [
      "Upload the protected PDF.",
      "Enter its current password (leave blank for permission-only locks).",
      "Click Unlock PDF.",
      "Download the unlocked file.",
    ],
    faqs: [
      { q: "Do I need to know the password?", a: "Yes, for files that require a password to open. You must be able to open the PDF yourself — this tool removes protection from documents you're authorised to unlock, it doesn't crack unknown passwords." },
      { q: "What about PDFs that only restrict printing or copying?", a: "Those permission-only locks can often be removed without a password — just leave the password field blank and unlock." },
      { q: "Is my file uploaded?", a: "No. Decryption runs in your browser and your document and password never leave your device." },
    ],
    privacyNote:
      "This tool decrypts your PDF entirely in your browser. Your file and password are never uploaded to any server.",
    available: true,
  },
  {
    slug: "pdf-extract-images",
    name: "Extract PDF Images",
    h1: "Free Extract Images from PDF",
    title: "Extract Images from PDF – Free Online PDF Tool | UtilityHub",
    description:
      "Extract and download all embedded images from a PDF for free. Pull out the original photos and graphics as PNG files, individually or as a ZIP. Private, in-browser.",
    cardDescription: "Pull embedded photos & graphics out of a PDF.",
    category: "pdf-tools",
    keywords: ["extract images from pdf", "pdf image extractor", "save pdf images", "get images from pdf", "pdf to images"],
    icon: "🖼️",
    intro:
      "Pull the embedded images out of a PDF. This tool scans each page for its picture content and saves them as PNG files that you can download one by one or all at once as a ZIP. Unlike converting pages to images, this recovers the actual embedded graphics. Everything runs in your browser.",
    howTo: [
      "Upload your PDF.",
      "Click Extract images and let it scan every page.",
      "Preview the images that were found.",
      "Save individual images or download them all as a ZIP.",
    ],
    faqs: [
      { q: "How is this different from PDF to JPG?", a: "PDF to JPG renders each whole page as an image. This tool extracts the individual images that were embedded inside the PDF, at their original resolution." },
      { q: "Why did it find no images?", a: "A PDF made purely of text and vector graphics has no embedded raster images to extract. Scanned PDFs, where each page is one big image, will return those page images." },
      { q: "Are my files uploaded?", a: "No. The extraction runs entirely in your browser and your PDF never leaves your device." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "pdf-ocr",
    name: "PDF OCR",
    h1: "Free PDF OCR – Extract Text from Scans",
    title: "PDF OCR – Extract Text from Scanned PDFs Online | UtilityHub",
    description:
      "Run OCR on scanned PDFs and images for free, right in your browser. Extract selectable, copyable text from scans and photos in several languages — nothing is uploaded.",
    cardDescription: "Recognise text in scanned PDFs & images (on-device).",
    category: "pdf-tools",
    keywords: ["pdf ocr", "ocr online", "scanned pdf to text", "extract text from image", "image to text"],
    icon: "🔎",
    intro:
      "Turn a scanned PDF or a photo of a document into selectable text. This tool runs an OCR engine entirely in your browser to recognise the words on the page, so your file is never uploaded — only the engine is downloaded on first use. Supports several languages and lets you copy or download the recognised text.",
    howTo: [
      "Upload a scanned PDF or an image.",
      "Choose the document's language.",
      "Click Extract text and wait for the on-device engine to run.",
      "Copy the recognised text or download it as a .txt file.",
    ],
    faqs: [
      { q: "Is my document uploaded?", a: "No. The OCR engine runs locally in your browser. Only the engine and language data are downloaded from a CDN — your file never leaves your device." },
      { q: "Why is the first run slow?", a: "The first time you use it, the browser downloads the OCR engine and language data (a few MB) and warms it up. After that it's cached, and recognition is faster." },
      { q: "How accurate is it?", a: "Accuracy depends on scan quality. Clear, high-resolution, straight scans in the selected language give the best results; blurry or skewed pages are harder." },
    ],
    privacyNote:
      "This tool runs OCR using an engine that works entirely in your browser. Your file is never uploaded — only the engine and language data are fetched from a CDN.",
    available: true,
  },
  {
    slug: "pdf-page-numbers",
    name: "Add Page Numbers to PDF",
    h1: "Free Add Page Numbers to PDF",
    title: "Add Page Numbers to PDF – Free Online PDF Tool | UtilityHub",
    description:
      "Add page numbers to a PDF online for free. Choose the position, number format, starting number and font size, then download. 100% private, in your browser.",
    cardDescription: "Stamp page numbers with position & format options.",
    category: "pdf-tools",
    keywords: ["add page numbers to pdf", "pdf page numbers", "number pdf pages", "insert page numbers pdf", "paginate pdf"],
    icon: "🔢",
    intro:
      "Add page numbers to every page of a PDF. Pick where they appear (any corner or centre, top or bottom), the format (1, 1 / 10, or Page 1 of 10), the starting number and the font size. The numbers are drawn straight onto the pages in your browser — nothing is uploaded.",
    howTo: [
      "Upload your PDF.",
      "Choose the position and number format.",
      "Set the starting number and font size if needed.",
      "Click Add page numbers and download.",
    ],
    faqs: [
      { q: "Can I start numbering from a specific number?", a: "Yes. Set 'Start at' to any number — handy when your document has a cover page or continues from another file." },
      { q: "Where can the numbers go?", a: "Any of six positions: bottom or top, aligned left, centre or right." },
      { q: "Is my PDF uploaded?", a: "No. The page numbers are added in your browser and your file never leaves your device." },
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
    slug: "compress-video",
    name: "Video Compressor",
    h1: "Free Video Compressor",
    title: "Video Compressor – Free Online Media Tool | UtilityHub",
    description:
      "Compress video files to reduce their size right in your browser with ffmpeg. Pick a quality level and resolution — free, private, no upload required.",
    cardDescription: "Shrink video file size in your browser.",
    category: "media-tools",
    keywords: ["video compressor", "compress video", "reduce video size", "shrink mp4", "make video smaller"],
    icon: "🗜️",
    intro:
      "Reduce the file size of a video using ffmpeg compiled to WebAssembly. Choose a compression level to balance quality against size, and optionally downscale the resolution. Everything runs on your device, so your video is never uploaded. Because encoding runs locally, shorter clips process fastest.",
    howTo: [
      "Upload a video file (MP4, WebM, MOV, etc.).",
      "Choose a compression level — Balanced is a good default.",
      "Optionally lower the resolution to save more.",
      "Click Compress and download the smaller MP4.",
    ],
    faqs: [
      { q: "How much smaller will my video get?", a: "It depends on the source, but the Balanced and Strong levels typically cut file size substantially by re-encoding with H.264. Lowering the resolution saves even more." },
      { q: "Will compressing reduce quality?", a: "Some detail is traded for size. Light keeps quality high; Strong makes the smallest file with softer detail. Balanced is a good middle ground." },
      { q: "Is my video uploaded?", a: "No. Compression runs entirely in your browser with ffmpeg.wasm — your video never leaves your device." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "trim-video",
    name: "Video Trimmer",
    h1: "Free Video Trimmer",
    title: "Video Trimmer – Free Online Media Tool | UtilityHub",
    description:
      "Trim and cut video clips online for free. Set a start and end time and export just the section you want — in your browser, with no upload.",
    cardDescription: "Cut a clip by start & end time.",
    category: "media-tools",
    keywords: ["video trimmer", "trim video", "cut video", "clip video", "video cutter"],
    icon: "✂️",
    intro:
      "Cut a video down to just the part you need. Play the clip, mark a start and end time, and export the trimmed section. Trimming copies the original streams without re-encoding, so it's fast and keeps full quality. Your video is processed locally and never uploaded.",
    howTo: [
      "Upload a video file.",
      "Play it and use “Set” to capture the start and end positions.",
      "Adjust the times if needed.",
      "Click Trim and download your clip.",
    ],
    faqs: [
      { q: "Does trimming re-encode the video?", a: "No — it copies the existing video and audio streams, so it's fast and lossless. Cuts land on the nearest keyframe, so the start may shift by a fraction of a second." },
      { q: "What formats can I trim?", a: "Common formats like MP4, WebM and MOV. The trimmed clip keeps the same format as the original." },
      { q: "Is my video uploaded?", a: "No. Trimming runs entirely in your browser with ffmpeg.wasm — your video never leaves your device." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "extract-audio",
    name: "Extract Audio from Video",
    h1: "Free Extract Audio from Video",
    title: "Extract Audio from Video – Free Online Media Tool | UtilityHub",
    description:
      "Extract the audio track from a video and save it as MP3, WAV, AAC or M4A. Free, private and processed in your browser — no upload.",
    cardDescription: "Save a video's audio as MP3, WAV, AAC or M4A.",
    category: "media-tools",
    keywords: ["extract audio from video", "video to mp3", "video to audio", "mp4 to mp3", "rip audio from video"],
    icon: "🎵",
    intro:
      "Pull the audio out of any video and save it as MP3, WAV, AAC or M4A using ffmpeg compiled to WebAssembly. Perfect for grabbing a soundtrack, a podcast recording or a voice note from a video. Everything runs on your device — nothing is uploaded.",
    howTo: [
      "Upload a video file (MP4, WebM, MOV, etc.).",
      "Choose an audio format — MP3 is the most compatible.",
      "Click Extract audio and let ffmpeg process it locally.",
      "Download the audio file.",
    ],
    faqs: [
      { q: "Which audio format should I pick?", a: "MP3 is the most widely compatible and compact. WAV is lossless but larger; AAC and M4A are efficient modern formats." },
      { q: "Does this keep the original audio quality?", a: "Extracting to WAV is lossless. MP3, AAC and M4A re-encode the audio at a high bitrate, so quality stays very good." },
      { q: "Is my video uploaded?", a: "No. Extraction runs entirely in your browser with ffmpeg.wasm — your video never leaves your device." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "video-to-gif",
    name: "GIF Creator",
    h1: "Free Video to GIF Creator",
    title: "GIF Creator – Convert Video to GIF | UtilityHub",
    description:
      "Turn a video into an animated GIF online for free. Pick a start time, duration, frame rate and size — processed in your browser with no upload.",
    cardDescription: "Turn a video clip into an animated GIF.",
    category: "media-tools",
    keywords: ["gif creator", "video to gif", "mp4 to gif", "make a gif", "convert video to gif"],
    icon: "🎞️",
    intro:
      "Create a high-quality animated GIF from a section of a video using ffmpeg compiled to WebAssembly. Choose where the GIF starts, how long it runs, the frame rate and the width — a smart color palette keeps the result crisp. Short clips make the best GIFs, and everything is processed locally.",
    howTo: [
      "Upload a video file.",
      "Set the start time and how many seconds to capture.",
      "Pick a frame rate and width.",
      "Click Create GIF, preview it and download.",
    ],
    faqs: [
      { q: "Why keep GIFs short?", a: "GIFs store every frame uncompressed, so length, frame rate and width all grow the file quickly. A few seconds at 480px usually looks great and stays small." },
      { q: "How do I get the best quality?", a: "The tool builds a custom color palette from your clip for sharper colors. Higher fps looks smoother; a smaller width keeps the file size down." },
      { q: "Is my video uploaded?", a: "No. The GIF is rendered entirely in your browser with ffmpeg.wasm — your video never leaves your device." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "video-speed-changer",
    name: "Video Speed Changer",
    h1: "Free Video Speed Changer",
    title: "Video Speed Changer – Free Online Media Tool | UtilityHub",
    description:
      "Speed up or slow down a video online for free. Choose from 0.25× to 4× with pitch-corrected audio — processed in your browser with no upload.",
    cardDescription: "Speed up or slow down a video (0.25×–4×).",
    category: "media-tools",
    keywords: ["video speed changer", "speed up video", "slow motion video", "slow down video", "change video speed"],
    icon: "⏩",
    intro:
      "Make a video play faster or slower using ffmpeg compiled to WebAssembly. Pick a speed from 0.25× (slow motion) up to 4×, and the audio is re-timed to match so it stays in sync without sounding chipmunky. Everything runs on your device — no uploads.",
    howTo: [
      "Upload a video file.",
      "Choose a playback speed from 0.25× to 4×.",
      "Optionally remove the audio for silent clips.",
      "Click Change speed and download the MP4.",
    ],
    faqs: [
      { q: "Does the audio stay in sync?", a: "Yes. The audio is stretched or compressed to match the new speed, so it stays aligned with the video while keeping a natural pitch." },
      { q: "What speeds are available?", a: "From 0.25× (quarter speed, great for slow motion) up to 4× (four times faster). 1× is unchanged." },
      { q: "Is my video uploaded?", a: "No. Re-timing runs entirely in your browser with ffmpeg.wasm — your video never leaves your device." },
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

  // ------------------------------- AUDIO -------------------------------
  {
    slug: "mp3-converter",
    name: "MP3 Converter",
    h1: "Free MP3 Converter",
    title: "MP3 Converter – Convert Audio & Video to MP3 | UtilityHub",
    description:
      "Convert audio or video files to MP3 online for free. Pick the bitrate (128–320 kbps) and download an MP3 in your browser — no upload, no watermark, no sign-up.",
    cardDescription: "Convert any audio or video to MP3 at your chosen bitrate.",
    category: "audio-tools",
    keywords: ["mp3 converter", "convert to mp3", "wav to mp3", "m4a to mp3", "video to mp3", "audio to mp3"],
    icon: "🎧",
    intro:
      "Turn almost any audio or video file into a clean MP3 using ffmpeg compiled to WebAssembly. Choose a bitrate to balance sound quality against file size, then download — everything runs on your device, so your files are never uploaded.",
    howTo: [
      "Drop in an audio or video file (WAV, M4A, AAC, OGG, MP4 and more).",
      "Pick an MP3 bitrate — 192 kbps is a great default.",
      "Click Convert to MP3 and let ffmpeg process it locally.",
      "Download your MP3.",
    ],
    faqs: [
      { q: "Can I extract the audio from a video as MP3?", a: "Yes. Drop in an MP4 (or other video) and the tool keeps only the audio track, saving it as an MP3." },
      { q: "Which bitrate should I choose?", a: "128 kbps is smallest, 320 kbps sounds best. 192–256 kbps is a good balance for music; 128 kbps is fine for speech and podcasts." },
      { q: "Is my file uploaded?", a: "No. Conversion runs entirely in your browser with ffmpeg.wasm — your audio never leaves your device." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "trim-audio",
    name: "Trim Audio",
    h1: "Free Audio Trimmer & Cutter",
    title: "Trim Audio – Free Online Audio Cutter | UtilityHub",
    description:
      "Cut and trim audio files online for free. Set a start and end time, preview with the built-in player, and download just the section you need. Private, in-browser.",
    cardDescription: "Cut a clip from an audio file by start and end time.",
    category: "audio-tools",
    keywords: ["trim audio", "audio cutter", "cut mp3", "trim mp3", "cut audio online", "audio trimmer"],
    icon: "✂️",
    intro:
      "Cut out just the part of an audio file you want to keep. Play the track in the built-in player, set the start and end times (or capture the current playback position), and export the trimmed clip in its original format. It all happens locally in your browser.",
    howTo: [
      "Drop in an audio file (MP3, WAV, M4A, AAC or OGG).",
      "Play it and set the start and end times, or use the Set buttons to grab the current position.",
      "Click Trim audio.",
      "Download your trimmed clip.",
    ],
    faqs: [
      { q: "How do I enter the times?", a: "Use minutes and seconds like 0:15 or 1:05, or hours:minutes:seconds for longer files. You can also press play and click Set to capture the exact spot." },
      { q: "Does trimming change the format?", a: "No — the trimmed clip keeps the same format as the file you uploaded." },
      { q: "Is my audio uploaded?", a: "No. The file is read and trimmed in your browser and never sent to a server." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "volume-booster",
    name: "Volume Booster",
    h1: "Free Audio Volume Booster",
    title: "Volume Booster – Increase Audio Volume Online | UtilityHub",
    description:
      "Boost or lower the volume of an audio file online for free. Adjust the gain with a simple slider, see the change in dB, and download louder audio. Private, in-browser.",
    cardDescription: "Make an audio file louder or quieter with a gain slider.",
    category: "audio-tools",
    keywords: ["volume booster", "increase audio volume", "make audio louder", "boost mp3 volume", "audio gain"],
    icon: "🔊",
    intro:
      "Make a quiet recording louder — or turn a loud one down — by adjusting its gain. Drag the slider from 20% to 400% of the original volume and see the equivalent change in decibels. The processed file keeps its original format and is created entirely in your browser.",
    howTo: [
      "Drop in an audio file (MP3, WAV, M4A, AAC or OGG).",
      "Drag the volume slider or pick a preset (e.g. 200%).",
      "Click Apply volume.",
      "Download the adjusted audio.",
    ],
    faqs: [
      { q: "How much can I boost the volume?", a: "Up to 400% (about +12 dB). Large boosts on already-loud audio can cause clipping, so increase gradually and listen back." },
      { q: "Can I make audio quieter too?", a: "Yes. Set the slider below 100% to reduce the volume — for example 50% halves it." },
      { q: "Is my audio uploaded?", a: "No. The volume change is applied in your browser with ffmpeg.wasm and nothing is sent to a server." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "audio-joiner",
    name: "Audio Joiner",
    h1: "Free Audio Joiner & Merger",
    title: "Audio Joiner – Merge Audio Files Online | UtilityHub",
    description:
      "Join multiple audio files into one online for free. Add tracks, drag them into order, and merge them into a single MP3 in your browser. No upload, no watermark.",
    cardDescription: "Merge several audio files into one MP3, in your order.",
    category: "audio-tools",
    keywords: ["audio joiner", "merge audio", "combine mp3", "join audio files", "merge mp3 online"],
    icon: "🔗",
    intro:
      "Stitch several audio files together into one continuous track. Add your files, reorder them, and merge them into a single MP3 — even if the originals are in different formats. Everything is processed locally in your browser.",
    howTo: [
      "Add two or more audio files (MP3, WAV, M4A, AAC or OGG).",
      "Reorder them with the up/down arrows.",
      "Click Join to merge them end to end.",
      "Download the combined MP3.",
    ],
    faqs: [
      { q: "Can I join files that are in different formats?", a: "Yes. Mixed formats are decoded and merged, then exported as a single MP3." },
      { q: "What order will the files play in?", a: "The order shown in the list, top to bottom. Use the arrows to rearrange before joining." },
      { q: "Are my files uploaded?", a: "No. The merge runs in your browser with ffmpeg.wasm and your files never leave your device." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "voice-recorder",
    name: "Voice Recorder",
    h1: "Free Online Voice Recorder",
    title: "Voice Recorder – Free Online Mic Recorder | UtilityHub",
    description:
      "Record your voice online for free with your microphone. Pause and resume, play it back, and download the recording — or export it as MP3. Private, in-browser.",
    cardDescription: "Record from your mic, play back and download or export MP3.",
    category: "audio-tools",
    keywords: ["voice recorder", "online recorder", "record voice", "microphone recorder", "audio recorder online"],
    icon: "🎙️",
    intro:
      "Record audio straight from your microphone in the browser — no app to install. Pause and resume as you go, listen back, then download the recording or convert it to MP3. Your audio is captured and processed locally and is never uploaded to a server.",
    howTo: [
      "Click Record and allow microphone access when prompted.",
      "Pause and resume as needed, then click Stop.",
      "Play back your recording to check it.",
      "Download it, or convert it to MP3 before saving.",
    ],
    faqs: [
      { q: "Do I need to install anything?", a: "No. Recording uses your browser's built-in microphone support — just grant permission when asked." },
      { q: "Where is my recording stored?", a: "Only in your browser's memory until you download it. Nothing is uploaded, and it's gone when you leave the page unless you save it." },
      { q: "Why is microphone access blocked?", a: "Your browser needs permission to use the mic. Click the padlock/permissions icon in the address bar and allow the microphone, then try again." },
    ],
    privacyNote:
      "This recorder captures audio from your microphone and processes it entirely in your browser. Your recording is never uploaded — it stays on your device until you choose to download it.",
    available: true,
  },

  // ------------------------------- TIME -------------------------------
  {
    slug: "world-clock",
    name: "World Clock",
    h1: "World Clock — Live Times Around the World",
    title: "World Clock – Free Online Time Tool | UtilityHub",
    description:
      "See the current time in cities and time zones around the world, updating live. Add the places you care about and compare them side by side. Free and private.",
    cardDescription: "Live current time across cities and time zones.",
    category: "time-tools",
    keywords: ["world clock", "current time", "time in", "world time", "time zones now"],
    icon: "🌍",
    intro:
      "A live world clock that shows the current time in any city or time zone you add. Build your own list of places — home, work, family, teammates — and watch every clock tick in real time, side by side, with the date and UTC offset for each. Everything runs in your browser using your device's clock.",
    howTo: [
      "Pick a time zone from the dropdown to add a clock.",
      "Add as many places as you like — they update live every second.",
      "Remove a clock with the × button; your list is remembered on this device.",
    ],
    faqs: [
      { q: "Where does the time come from?", a: "Each clock is derived from your device's own clock, re-projected into the chosen IANA time zone using your browser's built-in internationalization support. No network requests are made." },
      { q: "Does it handle daylight saving time?", a: "Yes. Time zones use the official IANA database, so DST transitions are applied automatically for each region." },
      { q: "Are my saved cities private?", a: "Yes. Your list of clocks is stored only in this browser's local storage and never leaves your device." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "stopwatch",
    name: "Stopwatch",
    h1: "Free Online Stopwatch",
    title: "Stopwatch – Free Online Time Tool | UtilityHub",
    description:
      "A precise online stopwatch with lap times. Start, stop and record laps with millisecond accuracy — no download, no sign-up. Runs entirely in your browser.",
    cardDescription: "Precise stopwatch with lap times.",
    category: "time-tools",
    keywords: ["stopwatch", "online stopwatch", "lap timer", "timer stopwatch", "milliseconds"],
    icon: "⏱️",
    intro:
      "A clean, accurate stopwatch you can use for workouts, cooking, studying or timing anything. Start and stop with a click, record lap or split times, and see hundredths of a second. It stays accurate even if the tab is in the background because it measures elapsed real time rather than counting ticks.",
    howTo: [
      "Press Start to begin timing.",
      "Press Lap to record a split without stopping the clock.",
      "Press Stop to pause, and Reset to clear everything.",
    ],
    faqs: [
      { q: "Is the stopwatch accurate in a background tab?", a: "Yes. It calculates elapsed time from timestamps, so it stays accurate even if the browser throttles timers while the tab is inactive." },
      { q: "Can I record lap times?", a: "Yes. Each Lap captures the current total and the split since the previous lap, listed newest first." },
      { q: "Does anything get uploaded?", a: "No. The stopwatch runs entirely in your browser; nothing is sent to a server." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "timer",
    name: "Countdown Timer",
    h1: "Free Online Countdown Timer",
    title: "Timer – Free Online Countdown Timer | UtilityHub",
    description:
      "Set a countdown timer for any duration with an alarm sound when it finishes. Great for cooking, workouts, study sessions and more. Free, private, in-browser.",
    cardDescription: "Set a countdown with an alarm when it ends.",
    category: "time-tools",
    keywords: ["timer", "countdown timer", "online timer", "kitchen timer", "pomodoro timer"],
    icon: "⏲️",
    intro:
      "A simple, reliable countdown timer for cooking, workouts, Pomodoro study sessions or any task. Set hours, minutes and seconds — or use a quick preset — then start. When time's up you get an alarm sound and an on-screen alert. It measures real elapsed time, so it stays accurate in background tabs.",
    howTo: [
      "Enter hours, minutes and seconds, or tap a quick preset.",
      "Press Start — the timer counts down and shows the time remaining.",
      "Pause, resume or reset at any time; an alarm sounds when it reaches zero.",
    ],
    faqs: [
      { q: "Will it alert me when the tab is in the background?", a: "The timer keeps accurate time in the background and sounds an alarm when it finishes. Some browsers require the tab to have been interacted with for audio to play." },
      { q: "Can I pause and resume?", a: "Yes. Pause freezes the remaining time and Resume continues from exactly where you left off." },
      { q: "Is a countdown timer the same as a stopwatch?", a: "No — a timer counts down from a set duration to zero, while a stopwatch counts up from zero. We have a separate Stopwatch tool too." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "alarm",
    name: "Alarm Clock",
    h1: "Free Online Alarm Clock",
    title: "Alarm Clock – Free Online Time Tool | UtilityHub",
    description:
      "Set an online alarm clock for a specific time with a sound and on-screen alert. Keep the tab open and it will ring at the time you choose. Free and private.",
    cardDescription: "Ring at a set time with a sound alert.",
    category: "time-tools",
    keywords: ["alarm clock", "online alarm", "set alarm", "wake up alarm", "alarm for time"],
    icon: "⏰",
    intro:
      "Set an alarm for any wall-clock time and this tool will ring — with a sound and an on-screen alert — the moment it arrives. Perfect for reminders, breaks or waking up from a nap. It uses your device's clock and shows a live countdown to the alarm. Keep the tab open for it to fire.",
    howTo: [
      "Choose the time you want the alarm to go off.",
      "Optionally add a label, upload your own ringtone, and enable desktop notifications.",
      "Press Set alarm and leave the tab open — it rings at that time with a sound and alert.",
    ],
    faqs: [
      { q: "Does the alarm work if I close the tab?", a: "No. Because it runs entirely in your browser with no server or push service, the tab must stay open for the alarm to ring." },
      { q: "Can I use my own ringtone?", a: "Yes. Upload any audio file (MP3, WAV, OGG, etc.) and it will play — on a loop — when the alarm fires instead of the default beep. The file stays on your device and is used only for the current session." },
      { q: "Will it show a desktop notification?", a: "If you enable notifications, the tool asks your browser for permission and then shows a desktop notification when the alarm rings — handy if you're on another tab. You can also rely on the built-in sound and on-screen alert." },
      { q: "Is my alarm data uploaded?", a: "No. The alarm time, label and ringtone stay in your browser and are never sent anywhere." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "countdown",
    name: "Countdown to Date",
    h1: "Countdown Timer to a Date",
    title: "Countdown to a Date – Free Online Time Tool | UtilityHub",
    description:
      "Count down the days, hours, minutes and seconds to any future date and time — a birthday, holiday, launch or deadline. Free live countdown, private and in-browser.",
    cardDescription: "Live countdown to any future date & time.",
    category: "time-tools",
    keywords: ["countdown", "countdown to date", "days until", "event countdown", "new year countdown"],
    icon: "⏳",
    intro:
      "Count down to any moment that matters — a birthday, wedding, holiday, product launch, exam or deadline. Pick a target date and time and watch a live countdown of days, hours, minutes and seconds. Handy presets like New Year make it a one-click affair. It all runs in your browser using your local clock.",
    howTo: [
      "Choose a target date and time (or tap a preset like New Year).",
      "Optionally add a title for your event.",
      "Watch the live countdown update every second until the moment arrives.",
    ],
    faqs: [
      { q: "What happens when the countdown reaches zero?", a: "The countdown shows that the event has arrived and displays how long ago it was, so you don't miss the moment." },
      { q: "Which time zone does it use?", a: "It uses your device's local time zone, so the countdown reflects the target date and time where you are." },
      { q: "Is my event private?", a: "Yes. The title and target date stay in your browser and are never uploaded." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "date-difference",
    name: "Date Difference Calculator",
    h1: "Free Date Difference Calculator",
    title: "Date Difference Calculator – Days Between Dates | UtilityHub",
    description:
      "Calculate the exact difference between two dates in years, months and days, plus the total number of days, weeks and hours. Free, instant and private.",
    cardDescription: "Time between two dates: years, months, days.",
    category: "time-tools",
    keywords: ["date difference", "days between dates", "date calculator", "how many days", "time between dates"],
    icon: "📆",
    intro:
      "Find out exactly how much time lies between two dates. Enter a start and end date to see the difference broken down into years, months and days, along with the totals in days, weeks and hours. Great for anniversaries, project timelines, deadlines and trivia. Everything is calculated in your browser.",
    howTo: [
      "Pick a start date and an end date.",
      "See the difference in years, months and days.",
      "Check the totals in days, weeks and hours below.",
    ],
    faqs: [
      { q: "Does it include both the start and end date?", a: "The difference counts the number of whole days from the start date to the end date. You can toggle whether the end date is included in the total-days count." },
      { q: "Can I measure into the future?", a: "Yes. Set the end date later than the start date to count forward, whether the dates are in the past or future." },
      { q: "Is my data private?", a: "Yes. The calculation runs in your browser and nothing is uploaded." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "working-days-calculator",
    name: "Working Days Calculator",
    h1: "Free Working Days (Business Days) Calculator",
    title: "Working Days Calculator – Business Days Between Dates | UtilityHub",
    description:
      "Count the number of working (business) days between two dates, excluding weekends and any public holidays you add. Free, instant and private business-day calculator.",
    cardDescription: "Business days between dates, minus weekends & holidays.",
    category: "time-tools",
    keywords: ["working days calculator", "business days", "networkdays", "working days between dates", "exclude weekends"],
    icon: "💼",
    intro:
      "Work out how many working days fall between two dates — excluding weekends, and any public holidays or days off you add. Useful for planning deliveries, project deadlines, leave and SLAs. You can choose which days count as the weekend. All calculations happen locally in your browser.",
    howTo: [
      "Choose a start date and an end date.",
      "Pick which days count as the weekend (Sat/Sun by default).",
      "Add any holiday dates to exclude, then read the working-day total.",
    ],
    faqs: [
      { q: "Are weekends excluded automatically?", a: "Yes. Saturdays and Sundays are excluded by default, and you can change which days count as the weekend." },
      { q: "Can I exclude public holidays?", a: "Yes. Add any holiday dates and they'll be removed from the working-day count if they fall on a weekday within the range." },
      { q: "Is the range inclusive?", a: "The count includes both the start and end dates when they are working days, matching common spreadsheet NETWORKDAYS behaviour." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "time-zone-converter",
    name: "Time Zone Converter",
    h1: "Free Time Zone Converter",
    title: "Time Zone Converter – Convert Time Between Zones | UtilityHub",
    description:
      "Convert a time from one time zone to another instantly. Pick a date and time, choose the source and target zones, and see the converted time with the UTC offset. Free and private.",
    cardDescription: "Convert a time from one time zone to another.",
    category: "time-tools",
    keywords: ["time zone converter", "timezone converter", "convert time zones", "utc converter", "meeting time zones"],
    icon: "🌐",
    intro:
      "Schedule across time zones with confidence. Enter a date and time in one zone and instantly see it in another — perfect for planning calls, flights and deadlines with people in other regions. Both zones use the official IANA database, so daylight saving time is handled automatically. It all runs in your browser.",
    howTo: [
      "Enter the date and time to convert.",
      "Choose the 'from' time zone and the 'to' time zone.",
      "Read the converted time, along with each zone's UTC offset.",
    ],
    faqs: [
      { q: "Does it account for daylight saving time?", a: "Yes. Conversions use the IANA time-zone database, so DST rules are applied correctly for the specific date you enter." },
      { q: "Can I convert to my own time zone?", a: "Yes. Your local time zone is preselected, and you can set either side to any zone in the list." },
      { q: "Is my data sent anywhere?", a: "No. The conversion is computed in your browser and nothing is uploaded." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "unix-timestamp-converter",
    name: "Unix Timestamp Converter",
    h1: "Free Unix Timestamp Converter",
    title: "Unix Timestamp Converter – Epoch to Date | UtilityHub",
    description:
      "Convert Unix timestamps (epoch) to human-readable dates and back, in seconds or milliseconds, in UTC and your local time. Free developer-friendly timestamp tool.",
    cardDescription: "Unix epoch ↔ human date, seconds or ms.",
    category: "time-tools",
    keywords: ["unix timestamp converter", "epoch converter", "timestamp to date", "epoch time", "unix time"],
    icon: "🖥️",
    intro:
      "Convert between Unix timestamps (seconds or milliseconds since 1 Jan 1970 UTC) and human-readable dates, in both directions. See the result in UTC and your local time, and grab the current timestamp with one click. A handy tool for developers debugging logs, APIs and databases — all in your browser.",
    howTo: [
      "Enter a Unix timestamp to see the matching date, or pick a date to get its timestamp.",
      "Switch between seconds and milliseconds as needed.",
      "Copy the result, or use 'Now' to insert the current timestamp.",
    ],
    faqs: [
      { q: "What is a Unix timestamp?", a: "It's the number of seconds (or milliseconds) that have elapsed since 00:00:00 UTC on 1 January 1970, known as the Unix epoch. It's a common way to store time in software." },
      { q: "Seconds or milliseconds — which do I have?", a: "Timestamps around 10 digits are usually seconds; 13-digit values are milliseconds. The tool lets you switch between them and auto-detects a likely unit." },
      { q: "Which time zone is shown?", a: "Both UTC and your local time are shown so you can read the value whichever way you need." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },

  // ------------------------------- RANDOM -------------------------------
  {
    slug: "random-number",
    name: "Random Number Generator",
    h1: "Random Number Generator",
    title: "Random Number Generator – Free Online Tool | UtilityHub",
    description:
      "Generate random numbers in any range. Pick how many, allow or forbid duplicates, and choose whole numbers or decimals. Cryptographically strong and private.",
    cardDescription: "Random numbers in any range, with or without repeats.",
    category: "random-tools",
    keywords: ["random number generator", "rng", "random number", "number picker", "random between"],
    icon: "🔢",
    intro:
      "Generate one or many random numbers between any two values. Choose whole numbers or decimals, decide how many to draw, and turn off duplicates for a unique set (perfect for raffles and lotteries). Randomness comes from your browser's secure generator, so it's fair and never leaves your device.",
    howTo: [
      "Set the minimum and maximum values.",
      "Choose how many numbers and whether to allow duplicates.",
      "Click Generate and copy your numbers.",
    ],
    faqs: [
      { q: "Is the randomness fair?", a: "Yes. It uses the browser's crypto.getRandomValues, which is a cryptographically strong source — far better than a predictable pseudo-random sequence." },
      { q: "Can I get unique numbers only?", a: "Yes. Turn off 'allow duplicates' to draw a set of distinct numbers, ideal for lottery-style picks." },
      { q: "Is anything sent to a server?", a: "No. Generation happens entirely in your browser." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "random-password",
    name: "Password Generator",
    h1: "Strong Random Password Generator",
    title: "Password Generator – Free Strong Passwords | UtilityHub",
    description:
      "Generate strong, random passwords with adjustable length and character sets. Exclude ambiguous characters, see a strength meter, and copy instantly. 100% in-browser.",
    cardDescription: "Strong random passwords with a strength meter.",
    category: "random-tools",
    keywords: ["password generator", "strong password", "random password", "secure password", "passphrase"],
    icon: "🔑",
    intro:
      "Create strong, hard-to-guess passwords in seconds. Choose the length and which character sets to include — uppercase, lowercase, digits and symbols — and optionally exclude look-alike characters. A live strength meter shows how secure each password is. Everything is generated in your browser with a secure random source and never sent anywhere.",
    howTo: [
      "Set the length and pick which character sets to include.",
      "Optionally exclude ambiguous characters like O/0 and l/1.",
      "Click Generate and copy your password.",
    ],
    faqs: [
      { q: "Are these passwords safe?", a: "Yes. They're generated with the browser's cryptographically secure random generator and never transmitted or stored, so no one — including us — ever sees them." },
      { q: "What makes a strong password?", a: "Length matters most. A long password (16+ characters) mixing upper, lower, digits and symbols is very hard to crack. The strength meter reflects this." },
      { q: "Should I reuse a generated password?", a: "No — use a unique password for every account, ideally stored in a password manager." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "random-name",
    name: "Random Name Generator",
    h1: "Random Name Generator",
    title: "Random Name Generator – Free Online Tool | UtilityHub",
    description:
      "Generate random first and last names for characters, testing, usernames and placeholders. Choose gender and how many names. Free, instant and private.",
    cardDescription: "Random first & last names for any purpose.",
    category: "random-tools",
    keywords: ["random name generator", "name generator", "fake name", "character name", "random names"],
    icon: "📛",
    intro:
      "Generate random full names for characters in a story, test data, sample accounts, usernames or games. Choose feminine, masculine or any names and generate as many as you need at once. It all runs in your browser using a built-in name list.",
    howTo: [
      "Choose a name style (any, feminine or masculine).",
      "Set how many names to generate.",
      "Click Generate and copy the results.",
    ],
    faqs: [
      { q: "Are these real people?", a: "No. Names are assembled at random from common first and last names, so any resemblance to a real person is coincidental. Use them for characters, testing and placeholders." },
      { q: "Can I generate many at once?", a: "Yes. Set the count to produce a whole list of names in one click." },
      { q: "Is anything uploaded?", a: "No. Generation happens entirely in your browser." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "dice",
    name: "Dice Roller",
    h1: "Online Dice Roller",
    title: "Dice Roller – Free Online Dice | UtilityHub",
    description:
      "Roll virtual dice online — d4, d6, d8, d10, d12, d20 or custom-sided — with multiple dice and an instant total. Great for board games and tabletop RPGs. Free and private.",
    cardDescription: "Roll d6, d20 and more, with totals.",
    category: "random-tools",
    keywords: ["dice roller", "roll dice", "d20", "d6", "virtual dice", "tabletop dice"],
    icon: "🎲",
    intro:
      "Roll virtual dice for board games, tabletop RPGs like D&D, or quick decisions. Pick the number of sides (d4, d6, d8, d10, d12, d20 or a custom value), roll several at once, and see each result plus the total. Rolls use a fair random source and run entirely in your browser.",
    howTo: [
      "Choose the die type and how many dice to roll.",
      "Click Roll.",
      "See each die's value and the combined total.",
    ],
    faqs: [
      { q: "Which dice can I roll?", a: "The standard polyhedral set — d4, d6, d8, d10, d12 and d20 — plus a custom option for any number of sides." },
      { q: "Are the rolls fair?", a: "Yes. Each die uses the browser's secure random generator, giving every face an equal chance." },
      { q: "Can I roll multiple dice?", a: "Yes. Set the quantity to roll several dice at once and get their total." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "coin-flip",
    name: "Coin Flip",
    h1: "Flip a Coin Online",
    title: "Coin Flip – Free Online Coin Toss | UtilityHub",
    description:
      "Flip a virtual coin online for a quick heads-or-tails decision, with a running tally of results. Fair, fast and private coin toss — no download needed.",
    cardDescription: "Heads or tails, with a running tally.",
    category: "random-tools",
    keywords: ["coin flip", "flip a coin", "coin toss", "heads or tails", "coin flipper"],
    icon: "🪙",
    intro:
      "Settle it with a virtual coin toss. Flip a fair coin for heads or tails, with a satisfying flip and a running tally of how many of each you've landed. Great for quick decisions and games. It runs entirely in your browser using a secure random source.",
    howTo: [
      "Click Flip.",
      "See whether it landed heads or tails.",
      "Keep flipping — the tally tracks your results.",
    ],
    faqs: [
      { q: "Is the coin fair?", a: "Yes. Heads and tails each have an exact 50% chance, drawn from the browser's secure random generator." },
      { q: "Does it track results?", a: "Yes. A running tally shows how many heads and tails you've flipped in this session." },
      { q: "Is anything sent to a server?", a: "No. Everything happens in your browser." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "spin-wheel",
    name: "Spin the Wheel",
    h1: "Spin the Wheel — Random Picker",
    title: "Spin the Wheel – Free Random Picker | UtilityHub",
    description:
      "Add your own options and spin a colorful wheel to pick a random winner. Perfect for giveaways, decisions, classrooms and games. Free, private, in-browser.",
    cardDescription: "Add options and spin to pick a winner.",
    category: "random-tools",
    keywords: ["spin the wheel", "wheel of names", "random picker", "wheel spinner", "random wheel"],
    icon: "🎡",
    intro:
      "Enter your own list of options and spin a colorful wheel to pick a random winner. Great for choosing who goes first, picking a giveaway winner, deciding where to eat, or classroom name-picking. Your options are remembered on this device, and the spin is fair and runs entirely in your browser.",
    howTo: [
      "Type your options, one per line.",
      "Click Spin and watch the wheel.",
      "The winner is highlighted when it stops.",
    ],
    faqs: [
      { q: "Is the winner truly random?", a: "Yes. The landing position is chosen with the browser's secure random generator, so every option has an equal chance." },
      { q: "How many options can I add?", a: "As many as you like, though a handful to a couple of dozen reads best on the wheel." },
      { q: "Are my options saved?", a: "They're stored only in this browser so they're there next time — nothing is uploaded." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "team-generator",
    name: "Team Generator",
    h1: "Random Team Generator",
    title: "Team Generator – Free Random Team Picker | UtilityHub",
    description:
      "Paste a list of names and split them into random, balanced teams — by number of teams or team size. Perfect for sports, games and group projects. Free and private.",
    cardDescription: "Split a list of names into random teams.",
    category: "random-tools",
    keywords: ["team generator", "random teams", "group generator", "team picker", "split into teams"],
    icon: "👥",
    intro:
      "Turn a list of people into fair, randomly shuffled teams. Paste your names, choose how many teams you want (or a fixed team size), and get balanced groups instantly. Ideal for sports, board games, group projects and classroom activities. Everything runs in your browser.",
    howTo: [
      "Paste your names, one per line.",
      "Choose the number of teams or the size of each team.",
      "Click Generate to shuffle everyone into teams.",
    ],
    faqs: [
      { q: "Are the teams balanced?", a: "Yes. Names are shuffled randomly and distributed as evenly as possible, so team sizes differ by at most one." },
      { q: "Can I set a team size instead?", a: "Yes. Switch to 'by team size' to make as many teams of that size as your list allows." },
      { q: "Is my list uploaded?", a: "No. Shuffling happens entirely in your browser." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "decision-maker",
    name: "Decision Maker",
    h1: "Random Decision Maker",
    title: "Decision Maker – Yes/No & Random Picker | UtilityHub",
    description:
      "Can't decide? Let a random decision maker choose for you — pick from your own options, get a yes/no answer, or a Magic 8-Ball reply. Free, instant and private.",
    cardDescription: "Pick an option, yes/no, or Magic 8-Ball.",
    category: "random-tools",
    keywords: ["decision maker", "yes or no", "random picker", "magic 8 ball", "help me decide"],
    icon: "🎱",
    intro:
      "Stuck on a choice? Let chance decide. Enter your own options and pick one at random, get a simple yes/no verdict, or ask a Magic 8-Ball for a classic fortune-teller answer. A fun, fair way to break a deadlock — and it all runs in your browser.",
    howTo: [
      "Choose a mode: pick from your list, yes/no, or Magic 8-Ball.",
      "For the list mode, type your options one per line.",
      "Click Decide to get your answer.",
    ],
    faqs: [
      { q: "How does it choose?", a: "It uses the browser's secure random generator, giving each option (or yes/no) an equal chance." },
      { q: "What is the Magic 8-Ball mode?", a: "It returns one of the classic Magic 8-Ball replies — like 'It is certain' or 'Ask again later' — for a bit of fun." },
      { q: "Is anything tracked?", a: "No. Your options and decisions stay in your browser." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "random-color",
    name: "Random Color Generator",
    h1: "Random Color Generator",
    title: "Random Color Generator – HEX, RGB & HSL | UtilityHub",
    description:
      "Generate random colors with HEX, RGB and HSL values, or a whole palette at once. Copy any format with a click. Great for design inspiration. Free and private.",
    cardDescription: "Random colors & palettes in HEX/RGB/HSL.",
    category: "random-tools",
    keywords: ["random color", "random color generator", "hex color", "color palette generator", "random hex"],
    icon: "🌈",
    intro:
      "Generate random colors for design inspiration, testing and fun. Get a single color or a whole palette, each shown with its HEX, RGB and HSL values — click any value to copy it. A quick way to discover unexpected color combinations. It all runs in your browser.",
    howTo: [
      "Click Generate for a new random color or palette.",
      "Read the HEX, RGB and HSL values for each swatch.",
      "Click a value to copy it to your clipboard.",
    ],
    faqs: [
      { q: "What formats are shown?", a: "Each color shows HEX (e.g. #3AC0F2), RGB and HSL, and you can copy whichever your tool needs." },
      { q: "Can I generate a palette?", a: "Yes. Switch to palette mode to generate several colors at once for a quick scheme." },
      { q: "Is anything uploaded?", a: "No. Colors are generated in your browser." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "random-country",
    name: "Random Country",
    h1: "Random Country Generator",
    title: "Random Country – Free Online Tool | UtilityHub",
    description:
      "Pick a random country of the world, complete with its flag and capital. Great for geography quizzes, travel inspiration and games. Free, instant and private.",
    cardDescription: "Pick a random country, flag and capital.",
    category: "random-tools",
    keywords: ["random country", "random country generator", "country picker", "geography quiz", "random place"],
    icon: "🗺️",
    intro:
      "Get a random country from around the world, shown with its flag and capital city. Perfect for geography quizzes, travel daydreaming, teaching, or picking a theme for the night. Draw one at a time or a small batch. Everything runs in your browser.",
    howTo: [
      "Click Generate to draw a random country.",
      "See its flag, name and capital.",
      "Generate again for a new one.",
    ],
    faqs: [
      { q: "How many countries are included?", a: "A broad list of the world's sovereign countries, each shown with its flag emoji and capital city." },
      { q: "Can I get more than one?", a: "Yes. Increase the count to draw a small batch of distinct countries at once." },
      { q: "Is anything uploaded?", a: "No. The picker runs entirely in your browser." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "random-emoji",
    name: "Random Emoji",
    h1: "Random Emoji Generator",
    title: "Random Emoji Generator – Free Online Tool | UtilityHub",
    description:
      "Get a random emoji — or a handful — with one click, and copy them instantly. A fun way to spice up messages, usernames and posts. Free, private, in-browser.",
    cardDescription: "Get a random emoji (or a few) to copy.",
    category: "random-tools",
    keywords: ["random emoji", "random emoji generator", "emoji picker", "surprise emoji", "copy emoji"],
    icon: "🎁",
    intro:
      "Feeling lucky? Generate a random emoji — or a small batch — and copy them with one tap. A playful way to add flair to messages, captions, usernames and bios, or just to see what pops up. It all runs in your browser; nothing is tracked.",
    howTo: [
      "Choose how many emojis you want.",
      "Click Generate for a random pick.",
      "Click any emoji, or Copy all, to copy them.",
    ],
    faqs: [
      { q: "Where do the emojis come from?", a: "They're drawn at random from a large built-in pool of popular emojis using your browser's secure random generator." },
      { q: "Will they look the same everywhere?", a: "Emojis render with each device's own emoji font, so the exact look varies by platform, but the character is identical." },
      { q: "Is anything uploaded?", a: "No. Everything happens in your browser." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "random-quote",
    name: "Random Quote",
    h1: "Random Quote Generator",
    title: "Random Quote Generator – Free Inspirational Quotes | UtilityHub",
    description:
      "Get a random inspirational, motivational or witty quote with its author, and copy it with one click. A quick dose of inspiration. Free, private, in-browser.",
    cardDescription: "A random quote with its author, to copy.",
    category: "random-tools",
    keywords: ["random quote", "quote generator", "inspirational quotes", "motivational quotes", "random quotes"],
    icon: "💬",
    intro:
      "Get a hand-picked random quote — inspirational, motivational or simply witty — complete with its author. Perfect for a daily lift, social posts, presentations or writing prompts. Copy any quote with a click and draw another whenever you like. It all runs in your browser.",
    howTo: [
      "Click New quote to draw a random one.",
      "Read the quote and its author.",
      "Click Copy to grab it for a post or note.",
    ],
    faqs: [
      { q: "Where do the quotes come from?", a: "They're drawn from a curated built-in collection of well-known quotes, each attributed to its author." },
      { q: "Can I copy a quote?", a: "Yes. One click copies the quote and author, ready to paste anywhere." },
      { q: "Is anything uploaded?", a: "No. The generator runs entirely in your browser." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },

  // ===================== INVESTMENTS =====================
  {
    slug: "sip-calculator",
    name: "SIP Calculator",
    h1: "Free SIP Calculator",
    title: "SIP Calculator – Mutual Fund SIP Returns | UtilityHub",
    description:
      "Calculate the future value of your monthly SIP investment. See total invested, estimated returns and a year-by-year growth chart for any amount, rate and tenure. Free and private.",
    cardDescription: "Project monthly SIP maturity value & returns.",
    category: "investments",
    keywords: ["sip calculator", "mutual fund sip", "systematic investment plan", "sip returns", "monthly investment calculator"],
    icon: "📈",
    intro:
      "A SIP (Systematic Investment Plan) calculator estimates how much your monthly mutual-fund investments could grow to. Enter your monthly amount, an expected annual return and how long you'll invest, and see the projected maturity value, how much you put in versus the estimated gains, and a growth chart. Returns are illustrative estimates, not guarantees.",
    howTo: [
      "Enter your monthly SIP amount.",
      "Enter the expected annual rate of return.",
      "Enter the investment period in years.",
      "See the future value, invested amount, returns and growth chart.",
    ],
    faqs: [
      { q: "How is SIP return calculated?", a: "Each monthly contribution compounds until the end of the period. This tool uses the standard SIP future-value formula, FV = P × [((1+i)^n − 1) / i] × (1+i), where i is the monthly rate and n the number of months." },
      { q: "Are the returns guaranteed?", a: "No. Market-linked investments fluctuate. The expected return is an assumption you provide, so treat the result as an estimate for planning, not a promise." },
      { q: "Is my data uploaded?", a: "No. The calculation runs entirely in your browser and nothing is sent to a server." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "step-up-sip-calculator",
    name: "Step-Up SIP Calculator",
    h1: "Free Step-Up SIP Calculator",
    title: "Step-Up SIP Calculator – Top-Up SIP Returns | UtilityHub",
    description:
      "Calculate returns on a step-up (top-up) SIP that increases your monthly investment by a fixed percentage each year. See the future value and growth chart. Free and private.",
    cardDescription: "SIP that grows your contribution yearly.",
    category: "investments",
    keywords: ["step up sip calculator", "top up sip", "sip step up", "increasing sip", "annual step up sip"],
    icon: "🔼",
    intro:
      "A step-up SIP (also called a top-up SIP) increases your monthly contribution by a set percentage every year — handy as your income grows. This calculator simulates each month with an annual step-up and shows the projected maturity value, total invested and estimated returns. Figures are estimates based on the assumptions you enter.",
    howTo: [
      "Enter your starting monthly SIP amount.",
      "Enter the expected annual return and investment period.",
      "Enter the annual step-up percentage.",
      "See the future value, invested amount and growth chart.",
    ],
    faqs: [
      { q: "What is a step-up SIP?", a: "It's a SIP whose monthly amount rises by a fixed percentage each year, letting your investments keep pace with rising income and inflation." },
      { q: "How much does stepping up help?", a: "Even a small annual step-up can significantly increase your final corpus, because the extra contributions also compound. Try different step-up rates to compare." },
      { q: "Is anything uploaded?", a: "No. The simulation runs in your browser and your inputs are never sent anywhere." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "step-down-sip-calculator",
    name: "Step-Down SIP Calculator",
    h1: "Free Step-Down SIP Calculator",
    title: "Step-Down SIP Calculator – Decreasing SIP Returns | UtilityHub",
    description:
      "Calculate returns on a step-down SIP that reduces your monthly investment by a fixed percentage each year. See the future value and growth chart. Free and private.",
    cardDescription: "SIP that reduces your contribution yearly.",
    category: "investments",
    keywords: ["step down sip calculator", "decreasing sip", "reducing sip", "sip step down", "tapering sip"],
    icon: "🔽",
    intro:
      "A step-down SIP reduces your monthly contribution by a fixed percentage each year — useful if you expect to invest less over time, such as approaching retirement. This calculator simulates each month with an annual step-down and shows the projected maturity value, total invested and estimated returns. Results are estimates based on your assumptions.",
    howTo: [
      "Enter your starting monthly SIP amount.",
      "Enter the expected annual return and investment period.",
      "Enter the annual step-down percentage.",
      "See the future value, invested amount and growth chart.",
    ],
    faqs: [
      { q: "What is a step-down SIP?", a: "It's a SIP whose monthly amount decreases by a fixed percentage each year, which some investors use to taper contributions over time." },
      { q: "Why would I reduce my SIP over time?", a: "You might plan to redirect money to other goals, expect lower income later, or wind down investing as you approach a target. The tool shows the impact on your final corpus." },
      { q: "Is anything uploaded?", a: "No. The simulation runs in your browser and your inputs stay on your device." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "lumpsum-calculator",
    name: "Lumpsum Investment Calculator",
    h1: "Free Lumpsum Investment Calculator",
    title: "Lumpsum Calculator – One-Time Investment Returns | UtilityHub",
    description:
      "Calculate the future value of a one-time lumpsum investment. See total returns and a year-by-year growth chart for any amount, rate and tenure. Free, private, in-browser.",
    cardDescription: "Future value of a one-time investment.",
    category: "investments",
    keywords: ["lumpsum calculator", "lumpsum investment", "one time investment", "compound interest investment", "lumpsum returns"],
    icon: "💵",
    intro:
      "A lumpsum calculator estimates how much a single, one-time investment could grow to over time with compounding. Enter the amount, the expected annual return and the number of years to see the projected maturity value, the returns earned and a growth chart. Returns are illustrative estimates, not guarantees.",
    howTo: [
      "Enter the one-time investment amount.",
      "Enter the expected annual rate of return.",
      "Enter the investment period in years.",
      "See the future value, returns and growth chart.",
    ],
    faqs: [
      { q: "How is lumpsum return calculated?", a: "It uses compound growth: FV = P × (1 + r)^n, where P is the amount, r the annual return and n the number of years." },
      { q: "Lumpsum or SIP — which is better?", a: "It depends on your cash flow and the market. Lumpsum puts all money to work immediately; SIP spreads it out and averages the entry price. Use both calculators to compare." },
      { q: "Is my data uploaded?", a: "No. The calculation runs in your browser and nothing is sent to a server." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "swp-calculator",
    name: "SWP Calculator",
    h1: "Free SWP Calculator",
    title: "SWP Calculator – Systematic Withdrawal Plan | UtilityHub",
    description:
      "Calculate a Systematic Withdrawal Plan: how long your corpus lasts, the total withdrawn and the balance left, as your remaining money keeps growing. Free and private.",
    cardDescription: "Model monthly withdrawals from a corpus.",
    category: "investments",
    keywords: ["swp calculator", "systematic withdrawal plan", "monthly withdrawal calculator", "retirement withdrawal", "swp mutual fund"],
    icon: "🏧",
    intro:
      "A Systematic Withdrawal Plan (SWP) lets you withdraw a fixed amount every month from an invested corpus while the remaining balance keeps growing. This calculator shows the final balance, the total you'll withdraw, and warns you if the corpus runs out before your chosen period. Results are estimates based on a constant assumed return.",
    howTo: [
      "Enter your total invested corpus.",
      "Enter the expected annual return.",
      "Enter the fixed monthly withdrawal and the period.",
      "See the final balance, total withdrawn and how long the money lasts.",
    ],
    faqs: [
      { q: "What is an SWP?", a: "A Systematic Withdrawal Plan withdraws a fixed sum from your investment at regular intervals — often used to create a monthly income in retirement — while the rest stays invested and can keep growing." },
      { q: "Will my corpus run out?", a: "It depends on the withdrawal amount versus the return. If withdrawals exceed growth, the balance shrinks; the calculator tells you if and when it's fully depleted." },
      { q: "Is my data uploaded?", a: "No. The simulation runs in your browser and your inputs stay on your device." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "stp-calculator",
    name: "STP Calculator",
    h1: "Free STP Calculator",
    title: "STP Calculator – Systematic Transfer Plan | UtilityHub",
    description:
      "Calculate a Systematic Transfer Plan: park a lumpsum in a source fund and transfer a fixed amount each month into a destination fund. See both balances grow. Free and private.",
    cardDescription: "Model transfers between two funds.",
    category: "investments",
    keywords: ["stp calculator", "systematic transfer plan", "debt to equity transfer", "stp mutual fund", "fund transfer calculator"],
    icon: "🔀",
    intro:
      "A Systematic Transfer Plan (STP) parks a lumpsum in one fund — often a lower-risk debt or liquid fund — and transfers a fixed amount every month into another, usually an equity fund. This calculator grows both balances at their own rates and shows the destination value, the source remaining and the combined total. Results are estimates based on the returns you assume.",
    howTo: [
      "Enter the source lumpsum and its expected return.",
      "Enter the destination fund's expected return.",
      "Enter the monthly transfer amount and the period.",
      "See the total value, destination fund and source remaining.",
    ],
    faqs: [
      { q: "What is an STP?", a: "A Systematic Transfer Plan moves money in fixed instalments from one fund to another — commonly from a debt/liquid fund into equity — to average your market entry while the parked money still earns a return." },
      { q: "How is STP different from SIP?", a: "A SIP invests fresh money from your bank each month; an STP moves money you've already invested from one fund into another. This tool models both balances at once." },
      { q: "Is my data uploaded?", a: "No. The simulation runs in your browser and nothing is sent to a server." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "goal-based-investment-calculator",
    name: "Goal-Based Investment Calculator",
    h1: "Free Goal-Based Investment Calculator",
    title: "Goal Calculator – Investment for a Financial Goal | UtilityHub",
    description:
      "Find the monthly SIP or one-time lumpsum needed to reach a financial goal. Factor in existing savings, expected return and time horizon. Free, private, in-browser.",
    cardDescription: "Monthly SIP needed to reach a target.",
    category: "investments",
    keywords: ["goal based investment calculator", "financial goal calculator", "sip for goal", "investment goal planner", "target amount calculator"],
    icon: "🎯",
    intro:
      "Work backwards from a financial goal to find out how much to invest. Enter your target amount, the years you have and an expected return, and this calculator shows the monthly SIP required — or the lumpsum you'd need today. It also factors in any current savings, projecting how they grow toward the goal. Figures are estimates for planning.",
    howTo: [
      "Enter your target amount and years to the goal.",
      "Enter the expected annual return.",
      "Optionally add your current savings for this goal.",
      "See the monthly SIP or lumpsum needed to get there.",
    ],
    faqs: [
      { q: "How does it use my current savings?", a: "It grows your existing savings at the expected return over the period, then works out the SIP needed to cover only the remaining gap to your goal." },
      { q: "Should I use SIP or lumpsum?", a: "The tool shows both: a recurring monthly SIP or a single lumpsum invested today. Choose whichever suits your cash flow." },
      { q: "Is my data uploaded?", a: "No. The calculation runs in your browser and your inputs stay on your device." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "inflation-adjusted-sip-calculator",
    name: "Inflation Adjusted SIP Calculator",
    h1: "Free Inflation-Adjusted SIP Calculator",
    title: "Inflation-Adjusted SIP Calculator – Real Returns | UtilityHub",
    description:
      "See what your SIP will really be worth after inflation. Calculate the inflation-adjusted (real) value of your corpus and the real rate of return. Free, private, in-browser.",
    cardDescription: "SIP corpus in today's purchasing power.",
    category: "investments",
    keywords: ["inflation adjusted sip calculator", "real return sip", "inflation adjusted returns", "sip real value", "inflation calculator investment"],
    icon: "📉",
    intro:
      "Nominal returns can be misleading once inflation eats into your purchasing power. This calculator projects your SIP's future value and then discounts it back to today's money using your assumed inflation rate, so you can see what the corpus will really be worth — plus the real (inflation-adjusted) rate of return. Results are estimates based on your assumptions.",
    howTo: [
      "Enter your monthly SIP amount and expected return.",
      "Enter the investment period in years.",
      "Enter the expected inflation rate.",
      "See the inflation-adjusted value and real rate of return.",
    ],
    faqs: [
      { q: "What is inflation-adjusted (real) value?", a: "It's the future corpus expressed in today's purchasing power. We divide the nominal value by (1 + inflation)^years so you can compare it to prices you know now." },
      { q: "What is the real rate of return?", a: "It's your return after removing inflation, calculated as (1 + return) / (1 + inflation) − 1. It shows how much your money actually grows in buying power." },
      { q: "Is my data uploaded?", a: "No. The calculation runs in your browser and nothing is sent to a server." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "mutual-fund-returns-calculator",
    name: "Mutual Fund Returns Calculator",
    h1: "Free Mutual Fund Returns Calculator",
    title: "Mutual Fund Returns Calculator – SIP & Lumpsum | UtilityHub",
    description:
      "Estimate mutual fund returns for a monthly SIP or a one-time lumpsum. See maturity value, total invested, absolute return and a growth chart. Free, private, in-browser.",
    cardDescription: "Returns for SIP or lumpsum investments.",
    category: "investments",
    keywords: ["mutual fund returns calculator", "mutual fund calculator", "sip lumpsum calculator", "mf returns", "fund growth calculator"],
    icon: "🏦",
    intro:
      "Estimate what a mutual fund investment might grow to, whether you invest a fixed amount every month (SIP) or a single lumpsum. Switch between the two modes and see the maturity value, total invested, estimated returns, absolute return percentage and a year-by-year growth chart. All figures are estimates based on the return you assume.",
    howTo: [
      "Choose SIP (monthly) or lumpsum (one-time).",
      "Enter the amount, expected return and period.",
      "Read the maturity value and absolute return.",
      "Review the growth chart over time.",
    ],
    faqs: [
      { q: "Can it handle both SIP and lumpsum?", a: "Yes. Toggle the mode to model a monthly SIP or a single lumpsum investment; the maths adjusts automatically." },
      { q: "What is absolute return?", a: "It's the total gain as a percentage of what you invested, ignoring time. For an annualized view, use the CAGR or annualized-return calculators." },
      { q: "Is my data uploaded?", a: "No. Everything is computed in your browser and your inputs stay on your device." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "cagr-calculator",
    name: "CAGR Calculator",
    h1: "Free CAGR Calculator",
    title: "CAGR Calculator – Compound Annual Growth Rate | UtilityHub",
    description:
      "Calculate the Compound Annual Growth Rate (CAGR) of an investment from its start value, end value and duration. See absolute return and growth multiple too. Free and private.",
    cardDescription: "Compound annual growth rate of an investment.",
    category: "investments",
    keywords: ["cagr calculator", "compound annual growth rate", "cagr formula", "annual growth rate", "investment growth rate"],
    icon: "📊",
    intro:
      "CAGR (Compound Annual Growth Rate) is the smoothed, per-year rate at which an investment grew from its starting value to its ending value. Enter the initial value, final value and the number of years to get the CAGR, along with the total absolute return and the growth multiple. It's the fairest way to compare investments over different periods.",
    howTo: [
      "Enter the initial (starting) value.",
      "Enter the final (ending) value.",
      "Enter the duration in years.",
      "Read the CAGR, absolute return and growth multiple.",
    ],
    faqs: [
      { q: "How is CAGR calculated?", a: "CAGR = (End ÷ Begin)^(1 ÷ years) − 1, expressed as a percentage. It's the constant annual rate that turns the start value into the end value." },
      { q: "How is CAGR different from absolute return?", a: "Absolute return is the total percentage gain regardless of time; CAGR annualizes it, so a 100% gain over 5 years is a much lower CAGR than 100% over 1 year." },
      { q: "Is my data uploaded?", a: "No. The calculation runs in your browser and nothing is sent to a server." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "xirr-calculator",
    name: "XIRR Calculator",
    h1: "Free XIRR Calculator",
    title: "XIRR Calculator – Return on Irregular Cashflows | UtilityHub",
    description:
      "Calculate XIRR — the annualized return on investments with irregular, dated cashflows such as SIP instalments and redemptions. Add dates and amounts. Free, private, in-browser.",
    cardDescription: "Annualized return for dated cashflows.",
    category: "investments",
    keywords: ["xirr calculator", "xirr mutual fund", "irregular cashflow return", "annualized return dates", "xirr formula"],
    icon: "🗓️",
    intro:
      "XIRR (Extended Internal Rate of Return) gives the true annualized return when money goes in and out on irregular dates — exactly the case with SIP instalments, top-ups and redemptions. Enter each cashflow with its date (investments negative, redemptions or current value positive) and the calculator solves for the rate that makes them balance. Results are computed with Newton's method and a bisection fallback.",
    howTo: [
      "Add each cashflow with its date and amount.",
      "Enter investments as negative and redemptions/current value as positive.",
      "Add or remove rows as needed.",
      "Read the XIRR and net gain.",
    ],
    faqs: [
      { q: "What is XIRR?", a: "XIRR is the annualized internal rate of return for a series of cashflows that occur on different dates. It's the standard way to measure returns on SIPs and lumpy investments." },
      { q: "Why must I include a positive value?", a: "You need at least one outflow (investment, negative) and one inflow (redemption or current value, positive) for a rate to exist. Enter your current portfolio value as a positive amount on today's date to measure return so far." },
      { q: "Is my data uploaded?", a: "No. The solver runs entirely in your browser and your cashflows stay on your device." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "absolute-return-calculator",
    name: "Absolute Return Calculator",
    h1: "Free Absolute Return Calculator",
    title: "Absolute Return Calculator – Total Investment Gain | UtilityHub",
    description:
      "Calculate the absolute return on an investment — the total percentage gain or loss from the invested amount to the current value. Free, instant and private.",
    cardDescription: "Total percentage gain on an investment.",
    category: "investments",
    keywords: ["absolute return calculator", "total return calculator", "investment gain percentage", "point to point return", "absolute return formula"],
    icon: "➗",
    intro:
      "Absolute return is the simplest measure of how an investment has done: the total gain (or loss) as a percentage of the amount you put in, regardless of how long you held it. Enter the invested amount and the current or final value to get the absolute return, the gain or loss in money terms and the growth multiple.",
    howTo: [
      "Enter the amount you invested.",
      "Enter the current or final value.",
      "Read the absolute return percentage and total gain.",
    ],
    faqs: [
      { q: "How is absolute return calculated?", a: "Absolute return = (Final value − Invested) ÷ Invested × 100. It's a point-to-point measure that ignores the holding period." },
      { q: "When should I use annualized return instead?", a: "Use absolute return to see total gain; use CAGR or annualized return when you want to compare investments held for different lengths of time." },
      { q: "Is my data uploaded?", a: "No. The calculation runs in your browser and nothing is sent to a server." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "annualized-return-calculator",
    name: "Annualized Return Calculator",
    h1: "Free Annualized Return Calculator",
    title: "Annualized Return Calculator – Return Per Year | UtilityHub",
    description:
      "Convert an investment's total gain into an annualized return (return per year) for any holding period in years, months or days. See absolute return too. Free and private.",
    cardDescription: "Total gain converted to return per year.",
    category: "investments",
    keywords: ["annualized return calculator", "annualised return", "return per year", "yearly return calculator", "annualized return formula"],
    icon: "📆",
    intro:
      "Annualized return expresses an investment's total gain as a smoothed, compounded rate per year, so you can compare holdings of different durations on equal footing. Enter the invested amount, the current or final value and the holding period (in years, months or days) to get the annualized return, along with the absolute return for reference.",
    howTo: [
      "Enter the amount invested and the current/final value.",
      "Enter the holding period and choose years, months or days.",
      "Read the annualized return and the absolute return.",
    ],
    faqs: [
      { q: "How is annualized return calculated?", a: "Annualized return = (Final ÷ Invested)^(1 ÷ years) − 1, where the period is converted to years. It's effectively the CAGR of the holding." },
      { q: "Why is my annualized return lower than the absolute return?", a: "Because the gain is spread over more than a year, compounding means the per-year rate is lower than the total gain. Over less than a year it can be higher." },
      { q: "Is my data uploaded?", a: "No. The calculation runs in your browser and your inputs stay on your device." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "investment-growth-calculator",
    name: "Investment Growth Calculator",
    h1: "Free Investment Growth Calculator",
    title: "Investment Growth Calculator – Compound Growth | UtilityHub",
    description:
      "Project the growth of an initial investment plus regular monthly contributions with compound returns. See total invested, growth and a year-by-year chart. Free and private.",
    cardDescription: "Grow an initial amount plus monthly deposits.",
    category: "investments",
    keywords: ["investment growth calculator", "compound growth calculator", "investment projection", "wealth growth calculator", "savings growth"],
    icon: "🌱",
    intro:
      "See how an initial investment plus ongoing monthly contributions can grow with compounding. Enter a starting amount, a monthly contribution, an expected annual return and a time horizon to project the future value, how much you contributed versus how much it grew, and a year-by-year growth chart. All figures are estimates based on your assumptions.",
    howTo: [
      "Enter your initial (starting) amount.",
      "Enter your monthly contribution.",
      "Enter the expected annual return and period.",
      "See the future value, total invested and growth chart.",
    ],
    faqs: [
      { q: "How is the growth calculated?", a: "The initial amount and each monthly contribution compound at the assumed rate, applied monthly. The chart plots invested versus total value each year." },
      { q: "Can I set the initial amount or monthly to zero?", a: "Yes. Leave the initial at zero to model pure monthly investing, or the monthly at zero to model a one-time lumpsum." },
      { q: "Is my data uploaded?", a: "No. Everything is computed in your browser and nothing is sent to a server." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "future-value-calculator",
    name: "Future Value Calculator",
    h1: "Free Future Value Calculator",
    title: "Future Value Calculator – FV of Money | UtilityHub",
    description:
      "Calculate the future value of a present sum with compound interest, choosing annual, semi-annual, quarterly or monthly compounding. See the interest earned. Free and private.",
    cardDescription: "Future value of a present sum.",
    category: "investments",
    keywords: ["future value calculator", "fv calculator", "future value of money", "compound interest calculator", "future value formula"],
    icon: "⏭️",
    intro:
      "The future value (FV) of money tells you what a sum invested today will be worth later, given a rate of return and compounding. Enter a present value, an annual rate, a time horizon and how often interest compounds to get the future value and the total interest earned. A core time-value-of-money tool for planning.",
    howTo: [
      "Enter the present value (amount today).",
      "Enter the annual interest / return rate.",
      "Enter the time period and compounding frequency.",
      "Read the future value and interest earned.",
    ],
    faqs: [
      { q: "How is future value calculated?", a: "FV = PV × (1 + r ÷ n)^(n × t), where r is the annual rate, n the compounding periods per year and t the years. More frequent compounding gives a slightly higher FV." },
      { q: "Does compounding frequency matter?", a: "Yes. Monthly compounding yields a bit more than annual for the same nominal rate, because interest earns interest sooner. The tool lets you compare." },
      { q: "Is my data uploaded?", a: "No. The calculation runs in your browser and nothing is sent to a server." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "present-value-calculator",
    name: "Present Value Calculator",
    h1: "Free Present Value Calculator",
    title: "Present Value Calculator – PV of Money | UtilityHub",
    description:
      "Calculate the present value of a future sum by discounting it at a chosen rate and compounding frequency. See how much a future amount is worth today. Free and private.",
    cardDescription: "Today's value of a future sum.",
    category: "investments",
    keywords: ["present value calculator", "pv calculator", "present value of money", "discounted value", "present value formula"],
    icon: "⏮️",
    intro:
      "Present value (PV) is the reverse of future value: it tells you how much a sum you'll receive in the future is worth in today's money, once you discount it at a chosen rate. Enter the future value, a discount rate, the time horizon and the compounding frequency to see the present value and the total discount. Useful for comparing offers and valuing future cashflows.",
    howTo: [
      "Enter the future value (amount later).",
      "Enter the annual discount rate.",
      "Enter the time period and compounding frequency.",
      "Read the present value and the discount amount.",
    ],
    faqs: [
      { q: "How is present value calculated?", a: "PV = FV ÷ (1 + r ÷ n)^(n × t), where r is the discount rate, n the compounding periods per year and t the years. Higher rates or longer periods mean a smaller present value." },
      { q: "What discount rate should I use?", a: "Often the return you could otherwise earn, or your cost of capital. A higher rate reflects a higher opportunity cost of money, lowering the present value." },
      { q: "Is my data uploaded?", a: "No. The calculation runs in your browser and your inputs stay on your device." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "rule-of-72-calculator",
    name: "Rule of 72 Calculator",
    h1: "Free Rule of 72 Calculator",
    title: "Rule of 72 Calculator – Years to Double Money | UtilityHub",
    description:
      "Use the Rule of 72 to estimate how many years it takes to double your money at a given return — or the rate needed to double in a set time. Free, instant and private.",
    cardDescription: "Estimate the time to double your money.",
    category: "investments",
    keywords: ["rule of 72", "rule of 72 calculator", "double money", "years to double investment", "doubling time"],
    icon: "✌️",
    intro:
      "The Rule of 72 is a quick mental-math shortcut: divide 72 by your annual return to estimate the number of years it takes to double your money — or divide 72 by the years to find the rate you'd need. This calculator does both directions and also shows the precise figure using exact compounding for comparison.",
    howTo: [
      "Choose whether to solve for years or for the rate.",
      "Enter your annual return, or the number of years.",
      "Read the Rule of 72 estimate and the precise value.",
    ],
    faqs: [
      { q: "How accurate is the Rule of 72?", a: "It's a close approximation for typical rates (roughly 6–10%). The tool also shows the exact doubling time, which uses logarithms, so you can see the small difference." },
      { q: "Why 72?", a: "72 has many divisors and closely matches the exact doubling maths for common interest rates, which is why it became the popular shortcut." },
      { q: "Is my data uploaded?", a: "No. The calculation runs entirely in your browser." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "rule-of-114-calculator",
    name: "Rule of 114 Calculator",
    h1: "Free Rule of 114 Calculator",
    title: "Rule of 114 Calculator – Years to Triple Money | UtilityHub",
    description:
      "Use the Rule of 114 to estimate how many years it takes to triple your money at a given return — or the rate needed to triple in a set time. Free, instant and private.",
    cardDescription: "Estimate the time to triple your money.",
    category: "investments",
    keywords: ["rule of 114", "rule of 114 calculator", "triple money", "years to triple investment", "tripling time"],
    icon: "🔱",
    intro:
      "The Rule of 114 is the tripling cousin of the Rule of 72: divide 114 by your annual return to estimate the years it takes to triple your money — or divide 114 by the years to find the rate you'd need. This calculator works both ways and also shows the precise figure using exact compounding.",
    howTo: [
      "Choose whether to solve for years or for the rate.",
      "Enter your annual return, or the number of years.",
      "Read the Rule of 114 estimate and the precise value.",
    ],
    faqs: [
      { q: "How accurate is the Rule of 114?", a: "It's a good approximation for tripling at typical rates. The tool also shows the exact figure from logarithms so you can compare." },
      { q: "Why 114?", a: "114 approximates 100 × ln(3), the maths behind tripling time, just as 72 approximates doubling — so it works as a quick shortcut." },
      { q: "Is my data uploaded?", a: "No. The calculation runs entirely in your browser." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "rule-of-144-calculator",
    name: "Rule of 144 Calculator",
    h1: "Free Rule of 144 Calculator",
    title: "Rule of 144 Calculator – Years to Quadruple Money | UtilityHub",
    description:
      "Use the Rule of 144 to estimate how many years it takes to quadruple your money at a given return — or the rate needed to quadruple in a set time. Free, instant and private.",
    cardDescription: "Estimate the time to quadruple your money.",
    category: "investments",
    keywords: ["rule of 144", "rule of 144 calculator", "quadruple money", "years to quadruple investment", "4x money"],
    icon: "4️⃣",
    intro:
      "The Rule of 144 estimates how long it takes to quadruple (4×) your money: divide 144 by your annual return for the number of years — or divide 144 by the years to find the rate you'd need. Because quadrupling is doubling twice, 144 is simply double 72. This calculator solves both directions and shows the precise figure from exact compounding.",
    howTo: [
      "Choose whether to solve for years or for the rate.",
      "Enter your annual return, or the number of years.",
      "Read the Rule of 144 estimate and the precise value.",
    ],
    faqs: [
      { q: "How accurate is the Rule of 144?", a: "It's a handy approximation for quadrupling at common rates. The tool also shows the exact figure using logarithms for comparison." },
      { q: "Why 144?", a: "Quadrupling is doubling twice, so the doubling constant (72) is doubled to 144. It gives a quick estimate of 4× growth time." },
      { q: "Is my data uploaded?", a: "No. The calculation runs entirely in your browser." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },

  // ===================== FIXED INCOME =====================
  {
    slug: "fd-calculator",
    name: "FD Calculator",
    h1: "Free FD Calculator",
    title: "FD Calculator – Fixed Deposit Maturity & Interest | UtilityHub",
    description:
      "Calculate fixed deposit maturity value and interest for any amount, rate and tenure, with monthly, quarterly, half-yearly or annual compounding. Free, private, in-browser.",
    cardDescription: "Fixed deposit maturity value & interest.",
    category: "fixed-income",
    keywords: ["fd calculator", "fixed deposit calculator", "fd maturity calculator", "fd interest calculator", "bank fd returns"],
    icon: "🏦",
    intro:
      "A fixed deposit (FD) calculator works out how much your deposit will grow to at maturity, given the interest rate, tenure and how often interest compounds. Enter the amount, rate and term to see the maturity value, the interest earned and a year-by-year growth chart. You can also switch to simple interest. Rates are illustrative — check your bank's current FD rates.",
    howTo: [
      "Enter your deposit amount.",
      "Enter the annual interest rate and tenure.",
      "Choose the compounding frequency (or simple interest).",
      "See the maturity value and interest earned.",
    ],
    faqs: [
      { q: "How is FD maturity calculated?", a: "With compound interest, Maturity = P × (1 + r ÷ n)^(n × t), where r is the annual rate, n the compounding periods per year and t the tenure in years. Most banks compound quarterly." },
      { q: "Does compounding frequency change my return?", a: "Yes, slightly. More frequent compounding (e.g. monthly vs annually) gives a marginally higher maturity value for the same nominal rate." },
      { q: "Is my data uploaded?", a: "No. The calculation runs in your browser and nothing is sent to a server." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "rd-calculator",
    name: "RD Calculator",
    h1: "Free RD Calculator",
    title: "RD Calculator – Recurring Deposit Maturity | UtilityHub",
    description:
      "Calculate recurring deposit maturity value and interest from your monthly deposit, rate and tenure, with quarterly compounding. See a growth chart. Free, private, in-browser.",
    cardDescription: "Recurring deposit maturity value & interest.",
    category: "fixed-income",
    keywords: ["rd calculator", "recurring deposit calculator", "rd maturity calculator", "rd interest", "monthly deposit calculator"],
    icon: "🔁",
    intro:
      "A recurring deposit (RD) lets you save a fixed amount every month and earn interest, usually compounded quarterly. This calculator projects the maturity value from your monthly deposit, the interest rate and the tenure, and shows how much you deposit versus the interest earned, with a growth chart. Rates are illustrative — check your bank's current RD rates.",
    howTo: [
      "Enter your monthly deposit amount.",
      "Enter the annual interest rate.",
      "Enter the tenure in years.",
      "See the maturity value and interest earned.",
    ],
    faqs: [
      { q: "How is RD interest calculated?", a: "Each monthly instalment earns interest for the remaining tenure, with interest compounded quarterly. This tool models each month growing at the equivalent monthly rate." },
      { q: "How is RD different from FD?", a: "An FD is a single lumpsum deposit; an RD is a series of equal monthly deposits. RD suits regular savers, FD suits a one-time sum." },
      { q: "Is my data uploaded?", a: "No. The calculation runs in your browser and your inputs stay on your device." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "ppf-calculator",
    name: "PPF Calculator",
    h1: "Free PPF Calculator",
    title: "PPF Calculator – Public Provident Fund Maturity | UtilityHub",
    description:
      "Calculate Public Provident Fund (PPF) maturity value and interest from your yearly deposit, rate and tenure. See the year-by-year growth. Free, private, in-browser.",
    cardDescription: "PPF maturity value & interest over 15 years.",
    category: "fixed-income",
    keywords: ["ppf calculator", "public provident fund calculator", "ppf maturity calculator", "ppf interest calculator", "ppf returns"],
    icon: "🛡️",
    intro:
      "The Public Provident Fund (PPF) is a long-term, tax-friendly savings scheme with a 15-year term (extendable in 5-year blocks) and annually compounded interest. This calculator projects your maturity value from your yearly deposit, the interest rate and the tenure, and shows the deposit-versus-interest split with a growth chart. The default rate is illustrative — check the current PPF rate.",
    howTo: [
      "Enter your yearly deposit (up to ₹1.5 lakh).",
      "Enter the interest rate and tenure (15 years by default).",
      "See the maturity value and interest earned.",
      "Review the year-by-year growth chart.",
    ],
    faqs: [
      { q: "How is PPF interest calculated?", a: "PPF interest is compounded annually. This tool adds your yearly deposit at the start of each year and applies the annual rate, for the full tenure." },
      { q: "Can I extend PPF beyond 15 years?", a: "Yes. After the initial 15-year maturity you can extend in blocks of 5 years, with or without further deposits. Increase the tenure to model an extension." },
      { q: "Is my data uploaded?", a: "No. The calculation runs in your browser and nothing is sent to a server." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "epf-calculator",
    name: "EPF Calculator",
    h1: "Free EPF Calculator",
    title: "EPF Calculator – Employees' Provident Fund Corpus | UtilityHub",
    description:
      "Estimate your EPF corpus at retirement from your monthly basic salary, employee and employer contributions, annual increments and the interest rate. Free and private.",
    cardDescription: "EPF retirement corpus from monthly salary.",
    category: "fixed-income",
    keywords: ["epf calculator", "employees provident fund calculator", "epf corpus calculator", "pf calculator", "provident fund retirement"],
    icon: "👷",
    intro:
      "The Employees' Provident Fund (EPF) builds a retirement corpus from monthly contributions by you and your employer, plus annual interest. This calculator projects your corpus at retirement from your monthly basic (Basic + DA), the contribution rates, an expected annual increment and the interest rate. Note that of the employer's 12%, 8.33% goes to the pension scheme (EPS), so the default EPF share is 3.67%.",
    howTo: [
      "Enter your current age and planned retirement age.",
      "Enter your monthly basic (Basic + DA) and annual increment.",
      "Adjust the employee/employer contribution rates and interest rate.",
      "See your projected EPF corpus at retirement.",
    ],
    faqs: [
      { q: "How much do employer and employee contribute to EPF?", a: "Both contribute 12% of basic, but 8.33% of the employer's share goes to the pension scheme (EPS), leaving 3.67% in EPF. This tool lets you set both rates." },
      { q: "Is the EPF interest rate fixed?", a: "No, it's declared each year by the government. Enter the rate you expect; the default is an illustrative recent value." },
      { q: "Is my data uploaded?", a: "No. The calculation runs in your browser and your salary details stay on your device." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "nps-calculator",
    name: "NPS Calculator",
    h1: "Free NPS Calculator",
    title: "NPS Calculator – National Pension System Corpus & Pension | UtilityHub",
    description:
      "Estimate your NPS corpus at 60, the tax-free lump sum, the annuity portion and your expected monthly pension, from your monthly contribution and expected return. Free and private.",
    cardDescription: "NPS corpus, lump sum & monthly pension.",
    category: "fixed-income",
    keywords: ["nps calculator", "national pension system calculator", "nps pension calculator", "nps corpus", "nps annuity calculator"],
    icon: "🧓",
    intro:
      "The National Pension System (NPS) builds a retirement corpus from monthly contributions until age 60. At maturity you must use at least 40% of the corpus to buy an annuity (which pays a pension); the rest can be withdrawn as a tax-free lump sum. This calculator estimates your corpus at 60, the lump sum, the annuity portion and the resulting monthly pension. All figures are estimates based on your assumptions.",
    howTo: [
      "Enter your current age and monthly contribution.",
      "Enter the expected return during accumulation.",
      "Set the annuity portion (min 40%) and the annuity return.",
      "See the corpus at 60, lump sum and monthly pension.",
    ],
    faqs: [
      { q: "How is the NPS pension calculated?", a: "At 60, the annuity portion of your corpus (at least 40%) buys an annuity. The monthly pension is that amount times the annuity rate, divided by 12. The rest is a tax-free lump sum." },
      { q: "What return should I assume?", a: "NPS invests across equity, corporate bonds and government securities. A blended long-term assumption of 8–10% is common, but returns are market-linked and not guaranteed." },
      { q: "Is my data uploaded?", a: "No. The calculation runs in your browser and nothing is sent to a server." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "sukanya-samriddhi-calculator",
    name: "Sukanya Samriddhi Calculator",
    h1: "Free Sukanya Samriddhi Yojana Calculator",
    title: "Sukanya Samriddhi Calculator – SSY Maturity | UtilityHub",
    description:
      "Calculate the maturity value of a Sukanya Samriddhi Yojana (SSY) account: deposits for 15 years, maturity at 21 years, with annually compounded interest. Free and private.",
    cardDescription: "Sukanya Samriddhi (SSY) maturity value.",
    category: "fixed-income",
    keywords: ["sukanya samriddhi calculator", "ssy calculator", "sukanya samriddhi yojana", "ssy maturity calculator", "girl child savings scheme"],
    icon: "👧",
    intro:
      "Sukanya Samriddhi Yojana (SSY) is a government savings scheme for a girl child. You deposit for the first 15 years, but the account matures 21 years after opening — interest (compounded annually) keeps accruing during the final years with no further deposits. This calculator projects the maturity value from your yearly deposit and the interest rate. The default rate is illustrative — check the current SSY rate.",
    howTo: [
      "Enter your yearly deposit (₹250 to ₹1.5 lakh).",
      "Enter the interest rate.",
      "See the maturity value after 21 years.",
      "Review the year-by-year growth chart.",
    ],
    faqs: [
      { q: "How long do I deposit into SSY?", a: "Deposits are made for 15 years from opening, but the account matures at 21 years. Interest continues to compound on the balance during the remaining years." },
      { q: "How is SSY interest calculated?", a: "Interest is compounded annually on the balance. This tool adds your yearly deposit for the first 15 years and applies the annual rate through year 21." },
      { q: "Is my data uploaded?", a: "No. The calculation runs in your browser and your inputs stay on your device." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "senior-citizen-savings-calculator",
    name: "Senior Citizen Savings Scheme Calculator",
    h1: "Free Senior Citizen Savings Scheme Calculator",
    title: "SCSS Calculator – Senior Citizen Savings Scheme | UtilityHub",
    description:
      "Calculate the quarterly interest payout and total interest of the Senior Citizen Savings Scheme (SCSS) from your deposit and rate over the 5-year term. Free, private, in-browser.",
    cardDescription: "SCSS quarterly payout & total interest.",
    category: "fixed-income",
    keywords: ["scss calculator", "senior citizen savings scheme calculator", "scss interest calculator", "senior citizen scheme returns", "scss quarterly interest"],
    icon: "🧑‍🦳",
    intro:
      "The Senior Citizen Savings Scheme (SCSS) is a 5-year government scheme that pays interest every quarter, with the principal returned at maturity. This calculator shows your quarterly interest payout, the total interest over five years and the principal returned. The default rate is illustrative — check the current SCSS rate.",
    howTo: [
      "Enter your deposit amount (up to ₹30 lakh).",
      "Enter the interest rate.",
      "See the quarterly interest payout and total interest.",
    ],
    faqs: [
      { q: "How often does SCSS pay interest?", a: "SCSS pays simple interest every quarter. The quarterly payout is the deposit times the annual rate, divided by four. The principal is returned at the end of the 5-year term." },
      { q: "Is SCSS interest compounded?", a: "No. Interest is paid out quarterly rather than reinvested, so it doesn't compound within the scheme. The total is the quarterly payout across all 20 quarters." },
      { q: "Is my data uploaded?", a: "No. The calculation runs in your browser and nothing is sent to a server." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "nsc-calculator",
    name: "National Savings Certificate Calculator",
    h1: "Free NSC Calculator",
    title: "NSC Calculator – National Savings Certificate Maturity | UtilityHub",
    description:
      "Calculate the maturity value of a National Savings Certificate (NSC): a lumpsum compounded annually over 5 years. See the year-by-year build-up. Free, private, in-browser.",
    cardDescription: "NSC maturity value over 5 years.",
    category: "fixed-income",
    keywords: ["nsc calculator", "national savings certificate calculator", "nsc maturity calculator", "nsc interest calculator", "nsc returns"],
    icon: "📜",
    intro:
      "The National Savings Certificate (NSC) is a 5-year government scheme where a lumpsum earns interest compounded annually, paid together with the principal at maturity. This calculator shows the maturity value, the interest earned and a year-by-year breakdown of how the balance builds. The default rate is illustrative — check the current NSC rate.",
    howTo: [
      "Enter your investment amount.",
      "Enter the interest rate.",
      "See the maturity value after 5 years.",
      "Review the year-by-year interest table.",
    ],
    faqs: [
      { q: "How is NSC maturity calculated?", a: "NSC compounds annually: Maturity = P × (1 + r)^5. Interest accrues each year and is paid with the principal at the end of the 5-year term." },
      { q: "Is NSC interest paid out each year?", a: "No. The interest is reinvested (compounded) and paid together with the principal at maturity, though it may be eligible for a tax deduction as it accrues." },
      { q: "Is my data uploaded?", a: "No. The calculation runs in your browser and your inputs stay on your device." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "kisan-vikas-patra-calculator",
    name: "Kisan Vikas Patra Calculator",
    h1: "Free Kisan Vikas Patra Calculator",
    title: "KVP Calculator – Kisan Vikas Patra Doubling | UtilityHub",
    description:
      "Calculate how long a Kisan Vikas Patra (KVP) takes to double your money at a given interest rate, and the maturity value. Free, instant and private.",
    cardDescription: "KVP doubling time & maturity value.",
    category: "fixed-income",
    keywords: ["kisan vikas patra calculator", "kvp calculator", "kvp doubling calculator", "kvp maturity calculator", "kvp interest rate"],
    icon: "🌾",
    intro:
      "Kisan Vikas Patra (KVP) is a government scheme designed to double your money over a fixed period determined by the interest rate, which is compounded annually. This calculator derives the doubling time from the rate and shows the maturity value (twice your investment) and the time to double in years and months. The default rate is illustrative — check the current KVP rate.",
    howTo: [
      "Enter your investment amount.",
      "Enter the interest rate.",
      "See the doubling time and maturity value.",
    ],
    faqs: [
      { q: "How does KVP double my money?", a: "KVP compounds annually. The time to double is ln(2) ÷ ln(1 + rate), so a higher rate doubles your money faster. At maturity you receive twice your investment." },
      { q: "Can I redeem KVP early?", a: "KVP has a lock-in (currently 2.5 years) after which premature encashment is allowed, but the full doubling only happens if you hold it to the stated maturity." },
      { q: "Is my data uploaded?", a: "No. The calculation runs entirely in your browser." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "post-office-mis-calculator",
    name: "Post Office MIS Calculator",
    h1: "Free Post Office MIS Calculator",
    title: "Post Office MIS Calculator – Monthly Income Scheme | UtilityHub",
    description:
      "Calculate the monthly income from a Post Office Monthly Income Scheme (POMIS) deposit, plus the total interest over the 5-year term. Free, private, in-browser.",
    cardDescription: "Post Office MIS monthly income & interest.",
    category: "fixed-income",
    keywords: ["post office mis calculator", "pomis calculator", "monthly income scheme calculator", "post office monthly income", "mis interest calculator"],
    icon: "📮",
    intro:
      "The Post Office Monthly Income Scheme (POMIS) is a 5-year scheme that pays a fixed monthly income on a lumpsum deposit, with the principal returned at maturity. This calculator shows your monthly income, the total interest over five years and the principal returned. The default rate is illustrative — check the current POMIS rate.",
    howTo: [
      "Enter your deposit amount.",
      "Enter the interest rate.",
      "See the monthly income and total interest.",
    ],
    faqs: [
      { q: "How is the POMIS monthly income calculated?", a: "The monthly income is the deposit times the annual rate, divided by twelve. It's paid every month for the 5-year term, and the principal is returned at maturity." },
      { q: "What is the maximum POMIS deposit?", a: "Currently ₹9 lakh for a single account and ₹15 lakh for a joint account. Enter your amount to see the resulting monthly income." },
      { q: "Is my data uploaded?", a: "No. The calculation runs in your browser and nothing is sent to a server." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "treasury-bill-calculator",
    name: "Treasury Bill Calculator",
    h1: "Free Treasury Bill Calculator",
    title: "Treasury Bill Calculator – T-Bill Yield & Price | UtilityHub",
    description:
      "Calculate the yield of a Treasury Bill from its price, or the price from a target yield, for 91, 182 or 364-day tenures. See the discount and return. Free and private.",
    cardDescription: "T-bill yield or price from discount.",
    category: "fixed-income",
    keywords: ["treasury bill calculator", "t-bill calculator", "treasury bill yield calculator", "tbill discount", "91 day treasury bill"],
    icon: "🧾",
    intro:
      "Treasury Bills (T-bills) are short-term government securities issued at a discount to their face value and redeemed at face value — the difference is your return. This calculator finds the annualized yield from a purchase price, or the price from a target yield, for standard 91, 182 and 364-day tenures. Enter what you know and read off the rest.",
    howTo: [
      "Choose whether you know the price or the yield.",
      "Enter the face value and the price or yield.",
      "Select the tenure (91, 182 or 364 days).",
      "Read the yield or price, discount and return.",
    ],
    faqs: [
      { q: "How is T-bill yield calculated?", a: "Yield = (Face − Price) ÷ Price × (365 ÷ days) × 100. Because T-bills are zero-coupon, the discount from face value is the entire return, annualized over the tenure." },
      { q: "Why are T-bills sold at a discount?", a: "They pay no coupon; instead you buy below face value and receive the full face value at maturity, so the discount is your interest." },
      { q: "Is my data uploaded?", a: "No. The calculation runs in your browser and your inputs stay on your device." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "bond-yield-calculator",
    name: "Bond Yield Calculator",
    h1: "Free Bond Yield Calculator",
    title: "Bond Yield Calculator – Current Yield & YTM | UtilityHub",
    description:
      "Calculate a bond's current yield and yield to maturity (YTM) from its face value, coupon rate, market price and years to maturity. Free, private, in-browser.",
    cardDescription: "Bond current yield & yield to maturity.",
    category: "fixed-income",
    keywords: ["bond yield calculator", "yield to maturity calculator", "ytm calculator", "current yield calculator", "bond ytm"],
    icon: "📈",
    intro:
      "A bond's return depends on its coupon, its price and how long until it matures. This calculator computes the current yield (annual coupon ÷ price) and solves for the yield to maturity (YTM) — the single rate that makes the present value of all coupons and the redemption equal the market price. Enter the bond's details and choose the coupon frequency.",
    howTo: [
      "Enter the face value and coupon rate.",
      "Enter the market price and years to maturity.",
      "Choose the coupon frequency.",
      "Read the YTM and current yield.",
    ],
    faqs: [
      { q: "What is the difference between current yield and YTM?", a: "Current yield is just the annual coupon divided by the price. YTM also accounts for the gain or loss versus face value over the remaining life, so it's the more complete measure of return." },
      { q: "How is YTM calculated?", a: "YTM is the discount rate that makes the present value of all future coupons plus the face value equal the market price. This tool solves for it numerically by bisection." },
      { q: "Is my data uploaded?", a: "No. The calculation runs in your browser and nothing is sent to a server." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },

  // ===================== LOANS =====================
  {
    slug: "emi-calculator",
    name: "EMI Calculator",
    h1: "Free EMI Calculator",
    title: "EMI Calculator – Loan EMI, Interest & Schedule | UtilityHub",
    description:
      "Calculate your loan EMI, total interest and total payment for any amount, rate and tenure, with a principal-vs-interest breakdown and year-by-year schedule. Free and private.",
    cardDescription: "Monthly EMI, interest & amortization.",
    category: "loans",
    keywords: ["emi calculator", "loan emi calculator", "equated monthly instalment", "emi with amortization", "monthly instalment calculator"],
    icon: "💳",
    intro:
      "An EMI (Equated Monthly Instalment) calculator works out the fixed monthly payment on a loan from the amount borrowed, the interest rate and the tenure. This one also shows the total interest, the total amount payable, a principal-versus-interest split and a year-by-year repayment schedule. It's currency-agnostic and runs entirely in your browser.",
    howTo: [
      "Enter the loan amount.",
      "Enter the annual interest rate.",
      "Enter the tenure in years or months.",
      "See the EMI, total interest and repayment schedule.",
    ],
    faqs: [
      { q: "How is EMI calculated?", a: "EMI = P × r × (1+r)^n ÷ ((1+r)^n − 1), where P is the principal, r the monthly interest rate and n the number of months. This tool does the maths and builds the full schedule." },
      { q: "Does a longer tenure reduce my EMI?", a: "Yes, a longer tenure lowers the monthly EMI but increases the total interest paid over the life of the loan. Try different tenures to see the trade-off." },
      { q: "Is my data uploaded?", a: "No. The calculation runs in your browser and nothing is sent to a server." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "home-loan-calculator",
    name: "Home Loan Calculator",
    h1: "Free Home Loan EMI Calculator",
    title: "Home Loan Calculator – EMI, Interest & Schedule | UtilityHub",
    description:
      "Calculate your home loan EMI, total interest and repayment schedule for any loan amount, rate and tenure. See the principal-vs-interest split. Free, private, in-browser.",
    cardDescription: "Home loan EMI, interest & schedule.",
    category: "loans",
    keywords: ["home loan calculator", "home loan emi calculator", "housing loan emi", "mortgage calculator", "home loan interest calculator"],
    icon: "🏠",
    intro:
      "Planning a home loan? This calculator shows your monthly EMI, the total interest over the tenure and a year-by-year repayment schedule from the loan amount, interest rate and term. Home loans run for long tenures, so a small rate change makes a big difference to total interest — try a few scenarios. Everything runs in your browser.",
    howTo: [
      "Enter the home loan amount.",
      "Enter the annual interest rate and tenure.",
      "See your EMI, total interest and schedule.",
      "Adjust the tenure to balance EMI against total interest.",
    ],
    faqs: [
      { q: "How much home loan EMI will I pay?", a: "Your EMI depends on the loan amount, rate and tenure. Enter them above to see the exact monthly figure, plus the total interest across the whole tenure." },
      { q: "Should I choose a longer or shorter tenure?", a: "A longer tenure lowers the EMI but raises total interest substantially over 15–30 years. A shorter tenure costs more monthly but far less overall." },
      { q: "Is my data uploaded?", a: "No. The calculation runs in your browser and your figures stay on your device." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "car-loan-calculator",
    name: "Car Loan Calculator",
    h1: "Free Car Loan EMI Calculator",
    title: "Car Loan Calculator – EMI, Interest & Schedule | UtilityHub",
    description:
      "Calculate your car loan EMI, total interest and repayment schedule for any amount, rate and tenure. See the principal-vs-interest split. Free, private, in-browser.",
    cardDescription: "Car loan EMI, interest & schedule.",
    category: "loans",
    keywords: ["car loan calculator", "car loan emi calculator", "auto loan calculator", "vehicle loan emi", "car finance calculator"],
    icon: "🚗",
    intro:
      "Work out the monthly EMI on a car loan from the amount financed, the interest rate and the tenure. This calculator also shows the total interest, the total payable and a year-by-year schedule, so you can see exactly what the car will cost over the loan. It all runs in your browser.",
    howTo: [
      "Enter the car loan amount (on-road price minus down payment).",
      "Enter the annual interest rate and tenure.",
      "See your EMI, total interest and schedule.",
    ],
    faqs: [
      { q: "What loan amount should I enter?", a: "Enter the amount you're financing — usually the on-road price minus your down payment and any trade-in value." },
      { q: "How does the down payment affect my EMI?", a: "A larger down payment means a smaller loan, which lowers both the EMI and the total interest. Reduce the loan amount to model a bigger down payment." },
      { q: "Is my data uploaded?", a: "No. The calculation runs in your browser and nothing is sent to a server." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "bike-loan-calculator",
    name: "Bike Loan Calculator",
    h1: "Free Bike Loan EMI Calculator",
    title: "Bike Loan Calculator – Two-Wheeler EMI | UtilityHub",
    description:
      "Calculate your bike or two-wheeler loan EMI, total interest and repayment schedule for any amount, rate and tenure. Free, private, in-browser.",
    cardDescription: "Two-wheeler loan EMI & interest.",
    category: "loans",
    keywords: ["bike loan calculator", "two wheeler loan calculator", "bike emi calculator", "scooter loan emi", "bike finance calculator"],
    icon: "🏍️",
    intro:
      "Calculate the EMI on a bike or two-wheeler loan from the amount financed, the interest rate and the tenure. See the total interest, the total payable and a repayment schedule. Two-wheeler loans are usually short, so the tenure has a big effect on your monthly outgo. Everything runs in your browser.",
    howTo: [
      "Enter the bike loan amount.",
      "Enter the annual interest rate and tenure.",
      "See your EMI, total interest and schedule.",
    ],
    faqs: [
      { q: "How is a bike loan EMI calculated?", a: "The same EMI formula applies: it depends on the loan amount, the monthly interest rate and the number of months. Enter your figures above for the exact EMI." },
      { q: "What's a typical two-wheeler loan tenure?", a: "Usually 1 to 4 years. A shorter tenure raises the EMI but keeps total interest low; adjust the tenure to find a comfortable balance." },
      { q: "Is my data uploaded?", a: "No. The calculation runs in your browser and your figures stay on your device." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "personal-loan-calculator",
    name: "Personal Loan Calculator",
    h1: "Free Personal Loan EMI Calculator",
    title: "Personal Loan Calculator – EMI & Interest | UtilityHub",
    description:
      "Calculate your personal loan EMI, total interest and repayment schedule for any amount, rate and tenure. See the principal-vs-interest split. Free, private, in-browser.",
    cardDescription: "Personal loan EMI, interest & schedule.",
    category: "loans",
    keywords: ["personal loan calculator", "personal loan emi calculator", "personal loan interest", "unsecured loan emi", "instant loan calculator"],
    icon: "💵",
    intro:
      "Personal loans are unsecured and usually carry higher interest rates, so it pays to see the full cost before borrowing. This calculator shows your EMI, total interest, total payable and a year-by-year schedule from the amount, rate and tenure. Everything runs in your browser.",
    howTo: [
      "Enter the personal loan amount.",
      "Enter the annual interest rate and tenure.",
      "See your EMI, total interest and schedule.",
    ],
    faqs: [
      { q: "Why are personal loan rates higher?", a: "Personal loans are unsecured — there's no collateral — so lenders charge more to offset the risk. Enter your offered rate to see the real cost in interest." },
      { q: "How can I lower my personal loan EMI?", a: "A lower rate, a smaller amount or a longer tenure all reduce the EMI, though a longer tenure raises total interest. Compare scenarios above." },
      { q: "Is my data uploaded?", a: "No. The calculation runs in your browser and nothing is sent to a server." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "education-loan-calculator",
    name: "Education Loan Calculator",
    h1: "Free Education Loan EMI Calculator",
    title: "Education Loan Calculator – Student Loan EMI | UtilityHub",
    description:
      "Calculate your education or student loan EMI, total interest and repayment schedule for any amount, rate and tenure. Free, private, in-browser.",
    cardDescription: "Education loan EMI, interest & schedule.",
    category: "loans",
    keywords: ["education loan calculator", "student loan calculator", "education loan emi", "study loan emi", "student loan interest calculator"],
    icon: "🎓",
    intro:
      "Plan the repayment of an education or student loan with this calculator. Enter the loan amount, interest rate and tenure to see the EMI, the total interest and a year-by-year schedule. Education loans often have a moratorium before repayment begins — this tool models the EMI phase once repayment starts. It runs in your browser.",
    howTo: [
      "Enter the education loan amount.",
      "Enter the annual interest rate and tenure.",
      "See your EMI, total interest and schedule.",
    ],
    faqs: [
      { q: "Does this account for the moratorium period?", a: "This calculator models the repayment (EMI) phase. During a moratorium interest may accrue and be added to the principal; enter the resulting loan amount to reflect that." },
      { q: "How long are education loan tenures?", a: "Repayment often spans 5 to 15 years after the course ends. A longer tenure eases the EMI but increases the total interest — compare options above." },
      { q: "Is my data uploaded?", a: "No. The calculation runs in your browser and your figures stay on your device." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "gold-loan-calculator",
    name: "Gold Loan Calculator",
    h1: "Free Gold Loan EMI Calculator",
    title: "Gold Loan Calculator – EMI & Interest | UtilityHub",
    description:
      "Calculate your gold loan EMI, total interest and repayment schedule for any amount, rate and tenure. See the principal-vs-interest split. Free, private, in-browser.",
    cardDescription: "Gold loan EMI, interest & schedule.",
    category: "loans",
    keywords: ["gold loan calculator", "gold loan emi calculator", "gold loan interest", "loan against gold", "gold loan repayment"],
    icon: "🪙",
    intro:
      "A gold loan lets you borrow against gold jewellery or coins, usually for a short tenure. This calculator shows the EMI, total interest, total payable and a repayment schedule from the loan amount, rate and tenure. Note that some gold loans use bullet repayment instead of EMIs — this tool models the EMI option. It runs in your browser.",
    howTo: [
      "Enter the gold loan amount.",
      "Enter the annual interest rate and tenure.",
      "See your EMI, total interest and schedule.",
    ],
    faqs: [
      { q: "How much can I borrow against gold?", a: "Lenders advance a percentage of the gold's value (the loan-to-value ratio). Enter the sanctioned loan amount above to compute your EMI and interest." },
      { q: "Are gold loans EMI-based?", a: "Some are EMI-based; others use bullet repayment (interest periodically, principal at the end). This calculator models the EMI structure." },
      { q: "Is my data uploaded?", a: "No. The calculation runs in your browser and nothing is sent to a server." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "business-loan-calculator",
    name: "Business Loan Calculator",
    h1: "Free Business Loan EMI Calculator",
    title: "Business Loan Calculator – EMI & Interest | UtilityHub",
    description:
      "Calculate your business loan EMI, total interest and repayment schedule for any amount, rate and tenure. See the principal-vs-interest split. Free, private, in-browser.",
    cardDescription: "Business loan EMI, interest & schedule.",
    category: "loans",
    keywords: ["business loan calculator", "business loan emi calculator", "sme loan emi", "working capital loan", "business loan interest"],
    icon: "🏢",
    intro:
      "Evaluate the cost of a business loan before you borrow. This calculator shows the monthly EMI, the total interest, the total payable and a year-by-year schedule from the loan amount, rate and tenure — useful for cash-flow planning. Everything runs in your browser.",
    howTo: [
      "Enter the business loan amount.",
      "Enter the annual interest rate and tenure.",
      "See your EMI, total interest and schedule.",
    ],
    faqs: [
      { q: "How do I plan repayments for cash flow?", a: "Use the year-by-year schedule to see how much principal and interest you pay each year, so you can align repayments with expected business cash flow." },
      { q: "What rate should I use?", a: "Enter the rate your lender quotes. Business loan rates vary widely by lender, loan type and risk profile, so the total interest can differ a lot." },
      { q: "Is my data uploaded?", a: "No. The calculation runs in your browser and your figures stay on your device." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "loan-eligibility-calculator",
    name: "Loan Eligibility Calculator",
    h1: "Free Loan Eligibility Calculator",
    title: "Loan Eligibility Calculator – How Much Can I Borrow | UtilityHub",
    description:
      "Estimate how much loan you're eligible for based on your income, existing EMIs and the FOIR lenders apply. See your maximum EMI and eligible loan amount. Free and private.",
    cardDescription: "Eligible loan amount from your income.",
    category: "loans",
    keywords: ["loan eligibility calculator", "how much loan can i get", "foir calculator", "loan eligibility by income", "borrowing capacity"],
    icon: "✅",
    intro:
      "Lenders cap your total EMIs at a percentage of your income — the FOIR (Fixed Obligation to Income Ratio). This calculator estimates your maximum affordable EMI after existing obligations, then works out the loan amount that EMI supports at a given rate and tenure. Use it to gauge how much you could borrow. It runs in your browser.",
    howTo: [
      "Enter your net monthly income and any existing EMIs.",
      "Set the FOIR (typically 40–55%).",
      "Enter the interest rate and tenure.",
      "See your maximum EMI and eligible loan amount.",
    ],
    faqs: [
      { q: "What is FOIR?", a: "FOIR (Fixed Obligation to Income Ratio) is the share of your income a lender allows to go toward all EMIs. If FOIR is 50% and you earn 80,000, your total EMIs can be up to 40,000." },
      { q: "Why do existing EMIs matter?", a: "They count against your FOIR limit, reducing how much new EMI — and therefore new loan — you qualify for. Enter them for a realistic estimate." },
      { q: "Is my data uploaded?", a: "No. The calculation runs in your browser and your income details stay on your device." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "loan-affordability-calculator",
    name: "Loan Affordability Calculator",
    h1: "Free Loan Affordability Calculator",
    title: "Loan Affordability Calculator – What Can I Afford | UtilityHub",
    description:
      "Find how large a loan you can afford from a monthly EMI budget, plus the asset price within reach once you add a down payment. Free, private, in-browser.",
    cardDescription: "Loan & asset price from an EMI budget.",
    category: "loans",
    keywords: ["loan affordability calculator", "how much can i afford", "affordable loan calculator", "emi budget calculator", "home affordability"],
    icon: "🧮",
    intro:
      "Start from what you can comfortably pay each month and work backwards to the loan it supports. Enter your affordable EMI, the interest rate and the tenure to see the maximum loan — and add a down payment to find the total home or car price within reach. Everything runs in your browser.",
    howTo: [
      "Enter the monthly EMI you can afford.",
      "Enter the interest rate and tenure.",
      "Optionally add a down payment.",
      "See the affordable loan and asset price.",
    ],
    faqs: [
      { q: "How does this differ from an eligibility calculator?", a: "Eligibility works from your income and a lender's FOIR limit; affordability works from a monthly payment you choose. Use whichever starting point you prefer." },
      { q: "How does the down payment help?", a: "The affordable asset price is your loan plus your down payment, so a larger down payment lets you buy a costlier home or car for the same EMI." },
      { q: "Is my data uploaded?", a: "No. The calculation runs in your browser and nothing is sent to a server." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "loan-comparison-calculator",
    name: "Loan Comparison Calculator",
    h1: "Free Loan Comparison Calculator",
    title: "Loan Comparison Calculator – Compare EMIs & Interest | UtilityHub",
    description:
      "Compare two or three loans side by side — EMI, total interest and total payment — and see which costs the least overall. Free, private, in-browser.",
    cardDescription: "Compare EMIs & total cost of loans.",
    category: "loans",
    keywords: ["loan comparison calculator", "compare loans", "compare emi", "which loan is cheaper", "loan offer comparison"],
    icon: "⚖️",
    intro:
      "Two loan offers with different rates or tenures can look similar but cost very different amounts overall. This calculator puts up to three loans side by side and compares their EMI, total interest and total payment, highlighting the cheapest and the gap between options. Everything runs in your browser.",
    howTo: [
      "Enter the amount, rate and tenure for each loan.",
      "Add a third loan if you want to compare more.",
      "Read the side-by-side EMI and total-cost table.",
      "See which loan is cheapest overall and by how much.",
    ],
    faqs: [
      { q: "Which figure matters most when comparing loans?", a: "The total payable (or total interest) shows the real lifetime cost, while the EMI shows monthly affordability. This tool displays both so you can weigh them." },
      { q: "Can a lower EMI still cost more?", a: "Yes. A lower EMI often comes from a longer tenure, which usually means more total interest. Comparing total payable reveals the true winner." },
      { q: "Is my data uploaded?", a: "No. The comparison runs in your browser and your figures stay on your device." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "loan-prepayment-calculator",
    name: "Loan Prepayment Calculator",
    h1: "Free Loan Prepayment Calculator",
    title: "Loan Prepayment Calculator – Interest Saved | UtilityHub",
    description:
      "See how a one-time prepayment shortens your loan tenure and cuts total interest, keeping the EMI the same. Enter the loan, prepayment amount and timing. Free and private.",
    cardDescription: "Interest & tenure saved by prepaying.",
    category: "loans",
    keywords: ["loan prepayment calculator", "part payment calculator", "prepayment interest saved", "loan foreclosure calculator", "extra payment calculator"],
    icon: "⏬",
    intro:
      "Making a lump-sum prepayment on a loan can save a surprising amount of interest and shave years off the tenure. This calculator compares your loan with and without a one-time prepayment made after a chosen number of EMIs (keeping the EMI unchanged), and shows the interest saved and months cut. Everything runs in your browser.",
    howTo: [
      "Enter your loan amount, rate and tenure.",
      "Enter the prepayment amount and when you'll make it.",
      "See the interest saved and the reduction in tenure.",
    ],
    faqs: [
      { q: "How does prepayment save interest?", a: "A prepayment reduces the outstanding principal, so less interest accrues thereafter. Keeping the EMI the same, the loan clears sooner — saving all the interest of those removed months." },
      { q: "Is it better to reduce EMI or tenure?", a: "Reducing tenure (as this tool models) usually saves the most interest, because you keep paying the same EMI against a smaller balance. Reducing the EMI instead frees monthly cash but saves less." },
      { q: "Is my data uploaded?", a: "No. The calculation runs in your browser and nothing is sent to a server." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "loan-balance-calculator",
    name: "Loan Balance Calculator",
    h1: "Free Loan Balance Calculator",
    title: "Loan Balance Calculator – Outstanding Loan Amount | UtilityHub",
    description:
      "Find the outstanding balance on your loan after a number of EMIs, plus how much principal and interest you've paid so far. Free, private, in-browser.",
    cardDescription: "Outstanding balance after N EMIs.",
    category: "loans",
    keywords: ["loan balance calculator", "outstanding loan balance", "remaining loan amount", "loan payoff balance", "principal outstanding calculator"],
    icon: "📉",
    intro:
      "Want to know how much you still owe? This calculator computes the outstanding balance on a loan after a given number of EMIs, along with how much principal you've repaid and how much interest you've paid so far. Handy before a prepayment, balance transfer or foreclosure. It runs in your browser.",
    howTo: [
      "Enter the original loan amount, rate and tenure.",
      "Enter how many EMIs you've already paid.",
      "See the outstanding balance and the principal/interest paid.",
    ],
    faqs: [
      { q: "Why is my balance still high after years of EMIs?", a: "Early EMIs are mostly interest, so the principal falls slowly at first and faster later. The principal-vs-balance split above shows this clearly." },
      { q: "Can I use this before a balance transfer?", a: "Yes. The outstanding balance is the amount a new lender would take over, so it's the figure to compare when considering a balance transfer or foreclosure." },
      { q: "Is my data uploaded?", a: "No. The calculation runs in your browser and your figures stay on your device." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "loan-amortization-schedule",
    name: "Loan Amortization Schedule",
    h1: "Free Loan Amortization Schedule",
    title: "Loan Amortization Schedule – Full Repayment Table | UtilityHub",
    description:
      "Generate a full loan amortization schedule showing principal, interest and balance for every month or year. See exactly how each EMI is split. Free, private, in-browser.",
    cardDescription: "Full month & year repayment table.",
    category: "loans",
    keywords: ["loan amortization schedule", "amortization calculator", "amortization table", "emi breakup", "loan repayment schedule"],
    icon: "📋",
    intro:
      "An amortization schedule breaks every EMI into its principal and interest parts and tracks the falling balance over the life of the loan. This tool generates the full table — switch between a yearly summary and the month-by-month detail — from the loan amount, rate and tenure. Everything runs in your browser.",
    howTo: [
      "Enter the loan amount, rate and tenure.",
      "Read the EMI and total interest at the top.",
      "Toggle between the yearly and monthly schedule.",
      "Scroll the table to see principal, interest and balance.",
    ],
    faqs: [
      { q: "What does amortization mean?", a: "Amortization is the process of paying off a loan through regular instalments, where each payment covers the interest due plus a bit of principal, until the balance reaches zero." },
      { q: "Why does the interest portion shrink over time?", a: "Interest is charged on the outstanding balance, which falls with every EMI. So later payments contain less interest and more principal — visible row by row in the schedule." },
      { q: "Is my data uploaded?", a: "No. The schedule is generated in your browser and nothing is sent to a server." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "interest-only-loan-calculator",
    name: "Interest Only Loan Calculator",
    h1: "Free Interest-Only Loan Calculator",
    title: "Interest-Only Loan Calculator – Payments & Cost | UtilityHub",
    description:
      "Calculate payments on an interest-only loan: the lower interest-only payment, the higher EMI once amortization begins, and the total interest cost. Free and private.",
    cardDescription: "Interest-only vs amortizing payments.",
    category: "loans",
    keywords: ["interest only loan calculator", "interest only mortgage", "interest only payment", "interest only emi", "io loan calculator"],
    icon: "🧾",
    intro:
      "With an interest-only loan you pay only the interest for an initial period, so payments start low — but the principal doesn't reduce, and payments jump once amortization begins. This calculator shows the interest-only payment, the higher EMI afterward and the total interest cost, from the amount, rate, interest-only period and total term. It runs in your browser.",
    howTo: [
      "Enter the loan amount and interest rate.",
      "Enter the interest-only period and the total loan term.",
      "See the interest-only payment and the later EMI.",
      "Compare the interest cost of the two phases.",
    ],
    faqs: [
      { q: "Why do payments rise after the interest-only period?", a: "During the interest-only phase the principal stays unchanged. When amortization starts, the full principal must be repaid over the remaining, shorter term — so the EMI is higher." },
      { q: "Is an interest-only loan cheaper?", a: "It lowers early payments but usually costs more interest overall, because the principal isn't reducing during the interest-only period. The totals above show the difference." },
      { q: "Is my data uploaded?", a: "No. The calculation runs in your browser and your figures stay on your device." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "reducing-balance-calculator",
    name: "Reducing Balance Calculator",
    h1: "Free Reducing Balance Interest Calculator",
    title: "Reducing Balance Calculator – Flat vs Reducing Rate | UtilityHub",
    description:
      "Compare a reducing-balance loan with a flat-rate loan at the same quoted rate, and see the effective interest rate a flat loan really costs. Free, private, in-browser.",
    cardDescription: "Flat vs reducing-balance interest.",
    category: "loans",
    keywords: ["reducing balance calculator", "flat vs reducing rate", "reducing balance interest", "effective interest rate", "flat rate to reducing rate"],
    icon: "🔻",
    intro:
      "A flat interest rate sounds cheaper than a reducing-balance rate, but it isn't — flat interest is charged on the whole principal for the entire term, even as you repay it. This calculator compares the EMI and total interest of a reducing-balance loan versus a flat-rate loan at the same quoted rate, and reveals the effective rate a flat loan truly costs. It runs in your browser.",
    howTo: [
      "Enter the loan amount, quoted rate and tenure.",
      "See the reducing-balance EMI and total interest.",
      "Compare it with the flat-rate EMI and interest.",
      "Read the effective rate a flat loan really costs.",
    ],
    faqs: [
      { q: "What's the difference between flat and reducing rate?", a: "Flat interest is calculated on the original principal for the whole tenure; reducing-balance interest is charged only on the outstanding balance, which falls with each EMI. For the same quoted rate, flat costs much more." },
      { q: "Why is the effective rate higher than the flat rate?", a: "Because a flat rate keeps charging interest on money you've already repaid. The effective reducing rate — the rate that produces the same EMI on a reducing-balance basis — is typically 1.7–1.9× the flat rate." },
      { q: "Is my data uploaded?", a: "No. The calculation runs in your browser and nothing is sent to a server." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },

  // ===================== CREDIT CARDS =====================
  {
    slug: "credit-card-emi-calculator",
    name: "Credit Card EMI Calculator",
    h1: "Free Credit Card EMI Calculator",
    title: "Credit Card EMI Calculator – EMI, Fees & GST | UtilityHub",
    description:
      "Convert a credit-card purchase into EMIs and see the monthly instalment, interest, processing fee and GST on interest, plus the true total cost. Free, private, in-browser.",
    cardDescription: "Card purchase → EMI, fees & total cost.",
    category: "credit-cards",
    keywords: ["credit card emi calculator", "card emi calculator", "convert to emi", "no cost emi calculator", "credit card instalment"],
    icon: "💳",
    intro:
      "Converting a big purchase to EMIs on your credit card spreads the cost, but the interest, a processing fee and GST on the interest add up. This calculator shows the monthly EMI plus every extra charge and the true total cost, so you can see what the convenience really costs. It's currency-agnostic and runs in your browser.",
    howTo: [
      "Enter the purchase amount and the interest rate.",
      "Enter the tenure in months.",
      "Add the processing fee and GST rate if any.",
      "See the EMI and the full cost breakdown.",
    ],
    faqs: [
      { q: "Is credit-card EMI the same as 'no-cost EMI'?", a: "Not always. So-called no-cost EMI often bakes the interest into the price or waives it via a discount, but a processing fee and GST on interest can still apply. Enter the real rate and fees to see the true cost." },
      { q: "Why is GST charged on the interest?", a: "In some regions GST (commonly 18%) applies to the interest portion of a card EMI, adding to the cost. This tool includes it so your total is realistic." },
      { q: "Is my data uploaded?", a: "No. The calculation runs in your browser and nothing is sent to a server." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "credit-card-payoff-calculator",
    name: "Credit Card Payoff Calculator",
    h1: "Free Credit Card Payoff Calculator",
    title: "Credit Card Payoff Calculator – Time & Interest | UtilityHub",
    description:
      "See how long it takes to clear a credit-card balance with a fixed monthly payment, and the total interest you'll pay. Warns if your payment is too low. Free and private.",
    cardDescription: "Payoff time & interest for a fixed payment.",
    category: "credit-cards",
    keywords: ["credit card payoff calculator", "pay off credit card", "credit card debt calculator", "payoff time calculator", "card debt payoff"],
    icon: "🎯",
    intro:
      "If you pay a fixed amount toward your credit card each month, how long until it's gone — and how much interest will it cost? This calculator simulates the payoff month by month at your card's APR, and warns you if the payment is too small to ever clear the balance. It runs entirely in your browser.",
    howTo: [
      "Enter your current card balance and APR.",
      "Enter the fixed monthly payment you'll make.",
      "See the months to pay off and total interest.",
    ],
    faqs: [
      { q: "Why does a small payment never clear the balance?", a: "If your monthly payment is less than the interest charged that month, the balance grows instead of shrinking. The tool flags this so you know to pay more." },
      { q: "How can I pay off my card faster?", a: "Increase the monthly payment. Because interest compounds on the balance, even a modest increase can cut the payoff time and total interest sharply — try different amounts." },
      { q: "Is my data uploaded?", a: "No. The calculation runs in your browser and your figures stay on your device." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "minimum-payment-calculator",
    name: "Minimum Payment Calculator",
    h1: "Free Credit Card Minimum Payment Calculator",
    title: "Minimum Payment Calculator – The Minimum-Payment Trap | UtilityHub",
    description:
      "See how long it takes to clear a credit-card balance paying only the minimum due, and how much interest that costs. Reveals the minimum-payment trap. Free and private.",
    cardDescription: "Cost of paying only the minimum due.",
    category: "credit-cards",
    keywords: ["minimum payment calculator", "credit card minimum payment", "minimum due calculator", "minimum payment trap", "credit card minimum"],
    icon: "⚠️",
    intro:
      "Paying only the minimum due on a credit card — usually a small percentage of the balance with a fixed floor — keeps you in debt for years and multiplies the interest, because the minimum shrinks as the balance falls. This calculator shows exactly how long the payoff drags on and what it costs, so you can see the trap. It runs in your browser.",
    howTo: [
      "Enter your balance and APR.",
      "Enter the minimum-due percentage and the floor amount.",
      "See the payoff time and total interest paid.",
    ],
    faqs: [
      { q: "What is the minimum-payment trap?", a: "Because the minimum is a percentage of a falling balance, it drops every month, so more of each payment goes to interest and the balance barely reduces — stretching repayment for years." },
      { q: "How is the minimum payment calculated?", a: "Typically it's the greater of a percentage of the balance (often 5%) and a fixed floor amount. This tool uses both and recomputes the minimum each month." },
      { q: "Is my data uploaded?", a: "No. The calculation runs in your browser and nothing is sent to a server." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "interest-cost-calculator",
    name: "Interest Cost Calculator",
    h1: "Free Credit Card Interest Cost Calculator",
    title: "Interest Cost Calculator – Cost of Carrying a Balance | UtilityHub",
    description:
      "See the daily, monthly and yearly interest cost of carrying a credit-card balance, plus the total interest if carried for several months. Free, private, in-browser.",
    cardDescription: "Daily, monthly & yearly interest cost.",
    category: "credit-cards",
    keywords: ["interest cost calculator", "credit card interest calculator", "daily interest credit card", "cost of carrying balance", "card interest per day"],
    icon: "🧾",
    intro:
      "Ever wondered what a credit-card balance costs you just to carry? This calculator breaks the interest down by day, month and year at your card's APR, and shows the total that piles up if you carry the balance for several months without paying it down. A quick reality check on revolving debt — it runs in your browser.",
    howTo: [
      "Enter the balance you're carrying and the APR.",
      "Optionally enter how many months you'll carry it.",
      "See the daily, monthly and yearly interest cost.",
    ],
    faqs: [
      { q: "How is daily interest calculated?", a: "Daily interest is the balance times the APR divided by 365. Cards typically accrue interest daily on the average balance, so even a few days of carrying a balance has a cost." },
      { q: "Does carrying a balance compound?", a: "Yes. Unpaid interest is added to the balance, so it compounds. The multi-month figure here compounds monthly to show the true cost of carrying the debt." },
      { q: "Is my data uploaded?", a: "No. The calculation runs in your browser and your figures stay on your device." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "balance-transfer-calculator",
    name: "Balance Transfer Calculator",
    h1: "Free Credit Card Balance Transfer Calculator",
    title: "Balance Transfer Calculator – Savings vs Staying | UtilityHub",
    description:
      "Compare keeping a credit-card balance versus transferring it to a card with a promo APR and a transfer fee. See the net savings and payoff time. Free, private, in-browser.",
    cardDescription: "Balance transfer savings vs staying put.",
    category: "credit-cards",
    keywords: ["balance transfer calculator", "credit card balance transfer", "balance transfer savings", "0 apr transfer", "transfer fee calculator"],
    icon: "🔄",
    intro:
      "A balance transfer moves debt to a card with a low promotional APR, but a transfer fee and the post-promo rate can eat into the savings. This calculator compares staying on your current card with transferring — including the fee and the rate after the promo period — and shows the net saving (or extra cost) and payoff time for each. It runs in your browser.",
    howTo: [
      "Enter your balance, current APR and monthly payment.",
      "Enter the transfer fee, promo APR and promo period.",
      "Enter the post-promo APR of the new card.",
      "See the net savings and each scenario's payoff time.",
    ],
    faqs: [
      { q: "Is a balance transfer always worth it?", a: "Not always. The transfer fee and the rate after the promo period can offset the low promo APR, especially if you can't clear most of the balance during the promo. This tool shows the net effect." },
      { q: "What matters most for balance-transfer savings?", a: "Clearing as much as possible during the low-APR promo period, and keeping the transfer fee small. Raise the monthly payment to see how much more you save." },
      { q: "Is my data uploaded?", a: "No. The comparison runs in your browser and nothing is sent to a server." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },

  // ===================== SAVINGS =====================
  {
    slug: "savings-goal-calculator",
    name: "Savings Goal Calculator",
    h1: "Free Savings Goal Calculator",
    title: "Savings Goal Calculator – Monthly Saving Needed | UtilityHub",
    description:
      "Find how much to save each month to reach a savings goal by a target date, factoring in current savings and an optional return. Free, private, in-browser.",
    cardDescription: "Monthly saving to hit a target by a date.",
    category: "savings",
    keywords: ["savings goal calculator", "savings calculator", "how much to save monthly", "goal savings planner", "monthly savings calculator"],
    icon: "🎯",
    intro:
      "Set a savings target and a deadline, and this calculator works out how much you need to put away each month to get there — taking any current savings and an optional interest or return into account. Set the return to zero for a plain savings goal, or add a rate if the money is invested. It runs in your browser.",
    howTo: [
      "Enter your savings goal and the time you have.",
      "Add any current savings.",
      "Enter an expected return (or 0 for plain saving).",
      "See the monthly amount you need to save.",
    ],
    faqs: [
      { q: "What return should I use?", a: "Use 0% for money in a plain savings account you don't expect to grow, or the expected return if it's invested. A higher return lowers the monthly amount you need to save." },
      { q: "Does it use my current savings?", a: "Yes. It grows your existing savings over the period and works out the monthly saving needed to cover only the remaining gap." },
      { q: "Is my data uploaded?", a: "No. The calculation runs in your browser and nothing is sent to a server." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "emergency-fund-calculator",
    name: "Emergency Fund Calculator",
    h1: "Free Emergency Fund Calculator",
    title: "Emergency Fund Calculator – How Much to Save | UtilityHub",
    description:
      "Work out how big your emergency fund should be from your monthly expenses and months of cover, and how long it'll take to build it. Free, private, in-browser.",
    cardDescription: "Emergency fund target & time to build it.",
    category: "savings",
    keywords: ["emergency fund calculator", "emergency fund", "rainy day fund", "how much emergency fund", "3 to 6 months expenses"],
    icon: "🛟",
    intro:
      "An emergency fund covers unexpected costs — job loss, medical bills, urgent repairs — without going into debt. A common rule is 3 to 12 months of essential expenses. This calculator sizes your target from your monthly expenses and desired cover, then shows the gap versus what you have and how long your monthly contributions will take to fill it. It runs in your browser.",
    howTo: [
      "Enter your monthly essential expenses.",
      "Choose how many months of cover you want.",
      "Enter your current savings and monthly contribution.",
      "See your target and the time to reach it.",
    ],
    faqs: [
      { q: "How many months should an emergency fund cover?", a: "Three to six months of essential expenses is a common guideline; those with variable income or dependents often aim for more. Set the months of cover to match your situation." },
      { q: "Where should I keep an emergency fund?", a: "Somewhere safe and instantly accessible — a savings account or liquid fund — not tied up in volatile investments. That's why this tool assumes little or no return." },
      { q: "Is my data uploaded?", a: "No. The calculation runs in your browser and your figures stay on your device." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "city-emergency-fund-calculator",
    name: "City Emergency Fund Calculator",
    h1: "Emergency Fund Calculator by City",
    title: "Emergency Fund Calculator by City & Cost of Living | UtilityHub",
    description:
      "Work out how big your emergency fund should be based on where you live. Search any city in the world, and the calculator estimates local monthly essentials in your currency, then sizes 3–12 months of cover.",
    cardDescription: "Emergency fund sized to any city's cost of living.",
    category: "savings",
    keywords: [
      "emergency fund calculator by city",
      "cost of living emergency fund",
      "emergency fund calculator international",
      "how much emergency fund",
      "emergency savings by city",
    ],
    icon: "🌍",
    intro:
      "How much emergency fund you need depends on what life costs where you live — rent, food, transport and bills differ hugely between cities. Search for any city in the world (or detect it from your location) and this calculator estimates the essential monthly cost of living there, scales it to your household size, and sizes a 3–12 month emergency fund. Amounts are shown in your local currency using live exchange rates, and every figure is editable so you can match your own budget.",
    howTo: [
      "Search for your city, tap a popular one, or use your location.",
      "Choose your household size and how many months of cover you want.",
      "The tool estimates your monthly essentials — adjust it if needed.",
      "Add current savings and a monthly contribution to see your gap and timeline.",
    ],
    faqs: [
      { q: "Which cities are covered?", a: "You can search for essentially any city on Earth. Major cities use a hand-curated cost-of-living estimate; smaller places are estimated from their country's typical costs adjusted for city size. In every case the monthly figure is editable, so you can fine-tune it to your actual budget." },
      { q: "How is the cost of living estimated?", a: "It reflects essential monthly living costs (housing, food, utilities and local transport) for one person, scaled to your household size and converted to your currency at live exchange rates. These are approximations, not live local prices — edit the monthly expenses for a precise result." },
      { q: "Does it work outside the US or India?", a: "Yes. It works worldwide and shows amounts in any world currency. Selecting a city automatically switches to that country's currency, and you can override the currency at any time." },
      { q: "How does 'Use my location' work?", a: "With your permission, your browser shares your approximate coordinates, which a free public geocoding service turns into a city name to pre-select your city. Your location is used only for that lookup and is never stored." },
      { q: "How many months of expenses should I save?", a: "Three to six months of essentials is a common guideline; people with variable income, dependents or a single earner often aim for six to twelve. Set the months of cover to match how stable your income is." },
    ],
    privacyNote:
      "Your figures stay in your browser. To show local currency we request public exchange-rate data, and 'Use my location' sends your coordinates to a public geocoding service only to look up your city — neither receives your financial inputs.",
    available: true,
  },
  {
    slug: "retirement-corpus-calculator",
    name: "Retirement Corpus Calculator",
    h1: "Free Retirement Corpus Calculator",
    title: "Retirement Corpus Calculator – How Much to Retire | UtilityHub",
    description:
      "Estimate the retirement corpus you need, adjusting today's expenses for inflation and funding an inflation-protected income through retirement — plus the monthly investment to build it. Free and private.",
    cardDescription: "Corpus needed & monthly investment to retire.",
    category: "savings",
    keywords: ["retirement corpus calculator", "retirement calculator", "how much to retire", "retirement planning calculator", "retirement savings needed"],
    icon: "🏖️",
    intro:
      "How much do you need to retire comfortably? This calculator inflates your current expenses to your retirement age, sizes the corpus that funds an inflation-protected income for your years in retirement, and works out the monthly investment needed to build it — accounting for returns before and during retirement. All figures are estimates based on your assumptions.",
    howTo: [
      "Enter your current age, retirement age and monthly expenses.",
      "Set inflation, years in retirement and expected returns.",
      "Add any current retirement savings.",
      "See the corpus needed and the monthly investment required.",
    ],
    faqs: [
      { q: "How is the retirement corpus calculated?", a: "We inflate today's expenses to your retirement age, then compute the lump sum that can fund those (still-rising) expenses through retirement using the return net of inflation — the real rate — over your retirement years." },
      { q: "Why separate pre- and post-retirement returns?", a: "Before retirement you can usually invest more aggressively; after retirement, portfolios are typically more conservative. Using two rates makes the estimate more realistic." },
      { q: "Is my data uploaded?", a: "No. The calculation runs in your browser and nothing is sent to a server." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "fire-calculator",
    name: "FIRE Calculator",
    h1: "Free FIRE Calculator",
    title: "FIRE Calculator – Financial Independence, Retire Early | UtilityHub",
    description:
      "Calculate your FIRE number (25× annual expenses) and how many years to reach it from your current investments, monthly contributions and expected return. Free and private.",
    cardDescription: "Your FIRE number & years to reach it.",
    category: "savings",
    keywords: ["fire calculator", "financial independence retire early", "fire number calculator", "25x expenses", "early retirement calculator"],
    icon: "🔥",
    intro:
      "FIRE — Financial Independence, Retire Early — is built on the idea that once your investments reach about 25× your annual expenses (a 4% safe withdrawal rate), they can fund your lifestyle indefinitely. This calculator finds your FIRE number and projects how many years of investing it takes to get there, with a progress bar. Figures are estimates based on your assumptions.",
    howTo: [
      "Enter your annual expenses and safe withdrawal rate.",
      "Enter your current investments and monthly contribution.",
      "Enter your expected annual return.",
      "See your FIRE number, progress and years to reach it.",
    ],
    faqs: [
      { q: "What is the 4% rule?", a: "It's the idea that you can withdraw about 4% of your portfolio in the first year of retirement (adjusting for inflation after) with a low risk of running out — implying a target of 25× annual expenses." },
      { q: "Is FIRE realistic?", a: "It depends on your savings rate, returns and expenses, and returns aren't guaranteed. Treat the result as a planning estimate and revisit it as your circumstances change." },
      { q: "Is my data uploaded?", a: "No. The calculation runs in your browser and your figures stay on your device." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "coast-fire-calculator",
    name: "Coast FIRE Calculator",
    h1: "Free Coast FIRE Calculator",
    title: "Coast FIRE Calculator – Coast to Retirement | UtilityHub",
    description:
      "Find your Coast FIRE number — the amount invested today that grows to your full FIRE goal by retirement with no further contributions. See if you're already coasting. Free and private.",
    cardDescription: "Amount today that coasts to FIRE.",
    category: "savings",
    keywords: ["coast fire calculator", "coast fire", "coastfire number", "coast to retirement", "barista coast fire"],
    icon: "🏄",
    intro:
      "Coast FIRE is the point where you've invested enough that, even if you never contribute another rupee, compound growth alone will carry your portfolio to your full FIRE number by retirement. This calculator finds your Coast FIRE number today, shows whether you've reached it, and — if not — what monthly investment gets you there. Figures are estimates based on your assumptions.",
    howTo: [
      "Enter your current age, retirement age and annual expenses.",
      "Enter your safe withdrawal rate and expected return.",
      "Enter your current investments.",
      "See your Coast FIRE number and whether you're coasting.",
    ],
    faqs: [
      { q: "What does reaching Coast FIRE mean?", a: "It means your invested amount will grow to your full FIRE target by retirement without any new contributions — so you only need to earn enough to cover current expenses, and can stop saving for retirement." },
      { q: "How is the Coast FIRE number calculated?", a: "We take your FIRE number (annual expenses ÷ withdrawal rate) and discount it back to today at your expected return over the years to retirement." },
      { q: "Is my data uploaded?", a: "No. The calculation runs in your browser and nothing is sent to a server." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "lean-fire-calculator",
    name: "Lean FIRE Calculator",
    h1: "Free Lean FIRE Calculator",
    title: "Lean FIRE Calculator – FIRE on a Frugal Budget | UtilityHub",
    description:
      "Calculate your Lean FIRE number for a frugal, minimal-expense lifestyle, and the years to reach it from your investments and monthly contributions. Free, private, in-browser.",
    cardDescription: "FIRE number for a frugal lifestyle.",
    category: "savings",
    keywords: ["lean fire calculator", "lean fire", "lean fire number", "frugal fire", "minimalist retirement"],
    icon: "🍃",
    intro:
      "Lean FIRE aims for financial independence on a deliberately frugal budget — a smaller corpus than standard FIRE, reachable sooner, in exchange for a tighter lifestyle. This calculator finds your Lean FIRE number from your minimal annual expenses and projects the years to reach it. Figures are estimates based on your assumptions.",
    howTo: [
      "Enter your lean (minimal) annual expenses.",
      "Enter your safe withdrawal rate.",
      "Enter your current investments, monthly contribution and return.",
      "See your Lean FIRE number, progress and years to reach it.",
    ],
    faqs: [
      { q: "How is Lean FIRE different from regular FIRE?", a: "It's the same maths (25× expenses at a 4% withdrawal rate) but applied to a lean, minimal budget, so the target corpus is smaller and reached earlier — at the cost of a more frugal lifestyle." },
      { q: "What if my expenses rise later?", a: "A lean budget leaves less cushion, so if expenses grow you may need more. Revisit the calculator with updated expenses, or compare against the regular FIRE number." },
      { q: "Is my data uploaded?", a: "No. The calculation runs in your browser and your figures stay on your device." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "barista-fire-calculator",
    name: "Barista FIRE Calculator",
    h1: "Free Barista FIRE Calculator",
    title: "Barista FIRE Calculator – Part-Time Income FIRE | UtilityHub",
    description:
      "Calculate your Barista FIRE number when part-time income covers some of your expenses, so your portfolio needs to fund only the rest. See the years to reach it. Free and private.",
    cardDescription: "FIRE number with part-time income.",
    category: "savings",
    keywords: ["barista fire calculator", "barista fire", "barista fire number", "part time fire", "semi retirement calculator"],
    icon: "☕",
    intro:
      "Barista FIRE is a halfway point: you keep some part-time income that covers a chunk of your expenses, so your investment portfolio only needs to fund the remainder — a smaller corpus than full FIRE. This calculator sizes your Barista FIRE number from your expenses and part-time income and projects the years to reach it. Figures are estimates based on your assumptions.",
    howTo: [
      "Enter your annual expenses and expected part-time income.",
      "Enter your safe withdrawal rate.",
      "Enter your current investments, monthly contribution and return.",
      "See your Barista FIRE number and years to reach it.",
    ],
    faqs: [
      { q: "How is Barista FIRE calculated?", a: "Your portfolio only needs to cover expenses your part-time income doesn't, so the target is (annual expenses − part-time income) ÷ withdrawal rate — smaller than full FIRE." },
      { q: "Why choose Barista FIRE?", a: "It lets you downshift to lighter or more enjoyable work sooner, often keeping benefits like health cover, without needing the full FIRE corpus. The tool shows how much less you need." },
      { q: "Is my data uploaded?", a: "No. The calculation runs in your browser and nothing is sent to a server." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "financial-independence-calculator",
    name: "Financial Independence Calculator",
    h1: "Free Financial Independence Calculator",
    title: "Financial Independence Calculator – FI Number & Progress | UtilityHub",
    description:
      "Calculate your financial independence number, track your progress, and project how many years to reach it from your net worth, contributions and return. Free and private.",
    cardDescription: "Your FI number, progress & years to reach.",
    category: "savings",
    keywords: ["financial independence calculator", "fi number calculator", "financial freedom calculator", "fi progress", "how much for financial independence"],
    icon: "🕊️",
    intro:
      "You're financially independent when your investments can cover your living expenses indefinitely at a safe withdrawal rate. This calculator finds your FI number, shows how far along you are with a progress bar, and projects the years to reach it from your current net worth, monthly contributions and expected return. Figures are estimates based on your assumptions.",
    howTo: [
      "Enter your annual living expenses and safe withdrawal rate.",
      "Enter your current net worth (investments).",
      "Enter your monthly investment and expected return.",
      "See your FI number, progress and years to reach it.",
    ],
    faqs: [
      { q: "How is the FI number calculated?", a: "It's your annual expenses divided by your safe withdrawal rate — for example, at 4% that's 25× annual expenses. Reaching it means your portfolio can sustainably cover your spending." },
      { q: "Does financial independence mean I must retire?", a: "No. FI simply means work becomes optional — you can keep working, switch fields, or retire. The number is about freedom of choice, not a mandate to stop." },
      { q: "Is my data uploaded?", a: "No. The calculation runs in your browser and your figures stay on your device." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "college-savings-calculator",
    name: "College Savings Calculator",
    h1: "Free College Savings Calculator",
    title: "College Savings Calculator – Education Fund Planner | UtilityHub",
    description:
      "Project the future cost of a college education after inflation and find the monthly saving needed to fund it, factoring current savings and expected return. Free and private.",
    cardDescription: "Future college cost & monthly saving.",
    category: "savings",
    keywords: ["college savings calculator", "education fund calculator", "college cost calculator", "child education planner", "education savings"],
    icon: "🎓",
    intro:
      "Education costs rise steeply, so it pays to plan early. This calculator inflates today's course fees to when college starts, sums the cost across the full course, and works out the monthly saving needed to fund it — accounting for any current savings and your expected return. Figures are estimates based on your assumptions.",
    howTo: [
      "Enter the current annual cost and years until college.",
      "Enter the course length and education inflation.",
      "Enter your expected return and current savings.",
      "See the future cost and monthly saving needed.",
    ],
    faqs: [
      { q: "Why is education inflation separate?", a: "Education costs often rise faster than general inflation, so the tool uses a dedicated education-inflation rate to project the future fees more realistically." },
      { q: "How is the total cost worked out?", a: "Each year of the course is inflated to the year it falls due, then summed, so multi-year courses reflect rising fees over the study period." },
      { q: "Is my data uploaded?", a: "No. The calculation runs in your browser and nothing is sent to a server." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "vacation-savings-calculator",
    name: "Vacation Savings Calculator",
    h1: "Free Vacation Savings Calculator",
    title: "Vacation Savings Calculator – Save for a Trip | UtilityHub",
    description:
      "Find how much to save each month, week or day to fund a trip by your travel date, factoring in what you've already saved. Free, private, in-browser.",
    cardDescription: "Save per month/week/day for a trip.",
    category: "savings",
    keywords: ["vacation savings calculator", "travel savings calculator", "save for vacation", "trip savings planner", "holiday fund calculator"],
    icon: "✈️",
    intro:
      "Dreaming of a trip? This calculator turns your goal into a simple savings plan: enter the cost and your travel date and see how much to set aside each month, week or day — minus anything you've already saved. Add a small return if the money sits in a savings account. It runs in your browser.",
    howTo: [
      "Enter the trip cost and months until you travel.",
      "Add anything you've already saved.",
      "Optionally add a savings return.",
      "See how much to save per month, week and day.",
    ],
    faqs: [
      { q: "How much should I save for a vacation?", a: "Enter the total cost and your timeline, and the tool splits it into a monthly, weekly and daily amount so you can pick a rhythm that fits your budget." },
      { q: "Should I include a return?", a: "For a short-term goal in a savings account you can add a small return, or leave it at zero. Over a few months it makes little difference." },
      { q: "Is my data uploaded?", a: "No. The calculation runs in your browser and your figures stay on your device." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  // ----------------------------- DEVELOPER -----------------------------
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    h1: "Free JSON Formatter",
    title: "JSON Formatter & Beautifier – Free Online Dev Tool | UtilityHub",
    description: "Format, beautify and minify JSON online. Pretty-print with 2/4-space or tab indentation, or minify to one line. Fast, private, in-browser.",
    cardDescription: "Beautify or minify JSON with one click.",
    category: "developer-tools",
    keywords: ["json formatter", "json beautifier", "pretty print json", "minify json", "format json"],
    icon: "🧩",
    intro: "Paste JSON to instantly pretty-print it with your choice of indentation, or minify it to a single line. Invalid JSON is flagged with the exact error. Everything runs in your browser — your data is never uploaded.",
    howTo: ["Paste your JSON into the input.", "Choose an indent size or Minify.", "Copy or download the formatted result."],
    faqs: [
      { q: "Does it validate JSON too?", a: "Yes — if the JSON can't be parsed you'll see the parser's error message instead of formatted output." },
      { q: "Is my JSON uploaded?", a: "No. Formatting happens entirely in your browser with the native JSON engine." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "json-validator",
    name: "JSON Validator",
    h1: "Free JSON Validator",
    title: "JSON Validator – Check JSON Syntax Online | UtilityHub",
    description: "Validate JSON online and pinpoint syntax errors with line and column numbers. Free, private, runs entirely in your browser.",
    cardDescription: "Check JSON validity with error location.",
    category: "developer-tools",
    keywords: ["json validator", "validate json", "json syntax checker", "json lint", "is my json valid"],
    icon: "✅",
    intro: "Check whether a string is valid JSON and, if not, see exactly what went wrong and where. Valid JSON reports its top-level type and size. All checking happens locally in your browser.",
    howTo: ["Paste JSON into the box.", "See the instant valid/invalid verdict.", "For errors, jump to the reported line and column."],
    faqs: [
      { q: "What does it tell me on an error?", a: "The parser's message plus the approximate line and column where parsing failed." },
      { q: "Is my data private?", a: "Yes. Validation runs in your browser and nothing is sent to a server." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "yaml-formatter",
    name: "YAML Formatter",
    h1: "Free YAML Formatter & Converter",
    title: "YAML Formatter & YAML ↔ JSON Converter – Free | UtilityHub",
    description: "Tidy YAML, or convert between YAML and JSON online. Free, private and processed entirely in your browser.",
    cardDescription: "Tidy YAML or convert YAML ↔ JSON.",
    category: "developer-tools",
    keywords: ["yaml formatter", "yaml to json", "json to yaml", "yaml validator", "format yaml"],
    icon: "📝",
    intro: "Clean up messy YAML with consistent indentation, or convert it to and from JSON. Parsing errors are reported clearly. Everything happens in your browser — no uploads.",
    howTo: ["Paste YAML (or JSON).", "Pick Tidy, YAML → JSON, or JSON → YAML.", "Copy or download the result."],
    faqs: [
      { q: "Which YAML version is supported?", a: "YAML 1.2 via the js-yaml parser, covering the vast majority of real-world files." },
      { q: "Is my file uploaded?", a: "No — conversion runs locally in your browser." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "xml-formatter",
    name: "XML Formatter",
    h1: "Free XML Formatter",
    title: "XML Formatter & Beautifier – Free Online Tool | UtilityHub",
    description: "Beautify or minify XML online with proper indentation. Malformed XML is flagged. Free, private, in-browser.",
    cardDescription: "Beautify or minify XML documents.",
    category: "developer-tools",
    keywords: ["xml formatter", "xml beautifier", "pretty print xml", "minify xml", "format xml"],
    icon: "📃",
    intro: "Pretty-print XML with your chosen indentation, or minify it to a single line. The browser's XML parser checks for well-formedness first. Processed entirely on your device.",
    howTo: ["Paste your XML.", "Choose an indent size or Minify.", "Copy or download the output."],
    faqs: [
      { q: "Does it check my XML is valid?", a: "It checks the XML is well-formed and reports parser errors, but doesn't validate against a schema/DTD." },
      { q: "Is my XML private?", a: "Yes. Everything runs in your browser." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "csv-viewer",
    name: "CSV Viewer",
    h1: "Free CSV Viewer",
    title: "CSV Viewer – View & Explore CSV Files Online | UtilityHub",
    description: "View CSV and TSV data as a clean table in your browser. Auto-detects the delimiter and handles quoted fields. Free and private.",
    cardDescription: "Turn CSV/TSV text into a readable table.",
    category: "developer-tools",
    keywords: ["csv viewer", "view csv online", "csv to table", "tsv viewer", "open csv"],
    icon: "📊",
    intro: "Paste CSV or drop a file to see it rendered as a sortable, scrollable table. The delimiter is detected automatically and quoted fields are parsed correctly. Your data never leaves your browser.",
    howTo: ["Paste CSV text or drop a .csv/.tsv file.", "Adjust the delimiter or header toggle if needed.", "Read your data in the table view."],
    faqs: [
      { q: "Which delimiters are supported?", a: "Comma, semicolon, tab and pipe — detected automatically, or choose one manually." },
      { q: "Is my file uploaded?", a: "No. The file is read and parsed locally in your browser." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "sql-formatter",
    name: "SQL Formatter",
    h1: "Free SQL Formatter",
    title: "SQL Formatter & Beautifier – Free Online Tool | UtilityHub",
    description: "Format and beautify SQL queries online for PostgreSQL, MySQL, SQLite and more. Free, private, in-browser.",
    cardDescription: "Beautify SQL for any major dialect.",
    category: "developer-tools",
    keywords: ["sql formatter", "sql beautifier", "format sql", "pretty print sql", "sql prettifier"],
    icon: "🗄️",
    intro: "Turn a cramped one-line query into clean, readable SQL. Choose your dialect and whether to uppercase keywords. Everything runs in your browser — queries are never uploaded.",
    howTo: ["Paste a SQL query.", "Pick the dialect (PostgreSQL, MySQL, SQLite…).", "Copy the formatted SQL."],
    faqs: [
      { q: "Which dialects are supported?", a: "Standard SQL plus PostgreSQL, MySQL, MariaDB, SQLite and BigQuery." },
      { q: "Is my query private?", a: "Yes. Formatting runs locally with the sql-formatter library — nothing is sent anywhere." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "regex-tester",
    name: "Regex Tester",
    h1: "Free Regex Tester",
    title: "Regex Tester & Debugger – Free Online Tool | UtilityHub",
    description: "Test and debug regular expressions online with live match highlighting, flags and capture groups. Free, private, in-browser.",
    cardDescription: "Test regex with live match highlighting.",
    category: "developer-tools",
    keywords: ["regex tester", "regular expression tester", "regex debugger", "test regex online", "regex match"],
    icon: "🔍",
    intro: "Write a JavaScript regular expression and see matches highlighted in your test text in real time, with capture groups broken out. Toggle flags like global, ignore-case and multiline. All local to your browser.",
    howTo: ["Enter a pattern and toggle any flags.", "Type or paste your test string.", "See highlighted matches and capture groups."],
    faqs: [
      { q: "Which regex flavor is this?", a: "JavaScript (ECMAScript) regular expressions, the same engine your browser uses." },
      { q: "Is my text uploaded?", a: "No. Matching runs entirely in your browser." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "uuid-generator",
    name: "UUID Generator",
    h1: "Free UUID Generator",
    title: "UUID Generator – Generate v4 UUIDs Online | UtilityHub",
    description: "Generate random version-4 UUIDs in bulk. Choose case, hyphens and braces, and copy them instantly. Free, private, in-browser.",
    cardDescription: "Bulk-generate random v4 UUIDs.",
    category: "developer-tools",
    keywords: ["uuid generator", "guid generator", "generate uuid", "random uuid", "uuid v4"],
    icon: "🆔",
    intro: "Generate cryptographically-random version-4 UUIDs, one or a thousand at a time, using your browser's crypto API. Format them with or without hyphens, braces and uppercase. Nothing is sent to a server.",
    howTo: ["Choose how many to generate.", "Set case, hyphen and brace options.", "Copy one or copy them all."],
    faqs: [
      { q: "What version of UUID is generated?", a: "Version 4 (random), the most common general-purpose UUID." },
      { q: "Are these safe to use as identifiers?", a: "Yes. They use your browser's cryptographically secure random source." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "guid-validator",
    name: "GUID Validator",
    h1: "Free GUID / UUID Validator",
    title: "GUID / UUID Validator – Check UUID Format | UtilityHub",
    description: "Validate a GUID/UUID and detect its version and variant. Accepts hyphenated, plain and brace-wrapped forms. Free and private.",
    cardDescription: "Validate a UUID and detect its version.",
    category: "developer-tools",
    keywords: ["guid validator", "uuid validator", "validate guid", "check uuid", "uuid version"],
    icon: "🧷",
    intro: "Check whether a value is a well-formed GUID/UUID and, if so, read off its version and variant. Hyphenated, unhyphenated and brace-wrapped forms are all accepted. Runs entirely in your browser.",
    howTo: ["Paste a GUID/UUID.", "See the valid/invalid verdict instantly.", "Read the detected version and variant."],
    faqs: [
      { q: "What forms are accepted?", a: "Canonical hyphenated, 32-hex without hyphens, and values wrapped in { } or ( )." },
      { q: "Is my data private?", a: "Yes — validation is done locally in your browser." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "hash-generator",
    name: "Hash Generator",
    h1: "Free Hash Generator",
    title: "Hash Generator – MD5, SHA-1, SHA-256, SHA-512 | UtilityHub",
    description: "Generate MD5, SHA-1, SHA-256 and SHA-512 hashes from text or a file, all at once. Free, private, in-browser.",
    cardDescription: "MD5, SHA-1, SHA-256 & SHA-512 at once.",
    category: "developer-tools",
    keywords: ["hash generator", "md5 sha256 generator", "checksum tool", "file hash", "generate hash"],
    icon: "#️⃣",
    intro: "Compute MD5, SHA-1, SHA-256 and SHA-512 digests from text or a file, side by side. SHA hashes use the Web Crypto API; MD5 is computed locally too. Your input is never uploaded.",
    howTo: ["Choose Text or File mode.", "Type text or drop a file.", "Copy any of the resulting hashes."],
    faqs: [
      { q: "Can I hash a whole file?", a: "Yes — switch to File mode and drop any file to get its checksums." },
      { q: "Is my data uploaded?", a: "No. Hashing happens entirely in your browser." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "md5-hash-generator",
    name: "MD5 Hash Generator",
    h1: "Free MD5 Hash Generator",
    title: "MD5 Hash Generator – Free Online Tool | UtilityHub",
    description: "Generate an MD5 hash from text or a file in your browser. Fast, free and private — nothing is uploaded.",
    cardDescription: "Compute an MD5 checksum from text or a file.",
    category: "developer-tools",
    keywords: ["md5 hash generator", "md5 online", "md5 checksum", "generate md5", "md5 from file"],
    icon: "🔑",
    intro: "Produce an MD5 digest of any text or file. MD5 is handy for checksums and cache keys (though not for security). Everything is computed locally in your browser.",
    howTo: ["Choose Text or File mode.", "Enter text or drop a file.", "Copy the MD5 hash."],
    faqs: [
      { q: "Is MD5 secure?", a: "No — MD5 is broken for cryptographic use. It's still fine for checksums, deduplication and cache keys." },
      { q: "Is my input uploaded?", a: "No. The hash is computed in your browser." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "sha256-hash-generator",
    name: "SHA-256 Hash Generator",
    h1: "Free SHA-256 Hash Generator",
    title: "SHA-256 Hash Generator – Free Online Tool | UtilityHub",
    description: "Generate a SHA-256 hash from text or a file in your browser using the Web Crypto API. Free and private.",
    cardDescription: "Compute a SHA-256 hash from text or a file.",
    category: "developer-tools",
    keywords: ["sha256 hash generator", "sha-256 online", "sha256 checksum", "generate sha256", "sha256 from file"],
    icon: "🔐",
    intro: "Compute a SHA-256 digest of any text or file using your browser's built-in Web Crypto engine. Ideal for checksums and integrity verification. Nothing is uploaded.",
    howTo: ["Choose Text or File mode.", "Enter text or drop a file.", "Copy the SHA-256 hash."],
    faqs: [
      { q: "What is SHA-256 used for?", a: "Integrity checks, digital signatures, blockchain and general secure hashing." },
      { q: "Is my input private?", a: "Yes. Hashing runs in your browser with Web Crypto." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "sha512-hash-generator",
    name: "SHA-512 Hash Generator",
    h1: "Free SHA-512 Hash Generator",
    title: "SHA-512 Hash Generator – Free Online Tool | UtilityHub",
    description: "Generate a SHA-512 hash from text or a file in your browser using the Web Crypto API. Free and private.",
    cardDescription: "Compute a SHA-512 hash from text or a file.",
    category: "developer-tools",
    keywords: ["sha512 hash generator", "sha-512 online", "sha512 checksum", "generate sha512", "sha512 from file"],
    icon: "🔒",
    intro: "Compute a SHA-512 digest of any text or file using your browser's Web Crypto engine — a longer, stronger hash from the SHA-2 family. Everything stays on your device.",
    howTo: ["Choose Text or File mode.", "Enter text or drop a file.", "Copy the SHA-512 hash."],
    faqs: [
      { q: "How is SHA-512 different from SHA-256?", a: "It's from the same SHA-2 family but produces a longer 512-bit digest, often faster on 64-bit hardware." },
      { q: "Is my input uploaded?", a: "No. It's hashed locally in your browser." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "jwt-decoder",
    name: "JWT Decoder",
    h1: "Free JWT Decoder",
    title: "JWT Decoder – Decode JSON Web Tokens Online | UtilityHub",
    description: "Decode a JWT to read its header and payload, with human-readable timestamps. Free, private and done entirely in your browser.",
    cardDescription: "Decode a JWT's header and payload.",
    category: "developer-tools",
    keywords: ["jwt decoder", "decode jwt", "json web token decoder", "jwt viewer", "read jwt"],
    icon: "🎫",
    intro: "Paste a JSON Web Token to see its decoded header and payload, with claims like exp and iat shown as readable dates. The token is decoded locally — it never leaves your browser, which matters for anything sensitive.",
    howTo: ["Paste a JWT.", "Read the decoded header and payload.", "Copy any section you need."],
    faqs: [
      { q: "Does decoding verify the signature?", a: "No — decoding just reads the token. Use the JWT Inspector to verify an HMAC signature." },
      { q: "Is my token uploaded?", a: "No. Decoding happens entirely in your browser." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "jwt-generator",
    name: "JWT Generator",
    h1: "Free JWT Generator",
    title: "JWT Generator – Create Signed JSON Web Tokens | UtilityHub",
    description: "Generate a signed JWT (HS256/384/512) from your own payload and secret, in your browser. Free and private.",
    cardDescription: "Create an HMAC-signed JWT from a payload.",
    category: "developer-tools",
    keywords: ["jwt generator", "create jwt", "sign jwt", "generate json web token", "hs256 jwt"],
    icon: "🏷️",
    intro: "Build a JSON Web Token from a custom payload and sign it with HS256, HS384 or HS512 using your secret — all via the browser's Web Crypto. Optionally add iat and exp claims automatically. Never paste production secrets into any online tool, including this one.",
    howTo: ["Pick an HMAC algorithm.", "Edit the JSON payload and set a secret.", "Generate and copy the signed token."],
    faqs: [
      { q: "Which algorithms are supported?", a: "HMAC-based HS256, HS384 and HS512. Asymmetric (RS/ES) signing isn't supported." },
      { q: "Is my secret uploaded?", a: "No — signing runs in your browser. Still, avoid using real production secrets in any web tool." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "jwt-inspector",
    name: "JWT Inspector",
    h1: "Free JWT Inspector",
    title: "JWT Inspector – Decode & Verify JSON Web Tokens | UtilityHub",
    description: "Inspect a JWT: decode it, verify its HMAC signature and check standard claims like exp and nbf. Free, private, in-browser.",
    cardDescription: "Decode, verify and audit a JWT's claims.",
    category: "developer-tools",
    keywords: ["jwt inspector", "verify jwt", "jwt signature check", "jwt claims", "validate jwt"],
    icon: "🔎",
    intro: "A deeper look at a JSON Web Token: decode header and payload, optionally verify the HMAC signature with your secret, and see whether time-based claims (exp, nbf, iat) are currently valid. Everything runs locally.",
    howTo: ["Paste a JWT.", "Optionally enter the HMAC secret to verify the signature.", "Review the standard-claim checks."],
    faqs: [
      { q: "Can it verify any JWT?", a: "Signature verification supports HMAC (HS256/384/512). Decoding and claim checks work for any token." },
      { q: "Is my token private?", a: "Yes — decoding and verification happen in your browser." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "jwt-expiry-viewer",
    name: "JWT Expiry Viewer",
    h1: "Free JWT Expiry Viewer",
    title: "JWT Expiry Viewer – Check When a Token Expires | UtilityHub",
    description: "See when a JWT expires with a live countdown and its issued/not-before times. Free, private, in-browser.",
    cardDescription: "Check a token's expiry at a glance.",
    category: "developer-tools",
    keywords: ["jwt expiry", "jwt expiration", "when does jwt expire", "jwt exp claim", "token expiry checker"],
    icon: "⏳",
    intro: "Paste a JWT to see, at a glance, whether it's still active or expired — with a live countdown and readable issued-at, not-before and expiry times. Decoded entirely in your browser.",
    howTo: ["Paste a JWT.", "Read the Active/Expired status.", "Check the exact iat, nbf and exp times."],
    faqs: [
      { q: "What if the token has no exp claim?", a: "It's reported as having no expiry — such tokens don't expire on their own." },
      { q: "Is my token uploaded?", a: "No. It's decoded locally in your browser." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "cron-generator",
    name: "Cron Generator",
    h1: "Free Cron Expression Generator",
    title: "Cron Generator – Build Cron Expressions Online | UtilityHub",
    description: "Build a cron expression with a simple visual editor and see a plain-English description plus the next run times. Free and private.",
    cardDescription: "Build cron expressions visually.",
    category: "developer-tools",
    keywords: ["cron generator", "cron expression generator", "crontab generator", "build cron", "cron schedule"],
    icon: "⏰",
    intro: "Create a valid cron expression without memorising the syntax. Pick a frequency and time and the tool writes the expression, describes it in plain English and previews the next runs. Runs entirely in your browser.",
    howTo: ["Choose a frequency (minutes, hourly, daily, weekly, monthly).", "Set the time and days.", "Copy the generated cron expression."],
    faqs: [
      { q: "What cron format is this?", a: "Standard 5-field cron (minute, hour, day-of-month, month, day-of-week)." },
      { q: "Does it show when it'll run?", a: "Yes — it previews the next several run times based on your local clock." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "cron-parser",
    name: "Cron Parser",
    h1: "Free Cron Expression Parser",
    title: "Cron Parser – Explain Cron Expressions Online | UtilityHub",
    description: "Paste a cron expression to get a plain-English description and the next run times. Free, private, in-browser.",
    cardDescription: "Explain any cron expression in English.",
    category: "developer-tools",
    keywords: ["cron parser", "cron expression explained", "crontab parser", "what does this cron mean", "cron to english"],
    icon: "📅",
    intro: "Decode a cron expression into a readable sentence and see exactly when it will next fire. Each field is broken out so you can spot mistakes quickly. All parsing is done locally.",
    howTo: ["Paste a 5-field cron expression.", "Read the plain-English meaning.", "Check the upcoming run times."],
    faqs: [
      { q: "Which cron syntax is supported?", a: "Standard 5-field cron with ranges, lists and step values (e.g. */15, 9-17, 1,15)." },
      { q: "Is anything sent to a server?", a: "No. Parsing runs entirely in your browser." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "qr-scanner",
    name: "QR Code Scanner",
    h1: "Free QR Code Scanner",
    title: "QR Code Scanner – Scan QR Codes Online | UtilityHub",
    description: "Scan a QR code from an image or your camera and read its content instantly. Free, private and processed in your browser.",
    cardDescription: "Read a QR code from an image or camera.",
    category: "developer-tools",
    keywords: ["qr scanner", "qr code reader", "scan qr code online", "read qr code", "qr decoder"],
    icon: "📷",
    intro: "Decode a QR code by dropping in a photo or scanning live with your camera. The decoded text — a URL, Wi-Fi config, contact card and so on — is shown instantly. Images and camera frames are processed locally and never uploaded.",
    howTo: ["Drop a QR code image, or start the camera.", "Wait for the code to be detected.", "Copy the decoded content or open the link."],
    faqs: [
      { q: "Does the camera option upload video?", a: "No. Camera frames are decoded in your browser and are never sent anywhere." },
      { q: "Why can't it read my image?", a: "Try a sharper, higher-contrast or more zoomed-in photo so the QR pattern is clear." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "barcode-generator",
    name: "Barcode Generator",
    h1: "Free Barcode Generator",
    title: "Barcode Generator – Create Barcodes Online | UtilityHub",
    description: "Generate barcodes (Code 128, EAN-13, UPC, Code 39 and more) and download them as PNG or SVG. Free, private, in-browser.",
    cardDescription: "Create Code 128, EAN, UPC & more.",
    category: "developer-tools",
    keywords: ["barcode generator", "generate barcode", "code 128 generator", "ean-13 barcode", "upc barcode"],
    icon: "🧾",
    intro: "Create a barcode in a range of common formats — Code 128, Code 39, EAN-13/8, UPC and more — and download it as a crisp PNG or scalable SVG. Rendered entirely in your browser.",
    howTo: ["Choose a barcode type.", "Enter the value to encode.", "Download the barcode as PNG or SVG."],
    faqs: [
      { q: "Why is my value rejected?", a: "Numeric formats like EAN-13 and UPC require an exact number of digits. The tool shows what each format expects." },
      { q: "Is the barcode generated locally?", a: "Yes. Everything is rendered in your browser — nothing is uploaded." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "url-parser",
    name: "URL Parser",
    h1: "Free URL Parser",
    title: "URL Parser – Break Down a URL Online | UtilityHub",
    description: "Parse a URL into its protocol, host, path, query parameters and fragment. Free, private, in-browser.",
    cardDescription: "Break a URL into its components.",
    category: "developer-tools",
    keywords: ["url parser", "parse url", "url components", "query string parser", "url breakdown"],
    icon: "🔗",
    intro: "Break any URL into its parts — protocol, host, port, path, query and fragment — and see the query string parsed into a clean key/value table. Everything runs in your browser.",
    howTo: ["Paste a full URL.", "Review the parsed components.", "Read the query parameters as a table."],
    faqs: [
      { q: "What counts as a valid URL?", a: "An absolute URL with a scheme, e.g. https://example.com/path?x=1." },
      { q: "Is my URL uploaded?", a: "No. Parsing uses the browser's built-in URL engine, locally." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "dns-lookup",
    name: "DNS Lookup",
    h1: "Free DNS Lookup",
    title: "DNS Lookup – Query DNS Records Online | UtilityHub",
    description: "Look up A, AAAA, MX, TXT, NS, CNAME and other DNS records for any domain. Fast DNS-over-HTTPS lookups.",
    cardDescription: "Query A, MX, TXT and other DNS records.",
    category: "developer-tools",
    keywords: ["dns lookup", "dns records", "mx lookup", "txt record lookup", "nslookup online"],
    icon: "🌐",
    intro: "Query a domain's DNS records — A, AAAA, MX, TXT, NS, CNAME, SOA, CAA and SRV. Because browsers can't resolve DNS directly, the lookup runs on our server via Cloudflare's DNS-over-HTTPS resolver and the results are streamed straight back to you.",
    howTo: ["Enter a domain name.", "Pick a record type.", "Read the returned records and TTLs."],
    faqs: [
      { q: "Why isn't this done in my browser?", a: "Browsers have no API to resolve arbitrary DNS records, so the query is proxied through our server to a public DNS-over-HTTPS resolver." },
      { q: "Is my query stored?", a: "No. The domain is sent to the resolver to answer the query and nothing is retained on our side." },
    ],
    privacyNote: "This tool runs a server-side lookup: the domain you enter is sent to Cloudflare's public DNS-over-HTTPS resolver to fetch records, then returned to you. The query isn't stored.",
    available: true,
    serverSide: true,
  },
  {
    slug: "ip-lookup",
    name: "IP Address Lookup",
    h1: "Free IP Address Lookup",
    title: "IP Address Lookup – Geolocation & ISP Info | UtilityHub",
    description: "Look up the approximate location, ISP and network details of any IP address, or check your own. Free and fast.",
    cardDescription: "Find an IP's location, ISP and network.",
    category: "developer-tools",
    keywords: ["ip lookup", "ip address lookup", "ip geolocation", "what is my ip", "ip location finder"],
    icon: "📍",
    intro: "Find the approximate geolocation, ISP, organization and ASN for any IPv4 or IPv6 address — or leave the box blank to look up your own. The lookup runs on our server against a public IP-info provider.",
    howTo: ["Enter an IP address, or leave it blank for your own.", "Run the lookup.", "Read the location, ISP and network details."],
    faqs: [
      { q: "How accurate is the location?", a: "IP geolocation is approximate — usually accurate to the city or region, not a street address." },
      { q: "Why isn't this fully in-browser?", a: "Geolocation needs an external IP database, so the query is proxied through our server to a public provider." },
    ],
    privacyNote: "This tool runs a server-side lookup: the IP you enter (or your own) is sent to a public IP-geolocation provider to fetch details, then returned to you. The query isn't stored.",
    available: true,
    serverSide: true,
  },
  {
    slug: "user-agent-parser",
    name: "User Agent Parser",
    h1: "Free User Agent Parser",
    title: "User Agent Parser – Decode a UA String | UtilityHub",
    description: "Parse a User-Agent string into browser, engine, operating system and device type. Free, private, in-browser.",
    cardDescription: "Decode a User-Agent into browser & OS.",
    category: "developer-tools",
    keywords: ["user agent parser", "parse user agent", "ua parser", "user agent decoder", "my user agent"],
    icon: "🕵️",
    intro: "Break a User-Agent string down into the browser, rendering engine, operating system and device type. It loads your own UA by default, or paste any string to inspect. Parsing happens locally in your browser.",
    howTo: ["Your own User-Agent loads automatically.", "Or paste a different UA string.", "Read the parsed browser, OS and device."],
    faqs: [
      { q: "Why are some values approximate?", a: "Modern browsers deliberately freeze or reduce UA details for privacy, so parsing is best-effort." },
      { q: "Is my UA uploaded?", a: "No. Parsing runs entirely in your browser." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "http-status-codes",
    name: "HTTP Status Codes",
    h1: "HTTP Status Codes Reference",
    title: "HTTP Status Codes – Full Reference List | UtilityHub",
    description: "A searchable reference of HTTP status codes (1xx–5xx) with their names and meanings. Free and instant.",
    cardDescription: "Searchable list of HTTP status codes.",
    category: "developer-tools",
    keywords: ["http status codes", "http status code list", "404 meaning", "500 error", "http response codes"],
    icon: "🚦",
    intro: "A quick, searchable reference of HTTP status codes grouped by class — informational, success, redirection, client error and server error — each with a short explanation of what it means.",
    howTo: ["Search by code, name or meaning.", "Or filter by class (2xx, 4xx…).", "Read the explanation for each code."],
    faqs: [
      { q: "What's the difference between 401 and 403?", a: "401 means you're not authenticated (log in); 403 means you're authenticated but not allowed." },
      { q: "Does this need a connection?", a: "No — the reference is built into the page and works offline." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "mime-types",
    name: "MIME Types",
    h1: "MIME Types Reference",
    title: "MIME Types – Extension to Content-Type Reference | UtilityHub",
    description: "A searchable reference mapping file extensions to their MIME (Content-Type) values. Free and instant.",
    cardDescription: "Look up MIME types by file extension.",
    category: "developer-tools",
    keywords: ["mime types", "content type", "file extension mime", "mime type list", "content-type lookup"],
    icon: "📎",
    intro: "Find the correct MIME (Content-Type) value for a file extension, or search by type or description. Handy when setting Content-Type headers or configuring uploads. Built into the page — no connection needed.",
    howTo: ["Search by extension, MIME type or name.", "Find the matching Content-Type.", "Copy it with one click."],
    faqs: [
      { q: "What's the MIME type for a JavaScript file?", a: "text/javascript is the current standard (application/javascript is also widely accepted)." },
      { q: "Does this need a connection?", a: "No — the list is built into the page and works offline." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "color-converter",
    name: "Color Converter",
    h1: "Free Color Converter",
    title: "Color Converter – HEX, RGB, HSL & HSV | UtilityHub",
    description: "Convert colors between HEX, RGB, HSL and HSV, with a live swatch and CSS color-name support. Free, private, in-browser.",
    cardDescription: "Convert HEX, RGB, HSL & HSV colors.",
    category: "developer-tools",
    keywords: ["color converter", "hex to rgb", "rgb to hex", "hsl converter", "hex to hsl"],
    icon: "🎨",
    intro: "Enter a color in any common form — HEX, RGB(A), HSL(A) or a CSS name — and get every other format plus a live preview swatch. Great for translating design values into CSS. Runs entirely in your browser.",
    howTo: ["Type a color or use the picker.", "See HEX, RGB, HSL and HSV instantly.", "Copy the format you need."],
    faqs: [
      { q: "Does it support transparency?", a: "Yes — RGBA/HSLA with an alpha channel is handled and shown in the outputs." },
      { q: "Are CSS color names supported?", a: "Yes, named colors like 'skyblue' are recognised and converted." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "minify-css",
    name: "CSS Minifier",
    h1: "Free CSS Minifier",
    title: "CSS Minifier – Minify CSS Online | UtilityHub",
    description: "Minify CSS online to shrink file size by stripping comments and whitespace. Free, private, in-browser.",
    cardDescription: "Strip comments & whitespace from CSS.",
    category: "developer-tools",
    keywords: ["minify css", "css minifier", "compress css", "css compressor", "minify stylesheet"],
    icon: "🗜️",
    intro: "Shrink a stylesheet by removing comments, whitespace and redundant characters. Paste your CSS and copy the minified result. Everything runs in your browser — no uploads.",
    howTo: ["Paste your CSS.", "The minified version appears instantly.", "Copy or download it."],
    faqs: [
      { q: "Will minifying change how my CSS behaves?", a: "No — it only removes comments and unnecessary whitespace, keeping the rules identical." },
      { q: "Is my CSS uploaded?", a: "No. Minification runs entirely in your browser." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "minify-js",
    name: "JavaScript Minifier",
    h1: "Free JavaScript Minifier",
    title: "JavaScript Minifier – Minify JS Online | UtilityHub",
    description: "Minify JavaScript online with Terser — compress and optionally mangle names to shrink file size. Free, private, in-browser.",
    cardDescription: "Compress JS with Terser in your browser.",
    category: "developer-tools",
    keywords: ["minify js", "javascript minifier", "compress javascript", "js minifier", "terser online"],
    icon: "🗜️",
    intro: "Minify JavaScript using Terser, right in your browser — it compresses the code and can mangle variable names for the smallest output. See how much you saved. Your code is never uploaded.",
    howTo: ["Paste your JavaScript.", "Toggle name mangling if you like.", "Minify, then copy the output."],
    faqs: [
      { q: "What does 'mangle names' do?", a: "It shortens local variable and function names for a smaller file. Turn it off if you need readable output." },
      { q: "Is my code uploaded?", a: "No. Terser runs in your browser — your code stays on your device." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "beautify-html",
    name: "HTML Beautifier",
    h1: "Free HTML Beautifier",
    title: "HTML Beautifier & Formatter – Free Online Tool | UtilityHub",
    description: "Beautify or minify HTML online with clean indentation. Free, private and processed in your browser.",
    cardDescription: "Indent and tidy messy HTML.",
    category: "developer-tools",
    keywords: ["html beautifier", "format html", "html formatter", "pretty print html", "minify html"],
    icon: "✨",
    intro: "Turn minified or messy HTML into clean, indented markup — or minify it back down. Void elements are handled correctly so nesting stays sensible. Everything runs in your browser.",
    howTo: ["Paste your HTML.", "Choose an indent size or Minify.", "Copy or download the result."],
    faqs: [
      { q: "Does it change my markup?", a: "No — it only adjusts whitespace and indentation; your elements and content are unchanged." },
      { q: "Is my HTML uploaded?", a: "No. Formatting runs entirely in your browser." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
  },
  {
    slug: "diff-viewer",
    name: "Diff Viewer",
    h1: "Free Diff Viewer",
    title: "Diff Viewer – Compare Text & Code Online | UtilityHub",
    description: "Compare two blocks of text or code and see added and removed lines highlighted. Free, private, in-browser.",
    cardDescription: "Compare two texts line by line.",
    category: "developer-tools",
    keywords: ["diff viewer", "text diff", "compare text", "code diff", "diff checker online"],
    icon: "🔀",
    intro: "Paste two versions of a text or code snippet and see a line-by-line diff with additions and removals highlighted. An optional whitespace-insensitive mode ignores formatting-only changes. All local to your browser.",
    howTo: ["Paste the original on the left.", "Paste the changed version on the right.", "Read the highlighted differences."],
    faqs: [
      { q: "Is the comparison line-based?", a: "Yes — it computes a line-level diff, ideal for code and structured text." },
      { q: "Is my text uploaded?", a: "No. The diff is computed entirely in your browser." },
    ],
    privacyNote: PRIVACY_CLIENT,
    available: true,
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
