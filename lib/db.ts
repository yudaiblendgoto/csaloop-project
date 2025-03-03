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

// 特定のIDの農家情報とそれに関連する情報を取得する関数
export async function getFarmerById(id: string) {
  try {
    // 農家の基本情報を取得
    const { rows: farmerRows } = await sql`
      SELECT 
        f.*,
        b.name as base_name,
        b.area as base_area,
        b.station as base_station,
        b.address as base_address,
        b.description as base_description,
        b.base_image_url,
        b.google_map_url as base_google_map_url,
        fb.delivery_frequency,
        fb.delivery_time,
        fb.interaction_frequency,
        fb.interaction_details
      FROM farmers f
      JOIN farmer_bases fb ON f.id = fb.farmer_id
      JOIN bases b ON fb.base_id = b.id
      WHERE f.id = ${id}
    `;
    
    if (farmerRows.length === 0) {
      return null;
    }
    
    // 季節ごとの作物情報を取得
    const { rows: seasonalProducts } = await sql`
      SELECT * FROM seasonal_products
      WHERE farmer_id = ${id}
      ORDER BY season
    `;
    
    // 農家情報と季節作物情報を結合
    const farmer = farmerRows[0];
    
    return {
      ...farmer,
      seasonal_products: seasonalProducts
    };
  } catch (error) {
    console.error('Error fetching farmer by id:', error);
    throw error;
  }
}
// まず、farmers テーブルとユーザーを紐づけるための中間テーブルを作成
// lib/db.ts に以下の関数を追加

/**
 * ユーザーと農家の紐づけテーブルを作成
 */
export async function createUsersFarmersTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS users_farmers (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        farmer_id INTEGER REFERENCES farmers(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, farmer_id)  -- 同じユーザーと農家の組み合わせを防ぐ
      );
    `;
    console.log('Users-Farmers table created successfully');
    return true;
  } catch (error) {
    console.error('Failed to create users-farmers table:', error);
    throw error;
  }
}

/**
 * 農家情報を作成する関数 (カスタム拠点対応版)
 */
export async function createFarmer(farmerData: any, userId: string) {
  // トランザクション開始
  await sql`BEGIN`;
  
  try {
    // 1. カスタム拠点の作成（必要な場合）
    let baseId = farmerData.base_id;
    
    if (farmerData.custom_base) {
      try {
        // 拠点テーブルのシーケンスをリセット
        await sql`SELECT setval('bases_id_seq', (SELECT COALESCE(MAX(id) + 1, 1) FROM bases), false)`;
        
        // カスタム拠点を作成
        const { rows: baseRows } = await sql`
          INSERT INTO bases (
            name, area, station, address, description, base_image_url, google_map_url
          )
          VALUES (
            ${farmerData.custom_base.name}, 
            ${farmerData.custom_base.area}, 
            ${farmerData.custom_base.station}, 
            ${farmerData.custom_base.address || null}, 
            ${farmerData.custom_base.description || null},
            ${farmerData.custom_base.base_image_url || null},
            ${farmerData.custom_base.google_map_url || null}
          )
          RETURNING id
        `;
        
        baseId = baseRows[0].id;
      } catch (error) {
        console.error('Failed to create custom base:', error);
        
        // 既存の拠点を使用
        if (!baseId) {
          const { rows: existingBases } = await sql`
            SELECT id FROM bases LIMIT 1
          `;
          
          if (existingBases.length === 0) {
            throw new Error('拠点が見つかりません。少なくとも1つの拠点が必要です。');
          }
          
          baseId = existingBases[0].id;
        }
      }
    }
    
    if (!baseId) {
      throw new Error('拠点IDが指定されていません');
    }
    
    // 農家テーブルのシーケンスもリセット
    await sql`SELECT setval('farmers_id_seq', (SELECT COALESCE(MAX(id) + 1, 1) FROM farmers), false)`;
    
    // 2. 農家情報を挿入
    const { rows: farmerRows } = await sql`
      INSERT INTO farmers (
        name, location, representative_name, short_description, 
        full_description, representative_image_url, promotion_image_url, google_map_url
      )
      VALUES (
        ${farmerData.name}, ${farmerData.location}, ${farmerData.representative_name || null}, 
        ${farmerData.short_description || null}, ${farmerData.full_description || null}, 
        ${farmerData.representative_image_url || null}, ${farmerData.promotion_image_url || null}, 
        ${farmerData.google_map_url || null}
      )
      RETURNING id
    `;
    
    // farmersテーブルからIDを正しく取得
    const farmerId = farmerRows[0].id;
    console.log('Created farmer with ID:', farmerId);
    
    // 3. 拠点関連を挿入
    await sql`
      INSERT INTO farmer_bases (
        farmer_id, base_id, delivery_frequency, delivery_time,
        interaction_frequency, interaction_details
      )
      VALUES (
        ${farmerId}, ${baseId}, ${farmerData.delivery_frequency || null},
        ${farmerData.delivery_time || null}, ${farmerData.interaction_frequency || null},
        ${farmerData.interaction_details || null}
      )
    `;
    
    // 4. 季節ごとの作物情報を追加
    if (farmerData.seasonal_products && farmerData.seasonal_products.length > 0) {
      for (const product of farmerData.seasonal_products) {
        // 空のproductsをスキップ
        if (!product.products || product.products.trim() === '') continue;
        
        await sql`
          INSERT INTO seasonal_products (farmer_id, season, products)
          VALUES (${farmerId}, ${product.season}, ${product.products})
        `;
      }
    }
    
    // 5. 作成者との関連付けを追加
    await sql`
      INSERT INTO users_farmers (user_id, farmer_id)
      VALUES (${userId}, ${farmerId})
    `;
    
    // トランザクションのコミット
    await sql`COMMIT`;
    
    return farmerId;
  } catch (error) {
    // エラーが発生した場合はロールバック
    await sql`ROLLBACK`;
    console.error('Error creating farmer:', error);
    throw error;
  }
}
/**
 * 農家情報を更新する関数 (カスタム拠点対応版)
 */
export async function updateFarmer(id: string, farmerData: any, userId: string) {
  try {
    // トランザクション開始
    await sql`BEGIN`;
    
    try {
      // 権限チェック
      const { rows: userFarmers } = await sql`
        SELECT * FROM users_farmers 
        WHERE user_id = ${userId} AND farmer_id = ${id}
      `;
      
      if (userFarmers.length === 0) {
        throw new Error('編集権限がありません');
      }
      
      // カスタム拠点の作成（必要な場合）
      let baseId = farmerData.base_id;
      
      if (farmerData.custom_base) {
        // カスタム拠点を作成
        const { rows: baseRows } = await sql`
          INSERT INTO bases (
            name, area, station, address, description, base_image_url, google_map_url
          )
          VALUES (
            ${farmerData.custom_base.name}, 
            ${farmerData.custom_base.area}, 
            ${farmerData.custom_base.station}, 
            ${farmerData.custom_base.address}, 
            ${farmerData.custom_base.description},
            ${farmerData.custom_base.base_image_url || null},
            ${farmerData.custom_base.google_map_url || null}
          )
          RETURNING id
        `;
        
        baseId = baseRows[0].id;
      }
      
      if (!baseId) {
        throw new Error('拠点IDが指定されていません');
      }
      
      // 1. 農家情報を更新
      await sql`
        UPDATE farmers SET
          name = ${farmerData.name},
          location = ${farmerData.location},
          representative_name = ${farmerData.representative_name},
          short_description = ${farmerData.short_description},
          full_description = ${farmerData.full_description},
          representative_image_url = ${farmerData.representative_image_url},
          promotion_image_url = ${farmerData.promotion_image_url},
          google_map_url = ${farmerData.google_map_url},
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
      `;
      
      // 2. 拠点関連を更新
      await sql`
        UPDATE farmer_bases SET
          base_id = ${baseId},
          delivery_frequency = ${farmerData.delivery_frequency},
          delivery_time = ${farmerData.delivery_time},
          interaction_frequency = ${farmerData.interaction_frequency},
          interaction_details = ${farmerData.interaction_details},
          updated_at = CURRENT_TIMESTAMP
        WHERE farmer_id = ${id}
      `;
      
      // 3. 既存の季節ごとの作物情報を削除
      await sql`DELETE FROM seasonal_products WHERE farmer_id = ${id}`;
      
      // 4. 新しい季節ごとの作物情報を追加
      if (farmerData.seasonal_products && farmerData.seasonal_products.length > 0) {
        for (const product of farmerData.seasonal_products) {
          // 空のproductsをスキップ
          if (!product.products || product.products.trim() === '') continue;
          
          await sql`
            INSERT INTO seasonal_products (farmer_id, season, products)
            VALUES (${id}, ${product.season}, ${product.products})
          `;
        }
      }
      
      // トランザクションのコミット
      await sql`COMMIT`;
      
      return id;
    } catch (error) {
      // エラーが発生した場合はロールバック
      await sql`ROLLBACK`;
      throw error;
    }
  } catch (error) {
    console.error('Error updating farmer:', error);
    throw error;
  }
}

/**
 * ユーザーが管理している農家情報を取得する関数
 */
export async function getFarmersByUser(userId: string) {
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
      JOIN users_farmers uf ON f.id = uf.farmer_id
      WHERE uf.user_id = ${userId}
      ORDER BY f.id
    `;
    
    return rows;
  } catch (error) {
    console.error('Error fetching farmers by user:', error);
    throw error;
  }
}

/**
 * 利用可能な拠点の一覧を取得する関数
 */
export async function getAllBases() {
  try {
    const { rows } = await sql`
      SELECT id, name, area, station, address 
      FROM bases
      ORDER BY name
    `;
    return rows;
  } catch (error) {
    console.error('Error fetching all bases:', error);
    throw error;
  }
}