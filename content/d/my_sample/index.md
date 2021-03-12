---
title: "my sample 01"
date: 2010-03-10T17:30:38+09:00
draft: false
isCJKLanguage: true
tags: ["hugo", "sample", "markdown"]
---
これは使いそうな表現のサンプルです。

通常文章

{{< midasi >}}
見出し
{{< /midasi >}}
本文です。本文。

{{< komidasi >}}
小見出し
{{< /komidasi >}}
小見出しです

{{< midasi >}}
アラート(BootStrap使用)
{{< /midasi >}}
{{< bt-alert >}}
アラートです

注意する**必要**がありますね
{{< /bt-alert >}}


{{< midasi >}}
bt-image 例
{{< /midasi >}}

{{< bt-image src="data/01.jpg" txt="caption" >}}
{{< bt-image src="data/02.jpg" txt="fish 02" >}}
{{< bt-image src="data/03.jpg" txt="aaabbbbccc" >}}

captionなし
{{< bt-image src="data/01.jpg" >}}
{{< bt-image src="data/02.jpg" >}}
{{< bt-image src="data/03.jpg" >}}


{{< midasi >}}
改行例
{{< /midasi >}}
改行は文末に空白２つです。
これは改行できていないはず。

これは改行できているはず  
次の行です


{{< midasi >}}
コード表示例
{{< /midasi >}}
c言語でハイライトON
```c:main.c
void main(void)
{
    int a;
    printf("hello world !!\n");
}
```

{{< midasi >}}
ライン表示例
{{< /midasi >}}

ラインは単に＊＊＊です。
***

{{< midasi >}}
リンク表示例
{{< /midasi >}}
こうなる
[Google](https://google.com)


{{< midasi >}}
その他のサンプル
{{< /midasi >}}

以下はは共通で使用できるMarkdownです

# 見出し1

## 見出し2

### 見出し3

通常文章

次の文章


以下はコードです`/etc/testes.txt`ファイルです

```
sudo dnf install snapd
これは無指定のコードです
```


    頭にタブを追加するとコードとみなされます
    次の行
その次の行

強制改行は文末に空白２つです  
次の文章です

強調は＊＊で**囲み**ます

水平線は＊＊＊
***

~~取り消す文字列~~


{{< midasi >}}
その他のショートコード例
{{< /midasi >}}

Katexで数式表示
$$ \varphi = \dfrac{1+\sqrt5}{2}= 1.6180339887… $$

BootStrapテーブル例

{{< bootstrap-table "table table-striped table-bordered" >}}
| Animal  | Sounds |
|---------|--------|
| Cat     | Meow   |
| Dog     | Woof   |
| Cricket | Chirp  |
{{< /bootstrap-table >}}

Bootstrap table Quote  
名言、引用などに使う

{{< bootstrap-blockquote author="ジョルノ・ジョバァーナ" >}}
「覚悟」とは!!暗闇の荒野に!!進むべき道を切り開く事だッ！
{{< /bootstrap-blockquote >}}


## Hugo がデフォルトで持っているShortcodeテスト

Twitter
{{< tweet 877500564405444608 >}}

Youtube
{{< youtube w7Ft2ymGmfc >}}

gist
{{< gist chromabox be9d5acfe1410c99e0eb3c6cb8c6401b "sample_iconv.cpp" >}}

