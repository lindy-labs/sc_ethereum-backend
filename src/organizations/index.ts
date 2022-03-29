import async from 'async';
import axios from 'axios';
import _, { chunk, flatten, merge } from 'lodash';
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
const username = process.env.GIVING_BLOCK_USERNAME;
const password = process.env.GIVING_BLOCK_PASSWORD;
const RATE_LIMIT = 5;
const REFRESH_RATE_IN_MILLIS = 1200; // assuming 1 second (refresh rate limit) plus +/- 200 millis (latency of each request)

const REQUEST_RETRIES = 5;
const RETRY_INTERVAL = 100;

let cachedOrganizations: Organization[] = [];

export async function refreshOrganizations() {
  const accessToken = await login();

  const organizations = await getOrganizations(accessToken);

  await getDetailedOrganizations(organizations, accessToken);
}

async function login() {
  const response = await axios.post(
    `${BASE_URL}/v1/login`,
    {
      login: username,
      password,
    },
    { headers: { 'Content-Type': 'application/json' } },
  );

  const data: { accessToken?: string } = response.data.data;

  if (!data.accessToken) {
    logger.error(data);
    throw 'Failed to login';
  }

  return data.accessToken;
}

async function getOrganizations(accessToken: string) {
  const response = await axios.get(`${BASE_URL}/v1/organizations/list`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const data: { organizations?: Organization[] } = response.data.data;

  if (!data.organizations) {
    logger.error(data);
    throw 'Failed to fetch organizations';
  }

  return data.organizations;
}

async function getDetailedOrganizations(
  organizations: Organization[],
  accessToken: string,
) {
  if (cachedOrganizations.length === 0) cachedOrganizations = organizations;

  const groupedOrganizations = chunk(organizations, RATE_LIMIT);

  await Promise.all(
    groupedOrganizations.map(async (group, index) => {
      await delay(index * REFRESH_RATE_IN_MILLIS);

      const organizations = await fetchOrganizationsDetails(group, accessToken);

      cachedOrganizations = cachedOrganizations
        .filter(({ id }) => !_.find(organizations, { id }))
        .concat(organizations);
    }),
  );
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function fetchOrganizationsDetails(
  organizations: Organization[],
  accessToken: string,
) {
  return Promise.all(
    organizations.map(async (organization) => {
      const detailedOrganization = await async.retry(
        { times: REQUEST_RETRIES, interval: RETRY_INTERVAL },
        async () => await getOrganizationById(organization.id, accessToken),
      );
      return merge(organization, detailedOrganization || {});
    }),
  );
}

async function getOrganizationById(id: number, accessToken: string) {
  const response = await axios.get(`${BASE_URL}/v1/organization/${id}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const data: { organization?: Organization } = response.data.data;

  if (!data.organization) {
    logger.error(data);
    throw 'Failed to fetch organization';
  }

  return data.organization;
}

export { cachedOrganizations as organizations };
