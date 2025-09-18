import './CadastroProduto.css';

import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

function CadastroProduto() {

    const [nomeProduto, setNomeProduto] = useState("");
    const [preco, setPreco] = useState(0);
    const [descricao, setDescricao] = useState("");
    const [imgUrl, setImgUrl] = useState("");

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const idProduto = searchParams.get("id");

    const navigate = useNavigate();

    useEffect(() => {
        if (idProduto) {
            axios.get(`http://localhost:3001/produtos/${idProduto}`)
            .then((response) => {
                console.log(response)
                const produto = response.data;
                setNomeProduto(produto.nome);
                setPreco(produto.preco);
                setDescricao(produto.descricao);
                setImgUrl(produto.imagem)
            })
            .catch(() => alert("Erro para encontrar produto"))
        }
    }, [idProduto])

    function handleSubmit(e) {
        e.preventDefault();

        const isEditando = !!idProduto;
        const url = isEditando
        ? `http://localhost:3001/produtos/${idProduto}` // PUT
        : 'http://localhost:3001/produtos';            // POST

        const method = isEditando ? 'PUT' : 'POST';

        axios({
        url,
        data: { nome: nomeProduto, preco, descricao, imagem: imgUrl},
        method
        })
        .then(() => {
            if (method === 'POST') {
                alert("Dados enviados com sucesso!");
                setNomeProduto("");
                setPreco(0);
                setDescricao("");
                setImgUrl("");

            } else {
                alert("Dados atualizados com sucesso!")
                navigate('/listagem')
            }
        })
        .catch(() => alert("Erro cadastrar envio"));
    }


    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="nome-produto">Nome do Produto</label>
            <input type="text" name='nome-produto' id='nome-produto' value={nomeProduto} onChange={(e) => {
                setNomeProduto(e.target.value);
            }}/>

            <label htmlFor="preco">Preço</label>
            <input type="number" name="preco" id="preco" value={preco} onChange={(e) => {
                setPreco(Number(e.target.value));
            }}/>

            <label htmlFor="descricao">Descrição</label>
            <textarea name="descricao" id="descricao" value={descricao} onChange={(e) => {
                setDescricao(e.target.value);
            }}></textarea>

            <label htmlFor="img-URL">URL imagem</label>
            <input type="text" name='img-URL' id='img-URL' value={imgUrl} onChange={(e) => {
                setImgUrl(e.target.value);
            }}/>

            <button>Cadastrar</button>
        </form>
    )
}   

export default CadastroProduto;