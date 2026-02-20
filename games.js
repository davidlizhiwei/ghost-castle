// 创建背景粒子
function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 5 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        container.appendChild(particle);
    }
}
createParticles();

// 加载游戏
function loadGame(gameName) {
    document.getElementById('game-selector').style.display = 'none';
    document.getElementById('back-btn').style.display = 'block';
    if (gameName === 'ghost-castle') {
        loadGhostCastle();
    } else if (gameName === 'lucky-wheel') {
        loadLuckyWheel();
    }
}

// 显示游戏选择器
function showGameSelector() {
    document.getElementById('game-selector').style.display = 'block';
    document.getElementById('back-btn').style.display = 'none';
    document.getElementById('ghost-castle-container').style.display = 'none';
    document.getElementById('lucky-wheel-container').style.display = 'none';
    document.getElementById('ghost-castle-container').innerHTML = '';
    document.getElementById('lucky-wheel-container').innerHTML = '';
}

// ============== 幸运大转盘游戏 ==============
function loadLuckyWheel() {
    const container = document.getElementById('lucky-wheel-container');
    container.style.display = 'block';
    container.innerHTML = `
        <div class="lw-container" style="text-align: center; max-width: 600px; width: 100%; padding: 20px;">
            <h1 class="lw-title" style="font-size: 2.5rem; color: #ffffff; margin-bottom: 30px; text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);">🎉 幸运大转盘 🎉</h1>
            <div class="lw-wheel-container" style="position: relative; display: inline-block; margin-bottom: 30px;">
                <div class="lw-wheel-wrapper" style="position: relative; width: 400px; height: 400px; margin: 0 auto;">
                    <canvas id="lw-wheel" width="500" height="500" style="width: 100%; height: 100%; border-radius: 50%;"></canvas>
                    <div class="lw-pointer" style="position: absolute; top: -20px; left: 50%; transform: translateX(-50%); width: 40px; height: 50px; z-index: 10;"></div>
                </div>
                <button id="lw-spin-btn" style="display: block; margin: 30px auto; padding: 18px 60px; font-size: 1.5rem; font-weight: bold; color: #ffffff; background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); border: none; border-radius: 50px; cursor: pointer; box-shadow: 0 8px 25px rgba(231, 76, 60, 0.4); transition: all 0.3s ease;">开始抽奖</button>
            </div>
            <div id="lw-result" style="min-height: 80px; margin: 20px 0; padding: 20px; border-radius: 15px; background: rgba(255, 255, 255, 0.1); border: 2px solid rgba(255, 215, 0, 0.3);"></div>
            <div class="lw-settings" style="margin-top: 40px; padding: 25px; background: rgba(255, 255, 255, 0.05); border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.1);">
                <h3 style="color: #ffffff; margin-bottom: 20px;">🎁 奖品设置</h3>
                <div id="lw-prizes-list" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px; margin-bottom: 20px;"></div>
                <button id="lw-add-btn" style="padding: 10px 25px; font-size: 1rem; border: none; border-radius: 25px; cursor: pointer; margin: 5px; background: linear-gradient(135deg, #27ae60, #229954); color: white;">+ 添加奖品</button>
                <button id="lw-reset-btn" style="padding: 10px 25px; font-size: 1rem; border: none; border-radius: 25px; cursor: pointer; margin: 5px; background: linear-gradient(135deg, #7f8c8d, #95a5a6); color: white;">重置默认</button>
            </div>
        </div>
        <style>
            @keyframes lw-glow { 0%, 100% { text-shadow: 0 0 20px rgba(255, 215, 0, 0.5); } 50% { text-shadow: 0 0 40px rgba(255, 215, 0, 0.8), 0 0 60px rgba(255, 215, 0, 0.4); } }
            .lw-pointer::before { content: ''; position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 20px solid transparent; border-right: 20px solid transparent; border-top: 50px solid #e74c3c; filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3)); }
            .lw-pointer::after { content: ''; position: absolute; top: 10px; left: 50%; transform: translateX(-50%); width: 20px; height: 20px; background: #ffd700; border-radius: 50%; box-shadow: 0 0 10px rgba(255, 215, 0, 0.8); }
            #lw-spin-btn:hover:not(:disabled) { transform: translateY(-3px); box-shadow: 0 12px 35px rgba(231, 76, 60, 0.6); }
            #lw-spin-btn:active:not(:disabled) { transform: translateY(0); }
            #lw-spin-btn:disabled { opacity: 0.6; cursor: not-allowed; }
            .lw-result-show { animation: lw-result-pop 0.5s ease-out; }
            @keyframes lw-result-pop { 0% { transform: scale(0.8); opacity: 0; } 50% { transform: scale(1.05); } 100% { transform: scale(1); opacity: 1; } }
            #lw-result h2 { color: #ffd700; font-size: 1.8rem; margin-bottom: 10px; }
            #lw-result p { color: #ffffff; font-size: 1.3rem; }
            .lw-prize-item { display: flex; align-items: center; gap: 8px; padding: 10px 15px; background: rgba(255, 255, 255, 0.1); border-radius: 10px; color: #ffffff; font-size: 0.9rem; }
            .lw-prize-color { width: 20px; height: 20px; border-radius: 50%; flex-shrink: 0; border: 2px solid rgba(255, 255, 255, 0.3); }
            .lw-prize-name { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
            #lw-add-btn:hover, #lw-reset-btn:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(127, 140, 141, 0.4); }
            .lw-confetti { position: fixed; width: 10px; height: 10px; background: #ffd700; animation: lw-confetti-fall 3s ease-out forwards; pointer-events: none; z-index: 1000; }
            @keyframes lw-confetti-fall { 0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; } 100% { transform: translateY(100vh) rotate(720deg); opacity: 0; } }
            @media (max-width: 500px) { .lw-wheel-wrapper { width: 300px; height: 300px; } .lw-title { font-size: 1.8rem; } #lw-spin-btn { padding: 15px 40px; font-size: 1.2rem; } #lw-prizes-list { grid-template-columns: repeat(2, 1fr); } }
        </style>
        <script>
            (function() {
                const canvas = document.getElementById('lw-wheel');
                const ctx = canvas.getContext('2d');
                const spinBtn = document.getElementById('lw-spin-btn');
                const resultDiv = document.getElementById('lw-result');
                const prizesList = document.getElementById('lw-prizes-list');
                const addBtn = document.getElementById('lw-add-btn');
                const resetBtn = document.getElementById('lw-reset-btn');

                const defaultPrizes = [
                    { name: '一等奖', color: '#e74c3c' },
                    { name: '二等奖', color: '#3498db' },
                    { name: '三等奖', color: '#2ecc71' },
                    { name: '四等奖', color: '#f39c12' },
                    { name: '五等奖', color: '#9b59b6' },
                    { name: '六等奖', color: '#1abc9c' },
                    { name: '七等奖', color: '#e91e63' },
                    { name: '八等奖', color: '#00bcd4' }
                ];

                let prizes = JSON.parse(localStorage.getItem('luckyWheelPrizes')) || [...defaultPrizes];
                let currentRotation = 0;
                let isSpinning = false;

                function lightenColor(color, percent) {
                    const num = parseInt(color.replace('#', ''), 16);
                    const amt = Math.round(2.55 * percent);
                    const R = Math.min(255, (num >> 16) + amt);
                    const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
                    const B = Math.min(255, (num & 0x0000FF) + amt);
                    return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
                }

                function drawWheel() {
                    const centerX = canvas.width / 2;
                    const centerY = canvas.height / 2;
                    const radius = Math.min(centerX, centerY) - 10;
                    const sliceAngle = (2 * Math.PI) / prizes.length;

                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.beginPath();
                    ctx.arc(centerX, centerY, radius + 8, 0, 2 * Math.PI);
                    ctx.fillStyle = '#ffd700';
                    ctx.fill();

                    prizes.forEach((prize, index) => {
                        const startAngle = index * sliceAngle - Math.PI / 2;
                        const endAngle = (index + 1) * sliceAngle - Math.PI / 2;
                        ctx.beginPath();
                        ctx.moveTo(centerX, centerY);
                        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
                        ctx.closePath();
                        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
                        gradient.addColorStop(0, lightenColor(prize.color, 30));
                        gradient.addColorStop(1, prize.color);
                        ctx.fillStyle = gradient;
                        ctx.fill();
                        ctx.strokeStyle = '#fff';
                        ctx.lineWidth = 2;
                        ctx.stroke();
                        ctx.save();
                        ctx.translate(centerX, centerY);
                        ctx.rotate(startAngle + sliceAngle / 2);
                        ctx.textAlign = 'right';
                        ctx.fillStyle = '#fff';
                        ctx.font = 'bold 18px "Segoe UI", sans-serif';
                        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
                        ctx.shadowBlur = 4;
                        ctx.fillText(prize.name, radius - 30, 6);
                        ctx.restore();
                    });

                    ctx.beginPath();
                    ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
                    ctx.fillStyle = '#ffd700';
                    ctx.fill();
                    ctx.strokeStyle = '#fff';
                    ctx.lineWidth = 3;
                    ctx.stroke();
                    ctx.fillStyle = '#fff';
                    ctx.font = 'bold 24px "Segoe UI", sans-serif';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('★', centerX, centerY);
                }

                function spin() {
                    if (isSpinning) return;
                    isSpinning = true;
                    spinBtn.disabled = true;
                    resultDiv.innerHTML = '';
                    resultDiv.classList.remove('lw-result-show');

                    const minSpins = 5;
                    const extraRotation = Math.random() * 2 * Math.PI;
                    const totalRotation = minSpins * 2 * Math.PI + extraRotation;
                    const startRotation = currentRotation;
                    const startTime = performance.now();
                    const duration = 4000;

                    const animate = (currentTime) => {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const easeOut = 1 - Math.pow(1 - progress, 4);
                        currentRotation = startRotation + totalRotation * easeOut;
                        canvas.style.transform = 'rotate(' + currentRotation + 'rad)';
                        canvas.style.transition = 'none';

                        if (progress < 1) {
                            requestAnimationFrame(animate);
                        } else {
                            isSpinning = false;
                            spinBtn.disabled = false;
                            showResult();
                        }
                    };
                    requestAnimationFrame(animate);
                }

                function showResult() {
                    const normalizedRotation = currentRotation % (2 * Math.PI);
                    const sliceAngle = (2 * Math.PI) / prizes.length;
                    let prizeIndex = Math.floor(((2 * Math.PI - normalizedRotation + Math.PI / 2) % (2 * Math.PI)) / sliceAngle);
                    prizeIndex = (prizeIndex + prizes.length) % prizes.length;
                    const winner = prizes[prizeIndex];

                    resultDiv.innerHTML = '<h2>🎊 恭喜你！🎊</h2><p>获得：' + winner.name + '</p>';
                    resultDiv.classList.add('lw-result-show');
                    createConfetti();
                }

                function createConfetti() {
                    const colors = ['#ffd700', '#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6'];
                    for (let i = 0; i < 50; i++) {
                        setTimeout(() => {
                            const confetti = document.createElement('div');
                            confetti.className = 'lw-confetti';
                            confetti.style.left = Math.random() * 100 + 'vw';
                            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
                            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
                            confetti.style.transform = 'rotate(' + (Math.random() * 360) + 'deg)';
                            document.body.appendChild(confetti);
                            setTimeout(() => confetti.remove(), 4000);
                        }, i * 30);
                    }
                }

                function renderPrizesList() {
                    prizesList.innerHTML = prizes.map(prize =>
                        '<div class="lw-prize-item"><div class="lw-prize-color" style="background: ' + prize.color + '"></div><span class="lw-prize-name">' + prize.name + '</span></div>'
                    ).join('');
                }

                function addPrize() {
                    const name = prompt('请输入奖品名称：');
                    if (!name || name.trim() === '') return;
                    const color = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
                    prizes.push({ name: name.trim(), color });
                    savePrizes();
                    drawWheel();
                    renderPrizesList();
                }

                function resetPrizes() {
                    if (confirm('确定要重置为默认奖品吗？')) {
                        prizes = [...defaultPrizes];
                        savePrizes();
                        drawWheel();
                        renderPrizesList();
                    }
                }

                function savePrizes() {
                    localStorage.setItem('luckyWheelPrizes', JSON.stringify(prizes));
                }

                spinBtn.addEventListener('click', spin);
                addBtn.addEventListener('click', addPrize);
                resetBtn.addEventListener('click', resetPrizes);
                drawWheel();
                renderPrizesList();
            })();
        <\/script>
    `;
}

// ============== 幽灵古堡游戏 ==============
function loadGhostCastle() {
    const container = document.getElementById('ghost-castle-container');
    container.style.display = 'block';
    container.innerHTML = `
        <div id="gc-game-container" style="position: relative; width: 100%; height: 100vh;">
            <div id="gc-start-screen" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; background: radial-gradient(ellipse at center, #2a1a4e 0%, #0a0a0a 100%); z-index: 100;">
                <h1 style="font-size: 3em; color: #8b5cf6; text-shadow: 0 0 20px #8b5cf6, 0 0 40px #6d28d9; margin-bottom: 20px;">🏰 幽灵古堡探险 👻</h1>
                <p style="font-size: 1.2em; color: #c4b5fd; margin-bottom: 40px; text-align: center; max-width: 600px;">你被困在一座神秘的古堡里...<br>找到 5 个魔法水晶，解开谜题，逃离这里！<br>但要小心，古堡里不只有你一个人...</p>
                <button id="gc-start-btn" style="padding: 15px 40px; font-size: 1.3em; background: linear-gradient(45deg, #6d28d9, #8b5cf6); border: none; border-radius: 30px; color: white; cursor: pointer; transition: all 0.3s; box-shadow: 0 0 20px rgba(139, 92, 246, 0.5);">开始探险</button>
            </div>
            <div id="gc-game-screen" style="display: none; width: 100%; height: 100%; position: relative;">
                <div id="gc-room" style="position: relative; width: 100%; height: 100%; background-size: cover; background-position: center; transition: background 0.5s;">
                    <div id="gc-flashlight" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: radial-gradient(circle at 50% 50%, transparent 10%, rgba(0,0,0,0.95) 50%, rgba(0,0,0,1) 100%); pointer-events: none; z-index: 10;"></div>
                </div>
                <div id="gc-ui" style="position: absolute; top: 20px; left: 20px; z-index: 20; font-size: 1.2em;">
                    <div style="background: rgba(0, 0, 0, 0.7); padding: 10px 20px; border-radius: 10px; margin-bottom: 10px; border: 2px solid #4c1d95;">💎 水晶：<span id="gc-crystal-count">0</span>/5</div>
                    <div style="background: rgba(0, 0, 0, 0.7); padding: 10px 20px; border-radius: 10px; margin-bottom: 10px; border: 2px solid #4c1d95;">❤️ 生命：<span id="gc-health">3</span></div>
                </div>
                <div id="gc-hint" style="position: absolute; top: 20px; right: 20px; z-index: 20; background: rgba(0, 0, 0, 0.7); padding: 10px 20px; border-radius: 10px; border: 2px solid #6d28d9; color: #c4b5fd; cursor: pointer;">💡 提示</div>
                <div id="gc-inventory" style="position: absolute; bottom: 20px; left: 20px; z-index: 20; background: rgba(0, 0, 0, 0.8); padding: 15px; border-radius: 15px; border: 2px solid #4c1d95; min-width: 200px;">
                    <h3 style="color: #a78bfa; margin-bottom: 10px;">🎒 背包</h3>
                    <div id="gc-inventory-items" style="display: flex; flex-wrap: wrap; gap: 10px;"></div>
                </div>
                <div id="gc-message" style="position: absolute; bottom: 100px; left: 50%; transform: translateX(-50%); background: rgba(0, 0, 0, 0.9); padding: 20px 40px; border-radius: 15px; border: 2px solid #8b5cf6; z-index: 30; font-size: 1.2em; text-align: center; max-width: 600px; display: none;"></div>
                <div id="gc-choices" style="position: absolute; bottom: 20px; right: 20px; z-index: 20; display: flex; flex-direction: column; gap: 10px;"></div>
            </div>
            <div id="gc-win-screen" style="display: none; position: absolute; top: 0; left: 0; width: 100%; height: 100%; justify-content: center; align-items: center; flex-direction: column; background: rgba(0, 0, 0, 0.95); z-index: 200;">
                <h2 style="font-size: 3em; color: #fbbf24; text-shadow: 0 0 30px #fbbf24; margin-bottom: 20px;">🎉 恭喜你逃出来了！🎉</h2>
                <p style="font-size: 1.5em; color: #c4b5fd; margin-bottom: 30px;">你找到了所有水晶，成功逃离了幽灵古堡！</p>
                <button class="gc-restart-btn" style="padding: 15px 40px; font-size: 1.3em; background: linear-gradient(45deg, #6d28d9, #8b5cf6); border: none; border-radius: 30px; color: white; cursor: pointer;">再玩一次</button>
            </div>
            <div id="gc-lose-screen" style="display: none; position: absolute; top: 0; left: 0; width: 100%; height: 100%; justify-content: center; align-items: center; flex-direction: column; background: rgba(0, 0, 0, 0.95); z-index: 200;">
                <h2 style="font-size: 3em; color: #ef4444; text-shadow: 0 0 30px #ef4444; margin-bottom: 20px;">😱 游戏结束</h2>
                <p style="font-size: 1.5em; color: #c4b5fd; margin-bottom: 30px;">幽灵抓住了你...你被困在古堡里了</p>
                <button class="gc-restart-btn" style="padding: 15px 40px; font-size: 1.3em; background: linear-gradient(45deg, #6d28d9, #8b5cf6); border: none; border-radius: 30px; color: white; cursor: pointer;">再试一次</button>
            </div>
        </div>
        <style>
            #gc-start-screen h1 { animation: gc-glow 2s ease-in-out infinite alternate; }
            @keyframes gc-glow { from { text-shadow: 0 0 20px #8b5cf6, 0 0 40px #6d28d9; } to { text-shadow: 0 0 30px #a78bfa, 0 0 60px #7c3aed; } }
            #gc-start-btn:hover { transform: scale(1.1); box-shadow: 0 0 30px rgba(139, 92, 246, 0.8); }
            .gc-item { width: 50px; height: 50px; background: linear-gradient(45deg, #6d28d9, #8b5cf6); border-radius: 10px; display: flex; justify-content: center; align-items: center; font-size: 1.5em; cursor: pointer; transition: transform 0.2s; }
            .gc-item:hover { transform: scale(1.1); }
            .gc-choice-btn { padding: 12px 25px; font-size: 1em; background: linear-gradient(45deg, #4c1d95, #6d28d9); border: 2px solid #8b5cf6; border-radius: 10px; color: white; cursor: pointer; transition: all 0.3s; }
            .gc-choice-btn:hover { background: linear-gradient(45deg, #6d28d9, #8b5cf6); transform: translateX(-5px); }
            .gc-ghost { position: absolute; font-size: 4em; animation: gc-float 3s ease-in-out infinite; cursor: pointer; z-index: 15; filter: drop-shadow(0 0 20px rgba(139, 92, 246, 0.8)); }
            @keyframes gc-float { 0%, 100% { transform: translateY(0) rotate(-5deg); } 50% { transform: translateY(-20px) rotate(5deg); } }
            .gc-jump-scare { animation: gc-jumpscare 0.5s ease-in-out; }
            @keyframes gc-jumpscare { 0% { transform: scale(0.1); opacity: 0; } 50% { transform: scale(1.5); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
            .gc-restart-btn:hover { transform: scale(1.05); box-shadow: 0 0 30px rgba(139, 92, 246, 0.8); }
        </style>
        <script>
            (function() {
                let gcState = { currentRoom: 'entrance', crystals: 0, health: 3, inventory: [], flags: {} };
                const gcRooms = {
                    entrance: { name: '🚪 入口大厅', bg: 'linear-gradient(to bottom, #2a1a4e 0%, #0a0a0a 100%)', description: '你站在阴森的大厅里，四周挂着古老的画像，似乎在盯着你看...', choices: [{ text: '📖 去图书馆', to: 'library' }, { text: '🍽️ 去餐厅', to: 'dining' }, { text: '🪜 上楼梯', to: 'hallway', req: 'key' }], items: [], ghost: false },
                    library: { name: '📚 图书馆', bg: 'linear-gradient(to bottom, #1a0a3e 0%, #0a0a0a 100%)', description: '书架上摆满了古老的书籍，一本发光的书吸引了你的注意...', choices: [{ text: '📖 查看发光的书', action: 'book' }, { text: '🔙 返回大厅', to: 'entrance' }, { text: '🔦 搜索书架', action: 'search_shelves' }], items: ['crystal'], ghost: true, ghostChance: 0.3 },
                    dining: { name: '🍽️ 餐厅', bg: 'linear-gradient(to bottom, #1a0a2e 0%, #0a0a0a 100%)', description: '长桌上摆满了腐烂的食物，一只乌鸦站在吊灯上看着你...', choices: [{ text: '🔑 检查橱柜', action: 'cabinet' }, { text: '🔙 返回大厅', to: 'entrance' }, { text: '🍖 查看餐桌', action: 'table' }], items: ['key'], ghost: true, ghostChance: 0.4 },
                    hallway: { name: '🪜 二楼走廊', bg: 'linear-gradient(to bottom, #2a0a4e 0%, #0a0a0a 100%)', description: '走廊很长，两边有很多门。一阵冷风吹过...', choices: [{ text: '🛏️ 进入卧室', to: 'bedroom' }, { text: '🔬 进入实验室', to: 'lab' }, { text: '🔙 下楼', to: 'entrance' }], items: [], ghost: true, ghostChance: 0.5 },
                    bedroom: { name: '🛏️ 古老卧室', bg: 'linear-gradient(to bottom, #1a0a3e 0%, #0a0a0a 100%)', description: '一张古老的四柱床，镜子中似乎有什么在动...', choices: [{ text: '💎 检查水晶', action: 'crystal2' }, { text: '🪞 查看镜子', action: 'mirror' }, { text: '🔙 返回走廊', to: 'hallway' }], items: ['crystal'], ghost: true, ghostChance: 0.3 },
                    lab: { name: '🔬 神秘实验室', bg: 'linear-gradient(to bottom, #0a1a3e 0%, #0a0a0a 100%)', description: '桌子上摆满了奇怪的药水和仪器，一个骷髅向你走来...', choices: [{ text: '💀 和骷髅对话', action: 'skeleton' }, { text: '🧪 检查药水', action: 'potions' }, { text: '🔙 返回走廊', to: 'hallway' }], items: ['crystal'], ghost: true, ghostChance: 0.6 },
                    secret: { name: '🗝️ 秘密房间', bg: 'linear-gradient(to bottom, #3a0a5e 0%, #0a0a0a 100%)', description: '你发现了隐藏的秘密房间！最后的水晶就在这里！', choices: [{ text: '💎 取得水晶', action: 'final_crystal' }], items: ['crystal'], ghost: false },
                    crypt: { name: '💀 地下墓穴', bg: 'linear-gradient(to bottom, #0a0a0a 0%, #1a0a1e 100%)', description: '阴森的墓穴，四周都是墓碑。一个幽灵在飘荡...', choices: [{ text: '⚰️ 检查石棺', action: 'coffin' }, { text: '🔙 逃跑', to: 'entrance' }], items: ['crystal'], ghost: true, ghostChance: 0.7 }
                };

                function gcShowMessage(text, duration) {
                    const msg = document.getElementById('gc-message');
                    msg.textContent = text;
                    msg.style.display = 'block';
                    setTimeout(() => msg.style.display = 'none', duration || 2000);
                }

                function gcUpdateUI() {
                    document.getElementById('gc-crystal-count').textContent = gcState.crystals;
                    document.getElementById('gc-health').textContent = gcState.health;
                    const inv = document.getElementById('gc-inventory-items');
                    inv.innerHTML = '';
                    gcState.inventory.forEach(item => {
                        const div = document.createElement('div');
                        div.className = 'gc-item';
                        div.textContent = item === 'key' ? '🔑' : item === 'crystal' ? '💎' : '📜';
                        inv.appendChild(div);
                    });
                }

                function gcShowGhost() {
                    const room = document.getElementById('gc-room');
                    const ghost = document.createElement('div');
                    ghost.className = 'gc-ghost gc-jump-scare';
                    ghost.textContent = ['👻', '💀', '👽', '🎃'][Math.floor(Math.random() * 4)];
                    ghost.style.left = Math.random() * 60 + 20 + '%';
                    ghost.style.top = Math.random() * 40 + 30 + '%';
                    room.appendChild(ghost);
                    gcState.health--;
                    gcUpdateUI();
                    setTimeout(() => { ghost.remove(); if (gcState.health <= 0) gcGameOver(); }, 1000);
                }

                function gcRenderRoom() {
                    const room = gcRooms[gcState.currentRoom];
                    document.getElementById('gc-room').style.background = room.bg;
                    const choicesDiv = document.getElementById('gc-choices');
                    choicesDiv.innerHTML = '';
                    room.choices.forEach(choice => {
                        if (choice.req && !gcState.inventory.includes(choice.req)) return;
                        const btn = document.createElement('button');
                        btn.className = 'gc-choice-btn';
                        btn.textContent = choice.text;
                        btn.onclick = () => gcHandleChoice(choice);
                        choicesDiv.appendChild(btn);
                    });
                    if (room.ghost && Math.random() < (room.ghostChance || 0.3)) setTimeout(gcShowGhost, 500);
                    gcShowMessage(room.description);
                }

                function gcHandleChoice(choice) {
                    if (choice.to) { gcState.currentRoom = choice.to; gcRenderRoom(); return; }
                    if (choice.action) gcHandleAction(choice.action);
                }

                function gcHandleAction(action) {
                    const actions = {
                        book: () => { if (!gcState.flags.bookRead) { gcState.crystals++; gcState.flags.bookRead = true; gcUpdateUI(); gcShowMessage('📖 书上写着："寻找隐藏在黑暗中的光芒"... 你获得了一个水晶！', 3000); gcCheckWin(); } else gcShowMessage('你已经读过这本书了', 1500); },
                        search_shelves: () => { if (!gcState.flags.shelvesSearched) { gcState.inventory.push('map'); gcState.flags.shelvesSearched = true; gcUpdateUI(); gcShowMessage('🔦 你在书架后面发现了一张古老的地图！', 2000); } else gcShowMessage('书架已经被搜索过了', 1500); },
                        cabinet: () => { if (!gcState.flags.cabinetOpened) { gcState.inventory.push('key'); gcState.flags.cabinetOpened = true; gcUpdateUI(); gcShowMessage('🔑 你在橱柜里找到了一把古老的钥匙！', 2000); } else gcShowMessage('橱柜已经空了', 1500); },
                        table: () => gcShowMessage('🍖 食物已经腐烂了，但你在桌下发现了一些金币', 2000),
                        crystal2: () => { if (!gcState.flags.crystal2Taken) { gcState.crystals++; gcState.flags.crystal2Taken = true; gcUpdateUI(); gcShowMessage('💎 你从床头柜里找到了一个发光的水晶！', 2000); gcCheckWin(); } else gcShowMessage('水晶已经被拿走了', 1500); },
                        mirror: () => { if (!gcState.flags.mirrorUsed) { gcState.flags.mirrorUsed = true; gcRooms.library.choices.push({ text: '🗝️ 进入秘密房间', to: 'secret', req: 'map' }); gcShowMessage('🪞 镜子中显示出一个隐藏的房间入口...在图书馆！', 2500); } else gcShowMessage('镜子已经揭示了秘密', 1500); },
                        skeleton: () => { gcState.crystals++; gcState.flags.skeletonTalked = true; gcUpdateUI(); gcShowMessage('💀 骷髅说："想要水晶，先回答我的问题：什么越洗越脏？"... 答案是"水"！你获得了水晶！', 3000); gcCheckWin(); },
                        potions: () => { if (!gcState.flags.potionsChecked) { gcState.health++; gcState.flags.potionsChecked = true; gcUpdateUI(); gcShowMessage('🧪 你喝下了一瓶红色药水...感觉充满了力量！生命 +1', 2000); } else gcShowMessage('药水已经喝完了', 1500); },
                        final_crystal: () => { gcState.crystals++; gcUpdateUI(); gcShowMessage('💎 你找到了最后的水晶！古堡开始震动...', 2000); setTimeout(() => { document.getElementById('gc-game-screen').style.display = 'none'; document.getElementById('gc-win-screen').style.display = 'flex'; }, 2000); },
                        coffin: () => { if (!gcState.flags.coffinOpened) { gcState.crystals++; gcState.flags.coffinOpened = true; gcUpdateUI(); gcShowMessage('⚰️ 石棺里有一个发光的水晶！你拿到了！', 2000); gcCheckWin(); } else gcShowMessage('石棺已经空了', 1500); }
                    };
                    if (actions[action]) actions[action]();
                }

                function gcCheckWin() {
                    if (gcState.crystals >= 5 && gcState.currentRoom !== 'secret') {
                        gcShowMessage('💎 你收集了所有水晶！找到出口逃离这里！', 3000);
                        const choicesDiv = document.getElementById('gc-choices');
                        const exitBtn = document.createElement('button');
                        exitBtn.className = 'gc-choice-btn';
                        exitBtn.textContent = '🚪 逃离古堡';
                        exitBtn.onclick = () => { document.getElementById('gc-game-screen').style.display = 'none'; document.getElementById('gc-win-screen').style.display = 'flex'; };
                        choicesDiv.appendChild(exitBtn);
                    }
                }

                function gcGameOver() {
                    document.getElementById('gc-game-screen').style.display = 'none';
                    document.getElementById('gc-lose-screen').style.display = 'flex';
                }

                function gcShowHint() {
                    const hints = ['💡 多和场景中的物品互动，可能会有发现', '💡 有些门需要钥匙才能打开', '💡 镜子可能会揭示隐藏的秘密', '💡 骷髅知道一些重要的事情...', '💡 收集所有 5 个水晶才能逃脱'];
                    gcShowMessage(hints[Math.floor(Math.random() * hints.length)], 3000);
                }

                function gcStartGame() {
                    document.getElementById('gc-start-screen').style.display = 'none';
                    document.getElementById('gc-game-screen').style.display = 'block';
                    gcRenderRoom();
                    gcUpdateUI();
                }

                document.getElementById('gc-start-btn').addEventListener('click', gcStartGame);
                document.getElementById('gc-hint').addEventListener('click', gcShowHint);
                document.querySelectorAll('.gc-restart-btn').forEach(btn => btn.addEventListener('click', () => location.reload()));
            })();
        <\/script>
    `;
}
