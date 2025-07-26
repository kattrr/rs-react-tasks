import {
  describe,
  it,
  beforeEach,
  afterEach,
  expect,
  vi,
  type Mock,
} from 'vitest';
import React from 'react';
import * as ReactDOMClient from 'react-dom/client';

// Mock de createRoot para interceptar el renderizado
vi.mock('react-dom/client', async () => {
  const actual =
    await vi.importActual<typeof ReactDOMClient>('react-dom/client');
  return {
    ...actual,
    createRoot: vi.fn(() => ({
      render: vi.fn(),
    })),
  };
});

describe('main.tsx', () => {
  let root: HTMLDivElement;

  beforeEach(() => {
    root = document.createElement('div');
    root.setAttribute('id', 'root');
    document.body.appendChild(root);
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.clearAllMocks();
  });

  it('should render App inside StrictMode and ErrorBoundary', async () => {
    // Importamos el archivo luego de que el root existe
    await import('../main.tsx');

    const mockCreateRoot = ReactDOMClient.createRoot as Mock;
    const renderMock = mockCreateRoot.mock.results[0].value.render as Mock;

    expect(mockCreateRoot).toHaveBeenCalledWith(root);
    expect(renderMock).toHaveBeenCalled();

    // Obtenemos el árbol JSX renderizado
    const renderedTree = renderMock.mock.calls[0][0];
    expect(renderedTree.type).toBe(React.StrictMode);

    const browserRouter = renderedTree.props.children;
    expect(browserRouter.type.name).toBe('BrowserRouter');

    const errorBoundary = browserRouter.props.children;
    expect(errorBoundary.type.name).toBe('ErrorBoundary');

    const appInside = errorBoundary.props.children;
    expect(appInside.type.name).toBe('App');
  });
});
