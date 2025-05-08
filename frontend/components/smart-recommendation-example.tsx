import React from 'react';
import { SmartRecommendation } from './smart-recommendation';

export function SmartRecommendationExample() {
  const handleAddItem = (item: any) => {
    console.log('添加项目:', item);
    // 这里可以添加实际的处理逻辑
  };

  // 示例数据
  const recommendationItems = [
    {
      id: '1',
      title: '初始审查申请表',
      type: '必交',
      description: '人体研究的初始审查标准申请表'
    },
    {
      id: '2',
      title: '项目详细方案',
      type: '必交',
      description: '详细的研究方案，包括背景、目标、方法等'
    },
    {
      id: '3',
      title: '知情同意书',
      type: '必交',
      description: '受试者/参与者知情同意书'
    },
    {
      id: '4',
      title: '研究者资质证明',
      type: '选交',
      description: '主要研究者资质及相关证明文件'
    },
    {
      id: '5',
      title: '数据管理计划',
      type: '选交',
      description: '研究数据的收集、存储和处理方案'
    }
  ];

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <SmartRecommendation
        title="智能推荐文件"
        items={recommendationItems}
        onAddItem={handleAddItem}
      />
      
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">没有推荐项的情况</h3>
        <SmartRecommendation
          title="智能推荐"
          items={[]}
          onAddItem={handleAddItem}
        />
      </div>
    </div>
  );
} 