import { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import { ThemeModeContext, ThemeModeContextType } from '../../contexts/ThemeModeContext'
import { getTheme } from '../../theme'

// Create a default theme mode context value for tests
const defaultThemeModeContext: ThemeModeContextType = {
  mode: 'light',
  toggleColorMode: jest.fn(),
}

interface AllProvidersProps {
  children: React.ReactNode
}

// Wrapper component that includes all necessary providers
// eslint-disable-next-line react-refresh/only-export-components
const AllProviders = ({ children }: AllProvidersProps) => {
  const theme = getTheme('light')

  return (
    <BrowserRouter>
      <ThemeModeContext.Provider value={defaultThemeModeContext}>
        <ThemeProvider theme={theme}>
          {children}
        </ThemeProvider>
      </ThemeModeContext.Provider>
    </BrowserRouter>
  )
}

// Custom render function that wraps components with providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllProviders, ...options })

// Re-export everything from React Testing Library
export * from '@testing-library/react'

// Override the default render with our custom one
export { customRender as render }

// Export a named version as well for clarity
export { customRender as renderWithProviders }
