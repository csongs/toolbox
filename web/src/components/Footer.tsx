import { ShieldCheck } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t py-3 px-4 text-center text-xs text-muted-foreground">
      <div className="flex items-center justify-center gap-1">
        <ShieldCheck className="h-3 w-3" />
        <span>所有運算僅在瀏覽器中完成，資料不會傳送到任何伺服器</span>
      </div>
    </footer>
  )
}
