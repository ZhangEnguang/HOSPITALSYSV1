"use client";

import React, { Suspense } from 'react';
import ProjectTypeForm from '../components/ProjectTypeForm';
import { useRouter, useSearchParams } from 'next/navigation';

function CreateProjectTypePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const parentId = searchParams.get('parentId');

  const handleSuccess = () => {
    router.push('/project-type');
  };

  const handleCancel = () => {
    router.push('/project-type');
  };

  return (
    <ProjectTypeForm 
      initialValues={{ parentId: parentId || '' }} 
      onSuccess={handleSuccess} 
      onCancel={handleCancel} 
    />
  );
}

export default function CreateProjectTypePage() {
  return (
    <Suspense fallback={<div className="p-4">加载中...</div>}>
      <CreateProjectTypePageContent />
    </Suspense>
  );
} 