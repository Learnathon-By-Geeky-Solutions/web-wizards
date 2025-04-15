import apiService from './apiService';

export const documentApi = apiService.injectEndpoints({
  endpoints: (builder) => ({
    getDocuments: builder.query({
      query: (filters = {}) => {
        const queryParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            queryParams.append(key, value);
          }
        });
        
        const queryString = queryParams.toString();
        return queryString 
          ? `medical-records/documents/?${queryString}` 
          : `medical-records/documents/`;
      },
      providesTags: ['Document'],
    }),

    getDocumentById: builder.query({
      query: (id) => `medical-records/documents/${id}/`,
      providesTags: (result, error, id) => [{ type: 'Document', id }],
    }),

    getDocumentsByType: builder.query({
      query: (documentType) => `medical-records/documents/by_type/?type=${documentType}`,
      providesTags: ['Document'],
    }),

    getDocumentsByHealthIssue: builder.query({
      query: (healthIssueId) => `medical-records/documents/by_health_issue/?health_issue_id=${healthIssueId}`,
      providesTags: ['Document'],
    }),

    uploadAndProcessDocument: builder.mutation({
      query: (formData) => {
        // Remove any existing fields that might cause issues
        if (formData.has('timestamp')) formData.delete('timestamp');
        if (formData.has('type')) formData.delete('type');
        if (formData.has('signature')) formData.delete('signature');
        
        return {
          url: 'medical-records/documents/upload_and_process/',
          method: 'POST',
          // Don't set Content-Type when using FormData
          formData: true,
          body: formData,
        };
      },
      invalidatesTags: ['Document'],
    }),

    deleteDocument: builder.mutation({
      query: (id) => ({
        url: `medical-records/documents/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Document'],
    }),

    updateDocument: builder.mutation({
      query: ({ id, documentData }) => ({
        url: `medical-records/documents/${id}/`,
        method: 'PUT',
        body: documentData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Document', id }, 'Document'],
    }),

    reprocessWithOCR: builder.mutation({
      query: (id) => ({
        url: `medical-records/documents/${id}/reprocess_with_ocr/`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Document', id }, 'Document'],
    }),
  }),
});

export const {
  useGetDocumentsQuery,
  useGetDocumentByIdQuery,
  useGetDocumentsByTypeQuery,
  useGetDocumentsByHealthIssueQuery,
  useUploadAndProcessDocumentMutation,
  useDeleteDocumentMutation,
  useUpdateDocumentMutation,
  useReprocessWithOCRMutation,
} = documentApi;