import { render, screen } from '../../../test/utils/test-utils'
import Image from './Image'

describe('Image Component', () => {
  it('renders with required props (src, alt)', () => {
    render(<Image src="/test-image.jpg" alt="Test image" />)
    const image = screen.getByAltText('Test image')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', '/test-image.jpg')
  })

  it('applies lazy loading attribute', () => {
    render(<Image src="/test-image.jpg" alt="Lazy loaded image" />)
    const image = screen.getByAltText('Lazy loaded image')
    expect(image).toHaveAttribute('loading', 'lazy')
  })

  it('renders as Link when to prop provided', () => {
    render(<Image src="/test-image.jpg" alt="Linked image" to="/destination" />)
    const image = screen.getByAltText('Linked image')
    expect(image).toBeInTheDocument()
    // Check that image is wrapped in a link
    const link = image.closest('a')
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/destination')
  })

  it('opens in new tab when external=true', () => {
    render(
      <Image
        src="/test-image.jpg"
        alt="External image"
        to="https://example.com"
        external={true}
      />
    )
    const image = screen.getByAltText('External image')
    const link = image.closest('a')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noreferrer')
  })

  it('applies custom className', () => {
    render(<Image src="/test-image.jpg" alt="Styled image" className="custom-class" />)
    const image = screen.getByAltText('Styled image')
    expect(image).toHaveClass('custom-class')
  })
})
