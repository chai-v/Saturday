                        
# Saturday

A multi modal chatbot powered by Gemini to consume notes with ease

A play on Tony Stark's Friday, Saturday allows users query their PDF notes and get custom responses with the help of embeddings. Users can also query their notes using images of question banks

## Architecture

![arch](https://github.com/user-attachments/assets/a0776d2d-e3a4-48e2-9dc8-583eb17e54d6)

- To start a new chat, PDFs must be uploaded. Each PDF is then procressed and a new embeddings index is created on Pinecone.

- All queries are answered with the power of Gemini 1.5

- When users send a query, the information relevent to the query is fetched from the PDF with Pinecone through cosine similarity search.

- Similarliy users can upload images of question banks from which questions are extracted using Tesseract. These questions are then answered using relevent info from embeddings.

- Chat history is stateful and stored in MongoDB to provide a chatGPT like experience with contextual questions and chat bot memory

## Note
Since free tier of Pinecone is used, only four documents can be uploaded at maximum. If a new chat creation has failed, this can be the reason.
 
## Built With

Saturday is built using the MERN stack

- [React](https://react.dev/)
- [Node](https://nodejs.org/en)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [LangChain](https://www.langchain.com/)
- [Pinecone](https://www.pinecone.io/)

 
## Authors

See also the list of
[contributors](https://github.com/chai-v/Saturday/graphs/contributors)
who participated in this project.

- **Chaitanya Sai Vengali** - _Frontend and LangChain_ - [chai-v](https://github.com/chai-v)
- **Abhiram G** - _Text Extraction_ - [AbhiramGarg](https://github.com/AbhiramGarg)
- **Hiranmayi M** - _Backend_ [Hiranmayi1212](https://github.com/Hiranmayi1212)

