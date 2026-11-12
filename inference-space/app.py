import gradio as gr


def check_service(message):
    """
    Simple service test.
    Confirms that the Hugging Face Space can receive
    and process an input.
    """

    return (
        "Inference service is online!\n\n"
        f"Received message: {message}\n\n"
        "Stable Diffusion integration will be added next."
    )


demo = gr.Interface(
    fn=check_service,
    inputs=gr.Textbox(
        label="Test Message",
        placeholder="Enter a test message..."
    ),
    outputs=gr.Textbox(
        label="Service Response"
    ),
    title="Text-to-Image Inference Service",
    description="Initial infrastructure test for our AI image-generation project.",
    api_name="health"
)


if __name__ == "__main__":
    demo.launch()