import { configureStore } from '@reduxjs/toolkit'

import { localStorageMiddleware, reHydrateStore } from './localStorage'
import { mockApi } from './mockApi'

export const store = configureStore({
  reducer: {
    [mockApi.reducerPath]: mockApi.reducer
  },
  preloadedState: reHydrateStore(),
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([ mockApi.middleware, localStorageMiddleware ]) 
})
export type RootState = ReturnType<typeof store.getState>