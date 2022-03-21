import React from 'react'
import {Flex, Text, VStack} from "@chakra-ui/react";
import {Models} from "./Models";
import {ObjectDetection} from "./ObjectDetection";

export const MainContent = () => {
    return (
        <>
            <Text fontSize="2xl" fontWeight="bold" textAlign="center" mt="100px" mb="30px">
                Models
            </Text>
            <Flex w="min-content" m="0 auto">
                <VStack>
                    {/*<Models />*/}
                    <ObjectDetection/>
                </VStack>

            </Flex>
        </>
    )
}
