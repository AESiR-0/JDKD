/**
 * JDKD — single source of truth for site content.
 *
 * Every value in this file is drawn from the client's leasing deck. Nothing
 * here is invented. Anything the client has not confirmed is exposed through
 * {@link UNRESOLVED} and rendered as a visible, labelled empty slot — never as
 * a fabricated fact.
 *
 * Section components import from here. They must not hard-code copy, numbers,
 * addresses, phone numbers or image paths inline.
 *
 * WHAT THIS FILE DOES NOT HOLD. Layout. There is no `span`, `column`, `offset`
 * or `align` anywhere below. The site is anchor-composed per section, so where
 * a thing sits is a decision the section component owns; what it says is a
 * decision this file owns. The one exception is {@link DisplayLine.style},
 * which is typography carried by the copy itself — the alternation of italic
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
  /** Anchor id — becomes `<section id>`. */
  readonly id: SectionId;
  /**
   * Human-readable name for assistive technology. Used as `aria-label` when a
   * section has no visible heading, and never rendered as visible text.
   */
  readonly label: string;
  /**
   * The visible parenthetical label, brackets included, e.g. "(ABOUT)".
   * NULL where the section deliberately renders none — the hero, the bento,
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
   * rendering one MUST make its provisional status visible — never dress a
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
  /* -- Real client renders ------------------------------------------------ */
  heroTower: {
    src: "/images/hero-tower.jpg",
    width: 814,
    height: 900,
    alt: "JDKD Corporate Tower at dusk, seen from Mathura Road.",
    placeholder: false,
  },
  towerExterior: {
    src: "/images/tower-exterior.jpg",
    width: 864,
    height: 929,
    alt: "Full elevation of JDKD Corporate Tower at blue hour.",
    placeholder: false,
  },
  lobby: {
    src: "/images/lobby.jpg",
    width: 656,
    height: 900,
    alt: "Lobby detail at JDKD Corporate Tower, looking toward the entrance.",
    placeholder: false,
  },
  lobbyWide: {
    src: "/images/lobby-wide.jpg",
    width: 800,
    height: 900,
    alt: "Wide view of the JDKD Corporate Tower lobby.",
    placeholder: false,
  },
  locationAerial: {
    src: "/images/location-aerial.jpg",
    width: 864,
    height: 900,
    alt: "Aerial view of Mathura Road showing the metro corridor beside the site.",
    placeholder: false,
  },
  facadeDetail: {
    src: "/images/facade-detail.jpg",
    width: 848,
    height: 900,
    alt: "Close view of the glass curtain wall and its vertical fins.",
    placeholder: false,
  },

  /* -- Real client drawings — floor plans ---------------------------------
     Scans of the deck's plan sheets. All three are 1323x552 on disk (read off
     the files, not guessed). They are DRAWINGS, not photographs: they carry
     legends, grid references and dimension strings that are unreadable at any
     size a phone can show, so a component rendering one MUST also render the
     text fallback carried on `PROJECT_TOWER.floorPlans[].summary` / `.legend` /
     `.notes`. The alt text below names the sheet and stops there; it is not a
     substitute for that fallback.

     There is no site-plan asset. A crop of that sheet failed and the file left
     on disk is not usable — do not reference it. */
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

  /* -- Placeholder frames — buildings & parks ----------------------------- */
  parkOne: {
    src: "/images/buildings/park-01.jpg",
    width: 1200,
    height: 896,
    alt: "Placeholder frame. Photography for this development has not been supplied.",
    placeholder: true,
  },
  parkTwo: {
    src: "/images/buildings/park-02.jpg",
    width: 1200,
    height: 896,
    alt: "Placeholder frame. Photography for this development has not been supplied.",
    placeholder: true,
  },
  parkThree: {
    src: "/images/buildings/park-03.jpg",
    width: 1376,
    height: 768,
    alt: "Placeholder frame. Photography for this development has not been supplied.",
    placeholder: true,
  },

  /* -- Placeholder frame — bento backdrop --------------------------------- */
  beliefsBackdrop: {
    src: "/images/beliefs/office-interior.jpg",
    width: 1376,
    height: 768,
    alt: "",
    placeholder: true,
  },

  /* -- Placeholder frames — features -------------------------------------- */
  terraceLarge: {
    src: "/images/features/terrace-large.jpg",
    width: 896,
    height: 1200,
    alt: "Placeholder frame for the terrace lounge.",
    placeholder: true,
  },
  terraceSmall: {
    src: "/images/features/terrace-small.jpg",
    width: 1024,
    height: 1024,
    alt: "",
    placeholder: true,
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
    alt: "Placeholder frame for the building's plant and infrastructure.",
    placeholder: true,
  },
  infrastructureSmall: {
    src: "/images/features/infrastructure-small.jpg",
    width: 1024,
    height: 1024,
    alt: "",
    placeholder: true,
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
   * PLACEHOLDER — the real domain is not confirmed. Set NEXT_PUBLIC_SITE_URL
   * in the deployment environment before launch.
   */
  readonly origin: string;
  /**
   * False while `origin` is still the placeholder. `app/layout.tsx` reads this
   * to force `robots: { index: false }` — shipping an indexable canonical that
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
   THE ASSET — JDKD Corporate Tower
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
   SECTION REGISTRY — the running order
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
 * Anchor id on the `<footer>` element. The footer is the site's contact block —
 * address, leasing contact and the RERA slot. Kept here so the nav and the
 * footer cannot drift apart.
 */
export const FOOTER_ID = "contact" as const;

/* ==========================================================================
   01 — HERO
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
    "JDKD Corporate Tower — Grade A commercial office space on Mathura Road, New Delhi",
  serifLines: ["An address", "that works."],
  lede: "A LEED certified Grade A office building at A-11, Mohan Cooperative Industrial Estate. Seven floors over two basements, now available for leasing.",
};

/* ==========================================================================
   02 — ABOUT
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
   * Sentence beneath the figure. Kept short on purpose — it is set at
   * `text-micro` on a 24ch measure, so anything long turns into a paragraph.
   */
  readonly descriptor: string;
};

export type AboutContent = {
  readonly label: string;
  /**
   * Five lines of display type, alternating italic and roman. They are broken
   * for composition, not for reading — `spokenHeading` is what a screen reader
   * gets.
   */
  readonly headingLines: readonly [
    DisplayLine,
    DisplayLine,
    DisplayLine,
    DisplayLine,
    DisplayLine,
  ];
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
    { text: "A building", style: "italic" },
    { text: "designed", style: "roman" },
    { text: "for work,", style: "italic" },
    { text: "built for", style: "roman" },
    { text: "the long run.", style: "italic" },
  ],
  spokenHeading: "A building designed for work, built for the long run.",
  paragraphs: [
    "JDKD Corporate Tower stands at A-11, Mohan Cooperative Industrial Estate, on Mathura Road — a prime corner plot, open on two sides, oriented North and North-West.",
    "Seven office floors over two basements. LEED certified, earthquake-resistant and solar integrated, with 14 ft 9 in floor heights that carry daylight past the glass line.",
  ],
  figures: [
    {
      id: "plot-area",
      value: "23,456",
      unit: "sq.ft",
      descriptor: "Plot area — 2,179.13 sq.m",
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
    // rating first. The floor height and the basements are still stated — they
    // moved into the rail paragraphs, where the detail belongs.
    {
      id: "building-height",
      value: "41",
      unit: "m",
      descriptor: "To terrace parapet — 41.05 m",
    },
    {
      // Non-numeric. `Counter` renders this verbatim rather than animating it.
      id: "certification",
      value: "LEED",
      unit: null,
      descriptor: "Certified green building",
    },
  ],
  image: IMAGES.lobby,
};

/* ==========================================================================
   03 — BUILDINGS & PARKS
   Three chapters, every one an explicit stand-in. The client's wider project
   record has not been supplied, so nothing below asserts a project, a place or
   a date. See UNRESOLVED.portfolio.
   ========================================================================== */

export type BuildingChapter = {
  readonly id: string;
  readonly title: string;
  readonly body: string;
  readonly image: ImageAsset;
  /**
   * Always true today. A section rendering one of these MUST show its
   * provisional status — the frame is a composition holder, not a project.
   */
  readonly placeholder: true;
};

export const BUILDINGS: readonly [
  BuildingChapter,
  BuildingChapter,
  BuildingChapter,
] = [
  {
    id: "chapter-one",
    title: "Development one",
    body: "A placeholder frame. JDKD's wider project record has not been supplied, so no project, location or date is claimed here. Image and copy follow from the client.",
    image: IMAGES.parkOne,
    placeholder: true,
  },
  {
    id: "chapter-two",
    title: "Development two",
    body: "A placeholder frame, reserved for a completed JDKD development. Nothing on it is an assertion; it holds the composition until the record arrives.",
    image: IMAGES.parkTwo,
    placeholder: true,
  },
  {
    id: "chapter-three",
    title: "Development three",
    body: "A placeholder frame. The only development this site documents today is JDKD Corporate Tower, on Mathura Road, now available for leasing.",
    image: IMAGES.parkThree,
    placeholder: true,
  },
];

/* ==========================================================================
   04 — BELIEFS A / VISION
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
    "The decisions that matter in an office building are made once, at construction, and lived with for decades — the floor height, the orientation, the power, the light. We made them deliberately, so the people who work here never have to think about them.",
  image: IMAGES.lobbyWide,
};

/* ==========================================================================
   05 — BELIEFS B / THE BENTO
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
      body: "Solar panels, rainwater harvesting, a sewage treatment plant and planters around the building — a green building that keeps its own house in order.",
    },
  ],
  backdrop: IMAGES.beliefsBackdrop,
};

/* ==========================================================================
   06 — FEATURES
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
      "An in-house gym inside the building, so the working day does not have to leave it to find one.",
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
   07 — FAQ
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
        "The plot measures 2,179.13 sq.m — 23,456.16 sq.ft. Above it sit seven office floors over two basement levels, with the terrace parapet at +41.05 m.",
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
      answer: `Send the enquiry form on this page, or call ${CONTACT.leasingContact.name} on ${CONTACT.leasingContact.phoneDisplay}. JDKD Corporate Tower is now available for leasing.`,
    },
  ],
};

/* ==========================================================================
   08 — CTA / ENQUIRY
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
  body: "Tell us the floor area you need and when you want to occupy. We will come back with availability, floor plates and a time to walk the building.",
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
    placeholder: "Your name",
  },
  {
    id: "organisation",
    label: "Organisation",
    type: "text",
    autoComplete: "organization",
    required: false,
    placeholder: "Company name",
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
   `openGraph.title` — Next only templates the field it is declared on.
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
    ogTitle: "JDKD Corporate Tower — Grade A commercial landmark, New Delhi",
    description:
      "A LEED certified Grade A commercial office building at A-11, Mohan Cooperative Industrial Estate, Mathura Road, New Delhi. Now available for leasing.",
    ogImage: IMAGES.heroTower,
  },
  about: {
    path: "/about",
    title: "About",
    ogTitle: "About JDKD Developers LLP",
    description:
      "JDKD Developers LLP builds commercial real estate in New Delhi. Its current work is JDKD Corporate Tower — a LEED certified, earthquake-resistant Grade A office building of seven floors over two basements at A-11, Mohan Cooperative Industrial Estate, Mathura Road.",
    ogImage: IMAGES.towerExterior,
  },
  projects: {
    path: "/projects",
    title: "Projects",
    ogTitle: "Projects — JDKD Developers LLP",
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
    ogTitle: "Page not found — JDKD",
    description:
      "This page does not exist. JDKD Corporate Tower on Mathura Road, New Delhi is available for leasing now.",
    ogImage: IMAGES.heroTower,
  },
};

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
 * It used to be four homepage fragments — `/#about`, `/#buildings`,
 * `/#features`, `/#beliefs` — which was the only wayfinding a one-page site
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
 * The order is the site's own hierarchy — who we are, what we have built, how
 * to reach us — not alphabetical.
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
 *              visitor back to the homepage — the opposite of what a button
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
   09 — FOOTER
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
    placeholder: "Project details to follow.",
    note: "The residential and wider project list is pending from the client. Section 03 renders labelled placeholder frames until it arrives.",
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
 * `value` is exactly what renders at rest — `Counter` animates it when it parses
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
   only — so a placeholder cannot grow a route by accident.
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
 * deck — Location Advantage / Future-Ready Infrastructure / Asset
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
 * `colour` is the colour the DRAWING uses, written as a word — never painted as
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
 * viewer MUST expose all three as real text — that is the accessible route to
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
 * A file that EXISTS in /public. Never list a download that is not on disk —
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

/** Fields both kinds of entry carry — everything the INDEX needs. */
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
  /** Rendered beside the frame, e.g. "(RESERVED)". */
  readonly marker: string;
};

export type RealProject = ProjectCommon & {
  readonly placeholder: false;
  readonly slug: string;
  readonly status: string;
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
      "Seven office floors sit over two basement levels, each 14 ft 9 in — 4.5 metres — floor to floor, with the terrace parapet at +41.05 m. The building is LEED certified and earthquake-resistant, with solar panels, rainwater harvesting and a sewage treatment plant of its own.",
    ],
    specs: [
      { id: "asset-class", term: "Asset class", value: ASSET.assetClass },
      { id: "availability", term: "Availability", value: ASSET.availability },
      { id: "address", term: "Address", value: ASSET.address.oneLine },
      {
        id: "plot-area",
        term: "Plot area",
        value: `${ASSET.plotArea.sqm} — ${ASSET.plotArea.sqft}`,
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
        title: "Location Advantage",
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
        title: "Future-Ready Infrastructure",
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
        title: "Asset Differentiators",
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
          "The lower of the two basement levels. Car parking bays are drawn in two runs across the middle of the slab and a third along the north edge. The core — passenger and service elevators, staircases and fire exits — is grouped along the south side, next to a marked security room. Service areas sit at the north-east corner and on the south edge. Arrows across the deck set out the one-way vehicle circulation, and a ramp enters from the west.",
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
        meta: "JPG — 1323 × 552 px — 123 KB",
      },
      {
        id: "fifth-floor",
        label: "Fifth floor plan",
        description:
          "Open office plate, core, refuge area, and an elevation of the building.",
        href: IMAGES.planFifthFloor.src,
        filename: "jdkd-corporate-tower-fifth-floor.jpg",
        meta: "JPG — 1323 × 552 px — 104 KB",
      },
      {
        id: "sixth-seventh-floor",
        label: "Sixth and seventh floor plan",
        description:
          "The repeating upper plate, its column grid, and the building height section.",
        href: IMAGES.planSixthSeventhFloor.src,
        filename: "jdkd-corporate-tower-sixth-seventh-floor.jpg",
        meta: "JPG — 1323 × 552 px — 89 KB",
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
    body: "Tell us the floor area you need and when you want to occupy. We will come back with availability, floor plates and a time to walk the building.",
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

export const PROJECT_PLACEHOLDERS: readonly [
  PlaceholderProject,
  PlaceholderProject,
] = [
  {
    id: "reserved-one",
    slug: null,
    placeholder: true,
    name: "Reserved",
    marker: "(RESERVED)",
    summary:
      "A reserved frame. JDKD's wider project record has not been supplied, so no project, location or date is claimed here. There is no page behind this entry.",
    image: IMAGES.parkOne,
  },
  {
    id: "reserved-two",
    slug: null,
    placeholder: true,
    name: "Reserved",
    marker: "(RESERVED)",
    summary:
      "A second reserved frame. The only development this site documents today is JDKD Corporate Tower, on Mathura Road, now available for leasing.",
    image: IMAGES.parkTwo,
  },
];

/** The index's running order: the real project first, then the reserved frames. */
export const PROJECTS: readonly Project[] = [
  PROJECT_TOWER,
  ...PROJECT_PLACEHOLDERS,
];

/** Narrowing guard. Call it before reaching for any detail-page field. */
export function isRealProject(project: Project): project is RealProject {
  return !project.placeholder;
}

/** Every project that HAS a detail route. The source for generateStaticParams. */
export const REAL_PROJECTS: readonly RealProject[] =
  PROJECTS.filter(isRealProject);

export const PROJECT_SLUGS: readonly string[] = REAL_PROJECTS.map(
  (project) => project.slug,
);

/** Resolve a slug. Undefined for an unknown one — the page then calls notFound(). */
export function getProject(slug: string): RealProject | undefined {
  return REAL_PROJECTS.find((project) => project.slug === slug);
}

/** Path helper, so no detail-route string is ever retyped. */
export function projectPath(project: RealProject): string {
  return `${ROUTES.projectDetail.path}/${project.slug}`;
}

/* ==========================================================================
   /projects — INDEX PAGE COPY
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
    "JDKD Corporate Tower, on Mathura Road, is available for leasing now. The frames beneath it are reserved and assert nothing — they hold space for projects the client has yet to supply.",
  unresolved: UNRESOLVED.portfolio,
};

/* ==========================================================================
   /about — PAGE COPY
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
      "The choices that shape a working day in an office building — the floor height, the orientation, the power, the light — are all made before anyone moves in, and they are lived with for the whole life of the building.",
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
      // the LLP's strategy which appears nowhere in the client's material — it
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
        body: "A green building kept in its own order — solar panels, rainwater harvesting, a sewage treatment plant and planters around the perimeter, behind an earthquake-resistant structure and LEED certification.",
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
        descriptor: "Plot area — 2,179.13 sq.m",
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
        descriptor: "Floor height — 4.5 metres",
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
    body: "JDKD Corporate Tower is developed by JDKD Developers LLP, New Delhi. Individual profiles are not published here yet, and this page will not carry names until the client confirms them.",
    slot: UNRESOLVED.leadership,
  },
};

/* ==========================================================================
   /contact — PAGE COPY
   ========================================================================== */

/** One way of arriving. Drawn only from the confirmed location facts. */
export type Direction = {
  readonly id: string;
  readonly mode: string;
  readonly detail: string;
};

export type ContactPageContent = {
  readonly label: string;
  readonly titleLines: readonly DisplayLine[];
  readonly spokenTitle: string;
  readonly lede: string;
  /**
   * The direct-channel band. The phone number is the ONLY path on this page
   * that reaches a human today, so the page prints it at display scale — which
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
     * The no-backend disclosure, rendered ABOVE the fields — never after them.
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
  // Leads with the path that actually works. The form has no backend yet —
  // `EnquiryForm.handleSubmit` only reports that nothing was sent — so telling
  // the visitor to "send the form" above the fold, and disclosing the truth
  // only after they have filled three required fields, gets the order exactly
  // backwards. The phone number is the live channel; say so first.
  //
  // The second clause used to read "leave your details below and we will call
  // back". That is a promise nothing on this page can keep: the form posts
  // nowhere, so no call back can follow. Phone-first ordering is preserved and
  // the promise is replaced with the truth.
  lede: "JDKD Corporate Tower is available for leasing now. Call Mr. Roy on 9811998811 — the enquiry form below is not connected yet, so the phone is the channel that works.",
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
    // Rendered above the first field. Ends without the number on purpose — the
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
        detail:
          "Sarita Vihar station on the Violet Line is 350 m from the site — a short walk down Mathura Road.",
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
        detail: "Apollo Hospital is 500 m away on the same road.",
      },
      {
        id: "noida",
        mode: "From NOIDA",
        detail: "The NOIDA business hub is 5 km from the site.",
      },
    ],
  },
  contact: CONTACT,
};

/* ==========================================================================
   404 — PAGE COPY
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
  lede: "This address does not exist. JDKD Corporate Tower, on Mathura Road, is available for leasing now.",
  links: [
    { id: "home", label: "Homepage", href: ROUTES.home.path },
    { id: "projects", label: "Projects", href: ROUTES.projects.path },
    { id: "about", label: "About", href: ROUTES.about.path },
    { id: "contact", label: "Contact", href: ROUTES.contact.path },
  ],
};

