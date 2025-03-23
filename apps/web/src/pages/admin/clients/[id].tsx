import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useUsers } from '../../../context/user.context';
import UserRequestForm from '../../../components/UserRequestForm';
import { api, UserRequest, UserResponse } from '@repo/client';

export default function ClientIdPage() {
  const router = useRouter();
  const { getUser, updateUser, isLoading, error } = useUsers();

  const { id } = router.query;

  const [user, setUser] = useState<UserResponse>();
  const [newUser, setNewUser] = useState<UserRequest>();

  useEffect(() => {
    const fetchUser = async () => {
      if (!id || Array.isArray(id)) return;

      const userData = await getUser(id);
      setUser(userData);
      setNewUser(userData);
    };

    fetchUser();
  }, [id]);

  const handleSubmit = useCallback(() => {
    if (!id || !newUser || Array.isArray(id)) return;

    updateUser(id, newUser);
  }, [newUser, id]);

  return (
    <main className='p-5 bg-white text-black min-h-screen'>
      <div className='text-2xl mb-4'>Édition du client : {id}</div>

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
          {!newUser ? (
            <div className='text-gray-500'>User not found</div>
          ) : (
            <UserRequestForm
              user={newUser}
              onChange={setNewUser}
              onSubmit={handleSubmit}
            />
          )}
        </div>
      )}
    </main>
  );
}
