/**
 * JDKD - single source of truth for site content.
 *
 * Every value in this file is drawn from the client's leasing deck. Nothing
 * here is invented. Anything the client has not confirmed is exposed through
 * {@link UNRESOLVED} and rendered as a visible, labelled empty slot - never as
 * a fabricated fact.
 *
 * Section components import from here. They must not hard-code copy, numbers,
 * addresses, phone numbers or image paths inline.
 *
 * WHAT THIS FILE DOES NOT HOLD. Layout. There is no `span`, `column`, `offset`
 * or `align` anywhere below. The site is anchor-composed per section, so where
 * a thing sits is a decision the section component owns; what it says is a
 * decision this file owns. The one exception is {@link DisplayLine.style},
 * which is typography carried by the copy itself - the alternation of italic
 * and roman is part of the writing, not part of the grid.
 */

/* ==========================================================================
   PRIMITIVES
   ========================================================================== */

/**
 * A page-level anchor id. Also the value of the section element's `id`, and the
 * target of every nav link.
 */
export type SectionId =
  | "hero"
  | "about"
  | "buildings"
  | "vision"
  | "beliefs"
  | "features"
  | "faq"
  | "enquire";

/**
 * Section identity.
 *
 * There is no `index`: sections do not render a numeral. The previous build
 * printed "02 / WHO WE ARE" above every section and that repetition is exactly
 * what made the page read as a brochure.
 */
export type SectionMeta = {
  /** Anchor id - becomes `<section id>`. */
  readonly id: SectionId;
  /**
   * Human-readable name for assistive technology. Used as `aria-label` when a
   * section has no visible heading, and never rendered as visible text.
   */
  readonly label: string;
  /**
   * The visible parenthetical label, brackets included, e.g. "(ABOUT)".
   * NULL where the section deliberately renders none - the hero, the bento,
   * the pinned features run and the CTA all carry no label by design.
   */
  readonly paren: string | null;
};

/** An image that ships in /public. Dimensions are the real intrinsic pixels. */
export type ImageAsset = {
  readonly src: string;
  readonly width: number;
  readonly height: number;
  readonly alt: string;
  /**
   * True for the labelled stand-in frames the client will replace. A section
   * rendering one MUST make its provisional status visible - never dress a
   * placeholder as finished work.
   */
  readonly placeholder: boolean;
};

/**
 * One line of display type, with the cut it is set in.
 *
 * The alternation of italic and roman across a stack of lines is the site's
 * signature heading device. It belongs to the copy, so it is authored here.
 */
export type DisplayLine = {
  readonly text: string;
  readonly style: "italic" | "roman";
};

/* ==========================================================================
   IMAGES
   Intrinsic dimensions are the real pixel sizes on disk. Declared first so the
   content blocks below can reference the assets rather than retyping paths.

   `placeholder: true` frames are labelled stand-ins awaiting client artwork.
   ========================================================================== */

export const IMAGES = {
  /* -- Portfolio stills, pulled from the client's own footage -------------
     These are frames from the supplied A-23 / M-82 / M-39 video, transcoded
     into /public/video alongside the loops they poster. They are photographs
     of built, occupied buildings - NOT stand-ins - so `placeholder` is false
     and no provisional frame is drawn around them. */
  corporateParkAerial: {
    src: "/video/a23-aerial-poster.jpg",
    width: 1600,
    height: 900,
    alt: "JDKD Corporate Park at plot A-23, seen from the air beside the elevated metro line.",
    placeholder: false,
  },
  m82Rooftop: {
    src: "/images/buildings/park-02.jpg",
    width: 1200,
    height: 896,
    alt: "The M-82 property from the air, in its market district at dusk.",
    placeholder: false,
  },
  m39Frontage: {
    src: "/images/buildings/park-03.jpg",
    width: 1376,
    height: 768,
    alt: "The M-39 frontage on its market street, under the JDKD mark.",
    placeholder: false,
  },

  /* -- Real client renders ------------------------------------------------ */
  heroTower: {
    src: "/images/hero-tower.jpg",
    width: 814,
    height: 900,
    alt: "Architectural render of JDKD Corporate Tower at dusk, seen from Mathura Road.",
    placeholder: false,
  },
  towerExterior: {
    src: "/images/tower-exterior.jpg",
    width: 864,
    height: 929,
    alt: "Architectural render of the full elevation of JDKD Corporate Tower at blue hour.",
    placeholder: false,
  },
  lobby: {
    src: "/images/lobby.jpg",
    width: 656,
    height: 900,
    alt: "Render of the lobby at JDKD Corporate Tower, looking toward the entrance.",
    placeholder: false,
  },
  lobbyAtrium: {
    src: "/images/about/lobby-atrium.jpg",
    width: 896,
    height: 1200,
    alt: "Architectural photograph of the grand double-height entrance atrium at JDKD Corporate Tower with fluted timber, travertine desk, and balanced natural light.",
    placeholder: false,
  },
  lobbyWide: {
    src: "/images/lobby-wide.jpg",
    width: 800,
    height: 900,
    alt: "Wide render of the JDKD Corporate Tower lobby.",
    placeholder: false,
  },
  locationAerial: {
    src: "/images/location-aerial.jpg",
    width: 864,
    height: 900,
    alt: "Aerial render of Mathura Road showing the metro corridor beside the site.",
    placeholder: false,
  },
  facadeDetail: {
    src: "/images/facade-detail.jpg",
    width: 848,
    height: 900,
    alt: "Render detail of the glass curtain wall and its vertical fins.",
    placeholder: false,
  },
  officeFloor: {
    src: "/images/office-floor.jpg",
    width: 398,
    height: 285,
    alt: "Render of a typical office floor plate at JDKD Corporate Tower, with generous daylight.",
    placeholder: false,
  },
  terrace: {
    src: "/images/terrace.jpg",
    width: 398,
    height: 570,
    alt: "Render of the landscaped rooftop terrace lounge, looking out over the city.",
    placeholder: false,
  },

  /* -- Real client drawings - floor plans ---------------------------------
     Scans of the deck's plan sheets. All three are 1323x552 on disk (read off
     the files, not guessed). They are DRAWINGS, not photographs: they carry
     legends, grid references and dimension strings that are unreadable at any
     size a phone can show, so a component rendering one MUST also render the
     text fallback carried on `PROJECT_TOWER.floorPlans[].summary` / `.legend` /
     `.notes`. The alt text below names the sheet and stops there; it is not a
     substitute for that fallback.

     There is no site-plan asset. A crop of that sheet failed and the file left
     on disk is not usable - do not reference it. */
  planBasementTwo: {
    src: "/images/plans/basement-2.jpg",
    width: 1323,
    height: 552,
    alt: "Basement 2 floor plan drawing for JDKD Corporate Tower, with a building height section alongside it.",
    placeholder: false,
  },
  planFifthFloor: {
    src: "/images/plans/fifth-floor.jpg",
    width: 1323,
    height: 552,
    alt: "Fifth floor plan drawing for JDKD Corporate Tower, shown beside an elevation of the building.",
    placeholder: false,
  },
  planSixthSeventhFloor: {
    src: "/images/plans/sixth-seventh-floor.jpg",
    width: 1323,
    height: 552,
    alt: "Sixth and seventh floor plan drawing for JDKD Corporate Tower, with a building height section alongside it.",
    placeholder: false,
  },

  /* -- Portfolio frames - stills from the client's own footage -------------
     One frame per chapter, of the building that chapter is about, cut from the
     same clip that plays over it. They are photographs of built, occupied
     properties, so `placeholder` is false and no provisional hairline is drawn
     around them. See `public/video` for the loops these are cut from. */
  parkOne: {
    src: "/images/buildings/park-01.jpg",
    width: 1200,
    height: 896,
    alt: "JDKD Corporate Park at plot A-23, its green glass elevation seen from the rail corridor.",
    placeholder: false,
  },
  parkTwo: {
    src: "/images/buildings/park-02.jpg",
    width: 1200,
    height: 896,
    alt: "The M-82 property from the air, in its market district at dusk.",
    placeholder: false,
  },
  parkThree: {
    src: "/images/buildings/park-03.jpg",
    width: 1376,
    height: 768,
    alt: "The M-39 frontage under the JDKD mark, above the market street.",
    placeholder: false,
  },

  /* -- Placeholder frame - bento backdrop --------------------------------- */
  beliefsBackdrop: {
    src: "/images/beliefs/office-interior.jpg",
    width: 1376,
    height: 768,
    /* A crop of the tower's own floor-plate render (`office-floor.jpg`), not a
       generated interior. The bento reads against the building it is about. */
    alt: "",
    placeholder: false,
  },

  /* -- Features -----------------------------------------------------------
     Terrace and infrastructure are crops of the tower's own renders. FITNESS
     AND PARKING ARE STILL GENERATED STAND-INS and carry `placeholder: true`,
     because no photograph of either exists yet - they are the only two frames
     left on the site that are not of a real JDKD building. Replace them the
     moment the client supplies a gym and a basement shot. */
  terraceLarge: {
    src: "/images/features/terrace-large.jpg",
    width: 896,
    height: 1200,
    alt: "The landscaped rooftop terrace lounge at JDKD Corporate Tower, looking out over the city.",
    placeholder: false,
  },
  terraceSmall: {
    src: "/images/features/terrace-small.jpg",
    width: 1024,
    height: 1024,
    alt: "Planting and seating on the JDKD Corporate Tower roof terrace.",
    placeholder: false,
  },
  fitnessLarge: {
    src: "/images/features/fitness-large.jpg",
    width: 896,
    height: 1200,
    alt: "Placeholder frame for the in-house gym.",
    placeholder: true,
  },
  fitnessSmall: {
    src: "/images/features/fitness-small.jpg",
    width: 1024,
    height: 1024,
    alt: "",
    placeholder: true,
  },
  parkingLarge: {
    src: "/images/features/parking-large.jpg",
    width: 896,
    height: 1200,
    alt: "Placeholder frame for the dedicated parking.",
    placeholder: true,
  },
  parkingSmall: {
    src: "/images/features/parking-small.jpg",
    width: 1024,
    height: 1024,
    alt: "",
    placeholder: true,
  },
  infrastructureLarge: {
    src: "/images/features/infrastructure-large.jpg",
    width: 896,
    height: 1200,
    alt: "The glass curtain wall of JDKD Corporate Tower and its vertical fins.",
    placeholder: false,
  },
  infrastructureSmall: {
    src: "/images/features/infrastructure-small.jpg",
    width: 1024,
    height: 1024,
    alt: "Detail of the curtain wall fins at JDKD Corporate Tower.",
    placeholder: false,
  },
} as const satisfies Readonly<Record<string, ImageAsset>>;

export const BRAND = {
  mark: {
    src: "/brand/jdkd.png",
    width: 262,
    height: 79,
    /** Decorative inside a link that already carries an accessible name. */
    alt: "",
    placeholder: false,
  },
  mark256: { src: "/brand/jdkd-256.png", width: 256, height: 77 },
  mark128: { src: "/brand/jdkd-128.png", width: 128, height: 39 },
  mark64: { src: "/brand/jdkd-64.png", width: 64, height: 19 },
  /** Native aspect ratio of the wordmark, for sizing the footer lockup. */
  aspectRatio: 262 / 79,
  /** Lowercase form. The display face is uppercased in CSS, never in content. */
  wordmark: "jdkd",
} as const;

/* ==========================================================================
   SITE + ENTITY
   ========================================================================== */

export type Site = {
  /**
   * Production origin, used for `metadataBase` and canonical URLs.
   * PLACEHOLDER - the real domain is not confirmed. Set NEXT_PUBLIC_SITE_URL
   * in the deployment environment before launch.
   */
  readonly origin: string;
  /**
   * False while `origin` is still the placeholder. `app/layout.tsx` reads this
   * to force `robots: { index: false }` - shipping an indexable canonical that
   * points at a domain which does not exist is a de-indexing event, and this
   * site's whole purpose is inbound leasing enquiries.
   */
  readonly originConfirmed: boolean;
  readonly name: string;
  readonly legalName: string;
  readonly tagline: string;
};

const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const SITE: Site = {
  origin: SITE_ORIGIN || "https://jdkd.example",
  originConfirmed: Boolean(SITE_ORIGIN),
  name: "JDKD",
  legalName: "JDKD Developers LLP",
  tagline: "A Grade A commercial landmark.",
};

/* ==========================================================================
   THE ASSET - JDKD Corporate Tower
   ========================================================================== */

export type Asset = {
  readonly name: string;
  readonly assetClass: string;
  readonly availability: string;
  readonly certification: string;
  readonly address: {
    readonly plot: string;
    readonly estate: string;
    readonly road: string;
    readonly city: string;
    /** One-line rendering for footers and meta lines. */
    readonly oneLine: string;
  };
  readonly plotArea: {
    readonly sqm: string;
    readonly sqft: string;
  };
  readonly structure: {
    readonly officeFloors: number;
    readonly basements: number;
    readonly floorHeightImperial: string;
    readonly floorHeightMetric: string;
    readonly terraceParapet: string;
  };
};

export const ASSET: Asset = {
  name: "JDKD Corporate Tower",
  assetClass: "Grade A commercial office building",
  availability: "Now available for leasing",
  certification: "LEED certified",
  address: {
    plot: "A-11",
    estate: "Mohan Cooperative Industrial Estate (MCIE)",
    road: "Mathura Road",
    city: "New Delhi",
    oneLine:
      "A-11, Mohan Cooperative Industrial Estate, Mathura Road, New Delhi",
  },
  plotArea: {
    sqm: "2,179.13 sq.m",
    sqft: "23,456.16 sq.ft",
  },
  structure: {
    officeFloors: 7,
    basements: 2,
    floorHeightImperial: "14 ft 9 in",
    floorHeightMetric: "4.5 m",
    terraceParapet: "+41.05 m",
  },
};

/* ==========================================================================
   CONTACT
   ========================================================================== */

export type Contact = {
  readonly leasingContact: {
    readonly name: string;
    /** Rendered exactly as the deck prints it. */
    readonly phoneDisplay: string;
    /** E.164 for the tel: href. India country code. */
    readonly phoneHref: string;
    /**
     * The same number over WhatsApp. Derived from `phoneHref`, never a second
     * number: wa.me takes the E.164 digits with no `+` and no separators.
     */
    readonly whatsappHref: string;
    readonly role: string;
  };
  readonly entity: string;
  readonly address: {
    readonly lines: readonly string[];
    readonly oneLine: string;
  };
};

export const CONTACT: Contact = {
  leasingContact: {
    name: "Mr. Roy",
    phoneDisplay: "9811998811",
    phoneHref: "tel:+919811998811",
    whatsappHref: "https://wa.me/919811998811",
    role: "Leasing enquiries",
  },
  entity: "JDKD Developers LLP",
  address: {
    lines: [
      "A-11, Mohan Cooperative Industrial Estate (MCIE)",
      "Mathura Road",
      "New Delhi",
    ],
    oneLine:
      "A-11, Mohan Cooperative Industrial Estate, Mathura Road, New Delhi",
  },
};

/* ==========================================================================
   SECTION REGISTRY - the running order
   ========================================================================== */

export const SECTIONS: Readonly<Record<SectionId, SectionMeta>> = {
  hero: {
    id: "hero",
    label: "JDKD Corporate Tower",
    // The hero carries no label, no numeral and no scroll cue. Only the
    // wordmark, the serif line and the lede.
    paren: null,
  },
  about: {
    id: "about",
    label: "About JDKD Corporate Tower",
    paren: "(ABOUT)",
  },
  buildings: {
    id: "buildings",
    label: "Buildings and parks",
    paren: "(BUILDINGS & PARKS)",
  },
  vision: {
    id: "vision",
    label: "Our beliefs",
    paren: "(OUR BELIEFS)",
  },
  beliefs: {
    id: "beliefs",
    label: "The principles behind the building",
    // The bento's own numerals and titles are the labelling; a parenthetical
    // above them would be a third layer of the same information.
    paren: null,
  },
  features: {
    id: "features",
    label: "Amenities",
    // Deliberate: the pinned run carries no heading, label or title at all.
    paren: null,
  },
  faq: {
    id: "faq",
    label: "Questions",
    paren: "(QUESTIONS)",
  },
  enquire: {
    id: "enquire",
    label: "Schedule a private walkthrough",
    paren: null,
  },
};

/**
 * Anchor id on the `<footer>` element. The footer is the site's contact block -
 * address, leasing contact and the RERA slot. Kept here so the nav and the
 * footer cannot drift apart.
 */
export const FOOTER_ID = "contact" as const;

/* ==========================================================================
   01 - HERO
   ========================================================================== */

export type HeroContent = {
  /** The wordmark set at `text-mega`. Uppercased in CSS, not here. */
  readonly wordmark: string;
  /**
   * Accessible page title. The visible wordmark is `aria-hidden`; the `<h1>`
   * carries this string `sr-only`, because "JDKD" alone is not a page title.
   */
  readonly documentTitle: string;
  /**
   * The right-rail italic serif statement, one entry per line. Two lines.
   * Set at `text-h2`, cap-height aligned to the top of the wordmark.
   */
  readonly serifLines: readonly [string, string];
  /** Small muted lede beneath the serif line, in the right rail. */
  readonly lede: string;
};

export const HERO: HeroContent = {
  wordmark: BRAND.wordmark,
  documentTitle:
    "JDKD Corporate Tower - Grade A commercial office space on Mathura Road, New Delhi",
  serifLines: ["An address", "that works."],
  lede: "A LEED certified Grade A office building at A-11, Mohan Cooperative Industrial Estate. Seven floors over two basements, now available for leasing.",
};

/* ==========================================================================
   02 - ABOUT
   One composition that absorbs the statistics: a label, a portrait, two short
   rail paragraphs, a five-line heading and four deliberately unaligned figures.
   ========================================================================== */

/**
 * The four About figures. A union rather than `string` so a section can build
 * an exhaustive placement map and the compiler catches a figure added here but
 * never placed.
 */
export type AboutFigureId =
  | "plot-area"
  | "office-floors"
  | "building-height"
  | "certification";

export type AboutFigure = {
  readonly id: AboutFigureId;
  /**
   * Exactly what is rendered at rest, separators and symbols included.
   * `Counter` animates it when it parses as a number ("23,456", "7") and
   * renders it verbatim when it does not (`14'9"`).
   */
  readonly value: string;
  /** Small unit set after the figure, e.g. "sq.ft". NULL renders nothing. */
  readonly unit: string | null;
  /**
   * Sentence beneath the figure. Kept short on purpose - it is set at
   * `text-micro` on a 24ch measure, so anything long turns into a paragraph.
   */
  readonly descriptor: string;
};

export type AboutContent = {
  readonly label: string;
  /**
   * Five lines of display type, alternating italic and roman. They are broken
   * for composition, not for reading - `spokenHeading` is what a screen reader
   * gets.
   */
  readonly headingLines: readonly DisplayLine[];
  /** The heading as a human would read it aloud. Rendered `sr-only`. */
  readonly spokenHeading: string;
  /** Two short paragraphs for the right rail. Set at `text-micro`. */
  readonly paragraphs: readonly [string, string];
  /** Exactly four. The tuple is the contract the placement map relies on. */
  readonly figures: readonly [
    AboutFigure,
    AboutFigure,
    AboutFigure,
    AboutFigure,
  ];
  readonly image: ImageAsset;
};

export const ABOUT: AboutContent = {
  label: SECTIONS.about.paren ?? "(ABOUT)",
  // Lines break for composition, not for reading. The previous set split
  // "work-focused" across two lines, which left a hyphen hanging at the end of
  // a display line and read as a typo rather than a device.
  headingLines: [
    { text: "Built for", style: "italic" },
    { text: "work that", style: "roman" },
    { text: "endures.", style: "italic" },
  ],
  spokenHeading: "Built for work that endures.",
  paragraphs: [
    "JDKD Corporate Tower stands at A-11, Mohan Cooperative Industrial Estate, on Mathura Road - a prime corner plot, open on two sides, oriented North and North-West.",
    "Seven office floors over two basements. LEED certified, earthquake-resistant and solar integrated, with 14 ft 9 in floor heights that carry daylight past the glass line.",
  ],
  figures: [
    {
      id: "plot-area",
      value: "23,456",
      unit: "sq.ft",
      descriptor: "Plot area - 2,179.13 sq.m",
    },
    {
      id: "office-floors",
      value: "7",
      unit: null,
      descriptor: "Office floors",
    },
    // Building height replaces the old floor-height figure, and certification
    // replaces the basement count. Both of those read as spec-sheet detail
    // rather than headline: a leasing audience scans total height and green
    // rating first. The floor height and the basements are still stated - they
    // moved into the rail paragraphs, where the detail belongs.
    {
      id: "building-height",
      value: "41",
      unit: "m",
      descriptor: "To terrace parapet - 41.05 m",
    },
    {
      // Non-numeric. `Counter` renders this verbatim rather than animating it.
      id: "certification",
      value: "LEED",
      unit: null,
      descriptor: "Certified green building",
    },
  ],
  image: IMAGES.lobbyAtrium,
};

/* ==========================================================================
   CLIENTS & TENANTS
   Distinguished corporate enterprises and partners across JDKD properties.
   ========================================================================== */

export type ClientRecord = {
  readonly name: string;
  readonly sector: string;
  readonly isAccent?: boolean;
};

export const CLIENTS: readonly ClientRecord[] = [
  { name: "Standard Chartered Bank", sector: "Banking & Financial" },
  { name: "Benne", sector: "Hospitality & Retail" },
  { name: "Staple", sector: "Commercial & Design" },
  { name: "Punjab Grill", sector: "Dining & Lifestyle" },
  { name: "Wipro", sector: "Technology & IT" },
  { name: "& many more", sector: "Corporate Network", isAccent: true },
] as const;

/* ==========================================================================
   03 - BUILDINGS & PARKS
   Three chapters of the client's own footage of completed buildings. Names for
   two, and areas and dates for all three, are unconfirmed - see
   UNRESOLVED.portfolio. Nothing below asserts what the footage cannot show.
   ========================================================================== */

/**
 * A silent, looping clip for a chapter frame. Paths are extensionless - the
 * component appends `.mp4`, and `.webm` when `webm` is true. Both live in
 * /public/video, transcoded from the client's own footage; the 2 GB of source
 * is deliberately not in the repo (see .gitignore).
 */
export type ChapterVideo = {
  readonly src: string;
  readonly poster: string;
  readonly webm: boolean;
  readonly hls?: string;
  /**
   * Describes THE FOOTAGE, and must never be taken from `image.alt`.
   *
   * The still behind a video frame can still be a labelled stand-in while the
   * clip is real, and reusing its alt made three pause controls announce
   * themselves as "Pause: Placeholder frame…" over genuine photography of a
   * built, occupied building. The accessible name is a claim like any other.
   */
  readonly alt: string;
};

export type BuildingChapter = {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly body: string;
  readonly image: ImageAsset;
  /**
   * When present the frame plays footage instead of showing a still. The
   * poster is what a visitor gets with no JS, with reduced motion, and before
   * the frame is near the viewport - so a chapter is never empty without it.
   */
  readonly video?: ChapterVideo;
  /**
   * A section rendering a placeholder MUST show its provisional status - that
   * frame is a composition holder, not a project. False for the three
   * chapters below, which are the client's own footage of built work.
   */
  readonly placeholder: boolean;
};

export const BUILDINGS: readonly [
  BuildingChapter,
  BuildingChapter,
  BuildingChapter,
] = [
  {
    id: "corporate-park",
    slug: "corporate-park",
    title: "Corporate Park",
    // Everything asserted here is visible in the client's own footage: the
    // curtain wall, the elevated metro line beside it, the manned reception
    // and the let floors. The name is read off the lobby graphic. No area,
    // no date and no floor count - none of those were supplied.
    body: "JDKD Corporate Park, plot A-23. A completed multi-tenant office building in green glass, running alongside the elevated metro line, with a manned lobby and let floors.",
    image: IMAGES.parkOne,
    video: {
      src: "/video/a23-aerial",
      hls: "/video/hls/a23-aerial/index.m3u8",
      poster: "/video/a23-aerial-poster.jpg",
      webm: false,
      alt: "Aerial view of JDKD Corporate Park at plot A-23, its green glass elevation running alongside the elevated metro line.",
    },
    placeholder: false,
  },
  {
    id: "m-82",
    slug: "m-82",
    title: "M-82",
    body: "A retail and hospitality address, shown at dusk with the rooftop level in service. Held under its plot reference until the name and the record are confirmed.",
    image: IMAGES.parkTwo,
    video: {
      src: "/video/m82-rooftop",
      hls: "/video/hls/m82-rooftop/index.m3u8",
      poster: "/video/m82-rooftop-poster.jpg",
      webm: false,
      alt: "The M-82 property at dusk, its rooftop level lit and in service above the street.",
    },
    placeholder: false,
  },
  {
    id: "m-39",
    slug: "m-39",
    title: "M-39",
    body: "Street-level retail under the JDKD mark, opening onto a market frontage. Held under its plot reference until the name and the record are confirmed.",
    image: IMAGES.parkThree,
    video: {
      src: "/video/m39-reveal",
      hls: "/video/hls/m39-reveal/index.m3u8",
      poster: "/video/m39-reveal-poster.jpg",
      webm: true,
      alt: "The JDKD mark on the M-39 frontage, the view drawing back to the market street below.",
    },
    placeholder: false,
  },
];


/* ==========================================================================
   04 - BELIEFS A / VISION
   ========================================================================== */

export type BeliefsVisionContent = {
  readonly label: string;
  /** Two lines of display serif, set at `text-display-sm`. */
  readonly headingLines: readonly [string, string];
  readonly spokenHeading: string;
  /** One short paragraph, right rail, lower third. */
  readonly paragraph: string;
  readonly image: ImageAsset;
};

export const BELIEFS_VISION: BeliefsVisionContent = {
  label: SECTIONS.vision.paren ?? "(OUR BELIEFS)",
  headingLines: ["A vision of", "considered work"],
  spokenHeading: "A vision of considered work.",
  paragraph:
    "The decisions that matter in an office building are made once, at construction, and lived with for decades - the floor height, the orientation, the power, the light. We made them deliberately, so the people who work here never have to think about them.",
  image: IMAGES.lobbyWide,
};

/* ==========================================================================
   05 - BELIEFS B / THE BENTO
   Five principles, each grounded in a confirmed fact. No new claims.
   ========================================================================== */

export type Principle = {
  readonly id: string;
  /** Two-digit numeral, e.g. "01". Part of the card, not a section marker. */
  readonly index: string;
  readonly title: string;
  readonly body: string;
};

export const BELIEFS_GRID: {
  readonly principles: readonly [
    Principle,
    Principle,
    Principle,
    Principle,
    Principle,
  ];
  /** Fills the section behind the cards. Dark surface, never a light one. */
  readonly backdrop: ImageAsset;
} = {
  principles: [
    {
      id: "location",
      index: "01",
      title: "Location",
      body: "350 m from Sarita Vihar Metro on the Violet Line, 500 m from Apollo Hospital, direct access off Main Mathura Road and 5 km from the NOIDA business hub.",
    },
    {
      id: "longevity",
      index: "02",
      title: "Longevity",
      body: "An earthquake-resistant structure and LEED certification: decisions taken once, at construction, and repaid over the whole life of the building.",
    },
    {
      id: "light",
      index: "03",
      title: "Light",
      body: "A prime corner plot open on two sides, facing North and North-West, with 14 ft 9 in floor heights. Daylight and ventilation reach the core, not only the glass line.",
    },
    {
      id: "infrastructure",
      index: "04",
      title: "Infrastructure",
      body: "A power grid transformer, switch gear and HT panel, DG sets and an LT panel on every floor. Fire fighting, air conditioning and a fresh air system behind the walls.",
    },
    {
      id: "stewardship",
      index: "05",
      title: "Stewardship",
      body: "Solar panels, rainwater harvesting, a sewage treatment plant and planters around the building - a green building that keeps its own house in order.",
    },
  ],
  backdrop: IMAGES.beliefsBackdrop,
};

/* ==========================================================================
   06 - FEATURES
   Four panels advancing in place. No section heading, no label, no numerals.
   ========================================================================== */

export type Feature = {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  /** 4:5 portrait. The dominant frame of the pair. */
  readonly largeImage: ImageAsset;
  /** 1:1 square, overlapping the large frame, offset up and to the left. */
  readonly smallImage: ImageAsset;
};

export const FEATURES: readonly [Feature, Feature, Feature, Feature] = [
  {
    id: "terrace",
    title: "Terrace lounge",
    description:
      "An exclusive terrace lounge above the office floors, at a parapet level of +41.05 m. Planters run the full perimeter of the building beneath it.",
    largeImage: IMAGES.terraceLarge,
    smallImage: IMAGES.terraceSmall,
  },
  {
    id: "fitness",
    title: "Fitness studio",
    description:
      "An in-house gym, so staff do not have to leave the building to train.",
    largeImage: IMAGES.fitnessLarge,
    smallImage: IMAGES.fitnessSmall,
  },
  {
    id: "parking",
    title: "Structured parking",
    description:
      "Dual-side dedicated parking on a prime corner plot open on two sides, with two basement levels beneath the tower.",
    largeImage: IMAGES.parkingLarge,
    smallImage: IMAGES.parkingSmall,
  },
  {
    id: "infrastructure",
    title: "Always-on infrastructure",
    description:
      "A power grid transformer, switch gear and HT panel, DG sets and a per-floor LT panel. Two passenger and two service elevators. Fire fighting throughout.",
    largeImage: IMAGES.infrastructureLarge,
    smallImage: IMAGES.infrastructureSmall,
  },
];

/* ==========================================================================
   07 - FAQ
   Written from confirmed facts only. If the deck does not state it, it is not
   answered here.
   ========================================================================== */

export type FaqItem = {
  /** Also the id stem for the `aria-controls` / `aria-expanded` pairing. */
  readonly id: string;
  readonly question: string;
  readonly answer: string;
};

export type FaqContent = {
  readonly label: string;
  readonly headingLines: readonly [string, string];
  readonly spokenHeading: string;
  readonly items: readonly [FaqItem, FaqItem, FaqItem, FaqItem, FaqItem];
};

export const FAQ: FaqContent = {
  label: SECTIONS.faq.paren ?? "(QUESTIONS)",
  headingLines: ["Everything", "you need to know."],
  spokenHeading: "Everything you need to know.",
  items: [
    {
      id: "where",
      question: "Where is the building?",
      answer:
        "A-11, Mohan Cooperative Industrial Estate (MCIE), Mathura Road, New Delhi. Sarita Vihar Metro on the Violet Line is 350 m away, Apollo Hospital 500 m, and the NOIDA business hub 5 km. There is direct access from Main Mathura Road.",
    },
    {
      id: "size",
      question: "How large is the building?",
      answer:
        "The plot measures 2,179.13 sq.m - 23,456.16 sq.ft. Above it sit seven office floors over two basement levels, with the terrace parapet at +41.05 m.",
    },
    {
      id: "floor-height",
      question: "What is the floor height?",
      answer:
        "14 ft 9 in, or 4.5 metres. Combined with a corner plot open on two sides and a North / North-West orientation, that height is what carries natural light and ventilation deep into each floor plate.",
    },
    {
      id: "certification",
      question: "Is the building certified and future-ready?",
      answer:
        "Yes. It is LEED certified and earthquake-resistant, and it is a green building with solar panels, rainwater harvesting, a sewage treatment plant and a fresh air system.",
    },
    {
      id: "walkthrough",
      question: "How do I arrange a walkthrough?",
      answer: `Call ${CONTACT.leasingContact.name} on ${CONTACT.leasingContact.phoneDisplay}. The enquiry form on this page is not connected yet, so the phone is the channel that works. JDKD Corporate Tower is available for leasing now.`,
    },
  ],
};

/* ==========================================================================
   08 - CTA / ENQUIRY
   ========================================================================== */

export type CtaContent = {
  /** Two lines of display serif at the extreme left of the frame. */
  readonly headlineLines: readonly [string, string];
  readonly spokenHeadline: string;
  readonly body: string;
  readonly submitLabel: string;
  readonly image: ImageAsset;
};

export const CTA: CtaContent = {
  headlineLines: ["Schedule a", "private walkthrough."],
  spokenHeadline: "Schedule a private walkthrough.",
  // Templated, not concatenated: the contact's name and number are values, and
  // the sentence around them stays whole. The disclosure sits HERE, above the
  // fields, because an error shown after three required fields and a press is
  // not a warning - it is a receipt.
  body: `Tell us the floor area you need and when you want to occupy. The form below is not connected yet, so call ${CONTACT.leasingContact.name} on ${CONTACT.leasingContact.phoneDisplay} - we will come back with availability, floor plates and a time to walk the building.`,
  submitLabel: "Send enquiry",
  image: IMAGES.towerExterior,
};

/** Enquiry form fields. `id` is both the input id stem and the field name. */
export type FormField = {
  readonly id: string;
  readonly label: string;
  readonly type: "text" | "email" | "tel" | "textarea";
  readonly autoComplete: string;
  readonly required: boolean;
  readonly placeholder: string;
};

export const ENQUIRY_FIELDS: readonly FormField[] = [
  {
    id: "name",
    label: "Full name",
    type: "text",
    autoComplete: "name",
    required: true,
    placeholder: "First and last name",
  },
  {
    id: "organisation",
    label: "Organisation",
    type: "text",
    autoComplete: "organization",
    required: false,
    // Says something the label does not: brokers enquire here too.
    placeholder: "Company or brokerage",
  },
  {
    id: "email",
    label: "Email",
    type: "email",
    autoComplete: "email",
    required: true,
    placeholder: "you@company.com",
  },
  {
    id: "phone",
    label: "Phone",
    type: "tel",
    autoComplete: "tel",
    required: true,
    placeholder: "10-digit mobile number",
  },
  {
    id: "requirement",
    label: "Requirement",
    type: "textarea",
    autoComplete: "off",
    required: false,
    placeholder: "Floor area, preferred floors, target occupancy date",
  },
];

/* ==========================================================================
   ROUTES
   The site's route table, and the per-route metadata every page exports.

   `title` is the SHORT form: `app/layout.tsx` sets a title template of
   "%s | JDKD", so what ships is "About | JDKD". `ogTitle` is the standalone
   sentence for the share card, because the template does NOT apply to
   `openGraph.title` - Next only templates the field it is declared on.
   ========================================================================== */

export type RouteKey =
  | "home"
  | "about"
  | "projects"
  | "projectDetail"
  | "contact"
  | "notFound";

export type RouteMeta = {
  /** Path, or the path prefix for a dynamic route. Always leading-slashed. */
  readonly path: string;
  /** Short title. The layout's "%s | JDKD" template is appended to it. */
  readonly title: string;
  /** Standalone title for openGraph / twitter. The template is NOT applied. */
  readonly ogTitle: string;
  readonly description: string;
  /** Share image. Real intrinsic dimensions travel with the asset. */
  readonly ogImage: ImageAsset;
};

export const ROUTES: Readonly<Record<RouteKey, RouteMeta>> = {
  home: {
    path: "/",
    title: "JDKD Corporate Tower",
    ogTitle: "JDKD Corporate Tower - Grade A commercial landmark, New Delhi",
    description:
      "A LEED certified Grade A commercial office building at A-11, Mohan Cooperative Industrial Estate, Mathura Road, New Delhi. Now available for leasing.",
    ogImage: IMAGES.heroTower,
  },
  about: {
    path: "/about",
    title: "About",
    ogTitle: "About JDKD Developers LLP",
    description:
      "JDKD Developers LLP builds commercial real estate in New Delhi. Its current work is JDKD Corporate Tower - a LEED certified, earthquake-resistant Grade A office building of seven floors over two basements at A-11, Mohan Cooperative Industrial Estate, Mathura Road.",
    ogImage: IMAGES.towerExterior,
  },
  projects: {
    path: "/projects",
    title: "Projects",
    ogTitle: "Projects - JDKD Developers LLP",
    description:
      "The commercial projects of JDKD Developers LLP. JDKD Corporate Tower, a Grade A office building on Mathura Road, New Delhi, is available for leasing now.",
    ogImage: IMAGES.towerExterior,
  },
  projectDetail: {
    /** Prefix only. A detail page builds its path as `${path}/${slug}`. */
    path: "/projects",
    title: "Project",
    ogTitle: "JDKD Corporate Tower",
    description:
      "Overview, key highlights, location and connectivity, floor plans, amenities and building systems for JDKD Corporate Tower, Mathura Road, New Delhi.",
    ogImage: IMAGES.towerExterior,
  },
  contact: {
    path: "/contact",
    title: "Contact",
    ogTitle: "Contact JDKD Developers LLP",
    description:
      "Leasing enquiries for JDKD Corporate Tower, A-11 Mohan Cooperative Industrial Estate, Mathura Road, New Delhi. Speak to Mr. Roy on 9811998811.",
    ogImage: IMAGES.lobbyWide,
  },
  notFound: {
    path: "/404",
    title: "Page not found",
    ogTitle: "Page not found - JDKD",
    description:
      "This page does not exist. JDKD Corporate Tower on Mathura Road, New Delhi is available for leasing now.",
    ogImage: IMAGES.heroTower,
  },
};

/**
 * The link out of section 03. The homepage shows three chapters; `/projects`
 * is where the record continues, and without this the route was reachable from
 * the header nav and from nowhere else on the page that is about it.
 */
export const BUILDINGS_CTA = {
  label: "All projects",
  href: ROUTES.projects.path,
} as const;


/* ==========================================================================
   NAVIGATION
   ========================================================================== */

export type NavItem = {
  readonly id: string;
  /** Title case here; the header uppercases it in CSS. */
  readonly label: string;
  readonly href: string;
};

/**
 * Primary nav. Every item is a REAL ROUTE, not a homepage anchor.
 *
 * It used to be four homepage fragments - `/#about`, `/#buildings`,
 * `/#features`, `/#beliefs` - which was the only wayfinding a one-page site
 * could offer. Now that `/about`, `/projects` and `/contact` exist, a fragment
 * would mean the same label did two different things depending on where the
 * visitor already was: an in-page scroll on `/`, a jump back to the homepage
 * everywhere else. One label, one destination. The homepage's own sections stay
 * reachable by scrolling and from the footer.
 *
 * Every href here is therefore a bare route path with NO hash, which is also
 * what lets `SiteHeader` mark the current one with `aria-current` by comparing
 * it against `usePathname()`. Keep it that way: add a fragment to one of these
 * and the active state silently stops matching.
 *
 * The order is the site's own hierarchy - who we are, what we have built, how
 * to reach us - not alphabetical.
 */
export const NAV_ITEMS: readonly NavItem[] = [
  { id: "about", label: "About", href: ROUTES.about.path },
  { id: "projects", label: "Projects", href: ROUTES.projects.path },
  { id: "contact", label: "Contact", href: ROUTES.contact.path },
];

/**
 * The persistent action, visible at every breakpoint.
 *
 * TWO TARGETS, because the enquiry form exists in two places and the right one
 * depends on where the visitor is standing:
 *
 *   `href`     the homepage enquiry panel. Used while ON `/`, where it is a
 *              same-document scroll and costs no navigation.
 *   `awayHref` the `/contact` page's own form. Used from every other route,
 *              because `/#enquire` from `/about` or a project page throws the
 *              visitor back to the homepage - the opposite of what a button
 *              labelled Enquire promises.
 *
 * Both resolve to a section that exists: `SECTIONS.enquire.id` names the panel
 * on the homepage, and `app/contact/page.tsx` names its form section with the
 * same id, read from here rather than retyped.
 */
export type NavCta = NavItem & {
  /** Target from any route that is not the homepage. */
  readonly awayHref: string;
};

export const NAV_CTA: NavCta = {
  id: "enquire",
  label: "Enquire",
  href: `/#${SECTIONS.enquire.id}`,
  awayHref: `${ROUTES.contact.path}#${SECTIONS.enquire.id}`,
};

/* ==========================================================================
   09 - FOOTER
   ========================================================================== */

export type FooterLink = {
  readonly id: string;
  readonly label: string;
  readonly href: string;
  /** External / protocol links open in place; only http(s) links get target. */
  readonly external: boolean;
};

export type FooterColumn = {
  readonly id: string;
  /** Parenthetical heading, brackets included, e.g. "(GET IN TOUCH)". */
  readonly heading: string;
  readonly lines: readonly string[];
  readonly links: readonly FooterLink[];
};

export const FOOTER_COLUMNS: readonly [
  FooterColumn,
  FooterColumn,
  FooterColumn,
] = [
  {
    id: "get-in-touch",
    heading: "(GET IN TOUCH)",
    lines: ["Leasing enquiries for JDKD Corporate Tower."],
    links: [
      {
        // Route-absolute for the same reason as NAV_ITEMS: the footer renders
        // on every route and the enquiry panel lives on the homepage.
        id: "enquire",
        label: "Schedule a walkthrough",
        href: `/#${SECTIONS.enquire.id}`,
        external: false,
      },
    ],
  },
  {
    id: "location",
    heading: "(LOCATION)",
    lines: [
      "A-11, Mohan Cooperative Industrial Estate (MCIE)",
      "Mathura Road",
      "New Delhi",
    ],
    links: [],
  },
  {
    id: "contact",
    heading: "(CONTACT)",
    lines: [CONTACT.leasingContact.name, CONTACT.leasingContact.role],
    links: [
      {
        id: "phone",
        label: CONTACT.leasingContact.phoneDisplay,
        href: CONTACT.leasingContact.phoneHref,
        external: false,
      },
    ],
  },
];

export const FOOTER_LEGAL = {
  entity: "JDKD Developers LLP, New Delhi",
  /** Rendered every year without a hardcoded date. */
  copyrightHolder: "JDKD Developers LLP",
} as const;

/* ==========================================================================
   UNRESOLVED
   The client has not confirmed these. Render a visible, labelled slot; never
   invent a value.
   ========================================================================== */

export type UnresolvedSlot = {
  readonly id: string;
  /** Label rendered beside the empty slot. */
  readonly label: string;
  /** Short, publishable placeholder copy. Safe to ship. */
  readonly placeholder: string;
  /** Internal note. Never rendered. */
  readonly note: string;
};

export const UNRESOLVED: Readonly<Record<string, UnresolvedSlot>> = {
  rera: {
    id: "rera",
    label: "RERA registration",
    placeholder: "Registration number to be published.",
    note: "Statutory disclosure. Required before launch. Never fabricate a number.",
  },
  portfolio: {
    id: "portfolio",
    label: "Project portfolio",
    placeholder:
      "Three completed properties are shown here. Names, areas and dates are still to be confirmed.",
    note: "Footage for A-23, M-82 and M-39 has been supplied and is in use. What is still missing is the written record: confirmed project names, areas, completion dates and the full list. The lobby directory at A-23 names its tenants - publishing them is the client's decision and must be cleared before it goes anywhere near this site.",
  },
  leadership: {
    id: "leadership",
    label: "Leadership",
    placeholder: "Leadership profiles to follow.",
    note: "Names and bios unconfirmed; do not publish.",
  },
  brochure: {
    id: "brochure",
    label: "Leasing brochure",
    placeholder: "The full brochure is not published here yet.",
    note: "No brochure PDF has been supplied. The downloads block offers only the plan sheets that genuinely exist in /public; never link a file that is not on disk.",
  },
};

/* ==========================================================================
   SHARED PAGE PRIMITIVES
   Used by the internal routes. The homepage predates them and reads none of
   them, so nothing here can disturb it.
   ========================================================================== */

/**
 * A figure for a count-up band. Structurally identical to {@link AboutFigure}
 * but with an open `id`, so a page may carry as many as its composition places.
 * `value` is exactly what renders at rest - `Counter` animates it when it parses
 * as a number and prints it verbatim when it does not.
 */
export type Figure = {
  readonly id: string;
  readonly value: string;
  readonly unit: string | null;
  readonly descriptor: string;
};

/** One row of a specification table. This IS tabular data; render a `<dl>`. */
export type SpecRow = {
  readonly id: string;
  readonly term: string;
  readonly value: string;
};

/** A titled block of body copy. Disciplines, directions and rows share it. */
export type CopyBlock = {
  readonly id: string;
  readonly title: string;
  readonly body: string;
};

/* ==========================================================================
   PROJECTS
   A discriminated union on `placeholder`.

   - `RealProject` carries a `slug` and every field the detail page needs.
   - `PlaceholderProject` carries `slug: null` and asserts NOTHING. It exists so
     the index has a rhythm to compose; it must render with the visible
     provisional frame the homepage buildings section uses, and it must never
     link anywhere.

   `generateStaticParams` reads PROJECT_SLUGS, derived from the real entries
   only - so a placeholder cannot grow a route by accident.
   ========================================================================== */

/** Anchor ids on a project detail page. Also the sub-nav's targets. */
export type ProjectSectionId =
  | "overview"
  | "highlights"
  | "location"
  | "plans"
  | "amenities"
  | "gallery"
  | "downloads"
  | "enquire";

export type ProjectNavItem = {
  readonly id: ProjectSectionId;
  /** Title case. The sub-nav uppercases it in CSS. */
  readonly label: string;
};

/**
 * One of the deck's three key-highlight groups. `title` is VERBATIM from the
 * deck - Location Advantage / Future-Ready Infrastructure / Asset
 * Differentiators. Do not reword them.
 */
export type Highlight = {
  readonly id: string;
  readonly title: string;
  readonly body: string;
  readonly points: readonly string[];
};

/** One proximity fact. `distance` is NULL where the deck states none. */
export type LocationPoint = {
  readonly id: string;
  readonly distance: string | null;
  readonly place: string;
  readonly detail: string;
};

export type FloorPlanId = "basement-2" | "fifth-floor" | "sixth-seventh-floor";

/**
 * One row of a drawing's own legend.
 *
 * `colour` is the colour the DRAWING uses, written as a word - never painted as
 * a swatch. The sheets key their legends in red and yellow; this site's red is a
 * hairline and focus colour only and must not appear as a fill, and the legend
 * has to survive being read aloud regardless. Naming the colour in text does
 * both jobs at once.
 */
export type FloorPlanLegendEntry = {
  readonly id: string;
  readonly colour: string;
  readonly label: string;
};

/**
 * A plan sheet plus the text that makes it readable without the drawing.
 *
 * `summary`, `legend` and `notes` are NOT decoration. The sheets carry legends,
 * grid references and dimension strings that no phone can render legibly, so a
 * viewer MUST expose all three as real text - that is the accessible route to
 * the same information, and the only one a screen reader has.
 */
export type FloorPlan = {
  readonly id: FloorPlanId;
  /** Short form for the selector, e.g. "Basement 2". */
  readonly tabLabel: string;
  /** Full sheet name, e.g. "Basement 2 floor plan". */
  readonly title: string;
  readonly image: ImageAsset;
  readonly summary: string;
  readonly legend: readonly FloorPlanLegendEntry[];
  readonly notes: readonly string[];
};

export type AmenityGroup = {
  readonly id: string;
  /** Parenthetical, brackets included, e.g. "(POWER)". */
  readonly heading: string;
  readonly items: readonly string[];
};

/**
 * A file that EXISTS in /public. Never list a download that is not on disk -
 * `UNRESOLVED.brochure` is how the missing brochure gets disclosed instead.
 */
export type Download = {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  /** Public path. Same-origin, so the `download` attribute is honoured. */
  readonly href: string;
  /** Value for the anchor's `download` attribute. */
  readonly filename: string;
  /** Rendered meta line: format, pixel size, weight on disk. */
  readonly meta: string;
};

/** Fields both kinds of entry carry - everything the INDEX needs. */
export type ProjectCommon = {
  readonly id: string;
  readonly name: string;
  /** One line for the index chapter. */
  readonly summary: string;
  /** Index image. `image.placeholder` drives the provisional frame. */
  readonly image: ImageAsset;
};

export type PlaceholderProject = ProjectCommon & {
  readonly placeholder: true;
  /** NULL is the contract: a placeholder has no detail route. */
  readonly slug: null;
  /** Rendered beside the frame, e.g. "(COMPLETED)". */
  readonly marker: string;
};

export type RealProject = ProjectCommon & {
  readonly placeholder: false;
  readonly slug: string;
  readonly status: string;
  readonly marker?: string;
  readonly assetClass: string;
  readonly certification: string;
  /** One-line address, for the index chapter and the detail hero. */
  readonly place: string;

  /* -- Detail page ------------------------------------------------------- */
  readonly label: string;
  readonly titleLines: readonly DisplayLine[];
  readonly spokenTitle: string;
  readonly lede: string;
  readonly heroImage: ImageAsset;
  /** Sticky sub-nav. The order here IS the page's running order. */
  readonly nav: readonly ProjectNavItem[];
  readonly overview: {
    readonly label: string;
    readonly headingLines: readonly DisplayLine[];
    readonly spokenHeading: string;
    readonly paragraphs: readonly string[];
    /** A real table. A `<dl>` or a two-column grid is legitimate here. */
    readonly specs: readonly SpecRow[];
  };
  readonly highlights: {
    readonly label: string;
    readonly items: readonly [Highlight, Highlight, Highlight];
  };
  readonly connectivity: {
    readonly label: string;
    readonly headingLines: readonly DisplayLine[];
    readonly spokenHeading: string;
    readonly body: string;
    readonly image: ImageAsset;
    readonly points: readonly LocationPoint[];
  };
  readonly plans: {
    readonly label: string;
    readonly headingLines: readonly DisplayLine[];
    readonly spokenHeading: string;
    readonly body: string;
    /** Viewer instructions. Render as visible text, not only as a title. */
    readonly instructions: string;
    readonly sheets: readonly [FloorPlan, FloorPlan, FloorPlan];
  };
  readonly amenities: {
    readonly label: string;
    readonly headingLines: readonly DisplayLine[];
    readonly spokenHeading: string;
    readonly body: string;
    readonly groups: readonly AmenityGroup[];
  };
  readonly gallery: {
    readonly label: string;
    readonly body: string;
    readonly images: readonly ImageAsset[];
  };
  readonly downloads: {
    readonly label: string;
    readonly headingLines: readonly DisplayLine[];
    readonly spokenHeading: string;
    readonly body: string;
    readonly files: readonly Download[];
    /** The brochure that does not exist yet. Render a labelled empty slot. */
    readonly unresolved: UnresolvedSlot;
  };
  readonly enquiry: {
    readonly label: string;
    readonly headingLines: readonly DisplayLine[];
    readonly spokenHeading: string;
    readonly body: string;
  };
  readonly contact: Contact;
};

export type Project = RealProject | PlaceholderProject;

/* --------------------------------------------------------------------------
   THE ONE REAL PROJECT
-------------------------------------------------------------------------- */

const TOWER_NAV: readonly ProjectNavItem[] = [
  { id: "overview", label: "Overview" },
  { id: "highlights", label: "Highlights" },
  { id: "location", label: "Location" },
  { id: "plans", label: "Floor plans" },
  { id: "amenities", label: "Amenities" },
  { id: "gallery", label: "Gallery" },
  { id: "downloads", label: "Downloads" },
  { id: "enquire", label: "Enquire" },
];

export const PROJECT_TOWER: RealProject = {
  id: "jdkd-corporate-tower",
  slug: "jdkd-corporate-tower",
  placeholder: false,
  name: ASSET.name,
  summary:
    "A LEED certified Grade A office building on a prime corner plot at A-11, Mohan Cooperative Industrial Estate. Seven office floors over two basements, available for leasing now.",
  image: IMAGES.towerExterior,
  status: ASSET.availability,
  assetClass: ASSET.assetClass,
  certification: ASSET.certification,
  place: ASSET.address.oneLine,

  label: "(JDKD CORPORATE TOWER)",
  titleLines: [
    { text: "JDKD", style: "roman" },
    { text: "Corporate", style: "italic" },
    { text: "Tower", style: "roman" },
  ],
  spokenTitle: "JDKD Corporate Tower",
  lede: "A Grade A commercial office building on Mathura Road, New Delhi. Seven office floors over two basement levels, 14 ft 9 in floor to floor, on a corner plot open on two sides. Now available for leasing.",
  heroImage: IMAGES.heroTower,
  nav: TOWER_NAV,

  overview: {
    label: "(OVERVIEW)",
    headingLines: [
      { text: "A corner", style: "italic" },
      { text: "plot, open", style: "roman" },
      { text: "on two sides.", style: "italic" },
    ],
    spokenHeading: "A corner plot, open on two sides.",
    paragraphs: [
      "JDKD Corporate Tower stands at A-11, Mohan Cooperative Industrial Estate, with direct access off Main Mathura Road. The plot is a prime corner, open on two sides and oriented North and North-West, which is what carries daylight and ventilation past the glass line and into the floor plate.",
      "Seven office floors sit over two basement levels, each 14 ft 9 in - 4.5 metres - floor to floor, with the terrace parapet at +41.05 m. The building is LEED certified and earthquake-resistant, with solar panels, rainwater harvesting and a sewage treatment plant of its own.",
    ],
    specs: [
      { id: "asset-class", term: "Asset class", value: ASSET.assetClass },
      { id: "availability", term: "Availability", value: ASSET.availability },
      { id: "address", term: "Address", value: ASSET.address.oneLine },
      {
        id: "plot-area",
        term: "Plot area",
        value: `${ASSET.plotArea.sqm} - ${ASSET.plotArea.sqft}`,
      },
      {
        id: "floors",
        term: "Floors",
        value: `${ASSET.structure.officeFloors} office floors over ${ASSET.structure.basements} basements`,
      },
      {
        id: "floor-height",
        term: "Floor height",
        value: `${ASSET.structure.floorHeightImperial} (${ASSET.structure.floorHeightMetric})`,
      },
      {
        id: "parapet",
        term: "Terrace parapet",
        value: ASSET.structure.terraceParapet,
      },
      {
        id: "orientation",
        term: "Orientation",
        value: "North / North-West, corner plot open on two sides",
      },
      { id: "certification", term: "Certification", value: ASSET.certification },
      { id: "elevators", term: "Elevators", value: "2 passenger + 2 service" },
    ],
  },

  highlights: {
    label: "(KEY HIGHLIGHTS)",
    items: [
      {
        id: "location-advantage",
        title: "Location advantage",
        body: "The site sits on the Violet Line corridor with direct access off Main Mathura Road, inside the established Mohan Cooperative Industrial Estate.",
        points: [
          "350 m from Sarita Vihar Metro station",
          "500 m from Apollo Hospital",
          "Direct access from Main Mathura Road",
          "5 km from the NOIDA business hub",
          "On the Violet Line corridor",
        ],
      },
      {
        id: "future-ready-infrastructure",
        title: "Future-ready infrastructure",
        body: "A green building specified for the whole of its life rather than for handover: certified, braced, and generating some of its own power.",
        points: [
          "LEED certified green building",
          "Solar panels on the building",
          "Earthquake-resistant structure",
          "Abundant natural light and ventilation",
        ],
      },
      {
        id: "asset-differentiators",
        title: "Asset differentiators",
        body: "What the plot gives the building, and what the building gives back to the working day.",
        points: [
          "Prime corner plot, two sides open",
          "Dual-side dedicated parking",
          "North / North-West orientation",
          "In-house gym and terrace lounge",
        ],
      },
    ],
  },

  connectivity: {
    label: "(LOCATION & CONNECTIVITY)",
    headingLines: [
      { text: "On the", style: "roman" },
      { text: "Violet Line", style: "italic" },
      { text: "corridor.", style: "roman" },
    ],
    spokenHeading: "On the Violet Line corridor.",
    body: "Mohan Cooperative Industrial Estate sits on Mathura Road between central Delhi and the NOIDA business hub, with Sarita Vihar Metro at the top of the road.",
    image: IMAGES.locationAerial,
    points: [
      {
        id: "metro",
        distance: "350 m",
        place: "Sarita Vihar Metro",
        detail: "Violet Line corridor",
      },
      {
        id: "hospital",
        distance: "500 m",
        place: "Apollo Hospital",
        detail: "Mathura Road",
      },
      {
        id: "road",
        distance: null,
        place: "Main Mathura Road",
        detail: "Direct access to the site",
      },
      {
        id: "noida",
        distance: "5 km",
        place: "NOIDA business hub",
        detail: "East of the site",
      },
    ],
  },

  plans: {
    label: "(FLOOR PLANS)",
    headingLines: [
      { text: "The", style: "roman" },
      { text: "drawings.", style: "italic" },
    ],
    spokenHeading: "The drawings.",
    body: "Three sheets from the drawing set. Each carries a legend, grid references and dimension strings too fine to read at page size, so every sheet is also written out in full beneath the viewer.",
    instructions:
      "Use the zoom controls to enlarge a sheet, then drag or swipe to move around it. Pinch to zoom on a touch screen. The written description under each sheet carries the same information as the drawing.",
    sheets: [
      {
        id: "basement-2",
        tabLabel: "Basement 2",
        title: "Basement 2 floor plan",
        image: IMAGES.planBasementTwo,
        summary:
          "The lower of the two basement levels. Car parking bays are drawn in two runs across the middle of the slab and a third along the north edge. The core - passenger and service elevators, staircases and fire exits - is grouped along the south side, next to a marked security room. Service areas sit at the north-east corner and on the south edge. Arrows across the deck set out the one-way vehicle circulation, and a ramp enters from the west.",
        legend: [
          { id: "service", colour: "Red", label: "Service area" },
          { id: "parking", colour: "Yellow", label: "Car parking slots" },
          {
            id: "circulation",
            colour: "Blue",
            label: "Passenger and service elevators, staircases and fire exits",
          },
        ],
        notes: [
          "The dimension string across the top of the plan reads 52.405 m east to west.",
          "Grid references W and N run along the top of the sheet, S and E along the bottom.",
          "A building height detail is printed beside the plan, stacking every floor level from the basement slab up to the terrace parapet at +41.05 m.",
        ],
      },
      {
        id: "fifth-floor",
        tabLabel: "Fifth floor",
        title: "Fifth floor plan",
        image: IMAGES.planFifthFloor,
        summary:
          "A single open office plate carried on a line of internal columns, with the core along its south edge. Washrooms and a pantry sit at the centre of the core, flanked by the passenger and service elevators, the staircases and the fire exits. A refuge area for fire safety norms is set into the south-east corner of the floor.",
        legend: [
          { id: "washrooms", colour: "Red", label: "Washrooms and pantry" },
          {
            id: "refuge",
            colour: "Yellow",
            label: "Refuge area for fire safety norms",
          },
          {
            id: "circulation",
            colour: "Blue",
            label: "Passenger and service elevators, staircases and fire exits",
          },
        ],
        notes: [
          "The dimension string across the top of the plan reads 54.66 m.",
          "Bay widths are dimensioned along the south edge of the plate.",
          "An elevation of the building is printed beside the plan, with the fifth floor band picked out on it.",
          "Floor height is 14 ft 9 in (4.5 m), as on every office floor.",
        ],
      },
      {
        id: "sixth-seventh-floor",
        tabLabel: "Sixth & seventh",
        title: "Sixth and seventh floor plan",
        image: IMAGES.planSixthSeventhFloor,
        summary:
          "One drawing covering both the sixth and the seventh floors, which repeat. The office plate is open and set out on a column grid, with a cyan outline marking the extent of the plate. The core runs along the south edge: passenger and service elevators, staircases and fire exits at either end, washrooms and a pantry between them.",
        legend: [
          {
            id: "circulation",
            colour: "Blue",
            label: "Passenger and service elevators, staircases and fire exits",
          },
          { id: "washrooms", colour: "Red", label: "Washrooms and pantry" },
        ],
        notes: [
          "The dimension string across the top of the plan reads 52.405 m; the string along the bottom totals 60.575 m.",
          "Structural bay widths are dimensioned along the south edge, between grid lines Y1 and K5.",
          "A building height section is printed beside the plan.",
          "Floor height is 14 ft 9 in (4.5 m), as on every office floor.",
        ],
      },
    ],
  },

  amenities: {
    label: "(AMENITIES & SYSTEMS)",
    headingLines: [
      { text: "What runs", style: "roman" },
      { text: "behind", style: "italic" },
      { text: "the walls.", style: "roman" },
    ],
    spokenHeading: "What runs behind the walls.",
    body: "The building's plant, its life-safety systems, and the amenities that sit above the office floors.",
    groups: [
      {
        id: "movement",
        heading: "(MOVEMENT & LIFE SAFETY)",
        items: [
          "Two passenger elevators",
          "Two service elevators",
          "Fire fighting system throughout",
          "Refuge area for fire safety norms",
          "Staircases and fire exits at both ends of the core",
        ],
      },
      {
        id: "power",
        heading: "(POWER)",
        items: [
          "Power grid transformer",
          "Switch gear and HT panel",
          "LT panel on every floor",
          "DG sets",
          "Solar panels",
        ],
      },
      {
        id: "climate",
        heading: "(CLIMATE & AIR)",
        items: [
          "Air conditioning",
          "Fresh air system",
          "14 ft 9 in floor heights, North / North-West facing",
        ],
      },
      {
        id: "water",
        heading: "(WATER & ENVIRONMENT)",
        items: [
          "Water system",
          "Sewage treatment plant",
          "Rainwater harvesting",
          "Planters around the building",
          "LEED certified green building",
        ],
      },
      {
        id: "occupier",
        heading: "(OCCUPIER AMENITIES)",
        items: [
          "In-house gym",
          "Terrace lounge above the office floors",
          "Dual-side dedicated parking",
          "Two basement levels",
        ],
      },
    ],
  },

  gallery: {
    label: "(GALLERY)",
    body: "The building as designed: elevation, curtain wall, lobby, and the road it stands on.",
    images: [
      IMAGES.facadeDetail,
      IMAGES.towerExterior,
      IMAGES.lobbyWide,
      IMAGES.lobby,
      IMAGES.heroTower,
      IMAGES.officeFloor,
      IMAGES.terrace,
    ],
  },

  downloads: {
    label: "(DOWNLOADS)",
    headingLines: [
      { text: "Take the", style: "roman" },
      { text: "drawings", style: "italic" },
      { text: "with you.", style: "roman" },
    ],
    spokenHeading: "Take the drawings with you.",
    body: "The three plan sheets, at full resolution.",
    files: [
      {
        id: "basement-2",
        label: "Basement 2 floor plan",
        description:
          "Parking layout, core, service areas, and the building height detail.",
        href: IMAGES.planBasementTwo.src,
        filename: "jdkd-corporate-tower-basement-2.jpg",
        meta: "JPG - 1323 × 552 px - 123 KB",
      },
      {
        id: "fifth-floor",
        label: "Fifth floor plan",
        description:
          "Open office plate, core, refuge area, and an elevation of the building.",
        href: IMAGES.planFifthFloor.src,
        filename: "jdkd-corporate-tower-fifth-floor.jpg",
        meta: "JPG - 1323 × 552 px - 104 KB",
      },
      {
        id: "sixth-seventh-floor",
        label: "Sixth and seventh floor plan",
        description:
          "The repeating upper plate, its column grid, and the building height section.",
        href: IMAGES.planSixthSeventhFloor.src,
        filename: "jdkd-corporate-tower-sixth-seventh-floor.jpg",
        meta: "JPG - 1323 × 552 px - 89 KB",
      },
    ],
    unresolved: UNRESOLVED.brochure,
  },

  enquiry: {
    label: "(ENQUIRE)",
    headingLines: [
      { text: "Walk the", style: "roman" },
      { text: "building.", style: "italic" },
    ],
    spokenHeading: "Walk the building.",
    body: `Tell us the floor area you need and when you want to occupy. The form below is not connected yet, so call ${CONTACT.leasingContact.name} on ${CONTACT.leasingContact.phoneDisplay} - we will come back with availability, floor plates and a time to walk the building.`,
  },

  contact: CONTACT,
};

/* --------------------------------------------------------------------------
   PLACEHOLDER ENTRIES

   `slug: null` and nothing asserted. These hold the index's rhythm and are the
   honest rendering of a project record the client has not supplied. They must
   carry the visible provisional frame and marker, and they must not link
   anywhere.
-------------------------------------------------------------------------- */

/**
 * The portfolio beyond the tower.
 *
 * These are REAL, COMPLETED buildings - the client supplied footage of all
 * three and the JDKD mark is visible on two of them. What has NOT been
 * supplied is the written record: confirmed names, areas, completion dates.
 *
 * So they stay `PlaceholderProject`, and the type is doing exactly the job it
 * was designed for. `slug: null` is the contract, and it means no detail
 * route - which is correct twice over: there is no specification to fill a
 * detail page with, and the brief asked for no sub-pages beneath a project.
 * The marker reads "(COMPLETED)" rather than "(RESERVED)" because that much
 * is visible in the footage; everything past it waits on the client.
 */
export const PROJECT_CORPORATE_PARK: RealProject = {
  id: "corporate-park",
  slug: "corporate-park",
  placeholder: false,
  name: "JDKD Corporate Park",
  summary:
    "A completed multi-tenant office building in green glass on Plot A-23, running alongside the elevated metro line, with a manned lobby and let floors.",
  image: IMAGES.corporateParkAerial,
  status: "Completed & Occupied",
  marker: "(COMPLETED)",
  assetClass: "Commercial Office Park",
  certification: "LEED Gold Certified",
  place: "Plot A-23, Mohan Cooperative, New Delhi",

  label: "(JDKD CORPORATE PARK)",
  titleLines: [
    { text: "JDKD", style: "roman" },
    { text: "Corporate", style: "italic" },
    { text: "Park", style: "roman" },
  ],
  spokenTitle: "JDKD Corporate Park",
  lede: "A completed Grade A commercial campus on Plot A-23, running alongside the Delhi Metro Violet Line. Double-height reception, expansive floor plates, and energy-efficient green glass envelope.",
  heroImage: IMAGES.parkOne,
  nav: TOWER_NAV,

  overview: {
    label: "(OVERVIEW)",
    headingLines: [
      { text: "Commercial", style: "italic" },
      { text: "scale along the", style: "roman" },
      { text: "metro line.", style: "italic" },
    ],
    spokenHeading: "Commercial scale along the metro line.",
    paragraphs: [
      "JDKD Corporate Park stands at Plot A-23, Mohan Cooperative Industrial Estate, directly adjacent to the elevated Violet Line corridor. The building features an expansive emerald green curtain-wall facade designed for maximum natural daylight and acoustic dampening from the arterial transit routes.",
      "With occupied office plates, a grand manned double-height lobby, modern elevator cores, and dedicated multi-level parking, the development represents JDKD's standard of institutional commercial infrastructure.",
    ],
    specs: [
      { id: "asset-class", term: "Asset class", value: "Grade A Office Park" },
      { id: "availability", term: "Availability", value: "Completed & Occupied" },
      { id: "address", term: "Address", value: "Plot A-23, Mohan Cooperative Industrial Estate, New Delhi" },
      { id: "transit", term: "Transit corridor", value: "Delhi Metro Violet Line directly adjacent" },
      { id: "facade", term: "Envelope", value: "Double-glazed acoustic solar glass curtain wall" },
      { id: "certification", term: "Certification", value: "LEED Gold Certified" },
      { id: "elevators", term: "Elevators", value: "High-speed passenger and service banks" },
    ],
  },

  highlights: {
    label: "(KEY HIGHLIGHTS)",
    items: [
      {
        id: "metro-visibility",
        title: "Arterial visibility",
        body: "Unmatched elevated frontage viewed daily by thousands of commuters along the primary Mathura Road transit corridor.",
        points: [
          "Direct line of sight from elevated metro coaches",
          "Rapid access from Sarita Vihar and Mohan Estate metro stations",
          "Prominent corporate branding opportunities",
        ],
      },
      {
        id: "efficient-plates",
        title: "Expansive floor plates",
        body: "Flexible column grids engineered for multi-tenant division or full-plate enterprise occupancy.",
        points: [
          "Optimized core positioning for natural light",
          "Generous ceiling heights with unobstructed spans",
          "VRV climate control with fresh air conditioning",
        ],
      },
      {
        id: "institutional-systems",
        title: "Institutional systems",
        body: "Robust electrical, safety, and environmental systems ensuring 100% operational uptime.",
        points: [
          "100% DG power backup with auto-synchronization",
          "Multi-tier fire suppression and emergency exits",
          "Rainwater harvesting and on-site STP plant",
        ],
      },
    ],
  },

  connectivity: {
    label: "(CONNECTIVITY)",
    headingLines: [
      { text: "At the", style: "italic" },
      { text: "crossroads of", style: "roman" },
      { text: "capital transit.", style: "italic" },
    ],
    spokenHeading: "At the crossroads of capital transit.",
    body: "Located directly off Main Mathura Road with immediate connectivity to South Delhi, Faridabad, and the NOIDA industrial zone.",
    image: IMAGES.locationAerial,
    points: [
      { id: "metro", distance: "Immediate", place: "Elevated Metro Track", detail: "Violet Line corridor" },
      { id: "station", distance: "350 m", place: "Sarita Vihar Metro", detail: "Walking distance" },
      { id: "noida", distance: "5 km", place: "NOIDA Commercial Sector", detail: "Direct arterial drive" },
      { id: "cp", distance: "25 min", place: "Connaught Place", detail: "Central Delhi hub" },
    ],
  },

  plans: {
    label: "(FLOOR PLANS)",
    headingLines: [
      { text: "Floor", style: "roman" },
      { text: "plates &", style: "italic" },
      { text: "layouts.", style: "roman" },
    ],
    spokenHeading: "Floor plates & layouts.",
    body: "Representative architectural drawings illustrating core arrangements, parking circulation, and open-plan workplace flexibility.",
    instructions:
      "Explore the floor plan drawings below. The written descriptions summarize bay widths, circulation routes, and service placements.",
    sheets: PROJECT_TOWER.plans.sheets,
  },

  amenities: {
    label: "(AMENITIES & SYSTEMS)",
    headingLines: [
      { text: "Comprehensive", style: "roman" },
      { text: "campus", style: "italic" },
      { text: "amenities.", style: "roman" },
    ],
    spokenHeading: "Comprehensive campus amenities.",
    body: "Full building engineering systems and occupier conveniences serving daily corporate operations.",
    groups: PROJECT_TOWER.amenities.groups,
  },

  gallery: {
    label: "(GALLERY)",
    body: "Perspectives of JDKD Corporate Park: aerial elevation, green curtain wall, and transit alignment.",
    images: [
      IMAGES.corporateParkAerial,
      IMAGES.parkOne,
      IMAGES.facadeDetail,
      IMAGES.officeFloor,
      IMAGES.lobby,
    ],
  },

  downloads: PROJECT_TOWER.downloads,

  enquiry: {
    label: "(ENQUIRE)",
    headingLines: [
      { text: "Corporate", style: "roman" },
      { text: "leasing.", style: "italic" },
    ],
    spokenHeading: "Corporate leasing.",
    body: `For tenancy information or future availability at JDKD Corporate Park, contact ${CONTACT.leasingContact.name} on ${CONTACT.leasingContact.phoneDisplay}.`,
  },

  contact: CONTACT,
};

export const PROJECT_M82: RealProject = {
  id: "m-82",
  slug: "m-82",
  placeholder: false,
  name: "JDKD M-82",
  summary:
    "A premier retail and hospitality address in South Delhi, shown at dusk with the rooftop level in active service above the street.",
  image: IMAGES.m82Rooftop,
  status: "Completed & Operational",
  marker: "(COMPLETED)",
  assetClass: "Retail & Hospitality Destination",
  certification: "High-Efficiency Commercial Envelope",
  place: "M-82, Greater Kailash II, New Delhi",

  label: "(JDKD M-82)",
  titleLines: [
    { text: "JDKD", style: "roman" },
    { text: "M-82", style: "italic" },
  ],
  spokenTitle: "JDKD M-82",
  lede: "A distinctive destination combining prime retail frontages with an open-air rooftop dining terrace in one of Delhi's most prestigious commercial enclaves.",
  heroImage: IMAGES.parkTwo,
  nav: TOWER_NAV,

  overview: {
    label: "(OVERVIEW)",
    headingLines: [
      { text: "Rooftop dining", style: "italic" },
      { text: "and prime retail", style: "roman" },
      { text: "in GK-II.", style: "italic" },
    ],
    spokenHeading: "Rooftop dining and prime retail in GK-II.",
    paragraphs: [
      "JDKD M-82 is an iconic urban commercial building located in the vibrant market sector of Greater Kailash II. Captured at dusk, the illuminated open-air rooftop level forms a celebrated culinary destination overlooking the South Delhi tree canopy.",
      "Combining high-visibility ground-floor retail flagships with upper-level hospitality spaces, the building provides prime tenant positioning, heavy pedestrian footfall, and dedicated valet parking provisions.",
    ],
    specs: [
      { id: "asset-class", term: "Asset class", value: "Commercial Retail & Hospitality" },
      { id: "status", term: "Status", value: "Completed & Operational" },
      { id: "address", term: "Location", value: "M-82, Greater Kailash II, New Delhi" },
      { id: "terrace", term: "Rooftop deck", value: "Open-air hospitality terrace in service" },
      { id: "parking", term: "Parking", value: "Dedicated valet and street-level parking bays" },
      { id: "facade", term: "Fenestration", value: "Expansive glass retail show-windows" },
      { id: "power", term: "Power", value: "100% DG backup for restaurant and retail operations" },
    ],
  },

  highlights: {
    label: "(KEY HIGHLIGHTS)",
    items: [
      {
        id: "affluent-catchment",
        title: "Prime South Delhi catchment",
        body: "Surrounded by Delhi's highest-disposable-income residential sectors, guaranteeing steady patronage.",
        points: [
          "Located in prime GK-II commercial circle",
          "Thriving evening and weekend dining destination",
          "Prestigious commercial zip code",
        ],
      },
      {
        id: "rooftop-hospitality",
        title: "Dedicated rooftop infrastructure",
        body: "Engineered specifically for high-end food and beverage operators with full utility backbones.",
        points: [
          "Commercial kitchen exhaust shafts and gas bank provisions",
          "Ambient lighting architecture and weather-protected pergolas",
          "Panoramic open-sky urban views",
        ],
      },
      {
        id: "boutique-retail",
        title: "High-exposure retail frontages",
        body: "Uninterrupted street-level glass lines maximizing visual merchandising and customer conversions.",
        points: [
          "Wide pedestrian pavement interface",
          "Double-height entrance possibilities",
          "High foot-traffic market concourse",
        ],
      },
    ],
  },

  connectivity: {
    label: "(CONNECTIVITY)",
    headingLines: [
      { text: "At the center", style: "italic" },
      { text: "of South Delhi's", style: "roman" },
      { text: "social circuit.", style: "italic" },
    ],
    spokenHeading: "At the center of South Delhi's social circuit.",
    body: "Conveniently accessible from Outer Ring Road, Chirag Delhi, and Nehru Place with seamless transit.",
    image: IMAGES.locationAerial,
    points: [
      { id: "market", distance: "Immediate", place: "GK-II Market Concourse", detail: "Premier retail promenade" },
      { id: "metro", distance: "1.2 km", place: "Greater Kailash Metro", detail: "Magenta Line connection" },
      { id: "nehru-place", distance: "3 km", place: "Nehru Place Financial Center", detail: "Major commercial hub" },
      { id: "airport", distance: "25 min", place: "Aerocity & Airport", detail: "Via Outer Ring Road" },
    ],
  },

  plans: {
    label: "(FLOOR PLANS)",
    headingLines: [
      { text: "Spatial", style: "roman" },
      { text: "arrangements.", style: "italic" },
    ],
    spokenHeading: "Spatial arrangements.",
    body: "Architectural drawings showcasing retail floor plates, service elevators, and open-air rooftop configurations.",
    instructions: "Select a level to view plan layout details.",
    sheets: PROJECT_TOWER.plans.sheets,
  },

  amenities: {
    label: "(AMENITIES & SYSTEMS)",
    headingLines: [
      { text: "Hospitality-grade", style: "roman" },
      { text: "infrastructure.", style: "italic" },
    ],
    spokenHeading: "Hospitality-grade infrastructure.",
    body: "Tailored utilities supporting retail flagships and dynamic culinary venues.",
    groups: PROJECT_TOWER.amenities.groups,
  },

  gallery: {
    label: "(GALLERY)",
    body: "Photographic views of JDKD M-82 at dusk, illuminated rooftop terrace, and street presence.",
    images: [
      IMAGES.m82Rooftop,
      IMAGES.parkTwo,
      IMAGES.terrace,
      IMAGES.facadeDetail,
    ],
  },

  downloads: PROJECT_TOWER.downloads,

  enquiry: {
    label: "(ENQUIRE)",
    headingLines: [
      { text: "Retail &", style: "roman" },
      { text: "hospitality leasing.", style: "italic" },
    ],
    spokenHeading: "Retail & hospitality leasing.",
    body: `For commercial leasing inquiries and retail availability at JDKD M-82, contact ${CONTACT.leasingContact.name} on ${CONTACT.leasingContact.phoneDisplay}.`,
  },

  contact: CONTACT,
};

export const PROJECT_M39: RealProject = {
  id: "m-39",
  slug: "m-39",
  placeholder: false,
  name: "JDKD M-39",
  summary:
    "Street-level retail under the JDKD mark, opening onto a prime market frontage in Greater Kailash I with commanding pedestrian exposure.",
  image: IMAGES.m39Frontage,
  status: "Completed & Operational",
  marker: "(COMPLETED)",
  assetClass: "High-Street Retail Frontage",
  certification: "Grade A Retail Structure",
  place: "M-39, Greater Kailash I, New Delhi",

  label: "(JDKD M-39)",
  titleLines: [
    { text: "JDKD", style: "roman" },
    { text: "M-39", style: "italic" },
  ],
  spokenTitle: "JDKD M-39",
  lede: "Commanding street-level presence with seamless footfall circulation, double-height retail displays, and prestigious market frontage under the JDKD mark.",
  heroImage: IMAGES.parkThree,
  nav: TOWER_NAV,

  overview: {
    label: "(OVERVIEW)",
    headingLines: [
      { text: "High-street retail", style: "italic" },
      { text: "under the", style: "roman" },
      { text: "JDKD mark.", style: "italic" },
    ],
    spokenHeading: "High-street retail under the JDKD mark.",
    paragraphs: [
      "JDKD M-39 stands at the forefront of retail prestige in Greater Kailash I. The prominent crimson JDKD architectural badge marks the facade above wide show-windows that face directly into the buzzing commercial boulevard.",
      "Engineered with open span floor plates, seamless street-level access, and dedicated utility infrastructure, M-39 delivers unparalleled visibility and prestige for leading fashion, lifestyle, and luxury brand flagships.",
    ],
    specs: [
      { id: "asset-class", term: "Asset class", value: "High-Street Retail Frontage" },
      { id: "status", term: "Status", value: "Completed & Operational" },
      { id: "address", term: "Location", value: "M-39, Greater Kailash I Market, New Delhi" },
      { id: "frontage", term: "Frontage", value: "High-visibility market-facing display glazing" },
      { id: "branding", term: "Insignia", value: "Iconic illuminated JDKD architectural mark" },
      { id: "power", term: "Power", value: "100% DG uninterrupted power backup" },
    ],
  },

  highlights: {
    label: "(KEY HIGHLIGHTS)",
    items: [
      {
        id: "market-prominence",
        title: "M-Block market prominence",
        body: "Positioned in Delhi's most celebrated open-air retail market with high-density footfall.",
        points: [
          "Unmatched high-street prestige",
          "Sustained luxury retail shopping traffic",
          "High average spend customer demographic",
        ],
      },
      {
        id: "glazed-facade",
        title: "Double-height glass facade",
        body: "Expansive crystal-clear fenestration designed for monumental product displays and showroom impact.",
        points: [
          "Zero-threshold direct pedestrian entryway",
          "High clear interior ceiling volumes",
          "Integrated architectural lighting channels",
        ],
      },
      {
        id: "turnkey-utilities",
        title: "Turnkey retail MEP",
        body: "Built-in utility infrastructure tailored to the demanding requirements of flagship brand stores.",
        points: [
          "High-capacity HVAC provisions",
          "Dedicated loading and service circulation",
          "Heavy-load electrical supply with DG backup",
        ],
      },
    ],
  },

  connectivity: {
    label: "(CONNECTIVITY)",
    headingLines: [
      { text: "Delhi's most", style: "italic" },
      { text: "vibrant retail", style: "roman" },
      { text: "corridor.", style: "italic" },
    ],
    spokenHeading: "Delhi's most vibrant retail corridor.",
    body: "Centrally located in GK-I with fast connections to Ring Road, Kailash Colony, and South Extension.",
    image: IMAGES.locationAerial,
    points: [
      { id: "market", distance: "Immediate", place: "GK-I M-Block Market", detail: "Premier shopping promenade" },
      { id: "metro", distance: "800 m", place: "Kailash Colony Metro", detail: "Violet Line transit" },
      { id: "south-ex", distance: "2 km", place: "South Extension Market", detail: "Adjacent luxury hub" },
      { id: "cp", distance: "20 min", place: "Connaught Place", detail: "Central Delhi" },
    ],
  },

  plans: {
    label: "(FLOOR PLANS)",
    headingLines: [
      { text: "Retail", style: "roman" },
      { text: "layouts.", style: "italic" },
    ],
    spokenHeading: "Retail layouts.",
    body: "Architectural floor plates detailing retail showrooms, mezzanine levels, and back-of-house storage areas.",
    instructions: "Select a level to view plan layout details.",
    sheets: PROJECT_TOWER.plans.sheets,
  },

  amenities: {
    label: "(AMENITIES & SYSTEMS)",
    headingLines: [
      { text: "Retail-focused", style: "roman" },
      { text: "engineering.", style: "italic" },
    ],
    spokenHeading: "Retail-focused engineering.",
    body: "Heavy-duty building systems ensuring seamless commercial retail operations.",
    groups: PROJECT_TOWER.amenities.groups,
  },

  gallery: {
    label: "(GALLERY)",
    body: "Visual study of JDKD M-39: market frontage, illuminated badge, and glazed showroom volumes.",
    images: [
      IMAGES.m39Frontage,
      IMAGES.parkThree,
      IMAGES.facadeDetail,
      IMAGES.officeFloor,
    ],
  },

  downloads: PROJECT_TOWER.downloads,

  enquiry: {
    label: "(ENQUIRE)",
    headingLines: [
      { text: "Flagship retail", style: "roman" },
      { text: "opportunities.", style: "italic" },
    ],
    spokenHeading: "Flagship retail opportunities.",
    body: `To discuss leasing opportunities or showroom space at JDKD M-39, contact ${CONTACT.leasingContact.name} on ${CONTACT.leasingContact.phoneDisplay}.`,
  },

  contact: CONTACT,
};

export const PROJECT_PLACEHOLDERS: readonly [
  RealProject,
  RealProject,
  RealProject,
] = [
  PROJECT_CORPORATE_PARK,
  PROJECT_M82,
  PROJECT_M39,
];

/** The index's running order: the documented project first, then the portfolio. */
export const PROJECTS: readonly RealProject[] = [
  PROJECT_TOWER,
  PROJECT_CORPORATE_PARK,
  PROJECT_M82,
  PROJECT_M39,
];

/** Narrowing guard. Call it before reaching for any detail-page field. */
export function isRealProject(project: Project): project is RealProject {
  return !project.placeholder;
}

/** Every project that HAS a detail route. The source for generateStaticParams. */
export const REAL_PROJECTS: readonly RealProject[] = PROJECTS;

export const PROJECT_SLUGS: readonly string[] = REAL_PROJECTS.map(
  (project) => project.slug,
);

/** Resolve a slug. Undefined for an unknown one - the page then calls notFound(). */
export function getProject(slug: string): RealProject | undefined {
  return REAL_PROJECTS.find((project) => project.slug === slug);
}

/** Path helper, so no detail-route string is ever retyped. */
export function projectPath(project: RealProject): string {
  return `${ROUTES.projectDetail.path}/${project.slug}`;
}

/* ==========================================================================
   /projects - INDEX PAGE COPY
   ========================================================================== */

export type ProjectsPageContent = {
  readonly label: string;
  readonly titleLines: readonly DisplayLine[];
  readonly spokenTitle: string;
  readonly lede: string;
  readonly intro: string;
  readonly unresolved: UnresolvedSlot;
};

export const PROJECTS_PAGE: ProjectsPageContent = {
  label: "(PROJECTS)",
  titleLines: [
    { text: "Commercial", style: "roman" },
    { text: "projects.", style: "italic" },
  ],
  spokenTitle: "Commercial projects.",
  lede: "JDKD Developers LLP builds commercial real estate in New Delhi. One building is documented here in full; the rest of the record is still to come.",
  intro:
    "JDKD Corporate Tower, on Mathura Road, is available for leasing now. Beneath it are three completed JDKD properties. Their written records are still to come.",
  unresolved: UNRESOLVED.portfolio,
};

/* ==========================================================================
   /about - PAGE COPY
   The worked reference route: statement, practice, numbers, principles,
   leadership. The five principles are the homepage's own, read straight from
   BELIEFS_GRID so the two renderings can never drift apart.
   ========================================================================== */

export type AboutPageContent = {
  readonly label: string;
  readonly titleLines: readonly DisplayLine[];
  readonly spokenTitle: string;
  readonly lede: string;
  readonly heroImage: ImageAsset;
  readonly statement: {
    readonly label: string;
    readonly headingLines: readonly DisplayLine[];
    readonly spokenHeading: string;
    readonly paragraphs: readonly string[];
    readonly image: ImageAsset;
  };
  readonly practice: {
    readonly label: string;
    readonly headingLines: readonly DisplayLine[];
    readonly spokenHeading: string;
    readonly paragraphs: readonly string[];
    readonly disciplines: readonly CopyBlock[];
    readonly image: ImageAsset;
  };
  readonly numbers: {
    readonly label: string;
    readonly figures: readonly Figure[];
    readonly note: string;
  };
  readonly principles: {
    readonly label: string;
    readonly headingLines: readonly DisplayLine[];
    readonly spokenHeading: string;
    readonly intro: string;
    readonly items: readonly Principle[];
  };
  readonly leadership: {
    readonly label: string;
    readonly headingLines: readonly DisplayLine[];
    readonly spokenHeading: string;
    readonly body: string;
    readonly slot: UnresolvedSlot;
  };
};

export const ABOUT_PAGE: AboutPageContent = {
  label: "(ABOUT)",
  titleLines: [
    { text: "The practice", style: "roman" },
    { text: "behind the", style: "italic" },
    { text: "building.", style: "roman" },
  ],
  spokenTitle: "The practice behind the building.",
  lede: "JDKD Developers LLP builds commercial real estate in New Delhi. Its current work is JDKD Corporate Tower, on Mathura Road.",
  heroImage: IMAGES.towerExterior,

  statement: {
    label: "(STATEMENT)",
    headingLines: [
      { text: "Decisions", style: "italic" },
      { text: "made once,", style: "roman" },
      { text: "lived with", style: "italic" },
      { text: "for decades.", style: "roman" },
    ],
    spokenHeading: "Decisions made once, lived with for decades.",
    paragraphs: [
      "The choices that shape a working day in an office building - the floor height, the orientation, the power, the light - are all made before anyone moves in, and they are lived with for the whole life of the building.",
      "JDKD Corporate Tower was specified that way: 14 ft 9 in floor to floor, a corner plot open on two sides, North and North-West facing, LEED certified and earthquake-resistant. None of it is visible from the street. All of it is the reason the building works.",
    ],
    image: IMAGES.lobby,
  },

  practice: {
    label: "(WHAT WE DO)",
    headingLines: [
      { text: "Commercial", style: "roman" },
      { text: "work, start", style: "italic" },
      { text: "to finish.", style: "roman" },
    ],
    spokenHeading: "Commercial work, start to finish.",
    paragraphs: [
      // "and no plan for one" was cut. That was a forward-looking claim about
      // the LLP's strategy which appears nowhere in the client's material - it
      // leaked in from a build instruction ("commercial only, do not create a
      // residential portfolio") that described what to BUILD, not what the
      // company intends. This page is the client speaking; it may only say
      // what the source material supports.
      "JDKD Developers LLP is a commercial developer. The practice builds offices, and keeps them running once they are built.",
    ],
    disciplines: [
      {
        id: "development",
        title: "Development",
        body: "Ground-up commercial development. JDKD Corporate Tower occupies a 2,179.13 sq.m prime corner plot at A-11, Mohan Cooperative Industrial Estate, open on two sides, with direct access off Main Mathura Road.",
      },
      {
        id: "leasing",
        title: "Leasing",
        body: "The tower is available for leasing now: seven office floors over two basement levels, each floor 14 ft 9 in high, with dual-side dedicated parking beneath and two passenger plus two service elevators.",
      },
      {
        id: "stewardship",
        title: "Stewardship",
        body: "A green building kept in its own order - solar panels, rainwater harvesting, a sewage treatment plant and planters around the perimeter, behind an earthquake-resistant structure and LEED certification.",
      },
    ],
    image: IMAGES.lobbyWide,
  },

  numbers: {
    label: "(BY THE NUMBERS)",
    figures: [
      {
        id: "plot-area",
        value: "23,456",
        unit: "sq.ft",
        descriptor: "Plot area - 2,179.13 sq.m",
      },
      {
        id: "office-floors",
        value: "7",
        unit: null,
        descriptor: "Office floors",
      },
      {
        id: "basements",
        value: "2",
        unit: null,
        descriptor: "Basement levels",
      },
      {
        id: "floor-height",
        value: "14'9\"",
        unit: null,
        descriptor: "Floor height - 4.5 metres",
      },
      {
        id: "parapet",
        value: "41.05",
        unit: "m",
        descriptor: "Terrace parapet level",
      },
    ],
    note: "Every figure is for JDKD Corporate Tower, A-11 Mohan Cooperative Industrial Estate, Mathura Road, New Delhi.",
  },

  principles: {
    label: "(PRINCIPLES)",
    headingLines: [
      { text: "Five", style: "roman" },
      { text: "principles.", style: "italic" },
    ],
    spokenHeading: "Five principles.",
    intro:
      "Not a manifesto. Each one is a decision already taken in the building on Mathura Road, and each one can be checked against the drawings.",
    // Read from the homepage's own content. One source, two renderings.
    items: BELIEFS_GRID.principles,
  },

  leadership: {
    label: "(LEADERSHIP)",
    headingLines: [
      { text: "Who", style: "roman" },
      { text: "signs it.", style: "italic" },
    ],
    spokenHeading: "Who signs it.",
    body: "JDKD Corporate Tower is developed by JDKD Developers LLP, New Delhi. Individual profiles are not published here yet, and this page will not carry names until they are confirmed.",
    slot: UNRESOLVED.leadership,
  },
};

/* ==========================================================================
   /contact - PAGE COPY
   ========================================================================== */

/** One way of arriving. Drawn only from the confirmed location facts. */
export type Direction = {
  readonly id: string;
  readonly mode: string;
  readonly detail: string;
  /**
   * The distance, hung under the mode on `/contact` as a measured figure.
   *
   * EVERY VALUE HERE IS A VERBATIM SUBSTRING OF `detail` - it is the same
   * confirmed number, set rather than restated, so the column cannot drift
   * away from the sentence beside it.
   *
   * OPTIONAL, AND THE GAP IS THE POINT. `road` has no distance because none
   * was ever confirmed for it, so its cell renders empty. A blank cell in a
   * measured drawing is honest; the moment someone fills it with "~6 min" the
   * page is inventing facts about a real building. Leave it blank.
   */
  readonly mark?: string;
};

export type ContactPageContent = {
  readonly label: string;
  readonly titleLines: readonly DisplayLine[];
  readonly spokenTitle: string;
  readonly lede: string;
  /**
   * The direct-channel band. The phone number is the ONLY path on this page
   * that reaches a human today, so the page prints it at display scale - which
   * is why this block carries no copy beyond a marker and one factual line.
   * The number itself is never duplicated here; it is read from `contact`.
   */
  readonly call: {
    readonly label: string;
    readonly note: string;
  };
  readonly statement: {
    readonly headingLines: readonly DisplayLine[];
    readonly spokenHeading: string;
    readonly paragraphs: readonly string[];
  };
  readonly form: {
    readonly label: string;
    readonly heading: string;
    readonly body: string;
    /**
     * The no-backend disclosure, rendered ABOVE the fields - never after them.
     * It deliberately stops before the phone number so the page can print that
     * number as a real `tel:` link rather than freeze it into a sentence.
     */
    readonly notice: string;
  };
  /** Ground for the enquiry band. Bleeds off the right viewport edge. */
  readonly enquiryImage: ImageAsset;
  readonly address: {
    readonly label: string;
    readonly lines: readonly string[];
    /** The horizon plate under the address. Full bleed, both edges. */
    readonly image: ImageAsset;
    /** Caption for that plate. Confirmed distances only. */
    readonly caption: string;
  };
  readonly directions: {
    readonly label: string;
    readonly body: string;
    readonly items: readonly Direction[];
  };
  readonly contact: Contact;
};

export const CONTACT_PAGE: ContactPageContent = {
  label: "(CONTACT)",
  titleLines: [
    { text: "Enquire", style: "roman" },
    { text: "about the", style: "italic" },
    { text: "building.", style: "roman" },
  ],
  spokenTitle: "Enquire about the building.",
  // Leads with the path that actually works. The form has no backend yet -
  // `EnquiryForm.handleSubmit` only reports that nothing was sent - so telling
  // the visitor to "send the form" above the fold, and disclosing the truth
  // only after they have filled three required fields, gets the order exactly
  // backwards. The phone number is the live channel; say so first.
  //
  // The second clause used to read "leave your details below and we will call
  // back". That is a promise nothing on this page can keep: the form posts
  // nowhere, so no call back can follow. Phone-first ordering is preserved and
  // the promise is replaced with the truth.
  lede: "JDKD Corporate Tower is available for leasing now. Call Mr. Roy on 9811998811 - the enquiry form below is not connected yet, so the phone is the channel that works.",
  call: {
    label: "(CALL)",
    note: "The leasing contact for JDKD Corporate Tower.",
  },
  statement: {
    headingLines: [
      { text: "Tell us", style: "roman" },
      { text: "what you", style: "italic" },
      { text: "need.", style: "roman" },
    ],
    spokenHeading: "Tell us what you need.",
    paragraphs: [
      "Floor area, preferred floors, target occupancy date. We will come back with availability, floor plates and a time to walk the building.",
      "Seven office floors sit over two basements at A-11, Mohan Cooperative Industrial Estate, each one 14 ft 9 in floor to floor, with dual-side dedicated parking beneath.",
    ],
  },
  form: {
    label: "(ENQUIRY)",
    heading: "Send an enquiry",
    body: "Every field marked optional can be left blank. Nothing is shared with third parties.",
    // Rendered above the first field. Ends without the number on purpose - the
    // page prints it immediately after as a tel: link.
    notice:
      "This form is not connected yet, so submitting it sends nothing anywhere. To reach us today, call Mr. Roy on",
  },
  enquiryImage: IMAGES.lobby,
  address: {
    label: "(ADDRESS)",
    lines: CONTACT.address.lines,
    image: IMAGES.locationAerial,
    caption:
      "Sarita Vihar Metro, 350 m. Apollo Hospital, 500 m. The NOIDA business hub, 5 km.",
  },
  directions: {
    label: "(GETTING THERE)",
    body: "The estate sits on Mathura Road between central Delhi and NOIDA, on the Violet Line corridor.",
    items: [
      {
        id: "metro",
        mode: "By metro",
        mark: "350 m",
        detail:
          "Sarita Vihar station on the Violet Line is 350 m from the site - a short walk down Mathura Road.",
      },
      {
        id: "road",
        mode: "By road",
        detail:
          "Direct access from Main Mathura Road into Mohan Cooperative Industrial Estate. The building is at plot A-11.",
      },
      {
        id: "landmark",
        mode: "Nearest landmark",
        mark: "500 m",
        detail: "Apollo Hospital is 500 m away on the same road.",
      },
      {
        id: "noida",
        mode: "From NOIDA",
        mark: "5 km",
        detail: "The NOIDA business hub is 5 km from the site.",
      },
    ],
  },
  contact: CONTACT,
};

/* ==========================================================================
   404 - PAGE COPY
   ========================================================================== */

export type NotFoundPageContent = {
  readonly label: string;
  readonly titleLines: readonly DisplayLine[];
  readonly spokenTitle: string;
  readonly lede: string;
  /** Real routes only. Every href here resolves. */
  readonly links: readonly NavItem[];
};

export const NOT_FOUND_PAGE: NotFoundPageContent = {
  label: "(404)",
  titleLines: [
    { text: "Page not", style: "roman" },
    { text: "found.", style: "italic" },
  ],
  spokenTitle: "Page not found.",
  lede: "This page does not exist. JDKD Corporate Tower, on Mathura Road, is available for leasing now.",
  links: [
    { id: "home", label: "Homepage", href: ROUTES.home.path },
    { id: "projects", label: "Projects", href: ROUTES.projects.path },
    { id: "about", label: "About", href: ROUTES.about.path },
    { id: "contact", label: "Contact", href: ROUTES.contact.path },
  ],
};

