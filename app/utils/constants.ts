/** Number of photos to request per Unsplash API page. */
const IMAGES_PER_PAGE = 12;

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

export { imageButtons, IMAGES_PER_PAGE, UNSPLASH_MAX_PAGES };
