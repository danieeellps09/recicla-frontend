import React, { useState, useEffect } from "react";
import {
    Badge,
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
    FormLabel,
    Dropdown,
} from "react-bootstrap";
import InputMask from "react-input-mask";
import { BsSearch, BsEyeFill, BsPlusCircleFill } from "react-icons/bs";
import toast from "react-hot-toast";

import "bootstrap/dist/css/bootstrap.min.css";
import { format } from "date-fns";
import { API } from "../services/api";
import { Autenticacao } from "../config/Autenticacao";

const AdicionarVenda = (props) => {
    const [empresaCompradora, setEmpresaCompradora] = useState("");
    const [notaFiscal, setNotaFiscal] = useState("");
    const [dataVenda, setDataVenda] = useState("");
    const [produtos, setProdutos] = useState([]);
    const [materiais, setMateriais] = useState([]);
    const [selectedMaterial, setSelectedMaterial] = useState("");
    const [quantidade, setQuantidade] = useState("");
    const [visualSelectedMaterial, setVisualSelectedMaterial] = useState("");

    useEffect(() => {
        const fetchData = async (url, setterFunction) => {
            try {
                const response = await API.get(url);
                setterFunction(response.data);
            } catch (error) {
                console.error("Erro ao obter dados:", error);
            }
        };

        fetchData("/material", setMateriais);
    }, []);

    const handleMaterialChange = (material) => {
        setSelectedMaterial(material);
        setVisualSelectedMaterial(material.nome);
    };

    const handleAddProduto = () => {
        if (selectedMaterial && quantidade) {
            const newProduto = {
                idMaterial: selectedMaterial.id,
                nomeMaterial: selectedMaterial.nome,
                quantidade: parseFloat(quantidade),
            };

            setProdutos([...produtos, newProduto]);
            setVisualSelectedMaterial("");
            setQuantidade("");
        }
    };

    const handleSubmit = () => {
        const dataToSend = {
            empresaCompradora,
            notaFiscal,
            dataVenda,
            produtos: produtos.map((produto) => ({
                idMaterial: produto.idMaterial,
                quantidade: produto.quantidade,
            })),
        };

        const autenticacao = Autenticacao();
        const token = autenticacao.token;

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        API.post("/forms/venda", dataToSend, config)
            .then((response) => {
                if (response && response.data) {
                    setEmpresaCompradora("");
                    setNotaFiscal("");
                    setDataVenda("");
                    setProdutos([]);
                    toast.success("Venda adicionada com sucesso!");
                    props.onHide();
                    window.location.reload();
                } else {
                    console.error("Resposta inválida ao adicionar venda:", response);
                    toast.error(
                        "Erro ao adicionar venda. Resposta inválida do servidor."
                    );
                }
            })
            .catch((error) => {
                console.error("Erro ao adicionar venda:", error.response.data);
                const errorMessage =
                    error.response.data && error.response.data.message
                        ? error.response.data.message
                        : "Erro desconhecido ao adicionar venda.";

                toast.error(`Erro ao adicionar venda: ${errorMessage}`);
            });
    };

    return (
        <Modal {...props} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title style={{ color: "#EF7A2A" }}>Adicionar Venda</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row className="w-100 my-3">
                    <Form>
                        <Form.Label className="text-orange">
                            Empresa Compradora:{" "}
                        </Form.Label>
                        <Form.Control
                            type="text"
                            className="form-control custom-focus"
                            value={empresaCompradora}
                            onChange={(e) => setEmpresaCompradora(e.target.value)}
                        />
                    </Form>
                </Row>
                <Row className="w-100 my-3">
                    <Col>
                        <Form.Label className="text-orange">Nota Fiscal: </Form.Label>
                        <Form.Control
                            type="text"
                            className="form-control custom-focus"
                            value={notaFiscal}
                            onChange={(e) => setNotaFiscal(e.target.value)}
                        />
                    </Col>
                    <Col>
                        <Form.Label className="text-orange">Data da Venda: </Form.Label>
                        <InputMask
                            mask="99/99/9999"
                            maskChar="_"
                            value={dataVenda}
                            onChange={(e) => setDataVenda(e.target.value)}
                        >
                            {() => (
                                <Form.Control
                                    type="text"
                                    className="form-control custom-focus"
                                />
                            )}
                        </InputMask>
                    </Col>
                </Row>
                <Row className="w-100 my-3">
                    <Form>
                        <Form.Label className="text-orange">Materiais: </Form.Label>
                        <Dropdown className="w-100">
                            <Dropdown.Toggle
                                className="w-100 outline-white"
                                id="dropdown-basic"
                            >
                                {visualSelectedMaterial || "Selecione um Material"}
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="w-100 ">
                                {materiais.map((material) => (
                                    <Dropdown.Item
                                        key={material.id}
                                        onClick={() => handleMaterialChange(material)}
                                    >
                                        {material.nome}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                    </Form>
                </Row>
                <Row className="w-100 my-3">
                    <Col>
                        <Form.Label className="text-orange">Quantidade: </Form.Label>
                        <Form.Control
                            type="number"
                            className="form-control custom-focus"
                            value={quantidade}
                            onChange={(e) => setQuantidade(e.target.value)}
                        />
                    </Col>
                    <Col>
                        <Button
                            type="button"
                            className="btn-orange"
                            onClick={handleAddProduto}
                            style={{ marginTop: "32px" }}
                        >
                            Adicionar Produto
                        </Button>
                    </Col>
                </Row>
                <Row className="w-100 my-3">
                    <Col>
                        <Form.Label className="text-orange">Produtos Adicionados:</Form.Label>
                        <ListGroup>
                            {produtos.map((produto, index) => (
                                <ListGroup.Item key={index}>
                                    {produto.nomeMaterial} - Quantidade: {produto.quantidade} KG
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    type="submit"
                    className="rounded btn-orange w-100"
                    onClick={handleSubmit}
                >
                    Enviar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};


const VisualizarVenda = (props) => {
    const [empresaCompradora, setEmpresaCompradora] = useState("");
    const [notaFiscal, setNotaFiscal] = useState("");
    const [dataVenda, setDataVenda] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [venda, setVenda] = useState(null);
    const [vendaSelecionadaId, setVendaSelecionadaId] = useState(props.idVenda);

    useEffect(() => {
        const fetchData = async (url, setterFunction) => {
            try {
                const response = await API.get(url);

                if (response.data) {
                    const vendaData = response.data;

                    if ('dataVenda' in vendaData) {
                        console.log('Data bruta recebida:', vendaData.dataVenda);

                        setterFunction(vendaData);
                        setEmpresaCompradora(vendaData.empresaCompradora);
                        setNotaFiscal(vendaData.notaFiscal);

                        setDataVenda(format(new Date(vendaData.dataVenda), 'dd/MM/yyyy'));

                        setProdutos(vendaData.materiais);
                    } else {
                        console.error('A propriedade dataVenda não está presente no objeto:', vendaData);
                    }
                } else {
                    console.error('Resposta vazia ou sem dados:', response.data);
                }
            } catch (error) {
                console.error("Erro ao obter dados:", error);
            }
        };
        fetchData(`/forms/venda/${props.idVenda}`, setVenda);
    }, [props.idVenda]);




    return (
        <Modal {...props} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title style={{ color: "#EF7A2A" }}>Visualizar Venda</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row className="w-100 my-1">
                    <Form>
                        <Form.Group>
                            <Form.Label className="text-orange">Empresa Compradora: </Form.Label>
                            <Form.Control
                                type="text"
                                className="form-control custom-focus"
                                aria-label="Disabled input example"
                                value={empresaCompradora}
                                disabled
                            />
                        </Form.Group>
                    </Form>
                </Row>

                <Row className="w-100 my-3">
                    <Form>
                        <Form.Label className="text-orange">Nota Fiscal: </Form.Label>
                        <Form.Control
                            type="text"
                            className="form-control custom-focus"
                            aria-label="Disabled input example"
                            value={notaFiscal}
                            disabled
                        />
                    </Form>
                </Row>

                <Row className="w-100 my-3">
                    <Form>
                        <Form.Label className="text-orange">Data da Venda: </Form.Label>
                        <Form.Control
                            type="text"
                            className="form-control custom-focus"
                            value={dataVenda}

                            disabled
                        />
                    </Form>
                </Row>

                <Row className="w-100 my-3">
                    <Form>
                        <Form.Label className="text-orange">Produtos: </Form.Label>
                        {produtos ? (
                            produtos.map((produto, index) => (
                                <Form.Control
                                    key={index}
                                    type="text"
                                    className="form-control custom-focus mb-2"
                                    value={`${produto.quantidadeVendida} kg de ${produto.nomeMaterial}`}
                                    disabled
                                    readOnly
                                />
                            ))
                        ) : (
                            <p>Nenhum produto disponível</p>
                        )}
                    </Form>
                </Row>
            </Modal.Body>
        </Modal>
    );
};

const ListarVendas = () => {
    const [vendaData, setVendaData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [vendaSelecionadaId, setVendaSelecionadaId] = useState(null);
    const [modalAdicionarShow, setModalAdicionarShow] = useState(false);
    const [modalVisualizarShow, setModalVisualizarShow] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");


    const autenticacao = Autenticacao();
    const token = autenticacao.token;

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await API.get("/forms/venda/vendas/vendas-by-associacao", config);
                setVendaData(response.data);
                if (!showSuccessMessage) {
                    toast.success("Vendas listadas com sucesso!");
                    setShowSuccessMessage(true);
                }
            } catch (error) {
                console.error("Erro ao obter dados das vendas:", error);
                toast.error("Erro ao listar vendas. Verifique os dados e tente novamente.");
            }
        };

        fetchData();
    }, [searchQuery]);

    const showModalVisualizar = () => setModalVisualizarShow(true);
    const hideModalVisualizar = () => setModalVisualizarShow(false);

    const showModalAdicionar = () => setModalAdicionarShow(true);
    const hideModalAdicionar = () => setModalAdicionarShow(false);

    const paginateResults = (data, page, resultsPerPage) => {
        const startIndex = (page - 1) * resultsPerPage;
        const endIndex = startIndex + resultsPerPage;
        return data.slice(startIndex, endIndex);
    };

    const resultsPerPage = 5;

    const filteredVendas = vendaData
        ? vendaData.filter((venda) => {
            const searchString = searchQuery.toLowerCase();
            const idMatches = venda.id.toString().includes(searchString);
            const dataVendaMatches = venda.dataVenda.includes(searchString);
            const empresaCompradoraMatches = venda.empresaCompradora.includes(searchString);
            return idMatches || dataVendaMatches || empresaCompradoraMatches;
        })
        : [];

    const totalPages = vendaData
        ? Math.ceil(vendaData.length / resultsPerPage)
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
                    <Button
                        type="submit"
                        className="btn-orange"
                        onClick={showModalAdicionar}
                    >
                        <BsPlusCircleFill /> Adicionar
                    </Button>

                    {/* Componente para adicionar venda */}
                    <AdicionarVenda
                        show={modalAdicionarShow}
                        onHide={hideModalAdicionar}
                    />
                </Col>
                <Col>
                    <h3 className="m-3" style={{ color: "#EF7A2A" }}>
                        Vendas
                    </h3>
                    <ListGroup as="ol" numbered>
                        {paginateResults(filteredVendas, currentPage, resultsPerPage).map(
                            (venda, index) => (
                                <ListGroup.Item
                                    as="li"
                                    className="d-flex justify-content-between align-items-start"
                                >
                                    <div className="ms-2 me-auto">
                                        <div className="fw-bold">ID da Venda: {venda.id}</div>
                                        Data da Venda:{" "}
                                        {format(new Date(venda.dataVenda), "dd/MM/yyyy")} <br />
                                        Empresa Compradora: {venda.empresaCompradora}
                                    </div>
                                    <div>
                                        <Button
                                            type="submit"
                                            className="btn-orange"
                                            onClick={() => {
                                                setVendaSelecionadaId(venda.id);
                                                showModalVisualizar();
                                            }}
                                        >
                                            <BsEyeFill /> Visualizar
                                        </Button>
                                    </div>
                                </ListGroup.Item>
                            )
                        )}
                    </ListGroup>

                    {/* Componente para visualizar venda */}
                    {vendaSelecionadaId && (
                        <VisualizarVenda
                            show={modalVisualizarShow}
                            onHide={hideModalVisualizar}
                            idVenda={vendaSelecionadaId}
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
};

export default ListarVendas;