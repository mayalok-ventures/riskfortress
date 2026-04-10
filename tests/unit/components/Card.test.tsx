import { render, screen } from '@testing-library/react'
import Card from '@/components/UI/Card'

describe('Card Component', () => {
    test('renders children correctly', () => {
        render(
            <Card>
                <div data-testid="card-content">Card Content</div>
            </Card>
        )
        expect(screen.getByTestId('card-content')).toBeInTheDocument()
    })

    test('applies correct variant classes', () => {
        const { rerender } = render(<Card variant="glass">Glass Card</Card>)
        expect(screen.getByText('Glass Card')).toHaveClass('glass-morphism')

        rerender(<Card variant="gradient">Gradient Card</Card>)
        expect(screen.getByText('Gradient Card')).toHaveClass('bg-gradient-to-br')
    })

    test('applies hover effect when enabled', () => {
        render(<Card hover={true}>Hover Card</Card>)
        expect(screen.getByText('Hover Card')).toHaveClass('hover:scale-[1.02]')
    })
})