import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UserPlus } from 'lucide-react';
import { fetchUsers, createUser } from '../store/slices/userSlice';
import type { RootState, AppDispatch } from '../store';
import type { CreateUserRequest } from '../service/user.service';
import { UserList } from '../components/user/UserList';
import { UserForm } from '../components/user/UserForm';

export const UsersPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading } = useSelector((state: RootState) => state.user);
  const [showModal, setShowModal] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);
  const [formSuccess, setFormSuccess] = React.useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleCreateUser = async (data: CreateUserRequest) => {
    setFormError(null);
    setFormSuccess(null);

    try {
      await dispatch(createUser(data)).unwrap();
      setFormSuccess('Utilisateur créé avec succès');
      setTimeout(() => {
        setShowModal(false);
        setFormSuccess(null);
      }, 1500);
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setFormError(axiosError.response?.data?.message || 'Erreur lors de la création');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormError(null);
    setFormSuccess(null);
  };

  return (
    <div className="p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--t1)]">Utilisateurs</h1>
          <p className="text-sm text-[var(--t3)] mt-1">Gérer les comptes utilisateurs</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm
            bg-[var(--accent)] hover:bg-[var(--accent-strong)] text-white
            transition-colors"
        >
          <UserPlus size={18} />
          Nouveau compte
        </button>
      </div>

      <div className="bg-[var(--panel)] rounded-xl border border-[var(--line)] p-6">
        <UserList
          users={users}
          loading={loading}
        />
      </div>

      <UserForm
        isOpen={showModal}
        onClose={handleCloseModal}
        onSubmit={handleCreateUser}
        loading={loading}
        error={formError}
        success={formSuccess}
      />
    </div>
  );
};

export default UsersPage;