# Diagnóstico Digital MR3 — como colocar no ar

O site tem duas partes:

- **`index.html`**: a página do formulário que o cliente preenche.
- **`google-apps-script.gs`**: um script que grava cada resposta numa **planilha do Google** (uma linha por resposta).

Custo: zero. Você vê as respostas direto no Google Planilhas e pode exportar para Excel quando quiser.

---

## Passo 1: criar a planilha e o script (uns 5 minutos)

1. Acesse [sheets.new](https://sheets.new) para criar uma planilha nova. Dê um nome, por exemplo *Diagnóstico Digital – Respostas*.
2. No menu, vá em **Extensões → Apps Script**.
3. Apague o código que aparece e cole **todo** o conteúdo do arquivo `google-apps-script.gs`.
   - Se quiser receber um e-mail a cada resposta, coloque seu e-mail em `EMAIL_AVISO = "seu@email.com"`.
4. Clique em **Salvar** (ícone de disquete).
5. Clique em **Implantar → Nova implantação**.
   - Em "Selecione o tipo", clique na engrenagem e escolha **App da Web**.
   - **Executar como:** *Eu*
   - **Quem pode acessar:** *Qualquer pessoa*
   - Clique em **Implantar** e autorize o acesso com sua conta Google (em "App não verificado", clique em *Avançado → Acessar*; o app é seu).
6. Copie a **URL do app da Web** (algo como `https://script.google.com/macros/s/AKfy.../exec`).

## Passo 2: ligar o formulário à planilha

Abra o `index.html` num editor de texto (o Bloco de Notas serve), procure esta linha:

```js
const ENDPOINT = "";
```

e cole a URL entre as aspas:

```js
const ENDPOINT = "https://script.google.com/macros/s/AKfy.../exec";
```

Salve. Abra o `index.html` no navegador, preencha um teste e confira se a linha aparece na aba **Respostas** da planilha.

## Passo 3: publicar o site (link para enviar aos clientes)

Escolha uma das opções gratuitas:

- **Netlify Drop**: acesse [app.netlify.com/drop](https://app.netlify.com/drop) e arraste a pasta com o `index.html`. Ele gera um link na hora.
- **Vercel**: `npx vercel` dentro desta pasta.
- **Site da MR3**: suba o `index.html` para a hospedagem atual (ex.: `mr3comunicacao.com.br/diagnostico`).

---

## Dúvidas comuns

- **Mudei o script e nada mudou?** Depois de editar o código no Apps Script, vá em **Implantar → Gerenciar implantações → (lápis) → Versão: Nova versão → Implantar**. A URL continua a mesma.
- **Quero mudar uma pergunta:** edite a lista `QUESTIONS` no `index.html`. Se mudar o `id` de uma pergunta, ajuste também a lista `COLUNAS` no script.
- **Spam:** o formulário tem um campo invisível que barra robôs simples.
