// components/SearchBar.tsx

import React, { useState } from 'react';
import styles from './styles.module.scss';

interface SearchBarProps {
  placeholder: string;
  onSearch: (value: string) => void;
}

export default function SearchBar({ placeholder, onSearch }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    onSearch(event.target.value);
  };

  return (
    <div className={styles.searchBar}>
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleInputChange}
      />
    </div>
  );
}