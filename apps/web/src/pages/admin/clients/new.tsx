import { useUsers } from '../../../context/user.context';
import { useRouter } from 'next/router';
import { useState, useCallback } from 'react';
import { api, UserRequest, UserResponse } from '@repo/client';
import UserRequestForm from '../../../components/UserRequestForm';

export default function ClientNewPage() {
  const { createUser, isLoading, error } = useUsers();

  const router = useRouter();

  const [newUser, setNewUser] = useState<Partial<UserRequest>>();

  const handleSubmit = useCallback((submitedUser: UserRequest) => {
    const _createUser = async () => {
      const userData = await createUser(submitedUser);
      setNewUser(userData);
      router.push(`/admin/clients/${userData.id}`);
    };
    _createUser();
  }, []);

  return (
    <main className='p-5 bg-white text-black min-h-screen'>
      <div className='text-2xl mb-4'>Nouvel utilisateur</div>

      {error ? (
        <div className='text-red-500 mt-4'>
          Error loading client: {error.message}
        </div>
      ) : (
        <div className='mt-4'>
          <UserRequestForm
            user={newUser}
            onChange={setNewUser}
            onSubmit={handleSubmit}
          />
        </div>
      )}
    </main>
  );
}
