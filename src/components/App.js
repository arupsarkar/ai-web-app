import React from "react"
import { ChakraProvider, extendTheme, Container} from '@chakra-ui/react'
import {Footer} from "./Footer/Footer";
import {Header} from "./Header/Header";
import {MainContent} from "./Content/MainContent";
import {Features} from "./Content/Features";
import {Testimonial} from "./Content/Testimonial";
// 2. Extend the theme to include custom colors, fonts, etc
const colors = {
    brand: {
        900: '#1a365d',
        800: '#153e75',
        700: '#2a69ac',
    },
}

const theme = extendTheme({ colors })

export default function App () {
    return(
        <ChakraProvider theme={theme}>
                <Header/>
                <MainContent/>
                {/*<Features/>*/}
                {/*<Testimonial/>*/}
                <Footer/>
        </ChakraProvider>

    )
}
