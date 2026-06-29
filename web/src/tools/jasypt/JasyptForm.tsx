import { useState, useCallback } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Lock, Unlock, ArrowLeftRight, Loader2 } from 'lucide-react'
import AlgorithmSelect from './AlgorithmSelect'
import AdvancedOptions from './AdvancedOptions'
import CopyButton from '@/components/CopyButton'
import { encrypt, decrypt, ALGORITHMS, type AlgorithmConfig, type CryptoResult } from './jasypt-core'

export default function JasyptForm() {
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt')
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmConfig>(ALGORITHMS[0])
  const [password, setPassword] = useState('')
  const [text, setText] = useState('')
  const [result, setResult] = useState<CryptoResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [keyAlgorithm, setKeyAlgorithm] = useState(ALGORITHMS[0].defaultKeyAlgo)
  const [iterations, setIterations] = useState(ALGORITHMS[0].defaultIterations)
  const [saltSize, setSaltSize] = useState(ALGORITHMS[0].defaultSaltSizeBytes)

  const passwordError = submitted && !password

  const handleAlgorithmChange = useCallback((algo: AlgorithmConfig) => {
    setSelectedAlgorithm(algo)
    setKeyAlgorithm(algo.defaultKeyAlgo)
    setIterations(algo.defaultIterations)
    setSaltSize(algo.defaultSaltSizeBytes)
    setResult(null)
    setSubmitted(false)
  }, [])

  const handleExecute = useCallback(async () => {
    setSubmitted(true)

    if (!password || !text) {
      setResult({ success: false, error: '請輸入密鑰和文字' })
      return
    }

    setLoading(true)
    try {
      if (mode === 'encrypt') {
        const r = await encrypt({
          algorithm: selectedAlgorithm.id,
          password,
          text,
          keyAlgorithm,
          iterations,
          saltSize,
        })
        setResult(r)
      } else {
        const r = await decrypt({
          algorithm: selectedAlgorithm.id,
          password,
          encryptedText: text,
          keyAlgorithm,
          iterations,
          saltSize,
        })
        setResult(r)
      }
    } finally {
      setLoading(false)
    }
  }, [mode, selectedAlgorithm, password, text, keyAlgorithm, iterations, saltSize])

  const swapResultToInput = useCallback(() => {
    if (result?.success && result.result) {
      setText(result.result)
      setResult(null)
      setSubmitted(false)
      // If encrypting, switch to decrypt mode (and vice versa)
      setMode(mode === 'encrypt' ? 'decrypt' : 'encrypt')
    }
  }, [result, mode])

  const handleModeChange = useCallback((v: string) => {
    setMode(v as 'encrypt' | 'decrypt')
    setResult(null)
    setSubmitted(false)
  }, [])

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Lock className="h-6 w-6" />
          Jasypt 加密/解密
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          使用 Jasypt 相容演算法進行 PBEWITHHMACSHA512ANDAES_256 等加密與解密
        </p>
      </div>

      <Tabs value={mode} onValueChange={handleModeChange}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="encrypt">加密</TabsTrigger>
          <TabsTrigger value="decrypt">解密</TabsTrigger>
        </TabsList>

        <TabsContent value="encrypt" className="space-y-4 mt-4">
          <AlgorithmSelect value={selectedAlgorithm.id} onChange={handleAlgorithmChange} />

          <div className="space-y-2">
            <Label>密鑰 (Password)</Label>
            <Input
              type="password"
              placeholder="請輸入加密密鑰..."
              value={password}
              onChange={(e) => { setPassword(e.target.value); setSubmitted(false) }}
              className={passwordError ? 'border-red-500 focus-visible:ring-red-500' : ''}
            />
            {passwordError && (
              <p className="text-xs text-red-500">請輸入密鑰</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>明文 (Plain Text)</Label>
            <Textarea
              placeholder="請輸入要加密的文字..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
            />
            <p className="text-xs text-muted-foreground text-right">
              {text.length} 字元
            </p>
          </div>
        </TabsContent>

        <TabsContent value="decrypt" className="space-y-4 mt-4">
          <AlgorithmSelect value={selectedAlgorithm.id} onChange={handleAlgorithmChange} />

          <div className="space-y-2">
            <Label>密鑰 (Password)</Label>
            <Input
              type="password"
              placeholder="請輸入解密密鑰..."
              value={password}
              onChange={(e) => { setPassword(e.target.value); setSubmitted(false) }}
              className={passwordError ? 'border-red-500 focus-visible:ring-red-500' : ''}
            />
            {passwordError && (
              <p className="text-xs text-red-500">請輸入密鑰</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>密文 (Encrypted Text)</Label>
            <Textarea
              placeholder="請輸入 ENC(...) 密文..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
            />
            <p className="text-xs text-muted-foreground text-right">
              {text.length} 字元
            </p>
          </div>
        </TabsContent>
      </Tabs>

      <AdvancedOptions
        algorithm={selectedAlgorithm}
        keyAlgorithm={keyAlgorithm}
        onKeyAlgorithmChange={setKeyAlgorithm}
        iterations={iterations}
        onIterationsChange={setIterations}
        saltSize={saltSize}
        onSaltSizeChange={setSaltSize}
      />

      {selectedAlgorithm.approximate && (
        <Alert variant="default" className="border-amber-500 bg-amber-50 dark:bg-amber-950/20">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800 dark:text-amber-200">
            ⚠️ 此演算法為近似實作，無法與 Jasypt 跨平台互通。加密結果僅在此工具內部有效。
          </AlertDescription>
        </Alert>
      )}

      <Button
        className="w-full"
        size="lg"
        onClick={handleExecute}
        disabled={loading || !password || !text}
      >
        {loading ? (
          <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> 處理中...</>
        ) : mode === 'encrypt' ? (
          <><Lock className="h-4 w-4 mr-2" /> 加密</>
        ) : (
          <><Unlock className="h-4 w-4 mr-2" /> 解密</>
        )}
      </Button>

      {!result && !loading && (
        <Card className="border-dashed">
          <CardContent className="py-8 text-center text-muted-foreground">
            <p>輸入密鑰與文字後，點擊上方按鈕執行{mode === 'encrypt' ? '加密' : '解密'}</p>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardContent className="pt-6 space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">結果</Label>
              {result.success && (
                <div className="flex gap-2">
                  <CopyButton value={result.result!} />
                  <Button variant="outline" size="sm" onClick={swapResultToInput}>
                    <ArrowLeftRight className="h-4 w-4 mr-1" />
                    互換
                  </Button>
                </div>
              )}
            </div>

            {result.success ? (
              <div className="relative">
                <Textarea
                  readOnly
                  value={result.result!}
                  className="font-mono text-sm min-h-[80px]"
                />
              </div>
            ) : (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{result.error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      <p className="text-xs text-center text-muted-foreground">
        🔒 所有運算在瀏覽器中完成，密鑰與明文不會傳送到任何伺服器
      </p>
    </div>
  )
}
