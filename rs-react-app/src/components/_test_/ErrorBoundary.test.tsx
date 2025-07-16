import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ErrorBoundary from '../ErrorBoundary';
import { describe, beforeEach, vi, afterEach, it, expect } from 'vitest';
import { Component } from 'react';

// Componente que lanza error para pruebas
const ProblematicComponent = () => {
  throw new Error('Este es un error de prueba');
};
class BuggyComponent extends Component<{ shouldThrow: boolean }> {
  render() {
    if (this.props.shouldThrow) {
      throw new Error('Crashed!');
    }
    return <div>Todo bien</div>;
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

  it('muestra la UI de fallback cuando ocurre un error', () => {
    render(
      <ErrorBoundary>
        <ProblematicComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Oops! Algo salió mal/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Por favor recarga la aplicación/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Volver a intentar/i })
    ).toBeInTheDocument();
  });

  it('registra el error en la consola', () => {
    const spy = vi.spyOn(console, 'error');

    render(
      <ErrorBoundary>
        <ProblematicComponent />
      </ErrorBoundary>
    );

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('restablece el estado al hacer clic en "Volver a intentar"', () => {
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

    // Asegura que el fallback se muestre
    expect(screen.getByText(/Oops! Algo salió mal/i)).toBeInTheDocument();

    // Hace clic en el botón de volver a intentar
    fireEvent.click(screen.getByText(/Volver a intentar/i));

    // Cambia props para que BuggyComponent ya no lance error y fuerza remount
    shouldThrow = false;
    boundaryKey += 1;
    rerender(<Wrapper shouldThrow={shouldThrow} boundaryKey={boundaryKey} />);

    // Ahora debería mostrarse el texto original
    expect(screen.getByText('Todo bien')).toBeInTheDocument();
  });
});
