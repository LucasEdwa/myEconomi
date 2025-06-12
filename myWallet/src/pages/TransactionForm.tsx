import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTransaction } from '../store/transactionsSlice';
import type { AppDispatch } from '../store';
import type { RootState } from '../store';

export const expenseColors = [
  'text-red-700 bg-red-100',
  'text-orange-700 bg-orange-100',
  'text-yellow-700 bg-yellow-100',
  'text-pink-700 bg-pink-100',
  'text-purple-700 bg-purple-100',
  'text-blue-700 bg-blue-100',
  'text-green-700 bg-green-100',
];

const TransactionForm = () => {
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const transactions = useSelector((state: RootState) => state.transactions.items);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;
    dispatch(
      addTransaction({
        type,
        amount: parseFloat(amount),
        description,
      })
    );
    setAmount('');
    setDescription('');
  };

  const incomes = transactions.filter(t => t.type === 'income');
  const expenses = transactions.filter(t => t.type === 'expense');

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <div className="bg-white rounded shadow p-8 mb-8">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-blue-700">Add Transaction</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Type</label>
            <select
              className="w-full border-2 border-blue-200 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              value={type}
              onChange={e => setType(e.target.value as 'income' | 'expense')}
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Amount</label>
            <input
              type="number"
              className="w-full border-2 border-blue-200 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              required
              min="0"
              step="0.01"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Description</label>
            <input
              type="text"
              className="w-full border-2 border-blue-200 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
              placeholder="e.g. Salary, Rent"
            />
          </div>
          <div className="md:col-span-3">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-400 text-white py-3 rounded font-bold hover:from-blue-700 hover:to-blue-500 transition"
            >
              Add
            </button>
          </div>
        </form>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-green-50 rounded shadow p-6">
          <h3 className="text-xl font-bold text-green-700 mb-4 flex items-center gap-2">
            <span>Incomes</span>
            <span className="bg-green-200 text-green-800 rounded-full px-2 text-xs">{incomes.length}</span>
          </h3>
          {incomes.length === 0 ? (
            <p className="text-gray-400 italic">No incomes added yet.</p>
          ) : (
            <ul className="divide-y divide-green-100">
              {incomes.map((t) => (
                <li key={t.id} className="py-2 flex justify-between items-center">
                  <span className="font-medium">{t.description}</span>
                  <span className="font-bold text-green-700">+ ${t.amount.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="bg-red-50 rounded shadow p-6">
          <h3 className="text-xl font-bold text-red-700 mb-4 flex items-center gap-2">
            <span>Expenses</span>
            <span className="bg-red-200 text-red-800 rounded-full px-2 text-xs">{expenses.length}</span>
          </h3>
          {expenses.length === 0 ? (
            <p className="text-gray-400 italic">No expenses added yet.</p>
          ) : (
            <ul className="divide-y divide-red-100">
              {expenses.map((t, idx) => (
                <li
                  key={t.id}
                  className={`py-2 flex justify-between items-center rounded px-2 mb-1 ${expenseColors[idx % expenseColors.length]}`}
                >
                  <span className="font-medium">{t.description}</span>
                  <span className="font-bold">- ${t.amount.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export { TransactionForm };
