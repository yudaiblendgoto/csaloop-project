// lib/seed.ts
import { sql } from '@vercel/postgres';

async function seedBases() {
    try {
      await sql`
        INSERT INTO bases (id, name, area, station, address, description, base_image_url, google_map_url) 
        VALUES 
        (
          1, 
          'Nui. HOSTEL & BAR LOUNGE', 
          '台東区エリア', 
          '蔵前駅', 
          '東京都台東区蔵前2丁目14-13',
          'Nui.は2012年に老舗おもちゃ会社の倉庫を改装し、コーヒーやお酒、食事を目的に人が訪れるラウンジと、世界中から旅行者を迎えるホステルとして生まれました。\n\n「あらゆる境界線を越えて、人々が集える場所を。」という理念のもと、国籍や宗教、年齢や職業関係なく、さまざまな人が自由な空気感のもと集う景色を創造しています。\n\nCSA LOOPは農作物の生産者と消費者を直接つなげ、新たなコミュニティを生む可能性があると感じています。',
          'https://gnxhvbmaxwh7z9dw.public.blob.vercel-storage.com/bases/1/base-JqdwWTOVPhkIi6FNjor6A0eUQwxi1P.png',
          'https://maps.google.com/?q=東京都台東区蔵前2丁目14-13'
        ),
        (
          2, 
          'GREEN COFFEE ROASTERS', 
          '世田谷区エリア', 
          '三軒茶屋駅', 
          '東京都世田谷区三軒茶屋1-1-1',
          '2015年にオープンした自家焙煎のコーヒーショップです。\n\nコーヒーを通じて、生産者と消費者をつなぎ、持続可能な関係性を築くことを目指しています。\n\n店内では焙煎の香りと共に、地域の人々が集う憩いの場を提供しています。',
          'https://gnxhvbmaxwh7z9dw.public.blob.vercel-storage.com/bases/2/base-BFTgxArSlko3Zcp5EmAAURo6UPKAwf.png',
          'https://maps.google.com/?q=東京都世田谷区三軒茶屋1-1-1'
        ),
        (
          3, 
          'FARM TO TABLE CAFE', 
          '練馬区エリア', 
          '練馬駅', 
          '東京都練馬区練馬3-3-3',
          '地産地消をコンセプトにした、農家直営のカフェレストランです。\n\n練馬の豊かな農業の魅力を多くの人に知ってもらいたいという想いから始まりました。\n\n季節の野菜を使ったメニューと、くつろぎの空間で、都会の中の農的生活を体験できます。',
          'https://gnxhvbmaxwh7z9dw.public.blob.vercel-storage.com/bases/3/base-vYRuXK3MuulaAr0NTacg8lPZDDtaUL.png',
          'https://maps.google.com/?q=東京都練馬区練馬3-3-3'
        ),
        (
          4, 
          'SUNRISE MARKET & CAFE', 
          '江東区エリア', 
          '木場駅', 
          '東京都江東区木場2-2-2',
          '朝市からスタートした、コミュニティマーケット＆カフェです。\n\n地域の農家さんやクリエイターが集まり、食と文化の交流の場として親しまれています。\n\n定期的に開催されるワークショップやマルシェを通じて、持続可能な地域づくりを目指しています。',
          'https://gnxhvbmaxwh7z9dw.public.blob.vercel-storage.com/bases/4/base-w1bGOwg6mMkRGi8zcpTdRTuaElwiPd.png',
          'https://maps.google.com/?q=東京都江東区木場2-2-2'
        )
      `;
      console.log('Bases seeded successfully');
    } catch (error) {
      console.error('Error seeding bases:', error);
      throw error;
    }
   }
   async function seedFarmers() {
    try {
      await sql`
        INSERT INTO farmers (id, name, location, representative_name, short_description, full_description, representative_image_url, promotion_image_url, google_map_url)
        VALUES 
        (
          1, 
          'まぁずファーム', 
          '千葉県 / 香取市', 
          '山田太郎', 
          'ちば香取のニコニコ野菜とこだわりのお米をお届けします',
          '農業をもっと魅力的な仕事に変えて、次世代に繋いでいきたい。\n\nそんな思いから、市役所を早期退職した夫とふたり『まぁずファーム』を始めました。\n\n基本は有機無農薬。やむを得ず農薬を使用する場合もありますが、予防的に薬剤を使用することはありません。\n\n安全安心なニコニコ野菜を食卓にお届けするため、笑顔溢れる家族経営で農業に取り組んでいます。',
          'https://gnxhvbmaxwh7z9dw.public.blob.vercel-storage.com/farmers/1/representative-7nUxaGFuXfiLSJHIsbRJYnpK3AxO1o.png',
          'https://gnxhvbmaxwh7z9dw.public.blob.vercel-storage.com/farmers/1/promotion-GEguCUkgTGUQFVHEM18Bga54cPtMv4.png',
          'https://maps.google.com/?q=千葉県香取市'
        ),
        (
          2, 
          '太陽の恵み農園', 
          '神奈川県 / 小田原市', 
          '鈴木一郎',
          '安心安全な野菜づくりにこだわる、湘南の自然派農園',
          '20年以上、有機農業に取り組んできました。\n\n土づくりからこだわり、微生物の力を活かした栽培方法で、味わい深い野菜を育てています。\n\n季節の移ろいを感じられる、多品目の野菜作りを心がけています。',
          'https://gnxhvbmaxwh7z9dw.public.blob.vercel-storage.com/farmers/2/representative-5DGqHnTrHYY43yHEBWZO04a5ZB6ddV.png',
          'https://gnxhvbmaxwh7z9dw.public.blob.vercel-storage.com/farmers/2/promotion-TIppPcLtYUlWawQAhZPdpFy0OMmCql.png',
          'https://maps.google.com/?q=神奈川県小田原市'
        ),
        (
          3, 
          'グリーンハーベスト', 
          '埼玉県 / 川越市', 
          '佐藤めぐみ',
          '都市近郊で育てる、新鮮な季節の野菜',
          '女性農業者として、持続可能な農業の実現に取り組んでいます。\n\n化学肥料に頼らない栽培方法と、地域の環境に適した品種選びにこだわっています。\n\n収穫したその日のうちに届けられる新鮮さが自慢です。',
          'https://gnxhvbmaxwh7z9dw.public.blob.vercel-storage.com/farmers/3/representative-jmQpaJ81U15pUsNF5OFq1zhYgs37Y8.png',
          'https://gnxhvbmaxwh7z9dw.public.blob.vercel-storage.com/farmers/3/promotion-QD18CRV2RvrIFD3S21lo0FBtlDPR3v.png',
          'https://maps.google.com/?q=埼玉県川越市'
        ),
        (
          4, 
          '里山ファーム', 
          '茨城県 / つくば市', 
          '田中誠',
          '伝統的な農法と現代技術の融合で作る体に優しい野菜',
          '代々受け継がれてきた農地で、先人の知恵と現代の技術を組み合わせた農業を実践しています。\n\n自然との共生を大切にし、生態系に配慮した栽培方法を採用。\n\n地域の農業の発展に貢献しながら、安全で美味しい野菜作りに励んでいます。',
          'https://gnxhvbmaxwh7z9dw.public.blob.vercel-storage.com/farmers/4/representative-sHfu0d9eoO1LON4Qg9LoWZX3ZhYxOc.png',
          'https://gnxhvbmaxwh7z9dw.public.blob.vercel-storage.com/farmers/4/promotion-pJGGCla5fl4GgSjcT6pRDNElg8EFe7.png',
          'https://maps.google.com/?q=茨城県つくば市'
        )
      `;
      console.log('Farmers seeded successfully');
    } catch (error) {
      console.error('Error seeding farmers:', error);
      throw error;
    }
  }
  async function seedFarmerBases() {
    try {
      await sql`
        INSERT INTO farmer_bases (farmer_id, base_id, delivery_frequency, delivery_time, interaction_frequency, interaction_details)
        VALUES 
        (
          1, 
          1, 
          '１ヶ月に１回（年間10回）', 
          '最終週の日曜日10:00〜12:00（目安）を予定。1.2月はお休み予定',
          '不定期（年間2回程度）',
          '農業体験（収穫などを体験する機会）、オープンファーム（交流イベントとして会員の方々と畑の野菜を使った食事などを通して親睦を深める）'
        ),
        (
          2, 
          2, 
          '１ヶ月に１回（年間12回）', 
          '第3土曜日13:00〜15:00（目安）',
          '年間2-3回程度',
          '収穫体験、料理教室、農場見学会'
        ),
        (
          3, 
          3, 
          '１ヶ月に１回（年間11回）', 
          '第2日曜日11:00〜14:00（目安）',
          '年間2回程度',
          '農業体験、収穫祭、地域交流イベント'
        ),
        (
          4, 
          4, 
          '１ヶ月に１回（年間12回）', 
          '第4土曜日10:00〜12:00（目安）',
          '年間3回程度',
          '農業体験、季節の収穫体験、料理教室'
        )
      `;
      console.log('Farmer bases seeded successfully');
    } catch (error) {
      console.error('Error seeding farmer_bases:', error);
      throw error;
    }
  }
  
  async function seedSeasonalProducts() {
    try {
      await sql`
        INSERT INTO seasonal_products (farmer_id, season, products)
        VALUES 
        (
          1, 
          '3-5月', 
          '大根\nキャベツ\nサラダ野菜類\n小かぶ\nスティックブロッコリー\nパクチー'
        ),
        (
          1, 
          '6-8月', 
          'じゃがいも\n玉ねぎ\nにんじん\n茄子\nピーマン\nかぼちゃ\nトウガラシ\nにんにく\nパクチー'
        ),
        (
          1, 
          '9-11月', 
          '茄子\n枝豆\n大根\n冬瓜\n茹で落花生\nさつまいも\n豆類\nサラダ野菜類\nパクチー'
        ),
        (
          1, 
          '12-2月', 
          '白菜\n里芋\nハヤトウリ\nかぼちゃ\n芽キャベツ\nスティックブロッコリー'
        ),
        (
          2, 
          '3-5月', 
          '春キャベツ\n新玉ねぎ\nアスパラガス\nそら豆\n春菊'
        ),
        (
          2, 
          '6-8月', 
          'トマト\nきゅうり\nなす\nオクラ\nズッキーニ'
        ),
        (
          2, 
          '9-11月', 
          'さつまいも\nかぼちゃ\n秋ナス\n里芋\n白菜'
        ),
        (
          2, 
          '12-2月', 
          '大根\nほうれん草\nブロッコリー\nカリフラワー\n青菜'
        ),
        (
          3, 
          '3-5月', 
          '春野菜ミックス\nふき\nたけのこ\n山菜\nレタス'
        ),
        (
          3, 
          '6-8月', 
          '夏野菜セット\nとうもろこし\nスイカ\nメロン\nマンゴー'
        ),
        (
          3, 
          '9-11月', 
          '秋野菜セット\nきのこ類\n柿\n栗\nぶどう'
        ),
        (
          3, 
          '12-2月', 
          '冬野菜セット\nかぶ\n白菜\n大根\nねぎ'
        ),
        (
          4, 
          '3-5月', 
          '新じゃが\n新玉ねぎ\nグリーンピース\nアスパラ\n春キャベツ'
        ),
        (
          4, 
          '6-8月', 
          '夏野菜ミックス\nトマト\nピーマン\nなす\nきゅうり'
        ),
        (
          4, 
          '9-11月', 
          '根菜セット\nさつまいも\nかぼちゃ\nごぼう\nにんじん'
        ),
        (
          4, 
          '12-2月', 
          '冬野菜セット\n白菜\n大根\nほうれん草\nねぎ'
        )
      `;
      console.log('Seasonal products seeded successfully');
    } catch (error) {
      console.error('Error seeding seasonal_products:', error);
      throw error;
    }
  }
  export async function seedDatabase() {
    try {
      await seedBases();
      await seedFarmers();
      await seedFarmerBases();
      await seedSeasonalProducts();
      console.log('Database seeded successfully');
      return { success: true, message: 'Database seeded successfully' };
    } catch (error) {
      console.error('Error seeding database:', error);
      return { success: false, error: error.message };
    }
  }