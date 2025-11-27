import {
  NOT_FOUND,
  SUCCESS_CODE,
  UNAUTHORIZED,
} from '../../../src/constants/responceCodes';
import { test } from '../../_fixtures/fixtures';
import { expect } from '@playwright/test';

test.describe('Unfollow user profile case', () => {
  test('Unfollow existing user profile', async ({
    profilesApi,
    usersApi,
    authToken,
  }) => {
    const newUser = {
      username: `user_${Date.now()}`,
      email: `user_${Date.now()}@gmail.com`,
      password: 'Test123',
    };

    await usersApi.registerNewUser(newUser);

    await profilesApi.followProfile(newUser.username, authToken);

    const response = await profilesApi.unfollowProfile(
      newUser.username,
      authToken,
    );
    expect(response.status()).toBe(SUCCESS_CODE);
  });

  test('Unfollow not existing user profile', async ({
    profilesApi,
    authToken,
  }) => {
    const notExistingUser = 'non_exist_123';
    const response = await profilesApi.unfollowProfile(
      notExistingUser,
      authToken,
    );
    expect(response.status()).toBe(NOT_FOUND);
  });

  test('Unfollow existing user with empty auth token', async ({
    profilesApi,
    usersApi,
  }) => {
    const newUser = {
      username: `user_${Date.now()}`,
      email: `user_${Date.now()}@gmail.com`,
      password: 'Test123',
    };

    await usersApi.registerNewUser(newUser);
    const response = await profilesApi.unfollowProfile(newUser.username, '');
    expect(response.status()).toBe(UNAUTHORIZED);
  });
});