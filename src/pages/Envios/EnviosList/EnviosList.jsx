import {
  Button,
  Card,
  CardContent,
  Input,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

import DeleteIcon from "@mui/icons-material/Delete";
import SearchOffOutlined from "@mui/icons-material/SearchOffOutlined";

import EditDocument from "@mui/icons-material/EditDocument";
import { useNavigate } from "react-router-dom";

import styles from "./EnvioList.module.css";
import { useRef } from "react";

function EnvioList() {
  const [envios, setEnvios] = useState([]);
  const [enviosFiltrados, setEnviosFiltrados] = useState([]);
  const navigate = useNavigate();

  const [termo, setTermo] = useState("");

  function buscarEnvios() {
    axios
      .get("http://localhost:3001/envios")
      .then((response) => {
        setEnvios(response.data);
        setEnviosFiltrados(response.data);
      })
      .catch(() => alert("Houve um erro"));
  }

  useEffect(() => {
    buscarEnvios();
  }, []);

  function deletarEnvio(id) {
    const resposta = window.confirm(
      "Tem certeza que deseja deletar este envio?"
    );

    if (resposta) {
      axios
        .delete(`http://localhost:3001/envios/${id}`)
        .then(() => {
          alert("Deletado com sucesso");
          buscarEnvios();
        })
        .catch(() => alert("Erro ao deletar envio"));
    }
  }

  function redirecionarParaEdicao(id) {
    navigate(`/envios/editar/${id}`);
  }

  function pesquisarTermo(event) {
    event.preventDefault();

    console.log("ENVIOS", envios);
    console.log("TERMO pesquisado", termo);

    const enviosFiltrados = envios.filter(
      (envio) =>
        envio.id.includes(termo) ||
        envio.cliente_nome.toUpperCase().includes(termo.toUpperCase()) || // pesquisa tanto qualquer palavra quanto qualquer CAIXA ALTA ou baixa
        envio.produtos_clientes.length.toString() === termo ||
        envio.valor_total.toFixed(2) === termo
    );

    setEnviosFiltrados(enviosFiltrados);
  }

  function useDebounce(callback, delay) {
    const timeoutRef = useRef();

    function debounced(...args) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    }

    return debounced;
  }

  // Debounced filter function
  const filtrarEnvios = (termo) => {
    console.log("EXECUTEI")
    const enviosFiltrados = envios.filter(
      (envio) =>
        envio.id.includes(termo) ||
        envio.cliente_nome.toUpperCase().includes(termo.toUpperCase()) ||
        envio.produtos_clientes.length.toString() === termo ||
        envio.valor_total.toFixed(2) === termo
    );
    setEnviosFiltrados(enviosFiltrados);
  };

  const debouncedFiltrarEnvios = useDebounce(filtrarEnvios, 1000);

  function lidarComPesquisaDoTermo(event) {
    setTermo(event.target.value);
    debouncedFiltrarEnvios(event.target.value);
  }

  // Debounce hook

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography as="h1">Envios feitos</Typography>

        <form className={styles.containerSearch} onSubmit={pesquisarTermo}>
          <Input
            id="search"
            startAdornment={
              <InputAdornment position="start">
                <SearchOffOutlined />
              </InputAdornment>
            }
            value={termo}
            onChange={lidarComPesquisaDoTermo}
            fullWidth
          />
          <Button type="submit">Buscar</Button>
        </form>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Código</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Items</TableCell>
                <TableCell>Valor</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {enviosFiltrados.map((envio) => (
                <TableRow key={envio.id}>
                  <TableCell>{envio.id}</TableCell>
                  <TableCell>{envio.cliente_nome}</TableCell>
                  <TableCell>{envio.produtos_clientes.length}</TableCell>
                  <TableCell>{envio.valor_total.toFixed(2)}</TableCell>
                  <TableCell>
                    <DeleteIcon
                      style={{ color: "red" }}
                      onClick={() => deletarEnvio(envio.id)}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "#b71c1c")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "red")
                      }
                    />

                    <EditDocument
                      style={{ color: "blue" }}
                      onClick={() => redirecionarParaEdicao(envio.id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}

export default EnvioList;
