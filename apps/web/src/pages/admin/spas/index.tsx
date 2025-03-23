import { useAdminApiContext } from '../../../context/AdminApiContext';
import Paginator from '../../../components/Paginator';
import { useEffect, useState, useId } from 'react';
import { SpaResponse } from '@repo/client';

export default function SpasPage() {
  const baseId = useId();

  const { getSpas } = useAdminApiContext();

  const [spas, setSpas] = useState<SpaResponse[]>([]);

  useEffect(() => {
    getSpas().then(setSpas);
  }, []);

  return (
    <div className='p-5 bg-white text-black min-h-screen'>
      <div className='text-2xl'>Spas</div>
      <div className='mt-5 flex flex-col items-start gap-4'>
        {spas.map((spa) => (
          <div
            key={`${baseId}-${spa.id}`}
            className='flex flex-col items-start gap-1 border border-gray-300 rounded-lg shadow-lg p-2'
          >
            {Object.keys(spa).map((k) => {
              const key = k as keyof SpaResponse;
              const value = ['boolean', 'undefined'].includes(typeof spa[key])
                ? String(spa[key])
                : spa[key];

              return (
                <div
                  key={`${baseId}-${spa.id}-${key}`}
                  className='flex flex-row items-start gap-1'
                >
                  {key} :<span className='font-bold'>{value}</span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
