"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/store";
import {
  fetchTeam,
  resendInvite,
  deleteTeammate,
} from "../../redux/features/auth/teamSlice";
import LeftFrame from "../../components/LeftFrame/LeftFrame";
import TeamTable from "../components/team/TeamTable";
import InviteDrawer from "../components/team/InviteDrawer";
import TeamStats from "../components/team/TeamStats";

const PAGE_SIZE = 7;

const StartupTeam: React.FC = () => {
  const dispatch = useDispatch();
  const { members, loading } = useSelector((state: RootState) => state.team);

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    type: 'resend' | 'remove' | null;
    user: any | null;
  }>({ type: null, user: null });
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchTeam() as any);
  }, [dispatch]);

  // Pagination logic
  const totalPages = Math.ceil(members.length / PAGE_SIZE) || 1;
  const pagedMembers = members.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Loading maps for per-row loading
  const resendLoadingMap = loading.resend || {};
  const removeLoadingMap = loading.delete || {};

  const handleResend = (id: string | number) => {
    setConfirmModal({ type: null, user: null });
    if (!String(id).startsWith('invite-')) {
      dispatch(resendInvite({ user_id: parseInt(String(id)) }) as any);
      dispatch(fetchTeam() as any);
    }
  };

  const handleDelete = (id: string | number) => {
    setConfirmModal({ type: null, user: null });
    if (!String(id).startsWith('invite-')) {
      dispatch(deleteTeammate(parseInt(String(id))) as any);
      dispatch(fetchTeam() as any);
    }
  };

  return (
    <main className="flex w-full min-h-screen bg-gray-50">
      <div className="hidden lg:block lg:fixed lg:w-1/5 xl:w-[21%] h-full">
        <LeftFrame />
      </div>
      <div className="w-full lg:ml-[20%] xl:ml-[21%] px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Team Management</h1>
          <p className="text-gray-600">Invite and manage your team members</p>
        </div>
        {/* Team Stats */}
        <TeamStats members={members} />
        <div className="flex justify-end mb-4">
          <button
            className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
            onClick={() => setShowInviteModal(true)}
            disabled={loading.fetch}
          >
            Invite
          </button>
        </div>
        <TeamTable
          members={pagedMembers}
          loading={loading.fetch}
          resendLoadingMap={resendLoadingMap}
          removeLoadingMap={removeLoadingMap}
          onResend={(id) => setConfirmModal({ type: 'resend', user: pagedMembers.find(m => m.id === id) })}
          onRemove={(id) => setConfirmModal({ type: 'remove', user: pagedMembers.find(m => m.id === id) })}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
        {showInviteModal && (
          <InviteDrawer
            showInviteModal={showInviteModal}
            setShowInviteModal={setShowInviteModal}
            members={members}
          />
        )}
        {/* Confirmation Modal */}
        {confirmModal.type && confirmModal.user && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
              <h2 className="text-lg font-semibold mb-4">
                {confirmModal.type === 'resend' ? 'Resend Invitation' : 'Remove Teammate'}
              </h2>
              <p className="mb-6">
                {confirmModal.type === 'resend'
                  ? `Are you sure you want to resend the invitation to ${confirmModal.user.name || confirmModal.user.email}?`
                  : `Are you sure you want to remove ${confirmModal.user.name || confirmModal.user.email} from your team?`}
              </p>
              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 rounded bg-gray-200 text-gray-700"
                  onClick={() => setConfirmModal({ type: null, user: null })}
                >
                  Cancel
                </button>
                <button
                  className={`px-4 py-2 rounded text-white ${confirmModal.type === 'resend' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'}`}
                  onClick={() => {
                    if (confirmModal.type === 'resend') {
                      handleResend(confirmModal.user!.id);
                    } else if (confirmModal.type === 'remove') {
                      handleDelete(confirmModal.user!.id);
                    }
                  }}
                >
                  {confirmModal.type === 'resend' ? 'Resend' : 'Remove'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default StartupTeam;
