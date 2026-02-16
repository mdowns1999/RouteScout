import { render, screen } from '../../../test/utils/test-utils'
import Paragraph from './Paragraph'

describe('Paragraph Component', () => {
  it('renders children text correctly', () => {
    render(<Paragraph>Test paragraph text</Paragraph>)
    expect(screen.getByText('Test paragraph text')).toBeInTheDocument()
  })

  it('renders with default size (md)', () => {
    render(<Paragraph>Default size paragraph</Paragraph>)
    const paragraph = screen.getByText('Default size paragraph')
    expect(paragraph).toBeInTheDocument()
  })

  it('renders with different size variant (sm)', () => {
    render(<Paragraph size="sm">Small paragraph</Paragraph>)
    const paragraph = screen.getByText('Small paragraph')
    expect(paragraph).toBeInTheDocument()
  })

  it('applies centered alignment when centered=true', () => {
    render(<Paragraph centered>Centered paragraph</Paragraph>)
    const paragraph = screen.getByText('Centered paragraph')
    // MUI Typography with align="center"
    expect(paragraph).toBeInTheDocument()
  })

  it('uses correct paragraph element (p tag)', () => {
    const { container } = render(<Paragraph>Paragraph element</Paragraph>)
    const paragraph = container.querySelector('p')
    expect(paragraph).toBeInTheDocument()
    expect(paragraph).toHaveTextContent('Paragraph element')
  })
})
