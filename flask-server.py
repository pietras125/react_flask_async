from langchain.chat_models import ChatOpenAI
from langchain.schema.messages import HumanMessage, SystemMessage
from flask import Flask
from flask_socketio import SocketIO
from flask_cors import CORS


async def astream_log(messages):
    async for chunk in chat.astream(messages):
        print(chunk.content, end="", flush=True)
        socketio.emit("chat_message", {"content": chunk.content})


app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode="threading")
chat = ChatOpenAI()


@app.route("/")
def index():
    return "<h1> Strona główna </h1>"


@app.route("/ask")
async def ask():
    messages = [
        SystemMessage(
            content="Jesteś pomocnym asystentem. Tłumacz maksymalnie w 3 zdaniach."
        ),
        HumanMessage(content="Jak działa silnik spalinowy? "),
    ]
    await astream_log(messages)
    return "<p> Hejka </p>"


@app.route("/test")
def send():
    socketio.emit("chat_message", {"content": "Cześć react"})
    return "<p> Wysłałem dane do react </p>"


if __name__ == "__main__":
    app.run(debug=True)
