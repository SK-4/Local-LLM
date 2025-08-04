import streamlit as st
import ollama
from PIL import Image
import base64
from io import BytesIO

st.set_page_config(page_title="Qwen2.5-VL:3B Demo", layout="centered")
st.title("🧠 Qwen2.5-VL:3B with Ollama")

uploaded_file = st.file_uploader("Upload an image", type=["jpg", "jpeg", "png"])
question = st.text_input("Ask a question about the image:")

if uploaded_file and question:
    image = Image.open(uploaded_file).convert("RGB")
    buffered = BytesIO()
    image.save(buffered, format="PNG")
    img_base64 = base64.b64encode(buffered.getvalue()).decode("utf-8")

    # Show image in the UI
    st.image(image, caption="Uploaded Image", use_column_width=True)

    st.info("Generating response...")

    # Use generate instead of chat for multimodal
    response = ollama.generate(
        model="qwen2.5vl:3b",
        prompt=question,
        images=[img_base64]
    )

    st.success("Response:")
    st.markdown(response['response'])
