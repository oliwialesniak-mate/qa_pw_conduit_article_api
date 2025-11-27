import { NOT_FOUND, UNAUTHORIZED } from '../../../src/constants/responceCodes';
import { test, expect } from '../../_fixtures/fixtures';

test.describe('Negative cases for following a user', () => {

  test('Attempt to follow a non-existing user profile', async ({ profilesApi, authToken }) => {
    const username = `non_existing_user_${Date.now()}`;

    const response = await profilesApi.followProfile(username, authToken);

    expect(response.status()).toBe(NOT_FOUND);
  });

  test('Attempt to follow an existing user with an empty auth token', async ({
    profilesApi,
    usersApi,
  }) => {
    const newUser = {
      username: `user_${Date.now()}`,
      email: `user_${Date.now()}@gmail.com`,
      password: 'Test123',
    };

    await usersApi.registerNewUser(newUser);

    const response = await profilesApi.followProfile(newUser.username, '');

    expect(response.status()).toBe(UNAUTHORIZED);
  });

});
