import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="">
          <h2 className="">Oops! Algo salió mal.</h2>
          <p className="">
            Por favor recarga la aplicación o intenta nuevamente.
          </p>
          <button onClick={this.handleReset} className="">
            Volver a intentar
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;