import { render, screen, waitFor } from '@testing-library/react';
import SubscriptionDetails from '../../subscriptions/[id]';
import { getSubscription } from '@/services/api';
import { useRouter } from 'next/router';

jest.mock('@/services/api');
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('SubscriptionDetails', () => {
  const mockSubscription = {
    id: '123',
    dogName: 'Max',
    status: 'ACTIVE',
    price: 49.99,
    portionWeightGrams: 250,
    createdAt: '2024-01-01T00:00:00.000Z',
    contents: ['Chicken', 'Rice'],
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      query: { id: '123' },
    });
    (getSubscription as jest.Mock).mockResolvedValue(mockSubscription);
  });

  it('loads and displays subscription details', async () => {
    render(<SubscriptionDetails />);

    await waitFor(() => {
      expect(screen.getByText("Max's meal plan")).toBeInTheDocument();
      expect(screen.getByText('$49.99 per month')).toBeInTheDocument();
      expect(screen.getByText(/Active since/)).toBeInTheDocument();
    });
  });

  it('shows error state on failed load', async () => {
    (getSubscription as jest.Mock).mockRejectedValue(new Error('Failed to load'));
    render(<SubscriptionDetails />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to load subscription/)).toBeInTheDocument();
    });
  });
});
