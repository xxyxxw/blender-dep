
// Supabase Client Configuration
// ユーザーのダッシュボードから取得した値を設定してください
// Project Settings > API > Project URL / anon public key

const SUPABASE_URL = "https://fwtrvwelfjuxwfgjglvk.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3dHJ2d2VsZmp1eHdmZ2pnbHZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5ODIzNzMsImV4cCI6MjA4NjU1ODM3M30.Nax2jf3zaQX6iFViGwTPrYJ4bZTk3D3XwOcm-hAjU04";

// Supabaseクライアントの作成 (CDNのグローバル変数 'supabase' を使用)
// 注意: index.htmlでCDNを読み込んでいる必要があります
const _supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export { _supabase };
