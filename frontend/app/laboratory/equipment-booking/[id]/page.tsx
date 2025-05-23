export default function EquipmentBookingDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-semibold mb-6">仪器预约详情</h1>
      <p>预约ID: {params.id}</p>
      <p>仪器预约详情页面正在开发中...</p>
    </div>
  )
} 