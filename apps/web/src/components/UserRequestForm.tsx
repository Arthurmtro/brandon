import { UserRequest } from '@repo/client';
import { FormEvent, useCallback } from 'react';

type UserRequestFormProps = {
  user: UserRequest;
  onChange?: (client: UserRequest) => void;
  onSubmit?: () => void;
};

export default function UserRequestForm({
  user,
  onChange = () => {},
  onSubmit = () => {},
}: UserRequestFormProps) {
  const handleChange = useCallback(
    (partialUser: Partial<UserRequest>) => {
      onChange({ ...user, ...partialUser });
    },
    [onChange, user]
  );

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      e.stopPropagation();
      onSubmit();
    },
    [onSubmit]
  );

  return (
    <div className='max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg'>
      <h2 className='text-xl font-bold mb-4'>Créer un Client</h2>

      <form onSubmit={handleSubmit} className='space-y-4'>
        {/* Nom */}
        <div>
          <label className='block text-sm font-medium text-gray-700'>
            Nom du client
          </label>
          <input
            type='text'
            className='mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500'
            placeholder='Ex: Jean Dupont'
            value={user.name}
            onChange={(e) => handleChange({ name: e.target.value })}
          />
        </div>

        {/* Numéro de téléphone */}
        <div>
          <label className='block text-sm font-medium text-gray-700'>
            Numéro de téléphone
          </label>
          <input
            type='text'
            className='mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500'
            placeholder='+33612345678'
            value={user.name}
            onChange={(e) => handleChange({ phoneNumber: e.target.value })}
          />
        </div>

        {/* Numéro de chambre */}
        <div>
          <label className='block text-sm font-medium text-gray-700'>
            Numéro de chambre (optionnel)
          </label>
          <input
            type='text'
            className='mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500'
            placeholder='Ex: 101A'
            value={user.name}
            onChange={(e) => handleChange({ roomNumber: e.target.value })}
          />
        </div>

        {/* Demandes spéciales */}
        <div>
          <label className='block text-sm font-medium text-gray-700'>
            Demandes spéciales
          </label>
          <textarea
            className='mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500'
            placeholder='Ex: Chambre avec vue sur la mer...'
            onChange={(e) => handleChange({ specialRequests: e.target.value })}
          />
        </div>

        {/* Bouton de soumission */}
        <button
          type='submit'
          className='w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition'
        >
          Soumettre
        </button>
      </form>
    </div>
  );
}
