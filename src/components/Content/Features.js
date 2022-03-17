import React from "react";
import {Box, SimpleGrid, Text} from "@chakra-ui/react";

export const Features = () => {
    return (
        <Box mt={20}>
            <SimpleGrid columns={2}>
                <Box>
                    <Box w="100%" m="0 auto" maxW="400px" h="300px" bg="gray.50"></Box>
                </Box>
                <Box>
                    <Text fontSize="5xl" fontWeight="bold" maxW="600px">
                        We house you very quickly
                    </Text>
                    <Text mt={4} maxW="600px">
                        Using state of the art technology, we are able to match groups to the perfect housing
                        that they need based on the size of the home needed, the features they require from the
                        home and their budget.
                    </Text>
                    <Text color="blue.600" mt={4} fontSize="sm">
                        How we match users
                    </Text>
                </Box>
            </SimpleGrid>
        </Box>
    )
}
