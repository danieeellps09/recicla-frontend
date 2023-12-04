import React, { useState, useEffect } from "react";
import { Button, Col, Container, Row, Image, Dropdown, Form, Stack } from "react-bootstrap";
import "../style/css.css";
import { BsArrowLeftShort, BsDownload, BsEyeFill, BsCaretRightFill } from "react-icons/bs";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from "axios";
import { Autenticacao } from "../config/Autenticacao";
import { id } from "date-fns/locale";



function RelatorioVenda() {
  const [associacaoName, setAssociacaoName] = useState('');
  const [materiaisVendidos, setMateriaisVendidos] = useState([]);
  const [quantidadeMateriaisVendidos, setQuantidadeMateriaisVendidos] = useState(0);
  const [pesoTotalComercializado, setPesoTotalComercializado] = useState(0);
  const [idAssociacao, setIdAssociacao] = useState('');
const [completo, setCompleto] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const vendas = location.state?.vendas || [];
  const dataInicialParam = location.state?.startDate || '';
  const dataFinalParam = location.state?.endDate || '';

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

  const autenticacao = Autenticacao();
  const token = autenticacao.token;

  const config = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const fetchAssociacaoName = async (idAssociacao) => {
    try {
      const response = await axios.get(`http://3.129.19.7:3000/api/v1/associacoes/${idAssociacao}`, config);
      setAssociacaoName(response.data.user.name);
    } catch (error) {
      console.error('Erro ao obter nome do associacao:', error);
    }
  };

  useEffect(() => {
    const processarDados = () => {
   
   
   
      if (vendas && vendas.length > 0) {
        vendas.forEach((venda) => {

          const idAssociacao = venda.idAssociacao
          fetchAssociacaoName(idAssociacao);
          setIdAssociacao(idAssociacao)
        });
      }

      const materiais = {};

      vendas.forEach((venda) => {
        venda.materiais.forEach((material) => {
          const { idMaterial, quantidadeVendida, nomeMaterial } = material;

          if (!materiais[idMaterial]) {
            materiais[idMaterial] = {
              nome: nomeMaterial,
              quantidadeVendida: 0,
              pesoTotal: 0,
            };
          }

          materiais[idMaterial].quantidadeVendida += quantidadeVendida;
          materiais[idMaterial].pesoTotal += quantidadeVendida; // Ou ajuste conforme necessário
        });

        
      });

      setMateriaisVendidos(Object.values(materiais));
    };

    processarDados();
  }, [vendas]);



 const handleDownload = async () => {
  try {

     const downloadURL = `http://3.129.19.7:3000/api/v1/pdf/venda/${idAssociacao}?completo=${completo}&datainicio=${formatarData(dataInicialParam)}&datafim=${formatarData(dataFinalParam)}`;

     window.open(downloadURL, '_blank');
  } catch (error) {
     console.error('Erro ao baixar o relatório:', error);
  }
};

  const quantidadeMateriaisVendidosNoPeriodo = materiaisVendidos.reduce(
    (total, material) => total + material.quantidadeVendida,
    0
  );
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
                <Form.Control type="date" disabled className="custom-focus"  value={dataInicialParam}/>
              </Col>
              <Col className="w-25 ">
                <Form.Label className="text-orange fw-bold">DATA FINAL</Form.Label>
                <Form.Control type="date" disabled className="custom-focus" value={dataFinalParam}/>
              </Col>
            </Row>
          </Col>
          <Col className="d-flex align-items-center justify-content-end">
            <Form.Label className="text-end fw-bold small text-secondary">
              RELATÓRIO DE VENDAS - ASSOCIAÇÃO {associacaoName}
              <br />
              RELATÓRIO EXTRAÍDO ÀS {formatarDataHora(new Date())}
            </Form.Label>
          </Col>
          <hr className="mb-4" />
        </Row>

        <Row className="w-100 my-3">
          <Col>
            <Form.Label className="w-100 text-orange">Materiais vendidos no período:</Form.Label>
            {materiaisVendidos.map((material, index) => (
              <div key={index} className="d-flex align-items-center">
                <Form.Control
                  type="text"
                  className="form-control custom-focus w-100"
                  value={material.nome}
                  aria-label="Disabled input example"
                  disabled
                />
                <BsCaretRightFill className="ml-2 text-orange" />
              </div>
            ))}
          </Col>
          <Col>
            <Form.Label className="text-orange">Quantidade comercializada por material:</Form.Label>
            {materiaisVendidos.map((material, index) => (
              <Form.Control
                key={index}
                type="text"
                className="form-control custom-focus"
                value={`${material.pesoTotal} kg`}
                placeholder="0 kg"
                aria-label="Disabled input exampl"
                disabled
              />
            ))}
              <Form.Label className="text-orange">Quantidade de materiais vendidos no período:</Form.Label>
            <Form.Control
              type="text"
              className="form-control custom-focus"
              style={{ width: '120px' }}
              value={`${quantidadeMateriaisVendidosNoPeriodo} kg`}
              aria-label="Disabled input example"
              disabled
            />
          </Col>

        </Row>


       

        <Row>
          <div className="mt-5 d-flex center justify-content-evenly">
            <Button type="submit" className="w-25 mx-2 btn-orange"  onClick={handleDownload}>
              <BsDownload /> Baixar
            </Button>
            <Button type="submit" className="w-25 mx-2 outline-white" onClick={handleGoBack}  >
              <BsArrowLeftShort /> Voltar
            </Button>
          </div>
        </Row>

      </Container>
    </>
  );
}

export default RelatorioVenda;
