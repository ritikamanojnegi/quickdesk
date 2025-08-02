import React from 'react';

const FilterControls = ({ filters, onChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  return (
    <div className="filter-controls">
      <select
        name="status"
        value={filters.status}
        onChange={handleChange}
      >
        <option value="">All Statuses</option>
        <option value="open">Open</option>
        <option value="in_progress">In Progress</option>
        <option value="resolved">Resolved</option>
        <option value="closed">Closed</option>
      </select>

      <select
        name="category"
        value={filters.category}
        onChange={handleChange}
      >
        <option value="">All Categories</option>
        <option value="Technical">Technical</option>
        <option value="Billing">Billing</option>
        <option value="General">General</option>
      </select>

      <select
        name="sort"
        value={filters.sort}
        onChange={handleChange}
      >
        <option value="recent">Most Recent</option>
        <option value="oldest">Oldest First</option>
        <option value="most_comments">Most Comments</option>
      </select>

      <input
        type="text"
        name="search"
        value={filters.search}
        onChange={handleChange}
        placeholder="Search tickets..."
      />
    </div>
  );
};

export default FilterControls;