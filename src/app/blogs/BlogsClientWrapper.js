'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function BlogsWrapperContent({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const searchParams = useSearchParams();
    const [opacity, setOpacity] = useState(0);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        fetch('/api/auth/check')
            .then(res => res.json())
            .then(data => setIsLoggedIn(data.isLoggedIn))
            .catch(() => setIsLoggedIn(false));
    }, []);

    useEffect(() => {
        if (mounted) {
            if (searchParams.get('from') === 'home') {
                setTimeout(() => setIsAnimating(true), 100);
            } else {
                setOpacity(1);
            }
        }
    }, [mounted, searchParams]);

    return (
        <div className={`min-h-screen flex items-center justify-center p-8 transition-all duration-1000 opacity-${opacity} ${isAnimating ? 'opacity-100 scale-100' : ''
            }`}
            style={isAnimating ? { animation: 'popIn 0.8s ease-out' } : {}}>
            <style jsx>{`
                @keyframes popIn {
                    0% {
                        opacity: 0;
                        transform: scale(0.8);
                    }
                    100% {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
            `}</style>
            {isLoggedIn && (
                <Link
                    href="/admin"
                    className="absolute top-8 right-8 px-4 py-2 border-2 border-dashed border-gray-600 hover:border-gray-400 transition-all duration-300 text-sm"
                >
                    admin
                </Link>
            )}
            {children}
        </div>
    );
}

export default function BlogsClientWrapper({ children }) {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <BlogsWrapperContent>{children}</BlogsWrapperContent>
        </Suspense>
    );
}
