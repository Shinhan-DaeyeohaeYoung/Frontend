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
      h="36px"
      bg="white"
      borderRadius="xl"
      borderColor="gray.300"
      textStyle="body_md"
      _placeholder={{ color: 'gray.400' }}
      _focus={{
        borderColor: 'blue.300',
        boxShadow: '0 0 0 1px #A4B8FB',
      }}
      {...rest}
    />
  );
};

export default TextInput;
