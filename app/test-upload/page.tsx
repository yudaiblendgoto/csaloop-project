"use client"

import { useState } from 'react'

export default function TestUpload() {
  const [status, setStatus] = useState<string>('')

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('アップロード中...')

    const formData = new FormData(e.currentTarget)
    
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      
      if (response.ok) {
        setStatus(`アップロード成功! URL: ${data.url}`)
      } else {
        setStatus(`エラー: ${data.error}`)
      }
    } catch (error) {
      setStatus('アップロードに失敗しました')
      console.error(error)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">画像アップロードテスト</h1>
      
      <form onSubmit={handleUpload} className="space-y-4">
        <div>
          <label className="block mb-2">画像ファイル:</label>
          <input
            type="file"
            name="file"
            accept="image/*"
            required
            className="border p-2"
          />
        </div>

        <div>
          <label className="block mb-2">フォルダ:</label>
          <select name="folder" required className="border p-2">
            <option value="farmers">farmers</option>
            <option value="bases">bases</option>
          </select>
        </div>

        <div>
          <label className="block mb-2">ID:</label>
          <input
            type="number"
            name="id"
            min="1"
            max="4"
            required
            className="border p-2"
          />
        </div>

        <div>
          <label className="block mb-2">タイプ:</label>
          <select name="type" required className="border p-2">
            <option value="representative">representative（代表者）</option>
            <option value="promotion">promotion（宣伝用）</option>
            <option value="base">base（拠点）</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          アップロード
        </button>
      </form>

      {status && (
        <div className="mt-4 p-4 border rounded">
          <p>{status}</p>
        </div>
      )}
    </div>
  )
}