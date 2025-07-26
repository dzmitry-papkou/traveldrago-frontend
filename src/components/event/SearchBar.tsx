import React, { useState } from 'react';
import { Box, TextField, Button, FormControlLabel, Checkbox, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface SearchBarProps {
    onSearch: (query: string) => void;
    onReset: () => void;
    showPublicOnly?: boolean;
    onTogglePublicOnly?: (showPublicOnly: boolean) => void;
    customStyles?: React.CSSProperties;
}

const SearchBar: React.FC<SearchBarProps> = ({
    onSearch,
    onReset,
    showPublicOnly = true,
    onTogglePublicOnly,
    customStyles,
}) => {
    const [query, setQuery] = useState<string>('');
    const [isPublicOnly, setIsPublicOnly] = useState<boolean>(showPublicOnly);

    const handleSearch = () => {
        onSearch(query);
    };

    const handleReset = () => {
        setQuery('');
        setIsPublicOnly(true);
        onReset();
    };

    const handleTogglePublicOnly = () => {
        const newValue = !isPublicOnly;
        setIsPublicOnly(newValue);
        if (onTogglePublicOnly) onTogglePublicOnly(newValue);
    };

    return (
        <Box style={customStyles}>
            <TextField
                variant="outlined"
                placeholder="Search events..."
                size="small"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                InputProps={{
                    endAdornment: (
                        <IconButton onClick={handleSearch}>
                            <SearchIcon />
                        </IconButton>
                    ),
                }}
                style={{ marginRight: '8px' }}
            />
            {onTogglePublicOnly && (
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={isPublicOnly}
                            onChange={handleTogglePublicOnly}
                        />
                    }
                    label="Show Public Events Only"
                    style={{ marginRight: '8px' }}
                />
            )}
            <Button variant="contained" onClick={handleSearch} style={{ marginRight: '8px' }}>
                Search
            </Button>
            <Button variant="contained" color="error" onClick={handleReset}>
                Reset
            </Button>
        </Box>
    );
};

export default SearchBar;