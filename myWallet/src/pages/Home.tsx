import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { Pie, Line } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
import { expenseColors } from './TransactionForm';
import { BudgetPie } from '../components/BudgetPie';

Chart.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

const getTailwindBgColor = (cls: string) =>
({
    'red-100': '#fee2e2',
    'orange-100': '#ffedd5',
    'yellow-100': '#fef9c3',
    'pink-100': '#fce7f3',
    'purple-100': '#ede9fe',
    'blue-100': '#dbeafe',
    'green-100': '#dcfce7',
}[cls.match(/bg-([a-z]+-\d{3})/)?.[1] ?? 'red-100']);

const Home = () => {
    const transactions = useSelector((state: RootState) => state.transactions.items);
    const budgets = useSelector((state: RootState) => state.budgets.items);

    const incomes = transactions.filter(t => t.type === 'income');
    const expenses = transactions.filter(t => t.type === 'expense');
    const incomeTotal = incomes.reduce((sum, t) => sum + t.amount, 0);
    const expenseAmounts = expenses.map(t => t.amount);
    const expenseLabels = expenses.map(t => t.description);
    const expenseBgColors = expenses.map((_, idx) =>
        getTailwindBgColor(expenseColors[idx % expenseColors.length])
    );
    const transactionPieData = {
        labels: ['Income', ...expenseLabels],
        datasets: [{
            data: [incomeTotal, ...expenseAmounts],
            backgroundColor: ['#22c55e', ...expenseBgColors],
            borderColor: ['#16a34a', ...expenseBgColors],
            borderWidth: 2,
        }],
    };

    // Prepare data for line chart: each budget's savings per month
    const allMonthsSet = new Set<string>();
    budgets.forEach(b => b.savings.forEach(s => allMonthsSet.add(s.month)));
    const allMonths = Array.from(allMonthsSet).sort();

    const lineData = {
        labels: allMonths,
        datasets: budgets.map((b, idx) => {
            const color = getTailwindBgColor(expenseColors[idx % expenseColors.length]);
            const monthToValue: Record<string, number> = {};
            b.savings.forEach(s => { monthToValue[s.month] = s.amount; });
            return {
                label: b.name,
                data: allMonths.map(m => monthToValue[m] || 0),
                borderColor: color,
                backgroundColor: color,
                pointBackgroundColor: color,
                pointBorderColor: color,
                tension: 0.3,
                fill: false,
            };
        }),
    };

    const lineOptions = {
        responsive: true,
        plugins: {
            legend: { display: true, position: 'top' as const },
            title: { display: true, text: 'Value Added per Budget per Month' }
        },
        scales: {
            x: { title: { display: true, text: 'Month' } },
            y: { title: { display: true, text: 'Value Added' }, beginAtZero: true }
        }
    };

    return (
        <main className="">
            <div className="max-w-4xl  mx-auto mt-8 bg-white rounded shadow p-8">
                <h1 className="text-3xl font-extrabold mb-6 text-center text-blue-700">My Wallet</h1>
                <p className="text-gray-700 text-left mb-4">
                    Track your income, expenses, and budgets in one place. In this way you can make easier family financial decisions avoiding stress with unnecessary expenses and saving money for your goals.
                </p>
                <p className="text-gray-500 text-center">
                    Use the navigation bar to add transactions and manage budgets.
                </p>
            </div>
            <div className="flex flex-col xl:flex-row mt-12 bg-white justify-center rounded shadow p-8">
                <div className="flex flex-col items-center xl:w-1/2 lx:border-r w-full justify-center xl:pr-8">
                    <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">My Wallet Overview</h1>
                    <div className="flex justify-center">
                        <div className="w-60 h-60">
                            <Pie data={transactionPieData} />
                        </div>
                    </div>
                    <div className="flex justify-between mt-8 gap-5 w-full">
                        <div className="text-green-700 font-semibold text-center">
                            Total Income: <span className="font-bold">${incomeTotal.toFixed(2)}</span>
                        </div>
                        <div className="text-red-700 font-semibold text-center">
                            Total Expense: <span className="font-bold">${expenseAmounts.reduce((a, b) => a + b, 0).toFixed(2)}</span>
                        </div>
                    </div>
                </div>
                <div className="xl:w-1/2 w-full xl:pl-8">
                    {budgets.length > 0 && (
                        <div className="mt-12 ">
                            <h2 className="text-2xl font-bold mb-4 text-blue-700 text-center">Budgets Progress</h2>
                            <div className="flex flex-wrap gap-8 items-center justify-center">
                                {budgets.map((b, idx) => (
                                    <BudgetPie key={b.id} budget={b} colorIdx={idx} />
                                ))}
                            </div>
                            <ul className="mt-18 flex flex-col w-full items-center gap-4 justify-center">
                                {budgets.map((b, idx) => {
                                    const saved = b.savings.reduce((sum, s) => sum + s.amount, 0);
                                    const percent = b.target > 0 ? Math.min(100, (saved / b.target) * 100) : 0;
                                    const left = Math.max(0, b.target - saved);
                                    const color = getTailwindBgColor(expenseColors[idx % expenseColors.length]);
                                    return (
                                        <li key={b.id} className="flex items-center gap-2 w-full justify-between xl:w-2/3">
                                            <span className="w-3 h-2 rounded-full" style={{ backgroundColor: color }}></span>
                                            <span className="font-semibold xl:text-xs  text-[10px]">{b.name}:</span>
                                            <span className='text-gray-700 xl:text-xs '>${saved.toFixed(2)}</span>/
                                            <span className="text-green-600 text-[10px] xl:text-xs font-bold"> ${b.target.toFixed(2)}</span>
                                            <span className="ml-2 xl:text-xs text-[10px] font-bold" style={{ color }}>{percent.toFixed(1)}%</span>
                                            <span className="ml-2 xl:text-xs text-[10px] text-red-600 font-semibold">Left: ${left.toFixed(2)}</span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
            <div className="mt-12">
                <h2 className="text-xl font-bold mb-4 text-blue-700 text-center">
                    Value Added per Budget per Month
                </h2>
                <div className="w-full max-w-lg mx-auto">
                    <Line data={lineData} options={lineOptions} />
                </div>
            </div>
        </main>
    );
};

export { Home };
