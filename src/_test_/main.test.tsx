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

  it('should render App inside StrictMode', async () => {
    await import('../main.tsx');

    const mockCreateRoot = ReactDOMClient.createRoot as Mock;
    const renderMock = mockCreateRoot.mock.results[0].value.render as Mock;

    expect(mockCreateRoot).toHaveBeenCalledWith(root);
    expect(renderMock).toHaveBeenCalled();

    const renderedTree = renderMock.mock.calls[0][0];
    expect(renderedTree.type).toBe(React.StrictMode);
  });
});
