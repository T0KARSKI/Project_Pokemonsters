// Espera o DOM carregar completamente
document.addEventListener('DOMContentLoaded', function() {
    console.log('Jogo inicializado!');
    
    // Elementos da interface
    const messageBox = document.getElementById('message-box');
    const mainMenu = document.getElementById('main-menu');
    const attackPanel = document.getElementById('attack-panel');
    const battleButton = document.getElementById('battle-button');
    const monstersButton = document.getElementById('monsters-button');
    const backButton = document.getElementById('back-button');
    const attackButtons = document.querySelectorAll('.attack-button');
    const resetButton = document.getElementById('reset-button');
    
    // Elementos de HP
    const playerHpFill = document.getElementById('player-hp-fill');
    const playerHpText = document.getElementById('player-hp-text');
    const opponentHpFill = document.getElementById('opponent-hp-fill');
    const opponentHpText = document.getElementById('opponent-hp-text');
    
    // Sprites
    const playerSprite = document.querySelector('.player-sprite');
    const opponentSprite = document.querySelector('.opponent-sprite');
    
    // Dados dos monstros (simulando os objetos Java)
    const playerMonstro = {
        nome: "Blazer",
        tipo: "Fogo",
        nivel: 5,
        hpMaximo: 100,
        hpAtual: 100,
        ataques: [
            { nome: "Scratch", forca: 20 },
            { nome: "Leer", forca: 0 },
            { nome: "Growl", forca: 0 },
            { nome: "Take Down", forca: 40 }
        ]
    };
    
    const opponentMonstro = {
        nome: "Wildmon",
        tipo: "Normal",
        nivel: 5,
        hpMaximo: 100,
        hpAtual: 100,
        ataques: [
            { nome: "Tackle", forca: 18 }
        ]
    };
    
    // Estado do jogo
    let battleActive = false;
    let playerTurn = true;
    
    // Inicialização da interface
    function initializeInterface() {
        // Atualiza os nomes dos ataques nos botões
        attackButtons.forEach((button, index) => {
            const ataque = playerMonstro.ataques[index];
            if (ataque && ataque.nome) {
                button.textContent = ataque.nome;
                button.disabled = false;
            } else {
                button.textContent = "-";
                button.disabled = true;
            }
        });
        
        // Atualiza as barras de HP
        updateHpDisplay();
    }
    
    // Função para atualizar as barras de HP
    function updateHpDisplay() {
        // Calcula as porcentagens de HP
        const playerHpPercent = (playerMonstro.hpAtual / playerMonstro.hpMaximo) * 100;
        const opponentHpPercent = (opponentMonstro.hpAtual / opponentMonstro.hpMaximo) * 100;
        
        // Atualiza as barras visuais
        playerHpFill.style.width = `${playerHpPercent}%`;
        opponentHpFill.style.width = `${opponentHpPercent}%`;
        
        // Muda a cor da barra baseado no HP restante
        if (playerHpPercent > 50) {
            playerHpFill.style.backgroundColor = "#4CAF50"; // Verde
        } else if (playerHpPercent > 20) {
            playerHpFill.style.backgroundColor = "#FFC107"; // Amarelo
        } else {
            playerHpFill.style.backgroundColor = "#F44336"; // Vermelho
        }
        
        if (opponentHpPercent > 50) {
            opponentHpFill.style.backgroundColor = "#4CAF50";
        } else if (opponentHpPercent > 20) {
            opponentHpFill.style.backgroundColor = "#FFC107";
        } else {
            opponentHpFill.style.backgroundColor = "#F44336";
        }
        
        // Atualiza os textos de HP
        playerHpText.textContent = `${playerMonstro.hpAtual}/${playerMonstro.hpMaximo}`;
        opponentHpText.textContent = `${opponentMonstro.hpAtual}/${opponentMonstro.hpMaximo}`;
    }
    
    // Função para aplicar dano
    function aplicarDano(alvo, dano) {
        alvo.hpAtual = Math.max(0, alvo.hpAtual - dano);
        updateHpDisplay();
    }
    
    // Função para animar o dano
    function animarDano(elemento) {
        elemento.classList.add('damage-animation');
        setTimeout(() => {
            elemento.classList.remove('damage-animation');
        }, 500);
    }
    
    // Função para mostrar mensagem
    function showMessage(message) {
        messageBox.textContent = message;
    }
    
    // Função para iniciar batalha
    function startBattle() {
        battleActive = true;
        playerTurn = true;
        mainMenu.style.display = 'none';
        attackPanel.style.display = 'block';
        showMessage(`Uma batalha começou! ${playerMonstro.nome} vs ${opponentMonstro.nome}!`);
    }
    
    // Função para encerrar batalha
    function endBattle(playerWon) {
        battleActive = false;
        attackPanel.style.display = 'none';
        mainMenu.style.display = 'flex';
        
        if (playerWon) {
            showMessage(`Você venceu! ${opponentMonstro.nome} foi derrotado!`);
        } else {
            showMessage(`Você perdeu! ${playerMonstro.nome} foi derrotado!`);
        }
        
        // Restaura HP para próxima batalha
        playerMonstro.hpAtual = playerMonstro.hpMaximo;
        opponentMonstro.hpAtual = opponentMonstro.hpMaximo;
        updateHpDisplay();
    }
    
    // Função para processar o turno do oponente
    function opponentTurn() {
        setTimeout(() => {
            const ataque = opponentMonstro.ataques[0]; // Sempre usa o primeiro ataque
            showMessage(`${opponentMonstro.nome} usou ${ataque.nome}!`);
            
            setTimeout(() => {
                animarDano(playerSprite);
                aplicarDano(playerMonstro, ataque.forca);
                
                setTimeout(() => {
                    if (playerMonstro.hpAtual <= 0) {
                        endBattle(false);
                    } else {
                        playerTurn = true;
                        showMessage("Escolha seu ataque!");
                    }
                }, 1000);
            }, 1000);
        }, 1000);
    }
    
    // Event Listeners
    battleButton.addEventListener('click', function() {
        startBattle();
    });
    
    monstersButton.addEventListener('click', function() {
        showMessage(`Monstros do treinador: ${playerMonstro.nome} (Nível ${playerMonstro.nivel})`);
    });
    
    backButton.addEventListener('click', function() {
        // Esconde o painel de ataques
        attackPanel.style.display = "none";
        // Mostra o menu principal
        mainMenu.style.display = "block";
        showMessage("O que você deseja fazer?");
    });

    resetButton.addEventListener('click', function() {
        // Restaura os valores iniciais dos monstros
        playerMonstro.hpAtual = playerMonstro.hpMaximo;
        opponentMonstro.hpAtual = opponentMonstro.hpMaximo;
    
        // Atualiza a interface
        updateHpDisplay();
        showMessage("O que você deseja fazer?");
        
        // Exibe o menu principal e esconde o painel de ataques
        mainMenu.style.display = "block";
        attackPanel.style.display = "none";
    
        // Reseta o estado do jogo
        battleActive = false;
        playerTurn = true;
    });
    
    // Event listeners para os botões de ataque
    attackButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            if (!battleActive || !playerTurn) return;
            
            playerTurn = false;
            const ataque = playerMonstro.ataques[index];
            
            if (!ataque || !ataque.nome) return;
            
            showMessage(`${playerMonstro.nome} usou ${ataque.nome}!`);
            
            setTimeout(() => {
                animarDano(opponentSprite);
                aplicarDano(opponentMonstro, ataque.forca);
                
                setTimeout(() => {
                    if (opponentMonstro.hpAtual <= 0) {
                        endBattle(true);
                    } else {
                        showMessage(`${opponentMonstro.nome} está se preparando para atacar...`);
                        opponentTurn();
                    }
                }, 1000);
            }, 1000);
        });
    });
    
    // Inicializa a interface
    initializeInterface();
});
