import type { ReactElement } from 'react'
import { render as rtlRender, type RenderOptions } from '@testing-library/react'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { AllTheProviders } from './test-providers'

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => rtlRender(ui, { wrapper: AllTheProviders, ...options })

export { customRender as render, screen, fireEvent, waitFor }