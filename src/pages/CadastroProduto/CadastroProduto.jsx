import './CadastroProduto.css';

import { useState } from 'react';

function CadastroProduto() {

    const [nomeProduto, setNomeProduto] = useState("");
    const [preco, setPreco] = useState(0);
    const [descricao, setDescricao] = useState("");

    function handleSubmit(e) {
        e.preventDefault();

        axios({
        url: 'http://localhost:3001/produtos',
        data: { nomeProduto, preco, descricao },
        method: 'POST'
        })
        .then(() => {
          alert("Envio realizado com sucesso");
        })
        .catch(() => alert("Erro cadastrar envio"));
    }


    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="nome-produto">Nome do Produto</label>
            <input type="text" name='nome-produto' id='nome-produto' value={nomeProduto} onClick={(e) => {
                setNomeProduto(e.target.value);
            }}/>

            <label htmlFor="preco">Preço</label>
            <input type="number" name="preco" id="preco" value={preco} onClick={(e) => {
                setPreco(e.target.value);
            }}/>

            <label htmlFor="descricao">Descrição</label>
            <textarea name="descricao" id="descricao" value={descricao} onClick={(e) => {
                setDescricao(e.target.value);
            }}></textarea>

            <button>Cadastrar</button>
        </form>
    )
}   

export default CadastroProduto;