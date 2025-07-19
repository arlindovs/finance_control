import React from 'react';
import axios from 'axios';
import { RelatorioMensal } from '../App';

interface TransactionListProps {
  report: RelatorioMensal;
  fetchReport: () => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ report, fetchReport }) => {

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/transacoes/${id}`);
      fetchReport();
    } catch (error) {
      console.error('Erro ao deletar transação:', error);
    }
  };

  const handleExecute = async (id: number) => {
    try {
      await axios.post(`/api/transacoes/${id}/executar`);
      fetchReport();
    } catch (error) {
      console.error('Erro ao executar transação:', error);
    }
  };

  const Card: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
      {children}
    </div>
  );

  const totalReceitas = report.movimentacoes.filter(t => t.tipo === 'receita').reduce((acc, t) => acc + t.valor, 0);
  const totalDespesas = report.movimentacoes.filter(t => t.tipo === 'despesa').reduce((acc, t) => acc + t.valor, 0);
  const saldoMes = totalReceitas - totalDespesas;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-green-100 p-4 rounded-lg text-center">
          <p className="text-sm text-green-700">Receitas do Mês</p>
          <p className="text-2xl font-bold text-green-800">R$ {totalReceitas.toFixed(2)}</p>
        </div>
        <div className="bg-red-100 p-4 rounded-lg text-center">
          <p className="text-sm text-red-700">Despesas do Mês</p>
          <p className="text-2xl font-bold text-red-800">R$ {totalDespesas.toFixed(2)}</p>
        </div>
        <div className="bg-blue-100 p-4 rounded-lg text-center">
          <p className="text-sm text-blue-700">Saldo do Mês</p>
          <p className={`text-2xl font-bold ${saldoMes >= 0 ? 'text-blue-800' : 'text-red-800'}`}>R$ {saldoMes.toFixed(2)}</p>
        </div>
      </div>

      <Card title="Movimentações do Mês">
        <ul className="space-y-3">
          {report.movimentacoes.map((t) => (
            <li key={t.id} className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50">
              <div>
                <p className="font-semibold">{t.descricao}</p>
                <p className={`text-sm ${t.tipo === 'receita' ? 'text-green-600' : 'text-red-600'}`}>{t.data}</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`font-bold ${t.tipo === 'receita' ? 'text-green-600' : 'text-red-600'}`}>
                  {t.tipo === 'receita' ? '+' : '-'} R$ {t.valor.toFixed(2)}
                </span>
                <button onClick={() => handleDelete(t.id)} className="text-gray-400 hover:text-red-500">
                  &#x2715; {/* X icon */}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Fatura do Cartão">
          <p className="text-2xl font-bold text-gray-800">R$ {report.faturaCartao.total.toFixed(2)}</p>
          {/* Adicionar lógica para pagar fatura */}
        </Card>

        <Card title="Agendamentos Pendentes">
          <ul className="space-y-3">
            {report.agendadas.map((t) => (
              <li key={t.id} className="flex justify-between items-center">
                <span>{t.descricao}: <span className="font-semibold">R$ {t.valor.toFixed(2)}</span></span>
                <button onClick={() => handleExecute(t.id)} className="bg-green-500 hover:bg-green-600 text-white text-xs font-bold py-1 px-2 rounded">
                  Executar
                </button>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default TransactionList;
