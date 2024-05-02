async function getData() {
    const data = await fetch("http://localhost:3000/produtos");
    return data.json();
}

async function getItems() {
    try {
        const data = await getData();

        const produtoContainer = document.querySelector('.p-container');
        produtoContainer.innerHTML = '';

        data.forEach(produto => {
            const produtoElement = document.createElement('div');
            produtoElement.classList.add('produto');

            const imagemElement = document.createElement('img');
            imagemElement.classList.add('image');
            imagemElement.src = produto.imagem;
            imagemElement.alt = 'Imagem do produto';

            const nomeElement = document.createElement('p');
            nomeElement.classList.add('name');
            nomeElement.textContent = produto.nome;

            const descricaoElement = document.createElement('div');
            descricaoElement.classList.add('descricao');

            const valorElement = document.createElement('p');
            valorElement.classList.add('price');
            valorElement.textContent = produto.valor;

            const lixeiraElement = document.createElement('button');
            lixeiraElement.innerHTML = '<img src="./image/lixeira.png" alt="Lixeira excluir" class="excluir">';
            lixeiraElement.classList.add('excluir');
            lixeiraElement.setAttribute('data-id', produto.id);

            lixeiraElement.addEventListener('click', async (event) => {
                event.preventDefault(); 

                const productId = lixeiraElement.dataset.id;

                try {
        
                    const response = await fetch(`http://localhost:3000/produtos/${productId}`, {
                        method: 'DELETE'
                    });

                    if (!response.ok) {
                        throw new Error('Erro ao excluir produto');
                    }

                    await getItems();
                } catch (error) {
                    console.error('Erro:', error);
                    alert('Ocorreu um erro ao excluir o produto.');
                }
            });
            descricaoElement.appendChild(valorElement);
            descricaoElement.appendChild(lixeiraElement);
            produtoElement.appendChild(imagemElement);
            produtoElement.appendChild(nomeElement);
            produtoElement.appendChild(descricaoElement);

            produtoContainer.appendChild(produtoElement);
        });
    } catch (error) {
        console.error('Erro:', error);
        alert('Ocorreu um erro ao atualizar os produtos.');
    }
}

async function adicionarProduto(event) {
    event.preventDefault(); 

    const form = document.getElementById('productForm');
    const nome = form.querySelector('.inserir-nome').value;
    const valor = form.querySelector('.inserir-valor').value;
    const imagem = form.querySelector('.inserir-imagem').value; 

    try {
        
        const response = await fetch('http://localhost:3000/produtos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome, valor, imagem })
        });

        if (!response.ok) {
            throw new Error('Erro ao adicionar produto');
        }

        await getItems();

         limparCampos();
    } catch (error) {
        console.error('Erro:', error);
        alert('Ocorreu um erro ao adicionar o produto.');
    }
}
function limparCampos() {
    const form = document.getElementById('productForm');
    form.querySelector('.inserir-nome').value = '';
    form.querySelector('.inserir-valor').value = '';
    form.querySelector('.inserir-imagem').value = '';
}

document.getElementById('productForm').addEventListener('submit', adicionarProduto);
getItems();

