import React, { useState, useEffect } from 'react';
import { ticketService } from '../../Services/ticketservice';
import LoadingSpinner from '../UI/Loadingspinner';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState({ index: -1, name: '' });

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const categoriesData = await ticketService.getCategories();
        setCategories(categoriesData);
      } catch (err) {
        setError('Failed to load categories. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    try {
      await ticketService.addCategory(newCategory);
      const updatedCategories = await ticketService.getCategories();
      setCategories(updatedCategories);
      setNewCategory('');
    } catch (err) {
      setError('Failed to add category. Please try again.');
      console.error(err);
    }
  };

  const handleEditClick = (index, category) => {
    setEditingCategory({ index, name: category });
  };

  const handleCancelEdit = () => {
    setEditingCategory({ index: -1, name: '' });
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!editingCategory.name.trim()) return;

    try {
      await ticketService.updateCategory(categories[editingCategory.index], editingCategory.name);
      const updatedCategories = await ticketService.getCategories();
      setCategories(updatedCategories);
      setEditingCategory({ index: -1, name: '' });
    } catch (err) {
      setError('Failed to update category. Please try again.');
      console.error(err);
    }
  };

  const handleDeleteCategory = async (category) => {
    if (window.confirm(`Are you sure you want to delete the category "${category}"?`)) {
      try {
        await ticketService.deleteCategory(category);
        const updatedCategories = await ticketService.getCategories();
        setCategories(updatedCategories);
      } catch (err) {
        setError('Failed to delete category. Please try again.');
        console.error(err);
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="category-management">
      <h1>Category Management</h1>
      {error && <div className="error-message">{error}</div>}

      <div className="add-category-form">
        <h2>Add New Category</h2>
        <form onSubmit={handleAddCategory}>
          <div className="form-group">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Enter new category name"
              required
            />
            <button type="submit" className="btn-primary">
              Add Category
            </button>
          </div>
        </form>
      </div>

      <div className="categories-list">
        <h2>Existing Categories</h2>
        {categories.length === 0 ? (
          <p>No categories found.</p>
        ) : (
          <ul className="category-items">
            {categories.map((category, index) => (
              <li key={index} className="category-item">
                {editingCategory.index === index ? (
                  <form onSubmit={handleUpdateCategory} className="edit-category-form">
                    <input
                      type="text"
                      value={editingCategory.name}
                      onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                      required
                    />
                    <div className="form-actions">
                      <button type="button" onClick={handleCancelEdit} className="btn-secondary">
                        Cancel
                      </button>
                      <button type="submit" className="btn-primary">
                        Save
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="category-display">
                    <span>{category}</span>
                    <div className="category-actions">
                      <button onClick={() => handleEditClick(index, category)} className="btn-secondary">
                        Edit
                      </button>
                      <button onClick={() => handleDeleteCategory(category)} className="btn-danger">
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CategoryManagement;