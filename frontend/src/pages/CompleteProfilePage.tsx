import { AuthSidebar } from '../components/auth/AuthSidebar';
import { CompleteTeacherProfileForm } from '../components/auth/CompleteTeacherProfileForm';

export default function CompleteProfilePage() {
  return (
    <div className="min-h-screen bg-[var(--app-bg)] text-[var(--t1)] flex items-center justify-center p-4 md:p-8 font-sans">
      <div className="w-full max-w-5xl bg-[var(--panel)] rounded-3xl shadow-[var(--shadow-modal)] overflow-hidden flex flex-col md:flex-row border border-[var(--line)] min-h-[600px]">
        <AuthSidebar />
        <CompleteTeacherProfileForm />
      </div>
    </div>
  );
}
