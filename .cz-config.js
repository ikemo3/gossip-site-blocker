// noinspection NonAsciiCharacters
module.exports = {
    types: [
        {
            value: 'feat', name: 'feat:        新機能'
        },
        {
            value: 'fix', name: 'fix:         バグ修正'
        },
        {
            value: 'improvement', name: 'improvement: 機能改善'
        },
        {
            value: 'docs', name: 'docs:        ドキュメントのみの変更'
        },
        {
            value: 'style', name: 'style:       コードに影響しないスタイルの変更(スペース、フォーマット、セミコロンの追加など)',
        },
        {
            value: 'refactor', name: 'refactor:    リファクタリング(機能追加やバグ修正を含まない)',
        },
        {
            value: 'perf', name: 'perf:        パフォーマンス改善のための変更',
        },
        {
            value: 'release', name: 'release:     リリースに関する変更'
        },
        {
            value: 'test', name: 'test:        不足しているテストの追加や既存のテスト修正'
        },
        {
            value: 'build', name: 'build:       ビルドシステムや外部に依存する変更(npmなど)'
        },
        {
            value: 'ci', name: 'ci:          CIの設定ファイルやスクリプトの変更'
        },
        {
            value: 'revert', name: 'revert:      コミットの取り消し'
        },
    ],

    scopes: [{name: 'blocking'}, {name: 'option'}, {name: 'packaging'}, {name: 'changelog'}],

    allowTicketNumber: false,
    isTicketNumberRequired: false,
    ticketNumberPrefix: 'TICKET-',
    ticketNumberRegExp: '\\d{1,5}',

    // it needs to match the value for field type. Eg.: 'fix'
    /*
    scopeOverrides: {
      fix: [

        {name: 'merge'},
        {name: 'style'},
        {name: 'e2eTest'},
        {name: 'unitTest'}
      ]
    },
    */
    // override the messages, defaults are as follows
    messages: {
        type: "コミットする変更のタイプを選択:",
        scope: '\n変更内容のスコープ(オプション):',
        // used if allowCustomScopes is true
        customScope: '変更内容のスコープ:',
        subject: '変更内容についての短く本質的な説明:\n',
        body: '変更の詳細な説明(オプション)。"|"を使うと改行されます。:\n',
        breaking: '破壊的な変更のリスト(オプション):\n',
        footer: 'この変更によってクローズされるIssue(オプション)。例: #31, #34:\n',
        confirmCommit: '上記のコミットを続行していいでしょうか?',
    },

    allowCustomScopes: true,
    allowBreakingChanges: ['feat', 'fix', 'improvement'],
    // skip any questions you want
    skipQuestions: ['body'],

    // limit subject length
    subjectLimit: 100,
    // breaklineChar: '|', // It is supported for fields body and footer.
    footerPrefix: 'closes'
    // askForBreakingChangeFirst : true, // default is false
};
