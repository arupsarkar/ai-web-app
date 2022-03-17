export const tensorflowModelsQNA = (callback) => {

    const existingScript = document.getElementById('qna')
    if (!existingScript) {
        const script = document.createElement('script')
        script.src = 'https://cdn.jsdelivr.net/npm/@tensorflow-models/qna'
        script.id = 'qna'
        document.body.appendChild(script)
        script.onload = () => {
            if (callback) callback()
        }
    }
    if (existingScript && callback) callback()
}
