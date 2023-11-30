import React, { useState, useEffect } from "react";
import {
  Button,
  Col,
  Container,
  Row,
  Image,
  Dropdown,
  Form,
  Stack,
} from "react-bootstrap";
import "../style/css.css";
import {
  BsArrowLeftShort,
  BsDownload,
  BsEyeFill,
  BsCaretRightFill,
} from "react-icons/bs";
import axios from "axios";
import { Autenticacao } from "../config/Autenticacao";
import { useLocation, useNavigate } from 'react-router-dom';



function RelatorioColeta() {
  const [catadorName, setCatadorName] = useState('');
  const [funcaoName, setFuncaoName] = useState('');
  const [associacaoName, setAssociacaoName] = useState('');

  const [veiculos, setVeiculos] = useState([]);
  const [quantidadeTotal, setQuantidadeTotal] = useState(0);
  const [rotasTotais, setRotasTotais] = useState(0);
  const [veiculosUtilizados, setVeiculosUtilizados] = useState([]);
  const [rotasRealizadas, setRotasRealizadas] = useState(0);
  const [idCatador, setIdCatador] = useState('');
  const [completo, setCompleto] = useState(false);





  const location = useLocation();
  const coletas = location.state?.coletas || [];
  const dataInicialParam = location.state?.startDate || '';
  const dataFinalParam = location.state?.endDate || '';


  const autenticacao = Autenticacao();
  const token = autenticacao.token;

  const config = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };
  const fetchCatadorName = async (idCatador) => {
    try {
      const response = await axios.get(`http://3.129.19.7:3000/api/v1/catadores/${idCatador}`, config);
      setCatadorName(response.data.user.name);
      setFuncaoName(response.data.funcoescatador.funcao)
    } catch (error) {
      console.error('Erro ao obter nome do catador:', error);
    }
  };

  const fetchAssociacaoName = async (idAssociacao) => {
    try {
      const response = await axios.get(`http://3.129.19.7:3000/api/v1/associacoes/${idAssociacao}`, config);
      setAssociacaoName(response.data.user.name);
    } catch (error) {
      console.error('Erro ao obter nome do associacao:', error);
    }
  };
  const fetchVeiculoInfo = async (veiculoId) => {
    try {
      const response = await axios.get(`http://3.129.19.7:3000/api/v1/veiculos/${veiculoId}`);
      const veiculo = response.data.nomeVeiculo;
      setVeiculosUtilizados((prevVeiculos) => prevVeiculos.includes(veiculo) ? prevVeiculos : [...prevVeiculos, veiculo]);
    } catch (error) {
      console.error('Erro ao obter informações do veículo:', error);
    }
  };


  const calcularRotasRealizadas = (coletas) => {
    return coletas.reduce((total, coleta) => {
      // Se a coleta foi realizada em todos os pontos (pergunta === true), incrementa o total
      return coleta.pergunta ? total + 1 : total;
    }, 0);
  };

  const calcularQuantidadeTotal = (coletas) => {
    return coletas.reduce((total, coleta) => total + coleta.quantidade, 0);
  };

  const calcularRotasTotais = (coletas) => {
    return coletas.length;
  };
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const formatarData = (data) => {
    const dataObj = new Date(data);
    const dia = String(dataObj.getDate()).padStart(2, '0');
    const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
    const ano = dataObj.getFullYear();
    return `${dia}/${mes}/${ano}`;
  };

  const formatarDataHora = (data) => {
    const dataObj = new Date(data);
    const dia = String(dataObj.getDate()).padStart(2, '0');
    const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
    const ano = dataObj.getFullYear();
    const hora = String(dataObj.getHours()).padStart(2, '0');
    const minutos = String(dataObj.getMinutes()).padStart(2, '0');
    return `${dia}/${mes}/${ano} ${hora}:${minutos}`;
  };


  useEffect(() => {
    if (coletas && coletas.length > 0) {
      coletas.forEach((coleta) => {

        setIdCatador(coleta.idCatador)
        fetchCatadorName(coleta.idCatador);
        fetchAssociacaoName(coleta.idAssociacao);
        fetchVeiculoInfo(coleta.idVeiculo);
      });

      const total = calcularQuantidadeTotal(coletas);
      setQuantidadeTotal(total);

      const rotasTotais = calcularRotasTotais(coletas);
      setRotasTotais(rotasTotais);

      const rotasRealizadasCount = calcularRotasRealizadas(coletas);
      setRotasRealizadas(rotasRealizadasCount);

      console.log('coletas dentro do useEffect:', coletas);
      console.log('useEffect em RelatorioColeta foi chamado.');

    }
  }, [coletas]);
  const handleDownloadPDF = async () => {
    try {
  
       const downloadURL = `http://3.129.19.7:3000/api/v1/pdf/coleta/${idCatador}?completo=${completo}&datainicio=${formatarData(dataInicialParam)}&datafim=${formatarData(dataFinalParam)}`;
  
       window.open(downloadURL, '_blank');
    } catch (error) {
       console.error('Erro ao baixar o relatório:', error);
    }
  };
  return (
    <>
      <Container
        className="border bg-white rounded-5 shadow mt-5 w-100 justify-content-center p-5"
        style={{ minWidth: "90vh" }}
      >
        <Row>
          <Col>
            <Row className="mb-3">
              <Col className="w-25 ">
                <Form.Label className="text-orange fw-bold">DATA INICIAL</Form.Label>
                <Form.Control type="date" disabled className="custom-focus" value={dataInicialParam} />
              </Col>
              <Col className="w-25 ">
                <Form.Label className="text-orange fw-bold">DATA FINAL</Form.Label>
                <Form.Control type="date" disabled className="custom-focus" value={dataFinalParam} />
              </Col>
            </Row>
          </Col>
          <Col className="d-flex align-items-center justify-content-end">
            <Form.Label className="text-end fw-bold small text-secondary">
              RELATÓRIO DE COLETA - ASSOCIAÇÃO  {associacaoName}
              <br />
              RELATÓRIO EXTRAÍDO ÀS {formatarDataHora(new Date())}
            </Form.Label>
          </Col>
          <hr className="mb-4" />
        </Row>
        <Row className="w-100 my-1">
          <Col>
            <Form.Label className="w-100 text-orange">Catador:</Form.Label>
            <Form.Control
              type="text"
              className="form-control custom-focus"
              value={catadorName}
              aria-label="Disabled input exampl"
              disabled
            />
          </Col>
          <Col>
            <Form.Label className="text-orange">Função:</Form.Label>
            <Form.Label className="d-flex align-items-center text-orange">
              <Form.Control
                type="text"
                className="form-control custom-focus"
                value={funcaoName}
                aria-label="Disabled input exampl"
                disabled
              />
            </Form.Label>
          </Col>
        </Row>

        <Row className="w-100 my-3">
          <Col>
            <Form.Label className="w-100 text-orange">Rotas totais:</Form.Label>
            <Form.Control
              type="number"
              className="form-control custom-focus"
              value={rotasTotais}
              aria-label="Disabled input exampl"
              disabled
            />
          </Col>
          
          <Col>
            <Form.Label className="text-orange">
              Quantidade de residíduos coletados:{" "}
            </Form.Label>
            {coletas.map((coleta, index) => (
              <div key={index} className="d-flex align-items-center">
                <Form.Control
                  type="text"
                  className="form-control custom-focus"
                  style={{ width: '100px' }}
                  value={`${coleta.quantidade} kg`}
                  aria-label="Disabled input example"
                  disabled
                />
                <span className="mx-2">em</span>
                <Form.Control
                  type="text"
                  className="form-control custom-focus"
                  style={{ width: '150px' }}
                  value={formatarData(coleta.dataColeta)} 
                  aria-label="Disabled input example"
                  disabled
                />
              </div>

            ))}
          </Col>
        </Row>
        <Row className="w-100 my-1">
  <Col>
    {/* Novo campo para mostrar a quantidade de rotas realizadas */}
    <Form.Label className="w-100 text-orange">
      Rotas totais realizadas em todos os pontos:
    </Form.Label>
    <Form.Control
      type="text"
      className="form-control custom-focus"
      style={{ width: '150px' }}
      value={rotasRealizadas}
      aria-label="Disabled input exampl"
      disabled
    />
  </Col>
</Row>
        <Row className="w-100 my-3">
          <Col>
            <Form.Label className="w-100 text-orange">Veículos usados no período:</Form.Label>
            {veiculosUtilizados.map((veiculo, index) => (
              <div key={index} className="d-flex align-items-center">
                <Form.Control
                  type="text"
                  className="form-control custom-focus w-100"
                  value={veiculo}
                  aria-label="Disabled input exampl"
                  disabled
                />
                <BsCaretRightFill className="ml-2 text-orange" />
              </div>
            ))}
          </Col>
          <Col>
            <Form.Label className="text-orange">
              Quantidade total coletado
            </Form.Label>
            <Form.Control
              type="text" // Alterado o tipo para texto
              className="form-control custom-focus"
              value={`${quantidadeTotal} kg`} // Adicionado " kg" ao valor
              aria-label="Disabled input exampl"
              disabled
            />

          </Col>
          <div className="mt-5 d-flex center justify-content-evenly">
            <Button type="submit" className="w-25 mx-2 btn-orange"
                        onClick={handleDownloadPDF}
                        >
              <BsDownload /> Baixar
            </Button>
            <Button type="submit" className="w-25 mx-2 outline-white"
            onClick={handleGoBack}>
              <BsArrowLeftShort /> Voltar
            </Button>
          </div>
        </Row>
      </Container>
    </>
  );
}

export default RelatorioColeta;
