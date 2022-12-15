import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const mockApi = createApi({
  reducerPath: 'mockApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://63984cf0fe03352a94cbbf36.mockapi.io/api/' }),
  tagTypes: ['Todos'],
  endpoints: (build) => ({
    getTodos: build.query({
      query: () => `todo`,
      providesTags: (result) => result
        ? [
          ...result.map(({ id }) => ({ type: 'Todos', id })),
          { type: 'Todos', id: 'LIST' },
        ]
        : [{ type: 'Todos', id: 'LIST' }],
      transformResponse: (response) => {
        return response.reverse()
      }
    }),
    addTodo: build.mutation({
      query: (body) => ({
        url: `todo`,
        method: 'POST',
        body
      }),
      invalidatesTags: [{ type: 'Todos', id: 'LIST' }]
    }),
    deleteTodo: build.mutation({
      query: (id) => ({
        url: `todo/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Todos', id: 'LIST' }]
    }),
    updateTodo: build.mutation({
      query(body) {
        return {
          url: `todo/${body.id}`,
          method: 'PUT',
          body,
        }
      },
      invalidatesTags: [{ type: 'Todos', id: 'LIST' }]
    })
  }),
})

export const { useGetTodosQuery, useAddTodoMutation, useDeleteTodoMutation, useUpdateTodoMutation } = mockApi