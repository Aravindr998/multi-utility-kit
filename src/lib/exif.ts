// Minimal, dependency-free EXIF reader for JPEG/TIFF files.
// Parses the APP1 (Exif) segment → TIFF header → IFD0, Exif sub-IFD and GPS IFD.

export type ExifResult = {
  tags: Record<string, string>;
  gps?: { lat: number; lon: number };
};

const TAGS: Record<number, string> = {
  0x010f: "Make",
  0x0110: "Model",
  0x0112: "Orientation",
  0x011a: "XResolution",
  0x011b: "YResolution",
  0x0128: "ResolutionUnit",
  0x0131: "Software",
  0x0132: "DateTime",
  0x013b: "Artist",
  0x8298: "Copyright",
  0x829a: "ExposureTime",
  0x829d: "FNumber",
  0x8822: "ExposureProgram",
  0x8827: "ISOSpeedRatings",
  0x9003: "DateTimeOriginal",
  0x9004: "DateTimeDigitized",
  0x9201: "ShutterSpeedValue",
  0x9202: "ApertureValue",
  0x9204: "ExposureBias",
  0x9207: "MeteringMode",
  0x9209: "Flash",
  0x920a: "FocalLength",
  0xa002: "PixelXDimension",
  0xa003: "PixelYDimension",
  0xa403: "WhiteBalance",
  0xa405: "FocalLengthIn35mmFilm",
  0xa432: "LensSpecification",
  0xa433: "LensMake",
  0xa434: "LensModel",
};

const GPS_TAGS: Record<number, string> = {
  0x0001: "GPSLatitudeRef",
  0x0002: "GPSLatitude",
  0x0003: "GPSLongitudeRef",
  0x0004: "GPSLongitude",
  0x0005: "GPSAltitudeRef",
  0x0006: "GPSAltitude",
};

const ORIENTATION: Record<number, string> = {
  1: "Normal",
  2: "Mirrored horizontal",
  3: "Rotated 180°",
  4: "Mirrored vertical",
  5: "Mirrored + rotated 90° CCW",
  6: "Rotated 90° CW",
  7: "Mirrored + rotated 90° CW",
  8: "Rotated 90° CCW",
};

const METERING: Record<number, string> = { 0: "Unknown", 1: "Average", 2: "Center-weighted", 3: "Spot", 4: "Multi-spot", 5: "Pattern", 6: "Partial" };
const EXPOSURE_PROGRAM: Record<number, string> = { 0: "Not defined", 1: "Manual", 2: "Program AE", 3: "Aperture priority", 4: "Shutter priority", 5: "Creative", 6: "Action", 7: "Portrait", 8: "Landscape" };
const WHITE_BALANCE: Record<number, string> = { 0: "Auto", 1: "Manual" };
const TYPE_SIZE: Record<number, number> = { 1: 1, 2: 1, 3: 2, 4: 4, 5: 8, 7: 1, 9: 4, 10: 8 };

function readValue(view: DataView, entry: number, tiff: number, le: boolean): number[] | string {
  const type = view.getUint16(entry + 2, le);
  const count = view.getUint32(entry + 4, le);
  const size = TYPE_SIZE[type] || 1;
  const total = size * count;
  const valueAt = total <= 4 ? entry + 8 : tiff + view.getUint32(entry + 8, le);
  if (type === 2) {
    // ASCII
    let s = "";
    for (let i = 0; i < count; i++) {
      const c = view.getUint8(valueAt + i);
      if (c === 0) break;
      s += String.fromCharCode(c);
    }
    return s.trim();
  }
  const out: number[] = [];
  for (let i = 0; i < count; i++) {
    const at = valueAt + i * size;
    if (type === 1 || type === 7) out.push(view.getUint8(at));
    else if (type === 3) out.push(view.getUint16(at, le));
    else if (type === 4) out.push(view.getUint32(at, le));
    else if (type === 9) out.push(view.getInt32(at, le));
    else if (type === 5) out.push(view.getUint32(at, le) / (view.getUint32(at + 4, le) || 1));
    else if (type === 10) out.push(view.getInt32(at, le) / (view.getInt32(at + 4, le) || 1));
  }
  return out;
}

function readIFD(view: DataView, dir: number, tiff: number, le: boolean, map: Record<number, string>, into: Record<string, number[] | string>, pointers?: { exif?: number; gps?: number }) {
  const entries = view.getUint16(dir, le);
  for (let i = 0; i < entries; i++) {
    const entry = dir + 2 + i * 12;
    const tag = view.getUint16(entry, le);
    if (pointers && tag === 0x8769) pointers.exif = tiff + view.getUint32(entry + 8, le);
    else if (pointers && tag === 0x8825) pointers.gps = tiff + view.getUint32(entry + 8, le);
    else if (map[tag]) into[map[tag]] = readValue(view, entry, tiff, le);
  }
}

function toDecimal(dms: number[], ref: string): number {
  const [d = 0, m = 0, s = 0] = dms;
  let v = d + m / 60 + s / 3600;
  if (ref === "S" || ref === "W") v = -v;
  return v;
}

export function parseExif(buffer: ArrayBuffer): ExifResult | null {
  const view = new DataView(buffer);
  if (view.byteLength < 4 || view.getUint16(0) !== 0xffd8) return null; // not JPEG

  // Scan JPEG markers for APP1 "Exif".
  let offset = 2;
  let tiff = -1;
  while (offset + 4 <= view.byteLength) {
    if (view.getUint8(offset) !== 0xff) { offset++; continue; }
    const marker = view.getUint8(offset + 1);
    if (marker === 0xd9 || marker === 0xda) break; // EOI / start of scan
    const segLen = view.getUint16(offset + 2, false);
    if (marker === 0xe1) {
      const p = offset + 4;
      if (String.fromCharCode(view.getUint8(p), view.getUint8(p + 1), view.getUint8(p + 2), view.getUint8(p + 3)) === "Exif") {
        tiff = p + 6;
        break;
      }
    }
    offset += 2 + segLen;
  }
  if (tiff < 0) return null;

  const byteOrder = view.getUint16(tiff, false);
  const le = byteOrder === 0x4949;
  if (!le && byteOrder !== 0x4d4d) return null;
  const ifd0 = tiff + view.getUint32(tiff + 4, le);

  const raw: Record<string, number[] | string> = {};
  const pointers: { exif?: number; gps?: number } = {};
  readIFD(view, ifd0, tiff, le, TAGS, raw, pointers);
  if (pointers.exif) readIFD(view, pointers.exif, tiff, le, TAGS, raw);

  const gpsRaw: Record<string, number[] | string> = {};
  if (pointers.gps) readIFD(view, pointers.gps, tiff, le, GPS_TAGS, gpsRaw);

  return { ...format(raw, gpsRaw) };
}

function num(v: number[] | string | undefined): number | undefined {
  if (Array.isArray(v)) return v[0];
  return undefined;
}
function str(v: number[] | string | undefined): string | undefined {
  if (typeof v === "string") return v || undefined;
  return undefined;
}

function format(raw: Record<string, number[] | string>, gpsRaw: Record<string, number[] | string>): ExifResult {
  const tags: Record<string, string> = {};
  const set = (k: string, v: string | undefined) => { if (v !== undefined && v !== "") tags[k] = v; };

  set("Camera make", str(raw.Make));
  set("Camera model", str(raw.Model));
  set("Lens", str(raw.LensModel) || str(raw.LensMake));
  set("Software", str(raw.Software));
  set("Artist", str(raw.Artist));
  set("Copyright", str(raw.Copyright));
  set("Date taken", str(raw.DateTimeOriginal) || str(raw.DateTime));

  const o = num(raw.Orientation);
  if (o) set("Orientation", ORIENTATION[o] || String(o));

  const exp = num(raw.ExposureTime);
  if (exp) set("Exposure", exp >= 1 ? `${exp}s` : `1/${Math.round(1 / exp)}s`);
  const f = num(raw.FNumber);
  if (f) set("Aperture", `f/${f}`);
  const iso = num(raw.ISOSpeedRatings);
  if (iso) set("ISO", String(iso));
  const fl = num(raw.FocalLength);
  if (fl) set("Focal length", `${Math.round(fl)}mm`);
  const fl35 = num(raw.FocalLengthIn35mmFilm);
  if (fl35) set("Focal length (35mm eq.)", `${fl35}mm`);

  const ep = num(raw.ExposureProgram);
  if (ep !== undefined) set("Exposure program", EXPOSURE_PROGRAM[ep] || String(ep));
  const mm = num(raw.MeteringMode);
  if (mm !== undefined) set("Metering", METERING[mm] || String(mm));
  const flash = num(raw.Flash);
  if (flash !== undefined) set("Flash", (flash & 1) ? "Fired" : "Did not fire");
  const wb = num(raw.WhiteBalance);
  if (wb !== undefined) set("White balance", WHITE_BALANCE[wb] || String(wb));

  const px = num(raw.PixelXDimension);
  const py = num(raw.PixelYDimension);
  if (px && py) set("EXIF dimensions", `${px} × ${py}`);

  let gps: { lat: number; lon: number } | undefined;
  const latArr = gpsRaw.GPSLatitude;
  const lonArr = gpsRaw.GPSLongitude;
  if (Array.isArray(latArr) && Array.isArray(lonArr)) {
    const lat = toDecimal(latArr, str(gpsRaw.GPSLatitudeRef) || "N");
    const lon = toDecimal(lonArr, str(gpsRaw.GPSLongitudeRef) || "E");
    gps = { lat, lon };
    set("GPS", `${lat.toFixed(6)}, ${lon.toFixed(6)}`);
  }

  return { tags, gps };
}
