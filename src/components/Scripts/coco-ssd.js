export const cocoSSD = (callback) => {

    const existingScript = document.getElementById('coco-ssd')
    if (!existingScript) {
        const script = document.createElement('script')
        script.src = 'https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd'
        script.id = 'coco-ssd'
        document.body.appendChild(script)
        script.onload = () => {
            if (callback) callback()
        }
    }
    if (existingScript && callback) callback()
}
