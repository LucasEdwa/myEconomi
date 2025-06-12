import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addBudget, addSaving, removeBudget, editBudget } from '../store/budgetsSlice';
import type { AppDispatch, RootState } from '../store';
import { BudgetPie } from '../components/BudgetPie';

const Budgets = () => {
  const dispatch = useDispatch<AppDispatch>();
  const budgets = useSelector((state: RootState) => state.budgets.items);

  const [goalName, setGoalName] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [savingAmount, setSavingAmount] = useState<{ [id: string]: string }>({});
  const [savingMonth, setSavingMonth] = useState<{ [id: string]: string }>({});
  const [goalColor, setGoalColor] = useState('#22c55e');

  const handleAddBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalName || !goalTarget) return;
    dispatch(addBudget({ name: goalName, target: parseFloat(goalTarget), color: goalColor }));
    setGoalName('');
    setGoalTarget('');
    setGoalColor('#22c55e');
  };

  const handleAddSaving = (e: React.FormEvent, budgetId: string) => {
    e.preventDefault();
    if (!savingMonth[budgetId] || !savingAmount[budgetId]) return;
    dispatch(addSaving({ budgetId, month: savingMonth[budgetId], amount: parseFloat(savingAmount[budgetId]) }));
    setSavingAmount(prev => ({ ...prev, [budgetId]: '' }));
    setSavingMonth(prev => ({ ...prev, [budgetId]: '' }));
  };

  const handleDeleteBudget = (budgetId: string) => {
    dispatch(removeBudget(budgetId));
  };

  const handleColorChange = (id: string, color: string, leftColor: string) => {
    dispatch(editBudget({ id, color, leftColor }));
  };

  return (
    <div className="mt-8 bg-white rounded shadow p-8 w-1/2 mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-blue-700 text-center">Budgets & Goals</h2>
      <form onSubmit={handleAddBudget} className="mb-8 flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1">
          <label className="block mb-1 font-semibold">Goal Name</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={goalName}
            onChange={e => setGoalName(e.target.value)}
            required
            placeholder="e.g. New Laptop"
          />
        </div>
        <div className="flex-1">
          <label className="block mb-1 font-semibold">Target Amount</label>
          <input
            type="number"
            className="w-full border rounded px-3 py-2"
            value={goalTarget}
            onChange={e => setGoalTarget(e.target.value)}
            required
            min="0"
            step="0.01"
            placeholder="e.g. 1500"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Color</label>
          <input
            type="color"
            value={goalColor}
            onChange={e => setGoalColor(e.target.value)}
            className="w-12 h-10 border rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Add Goal
        </button>
      </form>
      <div>
        {budgets.length === 0 ? (
          <p className="text-gray-400 italic text-center">No budgets yet.</p>
        ) : (
          budgets.map((budget, idx) => {
            const totalSaved = budget.savings.reduce((sum, s) => sum + s.amount, 0);
            const percent = Math.min(100, (totalSaved / budget.target) * 100);
            const color = budget.color || '#22c55e';
          
            return (
              <div key={budget.id} className="mb-8 border rounded p-4 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <span className="font-bold text-lg">{budget.name}</span>
                    <span className="ml-2 text-gray-500">Goal: ${budget.target.toFixed(2)}</span>
                  </div>
                  <div className="text-green-700 font-semibold">
                    Saved: ${totalSaved.toFixed(2)}
                  </div>
                </div>
                <div className="flex items-center gap-6 mb-2">
                  <div className="w-32 h-62">
                    <BudgetPie budget={budget} colorIdx={idx} onColorChange={handleColorChange} />
                  </div>
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded h-3 mb-2">
                      <div
                        className="h-3 rounded"
                        style={{ width: `${percent}%`, background: color }}
                      />
                    </div>
                    <div className="mb-2 text-sm text-gray-600">Progress: {percent.toFixed(1)}%</div>
                    <form
                      onSubmit={e => handleAddSaving(e, budget.id)}
                      className="flex flex-col md:flex-row gap-2 items-end"
                    >
                      <input
                        type="month"
                        className="border rounded px-2 py-1"
                        value={savingMonth[budget.id] || ''}
                        onChange={e => setSavingMonth(prev => ({ ...prev, [budget.id]: e.target.value }))}
                        required
                      />
                      <input
                        type="number"
                        className="border rounded px-2 py-1"
                        value={savingAmount[budget.id] || ''}
                        onChange={e => setSavingAmount(prev => ({ ...prev, [budget.id]: e.target.value }))}
                        required
                        min="0"
                        step="0.01"
                        placeholder="Amount"
                      />
                      <button
                        type="submit"
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                      >
                        Add Saving
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteBudget(budget.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    </form>
                    {budget.savings.length > 0 && (
                      <div className="mt-3 text-sm overflow-y-auto" style={{ maxHeight: '4rem' }}>
                        <ul>
                          {budget.savings.map((s, idx2) => (
                            <li key={idx2} className="flex justify-between">
                              <span>{s.month}</span>
                              <span className="font-semibold text-green-700">+${s.amount.toFixed(2)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export { Budgets };
