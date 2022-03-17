import React from "react";
import {Box, Text,} from "@chakra-ui/react";

export const Testimonial = () => {
    return(
        <Box mt={32} w="100%" bg="gray.200" py={20}>
            <Text maxW="800px" fontSize="3xl" textAlign="center" m="0 auto">
                After using this product, I realized a great increase in the number of users that used our
                product. It has improved our load speed by 250%
            </Text>
            <Text fontSize="xl" color="blue.500" mt={4} textAlign="center">
                John Doe
            </Text>
            <Text fontSize="sm" textAlign="center">
                CEO at Belky
            </Text>
        </Box>
    )
}
