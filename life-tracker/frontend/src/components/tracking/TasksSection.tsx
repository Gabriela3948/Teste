import { useState } from 'react';
import { Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';
import type { Task } from '../../types';
import { createTask, updateTask, deleteTask } from '../../services/api';

interface Props {
  userId: string;
  date: string;
  tasks: Task[];
  onRefresh: () => void;
}

const CATEGORIES = [
  { value: 'work', label: 'Trabalho', color: 'bg-blue-100 text-blue-700' },
  { value: 'personal', label: 'Pessoal', color: 'bg-purple-100 text-purple-700' },
  { value: 'selfcare', label: 'Autocuidado', color: 'bg-emerald-100 text-emerald-700' },
  { value: 'procrastination', label: 'Procrastinação', color: 'bg-red-100 text-red-700' },
];

const PRIORITIES = [
  { value: 'high', label: 'Alta', color: 'text-red-500' },
  { value: 'medium', label: 'Média', color: 'text-yellow-500' },
  { value: 'low', label: 'Baixa', color: 'text-green-500' },
];

export default function TasksSection({ userId, date, tasks, onRefresh }: Props) {
  const [newTask, setNewTask] = useState({ title: '', category: 'work', duration_minutes: 0, priority: 'medium', notes: '' });
  const [adding, setAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleAdd = async () => {
    if (!newTask.title.trim()) return;
    setAdding(true);
    try {
      await createTask(userId, date, { ...newTask, category: newTask.category as Task['category'], priority: newTask.priority as Task['priority'], completed: 0 });
      setNewTask({ title: '', category: 'work', duration_minutes: 0, priority: 'medium', notes: '' });
      setShowForm(false);
      onRefresh();
    } finally {
      setAdding(false);
    }
  };

  const toggleComplete = async (task: Task) => {
    await updateTask(userId, date, task.id, { ...task, completed: task.completed ? 0 : 1 });
    onRefresh();
  };

  const handleDelete = async (taskId: string) => {
    await deleteTask(userId, date, taskId);
    onRefresh();
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const totalMinutes = tasks.reduce((s, t) => s + (t.duration_minutes || 0), 0);

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="section-title mb-0">Tarefas</h3>
          <p className="text-sm text-gray-500 mt-1">{completedCount}/{tasks.length} concluídas · {totalMinutes} min registrados</p>
        </div>
        <button onClick={() => setShowForm(s => !s)} className="btn-primary py-2 px-4 flex items-center gap-2">
          <Plus size={16} /> Adicionar
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="bg-emerald-50 rounded-xl p-4 mb-4 space-y-3">
          <input className="input-field" type="text" placeholder="Nome da tarefa..." value={newTask.title}
            onChange={e => setNewTask(n => ({ ...n, title: e.target.value }))}
            onKeyDown={e => e.key === 'Enter' && handleAdd()} autoFocus />
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="label text-xs">Categoria</label>
              <select className="input-field text-sm" value={newTask.category} onChange={e => setNewTask(n => ({ ...n, category: e.target.value }))}>
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="label text-xs">Duração (min)</label>
              <input className="input-field text-sm" type="number" min="0" value={newTask.duration_minutes}
                onChange={e => setNewTask(n => ({ ...n, duration_minutes: Number(e.target.value) }))} />
            </div>
            <div>
              <label className="label text-xs">Prioridade</label>
              <select className="input-field text-sm" value={newTask.priority} onChange={e => setNewTask(n => ({ ...n, priority: e.target.value }))}>
                {PRIORITIES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
          </div>
          <input className="input-field text-sm" type="text" placeholder="Notas (opcional)" value={newTask.notes}
            onChange={e => setNewTask(n => ({ ...n, notes: e.target.value }))} />
          <div className="flex gap-2">
            <button onClick={handleAdd} className="btn-primary py-2 px-4 text-sm" disabled={adding}>
              {adding ? 'Adicionando...' : '+ Adicionar tarefa'}
            </button>
            <button onClick={() => setShowForm(false)} className="btn-secondary py-2 px-4 text-sm">Cancelar</button>
          </div>
        </div>
      )}

      {/* Task list */}
      {tasks.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p className="text-3xl mb-2">📋</p>
          <p className="text-sm">Nenhuma tarefa ainda. Adicione as tarefas do seu dia!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {tasks.map(task => {
            const cat = CATEGORIES.find(c => c.value === task.category);
            const pri = PRIORITIES.find(p => p.value === task.priority);
            return (
              <div key={task.id} className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${task.completed ? 'bg-gray-50 border-gray-100 opacity-70' : 'bg-white border-emerald-100'}`}>
                <button onClick={() => toggleComplete(task)} className="mt-0.5 flex-shrink-0">
                  {task.completed
                    ? <CheckCircle2 size={20} className="text-emerald-500" />
                    : <Circle size={20} className="text-gray-300 hover:text-emerald-400 transition-colors" />
                  }
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>{task.title}</p>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cat?.color || 'bg-gray-100 text-gray-600'}`}>{cat?.label}</span>
                    {task.duration_minutes > 0 && <span className="text-xs text-gray-400">{task.duration_minutes}min</span>}
                    {task.priority !== 'medium' && <span className={`text-xs font-medium ${pri?.color}`}>● {pri?.label}</span>}
                    {task.notes && <span className="text-xs text-gray-400 truncate max-w-40">{task.notes}</span>}
                  </div>
                </div>
                <button onClick={() => handleDelete(task.id)} className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0">
                  <Trash2 size={15} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Summary by category */}
      {tasks.length > 0 && (
        <div className="mt-4 pt-4 border-t border-emerald-100 grid grid-cols-4 gap-2">
          {CATEGORIES.map(cat => {
            const catTasks = tasks.filter(t => t.category === cat.value);
            if (!catTasks.length) return null;
            return (
              <div key={cat.value} className={`text-center p-2 rounded-lg ${cat.color}`}>
                <p className="text-lg font-bold">{catTasks.filter(t => t.completed).length}/{catTasks.length}</p>
                <p className="text-xs font-medium mt-0.5">{cat.label}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
