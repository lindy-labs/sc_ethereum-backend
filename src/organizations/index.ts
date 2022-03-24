import async from 'async';
import axios from 'axios';
import { merge } from 'lodash';

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

export let organizations: Organization[] = [];

export async function refreshOrganizations() {
  const accessToken = await login();

  const newOrganizations = await getOrganizationsList(accessToken);

  await getOrganizationsRegardingRateLimit(newOrganizations, accessToken);

  organizations = newOrganizations;
}

async function login(): Promise<string> {
  const response = await axios({
    method: 'post',
    url: `${BASE_URL}/v1/login`,
    data: JSON.stringify({
      login: username,
      password,
    }),
    headers: { 'Content-Type': 'application/json' },
  });

  const { data } = response.data;

  if (!data.accessToken) {
    console.error(data);
    throw 'Failed to login';
  }

  return data.accessToken;
}

async function getOrganizationsList(accessToken: string) {
  const data = await get('/v1/organizations/list', accessToken);

  if (!data.organizations) {
    console.error(data);
    throw 'Failed to fetch organizations';
  }

  return data.organizations;
}

async function getOrganizationsRegardingRateLimit(
  newOrganizations: Organization[],
  accessToken: string,
) {
  await async.eachOf(
    newOrganizations,
    async (organization: Organization, index) => {
      const round = Math.floor(<number>index / RATE_LIMIT);

      await new Promise((resolve, _reject) => {
        setTimeout(async () => {
          const extendedOrg = await getOrganizationById(
            organization.id,
            accessToken,
          );
          newOrganizations[<number>index] = merge(
            organization,
            extendedOrg || {},
          );
          resolve(true);
        }, round * REFRESH_RATE_IN_MILLIS);
      });
    },
  );
}

async function getOrganizationById(
  id: number,
  accessToken: string,
) {
  const data: {organization?: Organization} = await get(`/v1/organization/${id}`, accessToken);

  if (!data.organization) {
    console.error(data);
    throw 'Failed to fetch organization';
  }

  return data.organization;
}

async function get(path: string, accessToken: string): Promise<any> {
  try {
    const response = await axios({
      method: 'get',
      url: `${BASE_URL}${path}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data.data;
  } catch (_error) {
    return get(path, accessToken);
  }
}
