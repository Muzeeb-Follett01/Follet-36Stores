import type {
  FullConfig,
  FullResult,
  Reporter,
  Suite,
  TestCase,
  TestResult,
} from "@playwright/test/reporter";
import * as fs from "fs";
import * as path from "path";

/**
 * Per-test HTML reporter — generates an index.html inside each
 *   test-results/<storeId>/<testCaseId>/
 * directory so every test case has its own self-contained report with
 * screenshots, video, error info and duration.
 */
interface TestRecord {
  testCaseId: string;
  title: string;
  status: string;
  duration: number;
  errors: string[];
  storeId: string;
  retries: number;
  outputDir: string;
}

class PerTestHtmlReporter implements Reporter {
  private records: TestRecord[] = [];
  private storeId = "unknown";

  onBegin(_config: FullConfig, _suite: Suite): void {
    // Derive storeId at startup — same logic as excelToTestData.ts
    try {
      const excelFileName = process.env.EXCEL_FILE ?? "follettTestData.xlsx";
      const baseName = path.basename(excelFileName, path.extname(excelFileName));
      const match = baseName.match(/(\d{4})/);
      this.storeId = match ? match[1] : "store";
    } catch {
      this.storeId = "store";
    }
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    const specFile = test.location.file ?? "";
    const fileMatch = path.basename(specFile).match(/(TMSHOP-\d+)/i);
    const testCaseId = fileMatch ? fileMatch[1].toUpperCase() : "unknown";

    const outputDir = path.join(
      process.cwd(),
      "test-results",
      this.storeId,
      testCaseId,
    );

    this.records.push({
      testCaseId,
      title: test.title,
      status: result.status,
      duration: result.duration,
      errors: result.errors.map((e) => e.message ?? e.stack ?? String(e)),
      storeId: this.storeId,
      retries: result.retry,
      outputDir,
    });
  }

  onEnd(_result: FullResult): void {
    for (const rec of this.records) {
      this.generateHtml(rec);
    }
    console.log(
      `📄 Per-test HTML reports generated for ${this.records.length} test(s).`,
    );
  }

  private generateHtml(rec: TestRecord): void {
    const { outputDir, testCaseId } = rec;

    // Collect screenshots
    const screenshotsDir = path.join(outputDir, "screenshots");
    const screenshots: string[] = [];
    if (fs.existsSync(screenshotsDir)) {
      for (const f of fs.readdirSync(screenshotsDir)) {
        if (/\.(png|jpe?g|gif|webp)$/i.test(f)) {
          screenshots.push(f);
        }
      }
    }

    // Collect videos
    const videosDir = path.join(outputDir, "videos");
    const videos: string[] = [];
    if (fs.existsSync(videosDir)) {
      for (const f of fs.readdirSync(videosDir)) {
        if (/\.(webm|mp4)$/i.test(f)) {
          videos.push(f);
        }
      }
    }

    const statusColor =
      rec.status === "passed"
        ? "#4caf50"
        : rec.status === "failed"
          ? "#f44336"
          : rec.status === "skipped"
            ? "#ff9800"
            : "#9e9e9e";

    const durationSec = (rec.duration / 1000).toFixed(1);

    const errorsHtml = rec.errors.length
      ? `<div class="section">
          <h2>Errors</h2>
          ${rec.errors.map((e) => `<pre class="error">${escapeHtml(e)}</pre>`).join("\n")}
        </div>`
      : "";

    const screenshotsHtml = screenshots.length
      ? `<div class="section">
          <h2>Screenshots (${screenshots.length})</h2>
          <div class="gallery">
            ${screenshots
              .map(
                (s) =>
                  `<figure>
                    <a href="screenshots/${encodeURIComponent(s)}" target="_blank">
                      <img src="screenshots/${encodeURIComponent(s)}" alt="${escapeHtml(s)}" />
                    </a>
                    <figcaption>${escapeHtml(s)}</figcaption>
                  </figure>`,
              )
              .join("\n")}
          </div>
        </div>`
      : "";

    const videosHtml = videos.length
      ? `<div class="section">
          <h2>Videos (${videos.length})</h2>
          ${videos
            .map(
              (v) =>
                `<div class="video-container">
                  <video controls width="100%">
                    <source src="videos/${encodeURIComponent(v)}" type="video/${v.endsWith(".webm") ? "webm" : "mp4"}" />
                    Your browser does not support the video tag.
                  </video>
                  <p>${escapeHtml(v)}</p>
                </div>`,
            )
            .join("\n")}
        </div>`
      : "";

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(testCaseId)} — Test Report</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
           background: #f5f5f5; color: #333; padding: 24px; }
    .container { max-width: 1100px; margin: 0 auto; }
    header { background: #fff; border-radius: 8px; padding: 24px 32px;
             box-shadow: 0 1px 3px rgba(0,0,0,.12); margin-bottom: 24px; }
    header h1 { font-size: 1.6rem; margin-bottom: 12px; }
    .badge { display: inline-block; padding: 4px 14px; border-radius: 4px;
             color: #fff; font-weight: 600; font-size: .85rem; text-transform: uppercase; }
    .meta { margin-top: 10px; color: #666; font-size: .9rem; }
    .meta span { margin-right: 20px; }
    .section { background: #fff; border-radius: 8px; padding: 20px 28px;
               box-shadow: 0 1px 3px rgba(0,0,0,.12); margin-bottom: 20px; }
    .section h2 { font-size: 1.15rem; margin-bottom: 14px; border-bottom: 1px solid #eee;
                   padding-bottom: 8px; }
    .error { background: #fff5f5; border-left: 4px solid #f44336; padding: 12px 16px;
             overflow-x: auto; font-size: .82rem; color: #c62828; margin-bottom: 10px;
             border-radius: 0 4px 4px 0; white-space: pre-wrap; word-break: break-word; }
    .gallery { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
               gap: 16px; }
    .gallery figure { text-align: center; }
    .gallery img { max-width: 100%; border-radius: 4px; border: 1px solid #ddd; cursor: pointer; }
    .gallery figcaption { font-size: .78rem; color: #888; margin-top: 6px; word-break: break-all; }
    .video-container { margin-bottom: 16px; }
    .video-container p { font-size: .82rem; color: #888; margin-top: 4px; }
    footer { text-align: center; color: #aaa; font-size: .75rem; margin-top: 32px; }
  </style>
</head>
<body>
<div class="container">
  <header>
    <h1>${escapeHtml(testCaseId)}: ${escapeHtml(rec.title)}</h1>
    <span class="badge" style="background:${statusColor}">${escapeHtml(rec.status)}</span>
    <div class="meta">
      <span><strong>Duration:</strong> ${durationSec}s</span>
      <span><strong>Store:</strong> ${escapeHtml(rec.storeId)}</span>
      <span><strong>Retry:</strong> ${rec.retries}</span>
    </div>
  </header>
  ${errorsHtml}
  ${screenshotsHtml}
  ${videosHtml}
  <footer>Generated by per-test-html-reporter</footer>
</div>
</body>
</html>`;

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    fs.writeFileSync(path.join(outputDir, "index.html"), html, "utf-8");
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export default PerTestHtmlReporter;
