

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

GO! Cursor!

内容管理：Hugo

代码仓库：GitHub, 我的github网址：https://github.com/xzhengbr

托管平台：Github pages

#### 默认logo未修改
hugo.toml

  logo = "/img/blogophonic-mark-dark.png"
换logo sanjin triple points

#### 社交展示项目
目前展示github, instagram, youtube

#### 根目录设置
操作：在项目根目录执行
在 Cursor 里打开终端，然后先进入项目目录，再逐条执行命令。
进入项目根目录（根目录=有 hugo.toml 的目录）
···
cd /Users/zheng/Developer/web_xzhengbr
pwd
···
pwd 输出如果是 /Users/zheng/Developer/web_xzhengbr，就说明位置正确。


#### detail “详情”展示问题
默认为details,会跟随浏览器默认UI的语言变动。
已修改为：直接隐藏，详情折叠区，不会再显示。
Cursor新增了站点级样式文件 assets/custom.scss，加入：
.post-body > details {
  display: none;
}
这样只影响你站点显示，不改主题源码.

####
注意，第 6 步的时候把 hugo.toml 里的默认页脚链接（License / Contact / Contributors）删掉了，以后还是可以加回来，参考别人的模版。