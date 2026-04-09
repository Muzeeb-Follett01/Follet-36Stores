/**
 * jiraAttach.ts
 *
 * Attaches screenshots & videos from test-results to Zephyr Squad test
 * executions inside a Jira Server test cycle.
 *
 * Flow:
 *   1. Get project ID for TMSHOP
 *   2. Find the "Test01" cycle under "Unscheduled" (versionId = -1)
 *   3. Create a folder named after the storeId (e.g. "0026") inside the cycle
 *   4. For each TMSHOP-XXX folder in test-results/{storeId}/:
 *      a. Get the Jira issue ID for that key
 *      b. Create a test execution in the cycle + folder
 *      c. Attach all screenshots & videos to that execution
 *
 * Usage:
 *   npx ts-node --transpile-only scripts/jiraAttach.ts 0026
 *   npx ts-node --transpile-only scripts/jiraAttach.ts 0026 TMSHOP-455
 *   npx ts-node --transpile-only scripts/jiraAttach.ts 0026 ALL "My Cycle"
 *
 * Config: jira.env at project root
 */

import * as fs from "fs";
import * as path from "path";
import * as https from "https";
import * as http from "http";

// ─── Load jira.env ──────────────────────────────────────────────────────────
const ENV_FILE = path.resolve(__dirname, "..", "jira.env");
if (fs.existsSync(ENV_FILE)) {
  const lines = fs.readFileSync(ENV_FILE, "utf-8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
    if (val) process.env[key] = val;
  }
}

const JIRA_BASE_URL = (process.env.JIRA_BASE_URL ?? "").replace(/\/$/, "");
const JIRA_PROJECT_KEY = process.env.JIRA_PROJECT_KEY ?? "TMSHOP";
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN ?? "";

if (!JIRA_BASE_URL || !JIRA_API_TOKEN) {
  console.error(
    "ERROR: Missing Jira credentials.\n" +
      "Fill in JIRA_BASE_URL and JIRA_API_TOKEN in jira.env"
  );
  process.exit(1);
}

// Jira Server: Bearer PAT authentication
const AUTH_HEADER = `Bearer ${JIRA_API_TOKEN}`;

// ─── CLI args ───────────────────────────────────────────────────────────────
const storeId = process.argv[2];
const specificTicket = process.argv[3]; // optional, or "ALL"
const cycleName = process.argv[4] ?? "Test01";

if (!storeId) {
  console.error(
    "Usage:\n" +
      "  npx ts-node --transpile-only scripts/jiraAttach.ts <storeId> [JIRA-TICKET] [cycleName]\n" +
      "  e.g.  npx ts-node --transpile-only scripts/jiraAttach.ts 0026\n" +
      "  e.g.  npx ts-node --transpile-only scripts/jiraAttach.ts 0026 TMSHOP-455\n" +
      '  e.g.  npx ts-node --transpile-only scripts/jiraAttach.ts 0026 ALL "Test01"'
  );
  process.exit(1);
}

const RESULTS_DIR = path.resolve(__dirname, "..", "test-results", storeId);
if (!fs.existsSync(RESULTS_DIR)) {
  console.error(`ERROR: Directory not found: ${RESULTS_DIR}`);
  process.exit(1);
}

// ─── HTTP helper ────────────────────────────────────────────────────────────
function jiraRequest(
  method: string,
  apiPath: string,
  body?: any,
  isMultipart?: { boundary: string; data: Buffer }
): Promise<{ status: number; data: any }> {
  return new Promise((resolve, reject) => {
    const url = new URL(`${JIRA_BASE_URL}${apiPath}`);
    const headers: Record<string, string> = {
      Authorization: AUTH_HEADER,
      "X-Atlassian-Token": "no-check",
    };

    let requestBody: Buffer | string | undefined;

    if (isMultipart) {
      headers["Content-Type"] = `multipart/form-data; boundary=${isMultipart.boundary}`;
      headers["Content-Length"] = isMultipart.data.length.toString();
      requestBody = isMultipart.data;
    } else if (body) {
      headers["Content-Type"] = "application/json";
      requestBody = JSON.stringify(body);
      headers["Content-Length"] = Buffer.byteLength(requestBody).toString();
    }

    const options: https.RequestOptions = {
      hostname: url.hostname,
      port: url.port || (url.protocol === "https:" ? 443 : 80),
      path: url.pathname + url.search,
      method,
      headers,
      rejectUnauthorized: false,
    };

    const transport = url.protocol === "https:" ? https : http;
    const req = transport.request(options, (res) => {
      let raw = "";
      res.on("data", (chunk: Buffer) => (raw += chunk.toString()));
      res.on("end", () => {
        let parsed: any;
        try {
          parsed = JSON.parse(raw);
        } catch {
          parsed = raw;
        }
        resolve({ status: res.statusCode ?? 0, data: parsed });
      });
    });

    req.on("error", reject);
    if (requestBody) req.write(requestBody);
    req.end();
  });
}

// ─── Multipart file upload builder ──────────────────────────────────────────
function buildMultipart(
  filePath: string,
  fileName: string
): { boundary: string; data: Buffer } {
  const boundary = "----FormBoundary" + Date.now().toString(36);
  const fileBuffer = fs.readFileSync(filePath);

  const header =
    `--${boundary}\r\n` +
    `Content-Disposition: form-data; name="file"; filename="${fileName}"\r\n` +
    `Content-Type: application/octet-stream\r\n\r\n`;
  const footer = `\r\n--${boundary}--\r\n`;

  return {
    boundary,
    data: Buffer.concat([
      Buffer.from(header, "utf-8"),
      fileBuffer,
      Buffer.from(footer, "utf-8"),
    ]),
  };
}

// ─── Collect ticket folders ─────────────────────────────────────────────────
function getTicketFolders(): string[] {
  return fs
    .readdirSync(RESULTS_DIR)
    .filter((name) => {
      if (specificTicket && specificTicket !== "ALL" && name !== specificTicket)
        return false;
      if (!/^[A-Z]+-\d+$/i.test(name)) return false;
      return fs.statSync(path.join(RESULTS_DIR, name)).isDirectory();
    });
}

function getFilesInDir(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .map((f) => path.join(dir, f))
    .filter((f) => fs.statSync(f).isFile());
}

// ─── Main ───────────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n═══ Zephyr Squad — Attach Test Results ═══`);
  console.log(`  Store: ${storeId}`);
  console.log(`  Cycle: ${cycleName}`);
  console.log(`  Project: ${JIRA_PROJECT_KEY}`);
  console.log(`  Jira: ${JIRA_BASE_URL}\n`);

  // ── Step 1: Get project ID ──────────────────────────────────────────────
  console.log(`▸ Step 1: Getting project ID for ${JIRA_PROJECT_KEY}...`);
  const projRes = await jiraRequest("GET", `/rest/api/2/project/${JIRA_PROJECT_KEY}`);
  if (projRes.status !== 200) {
    console.error(`  ❌ Failed to get project: ${projRes.status}`, projRes.data);
    process.exit(1);
  }
  const projectId = projRes.data.id;
  console.log(`  ✅ Project ID: ${projectId}\n`);

  // ── Step 2: Find cycle under Unscheduled (versionId=-1) ─────────────────
  console.log(`▸ Step 2: Finding cycle "${cycleName}" (Unscheduled)...`);
  const cyclesRes = await jiraRequest(
    "GET",
    `/rest/zapi/latest/cycle?projectId=${projectId}&versionId=-1`
  );
  if (cyclesRes.status !== 200) {
    console.error(`  ❌ Failed to get cycles: ${cyclesRes.status}`, cyclesRes.data);
    process.exit(1);
  }

  let cycleId: string | null = null;
  const cyclesData = cyclesRes.data;
  for (const [id, val] of Object.entries(cyclesData)) {
    if (id === "recordsCount") continue;
    if ((val as any).name === cycleName) {
      cycleId = id;
      break;
    }
  }

  if (!cycleId) {
    const names = Object.entries(cyclesData)
      .filter(([k]) => k !== "recordsCount")
      .map(([, v]: any) => v.name);
    console.error(`  ❌ Cycle "${cycleName}" not found. Available: ${names.join(", ")}`);
    process.exit(1);
  }
  console.log(`  ✅ Cycle ID: ${cycleId}\n`);

  // ── Step 3: Create folder for store inside the cycle ────────────────────
  console.log(`▸ Step 3: Creating folder "${storeId}" in cycle...`);
  const folderRes = await jiraRequest(
    "POST",
    `/rest/zapi/latest/cycle/${cycleId}/folder`,
    {
      name: storeId,
      description: `Store ${storeId} test results`,
      cycleId: cycleId,
      projectId: projectId,
      versionId: -1,
    }
  );

  let folderId: string | null = null;
  if (folderRes.status === 200 || folderRes.status === 201) {
    folderId =
      folderRes.data.id?.toString() ??
      folderRes.data.folderId?.toString() ??
      null;
    console.log(`  ✅ Folder created: ID ${folderId}\n`);
  } else if (
    folderRes.status === 400 &&
    JSON.stringify(folderRes.data).toLowerCase().includes("already exists")
  ) {
    console.log(`  ⚠️  Folder "${storeId}" already exists, looking up ID...`);
    const foldersRes = await jiraRequest(
      "GET",
      `/rest/zapi/latest/cycle/${cycleId}/folders?projectId=${projectId}&versionId=-1`
    );
    if (foldersRes.status === 200 && Array.isArray(foldersRes.data)) {
      const match = foldersRes.data.find((f: any) => f.folderName === storeId);
      if (match) {
        folderId = match.folderId?.toString();
        console.log(`  ✅ Existing folder ID: ${folderId}\n`);
      }
    }
    if (!folderId) {
      console.log(`  ⚠️  Could not resolve folder ID, continuing without folder\n`);
    }
  } else {
    console.log(
      `  ⚠️  Folder creation returned ${folderRes.status}, continuing without folder\n`
    );
  }

  // ── Step 4: Process each ticket folder ──────────────────────────────────
  const ticketFolders = getTicketFolders();
  if (ticketFolders.length === 0) {
    console.log("No matching ticket folders found.");
    return;
  }

  console.log(`▸ Step 4: Processing ${ticketFolders.length} test case(s)...\n`);

  let totalSuccess = 0;
  let totalFail = 0;

  for (const ticketKey of ticketFolders) {
    console.log(`  ── ${ticketKey} ──`);

    // 4a. Get issue ID
    const issueRes = await jiraRequest(
      "GET",
      `/rest/api/2/issue/${ticketKey}?fields=id,summary`
    );
    if (issueRes.status !== 200) {
      console.log(`    ❌ Could not find issue ${ticketKey}: ${issueRes.status}`);
      totalFail++;
      continue;
    }
    const issueId = issueRes.data.id;
    const summary = issueRes.data.fields?.summary ?? "";
    console.log(`    Issue ID: ${issueId} — ${summary}`);

    // 4b. Create execution in cycle + folder
    const execBody: any = {
      cycleId: cycleId,
      issueId: issueId,
      projectId: projectId,
      versionId: "-1",
    };
    if (folderId) execBody.folderId = folderId;

    const execRes = await jiraRequest(
      "POST",
      `/rest/zapi/latest/execution`,
      execBody
    );
    let executionId: string | null = null;

    if (execRes.status === 200 || execRes.status === 201) {
      const keys = Object.keys(execRes.data);
      executionId = keys[0] ?? null;
      console.log(`    Execution created: ID ${executionId}`);
    } else {
      console.log(
        `    ❌ Failed to create execution: ${execRes.status}`,
        typeof execRes.data === "string"
          ? execRes.data.slice(0, 150)
          : execRes.data
      );
      totalFail++;
      continue;
    }

    if (!executionId) {
      console.log(`    ❌ No execution ID returned`);
      totalFail++;
      continue;
    }

    // 4c. Attach screenshots and videos
    const ticketPath = path.join(RESULTS_DIR, ticketKey);
    const files = [
      ...getFilesInDir(path.join(ticketPath, "screenshots")),
      ...getFilesInDir(path.join(ticketPath, "videos")),
    ];

    if (files.length === 0) {
      console.log(`    No files to attach`);
      continue;
    }

    for (const file of files) {
      const fileName = path.basename(file);
      const sizeKB = (fs.statSync(file).size / 1024).toFixed(1);
      process.stdout.write(`    📎 ${fileName} (${sizeKB} KB) ... `);

      const multipart = buildMultipart(file, fileName);
      const attachRes = await jiraRequest(
        "POST",
        `/rest/zapi/latest/attachment?entityId=${executionId}&entityType=execution`,
        undefined,
        multipart
      );

      if (attachRes.status >= 200 && attachRes.status < 300) {
        console.log(`✅`);
        totalSuccess++;
      } else {
        console.log(`❌ ${attachRes.status}`);
        totalFail++;
      }
    }
    console.log();
  }

  console.log(
    `═══ Done ═══  ✅ ${totalSuccess} attached, ❌ ${totalFail} failed\n`
  );
}

main().catch((err) => {
  console.error("Unhandled error:", err);
  process.exit(1);
});
