import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import NotFound from '../not-found';

describe('NotFound', () => {
  it('renders 404 page correctly', () => {
    render(<NotFound />);

    expect(screen.getByText('404 - Not Found')).toBeInTheDocument();
    expect(
      screen.getByText('the page you are looking for does not exist')
    ).toBeInTheDocument();
  });
});
