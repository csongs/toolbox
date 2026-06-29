import { ALGORITHMS, type AlgorithmConfig } from './jasypt-core'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'

interface AlgorithmSelectProps {
  value: string
  onChange: (algo: AlgorithmConfig) => void
}

export default function AlgorithmSelect({ value, onChange }: AlgorithmSelectProps) {
  return (
    <div className="space-y-2">
      <Label>演算法</Label>
      <Select
        value={value}
        onValueChange={(id) => {
          const algo = ALGORITHMS.find(a => a.id === id)
          if (algo) onChange(algo)
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="選擇演算法" />
        </SelectTrigger>
        <SelectContent>
          {ALGORITHMS.map((algo) => (
            <SelectItem key={algo.id} value={algo.id}>
              {algo.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
