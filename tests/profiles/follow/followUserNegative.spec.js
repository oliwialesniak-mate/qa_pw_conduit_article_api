import { NOT_FOUND, UNAUTHORIZED } from '../../../src/constants/responceCodes';
import { test, expect } from '../../_fixtures/fixtures';

test.describe('Negative cases for follow user', () => {
  test('Follow not existing user profile', async ({ profilesApi }) => {
    const authToken = '';
    const username = 'notexistTest';
    const response = await profilesApi.followProfile(username, authToken);
    expect(response.status()).toBe(NOT_FOUND);
  });

  test('Follow existing user with empty auth token', async ({
    profilesApi,
    usersApi,
  }) => {
    const newUser = {
      userName: `user_${Date.now()}`,
      email: `user_${Date.now()}@gmail.com`,
      password: 'Test123',
    };
    await usersApi.registerNewUser(newUser);

    const response = await profilesApi.followProfile(newUser.userName, '');
    expect(response.status()).toBe(UNAUTHORIZED);
  });
});