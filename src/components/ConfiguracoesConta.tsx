import UserAvatar from "./UserAvatar";
import { useAuth } from "../contexts/AuthContext";

type ConfiguracoesContaProps = {
  roleLabel: string;
  subtitle: string;
};

export default function ConfiguracoesConta({ roleLabel, subtitle }: ConfiguracoesContaProps) {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <>
      <div className="flex flex-col items-center gap-4 border-b border-gray-100 pb-6 sm:flex-row sm:items-start">
        <UserAvatar name={user.username} />
        <div className="text-center sm:text-left">
          <h2 className="text-xl font-semibold text-gray-900">{user.username}</h2>
          <p className="mt-1 text-gray-600">{roleLabel}</p>
          <p className="mt-2 text-sm text-gray-500">ID: {user.user_id}</p>
        </div>
      </div>

      <p className="text-sm text-gray-600">{subtitle}</p>

      <section className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Conta</h3>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between gap-4 border-b border-gray-100 pb-3">
            <dt className="text-gray-500">Usuário</dt>
            <dd className="font-medium">{user.username}</dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-gray-100 pb-3">
            <dt className="text-gray-500">Tipo de conta</dt>
            <dd className="font-medium">{roleLabel}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-gray-500">Identificador</dt>
            <dd className="font-medium">{user.user_id}</dd>
          </div>
        </dl>
      </section>

      <section className="space-y-2">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
          Preferências
        </h3>
        <p className="text-sm text-gray-600">
          Alteração de senha, e-mail e notificações serão habilitadas quando a API disponibilizar
          os endpoints de perfil.
        </p>
      </section>
    </>
  );
}
