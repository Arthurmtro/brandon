/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext, useContext } from "react";

interface AdminApiContextType {
  getRestaurants: (page?: number) => Promise<unknown>;
}

const AdminApiContext = createContext<AdminApiContextType | undefined>(
  undefined
);

export const AdminApiContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const getRestaurants = (page?: number) => {
    return Promise.resolve({
      count: 3,
      next: null,
      previous: null,
      results: [
        {
          id: 19,
          name: "Le Maison Royale",
          description:
            "Une expérience gastronomique raffinée mettant en vedette les saveurs de la cuisine française contemporaine",
          capacity: 80,
          opening_hours: "07:00-23:00",
          location: "Rez-de-chaussée",
          is_active: true,
        },
        {
          id: 20,
          name: "Bistrot de la piscine",
          description: "Une cuisine décontractée aux saveurs méditerranéennes",
          capacity: 40,
          opening_hours: "11:00-22:00",
          location: "Terrasse de la piscine",
          is_active: true,
        },
        {
          id: 21,
          name: "Le Belvedere",
          description:
            "Une table d'exception avec vue panoramique sur la ville",
          capacity: 60,
          opening_hours: "16:00-23:00",
          location: "13ème étage",
          is_active: true,
        },
      ],
    });
  };

  return (
    <AdminApiContext.Provider value={{ getRestaurants }}>
      {children}
    </AdminApiContext.Provider>
  );
};

export const useAdminApiContext = () => {
  const context = useContext(AdminApiContext);
  if (!context) {
    throw new Error(
      "useAdminApiContext doit être utilisé dans un AdminApiContextProvider"
    );
  }
  return context;
};
