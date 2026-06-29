import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import { type ToolDefinition } from './types/tools'

const tools: ToolDefinition[] = []

export default function App() {
  return (
    <Routes>
      <Route element={<Layout tools={tools} />}>
        <Route path="/" element={<div className="p-8 text-center text-muted-foreground">選取左側工具開始使用</div>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
