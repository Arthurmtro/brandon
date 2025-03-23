import { useUsers } from '../../../context/user.context';
import { useRouter } from 'next/router';
import { api, UserRequest, UserResponse } from '@repo/client';
import UserRequestForm from '../../../components/UserRequestForm';

export default function ClientNewPage() {
  const { createUser, isLoading, error } = useUsers();

  const router = useRouter();

  return (
    <main className='p-5 bg-white text-black min-h-screen'>
      <div className='text-2xl mb-4'>Nouvel utilisateur</div>

      {isLoading ? (
        <div className='flex justify-center my-8'>
          <div className='animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent'></div>
        </div>
      ) : error ? (
        <div className='text-red-500 mt-4'>
          Error loading client: {error.message}
        </div>
      ) : (
        <div className='mt-4  gap-4'>
          <div>
            <UserRequestForm
              user={newUser}
              onChange={setNewUser}
              onSubmit={handleSubmit}
            />

            <button
              className='mt-5 bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition'
              onClick={() => {
                // router.push(router.pathname + `/${client.id}`);
              }}
            >
              Supprimer
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
