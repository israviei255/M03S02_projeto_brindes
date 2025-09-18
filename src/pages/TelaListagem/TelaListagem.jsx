import './TelaListagem.css';

import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

function TelaListagem() {

    const [produtos, setProdutos] = useState([])
    const [propFiltro, setPropFiltro] = useState("")

    useEffect(() => {
        if (propFiltro === "") {
            axios.get('http://localhost:3001/produtos')
            .then((produtosAPI) => {
            setProdutos(produtosAPI.data)
            })
            .catch(() => alert("Erro ao buscar produtos"));
        }
    }, [propFiltro])

    function handleDelete(id) {
        if (!window.confirm("Tem certeza que deseja excluir este produto?")) return;

        axios.delete(`http://localhost:3001/produtos/${id}`)
        .then(() => {
            // Remove o produto excluído da lista local
            setProdutos(prevProdutos => prevProdutos.filter(produto => produto.id !== id));
        })
        .catch(error => {
                console.error('Erro ao excluir produto:', error);
        });
    }

    function handleSubmit(e) {
        e.preventDefault();

        axios.get('http://localhost:3001/produtos')
        .then((res) => {
            const produtosAPI = res.data;
            const produtosFiltrados = produtosAPI.filter(produto => 
            Object.values(produto).some(value => 
            String(value).toLowerCase().includes(propFiltro)
            ))

            setProdutos(produtosFiltrados);
        })
        .catch((error) => {
            console.error("Erro ao filtrar produtos:", error);
        });
    }

    return (
        <div>
            <form id='form-filtro' onSubmit={handleSubmit}>
                <input type="text" id='filtro' name='filtro' placeholder='propriedade' value={propFiltro} onChange={(e) => {
                    setPropFiltro(e.target.value)
                }}/>
                <button type='submit' id='btn-filtro'>Filtrar</button>
            </form>
            <ul className='cards'>
                {produtos.map((produto, index) => (
                    <li className='card' key={index}>
                        <h1 className='nome-produto'>{produto.nome}</h1>
                        <div><strong>Preço: </strong> R${produto.preco}</div>
                        <div><strong>Descrição: </strong>{produto.descricao}</div>
                        <img className='imagem-produto' src={produto.imagem} alt="imagem-produto" />
                        <section className='botoes-card'>
                            <Link to={`/?id=${produto.id}`}><button className='btn-branco' type='button'>Editar</button></Link>
                            <button className='btn-preto' type='button' onClick={() => handleDelete(produto.id)}>Excluir</button>
                        </section>
                    </li>
                ))}
            </ul>
        </div>
    )
}   

export default TelaListagem;