// jest.setup.js
import '@testing-library/jest-dom'

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
  usePathname: jest.fn(),
}))

// Auto-mock missing components to prevent import errors
jest.mock('@/components/LoginPage', () => {
  return jest.fn(() => null)
}, { virtual: true })

jest.mock('@/components/SignupPage', () => {
  return jest.fn(() => null)
}, { virtual: true })

// Mock other browser APIs...
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})