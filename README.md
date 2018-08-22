# react-rust-ontology-editor
O código fonte aqui presente pertence ao projeto de elaboração do editor de ontologias Knowledge Graph Web Editor (KGWE). Este projeto, bem como a monografia, serão utilizados para obtenção do título de mestre pelo programa de pós graduação da USP (ICMC - São Carlos).

## Instalação

<h5><b>1. Ferramentas necessárias</b></h5>

<h6>1.1 NodeJS</h6>

O NodeJS é um interpretador de código JavaScript que funciona do lado do servidor. Utilizaremos ele para subir um servidor com o nosso front-end de demonstração. Basta realizar o [download](https://nodejs.org/en/download/) do executável e efetuar a instalação do mesmo. Para mais informações sobre o NodeJS, acesse a [documentação](https://nodejs.org/en/docs/).

<h6>1.2 GIT</h6>

O GIT é um sistema de controle de versão distribuído e um sistema de gerenciamento de código fonte, com ênfase em velocidade. Utilizaremos ele para realizar a cópia (clone) do repositório, criar ramificações (branch) com nossas alterações, entre outros. Basta realizar o [download](https://git-scm.com/download/win) do executável e efetuar a instalação do mesmo. Para mais informações sobre o GIT, acesse a [documentação](https://git-scm.com/docs).
Obs.: Há outras possibilidades para realizar as atividades acima, por exemplo, [SourceTree](https://www.sourcetreeapp.com/) ou [TortoiseGIT](https://tortoisegit.org/download/).

<h6>1.3 Editor de texto</h6>

É recomendado o uso de qualquer um dos seguintes editores: [IntelliJ IDEA](https://www.jetbrains.com/idea/download/), [Visual Studio Code](https://code.visualstudio.com/),  [Notepad++](https://notepad-plus-plus.org/download/v7.5.5.html) ou [Sublime Text](https://www.sublimetext.com/) devido aos plugins e aditivos que aumentam e melhoram a produtividade durante a etapa de desenvolvimento.

<h6>1.4 Rust</h6>

Instalar (usuários Windows) => rustup-init.exe (https://win.rustup.rs/)

<h6>1.5 Procedimentos de Instalação</h6>

- Passo 1 (ação): abrir o terminal de comando e navegar até a raiz do projeto (onde está localizado o arquivo Cargo.toml)
- Passo 2 (execute o comando): rustup update nightly
- Passo 3 (execute o comando): rustup target add wasm32-unknown-unknown --toolchain=nightly
- Passo 4 (execute o comando): cargo +nightly install wasm-bindgen-cli
- Passo 5 (execute o comando): cargo +nightly build --target wasm32-unknown-unknown
- Passo 6 (execute o comando): wasm-bindgen target/wasm32-unknown-unknown/debug/react_rust_ontology_editor.wasm --out-dir build
- Passo 7 (execute o comando): npm run build-wasm && npm run build-bindgen && npx webpack
- Passo 8 (execute o comando): npm install

## Execução do projeto

<h5><b>2. Procedimentos de execução</b></h5>

Para execução do projeto abra dois terminais de comando distintos.
No primeiro terminal execute o comando: **npm run serve**
No segundo terminal, execute o comando: **npm run watch**

O comando **npm run serve** irá executar o bundle gerado pelo webpack
O comando **npm run watch** irá executar o watch sobre os arquivos, gerando novos builds após alterações em classes Rust.

