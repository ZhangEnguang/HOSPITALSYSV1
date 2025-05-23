export default function ConsumableDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-semibold mb-6">耗材详情</h1>
      <p>耗材ID: {params.id}</p>
      <p>耗材详情页面正在开发中...</p>
    </div>
  )
} 