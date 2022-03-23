import NodeCache from 'node-cache';
import axios from 'axios';
import { mapLimit } from 'async';
import _ from 'lodash';

//
// Type Definitions
//

type Organization = {
  id: number,
  name: string,
  logo: string,
  country: string,
  allowsAnon: boolean,
  nonprofitTaxID: string,
  areNotesEnabled: boolean,
  isReceiptEnabled: boolean,
  categories?: {id: number, name: string}[],
  widgetCode?: {iframe: string, script: string},
  websiteBlocks?: WebsiteBlocks
}

type WebsiteBlocks = Map<string, {settings: string | null, value: string | null}>

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

//
// Cache
//

const cache = new NodeCache({ 
  deleteOnExpire: false, 
  useClones: false
});

cache.on("expired", async (key, _value) => {
  switch (key) {
    case 'GivingBlockAccessToken':
      await refreshAccessToken();
      break;

    case 'GivingBlockCachedOrganizations':
      await refreshOrganizationsList();
      break;

    default:
      break;
  }
});

//
// Private Functions
//

async function login() {
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

  cacheAccessTokens(data.accessToken, data.refreshToken);

  return <string> data.accessToken;
}

async function refreshAccessToken() {
  console.log("refreshing")
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

  cacheAccessTokens(data.accessToken, data.refreshToken);
}

function cacheAccessTokens(accessToken: string, refreshToken: string) {
  cache.set<string>('GivingBlockAccessToken', accessToken, TWO_HOURS);
  cache.set<string>('GivingBlockRefreshToken', refreshToken, UNLIMITED);
}

async function refreshOrganizationsList() {
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

  cache.set<Organization[]>('GivingBlockCachedOrganizations', data.organizations, ONE_DAY);
}

async function getOrganizationById(id: number, accessToken: string) {
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

  return <Organization> data.organization;
}

//
// Public Functions
//

export function getOrganizationsList() {
  return cache.get<Organization[]>('GivingBlockCachedOrganizations') || [];
}

export function getOrganizationsListTTL() {
  const ttl = cache.getTtl('GivingBlockCachedOrganizations') || 0;
  return ttl > 0 ? ttl - Date.now() : 0;
}

export async function populateCache() {
  await refreshOrganizationsList();
}
