

# Plan

## Concepts

| 概念       | 现实比喻               | 你需要做的事                         |
| -------- | ------------------ | ------------------------------ |
| **内容**   | 店里卖的商品             | 写文章、做设计、准备图片                   |
| **内容管理** | 上架/整理商品的方式         | 用 Markdown 写 / 手写 HTML / 用 CMS |
| **托管平台** | 存放店铺的那栋楼           | GitHub Pages / Vercel / 云服务器   |
| **域名**   | 店铺的门牌地址            | `yourname.com`                 |
| **DNS**  | 城市的地址簿，把门牌号翻译成具体楼层 | 配置 A 记录 / CNAME，指向托管平台         |
你写内容


## Structure

    ↓ 用某种方式管理（Hugo / 手写 / CMS）
        ↓ 生成 HTML 文件，推送到托管平台（GitHub Pages）
            ↓ 托管平台给你一个 IP 地址或默认域名
                ↓ 你买一个域名，通过 DNS 把它指向托管平台
                    ↓ 用户输入你的域名，浏览器打开你的网站

### 五层架构总览

整个系统由 5 个独立层组成，每层职责分明、可单独替换：

① 本地开发环境 — 你用 VS Code 写 Markdown 文章，Hugo 在本地将其编译成静态 HTML 供预览

② GitHub 仓库 + Actions — 代码仓库存储源文件，Actions 在每次 git push 后自动触发 Hugo 构建并部署到 GitHub Pages

③ 域名 & DNS — 购买 .com 域名后，在 Cloudflare DNS 添加 A 记录指向 GitHub Pages 的服务器 IP

④ CDN 加速（推荐） — Cloudflare 免费计划在全球 300+ 节点缓存静态文件，香港访问延迟从 300ms 降至 30ms 以内

⑤ 用户访问 — 用户输入域名，浏览器 DNS 解析后直接获取静态文件并渲染，无需服务器计算



### 项目目录结构

my-blog/
── content/         ← 你写的所有 .md 文章
   └── posts/
── themes/          ← 主题文件（不要手动修改）
── static/          ← 图片、favicon 等静态文件
── layouts/         ← 自定义模板（覆盖主题）
── hugo.toml        ← 站点配置文件



### 编译语言

GO, Ruby, Node.js

它们分别是Hugo、Jekyll、Hexo 所依赖的底层引擎

| 维度           | Go                          | Ruby                    | Node.js                   |
| :------------- | :-------------------------- | :---------------------- | :------------------------ |
| **类型**       | 编译型静态语言              | 解释型动态语言          | JS 运行时（非语言本身）   |
| **诞生**       | 2009，Google                | 1995，Matz              | 2009，Ryan Dahl           |
| **性能**       | ★★★★★ 接近 C                | ★★☆☆☆ 较慢              | ★★★★☆ I/O 优秀            |
| **内存占用**   | 极低                        | 中等                    | 中等（比 Go 高约 40%）    |
| **并发模型**   | Goroutine（轻量线程，原生） | 线程                    | 单线程事件循环            |
| **语法风格**   | 简洁强类型，有点"啰嗦"      | 优雅、表达力极强        | 灵活，异步回调/Promise    |
| **学习曲线**   | 中（类型系统需适应）        | 低（语法接近自然语言）  | 低（会 JS 即可上手）      |
| **生态包数量** | 较少但质量高                | 丰富（Gem）             | 最多（npm，190 万+）      |
| **主要用途**   | 系统工具、高性能服务、CLI   | Web 开发（Rails）、脚本 | Web API、全栈、前端工具链 |

工具- 底层语言-内容载体

| 你用的工具   | 底层语言 | 你实际写的           |
| :----------- | :------- | :------------------- |
| Hugo         | Go       | Markdown + TOML 配置 |
| Jekyll       | Ruby     | Markdown + YAML 配置 |
| Hexo / Astro | Node.js  | Markdown + JS 配置   |



### 推荐技术选型与配置速查

| 层级       | 推荐工具             | 费用      | 说明与配置要点                                               |
| :--------- | :------------------- | :-------- | :----------------------------------------------------------- |
| 内容管理   | Hugo v0.128+         | 免费      | macOS 安装：`brew install hugo`；主题推荐 PaperMod / Congo   |
| 代码仓库   | GitHub               | 免费      | Public 仓库；main 分支触发 Actions 自动构建                  |
| CI/CD      | GitHub Actions       | 免费      | 使用 `peaceiris/actions-hugo` action；每月 2000 分钟免费配额 |
| 托管平台   | GitHub Pages         | 免费      | Settings → Pages → Source: gh-pages branch；自动 HTTPS       |
| 域名注册   | Cloudflare Registrar | 约 ¥80/年 | 无溢价续费；.com 约 $9.15/年；推荐购买 .com / .dev           |
| DNS 解析   | Cloudflare DNS       | 免费      | A 记录指向 GitHub Pages 4 个 IP；或 CNAME 指向 user.github.io |
| CDN 加速   | Cloudflare CDN       | 免费      | 接管 DNS 后自动生效；SSL 设为 Full Strict；适合港澳用户      |
| 本地编辑器 | VS Code              | 免费      | 安装 Markdown All in One + Front Matter CMS 插件             |



**CI/CD 是什么**
CI（Continuous Integration，持续集成） 指每次提交代码后自动运行构建和测试，确保代码随时可用。CD（Continuous Deployment，持续部署） 指构建通过后自动发布到生产环境 。

**GitHub** Actions 是什么

| 术语                   | 含义                                                      |
| :--------------------- | :-------------------------------------------------------- |
| **Workflow（工作流）** | 完整的自动化流程，定义在 `.github/workflows/*.yml`        |
| **Event（触发事件）**  | 启动 Workflow 的条件，如 `push`、`pull_request`、定时任务 |
| **Job（作业）**        | Workflow 中的一个执行单元，运行在一台虚拟机上             |
| **Step（步骤）**       | Job 中的一条指令，可以是 shell 命令或调用现成的 Action    |
| **Action**             | 可复用的自动化脚本包，如 `peaceiris/actions-hugo`         |
| **Runner（运行器）**   | 执行 Job 的虚拟机，GitHub 提供 Ubuntu / Windows / macOS   |

**peaceiris/actions-hugo 是什么**

它是社区开发的一个可复用 Action，专门负责"在 GitHub 的虚拟机上安装 Hugo" 。你的 Workflow 调用它之后，就可以直接使用 hugo 命令，无需手动下载安装。

**每次 push 后发生了什么**

你 git push
    ↓ GitHub 检测到 main 分支有新提交
        ↓ 自动启动一台 Ubuntu 虚拟机
            ↓ Step 1: 克隆你的代码到虚拟机
            ↓ Step 2: peaceiris/actions-hugo 安装 Hugo
            ↓ Step 3: 运行 hugo --minify，生成 public/
            ↓ Step 4: 将 public/ 推送到 gh-pages 分支
                ↓ GitHub Pages 检测到 gh-pages 更新
                    ↓ 网站自动上线（全程约 30–60 秒）
虚拟机销毁，本次任务结束





## 域名

xzhengbr.com, 10$
or
xinzheng.uk, 5$


10$ around

https://domains.cloudflare.com/?domain=xzhengbr



# 1st Try

/Users/zheng/Developer/web_xzhengbr

| 层级       | 推荐工具             | 说明         |
| :--------- | :------------------- | :----------- |
| 内容管理   | Hugo                 |              |
| 代码仓库   | GitHub               |              |
| CI/CD      | GitHub Actions       |              |
| 托管平台   | GitHub Pages         |              |
| 域名注册   | Cloudflare Registrar | xzhengbr.com |
| DNS 解析   | Cloudflare DNS       |              |
| CDN 加速   | Cloudflare CDN       |              |
| 本地编辑器 | VS Code              |              |

## Tools

GO! Cursor!

In conclusion, around 4 hours, 90K tokens, with Codex 5.3

内容管理：Hugo

代码仓库：GitHub, 我的github网址：https://github.com/xzhengbr

托管平台：Github pages



## Problems during the progress

### 默认logo未修改

hugo.toml

  logo = "/img/blogophonic-mark-dark.png"
换logo sanjin triple points

### 社交展示项目
目前展示github, instagram, youtube

### 根目录设置
操作：在项目根目录执行
在 Cursor 里打开终端，然后先进入项目目录，再逐条执行命令。
进入项目根目录（根目录=有 hugo.toml 的目录）

```
cd /Users/zheng/Developer/web_xzhengbr && pwd
```

pwd 输出如果是 /Users/zheng/Developer/web_xzhengbr，就说明位置正确。


### details “详情”展示问题
默认为details,会跟随浏览器默认UI的语言变动。
已修改为：直接隐藏，详情折叠区，不会再显示。
Cursor新增了站点级样式文件 assets/custom.scss，加入：
.post-body > details {
  display: none;
}
这样只影响你站点显示，不改主题源码.

## 1st Mission Complete

结论：已完成从 0 到上线。

你的个人网站已经可访问：https://xzhengbr.github.io/。

你现在已经具备的能力：

本地写内容：改 content/ 后本地预览
线上发布：git add -> git commit -> git push 自动部署
基础页面：About / Blog / Resume / License / Contact
社交入口：GitHub / Instagram / YouTube
后续日常更新最小流程：

```
cd /Users/zheng/Developer/web_xzhengbr
git add .
git commit -m "Update site content"
git push
```

一句话验证：推送后到 GitHub Actions 看部署成功，再刷新线上站点确认内容更新。

## Summary of the 9 steps

1. 安装基础环境
   安装并验证了 Hugo 和 Git，具备本地生成网站与版本管理能力。

2. 创建 Hugo 站点骨架
   在 web_xzhengbr 下初始化站点结构（content、assets、hugo.toml 等），建立可开发基础。

3. 接入 Apéro 主题并修复初始报错
   用子模块引入 hugo-apero，修复了配置缺失导致的 SCSS 构建错误，让本地站点可运行。

4. 完成基础站点配置（英文为主）
   配置了站点标题、作者、语言、社交链接、导航菜单；并完成首页内容显示（姓名、简介、社交入口）。

5. 创建核心页面内容
   新建并填充 About、Resume、Blog（首篇文章）页面，导航链接可正常访问。

6. 清理并定制页脚
   保留 License 与 Contact，删除默认无关项；新增了自定义 License 与 Contact 页面内容。

7. 推送项目到 GitHub 仓库
   完成仓库初始化、首次提交、远程关联与推送，仓库 main 分支上线。

8. 配置 Hugo 的 GitHub Actions 部署
   新增 .github/workflows/hugo.yml，将 Pages 构建从默认 Jekyll 切换为 Hugo 正确构建链路。

9. 完成上线验证与仓库规范化
   验证 https://xzhengbr.github.io/ 可访问；新增根目录 .gitignore，避免继续跟踪构建产物和本地临时文件。



## Follow-up Maintenance and Precautions

主线：本地改内容 → 本地预览 → Git 提交推送 → Actions 自动发布。

### 内容编辑到网站发布的流程：

### 步骤 1：新建/修改内容

博客：content/blog/...
简历：content/resume/index.md
关于页：content/about/index.md

### 步骤 2：本地预览

在项目根目录运行：hugo server -D
打开 http://localhost:1313 检查样式、链接、错字

20260519: 补充一句：正式发布通常用 `hugo`（或 CI 里的 `hugo --minify`）来生成 `public` 静态文件。

- 比较：`hugo server -D`, `hugo`和`hugo --minify`的区别
  - 日常改页面：`hugo server -D` (包含draft)
  - hugo --minify 在 hugo 基础上压缩 HTML/CSS/JS 输出（体积更小），更接近线上部署结果
  - CI 常见还会加 hugo --gc --minify（清理未使用缓存/资源）
  - 提交前自检一次：`hugo --minify`（或与 CI 一致：`hugo --gc --minify`）
  - 写作阶段：开 `-D` 看草稿
  - 发布前检查：不用 `-D`，避免草稿误发。

### 步骤 3：提交代码

终端执行：

```
git add .
git commit -m "Update blog/resume content"
git push
```

### 步骤 4：自动发布

GitHub Actions 会自动构建并部署到 Pages
线上地址：https://xzhengbr.github.io/
步骤 5：上线验证
看 Actions 是否绿色成功
浏览器刷新线上站点确认内容已更新

一句话验证：`git push` 后 Actions 成功且线上看到新内容，就是发布完成。

### 后续维护注意

- 只改源码，不改产物
  主要改 content/、hugo.toml、assets/
  不要手动维护 public/、resources/（已在 .gitignore）

- 每次改动先本地看再推送
  避免把错链、排版错误直接上线

- 提交信息写清楚
  例如：Add post about ...、Update resume section

- 主题更新要谨慎
  themes/hugo-apero 是子模块，更新前先备份并本地预览

- 外部服务配置要长期可用
  Contact 用 Formspree 时，formspree_form_id、邮箱验证、域名白名单要保持有效

- 定期检查依赖和警告
  你现在有 languageCode 弃用警告，后续可以升级为新版 locale 配置

  20260518 已更新：把 `languageCode = "en"` 改为 `locale = "en-US"`（Hugo 新版推荐字段）。

## Better Todo

- 简历丰富及设置PDF下载链接
- 更新brief about yourself.

# 2nd Revise

### Points 

#### 站内图片管理

- 双线：全站通用文件放在 static/ + 某篇文章专用图片放在该文章目录

- **网站内调用文件命名统一：lowercase-with-hyphen**， 如：my-resume-2026.pdf（避免空格和中文名导致链接问题）

在 Markdown 里怎么引用：

引用 static/ 下文件（用绝对路径）
图片：![avatar](/media/images/site/avatar.jpg)
PDF：[Download Resume](/media/pdf/resume/Xin_Zheng_Resume.pdf)
引用文章私有图片（用相对路径）
在 index.md 里写：![diagram](diagram-1.png)

### To do in the Main 

- [x] <u>Personal Website</u> - SOCIAL SCIENCE & SOCIAL

- [x] A rookie in coding, sharing blog posts <u>and my resume</u>. - and random thoughts
- [x] Self graph  水彩速写风格，注意首页背景色为#f2f2f1
- [x] Self graph version: lucid vs square background [later, now use square]
- [x] zoom in and out problem footer problem
- [x] the default logo to trigold points
  1. 顶部导航 logo
  2. 浏览器页签图标（favicon）
- [x] 右上角删掉社交图标，增加搜索图标和功能
- [x] 右上角Resume 改成CV
- [ ] **未来配色如调整，可参考：https://silviacanelon.com/**

content/_index.md

**description**

A rookie in coding, sharing blogs and my random thoughts.

I was a product/human resource manager in the asset management industry. Now, I am studying Social Science at HKUST, with a particular interest in Comparative Politics and Political Economy. I enjoy embarking on new journeys toward an unknown and diverse future and engaging with "Genki" communities.



### To do in the About

#### Title

Ni Hao do you do!<br>I'm Xin Zheng, it’s nice to meet you

#### Card part

selfie-round

Xin Zheng

Social Science & Social

social networks

#### Content

**Paragraph about Ni Hao.**

Okay, I admit "How do you do" is way too old-fashioned. But as a Chinese person surrounded by "Ni Hao" every day, plus being a fan of puns, I just couldn't pass up the chance to play around with these two greetings.

Speaking of pronunciation, my first name "鑫 (Xin)" sounds like "SING" in Mandarin or "YUM" in Cantonese (though you can always just call me Charlie). Besides, "鑫" literally means very rich in Chinese. Sorry Name — I think I've betrayed you at a significant level. 

This very character is also the inspiration behind my website's logo. Here is the evolution of the design:

insert a png. tpp2.png

**Blabla about study.**

**Blabla about work.**

**Paragraph about cities.**

I have lived in Huangshan, Zhuhai, Guangzhou, Shanghai, Hefei and Hong Kong. These cities are well known for their scenery, cozy vibe, food, modern life, "nothing" and humidity, respectively.

[only link Huangshan to wiki, later can translate to your posts: https://en.wikipedia.org/wiki/Huangshan]

about-avatar-filtered.png 中心均匀裁剪，宽高各减少 10%

This blog is built with [blogdown](https://github.com/rstudio/blogdown) and [Hugo](https://gohugo.io/), and deployed using [Netlify](https://www.netlify.com/). My blog posts are released under a Creative Commons Attribution-ShareAlike 4.0 International License. 







### To do in the Resume

Sales/ Marketing Manager --- change to "Product/Marketing Manager"

add - 产品整理，架构梳理，产品方案设计，拥有丰富的从0到1（设计到销售）资管产品operational经验。



### To do in the Blog



### To do in the Project

#### CalCurator





### 