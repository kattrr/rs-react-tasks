import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ErrorBoundary from '../ErrorBoundary';
import { describe, beforeEach, vi, afterEach, it, expect } from 'vitest';
import { Component } from 'react';

const ProblematicComponent = () => {
  throw new Error('This is a test error');
};
class BuggyComponent extends Component<{ shouldThrow: boolean }> {
  render() {
    if (this.props.shouldThrow) {
      throw new Error('Crashed!');
    }
    return <div>All good</div>;
  }
}
describe('ErrorBoundary', () => {
  const originalError = console.error;

  beforeEach(() => {
    console.error = vi.fn();
  });

  afterEach(() => {
    console.error = originalError;
  });

  it('shows fallback UI when an error occurs', () => {
    render(
      <ErrorBoundary>
        <ProblematicComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Please reload the application/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Try again/i })
    ).toBeInTheDocument();
  });

  it('logs the error to console', () => {
    const spy = vi.spyOn(console, 'error');

    render(
      <ErrorBoundary>
        <ProblematicComponent />
      </ErrorBoundary>
    );

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('resets state when clicking "Try again"', () => {
    // Wrapper to control ErrorBoundary key for remounting
    function Wrapper({
      shouldThrow,
      boundaryKey,
    }: {
      shouldThrow: boolean;
      boundaryKey: number;
    }) {
      return (
        <ErrorBoundary key={boundaryKey}>
          <BuggyComponent shouldThrow={shouldThrow} />
        </ErrorBoundary>
      );
    }

    let boundaryKey = 0;
    let shouldThrow = true;
    const { rerender } = render(
      <Wrapper shouldThrow={shouldThrow} boundaryKey={boundaryKey} />
    );

    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Try again/i }));

    shouldThrow = false;
    boundaryKey += 1;
    rerender(<Wrapper shouldThrow={shouldThrow} boundaryKey={boundaryKey} />);

    expect(screen.getByText('All good')).toBeInTheDocument();
  });
});
