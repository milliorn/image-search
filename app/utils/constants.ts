/** Default number of photos per page. */
const IMAGES_PER_PAGE = 12;

/**
 * Valid per-page options. Each value is a multiple of 6 (LCM of 1, 2, 3),
 * so results divide evenly across 1-, 2-, and 3-column grid layouts.
 * Max is 30 per the Unsplash API limit.
 */
const PER_PAGE_OPTIONS = [12, 18, 24, 30];

/** Maximum number of pages supported by the Unsplash search API. */
const UNSPLASH_MAX_PAGES = 200;

/** Preset search category labels shown as filter buttons on the home page. */
const imageButtons = [
  "animals",
  "anime",
  "art",
  "food",
  "home",
  "music",
  "nature",
  "seasons",
  "space",
  "sports",
  "travel",
  "wallpaper",
];

export { imageButtons, IMAGES_PER_PAGE, PER_PAGE_OPTIONS, UNSPLASH_MAX_PAGES };
