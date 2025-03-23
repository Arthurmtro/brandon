'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRightIcon, HomeIcon } from 'lucide-react';

export default function Breadcrumb() {
  const pathname = usePathname();

  // Ignore la partie /admin du chemin
  const segments = pathname
    .split('/')
    .filter((segment) => segment && segment !== 'admin');

  // Construit les chemins complets pour chaque segment
  const paths = segments.map((segment, index) => {
    const path = `/admin/${segments.slice(0, index + 1).join('/')}`;
    return {
      name:
        segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
      path,
    };
  });

  return (
    <nav className='py-3 px-1' aria-label='Breadcrumb'>
      <ol className='flex items-center space-x-1 text-sm text-gray-600'>
        <li>
          <Link
            href='/admin'
            className='flex items-center hover:text-primary transition-colors'
          >
            <HomeIcon className='h-4 w-4 mr-1' />
            <span>Admin</span>
          </Link>
        </li>

        {paths.map((item, index) => (
          <li key={item.path} className='flex items-center'>
            <ChevronRightIcon className='h-4 w-4 mx-1 text-gray-400' />
            {index === paths.length - 1 ? (
              <span className='font-medium text-gray-900'>{item.name}</span>
            ) : (
              <Link
                href={item.path}
                className='hover:text-primary transition-colors'
              >
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
