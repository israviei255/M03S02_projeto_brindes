import AddBoxIcon from "@mui/icons-material/AddBox";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Typography,
  Select,
  MenuItem,
  Box,
  Button,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Table,
  TableBody,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EnvioForm() {
  const navigate = useNavigate();

  // Lógica para a edição funcionar
  const params = useParams(); // acesso ao id que está na URL para edição
  console.log(params);

  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);

  const [clienteSelecionado, setClienteSelecioado] = useState("");
  const [produtoSelecionado, setProdutoSelecionado] = useState("");

  const [brindes, setBrindes] = useState([]);

  function adicionarBrinde() {
    if (!produtoSelecionado) {
      alert("Selecione um produto");
      return;
    }

    // Forma 1 de inserir no estado
    // const novoBrindes = [...brindes]
    // novoBrindes.push(produtoSelecionado)

    // Forma 2 de inserir no estado

    const dadosDoProdutoSelecionado = produtos.find(
      (produto) => produto.id === produtoSelecionado
    );
    setBrindes([...brindes, { ...dadosDoProdutoSelecionado, key: Date.now() }]);

    setProdutoSelecionado("");
  }

  console.log(brindes);

  useEffect(() => {
    // chamada para api para busca a lista de clientes
    axios
      .get("http://localhost:3001/clientes")
      .then((response) => {
        setClientes(response.data);
      })
      .catch(() => alert("Erro ao buscar clientes"));
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:3001/produtos")
      .then((response) => {
        setProdutos(response.data);
      })
      .catch(() => alert("Erro ao buscar os produtos"));
  }, []);

  function salvarEnvio(event) {
    event.preventDefault();

    if (!clienteSelecionado) {
      alert("Cliente é obrigatório");
    } else if (brindes.length === 0) {
      alert("O envio deve ter pelo menos 1 item");
    } else {
      // Lógica para a edição funcionar
      axios({
        url:  params.id ? `http://localhost:3001/envios/${params.id}` :'http://localhost:3001/envios' ,
        data: { cliente_id: clienteSelecionado, produtos_clientes: brindes },
        method: params.id ? 'PUT' : 'POST'
      })
        .then(() => {
          alert("Envio realizado com sucesso");
          navigate("/");
        })
        .catch(() => alert("Erro cadastrar envio"));
    }
  }

  async function salvarEnvioComTryCatch(event) {
    try {
      event.preventDefault();

      if (!clienteSelecionado) {
        alert("Cliente é obrigatório");
      } else if (brindes.length === 0) {
        alert("O envio deve ter pelo menos 1 item");
      } else {
        await axios.post("http://localhost:3001/envios", {
          cliente_id: clienteSelecionado,
          produtos_clientes: brindes,
        });

        alert("Envio realizado com sucesso");
        navigate("/envios");
      }
    } catch {
      alert("Erro cadastrar envio");
    }
  }

  // Lógica para a edição funcionar
  useEffect(() => {
    if (params.id) {
      axios
        .get(`http://localhost:3001/envios/${params.id}`)
        .then((response) => {
          setClienteSelecioado(response.data.cliente_id);
          setBrindes(response.data.produtos_clientes);
        })
        .catch(() => alert("erro ao buscar dados"));
    }
  }, []);

  function calcularTotal() {
    let soma = 0

    brindes.forEach(item => {
      soma = soma + item.preco
    })

    return soma.toFixed(2)
  }

  function calcularTotalComReducer(){
    return brindes.reduce((acumulador, itemAtual) => {
      return acumulador + itemAtual.preco
    }, 0)
  }

  function removerItemBrinde(key) {
   const novosBrindes = brindes.filter(brinde => brinde.key !== key)
   setBrindes(novosBrindes)
  }

  return (
    <form onSubmit={salvarEnvio}>
      <Card variant="outlined">
        <CardContent>
          <Typography as="h1">Cadastro de produto</Typography>

          <FormControl fullWidth style={{ marginBottom: "40px" }}>
            <InputLabel id="cliente">Clientes</InputLabel>
            <Select
              labelId="cliente"
              label="Selecione um cliente"
              value={clienteSelecionado}
              onChange={(event) => setClienteSelecioado(event.target.value)}
            >
              {clientes.map((cliente) => (
                <MenuItem key={cliente.id} value={cliente.id}>
                  {cliente.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box style={{ display: "flex", gap: "10px" }}>
            <FormControl fullWidth>
              <InputLabel id="cliente">Produto</InputLabel>
              <Select
                value={produtoSelecionado}
                onChange={(event) => setProdutoSelecionado(event.target.value)}
                labelId="Produto"
                label="Selecione um produto"
              >
                {produtos.map((produto) => (
                  <MenuItem key={produto.id} value={produto.id}>
                    {produto.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              disabled={!produtoSelecionado}
              onClick={adicionarBrinde}
              variant="contained"
              endIcon={<AddBoxIcon />}
            >
              Adicionar
            </Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>Valor</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {brindes.map((brinde) => (
                  <TableRow key={brinde.key}>
                    <TableCell>{brinde.nome}</TableCell>
                    <TableCell>{brinde.preco}</TableCell>
                    <TableCell>
                      
                      <DeleteIcon  onClick={() => removerItemBrinde(brinde.key)} style={{ color: "red" }} /> 
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box
            display="flex"
            justifyContent="flex-end"
            style={{ marginTop: "20px" }}
          >
            <Typography>Valor total dos mimos: {calcularTotalComReducer()}</Typography>
          </Box>
          <Box display="flex" justifyContent="flex-end">
            <Button type="submit" variant="outlined">
              {params.id ? "Editar" : "Cadastrar"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </form>
  );
}

export default EnvioForm;
