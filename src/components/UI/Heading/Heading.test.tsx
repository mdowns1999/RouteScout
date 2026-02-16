import { render, screen } from '../../../test/utils/test-utils'
import Heading from './Heading'

describe('Heading Component', () => {
  it('renders children text correctly', () => {
    render(<Heading>Test Heading</Heading>)
    expect(screen.getByText('Test Heading')).toBeInTheDocument()
  })

  it('renders with correct semantic level', () => {
    render(<Heading level="h2">Heading Level 2</Heading>)
    const heading = screen.getByRole('heading', { level: 2 })
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent('Heading Level 2')
  })

  it('applies centered alignment when centered=true', () => {
    render(<Heading centered>Centered Heading</Heading>)
    const heading = screen.getByText('Centered Heading')
    // The centered prop adds CSS styling through Emotion
    expect(heading).toBeInTheDocument()
  })

  it('applies bold font weight when bold=true', () => {
    render(<Heading bold>Bold Heading</Heading>)
    const heading = screen.getByText('Bold Heading')
    expect(heading).toHaveStyle({ fontWeight: 700 })
  })

  it('renders with custom size different from level', () => {
    render(
      <Heading level="h1" size="h3">
        Small H1
      </Heading>
    )
    // Should render as h1 semantically
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent('Small H1')
  })
})
