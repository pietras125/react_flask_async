from langchain.chat_models import ChatOpenAI
from langchain.schema.messages import HumanMessage, SystemMessage
from flask import Flask
from flask_socketio import SocketIO


async def astream_log(messages):
    async for chunk in chat.astream(messages):
        # socketio.emit("chat_message", {"content": chunk.content})
        print(chunk.content, end="", flush=True)


app = Flask(__name__)
chat = ChatOpenAI()


@app.route("/")
async def index():
    messages = [
        SystemMessage(
            content="Jesteś pomocnym asystentem, który wszystko dokładnie tłumaczy."
        ),
        HumanMessage(content="Jak działa silnik spalinowy?"),
    ]
    await astream_log(messages)
    return "<p> Hejka</p>"


if __name__ == "__main__":
    app.run(debug=True)
