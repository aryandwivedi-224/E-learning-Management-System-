import { configureStore } from "@reduxjs/toolkit";
// import { authApi} from  "@/features/authApi";
import authReducer from "../features/authSlice";
import { authApi } from "@/features/api/authapi";
import rootReducer from "./rootReducer";
import { courseApi } from "@/features/api/courseApi";
import { purchaseApi } from "@/features/api/purchaseApi";

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authApi.middleware,courseApi.middleware,purchaseApi.middleware),
    devTools: true
  
});

export default store;

// const initializeApp = async () => {
//         await appStore.dispatch(authApi.endpoints.loadUser.initiate({},{forceRefetch:true}))
//     }
//     initializeApp();

// import {configureStore} from "@reduxjs/toolkit" 
// import rootRedcuer from "./rootRedcuer";
// import { authApi } from "@/features/api/authApi";
// import { courseApi } from "@/features/api/courseApi";
// import { purchaseApi } from "@/features/api/purchaseApi";
// import { courseProgressApi } from "@/features/api/courseProgressApi";

// export const appStore = configureStore({
//     reducer: rootRedcuer,
//     middleware:(defaultMiddleware) => defaultMiddleware().concat(authApi.middleware, courseApi.middleware, purchaseApi.middleware, courseProgressApi.middleware)
// });

// const initializeApp = async () => {
//     await appStore.dispatch(authApi.endpoints.loadUser.initiate({},{forceRefetch:true}))
// }
// initializeApp();