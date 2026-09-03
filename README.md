# RentEase

A Rentease é um comparador local de apartamentos para arrendamento. Permite registar apartamentos, comparar as suas características, filtrar, ordenar e adicionar a favoritos. Tudo isto em localStorage (só no browser)

## Funcionalidades concluídas

- [x] criar apartamentos;
- [x] guardar e recuperar dados com `localStorage`;
- [x] listar apartamentos;
- [x] filtrar por cidade, preço e área;
- [x] ordenar por cidade, preço e área;
- [x] marcar e desmarcar favoritos;
- [x] eliminar apartamentos;
- [x] apresentar resumo e favoritos na Home;
- [x] adaptar a interface a mobile.

## Como executar

Abre a pasta do projeto no Cursor (ou VS Code) e usa a extensão Live Server para abrir index.html. Não são necessárias dependências nem instalação — a aplicação corre apenas com HTML, CSS e JavaScript.

## Como utilizar

Na Home (index.html), vês o resumo com o total de apartamentos guardados e o número de favoritos, além da lista de apartamentos marcados como favoritos.

Em Apartamentos (flats.html), vês todos os apartamentos guardados, com filtros por cidade, preço e área, e ordenação por cidade, preço ou área. Cada cartão permite marcar/desmarcar como favorito ou eliminar.

Em Novo apartamento (new-flat.html), preenches o formulário com os dados do imóvel. Se algum campo for inválido, aparece uma mensagem de erro junto do campo. Depois de guardar com sucesso, o formulário limpa-se e aparece um link para veres o apartamento em Apartamentos.

## Testes realizados

- Criação de apartamentos com dados válidos e confirmação de que ficam visíveis em Apartamentos e persistem após reload.
- Submissão do formulário com campos inválidos (cidade e rua com menos de 2 caracteres, valores negativos, ano fora do intervalo 1900–ano atual, data em falta) e confirmação de que a aplicação impede a gravação e mostra as mensagens de erro correspondentes.
- Filtros de cidade, preço mínimo/máximo e área mínima/máxima testados isoladamente e em conjunto.
- As três ordenações (cidade, preço, área) testadas com vários apartamentos de valores diferentes.
- Marcar e desmarcar favoritos, testado em Apartamentos e confirmado que a Home atualiza e persiste após reload.
- Remover dos favoritos a partir da Home, confirmando que o apartamento continua em Apartamentos, só deixa de ser favorito.
- Eliminação de apartamentos, incluindo cancelar a confirmação (nada muda) e confirmar (apartamento removido e não volta após reload).
- Estados vazios: sem apartamentos guardados e sem resultados de filtro.
- Interface testada em ecrã reduzido (modo responsivo das devtools).

## Limitações conhecidas

- Não existe funcionalidade de editar um apartamento já criado (apenas criar e eliminar).
- Não há confirmação visual além da mensagem de feedback ao marcar/desmarcar favoritos.
- Os dados ficam apenas no browser e dispositivo usados — não há sincronização entre dispositivos.

## Autor

Diogo Dias (digastinho)
