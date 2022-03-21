import React, {useEffect, useRef, useState} from "react";
import {Badge, Box, Button, Flex, Text} from "@chakra-ui/react";
import {tfMin} from "../Scripts/tf-min";
import {cocoSSD} from "../Scripts/coco-ssd";
import Webcam from "react-webcam";

export const ObjectDetection = () => {

    const [tfjsLoded, settfjsLoded] = useState(false)
    const [cocoSSDLoaded, setcocoSSDLoaded] = useState(false)
    const [enableCamera, setenableCamera] = useState(true)
    const webcamRef = useRef(null)
    const canvasRef = useRef(null)

    const [videoWidth, setVideoWidth] = useState(960)
    const [videoHeight, setVideoHeight] = useState(640)
    const [cocoSsdModel, setcocoSsdModel] = useState()
    const [draw, setDraw] = useState()
    const [ctx, setCtx] = useState()

    const videoConstraints = {
        height: 1080,
        width: 1920,
        facingMode: "environment",
    }

    const cocoSsdPredictions = async () => {

        const model = await cocoSsd.load()
        setcocoSsdModel(model)
        console.log('---> coco-ssd model loaded')
        const predictions = await model.detect(document.getElementById('img'))

        console.log('---> returned ctx', ctx)
        await ctx.clearRect(0,0, webcamRef.current.video.videoWidth,webcamRef.current.video.videoHeight)

        if (predictions.length > 0) {
            console.log('predictions', predictions)
            for (let n = 0; n < predictions.length; n++) {
                console.log(n)
                if (predictions[n].score > 0.8) {
                    let bboxLeft = predictions[n].bbox[0]
                    let bboxTop = predictions[n].bbox[1]
                    let bboxWidth = predictions[n].bbox[2]
                    let bboxHeight = predictions[n].bbox[3] - bboxTop

                    console.log("bboxLeft: " + bboxLeft)
                    console.log("bboxTop: " + bboxTop)

                    console.log("bboxWidth: " + bboxWidth)

                    console.log("bboxHeight: " + bboxHeight)

                    ctx.beginPath()
                    ctx.font = "28px Arial"
                    ctx.fillStyle = "red"

                    ctx.fillText(
                        predictions[n].class +
                        ": " +
                        Math.round(parseFloat(predictions[n].score) * 100) +
                        "%",
                        bboxLeft,
                        bboxTop
                    )

                    ctx.rect(bboxLeft, bboxTop, bboxWidth, bboxHeight)
                    ctx.strokeStyle = "#FF0000"

                    ctx.lineWidth = 3
                    ctx.stroke()

                    console.log("detected")
                }

            }
        }

        //Rerun prediction by timeout
        setTimeout(() => cocoSsdPredictions(), 500);
    }

    const enableWebCam = async () => {
        setenableCamera(false)
        try{
            await cocoSsdPredictions()
        }catch (err) {
            console.error('---> Error ', err)
        }
    }
    const disableWebCam = () => {
        setenableCamera(true)
    }

    const refHandler = (canvas) => {
        if( !canvas ) return
        let context = canvas.getContext('2d')
        setDraw(canvas)
        setCtx(context)
        console.log('---> canvas', draw)
        console.log('---> context', ctx)
    }

    useEffect(() => {
        console.log('use effect started')
        tfMin(() => {
            console.log('tf getting loaded ...')
            settfjsLoded(true)
        })
        cocoSSD(() => {
            console.log('coco ssd getting loaded ...')
            setcocoSSDLoaded(true)
        })
    }, [])
    return(
        <Flex>
            <Box m="8" border="1px solid" borderColor="gray.400" w="1000px" borderRadius="lg">
                <Box m={2}>
                    <Badge fontSize="0.8em" colorScheme="green">Tensorflow Models: coco-ssd</Badge>
                    <Text fontSize='lg'>
                        Multiple object detection using pre trained model in TensorFlow.js
                    </Text>

                    {
                        !tfjsLoded && !cocoSSDLoaded ?
                            <div>
                                <Text fontSize='sm'>
                                    Wait for the model to load before clicking the button to enable the webcam - at which point it will become visible to use.
                                </Text>
                            </div> :
                            <div>
                                <div style={{ position: "absolute", top: "400px", zIndex: "9999" }}>
                                    <canvas
                                        id='imgCanvas'
                                        ref={refHandler}
                                        width={videoWidth}
                                        height={videoHeight}
                                        style={{ backgroundColor: "transparent" }}
                                    />
                                </div>
                            </div>
                    }


                    {
                        tfjsLoded && cocoSSDLoaded ?
                            <div>
                                <Text fontSize='sm'>
                                    Hold some objects up close to your webcam to get a real-time classification! When ready click "enable webcam" below and accept access to the webcam when the browser asks (check the top left of your window)
                                </Text>

                                {
                                    enableCamera ?
                                        <Button onClick={enableWebCam}>Enable Webcam</Button> :
                                        <div>
                                            <Button onClick={disableWebCam}>Disable Webcam</Button>

                                            <div style={{ position: "absolute", top: "400px" }}>
                                                <Webcam
                                                    audio={false}
                                                    id='img'
                                                    ref={webcamRef}
                                                    screenshotQuality={1}
                                                    screenshotFormat="image/jpeg"
                                                    videoConstraints={videoConstraints}
                                                />
                                            </div>
                                        </div>
                                }
                            </div> :
                            <div>
                                <Text fontSize='sm'>
                                    Problem loading JS libraries
                                </Text>
                            </div>
                    }
                </Box>

            </Box>

        </Flex>
    )

}
