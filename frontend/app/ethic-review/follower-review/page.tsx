// ... existing code ...

  // 批量操作按钮
  const batchActions = [
    {
      label: "批量审核",
      onClick: () => {
        toast({
          title: "批量审核",
          description: `已选择 ${selectedRows.length} 个项目进行批量审核`,
        })
      },
    },
    {
      label: "批量删除",
      onClick: () => {
        toast({
          title: "批量删除",
          description: `已选择 ${selectedRows.length} 个项目进行批量删除`,
        })
      },
    },
  ]

  // ... existing code ...

  return (
    <DataList
      // ... existing props ...
      selectedRows={selectedRows}
      onSelectedRowsChange={handleSelectionChange}
      batchActions={batchActions}
      // ... existing props ...
    />
  )
} 