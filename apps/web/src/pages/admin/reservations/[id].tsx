import { useRouter } from 'next/router';

export default function ReservationIdPage() {
  const router = useRouter();
  const { id } = router.query;
  return <div> Reservation {id}</div>;
}
