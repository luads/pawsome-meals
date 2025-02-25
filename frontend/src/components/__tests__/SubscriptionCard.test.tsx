import { render, screen } from '@testing-library/react';
import { SubscriptionCard } from '../SubscriptionCard';
import { formatWeight } from '@/utils/format';
import { Subscription } from '@/services/api';

jest.mock('@/utils/format', () => ({
  formatWeight: jest.fn(),
}));

describe('SubscriptionCard', () => {
  const mockSubscription: Subscription = {
    id: '123',
    dogName: 'Max',
    status: 'ACTIVE',
    price: 49.99,
    portionWeightGrams: 250,
    createdAt: '2024-01-01T00:00:00.000Z',
    contents: ['Chicken', 'Rice'],
  };

  beforeEach(() => {
    (formatWeight as jest.Mock).mockReturnValue('250g');
  });

  it('renders subscription details', () => {
    render(<SubscriptionCard subscription={mockSubscription} />);

    expect(screen.getByText("Max's meal plan")).toBeInTheDocument();
    expect(screen.getByText('$49.99 per month')).toBeInTheDocument();
    expect(screen.getByText('250g daily portion')).toBeInTheDocument();
    expect(screen.getByText(/Chicken, Rice/)).toBeInTheDocument();
  });

  it('shows active status with correct date', () => {
    render(<SubscriptionCard subscription={mockSubscription} />);
    expect(screen.getByText(/Active since/)).toBeInTheDocument();
    expect(screen.getByText(/January 1, 2024/)).toBeInTheDocument();
  });

  it('shows paused status with date', () => {
    const pausedSub: Subscription = {
      ...mockSubscription,
      status: 'PAUSED',
      pausedAt: '2024-01-15T00:00:00.000Z',
    };
    render(<SubscriptionCard subscription={pausedSub} />);
    expect(screen.getByText(/Paused on/)).toBeInTheDocument();
    expect(screen.getByText(/January 15, 2024/)).toBeInTheDocument();
  });
});
