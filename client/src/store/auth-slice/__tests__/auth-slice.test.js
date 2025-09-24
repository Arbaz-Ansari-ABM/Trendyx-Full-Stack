import { describe, it, expect, vi, beforeEach } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import axios from 'axios'
import authReducer, { 
  registerUser, 
  loginUser, 
  logoutUser, 
  checkAuth, 
  setUser 
} from '../index'

// Mock axios
vi.mock('axios')
const mockedAxios = axios

describe('Auth Slice', () => {
  let store

  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authReducer
      }
    })
    vi.clearAllMocks()
  })

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const state = store.getState().auth
      expect(state).toEqual({
        isAuthenticated: false,
        isLoading: true,
        user: null
      })
    })
  })

  describe('Auth Slice State Updates', () => {
    describe('registerUser', () => {
      it('should handle registerUser.pending', () => {
        const action = { type: registerUser.pending.type }
        const state = authReducer({
          isAuthenticated: false,
          isLoading: false,
          user: null
        }, action)

        expect(state.isLoading).toBe(true)
      })

      it('should handle registerUser.fulfilled', () => {
        const action = { 
          type: registerUser.fulfilled.type,
          payload: { success: true, message: 'Registration successful' }
        }
        const state = authReducer({
          isAuthenticated: false,
          isLoading: true,
          user: null
        }, action)

        expect(state.isLoading).toBe(false)
        expect(state.user).toBe(null)
        expect(state.isAuthenticated).toBe(false)
      })

      it('should handle registerUser.rejected', () => {
        const action = { 
          type: registerUser.rejected.type,
          error: { message: 'Registration failed' }
        }
        const state = authReducer({
          isAuthenticated: false,
          isLoading: true,
          user: null
        }, action)

        expect(state.isLoading).toBe(false)
        expect(state.user).toBe(null)
        expect(state.isAuthenticated).toBe(false)
      })
    })

    describe('loginUser', () => {
      it('should handle loginUser.pending', () => {
        const action = { type: loginUser.pending.type }
        const state = authReducer({
          isAuthenticated: false,
          isLoading: false,
          user: null
        }, action)

        expect(state.isLoading).toBe(true)
      })

      it('should handle loginUser.fulfilled with successful login', () => {
        const mockUser = {
          id: 'user123',
          email: 'test@example.com',
          userName: 'testuser',
          role: 'user'
        }
        const action = { 
          type: loginUser.fulfilled.type,
          payload: { 
            success: true, 
            user: mockUser,
            message: 'Logged in successfully'
          }
        }
        const state = authReducer({
          isAuthenticated: false,
          isLoading: true,
          user: null
        }, action)

        expect(state.isLoading).toBe(false)
        expect(state.user).toEqual(mockUser)
        expect(state.isAuthenticated).toBe(true)
      })

      it('should handle loginUser.fulfilled with failed login', () => {
        const action = { 
          type: loginUser.fulfilled.type,
          payload: { 
            success: false,
            message: 'Invalid credentials'
          }
        }
        const state = authReducer({
          isAuthenticated: false,
          isLoading: true,
          user: null
        }, action)

        expect(state.isLoading).toBe(false)
        expect(state.user).toBe(null)
        expect(state.isAuthenticated).toBe(false)
      })

      it('should handle loginUser.rejected', () => {
        const action = { 
          type: loginUser.rejected.type,
          error: { message: 'Network error' }
        }
        const state = authReducer({
          isAuthenticated: false,
          isLoading: true,
          user: null
        }, action)

        expect(state.isLoading).toBe(false)
        expect(state.user).toBe(null)
        expect(state.isAuthenticated).toBe(false)
      })
    })

    describe('checkAuth', () => {
      it('should handle checkAuth.pending', () => {
        const action = { type: checkAuth.pending.type }
        const state = authReducer({
          isAuthenticated: false,
          isLoading: false,
          user: null
        }, action)

        expect(state.isLoading).toBe(true)
      })

      it('should handle checkAuth.fulfilled with valid auth', () => {
        const mockUser = {
          id: 'user123',
          email: 'test@example.com',
          userName: 'testuser',
          role: 'user'
        }
        const action = { 
          type: checkAuth.fulfilled.type,
          payload: { 
            success: true, 
            user: mockUser
          }
        }
        const state = authReducer({
          isAuthenticated: false,
          isLoading: true,
          user: null
        }, action)

        expect(state.isLoading).toBe(false)
        expect(state.user).toEqual(mockUser)
        expect(state.isAuthenticated).toBe(true)
      })

      it('should handle checkAuth.fulfilled with invalid auth', () => {
        const action = { 
          type: checkAuth.fulfilled.type,
          payload: { 
            success: false,
            message: 'Token expired'
          }
        }
        const state = authReducer({
          isAuthenticated: true,
          isLoading: true,
          user: { id: 'user123' }
        }, action)

        expect(state.isLoading).toBe(false)
        expect(state.user).toBe(null)
        expect(state.isAuthenticated).toBe(false)
      })

      it('should handle checkAuth.rejected', () => {
        const action = { 
          type: checkAuth.rejected.type,
          error: { message: 'Auth check failed' }
        }
        const state = authReducer({
          isAuthenticated: true,
          isLoading: true,
          user: { id: 'user123' }
        }, action)

        expect(state.isLoading).toBe(false)
        expect(state.user).toBe(null)
        expect(state.isAuthenticated).toBe(false)
      })
    })

    describe('logoutUser', () => {
      it('should handle logoutUser.fulfilled', () => {
        const action = { 
          type: logoutUser.fulfilled.type,
          payload: { 
            success: true,
            message: 'Logged out successfully'
          }
        }
        const state = authReducer({
          isAuthenticated: true,
          isLoading: false,
          user: { id: 'user123', email: 'test@example.com' }
        }, action)

        expect(state.isLoading).toBe(false)
        expect(state.user).toBe(null)
        expect(state.isAuthenticated).toBe(false)
      })
    })

    describe('setUser', () => {
      it('should handle setUser action', () => {
        const mockUser = {
          id: 'user123',
          email: 'test@example.com',
          userName: 'testuser'
        }
        const action = setUser(mockUser)
        const state = authReducer({
          isAuthenticated: false,
          isLoading: false,
          user: null
        }, action)

        // Note: The current implementation has an empty reducer,
        // so the state should remain unchanged
        expect(state.user).toBe(null)
      })
    })
  })

  describe('Async Actions', () => {
    describe('registerUser', () => {
      it('should create registerUser action with correct payload', async () => {
        const mockResponse = {
          data: { success: true, message: 'Registration successful' }
        }
        mockedAxios.post.mockResolvedValue(mockResponse)

        const formData = {
          userName: 'testuser',
          email: 'test@example.com',
          password: 'password123'
        }

        const result = await store.dispatch(registerUser(formData))

        expect(mockedAxios.post).toHaveBeenCalledWith(
          'http://localhost:5000/api/auth/register',
          formData,
          { withCredentials: true }
        )
        expect(result.payload).toEqual(mockResponse.data)
      })

      it('should handle registerUser network error', async () => {
        const errorMessage = 'Network Error'
        mockedAxios.post.mockRejectedValue(new Error(errorMessage))

        const formData = {
          userName: 'testuser',
          email: 'test@example.com',
          password: 'password123'
        }

        const result = await store.dispatch(registerUser(formData))

        expect(result.type).toBe(registerUser.rejected.type)
      })
    })

    describe('loginUser', () => {
      it('should create loginUser action with correct payload', async () => {
        const mockResponse = {
          data: { 
            success: true, 
            message: 'Logged in successfully',
            user: {
              id: 'user123',
              email: 'test@example.com',
              userName: 'testuser',
              role: 'user'
            }
          }
        }
        mockedAxios.post.mockResolvedValue(mockResponse)

        const formData = {
          email: 'test@example.com',
          password: 'password123'
        }

        const result = await store.dispatch(loginUser(formData))

        expect(mockedAxios.post).toHaveBeenCalledWith(
          'http://localhost:5000/api/auth/login',
          formData,
          { withCredentials: true }
        )
        expect(result.payload).toEqual(mockResponse.data)
      })
    })

    describe('checkAuth', () => {
      it('should create checkAuth action with correct headers', async () => {
        const mockResponse = {
          data: { 
            success: true,
            user: {
              id: 'user123',
              email: 'test@example.com',
              userName: 'testuser',
              role: 'user'
            }
          }
        }
        mockedAxios.get.mockResolvedValue(mockResponse)

        const result = await store.dispatch(checkAuth())

        expect(mockedAxios.get).toHaveBeenCalledWith(
          'http://localhost:5000/api/auth/check-auth',
          {
            withCredentials: true,
            headers: {
              'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
            }
          }
        )
        expect(result.payload).toEqual(mockResponse.data)
      })
    })

    describe('logoutUser', () => {
      it('should create logoutUser action', async () => {
        const mockResponse = {
          data: { success: true, message: 'Logged out successfully' }
        }
        mockedAxios.post.mockResolvedValue(mockResponse)

        const result = await store.dispatch(logoutUser())

        expect(mockedAxios.post).toHaveBeenCalledWith(
          'http://localhost:5000/api/auth/logout',
          {},
          { withCredentials: true }
        )
        expect(result.payload).toEqual(mockResponse.data)
      })
    })
  })
})