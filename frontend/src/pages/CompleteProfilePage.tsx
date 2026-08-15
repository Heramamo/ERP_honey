import { AuthSidebar } from '../components/auth/AuthSidebar';
import { CompleteTeacherProfileForm } from '../components/auth/CompleteTeacherProfileForm';

export default function CompleteProfilePage() {
  return (
    <div className="min-h-screen bg-[#0B1120] flex items-center justify-center p-4 md:p-8 font-sans">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-800/40 min-h-[600px]">
        <AuthSidebar />
        <CompleteTeacherProfileForm />
      </div>
    </div>
  );
}