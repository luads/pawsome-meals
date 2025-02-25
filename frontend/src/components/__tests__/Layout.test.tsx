import { render, screen } from '@testing-library/react';
import Layout from '../Layout';

describe('Layout', () => {
  it('renders children and navigation', () => {
    render(
      <Layout>
        <div>Test Content</div>
      </Layout>,
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
    expect(screen.getByText('Subscriptions')).toBeInTheDocument();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('renders page title when provided', () => {
    render(
      <Layout>
        <div>Content</div>
      </Layout>,
    );

    expect(screen.getByText('Test Page')).toBeInTheDocument();
  });
});
