import { useState, useEffect } from 'react';
import axios from 'axios';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import Charts from './components/Charts';

// Definindo os tipos para os dados do relatório
export interface Transaction {
  id: number;
  descricao: string;
  valor: number;
  data: string;
  tipo: 'receita' | 'despesa';
  categoria_id?: number;
  executada?: boolean;
}

export interface RelatorioMensal {
  movimentacoes: Transaction[];
  faturaCartao: { total: number; paga: boolean };
  agendadas: Transaction[];
  despesasPorCategoria: { nome: string; total: number }[];
}

function App() {
  const [report, setReport] = useState<RelatorioMensal | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchReport = async () => {
    try {
      const response = await axios.get<RelatorioMensal>('/api/relatorio-mensal');
      setReport(response.data);
    } catch (error) {
      console.error('Erro ao buscar relatório:', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchReport();
    }
  }, [isAuthenticated]);

  const handleLogin = () => {
    window.location.href = 'http://localhost:3000/auth/google';
  };

  useEffect(() => {
    if (window.location.search.includes('code=')) {
      setIsAuthenticated(true);
    }
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center">
        <div className="text-center p-8 bg-gray-800 rounded-lg shadow-xl">
          <h1 className="text-4xl font-bold mb-4">Controle Financeiro</h1>
          <p className="text-gray-400 mb-6">Acesse com sua conta Google para continuar</p>
          <button
            onClick={handleLogin}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
          >
            Login com Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Painel Financeiro</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {report && <TransactionList report={report} fetchReport={fetchReport} />}
          </div>
          <div className="space-y-6">
            <TransactionForm fetchTransactions={fetchReport} />
            {report && report.despesasPorCategoria.length > 0 && <Charts data={report.despesasPorCategoria} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
