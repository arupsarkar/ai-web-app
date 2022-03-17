import React, {useEffect, useRef, useState} from "react";
import {
    Box,
    Badge,
    Flex,
    Spacer,
    Button,
    Text,
    ButtonGroup,
    FormControl,
    Input,
    HStack, Textarea, VStack
} from "@chakra-ui/react";

import {tensorflowModelsQNA} from "../Scripts/tensorflow-qna";
import {tfMin} from "../Scripts/tf-min";

export const Models = () => {

    const textArea = useRef('')
    const inputText = useRef('')
    const [result, setResult] = useState('')
    const [inputValue, setInputValue] = useState("")
    const [loaded, setLoaded] = useState(false);
    const passage = `We believe cats are the real stars of YouTube.`

    const handleSearch = () => {
        console.log('search start')
        console.log('Question ', inputText.current.value)
        console.log('Data ', textArea.current.value)

        try{
            // const model = await qna.load()
            // const answers = await model.findAnswers(
            //     inputText.current.value,
            //     textArea.current.value
            // );
            //
            // console.log(answers);
            // setResult(JSON.stringify(answers));
            qna.load()
                .then(model => {
                    console.log('model extracted...')
                    model.findAnswers(
                        inputText.current.value,
                        textArea.current.value)
                        .then(data => {
                            console.log('results ', data)
                            setResult(JSON.stringify(data))
                        })
                        .catch(err => {
                            setResult(err)
                        })
                })
                .catch(err => {
                    console.log('model not extracted...')
                    setResult(err)
                })
        }catch(err) {
            console.error(err)
        }finally{
            console.log('search end')
        }


    }
    useEffect(() => {
        console.log('use effect started')
        tfMin(() => {
            console.log('tf loaded ...')
        })
        tensorflowModelsQNA(() => {
            setLoaded(true)
        })
    }, [])

    return (
        <Box m="8" border="1px solid" borderColor="gray.400" w="1000px" borderRadius="lg">
            <FormControl>
                {loaded ? <Badge fontSize="0.8em" colorScheme="green">Tensorflow Models - QNA</Badge> :
                    <Badge fontSize="0.8em" colorScheme="red">Problem loading JS scripts</Badge>}
                <VStack>
                  <Textarea
                      style={{ width: "100%" }}
                      ref={textArea}
                      defaultValue={passage}
                  />
                    <Input ref={inputText} defaultValue="who are popular in youtube?" />
                    <Button onClick={handleSearch}>Search</Button>
                    <pre style={{ whiteSpace: "normal" }}>{result}</pre>
                </VStack>
            </FormControl>
            {/*<Box w="100%" h="200px" bg="gray.100" borderTopRadius="lg"></Box>*/}
            {/*<Box p="4">*/}
            {/*    <Badge fontSize="0.8em" colorScheme="red">*/}
            {/*        Popular*/}
            {/*    </Badge>*/}
            {/*    <Text fontSize="2xl" fontWeight="bold">*/}
            {/*        Brawhala*/}
            {/*    </Text>*/}
            {/*    <Text fontSize="xs" mb="6">*/}
            {/*        Toronto, Canada*/}
            {/*    </Text>*/}
            {/*    <Flex>*/}
            {/*        <Text fontSize="xs">Starting at $50/day</Text>*/}
            {/*        <Spacer />*/}
            {/*        <Button size="xs">Expand</Button>*/}
            {/*    </Flex>*/}
            {/*</Box>*/}
        </Box>
    )
}
