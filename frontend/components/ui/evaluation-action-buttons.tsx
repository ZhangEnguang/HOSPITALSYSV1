import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface EvaluationActionButtonsProps {
  onApprove: () => void;
  onReject: () => void;
  onSave: () => void;
  disabled?: boolean;
}

export function EvaluationActionButtons({
  onApprove,
  onReject,
  onSave,
  disabled = false
}: EvaluationActionButtonsProps) {
  const { toast } = useToast();

  return (
    <div className="flex gap-2">
      <Button
        variant="default"
        onClick={onApprove}
        disabled={disabled}
      >
        通过
      </Button>
      <Button
        variant="destructive"
        onClick={onReject}
        disabled={disabled}
      >
        拒绝
      </Button>
      <Button
        variant="outline"
        onClick={onSave}
        disabled={disabled}
      >
        保存
      </Button>
    </div>
  );
} 