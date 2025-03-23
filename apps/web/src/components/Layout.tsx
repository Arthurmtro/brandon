import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';
import Breadcrumb from './navigation/Breadcrumb';

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <div className='min-h-screen w-full px-4 sm:px-6 lg:px-8 py-4'>
          <Breadcrumb />
          <main className='w-full'>{children}</main>
        </div>
      </SidebarProvider>
    );
  }

  return <main className='flex-1'>{children}</main>;
}
