# 新疆润欣丰 · 公司官网

一个基于原生 HTML / CSS / JavaScript 的静态企业官网，采用 **DeepSeek 光网风格**（品牌红橙配色）：浅色暖底、红橙渐变（`#E53935 → #FF7043`）、柔和光晕与光网网格背景、圆角卡片、现代排版。

## 页面结构

| 文件 | 板块 |
| --- | --- |
| `index.html` | 首页（Hero 轮播、数据条、核心品类、精选产品、资讯预览、品质保障、视频中心） |
| `products.html` | 产品介绍（新疆红花、甘草、肉苁蓉、枸杞、雪菊等 12 个道地药材，支持分类筛选） |
| `industry.html` | 行业动态 |
| `news.html` | 新闻中心 |
| `about.html` | 关于我们（简介、发展历程、品质保障、基地风采） |
| `contact.html` | 联系我们（联系方式 + 在线留言表单） |

## 联系方式

- 地址：新疆伊犁哈萨克自治州昭苏县萨尔阔布镇莫因仓村康养路十八巷05号
- 电话：13565221821
- 邮箱：shimeirong2008@163.com

## 本地预览

直接双击 `index.html` 即可在浏览器打开，无需任何构建工具或服务器。

## 发布到 GitHub Pages

本仓库根目录即为站点根目录，可直接部署：

1. 在 GitHub 新建一个**公开**仓库（建议名：`runxinfeng`），不要勾选 README。
2. 将本目录推送到该仓库的 `main` 分支。
3. 仓库 **Settings → Pages → Build and deployment → Source** 选择 **Deploy from a branch**，分支选 `main`，目录选 `/ (root)`，保存。
4. 稍等片刻，站点将发布到 `https://<你的用户名>.github.io/<仓库名>/`。
