import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { userLoggedIn, userLoggedOut } from "../authSlice";

const USER_API = "http://localhost:8080/api/v1/user";

export const authApi = createApi({
    reducerPath:"authApi",
    baseQuery:fetchBaseQuery({
        baseUrl:USER_API,
        credentials:'include',
        prepareHeaders: (headers) => {
            // Add any default headers here if needed
            return headers;
        }
    }),
    endpoints: (builder) => ({
        registerUser: builder.mutation({
            query: (inputData) => ({
                url:"/register",
                method:"POST",
                body:inputData,
                credentials:'include'
            }),
            async onQueryStarted(_, {queryFulfilled, dispatch}) {
                try {
                    const result = await queryFulfilled;
                    if (result.data.success) {
                        // If registration is successful and user is automatically logged in
                        dispatch(userLoggedIn({user:result.data.user}));
                    }
                } catch (error) {
                    console.error('Registration failed:', error?.data?.message || 'Registration failed');
                    throw error;
                }
            }
        }),
        loginUser: builder.mutation({
            query: (inputData) => ({
                url:"/login",
                method:"POST",
                body:inputData,
                credentials:'include'
            }),
            async onQueryStarted(_, {queryFulfilled, dispatch}) {
                try {
                    const result = await queryFulfilled;
                    if (result.data.success) {
                        // Store user data in Redux store
                        dispatch(userLoggedIn({user:result.data.user}));
                    }
                } catch (error) {
                    console.error('Login failed:', error?.data?.message || 'Authentication failed');
                    throw error;
                }
            }
        }),
        logoutUser: builder.mutation({
            query: () => ({
                url:"/logout",
                method:"GET",
                credentials:'include'
            }),
            async onQueryStarted(_, {queryFulfilled, dispatch}) {
                try { 
                    await queryFulfilled;
                    // Clear user data from Redux store
                    dispatch(userLoggedOut());
                } catch (error) {
                    console.error('Logout failed:', error?.data?.message || 'Logout failed');
                    // Still clear user data even if server logout fails
                    dispatch(userLoggedOut());
                }
            }
        }),
        loadUser: builder.query({
            query: () => ({
                url:"/profile",
                method:"GET",
                credentials:'include'
            }),
            async onQueryStarted(_, {queryFulfilled, dispatch}) {
                try {
                    const result = await queryFulfilled;
                    if (result.data.success) {
                        dispatch(userLoggedIn({user:result.data.user}));
                    }
                } catch (error) {
                    console.error('Load user failed:', error?.data?.message || 'Failed to load user data');
                }
            }
        }),
        updateUser: builder.mutation({
            query: (formData) => ({
                url:"profile/update",
                method:"PUT",
                body:formData,
                credentials:'include'
            })
        })
    })
});

export const {
    useRegisterUserMutation,
    useLoginUserMutation,
    useLogoutUserMutation,
    useLoadUserQuery,
    useUpdateUserMutation
} = authApi;
