import { render, screen } from '@testing-library/react';
import { SubscriptionStatusBadge } from '../SubscriptionStatusBadge';

describe('SubscriptionStatusBadge', () => {
  it('renders active status with correct style', () => {
    render(<SubscriptionStatusBadge status="ACTIVE" />);
    const badge = screen.getByText('Active');
    expect(badge).toHaveClass('bg-green-100');
    expect(badge).toHaveClass('text-green-800');
  });

  it('renders paused status with correct style', () => {
    render(<SubscriptionStatusBadge status="PAUSED" />);
    const badge = screen.getByText('Paused');
    expect(badge).toHaveClass('bg-yellow-100');
    expect(badge).toHaveClass('text-yellow-800');
  });

  it('renders cancelled status with correct style', () => {
    render(<SubscriptionStatusBadge status="CANCELLED" />);
    const badge = screen.getByText('Cancelled');
    expect(badge).toHaveClass('bg-red-100');
    expect(badge).toHaveClass('text-red-800');
  });
});
