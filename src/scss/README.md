ワンダフル CSSアーキテクチャ
=====
　
####１．予測しやすいCSS
ルールを追加した時に、そのルールが意図せずサイトの一部に影響を与えるべきではない。

####２．再利用しやすいCSS
CSSのルールは、抽象的で用途が十分に分離されるべきである。
それにより新規の記述を減らし、既存のパーツから新しいコンポーネントを作成する速度を向上させる。

####３．保守しやすいCSS
サイトに新しいコンポーネントと機能が追加・更新される時、
既存のCSSのリファクタリングを必要とすべきではない。

####４．拡張しやすいCSS
一人のデベロッパか大きなチームかを問わず、容易に管理出来る事を意味する。


#####	　
###	構築する際に意識する事
* クラスは１つの責任のみを負う（凝集度を高める）
* 各コンポーネントは構造とスタイルを分離する
* ベースとなるルールは上書き/拡張しやすく、可能な限り変更しない
* クラスを継承する場合、親と子クラスを置き換えても、構造や機能に問題を生まないようにする
* コンポーネントの用途を汎用的にし過ぎない。用途が分かれる場合は、別コンポーネントを作成する
* クラスのセレクタは、下位のコンポーネント・要素に依存しない
* 下位のコンポーネントのスタイルは、それぞれの上位のコンポーネントによって決定される
#####	　



ワンダフルのスケールのCSS
=====
　
 ###ワンダフルにおけるコーディングの前提条件
 #####１．大規模案件が無い
 #####２．コーダーが少ない
 #####３．デザイナーがコーディングしない
　
 ###それを踏まえた上でコーディングのポイント
 #####１．記法を限定しすぎない
 記法はBEMやSMACCSの考え方を継承しつつ、厳格になりすぎないレベルで記述する。
 ただし、クラス名によるスタイルの相互汚染は必ず回避する。
 #####２．共通コンポーネントとページ固有のコンポーネントを分別する
 共通コンポーネントとページ固有のコンポーネントは別ファイルで構築し、記法をそれぞれに依存させない。
 それによって構築速度と再利用性と保守性を維持する。
 #####３．コンポーネント毎のモディファイアと、グローバルなモディファイアを用意する
 コンポーネント毎にモディファイアを用意するのは当然として、
 より柔軟に対応する為にグローバルにスタイル指定するモディファイアを用意する。
 ただし用途はシンプルにし、マルチクラスパターンで使用できる形式に限定する。
#####　

具体的なプラクティス
=====
#####	・同系統のコンポーネントが複数ある場合、共通スタイルを洗い出す
```ruby
//NG
.btn-a { width:100px; height:20px; display:block; border:1px solid white; background:gray;}
.btn-b { width:100px; height:20px; display:block; border:1px solid white; background:red;}

//OK
.btnBase{ width:100px; height:20px; display:block; border:1px solid white;
	&.skin-a { background:gray;}
	&.skin-b { background:red;}
}
```
　　
  
#####	・クラスの用途・関心を分割する（グローバルなモディファイアを使用する）
```ruby
//NG .widget { width:50px; background:black;}
//OK .widget { width:50px;}
//OK .widget.skin-bg-black {background:black;}
```
　
#####	・親要素に基づいてコンポーネントを修正せず、モディファイアを使用する
```ruby
.widget { width:100px; background:black; }
//NG #sidebar .widget { width:50px; }
//OK .widget.widget-sidebar { width:50px;}
```
　
#####	・セレクタは意図的に指定する
```ruby
//NG　.main-nav ul li ul {} //セレクタが冗長、HTML構造に依存している
//OK　.subnav {}
```



　
Usage
=====

`styledocco [options] [STYLESHEET(S)]`

Options
-------

 * `--name`, `-n`      Name of the project
 * `--out`, `-o`       Output directory *(default: "docs")*
 * `--preprocessor`    Custom preprocessor command. *(optional)* (ex: `--preprocessor "~/bin/lessc"`)
 * `--include`         Include specified CSS and/or JavaScript files in the previews. *(optional)* (ex: `--include mysite.css --include app.js`)
 * `--verbose`         Show log messages when generating the documentation. *(default: false)*
 *                     Stylesheet (or directory of stylesheets) to process.

Usage examples
--------------

Generate documentation for *My Project* in the `docs` folder, from the files in the `css` directory.

`styledocco -n "My Project" -o mydocs -s mydocs --preprocessor "scss --compass" styles`


Change Log
==========

v0.6.6 - Jan 28, 2014
---------------------

 * Fix failure to render iframes in new versions of Chrome (#100)
 * Make it an option to minify the code (#106)

