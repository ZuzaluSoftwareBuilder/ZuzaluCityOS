'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { Stack, Alert, Snackbar } from '@mui/material';
import dynamic from 'next/dynamic';
const CreateDiscussionModal = dynamic(
  () => import('@/components/modals/Zuland/CreateDiscussionModal'),
  { ssr: false },
);
import { ConfigPanel } from '../adminevents/[eventid]/Tabs/Ticket/components/Common';

export default function DiscussionDebugPage() {
  const params = useParams();
  const spaceId = params.spaceid as string;

  // 控制模态框显示
  const [showCreateModal, setShowCreateModal] = useState(false);
  // 添加配置模态框状态
  const [showConfigModal, setShowConfigModal] = useState(false);

  // 消息通知状态
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState<
    'success' | 'error' | 'info' | 'warning'
  >('info');
  const [showToast, setShowToast] = useState(false);

  // 处理消息提示
  const handleShowToast = (
    text: string,
    severity: 'success' | 'error' | 'info' | 'warning',
  ) => {
    setToastMessage(text);
    setToastSeverity(severity);
    setShowToast(true);
  };

  // 添加处理不同模态框类型的函数
  const handleType = (type: string) => {
    if (type === 'config') {
      setShowConfigModal(true);
    }
  };

  return (
    <Stack direction="row" width={'100%'} height={'100%'}>
      <Stack width="100%" position="relative">
        <ConfigPanel
          title="Configure Space Zuland"
          desc="You need to setup initial configurations"
          sx={{
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            background: 'rgba(44, 44, 44, 0.80)',
            width: '600px',
            position: 'absolute',
            top: '40%',
            left: '50%',
            zIndex: 1200,
            transform: 'translate(-50%, -50%)',
          }}
          handleOpen={() => setShowCreateModal(true)}
        />

        {showCreateModal && (
          <CreateDiscussionModal
            showModal={showCreateModal}
            setShowModal={setShowCreateModal}
            showToast={handleShowToast}
            resourceId={spaceId}
            resourceType="spaces"
            resourceName="Discussion"
            resourceDescription="Space gated discussion"
          />
        )}

        {/* 消息提示 */}
        <Snackbar
          open={showToast}
          autoHideDuration={6000}
          onClose={() => setShowToast(false)}
        >
          <Alert severity={toastSeverity}>{toastMessage}</Alert>
        </Snackbar>
      </Stack>
    </Stack>
  );
}
