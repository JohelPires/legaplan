'use client'

import { useState } from 'react'

export function Modal({ visibility, setVisibility, setTarefas, saveTarefas, setError }) {
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
               console.error('Erro:', err)
               setError('Erro ao adicionar tarefa. Por favor, tente novamente.')
          }
     }

     return (
          <div
               className={`fixed bg-white bg-opacity-50 inset-0 z-10 ${visibility ? 'block' : 'hidden'}`}
               style={{
                    backdropFilter: visibility ? 'blur(3px)' : 'none',
               }}
          >
               <div className='bg-white mt-52 shadow-2xl mx-auto max-w-md rounded-2xl border-zinc-300 p-9'>
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

export function ModalConfirmarDelete({ visibility, setVisibility, deleteTarefa, tarefaId }) {
     const confirmarDelete = () => {
          deleteTarefa(tarefaId)
          setVisibility(false)
     }

     return (
          <div
               className={`fixed bg-white bg-opacity-50 inset-0 z-10 ${visibility ? 'block' : 'hidden'}`}
               style={{
                    backdropFilter: visibility ? 'blur(3px)' : 'none',
               }}
          >
               <div className='bg-white mt-52 shadow-2xl mx-auto max-w-md rounded-2xl border-zinc-300 p-9'>
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
