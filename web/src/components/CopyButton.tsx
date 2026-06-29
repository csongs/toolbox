import { Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

interface CopyButtonProps {
  value: string
}

export default function CopyButton({ value }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button variant="outline" size="sm" onClick={copy}>
      {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
      {copied ? '已複製' : '複製'}
    </Button>
  )
}
