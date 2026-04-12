**.\xray_windows_amd64.exe ws --listen 127.0.0.1:7777 --html-output testphp.html**

**.\xray_windows_amd64.exe servicescan --target 127.0.0.1:8009**

xray_windows_amd64.exe ws --url "https://fumo.secret-sealing.club/admin" --html-output 1.html

poc编写
字典变量path:
  {{BaseURL}}
  RootURL
  HostURL

指定poc进行扫描

xray_windows_amd64.exe ws --ws poc-yaml-manageengine-servicedesk-cve-2017-11512 -u "http://testphp.vulnweb.com" --ho 5.html 
指定poc进行扫描，需要将poc写在xray的可执行目录下


使用网页爬虫进行漏洞测试

xray_windows_amd64.exe ws --basic-crawler "http://testphp.vulnweb.com" --ho 6.html 使用网页爬虫，爬取网站上所有的链接，并将链接加入到测试队列中


在使用爬虫模式时，只能对单个url链接进行爬虫模式扫描

批量网站扫描
xray_windows_amd64.exe ws --uf target.txt --ho 5.html 将目标站点放入文件中，实现批量目标扫描



在实际工作中，可以通过选择一种扫描方式，然后利用 —poc和—plugins的组合，来控制扫描使用的poc
————————————————
原文链接：https://blog.csdn.net/qq_48368964/article/details/141112075





GET //api/v2/dashboard/base/os HTTP/2.0

Host: 117.72.101.92:9999

user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:141.0) Gecko/20100101 Firefox/141.0

Content-Type: application/json