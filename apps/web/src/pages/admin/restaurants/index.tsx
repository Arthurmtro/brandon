import { useAdminApiContext } from "../../../utils/AdminApiContext";
import Paginator from "../../../utils/Paginator";
import { useEffect, useState } from "react";

export default function RestauratsPage() {
  const { getRestaurants } = useAdminApiContext();

  const [restaurants, setRestaurants] = useState<unknown>({});
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    getRestaurants().then(setRestaurants);
  }, []);

  return (
    <>
      <div>Restaurants</div>
      <div>
        <Paginator minPage={1} maxPage={6} page={page} onPageChange={setPage} />
      </div>
    </>
  );
}
