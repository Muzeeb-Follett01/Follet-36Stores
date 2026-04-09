import { Page, Locator } from "playwright";
import { expect, TestInfo } from "playwright/test";
import { Helper } from "../../utils/helper";
import { BasePage } from "../basePage";
import testData from "../../utils/excelToTestData";

/**
 * Follett Bookstore – Course Builder / Textbooks Page Object Model
 *
 * Handles the Textbooks course-list builder workflow:
 *   Header → Textbooks → BUILD COURSE LIST → Fill course details → ADD COURSE
 *
 * @class FollettCourseBuilderPage
 */
export class FollettCourseBuilderPage extends BasePage {
  // --- Header Navigation ---
  readonly textbooksLink: Locator;

  // --- Course Materials Results page ---
  readonly buildCourseListLink: Locator;

  // --- Course Builder Form ---
  readonly campusSelect: Locator;
  readonly termSelect: Locator;
  readonly divisionSelect: Locator;
  readonly departmentSelect: Locator;
  readonly courseSelect: Locator;
  readonly sectionSelect: Locator;
  readonly addCourseBtn: Locator;

  // --- Course Tag Verification ---
  readonly courseTag: Locator;

  /**
   * Constructor – initialise all locators
   * @param page - Playwright Page instance
   */
  constructor(page: Page, testId: string) {
    super(page);
    console.log("🚀 Initialising FollettCourseBuilderPage");
    const td = testData[testId] ?? {};
    const textbooksLinkText = td.textbooksLinkText ?? "Textbooks";
    const buildCourseListBtnText =
      td.buildCourseListBtnText ?? "BUILD COURSE LIST";
    const addCourseBtnText = td.addCourseBtnText ?? "ADD COURSE";

    // Header "Textbooks" navigation link
    this.textbooksLink = page
      .getByRole("link", { name: new RegExp(textbooksLinkText, "i") })
      .first();

    // "BUILD COURSE LIST" link on the course materials results page
    this.buildCourseListLink = page.getByRole("button", {
      name: new RegExp(buildCourseListBtnText, "i"),
    });

    // Course builder dropdowns – IDs match the actual Shopify page elements
    // Campus and Term use label associations; Course/Section have explicit IDs
    this.campusSelect = page
      .locator("#campus, select[name='campus']")
      .or(page.getByLabel("Campus"))
      .first();
    this.termSelect = page
      .locator("(//select[@id='term'])[1]")
      .or(page.getByLabel("Term"))
      .first();
    this.divisionSelect = page
      .locator("//select[@id='division']")
      .first();
    this.departmentSelect = page
      .locator("#department, select[name='department']")
      .first();
    this.courseSelect = page.locator("#course, select[name='course']").first();
    this.sectionSelect = page
      .locator("#section, select[name='section']")
      .first();

    // "ADD COURSE" button
    this.addCourseBtn = page.getByRole("button", {
      name: new RegExp(addCourseBtnText, "i"),
    });

    // Course tag confirmed after adding a course
    this.courseTag = page.locator(".course-tag, [class*='course-tag']").first();
  }

  /**
   * Click the "Textbooks" link in the site header
   * @param testInfo - Optional TestInfo for screenshots
   */
  async clickTextbooks(testInfo?: TestInfo) {
    console.log("📚 Clicking Textbooks header link");
    await expect(this.textbooksLink).toBeVisible({ timeout: 10000 });
    await this.textbooksLink.click();
    await this.page.waitForLoadState("domcontentloaded");

    if (testInfo) {
      await Helper.takeScreenshotToFile(
        this.page,
        "TextbooksClicked",
        testInfo,
      );
    }
    await this.delay(5000); // Short delay to allow page transition
    return this;
  }

  /**
   * Click "BUILD COURSE LIST" on the course materials results page
   * @param testInfo - Optional TestInfo for screenshots
   */
  async clickBuildCourseList(testInfo?: TestInfo) {
    console.log("📋 Clicking BUILD COURSE LIST");
    await expect(this.buildCourseListLink).toBeVisible({ timeout: 10000 });
    await this.buildCourseListLink.click();
    // Wait for the course builder form dropdowns to render
    await this.page.waitForLoadState("domcontentloaded");

    if (testInfo) {
      await Helper.takeScreenshotToFile(
        this.page,
        "BuildCourseListClicked",
        testInfo,
      );
    }
    return this;
  }

  /**
   * Fill all course builder form fields via the dropdown selects.
   * Division and Department may populate automatically after Campus/Term selection.
   *
   * @param details - Course selection details
   * @param testInfo - Optional TestInfo for screenshots
   */
  async fillCourseDetails(
    details: {
      campus: string;
      term: string;
      division?: string;
      department?: string;
      course: string;
      section: string;
    },
    testInfo?: TestInfo,
  ) {
    console.log("🎓 Filling course details:", details);

    // Wait for the course builder form to be fully rendered
    await this.page.waitForLoadState("domcontentloaded");

    // Campus
    await expect(this.campusSelect).toBeVisible({ timeout: 15000 });
    await this.campusSelect.selectOption(String(details.campus));
    await this.delay(2000); // Short delay

    // Term
    await expect(this.termSelect).toBeEnabled({ timeout: 10000 });
    await expect(this.termSelect).toBeVisible({ timeout: 10000 });
    await this.termSelect.selectOption(String(details.term));
    await this.delay(2000); // Short delay

    // Division (may auto-select after Campus/Term)
    await expect(this.divisionSelect).toBeEnabled({ timeout: 10000 });
    if (details.division) {
      try {
        await this.divisionSelect.selectOption(String(details.division), {
          timeout: 5000,
        });
        await expect(this.departmentSelect).toBeEnabled({ timeout: 10000 });
      } catch {
        console.log("ℹ️ Division auto-selected or not required");
      }
    }
    await this.delay(2000); // Short delay
    // Department (may auto-select)
    if (details.department) {
      try {
        await this.departmentSelect.selectOption(String(details.department), {
          timeout: 5000,
        });
        await expect(this.courseSelect).toBeEnabled({ timeout: 10000 });
      } catch {
        console.log("ℹ️ Department auto-selected or not required");
      }
    }
    await this.delay(2000); // Short delay
    // Course
    await expect(this.courseSelect).toBeVisible({ timeout: 10000 });
    await this.courseSelect.selectOption(String(details.course));
    await expect(this.sectionSelect).toBeEnabled({ timeout: 10000 });
    await this.delay(2000); // Short delay
    // Section
    await expect(this.sectionSelect).toBeVisible({ timeout: 10000 });
    await this.sectionSelect.selectOption(String(details.section));

    if (testInfo) {
      await Helper.takeScreenshotToFile(
        this.page,
        "CourseDetailsFilled",
        testInfo,
      );
    }
    await this.delay(10000); // Randomize delay
    return this;
  }

  /**
   * Fill course builder for prod store (no campus / division dropdowns).
   * Sequence: Term → Department → Course → Section.
   *
   * @param details - { term, department, course, section }
   * @param testInfo - Optional TestInfo for screenshots
   */
  async fillProdCourseDetails(
    details: {
      term: string;
      division?: string;
      Division?: string;
      department: string;
      course: string;
      section: string;
    },
    testInfo?: TestInfo,
  ) {
    console.log(
      `🎓 Filling prod course – ${details.department} / ${details.course} / Sec ${details.section}`,
    );

    // if(details.campus!==undefined||details.campus!==""){
    // console.log("Campus selection detected, attempting to select campus:", details.campus);
    // await expect(this.campusSelect).toBeVisible({ timeout: 15000 });
    // await this.campusSelect.selectOption(String(details.campus), {
    //   timeout: 10000,
    // });
    // await this.delay(2000); // Short delay
    // }

    await expect(this.termSelect).toBeVisible({ timeout: 15000 });
    // Wait for real term options to be populated (they load dynamically via JS)
    await this.page.waitForFunction(
      () => {
        const sel = document.querySelector<HTMLSelectElement>('#term') ??
                    document.querySelector<HTMLSelectElement>('select[aria-label="Term"]');
        if (!sel) return false;
        const real = Array.from(sel.options).filter(
          (o) => o.value && !o.disabled && !/^(\s*-*\s*select|choose)/i.test(o.text.trim()),
        );
        return real.length > 0;
      },
      null,
      { timeout: 20000 },
    );
    const termValue = String(details.term);
    try {
      await this.termSelect.selectOption(termValue, { timeout: 5000 });
    } catch {
      // Value match failed – try matching by visible label text
      console.log(`⚠️ Term value "${termValue}" not found, trying label match`);
      const options = await this.termSelect.locator('option').allTextContents();
      console.log('Available term options:', options);
      const match = options.find(
        (o) => o.trim().toLowerCase().includes(termValue.toLowerCase()) ||
               termValue.toLowerCase().includes(o.trim().toLowerCase()),
      );
      if (match) {
        console.log(`✅ Matched term label: "${match}"`);
        await this.termSelect.selectOption({ label: match.trim() }, { timeout: 5000 });
      } else {
        // Last resort: select by index (first real option)
        const realOptions = options.filter((o) => o.trim() !== '' && !o.trim().toLowerCase().startsWith('select'));
        if (realOptions.length > 0) {
          console.log(`⚠️ No match found – selecting first available term: "${realOptions[0]}"`);
          await this.termSelect.selectOption({ label: realOptions[0].trim() }, { timeout: 5000 });
        } else {
          throw new Error(`No matching term option found for "${termValue}". Available: ${options.join(', ')}`);
        }
      }
    }
    await this.delay(2000); // Short delay

    // Division (optional – only present on some stores)
    const divisionVal = details.division || details.Division;
    if (divisionVal) {
      try {
        await this.divisionSelect.waitFor({ state: 'visible', timeout: 5000 });
        await expect(this.divisionSelect).toBeEnabled({ timeout: 10000 });
        const divisionValue = String(divisionVal);
        try {
          await this.divisionSelect.selectOption(divisionValue, { timeout: 5000 });
        } catch {
          console.log(`⚠️ Division value "${divisionValue}" not found, trying label match`);
          const divisionOptions = await this.divisionSelect.locator('option').allTextContents();
          console.log('Available division options:', divisionOptions);
          const divisionMatch = divisionOptions.find(
            (o) => o.trim().toLowerCase().includes(divisionValue.toLowerCase()) ||
                   divisionValue.toLowerCase().includes(o.trim().toLowerCase()),
          );
          if (divisionMatch) {
            await this.divisionSelect.selectOption({ label: divisionMatch.trim() }, { timeout: 5000 });
          } else {
            throw new Error(`No matching division option for "${divisionValue}". Available: ${divisionOptions.join(', ')}`);
          }
        }
        await this.delay(2000);
        console.log(`✅ Division selected: ${divisionVal}`);
      } catch (e: any) {
        if (e.message?.includes('No matching division option')) throw e;
        console.log('ℹ️ Division dropdown not visible or not required, skipping');
      }
    }

    await expect(this.departmentSelect).toBeEnabled({ timeout: 10000 });
    const deptValue = String(details.department);
    try {
      await this.departmentSelect.selectOption(deptValue, { timeout: 10000 });
    } catch {
      console.log(`⚠️ Department value "${deptValue}" not found, trying label match`);
      const deptOptions = await this.departmentSelect.locator('option').allTextContents();
      console.log('Available department options:', deptOptions);
      const deptMatch = deptOptions.find(
        (o) => o.trim().toLowerCase().includes(deptValue.toLowerCase()) ||
               deptValue.toLowerCase().includes(o.trim().toLowerCase()),
      );
      if (deptMatch) {
        await this.departmentSelect.selectOption({ label: deptMatch.trim() }, { timeout: 5000 });
      } else {
        throw new Error(`No matching department option for "${deptValue}". Available: ${deptOptions.join(', ')}`);
      }
    }
    await this.delay(2000); // Short delay

    await expect(this.courseSelect).toBeEnabled({ timeout: 10000 });
    const courseValue = String(details.course);
    try {
      await this.courseSelect.selectOption(courseValue, { timeout: 10000 });
    } catch {
      console.log(`⚠️ Course value "${courseValue}" not found, trying label match`);
      const courseOptions = await this.courseSelect.locator('option').allTextContents();
      console.log('Available course options:', courseOptions);
      const courseMatch = courseOptions.find(
        (o) => o.trim().toLowerCase().includes(courseValue.toLowerCase()) ||
               courseValue.toLowerCase().includes(o.trim().toLowerCase()),
      );
      if (courseMatch) {
        await this.courseSelect.selectOption({ label: courseMatch.trim() }, { timeout: 5000 });
      } else {
        throw new Error(`No matching course option for "${courseValue}". Available: ${courseOptions.join(', ')}`);
      }
    }
    await this.delay(2000); // Short delay

    await expect(this.sectionSelect).toBeEnabled({ timeout: 10000 });
    const sectionValue = String(details.section);
    try {
      await this.sectionSelect.selectOption(sectionValue, { timeout: 15000 });
    } catch {
      console.log(`⚠️ Section value "${sectionValue}" not found, trying label match`);
      const sectionOptions = await this.sectionSelect.locator('option').allTextContents();
      console.log('Available section options:', sectionOptions);
      const sectionMatch = sectionOptions.find(
        (o) => o.trim().toLowerCase().includes(sectionValue.toLowerCase()) ||
               sectionValue.toLowerCase().includes(o.trim().toLowerCase()),
      );
      if (sectionMatch) {
        await this.sectionSelect.selectOption({ label: sectionMatch.trim() }, { timeout: 5000 });
      } else {
        throw new Error(`No matching section option for "${sectionValue}". Available: ${sectionOptions.join(', ')}`);
      }
    }

    if (testInfo) {
      await Helper.takeScreenshotToFile(
        this.page,
        "ProdCourseDetailsFilled",
        testInfo,
      );
    }
    await this.delay(10000); // Randomized delay

    return this;
  }

  /**
   * Fill only department → course → section, skipping the term dropdown.
   * Use this for a second course that shares the same already-selected term.
   *
   * @param details - { department, course, section }
   * @param testInfo - Optional TestInfo for screenshots
   */
  async fillProdCourseDetailsWithoutTerm(
    details: {
      division?: string;
      Division?: string;
      department: string;
      course: string;
      section: string;
    },
    testInfo?: TestInfo,
  ) {
    console.log(
      `🎓 Filling course (no term) – ${details.department} / ${details.course} / Sec ${details.section}`,
    );

    // Division (optional – only present on some stores)
    const divisionVal = details.division || details.Division;
    if (divisionVal) {
      try {
        await this.divisionSelect.waitFor({ state: 'visible', timeout: 5000 });
        await expect(this.divisionSelect).toBeEnabled({ timeout: 10000 });
        const divisionValue = String(divisionVal);
        try {
          await this.divisionSelect.selectOption(divisionValue, { timeout: 5000 });
        } catch {
          console.log(`⚠️ Division value "${divisionValue}" not found, trying label match`);
          const divisionOptions = await this.divisionSelect.locator('option').allTextContents();
          console.log('Available division options:', divisionOptions);
          const divisionMatch = divisionOptions.find(
            (o) => o.trim().toLowerCase().includes(divisionValue.toLowerCase()) ||
                   divisionValue.toLowerCase().includes(o.trim().toLowerCase()),
          );
          if (divisionMatch) {
            await this.divisionSelect.selectOption({ label: divisionMatch.trim() }, { timeout: 5000 });
          } else {
            throw new Error(`No matching division option for "${divisionValue}". Available: ${divisionOptions.join(', ')}`);
          }
        }
        await this.delay(2000);
        console.log(`✅ Division selected: ${divisionVal}`);
      } catch (e: any) {
        if (e.message?.includes('No matching division option')) throw e;
        console.log('ℹ️ Division dropdown not visible or not required, skipping');
      }
    }

    await expect(this.departmentSelect).toBeEnabled({ timeout: 10000 });
    await this.departmentSelect.selectOption(String(details.department), {
      timeout: 10000,
    });
    await this.delay(2000); // Short delay

    await expect(this.courseSelect).toBeEnabled({ timeout: 10000 });
    await this.courseSelect.selectOption(String(details.course), {
      timeout: 10000,
    });
    await this.delay(2000); // Short delay

    await expect(this.sectionSelect).toBeEnabled({ timeout: 10000 });
    await this.sectionSelect.selectOption(String(details.section), {
      timeout: 15000,
    });

    if (testInfo) {
      await Helper.takeScreenshotToFile(
        this.page,
        "ProdCourseDetailsFilled_NoTerm",
        testInfo,
      );
    }
    await this.delay(10000); // Randomized delay
    return this;
  }

  /**
   * Click the "ADD COURSE" button and verify the course tag appears
   * @param testInfo - Optional TestInfo for screenshots
   */
  async clickAddCourse(testInfo?: TestInfo) {
    console.log("➕ Clicking ADD COURSE");
    await expect(this.addCourseBtn).toBeVisible({ timeout: 10000 });
    await this.addCourseBtn.click();
    await this.page.waitForLoadState("domcontentloaded");

    if (testInfo) {
      await Helper.takeScreenshotToFile(this.page, "CourseAdded", testInfo);
    }
    await this.delay(10000); // Randomized delay
    return this;
  }

  /**
   * Full course list building flow:
   *   clickTextbooks → clickBuildCourseList → fillCourseDetails → clickAddCourse
   *
   * @param courseDetails - All course selection data
   * @param testInfo - Optional TestInfo for screenshots
   */
  async buildCourseList(
    courseDetails: {
      campus: string;
      term: string;
      division?: string;
      department?: string;
      course: string;
      section: string;
    },
    testInfo?: TestInfo,
  ) {
    await this.clickTextbooks(testInfo);
    await this.clickBuildCourseList(testInfo);
    await this.fillCourseDetails(courseDetails, testInfo);
    await this.clickAddCourse(testInfo);
    return this;
  }
}
