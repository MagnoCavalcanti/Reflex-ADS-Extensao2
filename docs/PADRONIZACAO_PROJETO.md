# Padronização do Projeto Reflex ADS

Este documento define os combinados atuais para desenvolvimento do MVP do Reflex ADS. A ideia é manter o projeto previsível para todos os devs, evitando páginas duplicadas, rotas soltas e comportamentos diferentes entre telas.

## API E Ambiente

A API oficial do MVP está em:

```env
VITE_API_URL=https://reflex-server-eoxc.onrender.com
```

Regras importantes:

- Em projetos Vite, variáveis usadas no front precisam começar com `VITE_`.
- O arquivo local deve se chamar `.env.local`.
- O arquivo `.env.local` não deve ser commitado.
- O arquivo `.env.local.example` deve indicar quais variáveis cada dev precisa configurar.
- Evite colocar barra no final da URL da API para não duplicar barras nas chamadas.

## Estrutura De Pastas

As telas ficam em `src/pages`.

Telas específicas por perfil devem seguir esta separação:

```txt
src/pages/aluno/
src/pages/professor/
```

Exemplos atuais:

```txt
src/pages/aluno/DashboardAlunoPage.tsx
src/pages/professor/DashboardProfessorPage.tsx
```

Arquivos compartilhados devem ficar fora dessas pastas:

```txt
src/components/
src/contexts/
src/hooks/
src/services/
src/types/
src/utils/
```

Use esta regra simples: se a tela é só do aluno, fica em `pages/aluno`; se é só do professor, fica em `pages/professor`; se é pública ou compartilhada, fica direto em `pages`.

## Rotas E Proteção

As rotas ficam concentradas em `src/App.tsx`.

Hoje existem três tipos de guard:

- `RequireAuth`: bloqueia usuários não logados.
- `RequireRole`: bloqueia acesso entre perfis diferentes.
- `RedirectIfAuthenticated`: impede usuário logado de voltar para páginas públicas como login e cadastro.

As rotas principais seguem esta ideia:

```txt
/dashboard
/aluno/dashboard
/professor/dashboard
```

`/dashboard` é uma rota intermediária. Ela verifica o usuário logado e redireciona para a dashboard correta:

- Aluno: `/aluno/dashboard`
- Professor: `/professor/dashboard`

Não direcione manualmente um usuário para `/aluno/dashboard` ou `/professor/dashboard` depois do login. Use `/dashboard`, porque essa rota já decide o destino correto.

## Perfis De Usuário

O tipo do usuário está em `type_user`.

Valores oficiais usados no front:

- `A`: aluno
- `P`: professor

O arquivo `src/utils/auth.ts` centraliza as funções de papel do usuário:

- `normalizeUserRole`
- `isValidUserRole`
- `getDashboardPathByRole`

Quando novas regras de perfil forem necessárias, prefira alterar esse utilitário em vez de espalhar `if` por várias telas.

## Navbar Padrão

Todas as telas internas devem usar `src/components/Navbar.tsx`.

O `Navbar` já cuida de:

- Link para início usando `/dashboard`.
- Links para `Conteúdos` e `Quizzes`.
- Destaque correto quando o usuário está em uma dashboard específica.
- Indicação visual do perfil atual, aluno ou professor.
- Atalho para perfil.
- Logout.

Evite criar headers próprios com menu e botão de sair dentro das páginas. Se o layout precisar mudar para todos, altere o `Navbar`.

Use assim:

```tsx
import Navbar from "../components/Navbar";

export default function MinhaPage() {
  return (
    <main>
      <Navbar />
      {/* conteúdo da página */}
    </main>
  );
}
```

Dentro de subpastas, ajuste o caminho relativo:

```tsx
import Navbar from "../../components/Navbar";
```

## Serviços, Hooks E Tipos

Chamadas HTTP devem passar por `src/services/api.ts`.

Serviços específicos devem ficar em `src/services`, como:

```txt
src/services/meService.ts
```

Hooks que combinam estado, loading e erro devem ficar em `src/hooks`.

Tipos compartilhados devem ficar em `src/types`, como:

```txt
src/types/auth.types.ts
src/types/dashboard.types.ts
```

Utilitários puros devem ficar em `src/utils`.

Não coloque chamada HTTP diretamente dentro de componentes grandes quando ela puder virar um service/hook reutilizável.

## Fluxo Base Do MVP: Aluno

O fluxo do aluno no MVP segue esta ordem:

1. Login ou cadastro.
2. Dashboard com cursos em andamento e progresso.
3. Catálogo de cursos para encontrar novos conteúdos.
4. Página do curso com ementa, aulas e avaliações.
5. Player de aula com vídeo, materiais e anotações.
6. Exercício ou quiz com resposta e feedback.
7. Próxima aula para continuar a trilha.
8. Conclusão do curso quando atingir progresso e avaliação final.
9. Emissão de certificado.

Prioridade de implementação para aluno:

- Dashboard funcional.
- Catálogo de cursos.
- Página de curso.
- Player de aula.
- Quiz/exercícios.
- Certificado.

## Fluxo Base Do MVP: Professor

O fluxo do professor no MVP segue esta ordem:

1. Login do professor.
2. Dashboard com cursos e métricas gerais.
3. Criar novo curso com título, capa e categoria.
4. Editar curso já publicado.
5. Editor de aulas com módulos, vídeos e materiais.
6. Upload de vídeo com progresso/processamento.
7. Criação de exercícios, quizzes e avaliações.
8. Publicação do curso no catálogo.
9. Área de alunos para acompanhar progresso e engajamento.

O acompanhamento de alunos é um acesso paralelo: o professor pode entrar nessa área a partir do dashboard ou a partir do curso publicado.

Prioridade de implementação para professor:

- Dashboard do professor.
- Criar curso.
- Editar curso.
- Editor de aulas.
- Upload de vídeo.
- Criar exercícios.
- Publicar curso.
- Acompanhar alunos.

## Páginas Estáticas

Páginas estáticas sem função no MVP devem ser evitadas.

Se uma tela ainda não tem comportamento real, escolha uma destas opções:

- Não criar a rota ainda.
- Criar uma tela mínima apenas quando ela fizer parte do fluxo MVP.
- Registrar a necessidade como tarefa futura.

Isso evita manter páginas que parecem prontas, mas não estão conectadas à API ou ao fluxo real.

## Checklist Para Novas Telas

Antes de abrir PR ou fazer merge, valide:

- A tela está na pasta correta: `pages/aluno`, `pages/professor` ou `pages`.
- A rota foi adicionada em `src/App.tsx`.
- A rota usa `RequireAuth` ou `RequireRole` quando necessário.
- A tela usa `Navbar` se for área interna.
- Chamadas de API estão em `services`.
- Estado assíncrono complexo está em `hooks`.
- Tipos compartilhados estão em `types`.
- Não há `.env.local` ou segredo no commit.
- O lint não aponta erros nos arquivos alterados.

## Convenções De Commit

Use mensagens curtas e diretas, seguindo o padrão já usado no repositório:

```txt
feat: adiciona fluxo do professor
fix: corrige redirecionamento de login
refactor: padroniza navbar
docs: documenta padronização do projeto
```

Prefira um commit por mudança coesa. Evite misturar feature, refactor e remoção de arquivos sem relação no mesmo commit.
