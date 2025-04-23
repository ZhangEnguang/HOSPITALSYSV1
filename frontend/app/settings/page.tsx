import { SettingsContainer } from "@/app/components/settings-container"
import { ConfirmButton } from "./components/confirm-button"

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-6 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">设置</h1>
      <SettingsContainer title="基本设置">
        <div className="space-y-4">
          <ConfirmButton />
        </div>
      </SettingsContainer>
    </div>
  )
}

