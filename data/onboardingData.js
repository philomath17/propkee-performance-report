export const onboardingTypes = {
  agent: {
    title: 'Agent Onboarding',
    audienceSummary: 'Built for independent agents handling direct buyer and seller relationships.',
  },
  agency: {
    title: 'Agency Onboarding',
    audienceSummary: 'Structured process for agency teams with multiple stakeholders and admins.',
  },
  developer: {
    title: 'Developer Onboarding',
    audienceSummary: 'Optimized onboarding flow for developer partners, inventory sync, and compliance.',
  },
  influencer: {
    title: 'Influencer Onboarding',
    audienceSummary: 'Campaign-ready onboarding for creators promoting listings and partner initiatives.',
  },
};

export const sharedSections = {
  salesConsentCollection: {
    images: [
      'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  documentRequirements: [
    {
      title: 'Identity Verification Documents',
      content: 'Government-issued ID, selfie match record, and contact number verification are mandatory before activation.',
    },
    {
      title: 'Compliance Documents',
      content: 'Signed partner contract, tax profile, and acceptance of data handling policies are required to proceed.',
    },
    {
      title: 'Role-specific Proof',
      content: 'Submit licensing proof, company registration, or campaign portfolio depending on your onboarding type.',
    },
  ],
  verificationProcess:
    'Every submission is auto-screened, then validated by the operations desk. Critical mismatches trigger manual review and feedback within 24 business hours.',
  adminProfileVideo: 'https://www.loom.com/embed/71f2a2055f7846f69530f5f6c0aa4a12',
  reelUploadVideo: 'https://www.loom.com/embed/9f4e4df37e394f6c9b0f7d6fcf42a2c4',
  welcomeEmailImage:
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80',
  listingAdditionVideo: 'https://www.loom.com/embed/d0ac6c3dcf994f6eb84fdbf58f8f0673',
  complianceMaintenance:
    'Keep profile data current, review monthly policy updates, and complete quarterly quality checks to maintain verified status.',
};

export const onboardingSections = [
  { id: 'sales-consent', label: 'Sales Consent Collection' },
  { id: 'document-requirements', label: 'Document Requirements' },
  { id: 'verification-process', label: 'Verification Process' },
  { id: 'admin-profile', label: 'Admin Profile Creation' },
  { id: 'reel-upload', label: 'Reel Upload Process' },
  { id: 'welcome-email', label: 'Welcome Email' },
  { id: 'listing-addition', label: 'Listing Addition Process' },
  { id: 'compliance', label: 'Ongoing Compliance & Maintenance' },
];

export const homeCarouselSlides = [
  {
    title: 'One portal, every onboarding journey',
    description: 'Align operations, sales, and support teams with a centralized onboarding source of truth.',
  },
  {
    title: 'Designed for speed and compliance',
    description: 'Document checklists, media walkthroughs, and step-by-step verification reduce turnaround time.',
  },
  {
    title: 'Scales with every partner segment',
    description: 'Dedicated playbooks for Agent, Agency, Developer, and Influencer onboarding tracks.',
  },
];
