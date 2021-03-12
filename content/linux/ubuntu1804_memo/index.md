---
title: "ubuntu 18.04設定メモ"
date: 2019-06-17T17:13:12+09:00
draft: false
isCJKLanguage: true
tags: ["ubuntu", "linux"]
---

Ubuntu 18.04の設定などのメモです。割と忘れやすいので備忘録ついでに書いてます。気が向いたらまたちょくちょく更新します。

{{< midasi >}}
OracleのVirtualboxを使う
{{< /midasi >}}

すでにUbuntuのデフォルトのをインストールしている場合は...

```
$ sudo apt remove virtualbox
$ sudo apt upgrade
$ sudo apt autoremove
(virtualbox-dkmsを削除しておく)
```

以下でインストール。(Oracleのリポジトリを追加して鍵を追加してインストール)
```
$ sudo add-apt-repository "deb [arch=amd64] https://download.virtualbox.org/virtualbox/debian bionic contrib"
$ wget -q https://www.virtualbox.org/download/oracle_vbox_2016.asc -O- | sudo apt-key add -
$ wget -q https://www.virtualbox.org/download/oracle_vbox.asc -O- | sudo apt-key add -
$ sudo apt update
$ sudo apt install virtualbox-5.2 dkms
```

{{< midasi >}}
Gnome-Shellを使いやすく
{{< /midasi >}}

まずこれをする

```
$ sudo apt install gnome-shell-extensions
```

キーボードの設定を変更するには dpkg-reconfigure コマンドを keyboard-configuration 引数をつけて実行する。
```
$ sudo dpkg-reconfigure keyboard-configuration
```
表示されるウィザードに沿って設定を入力していく。 二番目の設定で Japanese にするのがポイント。  
Generic 105-key (Intel) PC → Japanese → Japanese → The default for the keyboard layout → No compose key

{{< midasi >}}
unityやUIをカスタマイズしたい
{{< /midasi >}}

unity tweakを使ってカスタマイズする
```
$ sudo apt install unity-tweak-tool
$ sudo apt install notify-osd
```

{{< midasi >}}
gdm3でWaylandを無効にする
{{< /midasi >}}

Ubuntu18.04は、デフォルトではWaylandを使おうとする。しかし、Synergycはまだ対応してないので、動かすときはOFFにしておいたほうが無難。

`/etc/gdm3/custom.conf`を以下のように、WaylandEnable=falseにする。

```sh
[daemon]
# Uncoment the line below to force the login screen to use Xorg
WaylandEnable=false
```

{{< midasi >}}
LightDMとLubuntuのインストール
{{< /midasi >}}

デフォルトだとUnityのままだけど、重くなっていくUnityに嫌気が差した人用。LubuntuはOpenboxベースで軽量。

以下参考

[https://www.hiroom2.com/2018/05/06/ubuntu-1804-lxde-ja](https://www.hiroom2.com/2018/05/06/ubuntu-1804-lxde-ja)

LightDMも共に使う必要があるので、LightDMも合わせてインストールする。

```
$ sudo apt install -y lubuntu-desktop
途中でLightDMにするかどうか聞いてくるので、LightDMにする。
```

LXDMやめるとき
```
$ sudo apt remove -y lubuntu* lxde* openbox lightdm
$ sudo apt autoremove -y
$ sudo apt install --reinstall -y gdm3
$ sudo reboot
```

{{< midasi >}}
barrierを起動時に有効にする(lightdm)
{{< /midasi >}}
WindowsとLinuxやらMacOSXとLinuxを一つのキーボード、2つのPCで共用している時に役に立つツール。  
キーボード切替器がなくても行き来出来て、クリップボードも共有してくれるので便利。  
以前はsynergyというツールがあったのですが、有料化＆Ubuntu18.04で使うのには問題がありました。  

ただ、Ubuntu18.04はaptパッケージにはbarrierが用意されていなくて、自力でどうにかしないといけません。  
ちょっと長くなったので別ページを作りました。  
[ubuntu 18.04でbarrierを使う](https://chromabox.github.io/140m/txt/linux/barrier_ubuntu1804.html)


{{< midasi >}}
light-locker-settingsが動かない…
{{< /midasi >}}

Lubuntuでスクリーンセーバの設定を変える時に必要…なのだけどpython-giが入ってなくて動かない。なので次のコマンドでインストール。(今は直ってるかもしれん)

```
$ sudo apt install python-gi
```


{{< midasi >}}
OpenCVの開発
{{< /midasi >}}

何も考えずこれでもいいけど…
```
$ sudo apt install libopencv-dev
```
専門家(？)に言わせるとこれダメらしい。使いたい機能がオミットされていたりするとか、更新頻度が早いから、最新使ったほうがいいとか、なんとか。。。  
ディストリとしてはどの環境でも万遍なく動く必要があるので、これは仕方ないのだけれども…  
[https://qiita.com/usk81/items/98e54e2463e9d8a11415](https://qiita.com/usk81/items/98e54e2463e9d8a11415)

かくなる上はソースから持ってきてOpenCVのライブラリを丸々コンパイルする必要があるのだけど、長くなるので他のエントリーに書こうかなと思います。


{{< midasi >}}
Android Studioのインストール
{{< /midasi >}}

snappyをつかうとよい。良い時代になりました。  
[https://qiita.com/maccadoo/items/4ce153af005df3f48e8d](https://qiita.com/maccadoo/items/4ce153af005df3f48e8d)

AVD(Androidのソフト開発で使う公式のエミュレータ)も動いた。ちゃんとNvidiaのグラフィックドライバが入ってればOpenGLが有効で動いてくれて、軽々動作する。本当に良い時代になりました(2回目)

ドールズフロントライン(ソシャゲ)も試した所、軽々と動いたけどGenymotionよりは若干リソース使う感じ。特にこだわりなければこれで全然問題無さそう


{{< midasi >}}
Codecをまとめてインストール
{{< /midasi >}}

動画のコーデック関連の話。  
Ubuntuのデフォルトでは権利関係が微妙な(微妙にライセンスがオープンじゃなかったり)怪しいものは除外される運命だけど、これをすることによってインストール出来るというアレ。

但し、libavcodecが消えてしまう(その代り権利怪しいアレなバージョンが入る)
```
$ sudo apt install ubuntu-restricted-extras
```
あれとか言ってるけど、動作的には問題ないので心配しないでほしい。  
どう違うか？は以下の通り。

libavcodec　－　権利がしっかりしたもの  
libavcodec-extra　－　ubuntu-restricted-extrasで勝手に入る。権利怪しいもの  


{{< midasi >}}
sshでキーの指紋を確認したい
{{< /midasi >}}

ssh-keygen でできる。
```
$ ssh-keygen l -f [公開鍵のファイル]
```

但し、Ubuntu18.04はOpenSSH 6.8以降なため、指紋表示形式がSHA254/base64となっている。 
※昔はMD5:HEX形式

githubの設定でMD5形式で表示されていて、自分の鍵の指紋を確認したい場合は次のようにする
```
$ ssh-keygen l -E md5 -v -f [公開鍵のファイル]
```

{{< midasi >}}
Ubuntuサーバに公開鍵形式でsshログインをしたい
{{< /midasi >}}

公開鍵でログインするのは、Ubuntuのデフォルトで一応有効になっている。

まず、公開鍵と秘密鍵を作った後、Ubuntuサーバに公開鍵を何らかの方法でおくった後、次のようにする
```
(公開鍵をid_rsa_bob_serverA.pubとした場合)
$ cp id_rsa_bob_serverA.pub ~/.ssh/authorized_keys
$ sudo service ssh restart
```
authorized_keysはsshdのconfigで指定されているファイルなので、これを設定しておくと良い。  
一応、他のPCからSSHで秘密鍵と共にログイン出来るかやってみる。成功したら、パスワード方式はOFFにしておくと良い。

以下`/etc/sshd/sshd_config`ファイルをrootで編集
```sh
PasswordAuthentication no
(#PasswordAuthentication yesとかになっているのでこのように変更)
```
そしてsshdをリスタートする
```
$ sudo service ssh restart
```

{{< midasi >}}
kicadがおかしい、または十字アイコンが残ったままになって使えない…
{{< /midasi >}}

デフォルトでインストールできるKicad(回路図エディタやらCADが使えるアプリ)は、環境によって十字アイコンがのこってしまい大変残念なことになってしまう…  
なので、次のようにしてVer5系統を入れ直す
```
(すでにKicad入れていて残念な気持ちになった人は以下実行)
$ sudo apt purge kicad

(ここからはみんな共通)
$ sudo add-apt-repository ppa:js-reynaud/kicad-5
$ sudo apt update
$ sudo apt upgrade
$ sudo apt install kikad kikad-doc-ja kikad-locale-ja kikad-demo
(kikad-locale-jaを入れないと日本語化しないので注意)
```

前のkikad4を入れていた人は設定が~/.config/kicad/に残ってしまっているいので以下もやったほうがいい
```
$ rm -rf ~/.config/kicad
```

{{< midasi >}}
ネットワーク接続の編集で、VPNの設定がPPTPしか出ない。OpenVPN等の設定を追加したい
{{< /midasi >}}

デフォルトではPPTPしか出てこないので、以下をすると良い
```
$ sudo apt install network-manager-ssh-gnome
$ sudo apt install network-manager-openvpn-gnome
```
他にも色々有るので、network-manager-のあどでTABを押して何がインストールできるか確認すると良い

