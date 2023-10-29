---
title: in东师/inNENU 维护介绍
icon: info
category: 小程序
---

## 简介

in东师/inNENU 小程序、App 的大部分页面都均由 YAML 文件生成。开发者只需要使用编辑器编辑 YAML，即可增添或修改小程序页面。

::: info YAML

YAML 是专门用来写配置文件的语言，非常简洁和强大，其设计目标，就是方便人类读写。

:::

## 快速上手

1. 为了编写小程序页面配置文件，您需要先学习 [YAML 的规则](./yaml.md)，同时简单浏览一下一款编辑器 [VSCode 的介绍](https://mister-hope.com/software/vscode/simple.html)
1. 掌握上述两个内容之后，您就可以尝试对照 [小程序简易参数表](./tag-list.md) 通过 VSCode 编写页面 YAML 文件了，如果您觉得直接上手太难，您可以参阅 [交互式教程](./get-started.md) 来体验一个示例。

::: tip 更多参考

所有的小程序页面都在 <https://github.com/inNENU/resource/blob/main/pages/> 下，您可以尽情的进行参考。

:::

## 开发注意事项

下面是开发中需要注意的一些问题。

### 文件命名

由于小程序的访问是通过网址进行的，需要避免中文。页面 YAML 和媒体文件的文件名，请遵守以下命名规则:

1. 文件名只包含英文与数字和 `-`，不要包含特殊符号、空格或者中文字符。由多个单词组成的文件名建议使用 `-` 链接。如 `厚普公益学校` 可以表示为 `hope-good-school`。
1. 尽可能使用简短的单词，必要时可缩写，比如使用 `intro` `desc` `guide` 而不是 `introduction` `description`，`handbook`。
1. 表达相同或相近内容的多个媒体文件用 "短词组+编号" 的形式即可，不要试图用很长的文字命名。

### 文本排版

1. 中文和英文之间最好使用空格隔开
1. 尽量使用英文的括号

### 注意高亮

如果您在使用 VSCode 进行编辑，您可能会注意到，数字和布尔值、字符串、对象的键名使用三种不同的颜色进行高亮。

如果您编写的文件出现“红色波浪线”，或您编写的内容的高亮颜色，和其类型不符，那么说明您编写的格式出现了错误。

### 图片压缩

图片在拍摄需使用 [Squoosh](https://squoosh.app/) 进行压缩。

- 含有透明区域的图片需要压缩至 Browser PNG 格式
- Gif 无需压缩
- 其他图片压缩到 MozJpeg

不含有文字、不需要细节的图片保持 4 万左右分辨率即可，如果图片使用后置摄像机拍摄，即 12 万或 20 万像素，压缩时可酌情考虑 50% 缩放。

### 文件转码

由于 QQ 小程序对 2003 版本 Office 格式支持极差，即 `.doc` `.xls` `.ppt`。如遇到此类文件，请尝试用 Office 打开，并转换为最新版格式 (`docx`、`xlsx`、`pptx`)。具体方式为 “文件” - “信息” - “转换”。

### 媒体文件存放

由于 YAML 是纯文本文件，所有的图片、文件等需单独列出，并在对应的配置项处填入对应的网址。

如:

- **img** 组件的 `src`
- **doc** 组件的 `url`

in东师/inNENU 服务器文件结构如下:

- 文件存放在 `https://mp.innenu.com/file/` 下
- 图片存放在 `https://mp.innenu.com/img/` 下
- 页面 YAML 存放在 `https://mp.innenu.com/pages/` 下
- 图标存放在 `https://mp.innenu.com/data/icon/` 下

::: info

关于完整的服务器文件结构，请访问 <https://github.com/inNENU/resource>

:::

### 点位获取

如需获取地理点位，请使用 [腾讯地图选点工具](https://lbs.qq.com/getPoint/)。
