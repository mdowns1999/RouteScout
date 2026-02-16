import { render, screen } from '../../../test/utils/test-utils'
import Row from './Row'

describe('Row Component', () => {
  it('renders children correctly', () => {
    render(
      <Row>
        <div>Child 1</div>
        <div>Child 2</div>
      </Row>
    )
    expect(screen.getByText('Child 1')).toBeInTheDocument()
    expect(screen.getByText('Child 2')).toBeInTheDocument()
  })

  it('applies default alignment (start, middle)', () => {
    const { container } = render(
      <Row>
        <div>Content</div>
      </Row>
    )
    const row = container.firstChild as HTMLElement
    expect(row).toHaveAttribute('data-align-x', 'start')
    expect(row).toHaveAttribute('data-align-y', 'middle')
  })

  it('centers content when alignX=center', () => {
    const { container } = render(
      <Row alignX="center">
        <div>Centered</div>
      </Row>
    )
    const row = container.firstChild as HTMLElement
    expect(row).toHaveAttribute('data-align-x', 'center')
  })

  it('changes vertical alignment when alignY=bottom', () => {
    const { container } = render(
      <Row alignY="bottom">
        <div>Bottom aligned</div>
      </Row>
    )
    const row = container.firstChild as HTMLElement
    expect(row).toHaveAttribute('data-align-y', 'bottom')
  })

  it('applies gutter spacing (md)', () => {
    const { container } = render(
      <Row gutters="md">
        <div>Spaced content</div>
      </Row>
    )
    const row = container.firstChild as HTMLElement
    expect(row).toBeInTheDocument()
    expect(screen.getByText('Spaced content')).toBeInTheDocument()
  })

  it('wraps content when wrap=true', () => {
    const { container } = render(
      <Row wrap={true}>
        <div>Wrapped content</div>
      </Row>
    )
    const row = container.firstChild as HTMLElement
    expect(row).toHaveAttribute('data-wrap', 'true')
  })
})
