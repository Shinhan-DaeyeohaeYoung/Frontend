import { Input, type InputProps } from '@chakra-ui/react';

interface TextInputProps extends InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TextInput: React.FC<TextInputProps> = ({ value, onChange, placeholder, ...rest }) => {
  return (
    <Input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      w="full"
      h="40px"
      bg="white"
      borderRadius="lg"
      borderColor="gray.300"
      textStyle="body_md"
      _placeholder={{ color: 'gray.400' }}
      _focus={{
        borderColor: 'blue.300',
        // boxShadow: '0 0 0 1px #7A6FFB',
      }}
      {...rest}
    />
  );
};

export default TextInput;
