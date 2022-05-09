---
title: "ubuntu 22.04設定メモ"
date: 2022-05-09T14:13:12+09:00
draft: false
isCJKLanguage: true
tags: ["ubuntu", "linux"]
---

正式にUbnutu 22.04 LTSがリリースされ、Japan Remix（日本語環境向けに調整されたもの）もリリースされたので、18.04 LTSだった環境を入れ替えしました。

ちなみに、自分が確認した環境は以下です。
```
 $ screenfetch
                          ./+o+-       XXX@XXXXXXXX
                  yyyyy- -yyyyyy+      OS: Ubuntu 22.04 jammy
               ://+//////-yyyyyyo      Kernel: x86_64 Linux 5.15.0-27-generic
           .++ .:/++++++/-.+sss/`      Uptime: 4h 6m
         .:++o:  /++++++++/:--:/-      Packages: 2192
        o:+o+:++.`..```.-/oo+++++/     Shell: bash
       .:+o:+o/.          `+sssoo+/    Resolution: 1920x1080
  .++/+:+oo+o:`             /sssooo.   DE: GNOME 41.4
 /+++//+:`oo+o               /::--:.   WM: Mutter
 \+/+o+++`o++o               ++////.   WM Theme: Adwaita
  .++.o+++oo+:`             /dddhhh.   GTK Theme: Yaru [GTK2/3]
       .+.o+oo:.          `oddhhhh+    Icon Theme: Yaru
        \+.++o+o``-````.:ohdhhhhh+     Font: Ubuntu 11
         `:o+++ `ohhhhhhhhyo++os:      Disk: 3.2T / 8.2T (39%)
           .o:`.syhhhhhhh/.oo++o`      CPU: Intel Core i7 950 @ 8x 3.068GHz
               /osyyyyyyo++ooo+++/     GPU: NVIDIA GeForce GTX 960
                   ````` +oo+++o\:     RAM: 4307MiB / 11960MiB
```

{{< midasi >}}
USB版のインストールイメージを作る
{{< /midasi >}}

最近のPCはDVDドライブすらないとかままあるので、RaspberryPIなんかでよく使われているbalenaEtcherを使ってUSBメモリからライブUSBを作るのが早い。

8GB以上のUSBメモリ推奨とのこと。

https://www.balena.io/etcher/ に行ってAppimageをダウンロード

解凍して以下コマンドを実行
```
$ ./balenaEtcher-1.7.9-x64.AppImage
```

なお、etcherは内部的にElectronを使っていてこれはGUIの表示にChromiumレンダリングエンジンを使っていてぶっちゃけブラウザ上で走っているようなものなので（考えてみるとすごい時代だ…）、libvaのエラーが出てしまって起動しない場合がある。

特にnvidiaの新しいドライバを使用している場合などは以下のようにしてgpuを使用しないようにするとよい。

```
$ ./balenaEtcher-1.7.9-x64.AppImage --disable-gpu-sandbox
```

後はGUIが出てくるので、イメージを設定して、USBメモリも指定して「Flush」を押して書き込み

参考：  
https://kledgeb.blogspot.com/2022/04/ubuntu-2204-64-windowslinuxmacosubuntu.html  
  
  
{{< komidasi >}}
小ネタ：FreeDOSをUSBから起動する方法
{{< /komidasi >}}

古いマシンを復活させようとしてBIOSをアップデートしないといけなかったりする場合があったりするとWindowsからかDOSから起動しないといけないことって多々ありますよね。

そういう場合は先程の「balenaEtcher」とFreeDOSを使えばUbuntuでもDOSの起動USBメモリを生成できます。

FreeDOSはここ
http://freedos.org/download/
から[FreeDOS 1.3 LiteUSB]をダウンロードすればOK。

そしてそれをbalenaEtcherで書けば動きます。楽ですね。


{{< midasi >}}
インストール時に気をつけること
{{< /midasi >}}

インストール時に使用しているメディアにもよるが、最初のGrubの画面でカーネルのコマンドライン(引数)に

```
fsck.mode=skip
```

を指定しないとメディアに対してfsckをやってしまうらしく、インストーラが立ち上がるのが遅いことがあるそうなので気をつけること


{{< midasi >}}
Virtualboxにインストールする場合
{{< /midasi >}}

USBメモリを使いたい場合はExtpackをインストールの後、これをしてLinux再起動

```
$ sudo gpasswd -a USER_NAME vboxusers
```

EFIを使用するにチェックを付けておくと、Boot時にVirtualBOXのロゴが出て解像度が少し上がる

チェックを入れなくてもインストール自体は可能。

しかし解像度が最低の640*480になってしまい、インストーラのGUIがはみ出て選択できなくなる。

こういう場合はとりあえずインストーラのGUIが出てきたら「Ubunutuを試す」をやって、Live版が起動したら右下のアプリケーション表示のアイコンから「設定」を選び、「ディスプレイ」ー「解像度」を選び、1024*768とか選んで解像度を大きくしたあとで、Ubuntuをインストールするを実行すればOK

あと、UEFIではないのでディスク設定に注意(何も考えずデフォルトでインストールする分には問題ないが、インストールのついでにパーティションを切るとかBtrfsに入れたいとかする場合は注意)

{{< midasi >}}
インストール後の基本セット
{{< /midasi >}}

自分はインストール後にまずこれをしてとりあえず必要なものをインストールしています
```
$ sudo apt update
$ sudo apt upgrade
$ sudo apt install build-essential cmake git gitk ssh gufw samba vim filezilla minicom mcomix gtkterm shutter vlc ffmpeg geany flatpak flex bison screenfetch htop apt-transport-https gnupg2
```


{{< midasi >}}
Codecをまとめてインストール
{{< /midasi >}}

動画のコーデック関連の話。Ubuntu18でもありましたね。

Ubuntuのデフォルトでは権利関係が微妙な(微妙にライセンスがオープンじゃなかったり)怪しいものは除外される運命だけど、これをすることによってインストール出来るというアレ。

但し、libavcodecが消えてしまう(その代り権利怪しいアレなバージョンが入る)
```
$ sudo apt install ubuntu-restricted-extras
```

あれとか言ってるけど、動作的には問題ないので心配しないでほしい。どう違うか？は以下の通り。

libavcodec　－　権利がしっかりしたもの

libavcodec-extra　－　ubuntu-restricted-extrasで勝手に入る。権利怪しいもの


{{< midasi >}}
handbrakeでNVENCが使えない
{{< /midasi >}}

古いPCにUbuntuを入れる活用法はあるあるだけど、nvencを使ってhanbbrakeでH.264やH.265のエンコードしたい場合はドライバのバージョンが390系だったりするとだめ。

ドライバのバージョンが5xx系だと使用可能。

ここを見て自分が使っているビデオボードがエンコードをサポートしているGPUかまず確認しよう。

https://developer.nvidia.com/video-encode-and-decode-gpu-support-matrix-new

これはOBSでnvencを使ってハードウェアエンコードしながら配信したい場合も同じなので注意。


{{< midasi >}}
Btrfsにインストール
{{< /midasi >}}

20.04のときは確かBtrfsを選べなかった気がするが、22.04になってようやくBtrfsにも入れることができるようになった。

Ext4と比べても良くなってるので、もうできる限りBtrfsにしましょう。

→標準のUbuntuからインストールではなくて、Lubuntuフレーバでいきなりインストールする人はBtrfsで動かんらしいので気をつけよう


{{< midasi >}}
GuestAdditionCDの導入(Virtualbox環境)
{{< /midasi >}}

Virtualboxにインストールしたときに「GuestAddition」を入れないとクリップボード共有が動かなかったり、解像度をウィンドウサイズに追従させられなかったり等色々不便なので現状は入れておくと良い。

(本来はVboxSVGAを選択すれば要らないのだが動かないので)

まずgccなど必要なコンパイラ類をまとめて入れる
```
$ sudo apt install build-essential
```

この後でGuest addition CDを投入後、以下実行し、再起動でOK
```
$ cd /media/xxx/VBOXxxx
$ ./autorun.sh
```

{{< midasi >}}
google-chromeのインストール
{{< /midasi >}}

以下のコマンドを打てばOK

```
$ sudo apt install apt-transport-https gnupg2

$ wget -O- https://dl.google.com/linux/linux_signing_key.pub | gpg --dearmor | sudo tee /usr/share/keyrings/google-chrome.gpg

$ echo deb [arch=amd64 signed-by=/usr/share/keyrings/google-chrome.gpg] http://dl.google.com/linux/chrome/deb/ stable main | sudo tee /etc/apt/sources.list.d/google-chrome.list

$ sudo apt update
$ sudo apt install google-chrome-stable
```

{{< midasi >}}
vscodeのインストール
{{< /midasi >}}

以下のコマンドを打てばOK

```
$ sudo apt install apt-transport-https gnupg2

$ wget -O- https://packages.microsoft.com/keys/microsoft.asc | sudo gpg --dearmor | sudo tee /usr/share/keyrings/vscode.gpg

$ echo deb [arch=amd64 signed-by=/usr/share/keyrings/vscode.gpg] https://packages.microsoft.com/repos/vscode stable main | sudo tee /etc/apt/sources.list.d/vscode.list

$ sudo apt update
$ sudo apt install code
```



{{< midasi >}}
sshとsshd
{{< /midasi >}}

sshが無いと色々めんどくさいので早めにやっておく。

この辺はUbuntu18.04と同じ。

```
ub2204: $ sudo apt install ssh
```

もしもホスト側の`.ssh/config`が公開鍵オンリーになっていたら以下のようにホスト側のエントリーを書かないといけない

```sh
Host ub2204
	User XXX
	HostName YYY
	port 22
	IdentitiesOnly no
	PreferredAuthentications password
```

これで一応PasswdでログインOK
インストール直後は.sshが作られていないのでsshで入ったあとで自分で自分のサーバに入る
```
host: $ ssh ub2204
(Pass聞いてくる)
ub2204:$ ssh localhost
(FingerPrint合ってるかどうか聞いてくるのでYと答える)
(Pass聞いてくる)
ub2204:$ exit
```

ホスト側(もしあれば)で、ed25519な鍵生成
```
host: $ ssh-keygen -t ed25519
```
何処に出力するか聞いてくるので、設定して鍵ファイルを作る

インストール先に公開鍵を転送
```
host: $ scp (作った秘密鍵).pub (転送先サーバ名):/home/xxx/
```

転送先で鍵設定
```
ub2204:$ cp (作った秘密鍵).pub .ssh/authorized_keys
ub2204:$ chmod 600 .ssh/authorized_keys
```

セキュリティを高めるために、転送先のsshd_configを触って鍵オンリーにしてパスワードログインは禁止。

`/etc/ssh/sshd_config`を以下のように変更

```sh
PubkeyAuthentication yes
PasswordAuthentication no
```

最後に、sshdリスタート
```
ub2204:$ systemctl restart sshd
```

{{< midasi >}}
Samba設定
{{< /midasi >}}

まず、Sambaをインストール
```
$ sudo apt install samba
```

次に`/etc/samba/smb.conf`に追記

```sh
[ユーザ名]
        path = /home/ユーザ名
        writeable = yes
        browseable = no
        valid users = ユーザ名
```
browseableは必要に応じて変える

sambaのパスワードをセットする
```
$ sudo smbpasswd -a ユーザ名
```
(-a を入れないとエラーになる)

最後にsmbdリスタート
```
$ sudo systemctl restart smbd
```


{{< midasi >}}
minicomなどで使用するターミナルの権限変更等
{{< /midasi >}}

`/dev/ttyS`なんとかのグループがdialoutになっているのでそれを利用する
```
$ sudo gpasswd -a ユーザ名 dialout
$ sudo chown root:dialout /etc/minicom
$ sudo chmod 775 /etc/minicom
```

詳細
https://qiita.com/chromabox/items/306386a886bee4fb7810

なお、デフォルトではFT23X系のチップを使用したUSBシリアル変換を接続すると、しばらく間をおいて途中で勝手に切られてしまう....

このときのdmesgはこんな感じ
```
[ 6114.316364] usb 1-3.4: New USB device found, idVendor=0403, idProduct=6001, bcdDevice= 6.00
[ 6114.316374] usb 1-3.4: New USB device strings: Mfr=1, Product=2, SerialNumber=3
[ 6114.316378] usb 1-3.4: Product: FT232R USB UART
[ 6114.316380] usb 1-3.4: Manufacturer: FTDI
[ 6114.316383] usb 1-3.4: SerialNumber: XXXXXXXX
[ 6114.319137] ftdi_sio 1-3.4:1.0: FTDI USB Serial Device converter detected
[ 6114.319181] usb 1-3.4: Detected FT232RL
[ 6114.320031] usb 1-3.4: FTDI USB Serial Device converter now attached to ttyUSB0
[ 6131.973998] usb 1-3.4: usbfs: interface 0 claimed by ftdi_sio while 'brltty' sets config #1
[ 6131.975270] ftdi_sio ttyUSB0: FTDI USB Serial Device converter now disconnected from ttyUSB0
[ 6131.975311] ftdi_sio 1-3.4:1.0: device disconnected
[ 6572.726767] usb 1-3.4: USB disconnect, device number 9
```

調べるとどうやら「brltty」という点字関連のアクセシビリティのものが悪さをしているので、以下を実行してbrlttyをアンインストールするとよい

```
$ sudo apt remove brltty
```

{{< midasi >}}
sudo apt autoremoveするとnvidiaドライバが何故か消えてしまいnouveauドライバになる
{{< /midasi >}}

インストール時に3rdパーティのドライバをインストールするを選択すると、インストール後に自動的にNvidiaのドライバが入るようになって万々歳のところが、ここで。。。

```
$ sudo apt autoremove
```
をやってしまうと、再起動時に何故かNvidiaのドライバがなくなりnouveauドライバになってしまう
こういうときは焦らずに

```
$ sudo ubuntu-drivers autoinstall
```

して、再起動すれば復活する。


{{< midasi >}}
gdm3でWaylandを無効にする
{{< /midasi >}}

Ubuntu22.04もデフォルトではWaylandを使おうとする。

しかし、barrierやteamviewer等色々と対応していないアプリはあるので、これらを動かすときはOFFにしておいたほうが無難。

`/etc/gdm3/custom.conf`を以下のように、WaylandEnable=falseにする。

```sh
[daemon]
# Uncoment the line below to force the login screen to use Xorg
WaylandEnable=false
```

{{< midasi >}}
RDP（Ubuntu22.04で標準で入るようになったgnome-remote-desktop）について
{{< /midasi >}}

Ubuntu22.04の目玉(？)機能の一つとしてリモートデスクトップが標準サポートされるようになりました。

しかし、接続元のRemminaが古いとRDPで接続ができないとかあります。

(例えば、Ubuntu20.04のデフォルトで入れられるRemminaなど)

これは、RemminaをSnap版にして新しいのを入れると問題なく接続できるようになります。

Snap版にしたときは権限設定を忘れずに(ほとんどONでいいと思う)

この際なのでUbuntu22.04側のRemminaもSnap版に入れ替えしたほうが良いですね。

なお、セッションがXorgの場合はなぜかこのRDPが使用できないので、Xorg環境でリモートデスクトップを使いたい場合は、VNCを許可としておく必要があります

→接続元はなんらかのVNCクライアントで接続することになります。

VNCの共有設定でデフォルトだといちいち接続先に接続しても良いかの問い合わせが出てきて接続先に人がいないと接続できないという問題がでるので、パスワードを要求するを選択すると聞いてこなくなります。

また、Wayland環境でもVNCでも画面をロックしたりログアウトするとリモートデスクトップが切れます…これが地味にしんどい…

(TeamviewerやWindowsリモートデスクトップのような完全なリモートデスクトップじゃなくて、gnome-remote-desktopは、操作アシスタント的な使い方を想定している…とのことのようです。)

リモートデスクトップが標準になるということで個人的に期待していたのですが肩透かしといった感じですね。。。

なかなかこの仕様は正直つらいので、本格的にリモートなデスクトップを使用したい人は従来どおりxrdpするか、Teamviewerを入れたほうがよさそうです。


{{< midasi >}}
日本語がうまく入らない(ubuntu日本語Remix版では治っているかも)
{{< /midasi >}}

そのままだと変換ボックスがウィンドウの下に出ます。

ただそれだけではなく、geditなんかで日本語入力がおかしくなり非常に日本語入力が厳しくなる。。。

gsettingsの値がこうだとだめらしい
```
$ gsettings get org.gnome.desktop.interface gtk-im-module
''
```

これが空なのが行けないようなので次のようにするとよい
```
$ gsettings set org.gnome.desktop.interface gtk-im-module 'ibus'
```

参考：
https://askubuntu.com/questions/1405101/japanese-input-candidate-window-appears-at-the-bottom-after-upgrading-ubuntu-fro


{{< midasi >}}
Flatpakのインストール
{{< /midasi >}}

ubuntuはリリースバージョンでアプリのバージョンが固定されてしまうのでなるべくflatpakかsnapでリリースされているものを使うのが良いとのこと

```
$ sudo apt install flatpak
$ sudo flatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo
$ sudo apt install gnome-software-plugin-flatpak
```

これをしたあとで、gimpのページの
https://www.gimp.org/downloads/
にある[install flatpak GIMP] をクリックしてflatpakrefを開くとflatpak版gimpがインストールできる

flatpakのアップデートは
```
$ flatpak update
```
でOK


{{< midasi >}}
Golangのインストール
{{< /midasi >}}

18.04や20.04の場合はlongsleep/golang-backportsのppaを取り込む必要があったけど22.04は現時点で最新版がUbuntu標準に含まれているので必要ないとのこと
(今後、Golangがアップデートされたりしたらまた必要になるのかも？)

というわけで以下でOK
```
$ sudo apt install golang-go
```


{{< midasi >}}
scrcpyのインストール
{{< /midasi >}}

Android端末の画面をそのままコピーしてUbuntu上で操作できるようにするツール。かなり便利。

snap版のほうが新しいので、例によってsnap版のをインストールすると良い（権限設定は忘れずに）

また、Android端末側はUSBデバッグを有効にするのと、初回接続時はこのPCからの接続を許可するか？の問答があるので設定をすること。

```
$ sudo snap install scrcpy
```


{{< midasi >}}
OBSのインストール
{{< /midasi >}}

例によってflatpak版をインストール

１．公式からFlatpakをダウンロード

２．ファイルマネージャー等で開く

３．プラグインも全部入れる

４．普通に起動

Webカメラが動作できて録画できることまでは確認。ただし配信は未確認（TwichかTwitterでの配信で問題ある環境があるとか？）

v4l2関連でエラーが出るかもしれないらしい（自分の環境では出ず）

その時はこれをすると良いとのこと
```
$ apt install v4l-utils libv4l-dev
```


{{< midasi >}}
barrierについて
{{< /midasi >}}

wayland環境は未対応なので注意すること。よって、gdm3のwaylandは外しておくこと。

xorg環境でないと動きません。

調べたところ、2.4系はなんか変らしいので2.3.3でトライしました。

ビルドについてはこことほとんど同じだが、ubuntu22.04はlibqt4が無いのでlibqt4-devは外してしまって良い

https://chromabox.github.io/140m/linux/barrier_ubuntu1804/


以下そのまま順に実行。/usr/local/binにbarrierが入ります。
```
$ sudo apt install cmake xorg-dev g++ libavahi-compat-libdnssd-dev libx11-dev libcurl4-openssl-dev qtbase5-dev 
libssl-dev
$ git clone https://github.com/debauchee/barrier.git
$ cd barrier
$ git checkout v2.3.3 -b v2.3.3_mod
$ wget https://gist.githubusercontent.com/chromabox/61404314887e61c1c32e325a6dc37e41/raw/a83699cc038dc547bb90aab6af6e810200ddee04/barrier-2_3_3-Fix-daemon-mode-execute-missing.patch
$ git am barrier-2_3_3-Fix-daemon-mode-execute-missing.patch
$ ./clean_build.sh
$ cd build
$ sudo make install
```


{{< midasi >}}
barriercの自動実行について
{{< /midasi >}}

電源投入時にBarriercも自動実行させたいときはgdm3の設定が必要になる。

lightdmのときと違い、gdm3の設定はなかなかに面倒

参考：
http://masaoo.blogspot.com/2021/07/ubuntu-2004-gdm-synergyc.html

`/usr/share/gdm/greeter/autostart/barrierc.desktop`を新規作成
```.sh
[Desktop Entry]
Type=Application
Name=barrierc
Exec=/usr/local/bin/barrierc --debug INFO --name (このマシンの設定名) (サーバIP)
NoDisplay=true
X-GNOME-AutoRestart=true
```

```
$ cd /etc/gdm3/PostLogin
$ sudo cp Default.sample Default
```

`/etc/gdm3/PostLogin/Default`を編集
```.sh
#!/bin/sh
#
# Note: this is a sample and will not be run as is.  Change the name of this
# file to <gdmconfdir>/PostLogin/Default for this script to be run.  This
# script will be run before any setup is run on behalf of the user and is
# useful if you for example need to do some setup to create a home directory
# for the user or something like that.  $HOME, $LOGIN and such will all be
# set appropriately and this script is run as root.

killall barrierc
```

`/etc/gdm3/PostSession/Default`を編集
```.sh
#!/bin/sh

/usr/bin/killall barrierc
while[ $(pgrep -x barrierc) ]; do sleep 0.1; done

xauthfile=$(ps aux |grep Xauth | grep '^root' | grep -oP '\-auth \K[\w/]+')
export DISPLAY=:0
export XAUTHORITY=${xauthfile}

/usr/local/bin/barrierc --debug INFO --name (このマシンの設定名) (サーバIP)

exit 0
```

ログイン後に自動起動させたいので以下のようにする
```
$ cd ~/
$ mkdir bin
$ cd bin
$ touch start-barrierc.sh
$ chmod 775 start-barrierc.sh
```

`start-barrierc.sh`を編集
```.sh
#!/bin/sh
/usr/bin/killall barrierc
while [ $(pgrep -x barrierc) ]; do sleep 0.1; done
/usr/local/bin/barrierc --debug INFO --name (このマシンの設定名) (サーバIP)
```


{{< midasi >}}
teamviewerを使いたい
{{< /midasi >}}

teamviwereはWaylandセッションでは動かない(対応していない)ので気をつけること

Waylandを事前に無効にしておくのが良いかもしれない。

以下コマンドを順に入れればOK
```
$ sudo apt install wget apt-transport-https gnupg2
$ wget -O- https://download.teamviewer.com/download/linux/signature/TeamViewer2017.asc | gpg --dearmor | sudo tee /usr/share/keyrings/teamview.gpg
$ echo deb [arch=amd64 signed-by=/usr/share/keyrings/teamview.gpg] http://linux.teamviewer.com/deb stable main | sudo tee /etc/apt/sources.list.d/teamviewer.list
$ sudo apt update
$ sudo apt install teamviewer
```
インストール時に設定ファイルに差異があるけど、どうするか聞いてくるけどNで良い


{{< midasi >}}
hugoのインストール
{{< /midasi >}}

最新が0.98.0なので最新をインストールする。

なお、ubuntu 22.04で通常の方法でインストールすると0.92.2-1となる。

※前提条件：Golangを入れておくこと

0.すでにHugoを入れてしまっている場合はアンインストール
```
$ sudo apt remove hugo
```

１．ここから最新のdebを落とす(extend付きが良い。0.98.0で確認)

https://github.com/gohugoio/hugo/releases/

２．以下コマンドでインストール。/usr/localにインストールされる
```
$ sudo dpkg -i ./hugo_extended_0.98.0_Linux-64bit.deb
```

３．確認
```
$ hugo version
hugo v0.98.0-165d299cde259c8b801abadc6d3405a229e449f6+extended linux/amd64 BuildDate=2022-04-28T10:23:30Z VendorInfo=gohugoio
$ which hugo
/usr/local/bin/hugo
```


{{< midasi >}}
vpnを起動時にONにする（問題あり）
{{< /midasi >}}

参考：
https://itectec.com/ubuntu/ubuntu-20-04lts-networkmanager-vpn-always-on/

nm-connection-editor を使いましょうということらしい

が、nm-connection-editorを使うと電源再投入後にLANが有効にならないという問題がある…（調査中）



{{< midasi >}}
Lubuntuを後から入れる
{{< /midasi >}}

18.04のときのようにこれをする
```
$ sudo apt install -y lubuntu-desktop
```

しかし、今回ディスプレイマネージャはsddmを使うらしい…ということでgdm3かsddmかを聞いてくる

自分はgdm3をやってみました。

sddmはまた後ほど…

Ubuntuを普通に入れた後でLubuntuを入れると日本語設定もそのままなので楽。

Lubuntuから入れるとBtrfsで起動しない問題があるそうだが、この方法だとBtrfsに入れても起動しないということはない。

少し試した感じでは特に問題はなかったです。

Ubuntuの標準もだいぶこなれてはきたので、今更Lubuntuもという感じは多少あります…

