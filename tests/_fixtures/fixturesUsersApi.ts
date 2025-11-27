import { test as base } from '@playwright/test';
import { request as apiRequest } from '@playwright/test';
import { UsersApi } from '../../src/api/endpoints/UsersApi';
import { generateNewUserData } from '../../src/common/testData/generateNewUserData';

export const test = base.extend<{
  usersApi: UsersApi;
  newUserData;
  newUsersData;
  registeredUser;
  registeredUsers;
  userRequests;
}>({
  usersApi: async ({ request }, use) => {
    const client = new UsersApi(request);

    await use(client);
  },
  newUserData: async ({ logger }, use) => {
    const userData = generateNewUserData(logger);

    await use(userData);
  },
  newUsersData: async ({ logger, usersNumber }, use) => {
    const users = Array(usersNumber);

    for (let i = 0; i < usersNumber; i++) {
      users[i] = generateNewUserData(logger);
    }

    await use(users);
  },
  registeredUser: async ({ usersApi, newUserData }, use) => {
    const response = await usersApi.registerNewUser(newUserData);

    await usersApi.assertSuccessResponseCode(response);

    newUserData['token'] = await usersApi.parseTokenFromBody(response);

    await use(newUserData);
  },
  registeredUsers: async ({ usersApi, newUsersData, usersNumber }, use) => {
    for (let i = 0; i < usersNumber; i++) {
      const response = await usersApi.registerNewUser(newUsersData[i]);

      await usersApi.assertSuccessResponseCode(response);

      newUsersData[i]['token'] = await usersApi.parseTokenFromBody(response);
    }
    await use(newUsersData);
  },
  userRequests: async ({ registeredUsers, usersNumber }, use) => {
    const userRequests = Array(usersNumber);

    for (let i = 0; i < usersNumber; i++) {
      userRequests[i] = await apiRequest.newContext({
        extraHTTPHeaders: {
          authorization: `Token ${registeredUsers[i].token}`,
          'content-type': 'application/json',
        },
      });
    }
    await use(userRequests);
  },
});