import apiService from './apiService';

export const notificationsApi = apiService.injectEndpoints({
  endpoints: (builder) => ({
    // Get all notifications with optional filtering
    getNotifications: builder.query({
      query: (filters = {}) => {
        const params = {};
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params[key] = value;
          }
        });
        
        return {
          url: 'medications/notifications/',
          params
        };
      },
      providesTags: ['Notification'],
    }),
    
    // Get pending notifications
    getPendingNotifications: builder.query({
      query: () => 'medications/notifications/pending/',
      providesTags: ['Notification'],
    }),
    
    // Mark a notification as read
    markNotificationAsRead: builder.mutation({
      query: (notificationId) => ({
        url: `medications/notifications/${notificationId}/mark_as_read/`,
        method: 'POST',
      }),
      invalidatesTags: ['Notification'],
    }),
    
    // Dismiss a notification
    dismissNotification: builder.mutation({
      query: (notificationId) => ({
        url: `medications/notifications/${notificationId}/dismiss/`,
        method: 'POST',
      }),
      invalidatesTags: ['Notification'],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetPendingNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useDismissNotificationMutation,
} = notificationsApi;