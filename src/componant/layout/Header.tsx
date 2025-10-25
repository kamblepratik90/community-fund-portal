import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Header: React.FC = () => {
  const router = useRouter();
  const { locale } = router;

  const switchLanguage = (newLocale: string) => {
    const { pathname, asPath, query } = router;
    router.push({ pathname, query }, asPath, { locale: newLocale });
  };

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="font-bold text-xl">
              Community Fund Portal
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex space-x-4">
              <Link href="/" className="text-gray-700 hover:text-gray-900">
                Home
              </Link>
              <Link href="/login" className="text-gray-700 hover:text-gray-900">
                Login
              </Link>
              <Link href="/signup" className="text-gray-700 hover:text-gray-900">
                Signup
              </Link>
            </nav>
            
            <div className="flex space-x-2">
              <button
                onClick={() => switchLanguage('en')}
                className={`px-3 py-1 rounded ${
                  locale === 'en' ? 'bg-gray-200' : 'bg-gray-100'
                }`}
              >
                English
              </button>
              <button
                onClick={() => switchLanguage('mr')}
                className={`px-3 py-1 rounded ${
                  locale === 'mr' ? 'bg-gray-200' : 'bg-gray-100'
                }`}
              >
                मराठी
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;