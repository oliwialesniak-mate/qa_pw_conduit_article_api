import { test as base } from '@playwright/test';
import { request as apiRequest } from '@playwright/test';
import { Logger } from '../../src/common/logger/Logger';
import { generateNewUserData } from '../../src/common/testData/generateNewUserData';
import * as allure from 'allure-js-commons';
import { parseTestTreeHierarchy } from '../../src/common/helpers/allureHelpers';

export const test = base.extend<
  {
    usersNumber;
    contextsNumber;
    infoTestLog;
    addAllureTestHierarchy;
    authToken: string;
  },
  {
    logger;
  }
>({
  usersNumber: [1, { option: true }],
  contextsNumber: [1, { option: true }],
  logger: [
    async ({}, use) => {
      const logger = new Logger('error');

      await use(logger);
    },
    { scope: 'worker' },
  ],
  infoTestLog: [
    async ({ logger }, use, testInfo) => {
      const indexOfTestSubfolderStart = testInfo.file.indexOf('/tests') + 7;
      const fileName = testInfo.file.substring(indexOfTestSubfolderStart);

      logger.info(`Test started: ${fileName}`);

      await use('infoTestLog');

      logger.info(`Test completed: ${fileName}`);
    },
    { scope: 'test', auto: true },
  ],
  addAllureTestHierarchy: [
    async ({ logger }, use, testInfo) => {
      const fileName = testInfo.file;

      const [parentSuite, suite, subSuite] = parseTestTreeHierarchy(
        fileName,
        logger,
      );

      await allure.parentSuite(parentSuite);
      await allure.suite(suite);
      if (subSuite) {
        await allure.subSuite(subSuite);
      }

      await use('addAllureTestHierarhy');
    },
    { scope: 'test', auto: true },
  ],

  authToken: [
    async ({ request }, use) => {
      const loginResponse = await request.post('/api/users/login', {
        data: {
          user: {
            email: 'testuser@gmail.com',
            password: 'Test123',
          },
        },
      });

      const loginJson = await loginResponse.json();
      const token = loginJson.user.token;
      await use(token);
    },
    { scope: 'test' },
  ],
});