import React, { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertTriangle, FileText } from "lucide-react";
import { useRouter } from "next/navigation";

interface CreateAnimalReviewDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  projectTitle: string;
  projectEthicsCommittee: string;
  onSubmit: () => void;
}

// 优化的审查类型选择组件
interface ReviewTypeSelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

const ReviewTypeSelect: React.FC<ReviewTypeSelectProps> = ({ value, onValueChange }) => {
  return (
    <Select
      value={value}
      onValueChange={onValueChange}
    >
      <SelectTrigger className="mt-2">
        <SelectValue placeholder="请选择审查类型" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="initial">初始审查</SelectItem>
        <SelectItem value="recheck">复审</SelectItem>
      </SelectContent>
    </Select>
  );
};

// 必填标记组件
const RequiredMark = () => (
  <span className="text-red-500 ml-1">*</span>
);

export function CreateAnimalReviewDialog({
  isOpen,
  onOpenChange,
  projectTitle,
  projectEthicsCommittee,
  onSubmit,
}: CreateAnimalReviewDialogProps) {
  const router = useRouter();
  const [reviewType, setReviewType] = useState("initial");
  const [reviewMethod, setReviewMethod] = useState("");
  const [reviewDescription, setReviewDescription] = useState("");
  const [reviewFile, setReviewFile] = useState<File | null>(null);
  const [ethicsCommittee, setEthicsCommittee] = useState(projectEthicsCommittee);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setReviewFile(e.target.files[0]);
    }
  };

  const handleClose = () => {
    setReviewMethod("");
    setReviewDescription("");
    setReviewFile(null);
    setEthicsCommittee(projectEthicsCommittee);
    onOpenChange(false);
  };
  
  const handleSubmit = () => {
    // 处理提交审查表单的逻辑
    console.log("提交动物伦理审查表单");
    
    // 首先清理本地状态
    setReviewMethod("");
    setReviewDescription("");
    setReviewFile(null);
    setEthicsCommittee(projectEthicsCommittee);
    
    // 立即关闭对话框但不调用onSubmit
    // 使用更直接的方式处理状态转换
    onOpenChange(false);
    
    // 准备项目信息参数
    const projectParams = `projectId=${encodeURIComponent(projectTitle)}`;
    
    // 如果有伦理委员会信息，添加到参数中
    const ethicsCommitteeParam = ethicsCommittee ? `&ethicsCommittee=${encodeURIComponent(ethicsCommittee)}` : '';
    
    // 使用较长的延迟确保对话框完全关闭后再导航
    // 这样可以避免闪烁问题
    setTimeout(() => {
      // 根据审查类型导航到不同页面
      if (reviewType === "recheck") {
        console.log("导航到动物伦理复审页面");
        router.push(`/ethic-projects/review/animal/recheck?${projectParams}${ethicsCommitteeParam}`);
      } else {
        // 默认为初始审查
        console.log("导航到动物伦理初始审查页面");
        router.push(`/ethic-projects/review/animal?${projectParams}${ethicsCommitteeParam}`);
      }
      
      // 然后执行onSubmit回调
      setTimeout(onSubmit, 100);
    }, 300);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>创建审查</DialogTitle>
          <DialogDescription>
            为项目 "{projectTitle}" 创建新的审查申请
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {/* 第一行：审查类型和审查方式 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="reviewType">
                审查类型（<span className="text-blue-600 font-medium">必填</span>）
              </Label>
              <ReviewTypeSelect value={reviewType} onValueChange={setReviewType} />
              <div className="mt-1.5 text-xs text-amber-600 flex items-center">
                <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                <span>动物伦理项目仅支持初始审查、复审</span>
              </div>
            </div>
            
            <div>
              <Label htmlFor="reviewMethod">审查方式（选填）</Label>
              <Select
                value={reviewMethod}
                onValueChange={setReviewMethod}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="请选择审查方式" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fast">快速审查</SelectItem>
                  <SelectItem value="meeting">会议审查</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* 伦理委员会 */}
          <div>
            <Label htmlFor="ethicsCommittee">伦理委员会（选填）</Label>
            <Select
              value={ethicsCommittee}
              onValueChange={(value) => setEthicsCommittee(value)}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="请选择伦理委员会" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="北京医学伦理委员会">北京医学伦理委员会</SelectItem>
                <SelectItem value="医学院伦理审查委员会">医学院伦理审查委员会</SelectItem>
                <SelectItem value="临床医学伦理委员会">临床医学伦理委员会</SelectItem>
                <SelectItem value="公共卫生伦理委员会">公共卫生伦理委员会</SelectItem>
                <SelectItem value="神经科学伦理委员会">神经科学伦理委员会</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* 第二行：审查说明 */}
          <div>
            <Label htmlFor="reviewDescription">审查说明（选填）</Label>
            <Textarea
              id="reviewDescription"
              value={reviewDescription}
              onChange={(e) => setReviewDescription(e.target.value)}
              placeholder="请输入审查说明..."
              className="mt-2"
              rows={4}
            />
          </div>
          
          {/* 第三行：说明附件 */}
          <div>
            <Label htmlFor="reviewFile">说明附件（选填）</Label>
            <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-4 transition-all hover:border-blue-400 bg-gray-50/50">
              <div className="flex flex-col items-center justify-center gap-2">
                <FileText className="h-8 w-8 text-blue-500" />
                <div className="text-sm text-center">
                  <p className="font-medium text-gray-700">点击或拖拽文件到此区域</p>
                  <p className="text-gray-500 text-xs mt-1">支持PDF、Word、Excel等格式文件</p>
                </div>
                <Input
                  id="reviewFile"
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => document.getElementById('reviewFile')?.click()}
                >
                  选择文件
                </Button>
              </div>
              {reviewFile && (
                <div className="mt-3 p-2 bg-blue-50 rounded-md flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium text-blue-700 truncate">{reviewFile.name}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="ml-auto h-6 w-6 p-0" 
                    onClick={() => setReviewFile(null)}
                  >
                    <AlertTriangle className="h-4 w-4 text-gray-500" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose} className="border-gray-300 hover:bg-gray-50">
            取消
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!reviewType}
            className={cn(
              "bg-blue-600 hover:bg-blue-700 text-white",
              !reviewType && "opacity-50 cursor-not-allowed"
            )}
          >
            开始创建
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 