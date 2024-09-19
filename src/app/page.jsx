'use client'
import { useState, useEffect } from 'react'
import { Modal, ModalConfirmarDelete } from './Modal'
import { IconCheck, IconTrash } from './Icons'

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
               console.error('Erro:', err)
               setError('Erro ao carregar tarefas. Por favor, tente novamente.')
          }
     }

     const saveTarefas = (updatedTarefas) => {
          try {
               localStorage.setItem('tarefas', JSON.stringify(updatedTarefas))
               setTarefas(updatedTarefas)
          } catch (err) {
               console.error('Erro:', err)
               setError('Erro ao salvar tarefas. Por favor, tente novamente.')
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
                         className='mx-auto max-w-md rounded-lg border-dashed border-2 border-zinc-200 p-4 my-4 hover:bg-[#F7F9FD] hover:border-[#F7F9FD] flex justify-between items-center'
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
                    className='mx-auto h-12 block w-full max-w-md mt-5 rounded-lg border-0 font-medium bg-gradient-to-r from-[#0796D3] to-[#53C0F0] py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-white'
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
