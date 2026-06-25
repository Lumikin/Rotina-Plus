import "./styles.css";

const app = document.querySelector("#app");

// Renderiza a pagina inicial publica do site.
// Ela aparece antes do usuario entrar ou se cadastrar.
app.innerHTML = `
  <section class="home-page">
    <header class="home-header">
      <a class="home-brand" href="/" aria-label="Rotina Plus">
        <img src="/logo.png" alt="Logo Rotina Plus" />
      </a>

      <nav class="home-nav" aria-label="Navegação principal">
        <a href="/login.html">Entrar</a>
        <a class="nav-button" href="/cadastro.html">Cadastrar</a>
      </nav>
    </header>

    <section class="home-hero">
      <div class="home-copy">
        <p class="eyebrow">Rotina Plus</p>
        <h1>Organize sua rotina e acompanhe seu progresso todos os dias.</h1>
        <p class="intro">
          Cadastre tarefas, acompanhe pontos e veja sua evolução em uma página simples para manter hábitos e estudos no caminho.
        </p>

        <div class="home-actions">
          <a class="primary-link" href="/cadastro.html">Começar agora</a>
          <a class="secondary-link" href="/login.html">Já tenho conta</a>
        </div>
      </div>

      <div class="home-preview" aria-label="Prévia do painel">
        <div class="preview-top">
          <span>Hoje</span>
          <strong>72%</strong>
        </div>

        <div class="preview-progress">
          <span style="width: 72%"></span>
        </div>

        <div class="preview-list">
          <div>
            <span></span>
            <p>Estudar programação</p>
          </div>
          <div>
            <span></span>
            <p>Organizar tarefas</p>
          </div>
          <div>
            <span></span>
            <p>Revisar metas</p>
          </div>
        </div>
      </div>
    </section>

    <section class="about-section" aria-labelledby="about-title">
      <div>
        <p class="eyebrow">Sobre o projeto</p>
        <h2 id="about-title">O que é a Rotina Plus?</h2>
      </div>
      <p>
        A Rotina Plus é uma aplicação para ajudar usuários a organizar hábitos, tarefas e metas diárias de forma simples.
        O sistema combina cadastro de atividades, acompanhamento de progresso e pontuação para incentivar constância e
        tornar a rotina mais visual, prática e motivadora.
      </p>
    </section>

    <section class="home-features" aria-label="Funcionalidades">
      <article>
        <strong>Tarefas</strong>
        <p>Monte sua lista diária com horário e prioridade.</p>
      </article>
      <article>
        <strong>Pontos</strong>
        <p>Ganhe pontos ao concluir suas atividades.</p>
      </article>
      <article>
        <strong>Progresso</strong>
        <p>Acompanhe sua evolução de forma clara.</p>
      </article>
    </section>

    <footer class="home-footer">
      <div>
        <strong>Rotina Plus</strong>
        <p>Sistema gamificado de acompanhamento de hábitos e rotina.</p>
      </div>

      <address>
        <a href="mailto:contato@rotinaplus.com">contato@rotinaplus.com</a>
        <a href="tel:+5511999999999">(11) 99999-9999</a>
      </address>
    </footer>
  </section>
`;
