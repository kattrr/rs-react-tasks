import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import About from '../page';

describe('About', () => {
  it('renders about page correctly', () => {
    render(<About />);

    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Kathering Rivera Rodriguez')).toBeInTheDocument();
    expect(
      screen.getByText('Front-End Developer / UX/UI Designer')
    ).toBeInTheDocument();
  });

  it('displays all social links', () => {
    render(<About />);

    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('GitHub')).toBeInTheDocument();
    expect(screen.getByText('LinkedIn')).toBeInTheDocument();
    expect(screen.getByText('Behance')).toBeInTheDocument();
  });
});
