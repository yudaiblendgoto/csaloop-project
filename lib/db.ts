import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';

// データベース接続テスト
export async function testConnection() {
  try {
    const result = await sql`SELECT NOW();`;
    console.log('Database connected:', result);
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

// 全テーブルの作成
export async function createAllTables() {
  try {
    // 拠点（Base）テーブル
    await sql`
      CREATE TABLE IF NOT EXISTS bases (
        id SERIAL PRIMARY KEY,                  -- 拠点のID（自動採番）
        name VARCHAR(255) NOT NULL,             -- 拠点の名称（必須）例：ONIBUS COFFEE Jiyugaoka
        area VARCHAR(255),                      -- エリア名 例：目黒区エリア
        station VARCHAR(255),                   -- 最寄り駅 例：自由が丘駅
        address TEXT,                           -- 住所 例：東京都目黒区緑が丘2-24-8
        description TEXT,                       -- 拠点の説明文（改行含む）
        base_image_url TEXT,                    -- 拠点の画像URL
        google_map_url TEXT,                    -- GoogleマップのURL
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,  -- 作成日時
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP   -- 更新日時
      );
    `;

    // 農家（Farmer）テーブル
    await sql`
      CREATE TABLE IF NOT EXISTS farmers (
        id SERIAL PRIMARY KEY,                  -- 農家のID（自動採番）
        name VARCHAR(255) NOT NULL,             -- 農家の名称（必須）例：奈良山園
        location VARCHAR(255),                  -- 所在地 例：東京都 / 東久留米市
        representative_name VARCHAR(255),        -- 代表者名
        short_description TEXT,                 -- 短い説明文（キャッチコピー）
        full_description TEXT,                  -- 詳細な説明文（改行含む）
        representative_image_url TEXT,          -- 代表者の画像URL
        promotion_image_url TEXT,               -- 宣伝用の画像URL
        google_map_url TEXT,                    -- GoogleマップのURL
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,  -- 作成日時
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP   -- 更新日時
      );
    `;

    // 農家と拠点の関連（FarmerBase）テーブル
    await sql`
      CREATE TABLE IF NOT EXISTS farmer_bases (
        id SERIAL PRIMARY KEY,                  -- 関連ID（自動採番）
        farmer_id INTEGER REFERENCES farmers(id),-- 農家のID（外部キー）
        base_id INTEGER REFERENCES bases(id),   -- 拠点のID（外部キー）
        delivery_frequency TEXT,                -- 受け渡し頻度 例：1ヶ月に1回
        delivery_time TEXT,                     -- 受け渡し時間 例：第4水曜日12:00〜15:00
        interaction_frequency TEXT,             -- 交流頻度 例：年間2回程度
        interaction_details TEXT,               -- 交流内容の説明
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,  -- 作成日時
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,  -- 更新日時
        UNIQUE(farmer_id, base_id)             -- 同じ農家と拠点の組み合わせを防ぐ
      );
    `;

    // 季節ごとの作物（SeasonalProduct）テーブル
    await sql`
      CREATE TABLE IF NOT EXISTS seasonal_products (
        id SERIAL PRIMARY KEY,                  -- 作物情報ID（自動採番）
        farmer_id INTEGER REFERENCES farmers(id),-- 農家のID（外部キー）
        season VARCHAR(50),                     -- 季節区分 例：3-5月、6-8月
        products TEXT,                          -- 作物リスト（改行で区切る）
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,  -- 作成日時
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP   -- 更新日時
      );
    `;

    console.log('All tables created successfully');
    return true;
  } catch (error) {
    console.error('Failed to create tables:', error);
    return false;
  }
}

// データ取得関数
export async function getAllFarmersWithBases() {
    try {
      const { rows } = await sql`
        SELECT 
          f.*,
          b.name as base_name,
          b.area as base_area,
          b.station as base_station
        FROM farmers f
        JOIN farmer_bases fb ON f.id = fb.farmer_id
        JOIN bases b ON fb.base_id = b.id
        ORDER BY f.id
      `;
      return rows;
    } catch (error) {
      console.error('Error fetching farmers with bases:', error);
      throw error;
    }
  }
export async function getFarmersWithPagination(area: string, page: number, pageSize: number) {
    try {
      const offset = (page - 1) * pageSize;
      
      // エリアが「すべて」の場合
      if (area === 'すべて') {
        const { rows } = await sql`
          SELECT 
            f.*,
            b.name as base_name,
            b.area as base_area,
            b.station as base_station
          FROM farmers f
          JOIN farmer_bases fb ON f.id = fb.farmer_id
          JOIN bases b ON fb.base_id = b.id
          ORDER BY f.id
          LIMIT ${pageSize} OFFSET ${offset}
        `;
        
        // 総数取得用のクエリ
        const { rows: countRows } = await sql`
          SELECT COUNT(*) FROM farmers f
          JOIN farmer_bases fb ON f.id = fb.farmer_id
          JOIN bases b ON fb.base_id = b.id
        `;
        
        return {
          farmers: rows,
          total: parseInt(countRows[0].count, 10)
        };
      }
      
      // 特定のエリアでフィルタリング
      const { rows } = await sql`
        SELECT 
          f.*,
          b.name as base_name,
          b.area as base_area,
          b.station as base_station
        FROM farmers f
        JOIN farmer_bases fb ON f.id = fb.farmer_id
        JOIN bases b ON fb.base_id = b.id
        WHERE b.area = ${area}
        ORDER BY f.id
        LIMIT ${pageSize} OFFSET ${offset}
      `;
      
      // フィルター適用後の総数取得
      const { rows: countRows } = await sql`
        SELECT COUNT(*) FROM farmers f
        JOIN farmer_bases fb ON f.id = fb.farmer_id
        JOIN bases b ON fb.base_id = b.id
        WHERE b.area = ${area}
      `;
      
      return {
        farmers: rows,
        total: parseInt(countRows[0].count, 10)
      };
    } catch (error) {
      console.error('Error fetching farmers with pagination:', error);
      throw error;
    }
  }
  
  // すべてのエリアを取得する関数
  export async function getAllAreas() {
    try {
      const { rows } = await sql`
        SELECT DISTINCT area FROM bases
      `;
      return ['すべて', ...rows.map(row => row.area)];
    } catch (error) {
      console.error('Error fetching areas:', error);
      throw error;
    }
  }

// ユーザーテーブルの作成
export async function createUsersTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('Users table created successfully');
    return true;
  } catch (error) {
    console.error('Failed to create users table:', error);
    throw error;
  }
}

// ユーザー登録
export async function registerUser(name: string, email: string, password: string) {
  try {
    // メールアドレスの重複チェック
    const { rows: existingUsers } = await sql`
      SELECT * FROM users WHERE email = ${email}
    `;
    
    if (existingUsers.length > 0) {
      throw new Error('このメールアドレスは既に登録されています');
    }
    
    // パスワードのハッシュ化
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // ユーザーの登録
    const { rows } = await sql`
      INSERT INTO users (name, email, password)
      VALUES (${name}, ${email}, ${hashedPassword})
      RETURNING id, name, email, created_at
    `;
    
    return rows[0];
  } catch (error) {
    console.error('Failed to register user:', error);
    throw error;
  }
}

// ユーザー認証（ログイン）
export async function loginUser(email: string, password: string) {
  try {
    // メールアドレスでユーザーを検索
    const { rows } = await sql`
      SELECT * FROM users WHERE email = ${email}
    `;
    
    if (rows.length === 0) {
      throw new Error('メールアドレスまたはパスワードが正しくありません');
    }
    
    const user = rows[0];
    
    // パスワードの検証
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      throw new Error('メールアドレスまたはパスワードが正しくありません');
    }
    
    // パスワードを除外したユーザー情報を返す
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    console.error('Failed to login:', error);
    throw error;
  }
}