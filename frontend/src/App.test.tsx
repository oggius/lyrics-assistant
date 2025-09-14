import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { describe, it, expect, vi } from 'vitest'
import App from './App'
import { useSongs } from './hooks/useApi'

// Mock the useApi hook
vi.mock('./hooks/useApi')
const mockUseSongs = vi.mocked(useSongs)

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
})

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

describe('App', () => {
  beforeEach(() => {
    // Mock the useSongs hook to return empty data in a loaded state
    mockUseSongs.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    } as any)
  })

  it('renders app title in header', () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    )
    
    expect(screen.getByText('Lyrics Assistant')).toBeInTheDocument()
  })

  it('renders songs library page by default', () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    )
    
    expect(screen.getByText('Songs Library')).toBeInTheDocument()
  })

  it('renders bottom navigation', () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    )
    
    expect(screen.getByText('Songs')).toBeInTheDocument()
    expect(screen.getAllByText('Add Song')).toHaveLength(2) // One in header, one in bottom nav
  })

  it('renders without crashing', () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    )
    
    expect(document.body).toBeInTheDocument()
  })
})