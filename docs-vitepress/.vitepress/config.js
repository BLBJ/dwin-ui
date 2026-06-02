export default {
    base: '/dwin-ui/',
    outDir: '../docs',
    appearance: false,
    themeConfig: {
        siteTitle: 'DWin UI',
        logo: "image/logo.png",
        nav: [
            { text: "指南", link: "/guide/installation" },
            { text: "组件", link: "/components/button" },
            { text: "V1.0.0", link:"https://github.com/BLBJ/dwin-ui" },
            { text: "作者", link: "/author/intro" },
        ],
        socialLinks: [{ icon: "github", link: "https://github.com/BLBJ/dwin-ui" }],
        sidebar: {
            "/guide/": [
                {
                    text: "基础",
                    items: [
                        {
                            text: "安装",
                            link: "/guide/installation",
                        },
                        {
                            text: "快速开始",
                            link: "/guide/quickstart",
                        },
                        {
                            text: "主题",
                            link: "/guide/theme",
                        }
                    ],
                },

            ],
            "/components/": [
                {
                    text: "基础组件",
                    items: [
                        {
                            text: "Button 按钮",
                            link: "/components/button",
                        },
                        {
                            text: "Icon 图标",
                            link: "/components/icon",
                        },
                    ],
                },
                {
                    text: "数据录入",
                    items: [
                        {
                            text: "选择器 Select",
                            link: "/components/select",
                        },
                        {
                            text: "输入框 Input",
                            link: "/components/input",
                        },
                        {
                            text: "数字输入框 InputNumber",
                            link: "/components/inputNumber",
                        },
                        {
                            text: "单选框 Radio",
                            link: "/components/radio",
                        },
                        {
                            text: "多选框 Checkbox",
                            link: "/components/checkbox",
                        },
                        {
                            text: "日期选择框  PickTimer",
                            link: "/components/pickTimer",
                        },
                        {
                            text: "树选择 TreeSelect",
                            link: "/components/TreeSelect",
                        },
                        {
                            text: "滑动输入条 Slider",
                            link: "/components/slider", 
                        },
                        {
                            text: "开关 Switch",
                            link: "/components/switch", 
                        },
                        {
                            text: "表单 Form",
                            link: "/components/form",  
                        }
                    ],
                },
                {
                    text: "提示反馈",
                    items: [
                        {
                            text: "全局提示 Prompt",
                            link: "/components/prompt",
                        },
                        {
                            text: "对话弹窗 Modal",
                            link: "/components/Modal",
                        },
                    ],
                },
                {
                    text: "数据展示",
                    items: [
                        {
                            text: "表格 Table",
                            link: "/components/table",
                        },
                        {
                            text: "分页 Page",
                            link: "/components/page",
                        },
                        {
                            text: "树形控件 Tree",
                            link: "/components/tree",
                        },
                        {
                            text: "圆环 Ring",
                            link: "/components/ring",
                        },
                        {
                            text: "标签页 Tabs",
                            link: "/components/tabs",
                        },
                        {
                            text: "数值统计 scrollNum",
                            link: "/components/scrollNum",  
                        }
                    ],
                },
                {
                    text: "其他",
                    items: [
                        {
                            text: "图片查看器",
                            link: "/components/imageView",
                        }
                    ],
                }
            ],
          
        },
        footer: {
            message: 'Released under the MIT License.',
            copyright: 'Copyright © 2023-present dingwenbo'
        }
    },
}

