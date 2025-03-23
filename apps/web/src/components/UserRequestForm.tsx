import { UserRequest } from '@repo/client';
import { FormEvent, useCallback } from 'react';

type UserRequestFormProps = {
  user?: Partial<UserRequest>;
  onChange?: (user: Partial<UserRequest>) => void;
  onSubmit?: (user: UserRequest) => void;
};

export default function UserRequestForm({
  user = {},
  onChange = () => {},
  onSubmit = () => {},
}: UserRequestFormProps) {
  const handleChange = useCallback(
    (partialUser: Partial<UserRequest>) => {
      console.log(partialUser);
      onChange({ ...user, ...partialUser });
    },
    [onChange, user]
  );

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (user && user.name && user.phoneNumber) onSubmit(user as UserRequest);
    },
    [onSubmit]
  );

  return (
    <div className='border border-gray-200 mx-auto p-6 bg-white shadow-md rounded-lg'>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700'>
            Nom du client <span className='text-red-500'>*</span>
          </label>
          <input
            type='text'
            className='mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500'
            placeholder='Ex: Jean Dupont'
            required
            value={user.name}
            onChange={(e) => handleChange({ name: e.target.value })}
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700'>
            Numéro de téléphone <span className='text-red-500'>*</span>
          </label>
          <input
            type='text'
            className='mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500'
            placeholder='+33612345678'
            required
            value={user.phoneNumber}
            onChange={(e) => handleChange({ phoneNumber: e.target.value })}
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700'>
            Numéro de chambre (optionnel)
          </label>
          <input
            type='number'
            className='mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500'
            placeholder='Ex: 101A'
            value={user.roomNumber}
            onChange={(e) => handleChange({ roomNumber: e.target.value })}
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700'>
            Demandes spéciales
          </label>
          <textarea
            className='mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500'
            placeholder='Ex: Chambre avec vue sur la mer...'
            value={user.specialRequests}
            onChange={(e) => handleChange({ specialRequests: e.target.value })}
          />
        </div>

        <button
          type='submit'
          className=' bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition'
        >
          Soumettre
        </button>
      </form>
    </div>
  );
}
