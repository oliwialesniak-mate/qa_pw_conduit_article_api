import { test as base } from '@playwright/test';

export const test = base.extend({
  articlesApi: async ({ request, authToken }, use) => {
    const apiBase = '/api/articles';

    const createArticle = (article, token) => {
      return request.post(apiBase, {
        data: { article },
        headers: token ? { Authorization: `Token ${token}` } : {},
      });
    };

    const getArticle = (slug, token) => {
      return request.get(`${apiBase}/${slug}`, {
        headers: token ? { Authorization: `Token ${token}` } : {},
      });
    };

    const deleteArticle = (slug, token) => {
      return request.delete(`${apiBase}/${slug}`, {
        headers: token ? { Authorization: `Token ${token}` } : {},
      });
    };

    await use({
      createArticle,
      getArticle,
      deleteArticle,
    });
  },
});