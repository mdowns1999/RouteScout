import { render, screen } from '../../../test/utils/test-utils'
import LayoutBand from './LayoutBand'

describe('LayoutBand Component', () => {
  it('renders children correctly', () => {
    render(
      <LayoutBand>
        <div>Test content</div>
      </LayoutBand>
    )
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('applies default spacing (md)', () => {
    const { container } = render(
      <LayoutBand>
        <div>Default spacing</div>
      </LayoutBand>
    )
    // MUI Container is rendered
    const containerElement = container.querySelector('.MuiContainer-root')
    expect(containerElement).toBeInTheDocument()
  })

  it('applies different spacing variant (lg)', () => {
    const { container } = render(
      <LayoutBand spacing="lg">
        <div>Large spacing</div>
      </LayoutBand>
    )
    const containerElement = container.querySelector('.MuiContainer-root')
    expect(containerElement).toBeInTheDocument()
    expect(screen.getByText('Large spacing')).toBeInTheDocument()
  })

  it('passes custom sx prop', () => {
    render(
      <LayoutBand sx={{ backgroundColor: 'red' }}>
        <div>Custom sx</div>
      </LayoutBand>
    )
    expect(screen.getByText('Custom sx')).toBeInTheDocument()
  })

  it('wraps content in MUI Container', () => {
    const { container } = render(
      <LayoutBand>
        <div>Container content</div>
      </LayoutBand>
    )
    const containerElement = container.querySelector('.MuiContainer-root')
    expect(containerElement).toBeInTheDocument()
    expect(containerElement).toContainElement(screen.getByText('Container content'))
  })
})
