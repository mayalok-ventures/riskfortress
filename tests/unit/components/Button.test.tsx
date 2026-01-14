import { render, screen, fireEvent } from '@testing-library/react'
import Button from '@/components/UI/Button'
import { Loader2 } from 'lucide-react'

describe('Button Component', () => {
    test('renders primary button correctly', () => {
        render(<Button variant="primary">Click me</Button>)
        const button = screen.getByText('Click me')
        expect(button).toBeInTheDocument()
        expect(button).toHaveClass('bg-gradient-to-r')
    })

    test('handles click events', () => {
        const handleClick = jest.fn()
        render(<Button onClick={handleClick}>Click me</Button>)
        fireEvent.click(screen.getByText('Click me'))
        expect(handleClick).toHaveBeenCalledTimes(1)
    })

    test('shows loading state', () => {
        render(<Button isLoading={true}>Loading</Button>)
        expect(screen.getByText('Loading')).toBeInTheDocument()
        expect(screen.getByRole('button')).toBeDisabled()
    })

    test('renders with icons', () => {
        render(
            <Button
                leftIcon={<span data-testid="left-icon">←</span>}
                rightIcon={<span data-testid="right-icon">→</span>}
            >
                With Icons
            </Button>
        )
        expect(screen.getByTestId('left-icon')).toBeInTheDocument()
        expect(screen.getByTestId('right-icon')).toBeInTheDocument()
    })
})