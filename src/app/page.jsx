'use client'
import { useState, useEffect } from 'react'

export default function Home() {
     const [tarefas, setTarefas] = useState([])
     const [visibility, setVisibility] = useState(false)
     const [visibilityDel, setVisibilityDel] = useState(false)
     const [deletarTarefa, setDeletarTarefa] = useState(null)
     const [error, setError] = useState(null)

     useEffect(() => {
          loadTarefas()
     }, [])

     const loadTarefas = () => {
          try {
               const storageTarefas = localStorage.getItem('tarefas')
               if (storageTarefas) {
                    setTarefas(JSON.parse(storageTarefas))
               }
          } catch (err) {
               console.error('Error loading tasks:', err)
               setError('Failed to load tasks. Please try refreshing the page.')
          }
     }

     const saveTarefas = (updatedTarefas) => {
          try {
               localStorage.setItem('tarefas', JSON.stringify(updatedTarefas))
               setTarefas(updatedTarefas)
          } catch (err) {
               console.error('Error saving tasks:', err)
               setError('Failed to save tasks. Please try again.')
          }
     }

     const toggleTarefa = (id) => {
          const updatedTarefas = tarefas.map((tarefa) =>
               tarefa.id === id ? { ...tarefa, done: !tarefa.done } : tarefa
          )
          saveTarefas(updatedTarefas)
     }

     const deleteTarefa = (id) => {
          const updatedTarefas = tarefas.filter((tarefa) => tarefa.id !== id)
          saveTarefas(updatedTarefas)
     }

     const renderTarefas = (done) => {
          return tarefas
               .filter((tarefa) => tarefa.done === done)
               .map((tarefa) => (
                    <div
                         className='mx-auto max-w-md rounded-lg border-dashed border-2 border-zinc-200 p-4 my-4 hover:bg-zinc-100 hover:border-zinc-100 flex justify-between items-center'
                         key={tarefa.id}
                    >
                         <span
                              onClick={() => toggleTarefa(tarefa.id)}
                              className={`cursor-pointer text-xl flex-grow ${done ? 'line-through text-zinc-500' : ''}`}
                         >
                              <div className='flex items-center gap-2'>
                                   <IconCheck checked={tarefa.done} /> {tarefa.nome}
                              </div>
                         </span>
                         <button
                              onClick={() => {
                                   setDeletarTarefa(tarefa.id)
                                   setVisibilityDel(true)
                              }}
                              className=''
                         >
                              <IconTrash />
                         </button>
                    </div>
               ))
     }

     return (
          <main>
               {error && (
                    <div
                         className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative'
                         role='alert'
                    >
                         <strong className='font-bold'>Error: </strong>
                         <span className='block sm:inline'>{error}</span>
                    </div>
               )}
               <div className='mx-auto max-w-md rounded-lg border-2 border-zinc-300 p-4'>
                    <h1 className='text-center text-xl my-4 text-zinc-500'>Suas tarefas de hoje</h1>
                    {renderTarefas(false)}

                    <h2 className='text-center text-xl my-4 text-zinc-500'>Tarefas finalizadas</h2>
                    {renderTarefas(true)}
               </div>
               <button
                    className='mx-auto block w-full max-w-md mt-5 rounded-lg border-0 font-medium bg-gradient-to-r from-[#0796D3] to-[#53C0F0] py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-white'
                    type='button'
                    onClick={() => setVisibility(true)}
               >
                    Adicionar nova tarefa
               </button>

               <Modal
                    visibility={visibility}
                    setVisibility={setVisibility}
                    setTarefas={setTarefas}
                    saveTarefas={saveTarefas}
                    setError={setError}
               />

               <ModalConfirmarDelete
                    visibility={visibilityDel}
                    setVisibility={setVisibilityDel}
                    deleteTarefa={deleteTarefa}
                    tarefaId={deletarTarefa}
               />
          </main>
     )
}

function Modal({ visibility, setVisibility, setTarefas, saveTarefas, setError }) {
     const [novaTarefa, setNovaTarefa] = useState('')

     const adicionarTarefa = () => {
          try {
               const storageTarefas = JSON.parse(localStorage.getItem('tarefas')) || []
               const newTask = { id: Date.now(), nome: novaTarefa, done: false }
               const novasTarefas = [...storageTarefas, newTask]
               saveTarefas(novasTarefas)
               setVisibility(false)
               setNovaTarefa('')
          } catch (err) {
               console.error('Error adding task:', err)
               setError('Failed to add task. Please try again.')
          }
     }

     return (
          <div
               className={`fixed inset-0 z-10 ${visibility ? 'block' : 'hidden'}`}
               style={{
                    backdropFilter: visibility ? 'blur(3px)' : 'none',
               }}
          >
               <div className='bg-white mt-36 shadow-2xl mx-auto max-w-md rounded-xl border-zinc-300 p-4'>
                    <h2 className='text-left font-bold text-2xl my-4 text-zinc-700'>Nova tarefa</h2>
                    Título
                    <input
                         type='text'
                         className='mt-2 block w-full px-4 py-2 text-zinc-900 border-zinc-200 rounded-md border'
                         placeholder='Digite o nome da tarefa'
                         name='tarefa'
                         required
                         value={novaTarefa}
                         onChange={(event) => setNovaTarefa(event.target.value)}
                    />
                    <div className='flex gap-3'>
                         <button
                              className='mx-auto block w-full max-w-md mt-5 rounded-lg border-0 bg-[#E7EEFB]'
                              type='button'
                              onClick={() => setVisibility(false)}
                         >
                              Cancelar
                         </button>
                         <button
                              className='mx-auto block w-full max-w-md mt-5 rounded-lg border-0 bg-gradient-to-r from-[#0796D3] to-[#53C0F0] py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-white'
                              type='button'
                              onClick={adicionarTarefa}
                         >
                              Adicionar
                         </button>
                    </div>
               </div>
          </div>
     )
}

function ModalConfirmarDelete({ visibility, setVisibility, deleteTarefa, tarefaId }) {
     const confirmarDelete = () => {
          deleteTarefa(tarefaId)
          setVisibility(false)
     }

     return (
          <div
               className={`fixed inset-0 z-10 ${visibility ? 'block' : 'hidden'}`}
               style={{
                    backdropFilter: visibility ? 'blur(3px)' : 'none',
               }}
          >
               <div className='bg-white mt-36 shadow-2xl mx-auto max-w-md rounded-xl border-zinc-300 p-4'>
                    <h2 className='text-left font-bold text-2xl my-4 text-zinc-700'>Deletar tarefa</h2>
                    <p>Tem certeza que deseja excluir esta tarefa?</p>
                    <div className='flex gap-3'>
                         <button
                              className='mx-auto block w-full max-w-md mt-5 rounded-lg border-0 bg-[#E7EEFB]'
                              type='button'
                              onClick={() => setVisibility(false)}
                         >
                              Cancelar
                         </button>
                         <button
                              className='mx-auto block w-full max-w-md mt-5 rounded-lg border-0 bg-gradient-to-r from-[#D30707] to-[#F05353] py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-white'
                              type='button'
                              onClick={confirmarDelete}
                         >
                              Confirmar
                         </button>
                    </div>
               </div>
          </div>
     )
}

function IconTrash() {
     return (
          <svg width='20' height='22' viewBox='0 0 20 22' fill='none' xmlns='http://www.w3.org/2000/svg'>
               <path
                    d='M1 5H3M3 5H19M3 5V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H15C15.5304 21 16.0391 20.7893 16.4142 20.4142C16.7893 20.0391 17 19.5304 17 19V5H3ZM6 5V3C6 2.46957 6.21071 1.96086 6.58579 1.58579C6.96086 1.21071 7.46957 1 8 1H12C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V5'
                    stroke='#B0BBD1'
                    stroke-width='1.33333'
                    stroke-linecap='round'
                    stroke-linejoin='round'
               />
          </svg>
     )
}

function IconCheck({ checked }) {
     if (checked)
          return (
               <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                    <rect x='0.5' y='0.5' width='23' height='23' rx='3.5' fill='#A0DCF6' />
                    <rect x='0.5' y='0.5' width='23' height='23' rx='3.5' stroke='#0796D3' />
                    <path
                         d='M18 7.5L9.75 15.75L6 12'
                         stroke='#0796D3'
                         stroke-width='1.5'
                         stroke-linecap='round'
                         stroke-linejoin='round'
                    />
               </svg>
          )
     return (
          <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
               <rect x='0.5' y='0.5' width='23' height='23' rx='3.5' fill='white' />
               <rect x='0.5' y='0.5' width='23' height='23' rx='3.5' stroke='#D7DDE9' />
          </svg>
     )
}
