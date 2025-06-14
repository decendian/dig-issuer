import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Welcome to Issuer</h1>
        <div className="space-x-4">
          <Link 
            href="/login"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 inline-block"
          >
            Login
          </Link>
          <Link 
            href="/signup"
            className="bg-white text-indigo-600 px-6 py-3 rounded-lg border border-indigo-600 hover:bg-indigo-50 inline-block"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}