import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { getSitemapEntries } from "../src/lib/sitemap-data";
import { buildSitemapXml } from "../src/lib/sitemap-xml";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = join(rootDir, "public", "sitemap.xml");

const xml = buildSitemapXml(getSitemapEntries());

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, xml, "utf8");

console.log(`Generated ${outputPath} (${xml.length} bytes)`);
