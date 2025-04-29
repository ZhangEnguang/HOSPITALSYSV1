import React from "react";
import EthicProjectCard from "../../../components/ethic-project-card";
import { CardAction, CardField } from "../../../components/data-management/data-list-card";

interface CustomCardWrapperProps {
  item: any;
  actions: CardAction[];
  fields: CardField[];
  titleField: string;
  descriptionField?: string;
  statusField?: string;
  statusVariants?: Record<string, string>;
  progressField?: string;
  tasksField?: { completed: string; total: string };
  detailsUrl?: string;
  className?: string;
  selected?: boolean;
  onSelect?: (selected: boolean) => void;
  onClick?: () => void;
}

export default function CustomCardWrapper(props: CustomCardWrapperProps) {
  const {
    item,
    actions,
    fields,
    titleField,
    descriptionField,
    statusField,
    statusVariants,
    progressField,
    tasksField,
    detailsUrl,
    className,
    selected,
    onSelect,
    onClick,
  } = props;

  // 检查项目类型是否为动物伦理或人体伦理
  const isEthicProject = item.type === "动物伦理" || item.type === "人体伦理";
  
  if (!isEthicProject) {
    // 如果不是伦理项目，则返回null，让DataListCard继续处理
    return null;
  }

  // 将CardAction转换为EthicCardAction (接口是兼容的)
  const ethicActions = actions as any;
  
  // 将CardField转换为EthicCardField (接口是兼容的)
  const ethicFields = fields as any;

  return (
    <EthicProjectCard
      item={item}
      actions={ethicActions}
      fields={ethicFields}
      titleField={titleField}
      descriptionField={descriptionField}
      statusField={statusField}
      statusVariants={statusVariants as Record<string, string>}
      progressField={progressField}
      tasksField={tasksField}
      type={item.type === "动物伦理" ? "animal" : "human"}
      detailsUrl={detailsUrl}
      className={className}
      selected={selected}
      onSelect={onSelect}
      onClick={onClick}
    />
  );
} 