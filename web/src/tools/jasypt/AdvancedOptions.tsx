import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import type { AlgorithmConfig } from './jasypt-core'

interface AdvancedOptionsProps {
  algorithm: AlgorithmConfig | null
  keyAlgorithm: string
  onKeyAlgorithmChange: (value: string) => void
  iterations: number
  onIterationsChange: (value: number) => void
}

const KEY_ALGORITHMS = [
  { value: 'PBKDF2WithHmacSHA1', label: 'PBKDF2WithHmacSHA1' },
  { value: 'PBKDF2WithHmacSHA256', label: 'PBKDF2WithHmacSHA256' },
  { value: 'PBKDF2WithHmacSHA512', label: 'PBKDF2WithHmacSHA512' },
]

const IV_GENERATORS = [
  { value: 'RandomIvGenerator', label: 'RandomIvGenerator' },
]

export default function AdvancedOptions({
  algorithm,
  keyAlgorithm,
  onKeyAlgorithmChange,
  iterations,
  onIterationsChange,
}: AdvancedOptionsProps) {
  const [open, setOpen] = useState(false)

  if (!algorithm) return null

  return (
    <div className="space-y-2">
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-1 p-0 h-auto font-medium"
        onClick={() => setOpen(!open)}
      >
        {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        進階設定
      </Button>

      {open && (
        <div className="border rounded-md p-4 space-y-4 bg-muted/30">
          {algorithm.useIV && (
            <div className="space-y-2">
              <Label>IV 產生器</Label>
              <Select value="RandomIvGenerator" disabled>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {IV_GENERATORS.map((g) => (
                    <SelectItem key={g.value} value={g.value}>
                      {g.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {algorithm.usePBKDF2 && (
            <>
              <div className="space-y-2">
                <Label>金鑰衍生演算法</Label>
                <Select value={keyAlgorithm} onValueChange={onKeyAlgorithmChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {KEY_ALGORITHMS.map((k) => (
                      <SelectItem key={k.value} value={k.value}>
                        {k.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>金鑰迭代次數</Label>
                <Input
                  type="number"
                  min={100}
                  max={100000}
                  value={iterations}
                  onChange={(e) => onIterationsChange(parseInt(e.target.value) || 1000)}
                />
              </div>
            </>
          )}

          {!algorithm.usePBKDF2 && (
            <p className="text-sm text-muted-foreground">
              此演算法使用 MD5 金鑰衍生，不支援 PBKDF2 參數調整。
            </p>
          )}
        </div>
      )}
    </div>
  )
}
