import {
  COLORS,
  imageButtons,
  IMAGES_PER_PAGE,
  LANGUAGES,
  PER_PAGE_OPTIONS,
  UNSPLASH_MAX_PAGES,
} from "@/app/utils/constants";

describe("IMAGES_PER_PAGE", () => {
  it("is 12", () => {
    expect(IMAGES_PER_PAGE).toBe(12);
  });
});

describe("PER_PAGE_OPTIONS", () => {
  it("is [12, 18, 24, 30]", () => {
    expect(PER_PAGE_OPTIONS).toEqual([12, 18, 24, 30]);
  });

  it("every value is a multiple of 6", () => {
    PER_PAGE_OPTIONS.forEach((n) => {
      expect(n % 6).toBe(0);
    });
  });

  it("no value exceeds the Unsplash per-page limit of 30", () => {
    PER_PAGE_OPTIONS.forEach((n) => {
      expect(n).toBeLessThanOrEqual(30);
    });
  });
});

describe("UNSPLASH_MAX_PAGES", () => {
  it("is 200", () => {
    expect(UNSPLASH_MAX_PAGES).toBe(200);
  });
});

describe("imageButtons", () => {
  it("is non-empty", () => {
    expect(imageButtons.length).toBeGreaterThan(0);
  });

  it("every entry is a lowercase string", () => {
    imageButtons.forEach((label) => {
      expect(label).toBe(label.toLowerCase());
    });
  });
});

describe("COLORS", () => {
  it("first entry is the any-color default with an empty value", () => {
    expect(COLORS[0]).toEqual({ value: "", label: "Any Color" });
  });

  it("every entry has a non-empty label", () => {
    COLORS.forEach(({ label }) => {
      expect(label.length).toBeGreaterThan(0);
    });
  });

  it("every entry after the first has a non-empty value", () => {
    COLORS.slice(1).forEach(({ value }) => {
      expect(value.length).toBeGreaterThan(0);
    });
  });
});

describe("LANGUAGES", () => {
  it("includes English", () => {
    expect(LANGUAGES).toContainEqual({ code: "en", label: "English" });
  });

  it("every entry has a non-empty code and label", () => {
    LANGUAGES.forEach(({ code, label }) => {
      expect(code.length).toBeGreaterThan(0);
      expect(label.length).toBeGreaterThan(0);
    });
  });
});
