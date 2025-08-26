import * as React from 'react';
import { Group, Button } from '@chakra-ui/react';
import TextInput from './TextInput';

export interface SearchInputProps {
  placeholder?: string;
  buttonText?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'outline' | 'flushed' | 'subtle';
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
  size = 'md',
  variant = 'outline',
  isInvalid = false,
  isReadOnly = false,
  isRequired = false,
  name,
  id,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedby,
}) => {
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
    <Group gap={2} w="full" maxW="sm">
      <TextInput
        flex="1"
        id={inputId}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        _invalid={isInvalid ? { borderColor: 'red.500' } : undefined}
        readOnly={isReadOnly}
        required={isRequired}
        variant={variant}
        size={size}
        borderRadius="md"
        borderColor="gray.300"
        aria-label={
          ariaLabel ||
          `검색어를 입력하세요. ${buttonText} 버튼을 클릭하거나 Enter 키를 눌러 검색할 수 있습니다.`
        }
        aria-describedby={ariaDescribedby}
      />
      <Button
        onClick={handleSearch}
        disabled={disabled || !value.trim()}
        variant="outline"
        size={size}
        bg="white"
        borderColor="gray.300"
        color="gray.700"
        borderRadius="md"
        _hover={{
          bg: 'gray.50',
          borderColor: 'gray.400',
        }}
        _active={{
          bg: 'gray.100',
        }}
        aria-describedby={inputId}
      >
        {buttonText}
      </Button>
    </Group>
  );
};

export default SearchInput;
