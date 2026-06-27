# Taste Skill - Referência de Design e Estrutura

Esta é a documentação completa baseada na raspagem do site `tasteskill.dev` e nas referências visuais fornecidas.

## 1. Branding & Estética Geral
- **Tema Principal:** Light Mode Minimalista e Orgânico.
- **Cor de Fundo:** Off-white Quente / Bege Claro (ex: `#f5f4f2` ou `#f2f0e9`).
- **Cor do Texto (Primário):** Quase preto (`#0A0A0A` ou `#111111`).
- **Acentos:** Laranja Suave / Ocre (`#FF6B00` ou similar) para destaques sutis e pontos (bullets).
- **Textura Visuais:** Fundo limpo, muitas vezes complementado por texturas sutis ou sombras projetadas com estilo botânico (sombras de folhas sobrepostas na lateral esquerda, dando um toque orgânico).
- **Sensação:** "Menos slop, mais design". Uma estética premium, de luxo acessível e técnica ao mesmo tempo.

## 2. Tipografia
- **Fontes Principais:** No site oficial, há um stack customizado, mas a aparência indica uma fonte geométrica sem serifa muito bem desenhada (Satoshi, Geist, Manrope ou similares) e uma serifa em itálico para contraste (Playfair Display ou Instrument Serif).
- **Uso:**
  - Headlines: Sem serifa, peso regular a médio, tracking (espaçamento) muito ajustado, tamanhos generosos.
  - Textos secundários: Mesma família, fonte legível, cores em cinza médio (`#666` ou texto com opacidade reduzida).

## 3. Elementos de Interface (UI)
- **Botões (CTAs):**
  - Fundo `#0A0A0A` com texto em `#FFFFFF`.
  - Altamente arredondados (`rounded-full` ou `rounded-[16px]`).
  - Sem shadows neons. Usam shadows físicas e drop shadows orgânicas.
- **Pills / Tags:** Usadas na Navbar no topo superior direito e nos breadcrumbs. Brancas puras com borda muito sutil e leve shadow, cantos totalmente arredondados (`rounded-full`).
- **Cards:**
  - Fundo branco ou off-white, com padding interno espaçoso.
  - Uso de bordas sutis e grandes arredondamentos (`rounded-3xl` ou superior).
  - Sombras "Soft": sombras largas, suaves e difusas.

## 4. Estrutura do Site (Seções Baseadas nas Imagens)

### A. Navbar Flutuante
- Logo "Taste Skill" flutuando à esquerda, em formato de pílula branca com ícone preto.
- Menus (Docs, Changelog, Blog, Guide, Beta) agrupados à direita, também num container pílula.
- Efeito de *Floating Navbar* que deve persistir no scroll.

### B. Hero Section (2 Colunas)
- **Esquerda (Copy):**
  - Título massivo: "Sérgio Colpaert" ou equivalente.
  - Subtítulo em fonte menor com contraste.
  - Bloco em código ou highlight (ex: comando `npx skills add...`). No nosso caso, pode ser uma caixa de contato ou destaque do serviço.
  - Botão CTA escuro acompanhado de microtexto laranja.
- **Direita (Animação de Cartões / Portfólio):**
  - Várias "janelas" / imagens de sites que sobem (scroll) de forma contínua e suave, empilhadas, com cantos arredondados, flutuando no ar.

### C. Seção de Clientes / Marcas (Works with every agent)
- Texto principal na esquerda.
- Grid sutil de logos (ou tecnologias) encapsuladas em pequenos botões ou quadrados brancos.

### D. Quebra de Filosofia (Escape the generic...)
- Textos gigantes intercalados com botões em pílula ou imagens (ex: "Escape / the generic / AI / slop."). Tipografia misturando sem-serifa regular e itálico serifado.

### E. Grid de Funcionalidades / Serviços (Current skills)
- Layout bento ou grid regular (3 ou 4 colunas) de blocos/cards com ícone ao topo, título e pequena descrição. Muito clean, fundo branco.

### F. Prova Social (What people are saying)
- Grid de blocos replicando "tweets" ou cards de depoimento num layout estilo masonry (desalinhados).

### G. Projetos e Portfólio (Projects built with...)
- Cards maiores com imagens dos sites, título em bold e categoria, em uma estrutura clássica com espaçamento enorme.

### H. Footer e CTA Final
- Chamada final de suporte com imagem texturizada.
- Rodapé super simples, texto pequeno centralizado.

---

**Diretrizes de Implementação para Sérgio LP:**
- Mudar do Dark Mode (Midnight Luxe) para este **Light Mode Orgânico**.
- Refazer o Hero dividindo em 50/50.
- Implementar a animação vertical contínua na direita com sites do portfólio.
- Usar caixas estilizadas (pill-shaped components).
- Manter animações avançadas via framer-motion/GSAP.
