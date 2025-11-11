import { Box, Text, Heading } from "@chakra-ui/react";

export default function Home() {
  return (
    <div>
      <Box bg="gray.200">
        <Text fontSize="6xl" color="blue.900">
          sokay - an app to encourage good eating
        </Text>
      </Box>
      <Heading color="blue.600">Styled h1</Heading>
    </div>
  );
}
