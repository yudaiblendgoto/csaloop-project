"use client"

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface Base {
  id: string;
  name: string;
  area: string;
  station: string;
  address: string;
}

interface SeasonalProduct {
  season: string;
  products: string;
}

export default function CreateCommunityPage() {
  const router = useRouter();
  const [bases, setBases] = useState<Base[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [useCustomBase, setUseCustomBase] = useState(false);

  // ファイル選択用のref
  const promotionImageRef = useRef<HTMLInputElement>(null);
  const representativeImageRef = useRef<HTMLInputElement>(null);

  // 画像プレビュー
  const [promotionImagePreview, setPromotionImagePreview] = useState<string | null>(null);
  const [representativeImagePreview, setRepresentativeImagePreview] = useState<string | null>(null);

  // フォームの状態
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    representative_name: '',
    short_description: '',
    full_description: '',
    promotion_image_url: '',
    representative_image_url: '',
    google_map_url: '',
    base_id: '',
    delivery_frequency: '',
    delivery_time: '',
    interaction_frequency: '',
    interaction_details: '',
    // カスタム拠点用
    custom_base_name: '',
    custom_base_area: '',
    custom_base_station: '',
    custom_base_address: '',
    custom_base_description: '',
  });

  // 季節ごとの作物情報
  const [seasonalProducts, setSeasonalProducts] = useState<SeasonalProduct[]>([
    { season: '3-5月', products: '' },
    { season: '6-8月', products: '' },
    { season: '9-11月', products: '' },
    { season: '12-2月', products: '' }
  ]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // ユーザー認証状態の確認
        const authResponse = await fetch('/api/auth/me');
        const authData = await authResponse.json();
        
        if (!authData.user) {
          router.push('/login?returnUrl=/profile/communities/new');
          return;
        }

        // 拠点情報を取得
        const basesResponse = await fetch('/api/bases');
        if (!basesResponse.ok) {
          throw new Error('拠点情報の取得に失敗しました');
        }
        
        const basesData = await basesResponse.json();
        setBases(basesData.bases);
      } catch (err) {
        setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSeasonalProductChange = (index: number, value: string) => {
    const newProducts = [...seasonalProducts];
    newProducts[index] = { ...newProducts[index], products: value };
    setSeasonalProducts(newProducts);
  };

  // 画像アップロード処理
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'promotion' | 'representative') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    // ファイルサイズチェック (10MB以下)
    if (file.size > 10 * 1024 * 1024) {
      setError('画像サイズは10MB以下にしてください');
      return;
    }

    // ファイル形式チェック
    if (!['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.type)) {
      setError('画像はJPEG、PNG、またはWEBP形式のみ許可されています');
      return;
    }

    try {
      // 画像のプレビュー表示
      const reader = new FileReader();
      reader.onload = (e) => {
        if (type === 'promotion') {
          setPromotionImagePreview(e.target?.result as string);
        } else {
          setRepresentativeImagePreview(e.target?.result as string);
        }
      };
      reader.readAsDataURL(file);

      // 画像アップロード用のFormData作成
      const formData = new FormData();
      formData.append('file', file);
      
      // アップロードAPI呼び出し
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('画像のアップロードに失敗しました');
      }

      const uploadData = await uploadResponse.json();
      
      // アップロード成功したらURL更新
      if (type === 'promotion') {
        setFormData(prev => ({ ...prev, promotion_image_url: uploadData.url }));
      } else {
        setFormData(prev => ({ ...prev, representative_image_url: uploadData.url }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '画像アップロード中にエラーが発生しました');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      // 必須項目のバリデーション
      if (!formData.name || !formData.location) {
        throw new Error('農家名と所在地は必須項目です');
      }

      // 拠点情報の検証
      if (!useCustomBase && !formData.base_id) {
        throw new Error('拠点を選択するか、新規拠点情報を入力してください');
      }

      if (useCustomBase && (!formData.custom_base_name || !formData.custom_base_area || !formData.custom_base_station)) {
        throw new Error('新規拠点の名称、エリア、最寄り駅は必須です');
      }

      // 送信データの準備
      const submitData = { ...formData, seasonal_products: seasonalProducts };
      
      if (useCustomBase) {
        // カスタム拠点情報を含める
        submitData.custom_base = {
          name: formData.custom_base_name,
          area: formData.custom_base_area,
          station: formData.custom_base_station,
          address: formData.custom_base_address,
          description: formData.custom_base_description
        };
        // base_idは不要になるので削除
        delete submitData.base_id;
      }

      // APIを呼び出し
      const response = await fetch('/api/profile/communities/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'コミュニティの作成に失敗しました');
      }

      const data = await response.json();
      setSuccess('コミュニティを作成しました！');
      
      // 成功したら一覧ページに戻る（少し待ってから）
      setTimeout(() => {
        router.push('/profile');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <p className="text-lg">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center min-h-screen bg-white py-12">
      <div className="w-full max-w-4xl px-4">
        <div className="mb-8">
          <Link 
            href="/profile" 
            className="text-blue-600 hover:text-blue-800"
          >
            ← マイページに戻る
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-8 text-gray-800">新規コミュニティを作成</h1>
        
        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 text-green-600 p-4 rounded-lg mb-6">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 基本情報 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">基本情報</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-gray-700 mb-2">農家名 <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="text-gray-600 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="location" className="block text-gray-700 mb-2">所在地 <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  placeholder="例: 東京都 / 東久留米市"
                  className="text-gray-600 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="representative_name" className="block text-gray-700 mb-2">代表者名</label>
                <input
                  type="text"
                  id="representative_name"
                  name="representative_name"
                  className="text-gray-600 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.representative_name}
                  onChange={handleChange}
                />
              </div>
              
              <div className="md:col-span-2 mt-2">
                <div className="flex items-center mb-4">
                  <button
                    type="button"
                    onClick={() => setUseCustomBase(!useCustomBase)}
                    className="text-blue-600 hover:text-blue-800 text-sm underline"
                  >
                    {useCustomBase ? '既存の拠点から選択する' : '新しい拠点を追加する'}
                  </button>
                </div>

                {!useCustomBase ? (
                  <div>
                    <label htmlFor="base_id" className="block text-gray-700 mb-2">拠点 <span className="text-red-500">*</span></label>
                    <select
                      id="base_id"
                      name="base_id"
                      className="text-gray-600 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={formData.base_id}
                      onChange={handleChange}
                      required={!useCustomBase}
                    >
                      <option value="">拠点を選択してください</option>
                      {bases.map(base => (
                        <option key={base.id} value={base.id}>
                          {base.name} ({base.area} / {base.station})
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="space-y-4 border p-4 rounded-lg bg-gray-50">
                    <h3 className="font-medium text-gray-800">新規拠点情報</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="custom_base_name" className="block text-gray-700 mb-2">拠点名称 <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          id="custom_base_name"
                          name="custom_base_name"
                          placeholder="例: GREEN COFFEE ROASTERS"
                          className="text-gray-600 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          value={formData.custom_base_name}
                          onChange={handleChange}
                          required={useCustomBase}
                        />
                      </div>
                      <div>
                        <label htmlFor="custom_base_area" className="block text-gray-700 mb-2">エリア <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          id="custom_base_area"
                          name="custom_base_area"
                          placeholder="例: 世田谷区エリア"
                          className="text-gray-600 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          value={formData.custom_base_area}
                          onChange={handleChange}
                          required={useCustomBase}
                        />
                      </div>
                      <div>
                        <label htmlFor="custom_base_station" className="block text-gray-700 mb-2">最寄り駅 <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          id="custom_base_station"
                          name="custom_base_station"
                          placeholder="例: 三軒茶屋駅"
                          className="text-gray-600 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          value={formData.custom_base_station}
                          onChange={handleChange}
                          required={useCustomBase}
                        />
                      </div>
                      <div>
                        <label htmlFor="custom_base_address" className="block text-gray-700 mb-2">住所</label>
                        <input
                          type="text"
                          id="custom_base_address"
                          name="custom_base_address"
                          placeholder="例: 東京都世田谷区三軒茶屋1-1-1"
                          className="text-gray-600 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          value={formData.custom_base_address}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label htmlFor="custom_base_description" className="block text-gray-700 mb-2">拠点の説明</label>
                        <textarea
                          id="custom_base_description"
                          name="custom_base_description"
                          rows={4}
                          placeholder="拠点についての説明（改行も反映されます）"
                          className="text-gray-600 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          value={formData.custom_base_description}
                          onChange={handleChange}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* 説明文 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">説明文</h2>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="short_description" className="block text-gray-700 mb-2">キャッチコピー</label>
                <input
                  type="text"
                  id="short_description"
                  name="short_description"
                  className="text-gray-600 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.short_description}
                  onChange={handleChange}
                />
                <p className="text-sm text-gray-500 mt-1">簡潔な一文で農園を表現してください</p>
              </div>
              
              <div>
                <label htmlFor="full_description" className="block text-gray-700 mb-2">詳細説明</label>
                <textarea
                  id="full_description"
                  name="full_description"
                  rows={6}
                  className=" text-gray-600 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.full_description}
                  onChange={handleChange}
                ></textarea>
                <p className="text-sm text-gray-500 mt-1">農園の詳細な説明を記載してください。改行も反映されます。</p>
              </div>
            </div>
          </div>
          
          {/* 画像情報 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">画像情報</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 mb-2">メイン画像</label>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {promotionImagePreview ? (
                      <div className="relative w-40 h-40 border rounded-lg overflow-hidden">
                        <Image
                          src={promotionImagePreview}
                          alt="プレビュー"
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-40 h-40 bg-gray-100 border rounded-lg flex items-center justify-center text-gray-400">
                        プレビュー
                      </div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <input
                      type="file"
                      id="promotion_image"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      ref={promotionImageRef}
                      onChange={(e) => handleImageChange(e, 'promotion')}
                    />
                    <button
                      type="button"
                      onClick={() => promotionImageRef.current?.click()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      画像を選択する
                    </button>
                    <p className="text-sm text-gray-500 mt-2">
                      ヘッダーとして表示される画像です。JPEG、PNG、WEBP形式（10MB以下）
                    </p>
                    <div className="mt-3">
                      <label htmlFor="promotion_image_url" className="block text-gray-700 mb-1 text-sm">または画像URLを入力</label>
                      <input
                        type="text"
                        id="promotion_image_url"
                        name="promotion_image_url"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        value={formData.promotion_image_url}
                        onChange={handleChange}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">代表者画像</label>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {representativeImagePreview ? (
                      <div className="relative w-40 h-40 border rounded-lg overflow-hidden">
                        <Image
                          src={representativeImagePreview}
                          alt="プレビュー"
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-40 h-40 bg-gray-100 border rounded-lg flex items-center justify-center text-gray-400">
                        プレビュー
                      </div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <input
                      type="file"
                      id="representative_image"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      ref={representativeImageRef}
                      onChange={(e) => handleImageChange(e, 'representative')}
                    />
                    <button
                      type="button"
                      onClick={() => representativeImageRef.current?.click()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      画像を選択する
                    </button>
                    <p className="text-sm text-gray-500 mt-2">
                      代表者の画像です。JPEG、PNG、WEBP形式（10MB以下）
                    </p>
                    <div className="mt-3">
                      <label htmlFor="representative_image_url" className="block text-gray-700 mb-1 text-sm">または画像URLを入力</label>
                      <input
                        type="text"
                        id="representative_image_url"
                        name="representative_image_url"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        value={formData.representative_image_url}
                        onChange={handleChange}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <label htmlFor="google_map_url" className="block text-gray-700 mb-2">Google Map URL</label>
                <input
                  type="text"
                  id="google_map_url"
                  name="google_map_url"
                  className="text-gray-600 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.google_map_url}
                  onChange={handleChange}
                  placeholder="https://maps.google.com/?q=東京都世田谷区三軒茶屋"
                />
              </div>
            </div>
          </div>
          
          {/* 受け渡し情報 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">受け渡し情報</h2>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="delivery_frequency" className="block text-gray-700 mb-2">頻度</label>
                <input
                  type="text"
                  id="delivery_frequency"
                  name="delivery_frequency"
                  placeholder="例: １ヶ月に１回（年間12回）"
                  className="text-gray-600 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.delivery_frequency}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label htmlFor="delivery_time" className="block text-gray-700 mb-2">時間</label>
                <input
                  type="text"
                  id="delivery_time"
                  name="delivery_time"
                  placeholder="例: 第4水曜日12:00〜15:00（目安）を予定"
                  className="text-gray-600 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.delivery_time}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          
          {/* 畑での交流 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">畑での交流</h2>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="interaction_frequency" className="block text-gray-700 mb-2">頻度</label>
                <input
                  type="text"
                  id="interaction_frequency"
                  name="interaction_frequency"
                  placeholder="例: 不定期（年間2回程度）"
                  className="text-gray-600 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.interaction_frequency}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label htmlFor="interaction_details" className="block text-gray-700 mb-2">主な作業</label>
                <textarea
                  id="interaction_details"
                  name="interaction_details"
                  placeholder="例: 援農（作業を通して農業についての理解を深める）、農業体験（収穫などを体験する機会）"
                  rows={3}
                  className="text-gray-600 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.interaction_details}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>
          </div>
          
          {/* 季節の野菜 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">季節の野菜</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {seasonalProducts.map((product, index) => (
                <div key={index}>
                  <label htmlFor={`season-${index}`} className="block text-gray-700 mb-2">{product.season}</label>
                  <textarea
                    id={`season-${index}`}
                    rows={4}
                    className="text-gray-600 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={product.products}
                    onChange={(e) => handleSeasonalProductChange(index, e.target.value)}
                    placeholder="例: じゃがいも、にんじん、大根（改行で区切ってください）"
                  ></textarea>
                </div>
              ))}
            </div>
          </div>
          
          {/* 送信ボタン */}
          <div className="flex justify-center mt-8">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={submitting}
            >
              {submitting ? '送信中...' : 'コミュニティを作成する'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}