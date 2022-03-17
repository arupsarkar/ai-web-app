export const tfMin = (callback) => {

    const existingScript = document.getElementById('tf')
    if (!existingScript) {
        const script = document.createElement('script')
        script.src = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs/dist/tf.min.js'
        script.id = 'tf'
        document.body.appendChild(script)
        script.onload = () => {
            if (callback) callback()
        }
    }
    if (existingScript && callback) callback()
}
