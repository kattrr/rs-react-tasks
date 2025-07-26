import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from '../Pagination';

describe('Pagination', () => {
  const defaultProps = {
    currentPage: 1,
    totalPages: 10,
    onPageChange: vi.fn(),
  };

  const renderPagination = (props = {}) => {
    return render(<Pagination {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders pagination container', () => {
    renderPagination();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('displays current page number', () => {
    renderPagination({ currentPage: 5 });
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('shows total pages information', () => {
    renderPagination({ totalPages: 20 });
    expect(screen.getByRole('button', { name: '20' })).toBeInTheDocument();
  });

  it('renders previous button', () => {
    renderPagination();
    expect(
      screen.getByRole('button', { name: /previous/i })
    ).toBeInTheDocument();
  });

  it('renders next button', () => {
    renderPagination();
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
  });

  it('calls onPageChange with previous page when previous button is clicked', () => {
    renderPagination({ currentPage: 3 });

    const prevButton = screen.getByRole('button', { name: /previous/i });
    fireEvent.click(prevButton);

    expect(defaultProps.onPageChange).toHaveBeenCalledWith(2);
  });

  it('calls onPageChange with next page when next button is clicked', () => {
    renderPagination({ currentPage: 3 });

    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);

    expect(defaultProps.onPageChange).toHaveBeenCalledWith(4);
  });

  it('disables previous button on first page', () => {
    renderPagination({ currentPage: 1 });

    const prevButton = screen.getByRole('button', { name: /previous/i });
    expect(prevButton).toBeDisabled();
  });

  it('disables next button on last page', () => {
    renderPagination({ currentPage: 10, totalPages: 10 });

    const nextButton = screen.getByRole('button', { name: /next/i });
    expect(nextButton).toBeDisabled();
  });

  it('enables both buttons on middle page', () => {
    renderPagination({ currentPage: 5, totalPages: 10 });

    const prevButton = screen.getByRole('button', { name: /previous/i });
    const nextButton = screen.getByRole('button', { name: /next/i });

    expect(prevButton).not.toBeDisabled();
    expect(nextButton).not.toBeDisabled();
  });

  it('calls onPageChange when page number is clicked', () => {
    renderPagination({ currentPage: 1, totalPages: 5 });

    const page2Button = screen.getByText('2');
    fireEvent.click(page2Button);

    expect(defaultProps.onPageChange).toHaveBeenCalledWith(2);
  });

  // Additional tests for better function coverage
  it('returns null when totalPages is 1', () => {
    const { container } = renderPagination({ totalPages: 1 });
    expect(container.firstChild).toBeNull();
  });

  it('returns null when totalPages is 0', () => {
    const { container } = renderPagination({ totalPages: 0 });
    expect(container.firstChild).toBeNull();
  });

  it('returns null when totalPages is negative', () => {
    const { container } = renderPagination({ totalPages: -1 });
    expect(container.firstChild).toBeNull();
  });

  it('shows all pages when totalPages <= 4', () => {
    renderPagination({ currentPage: 1, totalPages: 3 });

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.queryByText('4')).not.toBeInTheDocument();
  });

  it('shows first 4 pages when currentPage <= 2', () => {
    renderPagination({ currentPage: 2, totalPages: 10 });

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.queryByText('5')).not.toBeInTheDocument();
  });

  it('shows last 4 pages when currentPage >= totalPages - 1', () => {
    renderPagination({ currentPage: 9, totalPages: 10 });

    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('9')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.queryByText('6')).not.toBeInTheDocument();
  });

  it('shows 4 pages around current page when in middle', () => {
    renderPagination({ currentPage: 5, totalPages: 10 });

    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.queryByText('3')).not.toBeInTheDocument();
    expect(screen.queryByText('8')).not.toBeInTheDocument();
  });

  it('shows first page button when pageNumbers[0] > 1', () => {
    renderPagination({ currentPage: 5, totalPages: 10 });

    const firstPageButton = screen.getByText('1');
    expect(firstPageButton).toBeInTheDocument();
  });

  it('shows ellipsis when pageNumbers[0] > 2', () => {
    renderPagination({ currentPage: 5, totalPages: 10 });

    const ellipsisElements = screen.getAllByText('...');
    expect(ellipsisElements).toHaveLength(2); // One before first page, one before last page
  });

  it('does not show ellipsis when pageNumbers[0] === 2', () => {
    renderPagination({ currentPage: 3, totalPages: 5 });

    expect(screen.queryByText('...')).not.toBeInTheDocument();
  });

  it('shows last page button when pageNumbers[pageNumbers.length - 1] < totalPages', () => {
    renderPagination({ currentPage: 5, totalPages: 10 });

    const lastPageButton = screen.getByText('10');
    expect(lastPageButton).toBeInTheDocument();
  });

  it('calls onPageChange with 1 when first page button is clicked', () => {
    renderPagination({ currentPage: 5, totalPages: 10 });

    const firstPageButton = screen.getByText('1');
    fireEvent.click(firstPageButton);

    expect(defaultProps.onPageChange).toHaveBeenCalledWith(1);
  });

  it('calls onPageChange with totalPages when last page button is clicked', () => {
    renderPagination({ currentPage: 5, totalPages: 10 });

    const lastPageButton = screen.getByText('10');
    fireEvent.click(lastPageButton);

    expect(defaultProps.onPageChange).toHaveBeenCalledWith(10);
  });

  it('applies active styles to current page', () => {
    renderPagination({ currentPage: 5, totalPages: 10 });

    const currentPageButton = screen.getByText('5');
    expect(currentPageButton).toHaveClass('bg-blue-500', 'text-white');
  });
});
