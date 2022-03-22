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
        const ctx = canvasRef.current.getContext("2d");
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        // Font options.
        const font = "16px sans-serif";
        ctx.font = font;
        ctx.textBaseline = "top";
        predictions.forEach(prediction => {
            const x = prediction.bbox[0];
            const y = prediction.bbox[1];
            const width = prediction.bbox[2];
            const height = prediction.bbox[3];
            // Draw the bounding box.
            ctx.strokeStyle = "#00FFFF";
            ctx.lineWidth = 4;
            ctx.strokeRect(x, y, width, height);
            // Draw the label background.
            ctx.fillStyle = "#00FFFF";
            const textWidth = ctx.measureText(prediction.class).width;
            const textHeight = parseInt(font, 10); // base 10
            ctx.fillRect(x, y, textWidth + 4, textHeight + 4);
        });

        predictions.forEach(prediction => {
            const x = prediction.bbox[0];
            const y = prediction.bbox[1];
            // Draw the text last to ensure it's on top.
            ctx.fillStyle = "#000000";
            ctx.fillText(prediction.class, x, y);
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

        <div>
            <button onClick={predict}> Predict</button>
            <video
                className="size"
                autoPlay
                playsInline
                muted
                ref={videoRef}
                width="600"
                height="500"
            />
            <canvas
                className="size"
                ref={canvasRef}
                width="600"
                height="500"
            />
        </div>
    )

    // const webcamRef = useRef(null)
    // const canvasRef = useRef(null)
    //
    // const [videoWidth, setVideoWidth] = useState(960)
    // const [videoHeight, setVideoHeight] = useState(640)
    // const [cocoSsdModel, setcocoSsdModel] = useState()
    // const [draw, setDraw] = useState()
    // const [ctx, setCtx] = useState()
    // const [videoElement, setVideoElement] = useState()
    //
    // const videoConstraints = {
    //     height: 1080,
    //     width: 1920,
    //     facingMode: "environment",
    // }
    //
    // const cocoSsdPredictions = async () => {
    //
    //
    //     console.log('---> video element ', videoElement)
    //     const predictions = await cocoSsdModel.detect(videoElement.video)
    //
    //     console.log('---> predictions ', predictions)
    //     console.log('---> returned ctx', ctx)
    //     await ctx.clearRect(0,0, webcamRef.current.video.videoWidth,webcamRef.current.video.videoHeight)
    //
    //     if (predictions.length > 0) {
    //         console.log('predictions', predictions)
    //         for (let n = 0; n < predictions.length; n++) {
    //             console.log(n)
    //             if (predictions[n].score > 0.66) {
    //                 let bboxLeft = predictions[n].bbox[0]
    //                 let bboxTop = predictions[n].bbox[1]
    //                 let bboxWidth = predictions[n].bbox[2]
    //                 let bboxHeight = predictions[n].bbox[3] - bboxTop
    //
    //                 console.log("bboxLeft: " + bboxLeft)
    //                 console.log("bboxTop: " + bboxTop)
    //
    //                 console.log("bboxWidth: " + bboxWidth)
    //
    //                 console.log("bboxHeight: " + bboxHeight)
    //
    //                 ctx.beginPath()
    //                 ctx.font = "28px Arial"
    //                 ctx.fillStyle = "red"
    //
    //                 ctx.fillText(
    //                     predictions[n].class +
    //                     ": " +
    //                     Math.round(parseFloat(predictions[n].score) * 100) +
    //                     "%",
    //                     bboxLeft,
    //                     bboxTop
    //                 )
    //
    //                 ctx.rect(bboxLeft, bboxTop, bboxWidth, bboxHeight)
    //                 ctx.strokeStyle = "#FF0000"
    //
    //                 ctx.lineWidth = 1
    //                 ctx.stroke()
    //
    //                 console.log("detected")
    //             }
    //
    //         }
    //     }
    //
    //     //Rerun prediction by timeout
    //     setTimeout(() => cocoSsdPredictions(), 500);
    // }
    //
    // const enableWebCam = async () => {
    //     setenableCamera(false)
    //     try{
    //         await setDrawContext()
    //         await loadModel()
    //         await cocoSsdPredictions()
    //     }catch (err) {
    //         console.error('---> Error ', err)
    //     }
    // }
    // const disableWebCam = () => {
    //     setenableCamera(true)
    // }
    //
    // const setDrawContext = async () => {
    //     const canvas = canvasRef.current
    //     const context = canvas.getContext('2d')
    //     setDraw(canvas)
    //     setCtx(context)
    // }
    //
    //
    // const loadModel = async () => {
    //     const model = await cocoSsd.load()
    //     setcocoSsdModel(model)
    //     console.log('---> model 1 ', cocoSsdModel)
    // }
    // const videoRefHandler = (video) => {
    //     if( !video) return
    //     setVideoElement(video)
    // }
    // // const refHandler = (canvas) => {
    //     // if( !canvas ) return
    //     // let context = canvas.getContext('2d')
    //     // setDraw(canvas)
    //     // setCtx(context)
    //     // console.log('---> canvas', draw)
    //     // console.log('---> context', ctx)
    // // }
    //
    // useEffect(() => {
    //     console.log('use effect started')
    //     tfMin(() => {
    //         console.log('tf getting loaded ...')
    //         settfjsLoded(true)
    //     })
    //     cocoSSD(() => {
    //         console.log('coco ssd getting loaded ...')
    //         setcocoSSDLoaded(true)
    //     })
    // }, [])
    // return(
    //     <Flex>
    //         <Box m="8" border="1px solid" borderColor="gray.400" w="1000px" borderRadius="lg">
    //             <Box m={2}>
    //                 <Badge fontSize="0.8em" colorScheme="green">Tensorflow Models: coco-ssd</Badge>
    //                 <Text fontSize='lg'>
    //                     Multiple object detection using pre trained model in TensorFlow.js
    //                 </Text>
    //
    //                 {
    //                     !tfjsLoded && !cocoSSDLoaded ?
    //                         <div>
    //                             <Text fontSize='sm'>
    //                                 Wait for the model to load before clicking the button to enable the webcam - at which point it will become visible to use.
    //                             </Text>
    //                         </div> :
    //                         <div>
    //                             <div style={{ position: "absolute", top: "400px", zIndex: "9999" }}>
    //                                 <canvas
    //                                     id='imgCanvas'
    //                                     ref={canvasRef}
    //                                     width={videoWidth}
    //                                     height={videoHeight}
    //                                     style={{ backgroundColor: "transparent" }}
    //                                 />
    //                             </div>
    //                         </div>
    //                 }
    //
    //
    //                 {
    //                     tfjsLoded && cocoSSDLoaded ?
    //                         <div>
    //                             <Text fontSize='sm'>
    //                                 Hold some objects up close to your webcam to get a real-time classification! When ready click "enable webcam" below and accept access to the webcam when the browser asks (check the top left of your window)
    //                             </Text>
    //
    //                             {
    //                                 enableCamera ?
    //                                     <Button onClick={enableWebCam}>Enable Webcam</Button> :
    //                                     <div>
    //                                         <Button onClick={disableWebCam}>Disable Webcam</Button>
    //
    //                                         <div style={{ position: "absolute", top: "400px" }}>
    //                                             <video
    //                                                 //audio={false}
    //                                                 id='img'
    //                                                 ref={videoRefHandler}
    //                                                 //screenshotQuality={1}
    //                                                 //screenshotFormat="image/jpeg"
    //                                                 //videoConstraints={videoConstraints}
    //                                             />
    //                                         </div>
    //                                     </div>
    //                             }
    //                         </div> :
    //                         <div>
    //                             <Text fontSize='sm'>
    //                                 Problem loading JS libraries
    //                             </Text>
    //                         </div>
    //                 }
    //             </Box>
    //
    //         </Box>
    //
    //     </Flex>
    // )

}
