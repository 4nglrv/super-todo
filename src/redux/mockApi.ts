import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import ICreateTodo from '../types/components/createTodo'
import { IUpdateTodo } from '../types/components/taskList'
import { ITodoInvalidResponse, ITodoResponse } from '../types/store/mockApi'

export const mockApi = createApi({
  reducerPath: 'mockApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://63ef7176271439b7fe6e865d.mockapi.io/api/' }),
  tagTypes: ['Todos'],
  endpoints: (build) => ({
    getTodos: build.query<ITodoResponse[], void>({
      query: () => `todo`,
      providesTags: (result) => result
        ? [
          ...result.map(({ id }) => ({ type: 'Todos' as const, id })),
          { type: 'Todos', id: 'LIST' },
        ]
        : [{ type: 'Todos', id: 'LIST' }],
      transformResponse: (response: ITodoResponse[]) => {
        return response.reverse()
      }
    }),

    addTodo: build.mutation<ITodoResponse, ICreateTodo>({
      query: (body) => ({
        url: `todo`,
        method: 'POST',
        body
      }),
      invalidatesTags: [{ type: 'Todos', id: 'LIST' }]
    }),

    deleteTodo: build.mutation<ITodoResponse | ITodoInvalidResponse, string>({
      query: (id) => ({
        url: `todo/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Todos', id: 'LIST' }]
    }),

    updateTodo: build.mutation<ITodoResponse, IUpdateTodo>({
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