---
name: Release template
about: Template for release.
title: ''
labels: ''
assignees: ikemo3

---

## ToDo

* [ ] 開発完了
* [ ] 新機能の動作確認
* [ ] Seleniumで確認(`pnpm integration-test`)
    * [ ] スクリーンショットを一通り確認
* [ ] Chromeで確認
    * [ ] 戻るボタンを押したときにブロックされること
* [ ] Firefoxで確認
    * [ ] 戻るボタンを押したときにブロックされること
* [ ] エラーが出てないことの確認
* [ ] リリース準備
    * [ ] CHANGELOG.mdの更新
    * [ ] manifest.jsonのバージョンを変更
    * [ ] package.jsonのバージョンを変更
    * [ ] manifest.jsonから `version_name` を削除
* [ ] タグの作成
* [ ] リリースバージョンをダウンロード
    * [ ] 簡単な動作確認
* [ ] Chrome Web Storeにリリース
* [ ] Firefox Add-onsにリリース
* [ ] ブログを更新
    * [ ] 記事を追加
    * [ ] 更新履歴を追加(英語)
    * [ ] 更新履歴を追加(日本語)
* [ ] バージョンを変更
    * [ ] `apps/manifest.json`: version, version_nameを更新
    * [ ] `package.json`: versionを更新
* [ ] リリーステンプレートに反映させる
* [ ] 次の次のバージョンのマイルストーンを作成
* [ ] Gossip Site Blocker(snapshot)をアップロード
* [ ] マイルストーンをクローズ
