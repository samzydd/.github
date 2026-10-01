import { image } from '../lib/assets';

export type ProductId = 'renovate-to-sell' | 'renovate-to-stay' | 'sell360' | 'flip360';
export type CategoryId = 'socials' | 'one-pager' | 'playbook' | 'postcard' | 'qr-codes';
export type ProjectStage = 'in-construction' | 'listed' | 'discussing' | 'completed';
export type ProjectStatus = 'ongoing' | 'completed';

export const PRODUCTS: { id: ProductId; label: string; badge: string }[] = [
  { id: 'renovate-to-sell', label: 'Renovate to sell', badge: 'Renovate to Sell' },
  { id: 'renovate-to-stay', label: 'Renovate to stay', badge: 'Renovate to Stay' },
  { id: 'sell360', label: 'Sell 360', badge: 'Sell360' },
  { id: 'flip360', label: 'Flip 360', badge: 'Flip360' },
];

export const CATEGORIES: { id: CategoryId; label: string; singular: string }[] = [
  { id: 'socials', label: 'Socials', singular: 'Social' },
  { id: 'one-pager', label: 'One pager', singular: 'One pager' },
  { id: 'playbook', label: 'Playbook', singular: 'Playbook' },
  { id: 'postcard', label: 'Postcard', singular: 'Postcard' },
  { id: 'qr-codes', label: 'QR codes', singular: 'QR code' },
];

export const PROJECT_STAGES: { id: ProjectStage; label: string }[] = [
  { id: 'in-construction', label: 'In Construction' },
  { id: 'listed', label: 'Listed' },
  { id: 'discussing', label: 'Discussing' },
  { id: 'completed', label: 'Completed' },
];

export const PROJECT_STATUSES: { id: ProjectStatus; label: string }[] = [
  { id: 'ongoing', label: 'Ongoing' },
  { id: 'completed', label: 'Completed' },
];

export const productById = (id: ProductId) => PRODUCTS.find((p) => p.id === id)!;
export const categoryById = (id: CategoryId) => CATEGORIES.find((c) => c.id === id)!;
export const stageById = (id: ProjectStage) => PROJECT_STAGES.find((s) => s.id === id)!;

export interface Template {
  id: string;
  /** Title shown on dashboard cards */
  name: string;
  /** Longer title shown in search results and suggestions */
  fullName: string;
  category: CategoryId;
  product: ProductId;
  thumbnail: string;
  /** Small square crop used in search suggestions */
  searchThumbnail: string;
  /** Full-size artwork for the preview page */
  preview: string;
}

export const TEMPLATES: Template[] = [
  {
    id: 'sell360-social',
    name: 'Sell360',
    fullName: 'Sell360 Social Post',
    category: 'socials',
    product: 'sell360',
    thumbnail: image('thumb-sell360-social'),
    searchThumbnail: image('search-sell360-social'),
    preview: image('template-preview-sell360'),
  },
  {
    id: 'rtsell-postcard',
    name: 'Renovate to sell',
    fullName: 'RTSell Postcard',
    category: 'postcard',
    product: 'renovate-to-sell',
    thumbnail: image('thumb-rtsell-postcard'),
    searchThumbnail: image('search-rtsell-postcard'),
    preview: image('thumb-rtsell-postcard'),
  },
  {
    id: 'sell360-playbook',
    name: 'Sell360',
    fullName: 'Sell360 Playbook',
    category: 'playbook',
    product: 'sell360',
    thumbnail: image('thumb-sell360-playbook'),
    searchThumbnail: image('search-sell360-playbook'),
    preview: image('thumb-sell360-playbook'),
  },
  {
    id: 'refer-earn',
    name: 'Refer & Earn',
    fullName: 'Refer & Earn',
    category: 'one-pager',
    product: 'renovate-to-stay',
    thumbnail: image('thumb-refer-earn'),
    searchThumbnail: image('search-refer-earn'),
    preview: image('thumb-refer-earn'),
  },
  {
    id: 'renovate-and-sell',
    name: 'Renovate and Sell',
    fullName: 'Renovate and Sell One Pager',
    category: 'one-pager',
    product: 'renovate-to-sell',
    thumbnail: image('thumb-renovate-and-sell'),
    searchThumbnail: image('thumb-renovate-and-sell'),
    preview: image('thumb-renovate-and-sell'),
  },
  {
    id: 'renovate-to-sell-social',
    name: 'Renovate to Sell',
    fullName: 'Renovate to Sell Social Post',
    category: 'socials',
    product: 'renovate-to-sell',
    thumbnail: image('thumb-renovate-to-sell-social'),
    searchThumbnail: image('thumb-renovate-to-sell-social'),
    preview: image('thumb-renovate-to-sell-social'),
  },
  {
    id: 'partner-op-postcard',
    name: 'Revive Partner OP',
    fullName: 'Revive Partner OP Postcard',
    category: 'postcard',
    product: 'flip360',
    thumbnail: image('thumb-revive-partner-op'),
    searchThumbnail: image('thumb-revive-partner-op'),
    preview: image('thumb-revive-partner-op'),
  },
  {
    id: 'partner-op-playbook',
    name: 'Revive Partner OP',
    fullName: 'Revive Partner OP Playbook',
    category: 'playbook',
    product: 'renovate-to-stay',
    thumbnail: image('thumb-revive-partner-op'),
    searchThumbnail: image('thumb-revive-partner-op'),
    preview: image('thumb-revive-partner-op'),
  },
];

export const templateById = (id: string) => TEMPLATES.find((t) => t.id === id);

export interface Project {
  id: string;
  address: string;
  cityLine: string;
  product: ProductId;
  stage: ProjectStage;
  status: ProjectStatus;
  templateCount: number;
  image: string;
}

const HOUSE = image('project-house');

export const PROJECTS: Project[] = [
  { id: 'p1', address: '123 Abbeywood Ln', cityLine: 'Charlotte, NC 28209', product: 'renovate-to-stay', stage: 'in-construction', status: 'ongoing', templateCount: 12, image: HOUSE },
  { id: 'p2', address: '1212 Spruce Rd', cityLine: 'Nashville, TN 37201', product: 'renovate-to-sell', stage: 'completed', status: 'completed', templateCount: 12, image: HOUSE },
  { id: 'p3', address: '1212 Maplewood Ave', cityLine: 'San Diego, CA 92102', product: 'sell360', stage: 'listed', status: 'ongoing', templateCount: 12, image: HOUSE },
  { id: 'p4', address: '1212 Magnolia Ln', cityLine: 'Los Angeles, CA 90001', product: 'flip360', stage: 'discussing', status: 'ongoing', templateCount: 12, image: HOUSE },
  { id: 'p5', address: '88 Willow Creek Dr', cityLine: 'Charlotte, NC 28210', product: 'flip360', stage: 'discussing', status: 'ongoing', templateCount: 12, image: HOUSE },
  { id: 'p6', address: '41 Harbor View Ct', cityLine: 'San Diego, CA 92106', product: 'flip360', stage: 'completed', status: 'completed', templateCount: 12, image: HOUSE },
  { id: 'p7', address: '907 Cedar Hollow Rd', cityLine: 'Nashville, TN 37205', product: 'flip360', stage: 'discussing', status: 'ongoing', templateCount: 12, image: HOUSE },
  { id: 'p8', address: '2300 Sunset Blvd', cityLine: 'Los Angeles, CA 90026', product: 'flip360', stage: 'completed', status: 'completed', templateCount: 12, image: HOUSE },
];

export const projectById = (id: string) => PROJECTS.find((p) => p.id === id);

/** The marketing materials generated for a project: every template, personalised. */
export function projectMaterials(project: Project): Template[] {
  return Array.from({ length: project.templateCount }, (_, i) => TEMPLATES[i % TEMPLATES.length]);
}

export const PROFILE = {
  firstName: 'Michelle',
  lastName: 'Philips',
  displayName: 'Michelle Phillips',
  role: 'Realtor',
  phone: '+1 (949) 778-2979',
  email: 'yashamova42@gmail.com',
  brokerage: 'Power Real Estate Group',
  license: '53210',
  state: 'Delaware',
  city: 'Middletown',
};

export const BROKERAGES = ['Power Real Estate Group', 'Keller Williams', 'Coldwell Banker', 'RE/MAX', 'Compass'];
export const STATES = ['Delaware', 'California', 'North Carolina', 'Tennessee'];
export const CITIES: Record<string, string[]> = {
  Delaware: ['Middletown', 'Dover', 'Wilmington', 'Newark'],
  California: ['Los Angeles', 'San Diego', 'San Francisco'],
  'North Carolina': ['Charlotte', 'Raleigh', 'Durham'],
  Tennessee: ['Nashville', 'Memphis', 'Knoxville'],
};
