import { useEffect, useState } from 'react'

import Login from './components/Login'
import './App.css'

function App() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 700);
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className={`w-screen !bg-gradient-to-b !from-blue-950 from-10% !to-gray-950 flex flex-col items-center`}>
      {/* Nav bar */}
      <div className="nav w-full h-14 flex items-center justify-between p-4 bg-black content-center frosted sticky top-0 bg-opacity-40 z-40">
        <h1 className="text-slate-300 font-sans font-bold">SATURDAY</h1>
        <a href="https://github.com/chai-v/Saturday">
        <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><path fill="white" d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"/></svg>
        </a>
      </div>

      <div className={`content w-screen h-screen  ${isMobile ? 'flex flex-col content-center overflow-scroll items-center justify-center p-6' : 'grid grid-cols-3'}`}>
        <>
        <div className="text-slate-300 m-auto md:col-span-2 font-sans font-bold flex flex-col  items-center">
          <div className="gap-6 text-center md:text-left">
            <h1 className="text-5xl">Unlock the power of <span className="text-blue-500">SATURDAY</span></h1>
            <br />
            <p className="text-slate-400">
              Multimodal Learning assistant powered by Gemini. Scroll for more information
            </p>
          </div>
        </div>
        <div className="md:col-span-1 flex items-center">
          <Login />
        </div>
        </>
      </div>
      <div className='bg-slate-100 w-4/5 rounded-md p-6 mb-6'>
          <h1 className='font-bold text-blue-950 text-2xl'>Saturday</h1>
          <p>A multi modal chatbot powered by Gemini to consume notes with ease</p>
          <p>A play on Tony Stark's Friday, Saturday allows users query their PDF notes and get custom responses with the help of embeddings. Users can also query their notes using images of question banks</p>
          <h1 className='font-bold text-blue-950 text-xl mt-4 mb-2'>Architecture</h1>
          <img className={`${isMobile ? 'w-full' : 'w-1/2'} mr-auto ml-auto mb-2 rounded-md`} src="/arch.png"></img>
          <p className='mb-2'>To start a new chat, PDFs must be uploaded. Each PDF is then procressed and a new embeddings index is created on Pinecone.</p>
          <p className='mb-2'>All queries are answered with the power of Gemini 1.5</p>
          <p className='mb-2'>When users send a query, the information relevent to the query is fetched from the PDF with Pinecone through cosine similarity search.</p>
          <p className='mb-2'>Similarliy users can upload images of question banks from which questions are extracted using Tesseract. These questions are then answered using relevent info from embeddings.</p>
          <p className='mb-2'>Chat history is stateful and stored in MongoDB to provide a chatGPT like experience with contextual questions and chat bot memory</p>
          <h1 className='font-bold text-blue-950 text-xl mt-4 mb-2'>Note</h1>
          <p className='mb-2'>Since free tier of Pinecone is used, only four documents can be uploaded at maximum. If a new chat creation has failed, this can be the reason.</p>
      </div>
    </div>
  )
}

export default App
