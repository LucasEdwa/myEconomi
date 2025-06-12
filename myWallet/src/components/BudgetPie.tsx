import { useRef } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend);

type Budget = {
    id: string;
    name: string;
    target: number;
    savings: { month: string; amount: number }[];
    color?: string;
    leftColor?: string;
};

type BudgetPieProps = {
    budget: Budget;
    colorIdx: number;
    onColorChange?: (id: string, color: string, leftColor: string) => void;
};

export const BudgetPie = ({ budget,  onColorChange }: BudgetPieProps) => {
    const saved = budget.savings.reduce((sum, s) => sum + s.amount, 0);
    const left = Math.max(0, budget.target - saved);
    const color = budget.color || '#22c55e';
    const leftColor = budget.leftColor || '#ef4444';
    const percent = budget.target > 0 ? Math.min(100, (saved / budget.target) * 100) : 0;
    const inputRefSaved = useRef<HTMLInputElement>(null);
    const inputRefLeft = useRef<HTMLInputElement>(null);

    const pieData = {
        labels: ['Saved', 'Left'],
        datasets: [
            {
                data: [saved, left],
                backgroundColor: [color, leftColor],
                borderColor: [color, leftColor],
                borderWidth: 2,
            },
        ],
    };

    // Only show color pickers if onColorChange is provided (Budgets page)
    const handlePieClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!onColorChange) return;
        const rect = (e.target as HTMLDivElement).getBoundingClientRect();
        const x = e.clientX - rect.left;
        if (x < rect.width / 2) {
            inputRefSaved.current?.click();
        } else {
            inputRefLeft.current?.click();
        }
    };

    return (
        <div className="flex flex-col items-center group">
            <div
                className={`relative w-40 h-40 ${onColorChange ? 'cursor-pointer' : ''}`}
                onClick={onColorChange ? handlePieClick : undefined}
            >
                <Pie data={pieData} />
                {onColorChange && (
                    <>
                        <input
                            ref={inputRefSaved}
                            type="color"
                            value={color}
                            onChange={e => onColorChange(budget.id, e.target.value, leftColor)}
                            className="absolute top-1/2 left-1/3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-8 h-8 -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
                            style={{ pointerEvents: 'auto' }}
                            tabIndex={-1}
                            title="Pick saved color"
                        />
                        <input
                            ref={inputRefLeft}
                            type="color"
                            value={leftColor}
                            onChange={e => onColorChange(budget.id, color, e.target.value)}
                            className="absolute top-1/2 left-2/3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-8 h-8 -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
                            style={{ pointerEvents: 'auto' }}
                            tabIndex={-1}
                            title="Pick left color"
                        />
                    </>
                )}
            </div>
            <div className="mt-2 text-center font-semibold">{budget.name}</div>
            <div className="text-xs mt-1">
                <span style={{ color }} className="font-bold">{percent.toFixed(1)}%</span> filled
            </div>
            <div className="text-xs text-gray-500">
                ${saved.toFixed(2)} / ${budget.target.toFixed(2)}
            </div>
        </div>
    );
};
