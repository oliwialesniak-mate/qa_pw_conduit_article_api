import { expect } from '@playwright/test';
import { generateNewArticleData } from '../../../src/common/testData/generateNewArticleData';
import { test } from '../../_fixtures/fixtures';
import { SUCCESS_CODE } from '../../../src/constants/responceCodes';
import { generateNewUserData } from '../../../src/common/testData/generateNewUserData';

test.describe('Reading article test', () => {
  test('Read existing artilce by unautorized user', async ({
    articlesApi,
    authToken,
    logger,
  }) => {
    const articleData = generateNewArticleData(logger, 0);

    const newArticle = {
      title: articleData.title,
      description: articleData.description,
      body: articleData.text,
      tagList: articleData.tags,
    };

    const createResponse = await articlesApi.createArticle(
      newArticle,
      authToken,
    );
    expect(createResponse.status()).toBe(SUCCESS_CODE);

    const createJSON = await createResponse.json();
    const slug = createJSON.article.slug;

    const readResponse = await articlesApi.getArticle(slug, '');
    expect(readResponse.status()).toBe(SUCCESS_CODE);
    const readJSON = await readResponse.json();
    expect(readJSON.article.title).toBe(newArticle.title);
  });

  test('Read artile created by user1 as authorized user2', async ({
    usersApi,
    articlesApi,
    logger,
  }) => {
    const user1 = generateNewUserData();
    const registerResp1 = await usersApi.registerNewUser(user1);

    const loginResp1 = await usersApi.loginUser(user1);
    const loginJson1 = await loginResp1.json();
    const tokenUser1 = await loginJson1.user.token;

    const user2 = generateNewUserData();
    const registerResp2 = await usersApi.registerNewUser(user2);

    const loginResp2 = await usersApi.loginUser(user2);
    const loginJson2 = await loginResp2.json();
    const tokenUser2 = await loginJson2.user.token;

    const newArticle = generateNewArticleData(logger, 0);
    const createResponse = await articlesApi.createArticle(
      newArticle,
      tokenUser1,
    );
    expect(createResponse.status()).toBe(SUCCESS_CODE);

    const createdJson = await createResponse.json();
    expect(createdJson.article).toBeTruthy();
    const slug = createdJson.article.slug;

    const readResponse = await articlesApi.getArticle(slug, tokenUser2);
    expect(readResponse.status()).toBe(SUCCESS_CODE);

    const readJson = await readResponse.json();
    expect(readJson.article.title).toBe(newArticle.title);
    expect(readJson.article.author.username).toBe(user1.username);
  });
});