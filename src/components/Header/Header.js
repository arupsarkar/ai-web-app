import React from 'react'
import {Box, Button, Flex, Heading, Spacer, Text} from "@chakra-ui/react";


export const Header = () => {
    return (
        <Flex>
            <Box p="2">
                <Heading size="md">Tensorflow JS App</Heading>
            </Box>
            <Spacer />
            <Box>
                <Button colorScheme="teal" mr="4">
                    Sign Up
                </Button>
                <Button colorScheme="teal">Log in</Button>
            </Box>
        </Flex>
    )
}
