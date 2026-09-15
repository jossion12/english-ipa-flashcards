@echo off
REM 音标打乱练习 - 一键启动开发服务器
REM 需要 Node.js 20+；本机 node 位于 Kimi 运行时目录
set "PATH=H:\tool\Kimi\resources\resources\runtime;%PATH%"
cd /d "%~dp0"
echo ==========================================
echo   音标打乱练习 启动中...
echo   启动后请在浏览器打开: http://localhost:7100/
echo   关闭本窗口即停止服务
echo ==========================================
call npm run dev -- --port 7100 --strictPort
pause
