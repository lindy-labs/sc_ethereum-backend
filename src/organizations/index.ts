import async from 'async';
import axios from 'axios';
import _ from 'lodash';
import logger from '../logger';

type Organization = {
  id: number;
  name: string;
  logo: string;
  country: string;
  allowsAnon: boolean;
  nonprofitTaxID: string;
  areNotesEnabled: boolean;
  isReceiptEnabled: boolean;
  categories?: { id: number; name: string }[];
  widgetCode?: { iframe: string; script: string };
  websiteBlocks?: WebsiteBlocks;
};

type WebsiteBlocks = {
  [key: string]: { settings: string | null; value: string | null };
};

const BASE_URL = 'https://public-api.tgbwidget.com';
const USERNAME = process.env.GIVING_BLOCK_USERNAME;
const PASSWORD = process.env.GIVING_BLOCK_PASSWORD;
const RATE_LIMIT = 5;
const REFRESH_RATE_IN_MILLIS = 1200; // assuming 1 second (refresh rate limit) plus +/- 200 millis (latency of each request)

const REQUEST_RETRIES = 5;
const RETRY_INTERVAL = 100;

let cachedOrganizations: Organization[] = [];
let accessToken: string;

export async function refreshOrganizations() {
  accessToken = await login();

  const organizations = await getOrganizationsList();

  await getAndUpdateOrganizationsDetails(organizations);
}

async function login() {
  const response = await axios.post(
    `${BASE_URL}/v1/login`,
    {
      login: USERNAME,
      password: PASSWORD,
    },
    { headers: { 'Content-Type': 'application/json' } },
  );

  const data: { accessToken?: string } = response.data.data;

  if (!data.accessToken) {
    logger.error(data);
    throw new Error('Failed to login');
  }

  return data.accessToken;
}

async function getOrganizationsList() {
  const response = await axios.get(`${BASE_URL}/v1/organizations/list`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const data: { organizations?: Organization[] } = response.data.data;

  if (!data.organizations) {
    logger.error(data);
    throw new Error('Failed to get organizations');
  }

  return data.organizations;
}

function getAndUpdateOrganizationsDetails(organizations: Organization[]) {
  if (cachedOrganizations.length === 0) cachedOrganizations = organizations;

  const groupedOrganizations = _.chunk(organizations, RATE_LIMIT);

  const promises = groupedOrganizations.map(async (group, index) => {
    await delay(index * REFRESH_RATE_IN_MILLIS);

    const detailedOrganizations = await getDetailedOrganizations(group);

    updateCachedOrganizations(detailedOrganizations);
  });

  return Promise.all(promises);
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getDetailedOrganizations(organizations: Organization[]) {
  return Promise.all(organizations.map(updateOrganizationDetails));
}

async function updateOrganizationDetails(organization: Organization) {
  const details = await async.retry(
    { times: REQUEST_RETRIES, interval: RETRY_INTERVAL },
    async () => getOrganizationById(organization.id),
  );

  return _.merge(organization, details || {});
}

async function getOrganizationById(id: number) {
  const response = await axios.get(`${BASE_URL}/v1/organization/${id}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    validateStatus: (status) => status <= 400,
  });

  if (response.status == 400) return {};

  const data: { organization?: Organization } = response.data.data;

  if (!data.organization) {
    logger.error(data);
    throw new Error('Failed to get organization');
  }

  return data.organization;
}

function updateCachedOrganizations(organizations: Organization[]) {
  const detailedOrganizations = organizations.filter((org) => org.categories);

  cachedOrganizations = cachedOrganizations
    .filter(({ id }) => !_.find(organizations, { id }))
    .concat(detailedOrganizations);
}

export { cachedOrganizations as organizations };
