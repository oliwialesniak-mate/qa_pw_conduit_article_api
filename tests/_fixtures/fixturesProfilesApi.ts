import { test as base } from '@playwright/test';
import { ProfilesApi } from '../../src/api/endpoints/ProfilesApi';

export const test = base.extend<{
  profilesApi: ProfilesApi;
}>({
  profilesApi: async ({ request }, use) => {
    const client = new ProfilesApi(request);

    await use(client);
  },
});