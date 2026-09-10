export type TopicConfig = {
  slug: string;
  /** Exact label shown in the navbar */
  navLabel: string;
  kicker: string;
  title: string;
  crumb: string;
  edition: string;
  description: string;
  chips: string[];
  navOrder: number;
};

export const HR_TOPICS: TopicConfig[] = [
  {
    slug: "health-it",
    navLabel: "Health IT",
    kicker: "Health IT & AI",
    title: "Health IT and AI",
    crumb: "Health IT",
    edition: "Health IT Weekly",
    description:
      "Interoperability, EHR modernization, and enterprise AI, covered for the leaders making technology decisions that reshape how care is delivered.",
    chips: [
      "AI in Healthcare",
      "Interoperability",
      "EHR",
      "AI Governance",
      "AI Documentation",
      "AI Revenue Cycle",
    ],
    navOrder: 1,
  },
  {
    slug: "hospitals",
    navLabel: "Hospitals & Health Systems",
    kicker: "Hospitals & Health Systems",
    title: "Hospitals and Health Systems",
    crumb: "Hospitals",
    edition: "Hospital Executive Brief",
    description:
      "Operations, M&A, capital planning, and strategy, covered for the executives running hospitals and health systems in a margin-pressured market.",
    chips: [
      "Operations",
      "M&A",
      "Capital Planning",
      "Workforce",
      "Analytics",
      "Strategy",
    ],
    navOrder: 2,
  },
  {
    slug: "payers",
    navLabel: "Payers & Insurance",
    kicker: "Payers & Insurance",
    title: "Payers and Insurance",
    crumb: "Payers",
    edition: "Payer & Insurance Brief",
    description:
      "Reimbursement, claims automation, value-based contracts, and data sharing, decoded for the teams navigating a tougher payer landscape.",
    chips: [
      "Reimbursement",
      "Claims Automation",
      "Prior Authorization",
      "Value-Based Care",
      "Data Sharing",
      "Cost Management",
    ],
    navOrder: 3,
  },
  {
    slug: "digital-health",
    navLabel: "Digital Health",
    kicker: "Digital Health",
    title: "Digital Health",
    crumb: "Digital Health",
    edition: "Digital Health Weekly",
    description:
      "Virtual care, remote monitoring, and patient engagement, covered for the teams building the next generation of connected health experiences.",
    chips: [
      "Telehealth",
      "Remote Monitoring",
      "Patient Engagement",
      "Virtual Care",
      "Connected Platforms",
      "Integration",
    ],
    navOrder: 4,
  },
  {
    slug: "cybersecurity",
    navLabel: "Cybersecurity",
    kicker: "Healthcare Cybersecurity",
    title: "Healthcare Cybersecurity",
    crumb: "Cybersecurity",
    edition: "Security Brief",
    description:
      "Risk, resilience, and regulatory compliance, covered for the leaders protecting healthcare organizations from growing cyber threats.",
    chips: [
      "Risk Management",
      "Compliance",
      "Incident Response",
      "Connected Devices",
      "Resilience",
      "Board Governance",
    ],
    navOrder: 5,
  },
  {
    slug: "pharma-biotech",
    navLabel: "Pharma & Biotech",
    kicker: "Pharma, Biotech & MedTech",
    title: "Pharma, Biotech and MedTech",
    crumb: "Pharma & Biotech",
    edition: "Pharma Weekly",
    description:
      "Drug development, commercial strategy, device innovation, and AI in the pipeline, covered for the teams bringing therapies and technologies to market.",
    chips: [
      "Drug Development",
      "Commercial Launch",
      "MedTech",
      "AI Discovery",
      "Pricing",
      "Clinical Trials",
    ],
    navOrder: 6,
  },
];

const topicMap = new Map(HR_TOPICS.map((t) => [t.slug, t]));

export function getTopicConfig(slug: string): TopicConfig | undefined {
  return topicMap.get(slug);
}

export function getNavTopics(): TopicConfig[] {
  return [...HR_TOPICS].sort((a, b) => a.navOrder - b.navOrder);
}

export function sortTopicsByNavOrder<T extends { slug: string }>(
  topics: T[],
): T[] {
  return [...topics].sort((a, b) => {
    const ao = topicMap.get(a.slug)?.navOrder ?? 99;
    const bo = topicMap.get(b.slug)?.navOrder ?? 99;
    return ao - bo;
  });
}

export const FLAG_SIGNALS = [
  { label: "AI in Healthcare", text: "moves from experimentation to enterprise strategy" },
  { label: "Hospital M&A", text: "consolidation reshapes regional markets" },
  { label: "Healthcare Cybersecurity", text: "becomes a board-level priority" },
  { label: "Digital Health", text: "next phase defined by integration" },
  { label: "Revenue Cycle", text: "automation reshapes the economics" },
  { label: "Health Policy", text: "regulatory shifts accelerate technology adoption" },
];

export const HR_TOPIC_SLUGS = new Set(HR_TOPICS.map((t) => t.slug));

/** Topics that receive AI news articles. */
export const HR_NEWS_TOPIC_SLUGS = new Set(
  HR_TOPICS.map((t) => t.slug),
);
