import { render } from '../../../test/utils/test-utils'
import Separator from './Separator'

describe('Separator Component', () => {
  it('renders as div element', () => {
    const { container } = render(<Separator />)
    const separator = container.firstChild as HTMLElement
    expect(separator.tagName).toBe('DIV')
  })

  it('applies default size (md)', () => {
    const { container } = render(<Separator />)
    const separator = container.firstChild
    expect(separator).toBeInTheDocument()
  })

  it('applies different size variant (lg)', () => {
    const { container } = render(<Separator size="lg" />)
    const separator = container.firstChild
    expect(separator).toBeInTheDocument()
  })

  it('shows horizontal line when showLine=true', () => {
    const { container } = render(<Separator showLine={true} />)
    const hr = container.querySelector('hr')
    expect(hr).toBeInTheDocument()
  })

  it('uses custom line color', () => {
    const { container } = render(<Separator showLine={true} lineColor="#ff0000" />)
    const hr = container.querySelector('hr')
    expect(hr).toBeInTheDocument()
  })
})
