import { useRouter } from "next/router";

export default function AdminPage() {
  const router = useRouter();

  const routes = [
    { name: "clients", path: "/clients" },
    { name: "reservations", path: "/reservations" },
    { name: "restaurants", path: "/restaurants" },
    { name: "meals", path: "/meals" },
    { name: "spas", path: "/spas" },
  ];

  return (
    <>
      <div className="flex flex-col items-start gap-5 min-h-screen bg-gray-100 border-5">
        {routes.map((route) => (
          <button
            key={route.path}
            onClick={() => router.push(router.pathname + route.path)}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
          >
            {route.name}
          </button>
        ))}
      </div>
    </>
  );
}
