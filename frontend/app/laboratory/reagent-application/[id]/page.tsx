export default function ReagentApplicationDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-semibold mb-6">试剂申领详情</h1>
      <p>申领ID: {params.id}</p>
      <p>试剂申领详情页面正在开发中...</p>
    </div>
  )
} 