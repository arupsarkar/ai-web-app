import React from 'react'
import {Box, SimpleGrid, Text} from "@chakra-ui/react";


export const Footer = () => {
    return (
        <Box mt={20} mb={12}>
            <Text fontSize="2xl" mt={12} fontWeight="bold" textAlign="center">
                Smartify
            </Text>
            <Text
                fontSize="1xl"
                textAlign="center"
                maxW="800px"
                m="0 auto"
                borderBottom="1px #bbb solid"
                mt={4}
                pb={10}
            >
                Capabilities of running AI models on client
            </Text>
            <SimpleGrid columns={3} w="max-content" gap={20} m="0 auto" mt={6}>
                <Text>Privacy</Text>
                {/*<Text>Pricing</Text>*/}
            </SimpleGrid>
        </Box>
    )
}
