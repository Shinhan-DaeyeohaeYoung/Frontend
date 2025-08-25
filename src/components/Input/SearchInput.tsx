import * as React from 'react';
import { Input, InputGroup, InputElement, Box } from '@chakra-ui/react';
import { Button } from '../Button/Button';

export interface SearchInputProps {
  placeholder?: string;
  buttonText?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'outline' | 'filled' | 'flushed' | 'unstyled';
  isInvalid?: boolean;
  isReadOnly?: boolean;
  isRequired?: boolean;
  name?: string;
  id?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = '물품명을 입력해주세요',
  buttonText = '검색하기',
  value = '',
  onChange,
  onSearch,
  disabled = false,
  size = 'lg',
  variant = 'outline',
  isInvalid = false,
  isReadOnly = false,
  isRequired = false,
  name,
  id,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedby,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  const handleSearch = () => {
    if (!disabled && value.trim()) {
      onSearch?.();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  const inputId = id || `search-input-${name || 'default'}`;

  return (
    <Box>
      <InputGroup size={size}>
        <Input
          id={inputId}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          aria-invalid={isInvalid}
          aria-required={isRequired}
          readOnly={isReadOnly}
          variant={variant}
          aria-label={
            ariaLabel ||
            `검색어를 입력하세요. ${buttonText} 버튼을 클릭하거나 Enter 키를 눌러 검색할 수 있습니다.`
          }
          aria-describedby={ariaDescribedby}
          autoComplete="off"
          spellCheck="false"
          _focus={{
            borderColor: 'blue.400',
            boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)',
          }}
          _focusVisible={{
            borderColor: 'blue.400',
            boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)',
          }}
          _placeholder={{
            color: 'gray.500',
          }}
          _invalid={{
            borderColor: 'red.500',
            boxShadow: '0 0 0 1px var(--chakra-colors-red-500)',
          }}
          _disabled={{
            opacity: 0.6,
            cursor: 'not-allowed',
          }}
        />
        <InputElement placement="end" width="auto" pr={0}>
          <Button
            label={buttonText}
            variant="default"
            size="md"
            onClick={handleSearch}
            disabled={disabled}
            borderRadius="0 md md 0"
            borderLeftRadius={0}
            h="100%"
            aria-describedby={inputId}
          />
        </InputElement>
      </InputGroup>
    </Box>
  );
};

export default SearchInput;
