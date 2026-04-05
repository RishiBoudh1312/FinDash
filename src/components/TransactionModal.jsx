import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { categories } from '../data/transactions';
import { X } from 'lucide-react';

const allCategories = [...categories.expense, ...categories.income];

export default function TransactionModal({ transaction, onClose }) {
  const { dispatch } = useApp();
  const isEditing = !!transaction;

  const [form, setForm] = useState({
    description: transaction?.description || '',
    amount: transaction?.amount || '',
    type: transaction?.type || 'expense',
    category: transaction?.category || categories.expense[0],
    date: transaction?.date || new Date().toISOString().split('T')[0],
  });

  const [errors, setErrors] = useState({});

  const availableCategories = form.type === 'income' ? categories.income : categories.expense;

  const validate = () => {
    const errs = {};
    if (!form.description.trim()) errs.description = 'Description is required';
    if (!form.amount || parseFloat(form.amount) <= 0) errs.amount = 'Enter a valid amount';
    if (!form.date) errs.date = 'Date is required';
    if (!form.category) errs.category = 'Select a category';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      id: transaction?.id || 'txn_' + Math.random().toString(36).substr(2, 9),
      description: form.description.trim(),
      amount: parseFloat(form.amount),
      type: form.type,
      category: form.category,
      date: form.date,
    };

    dispatch({
      type: isEditing ? 'EDIT_TRANSACTION' : 'ADD_TRANSACTION',
      payload,
    });

    onClose();
  };

  const handleTypeChange = (newType) => {
    const newCategories = newType === 'income' ? categories.income : categories.expense;
    setForm({
      ...form,
      type: newType,
      category: newCategories[0],
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {isEditing ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button className="btn btn-icon btn-ghost" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Type</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  type="button"
                  className={`btn btn-sm ${form.type === 'expense' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => handleTypeChange('expense')}
                  style={{ flex: 1 }}
                >
                  Expense
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${form.type === 'income' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => handleTypeChange('income')}
                  style={{ flex: 1 }}
                >
                  Income
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <input
                className="form-control"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="e.g., Grocery shopping"
              />
              {errors.description && (
                <small style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>
                  {errors.description}
                </small>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Amount (₹)</label>
                <input
                  className="form-control"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  placeholder="0.00"
                />
                {errors.amount && (
                  <small style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>
                    {errors.amount}
                  </small>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Date</label>
                <input
                  className="form-control"
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
                {errors.date && (
                  <small style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>
                    {errors.date}
                  </small>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-control"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {availableCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <small style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>
                  {errors.category}
                </small>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {isEditing ? 'Save Changes' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
