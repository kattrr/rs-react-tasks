import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import FormMainPage from '../FormMainPage';
import { useFormStore } from '../../store/formStore';
import type { FormData } from '../../store/formStore';

// Mock the store
vi.mock('../../store/formStore', () => ({
  useFormStore: vi.fn(),
}));

// Mock the components
vi.mock('../Modal', () => ({
  Modal: ({
    children,
    isOpen,
    onClose,
    title,
  }: {
    children: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
    title: string;
  }) => {
    if (!isOpen) return null;
    return (
      <div data-testid="modal" role="dialog">
        <div data-testid="modal-title">{title}</div>
        <button data-testid="modal-close" onClick={onClose}>
          Close
        </button>
        {children}
      </div>
    );
  },
}));

vi.mock('../UncontrolledForm', () => ({
  UncontrolledForm: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="uncontrolled-form">
      <button data-testid="uncontrolled-form-close" onClick={onClose}>
        Close Form
      </button>
    </div>
  ),
}));

vi.mock('../HookForm', () => ({
  HookForm: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="hook-form">
      <button data-testid="hook-form-close" onClick={onClose}>
        Close Form
      </button>
    </div>
  ),
}));

vi.mock('../FormDataDisplay', () => ({
  FormDataDisplay: ({ data }: { data: FormData }) => (
    <div data-testid={`form-data-${data.id}`}>
      <h3>{data.name}</h3>
      <p>{data.email}</p>
    </div>
  ),
}));

const mockUseFormStore = vi.mocked(useFormStore);

describe('FormMainPage', () => {
  const mockSetCountries = vi.fn();
  const mockFormData: FormData[] = [];

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseFormStore.mockReturnValue({
      formData: mockFormData,
      setCountries: mockSetCountries,
      countries: [],
      addFormData: vi.fn(),
      clearFormData: vi.fn(),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the main page with title and subtitle', () => {
    render(<FormMainPage />);

    expect(screen.getByText('Form Management System')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Choose between uncontrolled components or React Hook Form approaches'
      )
    ).toBeInTheDocument();
  });

  it('renders both form buttons', () => {
    render(<FormMainPage />);

    expect(screen.getByText('Open Uncontrolled Form')).toBeInTheDocument();
    expect(screen.getByText('Open React Hook Form')).toBeInTheDocument();
  });

  it('initializes countries list on mount', () => {
    render(<FormMainPage />);

    expect(mockSetCountries).toHaveBeenCalledWith([
      'United States',
      'Canada',
      'United Kingdom',
      'Germany',
      'France',
      'Spain',
      'Italy',
      'Japan',
      'China',
      'India',
      'Brazil',
      'Australia',
      'Mexico',
      'Netherlands',
      'Switzerland',
      'Sweden',
      'Norway',
      'Denmark',
      'Finland',
      'Poland',
      'Czech Republic',
      'Austria',
      'Belgium',
      'Portugal',
      'Greece',
      'Turkey',
      'Russia',
      'South Korea',
      'Singapore',
      'New Zealand',
    ]);
  });

  it('opens uncontrolled form modal when button is clicked', async () => {
    render(<FormMainPage />);

    const uncontrolledButton = screen.getByText('Open Uncontrolled Form');
    fireEvent.click(uncontrolledButton);

    await waitFor(() => {
      expect(screen.getByTestId('modal')).toBeInTheDocument();
      expect(screen.getByTestId('modal-title')).toHaveTextContent(
        'Open Uncontrolled Form'
      );
      expect(screen.getByTestId('uncontrolled-form')).toBeInTheDocument();
    });
  });

  it('opens hook form modal when button is clicked', async () => {
    render(<FormMainPage />);

    const hookFormButton = screen.getByText('Open React Hook Form');
    fireEvent.click(hookFormButton);

    await waitFor(() => {
      expect(screen.getByTestId('modal')).toBeInTheDocument();
      expect(screen.getByTestId('modal-title')).toHaveTextContent(
        'Open React Hook Form'
      );
      expect(screen.getByTestId('hook-form')).toBeInTheDocument();
    });
  });

  it('closes uncontrolled form modal when onClose is called', async () => {
    render(<FormMainPage />);

    // Open modal
    const uncontrolledButton = screen.getByText('Open Uncontrolled Form');
    fireEvent.click(uncontrolledButton);

    await waitFor(() => {
      expect(screen.getByTestId('modal')).toBeInTheDocument();
    });

    // Close modal
    const closeButton = screen.getByTestId('uncontrolled-form-close');
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });
  });

  it('closes hook form modal when onClose is called', async () => {
    render(<FormMainPage />);

    // Open modal
    const hookFormButton = screen.getByText('Open React Hook Form');
    fireEvent.click(hookFormButton);

    await waitFor(() => {
      expect(screen.getByTestId('modal')).toBeInTheDocument();
    });

    // Close modal
    const closeButton = screen.getByTestId('hook-form-close');
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });
  });

  it('displays empty state when no forms are submitted', () => {
    render(<FormMainPage />);

    expect(screen.getByText('No forms submitted yet')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Submit a form using one of the buttons above to see the data here.'
      )
    ).toBeInTheDocument();

    // Check for the empty state icon (SVG)
    const emptyIcon = screen.getByTestId('empty-state-icon');
    expect(emptyIcon).toBeInTheDocument();
  });

  it('displays submitted forms when formData exists', () => {
    const mockFormDataWithItems = [
      {
        id: '1',
        name: 'John Doe',
        age: 25,
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        gender: 'male',
        acceptTerms: true,
        picture: 'data:image/jpeg;base64,test',
        country: 'United States',
        createdAt: new Date(),
        formType: 'uncontrolled' as const,
      },
      {
        id: '2',
        name: 'Jane Smith',
        age: 30,
        email: 'jane@example.com',
        password: 'password456',
        confirmPassword: 'password456',
        gender: 'female',
        acceptTerms: true,
        picture: 'data:image/jpeg;base64,test2',
        country: 'Canada',
        createdAt: new Date(),
        formType: 'hookform' as const,
      },
    ];

    mockUseFormStore.mockReturnValue({
      formData: mockFormDataWithItems,
      setCountries: mockSetCountries,
      countries: [],
      addFormData: vi.fn(),
      clearFormData: vi.fn(),
    });

    render(<FormMainPage />);

    expect(screen.getByText('Submitted Forms (2)')).toBeInTheDocument();
    expect(screen.getByTestId('form-data-1')).toBeInTheDocument();
    expect(screen.getByTestId('form-data-2')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('handles modal state changes correctly', async () => {
    render(<FormMainPage />);

    // Initially no modals should be open
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();

    // Open uncontrolled form modal
    const uncontrolledButton = screen.getByText('Open Uncontrolled Form');
    fireEvent.click(uncontrolledButton);

    await waitFor(() => {
      expect(screen.getByTestId('modal')).toBeInTheDocument();
      expect(screen.getByTestId('uncontrolled-form')).toBeInTheDocument();
    });

    // Close modal
    const closeButton = screen.getByTestId('uncontrolled-form-close');
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });

    // Open hook form modal
    const hookFormButton = screen.getByText('Open React Hook Form');
    fireEvent.click(hookFormButton);

    await waitFor(() => {
      expect(screen.getByTestId('modal')).toBeInTheDocument();
      expect(screen.getByTestId('hook-form')).toBeInTheDocument();
    });
  });

  it('calls setCountries only once on mount', () => {
    render(<FormMainPage />);

    expect(mockSetCountries).toHaveBeenCalledTimes(1);
    expect(mockSetCountries).toHaveBeenCalledWith(
      expect.arrayContaining([
        'United States',
        'Canada',
        'United Kingdom',
        'Germany',
        'France',
        'Spain',
        'Italy',
        'Japan',
        'China',
        'India',
        'Brazil',
        'Australia',
        'Mexico',
        'Netherlands',
        'Switzerland',
        'Sweden',
        'Norway',
        'Denmark',
        'Finland',
        'Poland',
        'Czech Republic',
        'Austria',
        'Belgium',
        'Portugal',
        'Greece',
        'Turkey',
        'Russia',
        'South Korea',
        'Singapore',
        'New Zealand',
      ])
    );
  });

  it('renders with correct button styling classes', () => {
    render(<FormMainPage />);

    const uncontrolledButton = screen.getByText('Open Uncontrolled Form');
    const hookFormButton = screen.getByText('Open React Hook Form');

    expect(uncontrolledButton).toHaveClass('bg-blue-600', 'hover:bg-blue-700');
    expect(hookFormButton).toHaveClass('bg-green-600', 'hover:bg-green-700');
  });

  it('displays correct form count in submitted forms section', () => {
    const mockFormDataWithItems = [
      {
        id: '1',
        name: 'Test User',
        age: 25,
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        gender: 'male',
        acceptTerms: true,
        picture: 'data:image/jpeg;base64,test',
        country: 'United States',
        createdAt: new Date(),
        formType: 'uncontrolled' as const,
      },
    ];

    mockUseFormStore.mockReturnValue({
      formData: mockFormDataWithItems,
      setCountries: mockSetCountries,
      countries: [],
      addFormData: vi.fn(),
      clearFormData: vi.fn(),
    });

    render(<FormMainPage />);

    expect(screen.getByText('Submitted Forms (1)')).toBeInTheDocument();
  });

  it('handles multiple form submissions correctly', () => {
    const mockFormDataWithItems = [
      {
        id: '1',
        name: 'User 1',
        age: 25,
        email: 'user1@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        gender: 'male',
        acceptTerms: true,
        picture: 'data:image/jpeg;base64,test1',
        country: 'United States',
        createdAt: new Date(),
        formType: 'uncontrolled' as const,
      },
      {
        id: '2',
        name: 'User 2',
        age: 30,
        email: 'user2@example.com',
        password: 'password456',
        confirmPassword: 'password456',
        gender: 'female',
        acceptTerms: true,
        picture: 'data:image/jpeg;base64,test2',
        country: 'Canada',
        createdAt: new Date(),
        formType: 'hookform' as const,
      },
      {
        id: '3',
        name: 'User 3',
        age: 35,
        email: 'user3@example.com',
        password: 'password789',
        confirmPassword: 'password789',
        gender: 'other',
        acceptTerms: true,
        picture: 'data:image/jpeg;base64,test3',
        country: 'Germany',
        createdAt: new Date(),
        formType: 'uncontrolled' as const,
      },
    ];

    mockUseFormStore.mockReturnValue({
      formData: mockFormDataWithItems,
      setCountries: mockSetCountries,
      countries: [],
      addFormData: vi.fn(),
      clearFormData: vi.fn(),
    });

    render(<FormMainPage />);

    expect(screen.getByText('Submitted Forms (3)')).toBeInTheDocument();
    expect(screen.getByTestId('form-data-1')).toBeInTheDocument();
    expect(screen.getByTestId('form-data-2')).toBeInTheDocument();
    expect(screen.getByTestId('form-data-3')).toBeInTheDocument();
  });

  it('handles empty countries array initialization', () => {
    mockUseFormStore.mockReturnValue({
      formData: [],
      setCountries: mockSetCountries,
      countries: [],
      addFormData: vi.fn(),
      clearFormData: vi.fn(),
    });

    render(<FormMainPage />);

    expect(mockSetCountries).toHaveBeenCalledWith(
      expect.arrayContaining([
        'United States',
        'Canada',
        'United Kingdom',
        'Germany',
        'France',
        'Spain',
        'Italy',
        'Japan',
        'China',
        'India',
        'Brazil',
        'Australia',
        'Mexico',
        'Netherlands',
        'Switzerland',
        'Sweden',
        'Norway',
        'Denmark',
        'Finland',
        'Poland',
        'Czech Republic',
        'Austria',
        'Belgium',
        'Portugal',
        'Greece',
        'Turkey',
        'Russia',
        'South Korea',
        'Singapore',
        'New Zealand',
      ])
    );
  });

  it('handles modal state transitions correctly', async () => {
    render(<FormMainPage />);

    // Initially no modals should be open
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();

    // Open uncontrolled form modal
    const uncontrolledButton = screen.getByText('Open Uncontrolled Form');
    fireEvent.click(uncontrolledButton);

    await waitFor(() => {
      expect(screen.getByTestId('modal')).toBeInTheDocument();
      expect(screen.getByTestId('uncontrolled-form')).toBeInTheDocument();
    });

    // Close modal and verify it's closed
    const closeButton = screen.getByTestId('uncontrolled-form-close');
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });

    // Verify we can open hook form modal after closing uncontrolled
    const hookFormButton = screen.getByText('Open React Hook Form');
    fireEvent.click(hookFormButton);

    await waitFor(() => {
      expect(screen.getByTestId('modal')).toBeInTheDocument();
      expect(screen.getByTestId('hook-form')).toBeInTheDocument();
    });
  });

  it('renders with responsive design classes', () => {
    render(<FormMainPage />);

    const container = screen
      .getByText('Form Management System')
      .closest('.container');
    expect(container).toHaveClass('mx-auto', 'px-4', 'py-8');

    const buttonsContainer = screen
      .getByText('Open Uncontrolled Form')
      .closest('.flex');
    expect(buttonsContainer).toHaveClass('flex-col', 'sm:flex-row');
  });

  it('displays correct grid layout for form data', () => {
    const mockFormDataWithItems = [
      {
        id: '1',
        name: 'Test User',
        age: 25,
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        gender: 'male',
        acceptTerms: true,
        picture: 'data:image/jpeg;base64,test',
        country: 'United States',
        createdAt: new Date(),
        formType: 'uncontrolled' as const,
      },
    ];

    mockUseFormStore.mockReturnValue({
      formData: mockFormDataWithItems,
      setCountries: mockSetCountries,
      countries: [],
      addFormData: vi.fn(),
      clearFormData: vi.fn(),
    });

    render(<FormMainPage />);

    const formsContainer = screen.getByText(
      'Submitted Forms (1)'
    ).nextElementSibling;
    expect(formsContainer).toHaveClass('grid', 'grid-cols-1', 'lg:grid-cols-2');
  });
});
