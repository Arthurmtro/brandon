import { ClientResponse } from '@repo/client';

type FormType = Omit<ClientResponse, 'id'>;

type ClientFormProps = {
  client: FormType;
  onChange?: (client: FormType) => void;
  onSubmit?: () => void;
};

export const ClientForm = ({
  client,
  onChange = () => {},
  onSubmit = () => {},
}: ClientFormProps) => {
  return <div></div>;
};
