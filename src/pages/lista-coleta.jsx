import React, { useState } from "react";
import {
  Button,
  Col,
  Container,
  FormControl,
  InputGroup,
  ListGroup,
  Pagination,
  Row,
  Modal,
  Form,
  Dropdown,
} from "react-bootstrap";
import InputMask from "react-input-mask";
import {
  BsPlusCircleFill,
  BsSearch,
  BsEyeFill,
} from "react-icons/bs";
import "../style/css.css";
import { useEffect } from "react";
import { Autenticacao } from "../config/Autenticacao";
import toast from "react-hot-toast";

import "bootstrap/dist/css/bootstrap.min.css";
import { format } from "date-fns";
import { API } from "../services/api";



const Visualizar = (props) => {
  const [nome, setNome] = useState("");
  const [rota, setRota] = useState(null);
  const [quantidade, setQuantidade] = useState(null);
  const [motivo, setMotivo] = useState("");
  const [data, setData] = useState("");
  const [veiculos, setVeiculos] = useState([]);
  const [pergunta, setPergunta] = useState(null);
  const [coleta, setColeta] = useState(null);
  const [coletaSelecionadoId, setColetaSelecionadoId] = useState(
    props.idColeta
  );

  useEffect(() => {
    const fetchData = async (url, setterFunction) => {
      try {
        const response = await API.get(url);
        setterFunction(response.data);
        setQuantidade(response.data.quantidade);
        setPergunta(response.data.pergunta);
        setMotivo(response.data.motivo);
        setVeiculos(response.data.id);
        setRota(response.data.numRota);
        setData(response.data.dataColeta);
        fetchCatadorName(response.data.idCatador);
        fetchVeiculoName(response.data.idVeiculo);
      } catch (error) {
        console.error("Erro ao obter dados:", error);
      }
    };
    fetchData(`/forms/coleta/${props.idColeta}`, setColeta);
  }, [props.idColeta]);

  const fetchCatadorName = async (idCatador) => {
    try {
      const response = await API.get(`/catadores/${idCatador}`);
      setNome(response.data.user.name);
    } catch (error) {
      console.error("Erro ao obter o nome do catador:", error);
    }
  };

  const fetchVeiculoName = async (idVeiculo) => {
    try {
      const response = await API.get(`/veiculos/${idVeiculo}`);
      setVeiculos(response.data.nomeVeiculo);
    } catch (error) {
      console.error("Erro ao obter o nome do catador:", error);
    }
  };

  const getResposta = (valor) => (valor ? "Sim" : "Não");

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        <Row className="w-100 my-1">
          <Form>
            <Form.Group>
              <Form.Label className="text-orange">Nome do Catador: </Form.Label>
              <Form.Control
                type="text"
                className="form-control custom-focus"
                aria-label="Disabled input example"
                value={nome}
                disabled
              />
            </Form.Group>
          </Form>
        </Row>

        <Row className="w-100 my-3">
          <Col>
            <Form.Label className="w-100 text-orange">Rota</Form.Label>
            <Form.Control
              type="number"
              className="form-control custom-focus"
              aria-label="Disabled input example"
              value={rota}
              disabled
            />
          </Col>
          <Col>
            <Form.Label className="text-orange">
              Quantidade de residíduos coletados:{" "}
            </Form.Label>
            <Form.Label className="d-flex align-items-center text-orange">
              <Form.Control
                type="text"
                className="form-control custom-focus"
                aria-label="Disabled input example"
                value={`${quantidade} KG`}
                disabled
              />
            </Form.Label>
          </Col>
        </Row>

        <Row className="w-100 my-3">
          <Form>
            <Form.Label className="text-orange">Tipo de Veículo: </Form.Label>
            <Form.Control
              type="text"
              className="form-control custom-focus"
              aria-label="Disabled input example"
              value={veiculos}
              disabled
            />
          </Form>
        </Row>
        <Row className="w-100 my-3">
          <Col>
            <Form.Label className="text-orange">
              {" "}
              Todos os pontos foram visitados?{" "}
            </Form.Label>
            <Form.Control
              type="text"
              className="form-control custom-focus"
              aria-label="Disabled input example"
              value={getResposta(pergunta)}
              disabled
            />
          </Col>
        </Row>

        <Row className="w-100 my-3">
          <Form>
            <Form.Label className="text-orange"> Motivo </Form.Label>
            <Form.Control
              type="text"
              className="form-control custom-focus"
              aria-label="Disabled input example"
              value={getResposta(pergunta) === "Sim" ? "" : motivo}
              disabled
            />
          </Form>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

function ListarColetasCatador() {
  const [coletaData, setColetaData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [coletaSelecionadoId, setColetaSelecionadaId] = useState(null);
  const [modalAdicionarShow, setModalAdicionarShow] = useState(false);
  const [modalVisualizarShow, setModalVisualizarShow] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const filteredColetas = coletaData
    ? coletaData.filter((coleta) => {
      const searchString = searchQuery.toLowerCase();
      const idMatches = coleta.id.toString().includes(searchString);
      const dataColetaMatches = coleta.dataColeta.includes(searchString);
      const quantidadeMatches = coleta.quantidade
        .toString()
        .includes(searchString);
      return idMatches || dataColetaMatches || quantidadeMatches;
    })
    : [];
  const autenticacao = Autenticacao();
  const token = autenticacao.token;

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    API.get("/forms/coleta", config)
      .then((response) => {
        setColetaData(response.data);
        if (!showSuccessMessage) {
          toast.success("coletas listados com sucesso!");
          setShowSuccessMessage(true);
        }
      })
      .catch((error) => {
        console.error("Erro ao obter os dados do catador:", error);
        toast.error(
          "Erro ao lista coletas. Verifique os dados e tente novamente."
        );
      });
  }, [searchQuery]);



  const paginateResults = (data, page, resultsPerPage) => {
    const startIndex = (page - 1) * resultsPerPage;
    const endIndex = startIndex + resultsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const resultsPerPage = 4;

  const currentResults = coletaData
    ? paginateResults(coletaData, currentPage, resultsPerPage)
    : [];

  const totalPages = coletaData
    ? Math.ceil(coletaData.length / resultsPerPage)
    : 0;

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "90vh" }}
    >
      <Row className="border bg-white rounded-5 shadow mt-5 w-100 justify-content-center p-5">
        <Col
          md={12}
          className="d-flex align-items-center justify-content-between"
        >
          <InputGroup className="w-75">
            <FormControl
              className="custom-focus"
              placeholder="Pesquisar"
              aria-label="Pesquisar"
              aria-describedby="basic-addon2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit" className="btn-orange" id="button-addon2">
              <BsSearch className="" /> Buscar
            </Button>
          </InputGroup>



        </Col>
        <Col>
          <h3 className="m-3" style={{ color: "#EF7A2A" }}>
            Formularios
          </h3>
          <ListGroup as="ol" numbered>
            {paginateResults(filteredColetas, currentPage, resultsPerPage).map(
              (coleta, index) => (
                <ListGroup.Item
                  as="li"
                  className="d-flex justify-content-between align-items-start"
                >
                  <div className="ms-2 me-auto">
                    <div className="fw-bold">Numero da Coleta: {coleta.id}</div>
                    Data da Coleta:{" "}
                    {format(new Date(coleta.dataColeta), "dd/MM/yyyy")} <br />
                    Quantidade Coletada: {coleta.quantidade} KG
                  </div>
                  <div>
                    <Button
                      type="submit"
                      className="btn-orange"
                      onClick={() => {
                        setColetaSelecionadaId(coleta.id);
                        setModalVisualizarShow(true);
                      }}
                    >
                      <BsEyeFill /> Visualizar
                    </Button>
                  </div>
                </ListGroup.Item>
              )
            )}
          </ListGroup>
          {coletaSelecionadoId && (
            <Visualizar
              show={modalVisualizarShow}
              onHide={() => setModalVisualizarShow(false)}
              idColeta={coletaSelecionadoId}
            />
          )}

          <Pagination className="pagination-orange mt-3 justify-content-center">
            <Pagination.Prev
              onClick={() =>
                setCurrentPage((prevPage) =>
                  prevPage > 1 ? prevPage - 1 : prevPage
                )
              }
            >
              Anterior
            </Pagination.Prev>
            {Array.from({ length: totalPages }, (_, index) => (
              <Pagination.Item
                key={index + 1}
                active={currentPage === index + 1}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() =>
                setCurrentPage((prevPage) =>
                  prevPage < totalPages ? prevPage + 1 : prevPage
                )
              }
            >
              Próxima
            </Pagination.Next>
          </Pagination>
        </Col>
      </Row>
    </Container>
  );
}

export default ListarColetasCatador;
