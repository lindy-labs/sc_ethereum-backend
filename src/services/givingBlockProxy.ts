import NodeCache from 'node-cache';
import axios from 'axios';
import { mapLimit } from 'async';
import _ from 'lodash';

//
// TheGivingBlock API access info
//

const BASE_URL = 'https://public-api.tgbwidget.com';
const username = process.env.GIVING_BLOCK_USERNAME;
const password = process.env.GIVING_BLOCK_PASSWORD;

//
// Cache TTL
//

const TWO_HOURS = 60 * 60 * 2;
const ONE_DAY = 60 * 60 * 24;
const UNLIMITED = 0;

const cache = new NodeCache({ deleteOnExpire: false });

cache.on("expired", async (key, _value) => {
  switch (key) {
    case 'GivingBlockAccessToken':
      await refreshAccessToken();
      break;

    default:
      break;
  }
});

async function login(): Promise<string> {
  const accessToken = cache.get<string>('GivingBlockAccessToken');
  if (accessToken) return accessToken;

  const response = await axios({
    method: "post",
    url: `${BASE_URL}/v1/login`,
    data: JSON.stringify({
      login: username,
      password,
    }),
    headers: { "Content-Type": "application/json" },
  });

  const { data } = response.data;

  if (!data.accessToken || !data.refreshToken) {
    console.error(data);
    throw "Failed to login";
  }

  cache.set<string>('GivingBlockAccessToken', data.accessToken, TWO_HOURS);
  cache.set<string>('GivingBlockRefreshToken', data.refreshToken, UNLIMITED);

  return data.accessToken;
}

async function refreshAccessToken() {
  console.log("refreshing");

  const refreshToken = cache.get<string>('GivingBlockRefreshToken');

  const response = await axios({
    method: "post",
    url: `${BASE_URL}/v1/refresh-tokens`,
    data: JSON.stringify({refreshToken}),
    headers: { "Content-Type": "application/json" },
  });

  const { data } = response.data;

  if (!data.accessToken || !data.refreshToken) {
    console.error(data);
    throw "Failed to refresh token";
  }

  cache.set<string>('GivingBlockAccessToken', data.accessToken, TWO_HOURS);
  cache.set<string>('GivingBlockRefreshToken', data.refreshToken, UNLIMITED);
}

export async function getOrganizationsList() {
  const organizations = cache.get('GivingBlockCachedOrganizations');
  if (organizations) return organizations;

  const accessToken = await login();

  const response = await axios({
    method: "get",
    url: `${BASE_URL}/v1/organizations/list`,
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  const { data } = response.data;

  if (!data.organizations) {
    console.error(data);
    throw "Failed to fetch organizations";
  }

  console.log(`Found ${data.organizations.length} organizations`);

  cache.set('GivingBlockCachedOrganizations', data.organizations, ONE_DAY);

  return data.organizations;
}

async function getOrganizationById(id: number, accessToken: string): Promise<any> {
  const response = await axios({
    method: "get",
    url: `${BASE_URL}/v1/organization/${id}`,
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
  });

  const { data } = response.data;

  if (!data.organization) {
    console.error(data);
    throw "Failed to fetch organization";
  }

  return data.organization;
}

export async function populateCache() {
  await getOrganizationsList();
}
