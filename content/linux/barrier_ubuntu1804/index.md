---
title: "ubuntu 18.04でbarrierを使う"
date: 2020-09-16T17:58:51+09:00
draft: false
isCJKLanguage: true
tags: ["ubuntu", "linux"]
---

barrierはWindowsとLinuxやらMacOSXとLinuxを一つのキーボード、2つのPCで共用している時に役に立つソフトです。  
キーボード切替器がなくてもWindowsとLinuxを行き来ができて、クリップボードも共有できるので2台以上のPCを扱っている場合はほぼ必須ですね

ただ、Ubuntu18.04ではaptでインストールできるのはSynergyのみとなっています。もともとbarrierはSynergyが有料化してしまったためにそれに反発する有志がフォークで作られたものです。  
まぁ、Synergyでも良いっちゃ良いのですが、Ubuntu18で使う時にXorg(QT?)との相性が悪いのか以下の問題があります。

・マウスをDragしているといきなり切れてWinの画面にマウスカーソルが戻ることがある。 
(Linuxの負荷が上がってる場合とか、QT使ってると起こりやすい感じ)

・Linuxで日本語を入力しているとリターンが暴発するときがある

・コピーペーストに失敗する場合がある

この問題はフォーク先のbarrierでも長らく問題にはなってましたが、今年の5月かそこらにようやく治り、この反映を行った2.3.3がリリースされました

というわけでbarrierを導入しようということですが、これにはソースからビルドする必要があり、今回はその手順などを書いておきます。  
今回はWindowsPCをサーバ、UbuntuPCをクライアントとします。

{{< midasi >}}
WindowsPCにbarrierのインストール
{{< /midasi >}}

これは超簡単です。  
以下からインストーラ込みのバイナリ(2.3.3)をダウンロードしてインストールしてサーバ設定するだけです。  
[https://github.com/debauchee/barrier/releases/download/v2.3.3/BarrierSetup-2.3.3-release.exe](https://github.com/debauchee/barrier/releases/download/v2.3.3/BarrierSetup-2.3.3-release.exe)


{{< midasi >}}
Ubuntu 18.04でbarrierをソースからビルドする
{{< /midasi >}}

次はUbuntu18.04にbarrierを導入するのですが、バイナリイメージはなく、ソースからビルドしないといけません。  
とは言ってもビルドはそんなに難しくはなくて、barrierのGithubに書いてある[これ](https://github.com/debauchee/barrier/wiki/Building-on-Linux)を見ればいいわけですが、手順を書いておきます。

1.ビルドに必要なパッケージをインストール
```
$ sudo apt install git cmake make xorg-dev g++ libcurl4-openssl-dev \
libavahi-compat-libdnssd-dev libssl-dev libx11-dev \
libqt4-dev qtbase5-dev
```

2.ソースをgithubからダウンロード
```
$ git clone https://github.com/debauchee/barrier.git
```
	
3.バージョン2.3.3のブランチをきって、ビルドする
```
$ cd barrier
$ git checkout v2.3.3
$ ./clean_build.sh
```

4.ビルドして問題がなければ、Daemon指定で堕ちてしまうバグを治すパッチを当ててもう一回ビルドする
```
$ wget https://gist.githubusercontent.com/chromabox/61404314887e61c1c32e325a6dc37e41/raw/a83699cc038dc547bb90aab6af6e810200ddee04/barrier-2_3_3-Fix-daemon-mode-execute-missing.patch
$ git checkout -b v2.3.3_mod
$ git am barrier-2_3_3-Fix-daemon-mode-execute-missing.patch
$ ./clean_build.sh
```
{{< bt-alert >}}
このパッチはbarriercをDaemon指定で走らせた時にすぐに堕ちてしまうのを私が直したものです。  
これを適用しないと、PCの電源が入ってログイン画面時に実行する時に実行できなくなってしまいます。  
daemonとして起動しているのにSTDINを使用しようとしているのが問題であり、STDINを開かないようにしています。
{{< /bt-alert >}}

5.ビルドして問題がなければ、インストールする
```
$ cd build
$ sud make install
```
※デフォルトでは/usr/local 以下に入ります。

{{< midasi >}}
barrierを起動時に有効にする(lightdm)
{{< /midasi >}}

これはSynergycのときと同じです  
ログイン時にbarrierc(barrierのクライアント)を利かせる場合は次のようにします
	
```
$ sudo touch /etc/lightdm/lightdm.conf.d/50-barrierc.conf
```
で、`50-barrierc.conf`を作成した後、同ファイルを以下のように編集。

```sh
[SeatDefaults]
greeter-setup-script=/usr/local/bin/barrierc --debug INFO --name サーバで名前設定したこのPCの名前 サーバのIP
```	

