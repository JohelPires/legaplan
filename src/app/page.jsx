'use client'
import { useState, useEffect } from 'react'
import { Modal, ModalConfirmarDelete } from './Modal'
import { IconCheck, IconTrash } from './Icons'
import './Home.scss'

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
                    <div className='tarefa' key={tarefa.id}>
                         <span
                              onClick={() => toggleTarefa(tarefa.id)}
                              className={`tarefa__text ${done ? 'tarefa__text--done' : ''}`}
                         >
                              <div className='tarefa__content'>
                                   <IconCheck checked={tarefa.done} /> <div>{tarefa.nome}</div>
                              </div>
                         </span>
                         <button
                              onClick={() => {
                                   setDeletarTarefa(tarefa.id)
                                   setVisibilityDel(true)
                              }}
                              className='tarefa__delete'
                         >
                              <IconTrash />
                         </button>
                    </div>
               ))
     }

     return (
          <main className='home'>
               {error && (
                    <div className='error-message' role='alert'>
                         <strong className='error-message__title'>Erro: </strong>
                         <span className='error-message__content'>{error}</span>
                    </div>
               )}
               <div className='task-container'>
                    <h1 className='task-container__title'>Suas tarefas de hoje</h1>
                    {renderTarefas(false)}

                    <h2 className='task-container__subtitle'>Tarefas finalizadas</h2>
                    {renderTarefas(true)}
               </div>
               <button className='add-task-button' type='button' onClick={() => setVisibility(true)}>
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
