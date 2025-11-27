import { expect } from '@playwright/test';
import { generateNewArticleData } from '../../../src/common/testData/generateNewArticleData';
import { test } from '../../_fixtures/fixtures';
import {
  SUCCESS_CODE,
  UNAUTHORIZED,
  UNPROCESSABLE_ENTITY,
} from '../../../src/constants/responceCodes';

test.describe('Article creation tests', () => {

  test('Create article with empty tags array', async ({
    articlesApi,
    authToken,
    logger,
  }) => {
    const articleData = generateNewArticleData(logger, 0);

    const newArticle = {
      title: articleData.title,
      description: articleData.description,
      body: articleData.text,
      tagList: [],
    };

    const response = await articlesApi.createArticle(newArticle, authToken);

    expect(response.status()).toBe(SUCCESS_CODE);
  });

  test('Fail to create article with empty body', async ({
    articlesApi,
    authToken,
    logger,
  }) => {
    const articleData = generateNewArticleData(logger, 0);

    const newArticle = {
      title: articleData.title,
      description: articleData.description,
      body: '',
      tagList: articleData.tags,
    };

    const response = await articlesApi.createArticle(newArticle, authToken);

    expect(response.status()).toBe(UNPROCESSABLE_ENTITY);
  });

  test('Fail to create article with empty title', async ({
    articlesApi,
    authToken,
    logger,
  }) => {
    const articleData = generateNewArticleData(logger, 0);

    const newArticle = {
      title: '',
      description: articleData.description,
      body: articleData.text,
      tagList: articleData.tags,
    };

    const response = await articlesApi.createArticle(newArticle, authToken);

    expect(response.status()).toBe(UNPROCESSABLE_ENTITY);
  });

  test('Fail to create article as unauthorized user', async ({
    articlesApi,
    logger,
  }) => {
    const articleData = generateNewArticleData(logger, 0);

    const newArticle = {
      title: articleData.title,
      description: articleData.description,
      body: articleData.text,
      tagList: articleData.tags,
    };

    const response = await articlesApi.createArticle(newArticle, '');

    expect(response.status()).toBe(UNAUTHORIZED);
  });

  test('Create article with all valid fields', async ({
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

    const response = await articlesApi.createArticle(newArticle, authToken);

    expect(response.status()).toBe(SUCCESS_CODE);
  });

});
