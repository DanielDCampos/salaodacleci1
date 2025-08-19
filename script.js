
document.addEventListener('DOMContentLoaded', function () {
    
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
    
    document.querySelectorAll('#mobile-menu a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });

    const packages = {
        essencial: {
            title: 'Pacote Presença Essencial',
            price: 'R$ 8.500,00',
            investment: 8500,
            features: [
                'Website institucional completo (até 5 páginas)',
                'Design personalizado com paleta "Calor Aconchegante"',
                'Otimização para SEO Local (ser encontrada no Google)',
                'Criação e otimização de perfil no Google Meu Negócio',
                'Sistema de agendamento online inteligente 24/7',
                'Lembretes automáticos para clientes'
            ]
        },
        crescimento: {
            title: 'Pacote Crescimento Digital',
            price: 'R$ 11.500,00',
            investment: 11500,
            features: [
                '<strong>Tudo do pacote Essencial, mais:</strong>',
                'Módulo de e-commerce para venda de produtos',
                'Configuração de gateway de pagamento online',
                'Estratégia inicial de marketing de conteúdo (2 posts de blog)'
            ]
        }
    };
    
    let currentPackage = 'essencial';

    const btnEssencial = document.getElementById('btn-essencial');
    const btnCrescimento = document.getElementById('btn-crescimento');
    const packageTitle = document.getElementById('package-title');
    const packageFeatures = document.getElementById('package-features');
    const packagePrice = document.getElementById('package-price');

    function updatePackageView(pkg) {
        currentPackage = pkg;
        const data = packages[pkg];
        packageTitle.textContent = data.title;
        packagePrice.textContent = data.price;
        packageFeatures.innerHTML = data.features.map(f => `<li>${f}</li>`).join('');

        if (pkg === 'essencial') {
            btnEssencial.classList.add('bg-[#D9866F]', 'text-white');
            btnEssencial.classList.remove('bg-white', 'text-[#D9866F]', 'border', 'border-[#D9866F]');
            btnCrescimento.classList.add('bg-white', 'text-[#D9866F]', 'border', 'border-[#D9866F]');
            btnCrescimento.classList.remove('bg-[#D9866F]', 'text-white');
        } else {
            btnCrescimento.classList.add('bg-[#D9866F]', 'text-white');
            btnCrescimento.classList.remove('bg-white', 'text-[#D9866F]', 'border', 'border-[#D9866F]');
            btnEssencial.classList.add('bg-white', 'text-[#D9866F]', 'border', 'border-[#D9866F]');
            btnEssencial.classList.remove('bg-[#D9866F]', 'text-white');
        }
        document.getElementById('gemini-description-result').classList.add('hidden');
        updateRoiCalculation();
    }

    btnEssencial.addEventListener('click', () => updatePackageView('essencial'));
    btnCrescimento.addEventListener('click', () => updatePackageView('crescimento'));
    
   
    const ticketMedioSlider = document.getElementById('ticket-medio');
    const ticketMedioValor = document.getElementById('ticket-medio-valor');
    const novosClientesSlider = document.getElementById('novos-clientes');
    const novosClientesValor = document.getElementById('novos-clientes-valor');
    const lucroMensalDisplay = document.getElementById('lucro-mensal');
    const paybackDisplay = document.getElementById('payback');
    
    let roiChart;

    function updateRoiCalculation() {
        const ticket = parseInt(ticketMedioSlider.value);
        const clientes = parseInt(novosClientesSlider.value);
        const margemLucro = 0.50; 
        
        ticketMedioValor.textContent = `R$ ${ticket}`;
        novosClientesValor.textContent = clientes;
        
        const receitaMensal = ticket * clientes;
        const lucroMensal = receitaMensal * margemLucro;
        
        lucroMensalDisplay.textContent = `R$ ${lucroMensal.toFixed(2).replace('.', ',')}`;
        
        const investimento = packages[currentPackage].investment;
        const paybackMeses = investimento / lucroMensal;
        
        if (lucroMensal > 0) {
            paybackDisplay.textContent = `~${paybackMeses.toFixed(1).replace('.', ',')} meses`;
        } else {
            paybackDisplay.textContent = 'N/A';
        }

        updateRoiChart(receitaMensal, lucroMensal);
        document.getElementById('gemini-marketing-result').classList.add('hidden');
    }

    function updateRoiChart(receita, lucro) {
        if (roiChart) {
            roiChart.data.datasets[0].data = [receita, lucro];
            roiChart.update();
        }
    }

    ticketMedioSlider.addEventListener('input', updateRoiCalculation);
    novosClientesSlider.addEventListener('input', updateRoiCalculation);


    function createRoiChart() {
        const ctx = document.getElementById('roiChart').getContext('2d');
        roiChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Receita Bruta Adicional', 'Lucro Líquido Adicional'],
                datasets: [{
                    label: 'Projeção Mensal (R$)',
                    data: [0, 0],
                    backgroundColor: ['rgba(245, 195, 181, 0.6)', 'rgba(217, 134, 111, 0.6)'],
                    borderColor: ['rgba(245, 195, 181, 1)', 'rgba(217, 134, 111, 1)'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                scales: { y: { beginAtZero: true, ticks: { callback: value => 'R$ ' + value } } },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: context => {
                                let label = context.dataset.label || '';
                                if (label) { label += ': '; }
                                if (context.parsed.y !== null) {
                                    label += new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(context.parsed.y);
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }
    
    function createPrioridadesChart() {
        const ctx = document.getElementById('prioridadesChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Presença Online Profissional', 'Gestão de Agenda Eficiente', 'Marketing Local'],
                datasets: [{
                    label: 'Impacto no Crescimento',
                    data: [95, 85, 78],
                    backgroundColor: ['rgba(217, 134, 111, 0.6)', 'rgba(245, 195, 181, 0.6)', 'rgba(92, 58, 46, 0.6)'],
                    borderColor: ['rgba(217, 134, 111, 1)', 'rgba(245, 195, 181, 1)', 'rgba(92, 58, 46, 1)'],
                    borderWidth: 1
                }]
            },
            options: {
                indexAxis: 'y', responsive: true, maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    title: { display: true, text: 'Prioridades para o Crescimento de Salões de Beleza' }
                }
            }
        });
    }

    const apiKey = ""; 

    async function callGemini(prompt, resultElement) {
        resultElement.innerHTML = '<div class="spinner"></div>';
        resultElement.classList.remove('hidden');

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
        
        const payload = {
            contents: [{
                parts: [{ text: prompt }]
            }]
        };

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const text = data.candidates[0].content.parts[0].text;
            
            resultElement.innerHTML = text
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\n/g, '<br>');

        } catch (error) {
            console.error("Error calling Gemini API:", error);
            resultElement.innerHTML = '<p class="text-red-500">Desculpe, ocorreu um erro ao contatar a IA. Por favor, tente novamente mais tarde.</p>';
        }
    }

    
    document.getElementById('generate-description-btn').addEventListener('click', () => {
        const features = packages[currentPackage].features.map(f => f.replace(/<strong>.*?<\/strong>/g, '')).join(', ');
        const prompt = `Você é um especialista em marketing para salões de beleza. Explique os benefícios dos seguintes serviços para a dona de um salão de forma clara, amigável e focada em resultados: ${features}. Organize a resposta em tópicos, um para cada serviço.`;
        const resultElement = document.getElementById('gemini-description-result');
        callGemini(prompt, resultElement);
    });


    document.getElementById('generate-marketing-btn').addEventListener('click', () => {
        const ticket = ticketMedioSlider.value;
        const clientes = novosClientesSlider.value;
        const prompt = `Você é um consultor de marketing criativo para pequenos negócios. O 'Salão da Cleci' quer atrair ${clientes} novos clientes por mês, com um gasto médio de R$${ticket}. Gere 3 ideias de marketing de baixo custo, específicas para um salão de beleza local, para atingir essa meta. Apresente em uma lista numerada com títulos em negrito.`;
        const resultElement = document.getElementById('gemini-marketing-result');
        callGemini(prompt, resultElement);
    });

    document.getElementById('generate-email-btn').addEventListener('click', () => {
        const question = document.getElementById('user-question').value;
        if (!question.trim()) {
            alert('Por favor, digite sua dúvida primeiro.');
            return;
        }
        const prompt = `Você é um assistente prestativo. A dona de um salão, Cleci, tem a seguinte dúvida sobre uma proposta de desenvolvimento de site: "${question}". Crie um rascunho de e-mail curto, profissional e amigável para ela enviar ao desenvolvedor, fazendo essa pergunta e mostrando interesse. Assine como "Atenciosamente, Cleci".`;
        const resultElement = document.getElementById('gemini-email-result');
        callGemini(prompt, resultElement);
    });


 
    createRoiChart();
    createPrioridadesChart();
    updatePackageView('essencial');
});
