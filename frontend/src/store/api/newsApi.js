import apiService from './apiService';

export const newsApi = apiService.injectEndpoints({
  endpoints: (builder) => ({
    // Get a list of all news articles with optional filtering
    getAllNews: builder.query({
      query: (params = {}) => ({
        url: 'news/news/',
        params
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ id }) => ({ type: 'News', id })),
              { type: 'News', id: 'LIST' },
            ]
          : [{ type: 'News', id: 'LIST' }],
    }),

    // Get a single news article by slug
    getNewsDetail: builder.query({
      query: (slug) => `news/news/${slug}/`,
      providesTags: (result, error, slug) => [{ type: 'News', id: slug }],
    }),

    // Get all news categories
    getCategories: builder.query({
      query: () => 'news/categories/',
      providesTags: ['NewsCategory'],
    }),
  }),
});

export const {
  useGetAllNewsQuery,
  useGetNewsDetailQuery,
  useGetCategoriesQuery,
} = newsApi;