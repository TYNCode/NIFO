import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { FaTimes, FaEnvelope, FaSpinner } from 'react-icons/fa';
import { inviteTeammate, fetchTeam } from '../../../redux/features/auth/teamSlice';
import { RootState } from '../../../redux/store';

interface InviteDrawerProps {
  showInviteModal: boolean;
  setShowInviteModal: (show: boolean) => void;
  members: Array<{ email: string; name: string; status: string; joined: string }>;
}

const InviteDrawer: React.FC<InviteDrawerProps> = ({ showInviteModal, setShowInviteModal, members }) => {
    const dispatch = useDispatch();
    const { loading } = useSelector((state: RootState) => state.team);
    const { register, handleSubmit, formState: { errors }, reset, setError, watch } = useForm({
      defaultValues: { email: "", role: "startup_user" }
    });
    const [apiError, setApiError] = useState("");
  
    const onSubmit = async (data: { email: string; role: string }) => {
      setApiError("");
  
      const exists = members.some((m) => m.email === data.email);
      if (exists) {
        setError("email", { type: "manual", message: "This email is already a teammate." });
        return;
      }
  
      const result = await dispatch(inviteTeammate(data) as any);
      if (inviteTeammate.fulfilled.match(result)) {
        await dispatch(fetchTeam() as any);
        reset(); // clear fields
        setShowInviteModal(false); // now close the modal
      } else {
        setApiError(result.payload?.email?.[0] || result.payload?.detail || "Failed to invite teammate.");
      }
    };
  
    const currentEmail = watch("email");
  
    if (!showInviteModal) return null;
  
    return (
      <div className="fixed inset-0 z-50 flex justify-end">
        <div className="bg-white w-full max-w-md h-full shadow-xl p-6 relative">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Invite Teammate</h3>
            <button
              onClick={() => setShowInviteModal(false)}
              className="text-gray-400 hover:text-gray-600 absolute top-4 right-4"
            >
              <FaTimes />
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  {...register("email", { required: "Email is required" })}
                  placeholder="Enter email address"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message as string}
                </p>
              )}
            </div>
  
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <select
                {...register("role", { required: true })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
              >
                <option value="startup_user">User</option>
                <option value="startup_admin">Admin</option>
              </select>
            </div>
  
            {apiError && (
              <div className="text-red-500 text-xs mb-2">{apiError}</div>
            )}
  
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowInviteModal(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors"
                disabled={loading.invite}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-primary text-white py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors"
                disabled={loading.invite}
              >
                {loading.invite ? (
                  <span className="flex items-center justify-center">
                    <FaSpinner className="animate-spin mr-2" /> Sending...
                  </span>
                ) : (
                  "Send Invite"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

export default InviteDrawer;
  