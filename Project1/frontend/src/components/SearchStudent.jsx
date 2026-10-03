function SearchStudent({ searchTerm, onSearchChange }) {
  return (
    <div className="search-box">
      <span className="search-icon" aria-hidden="true">
        🔍
      </span>
      <input
        type="text"
        placeholder="Search by ID or name..."
        value={searchTerm}
        onChange={(event) => onSearchChange(event.target.value)}
      />
      {searchTerm && (
        <button
          type="button"
          className="search-clear"
          onClick={() => onSearchChange('')}
          title="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
}

export default SearchStudent;
