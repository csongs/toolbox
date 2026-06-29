import { Routes, Route, Navigate } from 'react-router-dom'
import { Lock } from 'lucide-react'
import Layout from './components/Layout'
import { type ToolDefinition } from './types/tools'
import { JasyptPage } from './tools/jasypt'

const tools: ToolDefinition[] = [
  {
    id: 'jasypt',
    name: 'Jasypt 加密/解密',
    path: '/tools/jasypt',
    icon: Lock,
    component: JasyptPage,
  },
]

export default function App() {
  return (
    <Routes>
      <Route element={<Layout tools={tools} />}>
        <Route index element={<Navigate to="/tools/jasypt" replace />} />
        <Route path="tools/jasypt" element={<JasyptPage />} />
        <Route path="*" element={<Navigate to="/tools/jasypt" replace />} />
      </Route>
    </Routes>
  )
}
