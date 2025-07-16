import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Spinner from '../Spinner';
import { describe, it, expect } from 'vitest';

describe('Spinner component', () => {
  it('renders spinner with spinning animation', () => {
    const { container } = render(<Spinner />);
    const spinnerDiv = container.querySelector('.animate-spin');

    expect(spinnerDiv).toBeInTheDocument();
    expect(spinnerDiv).toHaveClass('w-8', 'h-8', 'border-4', 'border-blue-500');
  });

  it('is centered inside a container', () => {
    const { container } = render(<Spinner />);
    const spinnerDiv = container.querySelector('.animate-spin');
    const parent = spinnerDiv?.parentElement;

    expect(parent).toHaveClass('flex', 'justify-center', 'items-center');
  });
});
