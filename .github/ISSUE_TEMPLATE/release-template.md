---
name: Release template
about: Template for release.
title: ''
labels: ''
assignees: ikemo3

---

## ToDo

* [ ] 開発完了
* [ ] CHANGELOG.mdの更新
* [ ] Chromeで確認
    * [ ] 基本のブロック機能
    * [ ] トップニュース(カード型)のブロック機能
    * [ ] 動画のブロック機能
    * [ ] Tweet(カード型)のブロック機能
    * [ ] コンパクトモード時のアイコンの位置
        * [ ] 基本
        * [ ] トップニュース
        * [ ] 動画
        * [ ] Tweet(カード型)・・・崩れるが今回は修正見送り(#40)
* [ ] Firefoxで確認
    * [ ] 基本のブロック機能
    * [ ] トップニュース(カード型)のブロック機能
    * [ ] 動画のブロック機能
    * [ ] Tweet(カード型)のブロック機能
    * [ ] コンパクトモード時のアイコンの位置
        * [ ] 基本
        * [ ] トップニュース
        * [ ] 動画
        * [ ] Tweet(カード型)
* [ ] スクリーンショットがおかしくないことの確認
* [ ] リリース準備
    * [ ] manifest.jsonのバージョンを変更
    * [ ] package.jsonのバージョンを変更
    * [ ] manifest.jsonから `version_name` を削除
    * [ ] タグの作成
* [ ] Chrome Web Storeにリリース
* [ ] Firefox Add-onsにリリース
* [ ] ブログを更新
    * [ ] 記事を追加
    * [ ] 更新履歴を追加(英語)
    * [ ] 更新履歴を追加(日本語)
* [ ] リリーステンプレートに反映させる
* [ ] バージョンを変更
    * [ ] `apps/manifest.json`: version, version_nameを更新
    * [ ] `package.json`: versionを更新
