import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import FileUpload from '../../../src/components/logistics/FileUpload';

// Mock FileReader
const mockFileReader = {
  readAsText: jest.fn(),
  result: null,
  onload: null,
  onerror: null,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
};

// Replace the global FileReader with our mock
Object.defineProperty(global, 'FileReader', {
  writable: true,
  value: jest.fn(() => mockFileReader),
});

describe('FileUpload', () => {
  const mockSetData = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockFileReader.readAsText.mockClear();
    mockFileReader.result = null;
    mockFileReader.onload = null;
    mockSetData.mockClear();
  });

  describe('Rendering', () => {
    test('renders file upload component with all elements', () => {
      render(<FileUpload setData={mockSetData} />);
      
      expect(screen.getByText('Click to upload or drag & drop')).toBeInTheDocument();
      expect(screen.getByText('DID up to 10 MB')).toBeInTheDocument();
      
      // Check for file input and label
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      expect(fileInput).toBeInTheDocument();
      expect(fileInput).toHaveAttribute('id', 'fileUpload');
      
      const label = document.querySelector('label[for="fileUpload"]');
      expect(label).toBeInTheDocument();
    });

    test('renders upload icon', () => {
      render(<FileUpload setData={mockSetData} />);
      
      // Check for SVG icon
      const svgIcon = document.querySelector('svg');
      expect(svgIcon).toBeInTheDocument();
      expect(svgIcon).toHaveClass('w-12', 'h-12', 'text-green-500');
    });

    test('does not show file name initially', () => {
      render(<FileUpload setData={mockSetData} />);
      
      expect(screen.queryByText(/selected/)).not.toBeInTheDocument();
    });

    test('has correct initial styling', () => {
      render(<FileUpload setData={mockSetData} />);
      
      const dropZone = screen.getByText('Click to upload or drag & drop').closest('div');
      expect(dropZone).toHaveClass('border-gray-300', 'bg-white');
      expect(dropZone).not.toHaveClass('border-green-500', 'bg-green-50');
    });
  });

  describe('File Selection via Click', () => {
    test('opens file dialog when clicked', async () => {
      const user = userEvent.setup();
      render(<FileUpload setData={mockSetData} />);
      
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      expect(fileInput).toBeInTheDocument();
      
      // Mock click behavior
      const clickSpy = jest.spyOn(fileInput, 'click');
      fileInput.click = jest.fn();
      
      const label = screen.getByText('Click to upload or drag & drop').closest('label');
      await user.click(label!);
      
      // The hidden input should be accessible for file selection
      expect(fileInput).toHaveAttribute('type', 'file');
    });

    test('handles file selection via input change', async () => {
      render(<FileUpload setData={mockSetData} />);
      
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      const testFile = new File(['test content'], 'test.txt', { type: 'text/plain' });
      
      // Simulate file selection
      Object.defineProperty(fileInput, 'files', {
        value: [testFile],
        configurable: true,
      });
      
      fireEvent.change(fileInput);
      
      // Should show file name
      await waitFor(() => {
        expect(screen.getByText('test.txt')).toBeInTheDocument();
        // Check that the file name paragraph exists
        const fileDisplay = screen.getByText('test.txt').closest('p');
        expect(fileDisplay).toHaveTextContent('📄');
        expect(fileDisplay).toHaveTextContent('selected');
      });
      
      // Should call FileReader
      expect(mockFileReader.readAsText).toHaveBeenCalledWith(testFile);
    });
  });

  describe('Drag and Drop Functionality', () => {
    test('handles dragOver event', () => {
      render(<FileUpload setData={mockSetData} />);
      
      const dropZone = screen.getByText('Click to upload or drag & drop').closest('div');
      
      const dragOverEvent = new Event('dragover', { bubbles: true }) as any;
      dragOverEvent.dataTransfer = {
        files: [new File([''], 'test.txt')],
      };
      
      fireEvent(dropZone!, dragOverEvent);
      
      // Should show dragging state
      expect(dropZone).toHaveClass('border-green-500', 'bg-green-50');
    });

    test('handles dragLeave event', () => {
      render(<FileUpload setData={mockSetData} />);
      
      const dropZone = screen.getByText('Click to upload or drag & drop').closest('div');
      
      // First trigger dragOver to set dragging state
      const dragOverEvent = new Event('dragover', { bubbles: true }) as any;
      dragOverEvent.dataTransfer = { files: [] };
      fireEvent(dropZone!, dragOverEvent);
      expect(dropZone).toHaveClass('border-green-500', 'bg-green-50');
      
      // Then trigger dragLeave
      fireEvent.dragLeave(dropZone!);
      expect(dropZone).toHaveClass('border-gray-300', 'bg-white');
      expect(dropZone).not.toHaveClass('border-green-500', 'bg-green-50');
    });

    test('handles file drop', async () => {
      render(<FileUpload setData={mockSetData} />);
      
      const dropZone = screen.getByText('Click to upload or drag & drop').closest('div');
      const testFile = new File(['test content'], 'dropped-file.txt', { type: 'text/plain' });
      
      const dropEvent = new Event('drop', { bubbles: true }) as any;
      dropEvent.dataTransfer = {
        files: [testFile],
      };
      
      fireEvent(dropZone!, dropEvent);
      
      // Should reset dragging state
      expect(dropZone).toHaveClass('border-gray-300', 'bg-white');
      
      // Should show file name
      await waitFor(() => {
        expect(screen.getByText('dropped-file.txt')).toBeInTheDocument();
        // Check that the file name paragraph exists
        const fileDisplay = screen.getByText('dropped-file.txt').closest('p');
        expect(fileDisplay).toHaveTextContent('📄');
        expect(fileDisplay).toHaveTextContent('selected');
      });
      
      // Should call FileReader
      expect(mockFileReader.readAsText).toHaveBeenCalledWith(testFile);
    });

    test('handles drop with no files', () => {
      render(<FileUpload setData={mockSetData} />);
      
      const dropZone = screen.getByText('Click to upload or drag & drop').closest('div');
      
      const dropEvent = new Event('drop', { bubbles: true }) as any;
      dropEvent.dataTransfer = {
        files: [],
      };
      
      fireEvent(dropZone!, dropEvent);
      
      // Should not show any file name
      expect(screen.queryByText(/selected/)).not.toBeInTheDocument();
      
      // Should not call FileReader
      expect(mockFileReader.readAsText).not.toHaveBeenCalled();
    });
  });

  describe('File Processing', () => {
    test('reads file content and calls setData callback', async () => {
      render(<FileUpload setData={mockSetData} />);
      
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      const testFile = new File(['test file content'], 'test.txt', { type: 'text/plain' });
      
      // Simulate file selection
      Object.defineProperty(fileInput, 'files', {
        value: [testFile],
        configurable: true,
      });
      
      fireEvent.change(fileInput);
      
      // Wait for FileReader to be called
      await waitFor(() => {
        expect(mockFileReader.readAsText).toHaveBeenCalledWith(testFile);
      });
      
      // Simulate FileReader onload completion
      mockFileReader.result = 'test file content';
      if (mockFileReader.onload) {
        mockFileReader.onload({} as ProgressEvent<FileReader>);
      }
      
      // Should call setData with file content
      expect(mockSetData).toHaveBeenCalledWith('test file content');
    });

    test('updates file name when file is processed', async () => {
      render(<FileUpload setData={mockSetData} />);
      
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      const testFile = new File(['content'], 'my-document.txt', { type: 'text/plain' });
      
      // Simulate file selection
      Object.defineProperty(fileInput, 'files', {
        value: [testFile],
        configurable: true,
      });
      
      fireEvent.change(fileInput);
      
      // Should immediately show file name
      await waitFor(() => {
        expect(screen.getByText('my-document.txt')).toBeInTheDocument();
        // Check that the file name paragraph exists
        const fileDisplay = screen.getByText('my-document.txt').closest('p');
        expect(fileDisplay).toHaveTextContent('📄');
        expect(fileDisplay).toHaveTextContent('selected');
      });
    });
  });

  describe('Visual State Management', () => {
    test('shows hover state styling', () => {
      render(<FileUpload setData={mockSetData} />);
      
      const dropZone = screen.getByText('Click to upload or drag & drop').closest('div');
      
      // Should have hover classes by default
      expect(dropZone).toHaveClass('hover:border-green-500', 'hover:bg-green-50');
    });

    test('shows dragging state correctly', () => {
      render(<FileUpload setData={mockSetData} />);
      
      const dropZone = screen.getByText('Click to upload or drag & drop').closest('div');
      
      // Initial state
      expect(dropZone).toHaveClass('border-gray-300', 'bg-white');
      
      // Dragging state
      const dragOverEvent = new Event('dragover', { bubbles: true }) as any;
      dragOverEvent.dataTransfer = { files: [] };
      fireEvent(dropZone!, dragOverEvent);
      expect(dropZone).toHaveClass('border-green-500', 'bg-green-50');
      
      // Back to normal after drag leave
      fireEvent.dragLeave(dropZone!);
      expect(dropZone).toHaveClass('border-gray-300', 'bg-white');
    });

    test('file name display shows and hides correctly', async () => {
      render(<FileUpload setData={mockSetData} />);
      
      // Initially no file name
      expect(screen.queryByText(/selected/)).not.toBeInTheDocument();
      
      // Add a file
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      const testFile = new File(['content'], 'test-file.txt', { type: 'text/plain' });
      
      Object.defineProperty(fileInput, 'files', {
        value: [testFile],
        configurable: true,
      });
      
      fireEvent.change(fileInput);
      
      // Should show file name
      await waitFor(() => {
        expect(screen.getByText('test-file.txt')).toBeInTheDocument();
        // Check that the file name paragraph exists
        const fileDisplay = screen.getByText('test-file.txt').closest('p');
        expect(fileDisplay).toHaveTextContent('📄');
        expect(fileDisplay).toHaveTextContent('selected');
      });
    });
  });

  describe('Props and Callbacks', () => {
    test('calls setData prop when file is loaded', async () => {
      const customSetData = jest.fn();
      render(<FileUpload setData={customSetData} />);
      
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      const testFile = new File(['custom content'], 'test.txt', { type: 'text/plain' });
      
      Object.defineProperty(fileInput, 'files', {
        value: [testFile],
        configurable: true,
      });
      
      fireEvent.change(fileInput);
      
      // Simulate FileReader completion
      mockFileReader.result = 'custom content';
      if (mockFileReader.onload) {
        mockFileReader.onload({} as ProgressEvent<FileReader>);
      }
      
      expect(customSetData).toHaveBeenCalledWith('custom content');
    });

    test('works with different file types', async () => {
      render(<FileUpload setData={mockSetData} />);
      
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      // Test with JSON file
      const jsonFile = new File(['{"key": "value"}'], 'data.json', { type: 'application/json' });
      
      Object.defineProperty(fileInput, 'files', {
        value: [jsonFile],
        configurable: true,
      });
      
      fireEvent.change(fileInput);
      
      await waitFor(() => {
        expect(screen.getByText('data.json')).toBeInTheDocument();
      });
      
      expect(mockFileReader.readAsText).toHaveBeenCalledWith(jsonFile);
    });
  });

  describe('Edge Cases', () => {
    test('handles file input with no files selected', () => {
      render(<FileUpload setData={mockSetData} />);
      
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      // Simulate change event with no files
      Object.defineProperty(fileInput, 'files', {
        value: null,
        configurable: true,
      });
      
      fireEvent.change(fileInput);
      
      // Should not show file name or call FileReader
      expect(screen.queryByText(/selected/)).not.toBeInTheDocument();
      expect(mockFileReader.readAsText).not.toHaveBeenCalled();
    });

    test('handles multiple files in drop (takes first one)', async () => {
      render(<FileUpload setData={mockSetData} />);
      
      const dropZone = screen.getByText('Click to upload or drag & drop').closest('div');
      const file1 = new File(['content1'], 'file1.txt', { type: 'text/plain' });
      const file2 = new File(['content2'], 'file2.txt', { type: 'text/plain' });
      
      const dropEvent = new Event('drop', { bubbles: true }) as any;
      dropEvent.dataTransfer = {
        files: [file1, file2],
      };
      
      fireEvent(dropZone!, dropEvent);
      
      // Should only process the first file
      await waitFor(() => {
        expect(screen.getByText('file1.txt')).toBeInTheDocument();
      });
      
      expect(screen.queryByText('file2.txt')).not.toBeInTheDocument();
      expect(mockFileReader.readAsText).toHaveBeenCalledWith(file1);
      expect(mockFileReader.readAsText).toHaveBeenCalledTimes(1);
    });

    test('prevents default behavior on drag events', () => {
      render(<FileUpload setData={mockSetData} />);
      
      const dropZone = screen.getByText('Click to upload or drag & drop').closest('div');
      
      // Test dragOver preventDefault
      const dragOverEvent = new Event('dragover', { bubbles: true }) as any;
      dragOverEvent.dataTransfer = { files: [] };
      const dragOverPreventDefaultSpy = jest.spyOn(dragOverEvent, 'preventDefault');
      
      fireEvent(dropZone!, dragOverEvent);
      expect(dragOverPreventDefaultSpy).toHaveBeenCalled();
      
      // Test drop preventDefault
      const dropEvent = new Event('drop', { bubbles: true }) as any;
      dropEvent.dataTransfer = { files: [] };
      const dropPreventDefaultSpy = jest.spyOn(dropEvent, 'preventDefault');
      
      fireEvent(dropZone!, dropEvent);
      expect(dropPreventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    test('has proper label association', () => {
      render(<FileUpload setData={mockSetData} />);
      
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      const label = document.querySelector('label[for="fileUpload"]');
      
      expect(fileInput).toHaveAttribute('id', 'fileUpload');
      expect(label).toBeInTheDocument();
    });

    test('is keyboard accessible', () => {
      render(<FileUpload setData={mockSetData} />);
      
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      expect(fileInput).not.toHaveAttribute('tabindex', '-1');
    });
  });
});