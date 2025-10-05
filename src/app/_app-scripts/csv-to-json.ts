import * as fs from "fs";
import * as path from "path";

function csvToJson(csv: string): Record<string, string>[] {
  const lines = csv.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) return [];
  const header = lines[0].split(";").map((h) => h.trim());
  const rows = lines.slice(1);

  return rows.map((line) => {
    const cols = line.split(";");
    const obj: Record<string, string> = {};
    header.forEach((key, i) => {
      obj[key] = (cols[i] ?? "").trim();
    });
    return obj;
  });
}

function main() {
  const dataDir = path.resolve(__dirname, "..", "_app-data");
  const csvPath = path.join(dataDir, "data.csv");
  const jsonPath = path.join(dataDir, "data.json");

  if (!fs.existsSync(csvPath)) {
    console.error("CSV nicht gefunden:", csvPath);
    process.exit(1);
  }

  const csv = fs.readFileSync(csvPath, "utf-8");
  const json = csvToJson(csv);

  fs.writeFileSync(jsonPath, JSON.stringify(json, null, 2), "utf-8");
  console.log(`OK: ${json.length} Zeilen -> ${jsonPath}`);
}

main();
