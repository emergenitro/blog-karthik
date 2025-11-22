'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Prefetch the blogs page for instant navigation
    router.prefetch('/blogs?from=home');

    fetch('/api/auth/check')
      .then(res => res.json())
      .then(data => setIsLoggedIn(data.isLoggedIn))
      .catch(() => setIsLoggedIn(false));
  }, [router]);

  const handleEnter = (e) => {
    if (e.target.tagName === 'A' || e.target.closest('a')) return;
    setIsTransitioning(true);
    setTimeout(() => {
      router.push('/blogs?from=home');
    }, 800);
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center cursor-pointer transition-all duration-1000 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
      onClick={handleEnter}
    >
      {isLoggedIn && (
        <Link
          href="/admin"
          className="absolute top-8 right-8 px-4 py-2 border-2 border-dashed border-gray-600 hover:border-gray-400 transition-all duration-300 text-sm cursor-pointer"
          onClick={(e) => e.stopPropagation()}
          prefetch={true}
        >
          admin
        </Link>
      )}
      <h1 className="text-4xl font-bold text-center">
        the karthik blog.
      </h1>
      <p className="mt-4 text-gray-500 text-sm animate-pulse">
        click anywhere to enter
      </p>
    </div>
  );
}