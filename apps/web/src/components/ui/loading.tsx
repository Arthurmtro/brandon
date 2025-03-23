import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

export function Loading() {
  return (
    <div className='flex min-h-[400px] w-full flex-col items-center justify-center'>
      <div className='flex flex-col items-center gap-6'>
        <div className='flex items-center gap-2'>
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={cn(
                'h-4 w-4 rounded-full bg-primary',
                'animate-bounce',
                i === 0 && 'animation-delay-0',
                i === 1 && 'animation-delay-100',
                i === 2 && 'animation-delay-200',
                i === 3 && 'animation-delay-300',
                i === 4 && 'animation-delay-400'
              )}
            />
          ))}
        </div>
        <div className='flex flex-col items-center gap-2'>
          <div className='flex items-center gap-2'>
            <Loader2 className='h-5 w-5 animate-spin text-muted-foreground' />
            <p className='text-lg font-medium'>Loading your data...</p>
          </div>
          <p className='text-sm text-muted-foreground'>This won't take long</p>
        </div>
      </div>
    </div>
  );
}
