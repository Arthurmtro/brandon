import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useUsers } from '../../../context/user.context';
import UserRequestForm from '../../../components/UserRequestForm';
import { api, UserRequest, UserResponse } from '@repo/client';

export default function ClientIdPage() {
  const router = useRouter();
  const { getUser, updateUser, deleteUser, isLoading, error } = useUsers();

  const { id } = router.query;

  const [user, setUser] = useState<UserResponse>();
  const [newUser, setNewUser] = useState<Partial<UserRequest>>();

  useEffect(() => {
    const _getUser = async () => {
      if (!id || Array.isArray(id)) return;

      const userData = await getUser(id);
      setUser(userData);
      setNewUser(userData);
    };

    _getUser();
  }, [id]);

  const handleSubmit = useCallback(
    (submitedUser: UserRequest) => {
      const _updateUser = async () => {
        if (!id || Array.isArray(id)) return;

        const userData = await updateUser(id, submitedUser);
        setUser(userData);
        setNewUser(userData);
      };
      _updateUser();
    },
    [id]
  );

  const handleDelete = useCallback(() => {
    const _deleteUser = async () => {
      if (!id || !newUser || Array.isArray(id)) return;

      await deleteUser(id);
      setUser(undefined);
      setNewUser(undefined);
      router.push('/admin/clients');
    };
    _deleteUser();
  }, [id, router]);

  return (
    <main className='p-5 bg-white text-black min-h-screen'>
      <div className='text-2xl mb-4'>Fiche utilisateur : {id}</div>

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
          )}
        </div>
      )}
    </main>
  );
}
