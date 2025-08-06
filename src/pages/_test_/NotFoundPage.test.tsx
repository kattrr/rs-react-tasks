import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NotFoundPage from '../NotFoundPage';

describe('NotFoundPage', () => {
  const renderNotFoundPage = () => {
    return render(
      <BrowserRouter>
        <NotFoundPage />
      </BrowserRouter>
    );
  };

  it('renders 404 page content', () => {
    renderNotFoundPage();
    expect(screen.getByText('404 - Not Found')).toBeInTheDocument();
    expect(
      screen.getByText('the page you are looking for does not exist')
    ).toBeInTheDocument();
  });
});
