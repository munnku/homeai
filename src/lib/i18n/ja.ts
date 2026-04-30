export const ja = {
  app: {
    name: 'HomeAI',
    tagline: '家の物を、もう迷わない。'
  },
  nav: {
    home: 'ホーム',
    search: '検索',
    add: '追加',
    notifications: '通知',
    settings: '設定'
  },
  node: {
    types: {
      room: '部屋',
      furniture: '家具',
      container: '収納',
      item: '物'
    },
    actions: {
      add: '物を追加',
      move: '移動する',
      dispose: '処分する',
      restore: '元に戻す',
      edit: '編集',
      delete: '削除'
    },
    fields: {
      name: '名前',
      type: '種類',
      description: 'メモ',
      location: '場所',
      expiry_date: '賞味期限',
      quantity: '数量',
      unit: '単位'
    },
    placeholder: {
      name: '例: はさみ、リモコン',
      description: 'メモを入力（任意）'
    }
  },
  registration: {
    title: '物を登録',
    camera: 'カメラで撮影',
    ai_suggest: 'AIが認識中…',
    confirm_name: 'この名前でよいですか？',
    select_location: '場所を選択',
    scan_qr: 'QRコードをスキャン',
    save: '保存する'
  },
  search: {
    placeholder: '「はさみどこ？」と聞くか、検索…',
    no_results: '見つかりませんでした',
    ai_chat: 'AIに聞く'
  },
  household: {
    create: '世帯を作成',
    invite: '家族を招待',
    join: '招待リンクから参加',
    name_placeholder: '例: 田中家'
  },
  onboarding: {
    step1_title: '世帯名を決めましょう',
    step2_title: '部屋を追加しましょう',
    step2_hint: 'あとで変更できます',
    step3_title: '最初の物を登録しましょう',
    skip: 'スキップ',
    next: '次へ',
    done: '始める'
  },
  qr: {
    generate: 'QRコードを生成',
    print_sheet: 'QRシートを印刷',
    scan: 'QRをスキャン'
  },
  notifications: {
    expiry_title: '賞味期限のお知らせ',
    enable_push: 'プッシュ通知を有効にする'
  },
  plan: {
    free: '無料プラン',
    paid: '有料プラン',
    upgrade: 'アップグレード',
    limit_reached: '1日の上限（10回）に達しました',
    paid_only: 'この機能は有料プランでご利用いただけます'
  },
  errors: {
    generic: 'エラーが発生しました',
    not_found: '見つかりませんでした',
    unauthorized: 'ログインが必要です',
    qr_not_found: 'QRコードが見つかりません'
  }
} as const

export type I18nKey = typeof ja
