import React, {createRef, useCallback, useEffect, useRef, useState} from "react";
import {Badge, Box, Button, Flex, Text} from "@chakra-ui/react";
import {tfMin} from "../Scripts/tf-min";
import {cocoSSD} from "../Scripts/coco-ssd";
import Webcam from "react-webcam";

export const ObjectDetection = () => {

    const [tfjsLoded, settfjsLoded] = useState(false)
    const [cocoSSDLoaded, setcocoSSDLoaded] = useState(false)

    const videoRef = createRef()
    const canvasRef = createRef()


    const renderPredictions = predictions => {
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        // Font options.
        const font = "12px sans-serif";
        ctx.font = font;
        ctx.textBaseline = "top";
        predictions.forEach(prediction => {
            const x = prediction.bbox[0];
            const y = prediction.bbox[1];
            const width = prediction.bbox[2];
            const height = prediction.bbox[3];
            // Draw the bounding box.
            ctx.strokeStyle = "#ff5252";
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, width, height);
            // Draw the label background.
            ctx.fillStyle = "#ff5252";
            let label = prediction.class + ' - with ' + Math.round(parseFloat(prediction.score) * 100) + '% confidence.'
            const textWidth = ctx.measureText(label).width;
            const textHeight = parseInt(font, 10); // base 10
            ctx.fillRect(x, y, textWidth + 4, textHeight + 4);
        });

        predictions.forEach(prediction => {
            const x = prediction.bbox[0];
            const y = prediction.bbox[1];
            // Draw the text last to ensure it's on top.
            ctx.fillStyle = "#000000";
            let label = prediction.class + ' - with ' + Math.round(parseFloat(prediction.score) * 100) + '% confidence.'
            ctx.fillText(label, x, y);
        });
    };

    const detectFrame = (video, model) => {
        model.detect(video).then(predictions => {
            renderPredictions(predictions);
            requestAnimationFrame(() => {
                detectFrame(video, model);
            });
        });
    };

    useEffect(() => {

            tfMin(() => {
                console.log('tf getting loaded ...')
                settfjsLoded(true)
            })
            cocoSSD(() => {
                console.log('coco ssd getting loaded ...')
                setcocoSSDLoaded(true)
            })
    }, [])

    const predict = async () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            const webCamPromise = navigator.mediaDevices
                .getUserMedia({
                    audio: false,
                    video: {
                        facingMode: "user"
                    }
                })
                .then(stream => {
                    window.stream = stream;
                    videoRef.current.srcObject = stream;
                    return new Promise((resolve, reject) => {
                        videoRef.current.onloadedmetadata = () => {
                            resolve();
                        };
                    });
                });
            const modelPromise = await cocoSsd.load();
            Promise.all([modelPromise, webCamPromise])
                .then(values => {
                    detectFrame(videoRef.current, values[0]);
                })
                .catch(error => {
                    console.error(error);
                });
        }
    }

    return (

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
                                <Text fontSize='sm'>
                                    Hold some objects up close to your webcam to get a real-time classification! When ready click "enable webcam" below and accept access to the webcam when the browser asks (check the top left of your window)
                                </Text>
                                <Button onClick={predict}> Detect & Predict</Button>
                                <div style={{ position: "absolute", top: "400px" }}>
                                    <video
                                        className="size"
                                        autoPlay
                                        playsInline
                                        muted
                                        ref={videoRef}
                                        width="960"
                                        height="640"
                                    />
                                </div>
                                <div style={{ position: "absolute", top: "400px", zIndex: "9999" }}>
                                    <canvas
                                        className="size"
                                        ref={canvasRef}
                                        width="960"
                                        height="640"
                                    />
                                </div>
                            </div>
                    }
                </Box>
            </Box>
        </Flex>

    )
    
}
