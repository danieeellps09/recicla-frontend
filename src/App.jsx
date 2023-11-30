import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ListaCatador from './pages/lista-catador';
import Login from './pages/login'
import AcompanhamentoColeta from './pages/acompanhamento-coleta';
import Header from './components/header'
import HeaderLogin from './components/header-login';
import Admin from './pages/admin';
import { Toaster } from "react-hot-toast";
import Catador from './pages/catador';
import Associacao from './pages/associacao';
import OperadorLogistico from './pages/operadorLogistico';
import Perfil from './pages/perfil';
import { AutenticacaoGeral } from './config/AutenticacaoGeral';
import { ProtecaoAssociacao } from './config/ProtecaoAssociacao';
import { ProtecaoCatador } from './config/ProtecaoCatador';
import { ProtecaoAdmin } from './config/ProtecaoAdmin';
import { ProtecaoLogistica } from './config/ProtecaoLogistica';
import ListaColeta from './pages/lista-coleta';
import RelatorioColeta from './pages/relatorio-coleta';
import RelatorioVenda from './pages/relatorio-venda';
import ListaRelatorioColeta from './pages/lista-relatorio-coleta';
import ListaRelatorioVenda from './pages/lista-relatorio-venda';
import ListarAdministradores from './pages/lista-adm';
import ListarAssociacoes from './pages/lista-associacao';
import ListarTodosCatadores from './pages/lista-catador-adm';
import PaginaNaoEncontrada from './pages/pagina-nao-encontrada';
import ListaVenda from './pages/lista-venda';
import ListaRelatorioColetaCatador from './pages/lista-relatorio-coleta-catador';
import ListaRelatorioVendaAssociacao from './pages/lista-relatorio-venda-associacao';
import ListarOperadorLogistico from './pages/lista-operador';
import RedefinirSenha from './pages/resetar-senha';
import ListarColetasCatador from './pages/lista-coleta-catador';
import RelatorioColetaAdm from './pages/relatorio-coleta-adm';
import RelatorioVendaAdm from './pages/relatorio-venda-adm';


function App() {
  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<React.Fragment><HeaderLogin /><Login /></React.Fragment>} />

          <Route path="/resetar-senha/:token" element={<RedefinirSenha/>} />



          {/* Rota Geral */}
          <Route path="/" element={<AutenticacaoGeral />}>

            <Route path='*' element={<React.Fragment><Header/><PaginaNaoEncontrada/></React.Fragment>}/>
          </Route>

          {/* Rota CATADOR */}
          <Route path="/" element={<ProtecaoCatador />}>
            <Route path="/perfil-catador" element={<React.Fragment><Header /><Catador /></React.Fragment>} />
            <Route path="/lista-coleta-catador" element={<React.Fragment><Header /><ListarColetasCatador /></React.Fragment>} />
            <Route path="/lista-relatorio-coleta-catador" element={<React.Fragment><Header /><ListaRelatorioColetaCatador /></React.Fragment>} />
            <Route path="/relatorio-coleta" element={<React.Fragment><Header /><RelatorioColeta /></React.Fragment>} />
            <Route path='/test' element={<React.Fragment><Header /><AcompanhamentoColeta /></React.Fragment>} />
          </Route>

          {/* Rota ASSOCIAÇÃO */}
          <Route path="/" element={<ProtecaoAssociacao />}>
            <Route path="/lista-catador" element={<React.Fragment><Header /><ListaCatador /></React.Fragment>} />
            <Route path="/perfil-associacao" element={<React.Fragment><Header /><Associacao /></React.Fragment>} />
            <Route path="/lista-venda" element={<React.Fragment><Header /><ListaVenda /></React.Fragment>} />
            <Route path="/lista-relatorio-venda-associacao" element={<React.Fragment><Header /><ListaRelatorioVendaAssociacao /></React.Fragment>} />
            <Route path="/relatorio-venda" element={<React.Fragment><Header /><RelatorioVenda /></React.Fragment>} />

          </Route>

          {/* Rota Admin */}
          <Route path="/" element={<ProtecaoAdmin />} />
          <Route path="/perfil-admin" element={<React.Fragment><Header /><Admin /></React.Fragment>} />
          <Route path="/lista-catadores-adm" element={<React.Fragment><Header /><ListarTodosCatadores /></React.Fragment>} />
          <Route path="/lista-associacao" element={<React.Fragment><Header /><ListarAssociacoes /></React.Fragment>} />
          <Route path="/lista-operador" element={<React.Fragment> <Header /> <ListarOperadorLogistico /></React.Fragment>} />
          <Route path="/lista-coleta" element={<React.Fragment><Header /><ListaColeta /></React.Fragment>} />
          <Route path="/lista-venda" element={<React.Fragment><Header /><ListaVenda /></React.Fragment>} />
          <Route path="/lista-relatorio-coleta" element={<React.Fragment><Header /><ListaRelatorioColeta /></React.Fragment>} />
          <Route path="/lista-relatorio-venda" element={<React.Fragment><Header /><ListaRelatorioVenda /></React.Fragment>} />
          <Route path="/relatorio-coleta-adm" element={<React.Fragment><Header /><RelatorioColetaAdm /></React.Fragment>} />
          <Route path="/relatorio-venda-adm" element={<React.Fragment><Header /><RelatorioVendaAdm/></React.Fragment>} />



          {/* Rota LOGISTICA */}
          <Route path="/" element={<ProtecaoLogistica />}>
            <Route path="/perfil-logistica" element={<React.Fragment><Header /><OperadorLogistico /></React.Fragment>} />
            {/* <Route path="/lista-coleta" element={<React.Fragment><Header /><ListaColeta /></React.Fragment>} />
          <Route path="/lista-venda" element={<React.Fragment><Header /><ListaVenda /></React.Fragment>} />
          <Route path="/lista-relatorio-coleta" element={<React.Fragment><Header /><ListaRelatorioColeta /></React.Fragment>} />
          <Route path="/lista-relatorio-venda" element={<React.Fragment><Header /><ListaRelatorioVenda /></React.Fragment>} />
          <Route path="/relatorio-coleta-adm" element={<React.Fragment><Header /><RelatorioColetaAdm /></React.Fragment>} />
          <Route path="/relatorio-venda-adm" element={<React.Fragment><Header /><RelatorioVendaAdm/></React.Fragment>} /> */}

          </Route>

          <Route path="/usuario" element={<React.Fragment><Header /><Perfil /></React.Fragment>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;