import async from 'async';
import axios from 'axios';
import { chunk, flatten, merge } from 'lodash';

//
// Type Definitions
//

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

//
// TheGivingBlock API access info
//

const BASE_URL = 'https://public-api.tgbwidget.com';
const username = process.env.GIVING_BLOCK_USERNAME;
const password = process.env.GIVING_BLOCK_PASSWORD;
const RATE_LIMIT = 5;
const REFRESH_RATE_IN_MILLIS = 1200; // assuming 1 second (refresh rate limit) plus +/- 200 millis (latency of each request)

export let cachedOrganizations: Organization[] = [];

export async function refreshOrganizations() {
  const accessToken = await login();

  const organizations = await getOrganizationsList(accessToken);

  await getDetailedOrganizations(organizations, accessToken);

  cachedOrganizations = organizations;
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
    console.error(data);
    throw 'Failed to login';
  }

  return data.accessToken;
}

async function getOrganizationsList(accessToken: string) {
  const response = await axios.get(`${BASE_URL}/v1/organizations/list`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const data: { organizations?: Organization[] } = response.data.data;

  if (!data.organizations) {
    console.error(data);
    throw 'Failed to fetch organizations';
  }

  return data.organizations;
}

async function getDetailedOrganizations(
  organizations: Organization[],
  accessToken: string,
) {
  const groupedOrganizations = chunk(organizations, RATE_LIMIT);

  const newOrganizations: Organization[][] = [];

  await async.eachOf(
    groupedOrganizations,
    async (group: Organization[], index) => {
      await delay(<number>index * REFRESH_RATE_IN_MILLIS);
      newOrganizations[<number>index] = await parallelRequests(
        group,
        accessToken,
      );
    },
  );

  return flatten(newOrganizations);
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parallelRequests(organizations: Organization[], accessToken: string) {
  return async.map(organizations, async (organization: Organization) => {
    const detailedOrganization = await getOrganizationById(
      organization.id,
      accessToken,
    );
    return merge(organization, detailedOrganization || {});
  });
}

async function getOrganizationById(id: number, accessToken: string) {
  const response = await axios.get(`${BASE_URL}/v1/organization/${id}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const data: { organization?: Organization } = response.data.data;

  if (!data.organization) {
    console.error(data);
    throw 'Failed to fetch organization';
  }

  return data.organization;
}
