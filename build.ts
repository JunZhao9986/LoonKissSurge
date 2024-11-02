/** @format */

import path from "node:path";
import { promises as fs, Dirent } from "node:fs"; // 使用 fs.promises 和 Dirent

const REPO_URL =
    "https://raw.githubusercontent.com/QingRex/LoonKissSurge/refs/heads/main/";
const ROOT_DIR = process.cwd(); // 根目录
const OUTPUT_DIR = path.join(ROOT_DIR, "public");

// 仅包括特定后缀类型的文件
const allowedExtensions = [
    ".sgmodule",
    ".list",
    ".txt",
    ".js",
    ".json",
    ".gitignore",
    ".md",
];
const allowedDirectories = ["Official", "Surge", "Beta"];

const prioritySorter = (a: Dirent, b: Dirent) => {
    if (a.isDirectory() && !b.isDirectory()) return -1;
    if (!a.isDirectory() && b.isDirectory()) return 1;
    if (a.isDirectory() && b.isDirectory()) {
        if (a.name === "Official") return -1;
        if (b.name === "Official") return 1;
    }
    return a.name.localeCompare(b.name);
};

// 生成目录树
async function walk(dir: string, baseUrl: string) {
    let tree = "";
    const entries = await fs.readdir(dir, { withFileTypes: true });
    entries.sort(prioritySorter);

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const url = `${baseUrl}${encodeURIComponent(entry.name)}`;

        if (entry.isDirectory() && allowedDirectories.includes(entry.name)) {
            tree += `
                <li class="folder">
                    ${entry.name}
                    <ul>
                        ${await walk(fullPath, `${url}/`)}
                    </ul>
                </li>
            `;
        } else if (allowedExtensions.some((ext) => entry.name.endsWith(ext))) {
            tree += `
                <li>
                    <a class="file" href="${url}" target="_blank">${entry.name}
                        <a
                            style="border-bottom: none"
                            href="surge:///install-module?url=${encodeURIComponent(
                                url
                            )}"
                            target="_blank"
                        >
                            <img
                            alt="导入 Surge(远程模块)"
                            title="导入 Surge(远程模块)"
                            style="height: 22px"
                            src="https://raw.githubusercontent.com/xream/scripts/refs/heads/main/scriptable/surge/surge-transparent.png"
                            />
                        </a>
                        <a
                            style="border-bottom: none"
                            href="scriptable:///run/SurgeModuleTool?url=${encodeURIComponent(
                                url
                            )}"
                            target="_blank"
                        >
                            <img
                            alt="导入 Surge(本地模块 需配合 Scriptable + Script Hub 的 Surge 模块工具)"
                            title="导入 Surge(本地模块 需配合 Scriptable + Script Hub 的 Surge 模块工具)"
                            style="height: 22px"
                            src="https://raw.githubusercontent.com/Script-Hub-Org/Script-Hub/refs/heads/main/assets/icon512x512.png"
                            />
                        </a>
                    </a>
                </li>
            `;
        }
    }
    return tree;
}

function generateHtml(tree: string) {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Repository Structure</title>
            <link rel="stylesheet" href="https://cdn.skk.moe/ruleset/css/21d8777a.css" />
            <style>
                 /* 文件夹样式 */
                .folder {
                    cursor: pointer;
                    font-weight: bold;
                    list-style-type: none;
                    padding-left: 0
                }
                .folder ul {
                    display: block;
                    border-left: 1px dashed #ddd;
                    margin-left: 10px;
                    padding-left: 20px
                }
                .folder.collapsed ul {
                    display: none;
                }
                .hidden {
                    display: none;
                }
            
                /* 搜索框样式 */
                #search {
                    width: 100%;
                    padding: 10px 15px;
                    margin: 20px 0;
                    font-size: 1rem;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
                    transition: all 0.3s ease;
                }
                #search:focus {
                    border-color: #007bff;
                    outline: none;
                    box-shadow: 0px 4px 12px rgba(0, 123, 255, 0.4);
                }
            
                /* 容器的整体布局调整 */
                .container {
                    padding: 20px;
                }
                .search-section {
                    margin-bottom: 30px; /* 添加底部外边距 */
                }
                .directory-list {
                    margin-top: 20px; /* 树形目录顶部增加空隙 */
                    padding-left: 0; /* 确保与其他内容左对齐 */
                }
            </style>
        </head>
        <body>
        <main class="container">
            <h1> LoonKissSurge Repository </h1>
            <p>
            Made by <a href="https://github.com/QingRex">Ling KeQing</a> | <a href="https://github.com/QingRex/LoonKissSurge/">Source @ GitHub</a>  | Fork <a href="https://github.com/SukkaW/Surge">Sukka</a> 
            </p>
            <p>
            Thanks To <a href="https://github.com/luestr">iKeLee</a> For Her Great Work
            <br>
            Thanks To All Surge Contributors
            </p>
            <p>Last Build: ${new Date().toLocaleString("zh-CN", {
                timeZone: "Asia/Shanghai",
            })}</p>
            <br>

            <!-- 搜索和提示区域 -->
            <div class="search-section">
                <input type="text" id="search" placeholder="🔍 搜索文件和文件夹..."/>
                <span>ℹ️ 一键导入操作说明</span>
                <br>
                <small>
                    <img
                        alt="导入 Surge(远程模块)"
                        title="导入 Surge(远程模块)"
                        style="height: 22px"
                        src="https://raw.githubusercontent.com/xream/scripts/refs/heads/main/scriptable/surge/surge-transparent.png"
                    />
                    点击此图标, 可一键导入 Surge(远程模块)
                </small>
                <br>
                <small>
                    <img
                    alt="导入 Surge(本地模块 需配合 Scriptable + Script Hub 的 Surge 模块工具)"
                    title="导入 Surge(本地模块 需配合 Scriptable + Script Hub 的 Surge 模块工具)"
                    style="height: 22px"
                    src="https://raw.githubusercontent.com/Script-Hub-Org/Script-Hub/refs/heads/main/assets/icon512x512.png"
                    />
                    点击此图标, 可一键导入 Surge(本地模块 需配合 <a href="https://apps.apple.com/app/scriptable/id1405459188">Scriptable</a> + <a href="https://github.com/Script-Hub-Org/Script-Hub/wiki/%E7%9B%B8%E5%85%B3%E7%94%9F%E6%80%81:-Surge-%E6%A8%A1%E5%9D%97%E5%B7%A5%E5%85%B7">Script Hub 的 Surge 模块工具</a>)
                </small>
            </div>

            <!-- 目录树 -->
            <ul class="directory-list">
                ${tree}
            </ul>
        </main>
        <script>
            document.addEventListener("DOMContentLoaded", () => {
                const searchInput = document.getElementById('search');
                searchInput.addEventListener('input', (event) => {
                    const searchTerm = event.target.value.toLowerCase();
                    const items = document.querySelectorAll('.directory-list li');
                    const foldersToExpand = new Set();
                
                    items.forEach(item => {
                        const text = item.textContent.toLowerCase();
                        if (text.includes(searchTerm)) {
                            item.classList.remove('hidden');
                            // 将当前项的父文件夹添加到展开集合中
                            let currentItem = item.closest('ul').parentElement;
                            while (currentItem && currentItem.classList.contains('folder')) {
                                foldersToExpand.add(currentItem);
                                currentItem = currentItem.closest('ul').parentElement;
                            }
                        } else {
                            item.classList.add('hidden');
                        }
                    });
                
                    // 展开所有需要展开的文件夹
                    foldersToExpand.forEach(folder => {
                        folder.classList.remove('collapsed');
                    });
                });
            
                document.querySelectorAll('.folder').forEach(folder => {
                    folder.addEventListener('click', (event) => {
                        if (event.target.classList.contains('file')) {
                                return; 
                                }
                        event.stopPropagation();
                        folder.classList.toggle('collapsed');
                    });
                });
            });
        </script>
        </body>
        </html>
    `;
}

async function writeHtmlFile(html: string) {
    const htmlFilePath = path.join(OUTPUT_DIR, "index.html");
    await fs.writeFile(htmlFilePath, html, "utf8");
}

// 构建
async function build() {
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    const tree = await walk(ROOT_DIR, REPO_URL);
    const html = generateHtml(tree);
    await writeHtmlFile(html);
}

build().catch((err) => {
    console.error("Error during build:", err);
});
