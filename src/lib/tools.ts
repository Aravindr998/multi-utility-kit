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
