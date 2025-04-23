"use client";

import React, { useState, useEffect } from 'react';
import ProjectTypeForm from '../../components/ProjectTypeForm';
import { useRouter } from 'next/navigation';
import { getProjectTypeById } from '../../api/index';
import { toast } from "@/hooks/use-toast";

interface EditProjectTypePageProps {
  params: {
    id: string;
  };
}

export default function EditProjectTypePage({ params }: EditProjectTypePageProps) {
  const router = useRouter();
  const [projectType, setProjectType] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProjectTypeById(params.id);
        setProjectType(data);
      } catch (error) {
        console.error('获取数据失败:', error);
        toast({
          title: "获取数据失败",
          description: "请重试",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  const handleSuccess = () => {
    router.push('/project-type');
  };

  const handleCancel = () => {
    router.push('/project-type');
  };

  if (loading) {
    return <div>加载中...</div>;
  }

  if (!projectType) {
    return <div>数据加载失败</div>;
  }

  return (
    <ProjectTypeForm 
      initialValues={projectType} 
      onSuccess={handleSuccess} 
      onCancel={handleCancel} 
    />
  );
} 