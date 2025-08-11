// Variáveis globais
let carrinho = [];
let totalCarrinho = 0;

// DOM elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const cartCount = document.querySelector('.cart-count');
const searchInput = document.querySelector('.search-box input');
const searchBtn = document.querySelector('.search-btn');
const addToCartBtns = document.querySelectorAll('.btn-add-cart');
const contactForm = document.querySelector('.contato-form');

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    initializeScrollEffects();
    loadCartFromStorage();
    updateCartDisplay();
});

// Event Listeners
function initializeEventListeners() {
    // Menu hambúrguer para mobile
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }

    // Navegação suave
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', smoothScroll);
    });

    // Busca
    if (searchBtn) {
        searchBtn.addEventListener('click', handleSearch);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }

    // Adicionar ao carrinho
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', handleAddToCart);
    });

    // Formulário de contato
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }

    // Scroll para mostrar/esconder header
    window.addEventListener('scroll', handleHeaderScroll);

    // Carrinho - clique no ícone
    const cartIcon = document.querySelector('.fa-shopping-cart').parentElement;
    if (cartIcon) {
        cartIcon.addEventListener('click', showCartModal);
    }
}

// Menu Mobile
function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
}

// Navegação suave
function smoothScroll(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
        targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
    
    // Fechar menu mobile se estiver aberto
    if (navMenu.classList.contains('active')) {
        toggleMobileMenu();
    }
}

// Busca
function handleSearch() {
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
        // Simular busca - em um projeto real, seria uma consulta ao servidor
        showSearchResults(searchTerm);
        searchInput.value = '';
    }
}

function showSearchResults(term) {
    alert(`Buscando por: "${term}"\n\nEm um site real, isso redirecionaria para os resultados da busca.`);
}

// Carrinho de compras
function handleAddToCart(e) {
    const produtoCard = e.target.closest('.produto-card');
    const produto = {
        id: Date.now() + Math.random(), // ID único temporário
        nome: produtoCard.querySelector('h3').textContent,
        preco: extrairPreco(produtoCard.querySelector('.price-new').textContent),
        quantidade: 1
    };
    
    adicionarAoCarrinho(produto);
    mostrarNotificacao(`${produto.nome} adicionado ao carrinho!`);
}

function extrairPreco(precoTexto) {
    return parseFloat(precoTexto.replace('R$', '').replace(',', '.').trim());
}

function adicionarAoCarrinho(produto) {
    const produtoExistente = carrinho.find(item => item.nome === produto.nome);
    
    if (produtoExistente) {
        produtoExistente.quantidade += 1;
    } else {
        carrinho.push(produto);
    }
    
    updateCartDisplay();
    saveCartToStorage();
}

function updateCartDisplay() {
    const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
    totalCarrinho = carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);
    
    if (cartCount) {
        cartCount.textContent = totalItens;
    }
}

function saveCartToStorage() {
    localStorage.setItem('jacare_autopecas_carrinho', JSON.stringify(carrinho));
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('jacare_autopecas_carrinho');
    if (savedCart) {
        carrinho = JSON.parse(savedCart);
    }
}

function showCartModal() {
    if (carrinho.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }
    
    let cartHTML = 'CARRINHO DE COMPRAS\\n\\n';
    carrinho.forEach(item => {
        cartHTML += `${item.nome} - Qtd: ${item.quantidade} - R$ ${(item.preco * item.quantidade).toFixed(2)}\\n`;
    });
    cartHTML += `\\nTOTAL: R$ ${totalCarrinho.toFixed(2)}`;
    
    const finalizar = confirm(cartHTML + '\\n\\nDeseja finalizar a compra?');
    if (finalizar) {
        finalizarCompra();
    }
}

function finalizarCompra() {
    alert('Redirecionando para o checkout...\\n\\nEm um site real, isso levaria para a página de pagamento.');
    carrinho = [];
    updateCartDisplay();
    saveCartToStorage();
}

// Notificações
function mostrarNotificacao(mensagem) {
    // Criar elemento de notificação
    const notificacao = document.createElement('div');
    notificacao.className = 'notificacao';
    notificacao.textContent = mensagem;
    notificacao.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background-color: var(--primary-green);
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 9999;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notificacao);
    
    // Remover após 3 segundos
    setTimeout(() => {
        notificacao.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            if (document.body.contains(notificacao)) {
                document.body.removeChild(notificacao);
            }
        }, 300);
    }, 3000);
}

// Formulário de contato
function handleContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const nome = e.target.querySelector('input[type="text"]').value;
    const email = e.target.querySelector('input[type="email"]').value;
    const telefone = e.target.querySelector('input[type="tel"]').value;
    const mensagem = e.target.querySelector('textarea').value;
    
    // Validação básica
    if (!nome || !email || !telefone || !mensagem) {
        alert('Por favor, preencha todos os campos!');
        return;
    }
    
    // Simular envio
    mostrarNotificacao('Mensagem enviada com sucesso! Entraremos em contato em breve.');
    e.target.reset();
}

// Efeitos de scroll
function initializeScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observar elementos que devem aparecer com scroll
    const elementsToObserve = document.querySelectorAll('.categoria-item, .produto-card, .stat-item');
    elementsToObserve.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
}

// Header scroll effect
function handleHeaderScroll() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.backgroundColor = 'var(--white)';
        header.style.backdropFilter = 'none';
    }
}

// Adicionar estilos para animações de notificação
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    /* Menu mobile styles */
    @media (max-width: 768px) {
        .nav-menu {
            position: fixed;
            left: -100%;
            top: 70px;
            flex-direction: column;
            background-color: var(--white);
            width: 100%;
            text-align: center;
            transition: 0.3s;
            box-shadow: 0 10px 27px rgba(0, 0, 0, 0.05);
            padding: 2rem 0;
        }
        
        .nav-menu.active {
            left: 0;
        }
        
        .nav-menu li {
            margin: 1rem 0;
        }
        
        .hamburger.active span:nth-child(2) {
            opacity: 0;
        }
        
        .hamburger.active span:nth-child(1) {
            transform: translateY(8px) rotate(45deg);
        }
        
        .hamburger.active span:nth-child(3) {
            transform: translateY(-8px) rotate(-45deg);
        }
    }
`;
document.head.appendChild(style);

// Funções utilitárias
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Scroll suave para links internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Easter egg - duplo clique no logo
document.querySelector('.nav-brand').addEventListener('dblclick', function() {
    mostrarNotificacao('🐊 Obrigado por visitar a Jacaré Autopeças! 🔧');
});

console.log('🐊 Jacaré Autopeças - Site carregado com sucesso! 🔧');