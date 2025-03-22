import { createContext, useContext } from 'react';
import {
  PaginatedRestaurantList,
  PaginatedMealTypeList,
  Spa,
} from '../../../backend/src/clients/hotel-california/api/api';

interface AdminApiContextType {
  getRestaurants: (page?: number) => Promise<PaginatedRestaurantList>;
  getMeals: (page?: number) => Promise<PaginatedMealTypeList>;
  getSpas: () => Promise<Spa[]>;
}

const AdminApiContext = createContext<AdminApiContextType | undefined>(
  undefined
);

export const AdminApiContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const getRestaurants: AdminApiContextType['getRestaurants'] = (page) =>
    Promise.resolve({
      count: 3,
      next: null,
      previous: null,
      results: [
        {
          id: 19,
          name: 'Le Maison Royale',
          description:
            'Une expérience gastronomique raffinée mettant en vedette les saveurs de la cuisine française contemporaine',
          capacity: 80,
          opening_hours: '07:00-23:00',
          location: 'Rez-de-chaussée',
          is_active: true,
        },
        {
          id: 20,
          name: 'Bistrot de la piscine',
          description: 'Une cuisine décontractée aux saveurs méditerranéennes',
          capacity: 40,
          opening_hours: '11:00-22:00',
          location: 'Terrasse de la piscine',
          is_active: true,
        },
        {
          id: 21,
          name: 'Le Belvedere',
          description:
            "Une table d'exception avec vue panoramique sur la ville",
          capacity: 60,
          opening_hours: '16:00-23:00',
          location: '13ème étage',
          is_active: true,
        },
      ],
    });

  const getMeals: AdminApiContextType['getMeals'] = (page) =>
    Promise.resolve({
      count: 3,
      next: null,
      previous: null,
      results: [
        {
          id: 19,
          name: 'Breakfast',
        },
        {
          id: 20,
          name: 'Lunch',
        },
        {
          id: 21,
          name: 'Dinner',
        },
      ],
    });

  const getSpas: AdminApiContextType['getSpas'] = () =>
    Promise.resolve([
      {
        id: 1,
        name: 'Relaxation Spa',
        description:
          'Un spa dédié à la relaxation avec des massages professionnels et des bains chauds.',
        location: '123 Wellness Street, Paris, France',
        phone_number: '+33 1 23 45 67 89',
        email: 'contact@relaxationspa.fr',
        opening_hours: 'Lundi - Dimanche : 09:00 - 20:00',
        created_at: '2024-12-08T15:32:43.062749+01:00',
        updated_at: '2024-12-08T15:32:43.062754+01:00',
      },
      {
        id: 2,
        name: 'Thermal Bliss Spa',
        description:
          'Découvrez nos sources thermales naturelles et nos soins corporels personnalisés.',
        location: '456 Thermal Avenue, Lyon, France',
        phone_number: '+33 4 56 78 90 12',
        email: 'info@thermalblissspa.fr',
        opening_hours: 'Lundi - Vendredi : 10:00 - 18:00',
        created_at: '2024-12-08T15:32:43.063120+01:00',
        updated_at: '2024-12-08T15:32:43.063124+01:00',
      },
      {
        id: 3,
        name: 'Luxury Escape Spa',
        description:
          'Un spa haut de gamme offrant des soins de luxe et des expériences uniques.',
        location: '789 Luxury Road, Nice, France',
        phone_number: '+33 6 98 76 54 32',
        email: 'hello@luxuryescapespa.fr',
        opening_hours: 'Samedi - Dimanche : 11:00 - 23:00',
        created_at: '2024-12-08T15:32:43.063471+01:00',
        updated_at: '2024-12-08T15:32:43.063475+01:00',
      },
      {
        id: 4,
        name: 'Relaxation Spa',
        description:
          'Un spa dédié à la relaxation avec des massages professionnels et des bains chauds.',
        location: '123 Wellness Street, Paris, France',
        phone_number: '+33 1 23 45 67 89',
        email: 'contact@relaxationspa.fr',
        opening_hours: 'Lundi - Dimanche : 09:00 - 20:00',
        created_at: '2024-12-08T15:33:20.203330+01:00',
        updated_at: '2024-12-08T15:33:20.203334+01:00',
      },
      {
        id: 5,
        name: 'Thermal Bliss Spa',
        description:
          'Découvrez nos sources thermales naturelles et nos soins corporels personnalisés.',
        location: '456 Thermal Avenue, Lyon, France',
        phone_number: '+33 4 56 78 90 12',
        email: 'info@thermalblissspa.fr',
        opening_hours: 'Lundi - Vendredi : 10:00 - 18:00',
        created_at: '2024-12-08T15:33:20.203794+01:00',
        updated_at: '2024-12-08T15:33:20.203800+01:00',
      },
      {
        id: 6,
        name: 'Luxury Escape Spa',
        description:
          'Un spa haut de gamme offrant des soins de luxe et des expériences uniques.',
        location: '789 Luxury Road, Nice, France',
        phone_number: '+33 6 98 76 54 32',
        email: 'hello@luxuryescapespa.fr',
        opening_hours: 'Samedi - Dimanche : 11:00 - 23:00',
        created_at: '2024-12-08T15:33:20.204194+01:00',
        updated_at: '2024-12-08T15:33:20.204199+01:00',
      },
      {
        id: 7,
        name: 'Relaxation Spa',
        description:
          'Un spa dédié à la relaxation avec des massages professionnels et des bains chauds.',
        location: '123 Wellness Street, Paris, France',
        phone_number: '+33 1 23 45 67 89',
        email: 'contact@relaxationspa.fr',
        opening_hours: 'Lundi - Dimanche : 09:00 - 20:00',
        created_at: '2025-03-21T17:57:54.064799+01:00',
        updated_at: '2025-03-21T17:57:54.064803+01:00',
      },
      {
        id: 8,
        name: 'Thermal Bliss Spa',
        description:
          'Découvrez nos sources thermales naturelles et nos soins corporels personnalisés.',
        location: '456 Thermal Avenue, Lyon, France',
        phone_number: '+33 4 56 78 90 12',
        email: 'info@thermalblissspa.fr',
        opening_hours: 'Lundi - Vendredi : 10:00 - 18:00',
        created_at: '2025-03-21T17:57:54.065438+01:00',
        updated_at: '2025-03-21T17:57:54.065443+01:00',
      },
      {
        id: 9,
        name: 'Luxury Escape Spa',
        description:
          'Un spa haut de gamme offrant des soins de luxe et des expériences uniques.',
        location: '789 Luxury Road, Nice, France',
        phone_number: '+33 6 98 76 54 32',
        email: 'hello@luxuryescapespa.fr',
        opening_hours: 'Samedi - Dimanche : 11:00 - 23:00',
        created_at: '2025-03-21T17:57:54.065791+01:00',
        updated_at: '2025-03-21T17:57:54.065795+01:00',
      },
      {
        id: 10,
        name: 'Relaxation Spa',
        description:
          'Un spa dédié à la relaxation avec des massages professionnels et des bains chauds.',
        location: '123 Wellness Street, Paris, France',
        phone_number: '+33 1 23 45 67 89',
        email: 'contact@relaxationspa.fr',
        opening_hours: 'Lundi - Dimanche : 09:00 - 20:00',
        created_at: '2025-03-22T11:05:30.080622+01:00',
        updated_at: '2025-03-22T11:05:30.080639+01:00',
      },
      {
        id: 11,
        name: 'Thermal Bliss Spa',
        description:
          'Découvrez nos sources thermales naturelles et nos soins corporels personnalisés.',
        location: '456 Thermal Avenue, Lyon, France',
        phone_number: '+33 4 56 78 90 12',
        email: 'info@thermalblissspa.fr',
        opening_hours: 'Lundi - Vendredi : 10:00 - 18:00',
        created_at: '2025-03-22T11:05:30.081172+01:00',
        updated_at: '2025-03-22T11:05:30.081189+01:00',
      },
      {
        id: 12,
        name: 'Luxury Escape Spa',
        description:
          'Un spa haut de gamme offrant des soins de luxe et des expériences uniques.',
        location: '789 Luxury Road, Nice, France',
        phone_number: '+33 6 98 76 54 32',
        email: 'hello@luxuryescapespa.fr',
        opening_hours: 'Samedi - Dimanche : 11:00 - 23:00',
        created_at: '2025-03-22T11:05:30.081624+01:00',
        updated_at: '2025-03-22T11:05:30.081641+01:00',
      },
    ]);

  return (
    <AdminApiContext.Provider value={{ getRestaurants, getMeals, getSpas }}>
      {children}
    </AdminApiContext.Provider>
  );
};

export const useAdminApiContext = () => {
  const context = useContext(AdminApiContext);
  if (!context) {
    throw new Error(
      'useAdminApiContext doit être utilisé dans un AdminApiContextProvider'
    );
  }
  return context;
};
